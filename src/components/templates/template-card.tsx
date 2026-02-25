"use client";

import { Pencil, Trash2, Copy, Grid3X3, TreeDeciduous, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TemplatePreview } from "./template-preview";
import type { BlockTemplate } from "@/types/farm";

interface TemplateCardProps {
  template: BlockTemplate;
  onEdit: (template: BlockTemplate) => void;
  onDelete: (template: BlockTemplate) => void;
  onDuplicate: (template: BlockTemplate) => void;
}

export function TemplateCard({ template, onEdit, onDelete, onDuplicate }: TemplateCardProps) {
  const model = template.orchardConfig.model ?? "24x24";
  const bedCount = template.orchardConfig.bedCount;

  return (
    <Card
      className="relative overflow-hidden py-0 gap-0 transition-shadow hover:shadow-md cursor-pointer group"
      onClick={() => onEdit(template)}
    >
      <div className="border-b bg-muted/30">
        <TemplatePreview
          config={template.orchardConfig}
          width={320}
          height={180}
          className="w-full"
        />
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Grid3X3 className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-sm truncate">{template.name}</h3>
                {template.isDefault && (
                  <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {template.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => { e.stopPropagation(); onDuplicate(template); }}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Duplicate</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => { e.stopPropagation(); onEdit(template); }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            {!template.isDefault && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); onDelete(template); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-xs">
            {model === "36x36" ? "36×36" : "24×24"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {bedCount} beds
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            <TreeDeciduous className="h-3 w-3" />
            {template.totalPlants} plants
          </Badge>
          <Badge variant="outline" className="text-xs">
            {Math.round(template.widthFt)}×{Math.round(template.heightFt)} ft
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
