# Organizing Chapters & Sections

There is no need to start with formulas. Open the lecture workbench, create a local lecture and add a chapter and a section to get familiar with the structure. Local authoring does not require signing in.

## What makes up a lecture?

The workbench has three levels:

```text
Introduction to Limits       A lecture
  Part 1: Sequence Limits    A chapter
    L01 How Sequences Change A section
    L02 The Definition       Another section
  Part 2: Function Limits
    L03 From Sequences to Functions
```

A lecture is like a book: chapters group related material, while sections are where you write and read the content. Each section has its own Typst source, which opens when a reader selects it from the table of contents.

You do not have to build the whole outline at once. Start with two or three sections, settle on your approach, then add more chapters as needed.

## Create a lecture

Find the local lectures area on the left of the workbench and use the create option. Enter a course name and course identifier. The “course” shown here is the lecture itself; you do not need to create a separate course.

The name is shown to readers, such as “Introduction to Limits”. The identifier distinguishes the lecture and is used in its address, such as `limits-intro`. Use lowercase English letters, numbers and hyphens, not Chinese characters, spaces or a full URL.

A local identifier must be unique among local lectures in the current browser. An online identifier must be unique on the server. On another device, you must first import a local lecture's content; copying its URL is not enough.

After creating the lecture, select it to add a subtitle, summary, cover and other information. A clear name and outline are enough to start; you do not have to fill every optional field.

## Add chapters and sections

In the tree on the left, use the add actions beside a lecture or chapter. Create a chapter under the lecture, then a section under the chapter. Selecting a node opens its editing panel on the right.

Group chapters by topic, such as “Sequence Limits” and “Function Limits”. Use sections for material a reader can reasonably read together, such as “The Definition of a Limit” or “Limit Laws”. You do not need to turn every paragraph into a section or put an entire part into one section.

Once a section exists, write its content in the source editor. See [Writing Content & Formulas](./writing.md).

## Names, identifiers and tags

| Field | Purpose | Example |
| --- | --- | --- |
| Title or name | Name shown to readers | `L01 The Definition of a Limit` |
| Identifier | Locates a chapter or section | `sequence-limit` |
| Tag | Additional short information, such as a display number | `L01` |

Chapter identifiers must be unique within a lecture; section identifiers must be unique within their chapter. Titles can contain text and numbers. Keep identifiers short and stable so they are easy to recognize later.

To show “Part 1” or “L01” in the outline, you can put it directly in the title. If it is already included, you do not need to repeat it.

Shared reading URLs use these identifiers. Changing a chapter or section identifier can invalidate an old URL, so it is different from changing a title. An online lecture's course identifier currently cannot be changed through the interface; changing a local identifier also changes its local reading URL.

## Reorder and delete

Use the move-up and move-down actions in the outline to reorder items at the same level. Select or hover over an item to find its actions. Save afterward so readers see the new order.

Choose an order that serves your explanation: you might begin with an intuitive example or establish a definition first. Referencing a knowledge point does not automatically add all its prerequisites, so check what readers need to know.

Before deleting, check whether you selected a section, chapter or entire lecture. Deleting a chapter also removes its sections; it is not just deleting a folder. If you are unsure, [export a JSON backup](./import-export.md) first.

## Save outline changes

Adding, renaming, reordering and deleting are all edits. Click “Save” when finished, or use Ctrl/Cmd+S in the source editor. Saving checks required lecture information and identifier uniqueness. If another chapter or section is incomplete, address that prompt too.

The workbench asks for confirmation before leaving unsaved changes. “Discard” returns to previously saved content; it does not merely hide the edits. If unsure about important content, save it or copy it elsewhere first.

Next, try [writing content and formulas](./writing.md), then [reference the knowledge library](./knowledge-references.md).
