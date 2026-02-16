import type { FarmPrinciple, Certification, FarmStory } from "@/types/customer";

export const ZBNF_PRINCIPLES: FarmPrinciple[] = [
  {
    id: "jeevamrut",
    name: "Jeevamrut",
    hindiName: "जीवामृत",
    description:
      "A living microbial culture made from cow dung, cow urine, jaggery, gram flour, and soil. Applied to the soil to boost microbial activity and nourish plants naturally. Replaces all chemical fertilizers.",
    icon: "droplets",
  },
  {
    id: "beejamrut",
    name: "Beejamrut",
    hindiName: "बीजामृत",
    description:
      "A natural seed treatment using cow dung, cow urine, lime, and soil. Protects seeds from soil-borne diseases and provides initial nutrition. Eliminates need for chemical seed treatments.",
    icon: "sprout",
  },
  {
    id: "mulching",
    name: "Mulching (Acchadana)",
    hindiName: "आच्छादन",
    description:
      "Covering the soil with crop residue, dried leaves, and organic matter. Retains moisture, prevents erosion, builds humus, and creates habitat for beneficial organisms. The soil never stays bare.",
    icon: "layers",
  },
  {
    id: "waapasa",
    name: "Waapasa (Moisture)",
    hindiName: "वापसा",
    description:
      "Maintaining optimal soil moisture — not too wet, not too dry. Creates the perfect environment for aerobic and anaerobic micro-organisms to work together. Reduces water usage by up to 50%.",
    icon: "droplet",
  },
  {
    id: "intercropping",
    name: "Intercropping",
    hindiName: "अंतरवर्ती फसल",
    description:
      "Growing multiple crops together — trees, shrubs, ground cover, and climbers. Creates a self-sustaining ecosystem where plants protect and nourish each other. Mimics natural forest structure.",
    icon: "trees",
  },
  {
    id: "whapasa",
    name: "Local Desi Cow",
    hindiName: "देसी गाय",
    description:
      "All natural inputs are derived from the local indigenous (desi) cow. One cow's produce is sufficient for 30 acres. This makes farming truly zero-budget — no external purchases needed.",
    icon: "heart",
  },
];

export const CHEMICALS_NOT_USED: string[] = [
  "Chemical Fertilizers (Urea, DAP, NPK)",
  "Synthetic Pesticides & Insecticides",
  "Herbicides / Weedicides",
  "Growth Hormones & Regulators",
  "Artificial Ripening Agents (Calcium Carbide, Ethylene Gas)",
  "Chemical Seed Treatments (Fungicides, Thiram)",
  "Preservatives & Wax Coatings",
  "Genetically Modified Seeds (GMO)",
  "Chemical Cold Storage Treatments",
  "Synthetic Soil Conditioners",
];

export const WHAT_WE_USE: string[] = [
  "Jeevamrut — Living microbial soil culture",
  "Beejamrut — Natural seed treatment",
  "Neem-based pest management",
  "Cow dung & cow urine preparations",
  "Organic mulching with crop residue",
  "Companion planting & intercropping",
  "Traditional desi seeds",
  "Natural composting & vermicompost",
  "Drip irrigation for water conservation",
  "Manual weeding & hand harvesting",
];

export const SAMPLE_CERTIFICATIONS: Certification[] = [
  {
    id: "cert-1",
    name: "Soil Health Report",
    issuer: "District Agriculture Lab",
    date: "2025-06-15",
    validUntil: "2026-06-15",
    type: "soil-test",
  },
  {
    id: "cert-2",
    name: "Water Quality Report",
    issuer: "State Water Testing Lab",
    date: "2025-08-20",
    validUntil: "2026-08-20",
    type: "water-test",
  },
  {
    id: "cert-3",
    name: "PGS-India Organic Certification",
    issuer: "Participatory Guarantee System — India",
    date: "2025-04-01",
    validUntil: "2028-03-31",
    type: "organic",
  },
];

export const DEFAULT_FARM_STORY: FarmStory = {
  originStory:
    "Our journey began with a simple question — can we grow food the way nature intended, without a single drop of chemical? Inspired by Padma Shri Subhash Palekar's Zero Budget Natural Farming, we transformed 12 acres of land into a thriving, chemical-free orchard. Every tree, every bed, every trench on this farm follows the ancient wisdom of working WITH nature, not against it. We don't just grow food — we regenerate the soil, protect the water, and build an ecosystem that gives back more than it takes.",
  vision:
    "To prove that natural farming is not just viable but profitable — producing food that is pure, nutritious, and honestly priced. We believe every family deserves to know exactly where their food comes from, how it was grown, and what went into it. No secrets. No chemicals. Just nature.",
  principles: ZBNF_PRINCIPLES,
  certifications: SAMPLE_CERTIFICATIONS,
  chemicalsNotUsed: CHEMICALS_NOT_USED,
};

// Timeline comparison data
export interface FarmingComparison {
  aspect: string;
  chemical: string;
  natural: string;
  impact: string;
}

export const FARMING_COMPARISONS: FarmingComparison[] = [
  {
    aspect: "Soil Treatment",
    chemical: "Chemical fertilizers (Urea, DAP)",
    natural: "Jeevamrut — living microbial culture",
    impact: "Soil life preserved, no toxic runoff",
  },
  {
    aspect: "Seed Treatment",
    chemical: "Thiram, Carbendazim fungicides",
    natural: "Beejamrut — cow dung & lime solution",
    impact: "No chemical residue from day one",
  },
  {
    aspect: "Pest Control",
    chemical: "Synthetic pesticides & insecticides",
    natural: "Neem spray, companion planting, biodiversity",
    impact: "Beneficial insects protected",
  },
  {
    aspect: "Weed Management",
    chemical: "Glyphosate, Paraquat herbicides",
    natural: "Mulching & manual weeding",
    impact: "Soil microbiome stays alive",
  },
  {
    aspect: "Ripening",
    chemical: "Calcium carbide, ethylene gas",
    natural: "Natural tree-ripening over full cycle",
    impact: "Full nutrition, natural sweetness",
  },
  {
    aspect: "Preservation",
    chemical: "Wax coating, chemical preservatives",
    natural: "Fresh harvest, minimal storage",
    impact: "What you see is what was picked",
  },
  {
    aspect: "Growing Time",
    chemical: "Accelerated with growth hormones",
    natural: "Full natural cycle (30-50% longer)",
    impact: "Higher nutrient density",
  },
  {
    aspect: "Cost to Soil",
    chemical: "Degrades soil over years",
    natural: "Builds soil health every season",
    impact: "Farm improves with time, not declines",
  },
];
