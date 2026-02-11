"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const DesignerLayout = dynamic(
  () =>
    import("@/components/designer/designer-layout").then(
      (m) => m.DesignerLayout
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-[400px] w-[600px]" />
          <p className="text-sm text-muted-foreground">
            Loading Farm Designer...
          </p>
        </div>
      </div>
    ),
  }
);

export default function DesignerPage() {
  return <DesignerLayout />;
}
