import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const IncomeProjector = lazy(() =>
  import("@/components/income/income-projector").then((m) => ({
    default: m.IncomeProjector,
  }))
);

function IncomeSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
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
      <Skeleton className="h-[380px] rounded-xl" />
      <Skeleton className="h-[300px] rounded-xl" />
    </div>
  );
}

export default function IncomePage() {
  return (
    <Suspense fallback={<IncomeSkeleton />}>
      <IncomeProjector />
    </Suspense>
  );
}
