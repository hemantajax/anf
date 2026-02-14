"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SIZE_BADGE_CLASSES, isVegetable } from "./plant-card";
import type { PlantType, VegetableType } from "@/types/farm";

interface PlantDetailSheetProps {
  item: PlantType | VegetableType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlantDetailSheet({
  item,
  open,
  onOpenChange,
}: PlantDetailSheetProps) {
  if (!item) return null;

  const badgeClass = SIZE_BADGE_CLASSES[item.sizeCategory] ?? "";
  const varieties = item.varieties ?? [];
  const veg = isVegetable(item);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/60 text-[2.5rem] leading-none shrink-0"
              style={{ fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif" }}
              role="img"
              aria-label={item.name}
            >
              {item.symbol}
            </span>
            <div className="space-y-1 min-w-0">
              <SheetTitle className="text-lg">{item.name}</SheetTitle>
              <SheetDescription className="italic">
                {item.scientificName}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="px-4 space-y-5">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="font-mono text-xs font-bold"
              style={{ borderColor: item.color, color: item.color }}
            >
              {item.code}
            </Badge>
            <Badge variant="ghost" className={`text-xs px-2 py-0.5 ${badgeClass}`}>
              {item.sizeCategory}
            </Badge>
            {veg && (
              <Badge variant="secondary" className="text-xs capitalize">
                {item.seasonality} season
              </Badge>
            )}
          </div>

          <Separator />

          {/* Stats grid */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Specifications
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <StatBlock label="Plant Spacing" value={`${item.spacingFt} ft`} />
              {veg ? (
                <StatBlock label="Row Spacing" value={`${item.rowSpacingFt} ft`} />
              ) : (
                <StatBlock label="Canopy Radius" value={`${item.canopyRadiusFt} ft`} />
              )}
              {!veg && item.incomePerPlantPerYear != null && (
                <StatBlock
                  label="Income / Plant / Year"
                  value={`\u20B9${item.incomePerPlantPerYear.toLocaleString("en-IN")}`}
                />
              )}
              {veg && (
                <StatBlock label="Season" value={item.seasonality} className="capitalize" />
              )}
            </div>
          </div>

          {/* Varieties */}
          {varieties.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Varieties ({varieties.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {varieties.map((v) => (
                    <Badge
                      key={v}
                      variant="secondary"
                      className="text-xs font-normal px-2.5 py-1"
                    >
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Color swatch */}
          <Separator />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Map color:</span>
            <span
              className="inline-block h-5 w-5 rounded-full border"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-mono text-muted-foreground">
              {item.color}
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StatBlock({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${className ?? ""}`}>{value}</p>
    </div>
  );
}
