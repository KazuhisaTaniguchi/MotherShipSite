# MOTHERSHIP デザインシステム

LP（`../index.html`）で使っている色・文字・余白・部品を、1 か所にまとめたものです（作成：2026-11-20 Claude Code）。
新しいページを作るとき、LP を直すとき、WordPress のテーマへ組み込むときは、ここにある値と部品を使います。

**LP は、もうこのデザインシステムを読み込んで動いています。** ここを直すと、LP の見た目も一緒に変わります。

| ファイル | 役割 | 読み込む順 |
|---|---|---|
| `tokens.css` | **値の決まり**（トークン）。色・グラデーション・文字・余白・角丸・影・動き。CSS の変数だけ | 1 |
| `base.css` | **土台**。初期化、本文、`.wrap`（幅）、フォーカスの枠、`.skip-link`、「視差効果を減らす」への対応 | 2 |
| `components.css` | **部品**。ヘッダー、ボタン、ピル、見出しのセット、チェックのリスト、カード、キー、囲み、ステップ、質問と答え、端末の枠、状態の点、フッター | 3 |
| `index.html` | **見本帳**。ブラウザーで見るページ。色・文字・部品の実物と、HTML の書き方 | — |
| `guide.css`・`guide.js` | 見本帳だけのスタイルとスクリプト（部品ではない。ほかのページでは読み込まない） | — |
| `README.md` | このファイル。決まりと、まだそろっていない値の一覧 | — |

## 見本帳の見方

```
cd MotherShip_template
python3 -m http.server 8765 --bind 127.0.0.1
# ブラウザーで http://127.0.0.1:8765/design/designSystem/
```

`index.html` をそのまま（配信せずに）開いても表示できます。

見本帳の色のコード・大きさ・コントラスト比・HTML の例は、ページに書き写したものではなく、`tokens.css` と見本そのものから取り出して表示しています。値を直すと、見本帳の表示も変わります。

## 使い方

ページの `<head>` で、この順に読み込みます。そのページだけの組み方（並べ方・置き場所）は、最後のファイルに書きます。

```html
<link rel="stylesheet" href="designSystem/tokens.css">
<link rel="stylesheet" href="designSystem/base.css">
<link rel="stylesheet" href="designSystem/components.css">
<link rel="stylesheet" href="styles.css">   <!-- そのページだけの組み方 -->
```

### 決まり

1. 色・文字の大きさ・角丸・影は、変数（`var(--…)`）で書く。色のコードをページの CSS に直接書かない。
2. 新しい値が要るときは、先に `tokens.css` へ足してから使う。よく似た値を増やさない。
3. 使い回す部品は `components.css` に、そのページだけの組み方はページの CSS に書く。
4. 部品の見た目は部品のクラスで、置き場所（外側の余白）はページ側のクラスで決める。
   例：`<p class="pill pill-glass hero-label">`（見た目は `.pill`、下の余白は LP の `.hero-label`）
5. 直したら、見本帳と LP の両方を開いて確かめる。

### 名前の決まり

- 色は、そのままの名前（`--blue`、`--ink`、`--surface`）。濃さ・段階は数字（`--ink-2`、`--on-dark-3`）。
- 色のほかは、種類を頭に付ける（`--text-…`、`--space-…`、`--radius-…`、`--shadow-…`、`--dur-…`、`--grad-…`）。
- 透明度を付けて使う色は、`R, G, B` の数字も持つ（`--blue-rgb` など 9 色）。書き方は `rgba(var(--blue-rgb), .12)`。色を変えるときは `-rgb` の行だけを直す。
- 部品のクラスは短い英語（`.btn`、`.card`）。種類は後ろに足す（`.btn-primary`、`.pill-soft`）。状態は `is-`（`.is-scrolled`、`.is-open`）。
- 見本帳だけのクラスは `ds-` で始める。

## 値の早見表

正しい値は `tokens.css` です（下の表は、読むための写し）。

### 色

| 変数 | 値 | 役割 |
|---|---|---|
| `--blue-deep` | #1e3ec0 | 濃い青。キッカー、ボタンにカーソルを合わせたとき、グラデーションの始まり |
| `--blue` | #385cf4 | 主役の青。番号、矢印、フォーカスの枠 |
| `--sky` | #38afee | 空色。グラデーションの終わり、囲みの線。**文字には使わない** |
| `--cyan` | #a8f8ff | 暗い面の上のアクセント |
| `--mint` | #b9eaf7 | 背景のにじみ。面や文字には使わない |
| `--navy`／`--navy-2` | #142651／#0e1a3a | 夜の面 |
| `--ink`／`--ink-2`／`--ink-3` | #14203a／#3a4763／#66728c | 文字（見出し・本文／説明／注記） |
| `--line` | #dbe3f1 | 罫線、カードの枠 |
| `--bg`／`--surface` | #f5f7fc／#ffffff | ページの地／カード・白い帯 |
| `--tint`／`--wash`／`--wash-2` | #eef2fb／#e9eefa／#cde3fb | うすい青の面／明るいグラデーション |
| `--on-dark`〜`--on-dark-4` | #ffffff／#dfe7fa／#c7d3ee／#93a3c8 | 暗い面の上の文字（見出し／本文／補足／注記） |
| `--glass`／`--glass-line` | 白 8%／白 16% | 暗い面の上のパネルと枠 |
| `--live`／`--rec` | #2fbf8a／#ff536b | つながっている／声を送っている |
| `--error` | #c81e3c | フォームのエラーの文字・枠（2026-11-20 追加。白の上で 5.67 : 1、`--bg` の上で 5.29 : 1。`--rec` は文字には薄いので使わない） |
| `--device`／`--device-screen` | #121a30／#0b1020 | 端末の枠／画面の地 |

グラデーション：`--grad-brand`（文字・目立たせる枠）、`--grad-accent`（アイコンの台・番号）、`--grad-navy`（夜のパネル）、`--grad-wash`（図の台）、`--grad-hero`（明るい背景）、`--grad-night`（夜の背景）。

### 文字

書体：`--font-sans`（その機器に入っているゴシック体。Web フォントは読み込まない）。

| 変数 | 値 | 役割 |
|---|---|---|
| `--text-display` | 38〜72px | HERO の見出し（h1） |
| `--text-title` | 27〜42px | セクションの見出し（h2、`.section-title`） |
| `--text-heading-lg` | 25〜36px | 大きいパネルの見出し |
| `--text-heading` | 19〜23px | カードの見出し（h3） |
| `--text-subheading` | 20px | 小さいカードの見出し |
| `--text-lead-lg`／`--text-lead` | 16〜20px／15〜17px | HERO のリード／セクションのリード |
| `--text-body`／`--text-body-sm` | 16px／15px | 本文／カードの中の本文 |
| `--text-small`／`--text-note`／`--text-caption` | 14px／13px／12px | ナビ・補足／注記・ラベル／キャプション |

太さ：`--weight-heavy` 800（見出し）、`--weight-bold` 700（ボタン・強調）、`--weight-semibold` 600（ナビ）、`--weight-medium` 500（リード）。
行間：`--leading-body` 1.85、`--leading-note` 1.7、`--leading-heading` 1.35、`--leading-display` 1.22。

### 余白・レイアウト・角丸・影・動き

- 余白：`--space-N` = N × 4px（1・2・3・4・5・6・8・10・12・16）。
- 幅：`--wrap` 1120px、`--gutter` 24px（860px 以下は 20px）、`--header-h` 68px、`--section-y` 72〜120px、`--section-head-gap` 40〜64px。
- 画面の幅の区切り：980px 以下（2 列を 1 列に）、860px 以下（スマホの組み方）、480px 以下（小さいスマホ）。`@media` の中では変数を使えないので、数字で書く。
- 角丸：`--radius-xs` 6、`-sm` 10、`-md` 16、`-lg` 22（カード）、`-xl` 28、`-2xl` 36、`-pill` 999。
- 影：`--shadow-card`（浮かせるカード）、`--shadow-button`（濃いボタン）、`--shadow-brand`／`-hover`（青く目立たせるカード）、`--shadow-device`（端末の枠）。
- 動き：`--dur-fast` .15s、`--dur-base` .2s、`--dur-slow` .45s、`--ease-out`。

## 部品の一覧

| 部品 | クラス | メモ |
|---|---|---|
| ヘッダー | `.site-header`・`.header-inner`・`.brand`・`.brand-mark`・`.site-nav`・`.nav-cta`・`.menu-toggle` | 開閉と `.is-scrolled` にはスクリプトが要る（LP の `../script.js` のはじめの 2 つ） |
| ボタン | `.btn` ＋ `.btn-primary`／`.btn-ghost` | 高さ 54px。480px 以下では横いっぱい |
| ピル | `.pill` ＋ `.pill-glass`／`.pill-brand`／`.pill-soft`／`.pill-ghost` | 置く面で種類を選ぶ |
| 見出しのセット | `.section`・`.section-head`・`.kicker`（＋`.light`）・`.section-title`・`.section-lead` | |
| 文字の飾り | `.grad-text`、`<mark>` | 見出しに 1 か所／1 画面に 1 か所 |
| 注記 | `.fine`・`.note` | |
| チェックのリスト | `.ticks`（＋`.small`・`.on-dark`） | |
| カード | `.card`・`.card-icon` | 影は付けない |
| キー | `<kbd>` | |
| 囲み | `.callout` | |
| ステップ | `.steps`・`.step-n` | |
| 質問と答え | `.faq-list`（`<details>`・`<summary>`） | スクリプトは要らない |
| 端末の枠 | `.phone`（＋`.tablet`）・`.phone-screen` | 幅はページ側で決める |
| 状態の点 | `.dot` | |
| フッター | `.site-footer`・`.footer-top`・`.trademark`・`.footer-bottom` | |
| 土台の道具 | `.wrap`・`.center`・`.nb`・`<br class="sp">`・`.skip-link` | `base.css` |

LP だけの部品（HERO のアニメ、Aqua Voice のカード、図、料金のカードなど）は `../styles.css` にあります。ほかのページでも使うことになったら、`components.css` へ移します。

## LP との関係（2026-11-20 にしたこと）

LP の見た目を変えずに、`../styles.css` の中身を 3 つに分けました。

- `:root` の変数 → `tokens.css`（足りなかった値を足し、名前を整理）
- 共通の決まりと部品 → `base.css`・`components.css`
- `../styles.css` に残したもの：HERO（アニメを含む）と、各セクションの並べ方。色・角丸・影・太さなどは、変数に置きかえた
- `../index.html`：読み込みを 3 行足した。ラベルのクラスを 3 種類だけ変えた（`hero-label`・`feature-tag`・`soon` に `pill pill-…` を足した）

変数の名前が変わったもの：`--card` → `--surface`、`--radius` → `--radius-lg`、`--shadow` → `--shadow-card`、`--font` → `--font-sans`。

## まだそろっていない値（整理の候補）

LP の見た目を 1px も変えないことを優先したので、決まりの刻みに合っていない値は、変数にせず数字のまま残してあります。そろえると見た目が少し変わるので、目で確かめながら直す作業になります。

| 種類 | いまの値（場所） | そろえるなら |
|---|---|---|
| 角丸 | 20px（`.callout`、スマホのメニュー、`.voice-need`、`.dl`、`.fit-phone`）、24px（`.fit-diagram`） | `--radius-lg`（22px） |
| 角丸 | 12px（スマホのメニューの項目）、14px（`.voice-typed`）、18px（`.voice-steps li`） | `--radius-sm`（10px）か `--radius-md`（16px） |
| 角丸 | 32px（`.feature-lead`） | `--radius-xl`（28px）か `--radius-2xl`（36px） |
| 文字 | 0.5px 刻みの大きさ：11.5／12.5／13.5／14.5／15.5／16.5／18.5px（注記、ピル、小さい説明、囲み、質問など） | いちばん近い `--text-…` |
| 文字 | 18px・19px の小見出し（`.dl h3`、`.voice-steps b`、`.steps h3`、`.device h3`、`.step-n`） | `--text-subheading`（20px） |
| 色 | `.callout` の地 #eef4fd | `--tint`（#eef2fb） |
| 色 | ダウンロードのリード #d5dff6 | `--on-dark-2`（#dfe7fa） |
| 色 | 暗い面のパネル：白 6%・7%・9%、枠：白 14%・18%（`.voice-need`、`.voice-steps li`、`.dl`） | `--glass`（8%）・`--glass-line`（16%） |
| グラデーション | Aqua Voice のカードの枠（110 度）と見出し（まん中が 50%）、`.pill-brand`（100 度・2 色） | `--grad-brand`・`--grad-accent` |
| ピル | `.pill-glass` だけ 13px・太さ 700・字間 .08em、`.pill-brand` だけ上下 4px | ほかのピル（12.5px・800・上下 5px）に |
| 動き | ヘッダーの背景 .25s | `--dur-base`（.2s） |
| 余白 | 部品の内側の余白に、4 の倍数でない値（30・26・22・18・14・10px など）が多い | `--space-N` |

そのほか：

- チェックのリストの線の色は、画像（SVG）の中に直接書いてあります（`components.css` にコメントあり）。`--blue-deep`・`--cyan` を変えたら、そこも直します。
- HERO のアニメの中の色（Mac の壁紙、窓、キーボード）は「絵」として扱い、ブランドの色と同じものだけを変数にしました。
- ロゴ（ヘッダーの SVG と `../favicon.svg`）の色は、SVG の中に直接書いてあります。

## 気づいた点（読みやすさ）

- **HERO の下の小さな文字が、うすい。** 「iPhone · iPad · Android · Mac」（`.hero-platforms`）と、いちばん下の 1 行（`.hero-foot`）は、`--ink-3` を明るい青のグラデーションの上に置いています。コントラスト比は、`--wash` の上で 4.15 : 1、`--wash-2` の上で 3.67 : 1 で、ふつうの文字の目安（4.5 : 1）に届きません。`--ink-2` に変えると足ります（`--wash-2` の上で 7.06 : 1）。今回は見た目を変えない方針なので、直していません。
- `--ink-3` をページの地（`--bg`）の上に置くと 4.50 : 1 で、ぎりぎりです。小さい注記は、白い面（`--surface`、4.82 : 1）の上に置くのが安全です。
- `--sky` は白との比が 2.46 : 1 しかないので、文字には使えません（線と面だけ）。

## 変えるときの手順

1. 値を変える → `tokens.css`。部品を変える → `components.css`。
2. 見本帳（`index.html`）と LP（`../index.html`）を、PC 幅とスマホ幅で開いて確かめる。
3. 新しい部品を足したら、見本帳に見本を足す（`data-code` を付けた要素の中身が、そのまま「HTML を見る」の例になる）。
4. この README の早見表と部品の一覧を直す。

## 確認したこと・していないこと（2026-11-20）

- **LP の見た目が変わっていないこと**：変更前の写しと変更後を、画面なしの Chrome で同じ幅・同じ状態にして、すべての要素（`::before`・`::after` を含む）の計算後のスタイルと、位置・大きさを 1 つずつ比べた。
  - 幅：1440／980／860／700／480／390px
  - 状態：最初の表示、アニメの 12 の時刻、再生中の見た目、メニューを開く、ヘッダーに背景が付く、FAQ を全部開く、動画に切り替わる、カーソルを合わせる・フォーカス（クラスに置きかえて再現）、「視差効果を減らす」（規則を取り出して再現）
  - 結果：のべ 126 の組み合わせ・約 3,700 万個の値で、**ちがいは 0**。意図した変更が 1 つだけ（`.dot` に `display: inline-block` を足した。LP では親が flex なので、描かれ方は同じ）。
- **画素でも同じこと**：「視差効果を減らす」を実際に効かせて動きを止め、ページ全体を撮って画素ごとに比べた。PC 幅 1440・幅 500・幅 390 のどれも、変更前と **1 画素も違わない**。HERO は、アニメの 2 つの場面（キーボード、横向き）でも一致。
  - 透明度つきの色を新しい書き方（`rgb(… / .12)`）にすると、背景のグラデーションの画素が 255 段階中 1 だけ変わったので、元と同じ書き方（`rgba(…, .12)`）にそろえてある。
- **見本帳**：PC 幅 1440 とスマホ幅 390 の表示を、撮った画像で確認。幅 320／390／500／860／980／1440 で横にはみ出さないこと、色のコード 26 個・コントラスト比 18 行・HTML の例 18 個が表示されること、見本のメニューの開閉、色の札を押したときの表示、目次の印、コンソールのエラーなし、ファイルを直接開いても表示できること。
- **確認していない**：実機（iPhone・Android）、Safari・Firefox での表示。カーソルを合わせたときの見た目は、再現した規則での比較で、実際の操作では見ていない。色の札のコピーは、画面なしの Chrome ではクリップボードを使えないため、コピーそのものは未確認（表示は確認）。
