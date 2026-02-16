import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SeasonalConnect = lazy(() =>
  import("@/components/connect/seasonal-connect").then((m) => ({
    default: m.SeasonalConnect,
  }))
);

function ConnectSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[80px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[200px] rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[280px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<ConnectSkeleton />}>
      <SeasonalConnect />
    </Suspense>
  );
}
