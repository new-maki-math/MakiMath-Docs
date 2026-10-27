# Developer integration setup

The old bootstrap has been withdrawn because it used removed endpoints and default credentials. The current backend baseline is main df87ca0 and requires Node.js 22+. The schema initializes an empty database only; it provides neither a legacy migration nor default administrator credentials. Do not apply it as an upgrade script to an existing database.

Use the [current integration guide](/api/frontend-integration). Full English instructions are pending. Frontend behavior has not been verified in this documentation round. Database integration tests require an explicitly enabled, initialized independent database whose name ends in _test.
