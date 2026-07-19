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
			<motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
				<header className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2">
					<nav className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/20 px-6 py-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
						<div className="text-lg font-semibold">Panghu Blog</div>
						<div className="flex gap-2">
							{["Home", "Blog", "Projects", "About"].map((item) => (
								<a key={item} href={item === "Blog" ? "/posts" : "#"} className="rounded-xl px-4 py-2 text-sm transition-all hover:bg-black/5 dark:hover:bg-white/10">{item}</a>
							))}
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
						<div className="mt-8 border-t border-black/10 pt-6 dark:border-white/10"><button onClick={()=>setExpanded(!expanded)} className="flex w-full items-center justify-between text-xl font-semibold">关于我<motion.span animate={{rotate: expanded ? 180 : 0}}><ChevronDown /></motion.span></button></div>
					</motion.section>
				</main>
			</motion.div>
		</div>
	);
}
