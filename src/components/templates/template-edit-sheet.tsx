"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { TemplatePreview } from "./template-preview";
import { buildBlockTemplate } from "@/lib/constants";
import {
  configFromBedCount,
  ORCHARD_PRESETS,
  validateOrchardConfig,
  type PalekarModel,
} from "@/lib/orchard-utils";
import type { BlockTemplate, BaBedMode } from "@/types/farm";

interface TemplateEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: BlockTemplate | null;
  onSave: (template: BlockTemplate) => void;
}

const BA_BED_MODES: { value: BaBedMode; label: string; description: string }[] = [
  { value: "standard", label: "Standard", description: "Bed 2 = Banana/Papaya" },
  { value: "allSmall", label: "All Small", description: "Bed 2 → Small Tree beds" },
  { value: "alternateSmall", label: "Alternate", description: "Odd cycles = S-Bed, even = BA" },
];

function emptyDraft() {
  return {
    id: nanoid(),
    name: "",
    description: "",
    model: "36x36" as PalekarModel,
    bedCount: 4,
    rowCount: 1,
    baBedMode: "standard" as BaBedMode,
    bedWidthFt: 9,
    pathWidthFt: 3,
    boundaryWidthFt: 1.5,
    gridSpacingFt: 1.5,
  };
}

function draftFromTemplate(t: BlockTemplate) {
  const cfg = t.orchardConfig;
  return {
    id: t.id,
    name: t.name,
    description: t.description ?? "",
    model: (cfg.model ?? "36x36") as PalekarModel,
    bedCount: cfg.bedCount,
    rowCount: cfg.rowCount,
    baBedMode: cfg.baBedMode,
    bedWidthFt: cfg.bedWidthFt,
    pathWidthFt: cfg.pathWidthFt,
    boundaryWidthFt: cfg.boundaryWidthFt,
    gridSpacingFt: cfg.gridSpacingFt,
  };
}

export function TemplateEditSheet({
  open,
  onOpenChange,
  template,
  onSave,
}: TemplateEditSheetProps) {
  const isEditing = template !== null;
  const [draft, setDraft] = useState(emptyDraft);

  useEffect(() => {
    if (open) {
      setDraft(template ? draftFromTemplate(template) : emptyDraft());
    }
  }, [open, template]);

  const orchardConfig = useMemo(
    () =>
      configFromBedCount(
        draft.bedCount,
        draft.rowCount,
        draft.model,
        draft.baBedMode,
        draft.bedWidthFt,
        draft.pathWidthFt,
        draft.boundaryWidthFt,
        draft.gridSpacingFt,
      ),
    [draft.bedCount, draft.rowCount, draft.model, draft.baBedMode, draft.bedWidthFt, draft.pathWidthFt, draft.boundaryWidthFt, draft.gridSpacingFt],
  );

  const validation = useMemo(() => validateOrchardConfig(orchardConfig), [orchardConfig]);

  const builtTemplate = useMemo(
    () => buildBlockTemplate(draft.id, draft.name, draft.description, orchardConfig, false),
    [draft.id, draft.name, draft.description, orchardConfig],
  );

  const nameError = draft.name.trim().length === 0;
  const canSave = !nameError && validation.valid;

  function handleSave() {
    if (!canSave) return;
    const t = buildBlockTemplate(draft.id, draft.name.trim(), draft.description.trim(), orchardConfig, template?.isDefault ?? false);
    if (isEditing && template) {
      t.createdAt = template.createdAt;
    }
    onSave(t);
    onOpenChange(false);
  }

  function patch(updates: Partial<typeof draft>) {
    setDraft((d) => ({ ...d, ...updates }));
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Template" : "New Template"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the template configuration."
              : "Design a new reusable block template."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="tpl-name">Template Name</Label>
            <Input
              id="tpl-name"
              placeholder="e.g. High-Density Banana"
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
            {nameError && <p className="text-xs text-destructive">Name is required.</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="tpl-desc">Description</Label>
            <textarea
              id="tpl-desc"
              rows={2}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Brief description of this template..."
              value={draft.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </div>

          <Separator />

          {/* Model */}
          <div className="space-y-2">
            <Label>Palekar Model</Label>
            <Select
              value={draft.model}
              onValueChange={(v) => {
                const m = v as PalekarModel;
                patch({ model: m, bedCount: 4 });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24x24">24×24 ft Module</SelectItem>
                <SelectItem value="36x36">36×36 ft Module</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bed Count (preset selector) */}
          <div className="space-y-2">
            <Label>Layout Preset</Label>
            <div className="flex flex-wrap gap-2">
              {ORCHARD_PRESETS.filter((p) => p.model === draft.model).map((preset) => (
                <Button
                  key={preset.label}
                  type="button"
                  variant={draft.bedCount === preset.bedCount ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => patch({ bedCount: preset.bedCount })}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Row Count */}
          <div className="space-y-2">
            <Label htmlFor="tpl-rows">
              Rows{" "}
              <span className="text-muted-foreground font-normal">(vertical repetitions)</span>
            </Label>
            <Input
              id="tpl-rows"
              type="number"
              min={1}
              max={10}
              value={draft.rowCount}
              onChange={(e) => patch({ rowCount: Math.max(1, parseInt(e.target.value) || 1) })}
            />
          </div>

          {/* BA Bed Mode */}
          <div className="space-y-2">
            <Label>Bed 2 Mode</Label>
            <Select
              value={draft.baBedMode}
              onValueChange={(v) => patch({ baBedMode: v as BaBedMode })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BA_BED_MODES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    <span className="flex items-center gap-2">
                      {m.label}
                      <span className="text-xs text-muted-foreground">{m.description}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Validation + Size info */}
          <div className="space-y-2">
            <Label>Computed Layout</Label>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant={validation.valid ? "secondary" : "destructive"} className="text-xs">
                {validation.valid ? "Valid" : "Invalid"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {Math.round(orchardConfig.widthFt)}×{Math.round(orchardConfig.heightFt)} ft
              </Badge>
              <Badge variant="outline" className="text-xs">
                {builtTemplate.totalPlants} plants
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{validation.message}</p>
          </div>

          {/* Live Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="rounded-lg border overflow-hidden bg-muted/20">
              <TemplatePreview config={orchardConfig} width={380} height={240} />
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row gap-2 border-t pt-4">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="flex-1" disabled={!canSave} onClick={handleSave}>
            {isEditing ? "Save Changes" : "Create Template"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
