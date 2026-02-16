import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PriceTransparency = lazy(() =>
  import("@/components/pricing/price-transparency").then((m) => ({
    default: m.PriceTransparency,
  }))
);

function PricingSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[80px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<PricingSkeleton />}>
      <PriceTransparency />
    </Suspense>
  );
}
