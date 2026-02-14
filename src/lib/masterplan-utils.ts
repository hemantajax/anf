// ================================================================
// Master Plan Layout Utilities — 12 Acre Farm Architecture
// ================================================================
// Plot: 660 ft (W→E) × 792 ft (N→S) = 12 acres
// Orientation: N-S longer axis, W→E slope (West high, East low/nala)
// Gate: NW corner, North side 30 ft public road
// ================================================================

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LayoutItem extends Rect {
  id: string;
  label: string;
  color: string;
  stroke?: string;
  type: string;
  details?: string;
}

// ── Farm Dimensions ──
export const FARM = {
  width: 660,
  height: 792,
  acres: 12,
  buffer: 7,
  sqFt: 522_720,
} as const;

// ── Buffer Zone (Live Fence) ──
export const BUFFER: Rect = { x: 0, y: 0, w: 660, h: 792 };
export const BUFFER_INNER: Rect = { x: 7, y: 7, w: 646, h: 778 };

// ── Peripheral Roads ──
export const PERIPHERAL_ROADS: LayoutItem[] = [
  { id: "road-w", label: "Main Road 15 ft", x: 7, y: 7, w: 15, h: 778, color: "#B8B8D1", stroke: "#9898B0", type: "road", details: "Entry road from NW gate — Coconut avenue both sides" },
  { id: "road-n", label: "North Road 12 ft", x: 22, y: 7, w: 619, h: 12, color: "#B8B8D1", stroke: "#9898B0", type: "road", details: "Along 30ft public road — Coconut avenue both sides" },
  { id: "road-e", label: "East Road 12 ft", x: 641, y: 7, w: 12, h: 778, color: "#B8B8D1", stroke: "#9898B0", type: "road", details: "Along east boundary near nala — Drainage side" },
  { id: "road-s", label: "South Road 12 ft", x: 22, y: 773, w: 619, h: 12, color: "#B8B8D1", stroke: "#9898B0", type: "road", details: "Southern service road — Coconut avenue both sides" },
];

// ── Internal Roads (12 ft each — extend to meet peripheral roads) ──
export const INTERNAL_ROADS: LayoutItem[] = [
  { id: "road-ns", label: "Central N-S Road 12 ft", x: 326, y: 19, w: 12, h: 754, color: "#C5C5D8", stroke: "#A0A0B8", type: "road", details: "Divides East/West zones — Coconut avenue" },
  { id: "road-ew", label: "Central E-W Road 12 ft", x: 22, y: 390, w: 619, h: 12, color: "#C5C5D8", stroke: "#A0A0B8", type: "road", details: "Divides North/South zones — Coconut avenue" },
];

// ── Flower Panels (3 ft — split at road intersections so roads connect) ──
export const FLOWER_PANELS: LayoutItem[] = [
  // North panel: split at NS central road (x=326 to 338)
  { id: "flower-n-w", label: "North Flower Panel W", x: 25, y: 19, w: 301, h: 3, color: "#F9A8D4", stroke: "#EC4899", type: "flower" },
  { id: "flower-n-e", label: "North Flower Panel E", x: 338, y: 19, w: 300, h: 3, color: "#F9A8D4", stroke: "#EC4899", type: "flower" },
  // South panel: split at NS central road (x=326 to 338)
  { id: "flower-s-w", label: "South Flower Panel W", x: 25, y: 770, w: 301, h: 3, color: "#F9A8D4", stroke: "#EC4899", type: "flower" },
  { id: "flower-s-e", label: "South Flower Panel E", x: 338, y: 770, w: 300, h: 3, color: "#F9A8D4", stroke: "#EC4899", type: "flower" },
  // West panel: split at EW central road (y=390 to 402)
  { id: "flower-w-n", label: "West Flower Panel N", x: 22, y: 22, w: 3, h: 368, color: "#F9A8D4", stroke: "#EC4899", type: "flower" },
  { id: "flower-w-s", label: "West Flower Panel S", x: 22, y: 402, w: 3, h: 368, color: "#F9A8D4", stroke: "#EC4899", type: "flower" },
  // East panel: split at EW central road (y=390 to 402)
  { id: "flower-e-n", label: "East Flower Panel N", x: 638, y: 22, w: 3, h: 368, color: "#F9A8D4", stroke: "#EC4899", type: "flower" },
  { id: "flower-e-s", label: "East Flower Panel S", x: 638, y: 402, w: 3, h: 368, color: "#F9A8D4", stroke: "#EC4899", type: "flower" },
];

// ── Four Productive Zones ──
export const ZONES: (LayoutItem & {
  areaAcres: number;
  strategy: string;
  crops: string[];
  keyTrees: string[];
})[] = [
  {
    id: "zone-a", label: "Zone A", x: 25, y: 22, w: 301, h: 368,
    color: "#E8F5E9", stroke: "#4CAF50", type: "zone",
    areaAcres: 2.54,
    strategy: "High Cash Flow + Farm Operations Hub",
    details: "Banana + Papaya + Guava dominant, Drip irrigation, Quick returns from Year 1. NW farm-ops compound (Gate, Parking, Cattle Shed, Nursery, Composting).",
    crops: ["Banana (Grand Naine, Elakki)", "Papaya (Red Lady, Taiwan 786)", "Guava (Taiwan Pink, VNR Bihi)", "Moringa (PKM-1)", "Drumstick"],
    keyTrees: ["banana", "papaya", "guava", "moringa"],
  },
  {
    id: "zone-b", label: "Zone B", x: 338, y: 22, w: 300, h: 368,
    color: "#E3F2FD", stroke: "#2196F3", type: "zone",
    areaAcres: 2.53,
    strategy: "Balanced Orchard (Palekar B/M/S Mix)",
    details: "Full Big/Medium/Small Palekar model, 24×24 or 36×36 K-modules, Diverse mixed fruit orchard for steady income.",
    crops: ["Mango (Kesar, Alphonso)", "Pomegranate (Bhagwa)", "Lemon (Kagzi)", "Orange (Nagpur)", "Custard Apple", "Amla", "Banana filler"],
    keyTrees: ["mango", "pomegranate", "lemon", "orange", "custard-apple"],
  },
  {
    id: "zone-c", label: "Zone C", x: 25, y: 402, w: 301, h: 368,
    color: "#FFF8E1", stroke: "#FF9800", type: "zone",
    areaAcres: 2.54,
    strategy: "Mixed Fruit + Spice + Residential Hub",
    details: "SW corner is the peak elevation — Farmhouse, Store, Watch Tower, Water Tank (gravity-fed) located here. Mixed fruit orchard with spice intercrops surrounds the residential compound.",
    crops: ["Jackfruit (Konkan Prolific)", "Anjeer (Poona Fig)", "Mulberry", "Lychee", "Avocado", "Black Pepper (climber)", "Turmeric / Ginger intercrop"],
    keyTrees: ["jackfruit", "anjeer", "mulberry", "lychee", "avocado"],
  },
  {
    id: "zone-d", label: "Zone D", x: 338, y: 402, w: 300, h: 368,
    color: "#FCE4EC", stroke: "#E91E63", type: "zone",
    areaAcres: 2.54,
    strategy: "Premium Timber + Asset Building",
    details: "Teak, Sandalwood, Coconut, Cashew for long-term asset. Farm pond near nala for water harvesting. Percolation pits for recharge.",
    crops: ["Teak (Nilambur)", "Sandalwood", "Coconut (TxD Hybrid)", "Cashew (Vengurla-4)", "Neem", "Bamboo clusters", "Pineapple ground cover"],
    keyTrees: ["teak", "sandalwood", "coconut", "cashew", "neem"],
  },
];

// ── Infrastructure Items ──
// Split into two hubs:
//   NW (Gate entry) — Farm Operations: Guard, Parking, Cattle Shed, Nursery, Composting
//   SW (Peak elevation) — Residential + Processing: Farmhouse, Store, Tower, Water Tank, Kitchen Garden
export const INFRASTRUCTURE: LayoutItem[] = [
  // ─── NW Hub — Farm Operations (near gate) ───
  { id: "inf-guard", label: "Guard / Entry", x: 28, y: 25, w: 12, h: 10, color: "#78909C", stroke: "#546E7A", type: "infra", details: "10×12 ft — Entry checkpoint at NW gate, visitor register" },
  { id: "inf-parking", label: "Parking", x: 46, y: 25, w: 50, h: 28, color: "#90A4AE", stroke: "#607D8B", type: "infra", details: "50×28 ft — Open parking, 3-4 vehicles + tractor. Entry: SOUTH. 3 Rain Tree / Neem for full shade canopy." },
  { id: "inf-shed", label: "Cattle / Tool Shed", x: 28, y: 62, w: 38, h: 28, color: "#BCAAA4", stroke: "#6D4C41", type: "infra", details: "38×28 ft — 2-3 cow capacity + tool storage. Gate: EAST (cattle into zone). Neem shade trees." },
  { id: "inf-compost", label: "Composting", x: 73, y: 62, w: 28, h: 28, color: "#8D6E63", stroke: "#4E342E", type: "infra", details: "28×28 ft — Jeevamrut, Panchagavya prep + compost pits" },
  { id: "inf-biogas", label: "Biogas", x: 108, y: 62, w: 18, h: 18, color: "#FFD54F", stroke: "#F9A825", type: "infra", details: "18×18 ft — 2 cubic meter biogas plant, cow dung from cattle shed" },
  { id: "inf-nursery", label: "Nursery", x: 28, y: 98, w: 42, h: 28, color: "#81C784", stroke: "#2E7D32", type: "infra", details: "42×28 ft — Seedling nursery, grafting area. Gate: EAST. Gulmohar + Semal for filtered light." },
  { id: "inf-vermi", label: "Vermicompost", x: 78, y: 98, w: 25, h: 20, color: "#A1887F", stroke: "#5D4037", type: "infra", details: "25×20 ft — 4-bed vermicompost unit, near cattle shed" },
  { id: "inf-mushroom", label: "Mushroom Shed", x: 110, y: 98, w: 25, h: 20, color: "#D7CCC8", stroke: "#795548", type: "infra", details: "25×20 ft — Oyster/Shiitake mushroom, shaded area near cattle shed" },
  { id: "inf-beehive", label: "Bee Keeping", x: 280, y: 365, w: 20, h: 18, color: "#FFE082", stroke: "#FFA000", type: "infra", details: "20×18 ft — 4-5 bee hive boxes near flower panels for pollination" },

  // ─── SW Hub — Residential + Processing (peak elevation, SW corner) ───
  // Layout: stacked rows at SW corner, each row can expand EAST (→) into Zone C (~230ft)
  // Expansion north (↑) into open orchard above (~180ft available)
  // Row 1 — Residential (y=585)
  { id: "inf-house", label: "Farmhouse", x: 28, y: 585, w: 55, h: 40, color: "#FFCC80", stroke: "#F57C00", type: "infra", details: "55×40 ft — 2BHK at SW peak, 5KW rooftop solar. Main gate: EAST (morning sun, orchard view). Secondary: WEST (road access). Mango + Tamarind shade." },
  { id: "inf-store", label: "Store / Godown", x: 95, y: 585, w: 35, h: 28, color: "#CE93D8", stroke: "#7B1FA2", type: "infra", details: "35×28 ft — Harvest & tool storage. Loading gate: EAST. Neem shade for pest repellent." },
  { id: "inf-watchtower", label: "Watch Tower", x: 95, y: 620, w: 12, h: 12, color: "#B0BEC5", stroke: "#455A64", type: "infra", details: "12×12 ft — 20ft tower at peak, full farm visibility" },
  // Row 2 — Kitchen Garden (y=640, 15ft gap)
  { id: "inf-kitchen-garden", label: "Kitchen Garden", x: 28, y: 640, w: 70, h: 45, color: "#A5D6A7", stroke: "#388E3C", type: "infra", details: "70×45 ft — Vegetables, herbs, medicinal plants. Expand east → / north ↑" },
  // Row 3 — Processing (y=700, 15ft gap)
  { id: "inf-processing", label: "Processing Unit", x: 28, y: 700, w: 40, h: 28, color: "#FFECB3", stroke: "#FF8F00", type: "infra", details: "40×28 ft — Pickle, jam, juice, pulp. Gate: EAST. Neem shade. Expand east → / north ↑" },
  { id: "inf-drying", label: "Drying Yard", x: 80, y: 700, w: 35, h: 28, color: "#FFF9C4", stroke: "#F9A825", type: "infra", details: "35×28 ft — Solar drying platform. Expand east →" },
  // Row 4 — Water (y=740, at very bottom of SW corner)
  { id: "inf-tank", label: "Water Tank", x: 28, y: 740, w: 22, h: 22, color: "#4FC3F7", stroke: "#0288D1", type: "infra", details: "22×22 ft — 50,000L tank at peak, gravity-fed irrigation" },
];

// ── Water Features ──
export const WATER_FEATURES: LayoutItem[] = [
  { id: "water-pond", label: "Farm Pond", x: 540, y: 690, w: 85, h: 65, color: "#4FC3F7", stroke: "#0277BD", type: "water", details: "85×65 ft — Rainwater harvesting, fish culture, SE corner near nala" },
  { id: "water-bore-domestic", label: "Domestic Bore", x: 55, y: 745, w: 10, h: 10, color: "#29B6F6", stroke: "#01579B", type: "water", details: "10×10 ft — Domestic bore near water tank (SW peak) for kitchen, drinking" },
  { id: "water-bore-irrigation", label: "Irrigation Bore", x: 340, y: 404, w: 14, h: 14, color: "#1E88E5", stroke: "#01579B", type: "water", details: "14×14 ft — Main irrigation bore + pump house at central intersection (mid-slope), pumps UP to SW tank + gravity-feeds E-ward trenches" },
  { id: "water-percolation", label: "Percolation Pit", x: 600, y: 440, w: 28, h: 28, color: "#81D4FA", stroke: "#0288D1", type: "water", details: "28×28 ft — Groundwater recharge pit, near east nala" },
];

// ── Suggested Add-ons (optional extras) ──
export const ADDONS: LayoutItem[] = [
  { id: "addon-polyhouse", label: "Polyhouse", x: 143, y: 98, w: 40, h: 28, color: "#E0E0E0", stroke: "#757575", type: "addon", details: "40×28 ft — High-value crop nursery, off-season vegetables, near NW nursery" },
];

// ── Shade / Utility Trees Around Infrastructure ──
export interface InfraTree {
  id: string;
  x: number;
  y: number;
  species: string;
  purpose: string;
  nearInfra: string; // infrastructure id
}

export const INFRA_TREES: InfraTree[] = [
  // ─── NW Hub — perimeter shade ring (cluster: x=28-135, y=25-126) ───
  // South perimeter (y=138, below all buildings)
  { id: "st-nw-s1", x: 45, y: 138, species: "Gulmohar", purpose: "Filtered light, south of nursery", nearInfra: "inf-nursery" },
  { id: "st-nw-s2", x: 75, y: 138, species: "Neem", purpose: "South perimeter shade", nearInfra: "inf-nursery" },
  { id: "st-nw-s3", x: 110, y: 138, species: "Semal", purpose: "South perimeter shade", nearInfra: "inf-mushroom" },
  // East perimeter (x=145, east of all buildings)
  { id: "st-nw-e1", x: 145, y: 40, species: "Rain Tree", purpose: "Parking east canopy shade", nearInfra: "inf-parking" },
  { id: "st-nw-e2", x: 145, y: 76, species: "Neem", purpose: "Insect repellent east of shed area", nearInfra: "inf-shed" },
  { id: "st-nw-e3", x: 145, y: 110, species: "Pongamia", purpose: "Dense shade east of mushroom", nearInfra: "inf-mushroom" },
  // North-east corner (shade for parking)
  { id: "st-nw-ne", x: 100, y: 20, species: "Rain Tree", purpose: "Heavy canopy shade for parking", nearInfra: "inf-parking" },

  // ─── SW Hub — perimeter shade ring (cluster: x=28-115, y=585-762) ───
  // North perimeter (y=575, above farmhouse row)
  { id: "st-sw-n1", x: 45, y: 575, species: "Mango", purpose: "Shade + fruit, blocks summer heat", nearInfra: "inf-house" },
  { id: "st-sw-n2", x: 80, y: 575, species: "Tamarind", purpose: "Large canopy shade for farmhouse", nearInfra: "inf-house" },
  { id: "st-sw-n3", x: 115, y: 575, species: "Neem", purpose: "Pest repellent for store", nearInfra: "inf-store" },
  // East perimeter (x=125, east of all buildings)
  { id: "st-sw-e1", x: 125, y: 610, species: "Neem", purpose: "East shade for store", nearInfra: "inf-store" },
  { id: "st-sw-e2", x: 105, y: 660, species: "Drumstick", purpose: "Functional shade for kitchen garden", nearInfra: "inf-kitchen-garden" },
  { id: "st-sw-e3", x: 125, y: 714, species: "Neem", purpose: "Shade for processing workers", nearInfra: "inf-processing" },
  // South perimeter (below processing, near tank)
  { id: "st-sw-s1", x: 75, y: 735, species: "Curry Leaf", purpose: "Kitchen herbs near processing", nearInfra: "inf-processing" },
  { id: "st-sw-s2", x: 60, y: 768, species: "Pongamia", purpose: "Shade near tank (not overhead)", nearInfra: "inf-tank" },

  // ─── Farm Pond — west bank stabilization ───
  { id: "st-pond-1", x: 532, y: 695, species: "Bamboo", purpose: "Bank stabilization", nearInfra: "water-pond" },
  { id: "st-pond-2", x: 532, y: 725, species: "Bamboo", purpose: "Bank stabilization", nearInfra: "water-pond" },
  { id: "st-pond-3", x: 532, y: 750, species: "Indian Willow", purpose: "Filtered shade on pond", nearInfra: "water-pond" },
];

// ── Gate / Entrance Orientation ──
export interface GateMarker {
  id: string;
  infraId: string;
  label: string;
  direction: "north" | "south" | "east" | "west";
  x: number;
  y: number;
  w: number;
  h: number;
}

export const GATES: GateMarker[] = [
  // NW Hub
  { id: "gate-parking", infraId: "inf-parking", label: "Parking Entry", direction: "south", x: 66, y: 53, w: 8, h: 2 },
  { id: "gate-shed", infraId: "inf-shed", label: "Cattle Gate", direction: "east", x: 66, y: 73, w: 2, h: 6 },
  { id: "gate-nursery", infraId: "inf-nursery", label: "Nursery Gate", direction: "east", x: 70, y: 109, w: 2, h: 6 },
  // SW Hub — east-facing per user request
  { id: "gate-house", infraId: "inf-house", label: "Farmhouse Main", direction: "east", x: 83, y: 601, w: 2, h: 8 },
  { id: "gate-store", infraId: "inf-store", label: "Store Loading", direction: "east", x: 130, y: 596, w: 2, h: 8 },
  { id: "gate-processing", infraId: "inf-processing", label: "Processing Gate", direction: "east", x: 68, y: 711, w: 2, h: 6 },
];

// ── Access Paths (connecting structures to roads) ──
export interface AccessPath {
  id: string;
  label: string;
  points: [number, number][]; // [x,y] waypoints
  type: "direct" | "path";
}

export const ACCESS_PATHS: AccessPath[] = [
  // NW Hub — main access corridor from W Road into hub
  { id: "path-nw-entry", label: "NW Hub Access (from W Road)", points: [[22, 76], [140, 76]], type: "path" },
  { id: "path-nw-cross", label: "NW Hub N-S Corridor", points: [[50, 22], [50, 130]], type: "path" },
  // SW Hub — compound spine N-S + W Road entry
  { id: "path-sw-spine", label: "SW Compound Spine", points: [[26, 580], [26, 765]], type: "path" },
  { id: "path-sw-entry", label: "SW Hub Entry (from W Road)", points: [[22, 605], [28, 605]], type: "direct" },
  // Gate access lines (short connectors from gate to nearest corridor)
  { id: "path-gate-house", label: "Farmhouse Gate → East", points: [[85, 605], [130, 605]], type: "path" },
  { id: "path-gate-store", label: "Store Gate → East", points: [[132, 600], [155, 600]], type: "path" },
  { id: "path-gate-processing", label: "Processing Gate → East", points: [[70, 714], [130, 714]], type: "path" },
  { id: "path-gate-shed", label: "Cattle Gate → East", points: [[68, 76], [140, 76]], type: "path" },
];

// ── Live Fence Specification ──
export interface LiveFenceLayer {
  id: string;
  name: string;
  species: string;
  spacingFt: number;
  color: string;
  symbol: string;
  purpose: string;
}

export const LIVE_FENCE_LAYERS: LiveFenceLayer[] = [
  { id: "lf-coconut", name: "Coconut", species: "Cocos nucifera (West Coast Tall / TxD Hybrid)", spacingFt: 25, color: "#8B6914", symbol: "CO", purpose: "Main structural fence, income from Year 5" },
  { id: "lf-teak", name: "Teak", species: "Tectona grandis (Nilambur / Godavari)", spacingFt: 15, color: "#704214", symbol: "TK", purpose: "Timber asset, windbreak, 15-20 year harvest" },
  { id: "lf-pepper", name: "Black Pepper", species: "Piper nigrum (Panniyur-1)", spacingFt: 0, color: "#2E7D32", symbol: "BP", purpose: "Climber on coconut trunks, high-value spice" },
  { id: "lf-bamboo", name: "Bamboo", species: "Bambusa vulgaris / Dendrocalamus strictus", spacingFt: 20, color: "#4A7C59", symbol: "BA", purpose: "Corner clusters, windbreak, construction material" },
  { id: "lf-subabul", name: "Subabul / Gliricidia", species: "Leucaena / Gliricidia sepium", spacingFt: 6, color: "#66BB6A", symbol: "SB", purpose: "Nitrogen-fixing, green manure, mulch, fast growing" },
  { id: "lf-moringa", name: "Moringa", species: "Moringa oleifera (PKM-1)", spacingFt: 10, color: "#52B788", symbol: "MO", purpose: "Nutritious leaves, pods, fast income" },
  { id: "lf-bayleaf", name: "Bay Leaf", species: "Cinnamomum tamala (Tejpatta)", spacingFt: 8, color: "#386641", symbol: "BY", purpose: "Spice leaves, aromatic, pest repellent" },
  { id: "lf-curryLeaf", name: "Curry Leaf", species: "Murraya koenigii (Gamthi)", spacingFt: 5, color: "#2D6A4F", symbol: "CL", purpose: "Daily kitchen use, commercial demand" },
];

// ── Zone Planting Strategies (detailed) ──
export interface ZoneStrategy {
  zoneId: string;
  palekarModel: string;
  rowPlan: string[];
  intercrops: string[];
  expectedIncome: { year1: string; year5: string; year10: string };
}

export const ZONE_STRATEGIES: ZoneStrategy[] = [
  {
    zoneId: "zone-a",
    palekarModel: "24×24 ft (Compact, banana-heavy)",
    rowPlan: [
      "Row 1-2: Banana (Grand Naine) — 6ft spacing",
      "Row 3: Papaya (Red Lady) — 8ft spacing",
      "Row 4: Guava (Taiwan Pink) — 15ft spacing",
      "Row 5-6: Banana + Papaya alternating",
      "12ft service road every 120ft",
      "3ft trench between every 2 rows",
    ],
    intercrops: ["Turmeric", "Ginger", "Chilli", "Okra (seasonal)", "Marigold (border)"],
    expectedIncome: { year1: "₹4-5 Lakh", year5: "₹12-15 Lakh", year10: "₹15-18 Lakh" },
  },
  {
    zoneId: "zone-b",
    palekarModel: "36×36 ft (Standard B/M/S Palekar model)",
    rowPlan: [
      "Bed 1: Big tree (Mango center) + Banana fillers",
      "Bed 2: Medium tree (Pomegranate/Orange center) + Papaya fillers",
      "Bed 3: Small tree (Lemon/Amla center) + Banana fillers",
      "Bed 4: Medium tree (Custard Apple center) + Guava fillers",
      "3ft trench between each bed",
      "12ft service road every 144ft",
    ],
    intercrops: ["Millets (Jowar, Bajra)", "Pulses (Tur, Moong)", "Groundnut", "Vegetables (seasonal)"],
    expectedIncome: { year1: "₹3-4 Lakh", year5: "₹10-12 Lakh", year10: "₹18-22 Lakh" },
  },
  {
    zoneId: "zone-c",
    palekarModel: "24×24 ft (Mixed fruit + spice focus)",
    rowPlan: [
      "Row 1: Jackfruit (35ft spacing) + Banana filler",
      "Row 2: Anjeer / Fig (10ft spacing)",
      "Row 3: Mulberry (15ft spacing) + Turmeric ground cover",
      "Row 4: Lychee / Avocado (20ft spacing) + Ginger ground",
      "Row 5: Black Pepper on live posts / coconut",
      "3ft trench + mulch between rows",
    ],
    intercrops: ["Turmeric", "Ginger", "Black Pepper (climber)", "Pineapple (ground cover)", "Coffee (shade)"],
    expectedIncome: { year1: "₹2-3 Lakh", year5: "₹8-10 Lakh", year10: "₹15-20 Lakh" },
  },
  {
    zoneId: "zone-d",
    palekarModel: "36×36 ft (Timber + premium, long-term)",
    rowPlan: [
      "Row 1: Teak (20ft spacing) + Banana filler Year 1-5",
      "Row 2: Sandalwood (15ft spacing) + host tree (Casuarina)",
      "Row 3: Coconut (25ft spacing) + Black Pepper climber",
      "Row 4: Cashew (25ft spacing) + Pineapple ground cover",
      "Row 5: Neem (25ft spacing) + mixed ground cover",
      "Bamboo cluster at SE corner near pond",
    ],
    intercrops: ["Pineapple", "Sweet Potato", "Groundnut", "Drumstick (border)"],
    expectedIncome: { year1: "₹1-2 Lakh", year5: "₹5-7 Lakh", year10: "₹12-18 Lakh (+ timber asset)" },
  },
];

// ── Flower Panel Species ──
export const FLOWER_SPECIES = [
  { name: "Marigold (Gainda)", season: "Kharif + Rabi", color: "#FFA000" },
  { name: "Rose (Desi Gulab)", season: "Year-round", color: "#E91E63" },
  { name: "Jasmine (Mogra)", season: "Summer + Monsoon", color: "#F5F5F5" },
  { name: "Tuberose (Rajnigandha)", season: "Monsoon + Winter", color: "#FFFDE7" },
  { name: "Crossandra", season: "Year-round", color: "#FF7043" },
  { name: "Chrysanthemum", season: "Winter", color: "#FFEB3B" },
  { name: "Aloe Vera", season: "Year-round (medicinal)", color: "#66BB6A" },
  { name: "Tulsi (Holy Basil)", season: "Year-round (medicinal)", color: "#43A047" },
  { name: "Lemongrass", season: "Year-round (aromatic)", color: "#9CCC65" },
];

// ── Generate Coconut Tree Positions Along Roads ──
export function getCoconutPositions(): { x: number; y: number; roadId: string }[] {
  const positions: { x: number; y: number; roadId: string }[] = [];
  const spacing = 25;
  const half = spacing / 2; // diagonal offset for stagger

  // ── West Main Road (15ft, x=7→22) ──
  // Buffer side: x=6 (1ft into buffer from road edge x=7)
  // Flower side: x=23.5 (center of 3ft flower panel x=22→25)
  for (let y = 20; y <= 780; y += spacing) {
    positions.push({ x: 6, y, roadId: "road-w" });
  }
  for (let y = 20 + half; y <= 780; y += spacing) {
    positions.push({ x: 23.5, y, roadId: "road-w" });
  }

  // ── North Road (12ft, y=7→19) ──
  // Buffer side: y=6 (1ft into buffer)
  // Flower side: y=20.5 (center of flower panel y=19→22)
  for (let x = 35; x <= 635; x += spacing) {
    positions.push({ x, y: 6, roadId: "road-n" });
  }
  for (let x = 35 + half; x <= 635; x += spacing) {
    positions.push({ x, y: 20.5, roadId: "road-n" });
  }

  // ── East Road (12ft, x=641→653) ──
  // Flower side: x=639.5 (center of flower panel x=638→641)
  // Buffer side: x=654 (1ft into buffer from road edge x=653)
  for (let y = 20; y <= 780; y += spacing) {
    positions.push({ x: 639.5, y, roadId: "road-e" });
  }
  for (let y = 20 + half; y <= 780; y += spacing) {
    positions.push({ x: 654, y, roadId: "road-e" });
  }

  // ── South Road (12ft, y=773→785) ──
  // Flower side: y=771.5 (center of flower panel y=770→773)
  // Buffer side: y=786 (1ft into buffer)
  for (let x = 35; x <= 635; x += spacing) {
    positions.push({ x, y: 771.5, roadId: "road-s" });
  }
  for (let x = 35 + half; x <= 635; x += spacing) {
    positions.push({ x, y: 786, roadId: "road-s" });
  }

  // ── Central N-S Road (12ft, x=326→338) ──
  // West side: x=324.5 (1.5ft into zone from road edge)
  // East side: x=339.5 (1.5ft into zone from road edge)
  for (let y = 30; y <= 770; y += spacing) {
    positions.push({ x: 324.5, y, roadId: "road-ns" });
  }
  for (let y = 30 + half; y <= 770; y += spacing) {
    positions.push({ x: 339.5, y, roadId: "road-ns" });
  }

  // ── Central E-W Road (12ft, y=390→402) ──
  // North side: y=388.5 (1.5ft into zone from road edge)
  // South side: y=403.5 (1.5ft into zone from road edge)
  for (let x = 35; x <= 636; x += spacing) {
    positions.push({ x, y: 388.5, roadId: "road-ew" });
  }
  for (let x = 35 + half; x <= 636; x += spacing) {
    positions.push({ x, y: 403.5, roadId: "road-ew" });
  }

  return positions;
}

// ── Area Breakdown Calculation ──
export interface AreaItem {
  label: string;
  sqFt: number;
  acres: number;
  percent: number;
  color: string;
}

export function computeAreaBreakdown(): AreaItem[] {
  const total = FARM.sqFt;
  const buffer = (FARM.width * FARM.height) - (BUFFER_INNER.w * BUFFER_INNER.h);
  const peripheralRoads = (15 * 778) + (619 * 12) + (12 * 778) + (619 * 12); // W(15)+N(12)+E(12)+S(12)
  const flowerPanels = (301 + 300) * 3 * 2 + (368 + 368) * 3 * 2; // N+S panels (split) + W+E panels (split)
  const centralRoads = (12 * 754) + (12 * 619) - (12 * 12); // roads extend to peripherals, minus intersection overlap
  const infraArea = INFRASTRUCTURE.reduce((s, i) => s + i.w * i.h, 0);
  const waterArea = WATER_FEATURES.reduce((s, w) => s + w.w * w.h, 0);
  const productive = total - buffer - peripheralRoads - flowerPanels - centralRoads - infraArea - waterArea;

  const items: Omit<AreaItem, "percent">[] = [
    { label: "Productive Orchard", sqFt: productive, acres: productive / 43560, color: "#4CAF50" },
    { label: "Peripheral Roads", sqFt: peripheralRoads, acres: peripheralRoads / 43560, color: "#B8B8D1" },
    { label: "Internal Roads", sqFt: centralRoads, acres: centralRoads / 43560, color: "#C5C5D8" },
    { label: "Buffer / Live Fence", sqFt: buffer, acres: buffer / 43560, color: "#81C784" },
    { label: "Flower Panels", sqFt: flowerPanels, acres: flowerPanels / 43560, color: "#F9A8D4" },
    { label: "Infrastructure", sqFt: infraArea, acres: infraArea / 43560, color: "#FFCC80" },
    { label: "Water Features", sqFt: waterArea, acres: waterArea / 43560, color: "#4FC3F7" },
  ];

  return items.map((item) => ({
    ...item,
    acres: Math.round(item.acres * 100) / 100,
    percent: Math.round((item.sqFt / total) * 1000) / 10,
  }));
}

// ── Recommended Add-on Details ──
export interface AddonRecommendation {
  name: string;
  size: string;
  location: string;
  benefit: string;
  priority: "High" | "Medium" | "Low";
  estimatedCost: string;
}

export const ADDON_RECOMMENDATIONS: AddonRecommendation[] = [
  { name: "Polyhouse / Greenhouse", size: "40×28 ft", location: "Near nursery, Zone A", benefit: "Seedling nursery, off-season high-value crops", priority: "Medium", estimatedCost: "₹2-3 Lakh" },
  { name: "Rooftop Solar (5KW)", size: "On farmhouse roof", location: "Farmhouse rooftop (SW peak)", benefit: "Powers bore pumps, lighting — saves ₹30K/yr electricity, no ground space needed", priority: "High", estimatedCost: "₹2.5-3.5 Lakh" },
  { name: "Rainwater Harvesting", size: "Network", location: "All roads channel → farm pond", benefit: "12 lakh liters/yr collection, reduces bore well dependency", priority: "High", estimatedCost: "₹50,000-1 Lakh" },
  { name: "Drip Irrigation System", size: "Full farm", location: "All zones", benefit: "50-60% water savings, precise fertigation", priority: "High", estimatedCost: "₹3-5 Lakh" },
  { name: "Biogas Plant", size: "18×18 ft", location: "Near cattle shed", benefit: "Cooking gas + slurry for fertilizer from cow dung", priority: "Medium", estimatedCost: "₹40,000-60,000" },
];

// ── Infrastructure Sizing Recommendations ──
export interface InfraRecommendation {
  name: string;
  recommendedSize: string;
  purpose: string;
  construction: string;
}

export const INFRA_RECOMMENDATIONS: InfraRecommendation[] = [
  { name: "Farmhouse", recommendedSize: "55×38 ft (2,090 sq ft)", purpose: "Residence with veranda, attached kitchen, 2BHK minimum for farm family", construction: "RCC/Brick, raised 2ft plinth, rainwater harvesting from roof, 5KW rooftop solar panels powering bore pumps & lighting" },
  { name: "Store / Godown", recommendedSize: "35×28 ft (980 sq ft)", purpose: "Fertilizer, seed, tool & harvest storage with ventilation", construction: "Sheet roofing, concrete floor, rat-proof, ventilated" },
  { name: "Cattle Shed", recommendedSize: "35×28 ft (980 sq ft)", purpose: "2-3 desi cows for Jeevamrut, milk, cow dung, urine", construction: "Open-sided with roof, sloped floor for drainage" },
  { name: "Kitchen Garden", recommendedSize: "60×48 ft (2,880 sq ft)", purpose: "Daily vegetables, herbs, medicinal plants for household + sale", construction: "Raised beds, drip irrigation, seasonal rotation" },
  { name: "Nursery", recommendedSize: "42×28 ft (1,176 sq ft)", purpose: "Seedling production, grafting, hardening area", construction: "Shade net structure, misting system, grow bags" },
  { name: "Farm Pond", recommendedSize: "85×65 ft (5,525 sq ft)", purpose: "Rainwater storage, fish culture, emergency irrigation", construction: "Lined pond, 8-10ft depth, silpaulin lining, inlet/outlet" },
  { name: "Parking", recommendedSize: "50×28 ft (1,400 sq ft)", purpose: "Tractor + 2-3 vehicles + loading/unloading area", construction: "Concrete/gravel, shade structure optional" },
  { name: "Composting Area", recommendedSize: "28×28 ft (784 sq ft)", purpose: "Jeevamrut tanks, Panchagavya prep, 3-pit compost system", construction: "Concrete pits, shade roof, water connection" },
  { name: "Bee Keeping", recommendedSize: "20×18 ft (360 sq ft)", purpose: "4-5 bee hive boxes for pollination boost + honey income (₹15-20K/yr)", construction: "Open platform with shade, near flower panels/zone boundary" },
  { name: "Mushroom Shed", recommendedSize: "25×18 ft (450 sq ft)", purpose: "Oyster/Shiitake mushroom cultivation, ₹30-50K/yr income", construction: "Enclosed shed, controlled humidity, shade net, near cattle shed" },
  { name: "Drying Yard", recommendedSize: "28×22 ft (616 sq ft)", purpose: "Solar drying for turmeric, ginger, chilli, and other produce", construction: "Concrete platform, raised edges, optional retractable shade" },
  { name: "Processing Unit", recommendedSize: "30×22 ft (660 sq ft)", purpose: "Value addition — pickle, jam, juice, pulp (2-3x farm-gate price)", construction: "Enclosed room, food-grade flooring, water + electricity, near store" },
  { name: "Watch Tower", recommendedSize: "10×10 ft (100 sq ft)", purpose: "Elevated observation point for security, bird watching, farm monitoring", construction: "Steel/bamboo structure, 15-20 ft height, near central east boundary" },
];

// ── Gate Position ──
export const GATE = {
  x: 7,
  y: 7,
  label: "Main Gate (NW)",
};

// ── Slope & Drainage Info ──
export const SLOPE_INFO = {
  direction: "West → East (SW corner is peak)",
  gradient: "Gentle (~2-3%)",
  highSide: "West (SW corner = highest point)",
  lowSide: "East (Nala / Stream)",
  drainageStrategy: "Two-bore system: Domestic bore at SW peak (farmhouse use) + Irrigation bore at SE low area (reliable water table) pumps UP to 50,000L tank at SW peak → gravity-fed drip to all zones. Contour trenches N-S slow E-ward runoff.",
  erosionControl: "Dense live fence on East, percolation pits, farm pond at SE",
};
