import { create } from "zustand";
import type {
  DrawingTool,
  LayerName,
  ViewportState,
  SnapConfig,
} from "@/types/farm";

interface DesignerState {
  // Current tool
  activeTool: DrawingTool;
  setActiveTool: (tool: DrawingTool) => void;

  // Viewport (zoom / pan)
  viewport: ViewportState;
  setViewport: (viewport: ViewportState) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;

  // Selection
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;

  // Grid & snap
  showGrid: boolean;
  toggleGrid: () => void;
  gridDisplaySize: number; // visual grid cell size in ft
  setGridDisplaySize: (size: number) => void;
  snap: SnapConfig;
  toggleSnap: () => void;

  // Layer visibility
  layerVisibility: Record<LayerName, boolean>;
  toggleLayerVisibility: (layer: LayerName) => void;

  // Symbol (plant type) visibility — keyed by PLANT_SYMBOLS id
  symbolVisibility: Record<string, boolean>;
  toggleSymbolVisibility: (symbolId: string) => void;
  setAllSymbolsVisible: (visible: boolean) => void;

  // Drawing state (temp coords while drawing)
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
  drawStart: { x: number; y: number } | null;
  setDrawStart: (pos: { x: number; y: number } | null) => void;
  drawPreview: { x: number; y: number; width: number; height: number } | null;
  setDrawPreview: (
    rect: { x: number; y: number; width: number; height: number } | null
  ) => void;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 30;
const ZOOM_STEP = 1.2;

export const useDesignerStore = create<DesignerState>((set) => ({
  // Tool
  activeTool: "select",
  setActiveTool: (tool) =>
    set({ activeTool: tool, selectedElementId: null }),

  // Viewport – 48×27ft canvas = 480×270px. scale ~1.5 fills ~720px view; offset for labels
  viewport: { x: 60, y: 120, scale: 1.5 },
  setViewport: (viewport) => set({ viewport }),
  zoomIn: () =>
    set((s) => ({
      viewport: {
        ...s.viewport,
        scale: Math.min(s.viewport.scale * ZOOM_STEP, MAX_SCALE),
      },
    })),
  zoomOut: () =>
    set((s) => ({
      viewport: {
        ...s.viewport,
        scale: Math.max(s.viewport.scale / ZOOM_STEP, MIN_SCALE),
      },
    })),
  resetZoom: () => set({ viewport: { x: 60, y: 120, scale: 1.5 } }),

  // Selection
  selectedElementId: null,
  setSelectedElementId: (id) => set({ selectedElementId: id }),

  // Grid
  showGrid: true,
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  gridDisplaySize: 1.5,
  setGridDisplaySize: (size) => set({ gridDisplaySize: size }),
  snap: { enabled: true, gridSizeFt: 1.5 },
  toggleSnap: () =>
    set((s) => ({ snap: { ...s.snap, enabled: !s.snap.enabled } })),

  // Layers
  layerVisibility: {
    grid: true,
    boundary: true,
    beds: true,
    zones: true,
    roads: true,
    trenches: true,
    plants: true,
    structures: true,
  },
  toggleLayerVisibility: (layer) =>
    set((s) => ({
      layerVisibility: {
        ...s.layerVisibility,
        [layer]: !s.layerVisibility[layer],
      },
    })),

  // Symbol (plant type) visibility — all ON by default
  symbolVisibility: {
    big: true,
    medium: true,
    small: true,
    marigold: true,
    cotton: true,
    fruitVeg: true,
    milletsPulses: true,
    aromaticPaddy: true,
    pigeonPea: true,
    groundnut: true,
    onionGarlic: true,
    banana: true,
    papaya: true,
    sugarcane: true,
    turmeric: true,
    ginger: true,
    vineVeg: true,
    pavilionPole: true,
  },
  toggleSymbolVisibility: (symbolId) =>
    set((s) => ({
      symbolVisibility: {
        ...s.symbolVisibility,
        [symbolId]: !s.symbolVisibility[symbolId],
      },
    })),
  setAllSymbolsVisible: (visible) =>
    set((s) => {
      const next: Record<string, boolean> = {};
      for (const key of Object.keys(s.symbolVisibility)) {
        next[key] = visible;
      }
      return { symbolVisibility: next };
    }),

  // Drawing state
  isDrawing: false,
  setIsDrawing: (drawing) => set({ isDrawing: drawing }),
  drawStart: null,
  setDrawStart: (pos) => set({ drawStart: pos }),
  drawPreview: null,
  setDrawPreview: (rect) => set({ drawPreview: rect }),
}));
