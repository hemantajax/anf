import {
  getCenterColumnTrees,
  getIntermediatePlacements,
  getBed13GroundCoverPlacements,
  getBed2EdgePlacements,
  getBed2IntermediatePlacements,
  getBed2InteriorPlacements,
  getBed4Placements,
  PLANT_SYMBOLS,
  type PalekarModel,
  type TreePlacement,
  MODEL_DEFAULTS,
} from "./orchard-utils";

// ---- Constants ----
const SQ_FT_PER_ACRE = 43_560;
const BED_WIDTH_FT = 9;
const GRID_SPACING_FT = 1.5;

/** Per-plant count keyed by symbol ID */
export type PlantCountMap = Record<string, number>;

/** Middle bed choice for 24×24 (Bed 2 = BA/PA, Bed 4 = Vine/Veg) */
export type MiddleBedType = "bed2" | "bed4";

/** Summary for a single bed */
export interface BedDensity {
  bedType: number; // 1, 2, 3, or 4
  label: string;
  plants: PlantCountMap;
  total: number;
}

/** Full block density breakdown */
export interface BlockDensity {
  model: PalekarModel;
  /** K-module label, e.g. "24 × 24" */
  blockSizeFt: string;
  /** Number of beds in the K-module (3 for 24×24, 4 for 36×36) */
  bedCount: number;
  bedLength: number;
  treeSpacing: number;
  beds: BedDensity[];
  totalPerBlock: PlantCountMap;
  grandTotal: number;
}

/** Acre-level summary */
export interface AcreDensity {
  model: PalekarModel;
  /** K-module tiling area (24×24=576 or 36×36=1296 sq ft) */
  tileAreaSqFt: number;
  /** K-module size in feet */
  kSizeFt: number;
  /** Max theoretical blocks (K-module tiling) */
  theoreticalBlocksPerAcre: number;
  /** Practical blocks after road/infra deduction */
  blocksPerAcre: number;
  plantsPerAcre: PlantCountMap;
  totalPlantsPerAcre: number;
  /** Utilization % (e.g. 0.82 = 82%) */
  utilization: number;
}

/** Farm-level summary */
export interface FarmDensity {
  acres: number;
  totalBlocks: number;
  totalPlants: number;
  plantBreakdown: PlantCountMap;
}

/**
 * Default utilization factor: ~82%
 * Accounts for farm roads (15ft main + 6ft secondary), ponds, sheds,
 * boundary live-fence, and other infrastructure.
 */
const DEFAULT_UTILIZATION = 0.82;

// ---- Helpers ----

function countPlacements(placements: { symbolId: string }[]): PlantCountMap {
  const counts: PlantCountMap = {};
  for (const p of placements) {
    counts[p.symbolId] = (counts[p.symbolId] || 0) + 1;
  }
  return counts;
}

function mergeCounts(...maps: PlantCountMap[]): PlantCountMap {
  const merged: PlantCountMap = {};
  for (const m of maps) {
    for (const [k, v] of Object.entries(m)) {
      merged[k] = (merged[k] || 0) + v;
    }
  }
  return merged;
}

function totalFromMap(map: PlantCountMap): number {
  return Object.values(map).reduce((a, b) => a + b, 0);
}

function scaleCounts(map: PlantCountMap, factor: number): PlantCountMap {
  const scaled: PlantCountMap = {};
  for (const [k, v] of Object.entries(map)) {
    scaled[k] = Math.round(v * factor);
  }
  return scaled;
}

// ---- Gather all placements for a bed type ----

function getAllBedPlacements(
  bedType: number,
  bedLength: number,
  treeSpacing: number
): TreePlacement[] {
  if (bedType === 1 || bedType === 3) {
    return [
      ...getCenterColumnTrees(BED_WIDTH_FT, bedLength, treeSpacing),
      ...getIntermediatePlacements(BED_WIDTH_FT, bedLength, treeSpacing),
      ...getBed13GroundCoverPlacements(BED_WIDTH_FT, bedLength, GRID_SPACING_FT, treeSpacing),
    ];
  } else if (bedType === 2) {
    return [
      ...getBed2EdgePlacements(BED_WIDTH_FT, bedLength, GRID_SPACING_FT, treeSpacing),
      ...getBed2IntermediatePlacements(BED_WIDTH_FT, bedLength, GRID_SPACING_FT, treeSpacing),
      ...getBed2InteriorPlacements(BED_WIDTH_FT, bedLength, GRID_SPACING_FT, treeSpacing),
    ];
  } else {
    return getBed4Placements(BED_WIDTH_FT, bedLength, GRID_SPACING_FT, 3);
  }
}

// ---- Bed-level density (standalone — for "Per Module" display) ----

function computeBedDensity(
  bedType: number,
  bedLength: number,
  treeSpacing: number
): PlantCountMap {
  return countPlacements(getAllBedPlacements(bedType, bedLength, treeSpacing));
}

// ---- Tiled bed density (for acre/farm scaling) ----
// In continuous tiling, plants at y = bedLength are shared with the next
// row below (they are the y = 0 of that row). So the unique contribution
// of each module is only placements where y < bedLength.

function computeTiledBedDensity(
  bedType: number,
  bedLength: number,
  treeSpacing: number
): PlantCountMap {
  const all = getAllBedPlacements(bedType, bedLength, treeSpacing);
  const unique = all.filter((p) => p.yOffsetFt < bedLength);
  return countPlacements(unique);
}

// ---- Block-level density (standalone — for display) ----

/**
 * Compute plant counts for one STANDALONE K-module (for display).
 *
 * 24×24 → 3-bed module: Bed 1 | Middle (Bed 2 or 4) | Bed 3
 * 36×36 → 4-bed module: Bed 1 | Bed 2 | Bed 4 | Bed 3
 */
export function computeBlockDensity(
  model: PalekarModel,
  middleBed: MiddleBedType = "bed2"
): BlockDensity {
  const md = MODEL_DEFAULTS[model];
  const { bedLength, treeSpacingFt } = md;

  const bedCycle = getBedCycle(model, middleBed);

  const beds: BedDensity[] = bedCycle.map((bedType) => {
    const plants = computeBedDensity(bedType, bedLength, treeSpacingFt);
    return {
      bedType,
      label: `Bed ${bedType}`,
      plants,
      total: totalFromMap(plants),
    };
  });

  const totalPerBlock = mergeCounts(...beds.map((b) => b.plants));

  return {
    model,
    blockSizeFt: model === "24x24" ? "24 × 24" : "36 × 36",
    bedCount: bedCycle.length,
    bedLength,
    treeSpacing: treeSpacingFt,
    beds,
    totalPerBlock,
    grandTotal: totalFromMap(totalPerBlock),
  };
}

// ---- Helpers for bed cycles ----

function getBedCycle(model: PalekarModel, middleBed: MiddleBedType): number[] {
  if (model === "24x24") {
    return [1, middleBed === "bed2" ? 2 : 4, 3];
  }
  return MODEL_DEFAULTS[model].bedTypeCycle; // [1, 2, 4, 3]
}

/**
 * When K-modules tile horizontally, the last B/M/S bed of one module
 * is shared with the first B/M/S bed of the next module (half-beds merge).
 *
 *   24×24: Bed 1 | Middle | Bed 3 ← Bed 3 is shared → drop it
 *          Unique per module: [Bed 1, Middle]
 *
 *   36×36: Bed 1 | Bed 2 | Bed 4 | Bed 3 ← Bed 3 shared → drop it
 *          Unique per module: [Bed 1, Bed 2, Bed 4]
 */
function getTiledBedCycle(model: PalekarModel, middleBed: MiddleBedType): number[] {
  if (model === "24x24") {
    return [1, middleBed === "bed2" ? 2 : 4]; // drop Bed 3
  }
  return [1, 2, 4]; // drop Bed 3 (position 4)
}

// ---- Tiled module density (for acre/farm scaling) ----

/**
 * Compute the UNIQUE plant contribution of one K-module when tiled
 * continuously across a farm. De-duplicates:
 *
 *   1) Vertical: excludes bottom boundary row (y = bedLength) — shared
 *      with the row below.
 *   2) Horizontal: excludes the shared boundary bed (Bed 3 = Bed 1 of
 *      the next module).
 *
 * Result: for 24×24 with 1 B/M/S bed, center column gives
 *   B(0), S(6), M(12), S(18) = 1B, 1M, 2S  → 75 B per acre ✓
 */
function computeTiledModuleDensity(
  model: PalekarModel,
  middleBed: MiddleBedType = "bed2"
): { plants: PlantCountMap; total: number } {
  const md = MODEL_DEFAULTS[model];
  const { bedLength, treeSpacingFt } = md;

  const tiledCycle = getTiledBedCycle(model, middleBed);

  const bedCounts = tiledCycle.map((bedType) =>
    computeTiledBedDensity(bedType, bedLength, treeSpacingFt)
  );

  const plants = mergeCounts(...bedCounts);
  return { plants, total: totalFromMap(plants) };
}

// ---- Acre-level density ----

/**
 * K-module tiling:
 *   24×24 → tile = 24ft × 24ft = 576 sq ft → 75 modules/acre theoretical
 *   36×36 → tile = 36ft × 36ft = 1,296 sq ft → 33 modules/acre theoretical
 *
 * Uses de-duplicated tiled counts (shared boundaries removed) so that
 * scaled totals match Palekar's published figures.
 */
export function computeAcreDensity(
  model: PalekarModel,
  middleBed?: MiddleBedType,
  utilization = DEFAULT_UTILIZATION
): AcreDensity {
  const tiled = computeTiledModuleDensity(model, middleBed);

  const kSizeFt = model === "24x24" ? 24 : 36;
  const tileAreaSqFt = kSizeFt * kSizeFt; // 576 or 1296

  const theoreticalBlocksPerAcre = Math.floor(SQ_FT_PER_ACRE / tileAreaSqFt);
  const blocksPerAcre = Math.floor(theoreticalBlocksPerAcre * utilization);

  return {
    model,
    tileAreaSqFt,
    kSizeFt,
    theoreticalBlocksPerAcre,
    blocksPerAcre,
    plantsPerAcre: scaleCounts(tiled.plants, blocksPerAcre),
    totalPlantsPerAcre: blocksPerAcre * tiled.total,
    utilization,
  };
}

// ---- Farm-level density ----

export function computeFarmDensity(
  model: PalekarModel,
  acres: number,
  middleBed?: MiddleBedType,
  utilization?: number
): FarmDensity {
  const acre = computeAcreDensity(model, middleBed, utilization);
  return {
    acres,
    totalBlocks: acre.blocksPerAcre * acres,
    totalPlants: acre.totalPlantsPerAcre * acres,
    plantBreakdown: scaleCounts(acre.plantsPerAcre, acres),
  };
}

// ---- Display helpers ----

export interface PlantDisplayInfo {
  id: string;
  label: string;
  shortLabel: string;
  fill: string;
  stroke: string;
  count: number;
}

export function getPlantDisplayList(
  counts: PlantCountMap
): PlantDisplayInfo[] {
  return Object.entries(counts)
    .map(([id, count]) => {
      const sym = PLANT_SYMBOLS[id];
      return {
        id,
        label: sym?.label ?? id,
        shortLabel: sym?.shortLabel ?? id,
        fill: sym?.fill ?? "#888",
        stroke: sym?.stroke ?? "#666",
        count,
      };
    })
    .sort((a, b) => b.count - a.count);
}

/** Group plant counts into summary categories */
export interface CategorySummary {
  category: string;
  label: string;
  color: string;
  count: number;
  ids: string[];
}

export function getCategorySummary(
  counts: PlantCountMap
): CategorySummary[] {
  const categories: CategorySummary[] = [
    {
      category: "big",
      label: "Big Trees (B)",
      color: "#ef4444",
      count: 0,
      ids: ["big"],
    },
    {
      category: "medium",
      label: "Medium Trees (M)",
      color: "#ec4899",
      count: 0,
      ids: ["medium"],
    },
    {
      category: "small",
      label: "Small Trees (S)",
      color: "#22c55e",
      count: 0,
      ids: ["small"],
    },
    {
      category: "banana",
      label: "Banana",
      color: "#38bdf8",
      count: 0,
      ids: ["banana"],
    },
    {
      category: "papaya",
      label: "Papaya",
      color: "#a78bfa",
      count: 0,
      ids: ["papaya"],
    },
    {
      category: "pigeonPea",
      label: "Pigeon Pea",
      color: "#4ade80",
      count: 0,
      ids: ["pigeonPea"],
    },
    {
      category: "groundCover",
      label: "Ground Cover Crops",
      color: "#facc15",
      count: 0,
      ids: [
        "marigold",
        "cotton",
        "fruitVeg",
        "milletsPulses",
        "aromaticPaddy",
        "groundnut",
        "onionGarlic",
      ],
    },
    {
      category: "spices",
      label: "Spices (Turmeric/Ginger)",
      color: "#f97316",
      count: 0,
      ids: ["turmeric", "ginger"],
    },
    {
      category: "vine",
      label: "Vine Vegetables",
      color: "#16a34a",
      count: 0,
      ids: ["vineVeg"],
    },
    {
      category: "structure",
      label: "Pavilion Poles",
      color: "#1e40af",
      count: 0,
      ids: ["pavilionPole"],
    },
    {
      category: "sugarcane",
      label: "Sugarcane",
      color: "#84cc16",
      count: 0,
      ids: ["sugarcane"],
    },
  ];

  for (const cat of categories) {
    for (const id of cat.ids) {
      cat.count += counts[id] || 0;
    }
  }

  return categories.filter((c) => c.count > 0);
}
