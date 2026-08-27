import Link from "next/link";
import { PageIntro, SiteFooter, SiteHeader, SourceNote } from "../components";
import portal from "../data/portal.json";

export default function Teams(){return <><SiteHeader/><main><PageIntro eyebrow="ACTIVE LINEAGES" title="チーム" copy="通算優勝Top 50に登場し、2026年現在も系譜が続いているチームだけを個別ページとして収録します。"/>
  <section className="section wrap"><div className="team-directory">{portal.teams.map((team)=><Link href={`/teams/${team.id}`} key={team.id}><span>{team.firstYear}—{team.finalYear === 2026 ? "現在" : team.finalYear}</span><strong>{team.name}</strong><small>{team.lineage.map((entry)=>entry.name).join(" → ")}</small><b>詳細 →</b></Link>)}</div><SourceNote>消滅したチームはランキング上に記録だけを残し、リンクや空の詳細ページは作成していません。</SourceNote></section>
</main><SiteFooter/></>}
