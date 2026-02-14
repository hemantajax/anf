"use client";

import React, { useMemo, useCallback } from "react";
import { Rect, Circle, Line, Text, Group, RegularPolygon, Shape } from "react-konva";
import { PX_PER_FT } from "@/lib/designer-utils";
import {
  BED_FILLS,
  BED_BORDER_COLOR,
  BED_ACCENT_COLOR,
  GRID_LINE_COLOR,
  GRID_DOT_COLOR,
  BOUNDARY_FILL,
  BOUNDARY_STROKE,
  BOUNDARY_HATCH_COLOR,
  PATH_FILL,
  PATH_STROKE,
  MODULE_DIM_COLOR,
  PLANT_SYMBOLS,
  getCenterColumnTrees,
  getIntermediatePlacements,
  getBed13GroundCoverPlacements,
  getBed2EdgePlacements,
  getBed2IntermediatePlacements,
  getBed2InteriorPlacements,
  getBed4Placements,
} from "@/lib/orchard-utils";
import type { PlantSymbolDef } from "@/lib/orchard-utils";
import type { OrchardLayout, BedPosition, PathPosition } from "@/types/farm";

interface OrchardLayerProps {
  layout: OrchardLayout;
  showBoundary: boolean;
  showBeds: boolean;
  showGrid: boolean;
  symbolVisibility: Record<string, boolean>;
}

// ================================================================
// BOUNDARY — live fence with diagonal hatching (like the reference)
// ================================================================
function BoundaryRenderer({
  widthFt,
  heightFt,
  boundaryWidthFt,
}: {
  widthFt: number;
  heightFt: number;
  boundaryWidthFt: number;
}) {
  const w = widthFt * PX_PER_FT;
  const h = heightFt * PX_PER_FT;
  const bw = boundaryWidthFt * PX_PER_FT;

  // Draw ALL hatch + accent lines in a single canvas draw call (was 400+ <Line> components)
  const drawBoundary = useCallback(
    (ctx: any, shape: any) => {
      const step = 8; // px between hatch lines (was 5 — less dense = faster)

      // Helper: diagonal hatch inside a rectangle
      const hatchRect = (rx: number, ry: number, rw: number, rh: number) => {
        const maxD = rw + rh;
        for (let d = 0; d < maxD; d += step) {
          ctx.moveTo(rx + Math.max(0, d - rh), ry + Math.min(rh, d));
          ctx.lineTo(rx + Math.min(rw, d), ry + Math.max(0, d - rw));
        }
      };

      // Hatch lines
      ctx.beginPath();
      hatchRect(0, 0, w, bw);         // top
      hatchRect(0, h - bw, w, bw);    // bottom
      hatchRect(0, bw, bw, h - 2 * bw); // left
      hatchRect(w - bw, bw, bw, h - 2 * bw); // right
      ctx.strokeStyle = BOUNDARY_HATCH_COLOR;
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.5;
      ctx.stroke();

      // Accent lines (left + right strips)
      const accentStep = 6;
      ctx.beginPath();
      for (let ay = bw; ay < h - bw; ay += accentStep) {
        ctx.moveTo(0, ay);
        ctx.lineTo(bw, ay);
        ctx.moveTo(w - bw, ay);
        ctx.lineTo(w, ay);
      }
      ctx.strokeStyle = BED_ACCENT_COLOR;
      ctx.lineWidth = 0.4;
      ctx.globalAlpha = 0.4;
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.fillStrokeShape(shape);
    },
    [w, h, bw]
  );

  return (
    <Group listening={false}>
      {/* Four boundary fill strips */}
      <Rect x={0} y={0} width={w} height={bw} fill={BOUNDARY_FILL} opacity={0.8} listening={false} perfectDrawEnabled={false} />
      <Rect x={0} y={h - bw} width={w} height={bw} fill={BOUNDARY_FILL} opacity={0.8} listening={false} perfectDrawEnabled={false} />
      <Rect x={0} y={bw} width={bw} height={h - 2 * bw} fill={BOUNDARY_FILL} opacity={0.8} listening={false} perfectDrawEnabled={false} />
      <Rect x={w - bw} y={bw} width={bw} height={h - 2 * bw} fill={BOUNDARY_FILL} opacity={0.8} listening={false} perfectDrawEnabled={false} />

      {/* Hatch + accent — single canvas draw call */}
      <Shape sceneFunc={drawBoundary} listening={false} perfectDrawEnabled={false} />

      {/* Outer border */}
      <Rect
        x={0} y={0} width={w} height={h}
        stroke={BOUNDARY_STROKE} strokeWidth={2}
        fill="transparent" listening={false} perfectDrawEnabled={false}
      />

      {/* Inner border */}
      <Rect
        x={bw} y={bw}
        width={w - 2 * bw} height={h - 2 * bw}
        stroke={BOUNDARY_STROKE} strokeWidth={1}
        fill="transparent" opacity={0.6} listening={false} perfectDrawEnabled={false}
      />

      {/* Label */}
      <Text
        x={w / 2 - 30}
        y={bw * 0.2}
        text="Live Fence"
        fontSize={Math.max(7, bw * 0.5)}
        fill={BOUNDARY_STROKE}
        fontStyle="bold"
        listening={false}
      />
    </Group>
  );
}

// ================================================================
// PLANT SYMBOL — renders a single tree/plant symbol on the canvas
// Memoized to prevent re-renders when parent re-renders with same props
// ================================================================
const PlantSymbolRenderer = React.memo(function PlantSymbolRenderer({
  x,
  y,
  symbol,
  showLabel,
}: {
  x: number;
  y: number;
  symbol: PlantSymbolDef;
  showLabel?: boolean;
}) {
  const { shape, radius, fill, stroke, strokeWidth, shortLabel } = symbol;
  const r = radius;

  return (
    <Group x={x} y={y} listening={false}>
      {/* Shape */}
      {shape === "circle" && (
        <>
          <Circle
            radius={r}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={0.9}
            perfectDrawEnabled={false}
          />
          {/* Inner dot for Big trees */}
          <Circle radius={1.2} fill="#fff" opacity={0.8} perfectDrawEnabled={false} />
        </>
      )}

      {shape === "square" && (
        <Rect
          x={-r}
          y={-r}
          width={r * 2}
          height={r * 2}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={0.9}
          perfectDrawEnabled={false}
        />
      )}

      {shape === "star" && (
        <RegularPolygon
          sides={6}
          radius={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={0.9}
          perfectDrawEnabled={false}
        />
      )}

      {shape === "triangle" && (
        <RegularPolygon
          sides={3}
          radius={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={0.9}
          perfectDrawEnabled={false}
        />
      )}

      {shape === "diamond" && (
        <RegularPolygon
          sides={4}
          radius={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          rotation={45}
          opacity={0.9}
          perfectDrawEnabled={false}
        />
      )}

      {shape === "dot" && (
        <Circle
          radius={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={0.9}
          perfectDrawEnabled={false}
        />
      )}

      {shape === "dash" && (
        <Line
          points={[-r, 0, r, 0]}
          stroke={stroke}
          strokeWidth={strokeWidth + 0.5}
          opacity={0.9}
          perfectDrawEnabled={false}
        />
      )}

      {/* Short label next to symbol */}
      {showLabel && (
        <Text
          x={r + 2}
          y={-4}
          text={shortLabel}
          fontSize={6}
          fill={stroke}
          fontStyle="bold"
          opacity={0.8}
          listening={false}
        />
      )}
    </Group>
  );
});

// ================================================================
// BED TREE PLACEMENTS — per bed-type pattern
//   Bed 1 & 3: center B/M/S @6ft + pigeon pea @3ft
//   Bed 2:     edge BA/PA alternating @6ft + pigeon pea @3ft edges
//   Bed 4:     vine vegetable ★ @3ft on ALL lines + pavilion poles ⌂
// ================================================================
const BedTreePlacements = React.memo(function BedTreePlacements({
  bed,
  symbolVisibility,
  bedTypeCycle,
  treeSpacingFt,
}: {
  bed: BedPosition;
  symbolVisibility: Record<string, boolean>;
  bedTypeCycle: number[];
  treeSpacingFt: number;
}) {
  const bedType = bedTypeCycle[bed.index % bedTypeCycle.length];
  const ts = treeSpacingFt; // shorthand: 6 for 24×24, 9 for 36×36

  // ── Bed 2: Banana & Papaya on edges ──
  const edgePlacements = useMemo(() => {
    if (bedType === 2) {
      return getBed2EdgePlacements(bed.width, bed.height, 1.5, ts);
    }
    return [];
  }, [bed.width, bed.height, bedType, ts]);

  // ── Bed 1 & 3: center column B/M/S ──
  const centerTrees = useMemo(() => {
    if (bedType === 1 || bedType === 3) {
      return getCenterColumnTrees(bed.width, bed.height, ts);
    }
    return [];
  }, [bed.width, bed.height, bedType, ts]);

  // ── Bed 1 & 3: pigeon pea midpoints (center column) ──
  const intermediates = useMemo(() => {
    if (bedType === 1 || bedType === 3) {
      return getIntermediatePlacements(bed.width, bed.height, ts);
    }
    return [];
  }, [bed.width, bed.height, bedType, ts]);

  // ── Bed 1 & 3: ground-cover crops on non-center lines ──
  const groundCover = useMemo(() => {
    if (bedType === 1 || bedType === 3) {
      return getBed13GroundCoverPlacements(bed.width, bed.height, 1.5, ts);
    }
    return [];
  }, [bed.width, bed.height, bedType, ts]);

  // ── Bed 2: pigeon pea midpoints on BOTH edge columns ──
  const bed2Intermediates = useMemo(() => {
    if (bedType === 2) {
      return getBed2IntermediatePlacements(bed.width, bed.height, 1.5, ts);
    }
    return [];
  }, [bed.width, bed.height, bedType, ts]);

  // ── Bed 2: interior crops (Turmeric, Ginger, Groundnut, Millets) ──
  const bed2Interior = useMemo(() => {
    if (bedType === 2) {
      return getBed2InteriorPlacements(bed.width, bed.height, 1.5, ts);
    }
    return [];
  }, [bed.width, bed.height, bedType, ts]);

  // ── Bed 4: vine veg ★ + pavilion poles ⌂ ──
  const bed4Placements = useMemo(() => {
    if (bedType === 4) {
      return getBed4Placements(bed.width, bed.height);
    }
    return [];
  }, [bed.width, bed.height, bedType]);

  /** Render a list of placements, skipping symbols toggled off */
  const renderPlacements = (
    list: { symbolId: string; yOffsetFt: number; xOffsetFt: number }[],
    prefix: string,
    showLabel = false
  ) =>
    list.map((t, i) => {
      // Skip if this symbol type is toggled off
      if (symbolVisibility[t.symbolId] === false) return null;
      const sym = PLANT_SYMBOLS[t.symbolId];
      if (!sym) return null;
      const px = (bed.x + t.xOffsetFt) * PX_PER_FT;
      const py = (bed.y + t.yOffsetFt) * PX_PER_FT;
      return (
        <PlantSymbolRenderer
          key={`${prefix}-${bed.index}-${i}`}
          x={px}
          y={py}
          symbol={sym}
          showLabel={showLabel}
        />
      );
    });

  return (
    <Group listening={false}>
      {/* Center B/M/S (Bed 1 & 3 only) */}
      {renderPlacements(centerTrees, "ct", true)}

      {/* Intermediate pigeon pea (Bed 1 & 3) */}
      {renderPlacements(intermediates, "im")}

      {/* Ground-cover crops (Bed 1 & 3) */}
      {renderPlacements(groundCover, "gc")}

      {/* Edge BA/PA (Bed 2) */}
      {renderPlacements(edgePlacements, "ep", true)}

      {/* Pigeon Pea @3ft on Bed 2 edges */}
      {renderPlacements(bed2Intermediates, "b2im")}

      {/* Interior crops Bed 2 (Sugarcane, Turmeric, Ginger) */}
      {renderPlacements(bed2Interior, "b2in")}

      {/* Vine veg ★ + Pavilion poles ⌂ (Bed 4) */}
      {renderPlacements(bed4Placements, "b4")}
    </Group>
  );
});

// ================================================================
// BED — 9ft wide bed with 1.5ft grid, pink border, green lines, blue dots
// ================================================================
const BedRenderer = React.memo(function BedRenderer({
  bed,
  gridSpacing,
  showGrid,
  symbolVisibility,
  baseBedLengthFt,
  bedTypeCycle,
  treeSpacingFt,
}: {
  bed: BedPosition;
  gridSpacing: number;
  showGrid: boolean;
  symbolVisibility: Record<string, boolean>;
  baseBedLengthFt: number;
  bedTypeCycle: number[];
  treeSpacingFt: number;
}) {
  const x = bed.x * PX_PER_FT;
  const y = bed.y * PX_PER_FT;
  const w = bed.width * PX_PER_FT;
  const h = bed.height * PX_PER_FT;
  const stepPx = gridSpacing * PX_PER_FT;
  const colorIdx = bed.index % BED_FILLS.length;

  // Grid: ALL lines + dots drawn in a single canvas call (was ~143 React components per bed)
  const drawGrid = useCallback(
    (ctx: any, shape: any) => {
      if (!showGrid) return;
      const vCols = Math.round(bed.width / gridSpacing);
      const hRows = Math.round(bed.height / gridSpacing);

      // Vertical green lines
      ctx.beginPath();
      for (let c = 0; c <= vCols; c++) {
        const lx = x + c * stepPx;
        ctx.moveTo(lx, y);
        ctx.lineTo(lx, y + h);
      }
      ctx.strokeStyle = GRID_LINE_COLOR;
      ctx.lineWidth = 0.7;
      ctx.globalAlpha = 0.45;
      ctx.stroke();

      // Horizontal green lines
      ctx.beginPath();
      for (let r = 0; r <= hRows; r++) {
        const ly = y + r * stepPx;
        ctx.moveTo(x, ly);
        ctx.lineTo(x + w, ly);
      }
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;
      ctx.stroke();

      // Blue dots at intersections
      ctx.fillStyle = GRID_DOT_COLOR;
      ctx.globalAlpha = 0.7;
      for (let c = 0; c <= vCols; c++) {
        for (let r = 0; r <= hRows; r++) {
          ctx.beginPath();
          ctx.arc(x + c * stepPx, y + r * stepPx, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.fillStrokeShape(shape);
    },
    [bed.width, bed.height, gridSpacing, showGrid, x, y, w, h, stepPx]
  );

  // Line number labels above the bed (interior lines only)
  const lineLabels = useMemo(() => {
    const labels: React.ReactNode[] = [];
    const vCols = Math.round(bed.width / gridSpacing);
    // Interior lines: skip first (0) and last (vCols)
    for (let c = 1; c < vCols; c++) {
      labels.push(
        <Text
          key={`ln-${bed.index}-${c}`}
          x={x + c * stepPx - 2}
          y={y - 10}
          text={`${c}`}
          fontSize={7}
          fill={GRID_LINE_COLOR}
          opacity={0.7}
          listening={false}
        />
      );
    }
    return labels;
  }, [bed, gridSpacing, x, y, stepPx]);

  return (
    <Group listening={false}>
      {/* Bed fill */}
      <Rect
        x={x} y={y} width={w} height={h}
        fill={BED_FILLS[colorIdx]}
        listening={false}
        perfectDrawEnabled={false}
      />

      {/* Pink/magenta border (matches reference) */}
      <Rect
        x={x} y={y} width={w} height={h}
        stroke={BED_BORDER_COLOR}
        strokeWidth={1.5}
        fill="transparent"
        listening={false}
        perfectDrawEnabled={false}
      />

      {/* Pink accent horizontal lines at top and bottom of bed */}
      <Line
        points={[x, y, x + w, y]}
        stroke={BED_ACCENT_COLOR}
        strokeWidth={1}
        opacity={0.6}
        listening={false}
      />
      <Line
        points={[x, y + h, x + w, y + h]}
        stroke={BED_ACCENT_COLOR}
        strokeWidth={1}
        opacity={0.6}
        listening={false}
      />

      {/* Bed label (top center) */}
      <Text
        x={x + w / 2 - 14}
        y={y + 4}
        text={bed.label}
        fontSize={10}
        fill="#f8fafc"
        fontStyle="bold"
        listening={false}
      />

      {/* Bed width dimension */}
      <Text
        x={x + w / 2 - 8}
        y={y + 16}
        text={`${bed.width}ft`}
        fontSize={7}
        fill="#94a3b8"
        listening={false}
      />

      {/* Grid (green lines + blue dots) — single canvas draw */}
      {showGrid && <Shape sceneFunc={drawGrid} listening={false} perfectDrawEnabled={false} />}

      {/* Line number labels */}
      {lineLabels}

      {/* Module row-divider lines at every baseBedLengthFt (e.g. 24ft) */}
      {bed.height > baseBedLengthFt &&
        Array.from(
          { length: Math.floor(bed.height / baseBedLengthFt) - 1 },
          (_, i) => {
            const divY = y + (i + 1) * baseBedLengthFt * PX_PER_FT;
            return (
              <Line
                key={`row-div-${bed.index}-${i}`}
                points={[x, divY, x + w, divY]}
                stroke={MODULE_DIM_COLOR}
                strokeWidth={1}
                dash={[6, 4]}
                opacity={0.5}
                listening={false}
              />
            );
          }
        )}

      {/* Tree placements per bed type */}
      <BedTreePlacements bed={bed} symbolVisibility={symbolVisibility} bedTypeCycle={bedTypeCycle} treeSpacingFt={treeSpacingFt} />
    </Group>
  );
});

// ================================================================
// TRENCH / PATH between beds
// ================================================================
function PathRenderer({ path }: { path: PathPosition }) {
  const x = path.x * PX_PER_FT;
  const y = path.y * PX_PER_FT;
  const w = path.width * PX_PER_FT;
  const h = path.height * PX_PER_FT;
  const isHorizontal = path.orientation === "horizontal";

  return (
    <Group listening={false}>
      {/* Trench fill */}
      <Rect x={x} y={y} width={w} height={h} fill={PATH_FILL} listening={false} perfectDrawEnabled={false} />

      {/* Trench border */}
      <Rect
        x={x} y={y} width={w} height={h}
        stroke={PATH_STROKE} strokeWidth={0.5}
        fill="transparent" opacity={0.4} listening={false} perfectDrawEnabled={false}
      />

      {/* Center dashed line */}
      {isHorizontal ? (
        <Line
          points={[x + 4, y + h / 2, x + w - 4, y + h / 2]}
          stroke={PATH_STROKE} strokeWidth={0.5}
          dash={[4, 4]} opacity={0.5} listening={false}
        />
      ) : (
        <Line
          points={[x + w / 2, y + 4, x + w / 2, y + h - 4]}
          stroke={PATH_STROKE} strokeWidth={0.5}
          dash={[4, 4]} opacity={0.5} listening={false}
        />
      )}

      {/* Trench label */}
      {isHorizontal ? (
        <>
          <Text
            x={x + w / 2 - 16}
            y={y + h / 2 - 4}
            text={`Trench ${path.height}ft`}
            fontSize={7}
            fill="#64748b"
            opacity={0.6}
            listening={false}
          />
        </>
      ) : (
        <>
          <Text
            x={x + w / 2 - 8}
            y={y + 4}
            text={`${path.width}ft`}
            fontSize={7}
            fill="#64748b"
            listening={false}
          />
          <Text
            x={x + 2}
            y={y + h / 2 - 4}
            text="Trench"
            fontSize={6}
            fill="#64748b"
            opacity={0.5}
            rotation={90}
            listening={false}
          />
        </>
      )}
    </Group>
  );
}

// ================================================================
// DIMENSION ANNOTATIONS — measurements around the orchard
// ================================================================
function DimensionAnnotations({ layout }: { layout: OrchardLayout }) {
  const { config, beds, paths } = layout;
  const w = config.widthFt * PX_PER_FT;
  const h = config.heightFt * PX_PER_FT;
  const bw = config.boundaryWidthFt * PX_PER_FT;

  const dimColor = "#94a3b8";

  // Calculate K module — center of first bed → center of bed at kBedSpan
  const kSpan = config.kBedSpan; // 3 for 24×24, 4 for 36×36
  const bedFirst = beds[0];
  const bedLast = beds.length >= kSpan ? beds[kSpan - 1] : null;
  const moduleFt =
    bedFirst && bedLast
      ? bedLast.x + bedLast.width / 2 - (bedFirst.x + bedFirst.width / 2)
      : 0;
  const moduleStartPx = bedFirst ? (bedFirst.x + bedFirst.width / 2) * PX_PER_FT : 0;
  const moduleEndPx = bedLast ? (bedLast.x + bedLast.width / 2) * PX_PER_FT : 0;

  // Derive per-module bed length (continuous: totalInner / rowCount)
  const totalInnerH = config.heightFt - 2 * config.boundaryWidthFt;
  const bedLengthFt = totalInnerH / config.rowCount;

  // All beds/paths are in a single row now (continuous)
  const verticalPaths = paths.filter((p) => p.orientation === "vertical");

  const rowLabel = config.rowCount > 1 ? ` × ${config.rowCount} rows` : "";

  return (
    <Group listening={false}>
      {/* === TOP ROW 1: "K" module dimension (gold, prominent) === */}
      {moduleFt > 0 && (
        <Group listening={false}>
          <Line points={[moduleStartPx, -28, moduleEndPx, -28]} stroke={MODULE_DIM_COLOR} strokeWidth={1} listening={false} />
          <Line points={[moduleStartPx, -32, moduleStartPx, -24]} stroke={MODULE_DIM_COLOR} strokeWidth={1} listening={false} />
          <Line points={[moduleEndPx, -32, moduleEndPx, -24]} stroke={MODULE_DIM_COLOR} strokeWidth={1} listening={false} />
          <Text
            x={(moduleStartPx + moduleEndPx) / 2 - 20}
            y={-40}
            text={`K = ${moduleFt} ft`}
            fontSize={9}
            fill={MODULE_DIM_COLOR}
            fontStyle="bold"
            listening={false}
          />
          <Circle x={moduleStartPx} y={-28} radius={2} fill={MODULE_DIM_COLOR} listening={false} />
          <Circle x={moduleEndPx} y={-28} radius={2} fill={MODULE_DIM_COLOR} listening={false} />
        </Group>
      )}

      {/* === TOP ROW 2: per-section dimensions (first row only) === */}
      <Line points={[0, -6, bw, -6]} stroke={BOUNDARY_STROKE} strokeWidth={0.5} opacity={0.6} listening={false} />
      <Text x={bw / 2 - 4} y={-14} text={`${config.boundaryWidthFt}'`} fontSize={6} fill={BOUNDARY_STROKE} listening={false} />

      {beds.map((bed) => {
        const bx = bed.x * PX_PER_FT;
        const bw2 = bed.width * PX_PER_FT;
        return (
          <Group key={`dim-bed-${bed.index}`} listening={false}>
            <Line points={[bx, -6, bx + bw2, -6]} stroke={BED_BORDER_COLOR} strokeWidth={0.5} opacity={0.6} listening={false} />
            <Text x={bx + bw2 / 2 - 4} y={-14} text={`${bed.width}'`} fontSize={6} fill={BED_BORDER_COLOR} listening={false} />
          </Group>
        );
      })}

      {verticalPaths.map((path) => {
        const px = path.x * PX_PER_FT;
        const pw = path.width * PX_PER_FT;
        return (
          <Group key={`dim-path-${path.index}`} listening={false}>
            <Line points={[px, -6, px + pw, -6]} stroke={PATH_STROKE} strokeWidth={0.5} opacity={0.6} listening={false} />
            <Text x={px + pw / 2 - 3} y={-14} text={`${path.width}'`} fontSize={6} fill={PATH_STROKE} listening={false} />
          </Group>
        );
      })}

      <Line points={[w - bw, -6, w, -6]} stroke={BOUNDARY_STROKE} strokeWidth={0.5} opacity={0.6} listening={false} />
      <Text x={w - bw + bw / 2 - 4} y={-14} text={`${config.boundaryWidthFt}'`} fontSize={6} fill={BOUNDARY_STROKE} listening={false} />

      {/* === LEFT: total inner height dimension === */}
      <Line points={[-12, bw, -12, h - bw]} stroke={dimColor} strokeWidth={0.5} opacity={0.5} listening={false} />
      <Line points={[-16, bw, -8, bw]} stroke={dimColor} strokeWidth={0.5} opacity={0.5} listening={false} />
      <Line points={[-16, h - bw, -8, h - bw]} stroke={dimColor} strokeWidth={0.5} opacity={0.5} listening={false} />
      <Text
        x={-30}
        y={(h / 2) + 12}
        text={`${Math.round(totalInnerH)} ft`}
        fontSize={9}
        fill="#e2e8f0"
        fontStyle="bold"
        rotation={-90}
        listening={false}
      />

      {/* === Title === */}
      <Text
        x={w / 2 - 110}
        y={-52}
        text={`Palekar Food Forest ${moduleFt}×${Math.round(bedLengthFt)} ft Module${rowLabel}`}
        fontSize={11}
        fill="#e2e8f0"
        fontStyle="bold"
        listening={false}
      />
    </Group>
  );
}

// ================================================================
// FT MARKERS along left boundary
// ================================================================
function FtMarkers({ layout }: { layout: OrchardLayout }) {
  const { innerBounds, config } = layout;
  const gridSpacing = config.gridSpacingFt;
  const markers: React.ReactNode[] = [];

  // Show markers every 3ft (every 2 grid cells)
  const markerStep = gridSpacing * 2;
  for (let ft = 0; ft <= innerBounds.height; ft += markerStep) {
    const py = innerBounds.y * PX_PER_FT + ft * PX_PER_FT;
    markers.push(
      <Group key={`ftm-${ft}`} listening={false}>
        <Line
          points={[0, py, innerBounds.x * PX_PER_FT, py]}
          stroke={BOUNDARY_STROKE}
          strokeWidth={0.3}
          opacity={0.3}
          listening={false}
        />
        <Text
          x={2}
          y={py - 3}
          text={`${ft}'`}
          fontSize={6}
          fill={BOUNDARY_STROKE}
          opacity={0.7}
          listening={false}
        />
      </Group>
    );
  }

  return <Group listening={false}>{markers}</Group>;
}

// ================================================================
// MAIN ORCHARD LAYER
// ================================================================
export const OrchardLayer = React.memo(function OrchardLayer({
  layout,
  showBoundary,
  showBeds,
  showGrid,
  symbolVisibility,
}: OrchardLayerProps) {
  const { config, beds, paths } = layout;

  // Base bed-length per module row (total inner height / rowCount)
  const innerHeight = config.heightFt - 2 * config.boundaryWidthFt;
  const baseBedLengthFt = innerHeight / config.rowCount;

  return (
    <Group listening={false}>
      {/* Dimension annotations */}
      <DimensionAnnotations layout={layout} />

      {/* Boundary (live fence with hatching) */}
      {showBoundary && (
        <BoundaryRenderer
          widthFt={config.widthFt}
          heightFt={config.heightFt}
          boundaryWidthFt={config.boundaryWidthFt}
        />
      )}

      {/* Trenches between beds */}
      {showBeds &&
        paths.map((p) => <PathRenderer key={`path-${p.index}`} path={p} />)}

      {/* Beds with grid */}
      {showBeds &&
        beds.map((bed) => (
          <BedRenderer
            key={`bed-${bed.index}`}
            bed={bed}
            gridSpacing={config.gridSpacingFt}
            showGrid={showGrid}
            symbolVisibility={symbolVisibility}
            baseBedLengthFt={baseBedLengthFt}
            bedTypeCycle={config.bedTypeCycle}
            treeSpacingFt={config.treeSpacingFt}
          />
        ))}

      {/* Ft markers along left */}
      {showBoundary && <FtMarkers layout={layout} />}
    </Group>
  );
});

