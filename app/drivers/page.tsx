import Link from "next/link";
import { PageIntro, SiteFooter, SiteHeader, SourceNote } from "../components";
import portal from "../data/portal.json";

export default function Drivers() {
  return <><SiteHeader /><main><PageIntro eyebrow={`RANKED DRIVER RECORDS · ${portal.drivers.length}`} title="ドライバー" copy="5種類のランキングのいずれかでTop 50に入ったドライバーを収録。各行から個別ページへ移動できます。" />
    <section className="section wrap"><div className="table-wrap"><table><thead><tr><th>順位</th><th>ドライバー</th><th>国籍</th><th>出走</th><th>優勝</th><th>王座</th><th>参戦期間</th></tr></thead><tbody>{portal.drivers.map((driver,index)=><tr key={driver.id}><td>{index+1}</td><td><Link className="record-link" href={`/drivers/${driver.id}`}>{driver.name}</Link></td><td>{driver.nationality}</td><td>{driver.starts}</td><td>{driver.wins}</td><td>{driver.titles}</td><td>{driver.debutYear}—{driver.finalYear}</td></tr>)}</tbody></table></div><SourceNote>個別ページは、優勝・出走・入賞・表彰台・タイトルのいずれかでTop 50に入った人物に限定しています。記録値は2025年終了時点です。</SourceNote></section>
  </main><SiteFooter /></>;
}
