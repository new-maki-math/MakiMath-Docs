# Frontend Architecture (Vue 3 + WASM)

The MakiMath frontend single-page application (located under `maki-math-frontend` / `maki-math-re`) is engineered with Vue 3.5 and Vite 8. Unburdened by bulky third-party UI libraries, it employs a custom lightweight component system coupled with a WebAssembly vector typesetting engine to deliver sub-second interactions and print-grade math documents.

---

## Technical Stack Overview

![Frontend Architecture](/images/arch-frontend-en.svg)

- **Core Framework**: Vue 3.5 (`<script setup>` + Composition API) bundled with Vite 8.
- **Typesetting Engine**: WebAssembly runtime powered by `typlet`, executing directly in the browser to parse and render native Typst vector graphics.
- **Graph Engine**: `d3` (v7) for topological hierarchy deduction and DAG prerequisite roadmap visualization.
- **Styling & Theming**: Custom CSS design system (`style-light.css` / `style-dark.css`) supporting smooth dark/light theme switching.
- **Typography**: `@fontsource/noto-sans-sc` guarantees consistent CJK and math symbol rendering across Windows, macOS, and Linux.

---

## Directory & Module Structure

```
maki-math-re/src/
├── api/                   # API communication layer with payload encryption interceptor
├── components/            # Bespoke core UI components
│   ├── MCodeEditor.vue    # Typst source editor with math template toolbar
│   ├── TypstDoc.vue       # WASM vector typesetting host container
│   ├── RoadmapGraph.vue   # D3.js topological roadmap & prerequisite visualizer
│   ├── SearchBar.vue      # Global fuzzy search overlay
│   ├── MButton.vue        # Button primitives
│   ├── MModal.vue         # Modal dialogs
│   ├── MCollapse.vue      # Collapsible panels
│   └── ...
├── layouts/               # Base page scaffolding (headers, footers, split-view frames)
├── presets/               # Typst macro & card style adapter definitions
├── router/                # Vue Router 4 configuration and navigation guards
├── views/                 # Application views
│   ├── course-home/       # Course syllabus and DAG roadmap view
│   ├── lecture-doc/       # Student reading view with section hierarchy sidebar
│   ├── workbench/         # Authoring 3-panel split workbench
│   ├── platform/          # Administrator console (users, invites, audit logs)
│   └── start/             # Authentication & invite redemption portal
├── utils/                 # Utility helpers
├── vendor/                # Proprietary vendor packages (including @makimath/secure-core)
├── App.vue                # Root application component
└── main.js                # App entrypoint
```

---

## Core System Architecture

### 1. Vector Typesetting Engine (`TypstDoc.vue`)
The `TypstDoc.vue` component abstracts the underlying `typlet` WASM compilation pipeline:
- **Pipeline Execution**: The component ingests raw Typst source from backend APIs, applies preset style configurations, and dispatches the job to the WASM worker.
- **Vector Output**: High-fidelity SVG/HTML nodes are mounted directly to the DOM.
- **Lossless Scaling**: Mathematical equations and layout elements are rendered as vector paths, eliminating pixelation and blur.
- **Theme Reactivity**: Automatically adjusts CSS variables according to the user's active theme, ensuring high legibility and contrast.

### 2. Collaborative Authoring Workbench (`views/workbench/`)
The primary content creation environment integrates three tightly synchronized panels:
- **Left: Hierarchy Tree (`WorkbenchTree`)**
  - Drag-and-drop reordering with automatic asynchronous syncing to the backend `/api/sections/reorder` endpoint.
  - Context menu for creating, renaming, configuring dependencies, and archiving sections.
- **Center: Source Editor (`MCodeEditor.vue`)**
  - Integrated math macro toolbar for theorems, definitions, examples, and calculus symbols.
  - History stack supporting undo/redo and shortcuts (`Ctrl + S`, `Ctrl + Z`).
  - Unsaved changes indicator to guard against accidental navigation.
- **Right: Live WASM Preview (`TypstDoc.vue`)**
  - Incremental re-compilation debounced at 300ms for instantaneous visual feedback.

### 3. D3 Topological Graph Engine (`RoadmapGraph.vue`)
- Extracts course prerequisite relations and synthesizes DAG nodes and directed edges in the browser.
- Interactive highlighting of prerequisite chains (upstream dependencies) and downstream unlocked topics.
- Zooming, panning, and auto-centering for intuitive path exploration.

---

## Communication & Security Handling

The client HTTP layer (`src/api/`) incorporates a unified request/response pipeline:
1. **Automated Session Context**: The application maintains session state and transport context automatically at the network layer.
2. **Transparent Outbound Wrapping**: Outbound payloads are formatted and protected before leaving the browser network stack.
3. **Transparent Inbound Parsing**: Response interceptors parse incoming data uniformly, delivering clean domain models to Vue components.
