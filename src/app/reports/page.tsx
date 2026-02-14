import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const FarmReport = lazy(() =>
  import("@/components/reports/farm-report").then((m) => ({
    default: m.FarmReport,
  }))
);

function ReportSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-10 w-20" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[90px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-px w-full" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[260px] rounded-xl" />
        <Skeleton className="h-[260px] rounded-xl" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
      <Skeleton className="h-px w-full" />
      <Skeleton className="h-[380px] rounded-xl" />
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<ReportSkeleton />}>
      <FarmReport />
    </Suspense>
  );
}
