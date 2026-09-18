import path from "node:path";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { Posts } from "./src/collections/Posts";
import { Users } from "./src/collections/Users";
import { migrations } from "./src/migrations";

/**
 * This config is intentionally only for `payload migrate:create`.
 *
 * The runtime config obtains the real D1 binding asynchronously from
 * OpenNext's Cloudflare context. Payload's migration CLI is loaded via CommonJS
 * bundling and does not use the Worker runtime env. A placeholder binding keeps
 * the SQLite dialect stable while the migration generator only inspects schema.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Posts],
  db: sqliteD1Adapter({
    binding: {} as Parameters<typeof sqliteD1Adapter>[0]["binding"],
    migrationDir: path.resolve(process.cwd(), "src/migrations"),
    prodMigrations: migrations,
  }),
  editor: lexicalEditor(),
  secret:
    process.env.PAYLOAD_SECRET ??
    "migration-generation-secret-not-for-production-use",
  typescript: {
    outputFile: "src/payload-types.ts",
  },
});
