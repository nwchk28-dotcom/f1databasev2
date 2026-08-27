import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: { default: "F1 ARCHIVE — F1歴史データベース", template: "%s | F1 ARCHIVE" },
  description: "1950年から2025年まで、結果を確認したF1シーズンを記録から振り返る日本語データベース。",
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body id="top">{children}</body></html>;
}
