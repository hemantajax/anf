"use client";

import React, { useCallback } from "react";
import { Rect, Text, Group } from "react-konva";
import type { FarmElement } from "@/types/farm";
import { PX_PER_FT, getElementColor, getElementLabel } from "@/lib/designer-utils";
import { useDesignerStore } from "@/stores/designer-store";
import { useFarmStore } from "@/stores/farm-store";
import { snapToGrid } from "@/lib/designer-utils";

interface FarmElementRendererProps {
  element: FarmElement;
}

export const FarmElementRenderer = React.memo(function FarmElementRenderer({
  element,
}: FarmElementRendererProps) {
  const selectedId = useDesignerStore((s) => s.selectedElementId);
  const setSelectedId = useDesignerStore((s) => s.setSelectedElementId);
  const activeTool = useDesignerStore((s) => s.activeTool);
  const snap = useDesignerStore((s) => s.snap);
  const updateElement = useFarmStore((s) => s.updateElement);

  const isSelected = selectedId === element.id;
  const color = getElementColor(element);
  const label = getElementLabel(element);

  const x = element.x * PX_PER_FT;
  const y = element.y * PX_PER_FT;
  const width = element.width * PX_PER_FT;
  const height = element.height * PX_PER_FT;

  const handleClick = useCallback(() => {
    if (activeTool === "select") {
      setSelectedId(isSelected ? null : element.id);
    } else if (activeTool === "eraser") {
      useFarmStore.getState().removeElement(element.id);
    }
  }, [activeTool, element.id, isSelected, setSelectedId]);

  const handleDragEnd = useCallback(
    (e: { target: { x: () => number; y: () => number } }) => {
      if (activeTool !== "select" || element.locked) return;
      let newX = e.target.x() / PX_PER_FT;
      let newY = e.target.y() / PX_PER_FT;
      if (snap.enabled) {
        newX = snapToGrid(newX, snap.gridSizeFt);
        newY = snapToGrid(newY, snap.gridSizeFt);
      }
      updateElement(element.id, { x: newX, y: newY });
    },
    [activeTool, element.id, element.locked, snap, updateElement]
  );

  // Pattern fills per type
  let fillColor = color;
  let strokeColor = isSelected ? "#facc15" : "#1e293b";
  let strokeWidth = isSelected ? 2 : 1;
  let dashArray: number[] | undefined;
  let opacity = 0.85;

  if (element.type === "trench") {
    dashArray = [8, 4];
    opacity = 0.65;
  } else if (element.type === "flower-bed") {
    opacity = 0.55;
  }

  const showLabel = width > 30 && height > 15;

  return (
    <Group>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        dash={dashArray}
        opacity={opacity}
        cornerRadius={2}
        draggable={activeTool === "select" && !element.locked}
        onClick={handleClick}
        onTap={handleClick}
        onDragEnd={handleDragEnd}
        rotation={element.rotation}
      />
      {isSelected && (
        <Rect
          x={x - 2}
          y={y - 2}
          width={width + 4}
          height={height + 4}
          stroke="#facc15"
          strokeWidth={2}
          dash={[6, 3]}
          listening={false}
          fill="transparent"
        />
      )}
      {showLabel && (
        <Text
          x={x + 4}
          y={y + 4}
          text={label}
          fontSize={11}
          fill="#fff"
          listening={false}
          shadowColor="#000"
          shadowBlur={2}
          shadowOpacity={0.6}
        />
      )}
    </Group>
  );
});
