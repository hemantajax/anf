"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { SizeCategory } from "@/types/farm";

const CATEGORIES: { label: string; value: SizeCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Big", value: "big" },
  { label: "Medium", value: "medium" },
  { label: "Small", value: "small" },
  { label: "Bush", value: "bush" },
];

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeCategory: SizeCategory | "all";
  onCategoryChange: (value: SizeCategory | "all") => void;
  resultCount: number;
}

export function FilterBar({
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search name, code, or species..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Category filter badges */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onCategoryChange(value)}
            className="focus:outline-none"
          >
            <Badge
              variant={activeCategory === value ? "default" : "outline"}
              className="cursor-pointer text-xs select-none"
            >
              {label}
            </Badge>
          </button>
        ))}
      </div>

      {/* Result count */}
      <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
        {resultCount} {resultCount === 1 ? "plant" : "plants"}
      </span>
    </div>
  );
}
