"use client";

import { Trash2, Lock, Unlock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDesignerStore } from "@/stores/designer-store";
import { useFarmStore } from "@/stores/farm-store";
import { getElementLabel, getElementColor } from "@/lib/designer-utils";
import {
  validateOrchardConfig,
  ORCHARD_PRESETS,
  configFromBedCount,
  calcCanvasWidth,
  calcCanvasHeight,
  MODEL_DEFAULTS,
} from "@/lib/orchard-utils";
import type { PalekarModel } from "@/lib/orchard-utils";
import type { OrchardConfig } from "@/types/farm";

// ---- Orchard settings panel (shown when nothing selected) ----
function OrchardSettings() {
  const orchardConfig = useFarmStore((s) => s.orchardConfig);
  const setOrchardConfig = useFarmStore((s) => s.setOrchardConfig);
  const validation = validateOrchardConfig(orchardConfig);

  // Derive base bed length per module (total inner / rowCount)
  const innerH = orchardConfig.heightFt - 2 * orchardConfig.boundaryWidthFt;
  const bedLengthFt = innerH / orchardConfig.rowCount;

  // Derive current model from kBedSpan
  const currentModel: PalekarModel = orchardConfig.kBedSpan === 4 ? "36x36" : "24x24";

  /** Update config and auto-recalculate canvas width/height */
  const updateConfig = (updates: Partial<OrchardConfig>) => {
    const next = { ...orchardConfig, ...updates };
    next.widthFt = calcCanvasWidth(
      next.bedCount,
      next.bedWidthFt,
      next.pathWidthFt,
      next.boundaryWidthFt
    );
    next.heightFt = calcCanvasHeight(
      bedLengthFt, // preserve per-module bed length
      next.boundaryWidthFt,
      next.rowCount
    );
    setOrchardConfig(next);
  };

  /** Switch model type (24×24 ↔ 36×36) */
  const switchModel = (model: PalekarModel) => {
    const md = MODEL_DEFAULTS[model];
    setOrchardConfig(
      configFromBedCount(orchardConfig.bedCount, orchardConfig.rowCount, model)
    );
  };

  return (
    <div className="w-[220px] shrink-0 border-l bg-sidebar flex flex-col">
      <div className="px-3 py-2 border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Orchard Settings
        </h3>
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {/* Model selector */}
        <div className="space-y-1.5">
          <Label className="text-xs">Palekar Model</Label>
          <div className="flex gap-1">
            {(["24x24", "36x36"] as PalekarModel[]).map((m) => (
              <Button
                key={m}
                variant={currentModel === m ? "default" : "outline"}
                size="sm"
                className="text-[11px] h-7 px-3 flex-1"
                onClick={() => switchModel(m)}
              >
                {m === "24x24" ? "24×24 ft" : "36×36 ft"}
              </Button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {currentModel === "24x24"
              ? "K=24ft · Cycle: 1,2,3,4 · B@24ft"
              : "K=36ft · Cycle: 1,2,4,3 · B@36ft"}
          </p>
        </div>

        <Separator />

        {/* Presets filtered by current model */}
        <div className="space-y-1.5">
          <Label className="text-xs">Layout Preset</Label>
          <div className="flex flex-wrap gap-1">
            {ORCHARD_PRESETS.filter((p) => p.model === currentModel).map((preset) => (
              <Button
                key={preset.label}
                variant={
                  orchardConfig.bedCount === preset.bedCount &&
                  currentModel === preset.model
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="text-[10px] h-6 px-2"
                onClick={() =>
                  setOrchardConfig(
                    configFromBedCount(preset.bedCount, orchardConfig.rowCount, preset.model)
                  )
                }
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Bed config */}
        <div className="space-y-1.5">
          <Label className="text-xs">Bed Configuration</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] text-muted-foreground">
                Cols
              </span>
              <Input
                className="h-7 text-xs"
                type="number"
                min={2}
                max={20}
                value={orchardConfig.bedCount}
                onChange={(e) =>
                  updateConfig({ bedCount: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground">
                Rows
              </span>
              <Input
                className="h-7 text-xs"
                type="number"
                min={1}
                max={10}
                value={orchardConfig.rowCount}
                onChange={(e) =>
                  updateConfig({ rowCount: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground">
                Width (ft)
              </span>
              <Input
                className="h-7 text-xs"
                type="number"
                min={3}
                max={15}
                step={1.5}
                value={orchardConfig.bedWidthFt}
                onChange={(e) =>
                  updateConfig({ bedWidthFt: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-muted-foreground">
                Bed Length (ft)
              </span>
              <Input
                className="h-7 text-xs"
                type="number"
                min={6}
                max={100}
                step={1.5}
                value={bedLengthFt}
                onChange={(e) => {
                  const len = Number(e.target.value);
                  setOrchardConfig({
                    ...orchardConfig,
                    heightFt: calcCanvasHeight(
                      len,
                      orchardConfig.boundaryWidthFt,
                      orchardConfig.rowCount
                    ),
                  });
                }}
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground">
                Grid (ft)
              </span>
              <Input
                className="h-7 text-xs"
                type="number"
                min={0.5}
                max={3}
                step={0.5}
                value={orchardConfig.gridSpacingFt}
                onChange={(e) =>
                  updateConfig({ gridSpacingFt: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        {/* Trench & boundary */}
        <div className="space-y-1.5">
          <Label className="text-xs">Trench & Boundary</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-muted-foreground">
                Trench (ft)
              </span>
              <Input
                className="h-7 text-xs"
                type="number"
                min={1}
                max={6}
                step={0.5}
                value={orchardConfig.pathWidthFt}
                onChange={(e) =>
                  updateConfig({ pathWidthFt: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground">
                Boundary (ft)
              </span>
              <Input
                className="h-7 text-xs"
                type="number"
                min={0.5}
                max={5}
                step={0.5}
                value={orchardConfig.boundaryWidthFt}
                onChange={(e) =>
                  updateConfig({ boundaryWidthFt: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Computed dimensions */}
        <div className="text-[10px] text-muted-foreground space-y-0.5">
          <div>Canvas: {orchardConfig.widthFt} × {orchardConfig.heightFt} ft</div>
          <div>
            {orchardConfig.bedCount} beds × {orchardConfig.rowCount} row{orchardConfig.rowCount > 1 ? "s" : ""} (continuous)
          </div>
          <div>
            Module: {orchardConfig.bedWidthFt}ft × {Math.round(bedLengthFt)}ft | Total height: {Math.round(innerH)}ft
          </div>
        </div>

        {/* Validation message */}
        <div
          className={`text-[10px] p-2 rounded ${
            validation.valid
              ? "bg-emerald-900/30 text-emerald-400"
              : "bg-red-900/30 text-red-400"
          }`}
        >
          {validation.message}
        </div>
      </div>
    </div>
  );
}

export function PropertiesPanel() {
  const selectedId = useDesignerStore((s) => s.selectedElementId);
  const setSelectedId = useDesignerStore((s) => s.setSelectedElementId);
  const elements = useFarmStore((s) => s.elements);
  const updateElement = useFarmStore((s) => s.updateElement);
  const removeElement = useFarmStore((s) => s.removeElement);

  const element = elements.find((el) => el.id === selectedId);

  if (!element) {
    return <OrchardSettings />;
  }

  const label = getElementLabel(element);
  const color = getElementColor(element);

  return (
    <div className="w-[220px] shrink-0 border-l bg-sidebar flex flex-col">
      <div className="px-3 py-2 border-b flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Properties
        </h3>
        <Badge
          variant="outline"
          className="text-[10px] capitalize"
          style={{ borderColor: color, color }}
        >
          {element.type}
        </Badge>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-4">
        {/* Label */}
        <div className="space-y-1.5">
          <Label className="text-xs">Label</Label>
          <Input
            className="h-7 text-xs"
            value={element.label ?? label}
            onChange={(e) =>
              updateElement(element.id, { label: e.target.value })
            }
          />
        </div>

        {/* Position */}
        <div className="space-y-1.5">
          <Label className="text-xs">Position (ft)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-muted-foreground">X</span>
              <Input
                className="h-7 text-xs"
                type="number"
                value={Math.round(element.x)}
                onChange={(e) =>
                  updateElement(element.id, { x: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground">Y</span>
              <Input
                className="h-7 text-xs"
                type="number"
                value={Math.round(element.y)}
                onChange={(e) =>
                  updateElement(element.id, { y: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="space-y-1.5">
          <Label className="text-xs">Size (ft)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-muted-foreground">W</span>
              <Input
                className="h-7 text-xs"
                type="number"
                value={Math.round(element.width)}
                onChange={(e) =>
                  updateElement(element.id, {
                    width: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground">H</span>
              <Input
                className="h-7 text-xs"
                type="number"
                value={Math.round(element.height)}
                onChange={(e) =>
                  updateElement(element.id, {
                    height: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Type-specific config */}
        <div className="space-y-1.5">
          <Label className="text-xs">Config</Label>
          <div className="text-[10px] text-muted-foreground space-y-0.5">
            {element.config.kind === "road" && (
              <>
                <div>Width: {element.config.widthFt}ft</div>
                <div>
                  Border bed: {element.config.hasBorderBed ? "Yes" : "No"}
                </div>
              </>
            )}
            {element.config.kind === "trench" && (
              <>
                <div>Width: {element.config.widthFt}ft</div>
                <div>Depth: {element.config.depthFt}ft</div>
              </>
            )}
            {element.config.kind === "flower-bed" && (
              <div>Width: {element.config.widthFt}ft</div>
            )}
          </div>
        </div>

        {/* Color indicator */}
        <div className="space-y-1.5">
          <Label className="text-xs">Color</Label>
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded border"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-muted-foreground">{color}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-2 border-t flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() =>
            updateElement(element.id, { locked: !element.locked })
          }
        >
          {element.locked ? (
            <Lock className="h-3.5 w-3.5" />
          ) : (
            <Unlock className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            // Duplicate
            const clone = {
              ...element,
              id: `el_${Date.now()}`,
              x: element.x + 6,
              y: element.y + 6,
            };
            useFarmStore.getState().addElement(clone);
          }}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => {
            removeElement(element.id);
            setSelectedId(null);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
