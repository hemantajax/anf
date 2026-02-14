"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  TreesIcon,
  IndianRupee,
  TrendingUp,
  Layers,
  Calculator,
  Landmark,
  MapPin,
  Printer,
  PieChart,
  Calendar,
  ArrowUpRight,
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
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  computeBlockDensity,
  computeAcreDensity,
  computeFarmDensity,
  getCategorySummary,
  getPlantDisplayList,
  type MiddleBedType,
  type BlockDensity,
  type AcreDensity,
} from "@/lib/density-utils";
import {
  computeIncomeProjection,
  formatLakhs,
  formatINR,
  PLANT_INCOME_PROFILES,
  type IncomeProjection,
} from "@/lib/income-utils";
import type { PalekarModel } from "@/lib/orchard-utils";
import { useZoneStore } from "@/stores/zone-store";

// ================================================================
// Stat Card
// ================================================================
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
}) {
  return (
    <Card className="gap-3">
      <CardContent className="flex items-center gap-4 pt-0">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
            accent ? "" : "bg-primary/10 text-primary"
          }`}
          style={
            accent
              ? { backgroundColor: `${accent}18`, color: accent }
              : undefined
          }
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tabular-nums leading-none">
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
          {sub && (
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">
              {sub}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ================================================================
// Category Stacked Bar
// ================================================================
function CategoryBar({
  categories,
  total,
}: {
  categories: ReturnType<typeof getCategorySummary>;
  total: number;
}) {
  return (
    <div className="space-y-3">
      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        {categories.map((cat) => (
          <div
            key={cat.category}
            className="h-full transition-all"
            style={{
              width: `${(cat.count / total) * 100}%`,
              backgroundColor: cat.color,
            }}
            title={`${cat.label}: ${cat.count.toLocaleString("en-IN")}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
        {categories.map((cat) => (
          <div key={cat.category} className="flex items-center gap-2 text-sm">
            <span
              className="size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <span className="truncate text-muted-foreground text-xs">
              {cat.label}
            </span>
            <span className="ml-auto font-mono text-xs font-medium tabular-nums">
              {cat.count.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================================================================
// Utilization Donut
// ================================================================
function UtilizationDonut({
  utilization,
  blocksPerAcre,
  theoreticalBlocks,
}: {
  utilization: number;
  blocksPerAcre: number;
  theoreticalBlocks: number;
}) {
  const pct = Math.round(utilization * 100);
  const data = [
    { name: "Productive", value: pct },
    { name: "Roads/Infra", value: 100 - pct },
  ];
  const COLORS = ["#22c55e", "#e5e7eb"];

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-[140px] w-[140px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </RechartsPie>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{pct}%</span>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Productive Area</span>
          <span className="font-mono font-medium ml-auto">{pct}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-gray-200" />
          <span className="text-muted-foreground">Roads & Infrastructure</span>
          <span className="font-mono font-medium ml-auto">{100 - pct}%</span>
        </div>
        <Separator className="my-1" />
        <p className="text-xs text-muted-foreground">
          {blocksPerAcre} modules/acre (of {theoreticalBlocks} theoretical)
        </p>
      </div>
    </div>
  );
}

// ================================================================
// Income Stacked Bar Chart
// ================================================================
function IncomeBarChart({ projection }: { projection: IncomeProjection }) {
  const chartData = useMemo(() => {
    return projection.years.map((yr) => {
      const row: Record<string, number | string> = { year: `Yr ${yr.year}` };
      for (const cat of yr.categories) {
        row[cat.profileId] = Math.round(cat.income / 1000);
      }
      return row;
    });
  }, [projection]);

  const activeProfiles = useMemo(() => {
    const ids = new Set(projection.categoryTotals.map((c) => c.id));
    return PLANT_INCOME_PROFILES.filter((p) => ids.has(p.id));
  }, [projection]);

  return (
    <div className="h-[320px] w-full">
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
            content={<IncomeTooltip />}
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value) => {
              const profile = PLANT_INCOME_PROFILES.find(
                (p) => p.id === value
              );
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

// ================================================================
// Cumulative Area Chart
// ================================================================
function CumulativeChart({ projection }: { projection: IncomeProjection }) {
  const chartData = useMemo(() => {
    return projection.years.map((yr) => ({
      year: `Yr ${yr.year}`,
      income: Math.round((yr.totalIncome / 100000) * 10) / 10,
      cumulative: Math.round((yr.cumulativeIncome / 100000) * 10) / 10,
    }));
  }, [projection]);

  return (
    <div className="h-[320px] w-full">
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
            content={<IncomeTooltip mode="area" />}
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

// ================================================================
// Income Tooltip
// ================================================================
function IncomeTooltip({
  active,
  payload,
  label,
  mode = "stacked",
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
  mode?: "stacked" | "area";
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-lg text-xs z-50">
      <p className="font-semibold mb-1.5">{label}</p>
      <div className="space-y-1">
        {payload
          .filter((entry) => (entry.value ?? 0) > 0)
          .map((entry, i) => {
            const profile = PLANT_INCOME_PROFILES.find(
              (p) => p.id === entry.dataKey
            );
            const displayName =
              mode === "area"
                ? entry.dataKey === "income"
                  ? "Annual Income"
                  : "Cumulative"
                : profile?.label ?? entry.dataKey;
            const displayValue =
              mode === "area"
                ? `₹${(entry.value ?? 0).toFixed(1)} Lakh`
                : `₹${((entry.value ?? 0) * 1000).toLocaleString("en-IN")}`;

            return (
              <div
                key={i}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-muted-foreground">{displayName}</span>
                </div>
                <span className="font-mono font-medium tabular-nums">
                  {displayValue}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

// ================================================================
// Zone Breakdown Card
// ================================================================
function ZoneBreakdownCard({
  zone,
  model,
  middleBed,
}: {
  zone: { name: string; color: string; acres: number; strategy: string };
  model: PalekarModel;
  middleBed: MiddleBedType;
}) {
  const farm = useMemo(
    () => computeFarmDensity(model, zone.acres, middleBed),
    [model, zone.acres, middleBed]
  );
  const income = useMemo(
    () => computeIncomeProjection(model, zone.acres, middleBed),
    [model, zone.acres, middleBed]
  );
  const yr5 = income.years[4];

  return (
    <Card className="gap-3">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span
            className="size-3 rounded-full shrink-0"
            style={{ backgroundColor: zone.color }}
          />
          <CardTitle className="text-sm">{zone.name}</CardTitle>
          <Badge variant="outline" className="text-[10px] font-mono ml-auto">
            {zone.acres} acre{zone.acres > 1 ? "s" : ""}
          </Badge>
        </div>
        <CardDescription className="text-xs line-clamp-2">
          {zone.strategy}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md bg-muted/50 px-2 py-1.5">
            <p className="text-muted-foreground">Plants</p>
            <p className="font-mono font-semibold">
              {farm.totalPlants.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="rounded-md bg-muted/50 px-2 py-1.5">
            <p className="text-muted-foreground">Modules</p>
            <p className="font-mono font-semibold">
              {farm.totalBlocks.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="rounded-md bg-muted/50 px-2 py-1.5">
            <p className="text-muted-foreground">Yr 5 Income</p>
            <p className="font-mono font-semibold text-green-600">
              {formatLakhs(yr5.totalIncome)}
            </p>
          </div>
          <div className="rounded-md bg-muted/50 px-2 py-1.5">
            <p className="text-muted-foreground">10-Yr Total</p>
            <p className="font-mono font-semibold text-green-600">
              {formatLakhs(income.grandTotal)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ================================================================
// Projection Table
// ================================================================
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
            <th className="py-2 pr-3 font-medium text-muted-foreground sticky left-0 bg-card z-10 whitespace-nowrap">
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
                  <span className="hidden sm:inline">
                    {p.label.split(" (")[0]}
                  </span>
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
              <td className="py-2 pr-3 font-medium sticky left-0 bg-card z-10 whitespace-nowrap">
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
                    {income > 0 ? (
                      formatLakhs(income)
                    ) : (
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
          <tr className="font-semibold border-t-2">
            <td className="py-2 pr-3 sticky left-0 bg-card z-10 whitespace-nowrap">
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

// ================================================================
// Plant Count Table
// ================================================================
function PlantCountTable({
  counts,
  label,
}: {
  counts: Record<string, number>;
  label: string;
}) {
  const plants = useMemo(() => getPlantDisplayList(counts), [counts]);
  const total = plants.reduce((s, p) => s + p.count, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-4 font-medium text-muted-foreground">
              Plant
            </th>
            <th className="py-2 px-4 text-right font-medium text-muted-foreground">
              {label}
            </th>
            <th className="py-2 pl-4 text-right font-medium text-muted-foreground">
              %
            </th>
          </tr>
        </thead>
        <tbody>
          {plants.map((p) => (
            <tr key={p.id} className="border-b border-border/50">
              <td className="py-2 pr-4">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block size-3 rounded-full shrink-0 border"
                    style={{
                      backgroundColor: p.fill,
                      borderColor: p.stroke,
                    }}
                  />
                  <span>{p.label}</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono px-1 py-0"
                  >
                    {p.shortLabel}
                  </Badge>
                </div>
              </td>
              <td className="py-2 px-4 text-right font-mono tabular-nums font-medium">
                {p.count.toLocaleString("en-IN")}
              </td>
              <td className="py-2 pl-4 text-right font-mono tabular-nums text-muted-foreground">
                {total > 0 ? ((p.count / total) * 100).toFixed(1) : 0}%
              </td>
            </tr>
          ))}
          <tr className="font-semibold">
            <td className="py-2 pr-4">Total</td>
            <td className="py-2 px-4 text-right font-mono tabular-nums">
              {total.toLocaleString("en-IN")}
            </td>
            <td className="py-2 pl-4 text-right font-mono tabular-nums">
              100%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ================================================================
// Income Category Breakdown Bar
// ================================================================
function IncomeCategoryBar({
  projection,
}: {
  projection: IncomeProjection;
}) {
  const total = projection.grandTotal;

  return (
    <div className="space-y-3">
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

// ================================================================
// Main Farm Report Component
// ================================================================
export function FarmReport() {
  const [model, setModel] = useState<PalekarModel>("24x24");
  const [middleBed, setMiddleBed] = useState<MiddleBedType>("bed2");
  const [acres, setAcres] = useState(10);
  const [chartView, setChartView] = useState<"stacked" | "cumulative">(
    "stacked"
  );
  const zones = useZoneStore((s) => s.zones);
  const totalZoneAcres = zones.reduce((s, z) => s + z.acres, 0);

  // ---- Computations ----
  const block: BlockDensity = useMemo(
    () => computeBlockDensity(model, middleBed),
    [model, middleBed]
  );
  const acre: AcreDensity = useMemo(
    () => computeAcreDensity(model, middleBed),
    [model, middleBed]
  );
  const farm = useMemo(
    () => computeFarmDensity(model, acres, middleBed),
    [model, acres, middleBed]
  );
  const projection: IncomeProjection = useMemo(
    () => computeIncomeProjection(model, acres, middleBed),
    [model, acres, middleBed]
  );
  const farmCategories = useMemo(
    () => getCategorySummary(farm.plantBreakdown),
    [farm]
  );

  const year1 = projection.years[0];
  const year5 = projection.years[4];
  const year10 = projection.years[9];

  // ---- Print handler ----
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 space-y-6 print:p-2">
      {/* ══════════════ Header ══════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="size-6 text-primary" />
            Farm Report
          </h1>
          <p className="text-muted-foreground mt-1">
            Consolidated plant counts, area utilization, income projections, and
            zone breakdown for your farm.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 print:hidden shrink-0"
          onClick={handlePrint}
        >
          <Printer className="size-4" />
          Print / Export PDF
        </Button>
      </div>

      {/* ══════════════ Controls ══════════════ */}
      <div className="flex flex-wrap items-center gap-4 print:hidden">
        <Tabs
          value={model}
          onValueChange={(v) => setModel(v as PalekarModel)}
        >
          <TabsList>
            <TabsTrigger value="24x24">24 × 24 ft</TabsTrigger>
            <TabsTrigger value="36x36">36 × 36 ft</TabsTrigger>
          </TabsList>
        </Tabs>

        {model === "24x24" && (
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">
              Middle bed:
            </Label>
            <Tabs
              value={middleBed}
              onValueChange={(v) => setMiddleBed(v as MiddleBedType)}
            >
              <TabsList className="h-7">
                <TabsTrigger
                  value="bed2"
                  className="text-xs px-2 py-0.5 h-6"
                >
                  BA / PA
                </TabsTrigger>
                <TabsTrigger
                  value="bed4"
                  className="text-xs px-2 py-0.5 h-6"
                >
                  Vine / Veg
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Label htmlFor="report-acres" className="text-sm whitespace-nowrap">
            Productive Acres:
          </Label>
          <Input
            id="report-acres"
            type="number"
            min={1}
            max={1000}
            value={acres}
            onChange={(e) =>
              setAcres(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20 font-mono"
          />
        </div>

        <Badge variant="outline" className="text-xs font-mono">
          {model} model · {acres} acre{acres > 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Print-only header with config */}
      <div className="hidden print:block text-xs text-muted-foreground border-b pb-2 mb-4">
        Model: {model} · {acres} acres · Middle bed:{" "}
        {middleBed === "bed2" ? "BA/PA" : "Vine/Veg"} · Generated:{" "}
        {new Date().toLocaleDateString("en-IN")}
      </div>

      {/* ══════════════ 1. Executive Summary ══════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="size-4 text-primary" />
          <h2 className="text-lg font-semibold">Executive Summary</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={TreesIcon}
            label="Total Plants"
            value={farm.totalPlants}
            sub={`${acre.totalPlantsPerAcre.toLocaleString("en-IN")} per acre × ${acres} acres`}
            accent="#22c55e"
          />
          <StatCard
            icon={Layers}
            label="Total Modules"
            value={farm.totalBlocks}
            sub={`${acre.blocksPerAcre} per acre · ${block.blockSizeFt} ft modules`}
            accent="#3b82f6"
          />
          <StatCard
            icon={IndianRupee}
            label="Year 5 Annual Income"
            value={formatLakhs(year5.totalIncome)}
            sub="Small & medium trees producing"
            accent="#16a34a"
          />
          <StatCard
            icon={ArrowUpRight}
            label="10-Year Cumulative"
            value={formatLakhs(projection.grandTotal)}
            sub={`Avg ${formatLakhs(Math.round(projection.grandTotal / 10))}/year`}
            accent="#f59e0b"
          />
        </div>
      </section>

      <Separator />

      {/* ══════════════ 2. Area Utilization ══════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="size-4 text-primary" />
          <h2 className="text-lg font-semibold">Area Utilization</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Land Use Breakdown
              </CardTitle>
              <CardDescription className="text-xs">
                {Math.round(acre.utilization * 100)}% of each acre is
                productive after deducting roads, ponds, sheds, and boundary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UtilizationDonut
                utilization={acre.utilization}
                blocksPerAcre={acre.blocksPerAcre}
                theoreticalBlocks={acre.theoreticalBlocksPerAcre}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Module Tiling</CardTitle>
              <CardDescription className="text-xs">
                How K-modules tile across the productive area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-muted/50 px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    Module Size
                  </p>
                  <p className="font-mono font-semibold">
                    {acre.kSizeFt} × {acre.kSizeFt} ft
                  </p>
                </div>
                <div className="rounded-md bg-muted/50 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Tile Area</p>
                  <p className="font-mono font-semibold">
                    {acre.tileAreaSqFt.toLocaleString("en-IN")} sq ft
                  </p>
                </div>
                <div className="rounded-md bg-muted/50 px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    Theoretical / Acre
                  </p>
                  <p className="font-mono font-semibold">
                    {acre.theoreticalBlocksPerAcre} modules
                  </p>
                </div>
                <div className="rounded-md bg-muted/50 px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    Actual / Acre
                  </p>
                  <p className="font-mono font-semibold">
                    {acre.blocksPerAcre} modules
                  </p>
                </div>
                <div className="rounded-md bg-muted/50 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Beds/Module</p>
                  <p className="font-mono font-semibold">
                    {block.bedCount} beds
                  </p>
                </div>
                <div className="rounded-md bg-muted/50 px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    Plants/Module
                  </p>
                  <p className="font-mono font-semibold">
                    {block.grandTotal}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* ══════════════ 3. Plant Counts ══════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="size-4 text-primary" />
          <h2 className="text-lg font-semibold">Plant Count Breakdown</h2>
          <Badge variant="outline" className="text-xs font-mono ml-2">
            {farm.totalPlants.toLocaleString("en-IN")} plants · {acres} acres
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Category Distribution
              </CardTitle>
              <CardDescription className="text-xs">
                Distribution of{" "}
                {farm.totalPlants.toLocaleString("en-IN")} plants across
                categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBar
                categories={farmCategories}
                total={farm.totalPlants}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Detailed Plant Table
              </CardTitle>
              <CardDescription className="text-xs">
                Individual plant species counts for {acres} acres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlantCountTable
                counts={farm.plantBreakdown}
                label={`${acres} Acres`}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* ══════════════ 4. Zone Breakdown ══════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="size-4 text-primary" />
          <h2 className="text-lg font-semibold">Zone Breakdown</h2>
          <Badge variant="outline" className="text-xs font-mono ml-2">
            {zones.length} zone{zones.length !== 1 ? "s" : ""} ·{" "}
            {totalZoneAcres} acres
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => (
            <ZoneBreakdownCard
              key={zone.id}
              zone={zone}
              model={model}
              middleBed={middleBed}
            />
          ))}
        </div>

        {/* Zone totals summary */}
        <Card className="mt-4">
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-4 font-medium text-muted-foreground">
                      Zone
                    </th>
                    <th className="py-2 px-3 text-right font-medium text-muted-foreground">
                      Acres
                    </th>
                    <th className="py-2 px-3 text-right font-medium text-muted-foreground">
                      Plants
                    </th>
                    <th className="py-2 px-3 text-right font-medium text-muted-foreground">
                      Modules
                    </th>
                    <th className="py-2 px-3 text-right font-medium text-muted-foreground">
                      Yr 5 Income
                    </th>
                    <th className="py-2 pl-3 text-right font-medium text-muted-foreground">
                      10-Yr Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone) => {
                    const zFarm = computeFarmDensity(
                      model,
                      zone.acres,
                      middleBed
                    );
                    const zIncome = computeIncomeProjection(
                      model,
                      zone.acres,
                      middleBed
                    );
                    return (
                      <tr
                        key={zone.id}
                        className="border-b border-border/50"
                      >
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="size-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: zone.color }}
                            />
                            <span className="font-medium">{zone.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums">
                          {zone.acres}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums">
                          {zFarm.totalPlants.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums">
                          {zFarm.totalBlocks.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums text-green-600">
                          {formatLakhs(zIncome.years[4].totalIncome)}
                        </td>
                        <td className="py-2 pl-3 text-right font-mono tabular-nums font-medium text-green-600">
                          {formatLakhs(zIncome.grandTotal)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-semibold border-t-2">
                    <td className="py-2 pr-4">Total</td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {totalZoneAcres}
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {zones
                        .reduce(
                          (s, z) =>
                            s +
                            computeFarmDensity(model, z.acres, middleBed)
                              .totalPlants,
                          0
                        )
                        .toLocaleString("en-IN")}
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {zones
                        .reduce(
                          (s, z) =>
                            s +
                            computeFarmDensity(model, z.acres, middleBed)
                              .totalBlocks,
                          0
                        )
                        .toLocaleString("en-IN")}
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums text-green-600">
                      {formatLakhs(
                        zones.reduce(
                          (s, z) =>
                            s +
                            computeIncomeProjection(
                              model,
                              z.acres,
                              middleBed
                            ).years[4].totalIncome,
                          0
                        )
                      )}
                    </td>
                    <td className="py-2 pl-3 text-right font-mono tabular-nums font-medium text-green-600">
                      {formatLakhs(
                        zones.reduce(
                          (s, z) =>
                            s +
                            computeIncomeProjection(
                              model,
                              z.acres,
                              middleBed
                            ).grandTotal,
                          0
                        )
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* ══════════════ 5. Income Projection ══════════════ */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IndianRupee className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">Income Projection</h2>
          </div>
          <Tabs
            value={chartView}
            onValueChange={(v) =>
              setChartView(v as "stacked" | "cumulative")
            }
          >
            <TabsList className="h-8 print:hidden">
              <TabsTrigger value="stacked" className="text-xs px-3 h-7">
                By Category
              </TabsTrigger>
              <TabsTrigger value="cumulative" className="text-xs px-3 h-7">
                Cumulative
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Key income stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          <StatCard
            icon={Calendar}
            label="Year 1 Income"
            value={formatLakhs(year1.totalIncome)}
            sub="Banana, Papaya, ground cover"
          />
          <StatCard
            icon={TrendingUp}
            label="Year 5 Income"
            value={formatLakhs(year5.totalIncome)}
            sub="Small & medium trees start"
          />
          <StatCard
            icon={TreesIcon}
            label="Year 10 Income"
            value={formatLakhs(year10.totalIncome)}
            sub="All trees at maturity"
          />
          <StatCard
            icon={IndianRupee}
            label="10-Year Total"
            value={formatLakhs(projection.grandTotal)}
            sub={`Avg ${formatLakhs(Math.round(projection.grandTotal / 10))}/yr`}
          />
        </div>

        {/* Charts */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm">
              {chartView === "stacked"
                ? "Year-wise Income by Category"
                : "Cumulative Income Growth"}
            </CardTitle>
            <CardDescription className="text-xs">
              {acres} acre{acres > 1 ? "s" : ""} · {model} Palekar model ·
              Conservative estimates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartView === "stacked" ? (
              <IncomeBarChart projection={projection} />
            ) : (
              <CumulativeChart projection={projection} />
            )}
          </CardContent>
        </Card>

        {/* Income category breakdown */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm">
              10-Year Income Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Total {formatINR(projection.grandTotal)} over 10 years
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeCategoryBar projection={projection} />
          </CardContent>
        </Card>

        {/* Year-wise table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Detailed Year-wise Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Conservative farm-gate estimates · {acres} acre
              {acres > 1 ? "s" : ""} · {model} Palekar model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectionTable projection={projection} />
          </CardContent>
        </Card>
      </section>

      {/* ══════════════ Disclaimer ══════════════ */}
      <p className="text-[10px] text-muted-foreground/60 text-center max-w-2xl mx-auto print:text-left">
        Disclaimer: All figures are conservative estimates based on Palekar
        Natural Farming (ZBNF) literature and average farm-gate prices. Actual
        results depend on variety selection, soil health, climate, management
        practices, market conditions, and post-harvest handling. This report is
        for planning purposes only.
      </p>
    </div>
  );
}
