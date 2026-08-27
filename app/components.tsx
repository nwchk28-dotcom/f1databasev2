import Link from "next/link";

const nav = [
  ["ランキング", "/rankings"], ["ドライバー", "/drivers"], ["チーム", "/teams"],
];

export function SiteHeader() {
  return <header className="site-header"><div className="wrap header-inner">
    <Link className="brand" href="/" aria-label="F1 Archive ホーム"><span>F1</span> ARCHIVE <small>1950—2025</small></Link>
    <nav aria-label="主要ナビゲーション">{nav.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
  </div></header>;
}

export function SiteFooter() {
  return <footer><div className="wrap footer-grid"><div className="brand footer-brand"><span>F1</span> ARCHIVE</div><p>非公式の歴史データベース。Formula 1、F1および関連する標章は各権利者に帰属します。</p><p className="footer-right">対象期間 1950—2025<br />最終データ確認 2026.08</p></div></footer>;
}

export function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <section className="page-intro wrap"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{copy}</p></section>;
}

export function SourceNote({ children }: { children: React.ReactNode }) {
  return <aside className="source-note"><strong>DATA NOTE</strong><p>{children}</p></aside>;
}
