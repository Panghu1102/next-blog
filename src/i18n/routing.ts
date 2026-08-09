import { defineRouting } from "next-intl/routing";

export const locales = ["zh", "en"] as const;
export const defaultLocale = "zh";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
  pathnames: {
    "/": "/",
    "/projects": "/projects",
    "/about": "/about",
    "/posts": "/blog",
    "/posts/[slug]": "/blog/[slug]",
  },
});

export type Locale = (typeof locales)[number];
