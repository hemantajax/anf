"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BLOCK_TEMPLATE_OPTIONS,
  ZONE_COLOR_PRESETS,
  DEFAULT_FARM,
} from "@/lib/constants";
import type { Zone } from "@/types/farm";

interface ZoneEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zone: Zone | null; // null = create mode
  existingZones: Zone[];
  onSave: (zone: Zone) => void;
}

function emptyZone(): Zone {
  return {
    id: nanoid(),
    name: "",
    color: ZONE_COLOR_PRESETS[0].value,
    acres: 1,
    strategy: "",
    blockTemplateId: BLOCK_TEMPLATE_OPTIONS[0].id,
    bounds: { x: 0, y: 0, width: 200, height: 200 },
  };
}

export function ZoneEditSheet({
  open,
  onOpenChange,
  zone,
  existingZones,
  onSave,
}: ZoneEditSheetProps) {
  const isEditing = zone !== null;
  const [draft, setDraft] = useState<Zone>(emptyZone);

  // Reset draft when sheet opens / zone changes
  useEffect(() => {
    if (open) {
      setDraft(zone ? { ...zone } : emptyZone());
    }
  }, [open, zone]);

  const otherAcres = existingZones
    .filter((z) => z.id !== draft.id)
    .reduce((sum, z) => sum + z.acres, 0);
  const maxAcres = DEFAULT_FARM.netProductiveAcres - otherAcres;
  const acresError = draft.acres > maxAcres || draft.acres <= 0;
  const nameError = draft.name.trim().length === 0;

  const canSave = !acresError && !nameError;

  function handleSave() {
    if (!canSave) return;
    onSave(draft);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Zone" : "Add New Zone"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update zone configuration and strategy."
              : "Create a new farm zone with strategy and template."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="zone-name">Zone Name</Label>
            <Input
              id="zone-name"
              placeholder="e.g. Zone D"
              value={draft.name}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value }))
              }
            />
            {nameError && (
              <p className="text-xs text-destructive">Name is required.</p>
            )}
          </div>

          {/* Strategy */}
          <div className="space-y-2">
            <Label htmlFor="zone-strategy">Strategy / Description</Label>
            <textarea
              id="zone-strategy"
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="e.g. High Cash Flow — Banana + Guava dominant, heavy fertigation"
              value={draft.strategy}
              onChange={(e) =>
                setDraft((d) => ({ ...d, strategy: e.target.value }))
              }
            />
          </div>

          {/* Acres */}
          <div className="space-y-2">
            <Label htmlFor="zone-acres">
              Acres{" "}
              <span className="text-muted-foreground font-normal">
                (max {maxAcres > 0 ? maxAcres : 0} remaining)
              </span>
            </Label>
            <Input
              id="zone-acres"
              type="number"
              min={0.5}
              max={maxAcres}
              step={0.5}
              value={draft.acres}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  acres: parseFloat(e.target.value) || 0,
                }))
              }
            />
            {acresError && (
              <p className="text-xs text-destructive">
                Must be between 0.5 and {maxAcres} acres.
              </p>
            )}
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label>Zone Color</Label>
            <div className="flex flex-wrap gap-2">
              {ZONE_COLOR_PRESETS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className="relative h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  style={{
                    backgroundColor: c.value,
                    borderColor:
                      draft.color === c.value ? "var(--foreground)" : "transparent",
                  }}
                  title={c.label}
                  onClick={() => setDraft((d) => ({ ...d, color: c.value }))}
                />
              ))}
            </div>
          </div>

          {/* Block Template */}
          <div className="space-y-2">
            <Label>Block Template</Label>
            <Select
              value={draft.blockTemplateId}
              onValueChange={(v) =>
                setDraft((d) => ({ ...d, blockTemplateId: v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {BLOCK_TEMPLATE_OPTIONS.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <span className="flex items-center gap-2">
                      {t.name}
                      <Badge
                        variant="outline"
                        className="text-[10px] ml-1 px-1.5 py-0"
                      >
                        {t.size}
                      </Badge>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex-row gap-2 border-t pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="flex-1" disabled={!canSave} onClick={handleSave}>
            {isEditing ? "Save Changes" : "Create Zone"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
