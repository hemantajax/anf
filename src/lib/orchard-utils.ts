import type {
  OrchardConfig,
  OrchardLayout,
  BedPosition,
  PathPosition,
} from "@/types/farm";

/**
 * Palekar Food Forest "24×24" model:
 *
 *   24 ft = center of Bed 1 → center of Bed 3  (the "K" module)
 *         = half-bed(4.5) + trench(3) + bed(9) + trench(3) + half-bed(4.5)
 *
 *   Full canvas width  = boundary + 3 full beds + 2 trenches + boundary
 *                       = 1.5 + 9 + 3 + 9 + 3 + 9 + 1.5 = 36 ft
 *
 *   Full canvas height  = boundary + 24 ft bed-length + boundary
 *                        = 1.5 + 24 + 1.5 = 27 ft
 *
 *   Grid: 1.5 ft × 1.5 ft (smallest block)
 *   Bed:  9 ft wide  (6 grid-cells)
 *   Trench: 3 ft (2 grid-cells)
 *   Boundary: 1.5 ft (1 grid-cell)
 */

// ---- Auto-compute total canvas width ----
export function calcCanvasWidth(
  bedCount: number,
  bedWidthFt: number,
  pathWidthFt: number,
  boundaryWidthFt: number
): number {
  return (
    2 * boundaryWidthFt +
    bedCount * bedWidthFt +
    (bedCount - 1) * pathWidthFt
  );
}

// ---- Auto-compute total canvas height ----
export function calcCanvasHeight(
  bedLengthFt: number,
  boundaryWidthFt: number
): number {
  return 2 * boundaryWidthFt + bedLengthFt;
}

// ---- Default orchard config (full 4-bed cycle → 48×27 canvas) ----
// Bed 1-3: 9ft wide, 5 interior lines (1.5ft grid)
// Bed 4:   9ft wide, 8 lines (vine/pavilion bed — denser planting later)
export const DEFAULT_ORCHARD_CONFIG: OrchardConfig = {
  widthFt: calcCanvasWidth(4, 9, 3, 1.5),   // 48
  heightFt: calcCanvasHeight(24, 1.5),        // 27
  boundaryWidthFt: 1.5,
  bedWidthFt: 9,
  pathWidthFt: 3,
  bedCount: 4,
  gridSpacingFt: 1.5,
};

// ---- Visual style matching the hand-drawn reference images ----

// Bed fill colors (alternating per bed for distinction)
export const BED_FILLS = [
  "rgba(250, 245, 235, 0.08)", // Bed 1 – very faint warm
  "rgba(235, 245, 250, 0.08)", // Bed 2 – very faint cool
  "rgba(250, 245, 235, 0.08)", // Bed 3
  "rgba(245, 250, 235, 0.08)", // Bed 4
];

// Pink/magenta border around each bed (matches reference)
export const BED_BORDER_COLOR = "#ec4899";

// Green grid lines within beds (matches reference)
export const GRID_LINE_COLOR = "#22c55e";

// Blue dots at intersections (matches reference)
export const GRID_DOT_COLOR = "#3b82f6";

// Red/pink horizontal accent lines on bed border
export const BED_ACCENT_COLOR = "#f43f5e";

// Boundary (live fence) hatching
export const BOUNDARY_FILL = "#1a472e";
export const BOUNDARY_STROKE = "#16a34a";
export const BOUNDARY_HATCH_COLOR = "#8B4513"; // brown diagonal lines

// Trench/path
export const PATH_FILL = "rgba(30, 30, 40, 0.5)";
export const PATH_STROKE = "#475569";

// ---- 24 ft module color (used for "K" dimension) ----
export const MODULE_DIM_COLOR = "#facc15"; // gold

// ---- Compute the full orchard layout from config ----
export function computeOrchardLayout(config: OrchardConfig): OrchardLayout {
  const {
    widthFt,
    heightFt,
    boundaryWidthFt,
    bedWidthFt,
    pathWidthFt,
    bedCount,
    gridSpacingFt,
  } = config;

  const innerX = boundaryWidthFt;
  const innerY = boundaryWidthFt;
  const innerWidth = widthFt - 2 * boundaryWidthFt;
  const innerHeight = heightFt - 2 * boundaryWidthFt;

  const beds: BedPosition[] = [];
  const paths: PathPosition[] = [];

  let currentX = innerX;

  for (let i = 0; i < bedCount; i++) {
    const lineCount = Math.floor(bedWidthFt / gridSpacingFt) + 1;
    const lineOffsets: number[] = [];
    for (let l = 0; l < lineCount; l++) {
      lineOffsets.push(l * gridSpacingFt);
    }

    // Bed types cycle every 4: Bed 1, Bed 2, Bed 3, Bed 4, Bed 1, …
    const bedTypeNum = (i % 4) + 1;

    beds.push({
      index: i,
      label: `Bed ${bedTypeNum}`,
      x: currentX,
      y: innerY,
      width: bedWidthFt,
      height: innerHeight,
      lineCount,
      lineOffsets,
    });

    currentX += bedWidthFt;

    // Trench between beds (not after the last)
    if (i < bedCount - 1) {
      paths.push({
        index: i,
        x: currentX,
        y: innerY,
        width: pathWidthFt,
        height: innerHeight,
      });
      currentX += pathWidthFt;
    }
  }

  return {
    config,
    beds,
    paths,
    innerBounds: {
      x: innerX,
      y: innerY,
      width: innerWidth,
      height: innerHeight,
    },
  };
}

// ---- Validate config ----
export function validateOrchardConfig(config: OrchardConfig): {
  valid: boolean;
  message: string;
  requiredInnerWidth: number;
  availableInnerWidth: number;
} {
  const innerWidth = config.widthFt - 2 * config.boundaryWidthFt;
  const bedsWidth = config.bedCount * config.bedWidthFt;
  const pathsWidth = (config.bedCount - 1) * config.pathWidthFt;
  const requiredInnerWidth = bedsWidth + pathsWidth;

  if (requiredInnerWidth > innerWidth) {
    return {
      valid: false,
      message: `Needs ${requiredInnerWidth}ft but only ${innerWidth}ft available.`,
      requiredInnerWidth,
      availableInnerWidth: innerWidth,
    };
  }

  // Compute the 24ft module span (center of first bed → center of 3rd bed)
  const moduleFt =
    config.bedCount >= 3
      ? config.bedWidthFt + config.pathWidthFt + config.bedWidthFt
      : 0;

  return {
    valid: true,
    message: `${config.bedCount} beds × ${config.bedWidthFt}ft + ${config.bedCount - 1} trenches × ${config.pathWidthFt}ft${moduleFt ? ` | Module K = ${moduleFt}ft` : ""}`,
    requiredInnerWidth,
    availableInnerWidth: innerWidth,
  };
}

// ---- Preset orchard sizes ----
// Width auto-calculated; height = 2×boundary + bed-length (24ft standard)
const BED_LENGTH = 24;

export const ORCHARD_PRESETS: {
  label: string;
  bedCount: number;
  description: string;
}[] = [
  { label: "3 Beds (K Module)", bedCount: 3, description: "24ft module" },
  { label: "4 Beds (1 Cycle)", bedCount: 4, description: "Full Bed 1-4 cycle" },
  { label: "8 Beds (2 Cycles)", bedCount: 8, description: "2× full cycles" },
  { label: "12 Beds (3 Cycles)", bedCount: 12, description: "3× full cycles" },
];

// ================================================================
// PLANT SYMBOLS — tree types for center column placement
// ================================================================

/** Tree size category */
export type TreeSize = "big" | "medium" | "small";

/** Symbol shape used on the diagram */
export type SymbolShape = "circle" | "square" | "star" | "triangle" | "diamond" | "dash" | "dot";

/** A plant symbol definition */
export interface PlantSymbolDef {
  id: string;
  label: string;
  shortLabel: string; // 1-2 char label inside symbol
  shape: SymbolShape;
  size: TreeSize;
  radius: number;     // px radius (or half-size for square)
  fill: string;
  stroke: string;
  strokeWidth: number;
}

/** Pre-defined symbols matching the Palekar reference drawings */
export const PLANT_SYMBOLS: Record<string, PlantSymbolDef> = {
  // ── Center column trees (B / M / S) ──
  big: {
    id: "big",
    label: "Big Tree (Citrus/Mango)",
    shortLabel: "B",
    shape: "circle",
    size: "big",
    radius: 5,
    fill: "#ef4444",      // red fill
    stroke: "#dc2626",
    strokeWidth: 1.5,
  },
  medium: {
    id: "medium",
    label: "Medium Tree (Apple/Custard Apple)",
    shortLabel: "M",
    shape: "square",
    size: "medium",
    radius: 4,
    fill: "#ec4899",      // pink fill
    stroke: "#db2777",
    strokeWidth: 1.2,
  },
  small: {
    id: "small",
    label: "Small Tree (Pomegranate/Guava)",
    shortLabel: "S",
    shape: "star",
    size: "small",
    radius: 3.5,
    fill: "#22c55e",      // green fill
    stroke: "#16a34a",
    strokeWidth: 1,
  },

  // ── Bed 2 edge trees ──
  banana: {
    id: "banana",
    label: "Banana",
    shortLabel: "BA",
    shape: "triangle",
    size: "big",
    radius: 4.5,
    fill: "#38bdf8",       // sky-blue triangle (matches reference)
    stroke: "#0284c7",
    strokeWidth: 1.2,
  },
  papaya: {
    id: "papaya",
    label: "Dwarf Papaya",
    shortLabel: "PA",
    shape: "diamond",
    size: "medium",
    radius: 4,
    fill: "#a78bfa",       // purple diamond
    stroke: "#7c3aed",
    strokeWidth: 1.2,
  },

  // ── Bed 4: vine/vegetable symbols ──
  vineVeg: {
    id: "vineVeg",
    label: "Vine Vegetable (Gourd/Beans/Tomato)",
    shortLabel: "★",
    shape: "star",
    size: "small",
    radius: 3,
    fill: "#16a34a",       // green star
    stroke: "#15803d",
    strokeWidth: 1,
  },
  pavilionPole: {
    id: "pavilionPole",
    label: "Bamboo Pavilion Pole (10ft)",
    shortLabel: "⌂",
    shape: "square",
    size: "medium",
    radius: 3.5,
    fill: "#1e40af",       // dark blue filled square
    stroke: "#1d4ed8",
    strokeWidth: 1.2,
  },

  // ── Other symbols ──
  pigeonPea: {
    id: "pigeonPea",
    label: "Pigeon Pea (Arhar)",
    shortLabel: "△",
    shape: "triangle",
    size: "small",
    radius: 2.5,
    fill: "transparent",
    stroke: "#4ade80",
    strokeWidth: 0.8,
  },
  groundnut: {
    id: "groundnut",
    label: "Groundnut",
    shortLabel: "●",
    shape: "dot",
    size: "small",
    radius: 2,
    fill: "#1e3a5f",
    stroke: "#1e3a5f",
    strokeWidth: 0.5,
  },
  onionGarlic: {
    id: "onionGarlic",
    label: "Onion / Garlic",
    shortLabel: "—",
    shape: "dash",
    size: "small",
    radius: 3,
    fill: "transparent",
    stroke: "#64748b",
    strokeWidth: 1,
  },
};

/** Center column tree placement pattern along bed length.
 *  B(0) → S(6) → M(12) → S(18) → B(24)  — all 6ft apart
 */
export interface TreePlacement {
  symbolId: string;
  /** Y offset from bed top in ft */
  yOffsetFt: number;
  /** X offset from bed left in ft (center column = bedWidth/2) */
  xOffsetFt: number;
}

/** Generate center column tree placements for a bed */
export function getCenterColumnTrees(
  bedWidthFt: number,
  bedHeightFt: number,
  spacingFt = 6
): TreePlacement[] {
  const centerX = bedWidthFt / 2;
  const placements: TreePlacement[] = [];

  // Pattern repeats: B, S, M, S, B, S, M, S, B …
  const pattern: string[] = ["big", "small", "medium", "small"];

  for (let y = 0; y <= bedHeightFt; y += spacingFt) {
    const patIdx = (y / spacingFt) % pattern.length;
    placements.push({
      symbolId: pattern[patIdx],
      yOffsetFt: y,
      xOffsetFt: centerX,
    });
  }

  return placements;
}

/**
 * Generate 3ft intermediate placements for Bed 1 & Bed 3.
 * Pigeon Pea △ at midpoints between B/M/S trees on center column.
 *
 *  0 B ── 3 △ ── 6 S ── 9 △ ── 12 M ── 15 △ ── 18 S ── 21 △ ── 24 B
 */
export function getIntermediatePlacements(
  bedWidthFt: number,
  bedHeightFt: number,
  mainSpacingFt = 6,
  symbolId = "pigeonPea"
): TreePlacement[] {
  const centerX = bedWidthFt / 2;
  const halfStep = mainSpacingFt / 2; // 3ft
  const placements: TreePlacement[] = [];

  for (let y = halfStep; y < bedHeightFt; y += mainSpacingFt) {
    placements.push({
      symbolId,
      yOffsetFt: y,
      xOffsetFt: centerX,
    });
  }

  return placements;
}

/**
 * Bed 2 — Banana & Papaya on BOTH edges at 6ft, alternating.
 *   Left edge  (1.5ft from bed left):  BA(0) PA(6) BA(12) PA(18) BA(24)
 *   Right edge (1.5ft from bed right): PA(0) BA(6) PA(12) BA(18) PA(24)
 */
export function getBed2EdgePlacements(
  bedWidthFt: number,
  bedHeightFt: number,
  gridSpacingFt = 1.5,
  spacingFt = 6
): TreePlacement[] {
  const leftX = gridSpacingFt;                   // 1.5ft from left
  const rightX = bedWidthFt - gridSpacingFt;     // 1.5ft from right
  const placements: TreePlacement[] = [];

  for (let y = 0; y <= bedHeightFt; y += spacingFt) {
    const idx = y / spacingFt;
    const isEven = idx % 2 === 0;

    // Left edge: BA on even, PA on odd
    placements.push({
      symbolId: isEven ? "banana" : "papaya",
      yOffsetFt: y,
      xOffsetFt: leftX,
    });

    // Right edge: PA on even, BA on odd (opposite)
    placements.push({
      symbolId: isEven ? "papaya" : "banana",
      yOffsetFt: y,
      xOffsetFt: rightX,
    });
  }

  return placements;
}

/**
 * Bed 2 — Pigeon Pea △ at 3ft midpoints on BOTH edge columns.
 *   Left:  3 △, 9 △, 15 △, 21 △
 *   Right: 3 △, 9 △, 15 △, 21 △
 */
export function getBed2IntermediatePlacements(
  bedWidthFt: number,
  bedHeightFt: number,
  gridSpacingFt = 1.5,
  mainSpacingFt = 6,
  symbolId = "pigeonPea"
): TreePlacement[] {
  const leftX = gridSpacingFt;
  const rightX = bedWidthFt - gridSpacingFt;
  const halfStep = mainSpacingFt / 2; // 3ft
  const placements: TreePlacement[] = [];

  for (let y = halfStep; y < bedHeightFt; y += mainSpacingFt) {
    placements.push({ symbolId, yOffsetFt: y, xOffsetFt: leftX });
    placements.push({ symbolId, yOffsetFt: y, xOffsetFt: rightX });
  }

  return placements;
}

/**
 * Bed 4 — Vine / Vegetable pavilion bed.
 *   ★ vine vegetable at every 3ft on ALL interior grid columns.
 *   ⌂ pavilion pole at 6ft intervals on edge + center columns (structural support).
 *
 *   Columns: 1.5, 3, 4.5, 6, 7.5 (interior lines, skip bed edges 0 & 9)
 *   Rows:    0, 3, 6, 9, 12, 15, 18, 21, 24  (every 3ft)
 */
export function getBed4Placements(
  bedWidthFt: number,
  bedHeightFt: number,
  gridSpacingFt = 1.5,
  rowSpacingFt = 3
): TreePlacement[] {
  const placements: TreePlacement[] = [];

  // All grid column x-offsets (interior lines: skip 0 and bedWidthFt edges)
  const columns: number[] = [];
  for (let x = gridSpacingFt; x < bedWidthFt; x += gridSpacingFt) {
    columns.push(x);
  }

  // Pavilion pole positions: left edge, center, right edge (structural 9×6 panel)
  const poleColumns = new Set([gridSpacingFt, bedWidthFt / 2, bedWidthFt - gridSpacingFt]);

  // Place vine veg ★ at every 3ft on all columns
  for (const col of columns) {
    for (let y = 0; y <= bedHeightFt; y += rowSpacingFt) {
      // If this is a pole position and on 6ft row → pavilion pole instead
      const isPolePos = poleColumns.has(col) && y % 6 === 0;

      placements.push({
        symbolId: isPolePos ? "pavilionPole" : "vineVeg",
        yOffsetFt: y,
        xOffsetFt: col,
      });
    }
  }

  return placements;
}

/** Build a full config from a preset bed count */
export function configFromBedCount(
  bedCount: number,
  bedWidthFt = 9,
  pathWidthFt = 3,
  boundaryWidthFt = 1.5,
  gridSpacingFt = 1.5,
  bedLengthFt = BED_LENGTH
): OrchardConfig {
  return {
    widthFt: calcCanvasWidth(bedCount, bedWidthFt, pathWidthFt, boundaryWidthFt),
    heightFt: calcCanvasHeight(bedLengthFt, boundaryWidthFt),
    boundaryWidthFt,
    bedWidthFt,
    pathWidthFt,
    bedCount,
    gridSpacingFt,
  };
}
