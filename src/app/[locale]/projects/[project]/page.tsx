import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Code2, Sparkles } from "lucide-react";
import { getProjectDetail, projectDetails } from "@/lib/project-microsites";
import { notFound } from "next/navigation";
import "./microsites.css";

export function generateStaticParams() { return projectDetails.map((p) => ({ project: p.slug })); }

export default async function ProjectMicrosite({ params }: { params: Promise<{locale:string;project:string}> }) {
 const {locale,project}=await params;
 const p=getProjectDetail(project); if(!p) notFound();
 const root=`/${locale}/projects/${p.slug}`;
 return <main className={`micro micro--${p.palette}`} style={{"--micro-accent":p.accent} as CSSProperties}>
  <div className="micro-glow" aria-hidden="true"/><div className="micro-shell">
   <nav className="micro-nav" aria-label="项目导航"><Link href={`/${locale}/projects`} className="micro-back"><ArrowLeft size={16}/> Projects</Link><span className="micro-brand">{p.name}</span><a href={`https://github.com/Panghu1102/${p.repo}`} target="_blank" rel="noopener noreferrer" className="micro-github"><Code2 size={16}/> <span>Source</span><ArrowUpRight size={14}/></a></nav>
   <header className="micro-hero"><div className="micro-copy"><p className="micro-eyebrow"><span className="micro-pulse"/> {p.label}</p><h1>{p.headline}</h1><p className="micro-lead">{p.lead}</p><div className="micro-actions"><Link className="micro-primary" href={root+"/"+p.chapters[0].slug}>深入了解 <ArrowUpRight size={18}/></Link><a href={`https://github.com/Panghu1102/${p.repo}`} target="_blank" rel="noopener noreferrer" className="micro-secondary">查看源代码 <Code2 size={17}/></a></div><div className="micro-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div>
   <div className="micro-art" aria-hidden="true"><div className="micro-art-orbit one"/><div className="micro-art-orbit two"/><div className="micro-art-core"><Sparkles size={48} strokeWidth={1}/><span>{p.name}</span></div><div className="micro-art-caption">OPEN SOURCE / PANGHU1102</div></div></header>
   <section className="micro-facts" aria-label="项目概览">{p.facts.map(f=><div key={f.label}><span>{f.label}</span><strong>{f.value}</strong></div>)}</section>
   <section className="micro-section"><div className="micro-section-label">01 / DISCOVER</div><div className="micro-heading"><h2>不止一个介绍页面。</h2><p>深入了解项目的功能、技术实现、使用方式与发展状态。</p></div><div className="micro-grid">{p.chapters.map((c,i)=><Link key={c.slug} href={root+"/"+c.slug} className="micro-card"><span className="micro-card-num">0{i+1} / {c.slug.toUpperCase()}</span><h3>{c.title}</h3><p>{c.intro}</p><span className="micro-card-arrow"><ArrowRight size={21}/></span></Link>)}</div></section>
   <section className="micro-end"><span>02 / EXPLORE MORE</span><h2>从想法开始，<br/>让项目持续生长。</h2><div><Link href={`/${locale}/projects`}>浏览其他项目 <ArrowRight size={18}/></Link><a href={`https://github.com/Panghu1102/${p.repo}`} target="_blank" rel="noopener noreferrer">前往 GitHub <ArrowUpRight size={18}/></a></div></section>
   <footer className="micro-footer"><span>© Panghu1102 · Project showcase</span><Link href={`/${locale}/projects`}>Back to projects ↑</Link></footer>
  </div>
 </main>;
}
