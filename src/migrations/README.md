# Payload D1 migrations

Migrations in this directory are generated from `payload.config.migration.ts`.
That config contains the same collections and Lexical editor configuration as
the Worker config, but deliberately has no Cloudflare top-level `await`, so
Payload's CommonJS migration CLI can load it.

Generate a migration after changing a collection with:

```sh
npm run payload:migrate:create
```

Review and commit the generated TypeScript migration. Apply committed
migrations to the D1 binding through the Worker deployment workflow; do not
use the migration-only config to run migrations because its D1 binding is a
generation placeholder.
