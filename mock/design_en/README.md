# MOTHERSHIP 英語版のモック（design_en）

日本語版のモック（`../design/`）をもとに作った、英語版の静的なページです（作成：2026-11-21 Claude Code）。
HTML の構造・クラス名・CSS・図の作り方は日本語版と同じで、文言を英語にし、英語のための調整を少し足しています。

- **本番（`frontend/`）にはまだ入れていません。** モックだけです
- 英語は米国向け（US English）。直訳ではなく、英語のサイトとして自然に読める言い回しにしています

## ファイル

| ファイル | 内容 |
|---|---|
| `index.html` | トップ（LP）。日本語版と同じ並び |
| `help.html` | ヘルプ（図 29 個） |
| `contact.html`・`contact.js` | お問い合わせ。フォームのメッセージ（`contact.js`）も英語 |
| `news.html` | お知らせの一覧（サンプル 3 件） |
| `404.html` | 404 ページ |
| `terms-of-service.html` | 利用規約の英訳（全 20 条）。先頭に「英訳は参考。日本語版が正」の注記 |
| `privacy-policy.html` | プライバシーポリシーの英訳（全 15 項目）。同じ注記 |
| `styles.css`・`help.css`・`legal.css`・`contact.css`・`content.css`・`404.css` | 日本語版の写し。`styles.css` の末尾に、英語版だけのカード（画質）のスタイルを足した |
| `designSystem/` | `tokens.css`・`base.css`・`components.css`（日本語版の写し＋英語向けの調整）。見本帳（`index.html`）は作っていない |
| `hero-fold.css`・`tools/hero-fold/` | HERO のアニメ。**2026-11-21 に C 案で作り直し**（縦に持ち替える・指で拡大・閉じてカバー画面まで。1 周 19.4 秒）。下の「HERO のアニメ」を参照。日本語版とは流れがちがう |
| `help-figs.css`・`tools/help-figs/` | ヘルプの図。`tools/help-figs/build.py` の文言を英語にして書き出したもの |
| `og.png`・`tools/og/og.html` | 英語の OGP 画像（1200×630）と、そのもとの HTML |
| `script.js` | メニュー、ヘッダー、HERO の一時停止ボタン（日本語版にあった、前の HERO の再生の仕組みは外した） |

作っていないもの：特定商取引法のページ（日本語版 `../design/commercial-transactions.html` へリンク）、デザインシステムの見本帳、`media/`。

## 見方

言語の切り替えが `../design/` を指すので、**`mock/` から配信**して開きます。

```
cd mock
python3 -m http.server 8787 --bind 127.0.0.1
# 英語版   http://127.0.0.1:8787/design_en/
# 日本語版 http://127.0.0.1:8787/design/
```

## 決めたこと（2026-11-21、ユーザーの回答）

| 項目 | 決定 |
|---|---|
| HERO の見出し | **2026-11-23 に「Tap to move. Talk to write.」へ変更**（日本語版「指で動かす。声で書く。」に合わせた。組み方も日本語版と同じ：2 行、2 行目だけグラデーション、文字の大きさは `--text-display`。`.is-fold` は外した）。以前は「mission control」の案。Kicker「Your Mac's AI, within reach.」／H1「Your foldable is mission control for your Mac's AI.」／リード「Unfold it, and your Mac's screen is right there, sharp and readable. Need a change? Just say it.」 |
| 図・ヘルプの中の、アプリの画面の文言 | 英語で書く（アプリはまだ日本語だけ。**英語の文言は仮**。下の「画面の文言」） |
| 範囲 | 全ページ（トップ・ヘルプ・お問い合わせ・お知らせ・404・利用規約・プライバシーポリシー） |
| 利用規約・プライバシーポリシー | 全文を英訳し、「日本語版が正」と書く。特定商取引法は日本語のページへリンク（フッターの「Legal Notice (Japan, in Japanese)」） |
| 価格 | **US$19.99**。「国・地域で価格が変わる。購入画面の金額が支払う金額」と添える |
| 日本語入力のカード | 英語版では外し、代わりに**画質を選ぶカード**（アニメ付き）を入れた |
| 言語の切り替え | 英語版だけに置く（ヘッダーとフッターの「日本語」。同じページの日本語版へ） |

## 日本語版とちがうところ

1. **文字組み**（`designSystem/tokens.css`）：書体は欧文を先に（`system-ui` …、日本語は後ろ）。行間を詰めた（本文 1.85 → 1.7、見出し 1.35 → 1.25、大見出し 1.22 → 1.12）。見出しの字間 `.01em` → `-.012em`、ラベルの字間も詰めた
2. **`designSystem/base.css`**：`i`・`em` の斜体を外す（このサイトでは飾りの箱として使っているため。欧文の書体だと斜体になる）。`text-wrap: pretty`（最後の行に 1 語だけ残るのを減らす）
3. **`designSystem/components.css`**：言語の切り替え（`.nav-lang`）と、訳文の注記（`.lang-note`）
4. **「そのほかの特長」の 2 枚目のカード**：日本語版は「日本語入力も、そのまま。」。英語版は **「Sharp text or smooth motion. Your call.」**（画質：Balanced／Text Priority／Smoothness Priority）。図は `.of-pq`（接頭辞 `opq-`、`styles.css` の末尾。12 秒で 1 周、3 つのモードを順に選ぶ。文字のにじみ・点の動き・2 本のメーターが変わる）。根拠はアプリの画質の設定（バランス 60fps／文字優先 30fps・文字がくっきり／滑らかさ優先・解像度を下げてでも 60fps）
5. **キーボードのカード**に 1 行足した：「Key legends follow the input source you use on your Mac.」（日本語版では日本語入力のカードにあった内容）
6. **ヘルプの図**（`tools/help-figs/`）：英語の文言は長いので、メニューの幅を広げて文字を少し小さくした（`kit.css` の `.hf-pop`・`.hf-r > span`・`.hf-btn`）。図 4（QR のウィンドウを左へ）、図 11（名前の列を広げた）、図 28（「(2 of 3)」を途中で折り返さない）
7. **お知らせの見出し**：「NEWS／News」と重なるので、H1 は「The latest from MOTHERSHIP」
8. **`<head>`**：`lang="en"`、英語のタイトルと説明、`hreflang` の `link`（モックなので相対パス）
9. FAQ の例文・図の中の例文は、英語の例に置き換えた（「Highlight the month with the highest sales.」「Next, fix the chart.」など）

## 主な見出しの対応

| 日本語版 | 英語版 |
|---|---|
| AIが働くMacを、手もとから。 | Your Mac's AI, within reach. |
| 指で動かす。声で書く。 | Tap to move. Talk to write. |
| せっかくの大きな画面、Macのリモートでは活かせていますか。 | You bought the big screen. Is your Mac remote app actually using it? |
| 形を変えると、画面も変わる。 | Change the shape. The screen follows. |
| ポケットから出して、まず確かめる。 | Pull it out. Take a quick look. |
| 開けば、Macがこの画面の形になる。 | Open it, and your Mac takes the shape of this screen. |
| 机に置けば、小さなノートパソコン。 | Set it down, and it's a tiny laptop. |
| 読みながら、もう片方で操作する。 | Read on one side. Work on the other. |
| 見て、動かして、話すだけ。 | See it. Touch it. Say it. |
| AIに任せて、出かける。 | Hand it off to your AI. Head out. |
| どのAIでも、いつものまま。 | Any AI. Just the way you use it. |
| 映すだけじゃない。ちゃんと使える。 | More than mirroring. Made for real work. |
| 小さな画面でも、文字はくっきり。 | Small screen. Sharp text. |
| マウスがなくても、指でMacを動かせる。 | No mouse? Run your Mac with your fingers. |
| 話すだけで、文字になる。キーボードは、しまったままで。 | You talk. It types. The keyboard stays out of the way. |
| Macは起きたまま。切れても、すぐ戻る。 | Your Mac stays awake. If the connection drops, it's right back. |
| 縮めて映すのではなく、この画面のためのMacを作る。 | Don't shrink your Mac. Give it a display made for this screen. |
| 見られたくない画面は、見せない。 | Keep private screens private. |
| いつものMacを、いつもどおりに。 | Your Mac, the way you always use it. |
| キーボードも、ちゃんとMac。 | A proper Mac keyboard, too. |
| コピーも、ファイルも、音も。 | Copy, files, and sound, too. |
| Macを、切り替えて。 | Switch between Macs. |
| はじめかたは、3ステップ。 | Up and running in three steps. |
| まずは14日間、すべての機能を無料で。 | Try everything free for 14 days. |
| Macに任せて、出かけよう。 | Leave it to your Mac. Head on out. |
| お探しのページに、つながりませんでした。 | We couldn't connect you to that page. |

3 つの柱：くっきり見える → **See it clearly**／指で動かす → **Control it by touch**／声で書く → **Write by voice**
折りたたみの形：閉じたまま → **Folded**／開く → **Unfolded**／半分に折って置く → **Half-folded on a desk**／本のように持つ → **Held like a book**

## 画面の文言（英語は仮）

アプリ（MOTHERSHIP HOST・MOTHERSHIP）は、いまは日本語だけです。図とヘルプに出てくる画面の文言は、次の英語で書きました。
**アプリを英語にするときは、この表とそろえる（または、アプリの文言に合わせてサイトを直す）必要があります。**

| アプリの文言（日本語） | サイトで使った英語 |
|---|---|
| 接続を待っています | Waiting for connection |
| 登録済みの端末 | Registered Devices |
| 端末を追加… | Add Device… |
| 設定を開く | Open Settings |
| 画面収録／アクセシビリティ | Screen Recording／Accessibility（macOS の英語の表記） |
| ログイン時に起動 | Open at Login |
| 待機中も Mac をスリープさせない | Keep Mac awake while waiting |
| 登録済みの Mac | Your Macs |
| 自宅 LAN で接続できます | Available on home network |
| ○ 自宅 LAN では見つかっていません（外出先は Tailscale で接続） | ○ Not found on home network (connects via Tailscale when away) |
| 接続／接続中…／接続しました／接続できませんでした | Connect／Connecting…／Connected／Couldn't connect |
| 新しい登録リンクと QR コードを作成 | Create new link and QR code |
| 残り 4 分 59 秒・1 回だけ使えます | 4:59 remaining・Single use only |
| アドレスを直接入力 | Enter address manually |
| この Mac の試用期間が終了しました | The trial period for this Mac has ended |
| 購入する／購入を復元 | Buy／Restore Purchase |
| ライセンス | License |
| この Mac（◯◯）をライセンスに加えますか？（3 台のうち n 台目） | Add this Mac (◯◯) to your license? (n of 3) |
| 加える／外す | Add／Remove |
| この購入で使える Mac は 3 台までです。 | This purchase covers up to 3 Macs. |
| この購入で使っている Mac（n／3 台） | Macs on this purchase (n of 3) |
| この Mac のライセンスを外す | Remove license from this Mac |
| Mac に BlackHole 2ch が入っていません | BlackHole 2ch isn't installed on the Mac |
| Aqua Voice が BlackHole 2ch から録音していません | Aqua Voice isn't recording from BlackHole 2ch |
| 直接タッチ | Direct Touch |
| 画質：バランス／文字優先／滑らかさ優先 | Balanced／Text Priority／Smoothness Priority |
| 音声入力のバー | Voice Bar |
| 音声入力（Mac の Aqua Voice）／キーを登録… | Voice Input (Aqua Voice on Mac)／Register Key… |
| 外出先から接続したら、自宅の Mac の画面を自動で隠す | Automatically hide the home Mac's screen when connecting from outside |
| 画面を隠していたときは、切断したら Mac をロックする | Lock the Mac on disconnect if its screen was hidden |

アプリの名前は、サイトでは大文字の「MOTHERSHIP HOST」「MOTHERSHIP」。ヘルプには日本語版と同じく「アプリの画面では Mothership Host・Mothership と表示される」と書いてあります。

## 図を作り直すとき

```
cd mock/design_en
python3 tools/hero-fold/build.py    # tools/hero-fold/figure.html → index.html の <!-- hx --> の間と hero-fold.css
python3 tools/help-figs/build.py    # → help.html の <!-- fig:番号 --> の間と help-figs.css
```

- 日本語版の図を直したら、英語版の `tools/` にも同じ変更を入れてから書き出す（文言だけが英語で、動きとレイアウトは同じ）
- OGP 画像：`tools/og/og.html` を 1200×630 で撮ったもの
- ページの文言は、日本語版の HTML を「訳す単位」に分けて当てはめる方法で作った（作業用のスクリプトと訳の表は、リポジトリには入れていない）。**これ以降は、`design_en` の HTML を直接直す**

## HERO のアニメ（2026-11-21：C 案を採用して、作り直した）

終わり方を 3 案（A：半分に折る場面も残す／B：短くまとめる／C：指で拡大・カバー画面まで）作って比べ、**ユーザーが C 案を採用**。あわせて「もっと滑らかに。最初のフェードイン、最後のフェードアウト、ほかの作り込みも見直して作り直す」の指示で、全体を組み直した。比べるページ（`hero-versions.*`）と 3 案の生成スクリプトは消した。

**流れ（1 周 19.4 秒。秒は実際の秒）**

| 秒 | 場面 | 札 |
|---|---|---|
| 0–3.1 | ふわっと出る → 開く → 一覧 →「Connect」→ Mac の画面に切り替わる | Unfold your Fold7 and connect |
| 3.1–5.5 | AI の進み具合（行が 1 本ずつ伸びる）→「OK to continue?」 | See how your AI is doing |
| 5.5–8.0 | Allow を押す → 2 本指でスクロール →「✓ Report ready」 | Check it with your fingers |
| 8.0–11.8 | 🎤 を押して話す → 離すと文字 → 送る → いちばん高い棒が目立つ | Ask for what's next, by voice |
| 11.9–14.0 | 縦に持ち替える → 四隅の印がはまる「✓ Fits edge to edge」 | Turn it upright. Still a perfect fit. |
| 14.1–15.9 | 2 本指で広げて拡大（少しぼやけて、すぐくっきり） | Pinch to zoom in. It stays sharp. |
| 16.0–18.4 | 画面が消える → 本のように閉じる → カバー画面に Mac が映る | Fold it shut. Keep watch from the cover screen. |
| 18.4–19.4 | 少し沈みながら消える → 間を置いて、次の周へ | |

**滑らかにするために変えたこと**

- 出だし：図全体が下から少し上がりながら出る（.7 秒）。一覧の見出しと行も、少しずれて下から出る
- 終わり：.7 秒かけて、少し沈みながら消える。消えたあと .3 秒おいて、次の周が始まる
- 動きのかたち（`build.py` の `EO`・`EIO`・`SOFT`）をそろえた：出るものは「すっと出て、ゆっくり止まる」、動くものは「ゆっくり動き出して、ゆっくり止まる」。色の変化（ボタン・🎤・棒）も、ぱっと変えずに少し時間をかける
- 一覧 → Mac の画面：ただの入れ替えではなく、一覧が少し広がりながら消え、Mac の画面が少し小さいところから出る
- AI の作業の行：まとめて出すのをやめ、1 本ずつ左から伸びる（5 本目は「Allow」のあと）
- 指：ななめ下から寄ってきて、押すと輪が広がり、離れる。🎤 を押しているあいだは、波が 3 回広がる
- **縦に持ち替える**：前は「中身を消す → 枠だけ回す → 中身を出す」だった。今は、枠（`.hx-open`）を 90 度回すあいだ、中身（`.hx-scr`）を同じ角度だけ逆に回して正立させたまま、横長から縦長へ形を変える（窓は大きさを変えず、レポートの窓だけ画面に収まるように左へ寄る）。途切れずにつながる
- 場面の札：下から出て、上へ消える

**作り（`tools/hero-fold/`：`build.py`・`figure.html`・`static.css` → `index.html` の `<!-- hx -->` の間と `hero-fold.css`）**

- 速さ：`build.py` の `SPEED`（**今は 1.4。1 周 14.75 秒**。2026-11-21、ユーザーの指示）。開け閉めと、出だし・終わりのフェード（`SLOW` の区間）だけは、滑らかさを保つために等倍のまま。上の表の秒は、速さを掛ける前の秒。前の「1.6 倍」は、時刻そのものを実際の秒に書き直したので、もう掛けていない
- **縦にしたあとは、回していない端末（`.hx-pt`）に入れ替える**：回した枠の中の文字は、ブラウザーが絵として縮めて描くのでにじむ（確認して分かった）。回し終わった瞬間に、同じ位置・同じ大きさで、回していない縦の端末を上に重ねて出す。中身は `.hx-scr` の写し（`build.py` が `figure.html` の印 `scr` の間を、印 `scr2` のところに入れる。動きも同じものが付くので、同じ状態になる）。**中身を直すときは `figure.html` の 1 か所を直せば、両方に入る**
- ぼかし（`filter`）は、拡大のあいだだけ掛ける（ずっと掛けると、同じ理由でにじむ）
- 窓は並べ直さない：トップの本文に「回しても Mac の窓は並べ直されない」「縦では、窓を広げると読める」とあるので、縦にした直後は 2 つの窓が重なったままにしている
- グラフ：棒の上に小さな数字（$45k…）、下に月の名前。ふだんは小さくて読みにくく、指で拡大すると読める。いちばん高い棒には、声で頼んだあと「Top」が付く
- 閉じる：画面を消し（`.hx-off`）、左右の半分（`.hx-pl`・`.hx-pr`）に入れ替えて、左を手前へ起こし、その裏のカバー（`.hx-cov`）が右に重なる。閉じた端末は中央へ寄せ、カバー画面（`.hx-cv`）に、レポート（グラフ）の窓だけが画面いっぱいにぴったり映る（ユーザーの指示。はじめは AI の窓と小さなトラックパッドも描いていた）
- 「視差効果を減らす」の設定では、縦にしてグラフを拡大したところ（15.6 秒）で止める
- `static.css` の閉じていないコメントも直した（**日本語版の `static.css` には同じものが残っている**。見た目は変わらないので触っていない）
- **日本語版のモック（`../design/`）にも、同じ動きを入れた**（2026-11-21、ユーザーの指示。`build.py`・`static.css` は同じもので、`figure.html` の文字だけ日本語。直すときは両方に同じ変更を入れる）。**本番（`frontend/`）の HERO は前のまま**（半分に折って置くところで終わる）

## 確かめたこと（2026-11-21）

- 7 ページとも、本文に日本語が残っていない（「日本語」のリンクと、コメントは除く）
- リンクとページ内の行き先（`#…`）が、すべてある
- タグの釣り合いが取れている。日本語版とのタグの数の差は、意図した変更だけ（言語のリンク・注記・カードの差し替え）
- 見た目：headless Chrome で、トップ（PC は全体、スマホは前半）、ヘルプ（PC・スマホの前半と、図 29 個を止めた場面ごと）、HERO（9 場面）、画質のカード（3 場面）、お問い合わせ、お知らせ、404、利用規約、プライバシーポリシー、スマホのメニューを確かめた
- `node --check` で `script.js`・`contact.js` の文法を確かめた
- **確かめていないこと**：実機のブラウザー（Safari・Android の Chrome）、フォームの送信（モックは送らない）、英語を母語とする人による校正、法律の専門家による確認

## まだ決まっていないこと・確認してほしいこと

1. **アプリの英語化**：アプリはまだ日本語だけ。英語版のサイトを公開する時期と、アプリの英語化の時期（上の表の文言）
2. **英語でのお問い合わせ**：英語で届いたお問い合わせに、英語で返事をするか。するなら、お問い合わせのページに一言足す（例：「You can write to us in English or Japanese.」）。いまは書いていない
3. **価格**：US$19.99 は、App Store・Google Play の米国の価格として設定する必要がある（日本語版の特定商取引法のページにも「米国は US$19.99」とある）
4. **法律の文書**：英訳は日本語版をそのまま訳したもの（日本法・長野地方裁判所）。海外に向けて売るときに足すべき項目（EU の GDPR、米国の州法など）は入れていない。**公開前に専門家の確認を受けること**
5. **お知らせ**：本番のお知らせは WordPress の日本語の投稿。英語版では、英語の投稿を別に用意するか、お知らせのページを出さないかを決める
6. **本番の URL**：`/en/` などの置き場所。`hreflang` は日本語版と英語版の**両方**の `<head>` に入れる必要がある（日本語版に見えるリンクを置かなくても、`<head>` には入れる）。`x-default` も決める
7. **フッターの商標の文**：「iPhone の商標は、日本ではアイホン株式会社のライセンスにもとづき使用」は日本向けの文。英語版にも入れてある（外すかどうか）
8. **図の実物**：HERO と「Change the shape. The screen follows.」は絵。実機の写真・動画に差し替えるときは、英語の画面が必要
