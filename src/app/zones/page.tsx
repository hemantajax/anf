"use client";

import { MapPin } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function ZonesPage() {
  return (
    <PagePlaceholder
      icon={MapPin}
      title="Zone Manager"
      description="Define farm zones (A, B, C) with different strategies — assign block templates, set acreage, and configure crop priorities."
      phase="Phase 5"
      features={[
        "Zone A - Cash Flow",
        "Zone B - Balanced",
        "Zone C - Premium",
        "Template Assignment",
        "Acreage Config",
        "Strategy Notes",
      ]}
    />
  );
}
