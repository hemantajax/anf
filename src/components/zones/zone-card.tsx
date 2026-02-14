"use client";

import { Pencil, Trash2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BLOCK_TEMPLATE_OPTIONS } from "@/lib/constants";
import type { Zone } from "@/types/farm";

interface ZoneCardProps {
  zone: Zone;
  onEdit: (zone: Zone) => void;
  onDelete: (zone: Zone) => void;
}

function getTemplateName(templateId: string): string {
  return (
    BLOCK_TEMPLATE_OPTIONS.find((t) => t.id === templateId)?.name ??
    "Unassigned"
  );
}

export function ZoneCard({ zone, onEdit, onDelete }: ZoneCardProps) {
  // Split strategy into label + description at the em-dash
  const [label, ...rest] = zone.strategy.split("—");
  const description = rest.join("—").trim();

  return (
    <Card
      className="relative overflow-hidden py-0 gap-0 transition-shadow hover:shadow-md cursor-pointer group"
      style={{ borderLeftWidth: 4, borderLeftColor: zone.color }}
      onClick={() => onEdit(zone)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: zone.color + "20" }}
            >
              <MapPin className="h-4 w-4" style={{ color: zone.color }} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate">{zone.name}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {label.trim()}
              </p>
            </div>
          </div>

          {/* Quick actions — visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(zone);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(zone);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-xs">
            {zone.acres} acres
          </Badge>
          <Badge variant="outline" className="text-xs">
            {getTemplateName(zone.blockTemplateId)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
