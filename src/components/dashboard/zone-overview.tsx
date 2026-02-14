"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useZoneStore } from "@/stores/zone-store";

export function ZoneOverview() {
  const zones = useZoneStore((s) => s.zones);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Zoning Strategy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {zones.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No zones configured yet.
          </p>
        )}
        {zones.map((zone) => {
          // Extract label from strategy (before em-dash if present)
          const [label, ...rest] = zone.strategy.split("—");
          const description = rest.join("—").trim();

          return (
            <div
              key={zone.id}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <div
                className="mt-0.5 h-8 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: zone.color }}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{zone.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {zone.acres} acres
                  </Badge>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {label.trim()}
                </p>
                {description && (
                  <p className="text-xs text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
