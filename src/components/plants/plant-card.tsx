"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PlantType, VegetableType, SizeCategory } from "@/types/farm";

export const SIZE_BADGE_CLASSES: Record<SizeCategory, string> = {
  big: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  small: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  bush: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
};

export function isVegetable(
  item: PlantType | VegetableType
): item is VegetableType {
  return "rowSpacingFt" in item;
}

interface PlantCardProps {
  item: PlantType | VegetableType;
  onSelect?: (item: PlantType | VegetableType) => void;
}

export function PlantCard({ item, onSelect }: PlantCardProps) {
  const badgeClass = SIZE_BADGE_CLASSES[item.sizeCategory] ?? "";
  const varieties = item.varieties ?? [];

  return (
    <Card
      className="relative overflow-hidden py-0 gap-0 transition-shadow hover:shadow-md cursor-pointer"
      style={{ borderLeftWidth: 4, borderLeftColor: item.color }}
      onClick={() => onSelect?.(item)}
    >
      {/* Header: symbol + code badge */}
      <div className="flex items-start justify-between px-4 pt-4">
        <span
          className="flex items-center justify-center h-12 w-12 rounded-xl bg-muted/60 text-[2rem] leading-none"
          style={{ fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif" }}
          role="img"
          aria-label={item.name}
        >
          {item.symbol}
        </span>
        <Badge
          variant="outline"
          className="font-mono text-xs font-bold shrink-0"
          style={{ borderColor: item.color, color: item.color }}
        >
          {item.code}
        </Badge>
      </div>

      {/* Name + scientific name */}
      <div className="px-4 pt-3 space-y-0.5">
        <h3 className="font-semibold text-sm leading-tight">{item.name}</h3>
        <p className="text-xs text-muted-foreground italic truncate">
          {item.scientificName}
        </p>
      </div>

      {/* Size category badge */}
      <div className="px-4 pt-2">
        <Badge variant="ghost" className={`text-[10px] px-1.5 py-0 ${badgeClass}`}>
          {item.sizeCategory}
        </Badge>
      </div>

      {/* Varieties — single line */}
      {varieties.length > 0 && (
        <div className="px-4 pt-2.5">
          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 shrink-0 font-semibold"
              style={{ borderColor: item.color, color: item.color }}
            >
              {varieties.length} varieties
            </Badge>
            <p className="text-[11px] text-muted-foreground truncate leading-tight">
              {varieties.join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 pt-3 pb-4 flex gap-3 text-xs text-muted-foreground border-t mt-3">
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {item.spacingFt} ft
          </span>
          <span>Spacing</span>
        </div>
        {isVegetable(item) ? (
          <>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {item.rowSpacingFt} ft
              </span>
              <span>Row gap</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-foreground capitalize">
                {item.seasonality}
              </span>
              <span>Season</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">
                {item.canopyRadiusFt} ft
              </span>
              <span>Canopy</span>
            </div>
            {item.incomePerPlantPerYear != null && (
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  {"\u20B9"}{item.incomePerPlantPerYear.toLocaleString("en-IN")}
                </span>
                <span>Income/yr</span>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
