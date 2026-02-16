import { create } from "zustand";
import type {
  CropBatch,
  FarmActivity,
  HarvestCalendarEntry,
  PhotoJournalEntry,
} from "@/types/customer";

const STORAGE_KEY = "anf-journey";

// Sample crop batches for demonstration
const SAMPLE_BATCHES: CropBatch[] = [
  {
    id: "batch-mango-2025",
    cropName: "Mango",
    variety: "Kesar",
    zone: "Zone C",
    plantingDate: "2024-06-15",
    expectedHarvestDate: "2026-05-15",
    status: "growing",
    milestones: [
      {
        id: "m1",
        date: "2024-06-15",
        title: "Saplings Planted",
        description: "50 Kesar mango saplings planted in Zone C with Beejamrut treatment",
        type: "planting",
      },
      {
        id: "m2",
        date: "2024-07-01",
        title: "First Jeevamrut Application",
        description: "Applied 200L Jeevamrut to all saplings for root establishment",
        type: "input",
      },
      {
        id: "m3",
        date: "2024-09-15",
        title: "Healthy Root Growth",
        description: "All saplings showing strong root establishment and new leaf growth",
        type: "growth",
      },
      {
        id: "m4",
        date: "2025-02-10",
        title: "First Flowering Buds",
        description: "Multiple trees showing flowering buds — natural cycle without any growth hormones",
        type: "flowering",
      },
      {
        id: "m5",
        date: "2025-12-20",
        title: "Winter Mulching Applied",
        description: "Thick layer of dried leaves and crop residue applied around all trees",
        type: "input",
      },
      {
        id: "m6",
        date: "2026-01-15",
        title: "Strong Flowering Season",
        description: "Excellent flowering across Zone C. Natural bee pollination observed.",
        type: "flowering",
      },
    ],
    naturalInputs: [
      { id: "ni1", date: "2024-07-01", name: "Jeevamrut", description: "200L soil drench for root zone", quantity: "200L" },
      { id: "ni2", date: "2024-08-15", name: "Mulching", description: "Coconut husk and dried leaves", quantity: "2 tons" },
      { id: "ni3", date: "2024-10-01", name: "Neem Spray", description: "Neem oil + garlic extract for pest prevention" },
      { id: "ni4", date: "2025-01-10", name: "Jeevamrut", description: "Pre-flowering boost application", quantity: "200L" },
      { id: "ni5", date: "2025-12-20", name: "Mulching", description: "Winter mulching with farm residue", quantity: "3 tons" },
      { id: "ni6", date: "2026-01-05", name: "Jeevamrut", description: "Flowering season nutrition boost", quantity: "250L" },
    ],
    naturalDaysToHarvest: 120,
    chemicalDaysToHarvest: 75,
  },
  {
    id: "batch-banana-2025",
    cropName: "Banana",
    variety: "Grand Naine",
    zone: "Zone A",
    plantingDate: "2025-06-01",
    expectedHarvestDate: "2026-06-01",
    status: "fruiting",
    milestones: [
      {
        id: "m1",
        date: "2025-06-01",
        title: "Suckers Planted",
        description: "200 banana suckers planted with Beejamrut treatment in Zone A",
        type: "planting",
      },
      {
        id: "m2",
        date: "2025-07-15",
        title: "Rapid Leaf Growth",
        description: "All plants showing vigorous vegetative growth with Jeevamrut support",
        type: "growth",
      },
      {
        id: "m3",
        date: "2025-10-20",
        title: "Flowering Initiated",
        description: "First batch of plants showing inflorescence — completely natural timing",
        type: "flowering",
      },
      {
        id: "m4",
        date: "2025-12-15",
        title: "Bunches Developing",
        description: "Strong bunch development. No growth hormones — just Jeevamrut and time.",
        type: "fruiting",
      },
      {
        id: "m5",
        date: "2026-02-01",
        title: "Nearing Harvest",
        description: "Bunches are filling out naturally. Expected harvest in 4-6 weeks.",
        type: "fruiting",
      },
    ],
    naturalInputs: [
      { id: "ni1", date: "2025-06-01", name: "Beejamrut", description: "Sucker treatment before planting" },
      { id: "ni2", date: "2025-06-15", name: "Jeevamrut", description: "First soil drench", quantity: "150L" },
      { id: "ni3", date: "2025-08-01", name: "Mulching", description: "Banana leaf residue + dried grass", quantity: "1.5 tons" },
      { id: "ni4", date: "2025-10-01", name: "Jeevamrut", description: "Pre-flowering boost", quantity: "200L" },
    ],
    naturalDaysToHarvest: 365,
    chemicalDaysToHarvest: 270,
  },
  {
    id: "batch-turmeric-2025",
    cropName: "Turmeric",
    variety: "Salem",
    zone: "Zone B",
    bed: "Bed 2",
    plantingDate: "2025-05-15",
    expectedHarvestDate: "2026-02-15",
    status: "growing",
    milestones: [
      {
        id: "m1",
        date: "2025-05-15",
        title: "Rhizomes Planted",
        description: "Organic seed rhizomes planted in raised beds with Beejamrut treatment",
        type: "planting",
      },
      {
        id: "m2",
        date: "2025-06-20",
        title: "Sprouting",
        description: "95% germination rate — healthy shoots emerging",
        type: "growth",
      },
      {
        id: "m3",
        date: "2025-09-15",
        title: "Lush Canopy",
        description: "Full leaf canopy providing natural shade to soil. Intercropped with ginger.",
        type: "growth",
      },
      {
        id: "m4",
        date: "2025-12-01",
        title: "Leaf Senescence",
        description: "Leaves naturally yellowing — signal that rhizomes are maturing underground",
        type: "growth",
      },
    ],
    naturalInputs: [
      { id: "ni1", date: "2025-05-15", name: "Beejamrut", description: "Rhizome treatment" },
      { id: "ni2", date: "2025-06-01", name: "Jeevamrut", description: "Soil drench after planting", quantity: "100L" },
      { id: "ni3", date: "2025-07-15", name: "Mulching", description: "Rice straw mulch for moisture retention", quantity: "500kg" },
      { id: "ni4", date: "2025-09-01", name: "Jeevamrut", description: "Growth phase boost", quantity: "100L" },
    ],
    naturalDaysToHarvest: 270,
    chemicalDaysToHarvest: 210,
  },
];

const SAMPLE_ACTIVITIES: FarmActivity[] = [
  { id: "a1", date: "2026-02-16", zone: "Zone A", description: "Applied Jeevamrut to all banana beds — flowering season support", type: "input" },
  { id: "a2", date: "2026-02-15", zone: "Zone B", description: "Turmeric harvest preparation — checking rhizome maturity", type: "observation" },
  { id: "a3", date: "2026-02-14", description: "Light rain received (12mm) — excellent for soil moisture", type: "weather" },
  { id: "a4", date: "2026-02-13", zone: "Zone C", description: "Mango trees showing excellent flowering — natural bee pollination active", type: "observation" },
  { id: "a5", date: "2026-02-12", zone: "Zone A", description: "Mulching renewed around banana plants with dried leaf litter", type: "maintenance" },
  { id: "a6", date: "2026-02-10", zone: "Zone B", description: "Seasonal vegetables (spinach, methi) ready for harvest", type: "harvest" },
  { id: "a7", date: "2026-02-08", description: "Neem spray application across all zones for preventive pest management", type: "input" },
  { id: "a8", date: "2026-02-05", zone: "Zone A", description: "Guava pruning completed — shaping for next season", type: "maintenance" },
];

const SAMPLE_HARVEST_CALENDAR: HarvestCalendarEntry[] = [
  { id: "h1", crop: "Turmeric", expectedDate: "2026-02-20", zone: "Zone B", estimatedQuantity: "200 kg", status: "ready" },
  { id: "h2", crop: "Spinach & Methi", expectedDate: "2026-02-18", zone: "Zone B", estimatedQuantity: "50 kg", status: "ready" },
  { id: "h3", crop: "Banana (Batch 1)", expectedDate: "2026-03-15", zone: "Zone A", estimatedQuantity: "500 dozen", status: "upcoming" },
  { id: "h4", crop: "Drumstick", expectedDate: "2026-03-01", zone: "Zone C", estimatedQuantity: "100 kg", status: "upcoming" },
  { id: "h5", crop: "Ginger", expectedDate: "2026-02-28", zone: "Zone B", estimatedQuantity: "150 kg", status: "upcoming" },
  { id: "h6", crop: "Sugarcane (Jaggery)", expectedDate: "2026-03-20", zone: "Zone B", estimatedQuantity: "500 kg jaggery", status: "upcoming" },
  { id: "h7", crop: "Mango (Kesar)", expectedDate: "2026-05-15", zone: "Zone C", estimatedQuantity: "2000 kg", status: "upcoming" },
  { id: "h8", crop: "Papaya", expectedDate: "2026-04-01", zone: "Zone A", estimatedQuantity: "300 kg", status: "upcoming" },
];

const SAMPLE_PHOTOS: PhotoJournalEntry[] = [
  { id: "p1", date: "2026-02-14", title: "Mango Flowering in Full Bloom", description: "Zone C mango trees covered in flowers — bees are working overtime!", zone: "Zone C" },
  { id: "p2", date: "2026-02-10", title: "Banana Bunches Getting Heavy", description: "Grand Naine bananas almost ready. Natural ripening on the plant.", zone: "Zone A" },
  { id: "p3", date: "2026-02-05", title: "Turmeric Harvest Prep", description: "Leaves have dried — rhizomes are ready to be dug out next week.", zone: "Zone B" },
  { id: "p4", date: "2026-01-28", title: "Fresh Jeevamrut Batch", description: "Preparing 500L Jeevamrut from our desi cow's produce. Ready in 48 hours.", zone: "Zone A" },
  { id: "p5", date: "2026-01-20", title: "Morning at the Farm", description: "Winter sunrise over the orchard. The intercropping creates a natural forest-like canopy." },
  { id: "p6", date: "2026-01-15", title: "Earthworm Count", description: "Found 25+ earthworms per sq.ft in Zone B — sign of incredibly healthy soil!" , zone: "Zone B" },
];

interface JourneyState {
  batches: CropBatch[];
  activities: FarmActivity[];
  harvestCalendar: HarvestCalendarEntry[];
  photoJournal: PhotoJournalEntry[];
  addBatch: (batch: CropBatch) => void;
  updateBatch: (id: string, updates: Partial<Omit<CropBatch, "id">>) => void;
  addActivity: (activity: FarmActivity) => void;
  addHarvestEntry: (entry: HarvestCalendarEntry) => void;
  updateHarvestEntry: (id: string, updates: Partial<Omit<HarvestCalendarEntry, "id">>) => void;
  addPhoto: (photo: PhotoJournalEntry) => void;
}

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

export const useJourneyStore = create<JourneyState>((set, get) => ({
  batches: loadState("anf-batches", SAMPLE_BATCHES),
  activities: loadState("anf-activities", SAMPLE_ACTIVITIES),
  harvestCalendar: loadState("anf-harvest", SAMPLE_HARVEST_CALENDAR),
  photoJournal: loadState("anf-photos", SAMPLE_PHOTOS),

  addBatch: (batch) => {
    const next = [...get().batches, batch];
    persist("anf-batches", next);
    set({ batches: next });
  },

  updateBatch: (id, updates) => {
    const next = get().batches.map((b) =>
      b.id === id ? { ...b, ...updates } : b
    );
    persist("anf-batches", next);
    set({ batches: next });
  },

  addActivity: (activity) => {
    const next = [activity, ...get().activities];
    persist("anf-activities", next);
    set({ activities: next });
  },

  addHarvestEntry: (entry) => {
    const next = [...get().harvestCalendar, entry];
    persist("anf-harvest", next);
    set({ harvestCalendar: next });
  },

  updateHarvestEntry: (id, updates) => {
    const next = get().harvestCalendar.map((h) =>
      h.id === id ? { ...h, ...updates } : h
    );
    persist("anf-harvest", next);
    set({ harvestCalendar: next });
  },

  addPhoto: (photo) => {
    const next = [photo, ...get().photoJournal];
    persist("anf-photos", next);
    set({ photoJournal: next });
  },
}));
