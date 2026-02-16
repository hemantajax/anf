import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const FarmStoryPage = lazy(() =>
  import("@/components/story/farm-story").then((m) => ({
    default: m.FarmStoryPage,
  }))
);

function StorySkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <Skeleton className="h-[200px] rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[180px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={<StorySkeleton />}>
      <FarmStoryPage />
    </Suspense>
  );
}
