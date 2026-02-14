"use client";

import { useCallback, useState } from "react";
import { MapPin, Plus, RotateCcw } from "lucide-react";
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
import { useZoneStore } from "@/stores/zone-store";
import { DEFAULT_FARM } from "@/lib/constants";
import type { Zone } from "@/types/farm";
import { ZoneCard } from "./zone-card";
import { ZoneEditSheet } from "./zone-edit-sheet";
import { ZoneAcreageChart } from "./zone-acreage-chart";

export function ZoneManager() {
  const { zones, addZone, updateZone, removeZone, resetToDefaults } =
    useZoneStore();

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Zone | null>(null);

  // Reset confirmation
  const [showReset, setShowReset] = useState(false);

  const totalAllocated = zones.reduce((sum, z) => sum + z.acres, 0);

  const handleEdit = useCallback((zone: Zone) => {
    setEditingZone(zone);
    setSheetOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingZone(null);
    setSheetOpen(true);
  }, []);

  const handleSave = useCallback(
    (zone: Zone) => {
      const existing = zones.find((z) => z.id === zone.id);
      if (existing) {
        updateZone(zone.id, zone);
      } else {
        addZone(zone);
      }
    },
    [zones, addZone, updateZone]
  );

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) {
      removeZone(deleteTarget.id);
      setDeleteTarget(null);
    }
  }, [deleteTarget, removeZone]);

  const handleReset = useCallback(() => {
    resetToDefaults();
    setShowReset(false);
  }, [resetToDefaults]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Zone Manager</h1>
            <Badge variant="secondary" className="text-xs">
              {totalAllocated} / {DEFAULT_FARM.netProductiveAcres} acres
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Define farm zones with strategies, acreage, and block template
            assignments.
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
            Add Zone
          </Button>
        </div>
      </div>

      {/* Main content — grid with cards + sidebar chart */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Zone cards */}
        <div className="space-y-4">
          {zones.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <MapPin className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">No zones yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Create your first farm zone to define strategies and assign
                block templates.
              </p>
              <Button size="sm" className="mt-4 gap-1.5" onClick={handleAdd}>
                <Plus className="h-3.5 w-3.5" />
                Add Zone
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {zones.map((zone) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  onEdit={handleEdit}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar — chart + stats */}
        <div className="space-y-4">
          <ZoneAcreageChart zones={zones} />
        </div>
      </div>

      {/* Edit / Create sheet */}
      <ZoneEditSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        zone={editingZone}
        existingZones={zones}
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
              This will permanently remove the zone and its configuration. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Zone
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
              This will replace all current zones with the default Zone A, B,
              and C configuration. Any custom zones will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowReset(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset Zones
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
