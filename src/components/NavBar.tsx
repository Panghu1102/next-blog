"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export function NavBar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const items = [
    { label: t("home"), href: "/" },
    { label: t("posts"), href: "/posts" },
    { label: t("about"), href: "/about" },
    { label: t("projects"), href: "/projects" },
  ] as const;

  const visibleItems = items.filter(
    (item) => pathname !== item.href && !pathname.startsWith(`${item.href}/`),
  );

  return (
    <nav className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/20 px-6 py-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
      <Link href="/" className="text-lg font-semibold leading-tight">
        <span className="block">Panghu</span>
        <span className="block">1102</span>
      </Link>
      <div className="flex items-center gap-2">
        {visibleItems.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-xl px-4 py-2 text-sm transition-all hover:bg-black/5 dark:hover:bg-white/10">
            {item.label}
          </Link>
        ))}
        <Link href="/" locale={locale === "zh" ? "en" : "zh"} className="rounded-xl px-4 py-2 text-sm transition-all hover:bg-black/5 dark:hover:bg-white/10">
          {t("language")}
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
