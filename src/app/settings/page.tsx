"use client";

import { Settings } from "lucide-react";
import { PagePlaceholder } from "@/components/page-placeholder";

export default function SettingsPage() {
  return (
    <PagePlaceholder
      icon={Settings}
      title="Settings"
      description="Configure app preferences — theme, default grid size, measurement units, and export options."
      phase="Phase 6"
      features={[
        "Dark / Light Theme",
        "Grid Size Default",
        "Units (ft / m)",
        "Export Format",
        "Auto-save Toggle",
        "Reset Data",
      ]}
    />
  );
}
