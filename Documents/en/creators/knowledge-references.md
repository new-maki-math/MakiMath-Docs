# Referencing the Knowledge Library

Suppose you are writing a lecture on limits and need the definition of a sequence limit. You could write the definition again, or reference the corresponding public knowledge point.

MakiMath recommends the latter. The same knowledge point can appear in lectures by different authors while still coming from one library entry. Authors decide where to introduce it and how to explain it; the knowledge library maintains the shared content.

## Insert a reference for the first time

Open an editable section in the lecture workbench, place the cursor where you want the reference and type:

```typst
#mm-knowledge
```

After the full macro name, or when you type the opening parenthesis, the editor opens a knowledge search in supported positions. Search by name and select a result; the editor fills in the complete reference.

Check the preview to make sure it is the point you need, then save the section. If you are unsure about a result, open its details in the knowledge library and read it first.

If no search window appears, check whether the cursor is inside a comment, string or raw code block. Text there is not treated as an insertion command. You can also copy the reference as described below.

## Copy code from knowledge point details

Knowledge point details provide reference code and a “Copy” button. Paste the copied code into the section source. A reference looks like this:

```typst
#mm-knowledge(slug: "sequence-limit")
```

`sequence-limit` is only an example. Copy the actual code for your target knowledge point rather than reusing this identifier blindly.

The `slug` identifies the point; it is neither its title nor its numeric database ID. Keep `slug:`, the double quotes and parentheses. A name alone is not enough.

“Add to my lecture” in the details is another option. Choose an existing local lecture or an editable online draft, then choose a chapter and section. The reference is appended to the end of that section and saved. It does not create missing chapters or sections; create the outline in the workbench first if needed.

## Add your own explanation around a reference

You can write ordinary content before and after a reference:

```typst
Consider a sequence $a_n = frac(1, n)$. None of its terms is zero,
though the terms get closer and closer to zero.

#mm-knowledge(slug: "sequence-limit")

Returning to the example, the condition in the definition must hold
for all subsequent terms, not just one sufficiently close to zero.
```

You can change the reference's position and order, and write explanations around it, but cannot edit the public knowledge point inside the reference. For a different explanation, write before or after it; report an error in shared content to the knowledge library maintainers.

A knowledge point is displayed with its own teaching box. You do not need to wrap it in another `mm-box-definition` or `mm-box-theorem`. A direct reference also shows its mastery button.

## Why are mastery records shared across lectures?

Readers see the same knowledge library entry rather than an independent copy. Marking it as mastered in one lecture shows that status in other lectures referencing the same point.

Moving to a different lecture therefore does not require marking every learned point again. A new explanation can deepen understanding while already mastered content remains recognizable.

Mastery records currently stay in the browser and are shared across lectures, but do not automatically sync to another browser or device. Manually writing a teaching box with the same content does not automatically associate it with that record.

## What happens when the knowledge library changes?

References load the knowledge point's current available content. If an administrator corrects a definition, adds a condition or adjusts a formula, the lecture uses the updated content the next time it reads the reference. Authors do not need to replace it in every lecture.

An already open page does not necessarily update in real time. If you still see old content, reopen or refresh it. Since referenced content can change, check that your surrounding explanations still fit.

A lecture's review snapshot fixes the submitted source, including the reference code; it does not freeze a copy of the knowledge point's old content. An approved lecture still reads the current public knowledge.

## What if a reference does not appear?

Check that the code is complete and the identifier belongs to the intended point. Similar titles do not necessarily refer to the same entry, so try copying the code from its details again.

If the point is archived or deleted, the reference displays an unavailable placeholder. Retry network failures. Successfully saving source does not mean every reference has been validated: the platform does not prevent saving just because an identifier is temporarily unavailable, so check the preview afterward.

A lecture JSON export retains the reference code but does not include the knowledge library content. You can read references through the platform on another device, but this does not guarantee complete content offline.

Nested knowledge point references inside a knowledge point are not currently expanded. Reference each needed point separately in the section source. References also do not automatically include all prerequisites; arrange explanations for your readers' background.
