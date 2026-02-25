"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { OrchardLayer } from "@/components/designer/orchard-layer";
import { computeOrchardLayout, getCanvasColors } from "@/lib/orchard-utils";
import { PX_PER_FT } from "@/lib/designer-utils";
import type { OrchardConfig } from "@/types/farm";
import { useTheme } from "next-themes";

interface TemplatePreviewProps {
  config: OrchardConfig;
  width?: number;
  height?: number;
  className?: string;
  interactive?: boolean;
}

const ALL_SYMBOLS_VISIBLE: Record<string, boolean> = {};

export const TemplatePreview = React.memo(function TemplatePreview({
  config,
  width = 320,
  height = 220,
  className,
  interactive = false,
}: TemplatePreviewProps) {
  const { resolvedTheme } = useTheme();
  const colors = useMemo(
    () => getCanvasColors(resolvedTheme === "light" ? "light" : "dark"),
    [resolvedTheme],
  );

  const layout = useMemo(() => computeOrchardLayout(config), [config]);

  const canvasW = config.widthFt * PX_PER_FT;
  const canvasH = config.heightFt * PX_PER_FT;

  const padding = 60;
  const scaleX = width / (canvasW + padding * 2);
  const scaleY = height / (canvasH + padding * 2);
  const scale = Math.min(scaleX, scaleY, 1);

  const offsetX = (width - canvasW * scale) / 2;
  const offsetY = (height - canvasH * scale) / 2 + 10;

  return (
    <div className={className} style={{ width, height, overflow: "hidden" }}>
      <Stage
        width={width}
        height={height}
        scaleX={scale}
        scaleY={scale}
        x={offsetX}
        y={offsetY}
        listening={interactive}
      >
        <Layer listening={false}>
          <Rect
            x={-padding}
            y={-padding}
            width={canvasW + padding * 2}
            height={canvasH + padding * 2}
            fill={colors.canvasFill}
            listening={false}
            perfectDrawEnabled={false}
          />
        </Layer>
        <Layer listening={false}>
          <OrchardLayer
            layout={layout}
            showBoundary
            showBeds
            showGrid={false}
            symbolVisibility={ALL_SYMBOLS_VISIBLE}
            colors={colors}
          />
        </Layer>
      </Stage>
    </div>
  );
});
