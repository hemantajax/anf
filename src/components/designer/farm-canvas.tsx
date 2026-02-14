"use client";

import React, { useRef, useCallback, useEffect, useMemo } from "react";
import { Stage, Layer, Rect } from "react-konva";
import type Konva from "konva";
import { useTheme } from "next-themes";
import { useDesignerStore } from "@/stores/designer-store";
import { useFarmStore } from "@/stores/farm-store";
import { OrchardLayer } from "./orchard-layer";
import { FarmElementRenderer } from "./farm-element-renderer";
import { DrawPreview } from "./draw-preview";
import {
  PX_PER_FT,
  snapToGrid,
  createFarmElement,
  createRoadConfig,
  createTrenchConfig,
  createFlowerBedConfig,
} from "@/lib/designer-utils";
import { getCanvasColors } from "@/lib/orchard-utils";

interface FarmCanvasProps {
  containerWidth: number;
  containerHeight: number;
}

export function FarmCanvas({ containerWidth, containerHeight }: FarmCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);

  // Designer store — split into viewport vs non-viewport to minimize re-renders
  const viewport = useDesignerStore((s) => s.viewport);
  const setViewport = useDesignerStore((s) => s.setViewport);
  const activeTool = useDesignerStore((s) => s.activeTool);
  const showGrid = useDesignerStore((s) => s.showGrid);
  const gridDisplaySize = useDesignerStore((s) => s.gridDisplaySize);
  const layerVisibility = useDesignerStore((s) => s.layerVisibility);
  const symbolVisibility = useDesignerStore((s) => s.symbolVisibility);
  const snap = useDesignerStore((s) => s.snap);
  const setSelectedElementId = useDesignerStore((s) => s.setSelectedElementId);
  const isDrawing = useDesignerStore((s) => s.isDrawing);
  const setIsDrawing = useDesignerStore((s) => s.setIsDrawing);
  const drawStart = useDesignerStore((s) => s.drawStart);
  const setDrawStart = useDesignerStore((s) => s.setDrawStart);
  const setDrawPreview = useDesignerStore((s) => s.setDrawPreview);

  // Farm store
  const elements = useFarmStore((s) => s.elements);
  const addElement = useFarmStore((s) => s.addElement);
  const canvasWidthFt = useFarmStore((s) => s.canvasWidthFt);
  const canvasHeightFt = useFarmStore((s) => s.canvasHeightFt);
  const orchardLayout = useFarmStore((s) => s.orchardLayout);

  const canvasWidthPx = canvasWidthFt * PX_PER_FT;
  const canvasHeightPx = canvasHeightFt * PX_PER_FT;

  // Resolve canvas color palette from next-themes
  const { resolvedTheme } = useTheme();
  const colors = useMemo(
    () => getCanvasColors(resolvedTheme === "light" ? "light" : "dark"),
    [resolvedTheme]
  );

  // Keep a ref to viewport so handleWheel doesn't need viewport in its deps
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  // RAF throttle ref for wheel events
  const wheelRafRef = useRef<number | null>(null);

  const isDrawTool =
    activeTool === "road" ||
    activeTool === "trench" ||
    activeTool === "flower-bed";

  // ---- Pointer position in farm coords (ft) ----
  const getPointerFarmCoords = useCallback((): { x: number; y: number } | null => {
    const stage = stageRef.current;
    if (!stage) return null;
    const pointer = stage.getPointerPosition();
    if (!pointer) return null;
    const transform = stage.getAbsoluteTransform().copy().invert();
    const pos = transform.point(pointer);
    let x = pos.x / PX_PER_FT;
    let y = pos.y / PX_PER_FT;
    if (snap.enabled) {
      x = snapToGrid(x, snap.gridSizeFt);
      y = snapToGrid(y, snap.gridSizeFt);
    }
    return { x, y };
  }, [snap]);

  // ---- Zoom with scroll wheel (RAF-throttled, decoupled from viewport state) ----
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();

      // Skip if a RAF is already pending (throttle to ~60fps)
      if (wheelRafRef.current !== null) return;

      wheelRafRef.current = requestAnimationFrame(() => {
        wheelRafRef.current = null;
        const stage = stageRef.current;
        if (!stage) return;

        const vp = viewportRef.current; // read from ref, not state
        const oldScale = vp.scale;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const scaleBy = 1.08;
        const direction = e.evt.deltaY > 0 ? -1 : 1;
        const newScale =
          direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const clampedScale = Math.min(Math.max(newScale, 0.1), 30);

        const mousePointTo = {
          x: (pointer.x - vp.x) / oldScale,
          y: (pointer.y - vp.y) / oldScale,
        };

        setViewport({
          scale: clampedScale,
          x: pointer.x - mousePointTo.x * clampedScale,
          y: pointer.y - mousePointTo.y * clampedScale,
        });
      });
    },
    [setViewport] // no longer depends on viewport — reads from ref
  );

  // ---- Mouse down: start drawing ----
  const handleMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // Deselect if clicking on empty space with select tool
      if (activeTool === "select") {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
          setSelectedElementId(null);
        }
        return;
      }

      if (!isDrawTool) return;

      const pos = getPointerFarmCoords();
      if (!pos) return;

      setIsDrawing(true);
      setDrawStart(pos);
      setDrawPreview({ x: pos.x, y: pos.y, width: 0, height: 0 });
    },
    [activeTool, isDrawTool, getPointerFarmCoords, setIsDrawing, setDrawStart, setDrawPreview, setSelectedElementId]
  );

  // ---- Mouse move: update preview ----
  const handleMouseMove = useCallback(() => {
    if (!isDrawing || !drawStart || !isDrawTool) return;
    const pos = getPointerFarmCoords();
    if (!pos) return;

    const x = Math.min(drawStart.x, pos.x);
    const y = Math.min(drawStart.y, pos.y);
    const width = Math.abs(pos.x - drawStart.x);
    const height = Math.abs(pos.y - drawStart.y);
    setDrawPreview({ x, y, width, height });
  }, [isDrawing, drawStart, isDrawTool, getPointerFarmCoords, setDrawPreview]);

  // ---- Mouse up: finalize element ----
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !drawStart || !isDrawTool) return;
    const pos = getPointerFarmCoords();
    if (!pos) return;

    let x = Math.min(drawStart.x, pos.x);
    let y = Math.min(drawStart.y, pos.y);
    let width = Math.abs(pos.x - drawStart.x);
    let height = Math.abs(pos.y - drawStart.y);

    // Minimum size = 3ft
    if (width < 3 && height < 3) {
      setIsDrawing(false);
      setDrawStart(null);
      setDrawPreview(null);
      return;
    }

    // Enforce minimum dimension based on tool
    if (activeTool === "road") {
      if (height < 6) height = 15;
      const config = createRoadConfig({ widthFt: height });
      addElement(createFarmElement("road", x, y, width, height, config));
    } else if (activeTool === "trench") {
      if (height < 3) height = 3;
      const config = createTrenchConfig({ widthFt: height });
      addElement(createFarmElement("trench", x, y, width, height, config));
    } else if (activeTool === "flower-bed") {
      if (height < 3) height = 3;
      const config = createFlowerBedConfig({ widthFt: height });
      addElement(
        createFarmElement("flower-bed", x, y, width, height, config)
      );
    }

    setIsDrawing(false);
    setDrawStart(null);
    setDrawPreview(null);
  }, [
    isDrawing,
    drawStart,
    isDrawTool,
    activeTool,
    getPointerFarmCoords,
    addElement,
    setIsDrawing,
    setDrawStart,
    setDrawPreview,
  ]);

  // ---- Keyboard shortcuts ----
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const { setActiveTool } = useDesignerStore.getState();
      const { undo, redo } = useFarmStore.getState();

      switch (e.key.toLowerCase()) {
        case "v":
          setActiveTool("select");
          break;
        case "r":
          setActiveTool("road");
          break;
        case "t":
          setActiveTool("trench");
          break;
        case "f":
          setActiveTool("flower-bed");
          break;
        case "e":
          setActiveTool("eraser");
          break;
        case "g":
          useDesignerStore.getState().toggleGrid();
          break;
        case "delete":
        case "backspace": {
          const selId = useDesignerStore.getState().selectedElementId;
          if (selId) {
            useFarmStore.getState().removeElement(selId);
            useDesignerStore.getState().setSelectedElementId(null);
          }
          break;
        }
        case "z":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ---- Filter visible elements by layer (memoized) ----
  const visibleElements = useMemo(
    () => elements.filter((el) => el.visible && layerVisibility[el.layer]),
    [elements, layerVisibility]
  );

  // Determine cursor based on tool
  let cursor = "default";
  if (activeTool === "select") cursor = "default";
  else if (activeTool === "eraser") cursor = "not-allowed";
  else if (isDrawTool) cursor = "crosshair";

  return (
    <Stage
      ref={stageRef}
      width={containerWidth}
      height={containerHeight}
      scaleX={viewport.scale}
      scaleY={viewport.scale}
      x={viewport.x}
      y={viewport.y}
      draggable={activeTool === "select"}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragEnd={(e) => {
        if (e.target === stageRef.current) {
          setViewport({
            ...viewportRef.current,
            x: e.target.x(),
            y: e.target.y(),
          });
        }
      }}
      style={{ cursor, background: colors.stageBg }}
    >
      {/* Background */}
      <Layer listening={false}>
        <Rect
          x={0}
          y={0}
          width={canvasWidthPx}
          height={canvasHeightPx}
          fill={colors.canvasFill}
          cornerRadius={2}
          perfectDrawEnabled={false}
        />
      </Layer>

      {/* Orchard layout (boundary, beds, paths, bed grid) */}
      <Layer listening={false}>
        <OrchardLayer
          layout={orchardLayout}
          showBoundary={layerVisibility.boundary}
          showBeds={layerVisibility.beds}
          showGrid={showGrid && layerVisibility.grid}
          symbolVisibility={symbolVisibility}
          colors={colors}
        />
      </Layer>

      {/* Farm elements */}
      <Layer>
        {visibleElements.map((el) => (
          <FarmElementRenderer key={el.id} element={el} />
        ))}
        <DrawPreview />
      </Layer>
    </Stage>
  );
}
