import { create } from "zustand";
import type {
  AdoptableTree,
  AdoptionRecord,
  Customer,
  Order,
  FarmVisit,
  FarmerNote,
  SeasonalEvent,
} from "@/types/customer";

// Adopt-a-Tree: one-time fee, veggies back, one-time gift at first harvest, 10% member discount after
const SAMPLE_TREES: AdoptableTree[] = [
  {
    id: "tree-mango-1", species: "Mango", variety: "Kesar", zone: "Zone C",
    plantedDate: "2024-06-15", age: "1.5 years", adoptionFee: 1000, vegetableCredits: 1000,
    produceGift: { firstHarvestYear: 3, oneTimeGift: "5 kg", memberDiscountPercent: 10 },
    carbonImpact: { co2AbsorbedKgPerYear: 22, waterSavedLitresPerYear: 5000, soilProtectedSqFt: 100, biodiversityScore: "High — supports 50+ insect species" },
    status: "available",
  },
  {
    id: "tree-mango-2", species: "Mango", variety: "Alphonso", zone: "Zone C",
    plantedDate: "2024-06-15", age: "1.5 years", adoptionFee: 1000, vegetableCredits: 1000,
    produceGift: { firstHarvestYear: 3, oneTimeGift: "5 kg", memberDiscountPercent: 10 },
    carbonImpact: { co2AbsorbedKgPerYear: 22, waterSavedLitresPerYear: 5000, soilProtectedSqFt: 100, biodiversityScore: "High — supports 50+ insect species" },
    status: "adopted", adoptedBy: "Ravi Sharma",
  },
  {
    id: "tree-jackfruit-1", species: "Jackfruit", variety: "Desi", zone: "Zone C",
    plantedDate: "2024-07-01", age: "1.5 years", adoptionFee: 800, vegetableCredits: 800,
    produceGift: { firstHarvestYear: 4, oneTimeGift: "5 kg", memberDiscountPercent: 10 },
    carbonImpact: { co2AbsorbedKgPerYear: 28, waterSavedLitresPerYear: 6000, soilProtectedSqFt: 150, biodiversityScore: "Very High — large canopy supports birds & insects" },
    status: "available",
  },
  {
    id: "tree-guava-1", species: "Guava", variety: "Lucknow 49", zone: "Zone A",
    plantedDate: "2025-02-01", age: "1 year", adoptionFee: 500, vegetableCredits: 500,
    produceGift: { firstHarvestYear: 2, oneTimeGift: "3 kg", memberDiscountPercent: 10 },
    carbonImpact: { co2AbsorbedKgPerYear: 12, waterSavedLitresPerYear: 3000, soilProtectedSqFt: 64, biodiversityScore: "Medium — attracts pollinators" },
    status: "available",
  },
  {
    id: "tree-guava-2", species: "Guava", variety: "Lucknow 49", zone: "Zone A",
    plantedDate: "2025-02-01", age: "1 year", adoptionFee: 500, vegetableCredits: 500,
    produceGift: { firstHarvestYear: 2, oneTimeGift: "3 kg", memberDiscountPercent: 10 },
    carbonImpact: { co2AbsorbedKgPerYear: 12, waterSavedLitresPerYear: 3000, soilProtectedSqFt: 64, biodiversityScore: "Medium — attracts pollinators" },
    status: "adopted", adoptedBy: "Priya Patel",
  },
  {
    id: "tree-drumstick-1", species: "Drumstick (Moringa)", variety: "PKM-1", zone: "Zone C",
    plantedDate: "2025-03-01", age: "11 months", adoptionFee: 500, vegetableCredits: 500,
    produceGift: { firstHarvestYear: 1, oneTimeGift: "2 kg", memberDiscountPercent: 10 },
    carbonImpact: { co2AbsorbedKgPerYear: 8, waterSavedLitresPerYear: 2000, soilProtectedSqFt: 36, biodiversityScore: "Medium — nitrogen fixer, improves soil" },
    status: "available",
  },
  {
    id: "tree-avocado-1", species: "Avocado", variety: "Hass", zone: "Zone C",
    plantedDate: "2024-08-01", age: "1.5 years", adoptionFee: 1000, vegetableCredits: 1000,
    produceGift: { firstHarvestYear: 4, oneTimeGift: "3 kg", memberDiscountPercent: 10 },
    carbonImpact: { co2AbsorbedKgPerYear: 18, waterSavedLitresPerYear: 4500, soilProtectedSqFt: 100, biodiversityScore: "High — deep roots improve soil structure" },
    status: "available",
  },
  {
    id: "tree-coconut-1", species: "Coconut", variety: "Desi Tall", zone: "Zone B",
    plantedDate: "2024-06-01", age: "1.5 years", adoptionFee: 800, vegetableCredits: 800,
    produceGift: { firstHarvestYear: 5, oneTimeGift: "10 nuts", memberDiscountPercent: 10 },
    carbonImpact: { co2AbsorbedKgPerYear: 25, waterSavedLitresPerYear: 4000, soilProtectedSqFt: 80, biodiversityScore: "High — tall canopy shelters undergrowth" },
    status: "available",
  },
];

const SAMPLE_ADOPTIONS: AdoptionRecord[] = [
  { id: "adopt-1", treeId: "tree-mango-2", customerName: "Ravi Sharma", customerPhone: "9876543210", adoptionDate: "2025-08-15", adoptionFee: 1000, vegetableCreditsUsed: 400, vegetableCreditsRemaining: 600, status: "active" },
  { id: "adopt-2", treeId: "tree-guava-2", customerName: "Priya Patel", customerPhone: "9876543211", adoptionDate: "2025-10-01", adoptionFee: 500, vegetableCreditsUsed: 0, vegetableCreditsRemaining: 500, status: "active" },
];

const SAMPLE_CUSTOMERS: Customer[] = [
  { id: "cust-1", name: "Ravi Sharma", phone: "9876543210", joinDate: "2025-08-15", adoptions: ["adopt-1"], totalSpent: 8500, chemicalsAvoided: 1200, referralCode: "RAVI25", referredBy: undefined },
  { id: "cust-2", name: "Priya Patel", phone: "9876543211", joinDate: "2025-10-01", adoptions: ["adopt-2"], totalSpent: 4200, chemicalsAvoided: 800, referralCode: "PRIYA25", referredBy: "RAVI25" },
  { id: "cust-3", name: "Amit Desai", phone: "9876543212", joinDate: "2025-12-01", adoptions: [], totalSpent: 2100, chemicalsAvoided: 350, referralCode: "AMIT25" },
];

const SAMPLE_ORDERS: Order[] = [
  { id: "ord-1", customerId: "cust-1", items: [{ commodity: "Guava", quantity: 5, unit: "kg", pricePerUnit: 45 }, { commodity: "Banana", quantity: 2, unit: "dozen", pricePerUnit: 55 }], totalAmount: 335, date: "2026-02-10", status: "delivered" },
  { id: "ord-2", customerId: "cust-2", items: [{ commodity: "Seasonal Vegetables", quantity: 3, unit: "kg", pricePerUnit: 45 }], totalAmount: 135, date: "2026-02-12", status: "delivered" },
  { id: "ord-3", customerId: "cust-3", items: [{ commodity: "Turmeric", quantity: 1, unit: "kg", pricePerUnit: 180 }], totalAmount: 180, date: "2026-02-15", status: "confirmed" },
];

const SAMPLE_VISITS: FarmVisit[] = [
  { id: "visit-1", visitorName: "Ravi Sharma & Family", visitorPhone: "9876543210", date: "2026-03-15", numberOfPeople: 4, status: "confirmed", notes: "Wants to see adopted Alphonso tree" },
  { id: "visit-2", visitorName: "School Group — DPS", date: "2026-03-22", numberOfPeople: 25, status: "requested", notes: "Educational visit for Class 8 students" },
];

const SAMPLE_NOTES: FarmerNote[] = [
  { id: "note-1", date: "2026-02-15", title: "Mango Season is Coming!", content: "The mango trees are blooming beautifully this year. Natural bee pollination is at its peak. We expect an excellent harvest starting May. The patience of natural farming pays off — these Kesar mangoes will have a sweetness that no carbide-ripened mango can match. Thank you for being part of this journey.", season: "rabi" },
  { id: "note-2", date: "2026-01-20", title: "Winter Harvest Update", content: "We've had a wonderful rabi season. The turmeric is almost ready for harvest — after 9 months of patience and care. Our seasonal vegetables (spinach, methi, palak) are thriving. Every bed is mulched, every trench is alive with earthworms. This is what healthy soil looks like.", season: "rabi" },
  { id: "note-3", date: "2025-10-15", title: "Post-Monsoon Report", content: "The monsoon has been kind to us this year. All zones received adequate rainfall. We topped up with drip irrigation only twice. The banana plants in Zone A are growing vigorously, and we expect the first harvest by March. Jeevamrut applications continue every 15 days.", season: "kharif" },
];

const SAMPLE_EVENTS: SeasonalEvent[] = [
  { id: "evt-1", title: "Mango Harvest Festival", description: "Join us to pick your own naturally-ripened Kesar mangoes straight from the tree. Includes farm tour, lunch, and 5kg mangoes to take home.", date: "2026-05-20", type: "harvest-festival", capacity: 50, registrations: 12 },
  { id: "evt-2", title: "Natural Farming Workshop", description: "Learn Palekar ZBNF hands-on — make Jeevamrut, prepare Beejamrut, understand mulching. A full day at the farm.", date: "2026-04-10", type: "workshop", capacity: 30, registrations: 8 },
  { id: "evt-3", title: "Farm Open Day", description: "Walk through all 12 acres, see the masterplan in action. Meet the desi cow, taste fresh produce, understand natural farming.", date: "2026-03-08", type: "farm-day", capacity: 40, registrations: 15 },
];

function loadState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as T;
    }
  } catch {
    // ignore
  }
  return fallback;
}

function persist(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

interface CustomerState {
  trees: AdoptableTree[];
  adoptions: AdoptionRecord[];
  customers: Customer[];
  orders: Order[];
  visits: FarmVisit[];
  farmerNotes: FarmerNote[];
  events: SeasonalEvent[];
  addTree: (tree: AdoptableTree) => void;
  adoptTree: (treeId: string, record: AdoptionRecord) => void;
  addCustomer: (customer: Customer) => void;
  addOrder: (order: Order) => void;
  addVisit: (visit: FarmVisit) => void;
  updateVisit: (id: string, updates: Partial<Omit<FarmVisit, "id">>) => void;
  addNote: (note: FarmerNote) => void;
  addEvent: (event: SeasonalEvent) => void;
  registerForEvent: (eventId: string) => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  trees: loadState("anf-trees", SAMPLE_TREES),
  adoptions: loadState("anf-adoptions", SAMPLE_ADOPTIONS),
  customers: loadState("anf-customers", SAMPLE_CUSTOMERS),
  orders: loadState("anf-orders", SAMPLE_ORDERS),
  visits: loadState("anf-visits", SAMPLE_VISITS),
  farmerNotes: loadState("anf-notes", SAMPLE_NOTES),
  events: loadState("anf-events", SAMPLE_EVENTS),

  addTree: (tree) => {
    const next = [...get().trees, tree];
    persist("anf-trees", next);
    set({ trees: next });
  },

  adoptTree: (treeId, record) => {
    const trees = get().trees.map((t) =>
      t.id === treeId ? { ...t, status: "adopted" as const, adoptedBy: record.customerName } : t
    );
    const adoptions = [...get().adoptions, record];
    persist("anf-trees", trees);
    persist("anf-adoptions", adoptions);
    set({ trees, adoptions });
  },

  addCustomer: (customer) => {
    const next = [...get().customers, customer];
    persist("anf-customers", next);
    set({ customers: next });
  },

  addOrder: (order) => {
    const next = [...get().orders, order];
    persist("anf-orders", next);
    set({ orders: next });
  },

  addVisit: (visit) => {
    const next = [...get().visits, visit];
    persist("anf-visits", next);
    set({ visits: next });
  },

  updateVisit: (id, updates) => {
    const next = get().visits.map((v) =>
      v.id === id ? { ...v, ...updates } : v
    );
    persist("anf-visits", next);
    set({ visits: next });
  },

  addNote: (note) => {
    const next = [note, ...get().farmerNotes];
    persist("anf-notes", next);
    set({ farmerNotes: next });
  },

  addEvent: (event) => {
    const next = [...get().events, event];
    persist("anf-events", next);
    set({ events: next });
  },

  registerForEvent: (eventId) => {
    const next = get().events.map((e) =>
      e.id === eventId ? { ...e, registrations: e.registrations + 1 } : e
    );
    persist("anf-events", next);
    set({ events: next });
  },
}));
