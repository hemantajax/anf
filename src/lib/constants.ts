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
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview & quick stats",
  },
  {
    title: "Master Plan",
    href: "/masterplan",
    icon: Map,
    description: "12-acre architectural layout",
  },
  {
    title: "Farm Designer",
    href: "/designer",
    icon: PenTool,
    description: "Visual farm layout editor",
  },
  {
    title: "Block Templates",
    href: "/templates",
    icon: Grid3X3,
    description: "Design reusable block layouts",
  },
  {
    title: "Plant Density",
    href: "/density",
    icon: Calculator,
    description: "Plants per block, acre & farm",
  },
  {
    title: "Income Projection",
    href: "/income",
    icon: IndianRupee,
    description: "10-year earning estimates",
  },
  {
    title: "Plant Library",
    href: "/plants",
    icon: Trees,
    description: "Manage plant types & species",
  },
  {
    title: "Zone Manager",
    href: "/zones",
    icon: MapPin,
    description: "Configure farm zones",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    description: "Calculations & projections",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "App preferences",
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
import type { Zone } from "@/types/farm";

export const BLOCK_TEMPLATE_OPTIONS = [
  { id: "standard-orchard", name: "Standard Orchard", size: "36×36 ft" },
  { id: "compact-orchard", name: "Compact Orchard", size: "24×24 ft" },
  { id: "banana-block", name: "Banana Block", size: "36×36 ft" },
  { id: "premium-block", name: "Premium Block", size: "36×36 ft" },
] as const;

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
