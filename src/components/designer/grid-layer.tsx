"use client";

import React from "react";
import { Line } from "react-konva";
import { PX_PER_FT } from "@/lib/designer-utils";

interface GridLayerProps {
  widthFt: number;
  heightFt: number;
  gridSizeFt: number;
  visible: boolean;
}

export const GridLayer = React.memo(function GridLayer({
  widthFt,
  heightFt,
  gridSizeFt,
  visible,
}: GridLayerProps) {
  if (!visible) return null;

  const lines: React.ReactNode[] = [];
  const widthPx = widthFt * PX_PER_FT;
  const heightPx = heightFt * PX_PER_FT;
  const stepPx = gridSizeFt * PX_PER_FT;

  // Vertical lines
  for (let x = 0; x <= widthPx; x += stepPx) {
    const isMajor = x % (36 * PX_PER_FT) === 0;
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, 0, x, heightPx]}
        stroke={isMajor ? "#64748b" : "#334155"}
        strokeWidth={isMajor ? 1 : 0.5}
        opacity={isMajor ? 0.5 : 0.2}
        listening={false}
      />
    );
  }

  // Horizontal lines
  for (let y = 0; y <= heightPx; y += stepPx) {
    const isMajor = y % (36 * PX_PER_FT) === 0;
    lines.push(
      <Line
        key={`h-${y}`}
        points={[0, y, widthPx, y]}
        stroke={isMajor ? "#64748b" : "#334155"}
        strokeWidth={isMajor ? 1 : 0.5}
        opacity={isMajor ? 0.5 : 0.2}
        listening={false}
      />
    );
  }

  return <>{lines}</>;
});
