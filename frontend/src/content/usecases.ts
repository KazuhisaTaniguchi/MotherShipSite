// 用途別のページ（検索の入口）。2026-11-25 追加。ねらう言葉と根拠は、Obsidian の「キーワード調査（2026-11-25）」。
// 事実は、トップページ（src/app/page.tsx）とヘルプに書いてあることだけ。機能や対応環境を変えたら、ここも直す。
// 本文の HTML は、このファイルに書いたものだけをそのまま出す（外から来た文字は入れない）。
import { APP_STORE_URL } from "@/components/nav";
import type { SetupVideoId } from "@/components/SetupVideo";

export type UseCase = {
  /** ページの言語（省くと日本語）。英語は src/content/usecases-en.ts */
  lang?: "ja" | "en";
  slug: string;
  /** <title>。あとに「｜MOTHERSHIP」が付く */
  title: string;
  description: string;
  kicker: string;
  h1: string;
  lead: string;
  image: { src: string; alt: string; width: number; height: number; caption: string };
  /** 本文（h2 ごと）。video を書くと、その段の終わりにセットアップ動画を出す（日本語だけ。動画は src/components/SetupVideo.tsx） */
  sections: { h2: string; html: string; video?: SetupVideoId }[];
  faq: { q: string; a: string }[];
  /** いちばん下のボタン。store が null のときは「近日公開」（soon に出す文） */
  store: { label: string; href: string } | null;
  soon?: string;
};

const A = (href: string, text: string) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

// どのページにも入れる段（中身は同じ事実。言い回しは、ページごとに端末の名前を入れる）
const outside = (device: string) => ({
  h2: "外出先からつなぐには",
  html: `<p>家のWi-Fiでは、登録したMacを自動で見つけてつながります。外出先からは、Macと${device}に<b>Tailscale</b>（個人なら無料で使えるVPNサービス）を入れて、同じアカウントでログインしておきます。ルーターの設定を変える必要はありません。</p>
<ul>
<li>Macがスリープすると、外からつなげません。MOTHERSHIP HOSTの「待機中もMacをスリープさせない」をオンにしておきます。</li>
<li>Wi-Fiからモバイル回線に切り替わっても、自動でつなぎ直します。</li>
<li>映像と操作は、Macと${device}の間で直接やり取りします。MOTHERSHIPのサーバーは通りません。</li>
</ul>
<p>準備の流れは、下の動画で見られます。くわしい手順は、<a href="/help/#outside">ヘルプの「外から使う」</a>にあります。</p>`,
  video: "outside" as const,
});

const pricing = {
  h2: "料金",
  html: `<ul>
<li><b>14日間、すべての機能を無料で</b>試せます。</li>
<li>そのあとは<b>買い切り 3,000円（税込）</b>です。月額料金はかかりません。</li>
<li>一度の購入で、Macを3台まで使えます。</li>
<li>アカウントの登録は要りません。</li>
</ul>
<p>くわしくは、<a href="/#pricing">料金</a>をご覧ください。</p>`,
};

const voice = (device: string) => ({
  h2: "長い文は、声で",
  html: `<p>${device}の🎤ボタンを押している間に話すと、その声がMacに届き、開いているアプリに文字が入ります。画面のキーボードを出さないので、Macの画面は広いままです。</p>
<p>声で入力するには、Macに音声入力アプリ「Aqua Voice」（別の会社の製品です）と、無料の仮想オーディオ「BlackHole 2ch」を入れておきます。準備の流れは下の動画で、くわしい手順は<a href="/help/#voice">ヘルプの「声で書く準備」</a>で見られます。Aqua Voiceを使わないときは、アプリ内のキーボードか、${device}のキーボードで入力できます。</p>`,
  video: "voice" as const,
});

// ---- AI の道具とくらべるページ ----
const aiSetup = {
  h2: "MOTHERSHIPのはじめかた（3ステップ）",
  html: `<ol>
<li>家のMacに、<a href="/#download">MOTHERSHIP HOST</a>を入れます（macOS 14以降。Appleシリコン・Intel搭載のMacに対応）。</li>
<li>iPhone・iPadに、${A(APP_STORE_URL, "App Store")}からMOTHERSHIPを入れます。Android版は、Google Playで近日公開です。</li>
<li>Macに出るQRコードを読み取って登録し、「接続」をタップします。</li>
</ol>
<p>外出先から使うには、MacとスマホにTailscaleを入れておきます（<a href="/help/#outside">外から使う</a>）。声で指示するには、MacにAqua VoiceとBlackHole 2chを入れておきます（<a href="/help/#voice">声で書く準備</a>）。</p>`,
};

const AI_PAGES: UseCase[] = [
  {
    slug: "claude-code-from-phone",
    title: "Claude Codeをスマホから操作する方法｜公式のRemote Controlと、Macの画面ごと操作する方法",
    description:
      "Claude Codeをスマホから操作する方法を整理しました。公式のRemote Control、Claude Code on the web、そしてMacの画面ごとスマホに映して操作する方法（MOTHERSHIP）。それぞれの向き・不向きと、ブラウザーのプレビューやほかのアプリも一緒に見たいときの選び方。",
    kicker: "Claude Codeを、スマホから",
    h1: "Claude Codeを、スマホから操作する方法",
    lead: "MacでClaude Codeに作業を任せて、席を離れる。その間の進み具合を見て、次の指示を出す方法は、いくつかあります。公式の機能と、Macの画面ごと操作する方法を、向き・不向きと一緒に整理しました（2026年11月時点）。",
    image: { src: "/images/usecases/ai.jpg", alt: "家のMacで動くAIの確認待ちに、iPhoneから「許可する」をタップしているMOTHERSHIPの画面。", width: 644, height: 1400, caption: "Macの画面をそのまま映すので、確認のボタンも指で押せます。" },
    sections: [
      {
        h2: "方法は、大きく3つ",
        html: `<table>
<thead><tr><th>方法</th><th>どこで動くか</th><th>スマホで見えるもの</th></tr></thead>
<tbody>
<tr><th>Remote Control（公式）</th><td>自分のMacのClaude Code</td><td>Claude Codeのやり取り</td></tr>
<tr><th>Claude Code on the web（公式）</th><td>Anthropicのクラウド</td><td>Claude Codeのやり取り</td></tr>
<tr><th>Macの画面ごと操作（MOTHERSHIP）</th><td>自分のMac</td><td>Macの画面ぜんぶ</td></tr>
</tbody>
</table>
<p>公式の機能のくわしい条件や手順は変わることがあるので、${A("https://code.claude.com/docs/ja/mobile", "Claude Codeの公式ドキュメント")}で確かめてください。</p>`,
      },
      {
        h2: "公式のRemote Controlが向いている場面",
        html: `<p>Remote Controlは、Macで動いているClaude Codeのセッションを、スマホのClaudeアプリやブラウザーから操作する公式の機能です。ファイルや道具はMacの中のままで、やり取りの画面だけが手もとに来ます。</p>
<ul>
<li>Claude Codeとのやり取りだけで、作業が進むとき。</li>
<li>スマホに合わせた画面で、手早く返事をしたいとき。</li>
<li>追加のアプリを入れたくないとき。</li>
</ul>
<p>まずは公式の機能を試すのが、いちばん手軽です。</p>`,
      },
      {
        h2: "Macの画面ごと操作する方法が向いている場面",
        html: `<p>MOTHERSHIPは、Macの画面をそのままスマホに映して動かすリモートデスクトップアプリです。Claude Codeの専用の道具ではありませんが、次のようなときに役に立ちます。</p>
<ul>
<li><b>ターミナルの外も見たいとき</b>：ブラウザーのプレビュー、シミュレーター、エディター、デザインのアプリなど、Claude Codeが作ったものを、その目で確かめられます。</li>
<li><b>いくつものAIや道具を、同時に使っているとき</b>：Claude CodeもCodexも、ターミナルの窓を切り替えるだけです。AIの側の設定は要りません。</li>
<li><b>いつものターミナルの画面のまま、続けたいとき</b>：Macで開いているセッションを、そのまま操作します。</li>
<li><b>長い指示を、声で出したいとき</b>：🎤を押して話すと、Macの入力欄に文字が入ります（MacにAqua Voiceが必要です）。</li>
</ul>
<p>スマホでも文字が読めるように、MOTHERSHIPはスマホと同じ形の専用モニターをMacに用意します。Macのモニターを縮めて映すのではないので、ターミナルの文字がくっきり読めます。</p>`,
      },
      {
        h2: "MOTHERSHIPに、できないこと",
        html: `<ul>
<li><b>作業の終わりを知らせる機能はありません</b>。気になったときに開いて、進み具合を見る使い方になります。</li>
<li>MOTHERSHIPに、AIの機能は入っていません。Macの画面を映して動かすアプリです。</li>
<li>Macがスリープすると、つなげません。MOTHERSHIP HOSTの「待機中もMacをスリープさせない」をオンにしておきます。</li>
<li>外出先から使うには、MacとスマホにTailscaleが必要です。</li>
</ul>
<p>公式の機能とMOTHERSHIPは、どちらか一方を選ぶものではありません。ふだんは公式の機能で返事をして、画面で確かめたいときだけMOTHERSHIPを開く、という使い分けもできます。</p>`,
      },
      aiSetup,
      pricing,
    ],
    faq: [
      { q: "Claude Codeを、スマホから操作できますか？", a: "はい。公式のRemote ControlやClaude Code on the webのほか、MOTHERSHIPのようなリモートデスクトップで、Macの画面ごとスマホから操作する方法があります。" },
      { q: "MOTHERSHIPは、Claude Codeの公式のアプリですか？", a: "いいえ。MOTHERSHIPは独立して開発されたリモートデスクトップアプリです。Anthropicが認定・後援・承認したものではありません。MOTHERSHIPに、AIの機能は入っていません。" },
      { q: "Claude Codeの作業が終わったら、MOTHERSHIPが知らせてくれますか？", a: "いいえ。MOTHERSHIPに、作業の終わりを知らせる機能はありません。気になったときに開いて、進み具合を見る使い方になります。" },
      { q: "スマホの小さな画面でも、ターミナルの文字は読めますか？", a: "はい。デバイスと同じ形の専用モニターをMacに用意するので、文字が縮みません。もっと大きく見たいときは、ピンチで拡大できます。細かい文字が多いときは、画質の「文字優先」が向いています。" },
    ],
    store: { label: "App Storeでダウンロード", href: APP_STORE_URL },
  },
  {
    slug: "codex-from-phone",
    title: "Codexをスマホから操作する方法｜公式のモバイルアプリと、Macの画面ごと操作する方法",
    description:
      "Codexをスマホから操作する方法を整理しました。ChatGPTのモバイルアプリからMacのCodexにつなぐ公式の方法と、Macの画面ごとスマホに映して操作する方法（MOTHERSHIP）。それぞれの向き・不向きと、プレビューやほかのアプリも一緒に見たいときの選び方。",
    kicker: "Codexを、スマホから",
    h1: "Codexを、スマホから操作する方法",
    lead: "MacでCodexに作業を任せて、席を離れる。その間の進み具合を見て、次の指示を出す方法を、公式の機能と、Macの画面ごと操作する方法に分けて整理しました（2026年11月時点）。",
    image: { src: "/images/usecases/ai.jpg", alt: "家のMacで動くAIの確認待ちに、iPhoneから「許可する」をタップしているMOTHERSHIPの画面。", width: 644, height: 1400, caption: "Macの画面をそのまま映すので、確認のボタンも指で押せます。" },
    sections: [
      {
        h2: "方法は、大きく2つ",
        html: `<table>
<thead><tr><th>方法</th><th>スマホで見えるもの</th><th>向いている場面</th></tr></thead>
<tbody>
<tr><th>ChatGPTのモバイルアプリ（公式）</th><td>Codexのタスクとやり取り</td><td>タスクの確認、承認、差分のレビュー</td></tr>
<tr><th>Macの画面ごと操作（MOTHERSHIP）</th><td>Macの画面ぜんぶ</td><td>プレビューやほかのアプリも見ながら進める</td></tr>
</tbody>
</table>
<p>公式の機能のくわしい条件や手順は変わることがあるので、${A("https://learn.chatgpt.com/ja-JP/docs/mobile", "OpenAIの公式の説明")}で確かめてください。</p>`,
      },
      {
        h2: "公式のモバイルアプリが向いている場面",
        html: `<p>ChatGPTのモバイルアプリからは、つないだコンピューターのCodexを開いて、進行中のタスクの確認、コマンドの承認、変更の差分のレビュー、新しいタスクの開始ができます。ファイルやターミナルは、コンピューターの側に残ります。</p>
<ul>
<li>Codexとのやり取りだけで、作業が進むとき。</li>
<li>スマホに合わせた画面で、承認やレビューを手早く済ませたいとき。</li>
<li>追加のアプリを入れたくないとき。</li>
</ul>`,
      },
      {
        h2: "Macの画面ごと操作する方法が向いている場面",
        html: `<p>MOTHERSHIPは、Macの画面をそのままスマホに映して動かすリモートデスクトップアプリです。Codexの専用の道具ではありませんが、次のようなときに役に立ちます。</p>
<ul>
<li><b>Codexの外も見たいとき</b>：ブラウザーのプレビュー、シミュレーター、エディターなど、Codexが作ったものを、その目で確かめられます。</li>
<li><b>ターミナルで動かしているCodexを、そのまま続けたいとき</b>：Macで開いている画面を、そのまま操作します。</li>
<li><b>いくつものAIや道具を、同時に使っているとき</b>：CodexもClaude Codeも、窓を切り替えるだけです。AIの側の設定は要りません。</li>
<li><b>長い指示を、声で出したいとき</b>：🎤を押して話すと、Macの入力欄に文字が入ります（MacにAqua Voiceが必要です）。</li>
</ul>
<p>スマホでも文字が読めるように、MOTHERSHIPはスマホと同じ形の専用モニターをMacに用意します。Macのモニターを縮めて映すのではないので、文字がくっきり読めます。</p>`,
      },
      {
        h2: "MOTHERSHIPに、できないこと",
        html: `<ul>
<li><b>作業の終わりを知らせる機能はありません</b>。気になったときに開いて、進み具合を見る使い方になります。</li>
<li>MOTHERSHIPに、AIの機能は入っていません。Macの画面を映して動かすアプリです。</li>
<li>操作できるのはMacだけです。WindowsやLinuxのパソコンは操作できません。</li>
<li>Macがスリープすると、つなげません。外出先から使うには、MacとスマホにTailscaleが必要です。</li>
</ul>`,
      },
      aiSetup,
      pricing,
    ],
    faq: [
      { q: "Codexを、スマホから操作できますか？", a: "はい。ChatGPTのモバイルアプリからつなぐ公式の方法のほか、MOTHERSHIPのようなリモートデスクトップで、Macの画面ごとスマホから操作する方法があります。" },
      { q: "MOTHERSHIPは、Codexの公式のアプリですか？", a: "いいえ。MOTHERSHIPは独立して開発されたリモートデスクトップアプリです。OpenAIが認定・後援・承認したものではありません。MOTHERSHIPに、AIの機能は入っていません。" },
      { q: "どのAIで使えますか？", a: "Macで動くAIなら、どれでも使えます。MOTHERSHIPは、Macの画面をそのまま映して動かすアプリです。ターミナルで動くAIも、エディターのAIも、ブラウザーのAIも、いつもの画面のまま使えます。" },
      { q: "月額料金はかかりますか？", a: "かかりません。14日間の試用のあとは、一度の購入（3,000円・税込）でずっと使えます。" },
    ],
    store: { label: "App Storeでダウンロード", href: APP_STORE_URL },
  },
];

export const USE_CASES: UseCase[] = [
  {
    slug: "mac-remote-desktop-ipad",
    title: "iPadからMacをリモートデスクトップで操作する方法｜外出先からも",
    description:
      "iPadから家のMacをリモートデスクトップで操作する方法。MOTHERSHIPは、iPadと同じ形の専用モニターをMacに用意するので、文字が縮まずくっきり読めます。タップでクリック、声で入力、外出先からはTailscaleで接続。買い切り・月額なし、14日間無料。",
    kicker: "iPadから",
    h1: "iPadから、Macをリモートデスクトップで操作する",
    lead: "家のMacやMac miniを、iPadから操作する方法をまとめました。MOTHERSHIPは、iPadの画面と同じ形のモニターをMacの中に足して映すので、Macの文字がそのままの大きさで読めます。",
    image: { src: "/images/usecases/ipad.jpg", alt: "iPadにMacの画面を映しているMOTHERSHIPの画面。iPadが、Macの大画面に。", width: 1050, height: 1400, caption: "iPadの画面いっぱいに、Macの画面が映ります。" },
    sections: [
      {
        h2: "ふつうの画面共有と、何がちがうのか",
        html: `<p>ふつうのリモートデスクトップや画面共有は、Macのモニターをそのまま縮めて映します。iPadとMacのモニターは形がちがうので、上下に余白ができて、文字は小さくなります。</p>
<p>MOTHERSHIPは、つないでいる間だけ、<b>iPadと同じ大きさ・同じ形の専用モニター</b>をMacに追加します。点と点がぴったり合った状態で映るので、ターミナルの小さな文字も、表の数字も、拡大せずに読めます。iPadを縦にすれば縦長の画面に、横にすれば横長の画面に切り替わります。</p>`,
      },
      {
        h2: "iPadでできること",
        html: `<ul>
<li><b>指で動かす</b>：触った場所が、そのままクリックになります。長押しで右クリック、2本指でスクロール。</li>
<li><b>3本指のスワイプ</b>：上へスワイプでMission Control（開いている窓の一覧）、左右でデスクトップの切り替え。</li>
<li><b>Macのキーボード</b>：アプリ内のキーボードとショートカットのバーで、⌘C・⌘V・⌘Tabもワンタップで送れます。</li>
<li><b>画質の切り替え</b>：バランス（最大60fps）、文字優先、滑らかさ優先の3種類。</li>
<li><b>ピンチで拡大</b>：見ている部分を、高い解像度で取り込み直します。</li>
</ul>
<p>動きの激しいゲームには向きません。操作できるのはMacだけで、WindowsやLinuxのパソコンは操作できません。</p>`,
      },
      voice("iPad"),
      {
        h2: "はじめかた（3ステップ）",
        html: `<ol>
<li>家のMacに、<a href="/#download">MOTHERSHIP HOST</a>を入れます（macOS 14以降。Appleシリコン・Intel搭載のMacに対応）。「画面収録」と「アクセシビリティ」の2つの許可をオンにします。</li>
<li>iPadに、${A(APP_STORE_URL, "App Store")}からMOTHERSHIPを入れます（iPadOS 27以降）。</li>
<li>Macに出るQRコードをiPadで読み取って登録し、「接続」をタップします。</li>
</ol>
<p>図つきの手順は、<a href="/help/">ヘルプ</a>にあります。</p>`,
      },
      outside("iPad"),
      pricing,
    ],
    faq: [
      { q: "iPadから、外出先でも家のMacを操作できますか？", a: "はい。MacとiPadにTailscale（個人なら無料で使えるVPNサービス）を入れておくと、外出先からも接続できます。ルーターの設定を変える必要はありません。" },
      { q: "iPadでも、Macの文字は読めますか？", a: "はい。iPadと同じ形の専用モニターをMacに用意するので、文字が縮みません。もっと大きく見たいときは、ピンチで拡大できます。" },
      { q: "月額料金はかかりますか？", a: "かかりません。14日間の試用のあとは、一度の購入（3,000円・税込）でずっと使えます。" },
    ],
    store: { label: "App Storeでダウンロード", href: APP_STORE_URL },
  },
  {
    slug: "mac-remote-desktop-iphone",
    title: "iPhoneからMacをリモートデスクトップで操作する方法｜外出先からも",
    description:
      "iPhoneから家のMacをリモートデスクトップで操作する方法。MOTHERSHIPは、iPhoneの形に合わせた専用モニターをMacに用意するので、小さな画面でも文字が縮みません。タップでクリック、長い文は声で入力。外出先からはTailscaleで接続。買い切り・月額なし。",
    kicker: "iPhoneから",
    h1: "iPhoneから、Macをリモートデスクトップで操作する",
    lead: "家のMacを、iPhoneから操作する方法をまとめました。iPhoneの小さな画面でMacを使うときの困りごとは、「文字が小さい」と「長い文が打てない」の2つです。MOTHERSHIPは、その2つに答えるために作りました。",
    image: { src: "/images/usecases/iphone.jpg", alt: "iPhoneにMacの画面を映しているMOTHERSHIPの画面。縮めずに、iPhoneの形で。", width: 644, height: 1400, caption: "Macの画面を縮めずに、iPhoneの形で映します。" },
    sections: [
      {
        h2: "iPhoneでも、文字が読める理由",
        html: `<p>27インチのモニターをそのままiPhoneに映すと、文字は小さすぎて読めません。ふつうのリモートデスクトップは、Macのモニターを縮めて映すからです。</p>
<p>MOTHERSHIPは、つないでいる間だけ、<b>iPhoneと同じ大きさ・同じ形の専用モニター</b>をMacに追加します。画面いっぱいに、点と点がぴったり合った状態で映るので、ターミナルの小さな文字もくっきり読めます。iPhoneを横にすれば、横長の画面に切り替わります。細かい文字が多いときは、画質を「文字優先」にできます。</p>`,
      },
      {
        h2: "指だけで、Macを動かす",
        html: `<ul>
<li><b>直接タッチ</b>：触った場所が、そのままクリックになります。Macで動いているAIが確認を求めてきたら、そのボタンを指で押すだけです。</li>
<li><b>長押しで右クリック、2本指でスクロール</b>。3本指で上にスワイプすると、開いている窓の一覧（Mission Control）です。</li>
<li><b>細かい場所をねらうとき</b>：画面全体をトラックパッドとして使うモードに切り替えられます。</li>
<li><b>Macのキーボード</b>：アプリ内のキーボードとショートカットのバーで、⌘C・⌘V・⌘Tabも送れます。</li>
</ul>`,
      },
      voice("iPhone"),
      {
        h2: "こんなときに",
        html: `<ul>
<li>MacでClaude CodeやCodexなどのAIに作業を任せて出かけ、進み具合を手もとで確かめる。止まっていたら、続きを指示する。</li>
<li>家のMacにしかないファイルや書類を、出先でちょっと確かめる。</li>
<li>ソファやベッドから、机のMacを操作する。</li>
</ul>
<p>MOTHERSHIPに、AIの機能は入っていません。Macの画面をそのまま映して動かすので、ターミナルのAIも、エディターのAIも、いつもの画面のまま使えます。作業の終わりを知らせる機能はありません。</p>`,
      },
      {
        h2: "はじめかた（3ステップ）",
        html: `<ol>
<li>家のMacに、<a href="/#download">MOTHERSHIP HOST</a>を入れます（macOS 14以降。Appleシリコン・Intel搭載のMacに対応）。「画面収録」と「アクセシビリティ」の2つの許可をオンにします。</li>
<li>iPhoneに、${A(APP_STORE_URL, "App Store")}からMOTHERSHIPを入れます（iOS 27以降）。</li>
<li>Macに出るQRコードをiPhoneで読み取って登録し、「接続」をタップします。</li>
</ol>
<p>図つきの手順は、<a href="/help/">ヘルプ</a>にあります。</p>`,
      },
      outside("iPhone"),
      pricing,
    ],
    faq: [
      { q: "iPhoneの小さな画面でも、Macの文字は読めますか？", a: "はい。iPhoneと同じ形の専用モニターをMacに用意するので、文字が縮みません。もっと大きく見たいときは、ピンチで拡大できます。細かい文字が多いときは、画質の「文字優先」が向いています。" },
      { q: "iPhoneから、外出先でも家のMacを操作できますか？", a: "はい。MacとiPhoneにTailscale（個人なら無料で使えるVPNサービス）を入れておくと、外出先からも接続できます。ルーターの設定を変える必要はありません。" },
      { q: "Claude CodeやCodexを、iPhoneから操作できますか？", a: "はい。MOTHERSHIPはMacの画面をそのまま映して動かすので、ターミナルで動くClaude CodeやCodexも、いつもどおり操作できます。MOTHERSHIPに、AIの機能は入っていません。" },
      { q: "通信量はどのくらいですか？", a: "画面の動きと回線の状態に合わせて、自動で調整します。画面が止まっている間は、ほとんど通信しません。" },
    ],
    store: { label: "App Storeでダウンロード", href: APP_STORE_URL },
  },
  {
    slug: "mac-remote-desktop-android",
    title: "AndroidからMacをリモートデスクトップで操作する方法｜スマホ・タブレット・折りたたみ",
    description:
      "Androidのスマホ・タブレット・折りたたみスマホから、家のMacをリモートデスクトップで操作する方法。MOTHERSHIPは、端末の形に合わせた専用モニターをMacに用意します。Galaxy Z Fold7で動作を確認。Google Playで近日公開。買い切り・月額なし。",
    kicker: "Androidから",
    h1: "Androidから、Macをリモートデスクトップで操作する",
    lead: "Androidのスマホ・タブレット・折りたたみスマホから、家のMacを操作する方法をまとめました。Android版のMOTHERSHIPは、Google Playで近日公開です。",
    image: { src: "/images/usecases/android.jpg", alt: "折りたたみスマホを開いて、Macの画面を映しているMOTHERSHIPの画面。開けば、Macの大画面。", width: 1600, height: 900, caption: "折りたたみスマホを開くと、その形のMacの画面になります。" },
    sections: [
      {
        h2: "AndroidとMacを、じかにつなぐ",
        html: `<p>AndroidからMacを操作するには、Macに「MOTHERSHIP HOST」、Androidに「MOTHERSHIP」を入れて、Macに出るQRコードを読み取ります。アカウントの登録は要りません。</p>
<p>ふつうのリモートデスクトップは、Macのモニターを縮めて映します。MOTHERSHIPは、つないでいる間だけ、<b>手もとの端末と同じ形の専用モニター</b>をMacに追加するので、小さな画面でも文字が縮みません。</p>`,
      },
      {
        h2: "折りたたみスマホなら、形を変えると画面も変わる",
        html: `<ul>
<li><b>閉じたまま（カバー画面）</b>：Macの画面と小さなトラックパッドで、進み具合を確かめられます。</li>
<li><b>開く</b>：開いた画面の形のモニターがMacにでき、画面いっぱいに映ります。</li>
<li><b>半分に折って机に置く</b>：上の画面がMacの画面に、下の画面がショートカットとトラックパッドになります（キーボードにも切り替えられます）。</li>
<li><b>本のように持つ</b>：左がMacの画面、右がトラックパッドとキーボードです。</li>
</ul>
<p>Android 13以降の折りたたみスマホで動く作りです。実機で動作を確かめたのは、Galaxy Z Fold7です。</p>`,
      },
      {
        h2: "スマホでも、タブレットでも",
        html: `<p>同じアプリを、Android 13以降のスマホとタブレットに入れられます。タブレットでは、iPadと同じように、画面に合わせた専用モニターと大きめのキーボードで操作できます。</p>
<ul>
<li>タップでクリック、長押しで右クリック、2本指でスクロール。</li>
<li>画面全体をトラックパッドとして使うモードに切り替えられます。</li>
<li>アプリ内のキーボードとショートカットのバーで、⌘C・⌘V・⌘Tabも送れます。</li>
</ul>`,
      },
      voice("Android"),
      outside("Android"),
      {
        h2: "配信について",
        html: `<p>Android版は、Google Playで近日公開です。配信を始めたら、<a href="/news/">お知らせ</a>でご案内します。家のMacに入れる<a href="/#download">MOTHERSHIP HOST</a>は、いまダウンロードできます。</p>
<p>iPhone・iPadをお持ちの方は、<a href="/mac-remote-desktop-iphone/">iPhoneから</a>・<a href="/mac-remote-desktop-ipad/">iPadから</a>のページをご覧ください。こちらは、App Storeで配信中です。</p>`,
      },
      pricing,
    ],
    faq: [
      { q: "AndroidからMacを操作できますか？", a: "はい。Macに「MOTHERSHIP HOST」、Androidに「MOTHERSHIP」を入れて、Macに出るQRコードを読み取るとつながります。Android版は、Google Playで近日公開です。" },
      { q: "どの折りたたみスマホで使えますか？", a: "Android 13以降の折りたたみスマホで動く作りです。実機で動作を確かめたのは、Galaxy Z Fold7です。ほかの機種は、確かめたものから順にお知らせします。" },
      { q: "Androidのタブレットでも使えますか？", a: "はい。スマホと同じアプリを、Android 13以降のタブレットにも入れられます。タブレットでは、iPadと同じように、画面に合わせた仮想モニターと大きめのキーボードで操作できます。" },
      { q: "GalaxyのDeXと何がちがいますか？", a: "DeXは、スマホのアプリをパソコンのような大きな画面で使う機能です。MOTHERSHIPは、家のMacを、スマホから操作するアプリです。" },
    ],
    store: null,
  },
  {
    slug: "mac-mini-remote-desktop",
    title: "Mac miniをiPad・iPhoneからリモートデスクトップで操作｜AI用のMac miniを手もとで",
    description:
      "Mac miniを、iPad・iPhoneからリモートデスクトップで操作する方法。置きっぱなしのMac miniでClaude CodeやCodexなどのAIを動かし、進み具合の確認と次の指示を手もとから。端末の形の専用モニターで文字がくっきり。外出先からはTailscaleで。買い切り・月額なし。",
    kicker: "Mac miniを",
    h1: "Mac miniを、iPad・iPhoneからリモートデスクトップで操作する",
    lead: "Mac miniを家に置いたまま、iPadやiPhoneから操作する方法をまとめました。AIに作業を任せるためのMac miniを、手もとから見て、動かして、次の指示を出せます。",
    image: { src: "/images/usecases/mac-mini.jpg", alt: "家のMacで動くAIの確認待ちに、iPadから「許可する」をタップしているMOTHERSHIPの画面。", width: 1050, height: 1400, caption: "家のMac miniで動くAIの確認に、手もとから答えられます。" },
    sections: [
      {
        h2: "Mac miniを、AIのための1台に",
        html: `<p>Mac miniでClaude CodeやCodexなどのAIを動かしておくと、席を離れている間も作業が進みます。困るのは、<b>AIが確認待ちで止まっていても、その場にいないと気づけない</b>ことと、<b>次の指示を出せない</b>ことです。</p>
<p>MOTHERSHIPは、Mac miniの画面をそのままiPad・iPhoneに映して動かします。気になったときに開いて進み具合を見て、確認のボタンを指で押し、次の指示を声で出せます。ターミナルのAIも、エディターのAIも、ブラウザーのAIも、いつもの画面のままです。AIの側の設定は要りません。</p>
<p>MOTHERSHIPに、AIの機能は入っていません。作業の終わりを知らせる機能もありません。</p>`,
      },
      {
        h2: "手もとの画面に合わせた、専用のモニター",
        html: `<p>MOTHERSHIPは、つないでいる間だけ、<b>iPad・iPhoneと同じ大きさ・同じ形の専用モニター</b>をMac miniに追加します。ふつうの画面共有のように、大きなモニターを縮めて映すのではないので、文字がくっきり読めます。専用モニターは、接続を切ると自動で消えます。</p>
<p>いつも使っているモニターを、そのまま映すこともできます。</p>`,
      },
      {
        h2: "置きっぱなしで使うための設定",
        html: `<ul>
<li><b>スリープさせない</b>：Macがスリープすると、任せた作業も、外からの接続も止まります。MOTHERSHIP HOSTの「待機中もMacをスリープさせない」をオンにします。</li>
<li><b>ログイン時に起動</b>：オンにしておくと、Macにログインしたあと、自動で待ち受けをはじめます。Macを再起動したあとは、ログインするまで接続できません。</li>
<li><b>一度に1台</b>：1台のMacにつなげるのは、一度に1台です。別のデバイスからつなぐと、そちらに切り替わります。</li>
<li><b>自動で切断</b>：操作がないまま時間がたつと、自動で切断します（はじめの設定は30分）。</li>
</ul>
<p>くわしくは、<a href="/help/#keep-awake">ヘルプの「Macを起こしておく」</a>にあります。</p>`,
      },
      voice("iPad・iPhone"),
      {
        h2: "はじめかた（3ステップ）",
        html: `<ol>
<li>Mac miniに、<a href="/#download">MOTHERSHIP HOST</a>を入れます（macOS 14以降。Appleシリコン・Intel搭載のMacに対応）。「画面収録」と「アクセシビリティ」の2つの許可をオンにします。</li>
<li>iPad・iPhoneに、${A(APP_STORE_URL, "App Store")}からMOTHERSHIPを入れます（iOS 27・iPadOS 27以降）。</li>
<li>Mac miniに出るQRコードを読み取って登録し、「接続」をタップします。</li>
</ol>
<p>はじめの設定（2つの許可とQRコードの表示）は、Mac miniの画面を見ながら行います。図つきの手順は、<a href="/help/">ヘルプ</a>にあります。Android版は、Google Playで近日公開です（<a href="/mac-remote-desktop-android/">Androidから</a>）。</p>`,
      },
      outside("iPad・iPhone"),
      pricing,
    ],
    faq: [
      { q: "Mac miniを、iPadやiPhoneから操作できますか？", a: "はい。Mac miniに「MOTHERSHIP HOST」、iPad・iPhoneに「MOTHERSHIP」を入れて、Mac miniに出るQRコードを読み取るとつながります。" },
      { q: "Mac miniで動かしているClaude CodeやCodexを、外から操作できますか？", a: "はい。MOTHERSHIPはMacの画面をそのまま映して動かすので、ターミナルで動くClaude CodeやCodexも、いつもどおり操作できます。外出先から使うには、MacとデバイスにTailscaleを入れておきます。MOTHERSHIPに、AIの機能は入っていません。" },
      { q: "出かけている間、Mac miniはつけたままにするのですか？", a: "はい。Macがスリープすると、外からつなげません。MOTHERSHIP HOSTの「待機中もMacをスリープさせない」をオンにしておきます。" },
      { q: "Mac miniを再起動したあとは使えますか？", a: "Macにログインするまでは、MOTHERSHIP HOSTが動かないため接続できません。ログインしたあとは、自動で待ち受けをはじめます（「ログイン時に起動」をオンにした場合）。" },
    ],
    store: { label: "App Storeでダウンロード", href: APP_STORE_URL },
  },
];

// AI の道具とくらべるページ（2026-11-25。公式の機能の説明は、各社の公式の説明にもとづく。変わりやすいので、ときどき見直す）
USE_CASES.push(...AI_PAGES);

export const USE_CASE_SLUGS = USE_CASES.map((u) => u.slug);
export const getUseCase = (slug: string) => USE_CASES.find((u) => u.slug === slug)!;

/** ページどうしのリンクと、トップページのリンクに使う短い名前 */
export const USE_CASE_LINKS = [
  { href: "/mac-remote-desktop-iphone/", label: "iPhoneからMacを操作" },
  { href: "/mac-remote-desktop-ipad/", label: "iPadからMacを操作" },
  { href: "/mac-remote-desktop-android/", label: "AndroidからMacを操作" },
  { href: "/mac-mini-remote-desktop/", label: "Mac miniを手もとから" },
  { href: "/claude-code-from-phone/", label: "Claude Codeをスマホから" },
  { href: "/codex-from-phone/", label: "Codexをスマホから" },
] as const;
