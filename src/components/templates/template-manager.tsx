"use client";

import { useCallback, useState } from "react";
import { Grid3X3, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTemplateStore } from "@/stores/template-store";
import type { BlockTemplate } from "@/types/farm";
import { TemplateCard } from "./template-card";
import { TemplateEditSheet } from "./template-edit-sheet";

export function TemplateManager() {
  const { templates, addTemplate, updateTemplate, removeTemplate, duplicateTemplate, resetToDefaults } =
    useTemplateStore();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<BlockTemplate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlockTemplate | null>(null);
  const [showReset, setShowReset] = useState(false);

  const handleEdit = useCallback((tpl: BlockTemplate) => {
    setEditingTemplate(tpl);
    setSheetOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingTemplate(null);
    setSheetOpen(true);
  }, []);

  const handleSave = useCallback(
    (tpl: BlockTemplate) => {
      const existing = templates.find((t) => t.id === tpl.id);
      if (existing) {
        updateTemplate(tpl.id, tpl);
      } else {
        addTemplate(tpl);
      }
    },
    [templates, addTemplate, updateTemplate],
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) {
      removeTemplate(deleteTarget.id);
      setDeleteTarget(null);
    }
  }, [deleteTarget, removeTemplate]);

  const handleDuplicate = useCallback(
    (tpl: BlockTemplate) => {
      duplicateTemplate(tpl.id);
    },
    [duplicateTemplate],
  );

  const handleReset = useCallback(() => {
    resetToDefaults();
    setShowReset(false);
  }, [resetToDefaults]);

  const defaultCount = templates.filter((t) => t.isDefault).length;
  const customCount = templates.length - defaultCount;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Block Templates</h1>
            <Badge variant="secondary" className="text-xs">
              {templates.length} templates
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Design reusable block layouts with configurable beds, trenches, and plant placements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowReset(true)}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button size="sm" className="gap-1.5" onClick={handleAdd}>
            <Plus className="h-3.5 w-3.5" />
            New Template
          </Button>
        </div>
      </div>

      {/* Template grid */}
      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <Grid3X3 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold">No templates yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Create your first block template to design reusable orchard layouts.
          </p>
          <Button size="sm" className="mt-4 gap-1.5" onClick={handleAdd}>
            <Plus className="h-3.5 w-3.5" />
            New Template
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}

      {/* Edit / Create sheet */}
      <TemplateEditSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        template={editingTemplate}
        onSave={handleSave}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget?.name}?</DialogTitle>
            <DialogDescription>
              This will permanently remove the template. Zones referencing this template
              will keep their assignment but the template data will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset confirmation dialog */}
      <Dialog open={showReset} onOpenChange={setShowReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset to defaults?</DialogTitle>
            <DialogDescription>
              This will replace all templates with the 4 default templates (Standard Orchard,
              Compact Orchard, Banana Block, Premium Block). Any custom templates will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowReset(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset Templates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
