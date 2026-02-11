"use client";

import React from "react";
import { Rect } from "react-konva";
import { useDesignerStore } from "@/stores/designer-store";
import { PX_PER_FT, ELEMENT_COLORS } from "@/lib/designer-utils";

export const DrawPreview = React.memo(function DrawPreview() {
  const preview = useDesignerStore((s) => s.drawPreview);
  const tool = useDesignerStore((s) => s.activeTool);

  if (!preview) return null;

  const color =
    tool === "road"
      ? ELEMENT_COLORS.road
      : tool === "trench"
        ? ELEMENT_COLORS.trench
        : tool === "flower-bed"
          ? ELEMENT_COLORS["flower-bed"]
          : "#6b7280";

  return (
    <Rect
      x={preview.x * PX_PER_FT}
      y={preview.y * PX_PER_FT}
      width={preview.width * PX_PER_FT}
      height={preview.height * PX_PER_FT}
      fill={color}
      opacity={0.35}
      stroke={color}
      strokeWidth={1}
      dash={[6, 3]}
      listening={false}
    />
  );
});
