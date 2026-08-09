"use client";

import Image from "next/image";
import { ArrowRight, BookOpenText, Code2, ExternalLink, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NavBar } from "@/components/NavBar";

export default function AboutPage() {
  const t = useTranslations();
  const paragraphs = t.raw("about.paragraphs") as string[];
  const highlights = t.raw("about.highlights") as { title: string; description: string }[];

  const contacts = [
    { name: "Email", icon: Mail, value: "Ph101102@163.com", href: "mailto:Ph101102@163.com" },
    { name: "小红书", icon: ExternalLink, value: "Panghu1102", href: "https://www.xiaohongshu.com/user/profile/63e64f0f000000002600784a?xsec_token=YB6tdTc5ICPxK5P8K8xUDP23NLeGUuhDZbEN3wdP_lL_M=&xsec_source=app_share&xhsshare=CopyLink&shareRedId=ODlHNjdLNE82NzUyOTgwNjg5OTc7PTpK&apptime=1784475483&share_id=c78a4d192c6d4334bdd3a0a61efe8c18" },
    { name: "贴吧", icon: ExternalLink, value: "Panghu1102", href: "https://tieba.baidu.com/home/main?id=tb.1.d07df80c.a8EiNjQtA7cwWgVEwH0bmQ?t=1672895272&fr=index" },
    { name: "GitHub", icon: ExternalLink, value: "Panghu1102", href: "https://github.com/Panghu1102" },
  ];

  const icons = [Code2, BookOpenText, Sparkles];

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
        <header className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2">
          <NavBar />
        </header>
        <main className="flex min-h-screen flex-col items-center px-6 pb-16 pt-32">
          <section className="w-full max-w-4xl rounded-3xl border border-black/10 bg-white/40 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
            <div className="flex flex-col gap-8 md:flex-row md:items-center">
              <div className="flex justify-center md:justify-start">
                <div className="h-36 w-36 overflow-hidden rounded-full border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
                  <Image src="/avatar/avatar.jpg" alt="Avatar" width={144} height={144} className="h-full w-full object-cover" priority />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium uppercase tracking-[0.35em] text-black/45 dark:text-white/45">{t("about.label")}</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{t("about.title")}</h1>
                <p className="mt-4 text-base leading-7 text-black/60 dark:text-white/60">{t("about.subtitle")}</p>
              </div>
            </div>
            <div className="mt-8 space-y-4 rounded-2xl border border-black/10 bg-white/35 p-6 text-sm leading-7 text-black/65 shadow-inner dark:border-white/10 dark:bg-white/5 dark:text-white/65 sm:text-base">
              {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>

          <section className="mt-8 grid w-full max-w-4xl gap-4 md:grid-cols-3">
            {highlights.map((item, index) => {
              const Icon = icons[index] ?? Sparkles;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }} className="rounded-2xl border border-black/10 bg-white/35 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                  <Icon className="h-6 w-6" />
                  <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">{item.description}</p>
                </motion.div>
              );
            })}
          </section>

          <section className="mt-8 w-full max-w-4xl rounded-3xl border border-black/10 bg-white/40 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{t("about.contactTitle")}</h2>
                <p className="mt-2 text-sm text-black/60 dark:text-white/60">{t("about.contactDescription")}</p>
              </div>
              <Link href="/posts" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/30 px-4 py-2 text-sm font-medium text-black/65 transition hover:bg-black/5 hover:text-black dark:border-white/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15 dark:hover:text-white">
                {t("about.readPosts")}<ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {contacts.map(({ name, icon: Icon, value, href }) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/35 p-4 text-sm transition hover:-translate-y-0.5 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                  <Icon className="h-5 w-5" /><span className="font-medium">{name}</span><span className="text-black/60 dark:text-white/60">{value}</span>
                </a>
              ))}
            </div>
          </section>
        </main>
      </motion.div>
    </div>
  );
}
