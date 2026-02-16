import type {
  CommodityProfile,
  PriceEntry,
  CostBreakdownItem,
} from "@/types/customer";

// Commodity profiles for produce grown on the farm
export const COMMODITY_PROFILES: CommodityProfile[] = [
  {
    id: "mango-kesar",
    name: "Mango (Kesar)",
    hindiName: "आम (केसर)",
    category: "fruit",
    icon: "🥭",
    unit: "kg",
    naturalDaysToRipe: 120,
    chemicalDaysToRipe: 75,
    seasonality: ["April", "May", "June"],
  },
  {
    id: "banana",
    name: "Banana",
    hindiName: "केला",
    category: "fruit",
    icon: "🍌",
    unit: "dozen",
    naturalDaysToRipe: 365,
    chemicalDaysToRipe: 270,
    seasonality: ["Year-round"],
  },
  {
    id: "papaya",
    name: "Papaya",
    hindiName: "पपीता",
    category: "fruit",
    icon: "🍈",
    unit: "kg",
    naturalDaysToRipe: 300,
    chemicalDaysToRipe: 210,
    seasonality: ["Year-round"],
  },
  {
    id: "guava",
    name: "Guava",
    hindiName: "अमरूद",
    category: "fruit",
    icon: "🍐",
    unit: "kg",
    naturalDaysToRipe: 150,
    chemicalDaysToRipe: 100,
    seasonality: ["August", "September", "February", "March"],
  },
  {
    id: "jackfruit",
    name: "Jackfruit",
    hindiName: "कटहल",
    category: "fruit",
    icon: "🍈",
    unit: "kg",
    naturalDaysToRipe: 180,
    chemicalDaysToRipe: 120,
    seasonality: ["June", "July", "August"],
  },
  {
    id: "drumstick",
    name: "Drumstick (Moringa)",
    hindiName: "सहजन",
    category: "vegetable",
    icon: "🥬",
    unit: "kg",
    naturalDaysToRipe: 90,
    chemicalDaysToRipe: 60,
    seasonality: ["February", "March", "April"],
  },
  {
    id: "turmeric",
    name: "Turmeric",
    hindiName: "हल्दी",
    category: "spice",
    icon: "🟡",
    unit: "kg",
    naturalDaysToRipe: 270,
    chemicalDaysToRipe: 210,
    seasonality: ["January", "February"],
  },
  {
    id: "ginger",
    name: "Ginger",
    hindiName: "अदरक",
    category: "spice",
    icon: "🫚",
    unit: "kg",
    naturalDaysToRipe: 240,
    chemicalDaysToRipe: 180,
    seasonality: ["December", "January"],
  },
  {
    id: "sugarcane",
    name: "Sugarcane Juice / Jaggery",
    hindiName: "गन्ना / गुड़",
    category: "grain",
    icon: "🎋",
    unit: "kg",
    naturalDaysToRipe: 365,
    chemicalDaysToRipe: 300,
    seasonality: ["November", "December", "January"],
  },
  {
    id: "vegetables-seasonal",
    name: "Seasonal Vegetables",
    hindiName: "मौसमी सब्जियां",
    category: "vegetable",
    icon: "🥦",
    unit: "kg",
    naturalDaysToRipe: 75,
    chemicalDaysToRipe: 45,
    seasonality: ["Year-round"],
  },
];

// Default cost breakdown templates for each commodity
export const DEFAULT_PRICE_ENTRIES: PriceEntry[] = [
  {
    id: "price-mango",
    commodity: "Mango (Kesar)",
    variety: "Kesar",
    unit: "kg",
    mandiPrice: 60,
    ourPrice: 85,
    costBreakdown: [
      { label: "Base growing cost", amount: 35, description: "Land, water, labor for natural cultivation" },
      { label: "Natural inputs (Jeevamrut)", amount: 8, description: "Jeevamrut, Beejamrut, organic matter" },
      { label: "Extended growing time", amount: 12, description: "120 days natural vs 75 days chemical" },
      { label: "Hand harvesting", amount: 5, description: "Careful hand-picking, no mechanical damage" },
      { label: "No artificial ripening", amount: 10, description: "Natural tree-ripening, no carbide/ethylene" },
      { label: "Fair farmer wage", amount: 15, description: "Living wage for farm workers" },
    ],
    benefits: [
      "Zero chemical residue",
      "120 days natural tree-ripening",
      "Higher nutrition density",
      "Supports sustainable farming",
      "No carbide or ethylene used",
      "Traceable to exact tree & bed",
    ],
    lastUpdated: "2026-02-16",
  },
  {
    id: "price-banana",
    commodity: "Banana",
    unit: "dozen",
    mandiPrice: 40,
    ourPrice: 55,
    costBreakdown: [
      { label: "Base growing cost", amount: 20, description: "Land preparation, planting, maintenance" },
      { label: "Natural inputs", amount: 6, description: "Jeevamrut, mulching, intercropping" },
      { label: "Natural ripening", amount: 8, description: "No ethylene chamber ripening" },
      { label: "Hand harvesting", amount: 5, description: "Cut at perfect maturity" },
      { label: "Fair farmer wage", amount: 10, description: "Fair wages for farm team" },
      { label: "Soil health maintenance", amount: 6, description: "Maintaining soil biology through ZBNF" },
    ],
    benefits: [
      "Zero chemical fertilizers",
      "Natural soil ripening",
      "No ethylene gas treatment",
      "Rich in natural nutrients",
      "Supports soil health",
      "Full traceability",
    ],
    lastUpdated: "2026-02-16",
  },
  {
    id: "price-papaya",
    commodity: "Papaya",
    unit: "kg",
    mandiPrice: 25,
    ourPrice: 38,
    costBreakdown: [
      { label: "Base growing cost", amount: 12, description: "Land, water, organic mulch" },
      { label: "Natural inputs", amount: 5, description: "Jeevamrut application, neem spray" },
      { label: "Extended care", amount: 8, description: "300 days natural vs 210 days chemical" },
      { label: "Hand harvesting", amount: 4, description: "Careful picking at right maturity" },
      { label: "Fair farmer wage", amount: 9, description: "Living wages for farm team" },
    ],
    benefits: [
      "Zero pesticide residue",
      "Naturally sweet and nutritious",
      "No growth hormones used",
      "Supports biodiversity on farm",
      "Traceable to your farm zone",
    ],
    lastUpdated: "2026-02-16",
  },
  {
    id: "price-guava",
    commodity: "Guava",
    unit: "kg",
    mandiPrice: 30,
    ourPrice: 45,
    costBreakdown: [
      { label: "Base growing cost", amount: 15, description: "Tree maintenance, pruning, care" },
      { label: "Natural inputs", amount: 5, description: "Jeevamrut, Beejamrut treatments" },
      { label: "Extended growing time", amount: 8, description: "150 days natural ripening" },
      { label: "Hand harvesting", amount: 5, description: "Selective picking at peak ripeness" },
      { label: "Fair farmer wage", amount: 12, description: "Fair compensation for farm team" },
    ],
    benefits: [
      "Zero chemical sprays",
      "Peak natural sweetness",
      "Higher vitamin C content",
      "No wax coating",
      "Supporting regenerative farming",
    ],
    lastUpdated: "2026-02-16",
  },
  {
    id: "price-turmeric",
    commodity: "Turmeric",
    variety: "Salem/Erode type",
    unit: "kg",
    mandiPrice: 120,
    ourPrice: 180,
    costBreakdown: [
      { label: "Base growing cost", amount: 50, description: "9-month growing cycle, shade management" },
      { label: "Natural inputs", amount: 20, description: "Jeevamrut, mulching, organic matter" },
      { label: "Natural processing", amount: 35, description: "Sun-dried, stone-ground, no polish" },
      { label: "Extended curing", amount: 25, description: "Traditional boiling and sun-drying" },
      { label: "Hand harvesting", amount: 20, description: "Manual digging and cleaning" },
      { label: "Fair farmer wage", amount: 30, description: "Fair wages for intensive labor" },
    ],
    benefits: [
      "No lead chromate coloring",
      "Pure curcumin content (3-5%)",
      "Traditional stone-ground",
      "Sun-dried, not machine-dried",
      "Zero chemical polishing",
      "Medicinal grade purity",
    ],
    lastUpdated: "2026-02-16",
  },
  {
    id: "price-vegetables",
    commodity: "Seasonal Vegetables",
    unit: "kg",
    mandiPrice: 30,
    ourPrice: 45,
    costBreakdown: [
      { label: "Base growing cost", amount: 15, description: "Bed preparation, seeds, irrigation" },
      { label: "Natural inputs", amount: 5, description: "Jeevamrut, neem-based pest management" },
      { label: "Extended growing time", amount: 8, description: "75 days natural vs 45 days chemical" },
      { label: "Hand harvesting", amount: 5, description: "Fresh-picked same day" },
      { label: "Fair farmer wage", amount: 12, description: "Living wages for farm team" },
    ],
    benefits: [
      "Zero pesticide residue",
      "Same-day farm-to-table fresh",
      "No chemical preservatives",
      "Richer taste and nutrition",
      "Supports local ecosystem",
    ],
    lastUpdated: "2026-02-16",
  },
];

// data.gov.in API configuration
export const DATA_GOV_API = {
  baseUrl: "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
  format: "json",
  fields: "state,district,market,commodity,variety,arrival_date,min_price,max_price,modal_price",
};

export function calculatePremiumPercent(mandiPrice: number, ourPrice: number): number {
  if (mandiPrice === 0) return 0;
  return Math.round(((ourPrice - mandiPrice) / mandiPrice) * 100);
}

export function getTotalCost(breakdown: CostBreakdownItem[]): number {
  return breakdown.reduce((sum, item) => sum + item.amount, 0);
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function getSeasonLabel(months: string[]): string {
  if (months.length === 1 && months[0] === "Year-round") return "Year-round";
  if (months.length <= 3) return months.join(", ");
  return `${months[0]} – ${months[months.length - 1]}`;
}

export function getCommodityById(id: string): CommodityProfile | undefined {
  return COMMODITY_PROFILES.find((c) => c.id === id);
}

export function getPriceEntryByCommodity(name: string): PriceEntry | undefined {
  return DEFAULT_PRICE_ENTRIES.find((p) => p.commodity === name);
}

// Simulated mandi price history for charts
export function generatePriceHistory(
  commodity: string,
  months: number = 12
): { month: string; mandiPrice: number; ourPrice: number }[] {
  const entry = DEFAULT_PRICE_ENTRIES.find((p) => p.commodity === commodity);
  if (!entry) return [];

  const baseMandiPrice = entry.mandiPrice;
  const ourPrice = entry.ourPrice;
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return Array.from({ length: months }, (_, i) => {
    const variation = Math.sin(i * 0.8) * 0.2 + (Math.random() - 0.5) * 0.15;
    const mandiPrice = Math.round(baseMandiPrice * (1 + variation));
    return {
      month: monthNames[i % 12],
      mandiPrice,
      ourPrice,
    };
  });
}
