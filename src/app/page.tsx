import { Mail } from "lucide-react";

export default function Home() {
	const contacts = [
		{ name: "Email", icon: Mail, value: "example@email.com" },
		{ name: "小红书", icon: null, value: "待填写" },
		{ name: "贴吧", icon: null, value: "待填写" },
		{ name: "GitHub", icon: null, value: "Panghu1102" },
	];

	return (
		<div className="min-h-screen bg-white text-black transition-colors dark:bg-black dark:text-white">
			<header className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2">
				<nav className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/20 px-6 py-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
					<div className="text-lg font-semibold">Panghu Blog</div>
					<div className="flex gap-2">
						{["Home", "Blog", "Projects", "About"].map((item) => (
							<a key={item} href="#" className="rounded-xl px-4 py-2 text-sm transition-all hover:bg-black/5 hover:shadow-[0_0_25px_rgba(0,0,0,0.18)] dark:hover:bg-white/10 dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]">
								{item}
							</a>
						))}
					</div>
				</nav>
			</header>

			<main className="flex min-h-screen flex-col items-center px_6 pt-32">
				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Welcome to my blog</h1>
				<p className="mt-4 text-base text-black/60 dark:text-white/60">A modern blog built with Next.js</p>

				<section className="mt-12 w-full max-w-4xl rounded-3xl border border-black/10 bg-white/40 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
					<div className="flex flex-col gap-8 md:flex-row md:items-center">
						<div className="flex justify-center md:justify-start">
							<div className="h-36 w-36 overflow-hidden rounded-full border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
								<img src="/avatar/avatar.jpg" alt="Avatar" className="h-full w-full object-cover" />
							</div>
						</div>

						<div className="flex-1 space-y-3">
							{contacts.map(({ name, icon: Icon, value }) => (
								<div key={name} className="flex items-center gap-3 text-sm">
									{Icon && <Icon className="h-5 w-5" />}
									<span className="font-medium">{name}</span>
									<span className="text-black/60 dark:text-white/60">{value}</span>
								</div>
							))}
						</div>
					</div>

					<div className="mt-8 border-t border-black/10 pt-6 dark:border-white/10">
						<h2 className="text-xl font-semibold">关于我</h2>
						<div className="mt-3 space-y-3 text-black/60 dark:text-white/60">
							<p>你好，欢迎来到我的网站。</p>
							<p>我是一名开发爱好者，主要关注编程、计算机技术以及和 AI 的方向。常用 Python 和 JavaScript 进行开发，也会探索各种有趣的技术栈和工具，把想法变成可以实际运行的项目。</p>
							<p>这些项目通常从一个小想法开始，然后一步步打磨成完整功能。</p>
							<p>这个网站主要用来记录我的项目、实验和技术笔记，也会分享一些开发过程中的思考与经验。这里的内容更多偏实践导向，关注“如何实现”和“如何优化”。</p>
							<p>如果你也对开发、技术探索或创意编程感兴趣，希望这里的内容能对你有启发。</p>
							<p>如果需要帮助的话，也欢迎致信。</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
