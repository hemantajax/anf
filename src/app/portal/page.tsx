import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CustomerPortal = lazy(() =>
  import("@/components/portal/customer-portal").then((m) => ({
    default: m.CustomerPortal,
  }))
);

function PortalSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[80px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[250px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function PortalPage() {
  return (
    <Suspense fallback={<PortalSkeleton />}>
      <CustomerPortal />
    </Suspense>
  );
}
