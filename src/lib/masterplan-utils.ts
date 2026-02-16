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
  {
    id: "road-w",
    label: "Main Road 15 ft",
    x: 7,
    y: 7,
    w: 15,
    h: 778,
    color: "#B8B8D1",
    stroke: "#9898B0",
    type: "road",
    details: "Entry road from NW gate — Coconut avenue both sides",
  },
  {
    id: "road-n",
    label: "North Road 12 ft",
    x: 22,
    y: 7,
    w: 619,
    h: 12,
    color: "#B8B8D1",
    stroke: "#9898B0",
    type: "road",
    details: "Along 30ft public road — Coconut avenue both sides",
  },
  {
    id: "road-e",
    label: "East Road 12 ft",
    x: 641,
    y: 7,
    w: 12,
    h: 778,
    color: "#B8B8D1",
    stroke: "#9898B0",
    type: "road",
    details: "Along east boundary near nala — Drainage side",
  },
  {
    id: "road-s",
    label: "South Road 12 ft",
    x: 22,
    y: 773,
    w: 619,
    h: 12,
    color: "#B8B8D1",
    stroke: "#9898B0",
    type: "road",
    details: "Southern service road — Coconut avenue both sides",
  },
];

// ── Internal Roads (12 ft each — extend to meet peripheral roads) ──
export const INTERNAL_ROADS: LayoutItem[] = [
  {
    id: "road-ns",
    label: "Central N-S Road 12 ft",
    x: 326,
    y: 19,
    w: 12,
    h: 754,
    color: "#C5C5D8",
    stroke: "#A0A0B8",
    type: "road",
    details: "Divides East/West zones — Coconut avenue",
  },
  {
    id: "road-ew",
    label: "Central E-W Road 12 ft",
    x: 22,
    y: 390,
    w: 619,
    h: 12,
    color: "#C5C5D8",
    stroke: "#A0A0B8",
    type: "road",
    details: "Divides North/South zones — Coconut avenue",
  },
];

// ── Flower Panels (3 ft — split at road intersections so roads connect) ──
export const FLOWER_PANELS: LayoutItem[] = [
  // North panel: split at NS central road (x=326 to 338)
  {
    id: "flower-n-w",
    label: "North Flower Panel W",
    x: 25,
    y: 19,
    w: 301,
    h: 3,
    color: "#F9A8D4",
    stroke: "#EC4899",
    type: "flower",
  },
  {
    id: "flower-n-e",
    label: "North Flower Panel E",
    x: 338,
    y: 19,
    w: 300,
    h: 3,
    color: "#F9A8D4",
    stroke: "#EC4899",
    type: "flower",
  },
  // South panel: split at NS central road (x=326 to 338)
  {
    id: "flower-s-w",
    label: "South Flower Panel W",
    x: 25,
    y: 770,
    w: 301,
    h: 3,
    color: "#F9A8D4",
    stroke: "#EC4899",
    type: "flower",
  },
  {
    id: "flower-s-e",
    label: "South Flower Panel E",
    x: 338,
    y: 770,
    w: 300,
    h: 3,
    color: "#F9A8D4",
    stroke: "#EC4899",
    type: "flower",
  },
  // West panel: split at EW central road (y=390 to 402)
  {
    id: "flower-w-n",
    label: "West Flower Panel N",
    x: 22,
    y: 22,
    w: 3,
    h: 368,
    color: "#F9A8D4",
    stroke: "#EC4899",
    type: "flower",
  },
  {
    id: "flower-w-s",
    label: "West Flower Panel S",
    x: 22,
    y: 402,
    w: 3,
    h: 368,
    color: "#F9A8D4",
    stroke: "#EC4899",
    type: "flower",
  },
  // East panel: split at EW central road (y=390 to 402)
  {
    id: "flower-e-n",
    label: "East Flower Panel N",
    x: 638,
    y: 22,
    w: 3,
    h: 368,
    color: "#F9A8D4",
    stroke: "#EC4899",
    type: "flower",
  },
  {
    id: "flower-e-s",
    label: "East Flower Panel S",
    x: 638,
    y: 402,
    w: 3,
    h: 368,
    color: "#F9A8D4",
    stroke: "#EC4899",
    type: "flower",
  },
];

// ── Four Productive Zones ──
export const ZONES: (LayoutItem & {
  areaAcres: number;
  strategy: string;
  crops: string[];
  keyTrees: string[];
})[] = [
  {
    id: "zone-a",
    label: "Zone A",
    x: 25,
    y: 22,
    w: 301,
    h: 368,
    color: "#E8F5E9",
    stroke: "#4CAF50",
    type: "zone",
    areaAcres: 2.54,
    strategy: "High Cash Flow + Farm Operations Hub",
    details:
      "Banana + Papaya + Guava dominant, Drip irrigation, Quick returns from Year 1. NW farm-ops compound (Gate, Parking, Cattle Shed, Nursery, Composting).",
    crops: [
      "Banana (Grand Naine, Elakki)",
      "Papaya (Red Lady, Taiwan 786)",
      "Guava (Taiwan Pink, VNR Bihi)",
      "Moringa (PKM-1)",
      "Drumstick",
    ],
    keyTrees: ["banana", "papaya", "guava", "moringa"],
  },
  {
    id: "zone-b",
    label: "Zone B",
    x: 338,
    y: 22,
    w: 300,
    h: 368,
    color: "#E3F2FD",
    stroke: "#2196F3",
    type: "zone",
    areaAcres: 2.53,
    strategy: "Balanced Orchard (Palekar B/M/S Mix)",
    details:
      "Full Big/Medium/Small Palekar model, 24×24 or 36×36 K-modules, Diverse mixed fruit orchard for steady income.",
    crops: [
      "Mango (Kesar, Alphonso)",
      "Pomegranate (Bhagwa)",
      "Lemon (Kagzi)",
      "Orange (Nagpur)",
      "Custard Apple",
      "Amla",
      "Banana filler",
    ],
    keyTrees: ["mango", "pomegranate", "lemon", "orange", "custard-apple"],
  },
  {
    id: "zone-c",
    label: "Zone C",
    x: 25,
    y: 402,
    w: 301,
    h: 368,
    color: "#FFF8E1",
    stroke: "#FF9800",
    type: "zone",
    areaAcres: 2.54,
    strategy: "Mixed Fruit + Spice + Residential Hub",
    details:
      "SW corner is the peak elevation — Farmhouse, Store, Kitchen Garden, Processing here. Integrated Watch Tower (bore + tank + observation) + Swimming Pool with tree shed at NE of infra for max visibility. Mixed fruit orchard with spice intercrops surrounds the residential compound.",
    crops: [
      "Jackfruit (Konkan Prolific)",
      "Anjeer (Poona Fig)",
      "Mulberry",
      "Lychee",
      "Avocado",
      "Black Pepper (climber)",
      "Turmeric / Ginger intercrop",
    ],
    keyTrees: ["jackfruit", "anjeer", "mulberry", "lychee", "avocado"],
  },
  {
    id: "zone-d",
    label: "Zone D",
    x: 338,
    y: 402,
    w: 300,
    h: 368,
    color: "#FCE4EC",
    stroke: "#E91E63",
    type: "zone",
    areaAcres: 2.54,
    strategy: "Premium Timber + Asset Building",
    details:
      "Teak, Sandalwood, Coconut, Cashew for long-term asset. Farm pond near nala for water harvesting. Percolation pits for recharge.",
    crops: [
      "Teak (Nilambur)",
      "Sandalwood",
      "Coconut (TxD Hybrid)",
      "Cashew (Vengurla-4)",
      "Neem",
      "Bamboo clusters",
      "Pineapple ground cover",
    ],
    keyTrees: ["teak", "sandalwood", "coconut", "cashew", "neem"],
  },
];

// ── Infrastructure Items ──
// Split into two hubs:
//   NW (Gate entry) — Farm Operations: Guard, Parking, Cattle Shed, Nursery, Composting
//   SW (Peak elevation) — Residential + Processing: Farmhouse, Store, Tower, Water Tank, Kitchen Garden
export const INFRASTRUCTURE: LayoutItem[] = [
  // ─── NW Hub — Farm Operations (near gate) ───
  // Row 1: Guard + Parking (y=25-53)
  {
    id: "inf-guard",
    label: "Guard / Entry",
    x: 28,
    y: 25,
    w: 12,
    h: 10,
    color: "#78909C",
    stroke: "#546E7A",
    type: "infra",
    details: "10×12 ft — Entry checkpoint at NW gate, visitor register",
  },
  {
    id: "inf-parking",
    label: "Parking",
    x: 46,
    y: 25,
    w: 50,
    h: 28,
    color: "#90A4AE",
    stroke: "#607D8B",
    type: "infra",
    details:
      "50×28 ft — Tree-lined open parking, 3-4 vehicles + tractor. 7 shade trees (Pongamia + Arjun + 5 Neem) on all 4 sides at 20ft spacing — no fruit/sticky pods, vehicles pass freely. Entry: SOUTH, Exit: NORTH.",
  },
  // Row 1 contd: Cycle Stand + Wash Bay (east of parking, x=100-116)
  {
    id: "inf-cycle-stand",
    label: "Cycle Stand",
    x: 100,
    y: 25,
    w: 16,
    h: 12,
    color: "#80CBC4",
    stroke: "#00897B",
    type: "infra",
    details:
      "16×12 ft — Covered cycle stand for orchard tours. 10-12 cycles (adult + child + basket-equipped). Helmet rack, tire pump, basic tool kit. Signboard with 3 suggested tour route maps. Pick up a cycle here, ride the coconut avenues!",
  },
  {
    id: "inf-wash-bay",
    label: "Wash Bay",
    x: 100,
    y: 40,
    w: 16,
    h: 12,
    color: "#B3E5FC",
    stroke: "#0288D1",
    type: "infra",
    details:
      "16×12 ft — Water-only vehicle wash (no chemicals). Concrete platform sloped 2% east → gravel bio-filter → open channel → Zone A banana/papaya tree basins. ~200L per car wash, all water nourishes plants. Bore-water tap + pressure hose.",
  },
  // ── NW Hub Shared Road 10ft (y=55→65) — between Parking row and Cattle row
  // ── 2ft gap above (parking y=53), 3ft gap below (cattle y=68) — matches SW Hub pattern
  // ── Vehicles enter from W Main Road, access Parking (south side), Cattle, Composting, Biogas
  // Row 2: Cattle + Composting (y=68-96) — Biogas is toggleable addon
  {
    id: "inf-shed",
    label: "Cattle / Tool Shed",
    x: 28,
    y: 68,
    w: 38,
    h: 28,
    color: "#BCAAA4",
    stroke: "#6D4C41",
    type: "infra",
    details:
      "38×28 ft — 2-3 cow capacity + tool storage. Entry: NORTH (from Shared Road). East gate for cattle into zone. Neem shade trees.",
  },
  {
    id: "inf-compost",
    label: "Composting",
    x: 73,
    y: 68,
    w: 28,
    h: 28,
    color: "#8D6E63",
    stroke: "#4E342E",
    type: "infra",
    details:
      "28×28 ft — Jeevamrut, Panchagavya prep + compost pits. Access: NORTH (from Shared Road)",
  },
  // NW Hub Nursery Road 10ft (y=98→108) — between Cattle row and Nursery row
  // 2ft gap above (cattle y=96), 3ft gap below (nursery y=111) — matches SW Hub pattern
  // Row 3: Nursery (y=111-139) — Vermicompost & Mushroom are toggleable addons
  {
    id: "inf-nursery",
    label: "Nursery",
    x: 28,
    y: 111,
    w: 42,
    h: 28,
    color: "#81C784",
    stroke: "#2E7D32",
    type: "infra",
    details:
      "42×28 ft — Seedling nursery, grafting area. Gate: EAST. Gulmohar + Semal for filtered light.",
  },
  {
    id: "inf-beehive",
    label: "Bee Keeping",
    x: 280,
    y: 365,
    w: 20,
    h: 18,
    color: "#FFE082",
    stroke: "#FFA000",
    type: "infra",
    details: "20×18 ft — 4-5 bee hive boxes near flower panels for pollination",
  },

  // ─── SW Hub — Residential + Processing (peak elevation, SW corner) ───
  // Layout: stacked rows at SW corner, each row can expand EAST (→) into Zone C (~230ft)
  // Expansion north (↑) into open orchard above (~180ft available)
  // Row 1 — Residential (y=585)
  {
    id: "inf-house",
    label: "Farmhouse",
    x: 28,
    y: 585,
    w: 55,
    h: 40,
    color: "#FFCC80",
    stroke: "#F57C00",
    type: "infra",
    details:
      "55×40 ft — 2BHK at SW peak, 5KW rooftop solar. Main gate: EAST (morning sun, orchard view). Secondary: WEST (road access). Mango + Tamarind shade.",
  },
  {
    id: "inf-store",
    label: "Store / Godown",
    x: 95,
    y: 585,
    w: 35,
    h: 28,
    color: "#CE93D8",
    stroke: "#7B1FA2",
    type: "infra",
    details:
      "35×28 ft — Harvest & tool storage. Loading gate: EAST. Neem shade for pest repellent.",
  },
  // Row 2 — Kitchen Garden (y=640, 15ft gap)
  {
    id: "inf-kitchen-garden",
    label: "Kitchen Garden",
    x: 28,
    y: 640,
    w: 70,
    h: 45,
    color: "#A5D6A7",
    stroke: "#388E3C",
    type: "infra",
    details:
      "70×45 ft — Vegetables, herbs, medicinal plants. Expand east → / north ↑",
  },
  // Row 3 — Processing (y=700, 15ft gap)
  {
    id: "inf-processing",
    label: "Processing Unit",
    x: 28,
    y: 700,
    w: 40,
    h: 28,
    color: "#FFECB3",
    stroke: "#FF8F00",
    type: "infra",
    details:
      "40×28 ft — Pickle, jam, juice, pulp. Gate: EAST. Neem shade. Expand east → / north ↑",
  },
  {
    id: "inf-drying",
    label: "Drying Yard",
    x: 80,
    y: 700,
    w: 35,
    h: 28,
    color: "#FFF9C4",
    stroke: "#F9A825",
    type: "infra",
    details: "35×28 ft — Solar drying platform. Expand east →",
  },
  // ─── Integrated Watch Tower + Water Tank + Bore — NE of SW Hub (best visibility) ───
  // Positioned at NE corner of infra cluster for clear sightlines to all 4 zones, gate, and boundary.
  // Still in western (high) half of farm — 20ft tower height provides ample gravity head for irrigation.
  // Bore at base (underground) → 20ft steel tower → 10,000L plastic tank on platform → railing walkway for 360° observation
  {
    id: "inf-watchtower",
    label: "Watch Tower",
    x: 132,
    y: 567,
    w: 16,
    h: 16,
    color: "#607D8B",
    stroke: "#37474F",
    type: "infra",
    details:
      "16×16 ft integrated: Bore at base + 20ft steel tower + 10,000L tank on platform + railing walkway. NE of SW Hub = clear sightlines to all zones. Bore feeds swimming pool (east) → overflow runs straight east into orchard.",
  },
  // ─── Village-style Swimming Pool — EAST of Watch Tower (W→E slope → overflow straight into orchard) ───
  // 30×14 ft — width (N-S) constrained by cottage row (4ft gap south), length (E) stretches into open orchard.
  // 30ft = ~9m swimming length — real lap pool. Shallow end (3ft) at west near tower steps, deep end (5ft) at east.
  // Surrounded by natural tree canopy ("tree shed"):
  //   North: Jamun (water-loving, evergreen, fruit) + Kadamba (water-loving, fragrant orange flowers)
  //   South: Ashoka (evergreen, columnar, orange-red flowers Feb-May, screen to cottages)
  //   East:  Bakul (evergreen, dense shade, fragrant white flowers year-round, cleanest leaf drop)
  //   West:  Watch Tower (20ft) casts afternoon shade
  // → Year-round evergreen canopy + flowers Feb-Sep + fruit Jun-Aug. All water-loving species.
  {
    id: "inf-splash-tub",
    label: "Swimming Pool",
    x: 150,
    y: 567,
    w: 30,
    h: 14,
    color: "#4DD0E1",
    stroke: "#00838F",
    type: "infra",
    details:
      "30×14 ft swimming pool — 3ft shallow (west/tower side) → 5ft deep (east). ~9m lap length. Bore-fed, tiled. Overflow east wall → straight trench into orchard (W→E slope). Natural tree shed: Jamun + Kadamba (N), Ashoka (S), Bakul (E), Tower (W). Year-round evergreen canopy + flowers Feb-Sep.",
  },
];

// ── Water Features ──
export const WATER_FEATURES: LayoutItem[] = [
  {
    id: "water-pond",
    label: "Farm Pond",
    x: 540,
    y: 690,
    w: 85,
    h: 65,
    color: "#4FC3F7",
    stroke: "#0277BD",
    type: "water",
    details:
      "85×65 ft — Rainwater harvesting, fish culture, SE corner near nala",
  },
  // Domestic bore integrated into Watch Tower base (inf-watchtower) — no separate footprint
  {
    id: "water-bore-irrigation",
    label: "Irrigation Bore",
    x: 340,
    y: 404,
    w: 14,
    h: 14,
    color: "#1E88E5",
    stroke: "#01579B",
    type: "water",
    details:
      "14×14 ft — Main irrigation bore + pump house at central intersection (mid-slope), pumps UP to SW tank + gravity-feeds E-ward trenches",
  },
  {
    id: "water-percolation",
    label: "Percolation Pit",
    x: 600,
    y: 440,
    w: 28,
    h: 28,
    color: "#81D4FA",
    stroke: "#0288D1",
    type: "water",
    details: "28×28 ft — Groundwater recharge pit, near east nala",
  },
];

// ── NW Hub Shared Road (10ft — connects W Main Road to all NW Hub structures) ──
// Runs E-W between Parking (south) and Cattle/Composting/Biogas (north)
// 2ft gap above (parking bottom y=53 → road y=55), 3ft gap below (road bottom y=65 → cattle y=68)
// Matches SW Hub road gap pattern for consistency across all hub roads
// Vehicle entry from W Main Road → Shared Road → Park from south / access cattle row from north
// Exit: reverse to W Main Road, or north through parking to North Road back to Gate (loop)
export const NW_HUB_ROAD: LayoutItem = {
  id: "road-nw-hub",
  label: "NW Hub Shared Road 10 ft",
  x: 22,
  y: 55,
  w: 120,
  h: 10,
  color: "#C5C5D8",
  stroke: "#A0A0B8",
  type: "road",
  details:
    "10 ft — Shared vehicle road between Parking/Cycle Stand/Wash Bay and Cattle/Composting/Biogas row. 2ft buffer above, 3ft buffer below. Entry from West Main Road. Exit: reverse or loop via North Road back to Gate. Wash Bay accessed from this road.",
};

// ── NW Hub Nursery Road (10ft — connects Cattle/Composting row to Nursery row) ──
// Runs E-W between Cattle row (south edge y=96) and Nursery (north edge y=111)
// Same 15ft gap pattern: y=98, h=10 → occupies y=98-108, with 2ft buffer top and 3ft buffer bottom
// Vehicle/cart access from W Main Road → Nursery Road → access Cattle (north), Nursery (south)
export const NW_HUB_NURSERY_ROAD: LayoutItem = {
  id: "road-nw-nursery",
  label: "NW Hub Nursery Road 10 ft",
  x: 22,
  y: 98,
  w: 120,
  h: 10,
  color: "#C5C5D8",
  stroke: "#A0A0B8",
  type: "road",
  details:
    "10 ft — Shared vehicle road between Cattle/Composting row and Nursery row. 2ft buffer above, 3ft buffer below. Entry from West Main Road.",
};

// ── NW Hub Vehicle Circulation Loop ──
// Entry: Gate → W Main Road (south) → Shared Road (east) → Parking from south
// Exit:  Parking (north) → North Road (west) → Gate
// Creates a one-way loop — especially convenient for 2-wheelers
export const NW_CIRCULATION: {
  entry: [number, number][];
  exit: [number, number][];
} = {
  entry: [
    [14, 10],
    [14, 60],
    [70, 60],
  ], // Gate → south on W Road → east on Shared Road
  exit: [
    [80, 25],
    [80, 16],
    [18, 16],
    [18, 7],
    [14, 7],
  ], // Parking north → through north road → west → Gate
};

// ── SW Hub Shared Road (10ft — connects W Main Road to all SW Hub structures) ──
// Runs E-W between Farmhouse/Store row (south edge y=625) and Kitchen Garden (north edge y=640)
// Centered in the 15ft gap: y=627, h=10 → occupies y=627-637, with 2ft buffer top and 3ft buffer bottom
// Vehicle entry from W Main Road → Shared Road → access Farmhouse (south), Store (south), Kitchen Garden (north)
export const SW_HUB_ROAD: LayoutItem = {
  id: "road-sw-hub",
  label: "SW Hub Shared Road 10 ft",
  x: 22,
  y: 627,
  w: 100,
  h: 10,
  color: "#C5C5D8",
  stroke: "#A0A0B8",
  type: "road",
  details:
    "10 ft — Shared vehicle road between Farmhouse/Store row and Kitchen Garden. 2ft buffer above, 3ft buffer below. Entry from West Main Road.",
};

// ── SW Hub Processing Road (10ft — connects Kitchen Garden to Processing/Drying row) ──
// Runs E-W between Kitchen Garden (south edge y=685) and Processing/Drying (north edge y=700)
// Same 15ft gap pattern: y=687, h=10 → occupies y=687-697, with 2ft buffer top and 3ft buffer bottom
// Vehicle entry from W Main Road → Processing Road → access Kitchen Garden (north), Processing (south), Drying (south)
export const SW_HUB_PROCESSING_ROAD: LayoutItem = {
  id: "road-sw-processing",
  label: "SW Hub Processing Road 10 ft",
  x: 22,
  y: 687,
  w: 100,
  h: 10,
  color: "#C5C5D8",
  stroke: "#A0A0B8",
  type: "road",
  details:
    "10 ft — Shared vehicle road between Kitchen Garden and Processing/Drying row. 2ft buffer above, 3ft buffer below. Entry from West Main Road.",
};

// ── SW Hub Vehicle Circulation ──
// Entry: Gate → W Main Road (south, ~580ft) → Turn east into SW Hub Shared Road → access buildings
// Exit:  Reverse on Shared Road → W Main Road → south to South Road or north back to Gate
export const SW_CIRCULATION: {
  entry: [number, number][];
  exit: [number, number][];
} = {
  entry: [
    [14, 10],
    [14, 632],
    [70, 632],
  ], // Gate → south on W Road → east on SW Shared Road
  exit: [
    [70, 632],
    [14, 632],
    [14, 780],
    [22, 780],
  ], // Shared Road west → W Main Road → south to South Road
};

// ── SW Hub Processing Vehicle Circulation ──
// Entry: Gate → W Main Road (south, ~680ft) → Turn east into SW Hub Processing Road → access Kitchen Garden / Processing / Drying
// Exit:  Reverse on Processing Road → W Main Road → south to South Road or north back to Gate
export const SW_PROCESSING_CIRCULATION: {
  entry: [number, number][];
  exit: [number, number][];
} = {
  entry: [
    [14, 10],
    [14, 692],
    [70, 692],
  ], // Gate → south on W Road → east on Processing Road
  exit: [
    [70, 692],
    [14, 692],
    [14, 780],
    [22, 780],
  ], // Processing Road west → W Main Road → south to South Road
};

// ── Cycle Tour Routes (ride the coconut avenues through all 4 zones) ──
// Start/end at Cycle Stand (x=108, y=31 = center of cycle stand)
// All routes follow the 12-15ft roads with coconut avenues on both sides
export interface CycleTourRoute {
  id: string;
  label: string;
  color: string;
  distanceKm: string;
  durationMin: string;
  description: string;
  points: [number, number][]; // polyline waypoints following road center-lines
}

export const CYCLE_TOUR_ROUTES: CycleTourRoute[] = [
  {
    id: "route-quick",
    label: "Quick Loop",
    color: "#4CAF50",
    distanceKm: "~0.4 km",
    durationMin: "4-6 min",
    description: "Zone A + B via internal roads — coconut avenues, quick ride",
    points: [
      [108, 31], // Cycle Stand
      [108, 13], // North Road center
      [332, 13], // East to Central N-S Road
      [332, 396], // South on N-S Road to E-W intersection
      [14, 396], // West on E-W Road to West Main Road
      [14, 31], // North on West Main Road
      [108, 31], // Back to Cycle Stand via parking
    ],
  },
  {
    id: "route-perimeter",
    label: "Full Perimeter",
    color: "#FF9800",
    distanceKm: "~0.85 km",
    durationMin: "8-10 min",
    description:
      "Entire farm boundary — all 4 sides, coconut avenues, boundary views",
    points: [
      [108, 31], // Cycle Stand
      [108, 13], // North Road center
      [647, 13], // East along North Road
      [647, 779], // South along East Road
      [22, 779], // West along South Road
      [14, 779], // Turn north on West Main Road
      [14, 31], // North on West Main Road
      [108, 31], // Back to Cycle Stand
    ],
  },
  {
    id: "route-grand",
    label: "Grand Tour",
    color: "#9C27B0",
    distanceKm: "~1.0 km",
    durationMin: "10-15 min",
    description:
      "Figure-8 through all 4 zones — rides between C/D on N-S road, covers every internal road",
    points: [
      [108, 31], // Cycle Stand
      [108, 13], // North Road center
      [332, 13], // East on North Road to N-S junction
      [332, 779], // South on N-S Road ALL the way — between A/B then between C/D
      [14, 779], // West on South Road to SW corner
      [14, 396], // North on West Road to E-W junction (past Zone C west side)
      [647, 396], // East on E-W Road to East Road (crosses center)
      [647, 13], // North on East Road to NE corner (past Zone B east side)
      [108, 13], // West on North Road back toward cycle stand
      [108, 31], // Back to Cycle Stand
    ],
  },
];

// ── Toggleable Add-ons (optional extras — hide to see productive orchard area) ──
// Includes: Polyhouse, Biogas, Vermicompost, Mushroom Shed, Tourism Cottages
export const ADDONS: LayoutItem[] = [
  // ─── NW Hub optional structures ───
  {
    id: "addon-polyhouse",
    label: "Polyhouse",
    x: 143,
    y: 111,
    w: 40,
    h: 28,
    color: "#E0E0E0",
    stroke: "#757575",
    type: "addon",
    details:
      "40×28 ft — High-value crop nursery, off-season vegetables, near NW nursery",
  },
  {
    id: "inf-biogas",
    label: "Biogas",
    x: 108,
    y: 68,
    w: 18,
    h: 18,
    color: "#FFD54F",
    stroke: "#F9A825",
    type: "addon",
    details:
      "18×18 ft — 2 cubic meter biogas plant, cow dung from cattle shed. Access: NORTH (from Shared Road)",
  },
  {
    id: "inf-vermi",
    label: "Vermicompost",
    x: 78,
    y: 111,
    w: 25,
    h: 20,
    color: "#A1887F",
    stroke: "#5D4037",
    type: "addon",
    details: "25×20 ft — 4-bed vermicompost unit, near cattle shed",
  },
  {
    id: "inf-mushroom",
    label: "Mushroom Shed",
    x: 110,
    y: 111,
    w: 25,
    h: 20,
    color: "#D7CCC8",
    stroke: "#795548",
    type: "addon",
    details:
      "25×20 ft — Oyster/Shiitake mushroom, shaded area near cattle shed",
  },
  // ─── Agri-Tourism Eco Cottages (Zone C — east of SW Hub infrastructure) ───
  // 6 bamboo/thatch eco cottages in a courtyard layout. North row of 3
  // (level with Farmhouse), large open Common Area center, South row of 3
  // (level with Processing/Drying). Shared Facility on the east side.
  {
    id: "inf-cottage-1",
    label: "Cottage 1",
    x: 160,
    y: 585,
    w: 20,
    h: 15,
    color: "#D7CCC8",
    stroke: "#795548",
    type: "addon",
    details:
      "20×15 ft — Eco bamboo cottage, north row west. East of Store. 1 room + bath.",
  },
  {
    id: "inf-cottage-2",
    label: "Cottage 2",
    x: 200,
    y: 585,
    w: 20,
    h: 15,
    color: "#D7CCC8",
    stroke: "#795548",
    type: "addon",
    details:
      "20×15 ft — Eco bamboo cottage, north row center. Orchard view east. 1 room + bath.",
  },
  {
    id: "inf-cottage-3",
    label: "Cottage 3",
    x: 240,
    y: 585,
    w: 20,
    h: 15,
    color: "#D7CCC8",
    stroke: "#795548",
    type: "addon",
    details:
      "20×15 ft — Eco bamboo cottage, north row east. Morning sun, best view. 1 room + bath.",
  },
  {
    id: "inf-cottage-4",
    label: "Cottage 4",
    x: 160,
    y: 700,
    w: 20,
    h: 15,
    color: "#D7CCC8",
    stroke: "#795548",
    type: "addon",
    details:
      "20×15 ft — Eco bamboo cottage, south row west. Near kitchen garden. 1 room + bath.",
  },
  {
    id: "inf-cottage-5",
    label: "Cottage 5",
    x: 200,
    y: 700,
    w: 20,
    h: 15,
    color: "#D7CCC8",
    stroke: "#795548",
    type: "addon",
    details: "20×15 ft — Eco bamboo cottage, south row center. 1 room + bath.",
  },
  {
    id: "inf-cottage-6",
    label: "Cottage 6",
    x: 240,
    y: 700,
    w: 20,
    h: 15,
    color: "#D7CCC8",
    stroke: "#795548",
    type: "addon",
    details:
      "20×15 ft — Eco bamboo cottage, south row east. Orchard view. 1 room + bath.",
  },
  {
    id: "inf-tourism-common",
    label: "Common Area",
    x: 160,
    y: 620,
    w: 120,
    h: 60,
    color: "#FFE0B2",
    stroke: "#E65100",
    type: "addon",
    details:
      "120×60 ft — Large open courtyard: fire pit, communal dining, yoga, farm workshops. East-facing orchard view.",
  },
  {
    id: "inf-tourism-facility",
    label: "Shared Facility",
    x: 290,
    y: 645,
    w: 15,
    h: 25,
    color: "#BCAAA4",
    stroke: "#5D4037",
    type: "addon",
    details:
      "15×25 ft — Shared washrooms, laundry, linen storage for all 6 cottages.",
  },
];

// Convenience subset: tourism-only items from ADDONS (for detail sheet context)
export const TOURISM_COTTAGES: LayoutItem[] = ADDONS.filter(
  (a) => a.id.startsWith("inf-cottage-") || a.id.startsWith("inf-tourism-"),
);

// ── Tourism Trees (shade + fruit around the courtyard cluster) ──
export const TOURISM_TREES: InfraTree[] = [
  // West side — between existing infra and cottages (buffer path area, x≈150)
  {
    id: "st-tour-w2",
    x: 150,
    y: 660,
    species: "Mulberry",
    purpose: "Fruit-picking along west path, quick-growing shade",
    nearInfra: "inf-tourism-common",
  },
  {
    id: "st-tour-w3",
    x: 150,
    y: 710,
    species: "Jackfruit",
    purpose: "Shade between Kitchen Garden and Cottage 4",
    nearInfra: "inf-cottage-4",
  },
  // North edge — shade for north cottage row (shifted east to clear pool area)
  {
    id: "st-tour-n1",
    x: 195,
    y: 578,
    species: "Lychee",
    purpose: "Fruit-picking for guests, shade over north cottages",
    nearInfra: "inf-cottage-1",
  },
  {
    id: "st-tour-n2",
    x: 250,
    y: 578,
    species: "Avocado",
    purpose: "Evergreen shade, premium fruit, north row east end",
    nearInfra: "inf-cottage-3",
  },
  // East side — orchard edge
  {
    id: "st-tour-e1",
    x: 275,
    y: 600,
    species: "Anjeer (Fig)",
    purpose: "Compact fruit tree, east of north row",
    nearInfra: "inf-cottage-3",
  },
  {
    id: "st-tour-e2",
    x: 290,
    y: 660,
    species: "Neem",
    purpose: "Pest repellent near facility block, evergreen shade",
    nearInfra: "inf-tourism-facility",
  },
  {
    id: "st-tour-e3",
    x: 275,
    y: 710,
    species: "Anjeer (Fig)",
    purpose: "Compact fruit tree, east of south row",
    nearInfra: "inf-cottage-6",
  },
  // Common area borders — aromatic herbs
  {
    id: "st-tour-h1",
    x: 180,
    y: 685,
    species: "Curry Leaf + Tulsi",
    purpose: "Aromatic border south of common area, cooking herbs",
    nearInfra: "inf-tourism-common",
  },
  {
    id: "st-tour-h2",
    x: 250,
    y: 685,
    species: "Lemongrass",
    purpose: "Insect repellent + fragrance at common area edge",
    nearInfra: "inf-tourism-common",
  },
  // South edge — shade for south cottage row
  {
    id: "st-tour-s1",
    x: 175,
    y: 722,
    species: "Mulberry",
    purpose: "Quick shade south of cottages, fruit-picking",
    nearInfra: "inf-cottage-4",
  },
  {
    id: "st-tour-s2",
    x: 250,
    y: 722,
    species: "Lychee",
    purpose: "Shade + fruit, south row east end",
    nearInfra: "inf-cottage-6",
  },
];

// ── Tourism Access Paths (from SW Hub Road east into courtyard) ──
export const TOURISM_PATHS: AccessPath[] = [
  // Main entry: SW Hub Shared Road east → buffer path → Common Area
  {
    id: "path-tourism-entry",
    label: "Tourism Entry (from SW Hub Road)",
    points: [
      [122, 632],
      [220, 632],
      [220, 620],
    ],
    type: "path",
  },
  // North-south spine connecting both cottage rows through common area
  {
    id: "path-tourism-spine",
    label: "Tourism Courtyard Spine (N-S)",
    points: [
      [220, 600],
      [220, 700],
    ],
    type: "path",
  },
  // Connection west to farmhouse
  {
    id: "path-tourism-farmhouse",
    label: "Tourism → Farmhouse Path",
    points: [
      [160, 600],
      [143, 600],
      [83, 600],
    ],
    type: "direct",
  },
];

// ── Tourism Gate Markers ──
export const TOURISM_GATES: GateMarker[] = [
  {
    id: "gate-tourism-entry",
    infraId: "inf-tourism-common",
    label: "Guest Entry",
    direction: "north",
    x: 210,
    y: 620,
    w: 20,
    h: 2,
  },
  {
    id: "gate-common-south",
    infraId: "inf-tourism-common",
    label: "South Access",
    direction: "south",
    x: 210,
    y: 680,
    w: 20,
    h: 2,
  },
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
  // ─── NW Hub — perimeter shade ring (cluster: x=28-135, y=25-139) ───
  // South perimeter (y=151, below all buildings — shifted for road gap alignment)
  {
    id: "st-nw-s1",
    x: 45,
    y: 151,
    species: "Gulmohar",
    purpose: "Filtered light, south of nursery",
    nearInfra: "inf-nursery",
  },
  {
    id: "st-nw-s2",
    x: 75,
    y: 151,
    species: "Neem",
    purpose: "South perimeter shade",
    nearInfra: "inf-nursery",
  },
  {
    id: "st-nw-s3",
    x: 110,
    y: 151,
    species: "Semal",
    purpose: "South perimeter shade",
    nearInfra: "inf-mushroom",
  },

  // ─── Parking shade trees — full tree ring, all 4 sides + NW corner ───
  // Vehicles pass freely through 20ft gaps between trees on N/S sides
  // NO fruit trees / NO sticky-pod trees (Rain Tree) — only clean canopy species
  //
  // NW corner — Pongamia between guard cabin (x=28-40) and parking (x=46-96), north side
  {
    id: "st-pk-nw",
    x: 43,
    y: 22,
    species: "Pongamia (Karanj)",
    purpose:
      "Fast dense canopy (15-20ft), shades guard + west parking. No mess, nitrogen-fixing, seeds → biodiesel",
    nearInfra: "inf-parking",
  },
  // North side (y=21, along south edge of North Road y=7-19, 2ft gap from road) — 20ft spacing
  {
    id: "st-pk-n1",
    x: 58,
    y: 21,
    species: "Neem",
    purpose:
      "North shade + pest repellent. Along road, not on road. 20ft gap for vehicle exit",
    nearInfra: "inf-parking",
  },
  {
    id: "st-pk-n2",
    x: 78,
    y: 21,
    species: "Neem",
    purpose:
      "North shade, along road edge. 20ft gap to N1 for vehicle exit. Evergreen",
    nearInfra: "inf-parking",
  },
  // East side (x=120, east of Cycle Stand + Wash Bay strip x=100-116) — 15ft apart
  // Shifted from x=106 to x=120 to accommodate Cycle Stand (x=100-116, y=25-37) + Wash Bay (x=100-116, y=40-52)
  {
    id: "st-pk-e1",
    x: 120,
    y: 33,
    species: "Arjun",
    purpose:
      "Tall clean canopy (20ft), shades cycle stand + east parking. Medicinal bark (Ayurveda). Zero mess on vehicles",
    nearInfra: "inf-cycle-stand",
  },
  {
    id: "st-pk-e2",
    x: 120,
    y: 48,
    species: "Neem",
    purpose:
      "Evergreen pest repellent + long-term 25ft canopy, shades wash bay + SE parking",
    nearInfra: "inf-wash-bay",
  },
  // ─── Wash Bay grey water planting — banana/papaya along drain channel east of wash bay ───
  // Water flows east from wash bay (x=116) through gravel bio-filter → open channel → tree basins
  {
    id: "st-wb-1",
    x: 130,
    y: 46,
    species: "Banana (Grand Naine)",
    purpose:
      "Grey water recipient — water-loving, high water uptake, quick growth. First tree basin along wash drain channel.",
    nearInfra: "inf-wash-bay",
  },
  {
    id: "st-wb-2",
    x: 140,
    y: 46,
    species: "Papaya (Red Lady)",
    purpose:
      "Grey water recipient — loves consistent moisture, fast-growing, fruit from Year 1.",
    nearInfra: "inf-wash-bay",
  },
  // South side (y=53, at parking south edge, just north of Shared Road y=54) — NOT on road
  {
    id: "st-pk-s1",
    x: 58,
    y: 53,
    species: "Neem",
    purpose:
      "South shade, along road edge but not on road. 20ft gap for vehicle entry",
    nearInfra: "inf-parking",
  },
  {
    id: "st-pk-s2",
    x: 78,
    y: 53,
    species: "Neem",
    purpose:
      "South shade, along road edge. 20ft gap to S1 for vehicle entry. Evergreen",
    nearInfra: "inf-parking",
  },

  // East perimeter of NW Hub (x=145, east of all buildings)
  {
    id: "st-nw-e1",
    x: 145,
    y: 40,
    species: "Rain Tree",
    purpose: "NW Hub east perimeter shade canopy",
    nearInfra: "inf-parking",
  },
  {
    id: "st-nw-e2",
    x: 145,
    y: 82,
    species: "Neem",
    purpose: "Insect repellent east of shed area",
    nearInfra: "inf-shed",
  },
  {
    id: "st-nw-e3",
    x: 145,
    y: 123,
    species: "Pongamia",
    purpose: "Dense shade east of mushroom",
    nearInfra: "inf-mushroom",
  },

  // ─── SW Hub — perimeter shade ring (cluster: x=28-115, y=585-762) ───
  // North perimeter (y=575, above farmhouse row)
  {
    id: "st-sw-n1",
    x: 45,
    y: 575,
    species: "Mango",
    purpose: "Shade + fruit, blocks summer heat",
    nearInfra: "inf-house",
  },
  {
    id: "st-sw-n2",
    x: 80,
    y: 575,
    species: "Tamarind",
    purpose: "Large canopy shade for farmhouse",
    nearInfra: "inf-house",
  },
  {
    id: "st-sw-n3",
    x: 115,
    y: 575,
    species: "Neem",
    purpose: "Pest repellent for store",
    nearInfra: "inf-store",
  },
  // East perimeter (x=125, east of all buildings)
  {
    id: "st-sw-e1",
    x: 125,
    y: 610,
    species: "Neem",
    purpose: "East shade for store",
    nearInfra: "inf-store",
  },
  {
    id: "st-sw-e2",
    x: 105,
    y: 660,
    species: "Drumstick",
    purpose: "Functional shade for kitchen garden",
    nearInfra: "inf-kitchen-garden",
  },
  {
    id: "st-sw-e3",
    x: 125,
    y: 714,
    species: "Neem",
    purpose: "Shade for processing workers",
    nearInfra: "inf-processing",
  },
  // South perimeter (below processing)
  {
    id: "st-sw-s1",
    x: 75,
    y: 735,
    species: "Curry Leaf",
    purpose: "Kitchen herbs near processing",
    nearInfra: "inf-processing",
  },
  {
    id: "st-sw-s2",
    x: 55,
    y: 735,
    species: "Pongamia",
    purpose: "Shade south of drying yard, wind buffer",
    nearInfra: "inf-drying",
  },
  // ─── Swimming Pool "Tree Shed" — 4 water-loving evergreen canopy trees ───
  // Creates year-round natural shade over pool. Flowers Feb-Sep, fruit Jun-Aug. All love moisture.
  // North pair: Jamun + Kadamba form continuous canopy wall (blocks noon sun)
  // South: Ashoka (columnar, evergreen screen between pool and cottage row, flowers Feb-May)
  // East: Bakul (dense shade, fragrant year-round white flowers, minimal leaf drop = cleanest for pool)
  // West: Watch Tower (20ft) provides afternoon structural shade
  {
    id: "st-pool-n1",
    x: 158,
    y: 558,
    species: "Jamun (Java Plum)",
    purpose:
      "Main canopy — water-loving, evergreen, 20ft spread. Purple fruit Jun-Aug. THE best poolside tree.",
    nearInfra: "inf-splash-tub",
  },
  {
    id: "st-pool-n2",
    x: 148,
    y: 558,
    species: "Kadamba",
    purpose:
      "Fast-growing shade — water-loving, fragrant orange ball flowers Jul-Sep. Sacred tree of water. Pairs with Jamun for N canopy wall.",
    nearInfra: "inf-splash-tub",
  },
  {
    id: "st-pool-s1",
    x: 165,
    y: 586,
    species: "Ashoka (Saraca indica)",
    purpose:
      "Columnar evergreen screen — spectacular orange-red flower clusters Feb-May. Buffer between pool and cottage row. Minimal leaf drop.",
    nearInfra: "inf-splash-tub",
  },
  {
    id: "st-pool-e1",
    x: 185,
    y: 574,
    species: "Bakul (Mimusops elengi)",
    purpose:
      "Dense evergreen shade at deep end — tiny fragrant white flowers nearly year-round (peak Mar-Jun). Cleanest leaf drop = best for pool water.",
    nearInfra: "inf-splash-tub",
  },

  // ─── Farm Pond — west bank stabilization ───
  {
    id: "st-pond-1",
    x: 532,
    y: 695,
    species: "Bamboo",
    purpose: "Bank stabilization",
    nearInfra: "water-pond",
  },
  {
    id: "st-pond-2",
    x: 532,
    y: 725,
    species: "Bamboo",
    purpose: "Bank stabilization",
    nearInfra: "water-pond",
  },
  {
    id: "st-pond-3",
    x: 532,
    y: 750,
    species: "Indian Willow",
    purpose: "Filtered shade on pond",
    nearInfra: "water-pond",
  },
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
  // NW Hub — Parking is open space (wide south entry), Cattle row enters from north (shared road)
  {
    id: "gate-parking-entry",
    infraId: "inf-parking",
    label: "Entry (tree-lined)",
    direction: "south",
    x: 50,
    y: 53,
    w: 40,
    h: 2,
  },
  {
    id: "gate-parking-exit",
    infraId: "inf-parking",
    label: "Exit (tree-lined)",
    direction: "north",
    x: 50,
    y: 25,
    w: 40,
    h: 2,
  },
  // Cycle Stand — open west side facing parking, walk-in from parking area
  {
    id: "gate-cycle-w",
    infraId: "inf-cycle-stand",
    label: "Cycle Pickup",
    direction: "west",
    x: 100,
    y: 28,
    w: 2,
    h: 8,
  },
  // Wash Bay — south entry from Shared Road (vehicles drive in from road)
  {
    id: "gate-wash-s",
    infraId: "inf-wash-bay",
    label: "Wash Entry",
    direction: "south",
    x: 104,
    y: 52,
    w: 10,
    h: 2,
  },
  {
    id: "gate-shed-n",
    infraId: "inf-shed",
    label: "Cattle Entry",
    direction: "north",
    x: 40,
    y: 68,
    w: 10,
    h: 2,
  },
  {
    id: "gate-compost-n",
    infraId: "inf-compost",
    label: "Composting Entry",
    direction: "north",
    x: 82,
    y: 68,
    w: 8,
    h: 2,
  },
  {
    id: "gate-biogas-n",
    infraId: "inf-biogas",
    label: "Biogas Entry",
    direction: "north",
    x: 114,
    y: 68,
    w: 6,
    h: 2,
  },
  {
    id: "gate-shed",
    infraId: "inf-shed",
    label: "Cattle Gate (East)",
    direction: "east",
    x: 66,
    y: 79,
    w: 2,
    h: 6,
  },
  {
    id: "gate-shed-s",
    infraId: "inf-shed",
    label: "Cattle (Nursery Road)",
    direction: "south",
    x: 35,
    y: 96,
    w: 15,
    h: 2,
  },
  {
    id: "gate-compost-s",
    infraId: "inf-compost",
    label: "Composting (Nursery Road)",
    direction: "south",
    x: 80,
    y: 96,
    w: 10,
    h: 2,
  },
  {
    id: "gate-nursery-n",
    infraId: "inf-nursery",
    label: "Nursery (Road)",
    direction: "north",
    x: 35,
    y: 111,
    w: 15,
    h: 2,
  },
  {
    id: "gate-nursery",
    infraId: "inf-nursery",
    label: "Nursery Gate",
    direction: "east",
    x: 70,
    y: 122,
    w: 2,
    h: 6,
  },
  // SW Hub — east-facing main gates + south/north gates for shared road access
  {
    id: "gate-house",
    infraId: "inf-house",
    label: "Farmhouse Main",
    direction: "east",
    x: 83,
    y: 601,
    w: 2,
    h: 8,
  },
  {
    id: "gate-house-s",
    infraId: "inf-house",
    label: "Farmhouse (Road)",
    direction: "south",
    x: 40,
    y: 625,
    w: 15,
    h: 2,
  },
  {
    id: "gate-store",
    infraId: "inf-store",
    label: "Store Loading",
    direction: "east",
    x: 130,
    y: 596,
    w: 2,
    h: 8,
  },
  {
    id: "gate-store-s",
    infraId: "inf-store",
    label: "Store (Road)",
    direction: "south",
    x: 100,
    y: 613,
    w: 15,
    h: 2,
  },
  {
    id: "gate-kitchen-n",
    infraId: "inf-kitchen-garden",
    label: "Kitchen Garden",
    direction: "north",
    x: 40,
    y: 640,
    w: 20,
    h: 2,
  },
  {
    id: "gate-kitchen-s",
    infraId: "inf-kitchen-garden",
    label: "Kitchen Garden (Road)",
    direction: "south",
    x: 40,
    y: 685,
    w: 20,
    h: 2,
  },
  {
    id: "gate-processing-n",
    infraId: "inf-processing",
    label: "Processing (Road)",
    direction: "north",
    x: 35,
    y: 700,
    w: 15,
    h: 2,
  },
  {
    id: "gate-processing",
    infraId: "inf-processing",
    label: "Processing Gate",
    direction: "east",
    x: 68,
    y: 711,
    w: 2,
    h: 6,
  },
];

// ── Access Paths (connecting structures to roads) ──
export interface AccessPath {
  id: string;
  label: string;
  points: [number, number][]; // [x,y] waypoints
  type: "direct" | "path";
}

export const ACCESS_PATHS: AccessPath[] = [
  // NW Hub — shared road centerline (y=60 = center of 10ft road y=55→65)
  {
    id: "path-nw-shared",
    label: "NW Hub Shared Road (from W Road)",
    points: [
      [22, 60],
      [140, 60],
    ],
    type: "path",
  },
  {
    id: "path-nw-cross",
    label: "NW Hub N-S Corridor",
    points: [
      [50, 22],
      [50, 143],
    ],
    type: "path",
  },
  // NW Hub Nursery Road — shared road centerline (y=103 = center of 10ft road y=98→108)
  {
    id: "path-nw-nursery-shared",
    label: "NW Hub Nursery Road (from W Road)",
    points: [
      [22, 103],
      [140, 103],
    ],
    type: "path",
  },
  {
    id: "path-gate-shed-s",
    label: "Cattle → Nursery Road",
    points: [
      [43, 96],
      [43, 103],
    ],
    type: "direct",
  },
  {
    id: "path-gate-nursery-n",
    label: "Nursery → Nursery Road",
    points: [
      [43, 111],
      [43, 103],
    ],
    type: "direct",
  },
  // SW Hub — shared road centerline (y=632 = center of 10ft road y=627→637)
  {
    id: "path-sw-shared",
    label: "SW Hub Shared Road (from W Road)",
    points: [
      [22, 632],
      [122, 632],
    ],
    type: "path",
  },
  {
    id: "path-sw-spine",
    label: "SW Compound Spine (N-S)",
    points: [
      [26, 580],
      [26, 765],
    ],
    type: "path",
  },
  // Gate access lines (short connectors from gate to nearest corridor)
  {
    id: "path-gate-house-s",
    label: "Farmhouse → Shared Road",
    points: [
      [48, 625],
      [48, 632],
    ],
    type: "direct",
  },
  {
    id: "path-gate-house",
    label: "Farmhouse Gate → East",
    points: [
      [85, 605],
      [130, 605],
    ],
    type: "path",
  },
  {
    id: "path-gate-store-s",
    label: "Store → Shared Road",
    points: [
      [108, 613],
      [108, 632],
    ],
    type: "direct",
  },
  {
    id: "path-gate-store",
    label: "Store Gate → East",
    points: [
      [132, 600],
      [155, 600],
    ],
    type: "path",
  },
  {
    id: "path-gate-kitchen-n",
    label: "Kitchen Garden → Shared Road",
    points: [
      [50, 640],
      [50, 632],
    ],
    type: "direct",
  },
  // SW Hub Processing Road — shared road centerline (y=692 = center of 10ft road y=687→697)
  {
    id: "path-sw-processing-shared",
    label: "SW Hub Processing Road (from W Road)",
    points: [
      [22, 692],
      [122, 692],
    ],
    type: "path",
  },
  {
    id: "path-gate-kitchen-s",
    label: "Kitchen Garden → Processing Road",
    points: [
      [50, 685],
      [50, 692],
    ],
    type: "direct",
  },
  {
    id: "path-gate-processing-n",
    label: "Processing → Processing Road",
    points: [
      [43, 700],
      [43, 692],
    ],
    type: "direct",
  },
  {
    id: "path-gate-processing",
    label: "Processing Gate → East",
    points: [
      [70, 714],
      [130, 714],
    ],
    type: "path",
  },
  {
    id: "path-gate-shed",
    label: "Cattle Gate → East",
    points: [
      [68, 82],
      [140, 82],
    ],
    type: "path",
  },
  // Cycle Stand — walk east from parking or south from North Road
  {
    id: "path-cycle-from-parking",
    label: "Parking → Cycle Stand",
    points: [
      [96, 35],
      [100, 35],
    ],
    type: "direct",
  },
  {
    id: "path-cycle-from-north",
    label: "North Road → Cycle Stand",
    points: [
      [108, 19],
      [108, 25],
    ],
    type: "direct",
  },
  // Wash Bay — drive in from Shared Road, turn north into wash bay
  {
    id: "path-wash-from-road",
    label: "Shared Road → Wash Bay",
    points: [
      [108, 60],
      [108, 52],
    ],
    type: "direct",
  },
  // Wash Bay grey water drain — east into Zone A tree basins
  {
    id: "path-wash-drain",
    label: "Wash Grey Water → Zone A",
    points: [
      [116, 46],
      [120, 46],
      [130, 46],
      [140, 46],
    ],
    type: "path",
  },
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
  {
    id: "lf-coconut",
    name: "Coconut",
    species: "Cocos nucifera (West Coast Tall / TxD Hybrid)",
    spacingFt: 25,
    color: "#8B6914",
    symbol: "CO",
    purpose: "Main structural fence, income from Year 5",
  },
  {
    id: "lf-teak",
    name: "Teak",
    species: "Tectona grandis (Nilambur / Godavari)",
    spacingFt: 15,
    color: "#704214",
    symbol: "TK",
    purpose: "Timber asset, windbreak, 15-20 year harvest",
  },
  {
    id: "lf-pepper",
    name: "Black Pepper",
    species: "Piper nigrum (Panniyur-1)",
    spacingFt: 0,
    color: "#2E7D32",
    symbol: "BP",
    purpose: "Climber on coconut trunks, high-value spice",
  },
  {
    id: "lf-bamboo",
    name: "Bamboo",
    species: "Bambusa vulgaris / Dendrocalamus strictus",
    spacingFt: 20,
    color: "#4A7C59",
    symbol: "BA",
    purpose: "Corner clusters, windbreak, construction material",
  },
  {
    id: "lf-subabul",
    name: "Subabul / Gliricidia",
    species: "Leucaena / Gliricidia sepium",
    spacingFt: 6,
    color: "#66BB6A",
    symbol: "SB",
    purpose: "Nitrogen-fixing, green manure, mulch, fast growing",
  },
  {
    id: "lf-moringa",
    name: "Moringa",
    species: "Moringa oleifera (PKM-1)",
    spacingFt: 10,
    color: "#52B788",
    symbol: "MO",
    purpose: "Nutritious leaves, pods, fast income",
  },
  {
    id: "lf-bayleaf",
    name: "Bay Leaf",
    species: "Cinnamomum tamala (Tejpatta)",
    spacingFt: 8,
    color: "#386641",
    symbol: "BY",
    purpose: "Spice leaves, aromatic, pest repellent",
  },
  {
    id: "lf-curryLeaf",
    name: "Curry Leaf",
    species: "Murraya koenigii (Gamthi)",
    spacingFt: 5,
    color: "#2D6A4F",
    symbol: "CL",
    purpose: "Daily kitchen use, commercial demand",
  },
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
    intercrops: [
      "Turmeric",
      "Ginger",
      "Chilli",
      "Okra (seasonal)",
      "Marigold (border)",
    ],
    expectedIncome: {
      year1: "₹4-5 Lakh",
      year5: "₹12-15 Lakh",
      year10: "₹15-18 Lakh",
    },
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
    intercrops: [
      "Millets (Jowar, Bajra)",
      "Pulses (Tur, Moong)",
      "Groundnut",
      "Vegetables (seasonal)",
    ],
    expectedIncome: {
      year1: "₹3-4 Lakh",
      year5: "₹10-12 Lakh",
      year10: "₹18-22 Lakh",
    },
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
    intercrops: [
      "Turmeric",
      "Ginger",
      "Black Pepper (climber)",
      "Pineapple (ground cover)",
      "Coffee (shade)",
    ],
    expectedIncome: {
      year1: "₹2-3 Lakh",
      year5: "₹8-10 Lakh",
      year10: "₹15-20 Lakh",
    },
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
    intercrops: [
      "Pineapple",
      "Sweet Potato",
      "Groundnut",
      "Drumstick (border)",
    ],
    expectedIncome: {
      year1: "₹1-2 Lakh",
      year5: "₹5-7 Lakh",
      year10: "₹12-18 Lakh (+ timber asset)",
    },
  },
];

// ── Flower Panel Species ──
export const FLOWER_SPECIES = [
  { name: "Marigold (Gainda)", season: "Kharif + Rabi", color: "#FFA000" },
  { name: "Rose (Desi Gulab)", season: "Year-round", color: "#E91E63" },
  { name: "Jasmine (Mogra)", season: "Summer + Monsoon", color: "#F5F5F5" },
  {
    name: "Tuberose (Rajnigandha)",
    season: "Monsoon + Winter",
    color: "#FFFDE7",
  },
  { name: "Crossandra", season: "Year-round", color: "#FF7043" },
  { name: "Chrysanthemum", season: "Winter", color: "#FFEB3B" },
  { name: "Aloe Vera", season: "Year-round (medicinal)", color: "#66BB6A" },
  {
    name: "Tulsi (Holy Basil)",
    season: "Year-round (medicinal)",
    color: "#43A047",
  },
  { name: "Lemongrass", season: "Year-round (aromatic)", color: "#9CCC65" },
];

// ── Generate Coconut Tree Positions Along Roads ──
export function getCoconutPositions(): {
  x: number;
  y: number;
  roadId: string;
}[] {
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
  const buffer = FARM.width * FARM.height - BUFFER_INNER.w * BUFFER_INNER.h;
  const peripheralRoads = 15 * 778 + 619 * 12 + 12 * 778 + 619 * 12; // W(15)+N(12)+E(12)+S(12)
  const flowerPanels = (301 + 300) * 3 * 2 + (368 + 368) * 3 * 2; // N+S panels (split) + W+E panels (split)
  const centralRoads = 12 * 754 + 12 * 619 - 12 * 12; // roads extend to peripherals, minus intersection overlap
  const infraArea = INFRASTRUCTURE.reduce((s, i) => s + i.w * i.h, 0);
  const waterArea = WATER_FEATURES.reduce((s, w) => s + w.w * w.h, 0);
  const productive =
    total -
    buffer -
    peripheralRoads -
    flowerPanels -
    centralRoads -
    infraArea -
    waterArea;

  const items: Omit<AreaItem, "percent">[] = [
    {
      label: "Productive Orchard",
      sqFt: productive,
      acres: productive / 43560,
      color: "#4CAF50",
    },
    {
      label: "Peripheral Roads",
      sqFt: peripheralRoads,
      acres: peripheralRoads / 43560,
      color: "#B8B8D1",
    },
    {
      label: "Internal Roads",
      sqFt: centralRoads,
      acres: centralRoads / 43560,
      color: "#C5C5D8",
    },
    {
      label: "Buffer / Live Fence",
      sqFt: buffer,
      acres: buffer / 43560,
      color: "#81C784",
    },
    {
      label: "Flower Panels",
      sqFt: flowerPanels,
      acres: flowerPanels / 43560,
      color: "#F9A8D4",
    },
    {
      label: "Infrastructure",
      sqFt: infraArea,
      acres: infraArea / 43560,
      color: "#FFCC80",
    },
    {
      label: "Water Features",
      sqFt: waterArea,
      acres: waterArea / 43560,
      color: "#4FC3F7",
    },
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
  {
    name: "Polyhouse / Greenhouse",
    size: "40×28 ft",
    location: "Near nursery, Zone A",
    benefit: "Seedling nursery, off-season high-value crops",
    priority: "Medium",
    estimatedCost: "₹2-3 Lakh",
  },
  {
    name: "Rooftop Solar (5KW)",
    size: "On farmhouse roof",
    location: "Farmhouse rooftop (SW peak)",
    benefit:
      "Powers bore pumps, lighting — saves ₹30K/yr electricity, no ground space needed",
    priority: "High",
    estimatedCost: "₹2.5-3.5 Lakh",
  },
  {
    name: "Rainwater Harvesting",
    size: "Network",
    location: "All roads channel → farm pond",
    benefit: "12 lakh liters/yr collection, reduces bore well dependency",
    priority: "High",
    estimatedCost: "₹50,000-1 Lakh",
  },
  {
    name: "Drip Irrigation System",
    size: "Full farm",
    location: "All zones",
    benefit: "50-60% water savings, precise fertigation",
    priority: "High",
    estimatedCost: "₹3-5 Lakh",
  },
  {
    name: "Biogas Plant",
    size: "18×18 ft",
    location: "Near cattle shed",
    benefit: "Cooking gas + slurry for fertilizer from cow dung",
    priority: "Medium",
    estimatedCost: "₹40,000-60,000",
  },
];

// ── Infrastructure Sizing Recommendations ──
export interface InfraRecommendation {
  name: string;
  recommendedSize: string;
  purpose: string;
  construction: string;
}

export const INFRA_RECOMMENDATIONS: InfraRecommendation[] = [
  {
    name: "Farmhouse",
    recommendedSize: "55×38 ft (2,090 sq ft)",
    purpose:
      "Residence with veranda, attached kitchen, 2BHK minimum for farm family",
    construction:
      "RCC/Brick, raised 2ft plinth, rainwater harvesting from roof, 5KW rooftop solar panels powering bore pumps & lighting",
  },
  {
    name: "Store / Godown",
    recommendedSize: "35×28 ft (980 sq ft)",
    purpose: "Fertilizer, seed, tool & harvest storage with ventilation",
    construction: "Sheet roofing, concrete floor, rat-proof, ventilated",
  },
  {
    name: "Cattle Shed",
    recommendedSize: "35×28 ft (980 sq ft)",
    purpose: "2-3 desi cows for Jeevamrut, milk, cow dung, urine",
    construction: "Open-sided with roof, sloped floor for drainage",
  },
  {
    name: "Kitchen Garden",
    recommendedSize: "60×48 ft (2,880 sq ft)",
    purpose: "Daily vegetables, herbs, medicinal plants for household + sale",
    construction: "Raised beds, drip irrigation, seasonal rotation",
  },
  {
    name: "Nursery",
    recommendedSize: "42×28 ft (1,176 sq ft)",
    purpose: "Seedling production, grafting, hardening area",
    construction: "Shade net structure, misting system, grow bags",
  },
  {
    name: "Farm Pond",
    recommendedSize: "85×65 ft (5,525 sq ft)",
    purpose: "Rainwater storage, fish culture, emergency irrigation",
    construction: "Lined pond, 8-10ft depth, silpaulin lining, inlet/outlet",
  },
  {
    name: "Parking",
    recommendedSize: "50×28 ft (1,400 sq ft)",
    purpose: "Tractor + 2-3 vehicles + loading/unloading area",
    construction: "Concrete/gravel, shade structure optional",
  },
  {
    name: "Composting Area",
    recommendedSize: "28×28 ft (784 sq ft)",
    purpose: "Jeevamrut tanks, Panchagavya prep, 3-pit compost system",
    construction: "Concrete pits, shade roof, water connection",
  },
  {
    name: "Bee Keeping",
    recommendedSize: "20×18 ft (360 sq ft)",
    purpose:
      "4-5 bee hive boxes for pollination boost + honey income (₹15-20K/yr)",
    construction: "Open platform with shade, near flower panels/zone boundary",
  },
  {
    name: "Mushroom Shed",
    recommendedSize: "25×18 ft (450 sq ft)",
    purpose: "Oyster/Shiitake mushroom cultivation, ₹30-50K/yr income",
    construction:
      "Enclosed shed, controlled humidity, shade net, near cattle shed",
  },
  {
    name: "Drying Yard",
    recommendedSize: "28×22 ft (616 sq ft)",
    purpose: "Solar drying for turmeric, ginger, chilli, and other produce",
    construction: "Concrete platform, raised edges, optional retractable shade",
  },
  {
    name: "Processing Unit",
    recommendedSize: "30×22 ft (660 sq ft)",
    purpose: "Value addition — pickle, jam, juice, pulp (2-3x farm-gate price)",
    construction:
      "Enclosed room, food-grade flooring, water + electricity, near store",
  },
  {
    name: "Watch Tower (Integrated)",
    recommendedSize: "16×16 ft (256 sq ft)",
    purpose:
      "Integrated: bore at base + 10,000L tank on 20ft platform + 360° observation walkway. Bore feeds swimming pool (east). NE of SW Hub for best visibility.",
    construction:
      "20ft galvanized steel frame, bore shaft at base, 10,000L Sintex tank on platform (~8ft dia), 4ft railing walkway. Pipe to pool east.",
  },
  {
    name: "Swimming Pool",
    recommendedSize: "30×14 ft (420 sq ft)",
    purpose:
      "Village-style lap pool (~9m length), bore-fed. Width constrained (cottage row 4ft south), length stretches east into open orchard. Overflow east → orchard trench. Natural tree shed canopy.",
    construction:
      "Cemented/tiled pool, 3ft shallow (west) → 5ft deep (east). Bore inlet west wall, overflow east wall. Tree canopy: Jamun + Kadamba (N), Ashoka (S), Bakul (E). Tower (W) afternoon shade.",
  },
  {
    name: "Cycle Stand",
    recommendedSize: "16×12 ft (192 sq ft)",
    purpose:
      "Covered cycle stand for orchard tours. 10-12 cycles for visitors to ride coconut avenues through all 4 zones.",
    construction:
      "Bamboo/steel frame, GI sheet roof, cycle rack rails, helmet hooks, tire pump station, route signboard",
  },
  {
    name: "Water Wash Bay",
    recommendedSize: "16×12 ft (192 sq ft)",
    purpose:
      "Water-only vehicle wash — no chemicals. Grey water channels to orchard plants via bio-filter.",
    construction:
      "Concrete platform (2% slope east), bore-water tap + hose, gravel bio-filter strip, open drain channel to Zone A tree basins, low brick splash walls (2ft)",
  },
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
  drainageStrategy:
    "Two-bore system: Domestic bore in Watch Tower base (NE of SW Hub, farmhouse use) → fills 10,000L tank on 20ft platform + feeds swimming pool (overflow → orchard trench). Irrigation bore at central intersection pumps UP to tower tank → gravity-fed drip to all zones. Contour trenches N-S slow E-ward runoff.",
  erosionControl: "Dense live fence on East, percolation pits, farm pond at SE",
};

// ── Boundary Cross-Section (Trench & Berm System) ──
// Outside → Inside: 1ft gap + 3ft trench + 3ft raised bed + 1ft dense plants + 12ft road
export interface BoundaryCrossSectionLayer {
  id: string;
  label: string;
  widthFt: number;
  depthFt?: number; // below ground (trench)
  heightFt?: number; // above ground (berm/bed)
  color: string;
  description: string;
}

export const BOUNDARY_CROSS_SECTION: BoundaryCrossSectionLayer[] = [
  {
    id: "bcs-gap",
    label: "Outer Gap",
    widthFt: 1,
    color: "#D7CCC8",
    description:
      "1 ft setback from property boundary line. Kept clear for access and legal clearance.",
  },
  {
    id: "bcs-trench",
    label: "Trench",
    widthFt: 3,
    depthFt: 3,
    color: "#8D6E63",
    description:
      "3 ft wide × 3 ft deep trench. Excavated soil placed on inner side to form raised bed. Outer slope creates ~6 ft effective barrier (3 ft below + 3 ft above ground). Trench collects rainwater runoff and channels it along the boundary.",
  },
  {
    id: "bcs-bed",
    label: "Raised Bed / Berm",
    widthFt: 3,
    heightFt: 3,
    color: "#A1887F",
    description:
      "3 ft wide × 3 ft high raised bed formed from excavated trench soil. Compacted and shaped into a berm. Provides elevation for boundary planting and creates a physical barrier. Slope on trench side is steep (~6 ft drop from top of bed to trench bottom).",
  },
  {
    id: "bcs-plants",
    label: "Dense Boundary Plants",
    widthFt: 1,
    heightFt: 3,
    color: "#4CAF50",
    description:
      "1 ft planting strip on top of the raised bed. Dense planting every 1.5 ft with fast-growing species (Subabul, Gliricidia, Agave, Curry Leaf). Forms an impenetrable living wall within 1-2 years.",
  },
  {
    id: "bcs-road",
    label: "Peripheral Road",
    widthFt: 12,
    color: "#B8B8D1",
    description:
      "12 ft (or 15 ft on west) peripheral service road with coconut avenue on both sides. Already part of the farm internal layout.",
  },
];

// ── Boundary Dense Planting Species ──
export interface BoundaryPlant {
  id: string;
  name: string;
  species: string;
  spacingFt: number;
  growthRate: string;
  maxHeightFt: number;
  color: string;
  purpose: string;
}

export const BOUNDARY_PLANTS: BoundaryPlant[] = [
  {
    id: "bp-subabul",
    name: "Subabul",
    species: "Leucaena leucocephala",
    spacingFt: 1.5,
    growthRate: "Very fast (8-10 ft/yr)",
    maxHeightFt: 25,
    color: "#66BB6A",
    purpose: "Dense hedge, nitrogen-fixing, green manure, firewood",
  },
  {
    id: "bp-gliricidia",
    name: "Gliricidia",
    species: "Gliricidia sepium",
    spacingFt: 1.5,
    growthRate: "Fast (6-8 ft/yr)",
    maxHeightFt: 15,
    color: "#81C784",
    purpose: "Living fence post, nitrogen-fixing, mulch, pest repellent",
  },
  {
    id: "bp-agave",
    name: "Agave / Sisal",
    species: "Agave sisalana",
    spacingFt: 2,
    growthRate: "Medium (rosette, 3-4 ft/yr)",
    maxHeightFt: 5,
    color: "#AED581",
    purpose: "Thorny barrier at base, erosion control, fibre",
  },
  {
    id: "bp-curry",
    name: "Curry Leaf",
    species: "Murraya koenigii (Gamthi)",
    spacingFt: 1.5,
    growthRate: "Medium (3-4 ft/yr)",
    maxHeightFt: 12,
    color: "#2D6A4F",
    purpose: "Dense aromatic hedge, daily kitchen use, commercial value",
  },
  {
    id: "bp-pineapple",
    name: "Pineapple",
    species: "Ananas comosus",
    spacingFt: 1,
    growthRate: "Slow (ground cover)",
    maxHeightFt: 3,
    color: "#FFB300",
    purpose: "Thorny ground cover at base of trench berm, fruit income",
  },
  {
    id: "bp-vetiver",
    name: "Vetiver Grass",
    species: "Chrysopogon zizanioides",
    spacingFt: 0.5,
    growthRate: "Fast (clump grass)",
    maxHeightFt: 5,
    color: "#9CCC65",
    purpose: "Soil binding on trench slopes, erosion control, aromatic roots",
  },
];

// ── Boundary Construction Steps ──
export const BOUNDARY_CONSTRUCTION_STEPS: string[] = [
  "Mark property boundary line with survey pegs. Leave 1 ft gap from boundary.",
  "Dig trench: 3 ft wide × 3 ft deep along entire perimeter. Use JCB for long stretches.",
  "Place all excavated soil on the inner side (farm side) of the trench to form a 3 ft high raised bed/berm.",
  "Compact the berm in 6-inch lifts using hand tamper or roller. Shape top flat (1 ft wide planting surface).",
  "Line trench outer wall with stones or rubble (optional) for stability on steep slope.",
  "Plant Vetiver grass on both trench slopes for immediate soil binding.",
  "Plant dense boundary row on top of berm: Subabul + Gliricidia alternating every 1.5 ft.",
  "Plant Pineapple + Agave at base of inner slope (road side) as thorny ground cover.",
  "Plant Curry Leaf at every 5th position for aromatic hedge + income.",
  "Mulch entire berm surface with dry leaves / straw (6-inch layer) to prevent erosion until plants establish.",
  "Within 6-12 months, Subabul + Gliricidia form dense canopy. Prune to 6-8 ft height for hedge shape.",
  "Trench naturally collects rainwater — channels along boundary to farm pond at SE corner.",
];
