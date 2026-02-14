// ---- Size Category ----
export type SizeCategory = "big" | "medium" | "small" | "bush";

// ---- Plant Category ----
export type PlantCategory =
  | "big"
  | "medium"
  | "small"
  | "banana"
  | "papaya"
  | "guava"
  | "bush";

// ---- Plant Type ----
export interface PlantType {
  id: string;
  code: string;
  name: string;
  scientificName: string;
  symbol: string;
  sizeCategory: SizeCategory;
  category: PlantCategory;
  color: string;
  icon?: string;
  spacingFt: number;
  canopyRadiusFt: number;
  incomePerPlantPerYear?: number;
  varieties?: string[];
}

// ---- Vegetable Type ----
export interface VegetableType {
  id: string;
  code: string;
  name: string;
  scientificName: string;
  symbol: string;
  sizeCategory: SizeCategory;
  seasonality: "kharif" | "rabi" | "zaid";
  color: string;
  spacingFt: number;
  rowSpacingFt: number;
  varieties?: string[];
}

// ---- Drawing Tool ----
export type DrawingTool =
  | "select"
  | "road"
  | "trench"
  | "flower-bed"
  | "block-stamp"
  | "plant"
  | "zone"
  | "measure"
  | "eraser";

// ---- Layer Names ----
export type LayerName =
  | "grid"
  | "boundary"
  | "beds"
  | "zones"
  | "roads"
  | "trenches"
  | "plants"
  | "structures";

// ---- Farm Element (anything placed on canvas) ----
export type FarmElementType =
  | "road"
  | "trench"
  | "flower-bed"
  | "block"
  | "plant"
  | "zone-boundary"
  | "pond"
  | "shed"
  | "structure";

export interface FarmElement {
  id: string;
  type: FarmElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  layer: LayerName;
  locked: boolean;
  visible: boolean;
  label?: string;
  config: ElementConfig;
}

// ---- Element Configs ----
export interface RoadConfig {
  kind: "road";
  widthFt: number; // 15 for main, 6 for secondary
  label: string;
  hasBorderBed: boolean;
  borderWidthFt: number; // 3ft flower bed
  color: string;
}

export interface TrenchConfig {
  kind: "trench";
  widthFt: number; // 3ft default
  depthFt: number;
  color: string;
}

export interface FlowerBedConfig {
  kind: "flower-bed";
  widthFt: number;
  color: string;
}

export interface BlockConfig {
  kind: "block";
  templateId: string;
  templateName: string;
  blockWidthFt: number;
  blockHeightFt: number;
}

export interface PlantConfig {
  kind: "plant";
  plantTypeId: string;
  plantName: string;
  category: PlantCategory;
  color: string;
  canopyRadiusFt: number;
}

export interface GenericConfig {
  kind: "generic";
  color: string;
  [key: string]: unknown;
}

export type ElementConfig =
  | RoadConfig
  | TrenchConfig
  | FlowerBedConfig
  | BlockConfig
  | PlantConfig
  | GenericConfig;

// ---- Zone ----
export interface Zone {
  id: string;
  name: string;
  color: string;
  acres: number;
  strategy: string;
  blockTemplateId: string;
  bounds: { x: number; y: number; width: number; height: number };
}

// ---- Block Template ----
export interface PlantPlacement {
  plantTypeId: string;
  relativeX: number;
  relativeY: number;
}

export interface BlockTemplate {
  id: string;
  name: string;
  widthFt: number;
  heightFt: number;
  plants: PlantPlacement[];
  trenches: { y: number; widthFt: number }[];
  beds: { y: number; heightFt: number; label: string }[];
  totalPlants: number;
}

// ---- Farm ----
export interface Farm {
  id: string;
  name: string;
  totalAcres: number;
  reservedAcres: number;
  dimensions: { widthFt: number; heightFt: number };
  gridSizeFt: number;
  zones: Zone[];
  elements: FarmElement[];
  createdAt: string;
  updatedAt: string;
}

// ---- Canvas / Designer State ----
export interface ViewportState {
  x: number;
  y: number;
  scale: number;
}

export interface SnapConfig {
  enabled: boolean;
  gridSizeFt: number;
}

// ---- History entry for undo/redo ----
export interface HistoryEntry {
  elements: FarmElement[];
  timestamp: number;
}

// ---- Orchard Layout ----
export interface OrchardConfig {
  /** Total orchard width in feet (e.g. 36) */
  widthFt: number;
  /** Total orchard height in feet (e.g. 36) */
  heightFt: number;
  /** Boundary (live fence) thickness each side in feet */
  boundaryWidthFt: number;
  /** Individual bed width in feet (e.g. 6) */
  bedWidthFt: number;
  /** Path/gap width between beds in feet (e.g. 3) */
  pathWidthFt: number;
  /** Number of beds per row (e.g. 4) — horizontal */
  bedCount: number;
  /** Number of rows (vertical repetitions, default 1) */
  rowCount: number;
  /** Grid spacing for plant placement in feet (e.g. 1) */
  gridSpacingFt: number;
  /** Bed type cycle — maps column position to bed type number.
   *  24×24: [1,2,3,4]  |  36×36: [1,2,4,3] */
  bedTypeCycle: number[];
  /** Number of beds the K module spans (center-to-center).
   *  24×24: 3 (Bed1→Bed3)  |  36×36: 4 (Bed1→Bed4) */
  kBedSpan: number;
  /** Spacing between B/M/S center-column trees in feet.
   *  24×24: 6ft  |  36×36: 9ft */
  treeSpacingFt: number;
}

export interface BedPosition {
  /** Bed index (0-based, global across all rows) */
  index: number;
  /** Row index (0-based) */
  row: number;
  /** Column index within the row (0-based) */
  col: number;
  /** Bed label (e.g. "Bed 1") */
  label: string;
  /** X position in feet from left edge of orchard */
  x: number;
  /** Y position in feet from top edge of orchard */
  y: number;
  /** Width in feet */
  width: number;
  /** Height (length) in feet */
  height: number;
  /** Number of vertical lines within this bed */
  lineCount: number;
  /** Line X positions relative to bed start */
  lineOffsets: number[];
}

export interface PathPosition {
  /** Path index (0-based) */
  index: number;
  /** X position in feet */
  x: number;
  /** Y position in feet */
  y: number;
  /** Width in feet */
  width: number;
  /** Height in feet */
  height: number;
  /** Orientation: vertical trench between columns, horizontal between rows */
  orientation: "vertical" | "horizontal";
}

export interface OrchardLayout {
  config: OrchardConfig;
  beds: BedPosition[];
  paths: PathPosition[];
  /** Inner area bounds (inside boundary) */
  innerBounds: { x: number; y: number; width: number; height: number };
}
