"use client";

import { PenTool } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function DesignerPage() {
  return (
    <PagePlaceholder
      icon={PenTool}
      title="Farm Designer"
      description="Visual canvas editor for designing your farm layout — draw roads, trenches, stamp blocks, and place plants."
      phase="Phase 2"
      features={[
        "Konva.js Canvas",
        "Grid Overlay",
        "Zoom / Pan",
        "Road Tool",
        "Trench Tool",
        "Block Stamp",
        "Plant Placement",
        "Snap to Grid",
        "Layers Panel",
        "Undo / Redo",
      ]}
    />
  );
}
