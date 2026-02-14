import type { PalekarModel } from "./orchard-utils";
import {
  computeAcreDensity,
  type MiddleBedType,
  type PlantCountMap,
} from "./density-utils";

// ================================================================
// INCOME MODEL — per-plant income estimates (Palekar Natural Farming)
// ================================================================

/**
 * Income profile for a plant category.
 * Income ramps linearly from `startYear` to `maturityYear`,
 * then stays at `matureIncomePerPlant` for subsequent years.
 */
export interface PlantIncomeProfile {
  id: string;
  label: string;
  color: string;
  /** Symbol IDs from density calculator that map to this profile */
  symbolIds: string[];
  /** Year when first income starts (1-based) */
  startYear: number;
  /** Year when plant reaches full production */
  maturityYear: number;
  /** Annual income per plant at maturity (₹) */
  matureIncomePerPlant: number;
  /** Whether this is an area-based crop (income per acre, not per plant) */
  perAcre?: boolean;
  /** If perAcre, income per acre at maturity */
  matureIncomePerAcre?: number;
}

/**
 * Conservative income estimates based on Palekar / ZBNF literature.
 * All figures in ₹ per plant per year (unless perAcre = true).
 */
export const PLANT_INCOME_PROFILES: PlantIncomeProfile[] = [
  {
    id: "banana",
    label: "Banana",
    color: "#38bdf8",
    symbolIds: ["banana"],
    startYear: 1,
    maturityYear: 2,
    matureIncomePerPlant: 400,
  },
  {
    id: "papaya",
    label: "Papaya",
    color: "#a78bfa",
    symbolIds: ["papaya"],
    startYear: 1,
    maturityYear: 2,
    matureIncomePerPlant: 300,
  },
  {
    id: "small",
    label: "Small Trees (Guava/Pomegranate)",
    color: "#22c55e",
    symbolIds: ["small"],
    startYear: 2,
    maturityYear: 4,
    matureIncomePerPlant: 800,
  },
  {
    id: "medium",
    label: "Medium Trees (Apple/Custard Apple)",
    color: "#ec4899",
    symbolIds: ["medium"],
    startYear: 3,
    maturityYear: 6,
    matureIncomePerPlant: 1500,
  },
  {
    id: "big",
    label: "Big Trees (Mango/Citrus)",
    color: "#ef4444",
    symbolIds: ["big"],
    startYear: 4,
    maturityYear: 8,
    matureIncomePerPlant: 3000,
  },
  {
    id: "pigeonPea",
    label: "Pigeon Pea (Arhar)",
    color: "#4ade80",
    symbolIds: ["pigeonPea"],
    startYear: 1,
    maturityYear: 1,
    matureIncomePerPlant: 50,
  },
  {
    id: "groundCover",
    label: "Ground Cover Crops",
    color: "#facc15",
    symbolIds: [
      "marigold",
      "fruitVeg",
      "milletsPulses",
      "groundnut",
      "onionGarlic",
      "cotton",
      "aromaticPaddy",
    ],
    startYear: 1,
    maturityYear: 1,
    perAcre: true,
    matureIncomePerPlant: 0,
    matureIncomePerAcre: 25000,
  },
  {
    id: "spices",
    label: "Spices (Turmeric/Ginger)",
    color: "#f97316",
    symbolIds: ["turmeric", "ginger"],
    startYear: 1,
    maturityYear: 2,
    perAcre: true,
    matureIncomePerPlant: 0,
    matureIncomePerAcre: 18000,
  },
  {
    id: "vine",
    label: "Vine Vegetables",
    color: "#16a34a",
    symbolIds: ["vineVeg"],
    startYear: 1,
    maturityYear: 1,
    perAcre: true,
    matureIncomePerPlant: 0,
    matureIncomePerAcre: 30000,
  },
];

// ================================================================
// CALCULATION
// ================================================================

/** Income for one category in one year */
export interface CategoryYearIncome {
  profileId: string;
  label: string;
  color: string;
  income: number; // ₹
}

/** Full year row */
export interface YearProjection {
  year: number;
  categories: CategoryYearIncome[];
  totalIncome: number;
  cumulativeIncome: number;
}

/** Complete projection result */
export interface IncomeProjection {
  model: PalekarModel;
  acres: number;
  years: YearProjection[];
  /** Per-category totals over all years */
  categoryTotals: { id: string; label: string; color: string; total: number }[];
  grandTotal: number;
}

/**
 * Compute income for a single category in a given year.
 */
function computeCategoryYearIncome(
  profile: PlantIncomeProfile,
  plantCount: number,
  acres: number,
  year: number
): number {
  if (year < profile.startYear) return 0;

  // Ramp factor: 0 before start, linear to 1 at maturity, 1 after
  let ramp: number;
  if (year >= profile.maturityYear) {
    ramp = 1;
  } else {
    const rampSpan = profile.maturityYear - profile.startYear;
    ramp = rampSpan > 0
      ? (year - profile.startYear + 1) / (rampSpan + 1)
      : 1;
  }

  if (profile.perAcre && profile.matureIncomePerAcre) {
    return Math.round(profile.matureIncomePerAcre * acres * ramp);
  }

  return Math.round(profile.matureIncomePerPlant * plantCount * ramp);
}

/**
 * Get plant count for a profile from density plant counts.
 */
function getPlantCountForProfile(
  profile: PlantIncomeProfile,
  plantsPerAcre: PlantCountMap
): number {
  let count = 0;
  for (const sid of profile.symbolIds) {
    count += plantsPerAcre[sid] || 0;
  }
  return count;
}

/**
 * Compute 10-year income projection.
 */
export function computeIncomeProjection(
  model: PalekarModel,
  acres: number,
  middleBed?: MiddleBedType,
  numYears = 10
): IncomeProjection {
  const acreDensity = computeAcreDensity(model, middleBed);

  // Scale plant counts to total farm
  const farmPlants: PlantCountMap = {};
  for (const [k, v] of Object.entries(acreDensity.plantsPerAcre)) {
    farmPlants[k] = Math.round(v * acres);
  }

  const categoryTotalsMap: Record<string, number> = {};
  const years: YearProjection[] = [];
  let cumulative = 0;

  for (let yr = 1; yr <= numYears; yr++) {
    const categories: CategoryYearIncome[] = [];
    let yearTotal = 0;

    for (const profile of PLANT_INCOME_PROFILES) {
      const plantCount = getPlantCountForProfile(profile, farmPlants);
      const income = computeCategoryYearIncome(profile, plantCount, acres, yr);

      if (income > 0 || yr >= profile.startYear) {
        categories.push({
          profileId: profile.id,
          label: profile.label,
          color: profile.color,
          income,
        });
      }

      yearTotal += income;
      categoryTotalsMap[profile.id] =
        (categoryTotalsMap[profile.id] || 0) + income;
    }

    cumulative += yearTotal;

    years.push({
      year: yr,
      categories,
      totalIncome: yearTotal,
      cumulativeIncome: cumulative,
    });
  }

  const categoryTotals = PLANT_INCOME_PROFILES.filter(
    (p) => (categoryTotalsMap[p.id] || 0) > 0
  ).map((p) => ({
    id: p.id,
    label: p.label,
    color: p.color,
    total: categoryTotalsMap[p.id] || 0,
  }));

  return {
    model,
    acres,
    years,
    categoryTotals: categoryTotals.sort((a, b) => b.total - a.total),
    grandTotal: cumulative,
  };
}

// ================================================================
// FORMATTING
// ================================================================

/** Format ₹ amount in Lakhs */
export function formatLakhs(amount: number): string {
  const lakhs = amount / 100000;
  if (lakhs >= 100) return `₹${lakhs.toFixed(0)}L`;
  if (lakhs >= 10) return `₹${lakhs.toFixed(1)}L`;
  if (lakhs >= 1) return `₹${lakhs.toFixed(1)}L`;
  const thousands = amount / 1000;
  if (thousands >= 1) return `₹${thousands.toFixed(0)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

/** Format ₹ amount in full Indian notation */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
