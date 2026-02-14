"use client";

import { useCallback, useMemo, useState } from "react";
import { Trees, Sprout } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilterBar } from "./filter-bar";
import { PlantGrid } from "./plant-grid";
import { PlantDetailSheet } from "./plant-detail-sheet";
import type { PlantType, VegetableType, SizeCategory } from "@/types/farm";

import treesData from "@/data/trees.json";
import vegetablesData from "@/data/vegetables.json";

const trees = treesData as PlantType[];
const vegetables = vegetablesData as VegetableType[];

function filterItems<T extends { name: string; code: string; scientificName: string; sizeCategory: SizeCategory }>(
  items: T[],
  search: string,
  category: SizeCategory | "all"
): T[] {
  const q = search.toLowerCase().trim();
  return items.filter((item) => {
    const matchesCategory = category === "all" || item.sizeCategory === category;
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.scientificName.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
}

export function PlantLibrary() {
  const [treeSearch, setTreeSearch] = useState("");
  const [vegSearch, setVegSearch] = useState("");
  const [treeCategory, setTreeCategory] = useState<SizeCategory | "all">("all");
  const [vegCategory, setVegCategory] = useState<SizeCategory | "all">("all");

  // Sheet state
  const [selectedPlant, setSelectedPlant] = useState<PlantType | VegetableType | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSelect = useCallback((item: PlantType | VegetableType) => {
    setSelectedPlant(item);
    setSheetOpen(true);
  }, []);

  const filteredTrees = useMemo(
    () => filterItems(trees, treeSearch, treeCategory),
    [treeSearch, treeCategory]
  );

  const filteredVegetables = useMemo(
    () => filterItems(vegetables, vegSearch, vegCategory),
    [vegSearch, vegCategory]
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Plant Library</h1>
        <p className="text-sm text-muted-foreground">
          Browse all trees and vegetables with spacing, canopy, and income data.
        </p>
      </div>

      <Tabs defaultValue="trees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trees" className="gap-1.5">
            <Trees className="h-4 w-4" />
            Trees
            <span className="ml-1 text-xs text-muted-foreground">
              ({trees.length})
            </span>
          </TabsTrigger>
          <TabsTrigger value="vegetables" className="gap-1.5">
            <Sprout className="h-4 w-4" />
            Vegetables
            <span className="ml-1 text-xs text-muted-foreground">
              ({vegetables.length})
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Trees Tab */}
        <TabsContent value="trees" className="space-y-4">
          <FilterBar
            search={treeSearch}
            onSearchChange={setTreeSearch}
            activeCategory={treeCategory}
            onCategoryChange={setTreeCategory}
            resultCount={filteredTrees.length}
          />
          <PlantGrid items={filteredTrees} onSelect={handleSelect} />
        </TabsContent>

        {/* Vegetables Tab */}
        <TabsContent value="vegetables" className="space-y-4">
          <FilterBar
            search={vegSearch}
            onSearchChange={setVegSearch}
            activeCategory={vegCategory}
            onCategoryChange={setVegCategory}
            resultCount={filteredVegetables.length}
          />
          <PlantGrid items={filteredVegetables} onSelect={handleSelect} />
        </TabsContent>
      </Tabs>

      {/* Right offcanvas detail sheet */}
      <PlantDetailSheet
        item={selectedPlant}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
