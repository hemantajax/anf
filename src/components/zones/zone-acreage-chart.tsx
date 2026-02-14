"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_FARM } from "@/lib/constants";
import type { Zone } from "@/types/farm";

interface ZoneAcreageChartProps {
  zones: Zone[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-lg text-xs">
      <p className="font-semibold">{name}</p>
      <p className="font-mono tabular-nums">{value} acres</p>
    </div>
  );
}

export function ZoneAcreageChart({ zones }: ZoneAcreageChartProps) {
  const allocated = zones.reduce((sum, z) => sum + z.acres, 0);
  const unallocated = Math.max(
    0,
    DEFAULT_FARM.netProductiveAcres - allocated
  );

  const data = [
    ...zones.map((z) => ({ name: z.name, value: z.acres, color: z.color })),
    ...(unallocated > 0
      ? [{ name: "Unallocated", value: unallocated, color: "#d4d4d8" }]
      : []),
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Acreage Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats below chart */}
        <div className="grid grid-cols-3 gap-3 mt-2 pt-3 border-t">
          <div className="text-center">
            <p className="text-lg font-bold">{zones.length}</p>
            <p className="text-[11px] text-muted-foreground">Zones</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{allocated}</p>
            <p className="text-[11px] text-muted-foreground">Allocated</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{unallocated}</p>
            <p className="text-[11px] text-muted-foreground">Remaining</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
