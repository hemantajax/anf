"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ZONE_SUMMARY } from "@/lib/constants";

export function ZoneOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Zoning Strategy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ZONE_SUMMARY.map((zone) => (
          <div
            key={zone.name}
            className="flex items-start gap-3 rounded-lg border p-3"
          >
            <div
              className={`mt-0.5 h-8 w-1.5 rounded-full ${zone.color} shrink-0`}
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{zone.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {zone.acres} acres
                </Badge>
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {zone.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {zone.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
