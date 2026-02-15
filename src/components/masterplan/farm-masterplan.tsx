"use client";

import { useMemo, useState } from "react";
import {
  Map as MapIcon,
  Printer,
  TreesIcon,
  Landmark,
  Droplets,
  Flower2,
  Shield,
  Lightbulb,
  Layers,
  Home,
  ChevronDown,
  ChevronUp,
  Compass,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FARM,
  PERIPHERAL_ROADS,
  INTERNAL_ROADS,
  FLOWER_PANELS,
  ZONES,
  INFRASTRUCTURE,
  WATER_FEATURES,
  ADDONS,
  NW_HUB_ROAD,
  LIVE_FENCE_LAYERS,
  ZONE_STRATEGIES,
  FLOWER_SPECIES,
  ADDON_RECOMMENDATIONS,
  INFRA_RECOMMENDATIONS,
  GATE,
  SLOPE_INFO,
  GATES,
  getCoconutPositions,
  computeAreaBreakdown,
  type LayoutItem,
} from "@/lib/masterplan-utils";
import { InfraDetailSheet } from "./infra-detail-sheet";

// ================================================================
// SVG Master Plan Layout
// ================================================================
function MasterPlanSVG({
  showAddons,
  selectedInfra,
  onInfraClick,
}: {
  showAddons: boolean;
  selectedInfra: string | null;
  onInfraClick: (id: string) => void;
}) {
  const coconutTrees = useMemo(() => getCoconutPositions(), []);
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const handleHover = (item: LayoutItem, e: React.MouseEvent) => {
    const svg = e.currentTarget.closest("svg");
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    setTooltip({
      text: `${item.label}${item.details ? " — " + item.details : ""}`,
      x: svgP.x,
      y: svgP.y - 10,
    });
  };

  return (
    <div className="relative w-full overflow-auto border rounded-xl bg-white dark:bg-gray-950 shadow-sm">
      <svg
        viewBox="-50 -65 760 907"
        className="w-full h-auto max-h-[85vh]"
        style={{ minHeight: 500 }}
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          {/* Grid pattern */}
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="0.3" />
          </pattern>
          {/* Hatch for buffer */}
          <pattern id="bufferHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#66BB6A" strokeWidth="1" opacity="0.4" />
          </pattern>
          {/* Flower pattern */}
          <pattern id="flowerPat" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#EC4899" opacity="0.5" />
          </pattern>
          {/* Water waves */}
          <pattern id="waterPat" width="10" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 3 Q2.5 0 5 3 Q7.5 6 10 3" fill="none" stroke="#0288D1" strokeWidth="0.5" opacity="0.4" />
          </pattern>
          {/* Slope arrow marker */}
          <marker id="arrowHead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#EF5350" />
          </marker>
        </defs>

        {/* Background grid */}
        <rect x="-50" y="-50" width="760" height="892" fill="#FAFAFA" />
        <rect x="0" y="0" width="660" height="792" fill="url(#grid)" />

        {/* ── Buffer Zone (7ft band) ── */}
        <rect x="0" y="0" width="660" height="792" fill="#A5D6A7" opacity="0.35" rx="2" />
        <rect x="0" y="0" width="660" height="792" fill="url(#bufferHatch)" rx="2" />
        <rect x="7" y="7" width="646" height="778" fill="white" rx="1" />

        {/* ── Peripheral Roads ── */}
        {PERIPHERAL_ROADS.map((r) => (
          <g key={r.id}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.color} opacity="0.7" />
            <rect
              x={r.x} y={r.y} width={r.w} height={r.h}
              fill="transparent" stroke={r.stroke} strokeWidth="0.5"
              className="cursor-pointer"
              onMouseMove={(e) => handleHover(r, e)}
              onMouseLeave={() => setTooltip(null)}
            />
            {/* Center line */}
            {r.h > r.w ? (
              <line
                x1={r.x + r.w / 2} y1={r.y + 5} x2={r.x + r.w / 2} y2={r.y + r.h - 5}
                stroke="#fff" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.6"
              />
            ) : (
              <line
                x1={r.x + 5} y1={r.y + r.h / 2} x2={r.x + r.w - 5} y2={r.y + r.h / 2}
                stroke="#fff" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.6"
              />
            )}
          </g>
        ))}

        {/* ── Internal Roads ── */}
        {INTERNAL_ROADS.map((r) => (
          <g key={r.id}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.color} opacity="0.65" />
            <rect
              x={r.x} y={r.y} width={r.w} height={r.h}
              fill="transparent" stroke={r.stroke} strokeWidth="0.5"
              className="cursor-pointer"
              onMouseMove={(e) => handleHover(r, e)}
              onMouseLeave={() => setTooltip(null)}
            />
            {r.h > r.w ? (
              <line
                x1={r.x + r.w / 2} y1={r.y + 5} x2={r.x + r.w / 2} y2={r.y + r.h - 5}
                stroke="#fff" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.5"
              />
            ) : (
              <line
                x1={r.x + 5} y1={r.y + r.h / 2} x2={r.x + r.w - 5} y2={r.y + r.h / 2}
                stroke="#fff" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.5"
              />
            )}
          </g>
        ))}

        {/* ── NW Hub Shared Road (10ft with 1ft gaps) ── */}
        <g>
          <rect
            x={NW_HUB_ROAD.x} y={NW_HUB_ROAD.y}
            width={NW_HUB_ROAD.w} height={NW_HUB_ROAD.h}
            fill={NW_HUB_ROAD.color} opacity="0.55"
          />
          <rect
            x={NW_HUB_ROAD.x} y={NW_HUB_ROAD.y}
            width={NW_HUB_ROAD.w} height={NW_HUB_ROAD.h}
            fill="transparent" stroke={NW_HUB_ROAD.stroke} strokeWidth="0.4"
            className="cursor-pointer"
            onMouseMove={(e) => handleHover(NW_HUB_ROAD, e)}
            onMouseLeave={() => setTooltip(null)}
          />
          <line
            x1={NW_HUB_ROAD.x + 3} y1={NW_HUB_ROAD.y + NW_HUB_ROAD.h / 2}
            x2={NW_HUB_ROAD.x + NW_HUB_ROAD.w - 3} y2={NW_HUB_ROAD.y + NW_HUB_ROAD.h / 2}
            stroke="#fff" strokeWidth="0.5" strokeDasharray="3 2" opacity="0.45"
          />
        </g>

        {/* ── Flower Panels ── */}
        {FLOWER_PANELS.map((f) => (
          <rect key={f.id} x={f.x} y={f.y} width={f.w} height={f.h} fill="url(#flowerPat)" stroke={f.stroke} strokeWidth="0.3" />
        ))}

        {/* ── Zones ── */}
        {ZONES.map((z) => (
          <g key={z.id}>
            <rect
              x={z.x} y={z.y} width={z.w} height={z.h}
              fill={z.color} stroke={z.stroke} strokeWidth="1" opacity="0.65" rx="2"
              className="cursor-pointer"
              onMouseMove={(e) => handleHover(z, e)}
              onMouseLeave={() => setTooltip(null)}
            />
            {/* Zone label */}
            <text
              x={z.x + z.w / 2}
              y={z.y + z.h / 2 - 8}
              textAnchor="middle"
              fontSize="18"
              fontWeight="700"
              fill={z.stroke}
              opacity="0.9"
            >
              {z.label}
            </text>
            <text
              x={z.x + z.w / 2}
              y={z.y + z.h / 2 + 8}
              textAnchor="middle"
              fontSize="7"
              fill={z.stroke}
              opacity="0.7"
            >
              {z.strategy}
            </text>
            <text
              x={z.x + z.w / 2}
              y={z.y + z.h / 2 + 20}
              textAnchor="middle"
              fontSize="6.5"
              fontFamily="monospace"
              fill={z.stroke}
              opacity="0.6"
            >
              ~{z.areaAcres} acres ({z.w}×{z.h} ft)
            </text>
          </g>
        ))}

        {/* ── Infrastructure ── */}
        {INFRASTRUCTURE.map((item) => {
          const isSelected = selectedInfra === item.id;
          return (
            <g key={item.id}>
              <rect
                x={item.x} y={item.y} width={item.w} height={item.h}
                fill={item.color}
                stroke={isSelected ? "#2563EB" : item.stroke}
                strokeWidth={isSelected ? "2" : "0.8"}
                rx="1"
                className="cursor-pointer"
                onClick={() => onInfraClick(item.id)}
                onMouseMove={(e) => handleHover(item, e)}
                onMouseLeave={() => setTooltip(null)}
              />
              {isSelected && (
                <rect
                  x={item.x - 2} y={item.y - 2}
                  width={item.w + 4} height={item.h + 4}
                  fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 2" rx="2" opacity="0.6"
                />
              )}
              <text
                x={item.x + item.w / 2}
                y={item.y + item.h / 2 + 2}
                textAnchor="middle"
                fontSize={Math.min(item.w / item.label.length * 1.5, 5.5)}
                fontWeight="600"
                fill="#333"
                className="pointer-events-none"
              >
                {item.label}
              </text>
            </g>
          );
        })}

        {/* ── Water Features ── */}
        {WATER_FEATURES.map((w) => (
          <g key={w.id}>
            <rect
              x={w.x} y={w.y} width={w.w} height={w.h}
              fill={w.color} stroke={w.stroke} strokeWidth="0.8" rx="3" opacity="0.7"
              className="cursor-pointer"
              onMouseMove={(e) => handleHover(w, e)}
              onMouseLeave={() => setTooltip(null)}
            />
            <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="url(#waterPat)" rx="3" />
            <text
              x={w.x + w.w / 2}
              y={w.y + w.h / 2 + 2}
              textAnchor="middle"
              fontSize={w.w > 30 ? 7 : 4}
              fontWeight="600"
              fill="#01579B"
            >
              {w.label}
            </text>
          </g>
        ))}

        {/* ── Add-ons (toggleable — Polyhouse, Biogas, Vermicompost, Mushroom, Tourism) ── */}
        {showAddons &&
          ADDONS.map((a) => {
            const isSelected = selectedInfra === a.id;
            return (
              <g key={a.id}>
                <rect
                  x={a.x} y={a.y} width={a.w} height={a.h}
                  fill={a.color}
                  stroke={isSelected ? "#2563EB" : a.stroke}
                  strokeWidth={isSelected ? "2" : "0.8"}
                  rx="1"
                  className="cursor-pointer"
                  onClick={() => onInfraClick(a.id)}
                  onMouseMove={(e) => handleHover(a, e)}
                  onMouseLeave={() => setTooltip(null)}
                />
                {isSelected && (
                  <rect
                    x={a.x - 2} y={a.y - 2}
                    width={a.w + 4} height={a.h + 4}
                    fill="none" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 2" rx="2" opacity="0.6"
                  />
                )}
                <text
                  x={a.x + a.w / 2}
                  y={a.y + a.h / 2 + 2}
                  textAnchor="middle"
                  fontSize={Math.min(a.w / a.label.length * 1.5, 5.5)}
                  fontWeight="600"
                  fill="#333"
                  className="pointer-events-none"
                >
                  {a.label}
                </text>
              </g>
            );
          })}

        {/* ── Coconut Trees on Roads ── */}
        {coconutTrees.map((t, i) => (
          <circle key={i} cx={t.x} cy={t.y} r="1.8" fill="#8B6914" opacity="0.55" />
        ))}

        {/* ── Gate / Entrance Markers ── */}
        {GATES.map((g) => {
          const sz = 2.5;
          let x1: number, y1: number, x2: number, y2: number, tx: number, ty: number;
          if (g.direction === "east") {
            x1 = g.x; y1 = g.y; x2 = g.x; y2 = g.y + g.h;
            tx = g.x + sz + 1; ty = g.y + g.h / 2;
          } else if (g.direction === "west") {
            x1 = g.x + g.w; y1 = g.y; x2 = g.x + g.w; y2 = g.y + g.h;
            tx = g.x - 1; ty = g.y + g.h / 2;
          } else if (g.direction === "south") {
            x1 = g.x; y1 = g.y; x2 = g.x + g.w; y2 = g.y;
            tx = g.x + g.w / 2; ty = g.y + sz + 2;
          } else {
            x1 = g.x; y1 = g.y + g.h; x2 = g.x + g.w; y2 = g.y + g.h;
            tx = g.x + g.w / 2; ty = g.y - 1;
          }
          return (
            <g key={g.id}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E65100" strokeWidth="2" strokeLinecap="round" />
              <text x={tx} y={ty} textAnchor="middle" fontSize="4" fill="#E65100" dominantBaseline="central">
                {g.direction === "east" ? "▸" : g.direction === "west" ? "◂" : g.direction === "south" ? "▾" : "▴"}
              </text>
            </g>
          );
        })}

        {/* ── Gate Marker ── */}
        <g>
          <rect x={GATE.x - 1} y={GATE.y - 4} width="16" height="8" fill="#F57C00" rx="1" opacity="0.9" />
          <text x={GATE.x + 7} y={GATE.y + 1} textAnchor="middle" fontSize="4.5" fontWeight="700" fill="white">
            GATE
          </text>
          {/* Gate opening indicator */}
          <line x1={GATE.x + 2} y1={0} x2={GATE.x + 12} y2={0} stroke="#F57C00" strokeWidth="2.5" />
        </g>

        {/* ── Slope Indicator Arrow ── */}
        <g>
          <line x1="120" y1="-22" x2="540" y2="-22" stroke="#EF5350" strokeWidth="1.2" markerEnd="url(#arrowHead)" strokeDasharray="4 2" />
          <text x="330" y="-27" textAnchor="middle" fontSize="6" fill="#EF5350" fontWeight="600">
            Slope W → E (toward Nala ↘)
          </text>
        </g>

        {/* ── North Arrow / Compass ── */}
        <g transform="translate(625, -38)">
          <circle cx="0" cy="0" r="12" fill="white" stroke="#455A64" strokeWidth="0.8" />
          {/* North arrow (red) */}
          <polygon points="0,-8 2.5,1 -2.5,1" fill="#D32F2F" />
          {/* South arrow (dark) */}
          <polygon points="0,8 2.5,-1 -2.5,-1" fill="#78909C" />
          {/* Center dot */}
          <circle cx="0" cy="0" r="1.2" fill="#455A64" />
          {/* Labels */}
          <text x="0" y="-14" textAnchor="middle" fontSize="5" fontWeight="700" fill="#D32F2F">N</text>
          <text x="0" y="18" textAnchor="middle" fontSize="4" fontWeight="600" fill="#78909C">S</text>
        </g>

        {/* ── Dimension Labels (outside the farm) ── */}
        {/* Top: Width */}
        <line x1="0" y1="-12" x2="660" y2="-12" stroke="#666" strokeWidth="0.5" />
        <line x1="0" y1="-16" x2="0" y2="-8" stroke="#666" strokeWidth="0.5" />
        <line x1="660" y1="-16" x2="660" y2="-8" stroke="#666" strokeWidth="0.5" />
        <text x="330" y="-15" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#555" fontWeight="600">
          660 ft (W → E)
        </text>

        {/* Right: Height */}
        <line x1="672" y1="0" x2="672" y2="792" stroke="#666" strokeWidth="0.5" />
        <line x1="668" y1="0" x2="676" y2="0" stroke="#666" strokeWidth="0.5" />
        <line x1="668" y1="792" x2="676" y2="792" stroke="#666" strokeWidth="0.5" />
        <text
          x="680" y="396"
          textAnchor="middle"
          fontSize="7"
          fontFamily="monospace"
          fill="#555"
          fontWeight="600"
          transform="rotate(90, 680, 396)"
        >
          792 ft (N → S)
        </text>

        {/* Road width label (only West main road) */}
        <text x={14.5} y={-3} textAnchor="middle" fontSize="5" fill="#7E57C2" fontWeight="500">15 ft</text>

        {/* Buffer Zone labels on all 4 sides */}
        <text x={3.5} y={400} textAnchor="middle" fontSize="4" fill="#388E3C" fontWeight="500" transform="rotate(-90,3.5,400)">
          7 ft Buffer Zone — Live Fence
        </text>
        <text x={330} y={3.5} textAnchor="middle" fontSize="4.5" fill="#388E3C" fontWeight="500">
          7 ft Buffer Zone — Live Fence
        </text>
        <text x={656.5} y={400} textAnchor="middle" fontSize="4" fill="#388E3C" fontWeight="500" transform="rotate(90,656.5,400)">
          7 ft Buffer Zone — Live Fence
        </text>
        <text x={330} y={796} textAnchor="middle" fontSize="4.5" fill="#388E3C" fontWeight="500">
          7 ft Buffer Zone — Live Fence
        </text>

        {/* Public road label at North */}
        <text x={330} y={-36} textAnchor="middle" fontSize="6.5" fill="#455A64" fontWeight="600">
          ← 30 ft Public Road (North Side) →
        </text>

        {/* East nala indicator */}
        <text
          x={700} y={650}
          textAnchor="middle"
          fontSize="6"
          fill="#0277BD"
          fontWeight="500"
          transform="rotate(90, 700, 650)"
        >
          ↓ Nala / Stream (East) ↓
        </text>

        {/* Flower panel label */}
        <text x={330} y={23.5} textAnchor="middle" fontSize="3.5" fill="#C2185B" fontStyle="italic">
          ← 3ft Flower Panel →
        </text>

        {/* Road width labels */}
        <text x={580} y={16} textAnchor="middle" fontSize="3.5" fill="#6D6D8A" fontWeight="500">12 ft</text>
        <text x={648} y={400} textAnchor="middle" fontSize="3.5" fill="#6D6D8A" fontWeight="500" transform="rotate(90,648,400)">12 ft</text>
        <text x={580} y={781} textAnchor="middle" fontSize="3.5" fill="#6D6D8A" fontWeight="500">12 ft</text>

        {/* ── Scale Bar ── */}
        <g transform="translate(10, 810)">
          <line x1="0" y1="0" x2="100" y2="0" stroke="#333" strokeWidth="1" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#333" strokeWidth="0.8" />
          <line x1="50" y1="-2" x2="50" y2="2" stroke="#333" strokeWidth="0.5" />
          <line x1="100" y1="-3" x2="100" y2="3" stroke="#333" strokeWidth="0.8" />
          <text x="0" y="9" fontSize="5" fill="#555">0</text>
          <text x="50" y="9" fontSize="5" fill="#555" textAnchor="middle">50</text>
          <text x="100" y="9" fontSize="5" fill="#555" textAnchor="middle">100 ft</text>
        </g>

        {/* ── Legend ── */}
        <g transform="translate(430, 805)">
          <text x="0" y="0" fontSize="5.5" fontWeight="700" fill="#333">Legend</text>
          {[
            { color: "#A5D6A7", label: "Buffer / Live Fence" },
            { color: "#B8B8D1", label: "Roads (15 ft / 12 ft)" },
            { color: "#F9A8D4", label: "Flower Panel (3 ft)" },
            { color: "#8B6914", label: "Coconut Trees" },
            { color: "#4FC3F7", label: "Water Features" },
            { color: "#FFCC80", label: "Infrastructure" },
            { color: "#E65100", label: "Gates / Entrances" },
          ].map((item, i) => (
            <g key={i} transform={`translate(${(i % 3) * 75}, ${Math.floor(i / 3) * 11 + 8})`}>
              <rect x="0" y="-4" width="6" height="6" fill={item.color} rx="1" stroke="#999" strokeWidth="0.3" />
              <text x="9" y="1" fontSize="4.5" fill="#555">{item.label}</text>
            </g>
          ))}
        </g>

        {/* ── Tooltip ── */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x - 80}
              y={tooltip.y - 18}
              width="160"
              height="14"
              rx="3"
              fill="#1a1a2e"
              opacity="0.92"
            />
            <text
              x={tooltip.x}
              y={tooltip.y - 9}
              textAnchor="middle"
              fontSize="5"
              fill="white"
              fontWeight="500"
            >
              {tooltip.text.length > 55 ? tooltip.text.slice(0, 55) + "…" : tooltip.text}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

// ================================================================
// Stat Card (compact)
// ================================================================
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
}) {
  return (
    <Card className="gap-2">
      <CardContent className="flex items-center gap-3 pt-0">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent ?? "#4CAF50"}18`, color: accent ?? "#4CAF50" }}
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold tabular-nums leading-tight">
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          </p>
          <p className="text-[11px] text-muted-foreground">{label}</p>
          {sub && <p className="text-[10px] text-muted-foreground/70">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// ================================================================
// Area Breakdown Section
// ================================================================
function AreaBreakdownSection() {
  const breakdown = useMemo(() => computeAreaBreakdown(), []);
  const total = FARM.sqFt;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Layers className="size-4 text-primary" />
          Area Utilization Breakdown
        </CardTitle>
        <CardDescription className="text-xs">
          Total {FARM.acres} acres ({total.toLocaleString("en-IN")} sq ft) — {FARM.width} × {FARM.height} ft
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stacked bar */}
        <div className="flex h-4 overflow-hidden rounded-full bg-muted">
          {breakdown.map((item) => (
            <div
              key={item.label}
              className="h-full transition-all"
              style={{ width: `${item.percent}%`, backgroundColor: item.color }}
              title={`${item.label}: ${item.percent}%`}
            />
          ))}
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-1.5 font-medium text-muted-foreground text-xs">Component</th>
                <th className="py-1.5 text-right font-medium text-muted-foreground text-xs">Sq Ft</th>
                <th className="py-1.5 text-right font-medium text-muted-foreground text-xs">Acres</th>
                <th className="py-1.5 text-right font-medium text-muted-foreground text-xs">%</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item) => (
                <tr key={item.label} className="border-b border-border/40">
                  <td className="py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs">{item.label}</span>
                    </div>
                  </td>
                  <td className="py-1.5 text-right font-mono text-xs tabular-nums">
                    {item.sqFt.toLocaleString("en-IN")}
                  </td>
                  <td className="py-1.5 text-right font-mono text-xs tabular-nums">{item.acres}</td>
                  <td className="py-1.5 text-right font-mono text-xs tabular-nums">{item.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ================================================================
// Zone Strategy Cards
// ================================================================
function ZoneStrategySection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ZONES.map((zone) => {
        const strategy = ZONE_STRATEGIES.find((s) => s.zoneId === zone.id);
        return (
          <Card key={zone.id} className="gap-2">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="size-3.5 rounded-full shrink-0" style={{ backgroundColor: zone.stroke }} />
                <CardTitle className="text-sm">{zone.label}</CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono ml-auto">
                  ~{zone.areaAcres} acres
                </Badge>
              </div>
              <CardDescription className="text-xs">{zone.strategy}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <p className="text-xs text-muted-foreground">{zone.details}</p>
              {strategy && (
                <>
                  <div className="text-xs">
                    <span className="font-medium">Palekar Model:</span>{" "}
                    <Badge variant="secondary" className="text-[10px]">{strategy.palekarModel}</Badge>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-medium">Row Plan:</p>
                    {strategy.rowPlan.map((row, i) => (
                      <p key={i} className="text-[10px] text-muted-foreground pl-2">• {row}</p>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <p className="text-[11px] font-medium w-full">Intercrops:</p>
                    {strategy.intercrops.map((ic) => (
                      <Badge key={ic} variant="outline" className="text-[9px] px-1.5 py-0">{ic}</Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] mt-1">
                    <div className="rounded bg-muted/50 px-1.5 py-1">
                      <p className="text-muted-foreground">Yr 1</p>
                      <p className="font-mono font-semibold text-green-600">{strategy.expectedIncome.year1}</p>
                    </div>
                    <div className="rounded bg-muted/50 px-1.5 py-1">
                      <p className="text-muted-foreground">Yr 5</p>
                      <p className="font-mono font-semibold text-green-600">{strategy.expectedIncome.year5}</p>
                    </div>
                    <div className="rounded bg-muted/50 px-1.5 py-1">
                      <p className="text-muted-foreground">Yr 10</p>
                      <p className="font-mono font-semibold text-green-600">{strategy.expectedIncome.year10}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ================================================================
// Infrastructure Recommendations
// ================================================================
function InfraSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Home className="size-4 text-primary" />
          Infrastructure Sizing Guide
        </CardTitle>
        <CardDescription className="text-xs">
          Recommended sizes for a 12-acre farm with NW gate entry
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-left">
                <th className="py-1.5 pr-2 font-medium text-muted-foreground">Structure</th>
                <th className="py-1.5 px-2 font-medium text-muted-foreground">Size</th>
                <th className="py-1.5 px-2 font-medium text-muted-foreground">Purpose</th>
                <th className="py-1.5 pl-2 font-medium text-muted-foreground hidden md:table-cell">Construction</th>
              </tr>
            </thead>
            <tbody>
              {INFRA_RECOMMENDATIONS.map((item) => (
                <tr key={item.name} className="border-b border-border/40">
                  <td className="py-1.5 pr-2 font-medium">{item.name}</td>
                  <td className="py-1.5 px-2 font-mono tabular-nums whitespace-nowrap">{item.recommendedSize}</td>
                  <td className="py-1.5 px-2 text-muted-foreground">{item.purpose}</td>
                  <td className="py-1.5 pl-2 text-muted-foreground hidden md:table-cell">{item.construction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ================================================================
// Live Fence Section
// ================================================================
function LiveFenceSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="size-4 text-primary" />
          Live Fence Boundary (7 ft Buffer Zone)
        </CardTitle>
        <CardDescription className="text-xs">
          Multi-layer biological fence — wind protection, income, and biodiversity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {LIVE_FENCE_LAYERS.map((layer) => (
            <div key={layer.id} className="rounded-lg border p-2.5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                <span className="text-sm font-medium">{layer.name}</span>
                <Badge variant="outline" className="text-[9px] ml-auto font-mono">{layer.symbol}</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground italic">{layer.species}</p>
              {layer.spacingFt > 0 && (
                <p className="text-[10px] font-mono">Spacing: {layer.spacingFt} ft</p>
              )}
              <p className="text-[10px] text-muted-foreground">{layer.purpose}</p>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Fence Planting Order (outside → inside):</p>
          <p>1. <strong>Outer row:</strong> Coconut (25ft) + Black Pepper climber on trunks</p>
          <p>2. <strong>Second row:</strong> Teak (15ft) — timber asset + windbreak</p>
          <p>3. <strong>Third row:</strong> Bamboo clusters at corners + every 50ft</p>
          <p>4. <strong>Fourth row:</strong> Subabul/Gliricidia (6ft) — dense nitrogen-fixing hedge</p>
          <p>5. <strong>Inner row:</strong> Moringa (10ft) + Bay Leaf (8ft) + Curry Leaf (5ft) alternating</p>
          <p className="mt-2 italic">Ground cover: Pineapple, Lemongrass, Vetiver along fence base for soil binding</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ================================================================
// Flower Panel Section
// ================================================================
function FlowerSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Flower2 className="size-4 text-pink-500" />
          Flower Panels (3 ft along roads)
        </CardTitle>
        <CardDescription className="text-xs">
          Inner side of all peripheral roads — pollination, beauty, and income
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {FLOWER_SPECIES.map((f) => (
            <div key={f.name} className="flex items-center gap-1.5 text-xs">
              <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
              <div>
                <p className="font-medium text-[11px]">{f.name}</p>
                <p className="text-[9px] text-muted-foreground">{f.season}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ================================================================
// Recommended Add-ons Section
// ================================================================
function AddonsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Lightbulb className="size-4 text-amber-500" />
          Recommended Add-ons
        </CardTitle>
        <CardDescription className="text-xs">
          Enhance farm productivity, value-addition, and sustainability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-left">
                <th className="py-1.5 pr-2 font-medium text-muted-foreground">Add-on</th>
                <th className="py-1.5 px-2 font-medium text-muted-foreground">Size</th>
                <th className="py-1.5 px-2 font-medium text-muted-foreground hidden sm:table-cell">Location</th>
                <th className="py-1.5 px-2 font-medium text-muted-foreground">Benefit</th>
                <th className="py-1.5 px-2 font-medium text-muted-foreground text-center">Priority</th>
                <th className="py-1.5 pl-2 font-medium text-muted-foreground text-right">Est. Cost</th>
              </tr>
            </thead>
            <tbody>
              {ADDON_RECOMMENDATIONS.map((item) => (
                <tr key={item.name} className="border-b border-border/40">
                  <td className="py-1.5 pr-2 font-medium">{item.name}</td>
                  <td className="py-1.5 px-2 font-mono tabular-nums whitespace-nowrap">{item.size}</td>
                  <td className="py-1.5 px-2 text-muted-foreground hidden sm:table-cell">{item.location}</td>
                  <td className="py-1.5 px-2 text-muted-foreground">{item.benefit}</td>
                  <td className="py-1.5 px-2 text-center">
                    <Badge
                      variant={item.priority === "High" ? "default" : item.priority === "Medium" ? "secondary" : "outline"}
                      className="text-[9px] px-1.5 py-0"
                    >
                      {item.priority}
                    </Badge>
                  </td>
                  <td className="py-1.5 pl-2 text-right font-mono tabular-nums whitespace-nowrap">{item.estimatedCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ================================================================
// Slope & Drainage Info
// ================================================================
function SlopeSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Droplets className="size-4 text-blue-500" />
          Slope, Drainage & Water Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div className="rounded-md bg-muted/50 px-2.5 py-2">
            <p className="text-muted-foreground text-[10px]">Slope Direction</p>
            <p className="font-semibold">{SLOPE_INFO.direction}</p>
          </div>
          <div className="rounded-md bg-muted/50 px-2.5 py-2">
            <p className="text-muted-foreground text-[10px]">Gradient</p>
            <p className="font-semibold">{SLOPE_INFO.gradient}</p>
          </div>
          <div className="rounded-md bg-muted/50 px-2.5 py-2">
            <p className="text-muted-foreground text-[10px]">High Side</p>
            <p className="font-semibold">{SLOPE_INFO.highSide}</p>
          </div>
          <div className="rounded-md bg-muted/50 px-2.5 py-2">
            <p className="text-muted-foreground text-[10px]">Low Side</p>
            <p className="font-semibold">{SLOPE_INFO.lowSide}</p>
          </div>
          <div className="rounded-md bg-muted/50 px-2.5 py-2 col-span-2">
            <p className="text-muted-foreground text-[10px]">Drainage Strategy</p>
            <p className="font-semibold">{SLOPE_INFO.drainageStrategy}</p>
          </div>
        </div>
        <Separator />
        <div className="space-y-1 text-muted-foreground">
          <p className="font-medium text-foreground">Water Management Plan (Two-Bore + Swimming Pool System):</p>
          <p>• <strong>Integrated Watch Tower</strong> (NE of SW Hub) — bore at base + 10,000L tank on 20ft platform + 360° observation deck. Best visibility of all zones.</p>
          <p>• <strong>Swimming Pool</strong> (30×14 ft, ~9m lap length) east of tower — bore-fed, 3ft shallow → 5ft deep. Natural tree shed canopy (Jamun, Kadamba, Ashoka, Bakul — water-loving, evergreen, flowers Feb-Sep). Overflow east wall → straight trench into orchard. Zero water waste.</p>
          <p>• <strong>Irrigation Bore Well</strong> at central intersection — reliable water table, solar pump pushes water UP to tower tank</p>
          <p>• <strong>Gravity-Fed Irrigation</strong> — tank on 20ft tower (still in western high side) = strong gravity head, drip to all zones downhill</p>
          <p>• <strong>Farm Pond (85×65 ft)</strong> at SE corner — collects runoff from all roads, near nala for overflow, fish culture</p>
          <p>• <strong>Contour Trenches (3ft)</strong> run N-S between rows to slow E-ward water flow</p>
          <p>• <strong>Percolation Pit (28×28 ft)</strong> on east side for groundwater recharge</p>
          <p>• <strong>Rainwater Harvesting</strong> from all roads channeled via gentle gradient to pond</p>
          <p>• <strong>Dense East Buffer</strong> — extra bamboo/vetiver along east nala for erosion control</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ================================================================
// Coconut Tree Stats
// ================================================================
function CoconutStats() {
  const trees = useMemo(() => getCoconutPositions(), []);
  const byRoad = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of trees) {
      map.set(t.roadId, (map.get(t.roadId) || 0) + 1);
    }
    return map;
  }, [trees]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <TreesIcon className="size-4 text-amber-700" />
          Coconut Avenue Trees on Roads
        </CardTitle>
        <CardDescription className="text-xs">
          25 ft spacing, both sides — Total: {trees.length} trees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {[...PERIPHERAL_ROADS, ...INTERNAL_ROADS].map((road) => (
            <div key={road.id} className="rounded-md bg-muted/50 px-2.5 py-2">
              <p className="text-muted-foreground text-[10px]">{road.label}</p>
              <p className="font-mono font-semibold">{byRoad.get(road.id) || 0} trees</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ================================================================
// Main Farm Master Plan Component
// ================================================================
export function FarmMasterPlan() {
  const [showAddons, setShowAddons] = useState(true);
  const [selectedInfra, setSelectedInfra] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    zones: true,
    infra: true,
    fence: true,
    flowers: false,
    slope: true,
    coconut: false,
    addons: true,
  });

  const toggleSection = (key: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const coconutCount = useMemo(() => getCoconutPositions().length, []);

  return (
    <div className="p-4 md:p-6 space-y-6 print:p-2">
      {/* ══════════════ Header ══════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MapIcon className="size-6 text-primary" />
            Farm Master Plan
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            12-Acre Architectural Layout — 660 × 792 ft — North gate, W→E slope
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button
            variant={showAddons ? "default" : "outline"}
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setShowAddons(!showAddons)}
          >
            <Lightbulb className="size-3.5" />
            {showAddons ? "Hide" : "Show"} Add-ons
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => window.print()}
          >
            <Printer className="size-3.5" />
            Print / PDF
          </Button>
        </div>
      </div>

      {/* ══════════════ Executive Stats ══════════════ */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={Landmark}
          label="Total Land"
          value="12 Acres"
          sub="660 × 792 ft"
          accent="#4CAF50"
        />
        <StatCard
          icon={Layers}
          label="Productive Area"
          value="~9.6 Acres"
          sub="4 zones × ~2.5 acres"
          accent="#2196F3"
        />
        <StatCard
          icon={Home}
          label="Infrastructure"
          value="~0.55 Acres"
          sub="SW peak: House, Store, Tower | NW gate: Shed, Nursery"
          accent="#FF9800"
        />
        <StatCard
          icon={TreesIcon}
          label="Coconut Avenue"
          value={coconutCount}
          sub="25ft spacing, all roads"
          accent="#8B6914"
        />
        <StatCard
          icon={Droplets}
          label="Water Features"
          value="3 + Tower Bore"
          sub="Pond, Irrigation Bore, Percolation Pit + Domestic Bore in Watch Tower"
          accent="#0288D1"
        />
      </div>

      {/* ══════════════ SVG Master Plan ══════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Compass className="size-4 text-primary" />
          <h2 className="text-lg font-semibold">Layout Plan</h2>
          <Badge variant="outline" className="text-[10px] font-mono ml-2">1 unit = 1 ft</Badge>
          <div className="flex items-center gap-1 ml-auto text-xs text-muted-foreground print:hidden">
            <Info className="size-3" />
            Hover for details, click infrastructure for expanded view
          </div>
        </div>
        <MasterPlanSVG
          showAddons={showAddons}
          selectedInfra={selectedInfra}
          onInfraClick={(id) => setSelectedInfra(id)}
        />
      </section>

      <Separator />

      {/* ══════════════ Area Breakdown ══════════════ */}
      <AreaBreakdownSection />

      <Separator />

      {/* ══════════════ Collapsible Sections ══════════════ */}
      {([
        { key: "zones" as const, title: "Zone-wise Planting Strategy", icon: TreesIcon, component: ZoneStrategySection },
        { key: "infra" as const, title: "Infrastructure Sizing Guide", icon: Home, component: InfraSection },
        { key: "fence" as const, title: "Live Fence Boundary Details", icon: Shield, component: LiveFenceSection },
        { key: "slope" as const, title: "Slope, Drainage & Water Management", icon: Droplets, component: SlopeSection },
        { key: "flowers" as const, title: "Flower Panel Species", icon: Flower2, component: FlowerSection },
        { key: "coconut" as const, title: "Coconut Avenue Statistics", icon: TreesIcon, component: CoconutStats },
        { key: "addons" as const, title: "Recommended Add-ons", icon: Lightbulb, component: AddonsSection },
      ]).map(({ key, title, icon: SectionIcon, component: Component }) => (
        <section key={key}>
          <button
            className="flex items-center gap-2 w-full text-left py-2 print:pointer-events-none"
            onClick={() => toggleSection(key)}
          >
            <SectionIcon className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">{title}</h2>
            <span className="ml-auto print:hidden">
              {expandedSections[key] ? (
                <ChevronUp className="size-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-4 text-muted-foreground" />
              )}
            </span>
          </button>
          {(expandedSections[key] || typeof window !== "undefined" && window.matchMedia?.("print")?.matches) && (
            <div className="mt-2">
              <Component />
            </div>
          )}
          <Separator className="mt-4" />
        </section>
      ))}

      {/* ══════════════ Disclaimer ══════════════ */}
      <p className="text-[10px] text-muted-foreground/60 text-center max-w-3xl mx-auto print:text-left">
        Disclaimer: This master plan is a conceptual architectural layout for planning purposes. Actual dimensions,
        soil conditions, water table depth, local regulations, and climate must be verified before construction.
        All income estimates are conservative and based on Palekar Natural Farming (ZBNF) methodology.
        Consult a local agricultural officer and civil engineer before implementation.
      </p>

      {/* ══════════════ Infrastructure Detail Sheet ══════════════ */}
      <InfraDetailSheet
        infraId={selectedInfra}
        open={selectedInfra !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedInfra(null);
        }}
      />
    </div>
  );
}
