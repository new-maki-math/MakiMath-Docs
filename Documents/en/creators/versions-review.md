# Saving, Versions & Review

When you first write an online lecture, it is easy to ask: “I saved it, so why can't others see it?” Saving, submitting for review and public publication are separate actions.

Saving retains your edits. Submitting copies saved content into a pending review snapshot. Only after approval does that snapshot become the public reading version.

## Distinguish the copies

| Content | Location | Directly editable? |
| --- | --- | --- |
| Local lecture | Current browser | Yes; save after editing |
| Online working draft | Server | Yes, with editing permission |
| Review snapshot | Server | No; it records the submitted content |
| Downloaded local copy | Current browser | Yes, without automatically changing the online original |

An online lecture can have a working draft and several historical snapshots. They share a lecture identity, but editing one does not change them all.

Local lectures do not have an online review process. Exporting multiple JSON files does not automatically create online version history; distinguish backups yourself with names and dates.

## Save your changes

After editing the outline, properties or content in the workbench, click “Save”. The source editor also supports Ctrl/Cmd+S. Seeing changes in the preview does not mean they are saved.

Pay attention to what the save result covers. Whole-lecture saving checks the outline and required information; existing online sections also have a single-section save operation. If unsaved changes remain, do not assume other outline or property edits were saved too.

The interface tries to retain edits if saving fails. Read the error and resolve any field, network or permission problem. “Discard” or “Reload” can remove unsaved input; they are not retry-save actions.

An online cover is saved separately: changing or removing it sends a request immediately. If the interface asks you to deal with other unsaved changes first, save or discard them before changing the cover. A local cover is saved with the lecture.

## Submit an immutable review snapshot

Once an online draft is ready, save all changes and click “Submit for review”. The confirmation window shows the expected submitted version and explains that a snapshot will be created. You must wait five seconds before confirming.

The wait gives you time to check the target and effects; it does not mean review finishes in five seconds. The system assigns version numbers. The expected version in the dialog is for confirmation; use the version shown after successful submission. You cannot choose it yourself.

Submission copies the saved title, outline, section source and cover. Text still in the editor that has not been successfully saved is not included.

A lecture can have at most one pending review snapshot at a time. If one is already under review, wait for it to be processed before submitting another.

## Can I continue writing after submission?

You can continue editing the original working draft, but cannot edit the review snapshot directly.

For example, if you submit version 2 and then add an example to the draft, the administrator still sees version 2 as submitted. The new example is not silently added. To publish it later, save and submit a subsequent version.

Version labels help identify what you are viewing. If a page is read-only, first check whether it is a snapshot. The system keeps only one working draft at a time; historical snapshots remain available according to permissions.

## What happens after approval or rejection?

After approval, the public reading entry switches to that snapshot. Readers see reviewed content, not later edits in your working draft.

Rejection does not publish the draft or replace the existing public version. Adjust the working draft using the feedback, save it and submit again.

Publication and recommendation are separate. Approval allows public reading; administrators decide recommendations separately.

## Does a review snapshot freeze knowledge library content?

No. The snapshot fixes the lecture source, including knowledge reference code, but does not copy the referenced knowledge point's content at that moment.

For example, if the snapshot contains `#mm-knowledge(slug: "...")` and an administrator later corrects that point, readers loading the lecture again receive the current library content. The author's explanations around the reference remain the text in the snapshot.

The immutable snapshot applies to the author's submitted lecture content; shared knowledge can still be updated. Before publication, also check that references are available and fit their context.

## Content changed or login expired

Online saving checks the state from when you began editing. Someone else editing the draft, another action updating the cover, or approval updating the draft state can require you to check it again.

When there is a conflict, copy any unsaved text first, then reload and compare. Do not repeatedly click save or assume refreshing will merge the two sets of edits automatically.

If your login expires, sign back in with the original account and continue after permissions are restored. Another account may not have access. If the page says the account cannot access the content, preserve your input before refreshing.

## Archive and restore

The owner or an administrator can archive an entire online lecture. The action requires three confirmation steps. An archived lecture is no longer public and loses its recommendation, while its outline, draft and snapshots are retained.

During archival, private access still depends on permission, but editing, submission, review, downloading, export and listing are unavailable. Restore the lecture before continuing work. Restoration does not automatically make it public again; handle publication according to its current state.

Permanent deletion is separate and only administrators can perform it on an archived online lecture. It deletes the lecture and associated drafts and snapshots; restoring from archive cannot recover it. Deleting a local lecture affects only the copy in the current browser.

When your draft is ready, see [Publishing My Lecture](./publishing.md).
