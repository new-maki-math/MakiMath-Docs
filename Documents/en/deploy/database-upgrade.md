# Manual upgrades for existing databases

Backend baseline ea63e51. Database/schema.sql initializes empty databases; it is not an existing-database upgrade script. Applying a change locally says nothing about remote application or automatic deployment.

| Backend script | Preconditions and effect |
| --- | --- |
| Database/manual/archive-disabled-knowledge-points.sql | Current point table with legacy disabled state; converts it to archived and changes the constraint, preserving points/source |
| Database/manual/enforce-single-lecture-draft.sql | Current revision model with source_draft_id; adds one-working-draft index; aborts on duplicate drafts without merging/deleting them |
| Database/manual/remove-lecture-knowledge-references.sql | Source-based references already deployed; drops the obsolete reference table, not lecture source/points; table relation data itself is removed |
| Database/manual/allow-archived-lecture-deletion.sql | Current revision model; defers source/base foreign keys and updates guarded deletion triggers; running the script itself does not delete business data |

These are conditional manual adjustments, not a complete conversion from arbitrary legacy knowledge-revision/block schemas. Confirm environment, database version, columns/constraints and backups before selecting a script. Abort on errors, resolve duplicates with an administrator and verify resulting constraints/data/API behavior. This documentation task executed no SQL or remote-database verification.

deploy.js and deploy.ACL.js check Database/migrations, **not Database/manual**. Deploying source does not apply these scripts; the deployment owner must arrange explicit upgrades without database recreation. The archived deletion script permits a restricted transaction-context deletion path, not general removal of content/review protections.
