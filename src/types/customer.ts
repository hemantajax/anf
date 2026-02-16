// =============================================
// Customer Trust & Transparency Platform Types
// =============================================

// === PRICING ===

export interface MandiPrice {
  commodity: string;
  variety: string;
  market: string;
  state: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
  source: "data.gov.in" | "enam" | "agmarknet";
}

export interface CostBreakdownItem {
  label: string;
  amount: number;
  description?: string;
  icon?: string;
}

export interface PriceEntry {
  id: string;
  commodity: string;
  variety?: string;
  unit: string;
  mandiPrice: number;
  ourPrice: number;
  costBreakdown: CostBreakdownItem[];
  benefits: string[];
  lastUpdated: string;
}

export interface CommodityProfile {
  id: string;
  name: string;
  hindiName?: string;
  category: "fruit" | "vegetable" | "spice" | "grain";
  icon: string;
  unit: string;
  naturalDaysToRipe: number;
  chemicalDaysToRipe: number;
  seasonality: string[];
}

// === CROP JOURNEY ===

export type MilestoneType =
  | "planting"
  | "input"
  | "growth"
  | "flowering"
  | "fruiting"
  | "harvest"
  | "note";

export interface JourneyMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  type: MilestoneType;
  photoUrl?: string;
}

export interface NaturalInput {
  id: string;
  date: string;
  name: string;
  description: string;
  quantity?: string;
}

export type CropStatus =
  | "planted"
  | "growing"
  | "flowering"
  | "fruiting"
  | "harvested";

export interface CropBatch {
  id: string;
  cropName: string;
  variety?: string;
  zone: string;
  bed?: string;
  plantingDate: string;
  expectedHarvestDate?: string;
  actualHarvestDate?: string;
  status: CropStatus;
  milestones: JourneyMilestone[];
  naturalInputs: NaturalInput[];
  naturalDaysToHarvest?: number;
  chemicalDaysToHarvest?: number;
  qrCodeData?: string;
}

// === FARM STORY ===

export interface FarmPrinciple {
  id: string;
  name: string;
  hindiName?: string;
  description: string;
  icon: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  validUntil?: string;
  type: "organic" | "soil-test" | "water-test" | "other";
}

export interface FarmStory {
  originStory: string;
  vision: string;
  principles: FarmPrinciple[];
  certifications: Certification[];
  chemicalsNotUsed: string[];
}

// === LIVE FARM ===

export type ActivityType =
  | "input"
  | "observation"
  | "harvest"
  | "maintenance"
  | "weather";

export interface FarmActivity {
  id: string;
  date: string;
  zone?: string;
  description: string;
  type: ActivityType;
}

export type HarvestStatus = "upcoming" | "ready" | "harvested";

export interface HarvestCalendarEntry {
  id: string;
  crop: string;
  expectedDate: string;
  zone: string;
  estimatedQuantity?: string;
  status: HarvestStatus;
}

export interface PhotoJournalEntry {
  id: string;
  date: string;
  title: string;
  description?: string;
  zone?: string;
}

// === ADOPT A TREE ===

export interface ProduceGift {
  /** Year of first expected harvest (e.g. 3 = Year 3) */
  firstHarvestYear: number;
  /** One-time gift quantity when tree first fruits (e.g. "5 kg", "10 nuts") */
  oneTimeGift: string;
  /** Member discount on all future produce purchases */
  memberDiscountPercent: number;
}

export interface TreeCarbonImpact {
  /** kg CO2 absorbed per year */
  co2AbsorbedKgPerYear: number;
  /** Litres of water saved vs chemical farming per year */
  waterSavedLitresPerYear: number;
  /** sq.ft of soil kept chemical-free */
  soilProtectedSqFt: number;
  /** Number of earthworms & beneficial insects supported */
  biodiversityScore: string;
}

export interface AdoptableTree {
  id: string;
  species: string;
  variety?: string;
  zone: string;
  plantedDate: string;
  age: string;
  /** One-time adoption fee (₹500 - ₹1,000) */
  adoptionFee: number;
  /** Customer gets this much worth of seasonal vegetables immediately */
  vegetableCredits: number;
  /** Produce gift + member discount */
  produceGift: ProduceGift;
  /** Environmental impact of this tree */
  carbonImpact: TreeCarbonImpact;
  status: "available" | "adopted";
  adoptedBy?: string;
}

export interface AdoptionRecord {
  id: string;
  treeId: string;
  customerName: string;
  customerPhone?: string;
  adoptionDate: string;
  adoptionFee: number;
  vegetableCreditsUsed: number;
  vegetableCreditsRemaining: number;
  status: "active" | "completed";
}

// === CUSTOMER PORTAL ===

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  joinDate: string;
  adoptions: string[];
  totalSpent: number;
  chemicalsAvoided: number;
  referralCode: string;
  referredBy?: string;
}

export interface OrderItem {
  commodity: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  date: string;
  status: "pending" | "confirmed" | "delivered";
}

// === SEASONAL CONNECT ===

export interface FarmVisit {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  date: string;
  numberOfPeople: number;
  status: "requested" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

export interface FarmerNote {
  id: string;
  date: string;
  title: string;
  content: string;
  season: "kharif" | "rabi" | "zaid" | "general";
}

export interface SeasonalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "harvest-festival" | "workshop" | "farm-day" | "special";
  capacity?: number;
  registrations: number;
}
