/** @type {import('next-sitemap').IConfig} */
const fs = require("node:fs");
const path = require("node:path");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://panghutech.com";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: "public",
  exclude: ["/404", "/500"],
  additionalPaths: async () => {
    const postsDirectory = path.join(process.cwd(), "posts");
    const staticPaths = ["", "/blog", "/projects", "/about"];
    const postPaths = fs.existsSync(postsDirectory)
      ? fs
          .readdirSync(postsDirectory)
          .filter((fileName) => fileName.endsWith(".md"))
          .map((fileName) => `/blog/${fileName.replace(/\.md$/, "")}`)
      : [];

    return [...staticPaths, ...postPaths].map((pagePath) => ({
      loc: `/zh${pagePath}`,
      changefreq: pagePath.startsWith("/blog/") ? "monthly" : "weekly",
      priority: pagePath === "" ? 1 : pagePath.startsWith("/blog/") ? 0.7 : 0.8,
    }));
  },
  transform: async () => null,
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
};
