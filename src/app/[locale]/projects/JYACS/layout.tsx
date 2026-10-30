
import type { Metadata } from "next";
import Link from "next/link";
import "./jyacs.css";
export const metadata: Metadata = {
 title: { default: "JYACS · 与优里开启新的对话", template: "%s | JYACS" },
 description: "JYACS — Just Yuri 的开源 AI 对话 Submod。安装指南、配置说明、版本历史、常见问题与项目资料。",
};
const links=[["","首页"],["install","安装与配置"],["versions","版本历史"],["features","功能介绍"],["cloud-compute","Cloud Compute"],["faq","常见问题"],["privacy","隐私与守则"],["about","关于项目"]];
export default async function JYACSLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){
 const {locale}=await params; const base=`/${locale}/projects/JYACS`;
 return <div className="jyacs-site"><header className="jyacs-header"><div className="jyacs-wrap jyacs-nav"><Link href={base} className="jyacs-brand">JYACS<small>JUST YURI AI CHAT SUBMOD</small></Link><nav className="jyacs-links" aria-label="JYACS 网站导航">{links.map(([path,label])=><Link key={path} href={path?`${base}/${path}`:base}>{label}</Link>)}</nav></div></header>{children}<footer className="jyacs-footer"><div className="jyacs-wrap">© JYACS Dev · 与 Team Salvato、JustYuriDev 无官方关联 · <a href="https://github.com/Panghu1102/JYACS" target="_blank" rel="noopener noreferrer">GitHub 源代码</a> · <Link href={`/${locale}/projects`}>返回 Panghu Projects</Link></div></footer></div>
}
