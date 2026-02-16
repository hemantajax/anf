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
  Shield,
  TreePine,
  Hammer,
  Ruler,
  Layers,
  Sprout,
  ArrowRight,
} from "lucide-react";
import {
  FARM,
  BOUNDARY_CROSS_SECTION,
  BOUNDARY_PLANTS,
  BOUNDARY_CONSTRUCTION_STEPS,
  LIVE_FENCE_LAYERS,
} from "@/lib/masterplan-utils";

interface BoundaryDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ================================================================
// Cross-Section SVG — scaled diagram of trench & berm system
// ================================================================
function BoundaryCrossSectionSVG() {
  const S = 32; // px per ft — generous for clarity
  const groundY = 150;
  const trenchD = 3 * S;
  const bermH = 3 * S;
  const pad = { left: 50, right: 60, top: 40, bottom: 65 };

  // Horizontal positions (left → right: outside → inside)
  const gapX = pad.left;
  const gapW = 1 * S;
  const trenchX = gapX + gapW;
  const trenchW = 3 * S;
  const bermX = trenchX + trenchW;
  const bermW = 3 * S;
  const plantX = bermX + bermW;
  const plantW = 1 * S;
  const roadX = plantX + plantW;
  const roadW = 4 * S;

  const svgW = roadX + roadW + pad.right;
  const svgH = groundY + trenchD + pad.bottom;
  const sp15 = 1.5 * S; // 1.5ft in px

  // Berm flat-top edges (left = where continuous inner slope reaches top)
  const bermTopL = bermX + Math.round(bermW * 0.35);
  const bermTopR = bermX + bermW + plantW - 8;
  // Inner slope crosses ground level at this x
  const slopeGroundX = Math.round(
    trenchX + trenchW + (bermTopL - trenchX - trenchW) * (trenchD / (trenchD + bermH))
  );

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-950 overflow-hidden">
      <div className="px-3 py-2 border-b bg-muted/30">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
          <Ruler className="size-3" />
          Cross-Section View (Outside → Inside)
        </p>
      </div>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full h-auto"
        style={{ minHeight: 280 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="earthDots" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.7" fill="#6D4C41" opacity="0.25" />
            <circle cx="4.5" cy="4.5" r="0.5" fill="#5D4037" opacity="0.2" />
          </pattern>
          <pattern id="bermHatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#8D6E63" strokeWidth="0.7" opacity="0.25" />
          </pattern>
          <pattern id="roadDots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="0.5" fill="#9898B0" opacity="0.3" />
          </pattern>
          <marker id="csArrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#999" />
          </marker>
          {/* ── Plant symbols ── */}
          <symbol id="symSubabul" viewBox="-6 -6 12 12">
            <polygon points="0,-5 5,4 -5,4" fill="#66BB6A" stroke="#33691E" strokeWidth="0.6" />
          </symbol>
          <symbol id="symGliricidia" viewBox="-6 -6 12 12">
            <circle r="4" fill="#81C784" stroke="#33691E" strokeWidth="0.6" />
          </symbol>
          <symbol id="symCurry" viewBox="-6 -6 12 12">
            <polygon points="0,-5 4,0 0,5 -4,0" fill="#2D6A4F" stroke="#1B5E20" strokeWidth="0.6" />
          </symbol>
          <symbol id="symAgave" viewBox="-6 -6 12 12">
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#AED581" strokeWidth="1.8" />
            <line x1="-4.3" y1="-2.5" x2="4.3" y2="2.5" stroke="#AED581" strokeWidth="1.8" />
            <line x1="-4.3" y1="2.5" x2="4.3" y2="-2.5" stroke="#AED581" strokeWidth="1.8" />
          </symbol>
          <symbol id="symPineapple" viewBox="-6 -6 12 12">
            <rect x="-4" y="-4" width="8" height="8" fill="#FFB300" stroke="#E65100" strokeWidth="0.6" />
          </symbol>
          <symbol id="symVetiver" viewBox="-6 -4 12 8">
            <path d="M-5,-2 Q-2.5,-5 0,-2 Q2.5,1 5,-2" fill="none" stroke="#9CCC65" strokeWidth="1.4" />
            <path d="M-5,2 Q-2.5,-1 0,2 Q2.5,5 5,2" fill="none" stroke="#9CCC65" strokeWidth="1.4" />
          </symbol>
        </defs>

        {/* Background */}
        <rect width={svgW} height={svgH} fill="#FAFAFA" />
        <rect x={0} y={0} width={svgW} height={groundY} fill="#F0F8FF" opacity="0.35" />
        <rect x={0} y={groundY} width={svgW} height={svgH - groundY} fill="#EFEBE9" opacity="0.3" />

        {/* ── Direction labels (top) ── */}
        <text x={gapX} y={18} fontSize="9" fontWeight="700" fill="#E65100">OUTSIDE</text>
        <text x={gapX} y={29} fontSize="7" fill="#E65100">(Neighbor)</text>
        <text x={roadX + roadW} y={18} textAnchor="end" fontSize="9" fontWeight="700" fill="#1B5E20">INSIDE</text>
        <text x={roadX + roadW} y={29} textAnchor="end" fontSize="7" fill="#1B5E20">(Farm)</text>
        <line x1={gapX + 62} y1={22} x2={roadX - 16} y2={22} stroke="#aaa" strokeWidth="0.6" markerEnd="url(#csArrow)" />

        {/* ── 1. Outer Gap (1ft) — with top & bottom 1ft dimension brackets ── */}
        <rect x={gapX} y={groundY - 2} width={gapW} height={4} fill="#D7CCC8" opacity="0.5" />

        {/* 1ft vertical brackets are rendered alongside the ~6ft barrier below */}

        {/* ── 2 & 3. Combined Trench + Berm — continuous inner slope ── */}
        {(() => {
          // Below-ground trench: outer wall vertical, inner wall slopes to ground
          const trenchFill = `M${trenchX} ${groundY} V${groundY + trenchD} H${trenchX + trenchW} L${slopeGroundX} ${groundY} Z`;
          // Above-ground berm: continues slope from ground to berm top, then outer slope down
          const bermFill = `M${slopeGroundX} ${groundY} L${bermTopL} ${groundY - bermH} H${bermTopR} L${bermX + bermW + plantW} ${groundY} Z`;
          // Single continuous outline (outer wall → bottom → inner slope → berm top → outer slope)
          const outline = `M${trenchX} ${groundY} V${groundY + trenchD} H${trenchX + trenchW} L${bermTopL} ${groundY - bermH} H${bermTopR} L${bermX + bermW + plantW} ${groundY}`;

          return (
            <g>
              {/* Trench fill (below ground) */}
              <path d={trenchFill} fill="#EFEBE9" />
              <path d={trenchFill} fill="url(#earthDots)" />

              {/* Berm fill (above ground) */}
              <path d={bermFill} fill="#A1887F" opacity="0.6" />
              <path d={bermFill} fill="url(#bermHatch)" />

              {/* Continuous outline */}
              <path d={outline} fill="none" stroke="#6D4C41" strokeWidth="1.5" />

              {/* Water hint in trench bottom */}
              <path
                d={`M${trenchX + 8} ${groundY + trenchD - 8} Q${trenchX + trenchW * 0.35} ${groundY + trenchD - 14} ${trenchX + trenchW * 0.5} ${groundY + trenchD - 8} Q${trenchX + trenchW * 0.65} ${groundY + trenchD - 3} ${trenchX + trenchW - 8} ${groundY + trenchD - 8}`}
                fill="none" stroke="#42A5F5" strokeWidth="0.8" opacity="0.45"
              />
              <text x={trenchX + trenchW / 2} y={groundY + trenchD / 2 + 3} textAnchor="middle" fontSize="7.5" fill="#5D4037" fontWeight="500">Trench</text>

              {/* Outer wall dimension: 3 ft */}
              <line x1={trenchX - 8} y1={groundY} x2={trenchX - 8} y2={groundY + trenchD} stroke="#5D4037" strokeWidth="0.8" />
              <line x1={trenchX - 12} y1={groundY} x2={trenchX - 4} y2={groundY} stroke="#5D4037" strokeWidth="0.6" />
              <line x1={trenchX - 12} y1={groundY + trenchD} x2={trenchX - 4} y2={groundY + trenchD} stroke="#5D4037" strokeWidth="0.6" />
              <text x={trenchX - 14} y={groundY + trenchD / 2 + 3} textAnchor="end" fontSize="8" fill="#5D4037" fontWeight="700">3 ft</text>
              <text x={trenchX - 14} y={groundY + trenchD / 2 + 14} textAnchor="end" fontSize="6.5" fill="#5D4037">outer</text>

              {/* Inner slope dimension: 6 ft (dashed line from trench bottom to berm top) */}
              {(() => {
                const dimX = bermTopL + 10;
                return (
                  <g>
                    <line x1={dimX} y1={groundY + trenchD} x2={dimX} y2={groundY - bermH} stroke="#D32F2F" strokeWidth="0.8" strokeDasharray="3 2" />
                    <line x1={dimX - 3} y1={groundY + trenchD} x2={dimX + 3} y2={groundY + trenchD} stroke="#D32F2F" strokeWidth="0.6" />
                    <line x1={dimX - 3} y1={groundY - bermH} x2={dimX + 3} y2={groundY - bermH} stroke="#D32F2F" strokeWidth="0.6" />
                    <text x={dimX + 5} y={groundY + (trenchD - bermH) / 2 - 3} textAnchor="start" fontSize="7.5" fill="#D32F2F" fontWeight="700">6 ft</text>
                    <text x={dimX + 5} y={groundY + (trenchD - bermH) / 2 + 8} textAnchor="start" fontSize="6" fill="#D32F2F">inner</text>
                    <text x={dimX + 5} y={groundY + (trenchD - bermH) / 2 + 17} textAnchor="start" fontSize="6" fill="#D32F2F">slope</text>
                  </g>
                );
              })()}

              {/* Berm height dimension (right side) */}
              <line x1={bermX + bermW + plantW + 8} y1={groundY} x2={bermX + bermW + plantW + 8} y2={groundY - bermH} stroke="#5D4037" strokeWidth="0.8" />
              <line x1={bermX + bermW + plantW + 4} y1={groundY} x2={bermX + bermW + plantW + 12} y2={groundY} stroke="#5D4037" strokeWidth="0.6" />
              <line x1={bermX + bermW + plantW + 4} y1={groundY - bermH} x2={bermX + bermW + plantW + 12} y2={groundY - bermH} stroke="#5D4037" strokeWidth="0.6" />
              <text x={bermX + bermW + plantW + 16} y={groundY - bermH / 2 + 3} textAnchor="start" fontSize="8" fill="#5D4037" fontWeight="700">3 ft</text>
              <text x={bermX + bermW + plantW + 16} y={groundY - bermH / 2 + 14} textAnchor="start" fontSize="6.5" fill="#5D4037">high</text>
            </g>
          );
        })()}

        {/* ── 1ft TOP + ~6ft effective barrier + 1ft BOTTOM — stacked vertically ── */}
        {(() => {
          const bx = trenchX - 30;
          const sixTop = groundY - bermH;
          const sixBot = groundY + trenchD;
          const oneTopEnd = sixTop - S; // 1ft above 6ft top
          const oneBotEnd = sixBot + S; // 1ft below 6ft bottom
          return (
            <g>
              {/* 1ft TOP — above 6ft barrier */}
              <line x1={bx} y1={sixTop} x2={bx} y2={oneTopEnd} stroke="#E65100" strokeWidth="1.5" />
              <line x1={bx - 5} y1={sixTop} x2={bx + 5} y2={sixTop} stroke="#E65100" strokeWidth="1" />
              <line x1={bx - 5} y1={oneTopEnd} x2={bx + 5} y2={oneTopEnd} stroke="#E65100" strokeWidth="1" />
              <text x={bx - 8} y={(sixTop + oneTopEnd) / 2 + 3} textAnchor="end" fontSize="8" fill="#E65100" fontWeight="700">1 ft</text>

              {/* ~6ft barrier (middle) */}
              <line x1={bx} y1={sixTop} x2={bx} y2={sixBot} stroke="#D32F2F" strokeWidth="1.5" />
              <line x1={bx - 5} y1={sixTop} x2={bx + 5} y2={sixTop} stroke="#D32F2F" strokeWidth="0.8" />
              <line x1={bx - 5} y1={sixBot} x2={bx + 5} y2={sixBot} stroke="#D32F2F" strokeWidth="0.8" />
              <text x={bx - 8} y={groundY + (trenchD - bermH) / 2 - 6} textAnchor="end" fontSize="9" fill="#D32F2F" fontWeight="700">~6 ft</text>
              <text x={bx - 8} y={groundY + (trenchD - bermH) / 2 + 6} textAnchor="end" fontSize="7" fill="#D32F2F" fontWeight="600">effective</text>
              <text x={bx - 8} y={groundY + (trenchD - bermH) / 2 + 17} textAnchor="end" fontSize="7" fill="#D32F2F" fontWeight="600">barrier</text>

              {/* 1ft BOTTOM — below 6ft barrier */}
              <line x1={bx} y1={sixBot} x2={bx} y2={oneBotEnd} stroke="#E65100" strokeWidth="1.5" />
              <line x1={bx - 5} y1={sixBot} x2={bx + 5} y2={sixBot} stroke="#E65100" strokeWidth="1" />
              <line x1={bx - 5} y1={oneBotEnd} x2={bx + 5} y2={oneBotEnd} stroke="#E65100" strokeWidth="1" />
              <text x={bx - 8} y={(sixBot + oneBotEnd) / 2 + 3} textAnchor="end" fontSize="8" fill="#E65100" fontWeight="700">1 ft</text>
            </g>
          );
        })()}

        {/* ── 4. Plant markers with distinct species symbols ── */}
        {(() => {
          const topY = groundY - bermH;
          const markerSz = 10;
          const stemH = 10;

          // Berm top plants: Subabul △, Gliricidia ○, Curry ◆, Subabul △ evenly spaced
          const dx = (bermTopR - bermTopL - 24) / 3;
          const bermPlants: Array<{ x: number; sym: string; label: string }> = [
            { x: bermTopL + 12, sym: "symSubabul", label: "S" },
            { x: bermTopL + 12 + dx, sym: "symGliricidia", label: "G" },
            { x: bermTopL + 12 + dx * 2, sym: "symCurry", label: "C" },
            { x: bermTopR - 12, sym: "symSubabul", label: "S" },
          ];

          // Inner slope base: Pineapple □, Agave ✶
          const slopeMidX = bermX + bermW + plantW * 0.5;
          const slopeY = groundY - 10;
          const basePlants: Array<{ x: number; y: number; sym: string; label: string }> = [
            { x: slopeMidX - 8, y: slopeY, sym: "symPineapple", label: "P" },
            { x: slopeMidX + 8, y: slopeY, sym: "symAgave", label: "A" },
          ];

          // Vetiver on inner slope (position on the sloped wall)
          const vetiverPlants: Array<{ x: number; y: number }> = [groundY + 16, groundY + 36].map(vy => {
            const frac = ((groundY + trenchD) - vy) / (trenchD + bermH);
            const sx = trenchX + trenchW + (bermTopL - trenchX - trenchW) * frac;
            return { x: sx + 4, y: vy };
          });

          return (
            <g>
              {/* Berm-top markers with stems */}
              {bermPlants.map((p, i) => (
                <g key={`bp${i}`}>
                  <line x1={p.x} y1={topY} x2={p.x} y2={topY - stemH} stroke="#5D4037" strokeWidth="0.9" />
                  <use href={`#${p.sym}`} x={p.x - markerSz / 2} y={topY - stemH - markerSz} width={markerSz} height={markerSz} />
                </g>
              ))}
              {/* Slope-base markers */}
              {basePlants.map((p, i) => (
                <use key={`sl${i}`} href={`#${p.sym}`} x={p.x - markerSz / 2} y={p.y - markerSz / 2} width={markerSz} height={markerSz} />
              ))}
              {/* Vetiver on trench slope */}
              {vetiverPlants.map((p, i) => (
                <use key={`vt${i}`} href="#symVetiver" x={p.x - markerSz / 2} y={p.y - 4} width={markerSz} height={8} />
              ))}
            </g>
          );
        })()}

        {/* Planting label */}
        <text x={(bermTopL + bermTopR) / 2} y={groundY - bermH - 24} textAnchor="middle" fontSize="7.5" fill="#2E7D32" fontWeight="600">
          Dense planting @1.5 ft
        </text>

        {/* Left 1.5ft ruler removed — scale info on right side only */}

        {/* ── VERTICAL 1.5ft SCALE RULER — RIGHT SIDE ── */}
        {(() => {
          const rulerX = roadX + roadW + 38;
          const topY = groundY - bermH;
          const botY = groundY + trenchD;
          const ticks: number[] = [];
          for (let y = groundY; y >= topY - 2; y -= sp15) ticks.push(y);
          for (let y = groundY + sp15; y <= botY + 2; y += sp15) ticks.push(y);
          return (
            <g>
              <line x1={rulerX} y1={topY - 4} x2={rulerX} y2={botY + 4} stroke="#D32F2F" strokeWidth="1.2" />
              {ticks.map((y, i) => (
                <g key={`rt${i}`}>
                  <line x1={rulerX - 4} y1={y} x2={rulerX + 4} y2={y} stroke="#D32F2F" strokeWidth="1" />
                </g>
              ))}
              {/* "0" at ground level */}
              <text x={rulerX + 6} y={groundY + 3} textAnchor="start" fontSize="6" fill="#D32F2F" fontWeight="600">0</text>
              {/* 1.5ft label above ground */}
              {groundY - sp15 >= topY - 2 && (
                <text x={rulerX + 6} y={groundY - sp15 + 3} textAnchor="start" fontSize="6" fill="#D32F2F" fontWeight="600">1.5</text>
              )}
              {/* 3ft label (berm top) */}
              <text x={rulerX + 6} y={groundY - bermH + 3} textAnchor="start" fontSize="6" fill="#D32F2F" fontWeight="600">3.0</text>
              {/* 1.5ft label below ground */}
              {groundY + sp15 <= botY + 2 && (
                <text x={rulerX + 6} y={groundY + sp15 + 3} textAnchor="start" fontSize="6" fill="#D32F2F" fontWeight="600">-1.5</text>
              )}
              {/* 3ft label (trench bottom) */}
              <text x={rulerX + 6} y={groundY + trenchD + 3} textAnchor="start" fontSize="6" fill="#D32F2F" fontWeight="600">-3.0</text>
              {/* Scale label */}
              <text x={rulerX} y={topY - 12} textAnchor="middle" fontSize="7" fill="#D32F2F" fontWeight="700">1.5 ft</text>
              <text x={rulerX} y={topY - 5} textAnchor="middle" fontSize="5.5" fill="#D32F2F">scale</text>
            </g>
          );
        })()}

        {/* ── 5. Road section ── */}
        <rect x={roadX} y={groundY - 3} width={roadW} height={6} fill="#B8B8D1" opacity="0.55" rx="1" />
        <rect x={roadX} y={groundY - 3} width={roadW} height={6} fill="url(#roadDots)" rx="1" />
        <line x1={roadX + 10} y1={groundY} x2={roadX + roadW - 6} y2={groundY} stroke="#fff" strokeWidth="0.7" strokeDasharray="5 3" opacity="0.5" />
        <text x={roadX + roadW / 2} y={groundY - 8} textAnchor="middle" fontSize="7" fill="#666" opacity="0.55">Peripheral Road</text>

        {/* ── GROUND LEVEL LINE ── */}
        <line x1={pad.left - 15} y1={groundY} x2={svgW - pad.right + 15} y2={groundY} stroke="#795548" strokeWidth="2" strokeDasharray="8 4" />
        <text x={svgW - pad.right + 18} y={groundY - 4} fontSize="7.5" fill="#795548" fontWeight="600">Ground</text>
        <text x={svgW - pad.right + 18} y={groundY + 7} fontSize="7.5" fill="#795548" fontWeight="600">Level</text>

        {/* ── Soil movement arrow ── */}
        <path
          d={`M${trenchX + trenchW / 2} ${groundY + trenchD * 0.32} Q${trenchX + trenchW + 16} ${groundY - 18} ${bermX + bermW / 2} ${groundY - bermH * 0.5}`}
          fill="none" stroke="#8D6E63" strokeWidth="1" strokeDasharray="4 2.5" opacity="0.45"
        />
        <text x={bermX + bermW / 2 + 6} y={groundY - bermH * 0.32} fontSize="6" fill="#8D6E63" fontStyle="italic" opacity="0.65">excavated soil</text>

        {/* ── WIDTH DIMENSION LINES (below trench) ── */}
        {[
          { x: gapX, w: gapW, label: "1 ft", sub: "gap" },
          { x: trenchX, w: trenchW, label: "3 ft", sub: "trench" },
          { x: bermX, w: bermW, label: "3 ft", sub: "bed" },
          { x: plantX, w: plantW, label: "1 ft", sub: "plants" },
          { x: roadX, w: roadW, label: "12 ft", sub: "road" },
        ].map((d, i) => (
          <g key={`dim${i}`} transform={`translate(0, ${groundY + trenchD + 18})`}>
            <line x1={d.x} y1={0} x2={d.x + d.w} y2={0} stroke="#666" strokeWidth="0.7" />
            <line x1={d.x} y1={-4} x2={d.x} y2={4} stroke="#666" strokeWidth="0.7" />
            <line x1={d.x + d.w} y1={-4} x2={d.x + d.w} y2={4} stroke="#666" strokeWidth="0.7" />
            <text x={d.x + d.w / 2} y={14} textAnchor="middle" fontSize="8" fill="#444" fontWeight="700">{d.label}</text>
            <text x={d.x + d.w / 2} y={25} textAnchor="middle" fontSize="6.5" fill="#888">{d.sub}</text>
          </g>
        ))}
      </svg>

      {/* Structure Legend */}
      <div className="px-3 py-1.5 bg-muted/30 text-[10px] text-muted-foreground flex items-center gap-4 border-t flex-wrap gap-y-1">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-2.5 rounded-sm" style={{ backgroundColor: "#A1887F" }} />
          Raised bed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-2.5 rounded-sm" style={{ backgroundColor: "#EFEBE9", border: "1px solid #6D4C41" }} />
          Trench
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-2.5 rounded-sm" style={{ backgroundColor: "#B8B8D1" }} />
          Road
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-0 h-3" style={{ borderLeft: "2px solid #D32F2F" }} />
          1.5 ft scale
        </span>
      </div>

      {/* Plant Key Legend */}
      <div className="px-3 py-2 border-t bg-green-50/60 dark:bg-green-950/20">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-green-800 dark:text-green-300 mb-1.5 flex items-center gap-1">
          <Sprout className="size-3" />
          Plant Key &mdash; Live Fencing
        </p>
        <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-[10px]">
          {/* Subabul */}
          <span className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="-6 -6 12 12"><polygon points="0,-5 5,4 -5,4" fill="#66BB6A" stroke="#33691E" strokeWidth="0.6" /></svg>
            <span><span className="font-semibold text-foreground">Subabul</span> <span className="text-muted-foreground">सुबबूल</span></span>
          </span>
          {/* Gliricidia */}
          <span className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="-6 -6 12 12"><circle r="4" fill="#81C784" stroke="#33691E" strokeWidth="0.6" /></svg>
            <span><span className="font-semibold text-foreground">Gliricidia</span> <span className="text-muted-foreground">गिलीरिसिडिया</span></span>
          </span>
          {/* Curry Leaf */}
          <span className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="-6 -6 12 12"><polygon points="0,-5 4,0 0,5 -4,0" fill="#2D6A4F" stroke="#1B5E20" strokeWidth="0.6" /></svg>
            <span><span className="font-semibold text-foreground">Curry Leaf</span> <span className="text-muted-foreground">करी पत्ता</span></span>
          </span>
          {/* Agave */}
          <span className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="-6 -6 12 12">
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#AED581" strokeWidth="1.8" />
              <line x1="-4.3" y1="-2.5" x2="4.3" y2="2.5" stroke="#AED581" strokeWidth="1.8" />
              <line x1="-4.3" y1="2.5" x2="4.3" y2="-2.5" stroke="#AED581" strokeWidth="1.8" />
            </svg>
            <span><span className="font-semibold text-foreground">Agave</span> <span className="text-muted-foreground">अगेव</span></span>
          </span>
          {/* Pineapple */}
          <span className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="-6 -6 12 12"><rect x="-4" y="-4" width="8" height="8" fill="#FFB300" stroke="#E65100" strokeWidth="0.6" /></svg>
            <span><span className="font-semibold text-foreground">Pineapple</span> <span className="text-muted-foreground">अनानस</span></span>
          </span>
          {/* Vetiver */}
          <span className="flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="-6 -4 12 8">
              <path d="M-5,-2 Q-2.5,-5 0,-2 Q2.5,1 5,-2" fill="none" stroke="#9CCC65" strokeWidth="1.4" />
              <path d="M-5,2 Q-2.5,-1 0,2 Q2.5,5 5,2" fill="none" stroke="#9CCC65" strokeWidth="1.4" />
            </svg>
            <span><span className="font-semibold text-foreground">Vetiver</span> <span className="text-muted-foreground">खस</span></span>
          </span>
        </div>
      </div>
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
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ================================================================
// Main Boundary Detail Sheet
// ================================================================
export function BoundaryDetailSheet({
  open,
  onOpenChange,
}: BoundaryDetailSheetProps) {
  const perimeterFt = 2 * (FARM.width + FARM.height);
  const trenchVolumePerFt = 3 * 3;
  const totalTrenchVolumeCuFt = trenchVolumePerFt * perimeterFt;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <SheetTitle className="text-base leading-tight">
              Live Fence Boundary
            </SheetTitle>
            <Badge className="text-[10px] px-1.5 py-0 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Trench &amp; Berm System
            </Badge>
          </div>
          <SheetDescription className="text-xs leading-relaxed">
            Perimeter defense: 1 ft gap + 3 ft trench (3 ft deep) + 3 ft raised
            bed + 1 ft dense planting = ~8 ft boundary zone. Creates a ~6 ft
            effective barrier (trench bottom to berm top) with dense living fence.
          </SheetDescription>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className="text-[10px] font-mono gap-1">
              <Ruler className="size-2.5" />
              Perimeter: {perimeterFt.toLocaleString("en-IN")} ft
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono gap-1">
              <Layers className="size-2.5" />
              Trench: ~{Math.round(totalTrenchVolumeCuFt).toLocaleString("en-IN")} cu ft soil
            </Badge>
          </div>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-5">
          {/* Cross-Section Diagram */}
          <BoundaryCrossSectionSVG />

          {/* Layer Summary */}
          <DetailSection icon={Layers} title="Cross-Section Layers">
            <div className="space-y-2">
              {BOUNDARY_CROSS_SECTION.map((layer, i) => (
                <div key={layer.id} className="rounded-lg border p-2.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground w-4 shrink-0">
                      {i + 1}.
                    </span>
                    <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                    <span className="text-xs font-semibold">{layer.label}</span>
                    <Badge variant="outline" className="text-[9px] font-mono ml-auto">
                      {layer.widthFt} ft wide
                      {layer.depthFt ? ` × ${layer.depthFt} ft deep` : ""}
                      {layer.heightFt ? ` × ${layer.heightFt} ft high` : ""}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed pl-6">
                    {layer.description}
                  </p>
                </div>
              ))}
            </div>
          </DetailSection>

          <Separator />

          {/* Dense Planting Species */}
          <DetailSection icon={Sprout} title="Dense Boundary Planting Species">
            <div className="space-y-2">
              {BOUNDARY_PLANTS.map((plant) => (
                <div key={plant.id} className="rounded-lg border p-2.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: plant.color }} />
                    <span className="text-xs font-semibold">{plant.name}</span>
                    <Badge variant="outline" className="text-[9px] font-mono ml-auto">
                      @{plant.spacingFt} ft
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">{plant.species}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
                    <span><span className="text-muted-foreground">Growth:</span> <span className="font-medium">{plant.growthRate}</span></span>
                    <span><span className="text-muted-foreground">Max height:</span> <span className="font-medium">{plant.maxHeightFt} ft</span></span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{plant.purpose}</p>
                </div>
              ))}
            </div>
          </DetailSection>

          <Separator />

          {/* Construction Steps */}
          <DetailSection icon={Hammer} title="Construction Steps">
            <div className="rounded-lg bg-muted/40 p-3 space-y-2">
              {BOUNDARY_CONSTRUCTION_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </DetailSection>

          <Separator />

          {/* Live Fence Layers (existing multi-row fence) */}
          <DetailSection icon={TreePine} title="Multi-Layer Live Fence (Beyond Berm)">
            <p className="text-[10px] text-muted-foreground mb-2">
              The dense boundary planting on the berm is the first line of defense.
              Beyond it (within the 7 ft buffer), the multi-layer live fence adds:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {LIVE_FENCE_LAYERS.map((layer) => (
                <div key={layer.id} className="rounded-lg border p-2 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                    <span className="text-[11px] font-medium">{layer.name}</span>
                    <Badge variant="outline" className="text-[9px] ml-auto font-mono">{layer.symbol}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{layer.purpose}</p>
                  {layer.spacingFt > 0 && (
                    <p className="text-[10px] font-mono text-muted-foreground/70">Every {layer.spacingFt} ft</p>
                  )}
                </div>
              ))}
            </div>
          </DetailSection>

          <Separator />

          {/* Key Benefits */}
          <DetailSection icon={Shield} title="Why This Works">
            <ul className="space-y-1.5">
              {[
                "6 ft effective barrier — no human or animal can easily cross a 3 ft deep trench + 3 ft high thorny berm",
                "Rainwater harvesting — trench collects runoff and channels it along the perimeter to the farm pond",
                "Zero cost fencing — trench soil becomes the berm, planting species are self-propagating (Gliricidia from cuttings)",
                "Income from boundary — Curry Leaf, Moringa, Pineapple all generate revenue from Year 1",
                "Nitrogen fixing — Subabul and Gliricidia continuously enrich the soil for nearby orchard trees",
                "Erosion control — Vetiver on slopes + dense root networks bind the soil permanently",
                "Wind protection — multi-layer fence reduces wind speed by 50-60% for inner orchard",
                "Self-maintaining — once established (6-12 months), the hedge only needs annual pruning",
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <ArrowRight className="size-3 text-green-600 mt-0.5 shrink-0" />
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
