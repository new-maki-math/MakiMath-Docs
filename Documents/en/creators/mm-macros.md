# Using MM Teaching Macros

Lectures often need to distinguish definitions, theorems, examples and warnings. MM teaching macros provide ready-made formatting: write the content, and the platform handles titles, borders and colors.

Do not omit the `#` before the macro name. A simple example:

```typst
#mm-box-warn[
  Before using this result, check that the function is continuous on the interval.
]
```

## Choose a teaching box

Choose a box for its purpose rather than wrapping every paragraph. Write ordinary explanations as text; use a box when readers need to recognize the kind of content.

| Macro | Suitable content |
| --- | --- |
| `#mm-box-definition[...]` | Precise definitions and concepts |
| `#mm-box-theorem[...]` | Theorems, properties and formulas |
| `#mm-box-example[...]` | Worked examples and explanations |
| `#mm-box-warn[...]` | Warnings, common mistakes and scope |
| `#mm-box-conclusion[...]` | Conclusions, corollaries and points to remember |
| `#mm-box-frequency[...]` | Past-exam frequency and notes |
| `#mm-box-homework[...]` | Homework and exercises |
| `#mm-box-custom[...]` | Custom content outside the types above |

The first seven boxes display their type title. To add a name, pass `title`:

```typst
#mm-box-theorem(title: [Sum of a geometric sequence])[
  When $q != 1$, the sum of the first $n$ terms is

  $ S_n = frac(a_1 (1-q^n), 1-q) $
]
```

The brackets in `title: [...]` denote content; do not replace them with `title: "..."`. Titles can contain short text, inline formulas or tags. Put tables, lengthy proofs and other teaching boxes in the body.

Teaching boxes currently accept only an optional `title` and one body content block. You cannot pass `color` to recolor the whole box. Fixed types have corresponding styles that adapt to light and dark themes.

## Give an ordinary note its own title

Use a custom box when you do not want a fixed label such as “Definition” or “Theorem”:

```typst
#mm-box-custom(title: [Why learn this first?])[
  We will use these sequence examples when discussing function limits.
  Becoming familiar with them makes the general definition easier to follow.
]
```

`mm-box-custom` does not add a “Custom” label. If its title is omitted or empty, the title bar is usually hidden, which suits content that only needs to be grouped together.

## Add short tags

Tags are for short text such as “Key point” or “Optional”, not entire paragraphs.

```typst
#mm-tag(color: "blue")[Key point]
#mm-tag(color: "rose")[Exam I only]
#mm-tag(color: "green")[Optional]
```

The six preset colors are `blue`, `cyan`, `green`, `orange`, `rose` and `purple`. Omit `color` for the default blue; presets are usually sufficient.

Tags can also appear in titles:

```typst
#mm-box-example(title: [A basic exercise #mm-tag(color: "green")[Introductory]])[
  Find $lim_(n -> infinity) frac(1, n)$.
]
```

When a custom color is needed, use a static RGB value such as `#mm-tag(color: rgb("B22234"))[Additional]`. Check readability in both light and dark themes yourself. Unsupported colors produce a diagnostic and fall back to the default.

## Arrange a question

For a worked example and explanation, `mm-box-example` is sufficient. To record a source, identifier or difficulty, use `mm-question`:

```typst
#mm-question(
  source: "Practice exercise",
  title: [Understanding a sequence],
  difficulty: 2,
  id: "sequence-01"
)[
  For $a_n = frac(1, n)$, choose the correct statement.

  #mm-question-options(
    columns: 2,
    [Every term is positive],
    [Every term is negative],
    [Every term is zero from some point onward],
    [The sequence has no limit]
  )
]
```

`source` describes where the question came from, `title` adds a title, `difficulty` is an integer from 1 to 5, and `id` is an author-supplied string identifier. All are optional; omit difficulty when unsure.

Put each option in its own `[...]`; the platform displays A, B, C and so on. `columns` can be 1, 2 or 4, or omitted. Consider one column for long options; narrow screens may also show fewer columns.

A blank can be written as follows:

```typst
#mm-question(title: [Find the limit])[
  The limit of $a_n = frac(1, n)$ is #mm-question-blank(width: 6em).
]
```

`mm-question-blank` takes no body block. `width` is optional and defaults to `4em`. The blank is a display element, not an input for submitting an answer. Questions, options and blanks currently do not provide automatic grading or answer records.

## When should I reference the knowledge library?

Writing a theorem box directly adds ordinary content to this section; it does not automatically create a knowledge library entry or cross-lecture mastery record.

If the needed definition, theorem or formula already exists in the library, prefer [referencing it](./knowledge-references.md). A reference renders the knowledge point's own teaching box. Add your explanation around it rather than nesting the same box again.

Avoid adding boxes solely to make every paragraph look uniform: too many boxes make genuinely important content harder to find. Older names such as `defbox`, `thmbox` and `zt` cannot directly replace MM macros and should be adjusted to the syntax here.
