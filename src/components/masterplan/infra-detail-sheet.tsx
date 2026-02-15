"use client";

import { useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Route,
  TreePine,
  Hammer,
  LayoutGrid,
  Maximize2,
  Clock,
  IndianRupee,
  ArrowRight,
  Building,
} from "lucide-react";
import {
  INFRASTRUCTURE,
  WATER_FEATURES,
  ADDONS,
  PERIPHERAL_ROADS,
  INTERNAL_ROADS,
  NW_HUB_ROAD,
  NW_CIRCULATION,
  SW_HUB_ROAD,
  SW_CIRCULATION,
  INFRA_TREES,
  GATES,
  GATE,
  TOURISM_TREES,
  TOURISM_PATHS,
  TOURISM_GATES,
  type LayoutItem,
} from "@/lib/masterplan-utils";
import {
  getInfraDetail,
  computeInfraViewBox,
  type InfraDetail,
  type FloorPlan,
} from "@/lib/infra-details";

// ── Props ──
interface InfraDetailSheetProps {
  infraId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ── Hub badge colors ──
const HUB_COLORS: Record<string, string> = {
  NW: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  SW: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  Field: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

// ================================================================
// Mini Access Road SVG — cropped view around selected infra
// ================================================================
function MiniInfraSVG({ item, detail }: { item: LayoutItem; detail: InfraDetail }) {
  const padding = 70;
  const viewBox = computeInfraViewBox(item.x, item.y, item.w, item.h, padding);

  // Filter nearby roads that intersect the viewBox area
  const vbX = item.x - padding;
  const vbY = item.y - padding;
  const vbW = item.w + padding * 2;
  const vbH = item.h + padding * 2;

  const nearbyRoads = useMemo(() => {
    return [...PERIPHERAL_ROADS, ...INTERNAL_ROADS, NW_HUB_ROAD, SW_HUB_ROAD].filter((r) => {
      return (
        r.x < vbX + vbW &&
        r.x + r.w > vbX &&
        r.y < vbY + vbH &&
        r.y + r.h > vbY
      );
    });
  }, [vbX, vbY, vbW, vbH]);

  // Filter nearby infra trees (including tourism trees)
  const nearbyTrees = useMemo(() => {
    return [...INFRA_TREES, ...TOURISM_TREES].filter((t) => {
      return (
        t.x > vbX && t.x < vbX + vbW &&
        t.y > vbY && t.y < vbY + vbH
      );
    });
  }, [vbX, vbY, vbW, vbH]);

  // Filter nearby gates (including tourism gates)
  const nearbyGates = useMemo(() => {
    return [...GATES, ...TOURISM_GATES].filter((g) => {
      return (
        g.x > vbX && g.x < vbX + vbW &&
        g.y > vbY && g.y < vbY + vbH
      );
    });
  }, [vbX, vbY, vbW, vbH]);

  // Other infra nearby (for context — includes addons: biogas, vermi, mushroom, cottages)
  const nearbyInfra = useMemo(() => {
    const allItems = [...INFRASTRUCTURE, ...WATER_FEATURES, ...ADDONS];
    return allItems.filter((i) => {
      if (i.id === item.id) return false;
      return (
        i.x < vbX + vbW &&
        i.x + i.w > vbX &&
        i.y < vbY + vbH &&
        i.y + i.h > vbY
      );
    });
  }, [item.id, vbX, vbY, vbW, vbH]);

  // Tourism access paths in view
  const nearbyTourismPaths = useMemo(() => {
    return TOURISM_PATHS.filter((p) =>
      p.points.some(([px, py]) => px >= vbX && px <= vbX + vbW && py >= vbY && py <= vbY + vbH)
    );
  }, [vbX, vbY, vbW, vbH]);

  // Access path
  const accessPoints = detail.accessRoad.svgPathPoints;
  const pathD = accessPoints.length > 1
    ? `M ${accessPoints[0][0]} ${accessPoints[0][1]} ` +
      accessPoints.slice(1).map((p) => `L ${p[0]} ${p[1]}`).join(" ")
    : "";

  // Check if gate marker is in view
  const gateInView = GATE.x >= vbX && GATE.x <= vbX + vbW && GATE.y >= vbY && GATE.y <= vbY + vbH;

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-950 overflow-hidden">
      <svg viewBox={viewBox} className="w-full h-auto" style={{ maxHeight: 260 }}>
        {/* Background */}
        <rect x={vbX} y={vbY} width={vbW} height={vbH} fill="#FAFAFA" />

        {/* Nearby roads */}
        {nearbyRoads.map((r) => (
          <g key={r.id}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.color} opacity="0.5" />
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="transparent" stroke={r.stroke} strokeWidth="0.3" />
            {/* Center line */}
            {r.h > r.w ? (
              <line
                x1={r.x + r.w / 2} y1={Math.max(r.y + 3, vbY)}
                x2={r.x + r.w / 2} y2={Math.min(r.y + r.h - 3, vbY + vbH)}
                stroke="#fff" strokeWidth="0.6" strokeDasharray="3 2" opacity="0.5"
              />
            ) : (
              <line
                x1={Math.max(r.x + 3, vbX)} y1={r.y + r.h / 2}
                x2={Math.min(r.x + r.w - 3, vbX + vbW)} y2={r.y + r.h / 2}
                stroke="#fff" strokeWidth="0.6" strokeDasharray="3 2" opacity="0.5"
              />
            )}
          </g>
        ))}

        {/* Nearby infra (dimmed context) */}
        {nearbyInfra.map((ni) => (
          <g key={ni.id} opacity="0.35">
            <rect x={ni.x} y={ni.y} width={ni.w} height={ni.h} fill={ni.color} stroke={ni.stroke} strokeWidth="0.4" rx="1" />
            <text
              x={ni.x + ni.w / 2} y={ni.y + ni.h / 2 + 1.5}
              textAnchor="middle" fontSize={Math.min(ni.w / ni.label.length * 1.3, 4)} fontWeight="500" fill="#666"
            >
              {ni.label}
            </text>
          </g>
        ))}

        {/* Access road path (highlighted) */}
        {pathD && (
          <path d={pathD} fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.8" />
        )}

        {/* Tourism footpaths (in view) */}
        {nearbyTourismPaths.map((tp) => {
          const d = `M ${tp.points[0][0]} ${tp.points[0][1]} ` +
            tp.points.slice(1).map((p) => `L ${p[0]} ${p[1]}`).join(" ");
          return (
            <path key={tp.id} d={d} fill="none" stroke="#795548" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
          );
        })}

        {/* Selected infrastructure (prominent) */}
        <rect
          x={item.x} y={item.y} width={item.w} height={item.h}
          fill={item.color} stroke="#2563EB" strokeWidth="1.5" rx="1"
        />
        <text
          x={item.x + item.w / 2} y={item.y + item.h / 2 + 2}
          textAnchor="middle" fontSize={Math.min(item.w / item.label.length * 1.4, 5)} fontWeight="700" fill="#1a1a2e"
        >
          {item.label}
        </text>

        {/* Gate markers */}
        {nearbyGates.map((g) => {
          const isForThis = g.infraId === item.id;
          return (
            <g key={g.id}>
              {g.direction === "east" && (
                <line x1={g.x} y1={g.y} x2={g.x} y2={g.y + g.h} stroke={isForThis ? "#2563EB" : "#E65100"} strokeWidth={isForThis ? 2 : 1.2} strokeLinecap="round" />
              )}
              {g.direction === "south" && (
                <line x1={g.x} y1={g.y} x2={g.x + g.w} y2={g.y} stroke={isForThis ? "#2563EB" : "#E65100"} strokeWidth={isForThis ? 2 : 1.2} strokeLinecap="round" />
              )}
              {g.direction === "west" && (
                <line x1={g.x + g.w} y1={g.y} x2={g.x + g.w} y2={g.y + g.h} stroke={isForThis ? "#2563EB" : "#E65100"} strokeWidth={isForThis ? 2 : 1.2} strokeLinecap="round" />
              )}
              {g.direction === "north" && (
                <line x1={g.x} y1={g.y + g.h} x2={g.x + g.w} y2={g.y + g.h} stroke={isForThis ? "#2563EB" : "#E65100"} strokeWidth={isForThis ? 2 : 1.2} strokeLinecap="round" />
              )}
            </g>
          );
        })}

        {/* Nearby infra trees (clean circles only) */}
        {nearbyTrees.map((t) => (
          <g key={t.id}>
            <circle cx={t.x} cy={t.y} r="3.5" fill="#4CAF50" opacity="0.25" />
            <circle cx={t.x} cy={t.y} r="1.5" fill="#2E7D32" opacity="0.75" />
          </g>
        ))}

        {/* Gate marker if in view */}
        {gateInView && (
          <g>
            <rect x={GATE.x - 1} y={GATE.y - 3} width="14" height="6" fill="#F57C00" rx="1" opacity="0.9" />
            <text x={GATE.x + 6} y={GATE.y + 1} textAnchor="middle" fontSize="3.5" fontWeight="700" fill="white">
              GATE
            </text>
          </g>
        )}

        {/* NW Hub circulation loop (entry + exit, blue dashed) */}
        {/* NW Hub circulation */}
        {detail.hub === "NW" && (
          <g>
            <polyline
              points={NW_CIRCULATION.entry.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none" stroke="#2563EB" strokeWidth="1.8"
              strokeDasharray="4 2.5" opacity="0.75"
              strokeLinejoin="round"
            />
            <polyline
              points={NW_CIRCULATION.exit.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none" stroke="#2563EB" strokeWidth="1.8"
              strokeDasharray="4 2.5" opacity="0.75"
              strokeLinejoin="round"
            />
            <text x={14} y={36} fontSize="3" fill="#2563EB" fontWeight="600">Entry</text>
            <text x={82} y={13} fontSize="3" fill="#2563EB" fontWeight="600">Exit</text>
          </g>
        )}

        {/* SW Hub circulation */}
        {detail.hub === "SW" && (
          <g>
            {/* Entry: Gate → W Road south → SW Shared Road east */}
            <polyline
              points={SW_CIRCULATION.entry.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none" stroke="#2563EB" strokeWidth="1.8"
              strokeDasharray="4 2.5" opacity="0.75"
              strokeLinejoin="round"
            />
            {/* Exit: Shared Road west → W Main Road → south to South Road */}
            <polyline
              points={SW_CIRCULATION.exit.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none" stroke="#2563EB" strokeWidth="1.8"
              strokeDasharray="4 2.5" opacity="0.75"
              strokeLinejoin="round"
            />
            {/* Labels */}
            <text x={14} y={620} fontSize="3" fill="#2563EB" fontWeight="600">Entry</text>
            <text x={14} y={770} fontSize="3" fill="#2563EB" fontWeight="600">Exit</text>
          </g>
        )}

        {/* Scale reference */}
        <g transform={`translate(${vbX + 5}, ${vbY + vbH - 8})`}>
          <line x1="0" y1="0" x2="50" y2="0" stroke="#666" strokeWidth="0.6" />
          <line x1="0" y1="-2" x2="0" y2="2" stroke="#666" strokeWidth="0.5" />
          <line x1="50" y1="-2" x2="50" y2="2" stroke="#666" strokeWidth="0.5" />
          <text x="25" y="5" textAnchor="middle" fontSize="3.5" fill="#666">50 ft</text>
        </g>
      </svg>
      <div className="px-3 py-1.5 bg-muted/30 text-[10px] text-muted-foreground flex items-center gap-1.5 border-t flex-wrap gap-y-1">
        <span className="inline-block w-4 h-0.5 bg-blue-600 rounded" style={{ borderBottom: "1.5px dashed #2563EB" }} />
        Access / circulation path
        <span className="ml-2 inline-block w-2.5 h-2.5 rounded-full bg-green-600 opacity-50" />
        Shade trees
        <span className="ml-2 inline-block w-3 h-2 rounded-sm border-2 border-blue-600" />
        Selected
      </div>
    </div>
  );
}

// ================================================================
// Architectural Floor Plan SVG
// ================================================================
function FloorPlanSVG({ plan, floorName }: { plan: FloorPlan; floorName: string }) {
  const scale = 4; // 1ft = 4px
  const pad = 24;  // padding for dimension lines
  const wallT = 0.8; // wall thickness in SVG units
  const svgW = plan.buildingW * scale + pad * 2;
  const svgH = plan.buildingH * scale + pad * 2;
  const ox = pad; // origin x offset
  const oy = pad; // origin y offset

  return (
    <div className="rounded-lg border bg-white dark:bg-gray-950 overflow-hidden">
      <div className="px-3 py-1.5 border-b bg-muted/30">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{floorName} — Floor Plan</p>
      </div>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" style={{ maxHeight: 340 }}>
        {/* Background */}
        <rect width={svgW} height={svgH} fill="#FAFAFA" />

        {/* ── Outer building walls (thick) ── */}
        <rect
          x={ox} y={oy}
          width={plan.buildingW * scale} height={plan.buildingH * scale}
          fill="none" stroke="#333" strokeWidth={wallT * 2.5}
        />

        {/* ── Room fills and walls ── */}
        {plan.rooms.map((room, i) => {
          const rx = ox + room.x * scale;
          const ry = oy + room.y * scale;
          const rw = room.w * scale;
          const rh = room.h * scale;
          // Alternate light fills
          const fills = ["#FFF8E1", "#E8F5E9", "#E3F2FD", "#FFF3E0", "#F3E5F5", "#E0F2F1", "#FCE4EC", "#F1F8E9", "#FFF9C4", "#E8EAF6"];
          const fill = fills[i % fills.length];
          return (
            <g key={i}>
              {/* Room fill */}
              <rect x={rx} y={ry} width={rw} height={rh} fill={fill} opacity="0.6" />
              {/* Room walls */}
              <rect x={rx} y={ry} width={rw} height={rh} fill="none" stroke="#555" strokeWidth={wallT} />
              {/* Room label */}
              {room.name.includes("\n") ? (
                <text x={rx + rw / 2} y={ry + rh / 2 - 3} textAnchor="middle" fontSize="4.5" fontWeight="600" fill="#333">
                  {room.name.split("\n").map((line, li) => (
                    <tspan key={li} x={rx + rw / 2} dy={li === 0 ? 0 : 5.5}>{line}</tspan>
                  ))}
                </text>
              ) : (
                <text x={rx + rw / 2} y={ry + rh / 2 + 1.5} textAnchor="middle" fontSize="4.5" fontWeight="600" fill="#333">
                  {room.name}
                </text>
              )}
              {/* Room dimensions */}
              <text x={rx + rw / 2} y={ry + rh / 2 + (room.name.includes("\n") ? 10 : 7)} textAnchor="middle" fontSize="3.2" fill="#888" fontStyle="italic">
                {room.w}&apos;x{room.h}&apos;
              </text>
            </g>
          );
        })}

        {/* ── Doors (gaps in wall + swing arc) ── */}
        {plan.rooms.map((room, ri) =>
          (room.doors ?? []).map((door, di) => {
            const rx = ox + room.x * scale;
            const ry = oy + room.y * scale;
            const rw = room.w * scale;
            const rh = room.h * scale;
            const dw = door.width * scale;
            const dOff = door.offset * scale;
            let dx: number, dy: number, arcPath: string;

            if (door.wall === "N") {
              dx = rx + dOff; dy = ry;
              arcPath = `M ${dx} ${dy} A ${dw} ${dw} 0 0 1 ${dx + dw} ${dy}`;
            } else if (door.wall === "S") {
              dx = rx + dOff; dy = ry + rh;
              arcPath = `M ${dx} ${dy} A ${dw} ${dw} 0 0 0 ${dx + dw} ${dy}`;
            } else if (door.wall === "W") {
              dx = rx; dy = ry + dOff;
              arcPath = `M ${dx} ${dy} A ${dw} ${dw} 0 0 0 ${dx} ${dy + dw}`;
            } else {
              dx = rx + rw; dy = ry + dOff;
              arcPath = `M ${dx} ${dy} A ${dw} ${dw} 0 0 1 ${dx} ${dy + dw}`;
            }

            // Clear the wall behind the door
            let clearX: number, clearY: number, clearW: number, clearH: number;
            if (door.wall === "N" || door.wall === "S") {
              clearX = dx - 0.5; clearY = dy - wallT; clearW = dw + 1; clearH = wallT * 2;
            } else {
              clearX = dx - wallT; clearY = dy - 0.5; clearW = wallT * 2; clearH = dw + 1;
            }

            return (
              <g key={`d-${ri}-${di}`}>
                {/* White rect to "erase" the wall at door */}
                <rect x={clearX} y={clearY} width={clearW} height={clearH} fill="#FAFAFA" />
                {/* Door swing arc */}
                <path d={arcPath} fill="none" stroke="#1565C0" strokeWidth="0.5" strokeDasharray="1.5 1" opacity="0.7" />
              </g>
            );
          })
        )}

        {/* ── Windows (parallel marks on wall) ── */}
        {plan.rooms.map((room, ri) =>
          (room.windows ?? []).map((win, wi) => {
            const rx = ox + room.x * scale;
            const ry = oy + room.y * scale;
            const rw = room.w * scale;
            const rh = room.h * scale;
            const ww = win.width * scale;
            const wOff = win.offset * scale;

            let x1: number, y1: number, x2: number, y2: number;
            if (win.wall === "N") {
              x1 = rx + wOff; y1 = ry; x2 = x1 + ww; y2 = ry;
            } else if (win.wall === "S") {
              x1 = rx + wOff; y1 = ry + rh; x2 = x1 + ww; y2 = y1;
            } else if (win.wall === "W") {
              x1 = rx; y1 = ry + wOff; x2 = rx; y2 = y1 + ww;
            } else {
              x1 = rx + rw; y1 = ry + wOff; x2 = x1; y2 = y1 + ww;
            }

            // 3 parallel lines for window symbol
            const isHoriz = win.wall === "N" || win.wall === "S";
            const off1 = 1.2;
            return (
              <g key={`w-${ri}-${wi}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0D47A1" strokeWidth="1.5" />
                {isHoriz ? (
                  <>
                    <line x1={x1} y1={y1 - off1} x2={x2} y2={y2 - off1} stroke="#0D47A1" strokeWidth="0.4" />
                    <line x1={x1} y1={y1 + off1} x2={x2} y2={y2 + off1} stroke="#0D47A1" strokeWidth="0.4" />
                  </>
                ) : (
                  <>
                    <line x1={x1 - off1} y1={y1} x2={x2 - off1} y2={y2} stroke="#0D47A1" strokeWidth="0.4" />
                    <line x1={x1 + off1} y1={y1} x2={x2 + off1} y2={y2} stroke="#0D47A1" strokeWidth="0.4" />
                  </>
                )}
              </g>
            );
          })
        )}

        {/* ── Dimension lines (outside the building) ── */}
        {/* Width (top) */}
        <g>
          <line x1={ox} y1={oy - 12} x2={ox + plan.buildingW * scale} y2={oy - 12} stroke="#666" strokeWidth="0.4" />
          <line x1={ox} y1={oy - 15} x2={ox} y2={oy - 9} stroke="#666" strokeWidth="0.4" />
          <line x1={ox + plan.buildingW * scale} y1={oy - 15} x2={ox + plan.buildingW * scale} y2={oy - 9} stroke="#666" strokeWidth="0.4" />
          <text x={ox + (plan.buildingW * scale) / 2} y={oy - 15} textAnchor="middle" fontSize="4" fill="#666" fontWeight="500">
            {plan.buildingW}&apos; - 0&quot;
          </text>
        </g>
        {/* Height (right) */}
        <g>
          <line x1={ox + plan.buildingW * scale + 12} y1={oy} x2={ox + plan.buildingW * scale + 12} y2={oy + plan.buildingH * scale} stroke="#666" strokeWidth="0.4" />
          <line x1={ox + plan.buildingW * scale + 9} y1={oy} x2={ox + plan.buildingW * scale + 15} y2={oy} stroke="#666" strokeWidth="0.4" />
          <line x1={ox + plan.buildingW * scale + 9} y1={oy + plan.buildingH * scale} x2={ox + plan.buildingW * scale + 15} y2={oy + plan.buildingH * scale} stroke="#666" strokeWidth="0.4" />
          <text
            x={ox + plan.buildingW * scale + 17}
            y={oy + (plan.buildingH * scale) / 2}
            textAnchor="middle" fontSize="4" fill="#666" fontWeight="500"
            transform={`rotate(90, ${ox + plan.buildingW * scale + 17}, ${oy + (plan.buildingH * scale) / 2})`}
          >
            {plan.buildingH}&apos; - 0&quot;
          </text>
        </g>

        {/* ── Compass (NW = top-left) ── */}
        <g transform={`translate(${svgW - 16}, 14)`}>
          <polygon points="0,-6 1.5,1 -1.5,1" fill="#D32F2F" />
          <polygon points="0,6 1.5,-1 -1.5,-1" fill="#999" />
          <circle cx="0" cy="0" r="0.8" fill="#555" />
          <text x="0" y="-8" textAnchor="middle" fontSize="3.5" fontWeight="700" fill="#D32F2F">N</text>
        </g>

        {/* ── Direction label ── */}
        <text x={ox + plan.buildingW * scale + 6} y={oy + (plan.buildingH * scale) / 2} textAnchor="middle" fontSize="3.5" fill="#F57C00" fontWeight="600"
          transform={`rotate(-90, ${ox + plan.buildingW * scale + 6}, ${oy + (plan.buildingH * scale) / 2})`}
        >
          EAST (Main Entrance)
        </text>

        {/* ── Legend ── */}
        <g transform={`translate(${ox}, ${svgH - 8})`}>
          <line x1="0" y1="0" x2="6" y2="0" stroke="#1565C0" strokeWidth="0.5" strokeDasharray="1.5 1" />
          <text x="8" y="1.5" fontSize="3" fill="#666">Door swing</text>
          <line x1="30" y1="-1" x2="30" y2="1" stroke="#0D47A1" strokeWidth="1.5" />
          <line x1="28.8" y1="-1" x2="28.8" y2="1" stroke="#0D47A1" strokeWidth="0.4" />
          <line x1="31.2" y1="-1" x2="31.2" y2="1" stroke="#0D47A1" strokeWidth="0.4" />
          <text x="34" y="1.5" fontSize="3" fill="#666">Window</text>
        </g>
      </svg>
    </div>
  );
}

// ================================================================
// Section wrapper with icon
// ================================================================
function DetailSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-primary shrink-0" />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ================================================================
// Main Component
// ================================================================
export function InfraDetailSheet({ infraId, open, onOpenChange }: InfraDetailSheetProps) {
  const item = useMemo(() => {
    if (!infraId) return null;
    return [...INFRASTRUCTURE, ...WATER_FEATURES, ...ADDONS].find((i) => i.id === infraId) ?? null;
  }, [infraId]);

  const detail = useMemo(() => {
    if (!infraId) return null;
    return getInfraDetail(infraId) ?? null;
  }, [infraId]);

  // Nearby trees for the listing below the mini SVG (includes tourism trees)
  const nearbyTreesList = useMemo(() => {
    if (!item) return [];
    const pad = 70;
    const vbX = item.x - pad;
    const vbY = item.y - pad;
    const vbW = item.w + pad * 2;
    const vbH = item.h + pad * 2;
    return [...INFRA_TREES, ...TOURISM_TREES].filter((t) =>
      t.x > vbX && t.x < vbX + vbW && t.y > vbY && t.y < vbY + vbH
    );
  }, [item]);

  if (!item || !detail) return null;

  const sizeFt = `${item.w}x${item.h}`;
  const areaSqFt = item.w * item.h;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <SheetTitle className="text-base leading-tight">{item.label}</SheetTitle>
            <Badge className={`text-[10px] px-1.5 py-0 ${HUB_COLORS[detail.hub] ?? ""}`}>
              {detail.hub} Hub
            </Badge>
          </div>
          <SheetDescription className="text-xs leading-relaxed">
            {detail.headline}
          </SheetDescription>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className="text-[10px] font-mono gap-1">
              <Maximize2 className="size-2.5" />
              {sizeFt} ft ({areaSqFt.toLocaleString("en-IN")} sq ft)
            </Badge>
            {detail.estimatedCost && (
              <Badge variant="outline" className="text-[10px] font-mono gap-1">
                <IndianRupee className="size-2.5" />
                {detail.estimatedCost}
              </Badge>
            )}
            {detail.timelineToBuild && (
              <Badge variant="outline" className="text-[10px] font-mono gap-1">
                <Clock className="size-2.5" />
                {detail.timelineToBuild}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-5">
          {/* ── Mini SVG Map ── */}
          <MiniInfraSVG item={item} detail={detail} />

          {/* ── Nearby Trees (below mini map) ── */}
          {nearbyTreesList.length > 0 && (
            <div className="rounded-lg border bg-green-50/50 dark:bg-green-950/20 p-3 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-green-800 dark:text-green-300 flex items-center gap-1.5">
                <TreePine className="size-3" />
                Trees on Map ({nearbyTreesList.length})
              </p>
              <div className="grid gap-1">
                {nearbyTreesList.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-xs">
                    <span className="size-2 rounded-full bg-green-600 shrink-0" />
                    <span className="font-medium text-foreground">{t.species}</span>
                    <span className="text-muted-foreground truncate">— {t.purpose}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Access Road ── */}
          <DetailSection icon={Route} title="Access Road">
            <div className="rounded-lg bg-muted/40 p-3 space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <ArrowRight className="size-3 mt-0.5 text-blue-600 shrink-0" />
                <p className="text-foreground">{detail.accessRoad.fromGate}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="rounded bg-background px-2 py-1.5">
                  <p className="text-[10px] text-muted-foreground">Road Width</p>
                  <p className="font-mono font-semibold">{detail.accessRoad.roadWidthFt} ft</p>
                </div>
                <div className="rounded bg-background px-2 py-1.5">
                  <p className="text-[10px] text-muted-foreground">Distance</p>
                  <p className="font-mono font-semibold">~{detail.accessRoad.distanceFromGateFt} ft</p>
                </div>
                <div className="rounded bg-background px-2 py-1.5">
                  <p className="text-[10px] text-muted-foreground">Surface</p>
                  <p className="font-semibold">{detail.accessRoad.surfaceType}</p>
                </div>
              </div>
            </div>
          </DetailSection>

          <Separator />

          {/* ── Floor Plan ── */}
          {detail.floors.length > 0 && (
            <>
              <DetailSection icon={LayoutGrid} title="Floor Plan">
                <div className="space-y-3">
                  {detail.floors.map((floor) => (
                    <div key={floor.name} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold flex items-center gap-1.5">
                          <Building className="size-3 text-muted-foreground" />
                          {floor.name}
                        </p>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {floor.totalAreaSqFt.toLocaleString("en-IN")} sq ft
                        </Badge>
                      </div>
                      {/* Check if any room has extended details */}
                      {floor.rooms.some((r) => r.doors != null || r.windows != null || r.facing || r.notes) ? (
                        <div className="space-y-2">
                          {floor.rooms.map((room) => (
                            <div key={room.name} className="rounded-md border bg-background p-2.5 space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[11px] font-semibold">{room.name}</p>
                                <Badge variant="outline" className="text-[9px] font-mono shrink-0">{room.sizeFt} ft</Badge>
                              </div>
                              <p className="text-[10px] text-muted-foreground">{room.purpose}</p>
                              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
                                {room.doors != null && (
                                  <span className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Doors:</span>
                                    <span className="font-medium">{room.doors}</span>
                                  </span>
                                )}
                                {room.windows != null && (
                                  <span className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Windows:</span>
                                    <span className="font-medium">{room.windows}</span>
                                  </span>
                                )}
                                {room.facing && (
                                  <span className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Facing:</span>
                                    <span className="font-medium">{room.facing}</span>
                                  </span>
                                )}
                                {room.flooring && (
                                  <span className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Floor:</span>
                                    <span className="font-medium">{room.flooring}</span>
                                  </span>
                                )}
                              </div>
                              {room.ventilation && (
                                <p className="text-[10px] text-muted-foreground italic">{room.ventilation}</p>
                              )}
                              {room.notes && (
                                <p className="text-[10px] text-muted-foreground">{room.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <table className="w-full text-[11px]">
                          <thead>
                            <tr className="border-b text-left">
                              <th className="py-1 pr-2 font-medium text-muted-foreground">Room</th>
                              <th className="py-1 px-2 font-medium text-muted-foreground">Size</th>
                              <th className="py-1 pl-2 font-medium text-muted-foreground">Purpose</th>
                            </tr>
                          </thead>
                          <tbody>
                            {floor.rooms.map((room) => (
                              <tr key={room.name} className="border-b border-border/30">
                                <td className="py-1 pr-2 font-medium">{room.name}</td>
                                <td className="py-1 px-2 font-mono text-muted-foreground whitespace-nowrap">{room.sizeFt} ft</td>
                                <td className="py-1 pl-2 text-muted-foreground">{room.purpose}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      {/* Floor Plan SVG (if positioned room data available) */}
                      {floor.floorPlan && (
                        <div className="mt-3">
                          <FloorPlanSVG plan={floor.floorPlan} floorName={floor.name} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </DetailSection>
              <Separator />
            </>
          )}

          {/* ── Construction ── */}
          <DetailSection icon={Hammer} title="Construction">
            <div className="rounded-lg bg-muted/40 p-3 space-y-2 text-xs">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Type</p>
                <p className="font-semibold">{detail.constructionType}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Material Notes</p>
                <p className="text-muted-foreground leading-relaxed">{detail.materialNotes}</p>
              </div>
            </div>
          </DetailSection>

          <Separator />

          {/* ── Surrounding Trees ── */}
          {detail.surroundingTrees.length > 0 && (
            <>
              <DetailSection icon={TreePine} title="Surrounding Trees">
                <div className="space-y-2">
                  {detail.surroundingTrees.map((tree, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border p-2.5">
                      <div className="flex flex-col items-center shrink-0">
                        <span className="size-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <TreePine className="size-3 text-green-700 dark:text-green-300" />
                        </span>
                        <span className="text-[9px] text-muted-foreground mt-0.5">{tree.direction}</span>
                      </div>
                      <div className="text-xs space-y-0.5 min-w-0">
                        <p className="font-semibold">{tree.species}</p>
                        <p className="text-muted-foreground">{tree.purpose}</p>
                        <div className="flex gap-3 text-[10px] font-mono mt-1">
                          <span>Canopy: {tree.canopyRadiusFt} ft radius</span>
                          <span>Distance: {tree.distanceFromWallFt} ft from wall</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>
              <Separator />
            </>
          )}

          {/* ── Utilization ── */}
          <DetailSection icon={LayoutGrid} title="Utilization">
            <ul className="space-y-1">
              {detail.utilization.map((u, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-muted-foreground">{u}</span>
                </li>
              ))}
            </ul>
          </DetailSection>

          {/* ── Expansion Notes ── */}
          {detail.expansionNotes && (
            <>
              <Separator />
              <DetailSection icon={Maximize2} title="Expansion Notes">
                <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-3 leading-relaxed">
                  {detail.expansionNotes}
                </p>
              </DetailSection>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
