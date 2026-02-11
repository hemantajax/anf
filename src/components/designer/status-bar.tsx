"use client";

import { useDesignerStore } from "@/stores/designer-store";
import { useFarmStore } from "@/stores/farm-store";
import { Badge } from "@/components/ui/badge";

const TOOL_LABELS: Record<string, string> = {
  select: "Select / Move",
  road: "Draw Road",
  trench: "Draw Trench",
  "flower-bed": "Draw Flower Bed",
  "block-stamp": "Block Stamp",
  plant: "Place Plant",
  zone: "Zone Paint",
  measure: "Measure",
  eraser: "Eraser",
};

export function StatusBar() {
  const activeTool = useDesignerStore((s) => s.activeTool);
  const viewport = useDesignerStore((s) => s.viewport);
  const snap = useDesignerStore((s) => s.snap);
  const elements = useFarmStore((s) => s.elements);
  const orchardConfig = useFarmStore((s) => s.orchardConfig);

  return (
    <div className="h-7 border-t bg-sidebar flex items-center px-3 gap-4 text-[11px] text-muted-foreground shrink-0">
      <div className="flex items-center gap-1.5">
        <span>Tool:</span>
        <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
          {TOOL_LABELS[activeTool] ?? activeTool}
        </Badge>
      </div>
      <div>
        Layout: {orchardConfig.widthFt}×{orchardConfig.heightFt}ft
      </div>
      <div>Zoom: {Math.round(viewport.scale * 100)}%</div>
      <div>Snap: {snap.enabled ? `${snap.gridSizeFt}ft` : "Off"}</div>
      <div>Elements: {elements.length}</div>
      <div className="flex-1" />
      <div>
        Pan: drag canvas | Zoom: scroll | Draw: click & drag
      </div>
    </div>
  );
}
