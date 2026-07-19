"use client";

import Giscus from "@giscus/react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function GiscusComments() {
	return (
		<motion.section
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.55, ease: "easeOut" }}
			className="giscus-comments mx-auto mt-8 w-full max-w-3xl rounded-3xl border border-black/10 bg-white/55 p-6 shadow-2xl shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-black/50 dark:shadow-white/5 sm:p-8"
		>
			<div className="mb-5 flex items-center gap-3 border-b border-black/10 pb-5 dark:border-white/10">
				<span className="rounded-2xl bg-black/5 p-2 dark:bg-white/10">
					<MessageCircle className="h-5 w-5" />
				</span>
				<div>
					<h2 className="text-xl font-semibold tracking-tight">评论</h2>
					<p className="mt-1 text-sm text-black/55 dark:text-white/55">欢迎使用 GitHub 账号参与讨论。</p>
				</div>
			</div>
			<div className="giscus min-h-32">
				<Giscus
					repo="Panghu1102/next-blog"
					repoId="R_kgDOTbobPw"
					category="Announcements"
					categoryId="DIC_kwDOTbobP84DBhis"
					mapping="pathname"
					strict="0"
					reactionsEnabled="1"
					emitMetadata="0"
					inputPosition="top"
					theme="preferred_color_scheme"
					lang="zh-CN"
					loading="lazy"
				/>
			</div>
		</motion.section>
	);
}
