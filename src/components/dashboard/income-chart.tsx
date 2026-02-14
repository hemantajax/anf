"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INCOME_DATA } from "@/lib/constants";

const COLORS = ["#95d5b2", "#74c69d", "#52b788", "#40916c", "#2d6a4f"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DashboardTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-lg text-xs">
      <p className="font-semibold mb-1">{label}</p>
      <p className="font-mono tabular-nums">₹{payload[0].value} Lakh</p>
    </div>
  );
}

export function IncomeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Income Projection (Farm-Gate, Conservative)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={INCOME_DATA}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                opacity={0.3}
              />
              <XAxis
                dataKey="year"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                fontSize={12}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                fontSize={12}
                tickFormatter={(v) => `₹${v}L`}
              />
              <Tooltip
                content={<DashboardTooltip />}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
              />
              <Bar dataKey="income" radius={[6, 6, 0, 0]}>
                {INCOME_DATA.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
