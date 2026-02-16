"use client";

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
  Flower2,
  Footprints,
  Hammer,
  Ruler,
  Layers,
  ArrowRight,
  IndianRupee,
  TruckIcon,
} from "lucide-react";
import {
  ROAD_CROSS_SECTION_12FT,
  ROAD_SURFACE_MATERIALS,
  ROAD_CONSTRUCTION_STEPS,
  ROAD_COST_ESTIMATE,
  ROAD_TOTAL_COST_RANGE,
  OUTER_FLOWER_SPECIES,
} from "@/lib/masterplan-utils";

interface RoadDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ================================================================
// Cross-Section SVG — Full Murum Road with Flowers on BOTH sides
// ================================================================
function RoadCrossSectionSVG() {
  const S = 28; // px per ft
  const pad = { left: 30, right: 30, top: 30, bottom: 60 };
  const groundY = 100;
  const roadThickness = 12;

  // Widths (outside → inside)
  const bufferW = 3 * S; // abbreviated 3ft of 7ft buffer
  const flowerOuterW = 1 * S;
  const murumW = 12 * S;
  const flowerInnerW = 3 * S;

  // X positions
  const bufferX = pad.left;
  const flowerOuterX = bufferX + bufferW;
  const murumX = flowerOuterX + flowerOuterW;
  const flowerInnerX = murumX + murumW;

  const svgW = flowerInnerX + flowerInnerW + pad.right;
  const svgH = groundY + roadThickness + pad.bottom;

  const coconutY = groundY - 30;
  const trunkH = 24;

  // Flower colors for rendering
  const outerFlowerColors = ["#FFA000", "#FF7043", "#E91E63", "#FFA000"];
  const innerFlowerColors = ["#EC4899", "#FFA000", "#E91E63", "#FFEB3B", "#FF7043"];

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-950 overflow-hidden">
      <div className="px-3 py-2 border-b bg-muted/30">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
          <Ruler className="size-3" />
          Road Cross-Section — 12ft Peripheral Road (Outside → Inside)
        </p>
      </div>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full h-auto"
        style={{ minHeight: 220 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="murumDots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#A0785A" opacity="0.4" />
            <circle cx="6" cy="6" r="0.6" fill="#8B6914" opacity="0.3" />
            <circle cx="5" cy="1" r="0.4" fill="#6D4C41" opacity="0.2" />
          </pattern>
          <pattern id="flowerPat" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="#EC4899" opacity="0.3" />
            <circle cx="8" cy="7" r="1.2" fill="#FFA000" opacity="0.3" />
          </pattern>
          <marker id="roadArrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#999" />
          </marker>
          <symbol id="coconutTree" viewBox="0 0 20 40">
            <path d="M10 38 Q8 28 10 18" fill="none" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M10 18 Q2 12 0 6" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10 18 Q18 12 20 6" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10 18 Q4 8 6 0" fill="none" stroke="#66BB6A" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M10 18 Q16 8 14 0" fill="none" stroke="#66BB6A" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M10 18 Q10 10 10 2" fill="none" stroke="#43A047" strokeWidth="1" strokeLinecap="round" />
            <circle cx="9" cy="19" r="1.5" fill="#8D6E63" />
            <circle cx="11" cy="20" r="1.5" fill="#A1887F" />
          </symbol>
        </defs>

        {/* Sky background */}
        <rect width={svgW} height={svgH} fill="#FAFAFA" />
        <rect x={0} y={0} width={svgW} height={groundY} fill="#F0F8FF" opacity="0.35" />

        {/* Direction labels */}
        <text x={pad.left} y={16} fontSize="9" fontWeight="700" fill="#E65100">OUTSIDE</text>
        <text x={pad.left} y={26} fontSize="7" fill="#E65100">(Boundary)</text>
        <text x={svgW - pad.right} y={16} textAnchor="end" fontSize="9" fontWeight="700" fill="#1B5E20">INSIDE</text>
        <text x={svgW - pad.right} y={26} textAnchor="end" fontSize="7" fill="#1B5E20">(Farm Zone)</text>
        <line x1={pad.left + 58} y1={20} x2={svgW - pad.right - 58} y2={20} stroke="#aaa" strokeWidth="0.6" markerEnd="url(#roadArrow)" />

        {/* ── 1. Buffer zone (abbreviated) ── */}
        <rect x={bufferX} y={groundY - 4} width={bufferW} height={roadThickness + 8} fill="#81C784" opacity="0.2" rx="2" />
        <rect x={bufferX} y={groundY - 4} width={bufferW} height={roadThickness + 8} fill="none" stroke="#4CAF50" strokeWidth="0.8" strokeDasharray="4 2" rx="2" />
        <text x={bufferX + bufferW / 2} y={groundY + 4} textAnchor="middle" fontSize="7" fill="#2E7D32" fontWeight="500">Buffer</text>
        <text x={bufferX + bufferW / 2} y={groundY + 14} textAnchor="middle" fontSize="6" fill="#388E3C">(7ft)</text>

        {/* Coconut tree on buffer side */}
        <use href="#coconutTree" x={bufferX + bufferW - 14} y={coconutY} width="16" height={trunkH + 10} />

        {/* ── 2. Outer Flower Strip (1ft) ── */}
        <rect x={flowerOuterX} y={groundY} width={flowerOuterW} height={roadThickness} fill="#F9A8D4" opacity="0.5" rx="1" />
        <rect x={flowerOuterX} y={groundY} width={flowerOuterW} height={roadThickness} fill="url(#flowerPat)" rx="1" />
        {/* Flower stems on outer strip */}
        {outerFlowerColors.map((c, i) => {
          const fx = flowerOuterX + flowerOuterW * ((i + 0.5) / outerFlowerColors.length);
          return (
            <g key={`fo-${i}`}>
              <line x1={fx} y1={groundY} x2={fx} y2={groundY - 10 - (i % 2) * 3} stroke="#4CAF50" strokeWidth="0.7" strokeLinecap="round" />
              <circle cx={fx} cy={groundY - 11 - (i % 2) * 3} r={2.2} fill={c} opacity="0.8" />
            </g>
          );
        })}

        {/* ── 3. Full Compacted Murum Road (12ft) ── */}
        {/* Sub-base layer */}
        <rect x={murumX} y={groundY + roadThickness - 4} width={murumW} height={4} fill="#A1887F" opacity="0.3" rx="1" />
        <text x={murumX + murumW / 2} y={groundY + roadThickness + 1} textAnchor="middle" fontSize="5.5" fill="#8D6E63" opacity="0.6">sub-base (trench soil)</text>

        {/* Murum surface with crowned profile */}
        <path
          d={`M${murumX} ${groundY + roadThickness} L${murumX} ${groundY + 1} Q${murumX + murumW / 2} ${groundY - 4} ${murumX + murumW} ${groundY + 1} L${murumX + murumW} ${groundY + roadThickness} Z`}
          fill="#D4A373" opacity="0.85"
        />
        <path
          d={`M${murumX} ${groundY + roadThickness} L${murumX} ${groundY + 1} Q${murumX + murumW / 2} ${groundY - 4} ${murumX + murumW} ${groundY + 1} L${murumX + murumW} ${groundY + roadThickness} Z`}
          fill="url(#murumDots)"
        />

        {/* Crown indicator */}
        <path
          d={`M${murumX + 30} ${groundY + 1} Q${murumX + murumW / 2} ${groundY - 4} ${murumX + murumW - 30} ${groundY + 1}`}
          fill="none" stroke="#8D6E63" strokeWidth="0.7" strokeDasharray="3 2" opacity="0.5"
        />
        <text x={murumX + murumW / 2} y={groundY - 8} textAnchor="middle" fontSize="6" fill="#8D6E63" opacity="0.7">crowned 2&quot; center</text>

        {/* Center dashed line */}
        <line
          x1={murumX + murumW * 0.25} y1={groundY + 5}
          x2={murumX + murumW * 0.75} y2={groundY + 5}
          stroke="#fff" strokeWidth="0.8" strokeDasharray="8 5" opacity="0.35"
        />

        {/* Road label */}
        <text x={murumX + murumW / 2} y={groundY - 16} textAnchor="middle" fontSize="9" fill="#6D4C41" fontWeight="700">
          Compacted Murum Road
        </text>

        {/* Vehicle + walk icons */}
        <text x={murumX + murumW * 0.3} y={groundY + 8} textAnchor="middle" fontSize="8" opacity="0.3">🚜</text>
        <text x={murumX + murumW * 0.7} y={groundY + 8} textAnchor="middle" fontSize="8" opacity="0.3">🦶</text>
        <text x={murumX + murumW * 0.3} y={groundY + roadThickness + 14} textAnchor="middle" fontSize="5.5" fill="#8D6E63">(vehicle + walk)</text>

        {/* ── 4. Inner Flower Bed (3ft) ── */}
        <rect x={flowerInnerX} y={groundY} width={flowerInnerW} height={roadThickness} fill="#F9A8D4" opacity="0.5" rx="1" />
        <rect x={flowerInnerX} y={groundY} width={flowerInnerW} height={roadThickness} fill="url(#flowerPat)" rx="1" />
        {/* Flower stems on inner bed */}
        {innerFlowerColors.map((c, i) => {
          const fx = flowerInnerX + flowerInnerW * ((i + 0.5) / innerFlowerColors.length);
          return (
            <g key={`fi-${i}`}>
              <line x1={fx} y1={groundY} x2={fx} y2={groundY - 14 - (i % 2) * 5} stroke="#4CAF50" strokeWidth="0.8" strokeLinecap="round" />
              <circle cx={fx} cy={groundY - 15 - (i % 2) * 5} r={2.8} fill={c} opacity="0.75" />
            </g>
          );
        })}

        {/* Coconut tree on farm side */}
        <use href="#coconutTree" x={flowerInnerX + 6} y={coconutY} width="16" height={trunkH + 10} />

        {/* ── Ground level line ── */}
        <line x1={flowerOuterX - 5} y1={groundY + roadThickness} x2={flowerInnerX + flowerInnerW + 5} y2={groundY + roadThickness} stroke="#795548" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.4" />

        {/* ── Width dimension lines (bottom) ── */}
        {[
          { x: flowerOuterX, w: flowerOuterW, label: "1 ft", sub: "flower" },
          { x: murumX, w: murumW, label: "12 ft", sub: "murum road" },
          { x: flowerInnerX, w: flowerInnerW, label: "3 ft", sub: "flower" },
        ].map((d, i) => (
          <g key={`dim-${i}`} transform={`translate(0, ${groundY + roadThickness + 22})`}>
            <line x1={d.x} y1={0} x2={d.x + d.w} y2={0} stroke="#666" strokeWidth="0.7" />
            <line x1={d.x} y1={-4} x2={d.x} y2={4} stroke="#666" strokeWidth="0.7" />
            <line x1={d.x + d.w} y1={-4} x2={d.x + d.w} y2={4} stroke="#666" strokeWidth="0.7" />
            <text x={d.x + d.w / 2} y={14} textAnchor="middle" fontSize="8" fill="#444" fontWeight="700">{d.label}</text>
            <text x={d.x + d.w / 2} y={24} textAnchor="middle" fontSize="6.5" fill="#888">{d.sub}</text>
          </g>
        ))}

        {/* Total width bracket */}
        {(() => {
          const totalX = flowerOuterX;
          const totalW = flowerInnerX + flowerInnerW - flowerOuterX;
          const bracketY = groundY + roadThickness + 46;
          return (
            <g>
              <line x1={totalX} y1={bracketY} x2={totalX + totalW} y2={bracketY} stroke="#D32F2F" strokeWidth="1" />
              <line x1={totalX} y1={bracketY - 4} x2={totalX} y2={bracketY + 4} stroke="#D32F2F" strokeWidth="1" />
              <line x1={totalX + totalW} y1={bracketY - 4} x2={totalX + totalW} y2={bracketY + 4} stroke="#D32F2F" strokeWidth="1" />
              <text x={totalX + totalW / 2} y={bracketY - 5} textAnchor="middle" fontSize="9" fill="#D32F2F" fontWeight="700">
                1 ft + 12 ft + 3 ft = 16 ft (flowers both sides)
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div className="px-3 py-1.5 bg-muted/30 text-[10px] text-muted-foreground flex items-center gap-4 border-t flex-wrap gap-y-1">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-2.5 rounded-sm" style={{ backgroundColor: "#D4A373" }} />
          Murum road (vehicle + walk)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-2.5 rounded-sm" style={{ backgroundColor: "#F9A8D4" }} />
          Flower beds (both sides)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-2.5 rounded-sm" style={{ backgroundColor: "#A1887F" }} />
          Sub-base (trench soil)
        </span>
      </div>
    </div>
  );
}

// ================================================================
// Section wrapper
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
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ================================================================
// Main Road Detail Sheet
// ================================================================
export function RoadDetailSheet({ open, onOpenChange }: RoadDetailSheetProps) {
  const totalMurumSqFt = 15 * 778 + 12 * (619 + 778 + 619);
  const perimeterLengthFt = 2 * (660 + 792);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <SheetTitle className="text-base leading-tight">
              Peripheral Road Surface
            </SheetTitle>
            <Badge className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              Murum + Flowers Both Sides
            </Badge>
          </div>
          <SheetDescription className="text-xs leading-relaxed">
            Full-width compacted murum road with flowers on BOTH sides — 1ft
            outer flower strip (boundary side) + 3ft inner flower bed (farm
            side). Road framed by colorful blooms under a coconut avenue canopy.
          </SheetDescription>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className="text-[10px] font-mono gap-1">
              <Ruler className="size-2.5" />
              12-15 ft full murum
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono gap-1">
              <TruckIcon className="size-2.5" />
              ~{totalMurumSqFt.toLocaleString("en-IN")} sq ft
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono gap-1">
              <Flower2 className="size-2.5" />
              Flowers both sides
            </Badge>
          </div>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-5">
          {/* Cross-Section Diagram */}
          <RoadCrossSectionSVG />

          {/* Road Layers */}
          <DetailSection icon={Layers} title="Road Cross-Section Layers (12ft Road)">
            <div className="space-y-2">
              {ROAD_CROSS_SECTION_12FT.filter(
                (l) => l.id !== "rcs-buffer"
              ).map((layer, i) => (
                <div key={layer.id} className="rounded-lg border p-2.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground w-4 shrink-0">
                      {i + 1}.
                    </span>
                    <span
                      className="size-3 rounded-full shrink-0"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="text-xs font-semibold">{layer.label}</span>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-mono ml-auto"
                    >
                      {layer.widthFt} ft
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic pl-6">
                    {layer.material}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-6">
                    {layer.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-2.5 mt-2">
              <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-relaxed">
                <span className="font-semibold">West Main Road (15ft):</span>{" "}
                Same design — full 15ft murum with 1ft outer flower strip + 3ft
                inner flower bed. Extra width for two-way tractor traffic.
              </p>
            </div>
          </DetailSection>

          <Separator />

          {/* Surface Materials */}
          <DetailSection icon={Layers} title="Surface Materials">
            <div className="space-y-3">
              {ROAD_SURFACE_MATERIALS.map((mat) => (
                <div key={mat.id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-4 rounded-full shrink-0 border"
                      style={{ backgroundColor: mat.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold block">
                        {mat.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {mat.nameHindi}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-mono shrink-0"
                    >
                      {mat.costPerSqFt}/sq ft
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {mat.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[9px] font-semibold uppercase text-green-700 dark:text-green-400 mb-1">
                        Pros
                      </p>
                      <ul className="space-y-0.5">
                        {mat.pros.map((p, i) => (
                          <li
                            key={i}
                            className="text-[10px] text-muted-foreground flex items-start gap-1"
                          >
                            <span className="text-green-500 mt-0.5 shrink-0">+</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold uppercase text-orange-700 dark:text-orange-400 mb-1">
                        Cons
                      </p>
                      <ul className="space-y-0.5">
                        {mat.cons.map((c, i) => (
                          <li
                            key={i}
                            className="text-[10px] text-muted-foreground flex items-start gap-1"
                          >
                            <span className="text-orange-500 mt-0.5 shrink-0">-</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DetailSection>

          <Separator />

          {/* Outer Flower Strip Species */}
          <DetailSection icon={Flower2} title="Outer 1ft Flower Strip — Species">
            <p className="text-[10px] text-muted-foreground mb-2">
              Compact, hardy species that stay within 1ft width. These bloom
              year-round with minimal care and create a colorful border between
              the boundary berm and road.
            </p>
            <div className="space-y-2">
              {OUTER_FLOWER_SPECIES.map((sp) => (
                <div key={sp.name} className="rounded-lg border p-2.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-full shrink-0"
                      style={{ backgroundColor: sp.color }}
                    />
                    <span className="text-xs font-semibold">{sp.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {sp.nameHindi}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-mono ml-auto"
                    >
                      ~{sp.heightInches}&quot; tall
                    </Badge>
                  </div>
                  <div className="flex gap-3 text-[10px] text-muted-foreground pl-5">
                    <span>Season: {sp.season}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-5">
                    {sp.whyHere}
                  </p>
                </div>
              ))}
            </div>
          </DetailSection>

          <Separator />

          {/* Construction Steps */}
          <DetailSection icon={Hammer} title="Construction Steps">
            <div className="rounded-lg bg-muted/40 p-3 space-y-2">
              {ROAD_CONSTRUCTION_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </DetailSection>

          <Separator />

          {/* Cost Estimate */}
          <DetailSection icon={IndianRupee} title="Cost Estimate — Peripheral Roads">
            <div className="space-y-2">
              {ROAD_COST_ESTIMATE.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border p-2.5 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold flex-1 min-w-0">
                      {item.label}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-mono shrink-0"
                    >
                      {item.totalEstimate}
                    </Badge>
                  </div>
                  {item.areaSqFt > 0 && (
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {item.areaSqFt.toLocaleString("en-IN")} sq ft @{" "}
                      {item.ratePerSqFt}/sq ft
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    {item.notes}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-primary/5 border-2 border-primary/20 p-3 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Total Estimated Cost</span>
                <Badge className="text-xs font-mono bg-primary text-primary-foreground">
                  {ROAD_TOTAL_COST_RANGE}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                For all 4 peripheral roads (~{totalMurumSqFt.toLocaleString("en-IN")} sq ft murum + flower borders both sides).
                Sub-base is free from boundary trench excavation.
              </p>
            </div>
          </DetailSection>

          <Separator />

          {/* Benefits */}
          <DetailSection icon={Footprints} title="Why This Design Works Best">
            <ul className="space-y-1.5">
              {[
                "Flowers on BOTH sides — road framed by colorful blooms, a garden corridor under the coconut canopy",
                "No space wasted — full 12-15ft murum for vehicles + walking, flowers use boundary transition space productively",
                "1ft outer strip mirrors the 3ft inner bed — symmetrical beauty even though widths differ",
                "Marigold on outer strip repels pests naturally — protects both boundary plants and adjacent orchard",
                "Outer strip uses compact hardy species (Marigold, Crossandra, Aloe, Lemongrass) — survives the narrow space and edge conditions",
                "Lemongrass in outer strip releases fragrance when brushed — aromatic experience walking along the road",
                "Smooth murum is comfortable barefoot — not sharp like gravel, not muddy like plain soil",
                "Pollinators (bees, butterflies) attracted to flowers on both sides — double the pollination boost for nearby orchard zones",
                "Flower income potential from both strips combined — ₹10,000-20,000/year from Marigold + Jasmine + Rose sales",
                "Trench soil sub-base = free, murum is cheap, flower seedlings are cheapest — maximum beauty at minimum cost",
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <ArrowRight className="size-3 text-pink-500 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </DetailSection>
        </div>
      </SheetContent>
    </Sheet>
  );
}
