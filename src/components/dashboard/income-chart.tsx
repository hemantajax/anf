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
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--card-foreground))",
                }}
                formatter={(value) => [`₹${value} Lakh`, "Income"]}
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
