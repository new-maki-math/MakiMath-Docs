# Import & Export

To move a lecture you wrote to another computer, use the whole-lecture JSON format. To add existing Typst files to a chapter, use section import. These solve different problems; you do not need to know the internal file structure first.

## Save a lecture you can continue editing

Open the lecture in the workbench. For an online lecture, confirm which version is selected. Save all changes, then click “Export JSON”.

The file contains that version's lecture information, outline, section source, rendering configuration and cover. You can import it later and continue editing, making it useful for backup and transfer.

It does not include accounts, collaborators, review records, all historical versions or readers' mastery records. Exporting one online lecture does not back up all its history on the platform.

Local lectures are stored only in the current browser. Before changing devices or clearing site data, download the JSON to a location you can find. For important lectures, consider keeping dated copies rather than storing the only backup in the browser.

## Import as a new lecture

Use “Import JSON” in the local or online lecture group in the workbench and select a file exported by the platform. Once it has been read, check the name, outline counts and course identifier before confirming.

Import creates a new lecture; it does not overwrite an existing lecture with the same name. If the identifier is taken, choose an unused one, for example by adding `-notes`. Changing only the display name does not resolve an identifier conflict.

You can import a local lecture without signing in, or import an online working draft if you have online authoring permission. Import does not publish directly or inherit the original author's permissions or review result. Select the lecture category again after importing.

If the network is interrupted and the result is uncertain, refresh the list and check whether the lecture was created before trying again. Repeated confirmation can create multiple copies.

## Add several Typst files to a chapter

Select an editable chapter in the workbench, find the batch section import action and choose one or more `.typ` files. Each file becomes a section; its filename is used as the initial title and to attempt an identifier.

Before confirming, check the titles, identifiers and order. Chinese filenames may not produce valid identifiers and may need manual entry. Identifiers must also be distinct from existing sections in the chapter and from each other. Files must use UTF-8. The platform does not automatically convert PDF, Word or LaTeX files to Typst.

Confirming appends the sections to the selected chapter and keeps existing sections. You must then save the lecture to write the outline and source to the browser or server.

One file becomes one section; multiple headings inside a file do not split it automatically. Split material into separate files first if it needs separate reading and ordering. Switching chapters while files are being read cancels the selection; start again in the target chapter.

## JSON, Typst files or PDF?

| Goal | Use |
| --- | --- |
| Back up a whole lecture and continue editing on another device | Export JSON |
| Add existing source to a chapter in batches | Import `.typ` sections |
| Share for reading or print on paper | Print the lecture and save as PDF |

A PDF is a laid-out reading result and cannot be turned back into a workbench outline through JSON import. Export JSON to keep an editable version; save a PDF as well when you need a fixed reading copy.

The print action is on the lecture details page. Choose a range and light or dark appearance, prepare the print content, then open the browser print dialog and select a printer or “Save as PDF”. Dark printing may require enabling background graphics in the browser settings.

## Are references and covers included?

The cover is included in the whole-lecture JSON. Online covers are limited to 512 KiB and local covers to 5 MiB; reduce a large local cover before importing it online.

A knowledge reference retains only code such as `#mm-knowledge(slug: "...")`, not the knowledge point's content. You can continue reading public content through the platform, but the JSON alone cannot guarantee that references expand offline. Mastery records do not transfer with the lecture JSON either.

If import fails, first check that the file is a lecture workbench export or a `.typ` file accepted by the selected action. Knowledge library import JSON and lecture JSON have different formats. For source that is too long, invalid identifiers or oversized covers, follow the error prompt. A section has a 200,000-character source limit, and whole online imports also have a total request size limit.

An archived lecture cannot be exported. Restore it with the appropriate permission before continuing. Avoid putting passwords or other private information in lecture source or rendering configuration, since they may be shared with the file.
