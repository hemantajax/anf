"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { NAV_ITEMS } from "@/lib/constants";

export function Header() {
  const pathname = usePathname();

  const currentPage = NAV_ITEMS.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2">
              {currentPage && (
                <currentPage.icon className="size-4 text-muted-foreground" />
              )}
              {currentPage?.title ?? "Farm Architect"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {currentPage?.description && (
        <span className="hidden text-xs text-muted-foreground md:inline-block">
          — {currentPage.description}
        </span>
      )}
    </header>
  );
}
