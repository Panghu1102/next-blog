import { defineRouting } from "next-intl/routing";

export const locales = ["zh", "en"] as const;
export const defaultLocale = "zh";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export type Locale = (typeof locales)[number];
