import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader, SourceNote } from "../../components";
import portal from "../../data/portal.json";
import { TeamRecordLink } from "../../record-links";

export const dynamicParams = false;
export function generateStaticParams() { return portal.drivers.map((driver) => ({ id: driver.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const driver = portal.drivers.find((entry) => entry.id === id);
  return { title: driver?.name ?? "ドライバー" };
}

export default async function DriverDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const driver = portal.drivers.find((entry) => entry.id === id);
  if (!driver) notFound();
  return <><SiteHeader/><main><section className="record-hero wrap"><p className="eyebrow">DRIVER RECORD · 1950—2025</p><h1>{driver.name}</h1><p>{driver.nationality}</p></section>
    <section className="wrap record-summary"><dl><div><dt>決勝出走</dt><dd>{driver.starts}</dd></div><div><dt>優勝</dt><dd>{driver.wins}</dd></div><div><dt>タイトル</dt><dd>{driver.titles}</dd></div><div><dt>デビュー年</dt><dd>{driver.debutYear}</dd></div><div><dt>最終年</dt><dd>{driver.finalYear}</dd></div><div><dt>国籍</dt><dd className="text-value">{driver.nationality}</dd></div></dl></section>
    <section className="section wrap"><div className="section-head"><p className="eyebrow">TEAM HISTORY</p><h2>所属チーム遍歴</h2></div><ol className="career-lineage">{driver.teams.map((team)=><li key={`${team.id}-${team.from}`}><span>{team.from}—{team.to}</span><strong><TeamRecordLink id={team.id} name={team.name}/></strong>{team.linkId && <small>現在の系譜へ →</small>}</li>)}</ol><SourceNote>チーム名は当時のコンストラクター名を表示。現在へ続く系譜だけをリンクにしています。</SourceNote></section>
  </main><SiteFooter/></>;
}
