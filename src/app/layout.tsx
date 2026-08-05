import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import "./globals.css";

const themeScript = `
(function () {
	try {
		var key = "next-blog-theme";
		var mode = localStorage.getItem(key) || "auto";
		var hour = new Date().getHours();
		var timedTheme = hour >= 7 && hour < 19 ? "light" : "dark";
		var theme = mode === "light" || mode === "dark" ? mode : timedTheme;
		document.documentElement.classList.toggle("dark", theme === "dark");
		document.documentElement.dataset.themeMode = mode;
		document.documentElement.style.colorScheme = theme;
	} catch (_) {}
})();
`;

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("metadata");

	return {
		title: t("title"),
		description: t("description"),
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const messages = await getMessages();
	return (
		<html lang={locale} suppressHydrationWarning>
			<body className="antialiased">
				<NextIntlClientProvider messages={messages}>
					<script dangerouslySetInnerHTML={{ __html: themeScript }} />
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
