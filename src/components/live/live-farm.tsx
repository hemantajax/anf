"use client";

import {
  Radio,
  Calendar,
  Camera,
  Activity,
  MapPin,
  Beaker,
  Eye,
  Scissors,
  Wrench,
  CloudRain,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sprout,
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
import { ZONE_SUMMARY } from "@/lib/constants";
import type { ActivityType, HarvestStatus } from "@/types/customer";

const ACTIVITY_ICONS: Record<ActivityType, React.ReactNode> = {
  input: <Beaker className="size-3.5" />,
  observation: <Eye className="size-3.5" />,
  harvest: <Scissors className="size-3.5" />,
  maintenance: <Wrench className="size-3.5" />,
  weather: <CloudRain className="size-3.5" />,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  input: "bg-blue-500",
  observation: "bg-purple-500",
  harvest: "bg-amber-500",
  maintenance: "bg-gray-500",
  weather: "bg-cyan-500",
};

const HARVEST_STATUS_STYLE: Record<
  HarvestStatus,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  ready: {
    icon: <CheckCircle2 className="size-4" />,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
  },
  upcoming: {
    icon: <Clock className="size-4" />,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/20",
  },
  harvested: {
    icon: <Scissors className="size-4" />,
    color: "text-gray-500",
    bg: "bg-gray-50 dark:bg-gray-950/20",
  },
};

function formatDateRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 0) return "Today";
    if (absDays === 1) return "Yesterday";
    if (absDays < 7) return `${absDays} days ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function LiveFarm() {
  const { activities, harvestCalendar, photoJournal, batches } =
    useJourneyStore();

  const readyToHarvest = harvestCalendar.filter((h) => h.status === "ready");
  const upcomingHarvests = harvestCalendar.filter(
    (h) => h.status === "upcoming"
  );
  const activeBatches = batches.filter((b) => b.status !== "harvested");

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Radio className="size-6" />
          Live Farm Window
        </h1>
        <p className="text-muted-foreground mt-1">
          See what&apos;s happening on the farm right now — real-time updates,
          harvest calendar, and photo journal.
        </p>
      </div>

      {/* Current season overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sprout className="size-4" />
            Current Season — Rabi 2025-26
          </CardTitle>
          <CardDescription>
            What&apos;s growing across our 12-acre farm right now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {ZONE_SUMMARY.map((zone) => {
              const zoneBatches = activeBatches.filter(
                (b) => b.zone === zone.name
              );
              return (
                <div
                  key={zone.name}
                  className="rounded-lg border p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-3 rounded-full ${zone.color}`}
                    />
                    <span className="font-medium text-sm">{zone.name}</span>
                    <Badge variant="outline" className="text-[10px] ml-auto">
                      {zone.acres} acres
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {zone.description}
                  </p>
                  {zoneBatches.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {zoneBatches.map((b) => (
                        <Badge
                          key={b.id}
                          variant="secondary"
                          className="text-[10px]"
                        >
                          {b.cropName}{" "}
                          {b.variety ? `(${b.variety})` : ""}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content: Activity Log + Photo Journal */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList>
              <TabsTrigger value="activity">Farm Activity</TabsTrigger>
              <TabsTrigger value="photos">Photo Journal</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="size-4" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Daily log of everything happening on the farm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 space-y-4">
                    <div className="absolute left-[11px] top-1 bottom-1 w-px bg-border" />
                    {activities.map((activity) => (
                      <div key={activity.id} className="relative">
                        <div
                          className={`absolute -left-6 top-0.5 size-[22px] rounded-full ${ACTIVITY_COLORS[activity.type]} flex items-center justify-center text-white`}
                        >
                          {ACTIVITY_ICONS[activity.type]}
                        </div>
                        <div className="pl-2">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString(
                                "en-IN",
                                {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
                            </span>
                            {activity.zone && (
                              <Badge
                                variant="outline"
                                className="text-[10px] py-0"
                              >
                                <MapPin className="size-2.5 mr-0.5" />
                                {activity.zone}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos" className="space-y-3">
              <div className="grid gap-4 sm:grid-cols-2">
                {photoJournal.map((photo) => (
                  <Card key={photo.id}>
                    <CardContent className="pt-4">
                      <div className="aspect-video rounded-lg bg-muted flex items-center justify-center mb-3">
                        <Camera className="size-8 text-muted-foreground/50" />
                      </div>
                      <h4 className="font-medium text-sm">{photo.title}</h4>
                      {photo.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {photo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(photo.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {photo.zone && (
                          <Badge
                            variant="outline"
                            className="text-[10px] py-0"
                          >
                            {photo.zone}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar: Harvest Calendar */}
        <div className="space-y-6">
          {/* Ready to harvest */}
          {readyToHarvest.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-emerald-600">
                  <AlertCircle className="size-4" />
                  Ready to Harvest!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {readyToHarvest.map((h) => {
                  const style = HARVEST_STATUS_STYLE[h.status];
                  return (
                    <div
                      key={h.id}
                      className={`rounded-lg p-3 ${style.bg}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{h.crop}</span>
                        <span className={`${style.color}`}>{style.icon}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {h.zone}
                        {h.estimatedQuantity && (
                          <>
                            <span>·</span>
                            <span>{h.estimatedQuantity}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Upcoming harvests */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="size-4" />
                Harvest Calendar
              </CardTitle>
              <CardDescription>What&apos;s coming up</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingHarvests.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border text-sm"
                >
                  <div>
                    <span className="font-medium">{h.crop}</span>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {h.zone}
                      {h.estimatedQuantity && (
                        <>
                          <span>·</span>
                          <span>{h.estimatedQuantity}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {formatDateRelative(h.expectedDate)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Farm Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Crops</span>
                <span className="font-medium">{activeBatches.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Ready for Harvest
                </span>
                <span className="font-medium text-emerald-600">
                  {readyToHarvest.length}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Upcoming Harvests</span>
                <span className="font-medium">{upcomingHarvests.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Photo Updates</span>
                <span className="font-medium">{photoJournal.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
