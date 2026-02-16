"use client";

import {
  CalendarHeart,
  MapPin,
  Users,
  Pen,
  Calendar,
  PartyPopper,
  GraduationCap,
  Sun,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquareQuote,
  Leaf,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomerStore } from "@/stores/customer-store";

const EVENT_ICONS: Record<string, React.ReactNode> = {
  "harvest-festival": <PartyPopper className="size-4" />,
  workshop: <GraduationCap className="size-4" />,
  "farm-day": <Sun className="size-4" />,
  special: <Star className="size-4" />,
};

const EVENT_COLORS: Record<string, string> = {
  "harvest-festival": "bg-amber-100 dark:bg-amber-950 text-amber-600",
  workshop: "bg-blue-100 dark:bg-blue-950 text-blue-600",
  "farm-day": "bg-emerald-100 dark:bg-emerald-950 text-emerald-600",
  special: "bg-purple-100 dark:bg-purple-950 text-purple-600",
};

const VISIT_STATUS_STYLE: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  requested: {
    icon: <Clock className="size-3.5" />,
    color: "text-amber-500",
    label: "Requested",
  },
  confirmed: {
    icon: <CheckCircle2 className="size-3.5" />,
    color: "text-emerald-500",
    label: "Confirmed",
  },
  completed: {
    icon: <CheckCircle2 className="size-3.5" />,
    color: "text-blue-500",
    label: "Completed",
  },
  cancelled: {
    icon: <XCircle className="size-3.5" />,
    color: "text-red-500",
    label: "Cancelled",
  },
};

const SEASON_LABELS: Record<string, { label: string; color: string }> = {
  kharif: { label: "Kharif (Monsoon)", color: "bg-blue-500" },
  rabi: { label: "Rabi (Winter)", color: "bg-amber-500" },
  zaid: { label: "Zaid (Summer)", color: "bg-red-500" },
  general: { label: "General", color: "bg-gray-500" },
};

export function SeasonalConnect() {
  const { visits, farmerNotes, events } = useCustomerStore();

  const upcomingEvents = events.filter(
    (e) => new Date(e.date) >= new Date()
  );
  const totalRegistrations = events.reduce(
    (sum, e) => sum + e.registrations,
    0
  );
  const confirmedVisits = visits.filter((v) => v.status === "confirmed").length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CalendarHeart className="size-6" />
          Farm Connect
        </h1>
        <p className="text-muted-foreground mt-1">
          Visit the farm, attend events, and hear directly from the farmer. Stay
          connected with every season.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <Calendar className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingEvents.length}</p>
              <p className="text-xs text-muted-foreground">Upcoming events</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Users className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalRegistrations}</p>
              <p className="text-xs text-muted-foreground">
                Event registrations
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <MapPin className="size-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{confirmedVisits}</p>
              <p className="text-xs text-muted-foreground">
                Confirmed farm visits
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Pen className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{farmerNotes.length}</p>
              <p className="text-xs text-muted-foreground">
                Farmer&apos;s notes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notes">Farmer&apos;s Notes</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="visits">Farm Visits</TabsTrigger>
        </TabsList>

        {/* Farmer's Notes */}
        <TabsContent value="notes" className="space-y-4">
          {farmerNotes.map((note) => {
            const seasonInfo = SEASON_LABELS[note.season];
            return (
              <Card key={note.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquareQuote className="size-4 text-emerald-600" />
                        {note.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        {new Date(note.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      <span
                        className={`size-1.5 rounded-full ${seasonInfo.color} inline-block mr-1`}
                      />
                      {seasonInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {note.content}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Leaf className="size-3 text-emerald-500" />
                    <span>
                      From the farmer&apos;s desk — honest updates, no
                      marketing.
                    </span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </TabsContent>

        {/* Events */}
        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const isPast = new Date(event.date) < new Date();
              const spotsLeft = event.capacity
                ? event.capacity - event.registrations
                : null;

              return (
                <Card key={event.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center ${EVENT_COLORS[event.type]}`}
                      >
                        {EVENT_ICONS[event.type]}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {new Date(event.date).toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <Badge variant="secondary" className="text-[10px]">
                        <Users className="size-2.5 mr-0.5" />
                        {event.registrations} registered
                      </Badge>
                      {spotsLeft !== null && (
                        <Badge
                          variant={spotsLeft <= 5 ? "destructive" : "outline"}
                          className="text-[10px]"
                        >
                          {spotsLeft <= 0
                            ? "Full"
                            : `${spotsLeft} spots left`}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    {isPast ? (
                      <Badge variant="secondary" className="w-full justify-center py-1.5">
                        Event Completed
                      </Badge>
                    ) : (
                      <Button
                        className="w-full"
                        size="sm"
                        disabled={spotsLeft !== null && spotsLeft <= 0}
                      >
                        <CalendarHeart className="size-4 mr-1.5" />
                        Register
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Farm Visits */}
        <TabsContent value="visits" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="size-4" />
                Farm Visit Bookings
              </CardTitle>
              <CardDescription>
                Schedule a visit to see natural farming in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {visits.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No farm visits scheduled yet.
                </p>
              ) : (
                visits.map((visit) => {
                  const statusStyle = VISIT_STATUS_STYLE[visit.status];
                  return (
                    <div
                      key={visit.id}
                      className="flex items-start justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <h4 className="text-sm font-medium">
                          {visit.visitorName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Calendar className="size-3" />
                          {new Date(visit.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          <span>·</span>
                          <Users className="size-3" />
                          {visit.numberOfPeople} people
                        </div>
                        {visit.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {visit.notes}
                          </p>
                        )}
                      </div>
                      <span
                        className={`flex items-center gap-1 text-xs font-medium ${statusStyle.color}`}
                      >
                        {statusStyle.icon}
                        {statusStyle.label}
                      </span>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Visit info card */}
          <Card className="bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900">
            <CardContent className="pt-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-medium text-sm mb-2">
                    What to Expect on Your Visit
                  </h4>
                  <div className="space-y-1.5">
                    {[
                      "Walk through all 12 acres of natural farmland",
                      "See Palekar ZBNF in practice — Jeevamrut preparation live",
                      "Meet our desi cow and understand her role",
                      "Taste fresh produce straight from the plant",
                      "Learn about intercropping and soil health",
                      "Visit your adopted tree (if applicable)",
                    ].map((item, i) => (
                      <p
                        key={i}
                        className="text-xs text-muted-foreground flex items-start gap-1.5"
                      >
                        <CheckCircle2 className="size-3 text-emerald-500 mt-0.5 shrink-0" />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Visit Details</h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="size-3" />
                      <span>Duration: 2-3 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="size-3" />
                      <span>Group size: 2-30 people</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3" />
                      <span>Available: Weekends & holidays</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="size-3" />
                      <span>Book at least 3 days in advance</span>
                    </div>
                    <Separator className="my-2" />
                    <p className="italic">
                      &quot;Come see where your food grows. The farm has nothing
                      to hide.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
