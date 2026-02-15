// ================================================================
// Infrastructure Detail Data — Per-Building Deep Specs
// ================================================================
// Each infrastructure item gets: floor plan, construction,
// access road, surrounding trees, and utilization details.
// ================================================================

// ── Interfaces ──

export interface RoomSpec {
  name: string;
  sizeFt: string; // "12x14"
  purpose: string;
}

export interface InfraFloor {
  name: string; // "Ground Floor", "1st Floor", "Terrace"
  rooms: RoomSpec[];
  totalAreaSqFt: number;
}

export interface AccessRoadInfo {
  fromGate: string; // step-by-step directions from NW gate
  roadWidthFt: number;
  distanceFromGateFt: number;
  surfaceType: string;
  svgPathPoints: [number, number][]; // waypoints for mini-map highlight
}

export interface TreeRing {
  direction: string; // "North", "East", "South-East"
  species: string;
  canopyRadiusFt: number;
  distanceFromWallFt: number;
  purpose: string;
}

export interface InfraDetail {
  id: string; // matches INFRASTRUCTURE[].id
  hub: "NW" | "SW" | "Field"; // which cluster
  headline: string;
  constructionType: string;
  materialNotes: string;
  floors: InfraFloor[];
  accessRoad: AccessRoadInfo;
  surroundingTrees: TreeRing[];
  utilization: string[];
  estimatedCost?: string;
  timelineToBuild?: string;
  expansionNotes?: string;
}

// ── Helper to compute viewBox around an infra item ──
export function computeInfraViewBox(
  ix: number,
  iy: number,
  iw: number,
  ih: number,
  padding = 60,
): string {
  const x = ix - padding;
  const y = iy - padding;
  const w = iw + padding * 2;
  const h = ih + padding * 2;
  return `${x} ${y} ${w} ${h}`;
}

// ================================================================
// Detailed Data for All Infrastructure Items
// ================================================================

export const INFRA_DETAILS: InfraDetail[] = [
  // ─────────────────────────────────────────────────
  // NW HUB — Farm Operations (near gate)
  // ─────────────────────────────────────────────────

  {
    id: "inf-guard",
    hub: "NW",
    headline: "Guard / Entry Cabin — Security Checkpoint",
    constructionType: "Lightweight prefab cabin with steel frame",
    materialNotes:
      "Prefabricated steel + sandwich panel walls. Quick to install, movable. No foundation needed beyond a concrete pad. Weather-resistant panels with insulated roof.",
    floors: [
      {
        name: "Ground Floor",
        totalAreaSqFt: 120,
        rooms: [
          { name: "Guard Room", sizeFt: "8x10", purpose: "Security desk, visitor log, CCTV monitor" },
          { name: "Washroom", sizeFt: "4x5", purpose: "Attached toilet for guard on duty" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "Directly at NW Gate — first structure upon entry",
      roadWidthFt: 15,
      distanceFromGateFt: 5,
      surfaceType: "Concrete pad",
      svgPathPoints: [[7, 7], [28, 25]],
    },
    surroundingTrees: [
      { direction: "East", species: "Neem", canopyRadiusFt: 12, distanceFromWallFt: 8, purpose: "Shade for guard cabin + pest repellent" },
    ],
    utilization: [
      "24/7 security checkpoint for farm entry",
      "Visitor registration and vehicle log",
      "CCTV monitoring station (optional)",
      "Key storage for all farm buildings",
      "Communication hub (intercom / phone)",
    ],
    estimatedCost: "₹50,000 - 80,000",
    timelineToBuild: "3-5 days (prefab)",
  },

  {
    id: "inf-parking",
    hub: "NW",
    headline: "Parking Area — Tree-Lined Natural-Shade Parking (No Fruit / No Sticky Pods)",
    constructionType: "Gravel surface with full tree ring (1 Pongamia + 1 Arjun + 5 Neem) on all 4 sides",
    materialNotes:
      "Compacted murram/gravel base (6 inch), no concrete. 7 clean-canopy shade trees on all 4 sides at ~20ft spacing — NO fruit trees, NO sticky-pod trees (Rain Tree avoided). Vehicles pass freely through 20ft gaps. Pongamia for fast dense shade + biodiesel seeds, Arjun for tall clean canopy + medicinal bark, Neem for evergreen pest-repellent shade. Permeable gravel for rainwater percolation.",
    floors: [
      {
        name: "Ground Level",
        totalAreaSqFt: 1400,
        rooms: [
          { name: "South Entry (tree-lined)", sizeFt: "50x28", purpose: "Multiple 20ft gaps between Neem trees — vehicles enter from Shared Road between trees" },
          { name: "North Exit (tree-lined)", sizeFt: "50x28", purpose: "Multiple 20ft gaps between Neem trees — vehicles exit north to North Road between trees" },
          { name: "Tractor Bay", sizeFt: "15x20", purpose: "Dedicated tractor + trailer parking" },
          { name: "Vehicle Slots (3-4)", sizeFt: "35x20", purpose: "Cars, bikes, delivery vehicles" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road south → Turn east into Shared Road → Enter parking through 20ft gaps between south-side Neem trees. Exit: drive north through 20ft gaps between north-side Neem trees → North Road → west back to Gate.",
      roadWidthFt: 10,
      distanceFromGateFt: 50,
      surfaceType: "Gravel / Murram",
      svgPathPoints: [[7, 7], [14, 7], [14, 59], [66, 59], [66, 54]],
    },
    surroundingTrees: [
      { direction: "NW Corner", species: "Pongamia / Karanj (Millettia pinnata)", canopyRadiusFt: 18, distanceFromWallFt: 3, purpose: "Between guard cabin & parking — fast dense evergreen canopy (15-20ft) in 3-4 yrs. No mess on vehicles. Nitrogen-fixing (improves soil). Seeds → biodiesel oil for farm equipment." },
      { direction: "North", species: "Neem (×2 at 20ft spacing)", canopyRadiusFt: 12, distanceFromWallFt: 5, purpose: "Evergreen shade on north side. 20ft gaps between trees for vehicle exit. Long-term 25ft canopy + pest repellent." },
      { direction: "East (upper)", species: "Arjun (Terminalia arjuna)", canopyRadiusFt: 20, distanceFromWallFt: 10, purpose: "Tall clean canopy (20ft), zero mess on parked vehicles. Medicinal bark — high value in Ayurveda (heart tonic). Fast shade in 3-4 yrs." },
      { direction: "East (lower)", species: "Neem", canopyRadiusFt: 12, distanceFromWallFt: 10, purpose: "Evergreen pest repellent, shades SE parking. 15ft south of Arjun." },
      { direction: "South", species: "Neem (×2 at 20ft spacing)", canopyRadiusFt: 12, distanceFromWallFt: 2, purpose: "At road boundary. 20ft gaps between trees for vehicle entry from Shared Road." },
    ],
    utilization: [
      "Full tree ring on all 4 sides — natural shade, NO fruit / NO sticky pods on vehicles",
      "20ft gaps between trees on N/S — any vehicle (car, tractor, 2-wheeler) enters/exits freely",
      "Pongamia NW corner: fast dense canopy covers guard cabin + west parking in 3-4 yrs, seeds for biodiesel",
      "Arjun east: tall clean shade, medicinal bark (Ayurveda heart tonic, high market value)",
      "5× Neem all around: evergreen pest repellent, insect-free parking, long-term 25ft canopy",
      "Tractor + trailer dedicated bay",
      "3-4 vehicle slots for visitors and workers",
      "Exit loop: north through tree gaps → North Road → west back to Gate",
    ],
    estimatedCost: "₹35,000 - 60,000 (gravel leveling + 7 trees)",
    timelineToBuild: "2-3 days (gravel), trees planted in monsoon for best growth",
    expansionNotes: "Pongamia + Arjun reach good shade in 3-4 yrs; Neem fills in 4-5 yrs. All evergreen/clean — year-round natural shade from all directions without any mess on vehicles. Can extend south into Zone A if more parking needed.",
  },

  {
    id: "inf-shed",
    hub: "NW",
    headline: "Cattle / Tool Shed — Dual-Purpose Farm Shed",
    constructionType: "Open-sided steel frame with sheet roofing",
    materialNotes:
      "Galvanized steel tubular frame, CGI (corrugated galvanized iron) roof sheets. Open on 3 sides for ventilation (essential for cattle health). Sloped concrete floor with drainage channel for urine collection. Eastern wall is mesh/wire for security while allowing breeze.",
    floors: [
      {
        name: "Ground Floor",
        totalAreaSqFt: 1064,
        rooms: [
          { name: "Cattle Area", sizeFt: "20x28", purpose: "2-3 desi cows — feeding trough, water trough, tie-up posts" },
          { name: "Tool Storage", sizeFt: "18x20", purpose: "Farm tools, sprayers, nets, rope, spare parts" },
          { name: "Feed Store", sizeFt: "10x10", purpose: "Dry fodder, concentrate feed storage" },
          { name: "Dung Collection", sizeFt: "8x8", purpose: "Covered pit for cow dung before composting / biogas" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road south → Turn east into NW Hub Shared Road (12ft) → Cattle Shed (North side, directly off Shared Road)",
      roadWidthFt: 12,
      distanceFromGateFt: 60,
      surfaceType: "Concrete apron at gate, murram path",
      svgPathPoints: [[7, 7], [14, 7], [14, 59], [48, 59], [48, 65]],
    },
    surroundingTrees: [
      { direction: "East", species: "Neem", canopyRadiusFt: 12, distanceFromWallFt: 8, purpose: "Insect repellent + shade for cattle during afternoon" },
      { direction: "South", species: "Gulmohar", canopyRadiusFt: 15, distanceFromWallFt: 10, purpose: "Filtered light, ornamental" },
    ],
    utilization: [
      "House 2-3 desi cows for Jeevamrut, Panchagavya raw material",
      "Cow dung → Biogas plant + Composting",
      "Cow urine → Jeevamrut preparation",
      "Tool storage for all farm implements",
      "Dry fodder and feed storage (separate bay)",
      "Cattle gate opens East into grazing area",
    ],
    estimatedCost: "₹2.5 - 3.5 Lakh",
    timelineToBuild: "2-3 weeks",
    expansionNotes: "Can extend south by 10-15ft for additional cattle bays",
  },

  {
    id: "inf-compost",
    hub: "NW",
    headline: "Composting Area — Jeevamrut & Panchagavya Prep",
    constructionType: "Concrete pits with shade roof",
    materialNotes:
      "Three concrete-lined pits (6ft x 6ft x 4ft each) for different composting stages. Cement plastered interior prevents leaching. Sheet roof on steel poles for rain protection. Water connection for Jeevamrut mixing.",
    floors: [
      {
        name: "Ground Level",
        totalAreaSqFt: 784,
        rooms: [
          { name: "Compost Pit 1", sizeFt: "8x8", purpose: "Fresh waste — Stage 1 decomposition (0-30 days)" },
          { name: "Compost Pit 2", sizeFt: "8x8", purpose: "Turning pit — Stage 2 decomposition (30-60 days)" },
          { name: "Compost Pit 3", sizeFt: "8x8", purpose: "Mature compost — Ready to use (60-90 days)" },
          { name: "Jeevamrut Tank", sizeFt: "6x6", purpose: "200L drum setup for Jeevamrut fermentation" },
          { name: "Panchagavya Area", sizeFt: "6x6", purpose: "Mixing and fermentation station" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road south → NW Hub Shared Road east → Composting (North side, off Shared Road, next to Cattle Shed)",
      roadWidthFt: 12,
      distanceFromGateFt: 75,
      surfaceType: "Concrete path (for wheelbarrow access)",
      svgPathPoints: [[7, 7], [14, 7], [14, 59], [87, 59], [87, 65]],
    },
    surroundingTrees: [
      { direction: "South", species: "Neem", canopyRadiusFt: 12, distanceFromWallFt: 10, purpose: "Pest control + shade over compost area" },
    ],
    utilization: [
      "3-pit composting system (30-60-90 day cycle)",
      "Jeevamrut preparation (200L batches every 15 days)",
      "Panchagavya fermentation station",
      "Organic manure production from cattle shed waste",
      "Weed and crop residue decomposition",
      "Liquid fertilizer mixing and storage",
    ],
    estimatedCost: "₹60,000 - 1 Lakh",
    timelineToBuild: "1-2 weeks",
    expansionNotes: "Can add 4th pit by extending east. Jeevamrut tank scalable with more drums.",
  },

  {
    id: "inf-biogas",
    hub: "NW",
    headline: "Biogas Plant — 2 Cubic Meter Digester",
    constructionType: "KVIC floating drum model (brick + concrete)",
    materialNotes:
      "Standard KVIC floating drum biogas plant. Underground brick masonry digester with concrete dome. Mild steel gas holder (floating drum). Low maintenance, 15-20 year lifespan. Government subsidy available (up to 50%).",
    floors: [
      {
        name: "Ground Level + Underground",
        totalAreaSqFt: 324,
        rooms: [
          { name: "Digester (underground)", sizeFt: "8x8", purpose: "2 cubic meter anaerobic digestion chamber" },
          { name: "Inlet Chamber", sizeFt: "4x4", purpose: "Cow dung + water mixing and feeding" },
          { name: "Outlet / Slurry Pit", sizeFt: "6x6", purpose: "Digested slurry collection for fertilizer use" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road south → NW Hub Shared Road east → Past Composting → Biogas (North side, end of Shared Road)",
      roadWidthFt: 12,
      distanceFromGateFt: 110,
      surfaceType: "Murram path",
      svgPathPoints: [[7, 7], [14, 7], [14, 59], [117, 59], [117, 65]],
    },
    surroundingTrees: [
      { direction: "South", species: "Neem", canopyRadiusFt: 10, distanceFromWallFt: 12, purpose: "Keep area pest-free, some shade" },
    ],
    utilization: [
      "Cooking gas for farmhouse kitchen (2-3 hrs/day)",
      "Digested slurry as organic liquid fertilizer",
      "Reduces dependence on LPG cylinders",
      "Processes cow dung from cattle shed (50-60 kg/day)",
      "Slurry piped to composting area for enrichment",
    ],
    estimatedCost: "₹40,000 - 60,000 (after subsidy)",
    timelineToBuild: "1-2 weeks",
  },

  {
    id: "inf-nursery",
    hub: "NW",
    headline: "Nursery — Seedling & Grafting Unit",
    constructionType: "Shade net structure on GI pipe frame",
    materialNotes:
      "50% shade net on galvanized iron (GI) pipe frame. Easy to erect and replace. Misting system for humidity control. Raised benches (2.5ft height) for grow bags. No concrete foundation — GI pipes anchored in ground. Gulmohar / Semal trees provide additional filtered light from south.",
    floors: [
      {
        name: "Ground Level",
        totalAreaSqFt: 1176,
        rooms: [
          { name: "Seedling Beds", sizeFt: "24x20", purpose: "Raised tables with grow bags — vegetable & fruit seedlings" },
          { name: "Grafting Area", sizeFt: "12x14", purpose: "Workbench for grafting, budding, air-layering" },
          { name: "Hardening Zone", sizeFt: "14x14", purpose: "Transition area — seedlings acclimatize before field planting" },
          { name: "Input Store", sizeFt: "8x8", purpose: "Cocopeat, vermiculite, poly bags, tools" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road south → NW Hub Shared Road → South past Cattle row → Nursery gate (East side)",
      roadWidthFt: 8,
      distanceFromGateFt: 100,
      surfaceType: "Murram / gravel path",
      svgPathPoints: [[7, 7], [14, 7], [14, 59], [50, 59], [50, 112], [28, 112]],
    },
    surroundingTrees: [
      { direction: "South", species: "Gulmohar", canopyRadiusFt: 15, distanceFromWallFt: 10, purpose: "Filtered light for nursery, not dense shade" },
      { direction: "South", species: "Neem", canopyRadiusFt: 12, distanceFromWallFt: 15, purpose: "South perimeter shade" },
      { direction: "East", species: "Semal (Silk Cotton)", canopyRadiusFt: 12, distanceFromWallFt: 10, purpose: "Light deciduous canopy, allows winter sun" },
    ],
    utilization: [
      "Year-round seedling production for all zones",
      "Grafting and budding operations (mango, citrus, etc.)",
      "Hardening zone for transplant-ready seedlings",
      "Sale of surplus seedlings (additional income)",
      "Medicinal herb propagation",
      "Experimental variety testing",
    ],
    estimatedCost: "₹1.5 - 2.5 Lakh (shade net + misting)",
    timelineToBuild: "1-2 weeks",
    expansionNotes: "Gate opens East — can expand eastward into Zone A. Polyhouse (addon) proposed adjacent east.",
  },

  {
    id: "inf-vermi",
    hub: "NW",
    headline: "Vermicompost Unit — 4-Bed System",
    constructionType: "Brick beds with shade roof",
    materialNotes:
      "Four brick-lined beds (each 6ft x 4ft x 2ft) under permanent shade roof. Beds elevated 1ft on brick base to prevent waterlogging. Coconut husk bedding for earthworms. Simple water sprinkler for moisture.",
    floors: [
      {
        name: "Ground Level",
        totalAreaSqFt: 500,
        rooms: [
          { name: "Vermi Bed 1", sizeFt: "6x4", purpose: "Active composting bed — fresh cow dung + kitchen waste" },
          { name: "Vermi Bed 2", sizeFt: "6x4", purpose: "Maturing bed — 30-45 days in" },
          { name: "Vermi Bed 3", sizeFt: "6x4", purpose: "Harvest-ready bed — sieved vermicompost" },
          { name: "Vermi Bed 4", sizeFt: "6x4", purpose: "Worm breeding bed — backup stock" },
          { name: "Sieving & Packing", sizeFt: "8x6", purpose: "Sieving, drying, and packing station" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road → NW Hub Shared Road → South past Cattle row → Vermicompost (east of nursery)",
      roadWidthFt: 8,
      distanceFromGateFt: 105,
      surfaceType: "Murram path",
      svgPathPoints: [[7, 7], [14, 7], [14, 59], [90, 59], [90, 111]],
    },
    surroundingTrees: [
      { direction: "South", species: "Neem", canopyRadiusFt: 12, distanceFromWallFt: 10, purpose: "Shade essential for vermicompost beds" },
    ],
    utilization: [
      "Produce 200-300 kg vermicompost per month",
      "Convert cow dung + kitchen waste into rich fertilizer",
      "Worm castings for seedling potting mix",
      "Vermiwash liquid fertilizer collection",
      "Surplus vermicompost for sale (₹10-15/kg)",
    ],
    estimatedCost: "₹30,000 - 50,000",
    timelineToBuild: "1 week",
    expansionNotes: "Can add 2 more beds by extending south",
  },

  {
    id: "inf-mushroom",
    hub: "NW",
    headline: "Mushroom Shed — Oyster & Shiitake Cultivation",
    constructionType: "Enclosed shed with controlled environment",
    materialNotes:
      "Brick walls with ventilation openings (covered with mesh). CGI sheet roof with insulation layer. Interior kept dark and humid. Shade net over exterior reduces heat. Positioned near cattle shed for easy access to pasteurized straw substrate.",
    floors: [
      {
        name: "Ground Floor",
        totalAreaSqFt: 500,
        rooms: [
          { name: "Growing Chamber", sizeFt: "18x14", purpose: "Hanging bag racks — 4 tiers, 200+ bags capacity" },
          { name: "Substrate Prep", sizeFt: "8x8", purpose: "Straw soaking, pasteurization, bag filling" },
          { name: "Spawn Store", sizeFt: "6x5", purpose: "Cool storage for mushroom spawn bottles" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road → NW Hub Shared Road → South past Biogas → Mushroom Shed (east end of NW Hub)",
      roadWidthFt: 8,
      distanceFromGateFt: 120,
      surfaceType: "Murram path",
      svgPathPoints: [[7, 7], [14, 7], [14, 59], [122, 59], [122, 111]],
    },
    surroundingTrees: [
      { direction: "East", species: "Pongamia", canopyRadiusFt: 12, distanceFromWallFt: 10, purpose: "Dense shade essential for keeping shed cool" },
      { direction: "South", species: "Semal", canopyRadiusFt: 12, distanceFromWallFt: 10, purpose: "South perimeter shade" },
    ],
    utilization: [
      "Oyster mushroom cultivation (primary crop)",
      "Shiitake mushroom (secondary, higher value)",
      "3-4 harvest cycles per year",
      "Expected income: ₹30,000 - 50,000/yr",
      "Spent substrate recycled to composting area",
      "Low labor — 1-2 hours/day management",
    ],
    estimatedCost: "₹60,000 - 1 Lakh",
    timelineToBuild: "2 weeks",
    expansionNotes: "Can add second growing chamber east if demand grows",
  },

  {
    id: "inf-beehive",
    hub: "Field",
    headline: "Bee Keeping Station — Pollination & Honey",
    constructionType: "Open platform with shade structure",
    materialNotes:
      "Raised wooden platform (2ft height) for 4-5 Langstroth bee hive boxes. Simple bamboo + shade net roof to protect from rain and direct afternoon sun. Near flower panels and zone boundary for maximum pollen access. No permanent construction needed.",
    floors: [
      {
        name: "Platform",
        totalAreaSqFt: 360,
        rooms: [
          { name: "Hive Platform", sizeFt: "14x12", purpose: "4-5 bee hive boxes with landing boards facing east" },
          { name: "Extraction Area", sizeFt: "8x8", purpose: "Honey extraction and processing when needed" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → Main Road south → Central E-W Road east → Near Zone A/C boundary",
      roadWidthFt: 12,
      distanceFromGateFt: 380,
      surfaceType: "Farm path (no paving needed)",
      svgPathPoints: [[7, 7], [14, 7], [14, 390], [280, 390], [280, 365]],
    },
    surroundingTrees: [
      { direction: "West", species: "Moringa", canopyRadiusFt: 8, distanceFromWallFt: 15, purpose: "Light shade, bees like moringa flowers" },
    ],
    utilization: [
      "4-5 bee hives for cross-pollination across all zones",
      "Increases fruit set by 30-50% in orchard",
      "Honey production: 8-10 kg per hive per year",
      "Expected income: ₹15,000 - 20,000/yr",
      "Beeswax as byproduct",
      "Educational and agro-tourism attraction",
    ],
    estimatedCost: "₹15,000 - 25,000 (hives + platform)",
    timelineToBuild: "2-3 days",
  },

  // ─────────────────────────────────────────────────
  // SW HUB — Residential + Processing (peak elevation)
  // ─────────────────────────────────────────────────

  {
    id: "inf-house",
    hub: "SW",
    headline: "Farmhouse — Lightweight 2-Story Residence",
    constructionType: "Lightweight steel frame + AAC blocks (not RCC concrete)",
    materialNotes:
      "Light gauge steel frame (LGSF) structure with AAC (Autoclaved Aerated Concrete) block infill. 40-50% lighter than conventional RCC. Faster to build (6-8 weeks vs 4-6 months). Better insulation than brick. Earthquake resistant. 2ft raised plinth on stone foundation. Sloped metal roof (Colorbond) for rainwater harvesting. Entire roof supports 5KW solar panels.",
    floors: [
      {
        name: "Ground Floor",
        totalAreaSqFt: 1100,
        rooms: [
          { name: "Living Room", sizeFt: "16x14", purpose: "Main living area with east-facing windows for morning light" },
          { name: "Bedroom 1 (Master)", sizeFt: "14x12", purpose: "Master bedroom with attached bathroom, faces east (orchard view)" },
          { name: "Bedroom 2", sizeFt: "12x10", purpose: "Guest / family bedroom, faces south" },
          { name: "Kitchen + Dining", sizeFt: "14x12", purpose: "Open kitchen with dining. Connected to biogas line. West-facing for ventilation" },
          { name: "Bathroom (Common)", sizeFt: "8x6", purpose: "Common bath near bedrooms" },
          { name: "Veranda (East)", sizeFt: "20x6", purpose: "East-facing sit-out overlooking orchard, morning chai spot" },
          { name: "Utility / Store", sizeFt: "8x6", purpose: "Washing area, water pump controls, electrical panel" },
        ],
      },
      {
        name: "1st Floor",
        totalAreaSqFt: 800,
        rooms: [
          { name: "Bedroom 3", sizeFt: "14x12", purpose: "Upper floor bedroom, breeze from all sides" },
          { name: "Study / Office", sizeFt: "12x10", purpose: "Farm office — records, planning, computer, CCTV monitor" },
          { name: "Store Room", sizeFt: "10x8", purpose: "Seasonal storage, documents, valuables" },
          { name: "Bathroom", sizeFt: "6x6", purpose: "Upper floor bathroom" },
          { name: "Balcony (East)", sizeFt: "14x5", purpose: "East-facing balcony — full orchard view, sunset view west" },
        ],
      },
      {
        name: "2nd Floor / Terrace",
        totalAreaSqFt: 900,
        rooms: [
          { name: "Solar Panel Area", sizeFt: "24x16", purpose: "5KW rooftop solar panels (10-12 panels @ 400W each)" },
          { name: "Rainwater Catchment", sizeFt: "Full roof", purpose: "Entire roof drains to storage tank via gutters" },
          { name: "Open Terrace", sizeFt: "16x12", purpose: "Open area for drying, relaxation, 360-degree farm view" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road (15ft) south ~580ft → Turn east into SW Hub Shared Road (10ft) → Farmhouse south gate. Main gate: East side (morning sun, orchard view).",
      roadWidthFt: 10,
      distanceFromGateFt: 580,
      surfaceType: "Compacted murram (main road), concrete apron at farmhouse",
      svgPathPoints: [[7, 7], [14, 7], [14, 632], [48, 632], [48, 625]],
    },
    surroundingTrees: [
      { direction: "North", species: "Mango", canopyRadiusFt: 20, distanceFromWallFt: 12, purpose: "Shade + fruit, blocks summer afternoon heat from north" },
      { direction: "North", species: "Tamarind", canopyRadiusFt: 25, distanceFromWallFt: 15, purpose: "Large canopy shade, iconic farm tree" },
      { direction: "East", species: "Neem", canopyRadiusFt: 12, distanceFromWallFt: 10, purpose: "Pest repellent near living quarters" },
      { direction: "South-West", species: "Curry Leaf", canopyRadiusFt: 6, distanceFromWallFt: 5, purpose: "Kitchen herb access, fragrant" },
    ],
    utilization: [
      "Primary farm residence for farm family",
      "Ground floor: 2 bedrooms + kitchen + living (daily use)",
      "1st floor: Guest bedroom + study/office + storage",
      "Terrace: 5KW solar powers bore pumps + lighting + fan",
      "Rainwater harvesting from entire roof to storage tank",
      "East veranda for relaxation with orchard view",
      "Farm office for records, planning, CCTV monitoring",
    ],
    estimatedCost: "₹18 - 25 Lakh (LGSF + AAC, fully finished)",
    timelineToBuild: "6-8 weeks (lightweight construction)",
    expansionNotes: "Can extend north into open orchard. 1st floor can add one more room if needed. Western side has road access as secondary entry.",
  },

  {
    id: "inf-store",
    hub: "SW",
    headline: "Store / Godown — Harvest & Tool Storage",
    constructionType: "Steel frame with sheet roofing, concrete floor",
    materialNotes:
      "Galvanized steel frame, CGI sheet roofing. Concrete floor (rat-proof) with 6-inch plinth. Ventilation openings on all walls with wire mesh (airflow + rodent protection). Rolling shutter gate on east side for vehicle loading. Internal partitions with angle iron + wire mesh.",
    floors: [
      {
        name: "Ground Floor",
        totalAreaSqFt: 980,
        rooms: [
          { name: "Harvest Bay", sizeFt: "15x18", purpose: "Fresh harvest temporary storage before processing or sale" },
          { name: "Tool Storage", sizeFt: "10x14", purpose: "Farm implements, sprayers, nets, ropes, spare parts" },
          { name: "Fertilizer / Input Store", sizeFt: "10x14", purpose: "Bio-inputs, seeds, organic manure bags" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road south → Turn east into SW Hub Shared Road (10ft) → Store south gate. Loading gate: East side.",
      roadWidthFt: 10,
      distanceFromGateFt: 600,
      surfaceType: "Concrete apron at loading gate",
      svgPathPoints: [[7, 7], [14, 7], [14, 632], [108, 632], [108, 613]],
    },
    surroundingTrees: [
      { direction: "North", species: "Neem", canopyRadiusFt: 12, distanceFromWallFt: 10, purpose: "Pest repellent — critical for stored harvest" },
      { direction: "East", species: "Neem", canopyRadiusFt: 12, distanceFromWallFt: 10, purpose: "Shade for loading area + pest control" },
    ],
    utilization: [
      "Short-term harvest storage (before sale or processing)",
      "Farm tool and equipment storage",
      "Organic input and seed storage (ventilated, dry)",
      "Loading/unloading via rolling shutter east gate",
      "Inventory management station",
    ],
    estimatedCost: "₹3 - 4 Lakh",
    timelineToBuild: "2-3 weeks",
    expansionNotes: "Can extend east. Loading gate allows tractor/vehicle access for bulk transport.",
  },

  {
    id: "inf-watchtower",
    hub: "SW",
    headline: "Watch Tower — Elevated Observation Point",
    constructionType: "Steel/bamboo frame tower, 20ft height",
    materialNotes:
      "Galvanized steel tube frame (preferred) or treated bamboo poles. 12x12 ft base with ladder access. Open observation platform at 20ft height with safety railing. Weatherproof canopy over observation deck. Can mount CCTV cameras, weather station, and bird house.",
    floors: [
      {
        name: "Base Level",
        totalAreaSqFt: 144,
        rooms: [
          { name: "Base Structure", sizeFt: "12x12", purpose: "Foundation and structural frame base" },
        ],
      },
      {
        name: "Observation Deck (20ft)",
        totalAreaSqFt: 80,
        rooms: [
          { name: "Observation Platform", sizeFt: "8x10", purpose: "360-degree view of entire farm, seating for 2-3 persons" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road south → SW Hub Shared Road east → North past Store → Watch Tower at NE corner of Store",
      roadWidthFt: 8,
      distanceFromGateFt: 590,
      surfaceType: "Murram path",
      svgPathPoints: [[7, 7], [14, 7], [14, 632], [137, 632], [137, 585]],
    },
    surroundingTrees: [],
    utilization: [
      "360-degree farm surveillance and monitoring",
      "Security watch — visible deterrent",
      "CCTV camera mounting point (covers all zones)",
      "Weather station mounting",
      "Bird watching and nature observation",
      "Agro-tourism attraction point",
    ],
    estimatedCost: "₹1 - 1.5 Lakh",
    timelineToBuild: "1-2 weeks",
  },

  {
    id: "inf-kitchen-garden",
    hub: "SW",
    headline: "Kitchen Garden — Daily Vegetables & Herbs",
    constructionType: "Raised beds with drip irrigation",
    materialNotes:
      "Raised bed system (1ft height, 4ft width) using local stone/brick borders. Drip irrigation on each bed. Mulched pathways between beds. Seasonal rotation chart followed. Wire mesh fencing to prevent animal entry. No permanent roofing — open sky cultivation.",
    floors: [
      {
        name: "Garden Layout",
        totalAreaSqFt: 3150,
        rooms: [
          { name: "Vegetable Beds (8 beds)", sizeFt: "45x4 each", purpose: "Seasonal vegetables — tomato, brinjal, okra, chilli, gourd family" },
          { name: "Herb Section", sizeFt: "15x12", purpose: "Tulsi, mint, coriander, fenugreek, curry leaf" },
          { name: "Medicinal Section", sizeFt: "12x10", purpose: "Aloe vera, ashwagandha, brahmi, lemongrass" },
          { name: "Creeper Trellis", sizeFt: "20x8", purpose: "Bottle gourd, ridge gourd, cucumber on bamboo trellis" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road south → SW Hub Shared Road east → Kitchen Garden north gate (across from Farmhouse)",
      roadWidthFt: 10,
      distanceFromGateFt: 640,
      surfaceType: "Mulched path from shared road",
      svgPathPoints: [[7, 7], [14, 7], [14, 632], [50, 632], [50, 640]],
    },
    surroundingTrees: [
      { direction: "East", species: "Drumstick (Moringa)", canopyRadiusFt: 8, distanceFromWallFt: 5, purpose: "Functional shade + daily vegetable (drumstick pods)" },
      { direction: "North-East", species: "Curry Leaf", canopyRadiusFt: 5, distanceFromWallFt: 3, purpose: "Daily kitchen use, compact tree" },
    ],
    utilization: [
      "Daily vegetable supply for farmhouse kitchen",
      "12-month harvest calendar with seasonal rotation",
      "Fresh herbs for cooking and medicinal use",
      "Surplus vegetables for local sale",
      "Composting demonstration beds",
      "Educational space for visitors",
    ],
    estimatedCost: "₹20,000 - 40,000 (beds + drip + fencing)",
    timelineToBuild: "1 week",
    expansionNotes: "Can expand east and north as needed (230ft eastward available in Zone C)",
  },

  {
    id: "inf-processing",
    hub: "SW",
    headline: "Processing Unit — Value Addition Center",
    constructionType: "Enclosed room with food-grade flooring",
    materialNotes:
      "Brick walls with cement plaster. Food-grade epoxy flooring (easy to clean). Stainless steel work tables. Water connection + drain. Electricity for grinder, mixer, sealer. Ventilation fans. Adjacent to store for input/output flow.",
    floors: [
      {
        name: "Ground Floor",
        totalAreaSqFt: 1120,
        rooms: [
          { name: "Processing Hall", sizeFt: "20x18", purpose: "Main workspace — cutting, grinding, mixing, cooking" },
          { name: "Packing Room", sizeFt: "12x10", purpose: "Packaging, labeling, sealing machines" },
          { name: "Wash Area", sizeFt: "8x8", purpose: "Produce washing, sanitization station" },
          { name: "Cold Storage (future)", sizeFt: "8x6", purpose: "Small cold room for perishable items (Phase 2)" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road south → SW Hub Shared Road → Continue south past Kitchen Garden → Processing Unit east gate",
      roadWidthFt: 10,
      distanceFromGateFt: 700,
      surfaceType: "Concrete apron at gate",
      svgPathPoints: [[7, 7], [14, 7], [14, 632], [26, 632], [26, 714], [28, 714]],
    },
    surroundingTrees: [
      { direction: "East", species: "Neem", canopyRadiusFt: 12, distanceFromWallFt: 10, purpose: "Shade for workers + natural pest repellent" },
      { direction: "South", species: "Curry Leaf", canopyRadiusFt: 5, distanceFromWallFt: 8, purpose: "Kitchen herb nearby for processing recipes" },
    ],
    utilization: [
      "Pickle making — mango, lemon, mixed vegetable",
      "Jam and preserve production (guava, fig)",
      "Juice and pulp extraction",
      "Turmeric and spice powder grinding",
      "Packaging and labeling station",
      "Value addition: 2-3x farm-gate price",
    ],
    estimatedCost: "₹3 - 5 Lakh (basic setup)",
    timelineToBuild: "3-4 weeks",
    expansionNotes: "Can expand east. Cold storage planned as Phase 2. FSSAI license required for commercial sale.",
  },

  {
    id: "inf-drying",
    hub: "SW",
    headline: "Drying Yard — Solar Drying Platform",
    constructionType: "Concrete platform with raised edges",
    materialNotes:
      "Smooth concrete platform (4 inch thick) with 3-inch raised edges to contain produce. Slight slope (1%) for water drainage. Optional retractable polycarbonate shade for rain protection. Clean white surface maximizes solar heat absorption.",
    floors: [
      {
        name: "Platform",
        totalAreaSqFt: 980,
        rooms: [
          { name: "Main Drying Area", sizeFt: "28x25", purpose: "Spread turmeric, ginger, chilli, amla for sun drying" },
          { name: "Covered Section", sizeFt: "10x10", purpose: "Retractable cover for sensitive items / rain protection" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road south → SW Hub Shared Road → South past Kitchen Garden → Adjacent to Processing Unit (east side)",
      roadWidthFt: 8,
      distanceFromGateFt: 710,
      surfaceType: "Concrete (connected to processing unit path)",
      svgPathPoints: [[7, 7], [14, 7], [14, 632], [26, 632], [26, 714], [80, 714]],
    },
    surroundingTrees: [],
    utilization: [
      "Solar drying of turmeric (7-10 days to cure)",
      "Ginger drying for sonth / dry ginger",
      "Chilli drying (red chilli production)",
      "Amla drying for powder / murabba",
      "Grain / pulse drying after harvest",
      "Connected to processing unit for workflow",
    ],
    estimatedCost: "₹60,000 - 1 Lakh",
    timelineToBuild: "1 week",
    expansionNotes: "Can extend east. Keep area tree-free overhead for maximum sun exposure.",
  },

  {
    id: "inf-tank",
    hub: "SW",
    headline: "Water Tank — 50,000L Gravity-Fed Storage",
    constructionType: "RCC / Ferrocement tank on raised platform",
    materialNotes:
      "RCC (reinforced cement concrete) or ferrocement tank. Elevated 6-8ft on RCC pillars for gravity-fed pressure. 50,000 liters capacity. Filled by irrigation bore pump (solar-powered). Gravity feeds drip irrigation lines to all zones downhill. Overflow pipe connects to kitchen garden.",
    floors: [
      {
        name: "Structure",
        totalAreaSqFt: 484,
        rooms: [
          { name: "Tank Chamber", sizeFt: "20x20", purpose: "50,000L water storage — cylindrical or rectangular" },
          { name: "Pump Room (below)", sizeFt: "8x6", purpose: "Pump controls, valve assembly, filter unit" },
        ],
      },
    ],
    accessRoad: {
      fromGate: "NW Gate → West Main Road south → SW Hub Shared Road → South past Kitchen Garden & Processing → Bottom of compound (y=740)",
      roadWidthFt: 8,
      distanceFromGateFt: 740,
      surfaceType: "Concrete pad",
      svgPathPoints: [[7, 7], [14, 7], [14, 632], [26, 632], [26, 750], [28, 750]],
    },
    surroundingTrees: [
      { direction: "South", species: "Pongamia", canopyRadiusFt: 12, distanceFromWallFt: 15, purpose: "Shade nearby but NOT overhead (to keep tank clean from leaf fall)" },
    ],
    utilization: [
      "Central water storage — gravity-fed to all 4 zones",
      "Filled by solar-powered bore pump from irrigation bore",
      "Supplies drip irrigation lines through control valves",
      "Emergency water reserve during pump failure",
      "Overflow feeds kitchen garden and composting area",
      "Water level monitoring (float valve or sensor)",
    ],
    estimatedCost: "₹2.5 - 4 Lakh (tank + platform + piping)",
    timelineToBuild: "2-3 weeks",
  },
];

// ── Lookup helper ──
export function getInfraDetail(id: string): InfraDetail | undefined {
  return INFRA_DETAILS.find((d) => d.id === id);
}
