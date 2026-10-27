# Frontend integration boundary

The previous English contract has been withdrawn: it described the removed course/section model. The verified backend baseline is main `df87ca0` (2026-10-27). This page does not claim that the frontend integration has shipped.

The Chinese contract is being updated first in this round. Use the [current reference](/architecture/frontend), [frontend integration sequence](/api/frontend-integration). The full English translation is pending; the old interface descriptions are no longer authoritative.

Knowledge points have stable identities and immutable submitted revisions. Lectures organize author blocks and references to specific approved knowledge revisions. Draft saves and submissions require edit_version. Lecture saves replace the complete tree and must preserve existing occurrence_id values. Review, publication and recommendation are separate concepts.
