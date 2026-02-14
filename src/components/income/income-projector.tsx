"use client";

import { useMemo, useState } from "react";
import {
  IndianRupee,
  TrendingUp,
  TreesIcon,
  Layers,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  computeIncomeProjection,
  formatLakhs,
  formatINR,
  PLANT_INCOME_PROFILES,
  type IncomeProjection,
} from "@/lib/income-utils";
import type { MiddleBedType } from "@/lib/density-utils";
import type { PalekarModel } from "@/lib/orchard-utils";

// ---- Stat card ----
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="gap-3">
      <CardContent className="flex items-center gap-4 pt-0">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tabular-nums leading-none">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
          {sub && (
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Stacked bar chart (year-wise by category) ----
function IncomeBarChart({ projection }: { projection: IncomeProjection }) {
  // Build recharts data: each year as a row, categories as keys
  const chartData = useMemo(() => {
    return projection.years.map((yr) => {
      const row: Record<string, number | string> = { year: `Yr ${yr.year}` };
      for (const cat of yr.categories) {
        row[cat.profileId] = Math.round(cat.income / 1000); // in thousands
      }
      return row;
    });
  }, [projection]);

  const activeProfiles = useMemo(() => {
    const ids = new Set(
      projection.categoryTotals.map((c) => c.id)
    );
    return PLANT_INCOME_PROFILES.filter((p) => ids.has(p.id));
  }, [projection]);

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-muted"
            opacity={0.3}
          />
          <XAxis
            dataKey="year"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickFormatter={(v) => `₹${v}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--card-foreground))",
              fontSize: 12,
            }}
            formatter={(value: number | undefined, name: string | undefined) => {
              const v = value ?? 0;
              const n = name ?? "";
              const profile = PLANT_INCOME_PROFILES.find((p) => p.id === n);
              return [`₹${(v * 1000).toLocaleString("en-IN")}`, profile?.label ?? n];
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value) => {
              const profile = PLANT_INCOME_PROFILES.find((p) => p.id === value);
              return profile?.label ?? value;
            }}
          />
          {activeProfiles.map((profile) => (
            <Bar
              key={profile.id}
              dataKey={profile.id}
              stackId="income"
              fill={profile.color}
              radius={0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---- Cumulative area chart ----
function CumulativeChart({ projection }: { projection: IncomeProjection }) {
  const chartData = useMemo(() => {
    return projection.years.map((yr) => ({
      year: `Yr ${yr.year}`,
      income: Math.round(yr.totalIncome / 100000 * 10) / 10,
      cumulative: Math.round(yr.cumulativeIncome / 100000 * 10) / 10,
    }));
  }, [projection]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-muted"
            opacity={0.3}
          />
          <XAxis
            dataKey="year"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            tickFormatter={(v) => `₹${v}L`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--card-foreground))",
              fontSize: 12,
            }}
            formatter={(value: number | undefined, name: string | undefined) => [
              `₹${(value ?? 0).toFixed(1)} Lakh`,
              (name ?? "") === "income" ? "Annual Income" : "Cumulative",
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value) =>
              value === "income" ? "Annual Income" : "Cumulative Income"
            }
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#16a34a"
            fill="#16a34a"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---- Year-wise table ----
function ProjectionTable({ projection }: { projection: IncomeProjection }) {
  const activeProfiles = useMemo(() => {
    const ids = new Set(projection.categoryTotals.map((c) => c.id));
    return PLANT_INCOME_PROFILES.filter((p) => ids.has(p.id));
  }, [projection]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-3 font-medium text-muted-foreground sticky left-0 bg-card z-10">
              Year
            </th>
            {activeProfiles.map((p) => (
              <th
                key={p.id}
                className="py-2 px-2 text-right font-medium text-muted-foreground whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="hidden sm:inline">{p.label.split(" (")[0]}</span>
                  <span className="sm:hidden">{p.id.slice(0, 3)}</span>
                </div>
              </th>
            ))}
            <th className="py-2 px-2 text-right font-medium text-muted-foreground">
              Annual
            </th>
            <th className="py-2 pl-2 text-right font-medium text-muted-foreground">
              Cumulative
            </th>
          </tr>
        </thead>
        <tbody>
          {projection.years.map((yr) => (
            <tr key={yr.year} className="border-b border-border/50">
              <td className="py-2 pr-3 font-medium sticky left-0 bg-card z-10">
                Year {yr.year}
              </td>
              {activeProfiles.map((profile) => {
                const cat = yr.categories.find(
                  (c) => c.profileId === profile.id
                );
                const income = cat?.income ?? 0;
                return (
                  <td
                    key={profile.id}
                    className="py-2 px-2 text-right font-mono tabular-nums text-xs"
                  >
                    {income > 0 ? formatLakhs(income) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                );
              })}
              <td className="py-2 px-2 text-right font-mono tabular-nums font-medium">
                {formatLakhs(yr.totalIncome)}
              </td>
              <td className="py-2 pl-2 text-right font-mono tabular-nums text-muted-foreground">
                {formatLakhs(yr.cumulativeIncome)}
              </td>
            </tr>
          ))}
          {/* Totals row */}
          <tr className="font-semibold border-t-2">
            <td className="py-2 pr-3 sticky left-0 bg-card z-10">
              10-Year Total
            </td>
            {activeProfiles.map((profile) => {
              const catTotal = projection.categoryTotals.find(
                (c) => c.id === profile.id
              );
              return (
                <td
                  key={profile.id}
                  className="py-2 px-2 text-right font-mono tabular-nums text-xs"
                >
                  {formatLakhs(catTotal?.total ?? 0)}
                </td>
              );
            })}
            <td className="py-2 px-2 text-right font-mono tabular-nums" />
            <td className="py-2 pl-2 text-right font-mono tabular-nums">
              {formatLakhs(projection.grandTotal)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ---- Category breakdown cards ----
function CategoryBreakdown({
  projection,
}: {
  projection: IncomeProjection;
}) {
  const total = projection.grandTotal;

  return (
    <div className="space-y-3">
      {/* Bar */}
      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        {projection.categoryTotals.map((cat) => (
          <div
            key={cat.id}
            className="h-full transition-all"
            style={{
              width: `${(cat.total / total) * 100}%`,
              backgroundColor: cat.color,
            }}
            title={`${cat.label}: ${formatINR(cat.total)}`}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
        {projection.categoryTotals.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2 text-sm">
            <span
              className="size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="truncate text-muted-foreground text-xs">
              {cat.label.split(" (")[0]}
            </span>
            <span className="ml-auto font-mono text-xs font-medium tabular-nums">
              {formatLakhs(cat.total)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Main component ----
export function IncomeProjector() {
  const [model, setModel] = useState<PalekarModel>("24x24");
  const [middleBed, setMiddleBed] = useState<MiddleBedType>("bed2");
  const [acres, setAcres] = useState(1);
  const [chartView, setChartView] = useState<"stacked" | "cumulative">("stacked");

  const projection: IncomeProjection = useMemo(
    () => computeIncomeProjection(model, acres, middleBed),
    [model, acres, middleBed]
  );

  const year1 = projection.years[0];
  const year5 = projection.years[4];
  const year10 = projection.years[9];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <IndianRupee className="size-6 text-primary" />
          Income Projection
        </h1>
        <p className="text-muted-foreground mt-1">
          Rough 10-year income estimate based on plant density and Palekar
          Natural Farming yield data.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <Tabs value={model} onValueChange={(v) => setModel(v as PalekarModel)}>
          <TabsList>
            <TabsTrigger value="24x24">24 × 24 ft</TabsTrigger>
            <TabsTrigger value="36x36">36 × 36 ft</TabsTrigger>
          </TabsList>
        </Tabs>

        {model === "24x24" && (
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Middle bed:</Label>
            <Tabs value={middleBed} onValueChange={(v) => setMiddleBed(v as MiddleBedType)}>
              <TabsList className="h-7">
                <TabsTrigger value="bed2" className="text-xs px-2 py-0.5 h-6">
                  BA / PA
                </TabsTrigger>
                <TabsTrigger value="bed4" className="text-xs px-2 py-0.5 h-6">
                  Vine / Veg
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Label htmlFor="income-acres" className="text-sm whitespace-nowrap">
            Acres:
          </Label>
          <Input
            id="income-acres"
            type="number"
            min={1}
            max={1000}
            value={acres}
            onChange={(e) => setAcres(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 font-mono"
          />
        </div>

        <Badge variant="outline" className="text-xs font-mono">
          {model} model · {acres} acre{acres > 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Key stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="Year 1 Income"
          value={formatLakhs(year1.totalIncome)}
          sub="Banana, Papaya, ground cover, veg"
        />
        <StatCard
          icon={TrendingUp}
          label="Year 5 Income"
          value={formatLakhs(year5.totalIncome)}
          sub="Small & medium trees start producing"
        />
        <StatCard
          icon={TreesIcon}
          label="Year 10 Income"
          value={formatLakhs(year10.totalIncome)}
          sub="All trees at full maturity"
        />
        <StatCard
          icon={IndianRupee}
          label="10-Year Cumulative"
          value={formatLakhs(projection.grandTotal)}
          sub={`Average ${formatLakhs(Math.round(projection.grandTotal / 10))}/year`}
        />
      </div>

      <Separator />

      {/* Charts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            Year-wise Projection
          </h2>
          <Tabs
            value={chartView}
            onValueChange={(v) => setChartView(v as "stacked" | "cumulative")}
          >
            <TabsList className="h-8">
              <TabsTrigger value="stacked" className="text-xs px-3 h-7">
                By Category
              </TabsTrigger>
              <TabsTrigger value="cumulative" className="text-xs px-3 h-7">
                Cumulative
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card>
          <CardContent className="pt-4">
            {chartView === "stacked" ? (
              <IncomeBarChart projection={projection} />
            ) : (
              <CumulativeChart projection={projection} />
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Detailed table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-primary" />
          <h2 className="text-lg font-semibold">Detailed Breakdown</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Year 1–10 Income by Category
            </CardTitle>
            <CardDescription className="text-xs">
              Conservative farm-gate estimates · {acres} acre{acres > 1 ? "s" : ""} ·{" "}
              {model} Palekar model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectionTable projection={projection} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              10-Year Category Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Total {formatINR(projection.grandTotal)} over 10 years
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryBreakdown projection={projection} />
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground/60 text-center max-w-2xl mx-auto">
        Disclaimer: These are rough conservative estimates based on Palekar Natural
        Farming literature and average farm-gate prices. Actual income depends on
        variety selection, soil, climate, management practices, market prices,
        and post-harvest handling.
      </p>
    </div>
  );
}
