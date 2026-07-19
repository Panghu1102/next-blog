"use client";

import { Mail, ChevronDown, ExternalLink, CalendarDays, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getAllPosts } from "@/lib/posts";
import { useState } from "react";

export default function Home() {
	const [expanded, setExpanded] = useState(false);

	const contacts = [
		{ name: "Email", icon: Mail, value: "example@email.com" },
		{ name: "小红书", icon: ExternalLink, value: "待填写" },
		{ name: "贴吧", icon: ExternalLink, value: "待填写" },
		{ name: "GitHub", icon: ExternalLink, value: "Panghu1102" },
	];

	const latestPosts = getAllPosts()
		.filter((post) => !post.pinned && !post.title.includes("必读！关于本博客的相关信息"))
		.slice(0, 4);

	const aboutParagraphs = [
		"你好，欢迎来到我的网站。",
		"我是一名开发爱好者，主要关注编程、计算机技术以及和 AI 的方向。常用 Python 和 JavaScript 进行开发，也会探索各种有趣的技术栈和工具，把想法变成可以实际运行的项目。",
		"这些项目通常从一个小想法开始，然后一步步打磨成完整功能。",
		"这个网站主要用来记录我的项目、实验和技术笔记，也会分享一些开发过程中的思考与经验。这里的内容更多偏实践导向，关注“如何实现”和“如何优化”。",
		"如果你也对开发、技术探索或创意编程感兴趣，希望这里的内容能对你有启发。",
		"如果需要帮助的话，也欢迎致信。",
	];

	return (
		<div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
			<motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
				<header className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2">
					<nav className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/20 px-6 py-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
						<div className="text-lg font-semibold">Panghu Blog</div>
						<div className="flex items-center gap-2">
							{["Home", "Blog", "Projects", "About"].map((item) => (
								<a key={item} href={item === "Blog" ? "/posts" : "#"} className="rounded-xl px-4 py-2 text-sm transition-all hover:bg-black/5 dark:hover:bg-white/10">{item}</a>
							))}
							<ThemeToggle />
						</div>
					</nav>
				</header>
				<main className="flex min-h-screen flex-col items-center px-6 pt-32">
					<motion.h1 initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}} className="text-4xl font-bold tracking-tight sm:text-5xl">Welcome to my blog</motion.h1>
					<p className="mt-4 text-base text-black/60 dark:text-white/60">A modern blog built with Next.js</p>
					<motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="mt-12 w-full max-w-4xl rounded-3xl border border-black/10 bg-white/40 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
						<div className="flex flex-col gap-8 md:flex-row md:items-center">
							<div className="flex justify-center md:justify-start"><div className="h-36 w-36 overflow-hidden rounded-full border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5"><img src="/avatar/avatar.jpg" alt="Avatar" className="h-full w-full object-cover" /></div></div>
							<div className="flex-1 space-y-3">{contacts.map(({name,icon:Icon,value})=>(<div key={name} className="flex items-center gap-3 text-sm"><Icon className="h-5 w-5"/><span className="font-medium">{name}</span><span className="text-black/60 dark:text-white/60">{value}</span></div>))}</div>
						</div>
						<div className="mt-8 border-t border-black/10 pt-6 dark:border-white/10">
							<button onClick={()=>setExpanded(!expanded)} className="flex w-full items-center justify-between text-xl font-semibold">
								关于我
								<motion.span animate={{rotate: expanded ? 180 : 0}}><ChevronDown /></motion.span>
							</button>
							<AnimatePresence initial={false}>
								{expanded ? (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.35, ease: "easeOut" }}
										className="overflow-hidden"
									>
										<div className="mt-5 space-y-4 rounded-2xl border border-black/10 bg-white/35 p-5 text-sm leading-7 text-black/65 shadow-inner dark:border-white/10 dark:bg-white/5 dark:text-white/65 sm:text-base">
											{aboutParagraphs.map((paragraph) => (
												<p key={paragraph}>{paragraph}</p>
											))}
										</div>
									</motion.div>
								) : null}
							</AnimatePresence>
						</div>
					</motion.section>
					<motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: 0.05 }} className="mt-8 w-full max-w-4xl rounded-3xl border border-black/10 bg-white/40 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<p className="text-sm font-medium uppercase tracking-[0.35em] text-black/45 dark:text-white/45">Fresh Notes</p>
								<h2 className="mt-3 text-3xl font-bold tracking-tight">最新的帖子！</h2>
							</div>
							<Link href="/posts" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/30 px-4 py-2 text-sm font-medium text-black/65 transition hover:bg-black/5 hover:text-black dark:border-white/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15 dark:hover:text-white">
								更多内容
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
						<div className="mt-6 grid gap-4 sm:grid-cols-2">
							{latestPosts.length > 0 ? latestPosts.map((post, index) => (
								<motion.div key={post.slug} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }}>
									<Link href={`/posts/${post.slug}`} className="group block h-full rounded-2xl border border-black/10 bg-white/35 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-xl hover:shadow-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:shadow-white/5">
										{post.date ? (<span className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1 text-xs text-black/55 dark:border-white/10 dark:text-white/55"><CalendarDays className="h-3.5 w-3.5" />{post.date}</span>) : null}
										<h3 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-indigo-500 dark:group-hover:text-indigo-300">{post.title}</h3>
										<p className="mt-2 line-clamp-3 text-sm leading-6 text-black/60 dark:text-white/60">{post.description}</p>
									</Link>
								</motion.div>
							)) : (
								<p className="rounded-2xl border border-black/10 bg-white/35 p-5 text-sm text-black/55 dark:border-white/10 dark:bg-white/5 dark:text-white/55 sm:col-span-2">暂时还没有可展示的最新文章。</p>
							)}
						</div>
					</motion.section>
				</main>
			</motion.div>
		</div>
	);
}
