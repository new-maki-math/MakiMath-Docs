# Writing Content & Formulas

## If you already know Typst

If you have written lectures in Typst before, the basic syntax for text, formulas, headings and lists is familiar. Here, however, supported syntax is rendered as web content rather than a Typst project being compiled to PDF. Source that passes the official Typst compiler will not necessarily work unchanged in MakiMath.

**1. Write section content without preparing a whole project**

The workbench organizes lectures, chapters and sections. Each section has its own source. Open a section and write its content directly; you do not need a document header or `#include` to join files.

Headings such as `=` and `==` organize content inside the current section. They do not create chapters or sections in the workbench outline. Enter the lecture name, summary and cover in their respective panels rather than recreating them in source.

**2. Keep formula syntax, but do not assume programs or paper layout work unchanged**

The platform supports common formulas, text structures and some static styles, but does not execute complete Typst programs. When moving existing material, start with these distinctions:

| Previous Typst practice | In MakiMath |
| --- | --- |
| Write text, headings, lists and formulas directly | Keep the basic syntax and check the preview |
| Use official functions such as `#text`, `#align` and `#table` | Use supported parameters; a supported name does not imply all official capabilities work |
| Define variables or functions with `#let`, or generate content with loops | Not currently executed; write the content directly |
| `#import` templates or packages, or `#include` other files | Not currently executed; put the actual content in its section |
| Use `#show` rules to rewrite styles | Not currently executed; prefer MM macros for teaching content |
| Set paper, headers, footers, margins or forced page breaks | Web content does not use these layout rules; use lecture printing for paper output |

Some static `#set text(...)` parameters are supported, but this does not mean a template's `#set` and `#show` settings can all be copied over. Check the specific parameter when a diagnostic appears.

Printing paginates the lecture's web content; it does not run the full Typst compiler. Do not expect identical wrapping and page breaks to the original PDF.

**3. Use MM macros for custom teaching styles**

You cannot simply copy the names of definition boxes, theorem boxes and question environments defined in an old template. MakiMath provides MM macros to express their purpose, with styling handled by the platform:

```typst
#mm-box-theorem(title: [Sum of a geometric sequence])[
  When $q != 1$,
  $ S_n = frac(a_1 (1-q^n), 1-q) $
]
```

You do not need to redefine box titles, colors or light/dark adaptation in each source. See [Using MM Teaching Macros](./mm-macros.md).

If the theorem already exists in the public knowledge library, [reference the knowledge point](./knowledge-references.md) rather than writing another theorem box. Add your own explanation before or after it. A reference reads current library content, not a fixed-version copy, and readers share mastery records for the same point across lectures.

**4. Try one section before moving an existing lecture**

Choose a representative section, remove project imports and paper settings, replace old custom environments with MM macros, then check formulas and nested content. Unsupported syntax is retained in the preview with diagnostics. A successful save alone does not establish that the whole section displays correctly.

Once the approach works, use [batch section import](./import-export.md#add-several-typst-files-to-a-chapter) for the remaining content. The “Typst version” field records version information; it does not switch to a full official compilation environment.

If Typst is new to you, start with the following example.

## Write a readable passage

Put this in an empty section:

```typst
First, consider the sequence $a_n = frac(1, n)$.

As $n$ grows, $a_n$ gets closer and closer to $0$.
Next, we will make “getting closer” precise.

== Distinguish two questions

- Does the sequence have a limit?
- If so, what is the limit?

Do not confuse having a limit with having a limit equal to zero.
```

You can type ordinary text directly. A blank line creates a new paragraph. A line break added while editing within a paragraph does not require a line break at the same place for readers.

The preview updates as the source changes. Remember to save once it looks right: visible content has been rendered, but has not necessarily been written to the browser or server.

## Headings, emphasis and lists

Use equals signs for headings; more signs mean a deeper level:

```typst
= Sequence limits
== Definition of a limit
=== Understanding the definition
```

These headings are inside the section; they do not create chapters or sections in the workbench. If the section name is already displayed on the page, you do not need to repeat the same main heading in its content.

Use `#strong[...]` for emphasis and `#emph[...]` for a change of tone:

```typst
#strong[Check the conditions before using the result.]

#emph[For now, we do not consider the case at infinity.]
```

The square brackets contain content. The preceding command controls its display, and the content can still include text and inline formulas.

Use `-` for unordered items and `+` for ordered steps. Keep list formatting simple rather than adding many spaces for indentation.

```typst
- A definition says what a concept means.
- A theorem states what follows under specified conditions.

+ Check the theorem's conditions.
+ State the applicable conclusion.
+ Apply it to the current problem.
```

## Inline and display formulas

A pair of dollar signs encloses a formula. With no inner spaces it appears inline:

```typst
Let $a_n = frac(1, n)$; every term is greater than $0$.
```

For a formula on its own line, add spaces inside the dollar signs:

```typst
$ lim_(n -> infinity) frac(1, n) = 0 $
```

This is Typst syntax, not LaTeX. For example, write `frac(a, b)` rather than `\frac{a}{b}`. Greek letters such as `alpha` do not need a backslash. Try these one at a time in the editor:

| Meaning | Syntax |
| --- | --- |
| Subscript and superscript | `$a_n$`, `$x^2$` |
| Multiple characters in a subscript or superscript | `$a_(n+1)$`, `$x^(n+1)$` |
| Fraction | `$frac(a+b, c)$` |
| Square root | `$sqrt(x)$` |
| Limit | `$lim_(x -> 0) frac(sin x, x)$` |
| Sum | `$sum_(k=1)^n k$` |
| Integral | `$integral_0^1 x^2 dif x$` |
| Common sets and symbols | `$bb(R)$`, `$alpha$`, `$infinity$` |

In math mode, names with multiple letters may be interpreted as commands or symbols. Use double quotes for a short piece of ordinary text inside a formula:

```typst
$ x > 0 quad "implies" quad x^2 > 0 $
```

## Matrices, piecewise expressions and tables

Use `mat` for matrices. Commas separate elements in a row and semicolons separate rows:

```typst
$ A = mat(1, 2; 3, 4) $
```

Use `cases` for a piecewise expression and `&` to align conditions:

```typst
$ f(x) = cases(
  x^2 & x >= 0,
  -x & x < 0
) $
```

Use `#table` for a text table. This two-column example has two content blocks per row:

```typst
#table(
  columns: 2,
  [Sequence], [Limit],
  [$frac(1, n)$], [$0$],
  [$frac(n, n+1)$], [$1$]
)
```

Start with short formulas and simple tables. For a long formula, consider splitting the derivation into steps instead of continually shrinking its font. Check preview diagnostics for especially complex mathematical layouts.

## Preview and synchronized scrolling

The editor and preview are separate areas and can scroll independently. For a long section, enable synchronized scrolling if you want their positions to follow each other; turn it off when not needed.

Synchronized scrolling helps locate content, but does not mean every source line maps to one preview line. A short command can render a tall table or teaching box, so alignment may vary.

## What if the preview reports a diagnostic?

Read the line, column and explanation in document diagnostics, then inspect that location. Common causes include a missing bracket, an unclosed formula, an incorrect parameter type or syntax the platform has not yet adapted.

Try isolating the problematic passage, removing complex nesting and adding it back gradually. Copying an entire LaTeX or Typst project is usually less effective than first confirming that one passage works.

MakiMath currently supports common Typst syntax and MM teaching macros; it is not a full Typst environment. Custom functions, loops, `import`, `include`, `show` rules and paper layout cannot be executed as in an ordinary Typst project. Filling in the “Typst version” field does not automatically add these capabilities.

Use [MM teaching macros](./mm-macros.md) instead of designing borders for definitions, examples and warnings yourself. If content is already in the public knowledge library, consider [referencing the knowledge point](./knowledge-references.md) instead of copying it.
