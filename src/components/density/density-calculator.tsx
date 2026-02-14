"use client";

import { useMemo, useState } from "react";
import {
  TreesIcon,
  Calculator,
  Layers,
  ChevronDown,
  ChevronUp,
  Sprout,
  Landmark,
} from "lucide-react";
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
  computeBlockDensity,
  computeAcreDensity,
  computeFarmDensity,
  getPlantDisplayList,
  getCategorySummary,
  type BlockDensity,
  type AcreDensity,
  type MiddleBedType,
} from "@/lib/density-utils";
import type { PalekarModel } from "@/lib/orchard-utils";

// ---- Plant symbol dot ----
function PlantDot({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <span
      className="inline-block size-3 rounded-full shrink-0 border"
      style={{ backgroundColor: fill, borderColor: stroke }}
    />
  );
}

// ---- Bed breakdown card ----
function BedCard({
  bed,
}: {
  bed: BlockDensity["beds"][number];
}) {
  const [expanded, setExpanded] = useState(false);
  const plants = useMemo(() => getPlantDisplayList(bed.plants), [bed.plants]);

  const topPlants = expanded ? plants : plants.slice(0, 4);

  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            {bed.label}
          </CardTitle>
          <Badge variant="secondary" className="text-xs font-mono">
            {bed.total} plants
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {bed.bedType === 1 || bed.bedType === 3
            ? "B/M/S center trees + ground cover"
            : bed.bedType === 2
              ? "Banana & Papaya edges + interior crops"
              : "Vine vegetables + pavilion structure"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1.5">
          {topPlants.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <PlantDot fill={p.fill} stroke={p.stroke} />
                <span className="truncate text-muted-foreground">{p.label}</span>
              </div>
              <span className="font-mono text-xs font-medium tabular-nums ml-2">
                {p.count}
              </span>
            </div>
          ))}
        </div>
        {plants.length > 4 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="size-3" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="size-3" /> +{plants.length - 4} more
              </>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
}

// ---- Summary stat card ----
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
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
          <p className="text-2xl font-bold tabular-nums leading-none">
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
          {sub && (
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Category summary row ----
function CategoryBar({
  categories,
  total,
}: {
  categories: ReturnType<typeof getCategorySummary>;
  total: number;
}) {
  return (
    <div className="space-y-3">
      {/* Stacked bar */}
      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        {categories.map((cat) => (
          <div
            key={cat.category}
            className="h-full transition-all"
            style={{
              width: `${(cat.count / total) * 100}%`,
              backgroundColor: cat.color,
            }}
            title={`${cat.label}: ${cat.count}`}
          />
        ))}
      </div>

      {/* Legend grid */}
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

// ---- Detailed table ----
function PlantTable({
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
                  <PlantDot fill={p.fill} stroke={p.stroke} />
                  <span>{p.label}</span>
                  <Badge variant="outline" className="text-[10px] font-mono px-1 py-0">
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

// ---- Main component ----
export function DensityCalculator() {
  const [model, setModel] = useState<PalekarModel>("24x24");
  const [middleBed, setMiddleBed] = useState<MiddleBedType>("bed2");
  const [acres, setAcres] = useState(10);

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

  const blockCategories = useMemo(
    () => getCategorySummary(block.totalPerBlock),
    [block]
  );
  const farmCategories = useMemo(
    () => getCategorySummary(farm.plantBreakdown),
    [farm]
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Calculator className="size-6 text-primary" />
            Plant Density Calculator
          </h1>
          <p className="text-muted-foreground mt-1">
            See how many plants fit in each block, acre, and across your farm
            using the Palekar Natural Farming model.
          </p>
        </div>
      </div>

      {/* Model selector tabs */}
      <Tabs value={model} onValueChange={(v) => setModel(v as PalekarModel)}>
        <TabsList>
          <TabsTrigger value="24x24">24 × 24 ft</TabsTrigger>
          <TabsTrigger value="36x36">36 × 36 ft</TabsTrigger>
        </TabsList>

        {/* Content is the same for both, driven by `model` state */}
        <TabsContent value={model} className="space-y-6 mt-4">
          {/* ── SECTION 1: Per Block (K-module) ── */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                <h2 className="text-lg font-semibold">
                  Per K-Module ({block.blockSizeFt} ft)
                </h2>
                <Badge variant="outline" className="ml-2 font-mono text-xs">
                  {block.bedCount} beds · {block.grandTotal} plants
                </Badge>
              </div>

              {/* Middle bed toggle — only for 24×24 */}
              {model === "24x24" && (
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground whitespace-nowrap">
                    Middle bed:
                  </Label>
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
            </div>

            <p className="text-xs text-muted-foreground -mt-2">
              {model === "24x24"
                ? "K = 24ft (center Bed 1 → center Bed 3). Beds 1 & 3 carry B/M/S trees. Middle bed alternates."
                : "K = 36ft (center Bed 1 → center Bed 3). All 4 beds in one module."}
            </p>

            {/* Bed cards */}
            <div className={`grid gap-4 sm:grid-cols-2 ${
              block.bedCount === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
            }`}>
              {block.beds.map((bed) => (
                <BedCard key={bed.bedType} bed={bed} />
              ))}
            </div>

            {/* Category summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Module Summary — {block.bedCount} Beds
                </CardTitle>
                <CardDescription className="text-xs">
                  Distribution of {block.grandTotal.toLocaleString("en-IN")}{" "}
                  plants across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBar
                  categories={blockCategories}
                  total={block.grandTotal}
                />
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* ── SECTION 2: Per Acre ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Landmark className="size-4 text-primary" />
              <h2 className="text-lg font-semibold">Per Acre</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Layers}
                label="Modules per Acre"
                value={acre.blocksPerAcre}
                sub={`${acre.theoreticalBlocksPerAcre} theoretical × ${Math.round(acre.utilization * 100)}% utilization`}
              />
              <StatCard
                icon={TreesIcon}
                label="Plants per Acre"
                value={acre.totalPlantsPerAcre}
              />
              <StatCard
                icon={Sprout}
                label="K-Module Tile"
                value={`${acre.kSizeFt} × ${acre.kSizeFt} ft`}
                sub={`${acre.tileAreaSqFt.toLocaleString("en-IN")} sq ft (center-to-center)`}
              />
              <StatCard
                icon={Landmark}
                label="Utilization"
                value={`${Math.round(acre.utilization * 100)}%`}
                sub="After roads, ponds, sheds, boundary"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Per-Acre Plant Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PlantTable counts={acre.plantsPerAcre} label="Per Acre" />
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* ── SECTION 3: Farm Scale ── */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <TreesIcon className="size-4 text-primary" />
                <h2 className="text-lg font-semibold">Farm Scale Calculator</h2>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="acres-input" className="text-sm whitespace-nowrap">
                  Productive Acres:
                </Label>
                <Input
                  id="acres-input"
                  type="number"
                  min={1}
                  max={1000}
                  value={acres}
                  onChange={(e) =>
                    setAcres(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-24 font-mono"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={Layers}
                label={`Total Modules (${acres} acres)`}
                value={farm.totalBlocks}
              />
              <StatCard
                icon={TreesIcon}
                label={`Total Plants (${acres} acres)`}
                value={farm.totalPlants}
              />
              <StatCard
                icon={Calculator}
                label="Plants per Acre"
                value={acre.totalPlantsPerAcre}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Farm Plant Breakdown — {acres} Acres
                </CardTitle>
                <CardDescription className="text-xs">
                  {farm.totalBlocks.toLocaleString("en-IN")} modules ×{" "}
                  {block.grandTotal.toLocaleString("en-IN")} plants/module ={" "}
                  {farm.totalPlants.toLocaleString("en-IN")} total plants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBar
                  categories={farmCategories}
                  total={farm.totalPlants}
                />
                <div className="mt-4">
                  <PlantTable
                    counts={farm.plantBreakdown}
                    label={`${acres} Acres`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
