import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { Posts } from "./src/collections/Posts";
import { Users } from "./src/collections/Users";

export default getCloudflareContext({ async: true }).then((cloudflare) =>
  buildConfig({
    admin: {
      user: Users.slug,
    },
    collections: [Users, Posts],
    db: sqliteD1Adapter({
      // This name must match the D1 binding you already attached to the Worker.
      binding: cloudflare.env.blogcms,
    }),
    editor: lexicalEditor(),
    // PAYLOAD_SECRET is a Worker environment variable/secret.
    // It may only be available at Worker runtime during an OpenNext build.
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
      outputFile: "src/payload-types.ts",
    },
  }),
);
