"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PLANT_SYMBOLS } from "@/lib/orchard-utils";

/** Legend entry grouping */
interface LegendGroup {
  title: string;
  entries: { id: string; placement: string }[];
}

const LEGEND_GROUPS: LegendGroup[] = [
  {
    title: "Center Column — Bed 1 & 3",
    entries: [
      { id: "big", placement: "center @6ft" },
      { id: "medium", placement: "center @6ft" },
      { id: "small", placement: "center @6ft" },
      { id: "pigeonPea", placement: "center @3ft" },
    ],
  },
  {
    title: "Ground Cover — Bed 1 & 3",
    entries: [
      { id: "marigold", placement: "edge lines @6ft" },
      { id: "cotton", placement: "edge lines @3ft" },
      { id: "groundnut", placement: "inner lines @6ft" },
      { id: "onionGarlic", placement: "inner lines @3ft" },
      { id: "fruitVeg", placement: "seasonal" },
      { id: "milletsPulses", placement: "seasonal" },
    ],
  },
  {
    title: "Bed 2 — Banana & Papaya",
    entries: [
      { id: "banana", placement: "edges @6ft" },
      { id: "papaya", placement: "edges @6ft" },
    ],
  },
  {
    title: "Bed 4 — Vine & Pavilion",
    entries: [
      { id: "vineVeg", placement: "@3ft all lines" },
      { id: "pavilionPole", placement: "@6ft" },
    ],
  },
];

export function LegendPanel() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-2 left-2 z-10 max-w-[520px]">
      {/* Toggle bar */}
      <button
        className="flex items-center gap-1.5 px-3 py-1 rounded-t-md bg-slate-900/90 border border-b-0 border-slate-700/60 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors backdrop-blur-sm"
        onClick={() => setCollapsed((p) => !p)}
      >
        Legend
        {collapsed ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {/* Panel body */}
      {!collapsed && (
        <div className="bg-slate-900/90 border border-slate-700/60 rounded-b-md rounded-tr-md p-3 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {LEGEND_GROUPS.map((group) => (
              <div key={group.title}>
                <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  {group.title}
                </h4>
                <div className="space-y-1">
                  {group.entries.map(({ id, placement }) => {
                    const sym = PLANT_SYMBOLS[id];
                    if (!sym) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-1.5 text-[11px]"
                      >
                        {/* Symbol swatch */}
                        <SymbolSwatch symbol={sym} />
                        {/* Label */}
                        <span className="font-medium" style={{ color: sym.stroke }}>
                          {sym.shortLabel}
                        </span>
                        <span className="text-slate-400 truncate">
                          {sym.label.split("(")[0].trim()}
                        </span>
                        <span className="text-slate-500 text-[10px] ml-auto shrink-0">
                          {placement}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Tiny inline SVG to render the symbol shape matching the canvas */
function SymbolSwatch({
  symbol,
}: {
  symbol: { shape: string; fill: string; stroke: string; radius: number };
}) {
  const size = 14;
  const cx = size / 2;
  const cy = size / 2;
  const r = symbol.radius * 0.9;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
    >
      {symbol.shape === "circle" && (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={symbol.fill}
          stroke={symbol.stroke}
          strokeWidth={1.2}
        />
      )}
      {symbol.shape === "square" && (
        <rect
          x={cx - r}
          y={cy - r}
          width={r * 2}
          height={r * 2}
          fill={symbol.fill}
          stroke={symbol.stroke}
          strokeWidth={1.2}
        />
      )}
      {symbol.shape === "star" && (
        <polygon
          points={hexPoints(cx, cy, r)}
          fill={symbol.fill}
          stroke={symbol.stroke}
          strokeWidth={1}
        />
      )}
      {symbol.shape === "triangle" && (
        <polygon
          points={triPoints(cx, cy, r)}
          fill={symbol.fill}
          stroke={symbol.stroke}
          strokeWidth={1}
        />
      )}
      {symbol.shape === "diamond" && (
        <polygon
          points={diamondPoints(cx, cy, r)}
          fill={symbol.fill}
          stroke={symbol.stroke}
          strokeWidth={1}
        />
      )}
      {symbol.shape === "dot" && (
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={symbol.fill}
          stroke={symbol.stroke}
          strokeWidth={0.8}
        />
      )}
      {symbol.shape === "dash" && (
        <line
          x1={cx - r}
          y1={cy}
          x2={cx + r}
          y2={cy}
          stroke={symbol.stroke}
          strokeWidth={1.5}
        />
      )}
    </svg>
  );
}

/** Generate hexagon points string for SVG polygon */
function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 })
    .map((_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(" ");
}

/** Generate triangle points string for SVG polygon */
function triPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 3 })
    .map((_, i) => {
      const angle = ((2 * Math.PI) / 3) * i - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(" ");
}

/** Generate diamond points string for SVG polygon */
function diamondPoints(cx: number, cy: number, r: number): string {
  return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
}
