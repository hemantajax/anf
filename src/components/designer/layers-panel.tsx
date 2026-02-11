"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDesignerStore } from "@/stores/designer-store";
import { useFarmStore } from "@/stores/farm-store";
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

export function LayersPanel() {
  const layerVisibility = useDesignerStore((s) => s.layerVisibility);
  const toggleLayerVisibility = useDesignerStore(
    (s) => s.toggleLayerVisibility
  );
  const elements = useFarmStore((s) => s.elements);
  const orchardConfig = useFarmStore((s) => s.orchardConfig);

  // Count elements per layer
  const counts: Record<string, number> = {};
  for (const el of elements) {
    counts[el.layer] = (counts[el.layer] || 0) + 1;
  }

  return (
    <div className="w-[200px] shrink-0 border-l bg-sidebar flex flex-col">
      <div className="px-3 py-2 border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Layers
        </h3>
      </div>
      <div className="flex-1 overflow-auto p-1">
        {LAYERS.map((layer) => {
          const visible = layerVisibility[layer.id];
          const count = counts[layer.id] || 0;
          return (
            <Button
              key={layer.id}
              variant="ghost"
              className="w-full justify-between h-9 px-2 text-xs"
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

      {/* Farm info */}
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
          <div>{orchardConfig.bedCount} beds × {orchardConfig.bedWidthFt}ft | Trench: {orchardConfig.pathWidthFt}ft</div>
          <div>Grid: {orchardConfig.gridSpacingFt}ft | Elements: {elements.length}</div>
        </div>
      </div>
    </div>
  );
}
