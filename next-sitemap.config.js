/** @type {import('next-sitemap').IConfig} */
const fs = require("node:fs");
const path = require("node:path");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://panghutech.com";
const locales = ["zh", "en"];

const projectChapters = {
  "Real-ESRGAN-animevideov3": ["features", "architecture", "deploy"],
  "panghu1102.github.io": ["story", "stack", "migration"],
  "Aokana-GPT-Sovits": ["vision", "status", "responsibility"],
  SparkRelay: ["mission", "ecosystem", "technology"],
  daohang: ["destinations", "design", "build"],
};

const jyacsSections = [
  "install",
  "versions",
  "features",
  "cloud-compute",
  "faq",
  "privacy",
  "about",
];
const cfrelaySections = ["deploy", "features", "versions"];

function getAdditionalPaths() {
  const paths = new Set();

  for (const locale of locales) {
    for (const route of ["", "/about", "/blog", "/projects"]) {
      paths.add(`/${locale}${route}`);
    }

    for (const section of jyacsSections) {
      paths.add(`/${locale}/projects/JYACS/${section}`);
    }
    paths.add(`/${locale}/projects/JYACS`);

    for (const section of cfrelaySections) {
      paths.add(`/${locale}/projects/cfrelay/${section}`);
    }
    paths.add(`/${locale}/projects/cfrelay`);

    for (const [project, sections] of Object.entries(projectChapters)) {
      paths.add(`/${locale}/projects/${project}`);
      for (const section of sections) {
        paths.add(`/${locale}/projects/${project}/${section}`);
      }
    }
  }

  const postsDirectory = path.join(process.cwd(), "posts");
  if (fs.existsSync(postsDirectory)) {
    for (const fileName of fs.readdirSync(postsDirectory)) {
      if (!fileName.endsWith(".md")) continue;
      const slug = fileName.replace(/\.md$/, "");
      for (const locale of locales) {
        paths.add(`/${locale}/blog/${slug}`);
      }
    }
  }

  return [...paths].map((pagePath) => ({
    loc: pagePath,
    changefreq: pagePath.includes("/blog/") ? "monthly" : "weekly",
    priority: /^\/(zh|en)$/.test(pagePath)
      ? 1
      : pagePath.includes("/blog/")
        ? 0.7
        : 0.8,
  }));
}

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: "public",
  exclude: ["/404", "/500", "/_not-found"],
  // Keep next-sitemap's discovered App Router pages; returning null here
  // previously discarded every automatically discovered route.
  transform: async (config, pagePath) => ({
    loc: pagePath,
    changefreq: "weekly",
    priority: /^\/(zh|en)$/.test(pagePath) ? 1 : 0.7,
  }),
  additionalPaths: async () => getAdditionalPaths(),
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
};
