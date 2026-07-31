import { ArrowLeft, ExternalLink, FolderGit2, Sparkles } from "lucide-react";
import Link from "next/link";

const projects = [
	{
		name: "JYACS",
		repo: "Panghu1102/JYACS",
		href: "https://github.com/Panghu1102/JYACS",
		tagline: "围绕自动化与实用工具构建的项目集合。",
		description:
			"JYACS 是一个面向实际使用场景打磨的开发项目，关注清晰的功能组织、稳定的运行体验，以及从日常需求出发的自动化能力。适合继续沉淀为可复用的工具链或学习样例。",
		highlights: ["GitHub 开源项目", "实用工具导向", "持续迭代"],
	},
	{
		name: "cfRelay",
		repo: "Panghu1102/cfRelay",
		href: "https://github.com/Panghu1102/cfRelay",
		tagline: "基于 Cloudflare 生态的轻量级 Relay 项目。",
		description:
			"cfRelay 聚焦轻量部署与网络请求转发场景，适合用于探索 Cloudflare Workers 相关能力。项目强调低维护成本、便捷部署和清晰的配置方式。",
		highlights: ["Cloudflare 相关", "轻量部署", "请求转发"],
	},
];

export default function ProjectsPage() {
	return (
		<div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
			<main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-24">
				<nav className="mb-10 flex items-center justify-between rounded-2xl border border-black/10 bg-white/20 px-5 py-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
					<Link href="/" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-black/65 transition hover:bg-black/5 hover:text-black dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white">
						<ArrowLeft className="h-4 w-4" />
						返回主页
					</Link>
					<span className="text-lg font-semibold">Panghu Projects</span>
				</nav>

				<section className="rounded-3xl border border-black/10 bg-white/40 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/40 sm:p-10">
					<div className="max-w-3xl">
						<p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/35 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-black/45 dark:border-white/10 dark:bg-white/10 dark:text-white/45">
							<Sparkles className="h-4 w-4" />
							Projects
						</p>
						<h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">项目展示</h1>
						<p className="mt-5 text-base leading-8 text-black/60 dark:text-white/60">
							这里收录了我正在维护或持续探索的项目。每个项目都以资料卡形式展示名称、简介、技术方向与仓库入口，方便快速了解项目定位。
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
							<a href={project.href} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-black px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/80 dark:border-white/10 dark:bg-white dark:text-black dark:hover:bg-white/85">
								查看 GitHub 仓库
								<ExternalLink className="h-4 w-4" />
							</a>
						</article>
					))}
				</section>
			</main>
		</div>
	);
}
