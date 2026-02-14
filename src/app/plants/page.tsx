import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PlantLibrary = lazy(() =>
  import("@/components/plants/plant-library").then((m) => ({
    default: m.PlantLibrary,
  }))
);

function PlantsSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      {/* Tabs skeleton */}
      <Skeleton className="h-9 w-56" />
      {/* Filter bar skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-6 w-40" />
      </div>
      {/* Card grid skeleton */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function PlantsPage() {
  return (
    <Suspense fallback={<PlantsSkeleton />}>
      <PlantLibrary />
    </Suspense>
  );
}
