import {
  LayoutDashboard,
  PenTool,
  Grid3X3,
  Trees,
  MapPin,
  BarChart3,
  Settings,
  Calculator,
  IndianRupee,
  Map,
  BookOpen,
  Route,
  Radio,
  BadgeIndianRupee,
  TreeDeciduous,
  Users,
  CalendarHeart,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  group: "planning" | "trust";
}

export const NAV_ITEMS: NavItem[] = [
  // ---- Farm Planning ----
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview & quick stats",
    group: "planning",
  },
  {
    title: "Master Plan",
    href: "/masterplan",
    icon: Map,
    description: "12-acre architectural layout",
    group: "planning",
  },
  {
    title: "Farm Designer",
    href: "/designer",
    icon: PenTool,
    description: "Visual farm layout editor",
    group: "planning",
  },
  {
    title: "Block Templates",
    href: "/templates",
    icon: Grid3X3,
    description: "Design reusable block layouts",
    group: "planning",
  },
  {
    title: "Plant Density",
    href: "/density",
    icon: Calculator,
    description: "Plants per block, acre & farm",
    group: "planning",
  },
  {
    title: "Income Projection",
    href: "/income",
    icon: IndianRupee,
    description: "10-year earning estimates",
    group: "planning",
  },
  {
    title: "Plant Library",
    href: "/plants",
    icon: Trees,
    description: "Manage plant types & species",
    group: "planning",
  },
  {
    title: "Zone Manager",
    href: "/zones",
    icon: MapPin,
    description: "Configure farm zones",
    group: "planning",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    description: "Calculations & projections",
    group: "planning",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "App preferences",
    group: "planning",
  },
  // ---- Customer Trust Platform ----
  {
    title: "Our Story",
    href: "/story",
    icon: BookOpen,
    description: "Farm philosophy & ZBNF principles",
    group: "trust",
  },
  {
    title: "Crop Journey",
    href: "/journey",
    icon: Route,
    description: "Seed-to-plate traceability",
    group: "trust",
  },
  {
    title: "Live Farm",
    href: "/live",
    icon: Radio,
    description: "Real-time farm window",
    group: "trust",
  },
  {
    title: "Price Transparency",
    href: "/pricing",
    icon: BadgeIndianRupee,
    description: "Honest pricing & mandi comparison",
    group: "trust",
  },
  {
    title: "Adopt a Tree",
    href: "/adopt",
    icon: TreeDeciduous,
    description: "Sponsor a tree, get its produce",
    group: "trust",
  },
  {
    title: "Customer Portal",
    href: "/portal",
    icon: Users,
    description: "Orders, impact & referrals",
    group: "trust",
  },
  {
    title: "Farm Connect",
    href: "/connect",
    icon: CalendarHeart,
    description: "Visits, events & farmer notes",
    group: "trust",
  },
];

export const DEFAULT_FARM = {
  name: "My 12-Acre Orchard",
  totalAcres: 12,
  reservedAcres: 2,
  netProductiveAcres: 10,
  totalBlocks: 330,
  totalPlants: 7920,
};

export const INCOME_DATA = [
  { year: "Year 1", income: 10, label: "₹9-10L" },
  { year: "Year 2", income: 22, label: "₹20-22L" },
  { year: "Year 3", income: 30, label: "₹28-32L" },
  { year: "Year 4", income: 32, label: "₹28-32L" },
  { year: "Year 5+", income: 62, label: "₹55-70L" },
];

export const PLANT_SUMMARY = [
  { name: "Big Trees", count: 660, color: "#2d6a4f", category: "big" },
  { name: "Medium Trees", count: 660, color: "#74c69d", category: "medium" },
  { name: "Small Trees", count: 1320, color: "#a7c957", category: "small" },
  { name: "Banana", count: 3960, color: "#fee440", category: "banana" },
  { name: "Guava", count: 1320, color: "#f4845f", category: "guava" },
];

export const ZONE_SUMMARY = [
  {
    name: "Zone A",
    label: "High Cash Flow",
    acres: 4,
    color: "bg-emerald-500",
    description: "Banana + Guava dominant, heavy drip & fertigation",
  },
  {
    name: "Zone B",
    label: "Balanced Orchard",
    acres: 4,
    color: "bg-blue-500",
    description: "Full B/M/S mix, medium input, stable output",
  },
  {
    name: "Zone C",
    label: "Asset & Premium",
    acres: 2,
    color: "bg-amber-500",
    description: "Mango, Jackfruit, Avocado, Drumstick, nursery",
  },
];

// ---- Full Zone defaults (used by zone-store) ----
import type { Zone, BlockTemplate, OrchardConfig } from "@/types/farm";
import {
  configFromBedCount,
  computeOrchardLayout,
  getCenterColumnTrees,
  getSmallTreeCenterColumn,
  getIntermediatePlacements,
  getBed13GroundCoverPlacements,
  getBed2EdgePlacements,
  getBed2IntermediatePlacements,
  getBed2InteriorPlacements,
  getBed4Placements,
  isBMSBed,
  isVineBed,
  type PalekarModel,
} from "@/lib/orchard-utils";

export const BLOCK_TEMPLATE_OPTIONS = [
  { id: "standard-orchard", name: "Standard Orchard", size: "36×36 ft" },
  { id: "compact-orchard", name: "Compact Orchard", size: "24×24 ft" },
  { id: "banana-block", name: "Banana Block", size: "36×36 ft" },
  { id: "premium-block", name: "Premium Block", size: "36×36 ft" },
] as const;

/** Count total plant placements for a given orchard config. */
function countPlantsForConfig(cfg: OrchardConfig): number {
  const layout = computeOrchardLayout(cfg);
  const model = (cfg.model ?? "24x24") as PalekarModel;
  let total = 0;
  for (const bed of layout.beds) {
    const bms = isBMSBed(bed.bedType, model);
    const vine = isVineBed(bed.bedType, model);
    if (bms) {
      total += getCenterColumnTrees(bed.width, bed.height, cfg.treeSpacingFt).length;
      total += getIntermediatePlacements(bed.width, bed.height, cfg.treeSpacingFt).length;
      total += getBed13GroundCoverPlacements(bed.width, bed.height, 1.5, cfg.treeSpacingFt).length;
    }
    if (bed.bedType === 5) {
      total += getSmallTreeCenterColumn(bed.width, bed.height, cfg.treeSpacingFt).length;
      total += getIntermediatePlacements(bed.width, bed.height, cfg.treeSpacingFt).length;
      total += getBed13GroundCoverPlacements(bed.width, bed.height, 1.5, cfg.treeSpacingFt).length;
    }
    if (bed.bedType === 2) {
      total += getBed2EdgePlacements(bed.width, bed.height, 1.5, cfg.treeSpacingFt).length;
      total += getBed2IntermediatePlacements(bed.width, bed.height, 1.5, cfg.treeSpacingFt).length;
      total += getBed2InteriorPlacements(bed.width, bed.height, 1.5, cfg.treeSpacingFt).length;
    }
    if (vine) {
      total += getBed4Placements(bed.width, bed.height).length;
    }
  }
  return total;
}

/** Build a full BlockTemplate from basic parameters. */
export function buildBlockTemplate(
  id: string,
  name: string,
  description: string,
  cfg: OrchardConfig,
  isDefault = false,
): BlockTemplate {
  const layout = computeOrchardLayout(cfg);
  const now = new Date().toISOString();
  return {
    id,
    name,
    description,
    widthFt: cfg.widthFt,
    heightFt: cfg.heightFt,
    orchardConfig: cfg,
    plants: [],
    trenches: layout.paths.map((p) => ({ y: p.y, widthFt: p.width })),
    beds: layout.beds.map((b) => ({ y: b.y, heightFt: b.height, label: b.label })),
    totalPlants: countPlantsForConfig(cfg),
    createdAt: now,
    updatedAt: now,
    isDefault,
  };
}

export const DEFAULT_TEMPLATES: BlockTemplate[] = [
  buildBlockTemplate(
    "standard-orchard",
    "Standard Orchard",
    "Full Palekar 36×36 module with B/M/S trees, Banana/Papaya, and vine beds.",
    configFromBedCount(4, 1, "36x36", "standard"),
    true,
  ),
  buildBlockTemplate(
    "compact-orchard",
    "Compact Orchard",
    "Compact 24×24 module — same bed cycle at smaller scale.",
    configFromBedCount(4, 1, "24x24", "standard"),
    true,
  ),
  buildBlockTemplate(
    "banana-block",
    "Banana Block",
    "High-density banana layout — all Bed 2 replaced with S-Beds for maximum banana/papaya yield.",
    configFromBedCount(4, 1, "36x36", "allSmall"),
    true,
  ),
  buildBlockTemplate(
    "premium-block",
    "Premium Block",
    "Premium asset trees (Mango, Jackfruit, Avocado) with standard bed layout.",
    configFromBedCount(4, 1, "36x36", "standard"),
    true,
  ),
];

export const ZONE_COLOR_PRESETS = [
  { value: "#10b981", label: "Emerald" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ef4444", label: "Red" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#ec4899", label: "Pink" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#f97316", label: "Orange" },
] as const;

export const DEFAULT_ZONES: Zone[] = [
  {
    id: "zone-a",
    name: "Zone A",
    color: "#10b981",
    acres: 4,
    strategy: "High Cash Flow — Banana + Guava dominant, heavy drip & fertigation",
    blockTemplateId: "banana-block",
    bounds: { x: 0, y: 0, width: 400, height: 300 },
  },
  {
    id: "zone-b",
    name: "Zone B",
    color: "#3b82f6",
    acres: 4,
    strategy: "Balanced Orchard — Full B/M/S mix, medium input, stable output",
    blockTemplateId: "standard-orchard",
    bounds: { x: 400, y: 0, width: 400, height: 300 },
  },
  {
    id: "zone-c",
    name: "Zone C",
    color: "#f59e0b",
    acres: 2,
    strategy: "Asset & Premium — Mango, Jackfruit, Avocado, Drumstick, nursery",
    blockTemplateId: "premium-block",
    bounds: { x: 0, y: 300, width: 400, height: 200 },
  },
];
