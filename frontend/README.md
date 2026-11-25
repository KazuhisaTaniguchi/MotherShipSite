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

## 英語版（/en/…。2026-11-21 追加）

- 日本語は今の URL のまま、英語は `/en/`・`/en/help/`・`/en/contact/`・`/en/terms-of-service/`・`/en/privacy-policy/`・`/en/news/`・`/en/news/{投稿ID}/`。特定商取引法は日本語だけ
- 右上の **JA／EN**（`SiteHeader.tsx` の `.lang-switch`）は、同じページのもう片方の言語へのリンク（対応は `src/lib/i18n.ts` の `langPaths`）
- **英語のページの中身は、モック（`mock/design_en`）の HTML をそのまま出す**。取り込みは `python3 scripts/sync-en.py`（`src/content/en/pages.ts`・`src/styles/en.css`・`public/en/en.js`・`public/og-en.png` を書き出す。手で直さない）。**英語の文や図を直すときは、モックを直してから、このスクリプトを実行する**
- ヘッダー・フッター・「本文へ移動」は、URL（`/en/` で始まるか）を見て英語に切り替える
- `<html lang>`：レイアウトは 1 つなので、書き出したあとに `scripts/set-lang.mjs` が `out/en/` の HTML を `lang="en"` に書き換える（`npm run build` に入っている）。英語だけの CSS（`en.css`）は `html[lang="en"]` で効かせる
- 検索向け：日本語と英語の両方のページに `hreflang`（ja・en・x-default＝英語）と `canonical`（`langAlternates`）、サイトマップに英語の URL。`src/lib/i18n.ts` の `EN_PUBLIC` を `false` にすると、切り替え・hreflang・サイトマップから英語が消え、英語のページは noindex になる
- お問い合わせ（英語）：Contact Form 7 の英語用のフォームに送る。ID は環境変数 `NEXT_PUBLIC_CF7_CONTACT_FORM_ID_EN`（`.github/workflows/deploy-frontend.yml`）。空のあいだは送らずに「準備中」と出す
- お知らせ（英語）：1 つの記事の本文に日本語と英語を書く。クラス `news-en` の区切り線（テーマのパターン「ここから英語版」。`api_theme/inc/news-english.php`）か「[English]」とだけ書いた段落より下が英語。英語のタイトルは、区切りのすぐ下の見出し。切り分けは `src/lib/wordpress.ts` の `splitLang`。区切りの無い記事は日本語だけ
- 404 のページは 1 枚（日本語）。英語の人のために 1 行だけ英語を添えてある

## SEO（2026-11-21。日本語・英語の全ページ）

ねらう客と言葉は、Obsidian の「LPとSEOの方針（折りたたみスマホ×MacのAI）」。日本語のキャッチコピーと HERO は変えない（ユーザーの指示）。

- **設定は `src/lib/seo.ts` の `pageMeta()` にまとめた**：タイトル（あとに「｜MOTHERSHIP」「 | MOTHERSHIP」）、説明文、正規の URL、言語の対応（hreflang）、OGP（ページごとの title・description・url・locale・画像）、X のカード。ページを足すときは、`export const metadata = pageMeta({...})` と書く
- **タイトルと説明文**：トップは、ねらう言葉を前に置く（2026-11-25 から：日本語「Macのリモートデスクトップ｜iPhone・iPad・Androidから操作｜MOTHERSHIP」、英語「Mac Remote Desktop for iPhone, iPad & Android | MOTHERSHIP」。検索の量を調べた結果、折りたたみの言葉は検索がほぼ無かったため。Obsidian の「キーワード調査（2026-11-25）」）。英語のページのタイトルと説明文は、モック（`mock/design_en` の `<head>`）から取り込む
- **構造化データ（`src/components/JsonLd.tsx`）**：トップに Organization・WebSite（別名「MOTHERSHIP REMOTE」）・SoftwareApplication・FAQPage（英語の FAQ は `sync-en.py` がページの `<details>` から取り出す。日本語は `src/app/page.tsx` の `STRUCTURED_DATA`。**FAQ を直したら、ここも合わせる**）。下のページに BreadcrumbList。お知らせの記事に Article
- **サイトマップ**（`src/app/sitemap.ts`）：更新日と、言語の対応（`xhtml:link`）。英語のお知らせの一覧は、英語の記事があるときだけ入れる（0 件のあいだは noindex）
- **本文に足したもの**：フッターの説明の 1 行（全ページ。「リモートデスクトップアプリ」という分類の言葉を入れるため）、日本語の特長のリードに「リモートデスクトップアプリ」。英語は HERO の小さなラベルを「Mac remote desktop for foldable phones」に
- **解析のイベント（2026-11-25）**：`src/components/Analytics.tsx` が、押されたリンクを見てイベントを送る。`/downloads/*.dmg` → `host_download`、`apps.apple.com` → `app_store_click`（`?platform=mac` つきは `mac_app_store_click`）、`play.google.com` → `google_play_click`。ストアやダウンロードのリンクを足しても、コードの追加は要らない。GA でキーイベントにしているのは `app_store_click`・`host_download`（Mac 版・Android を公開したら、残りの 2 つも GA でキーイベントにする）。GA の見方は、Obsidian の「アクセス解析ダッシュボードの見方」
- **用途別のページ（2026-11-25、日本語と英語）**：`/mac-remote-desktop-ipad/`・`/mac-remote-desktop-iphone/`・`/mac-remote-desktop-android/`・`/mac-mini-remote-desktop/`・`/claude-code-from-phone/`・`/codex-from-phone/`（英語は `/en/` の下に同じスラッグ）。中身は `src/content/usecases.ts`（日本語）・`usecases-en.ts`（英語）、形は `src/components/UseCasePage.tsx`（お知らせの記事と同じ組み方）。**モックには無い**（本番だけ）。機能や対応環境、配信の状態（Android は近日公開）を変えたら、ここも直す。トップの対応デバイスの下からリンク
- やっていないこと：「Aqua Voice をスマホから」のページ（Aqua Voice 自身が iPhone のキーボードと Android のアプリを出しているので、検索の意図に合わない。作らない）、Search Console への登録、OGP 画像の文字の差し替え（日本語の `og.png` は前の見出しのまま）

