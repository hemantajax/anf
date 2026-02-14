"use client";

import {
  MousePointer2,
  Route,
  Waves,
  Flower2,
  Grid3X3,
  Stamp,
  TreePine,
  MapPin,
  Ruler,
  Eraser,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  Grid2X2,
  Magnet,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useDesignerStore } from "@/stores/designer-store";
import { useFarmStore } from "@/stores/farm-store";
import type { DrawingTool } from "@/types/farm";

interface ToolDef {
  id: DrawingTool;
  label: string;
  shortcut: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOOLS: ToolDef[] = [
  { id: "select", label: "Select / Move", shortcut: "V", icon: MousePointer2 },
  { id: "road", label: "Road", shortcut: "R", icon: Route },
  { id: "trench", label: "Trench", shortcut: "T", icon: Waves },
  { id: "flower-bed", label: "Flower Bed", shortcut: "F", icon: Flower2 },
  { id: "block-stamp", label: "Block Stamp", shortcut: "B", icon: Stamp },
  { id: "plant", label: "Plant", shortcut: "P", icon: TreePine },
  { id: "zone", label: "Zone Paint", shortcut: "Z", icon: MapPin },
  { id: "measure", label: "Measure", shortcut: "M", icon: Ruler },
  { id: "eraser", label: "Eraser", shortcut: "E", icon: Eraser },
];

export function Toolbar() {
  const activeTool = useDesignerStore((s) => s.activeTool);
  const setActiveTool = useDesignerStore((s) => s.setActiveTool);
  const zoomIn = useDesignerStore((s) => s.zoomIn);
  const zoomOut = useDesignerStore((s) => s.zoomOut);
  const resetZoom = useDesignerStore((s) => s.resetZoom);
  const viewport = useDesignerStore((s) => s.viewport);
  const showGrid = useDesignerStore((s) => s.showGrid);
  const toggleGrid = useDesignerStore((s) => s.toggleGrid);
  const snap = useDesignerStore((s) => s.snap);
  const toggleSnap = useDesignerStore((s) => s.toggleSnap);

  const undo = useFarmStore((s) => s.undo);
  const redo = useFarmStore((s) => s.redo);

  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex flex-col gap-1 p-2 border-r bg-sidebar w-[52px] shrink-0 items-center">
      {/* Drawing tools */}
      {TOOLS.map((tool) => (
        <Tooltip key={tool.id}>
          <TooltipTrigger asChild>
            <Button
              variant={activeTool === tool.id ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setActiveTool(tool.id)}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {tool.label}{" "}
            <kbd className="ml-1 text-[10px] opacity-60">{tool.shortcut}</kbd>
          </TooltipContent>
        </Tooltip>
      ))}

      <Separator className="my-1" />

      {/* Grid toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={showGrid ? "secondary" : "ghost"}
            size="icon"
            className="h-9 w-9"
            onClick={toggleGrid}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Toggle Grid <kbd className="ml-1 text-[10px] opacity-60">G</kbd>
        </TooltipContent>
      </Tooltip>

      {/* Snap toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={snap.enabled ? "secondary" : "ghost"}
            size="icon"
            className="h-9 w-9"
            onClick={toggleSnap}
          >
            <Magnet className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Snap to Grid ({snap.gridSizeFt}ft)
        </TooltipContent>
      </Tooltip>

      <Separator className="my-1" />

      {/* Zoom controls */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Zoom In
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Zoom Out
        </TooltipContent>
      </Tooltip>

      <div className="text-[10px] text-muted-foreground text-center">
        {Math.round(viewport.scale * 100)}%
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={resetZoom}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Reset Zoom
        </TooltipContent>
      </Tooltip>

      <Separator className="my-1" />

      {/* Undo / Redo */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={undo}>
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Undo <kbd className="ml-1 text-[10px] opacity-60">Ctrl+Z</kbd>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={redo}>
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Redo{" "}
          <kbd className="ml-1 text-[10px] opacity-60">Ctrl+Shift+Z</kbd>
        </TooltipContent>
      </Tooltip>

      {/* Spacer to push theme toggle to bottom */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {isDark ? "Light Mode" : "Dark Mode"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
