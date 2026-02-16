import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CropJourney = lazy(() =>
  import("@/components/journey/crop-journey").then((m) => ({
    default: m.CropJourney,
  }))
);

function JourneySkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[80px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function JourneyPage() {
  return (
    <Suspense fallback={<JourneySkeleton />}>
      <CropJourney />
    </Suspense>
  );
}
