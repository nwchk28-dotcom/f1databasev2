import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader, SourceNote } from "../../components";
import portal from "../../data/portal.json";

export const dynamicParams = false;
export function generateStaticParams() { return portal.teams.map((team) => ({ id: team.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const team = portal.teams.find((entry) => entry.id === id);
  return { title: team?.name ?? "チーム" };
}

export default async function TeamDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = portal.teams.find((entry) => entry.id === id);
  if (!team) notFound();
  return <><SiteHeader/><main><section className="record-hero wrap"><p className="eyebrow">ACTIVE TEAM LINEAGE</p><h1>{team.name}</h1><p>{team.nationality}</p></section>
    <section className="wrap record-summary"><dl><div><dt>系譜の参戦年</dt><dd className="text-value">{team.firstYear}—現在</dd></div><div><dt>系譜通算優勝</dt><dd>{team.wins}</dd></div><div><dt>コンストラクター王座</dt><dd>{team.titles}</dd></div><div><dt>現チーム国籍</dt><dd className="text-value">{team.nationality}</dd></div></dl></section>
    <section className="section wrap"><div className="section-head"><p className="eyebrow">LINEAGE</p><h2>チームの系譜</h2></div><ol className="career-lineage team-lineage-list">{team.lineage.map((entry)=><li key={`${entry.id}-${entry.from}`}><span>{entry.from}—{entry.to ?? "現在"}</span><strong>{entry.name}</strong></li>)}</ol><SourceNote>優勝数とタイトル数は、このページに示した系譜内のコンストラクターを合算。サイトの戦績対象は2025年終了時点です。</SourceNote></section>
  </main><SiteFooter/></>;
}
