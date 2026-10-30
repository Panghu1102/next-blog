import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/zh/projects" } };

import { ArrowLeft, ExternalLink, FolderGit2, Sparkles } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const projects = [
	{
		name: "JYACS",
		repo: "Panghu1102/JYACS",
		href: "https://github.com/Panghu1102/JYACS",
		tagline: "为 Just Yuri 带来 AI 对话能力的开源 Submod。",
		description:
			"JYACS 是 DDLC 的 Just Yuri MOD 的开源 Submod，支持用户自定义 API 地址、密钥和模型，在熟悉的角色界面中体验 AI 对话。",
		highlights: ["Ren’Py / Just Yuri", "AI 对话", "Apache-2.0"],
	},
	{
		name: "cfRelay",
		repo: "Panghu1102/cfRelay",
		href: "https://github.com/Panghu1102/cfRelay",
		tagline: "基于 Cloudflare Workers 的开源 AI API 中继与管理网关。",
		description:
			"支持 OpenAI 兼容 API 转发、用户鉴权与月度配额；完整版还提供双上游切换、管理后台与 D1 知识库，Lite 可轻量部署。",
		highlights: ["Cloudflare Workers", "AI API Gateway", "KV / D1"],
	},
];

type ProjectsPageProps = {
	params: Promise<{ locale: string }>;
};

export default async function ProjectsPage({ params }: ProjectsPageProps) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("projects");

	return (
		<div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
			<main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-24">
				<nav className="mb-10 flex items-center justify-between rounded-2xl border border-black/10 bg-white/20 px-5 py-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
					<Link href="/" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-black/65 transition hover:bg-black/5 hover:text-black dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white">
						<ArrowLeft className="h-4 w-4" />
						{t("back")}
					</Link>
					<span className="text-lg font-semibold">Panghu Projects</span>
				</nav>

				<section className="rounded-3xl border border-black/10 bg-white/40 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/40 sm:p-10">
					<div className="max-w-3xl">
						<p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/35 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-black/45 dark:border-white/10 dark:bg-white/10 dark:text-white/45">
							<Sparkles className="h-4 w-4" />
							Projects
						</p>
						<h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">{t("title")}</h1>
						<p className="mt-5 text-base leading-8 text-black/60 dark:text-white/60">
							{t("description")}
						</p>
					</div>
				</section>

				<section className="mt-8 grid gap-6 md:grid-cols-2">
					{projects.map((project) => (
						<article key={project.name} className="group flex h-full flex-col rounded-3xl border border-black/10 bg-white/40 p-7 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-xl hover:shadow-black/10 dark:border-white/10 dark:bg-black/40 dark:hover:bg-white/10 dark:hover:shadow-white/5">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-medium text-black/45 dark:text-white/45">{project.repo}</p>
									<h2 className="mt-3 text-3xl font-bold tracking-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-300">{project.name}</h2>
								</div>
								<div className="rounded-2xl border border-black/10 bg-white/35 p-3 dark:border-white/10 dark:bg-white/10">
									<FolderGit2 className="h-6 w-6" />
								</div>
							</div>
							<p className="mt-5 text-lg font-medium text-black/75 dark:text-white/75">{project.tagline}</p>
							<p className="mt-4 flex-1 text-sm leading-7 text-black/60 dark:text-white/60">{project.description}</p>
							<div className="mt-6 flex flex-wrap gap-2">
								{project.highlights.map((highlight) => (
									<span key={highlight} className="rounded-full border border-black/10 bg-white/35 px-3 py-1 text-xs text-black/55 dark:border-white/10 dark:bg-white/10 dark:text-white/55">{highlight}</span>
								))}
							</div>
							<div className="mt-7 flex flex-wrap gap-3">{(project.name === "JYACS" || project.name === "cfRelay") && <a href={`/${locale}/projects/${project.name === "JYACS" ? "JYACS" : "cfrelay"}`} className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">项目网站 ↗</a>}<a href={project.href} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 bg-black px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/80 dark:border-white/10 dark:bg-white dark:text-black dark:hover:bg-white/85">
								{t("github")}
								<ExternalLink className="h-4 w-4" />
							</a></div>
						</article>
					))}
				</section>
			</main>
		</div>
	);
}
