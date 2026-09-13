import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  serverExternalPackages: ["@payloadcms/db-d1-sqlite"],
};

export default withNextIntl(withPayload(nextConfig));

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
