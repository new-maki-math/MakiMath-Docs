# Typst syntax and MM macros

The browser uses Typlet to parse Typst syntax and maps supported document nodes to web components. Typlet renders math. This is **not a complete Typst compiler**. The backend stores and returns source text without parsing macros or building a document AST. Examples were checked against source code; no rendering tests were run in this documentation round.

Consult the official [math](https://typst.app/docs/reference/math/), [text](https://typst.app/docs/reference/text/text/) and [table](https://typst.app/docs/reference/model/table/) references for language syntax. Their full feature sets are not the site's support promise.

## Supported subset

| Area | Current scope |
| --- | --- |
| Markup | Text, paragraphs, headings, line breaks, comments, escapes, emphasis, unordered/ordered/term lists |
| Math | Inline `$x^2$` and display `$ x^2 $`; actual support depends on Typlet, with source and diagnostics on failure |
| Text | Static supported `text` arguments and `set text`; strong, emph, underline, strike, overline, sub, super, smallcaps, hide; raw string with optional block boolean |
| Links and highlight | Static http/https/mailto links and optional body; highlight with optional static fill |
| Layout | Static h/v spacing, parameterless linebreak/parbreak, left/center/right align; box with inset/radius/stroke/fill, block without extra layout parameters |
| Tables | Static columns, initial single header, cells with spans/positions/styles, explicit hline/vline positions |

Supported static text properties include size, color, font names/arrays, weight/style, tracking/stretch, lang/region, direction, kerning, hyphenation, ligatures, numeric styles, features and variations. Region requires lang. Font availability and OpenType behavior depend on browser/fonts. Variables, computed values and conditional rules are not supported substitutes.

Tables accept 1–1000 static columns or supported static length/auto/fr widths, with up to 20000 occupied grid slots. Lines cannot cut through merged cells, and automatic hline/vline positions are not supported. Unsupported syntax remains visible with line/column diagnostics. Arbitrary let, functions, loops, conditions, import/include/packages, show rules, page settings and file operations are outside this renderer's supported execution model. Legacy course adapters and defbox/thmbox/zt/makitag are no longer used.

## The 13 MM macros

These are site extensions. Content blocks `[text]` and strings `"text"` are not interchangeable.

| Macro | Call | Parameters |
| --- | --- | --- |
| mm-box-definition | `#mm-box-definition[body]` | Definition, blue |
| mm-box-theorem | `#mm-box-theorem[body]` | Theorem/formula, purple |
| mm-box-example | `#mm-box-example[body]` | Example, cyan |
| mm-box-warn | `#mm-box-warn[body]` | Warning, amber |
| mm-box-conclusion | `#mm-box-conclusion[body]` | Conclusion/corollary, green |
| mm-box-frequency | `#mm-box-frequency[body]` | Exam frequency, orange |
| mm-box-homework | `#mm-box-homework[body]` | Homework, teal |
| mm-tag | `#mm-tag(color: "blue")[tag]` | One inline body; optional color defaults to blue |
| mm-question | `#mm-question(source: "exam", title: [title], difficulty: 3, id: "q-1")[body]` | All named arguments and the single body are optional; difficulty is integer 1–5; source/id strings; title inline content |
| mm-question-options | `#mm-question-options(columns: 2, [first], [second])` | At least one content block; optional columns 1, 2 or 4; automatic A/B labels |
| mm-question-blank | `#mm-question-blank(width: 4em)` | No body; optional supported static nonnegative length, default 4em |
| mm-knowledge | `#mm-knowledge(slug: "sequence-limit")` | Exactly one static slug string; current active knowledge |
| mm-test | `#mm-test` | Bare identifier, no parentheses or parameters; renders MM TEST |

All seven box macros require exactly one body and only allow the optional `title: [inline content]` argument. A string title or arbitrary color parameter is not accepted. Tag presets are blue/cyan/green/orange/rose/purple, or a supported static rgb/color.rgb value. Unsupported tag color falls back to blue with a diagnostic. Block content is not accepted inside tags or supplementary titles.

```typst
#mm-box-definition(title: [Sequence limit])[
  Let the sequence be $a_n$.
]
#mm-tag(color: rgb("B22234"))[Important]
#mm-question(source: "Practice", title: [Choose], difficulty: 2, id: "limit-01")[
  Select a conclusion.
  #mm-question-options(columns: 2, [$a_n$ converges], [$a_n$ diverges])
  Explanation: #mm-question-blank(width: 6em)
]
```

Option columns collapse on narrow containers. These macros do not provide answer submission, grading or question-bank records. See [knowledge references](./knowledge-reference.md) for source conventions and local mastery.
