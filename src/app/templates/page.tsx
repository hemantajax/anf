"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const TemplateManager = dynamic(
  () =>
    import("@/components/templates/template-manager").then(
      (m) => m.TemplateManager,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 md:p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-xl" />
          ))}
        </div>
      </div>
    ),
  },
);

export default function TemplatesPage() {
  return <TemplateManager />;
}
