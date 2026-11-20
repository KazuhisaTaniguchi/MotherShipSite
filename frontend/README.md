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
- HERO のアニメは `src/components/HeroFold.tsx`（Fold7。CSS は `src/styles/hero-fold.css`）。（2026-11-21：HERO を Fold7 のアニメに作り直したので、動画に替わる仕組みは無くなった。実機の動画に替えるときは、モックは `index.html` の `.hx` の中、本番は `frontend/src/components/HeroFold.tsx` を差し替える）

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

## まだのこと

- 公開先へのアップロードの方法（`out/` を `mothershipremote.com` の `public_html` へ）と、記事を更新したときに自動でビルドする仕組み。
- 下書きのプレビュー（静的書き出しでは使えない）。
