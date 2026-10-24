# Editor Workbench Guide

The Lecture Workbench (`/workbench`) is the primary authoring workspace in MakiMath. It integrates tree navigation, source editing, knowledge graph linking, and live WASM previews into a single unified interface.

## Three Main Panels

![Three Main Panels](/images/workbench-layout-en.svg)

### 1. Hierarchy Tree Panel
- **Browse Structure**: View all courses, chapters, and sections you have permission to edit.
- **Drag-and-Drop Reordering**: Drag chapters or sections vertically; positions update and sync with the backend `pos` field automatically.
- **Context Menus**: Right-click on tree nodes to create sections, edit metadata, duplicate nodes, or delete items.

### 2. Typst Source Editor Panel
- **Formula Snippets Toolbar**: Insert theorem templates, example callouts, matrices, and calculus symbols with one click.
- **History Support**: Full undo (`Ctrl + Z`) and redo (`Ctrl + Y`) support.
- **Unsaved Changes Warning**: Visual indicators warn you if unsaved edits are present to prevent accidental data loss.

### 3. WASM Vector Preview Panel
- Powered by Typlet running directly inside the local browser thread.
- Millisecond response times regardless of formula complexity, delivering true real-time feedback.

## Advanced Batch Operations

When restructuring large courses or textbooks, the workbench provides several batch processing tools:

### 1. Batch Move
- Select multiple sections and migrate them to a target chapter in one action.
- **Conflict Prevention**: If identical slugs already exist in the target chapter, the system appends `-1`, `-2` to prevent unique constraint collisions.

### 2. Batch Copy
- Duplicate selected sections with a single click (automatically appends `(Copy)` to titles and assigns the next available sort index).
- Works across chapters to easily duplicate standard exercise sets or common derivations.

### 3. Batch Delete
- Select and safely purge multiple sections after a confirmation prompt, automatically updating associated dependency edges.

## Prerequisite Picker (PrereqPicker)

In the section properties drawer, click **Edit Prerequisites** to open the modal:

1. **Visual Search**: Filter candidate sections by chapter or search keywords.
2. **Safety & Loop Validation**:
   - The current section is disabled from self-selection.
   - All connections must form a strict Directed Acyclic Graph (DAG); potential circular references are caught and blocked immediately.
3. **Instant Sync**: Saving prerequisites triggers immediate rerendering of the course roadmap graph.

## Conflict Negotiation & Concurrent Saves

To prevent editors from accidentally overwriting each other's work:

1. **SHA-256 Hashing**: Every section loaded into the workbench includes its server-side `source_hash`.
2. **Conflict Guard**: If another author commits a newer version in the interim, your save request will be intercepted with a prompt showing the latest changes, keeping your content safe.
