# Typst and MM macros

Write text, headings and formulas directly. The browser parses supported Typst syntax into web components; this is not a complete Typst compiler. The backend stores and returns source without compiling, executing macros or checking reference targets.

## A first passage

```typst
= Sequence limits
Let the sequence be $a_n$.

#mm-box-definition(title: [Convergence])[
  Write the definition and formulas such as $ epsilon > 0 $ here.
]
#mm-box-custom(title: [Think about it])[
  Can you give an example?
]
```

Text, paragraphs, headings, emphasis, ordered/unordered/term lists, raw text and formulas have mappings. `$x^2$` is inline and `$ x^2 $` is display math. Consult the [Typst math reference](https://typst.app/docs/reference/math/) for syntax, but actual rendering still depends on Typlet and preview diagnostics.

Some static text/set-text parameters, links, highlights, alignment, spacing, boxes, blocks and tables are supported. Arbitrary variables, function definitions, loops, import/include, packages, show rules and page layout are not executed. Unsupported fragments remain visible with line/column diagnostics.

## Boxes and tags

There are **14 MM macros**. All eight boxes take one content body and only the optional `title: [supplementary title]` parameter. A string title or an extra color argument is not accepted.

| Macro | Heading |
| --- | --- |
| `mm-box-definition` | Definition |
| `mm-box-theorem` | Theorem / formula |
| `mm-box-example` | Example |
| `mm-box-warn` | Warning / common mistake |
| `mm-box-conclusion` | Conclusion / corollary |
| `mm-box-frequency` | Exam frequency |
| `mm-box-homework` | Homework |
| `mm-box-custom` | Custom; no heading bar when title is absent or empty |

Titles accept inline text, math and tags, not tables, display math or nested boxes. The legacy defbox/thmbox/zt/makitag adapters are no longer used.

Write a tag as `#mm-tag(color: "blue")[Important]`. Color is optional, default blue; presets are blue/cyan/green/orange/rose/purple. Static rgb such as `rgb("B22234")` also works. Unsupported colors warn and fall back to blue. Tag content must stay inline.

## Questions, options and blanks

```typst
#mm-question(source: "Practice", title: [Choose], difficulty: 2, id: "limit-01")[
  Select a conclusion.
  #mm-question-options(columns: 2, [$a_n$ converges], [$a_n$ diverges])
  Explanation: #mm-question-blank(width: 6em)
]
```

| Macro | Parameters |
| --- | --- |
| `mm-question` | Optional source/id strings, inline title block, integer difficulty 1–5, and at most one optional body |
| `mm-question-options` | At least one content block; optional columns 1/2/4; automatic A/B labels; columns reduce on narrow screens |
| `mm-question-blank` | No body; optional supported nonnegative static width, default 4em |

These are display features, not answer submission or grading. The bare `#mm-test` macro has no parentheses and displays MM TEST.

## Public knowledge references

```typst
#mm-knowledge(slug: "sequence-limit")
```

This macro takes exactly one valid static slug string. In a lecture section, typing #mm-knowledge or its opening parenthesis triggers search at supported positions. Selection inserts the complete syntax. Comments, strings and raw text do not auto-trigger; editor changes during selection require choosing the insertion position again.

Knowledge details offer code copying and “Add to my lecture”. Choose an existing local lecture or editable online draft, then a chapter and section. The reference is appended to that section and saved. Missing chapters/sections are not created for you, and public knowledge is not modified.

References resolve current active knowledge. Archived/deleted points show a placeholder; other failures offer retry. Nested references inside knowledge do not expand. Repeated source references are allowed and have no server-generated occurrence ID or target validation on save.

## Fine-layout limits

Static lengths accept 0 or nonnegative pt/mm/cm/in/em/% literals; tracking also allows negative lengths. fr and computed lengths are unsupported. Text maps supported font/weight/color/language/direction and some OpenType arguments, with results dependent on browser/font availability.

Tables support static column counts/width arrays, a single initial header, spanning cells and explicit lines. Limits are 1000 columns and 20000 grid positions. Lines cannot cross merged-cell interiors; automatically positioned hline/vline are unsupported. Simplify parameters when diagnostics appear rather than assuming a complete official Typst project can execute here.
