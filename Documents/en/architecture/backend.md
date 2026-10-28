# Backend architecture

Baseline ea63e51, Node22+,Fastify5,PostgreSQL. app.js assembles plugins; routes validate requests; services enforce permissions and transactions; database constraints protect relations and versions. The old Typst parser is removed: the backend stores/returns raw source without AST or reference expansion.

Admins directly maintain knowledge title/source with active/archived states, no knowledge revisions or review. ID/slug public reads return current content; graph locks and recursive checks protect prerequisites/categories.

Lectures have one working draft and review snapshots. Whole-tree save checks edit_version and preserves chapter/section occurrence_id. Submission copies saved source into a separate pending snapshot, leaving the draft editable, with one pending snapshot allowed. Approval publishes the snapshot and updates the source draft base/version. Referenced knowledge bodies are not frozen.

Archives allow private reads but block ordinary mutation/export/review. Owners/admins restore without publishing; admins may permanently delete an archived lecture and its reviews,versions,directory/collaborators via a restricted transactional deletion context. Historical immutability is not an absolute no-deletion promise. Audit logging is asynchronous and not a substitute for review history. Existing databases require explicit [manual upgrades](../deploy/database-upgrade.md), not automatic application of manual SQL. Static review only.
