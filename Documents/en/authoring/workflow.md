# Lecture Structure & DAG Graph

MakiMath re-engineers mathematical courseware from "traditional linear textbooks" into "multidimensional directed knowledge graphs". This document details how content is organized and how prerequisite networks function across the platform.

## Four-Tier Content Hierarchy

All courseware on MakiMath is organized across four distinct structural tiers:

![Four-Tier Content Hierarchy](/images/content-hierarchy-en.svg)

### 1. Category
- **Definition**: Broad discipline or academic subject, e.g., `Calculus`, `Linear Algebra`, `Probability & Statistics`.
- **Properties**:
  - `name`: Category name.
  - `slug`: URL-friendly identifier (alphanumeric with hyphens, e.g., `advanced-calculus`).
  - `pos`: Global display order index.

### 2. Course
- **Definition**: A complete course, lecture series, or topical module, e.g., `Calculus I: Intensive Lecture Notes`.
- **Properties**:
  - `title`: Full course title.
  - `subtitle` / `descr`: Subtitle and summary description.
  - `status`: Lifecycle status (`draft`, `live`, `hidden`, `archived`).
  - `prereqs`: Array of prerequisite Course IDs for macro-level curriculum sequencing.

### 3. Chapter
- **Definition**: A topical unit within a course, e.g., `Chapter 1: Limits & Continuity`.
- **Properties**:
  - `tag`: Chapter indicator label (e.g., `Chapter 1`).
  - `title`: Chapter title.
  - `summary`: Overview and exam focus highlights.
  - `pos`: Position index within the course.

### 4. Section
- **Definition**: The fundamental unit of lecture delivery, housing the actual Typst source and math formulas, e.g., `1.1 Equivalent Infinitesimal Substitution`.
- **Properties**:
  - `tag`: Section index label (e.g., `1.1`).
  - `title`: Section title.
  - `source`: Raw Typst source text.
  - `source_hash`: SHA-256 hash used for cache negotiation and concurrent save protection.
  - `prereqs`: Array of prerequisite Section IDs.

## Directed Acyclic Graph (DAG) Network

In mathematics, mastering new concepts depends strictly on prior foundations. MakiMath enables explicit prerequisite definitions between sections, establishing a Directed Acyclic Graph (DAG).

![DAG Prerequisite Network](/images/dag-workflow-en.svg)

### 1. Section Prerequisite Principles
- **Minimal Prerequisite Set**: Select only immediate essential prerequisites. Transitive dependencies do not need to be redundantly linked (if section C depends on B and B depends on A, C only needs to link B).
- **Loop Prevention**:
  - Database constraint: `CONSTRAINT sections_no_self_prereq CHECK (NOT (id = ANY (prereqs)))`.
  - The UI and backend perform cycle detection to prohibit circular dependencies.

### 2. Prerequisite Rollup Mechanism
Visualizing hundreds of individual section dependencies on a high-level course overview would overwhelm learners. The platform uses a smart **dependency rollup algorithm**:

$$Section(p) \in prereqs(Section(s)) \implies Chapter(p) \xrightarrow{Edge} Chapter(s)$$

- Intra-chapter dependencies remain contained within the section reader navigation.
- Cross-chapter dependencies automatically aggregate into **macro chapter-to-chapter learning routes**, rendered smoothly by the D3 engine.

## Authoring Best Practices

1. **Granularity**: Keep each section between 5 to 15 minutes of reading time, covering 1-2 core concepts/theorems accompanied by 2-3 illustrative examples.
2. **Slug Conventions**: Use concise, semantic slugs like `ch01-limits-intro` for clean URLs and stable backlinks.
3. **Prerequisite Prompts**: The reader view automatically displays human-readable prompts (e.g., "Recommended after Cauchy's Mean Value Theorem") to orient learners.
