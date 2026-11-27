# セットアップ動画（2026-11-27）

ヘルプの「3 声で書く準備」「4 外から使う」を、動画（アニメーション）にしたもの。音は無し、下にテロップ。

| 動画 | 長さ | 置き場所（モック／本番） |
|---|---|---|
| 声で書く準備（Aqua Voice・BlackHole 2ch） | 84.5 秒 | `media/setup-voice.mp4` ／ `frontend/public/videos/setup-voice.mp4` |
| 外から使う準備（Tailscale） | 51.5 秒 | `media/setup-outside.mp4` ／ `frontend/public/videos/setup-outside.mp4` |

表紙の画像は `setup-*-poster.jpg`（3 秒目のコマ）。

## 載せている所（日本語だけ）
- トップの「出かける前に」（2 本。`#setup-videos`。「声で書く」の節からもここへリンク）
- ヘルプの 3・4 の先頭
- 用途別のページ（iPad・iPhone・Android・Mac mini）の「長い文は、声で」「外出先からつなぐには」の段（本番だけ。`src/content/usecases.ts` の `video`）
- 英語のページには載せていない（テロップが日本語のため）

## プレーヤー（2026-11-27）
- テロップが下の端にあり、ブラウザーの再生バーが重なるので、操作は動画の下に自前で出す：再生・位置・全画面・ステップへ飛ぶボタン。再生前は「動画を見る」の札
- 本番：`frontend/src/components/SetupVideo.tsx`（題・長さ・ステップの秒はここ）。モック：`script.js` の「セットアップ動画」と、`<figure data-setup-video data-chapters="秒:名前|…">`
- スタイルは `designSystem/components.css` の `.setup-video`・`.sv-*`・`.prep-videos`（本番の `src/styles/components.css` と同じ中身）
- **動画を作り直したら**：ステップの秒（場面の頭）と長さを、`SetupVideo.tsx` とモックの `data-chapters`・`data-duration` の両方で直す
- 動画の下の Homebrew へのリンクは、日本語 `https://brew.sh/ja/`・英語 `https://brew.sh`（本番は `src/components/nav.ts` の `HOMEBREW_URL`）
- 本番は、幅 1000px 以上の画面で 1920×1080（`public/videos/setup-*-1080.mp4`）、ほかは 1280×720 を読む。モックは 1280×720 だけ

## 中身の決まり
- 手順・文は、ヘルプ（`help.html`）に書いてあることだけ。ヘルプを変えたら、動画も直す
- ほかの会社の画面（Aqua Voice・Tailscale・ターミナル・システム設定）は、形だけをまねた絵。本物の画面・ロゴは使っていない
- コマンドの全文は動画に出さない（ヘルプからコピーしてもらう）

## 作り方
- `stage.html`（場面）・`stage.css`（見た目）・`stage.js`（時計）。1280×720 の舞台
  - 場面は `<section class="sc" data-len="秒">`。中の部品は `data-in`・`data-out`・`data-type`・`data-move` など（場面の頭からの秒）。意味は `stage.js` の先頭
  - ブラウザーで `stage.html?v=voice`／`?v=outside` を開くと再生。`?t=秒` でその時刻で止まる
- コマ撮り：`node render.mjs stage.html voice frames <フォルダー> 30 1.5`（puppeteer-core と Google Chrome が要る。1920×1080 の JPEG）
- MP4：`swiftc -O encode.swift -o encode` → `./encode <コマのフォルダー> out.mp4 1280 720 30 900000`（macOS の AVFoundation。ffmpeg は使っていない）
- サイト用は 1280×720・約 0.9 Mbps と、広い画面用の 1920×1080・約 1.8 Mbps（本番の `public/videos/` だけ。2026-11-27 から）。1920×1080 は SNS・YouTube にも使える

## まだ
- 英語版（テロップと画面の文を英語に）
- ナレーション（音声）は無い
