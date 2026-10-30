"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function JYACSMotion() {
 const pathname = usePathname();
 useEffect(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const root = document.querySelector(".jyacs-site");
  if (!root || !("IntersectionObserver" in window)) return;
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(
   ".jyacs-hero > *, .jyacs-section > .jyacs-kicker, .jyacs-section > h2, .jyacs-grid > *, .jyacs-section > .jyacs-card, .jyacs-inner > .jyacs-kicker, .jyacs-inner > h1, .jyacs-inner > h2, .jyacs-inner > .jyacs-version, .jyacs-inner > .jyacs-note"
  ));
  const observer = new IntersectionObserver(entries => {
   for (const entry of entries) if (entry.isIntersecting) {
    entry.target.classList.add("jyacs-revealed");
    observer.unobserve(entry.target);
   }
  }, { threshold: 0.08, rootMargin: "0px 0px 45px 0px" });
  for (const node of nodes) {
   node.classList.add("jyacs-reveal-ready");
   observer.observe(node);
  }
  return () => {
   observer.disconnect();
   for (const node of nodes) node.classList.remove("jyacs-reveal-ready", "jyacs-revealed");
  };
 }, [pathname]);
 return null;
}
