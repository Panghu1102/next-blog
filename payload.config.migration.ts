import path from "node:path";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { Posts } from "./src/collections/Posts";
import { Users } from "./src/collections/Users";

/**
 * This config is intentionally only for `payload migrate:create`.
 *
 * The runtime config obtains the real D1 binding asynchronously from
 * OpenNext's Cloudflare context. Payload's migration CLI currently bundles
 * config files as CommonJS, where that top-level await is not supported.
 * Schema generation does not execute queries, so a typed placeholder binding
 * lets it use the same D1 SQLite dialect without loading Cloudflare runtime
 * state. Never use this config to serve the application or run migrations.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Posts],
  db: sqliteD1Adapter({
    binding: {} as Parameters<typeof sqliteD1Adapter>[0]["binding"],
  }),
  editor: lexicalEditor(),
  migrations: {
    dir: path.resolve(process.cwd(), "src/migrations"),
  },
  secret:
    process.env.PAYLOAD_SECRET ??
    "migration-generation-secret-not-for-production-use",
  typescript: {
    outputFile: "src/payload-types.ts",
  },
});
