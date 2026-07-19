"use client";

import { motion } from "framer-motion";
import { Moon, Sparkles, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ThemeMode = "auto" | "light" | "dark";

const storageKey = "next-blog-theme";

function getTimedTheme() {
	const hour = new Date().getHours();
	return hour >= 7 && hour < 19 ? "light" : "dark";
}

function applyTheme(mode: ThemeMode) {
	const resolvedTheme = mode === "auto" ? getTimedTheme() : mode;
	document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
	document.documentElement.dataset.themeMode = mode;
	document.documentElement.style.colorScheme = resolvedTheme;
}

function getStoredTheme(): ThemeMode {
	if (typeof window === "undefined") {
		return "auto";
	}

	const storedTheme = window.localStorage.getItem(storageKey);
	return storedTheme === "light" || storedTheme === "dark" || storedTheme === "auto" ? storedTheme : "auto";
}

export function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>("auto");

	useEffect(() => {
		const storedTheme = getStoredTheme();
		setMode(storedTheme);
		applyTheme(storedTheme);

		const interval = window.setInterval(() => {
			if (getStoredTheme() === "auto") {
				applyTheme("auto");
			}
		}, 60_000);

		return () => window.clearInterval(interval);
	}, []);

	const current = useMemo(() => {
		if (mode === "auto") {
			return {
				label: "自动",
				Icon: Sparkles,
				next: "light" as ThemeMode,
			};
		}

		if (mode === "light") {
			return {
				label: "浅色",
				Icon: Sun,
				next: "dark" as ThemeMode,
			};
		}

		return {
			label: "深色",
			Icon: Moon,
			next: "auto" as ThemeMode,
		};
	}, [mode]);

	const handleToggle = () => {
		setMode(current.next);
		window.localStorage.setItem(storageKey, current.next);
		applyTheme(current.next);
	};

	return (
		<motion.button
			type="button"
			onClick={handleToggle}
			whileHover={{ scale: 1.04 }}
			whileTap={{ scale: 0.96 }}
			className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/30 px-3 py-2 text-xs font-medium text-black/70 shadow-sm backdrop-blur-xl transition hover:bg-black/5 dark:border-white/10 dark:bg-white/10 dark:text-white/75 dark:hover:bg-white/15"
			aria-label={`当前主题：${current.label}，点击切换`}
		>
			<motion.span
				key={mode}
				initial={{ rotate: -45, opacity: 0, scale: 0.75 }}
				animate={{ rotate: 0, opacity: 1, scale: 1 }}
				transition={{ duration: 0.25, ease: "easeOut" }}
			>
				<current.Icon className="h-4 w-4" />
			</motion.span>
			<span className="hidden sm:inline">{current.label}</span>
		</motion.button>
	);
}
