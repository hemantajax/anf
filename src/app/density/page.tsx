import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DensityCalculator = lazy(() =>
  import("@/components/density/density-calculator").then((m) => ({
    default: m.DensityCalculator,
  }))
);

function DensitySkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-10 w-56" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[180px] rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function DensityPage() {
  return (
    <Suspense fallback={<DensitySkeleton />}>
      <DensityCalculator />
    </Suspense>
  );
}
