# Farm Orchard Architect — Project Specification

## Project Overview

A visual farm layout planning application for designing modular orchards at scale (up to 12+ acres). Users can draw roads, trenches, flower beds, place trees and crops using configurable block templates, manage zones, and generate reports — all through an interactive canvas-based designer.

---

## 1. Tech Stack

| Layer                | Technology                    | Reason                                                                 |
| -------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| **Framework**        | Next.js 15 (App Router)      | SSR, file-based routing, `next/dynamic` lazy loading                   |
| **UI Library**       | shadcn/ui + Tailwind CSS v4  | Modern, themeable components with utility-first styling                 |
| **Drawing Engine**   | Konva.js + react-konva       | Canvas-based 2D engine — zoom/pan, drag/drop, snapping, layers, fast   |
| **State Management** | Zustand + Immer              | Lightweight store with immutable updates, undo/redo support            |
| **Icons**            | Lucide React                 | Tree, plant, road, water icons (ships with shadcn)                     |
| **Theme**            | next-themes                  | Dark / light mode toggle                                               |
| **Charts**           | Recharts                     | Dashboard income projection & plant distribution charts                |
| **Data Persistence** | LocalStorage (Phase 1–6)     | Offline-first; migrate to Supabase in Phase 7                          |
| **Export**           | Konva `.toDataURL()` + jsPDF | PNG and PDF export of farm layouts                                     |
| **IDs**              | crypto.randomUUID / nanoid   | Unique element identifiers                                             |

---

## 2. Drawing Engine — Why Konva.js

| Option             | Pros                                      | Cons                                | Verdict            |
| ------------------ | ----------------------------------------- | ----------------------------------- | ------------------ |
| **Konva.js**       | Canvas-based, 10K+ shapes, React bindings | Learning curve                      | **Selected**       |
| Fabric.js          | Rich editor features                      | Poor React integration, heavy       | Too heavy          |
| SVG / D3           | Familiar                                  | Slow with thousands of elements     | Won't scale        |
| Pixi.js            | WebGL, fastest rendering                  | Game-engine oriented, overkill      | Over-engineered    |
| Excalidraw         | Nice whiteboard UX                        | Not structured for grid layouts     | Too freeform       |

---

## 3. Application Screens

```
Dashboard (Landing)
├── Farm Designer          ← Core canvas editor
│   ├── Toolbar            (draw road, trench, stamp block, place plant)
│   ├── Canvas             (zoom/pan, grid, snap-to-grid)
│   ├── Properties Panel   (configure selected element)
│   ├── Layers Panel       (toggle roads, trees, trenches, zones)
│   └── Minimap            (birds-eye overview)
├── Block Template Designer
├── Plant Library
├── Zone Manager
├── Reports & Calculations
└── Settings
```

### Screen Details

| #   | Screen                      | Route        | Purpose                                                    |
| --- | --------------------------- | ------------ | ---------------------------------------------------------- |
| 1   | **Dashboard**               | `/`          | Farm summary cards, quick links, income chart, recent work |
| 2   | **Farm Designer**           | `/designer`  | Main canvas — draw roads, trenches, stamp blocks, plants   |
| 3   | **Block Template Designer** | `/templates` | Design reusable 36x36, 24x24, or custom block layouts     |
| 4   | **Plant Library**           | `/plants`    | CRUD plant types with color, icon, spacing rules           |
| 5   | **Zone Manager**            | `/zones`     | Define Zone A/B/C with strategy & block template mapping   |
| 6   | **Reports**                 | `/reports`   | Auto-calculated plant counts, area, income projections     |
| 7   | **Settings**                | `/settings`  | Theme, grid size, units (ft/m), export preferences         |

---

## 4. Farm Designer — Core Feature Spec

### 4a. Drawing Tools

| Tool             | Behavior                                                        |
| ---------------- | --------------------------------------------------------------- |
| **Select/Move**  | Click to select element, drag to reposition                     |
| **Road**         | Draw road strip — configurable width (15ft main, 6ft secondary) |
| **Trench**       | Draw 3ft water-harvesting trench lines                          |
| **Flower Bed**   | Draw border beds (3ft alongside roads)                          |
| **Block Stamp**  | Stamp a saved block template onto the grid                      |
| **Single Plant** | Place individual tree / banana / guava / papaya                 |
| **Zone Paint**   | Paint zone boundaries (Zone A, B, C)                            |
| **Measure**      | Click-drag to measure distance in feet                          |
| **Eraser**       | Remove elements from canvas                                     |

### 4b. Canvas Features

| Feature              | Details                                                              |
| -------------------- | -------------------------------------------------------------------- |
| **Grid Overlay**     | Toggle grid at 1ft, 3ft, 6ft, or 36ft intervals                     |
| **Snap to Grid**     | Elements snap to nearest grid point while dragging                   |
| **Zoom / Pan**       | Mouse wheel zoom, click-drag pan (Konva built-in)                    |
| **Minimap**          | Corner overview showing full farm with viewport indicator            |
| **Layers**           | Roads, Trees, Trenches, Zones, Grid — each toggleable               |
| **Auto-populate**    | Select zone area → choose template → auto-fill with repeated blocks |
| **Undo / Redo**      | Full history stack (Zustand middleware)                               |
| **Multi-select**     | Shift+click or drag-box to select multiple elements                  |
| **Copy / Paste**     | Duplicate selected elements                                          |
| **Keyboard Shortcuts** | Delete, Ctrl+Z, Ctrl+Y, Ctrl+C, Ctrl+V, +/- zoom                 |

### 4c. Level of Detail (LOD) — Scaling to 12 Acres

| Zoom Level     | Rendering                                          |
| -------------- | -------------------------------------------------- |
| **Full farm**  | Colored rectangles per block, zone labels           |
| **Zone level** | Block outlines with plant-type color coding         |
| **Block level**| Individual plant icons, trench lines, bed outlines  |
| **Close-up**   | Full detail — labels, spacing measurements, canopy  |

This ensures smooth performance with 330+ blocks and 7,900+ plants.

---

## 5. Block Template System

### Default Templates

| Template            | Size     | Contents per block                                      |
| ------------------- | -------- | ------------------------------------------------------- |
| **Standard Orchard**| 36×36 ft | 2 Big, 2 Medium, 4 Small trees, 12 Banana, 4 Guava     |
| **Compact Orchard** | 24×24 ft | 1 Big, 1 Medium, 3 Small trees, 6 Banana, 2 Guava      |
| **Banana Block**    | 36×36 ft | 24 Banana (high-density cash crop)                      |
| **Premium Block**   | 36×36 ft | 4 Big trees (Mango, Jackfruit), 8 Medium, 4 Drumstick  |

### Template Editor Features

- Visual grid inside block dimensions
- Drag-and-drop plants from palette
- Configure trench positions (3ft lines)
- Configure bed rows (6ft, 9ft)
- Save / rename / duplicate templates

---

## 6. Plant Library — Default Plant Types

| ID  | Name              | Category | Color     | Spacing (ft) | Icon      |
| --- | ----------------- | -------- | --------- | ------------- | --------- |
| B1  | Mango             | big      | `#2d6a4f` | 30            | tree      |
| B2  | Jackfruit         | big      | `#40916c` | 30            | tree      |
| B3  | Tamarind          | big      | `#52b788` | 30            | tree      |
| M1  | Avocado           | medium   | `#74c69d` | 18            | tree-pine |
| M2  | Sapota            | medium   | `#95d5b2` | 18            | tree-pine |
| M3  | Drumstick         | medium   | `#b7e4c7` | 15            | tree-pine |
| S1  | Lemon             | small    | `#ffd60a` | 12            | citrus    |
| S2  | Pomegranate       | small    | `#e63946` | 12            | flower    |
| S3  | Curry Leaf        | small    | `#a7c957` | 9             | leaf      |
| BA  | Banana            | banana   | `#fee440` | 8             | banana    |
| PA  | Papaya            | papaya   | `#ff9f1c` | 8             | papaya    |
| G1  | Taiwan Pink Guava | guava    | `#f4845f` | 15            | apple     |

---

## 7. Zone Strategy Defaults

| Zone   | Name              | Acres | Strategy                                   | Default Template     |
| ------ | ----------------- | ----- | ------------------------------------------ | -------------------- |
| Zone A | High Cash Flow    | 4     | Banana + Guava dominant, heavy fertigation  | Banana Block         |
| Zone B | Balanced Orchard  | 4     | Full B/M/S mix, medium input               | Standard Orchard     |
| Zone C | Asset & Premium   | 2     | Mango, Jackfruit, Avocado, nursery          | Premium Block        |

---

## 8. Data Model (TypeScript Interfaces)

```typescript
// ---- Farm ----
interface Farm {
  id: string;
  name: string;
  totalAcres: number;
  reservedAcres: number;
  dimensions: { widthFt: number; heightFt: number };
  gridSizeFt: number;
  zones: Zone[];
  elements: FarmElement[];
  createdAt: string;
  updatedAt: string;
}

// ---- Zone ----
interface Zone {
  id: string;
  name: string;
  color: string;
  acres: number;
  strategy: string;
  blockTemplateId: string;
  bounds: { x: number; y: number; width: number; height: number };
}

// ---- Farm Element (anything on canvas) ----
interface FarmElement {
  id: string;
  type: 'road' | 'trench' | 'flower-bed' | 'block' | 'plant' | 'zone-boundary' | 'pond' | 'shed' | 'structure';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  layer: 'roads' | 'trenches' | 'plants' | 'structures' | 'zones';
  locked: boolean;
  visible: boolean;
  config: ElementConfig;
}

// ---- Element Config (varies by type) ----
interface RoadConfig {
  widthFt: number;          // 15 for main, 6 for secondary
  label: string;
  hasBorderBed: boolean;
  borderWidthFt: number;    // 3ft flower bed
}

interface TrenchConfig {
  widthFt: number;          // 3ft default
  depthFt: number;
}

interface BlockConfig {
  templateId: string;
  templateName: string;
  blockWidthFt: number;     // 36 or 24
  blockHeightFt: number;
}

interface PlantConfig {
  plantTypeId: string;
  plantName: string;
  category: PlantCategory;
  canopyRadiusFt: number;
}

type ElementConfig = RoadConfig | TrenchConfig | BlockConfig | PlantConfig | Record<string, any>;

// ---- Block Template ----
interface BlockTemplate {
  id: string;
  name: string;
  widthFt: number;
  heightFt: number;
  plants: PlantPlacement[];
  trenches: { y: number; widthFt: number }[];
  beds: { y: number; heightFt: number; label: string }[];
  totalPlants: number;
}

interface PlantPlacement {
  plantTypeId: string;
  relativeX: number;
  relativeY: number;
}

// ---- Plant Type ----
type PlantCategory = 'big' | 'medium' | 'small' | 'banana' | 'papaya' | 'guava';

interface PlantType {
  id: string;
  name: string;
  category: PlantCategory;
  color: string;
  icon: string;
  spacingFt: number;
  canopyRadiusFt: number;
  incomePerPlantPerYear?: number;
}
```

---

## 9. Project Structure

```
anf/
├── app/
│   ├── layout.tsx                  # Root layout, providers, sidebar
│   ├── page.tsx                    # Dashboard
│   ├── designer/
│   │   └── page.tsx                # Farm Designer (canvas)
│   ├── templates/
│   │   └── page.tsx                # Block Template Designer
│   ├── plants/
│   │   └── page.tsx                # Plant Library
│   ├── zones/
│   │   └── page.tsx                # Zone Manager
│   ├── reports/
│   │   └── page.tsx                # Reports
│   └── settings/
│       └── page.tsx                # Settings
├── components/
│   ├── ui/                         # shadcn/ui generated components
│   ├── layout/
│   │   ├── app-sidebar.tsx         # Sidebar navigation
│   │   ├── header.tsx              # Top header bar
│   │   └── theme-toggle.tsx        # Dark/light switcher
│   ├── designer/
│   │   ├── farm-canvas.tsx         # Main Konva Stage wrapper
│   │   ├── toolbar.tsx             # Drawing tool selector
│   │   ├── properties-panel.tsx    # Selected element editor
│   │   ├── layers-panel.tsx        # Layer visibility toggles
│   │   ├── minimap.tsx             # Birds-eye minimap
│   │   ├── grid-layer.tsx          # Konva grid overlay
│   │   └── tools/
│   │       ├── select-tool.tsx
│   │       ├── road-tool.tsx
│   │       ├── trench-tool.tsx
│   │       ├── block-stamp-tool.tsx
│   │       ├── plant-tool.tsx
│   │       ├── zone-tool.tsx
│   │       ├── measure-tool.tsx
│   │       └── eraser-tool.tsx
│   ├── dashboard/
│   │   ├── stats-cards.tsx
│   │   ├── farm-overview.tsx
│   │   └── income-chart.tsx
│   └── templates/
│       ├── block-editor.tsx
│       └── block-preview.tsx
├── stores/
│   ├── farm-store.ts               # Farm data, elements, zones
│   ├── designer-store.ts           # Active tool, zoom, selection, history
│   └── template-store.ts           # Block templates
├── lib/
│   ├── utils.ts                    # shadcn cn() utility
│   ├── constants.ts                # Default plants, colors, grid sizes
│   ├── calculations.ts             # Area math, plant counts, income
│   └── default-data.ts             # Seed data for plants, templates
├── types/
│   └── farm.ts                     # All TypeScript interfaces
├── public/
│   └── icons/                      # Custom plant SVG icons (if needed)
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── spec.md                         # This file
```

---

## 10. NPM Dependencies

### Production

| Package         | Version | Purpose                        |
| --------------- | ------- | ------------------------------ |
| `next`          | ^15     | Framework                      |
| `react`         | ^19     | UI library                     |
| `react-dom`     | ^19     | DOM rendering                  |
| `konva`         | ^9      | Canvas 2D engine               |
| `react-konva`   | ^18     | React bindings for Konva       |
| `zustand`       | ^5      | State management               |
| `immer`         | ^10     | Immutable state updates        |
| `next-themes`   | ^0.4    | Theme switching                |
| `recharts`      | ^2      | Dashboard charts               |
| `lucide-react`  | ^0.460  | Icons                          |
| `jspdf`         | ^2      | PDF export                     |
| `nanoid`        | ^5      | Unique IDs                     |
| `class-variance-authority` | ^0.7 | shadcn component variants |
| `clsx`          | ^2      | Class merging                  |
| `tailwind-merge`| ^2      | Tailwind class dedup           |

### Dev

| Package                    | Version | Purpose            |
| -------------------------- | ------- | ------------------ |
| `typescript`               | ^5      | Type safety        |
| `tailwindcss`              | ^4      | Utility CSS        |
| `@tailwindcss/postcss`     | ^4      | PostCSS plugin     |
| `eslint`                   | ^9      | Linting            |
| `eslint-config-next`       | ^15     | Next.js lint rules |
| `@types/react`             | ^19     | React types        |
| `@types/node`              | ^22     | Node types         |

---

## 11. Performance Strategy

| Technique                       | Application                                         |
| ------------------------------- | --------------------------------------------------- |
| `next/dynamic` + `ssr: false`   | Konva canvas components (no SSR for canvas)          |
| `React.lazy` + `Suspense`       | All page-level route components                      |
| Konva `.cache()`                | Grid layer, completed road layer (static content)    |
| **Level of Detail (LOD)**       | Zoom-dependent rendering — rectangles vs full detail |
| **Viewport culling**            | Only render blocks visible in current viewport       |
| `React.memo`                    | All Konva shape components                           |
| Zustand selectors               | Fine-grained subscriptions to prevent re-renders     |
| Debounced canvas events         | Mouse move, zoom — debounce heavy recalculations     |
| Web Workers (future)            | Offload plant count / income calculations            |

---

## 12. Implementation Phases

### Phase 1 — Foundation (Current)

- [x] Create spec.md
- [ ] Initialize Next.js 15 project
- [ ] Install and configure Tailwind CSS v4
- [ ] Install and configure shadcn/ui
- [ ] Set up next-themes (dark/light)
- [ ] Create app layout with sidebar navigation
- [ ] Create dashboard landing page with stat cards
- [ ] Add navigation links to all screens
- [ ] Create placeholder pages for all routes
- [ ] Verify lazy loading and routing

### Phase 2 — Farm Designer (Canvas)

- [ ] Set up Konva.js + react-konva
- [ ] Create canvas with grid overlay
- [ ] Implement zoom / pan controls
- [ ] Build toolbar component
- [ ] Implement Select/Move tool
- [ ] Implement Road drawing tool
- [ ] Implement Trench drawing tool
- [ ] Implement Flower Bed tool
- [ ] Add snap-to-grid behavior
- [ ] Add layers panel with visibility toggle
- [ ] Add properties panel for selected element
- [ ] Implement undo / redo

### Phase 3 — Block Template Designer

- [ ] Build template editor canvas (smaller Konva stage)
- [ ] Plant palette (drag plants onto block grid)
- [ ] Configure trench positions inside block
- [ ] Configure bed rows
- [ ] Save / load / duplicate templates
- [ ] Create default templates (36x36 Standard, 24x24 Compact, etc.)

### Phase 4 — Block Stamping & Auto-populate

- [ ] Block Stamp tool in Farm Designer
- [ ] Click to place block template on farm canvas
- [ ] Auto-populate: select area → fill with chosen template
- [ ] LOD rendering (zoom-dependent detail)
- [ ] Viewport culling for large farms
- [ ] Minimap component

### Phase 5 — Plant Library, Zones, Reports

- [ ] Plant Library CRUD page
- [ ] Zone Manager page with zone strategy editor
- [ ] Reports page — auto-calculated plant counts
- [ ] Area utilization breakdown
- [ ] Income projection table and charts

### Phase 6 — Export & Persistence

- [ ] LocalStorage save / load farm data
- [ ] Auto-save on changes
- [ ] Export canvas as PNG
- [ ] Export canvas as PDF (jsPDF)
- [ ] Export data as JSON (backup)

### Phase 7 — Supabase Integration (Future)

- [ ] Set up Supabase project
- [ ] Auth (email / Google login)
- [ ] Database schema (farms, templates, plants)
- [ ] Cloud save / sync
- [ ] Multi-device access
- [ ] Share farm plans via link

---

## 13. Keyboard Shortcuts

| Shortcut         | Action                |
| ---------------- | --------------------- |
| `V`              | Select tool            |
| `R`              | Road tool              |
| `T`              | Trench tool            |
| `B`              | Block stamp tool       |
| `P`              | Plant tool             |
| `M`              | Measure tool           |
| `E`              | Eraser tool            |
| `Delete`         | Delete selected        |
| `Ctrl+Z`         | Undo                   |
| `Ctrl+Shift+Z`   | Redo                   |
| `Ctrl+C`         | Copy                   |
| `Ctrl+V`         | Paste                  |
| `+` / `-`        | Zoom in / out          |
| `Ctrl+0`         | Fit to screen          |
| `Space + drag`   | Pan                    |
| `G`              | Toggle grid            |

---

## 14. Income Projection Reference

Based on the 12-acre modular orchard master plan:

| Timeline       | Expected Income        |
| -------------- | ---------------------- |
| Year 1         | ₹9–10 lakh             |
| Year 2         | ₹20–22 lakh            |
| Year 3–4       | ₹28–32 lakh            |
| Year 5+ steady | **₹55–70 lakh / year** |

### Steady-state Breakdown

| Source       | Annual Income |
| ------------ | ------------- |
| Big trees    | ₹18–25 L     |
| Medium trees | ₹10–15 L     |
| Guava        | ₹12–15 L     |
| Banana       | ₹8–10 L      |
| Intercrops   | ₹5 L         |

---

*This specification is the single source of truth for the Farm Orchard Architect project. Update as features evolve.*
