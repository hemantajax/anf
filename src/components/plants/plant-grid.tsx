"use client";

import { Leaf } from "lucide-react";
import { PlantCard } from "./plant-card";
import type { PlantType, VegetableType } from "@/types/farm";

interface PlantGridProps {
  items: (PlantType | VegetableType)[];
  onSelect?: (item: PlantType | VegetableType) => void;
}

export function PlantGrid({ items, onSelect }: PlantGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <Leaf className="h-10 w-10 mb-3 opacity-40" />
        <p className="text-sm font-medium">No plants found</p>
        <p className="text-xs mt-1">Try adjusting your search or filter.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <PlantCard key={item.id} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}
