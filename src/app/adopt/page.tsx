import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const AdoptTree = lazy(() =>
  import("@/components/adopt/adopt-tree").then((m) => ({
    default: m.AdoptTree,
  }))
);

function AdoptSkeleton() {
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
      <Skeleton className="h-[120px] rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[280px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function AdoptPage() {
  return (
    <Suspense fallback={<AdoptSkeleton />}>
      <AdoptTree />
    </Suspense>
  );
}
