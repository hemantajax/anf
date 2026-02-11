"use client";

import { Grid3X3 } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function TemplatesPage() {
  return (
    <PagePlaceholder
      icon={Grid3X3}
      title="Block Templates"
      description="Design reusable block layouts (36×36, 24×24, or custom) with plants, trenches, and beds — then stamp them across your farm."
      phase="Phase 3"
      features={[
        "Template Editor",
        "36×36 Standard",
        "24×24 Compact",
        "Drag & Drop Plants",
        "Trench Config",
        "Bed Rows",
        "Save / Duplicate",
        "Preview",
      ]}
    />
  );
}
