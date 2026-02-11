"use client";

import { Trees } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function PlantsPage() {
  return (
    <PagePlaceholder
      icon={Trees}
      title="Plant Library"
      description="Manage all plant types — big trees, medium trees, small trees, banana, papaya, guava — with color, icon, and spacing rules."
      phase="Phase 5"
      features={[
        "Plant CRUD",
        "Categories",
        "Color Coding",
        "Spacing Rules",
        "Canopy Radius",
        "Income per Plant",
        "Custom Icons",
      ]}
    />
  );
}
