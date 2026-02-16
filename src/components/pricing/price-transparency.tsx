"use client";

import { useState } from "react";
import {
  BadgeIndianRupee,
  TrendingUp,
  ShieldCheck,
  Scale,
  ArrowRight,
  Leaf,
  Clock,
  Heart,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { usePriceStore } from "@/stores/price-store";
import {
  COMMODITY_PROFILES,
  calculatePremiumPercent,
  formatPrice,
  getSeasonLabel,
  generatePriceHistory,
} from "@/lib/pricing-utils";
import type { PriceEntry } from "@/types/customer";

function PriceBreakdownCard({ entry }: { entry: PriceEntry }) {
  const premium = calculatePremiumPercent(entry.mandiPrice, entry.ourPrice);
  const profile = COMMODITY_PROFILES.find(
    (c) => c.name === entry.commodity || entry.commodity.includes(c.name)
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {profile?.icon && <span className="text-xl">{profile.icon}</span>}
              {entry.commodity}
              {entry.variety && (
                <Badge variant="secondary" className="text-xs font-normal">
                  {entry.variety}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              per {entry.unit}
              {profile && ` · Season: ${getSeasonLabel(profile.seasonality)}`}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="text-xs border-amber-500 text-amber-600"
          >
            +{premium}% premium
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-3">
            <p className="text-xs text-muted-foreground mb-1">
              Market Price (Mandi avg)
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatPrice(entry.mandiPrice)}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-red-400 inline-block" />
                Chemical fertilizers included
              </p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-red-400 inline-block" />
                Pesticide residue likely
              </p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-red-400 inline-block" />
                Artificial ripening possible
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900 p-3">
            <p className="text-xs text-muted-foreground mb-1">Our Price</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatPrice(entry.ourPrice)}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                100% natural inputs only
              </p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                Zero chemical residue
              </p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                Tree-ripened naturally
              </p>
            </div>
          </div>
        </div>

        {/* Cost breakdown */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Info className="size-3.5" />
            Where every rupee goes
          </h4>
          <div className="space-y-1.5">
            {entry.costBreakdown.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">{item.label}</span>
                </div>
                <span className="font-medium">{formatPrice(item.amount)}</span>
              </div>
            ))}
            <Separator className="my-1" />
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Total</span>
              <span className="text-emerald-600">
                {formatPrice(entry.ourPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Ripening time comparison */}
        {profile && (
          <div className="rounded-lg bg-muted/50 p-3">
            <h4 className="text-xs font-medium mb-2 flex items-center gap-1.5">
              <Clock className="size-3" />
              Growing Time Comparison
            </h4>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    Chemical
                  </span>
                  <span className="text-xs font-medium">
                    {profile.chemicalDaysToRipe} days
                  </span>
                </div>
                <div className="h-2 rounded-full bg-red-200 dark:bg-red-900">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{
                      width: `${(profile.chemicalDaysToRipe / profile.naturalDaysToRipe) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Natural</span>
                  <span className="text-xs font-medium">
                    {profile.naturalDaysToRipe} days
                  </span>
                </div>
                <div className="h-2 rounded-full bg-emerald-200 dark:bg-emerald-900">
                  <div className="h-2 rounded-full bg-emerald-500 w-full" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              We give our produce{" "}
              {profile.naturalDaysToRipe - profile.chemicalDaysToRipe} extra days
              to develop full nutrition and natural sweetness.
            </p>
          </div>
        )}

        {/* Benefits */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <Leaf className="size-3.5" />
            What you get
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {entry.benefits.map((benefit, i) => (
              <Badge key={i} variant="secondary" className="text-xs font-normal">
                {benefit}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PriceHistoryMini({ commodity }: { commodity: string }) {
  const history = generatePriceHistory(commodity);
  if (history.length === 0) return null;

  const maxPrice = Math.max(...history.map((h) => Math.max(h.mandiPrice, h.ourPrice)));

  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <h4 className="text-xs font-medium mb-3">
        12-Month Price Trend: {commodity}
      </h4>
      <div className="flex items-end gap-1 h-20">
        {history.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full flex flex-col items-center gap-0.5">
              <div
                className="w-full rounded-t bg-emerald-500/30 border-t-2 border-emerald-500"
                style={{ height: `${(h.ourPrice / maxPrice) * 60}px` }}
              />
              <div
                className="w-full rounded-t bg-red-500/30 border-t-2 border-red-500"
                style={{ height: `${(h.mandiPrice / maxPrice) * 60}px` }}
              />
            </div>
            <span className="text-[8px] text-muted-foreground">{h.month}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-emerald-500" />
          Our Price (stable)
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-red-500" />
          Mandi Price (fluctuates)
        </span>
      </div>
    </div>
  );
}

function DataSourceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Scale className="size-4" />
          Price Standardization Sources
        </CardTitle>
        <CardDescription>
          Our market benchmark prices come from official government sources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg border">
            <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-bold text-blue-600">
              1
            </div>
            <div>
              <h4 className="text-sm font-medium">data.gov.in — Open Data API</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daily wholesale prices from 3,000+ mandis. Ministry of
                Agriculture & Farmers Welfare. Updated daily.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border">
            <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-bold text-blue-600">
              2
            </div>
            <div>
              <h4 className="text-sm font-medium">
                eNAM — National Agriculture Market
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Live trading prices from 1,473 integrated mandis. Real-time
                commodity-wise, state-wise data.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg border">
            <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-bold text-blue-600">
              3
            </div>
            <div>
              <h4 className="text-sm font-medium">AGMARKNET 2.0</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Agricultural Marketing Information Network. Historical price
                trends and arrival data for benchmarking.
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          All market prices are verifiable from official government portals. We
          have nothing to hide.
        </p>
      </CardContent>
    </Card>
  );
}

export function PriceTransparency() {
  const { prices } = usePriceStore();
  const [selectedCommodity, setSelectedCommodity] = useState(
    prices[0]?.commodity ?? ""
  );

  const totalCommodities = prices.length;
  const avgPremium = Math.round(
    prices.reduce(
      (sum, p) => sum + calculatePremiumPercent(p.mandiPrice, p.ourPrice),
      0
    ) / totalCommodities
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BadgeIndianRupee className="size-6" />
          Price Transparency
        </h1>
        <p className="text-muted-foreground mt-1">
          See exactly where your money goes. Our prices benchmarked against
          official government mandi data — no secrets, no surprises.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <Leaf className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCommodities}</p>
              <p className="text-xs text-muted-foreground">
                Commodities tracked
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <TrendingUp className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">~{avgPremium}%</p>
              <p className="text-xs text-muted-foreground">Avg premium over mandi</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <ShieldCheck className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">100%</p>
              <p className="text-xs text-muted-foreground">
                Chemical-free guarantee
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Heart className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">Fair</p>
              <p className="text-xs text-muted-foreground">
                Farmer wages included
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="breakdown" className="space-y-4">
        <TabsList>
          <TabsTrigger value="breakdown">Price Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {prices.map((entry) => (
              <PriceBreakdownCard key={entry.id} entry={entry} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Why Our Price Stays Stable
              </CardTitle>
              <CardDescription>
                Mandi prices fluctuate wildly based on supply, middlemen, and
                season. Our price reflects actual cost of honest farming —
                consistent and fair.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {prices.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedCommodity(p.commodity)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedCommodity === p.commodity
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted border-border"
                    }`}
                  >
                    {p.commodity}
                  </button>
                ))}
              </div>
              <PriceHistoryMini commodity={selectedCommodity} />
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <p className="text-sm">
                  <strong className="text-amber-700 dark:text-amber-400">
                    Key insight:
                  </strong>{" "}
                  <span className="text-muted-foreground">
                    Market prices swing 20-40% across seasons. Our price stays
                    within 5% because we plan our costs honestly. You always know
                    what you&apos;re paying and why.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowRight className="size-4" />
                The Real Cost of &quot;Cheap&quot; Produce
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <span className="text-red-500 font-bold text-lg">1</span>
                  <div>
                    <h4 className="font-medium">Health Cost</h4>
                    <p className="text-muted-foreground text-xs">
                      Average Indian consumes 0.5mg pesticide residue daily. WHO
                      links this to cancer, hormonal disruption, and organ damage
                      over time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <span className="text-red-500 font-bold text-lg">2</span>
                  <div>
                    <h4 className="font-medium">Soil Destruction</h4>
                    <p className="text-muted-foreground text-xs">
                      Chemical farming degrades soil by 1-2% organic matter per
                      decade. India has already lost 30% of its topsoil
                      fertility.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <span className="text-red-500 font-bold text-lg">3</span>
                  <div>
                    <h4 className="font-medium">Water Contamination</h4>
                    <p className="text-muted-foreground text-xs">
                      Chemical runoff contaminates groundwater. You save Rs.20 on
                      produce but spend Rs.2000 on water purification and health.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <DataSourceCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
