"use client";

import { useState } from "react";
import {
  Route,
  Sprout,
  Flower2,
  Apple,
  Scissors,
  StickyNote,
  Beaker,
  Clock,
  MapPin,
  Leaf,
  QrCode,
  ChevronDown,
  ChevronUp,
  Droplets,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJourneyStore } from "@/stores/journey-store";
import type { CropBatch, MilestoneType, CropStatus } from "@/types/customer";

const MILESTONE_ICONS: Record<MilestoneType, React.ReactNode> = {
  planting: <Sprout className="size-4" />,
  input: <Beaker className="size-4" />,
  growth: <Leaf className="size-4" />,
  flowering: <Flower2 className="size-4" />,
  fruiting: <Apple className="size-4" />,
  harvest: <Scissors className="size-4" />,
  note: <StickyNote className="size-4" />,
};

const MILESTONE_COLORS: Record<MilestoneType, string> = {
  planting: "bg-emerald-500",
  input: "bg-blue-500",
  growth: "bg-green-500",
  flowering: "bg-pink-500",
  fruiting: "bg-orange-500",
  harvest: "bg-amber-500",
  note: "bg-gray-500",
};

const STATUS_BADGE: Record<CropStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  planted: { label: "Planted", variant: "secondary" },
  growing: { label: "Growing", variant: "default" },
  flowering: { label: "Flowering", variant: "default" },
  fruiting: { label: "Fruiting", variant: "default" },
  harvested: { label: "Harvested", variant: "outline" },
};

function BatchCard({ batch }: { batch: CropBatch }) {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = STATUS_BADGE[batch.status];

  const daysSincePlanting = Math.floor(
    (Date.now() - new Date(batch.plantingDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {batch.cropName}
              {batch.variety && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({batch.variety})
                </span>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <MapPin className="size-3" />
              {batch.zone}
              {batch.bed && ` · ${batch.bed}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            <button
              className="p-1 rounded hover:bg-muted"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/50 p-2.5 text-center">
            <p className="text-xs text-muted-foreground">Planted</p>
            <p className="text-sm font-medium">
              {new Date(batch.plantingDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2.5 text-center">
            <p className="text-xs text-muted-foreground">Days Growing</p>
            <p className="text-sm font-medium">{daysSincePlanting} days</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-2.5 text-center">
            <p className="text-xs text-muted-foreground">Inputs Applied</p>
            <p className="text-sm font-medium">
              {batch.naturalInputs.length} natural
            </p>
          </div>
        </div>

        {/* Ripening comparison */}
        {batch.naturalDaysToHarvest && batch.chemicalDaysToHarvest && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3">
            <p className="text-xs font-medium mb-2 flex items-center gap-1.5">
              <Clock className="size-3" />
              Growing Time Comparison
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-red-500 font-medium">
                Chemical: {batch.chemicalDaysToHarvest} days
              </span>
              <span className="text-muted-foreground">vs</span>
              <span className="text-emerald-500 font-medium">
                Natural: {batch.naturalDaysToHarvest} days
              </span>
              <Badge variant="secondary" className="text-[10px] ml-auto">
                +{batch.naturalDaysToHarvest - batch.chemicalDaysToHarvest} days
                more care
              </Badge>
            </div>
          </div>
        )}

        {/* Timeline */}
        {expanded && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-3">
                Journey Timeline ({batch.milestones.length} milestones)
              </h4>
              <div className="relative pl-6 space-y-4">
                <div className="absolute left-[11px] top-1 bottom-1 w-px bg-border" />
                {batch.milestones.map((milestone) => (
                  <div key={milestone.id} className="relative">
                    <div
                      className={`absolute -left-6 top-1 size-[22px] rounded-full ${MILESTONE_COLORS[milestone.type]} flex items-center justify-center text-white`}
                    >
                      {MILESTONE_ICONS[milestone.type]}
                    </div>
                    <div className="pl-2">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-medium">
                          {milestone.title}
                        </h5>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(milestone.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Natural Inputs Log */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                <Droplets className="size-3.5" />
                Natural Inputs Applied
              </h4>
              <div className="space-y-2">
                {batch.naturalInputs.map((input) => (
                  <div
                    key={input.id}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-sm"
                  >
                    <div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 shrink-0">
                      <Beaker className="size-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs">
                          {input.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(input.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {input.description}
                        {input.quantity && ` — ${input.quantity}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code placeholder */}
            <div className="rounded-lg border border-dashed p-4 text-center">
              <QrCode className="size-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">QR Code for this batch</p>
              <p className="text-xs text-muted-foreground mt-1">
                Scan to see the complete journey of this produce — from seed
                treatment to harvest. Every customer gets this with their
                purchase.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-3 py-1">
                <span>Batch ID: {batch.id}</span>
              </div>
            </div>
          </>
        )}

        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View full journey timeline
            <ChevronDown className="size-3" />
          </button>
        )}
      </CardContent>
    </Card>
  );
}

export function CropJourney() {
  const { batches } = useJourneyStore();

  const activeBatches = batches.filter((b) => b.status !== "harvested");
  const harvestedBatches = batches.filter((b) => b.status === "harvested");

  const totalMilestones = batches.reduce(
    (sum, b) => sum + b.milestones.length,
    0
  );
  const totalInputs = batches.reduce(
    (sum, b) => sum + b.naturalInputs.length,
    0
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Route className="size-6" />
          Crop Journey Tracker
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete traceability from seed to plate. Every crop, every input,
          every milestone — documented and verifiable.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <Sprout className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{batches.length}</p>
              <p className="text-xs text-muted-foreground">Active crop batches</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Route className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalMilestones}</p>
              <p className="text-xs text-muted-foreground">
                Milestones documented
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Beaker className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalInputs}</p>
              <p className="text-xs text-muted-foreground">
                Natural inputs applied
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <QrCode className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">100%</p>
              <p className="text-xs text-muted-foreground">QR traceable</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeBatches.length})
          </TabsTrigger>
          <TabsTrigger value="harvested">
            Harvested ({harvestedBatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeBatches.length === 0 ? (
            <Card className="py-12">
              <CardContent className="text-center text-muted-foreground">
                No active crop batches yet.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {activeBatches.map((batch) => (
                <BatchCard key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="harvested" className="space-y-4">
          {harvestedBatches.length === 0 ? (
            <Card className="py-12">
              <CardContent className="text-center text-muted-foreground">
                No harvested batches yet. Check back after the first harvest
                cycle.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {harvestedBatches.map((batch) => (
                <BatchCard key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
