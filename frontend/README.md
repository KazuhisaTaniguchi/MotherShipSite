# Mothership サイト（Next.js）

`mothershipremote.com` で公開する予定のサイトです。中身は WordPress（`api.mothershipremote.com`）から WPGraphQL で読み込みます。
作成：2026-11-20 Claude Code（Next.js 16.4.6、App Router、TypeScript）

## レンダリング：SSG（静的書き出し）

- `next.config.ts` で `output: "export"`。`npm run build` で、すべてのページが `out/` に HTML として書き出されます。
- WordPress の中身は **ビルドのときだけ** 読み込みます。記事を追加・更新したら、もう一度ビルドしてアップロードします。
- `trailingSlash: true` なので、`/news/1/` → `out/news/1/index.html`。Apache（エックスサーバー）にそのまま置けます。
- WPGraphQL が読めないときは、ビルドがエラーで止まります（空のサイトを書き出さないため）。

## URL

| URL | 中身 | ファイル |
|---|---|---|
| `/` | LP（`mock/design/index.html` を JSX にしたもの。WordPress は使わない） | `src/app/page.tsx` |
| `/news/` | お知らせの一覧（投稿・新しい順） | `src/app/news/page.tsx` |
| `/news/{投稿ID}/` | お知らせ（WordPress の投稿。ID は databaseId） | `src/app/news/[id]/page.tsx` |
| `/{固定ページの URL}/` | 固定ページ（WordPress の URL のまま。親子ページは `/親/子/`） | `src/app/[...slug]/page.tsx` |

WordPress で「ホームページ」に設定した固定ページは書き出しません（トップは LP）。

## デザイン

- `src/styles/tokens.css`・`base.css`・`components.css` は `mock/design/designSystem/` の写し、`lp.css` は `mock/design/styles.css` の写し。**直すときは mock 側と両方を直す**。
- `src/styles/content.css` は、お知らせ・固定ページ用（このプロジェクトで足したもの。値はトークンだけを使う）。
- ヘッダーの開閉・スクロール（`SiteHeader.tsx`）と HERO のアニメ（`HeroPlayer.tsx`）は `mock/design/script.js` を移したもの。
- `public/media/hero-demo.mp4` を置くと、HERO のアニメの代わりに動画が再生されます（`mock/design/media/README.md` の決まり）。

## 使い方

```bash
npm install
cp .env.example .env.local   # 必要なら。書かなければ本番の WordPress を読む
npm run dev                  # http://localhost:3000
npm run build                # out/ に書き出す
```

| 環境変数 | 既定の値 |
|---|---|
| `WORDPRESS_GRAPHQL_ENDPOINT` | `https://api.mothershipremote.com/graphql` |
| `NEXT_PUBLIC_SITE_URL` | `https://mothershipremote.com`（OGP・canonical の基準） |

## デプロイ（mothershipremote.com へ）

本番に出すのは、いつも **GitHub の `main` と同じコード** です。

| きっかけ | 方法 |
|---|---|
| WordPress で記事・固定ページを公開・更新・削除 | 自動。テーマのフックが GitHub Actions（`.github/workflows/deploy-frontend.yml`）を呼ぶ |
| このフォルダーのコードを変えた | 手元で **`./deploy.sh`**（commit・push してから） |
| 手でやり直したい | GitHub の Actions タブ →「Build & Deploy frontend」→「Run workflow」 |

push しただけではデプロイされません。

```bash
./deploy.sh --dry-run   # 何が変わるかを見るだけ（サーバーは変えない）
./deploy.sh             # 確認 → ビルド → アップロード
```

- `deploy.sh` は、コミットしていない変更・push していないコミット・`main` 以外のブランチがあると止まります（WordPress の更新で Actions が `main` からビルドし直したときに、手元だけの変更が消えるのを防ぐため）。
- 使うには、Mac ごとに `~/.ssh/config` へ接続名 `mothership` を登録します。

  ```
  Host mothership
    HostName xs082238.xsrv.jp
    Port 10022
    User xs082238
    IdentityFile ~/.ssh/（その Mac の鍵）
    IdentitiesOnly yes
  ```

- **`deploy-exclude.txt` の `/api.mothershipremote.com/` を消さないこと。** `public_html` の中に WordPress があり、消すとデプロイのたびに WordPress が削除されます（`deploy.sh` も Actions も、この行が無いと止まるようにしてある）。

## まだのこと

- 下書きのプレビュー（静的書き出しでは使えない）。
