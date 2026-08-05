/** @type {import('next-sitemap').IConfig} */
const fs = require("node:fs");
const path = require("node:path");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const locales = ["zh", "en"];
const defaultLocale = "zh";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: "public",
  exclude: ["/404", "/500"],
  additionalPaths: async () => {
    const postsDirectory = path.join(process.cwd(), "posts");
    const staticPaths = ["", "/posts", "/projects"];
    const postPaths = fs.existsSync(postsDirectory)
      ? fs
          .readdirSync(postsDirectory)
          .filter((fileName) => fileName.endsWith(".md"))
          .map((fileName) => `/posts/${fileName.replace(/\.md$/, "")}`)
      : [];

    return [...staticPaths, ...postPaths].flatMap((path) =>
      locales.map((locale) => ({
        loc: `/${locale}${path}`,
        changefreq: path.startsWith("/posts/") ? "monthly" : "weekly",
        priority: path === "" ? 1 : path.startsWith("/posts/") ? 0.7 : 0.8,
        alternateRefs: locales.map((alternateLocale) => ({
          href: `${siteUrl}/${alternateLocale}${path}`,
          hreflang: alternateLocale,
          hrefIsAbsolute: true,
        })),
      }))
    );
  },
  transform: async () => null,
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
};
