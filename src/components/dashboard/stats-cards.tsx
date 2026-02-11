"use client";

import {
  LandPlot,
  Trees,
  Grid3X3,
  Layers,
  IndianRupee,
  Sprout,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_FARM, PLANT_SUMMARY } from "@/lib/constants";

const stats = [
  {
    title: "Total Land",
    value: `${DEFAULT_FARM.totalAcres} acres`,
    subtitle: `${DEFAULT_FARM.netProductiveAcres} productive`,
    icon: LandPlot,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    title: "Orchard Blocks",
    value: DEFAULT_FARM.totalBlocks.toLocaleString(),
    subtitle: "36×36 ft each",
    icon: Grid3X3,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Total Plants",
    value: DEFAULT_FARM.totalPlants.toLocaleString(),
    subtitle: `${PLANT_SUMMARY.length} categories`,
    icon: Trees,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    title: "Farm Zones",
    value: "3 zones",
    subtitle: "A · B · C",
    icon: Layers,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    title: "Year 5+ Income",
    value: "₹55-70L",
    subtitle: "Steady state / year",
    icon: IndianRupee,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    title: "Net Productive",
    value: `${DEFAULT_FARM.netProductiveAcres} acres`,
    subtitle: `${DEFAULT_FARM.reservedAcres}ac reserved`,
    icon: Sprout,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/30",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`rounded-md p-1.5 ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
