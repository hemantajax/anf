import type { FarmElement, ElementConfig, RoadConfig, TrenchConfig, FlowerBedConfig } from "@/types/farm";

// ---- Pixels per foot (base scale) ----
export const PX_PER_FT = 10;

// ---- Snap a value to grid ----
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

// ---- Convert stage coords to farm coords (ft) ----
export function stageToFarm(stageX: number, stageY: number): { x: number; y: number } {
  return {
    x: stageX / PX_PER_FT,
    y: stageY / PX_PER_FT,
  };
}

// ---- Convert farm coords (ft) to stage coords ----
export function farmToStage(farmX: number, farmY: number): { x: number; y: number } {
  return {
    x: farmX * PX_PER_FT,
    y: farmY * PX_PER_FT,
  };
}

// ---- Generate unique ID ----
let counter = 0;
export function generateId(): string {
  counter++;
  return `el_${Date.now()}_${counter}`;
}

// ---- Default configs ----
export function createRoadConfig(overrides?: Partial<RoadConfig>): RoadConfig {
  return {
    kind: "road",
    widthFt: 15,
    label: "Main Road",
    hasBorderBed: false,
    borderWidthFt: 3,
    color: "#94a3b8",
    ...overrides,
  };
}

export function createTrenchConfig(overrides?: Partial<TrenchConfig>): TrenchConfig {
  return {
    kind: "trench",
    widthFt: 3,
    depthFt: 2,
    color: "#38bdf8",
    ...overrides,
  };
}

export function createFlowerBedConfig(overrides?: Partial<FlowerBedConfig>): FlowerBedConfig {
  return {
    kind: "flower-bed",
    widthFt: 3,
    color: "#f472b6",
    ...overrides,
  };
}

// ---- Create a FarmElement ----
export function createFarmElement(
  type: FarmElement["type"],
  x: number,
  y: number,
  width: number,
  height: number,
  config: ElementConfig
): FarmElement {
  const layerMap: Record<FarmElement["type"], FarmElement["layer"]> = {
    road: "roads",
    trench: "trenches",
    "flower-bed": "plants",
    block: "plants",
    plant: "plants",
    "zone-boundary": "zones",
    pond: "structures",
    shed: "structures",
    structure: "structures",
  };

  return {
    id: generateId(),
    type,
    x,
    y,
    width,
    height,
    rotation: 0,
    layer: layerMap[type],
    locked: false,
    visible: true,
    config,
  };
}

// ---- Color map for element types ----
export const ELEMENT_COLORS: Record<string, string> = {
  road: "#94a3b8",
  trench: "#38bdf8",
  "flower-bed": "#f472b6",
  block: "#4ade80",
  plant: "#22c55e",
  "zone-boundary": "#a78bfa",
  pond: "#06b6d4",
  shed: "#f59e0b",
  structure: "#78716c",
};

// ---- Get fill color from element ----
export function getElementColor(element: FarmElement): string {
  if ("color" in element.config) {
    return element.config.color as string;
  }
  return ELEMENT_COLORS[element.type] ?? "#6b7280";
}

// ---- Get element label ----
export function getElementLabel(element: FarmElement): string {
  if (element.label) return element.label;
  const config = element.config;
  if (config.kind === "road") return config.label || "Road";
  if (config.kind === "trench") return "Trench";
  if (config.kind === "flower-bed") return "Flower Bed";
  return element.type;
}
