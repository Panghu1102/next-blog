import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { Posts } from "./src/collections/Posts";
import { Users } from "./src/collections/Users";

export default getCloudflareContext({ async: true }).then((cloudflare) => {
  const secret = process.env.PAYLOAD_SECRET;

  if (!secret) {
    throw new Error(
      "PAYLOAD_SECRET must be configured before Payload can start.",
    );
  }

  return buildConfig({
    admin: {
      user: Users.slug,
    },
    collections: [Users, Posts],
    db: sqliteD1Adapter({
      binding: cloudflare.env.blogcms,
    }),
    editor: lexicalEditor(),
    secret,
    typescript: {
      outputFile: "src/payload-types.ts",
    },
  });
});
