import Link from "next/link";
import { SiteFooter, SiteHeader, SourceNote } from "./components";
import portal from "./data/portal.json";
import { TeamRecordLink } from "./record-links";

export default function Home() {
  return <><SiteHeader /><main>
    <section className="ranking-hero wrap">
      <p className="eyebrow">ALL-TIME RANKING · 1950—2025</p>
      <div className="ranking-title"><h1>歴代ランキング</h1><p>名前を選ぶと、Top 50ドライバーの個別記録、または現在まで続くチームの系譜へ移動します。</p></div>
    </section>
    <section className="wrap ranking-pair" aria-label="歴代ランキング">
      <div className="ranking-block"><div className="ranking-label"><span>01</span><h2>ドライバー通算優勝</h2></div><table><thead><tr><th>順位</th><th>ドライバー</th><th>優勝</th></tr></thead><tbody>{portal.rankings.drivers.wins.map((driver,index)=><tr key={driver.id}><td>{String(index+1).padStart(2,"0")}</td><td><Link className="record-link" href={`/drivers/${driver.id}`}>{driver.name}</Link><small>{driver.nationality}</small></td><td>{driver.wins}</td></tr>)}</tbody></table></div>
      <div className="ranking-block"><div className="ranking-label"><span>02</span><h2>コンストラクター通算優勝</h2></div><table><thead><tr><th>順位</th><th>コンストラクター</th><th>優勝</th></tr></thead><tbody>{portal.rankings.constructors.wins.map((team,index)=><tr key={team.id}><td>{String(index+1).padStart(2,"0")}</td><td><TeamRecordLink id={team.id} name={team.name}/><small>{team.linkId ? `現系譜：${portal.teams.find((entry)=>entry.id===team.linkId)?.name}` : "系譜終了"}</small></td><td>{team.wins}</td></tr>)}</tbody></table></div>
    </section>
    <div className="wrap"><SourceNote>Top 50はグランプリ通算優勝数で順位付け。同数の場合はタイトル数、名称順です。終了したチーム系譜はリンクにせず、現在まで続く系譜だけを個別ページへ接続します。</SourceNote></div>
    <section className="section wrap"><div className="section-head"><p className="eyebrow">CONTINUE</p><h2>記録を辿る</h2></div><div className="metric-links"><Link href="/drivers"><span>TOP 50</span><strong>ドライバー一覧</strong><b>→</b></Link><Link href="/teams"><span>ACTIVE LINEAGES</span><strong>継続中のチーム系譜</strong><b>→</b></Link><Link href="/rankings"><span>FULL TABLE</span><strong>ランキングページ</strong><b>→</b></Link></div></section>
  </main><SiteFooter /></>;
}
