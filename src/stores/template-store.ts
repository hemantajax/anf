import { create } from "zustand";
import { nanoid } from "nanoid";
import type { BlockTemplate } from "@/types/farm";
import { DEFAULT_TEMPLATES, buildBlockTemplate } from "@/lib/constants";
import { configFromBedCount } from "@/lib/orchard-utils";

const STORAGE_KEY = "anf-templates";

function loadTemplates(): BlockTemplate[] {
  if (typeof window === "undefined") return DEFAULT_TEMPLATES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BlockTemplate[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_TEMPLATES;
}

function persistTemplates(templates: BlockTemplate[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch {
    // ignore
  }
}

interface TemplateState {
  templates: BlockTemplate[];
  addTemplate: (template: BlockTemplate) => void;
  updateTemplate: (id: string, updates: Partial<Omit<BlockTemplate, "id">>) => void;
  removeTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => BlockTemplate | null;
  resetToDefaults: () => void;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: loadTemplates(),

  addTemplate: (template) => {
    const next = [...get().templates, template];
    persistTemplates(next);
    set({ templates: next });
  },

  updateTemplate: (id, updates) => {
    const next = get().templates.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    persistTemplates(next);
    set({ templates: next });
  },

  removeTemplate: (id) => {
    const next = get().templates.filter((t) => t.id !== id);
    persistTemplates(next);
    set({ templates: next });
  },

  duplicateTemplate: (id) => {
    const source = get().templates.find((t) => t.id === id);
    if (!source) return null;

    const clone = buildBlockTemplate(
      nanoid(),
      `${source.name} (Copy)`,
      source.description ?? "",
      { ...source.orchardConfig },
      false,
    );

    const next = [...get().templates, clone];
    persistTemplates(next);
    set({ templates: next });
    return clone;
  },

  resetToDefaults: () => {
    persistTemplates(DEFAULT_TEMPLATES);
    set({ templates: DEFAULT_TEMPLATES });
  },
}));
