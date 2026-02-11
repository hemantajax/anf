"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANT_SUMMARY } from "@/lib/constants";

const total = PLANT_SUMMARY.reduce((acc, p) => acc + p.count, 0);

export function PlantDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Plant Distribution (10 Acres)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {PLANT_SUMMARY.map((plant) => {
          const pct = ((plant.count / total) * 100).toFixed(1);
          return (
            <div key={plant.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: plant.color }}
                  />
                  <span>{plant.name}</span>
                </div>
                <span className="font-medium tabular-nums">
                  {plant.count.toLocaleString()}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({pct}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: plant.color,
                  }}
                />
              </div>
            </div>
          );
        })}
        <div className="pt-2 border-t flex justify-between text-sm font-medium">
          <span>Total</span>
          <span>{total.toLocaleString()} plants</span>
        </div>
      </CardContent>
    </Card>
  );
}
