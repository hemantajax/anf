"use client";

import { useMemo } from "react";
import {
  Grid2X2,
  Fence,
  LayoutGrid,
  MapPin,
  Route,
  Waves,
  Trees,
  Building2,
  Eye,
  EyeOff,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDesignerStore } from "@/stores/designer-store";
import { useFarmStore } from "@/stores/farm-store";
import { PLANT_SYMBOLS } from "@/lib/orchard-utils";
import type { LayerName } from "@/types/farm";

interface LayerDef {
  id: LayerName;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LAYERS: LayerDef[] = [
  { id: "grid", label: "Grid", icon: Grid2X2 },
  { id: "boundary", label: "Boundary", icon: Fence },
  { id: "beds", label: "Beds", icon: LayoutGrid },
  { id: "zones", label: "Zones", icon: MapPin },
  { id: "roads", label: "Roads", icon: Route },
  { id: "trenches", label: "Trenches", icon: Waves },
  { id: "plants", label: "Plants", icon: Trees },
  { id: "structures", label: "Structures", icon: Building2 },
];

/** Ordered list of symbol entries for the toggle panel */
const SYMBOL_ENTRIES = [
  { id: "big", bed: "1,3" },
  { id: "medium", bed: "1,3" },
  { id: "small", bed: "1,3" },
  { id: "pigeonPea", bed: "1,2,3" },
  { id: "banana", bed: "2" },
  { id: "papaya", bed: "2" },
  { id: "vineVeg", bed: "4" },
  { id: "pavilionPole", bed: "4" },
] as const;

export function LayersPanel() {
  const layerVisibility = useDesignerStore((s) => s.layerVisibility);
  const toggleLayerVisibility = useDesignerStore(
    (s) => s.toggleLayerVisibility
  );
  const symbolVisibility = useDesignerStore((s) => s.symbolVisibility);
  const toggleSymbolVisibility = useDesignerStore(
    (s) => s.toggleSymbolVisibility
  );
  const setAllSymbolsVisible = useDesignerStore(
    (s) => s.setAllSymbolsVisible
  );
  const elements = useFarmStore((s) => s.elements);
  const orchardConfig = useFarmStore((s) => s.orchardConfig);

  // Count elements per layer
  const counts: Record<string, number> = {};
  for (const el of elements) {
    counts[el.layer] = (counts[el.layer] || 0) + 1;
  }

  // All symbols visible?
  const allVisible = useMemo(
    () => Object.values(symbolVisibility).every(Boolean),
    [symbolVisibility]
  );
  const noneVisible = useMemo(
    () => Object.values(symbolVisibility).every((v) => !v),
    [symbolVisibility]
  );

  return (
    <div className="w-[210px] shrink-0 border-l bg-sidebar flex flex-col">
      {/* ── Layer toggles ── */}
      <div className="px-3 py-2 border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Layers
        </h3>
      </div>
      <div className="overflow-auto p-1">
        {LAYERS.map((layer) => {
          const visible = layerVisibility[layer.id];
          const count = counts[layer.id] || 0;
          return (
            <Button
              key={layer.id}
              variant="ghost"
              className="w-full justify-between h-8 px-2 text-xs"
              onClick={() => toggleLayerVisibility(layer.id)}
            >
              <span className="flex items-center gap-2">
                <layer.icon className="h-3.5 w-3.5" />
                <span>{layer.label}</span>
                {count > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    ({count})
                  </span>
                )}
              </span>
              {visible ? (
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground opacity-40" />
              )}
            </Button>
          );
        })}
      </div>

      <Separator />

      {/* ── Symbol (plant type) toggles ── */}
      <div className="px-3 py-2 border-b flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Symbols
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[10px]"
          onClick={() => setAllSymbolsVisible(!allVisible)}
          title={allVisible ? "Hide all symbols" : "Show all symbols"}
        >
          {allVisible ? (
            <EyeOffIcon className="h-3 w-3 mr-1" />
          ) : (
            <EyeIcon className="h-3 w-3 mr-1" />
          )}
          {allVisible ? "Hide All" : "Show All"}
        </Button>
      </div>
      <div className="overflow-auto p-1 flex-1">
        {SYMBOL_ENTRIES.map(({ id, bed }) => {
          const sym = PLANT_SYMBOLS[id];
          if (!sym) return null;
          const visible = symbolVisibility[id] !== false;
          return (
            <button
              key={id}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded text-xs hover:bg-accent/50 transition-colors ${
                visible ? "opacity-100" : "opacity-40"
              }`}
              onClick={() => toggleSymbolVisibility(id)}
              title={`${sym.label} (Bed ${bed})`}
            >
              {/* Color swatch */}
              <span
                className="inline-block w-3 h-3 rounded-sm border shrink-0"
                style={{
                  backgroundColor: sym.fill === "transparent" ? "transparent" : sym.fill,
                  borderColor: sym.stroke,
                  borderWidth: 1.5,
                }}
              />
              {/* Label */}
              <span className="truncate flex-1 text-left">
                {sym.shortLabel} {sym.label.split("(")[0].trim()}
              </span>
              {/* Bed badge */}
              <span className="text-[9px] text-muted-foreground shrink-0">
                B{bed}
              </span>
              {/* Eye icon */}
              {visible ? (
                <Eye className="h-3 w-3 text-muted-foreground shrink-0" />
              ) : (
                <EyeOff className="h-3 w-3 text-muted-foreground shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <Separator />

      {/* ── Orchard info ── */}
      <div className="px-3 py-2 border-t space-y-1">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Orchard Info
        </h3>
        <div className="text-xs text-muted-foreground space-y-0.5">
          <div>
            Canvas: {orchardConfig.widthFt} × {orchardConfig.heightFt} ft
          </div>
          <div>
            Module K: {orchardConfig.bedCount >= 3 ? orchardConfig.bedWidthFt + orchardConfig.pathWidthFt + orchardConfig.bedWidthFt : "–"} ft
          </div>
          <div>
            {orchardConfig.bedCount}×{orchardConfig.rowCount} beds ({orchardConfig.bedCount * orchardConfig.rowCount} total) | Trench: {orchardConfig.pathWidthFt}ft
          </div>
          <div>Grid: {orchardConfig.gridSpacingFt}ft | Elements: {elements.length}</div>
        </div>
      </div>
    </div>
  );
}
