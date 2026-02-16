import { create } from "zustand";
import type { PriceEntry, MandiPrice } from "@/types/customer";
import { DEFAULT_PRICE_ENTRIES } from "@/lib/pricing-utils";

const STORAGE_KEY = "anf-prices";

function loadPrices(): PriceEntry[] {
  if (typeof window === "undefined") return DEFAULT_PRICE_ENTRIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PriceEntry[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_PRICE_ENTRIES;
}

function persistPrices(prices: PriceEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prices));
  } catch {
    // ignore
  }
}

interface PriceState {
  prices: PriceEntry[];
  mandiPrices: MandiPrice[];
  lastSynced: string | null;
  updatePrice: (id: string, updates: Partial<Omit<PriceEntry, "id">>) => void;
  addPrice: (entry: PriceEntry) => void;
  removePrice: (id: string) => void;
  setMandiPrices: (prices: MandiPrice[]) => void;
  resetToDefaults: () => void;
}

export const usePriceStore = create<PriceState>((set, get) => ({
  prices: loadPrices(),
  mandiPrices: [],
  lastSynced: null,

  updatePrice: (id, updates) => {
    const next = get().prices.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    persistPrices(next);
    set({ prices: next });
  },

  addPrice: (entry) => {
    const next = [...get().prices, entry];
    persistPrices(next);
    set({ prices: next });
  },

  removePrice: (id) => {
    const next = get().prices.filter((p) => p.id !== id);
    persistPrices(next);
    set({ prices: next });
  },

  setMandiPrices: (mandiPrices) => {
    set({ mandiPrices, lastSynced: new Date().toISOString() });
  },

  resetToDefaults: () => {
    persistPrices(DEFAULT_PRICE_ENTRIES);
    set({ prices: DEFAULT_PRICE_ENTRIES });
  },
}));
