import { create } from "zustand";
import type { Zone } from "@/types/farm";
import { DEFAULT_ZONES } from "@/lib/constants";

const STORAGE_KEY = "anf-zones";

function loadZones(): Zone[] {
  if (typeof window === "undefined") return DEFAULT_ZONES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Zone[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_ZONES;
}

function persistZones(zones: Zone[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
  } catch {
    // ignore
  }
}

interface ZoneState {
  zones: Zone[];
  addZone: (zone: Zone) => void;
  updateZone: (id: string, updates: Partial<Omit<Zone, "id">>) => void;
  removeZone: (id: string) => void;
  reorderZones: (zones: Zone[]) => void;
  resetToDefaults: () => void;
}

export const useZoneStore = create<ZoneState>((set, get) => ({
  zones: loadZones(),

  addZone: (zone) => {
    const next = [...get().zones, zone];
    persistZones(next);
    set({ zones: next });
  },

  updateZone: (id, updates) => {
    const next = get().zones.map((z) =>
      z.id === id ? { ...z, ...updates } : z
    );
    persistZones(next);
    set({ zones: next });
  },

  removeZone: (id) => {
    const next = get().zones.filter((z) => z.id !== id);
    persistZones(next);
    set({ zones: next });
  },

  reorderZones: (zones) => {
    persistZones(zones);
    set({ zones });
  },

  resetToDefaults: () => {
    persistZones(DEFAULT_ZONES);
    set({ zones: DEFAULT_ZONES });
  },
}));
