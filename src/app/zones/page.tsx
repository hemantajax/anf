import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ZoneManager = lazy(() =>
  import("@/components/zones/zone-manager").then((m) => ({
    default: m.ZoneManager,
  }))
);

function ZoneSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-96" />
      </div>
      {/* Content grid skeleton */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Card grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[140px] rounded-xl" />
          ))}
        </div>
        {/* Chart sidebar */}
        <Skeleton className="h-[360px] rounded-xl" />
      </div>
    </div>
  );
}

export default function ZonesPage() {
  return (
    <Suspense fallback={<ZoneSkeleton />}>
      <ZoneManager />
    </Suspense>
  );
}
