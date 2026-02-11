"use client";

import { BarChart3 } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function ReportsPage() {
  return (
    <PagePlaceholder
      icon={BarChart3}
      title="Reports & Calculations"
      description="Auto-calculated plant counts, area utilization, and income projections based on your farm design."
      phase="Phase 5"
      features={[
        "Plant Counts",
        "Area Utilization",
        "Income Projection",
        "Zone Breakdown",
        "Year-wise Chart",
        "Export PDF",
      ]}
    />
  );
}
