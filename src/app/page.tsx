import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const StatsCards = lazy(() =>
  import("@/components/dashboard/stats-cards").then((m) => ({
    default: m.StatsCards,
  }))
);

const IncomeChart = lazy(() =>
  import("@/components/dashboard/income-chart").then((m) => ({
    default: m.IncomeChart,
  }))
);

const PlantDistribution = lazy(() =>
  import("@/components/dashboard/plant-distribution").then((m) => ({
    default: m.PlantDistribution,
  }))
);

const ZoneOverview = lazy(() =>
  import("@/components/dashboard/zone-overview").then((m) => ({
    default: m.ZoneOverview,
  }))
);

const QuickActions = lazy(() =>
  import("@/components/dashboard/quick-actions").then((m) => ({
    default: m.QuickActions,
  }))
);

function CardSkeleton({ className }: { className?: string }) {
  return <Skeleton className={`h-[120px] w-full rounded-xl ${className}`} />;
}

function ChartSkeleton() {
  return <Skeleton className="h-[340px] w-full rounded-xl" />;
}

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Hero */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Farm Architect Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          12-Acre Modular Orchard Master Plan — Overview & quick access to all
          tools.
        </p>
      </div>

      {/* Stats */}
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <StatsCards />
      </Suspense>

      {/* Charts + Zones + Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<ChartSkeleton />}>
            <IncomeChart />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <PlantDistribution />
          </Suspense>
        </div>
        <div className="space-y-6">
          <Suspense fallback={<ChartSkeleton />}>
            <ZoneOverview />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <QuickActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
