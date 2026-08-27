# F1 ARCHIVE

1950〜2025年の確定済み記録を扱う、静的なF1歴史データベースです。

## ローカル確認

Node.js 22以降を使用します。

```bash
npm ci
npm run dev
```

## GitHub Pages

`main`ブランチへpushすると、`.github/workflows/deploy-pages.yml`が静的HTMLを生成してGitHub Pagesへ公開します。GitHubリポジトリの **Settings → Pages → Source** は **GitHub Actions** を選択してください。

リポジトリ名によるサブパスは公開処理が自動設定します。ローカルで同じ静的出力を確認する場合は次を実行します。

```bash
NEXT_PUBLIC_BASE_PATH=/リポジトリ名 npm run build:github
```

生成物は`out/`に出力されます。

## データ範囲

- 対象シーズン: 1950〜2025年
- ドライバー詳細: 通算優勝Top 50
- チーム詳細: 通算優勝Top 50に登場し、現在も系譜が続く9チーム
- 主要データ: Jolpica F1 APIおよびf1db CSV（2025年までに固定）
