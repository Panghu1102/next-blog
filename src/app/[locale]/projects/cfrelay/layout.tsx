import type { Metadata } from "next";
import Link from "next/link";
import "./cfrelay.css";
import CfRelayMotion from "./motion";
export const metadata: Metadata = { title: { default: "cfRelay · AI API Gateway", template: "%s | cfRelay" }, description: "cfRelay — 基于 Cloudflare Workers 的开源 AI API 中继网关，支持双上游、管理控制台、配额与知识库。" };
const nav=[["","概览"],["features","功能"],["deploy","部署"],["reference","API 与配置"],["versions","版本"],["security","安全"]];
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}) {
 const {locale}=await params;const root=`/${locale}/projects/cfrelay`;
 return <div className="cfr-site"><div className="cfr-glow" aria-hidden="true"/><CfRelayMotion/><header className="cfr-top"><div className="cfr-wrap cfr-nav"><Link className="cfr-brand" href={root}><span className="cfr-mark">↗</span><span>cf<span className="cfr-accent">Relay</span><small>EDGE AI GATEWAY</small></span></Link><nav aria-label="cfRelay 页面导航">{nav.map(([path,label])=><Link key={path} href={path?`${root}/${path}`:root}>{label}</Link>)}</nav><a className="cfr-github" href="https://github.com/Panghu1102/cfRelay" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></header>{children}<footer className="cfr-footer"><div className="cfr-wrap"><span>cfRelay / Cloudflare Workers / Apache-2.0</span><div><Link href={`/${locale}/projects`}>返回项目列表</Link><a href="https://github.com/Panghu1102/cfRelay">Source ↗</a></div></div></footer></div>;
}