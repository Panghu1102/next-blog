import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/zh/about" } };

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
