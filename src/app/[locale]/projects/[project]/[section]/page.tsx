import Link from "next/link";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { getProjectDetail, projectDetails } from "@/lib/project-microsites";
import { notFound } from "next/navigation";
import "../microsites.css";

export function generateStaticParams() {
 return projectDetails.flatMap(p=>p.chapters.map(c=>({project:p.slug,section:c.slug})));
}
export async function generateMetadata({params}:{params:Promise<{locale:string;project:string;section:string}>}):Promise<Metadata>{
 const {project,section}=await params;const p=getProjectDetail(project);const c=p?.chapters.find(x=>x.slug===section);
 return {title:c?`${c.title} | ${p?.name}`:"Project",description:c?.intro};
}
export default async function Chapter({params}:{params:Promise<{locale:string;project:string;section:string}>}){
 const {locale,project,section}=await params;const p=getProjectDetail(project);const chapter=p?.chapters.find(c=>c.slug===section);
 if(!p||!chapter)notFound();
 const root=`/${locale}/projects/${p.slug}`;const index=p.chapters.indexOf(chapter);const next=p.chapters[(index+1)%p.chapters.length];
 return <main className={`micro micro--${p.palette} micro-chapter`} style={{"--micro-accent":p.accent} as CSSProperties}><div className="micro-glow" aria-hidden="true"/><div className="micro-shell">
 <nav className="micro-nav" aria-label="项目导航"><Link className="micro-back" href={root}><ArrowLeft size={16}/> {p.name}</Link><span className="micro-brand">{chapter.title}</span><a className="micro-github" target="_blank" rel="noopener noreferrer" href={`https://github.com/Panghu1102/${p.repo}`}><Github size={16}/> Source <ArrowUpRight size={14}/></a></nav>
 <header className="micro-chapter-hero"><p className="micro-eyebrow">PROJECT JOURNAL / 0{index+1}</p><h1>{chapter.title}<span>.</span></h1><p className="micro-lead">{chapter.intro}</p></header>
 <div className="micro-chapter-grid"><aside className="micro-sidebar"><span>EXPLORE / 目录</span>{p.chapters.map((c,i)=><Link key={c.slug} aria-current={c.slug===section?"page":undefined} href={root+"/"+c.slug}>0{i+1} · {c.title}</Link>)}<Link href={root} className="micro-home-link">返回项目首页 ↗</Link></aside><div className="micro-article">{chapter.blocks.map((b,i)=><section className="micro-article-card" key={b.title}><span>0{i+1} / {chapter.slug.toUpperCase()}</span><h2>{b.title}</h2><p>{b.body}</p></section>)}<div className="micro-article-next"><span>NEXT CHAPTER</span><Link href={root+"/"+next.slug}>{next.title} <ArrowRight size={20}/></Link></div></div></div>
 <footer className="micro-footer"><span>© Panghu1102 · {p.name}</span><Link href={`/${locale}/projects`}>全部项目 ↑</Link></footer></div></main>;
}
