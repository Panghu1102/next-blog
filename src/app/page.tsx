export default function Home() {
	return (
		<div className="min-h-screen bg-white text-black transition-colors dark:bg-black dark:text-white">
			<header className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2">
				<nav className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/40 px-6 py-3 shadow-lg backdrop-blur-xl transition-all dark:border-white/10 dark:bg-black/40">
					<div className="text-lg font-semibold tracking-tight">Panghu Blog</div>

					<div className="flex gap-2">
						{["Home", "Blog", "Projects", "About"].map((item) => (
							<a
								key={item}
								href="#"
								className="group relative rounded-xl px-4 py-2 text-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
							>
								<span className="relative z-10">{item}</span>
								<span className="absolute inset-0 -z-0 rounded-xl bg-black/5 opacity-0 blur-xl transition-opacity group-hover:opacity-100 dark:bg-white/10" />
							</a>
						))}
					</div>
				</nav>
			</header>

			<main className="flex min-h-screen items-center justify-center px-6">
				<section className="text-center">
					<h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
						Welcome to my blog
					</h1>
					<p className="mt-6 text-lg text-black/60 dark:text-white/60">
						A modern blog built with Next.js
					</p>
				</section>
			</main>
		</div>
	);
}
