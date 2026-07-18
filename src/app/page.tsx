"use client";

import { Mail, ChevronDown, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
	const [expanded, setExpanded] = useState(false);

	const contacts = [
		{ name: "Email", icon: Mail, value: "example@email.com" },
		{ name: "小红书", icon: ExternalLink, value: "待填写" },
		{ name: "贴吧", icon: ExternalLink, value: "待填写" },
		{ name: "GitHub", icon: ExternalLink, value: "Panghu1102" },
	];

	return (
		<div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
			<motion.div
				initial={{ opacity: 0, y: 24 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
			>
				<header className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2">
					<nav className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/20 px-6 py-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
						<div className="text-lg font-semibold">Panghu Blog</div>
						<div className="flex gap-2">
							{["Home", "Blog", "Projects", "About"].map((item) => (
								<a key={item} href="#" className="rounded-xl px-4 py-2 text-sm transition-all hover:bg-black/5 dark:hover:bg-white/10">{item}</a>
							))}
						</div>
					</nav>
				</header>

				<main className="flex min-h-screen flex-col items-center px-6 pt-32">
					<motion.h1 initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}} className="text-4xl font-bold tracking-tight sm:text-5xl">Welcome to my blog</motion.h1>
					<p className="mt-4 text-base text-black/60 dark:text-white/60">A modern blog built with Next.js</p>

					<motion.section
						whileInView={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 50 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.7 }}
						className="mt-12 w-full max-w-4xl rounded-3xl border border-black/10 bg-white/40 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/40"
					>
						<div className="flex flex-col gap-8 md:flex-row md:items-center">
							<div className="flex justify-center md:justify-start">
								<div className="h-36 w-36 overflow-hidden rounded-full border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
									<img src="/avatar/avatar.jpg" alt="Avatar" className="h-full w-full object-cover" />
								</div>
							</div>
							<div className="flex-1 space-y-3">
								{contacts.map(({ name, icon: Icon, value }) => (
									<div key={name} className="flex items-center gap-3 text-sm">
										<Icon className="h-5 w-5" />
										<span className="font-medium">{name}</span>
										<span className="text-black/60 dark:text-white/60">{value}</span>
									</div>
								))}
							</div>
						</div>

						<div className="mt-8 border-t border-black/10 pt-6 dark:border-white/10">
							<button onClick={() => setExpanded(!expanded)} className="flex w-full items-center justify-between text-xl font-semibold">
								关于我
								<motion.span animate={{rotate: expanded ? 180 : 0}}><ChevronDown /></motion.span>
							</button>

							<motion.div
								initial={false}
								animate={{ height: expanded ? "auto" : 90 }}
								className="relative mt-3 overflow-hidden"
							>
								<div className={!expanded ? "blur-sm opacity-70" : ""}>
									<div className="space-y-3 text-black/60 dark:text-white/60">
										<p>你好，欢迎来到我的网站。</p>
										<p>我是一名开发爱好者，主要关注编程、计算机技术以及 AI 方向。常用 Python 和 JavaScript 进行开发，也会探索各种有趣的技术栈和工具，把想法变成可以实际运行的项目。</p>
										<p>这些项目通常从一个小想法开始，然后一步步打磨成完整功能。</p>
										<p>这个网站主要用来记录我的项目、实验和技术笔记，也会分享开发过程中的思考与经验。</p>
										<p>如果你也对开发、技术探索或创意编程感兴趣，希望这里的内容能对你有所启发。</p>
									</div>
								</div>
								{!expanded && <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/70 to-transparent dark:from-black/70" />}
							</motion.div>
						</div>
					</motion.section>
				</main>
			</motion.div>
		</div>
	);
}
