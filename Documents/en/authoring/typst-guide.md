# Typst Math Typesetting Guide

::: warning Pending model review
This page retains legacy instructions and is not the current API contract. Course/section endpoints have been removed; executable scene code is not supported. Use the [current integration guide](/api/frontend-integration). Do not initialize an existing database from these legacy instructions.
:::


This guide is written specifically for **mathematics authors, teachers, and lecture creators**. MakiMath uses the modern **Typst** language so you can typeset beautiful, clean mathematical notes right in your browser without tedious local setups.

## Math Syntax: Refer to Official Typst Docs

Typst formula syntax is clean and intuitive: inline math is wrapped with single `$` signs (e.g., `$f(x)$`), and standalone display math uses `$` with surrounding spaces.

For all specific math formulas, symbols, fractions, sub/superscripts, roots, limits, integrals, matrices, and piecewise cases, please refer directly to the official documentation:

👉 **[Official Typst Math Reference Manual](https://typst.app/docs/reference/math/)**

The official documentation contains interactive examples and complete spellings for every mathematical symbol and function.

## Step 1: Write Content Directly

If you have used Typst on your computer before, you might be used to adding boilerplate code for margins, paper size, and fonts at the top of every file.

**In MakiMath, please do not include any of that!**

```typst
// ❌ Do NOT write setup code like this:
#set page(...)
#set text(...)
#import "@preview/..."
```

**Why is it unnecessary?**
- The platform already comes with built-in fonts for Latin text, CJK characters, and math symbols.
- Lecture notes automatically adapt to phones, tablets, and desktop screens, as well as light and dark themes.
- **In the editor, simply start typing your headings, text, and formulas directly from line one.**

## How Should I Define Styles?

First, keep a core rule in mind:

**Every Typst lecture automatically pairs with an "Adapter" (which decides which macro connects to which card structure) and a "Stylesheet" (which defines how that card visually looks on the screen).**

Because of this, you never need to write boilerplate styling code inside your lecture notes. If you want to introduce new custom cards (like theorems, definitions, examples, or exercise blocks) or customize the visual theme for a course, **you do not need any programming knowledge—simply prepare the following three files and contact the development team:**

1. **Prepare Three Simple Files**:
   - **File 1: Lecture Sample (`.typ`)**: A real lecture snippet showing your text and how you use the cards in context.
   - **File 2: Style Reference (`.typ` or screenshot)**: A visual mockup or sample showing your desired appearance (borders, background colors, corners, or layout screenshots).
   - **File 3: Macro Directory (`.typ`)**: A dedicated list of **all macro commands** you plan to use, detailing each macro's name, arguments, and purpose.
2. **Submit to Developers**:
   - Package these three files and send them to the platform technical team, or open an Issue on the GitHub repository.
3. **The Tech Team Handles the Adaptation**:
   - Developers will configure the underlying responsive styling, breakpoints, and dark mode support based on your macro directory and style reference.
   - Once configured, you can call those card names directly in the workbench and see them render in real time!

::: tip 🌟 Good News: Universal Adapter in Progress
The platform development team is actively working on a **Universal Preset Adapter** and a standard mathematical stylesheet!

In upcoming releases, standard academic callouts (theorems, definitions, lemmas, examples, proofs, corollaries) will be supported out of the box without requiring manual developer adaptation for each course. Stay tuned!
:::

## Good Formatting Habits

- **Spacing**: Leaving a space between formulas and text makes notes significantly easier to read (e.g., `Let $f(x)$ be differentiable at $x_0$`).
- **Punctuation**: Use standard punctuation in text, and standard western punctuation inside formulas.
