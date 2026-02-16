import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LiveFarm = lazy(() =>
  import("@/components/live/live-farm").then((m) => ({
    default: m.LiveFarm,
  }))
);

function LiveSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-[160px] rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[250px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function LivePage() {
  return (
    <Suspense fallback={<LiveSkeleton />}>
      <LiveFarm />
    </Suspense>
  );
}
