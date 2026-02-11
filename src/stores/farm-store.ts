import { create } from "zustand";
import type { FarmElement, HistoryEntry, OrchardConfig, OrchardLayout } from "@/types/farm";
import { DEFAULT_ORCHARD_CONFIG, computeOrchardLayout } from "@/lib/orchard-utils";

const MAX_HISTORY = 50;

interface FarmState {
  // Farm meta
  farmName: string;
  totalAcres: number;
  reservedAcres: number;
  // Canvas dimensions in feet (derived from orchard config)
  canvasWidthFt: number;
  canvasHeightFt: number;

  // Orchard layout
  orchardConfig: OrchardConfig;
  orchardLayout: OrchardLayout;
  setOrchardConfig: (config: OrchardConfig) => void;

  // Elements on canvas
  elements: FarmElement[];

  // CRUD
  addElement: (element: FarmElement) => void;
  updateElement: (id: string, updates: Partial<FarmElement>) => void;
  removeElement: (id: string) => void;
  clearElements: () => void;

  // Undo / Redo
  history: HistoryEntry[];
  historyIndex: number;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const initialLayout = computeOrchardLayout(DEFAULT_ORCHARD_CONFIG);

export const useFarmStore = create<FarmState>((set, get) => ({
  farmName: "Palekar Food Forest",
  totalAcres: 12,
  reservedAcres: 2,
  canvasWidthFt: DEFAULT_ORCHARD_CONFIG.widthFt,
  canvasHeightFt: DEFAULT_ORCHARD_CONFIG.heightFt,

  // Orchard
  orchardConfig: DEFAULT_ORCHARD_CONFIG,
  orchardLayout: initialLayout,
  setOrchardConfig: (config) => {
    const layout = computeOrchardLayout(config);
    set({
      orchardConfig: config,
      orchardLayout: layout,
      canvasWidthFt: config.widthFt,
      canvasHeightFt: config.heightFt,
    });
  },

  elements: [],

  addElement: (element) => {
    const state = get();
    state.pushHistory();
    set({ elements: [...state.elements, element] });
  },

  updateElement: (id, updates) => {
    const state = get();
    state.pushHistory();
    set({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    });
  },

  removeElement: (id) => {
    const state = get();
    state.pushHistory();
    set({ elements: state.elements.filter((el) => el.id !== id) });
  },

  clearElements: () => {
    const state = get();
    state.pushHistory();
    set({ elements: [] });
  },

  // History
  history: [],
  historyIndex: -1,

  pushHistory: () => {
    const { elements, history, historyIndex } = get();
    const entry: HistoryEntry = {
      elements: JSON.parse(JSON.stringify(elements)),
      timestamp: Date.now(),
    };
    // Truncate any "future" entries if we're mid-history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(entry);
    // Cap history size
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < 0) return;
    const entry = history[historyIndex];
    set({
      elements: JSON.parse(JSON.stringify(entry.elements)),
      historyIndex: historyIndex - 1,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const nextEntry = history[historyIndex + 1];
    // We need to also push the current state forward
    const newIndex = historyIndex + 1;
    // Apply the entry after current
    if (newIndex + 1 < history.length) {
      set({
        elements: JSON.parse(
          JSON.stringify(history[newIndex + 1].elements)
        ),
        historyIndex: newIndex + 1,
      });
    } else {
      // We're at the end — reapply the next entry
      set({
        elements: JSON.parse(JSON.stringify(nextEntry.elements)),
        historyIndex: newIndex,
      });
    }
  },

  canUndo: () => get().historyIndex >= 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}));
