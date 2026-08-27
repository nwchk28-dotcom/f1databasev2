import Link from "next/link";
import { PageIntro, SiteFooter, SiteHeader, SourceNote } from "../components";
import portal from "../data/portal.json";
import { TeamRecordLink } from "../record-links";

type Metric = "wins" | "starts" | "pointsFinishes" | "podiums" | "titles";
type Driver = (typeof portal.rankings.drivers.wins)[number];
type Constructor = (typeof portal.rankings.constructors.wins)[number];

const categories: Array<{ metric: Metric; label: string; en: string }> = [
  { metric: "wins", label: "優勝数", en: "WINS" },
  { metric: "starts", label: "出走数", en: "STARTS" },
  { metric: "pointsFinishes", label: "入賞数", en: "POINTS FINISHES" },
  { metric: "podiums", label: "表彰台数", en: "PODIUMS" },
  { metric: "titles", label: "タイトル数", en: "CHAMPIONSHIPS" },
];

function DriverRanking({ entries, metric }: { entries: Driver[]; metric: Metric }) {
  return <div className="ranking-block"><div className="ranking-label"><span>DRIVERS</span><h3>ドライバー</h3></div><table><thead><tr><th>順位</th><th>名称</th><th>記録</th></tr></thead><tbody>{entries.map((entry,index)=><tr key={entry.id}><td>{index+1}</td><td><Link className="record-link" href={`/drivers/${entry.id}`}>{entry.name}</Link><small>{entry.nationality}</small></td><td>{entry[metric]}</td></tr>)}</tbody></table></div>;
}

function ConstructorRanking({ entries, metric }: { entries: Constructor[]; metric: Metric }) {
  return <div className="ranking-block"><div className="ranking-label"><span>CONSTRUCTORS</span><h3>コンストラクター</h3></div><table><thead><tr><th>順位</th><th>名称</th><th>記録</th></tr></thead><tbody>{entries.map((entry,index)=><tr key={entry.id}><td>{index+1}</td><td><TeamRecordLink id={entry.id} name={entry.name}/><small>{entry.linkId ? "継続中の系譜" : "系譜終了"}</small></td><td>{entry[metric]}</td></tr>)}</tbody></table></div>;
}

export default function Rankings(){return <><SiteHeader/><main><PageIntro eyebrow="ALL-TIME RECORDS · 1950—2025" title="ランキング" copy="優勝・出走・入賞・表彰台・タイトルの5項目を、ドライバーとコンストラクターで比較します。"/>
  <nav className="wrap anchor-row" aria-label="ランキング項目">{categories.map((category)=><a href={`#${category.metric}`} key={category.metric}>{category.label}</a>)}</nav>
  {categories.map((category,index)=><section className={`section ranking-category ${index%2 ? "muted-section" : ""}`} id={category.metric} key={category.metric}><div className="wrap"><div className="section-head inline"><div><p className="eyebrow">{category.en}</p><h2>{category.label}</h2></div><p>TOP 50</p></div><div className="ranking-pair ranking-pair-section"><DriverRanking entries={portal.rankings.drivers[category.metric]} metric={category.metric}/><ConstructorRanking entries={portal.rankings.constructors[category.metric]} metric={category.metric}/></div></div></section>)}
  <div className="wrap ranking-note"><SourceNote>「入賞」はポイントを獲得した決勝結果、「表彰台」は決勝3位以内です。コンストラクターの入賞・表彰台は車両1台ごとの結果を数え、出走は参戦グランプリ数を数えます。0件の同率記録はランキングから除外しています。</SourceNote></div>
  </main><SiteFooter/></>}
