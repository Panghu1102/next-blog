import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { GetPlatformProxyOptions } from "wrangler";
import { Posts } from "./src/collections/Posts";
import { Users } from "./src/collections/Users";
import type { CloudflareContext } from "@opennextjs/cloudflare";

const isCLI = process.argv.some((value) => value.includes("/payload/bin.js"));
const isProduction = process.env.NODE_ENV === "production";

const cloudflare =
  isCLI || !isProduction
    ? getCloudflareContextFromWrangler()
    : getCloudflareContext({ async: true });

export default cloudflare.then((context) =>
  buildConfig({
    admin: {
      user: Users.slug,
    },
    collections: [Users, Posts],
    db: sqliteD1Adapter({
      // This name must match the D1 binding you already attached to the Worker.
      binding: context.env.blogcms,
    }),
    editor: lexicalEditor(),
    // PAYLOAD_SECRET is a Worker environment variable/secret.
    // Do not hard-fail during the Next/OpenNext build when it is only
    // available at Worker runtime.
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
      outputFile: "src/payload-types.ts",
    },
  }),
);

function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ "__wrangler").then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction,
      } satisfies GetPlatformProxyOptions),
  );
}
