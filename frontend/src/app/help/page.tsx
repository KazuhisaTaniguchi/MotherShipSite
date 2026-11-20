import type { Metadata } from "next";
import Link from "next/link";

// ヘルプ。mock/design/help.html の <main> を JSX にしたもの（スタイルは src/styles/legal.css・help.css・help-figs.css）。
// 図は mock/design/tools/help-figs/build.py が書き出したもの（help-figs.css もその写し。直すときはモックで直して写す）。
// モックで赤い枠の「未確定：…」を付けた 6 か所は、本番では印を出さず、いま確かな文だけにしている
export const metadata: Metadata = {
  title: "ヘルプ",
  description:
    "MOTHERSHIPのヘルプです。Macに入れてつなぐまでの手順、声で書くための準備（Aqua Voice・Homebrew・BlackHole 2ch）、外から使う準備、うまくいかないときの確かめ方を説明します。",
  alternates: { canonical: "/help/" },
};

export default function Help() {
  return (
    <main id="main">
        <svg className="svg-defs" aria-hidden="true"><symbol id="hs-mark" viewBox="0 0 128 128"><path d="M60 28 22 86 49 80 60 91 60 75 48 70 60 54Z" fill="#fff"/><path d="M68 28 106 86 79 80 68 91 68 75 80 70 68 54Z" fill="#a8f8ff"/><path d="M64 86 72 98 64 105 56 98Z" fill="#fff"/></symbol><symbol id="hs-qr" viewBox="0 0 19 19"><path d="M0 0h7v1h-7zM8 0h2v1h-2zM12 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM8 1h1v1h-1zM10 1h1v1h-1zM12 1h1v1h-1zM18 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h1v1h-1zM10 2h1v1h-1zM12 2h1v1h-1zM14 2h3v1h-3zM18 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM8 3h3v1h-3zM12 3h1v1h-1zM14 3h3v1h-3zM18 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM8 4h1v1h-1zM10 4h1v1h-1zM12 4h1v1h-1zM14 4h3v1h-3zM18 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM12 5h1v1h-1zM18 5h1v1h-1zM0 6h7v1h-7zM9 6h1v1h-1zM12 6h7v1h-7zM8 7h1v1h-1zM10 7h1v1h-1zM0 8h3v1h-3zM4 8h1v1h-1zM7 8h1v1h-1zM9 8h3v1h-3zM13 8h2v1h-2zM16 8h2v1h-2zM1 9h1v1h-1zM6 9h1v1h-1zM8 9h2v1h-2zM11 9h1v1h-1zM13 9h1v1h-1zM18 9h1v1h-1zM3 10h1v1h-1zM8 10h1v1h-1zM13 10h2v1h-2zM16 10h1v1h-1zM18 10h1v1h-1zM8 11h2v1h-2zM11 11h3v1h-3zM15 11h2v1h-2zM0 12h7v1h-7zM10 12h3v1h-3zM15 12h4v1h-4zM0 13h1v1h-1zM6 13h1v1h-1zM10 13h4v1h-4zM0 14h1v1h-1zM2 14h3v1h-3zM6 14h1v1h-1zM9 14h1v1h-1zM14 14h3v1h-3zM18 14h1v1h-1zM0 15h1v1h-1zM2 15h3v1h-3zM6 15h1v1h-1zM8 15h10v1h-10zM0 16h1v1h-1zM2 16h3v1h-3zM6 16h1v1h-1zM9 16h5v1h-5zM18 16h1v1h-1zM0 17h1v1h-1zM6 17h1v1h-1zM8 17h3v1h-3zM12 17h2v1h-2zM16 17h1v1h-1zM18 17h1v1h-1zM0 18h7v1h-7zM12 18h3v1h-3zM18 18h1v1h-1z" fill="#14203a"/></symbol></svg>
        <section className="legal-hero" aria-labelledby="help-title">
          <div className="legal-hero-bg" aria-hidden="true"></div>
          <div className="wrap">
            <p className="pill pill-glass">ヘルプ</p>
            <h1 id="help-title">MOTHERSHIPの使いはじめかた</h1>
            <p className="legal-hero-lead">Macに入れてつなぐまでと、声で書くための準備を、順番に説明します。<br />上から順に進めれば、ひととおり使えるようになります。</p>
          </div>
        </section>
  
        <div className="wrap legal-layout">
          <nav className="legal-toc" aria-label="目次">
            <p className="legal-toc-title">目次</p>
            <ol>
              <li><a href="#start"><span className="no">1</span>用意するもの</a></li>
              <li><a href="#setup"><span className="no">2</span>はじめてつなぐ</a></li>
              <li><a href="#voice"><span className="no">3</span>声で書く準備</a></li>
              <li><a href="#outside"><span className="no">4</span>外から使う</a></li>
              <li><a href="#keep-awake"><span className="no">5</span>Macを起こしておく</a></li>
              <li><a href="#trouble"><span className="no">6</span>うまくいかないとき</a></li>
            </ol>
          </nav>
  
          <article className="legal">
            <p className="legal-intro">このページでは、離れた場所から操作されるMacを「Mac」、手もとのiPhone・iPad・Androidを「デバイス」と呼びます。アプリは2つあります。Macに入れる「MOTHERSHIP HOST」と、デバイスに入れる「MOTHERSHIP」です（アプリの画面では、「Mothership Host」「Mothership」と表示されます）。図は、説明のためのイメージです。実際の画面とは、見た目がちがいます。</p>
  
            <nav className="help-jump" aria-label="目的から探す">
              <a href="#setup"><b>はじめてつなぐ</b><span>Macに入れて、QRコードで登録して、つなぐまで</span></a>
              <a href="#voice"><b>声で書く準備をする</b><span>Aqua Voice と BlackHole 2ch の入れ方と設定</span></a>
              <a href="#outside"><b>外から使う</b><span>Tailscaleの準備と、出かける前の確認</span></a>
              <a href="#trouble"><b>うまくいかないとき</b><span>つながらない、映らない、声が入らない</span></a>
            </nav>
  
            <aside className="legal-summary" aria-labelledby="summary-title">
              <h2 id="summary-title">かんたんにまとめると</h2>
              <ul className="ticks">
                <li>MacにMOTHERSHIP HOSTを入れて、<b>2つの許可</b>をオンにします。</li>
                <li>デバイスにMOTHERSHIPを入れて、<b>MacのQRコード</b>を読み取ります。</li>
                <li>「接続」をタップすると、Macの画面が手もとに映ります。ここまでで、家の中で使えます。</li>
                <li>声で書くには、Macに<b>Aqua Voice</b>と<b>BlackHole 2ch</b>を入れて、Aqua Voiceのマイクを「BlackHole 2ch」にします。</li>
                <li>外から使うには、Macとデバイスに<b>Tailscale</b>を入れます。</li>
              </ul>
            </aside>
  
            {/* 1 用意するもの */}
            <section className="article" id="start" aria-labelledby="start-title">
              <h2 id="start-title"><span className="no">1</span>用意するもの</h2>
              <dl className="help-need">
                <div><dt>Mac</dt><dd>macOS 14以降のMac。「MOTHERSHIP HOST」を入れます。</dd></div>
                <div><dt>デバイス</dt><dd>iPhone・iPad・Androidのどれか。「MOTHERSHIP」を入れます。</dd></div>
                <div><dt>家のWi-Fi</dt><dd>はじめの登録は、Macとデバイスを同じWi-Fiにつないで行います。</dd></div>
                <div><dt>声で書くなら</dt><dd>「Aqua Voice」と「BlackHole 2ch」。どちらもMacに入れます（<a href="#voice">3 声で書く準備</a>）。</dd></div>
                <div><dt>外から使うなら</dt><dd>「Tailscale」。Macとデバイスの両方に入れます（<a href="#outside">4 外から使う</a>）。</dd></div>
              </dl>
              <p className="fine">対応するOSなどの条件は、<Link href="/#download">トップページの「対応デバイス」</Link>にあります。</p>
              {/* fig:1 */}<nav className="hflow" aria-label="使いはじめるまでの流れ">
                <ol className="hflow-main">
                  <li><a href="#setup-mac"><b>1</b><span>Macに入れる</span><small>2つの許可をオンにする</small></a></li>
                  <li><a href="#setup-pair"><b>2</b><span>デバイスを登録する</span><small>MacのQRコードを読み取る</small></a></li>
                  <li><a href="#setup-connect"><b>3</b><span>つなぐ</span><small>家のWi-Fiで使える</small></a></li>
                </ol>
                <p className="hflow-opt-title">ここから先は、必要な人だけ</p>
                <ul className="hflow-opt">
                  <li><a href="#voice"><span>声で書く準備</span><small>Aqua Voice と BlackHole 2ch</small></a></li>
                  <li><a href="#outside"><span>外から使う準備</span><small>Tailscale</small></a></li>
                </ul>
              </nav>{/* /fig:1 */}
            </section>
  
            {/* 2 はじめてつなぐ */}
            <section className="article" id="setup" aria-labelledby="setup-title">
              <h2 id="setup-title"><span className="no">2</span>はじめてつなぐ</h2>
              <p>家のWi-Fiで、Macとデバイスをつなぐまでの手順です。3つのステップで終わります。</p>
  
              <h3 id="setup-mac"><span className="no">ステップ1</span>MacにMOTHERSHIP HOSTを入れる</h3>
              <ol className="help-steps">
                <li>
                  <p>MOTHERSHIP HOSTをダウンロードして、「アプリケーション」フォルダーに入れます。（近日公開）</p>
                </li>
                <li>
                  <p>MOTHERSHIP HOSTを開きます。ウィンドウは開かず、画面の右上（メニューバー）に、MOTHERSHIP HOSTのアイコンが出ます。</p>
                  {/* fig:2 */}<div className="hf hf2" role="img" aria-label="Mothership Hostを開くと、Macのメニューバーにアイコンが出る。アイコンをクリックすると、メニューが開く様子"><div className="hf-in" aria-hidden="true"><div className="hf-mbar"><i></i><b></b><b></b><b></b><span className="hf-tray hf2-tray"><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span><u></u><u></u></div><div className="hf-win hf2-finder"><div className="hf-wbar"><i></i><i></i><i></i><b>アプリケーション</b></div><div className="hf-wbody"><span className="hf2-app"><span className="hf-ico"><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span><small>Mothership Host</small></span><i></i><i></i><i></i><i></i><i></i></div></div><div className="hf-pop hf2-pop"><div className="hf-r"><b>Mothership Host</b><small>接続を待っています</small></div><div className="hf-r"><span>登録済みの端末</span><em className="hf-btn ">端末を追加…</em></div><div className="hf-r"><i className="hf-dot "></i><span>画面収録</span><em className="hf-btn ">設定を開く</em></div><div className="hf-r"><i className="hf-dot "></i><span>アクセシビリティ</span><em className="hf-btn ">設定を開く</em></div><div className="hf-r "><span>ログイン時に起動</span><i className="hf-tg "></i></div><div className="hf-r "><span>待機中も Mac をスリープさせない</span><i className="hf-tg "></i></div></div><svg className="hf-cur hf2-cur" viewBox="0 0 12 16"><path d="M1 1v12l3.2-2.8 2 4.6 2-.9-2-4.5H11z" fill="#14203a" stroke="#fff" strokeWidth="1" strokeLinejoin="round"/></svg></div></div>{/* /fig:2 */}
                </li>
                <li>
                  <p>アイコンをクリックしてメニューを開き、「画面収録」の横の<b>「設定を開く」</b>を押します。Macの「システム設定」が開くので、一覧にある「Mothership Host」のスイッチをオンにします。</p>
                  <ul><li>「終了して再度開く」と出たら、そのとおりにします。</li></ul>
                </li>
                <li>
                  <p>同じように、「アクセシビリティ」の横の<b>「設定を開く」</b>を押して、スイッチをオンにします。</p>
                  {/* fig:3 */}<div className="hf hf3 is-tall" role="img" aria-label="メニューの「設定を開く」を押すと、Macのシステム設定が開く。「Mothership Host」のスイッチをオンにすると、メニューの印が緑のチェックに変わる。「画面収録」と「アクセシビリティ」の2つで、同じことをする様子"><div className="hf-in" aria-hidden="true"><div className="hf-mbar"><i></i><b></b><b></b><b></b><span className="hf-tray "><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span><u></u><u></u></div><div className="hf-pop "><div className="hf-r"><b>Mothership Host</b><small>接続を待っています</small></div><div className="hf-r"><span>登録済みの端末</span><em className="hf-btn ">端末を追加…</em></div><div className="hf-r"><i className="hf-dot hf3-d1"></i><span>画面収録</span><em className="hf-btn hf3-b1">設定を開く</em></div><div className="hf-r"><i className="hf-dot hf3-d2"></i><span>アクセシビリティ</span><em className="hf-btn hf3-b2">設定を開く</em></div></div><div className="hf-win hf3-win"><div className="hf-wbar"><i></i><i></i><i></i><b>システム設定</b></div><div className="hf-wbody"><p className="hf3-h"><span>画面収録</span><span>アクセシビリティ</span></p><div className="hf3-app"><span className="hf-ico"><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span><b>Mothership Host</b><i className="hf-tg"></i></div><div className="hf-skel"></div><div className="hf-skel"></div></div></div><svg className="hf-cur hf3-cur" viewBox="0 0 12 16"><path d="M1 1v12l3.2-2.8 2 4.6 2-.9-2-4.5H11z" fill="#14203a" stroke="#fff" strokeWidth="1" strokeLinejoin="round"/></svg></div></div>{/* /fig:3 */}
                </li>
                <li>
                  <p>メニューにもどって、「画面収録」と「アクセシビリティ」の両方に緑のチェックが付いていれば、終わりです。</p>
                </li>
              </ol>
              <div className="help-note"><b>2つの許可は、何に使う？</b>「画面収録」は、Macの画面をデバイスに映すために使います。「アクセシビリティ」は、デバイスからのキーボードやマウスの操作を、Macに伝えるために使います。</div>
  
              <h3 id="setup-pair"><span className="no">ステップ2</span>デバイスを登録する（QRコード）</h3>
              <ol className="help-steps">
                <li>
                  <p>デバイスにMOTHERSHIPを入れて、開きます。（近日公開）</p>
                  <ul><li>iPhone・iPadで「ローカルネットワーク」の許可を求められたら、「許可」を選びます。家のWi-FiでMacを見つけるために使います。</li></ul>
                </li>
                <li>
                  <p>Macで、メニューバーのMOTHERSHIP HOSTのメニューから<b>「端末を追加…」</b>を選びます。QRコードのウィンドウが開きます。</p>
                  <ul><li>QRコードが使えるのは、5分間・1回だけです。期限が切れたら、ウィンドウの「新しい登録リンクと QR コードを作成」を押します。</li></ul>
                  {/* fig:4 */}<div className="hf hf4" role="img" aria-label="Macのメニューで「端末を追加…」を押すと、QRコードのウィンドウが開く様子"><div className="hf-in" aria-hidden="true"><div className="hf-mbar"><i></i><b></b><b></b><b></b><span className="hf-tray "><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span><u></u><u></u></div><div className="hf-pop "><div className="hf-r"><b>Mothership Host</b><small>接続を待っています</small></div><div className="hf-r"><span>登録済みの端末</span><em className="hf-btn hf4-btn">端末を追加…</em></div><div className="hf-r"><i className="hf-dot is-ok"></i><span>画面収録</span></div><div className="hf-r"><i className="hf-dot is-ok"></i><span>アクセシビリティ</span></div><div className="hf-r "><span>ログイン時に起動</span><i className="hf-tg "></i></div><div className="hf-r "><span>待機中も Mac をスリープさせない</span><i className="hf-tg "></i></div></div><div className="hf-win hf4-win"><div className="hf-wbar"><i></i><i></i><i></i><b>端末を追加</b></div><div className="hf-wbody"><span className="hf4-qr"><svg viewBox="0 0 19 19"><use href="#hs-qr"/></svg></span><p>残り 4 分 59 秒<br />1 回だけ使えます</p></div></div><svg className="hf-cur hf4-cur" viewBox="0 0 12 16"><path d="M1 1v12l3.2-2.8 2 4.6 2-.9-2-4.5H11z" fill="#14203a" stroke="#fff" strokeWidth="1" strokeLinejoin="round"/></svg></div></div>{/* /fig:4 */}
                </li>
                <li>
                  <p>デバイスで<b>「QR コードを読み取ってペアリング」</b>をタップして、MacのQRコードをカメラに映します。カメラの許可を求められたら、許可します。</p>
                  {/* fig:5 */}<div className="hf hf5 is-room" role="img" aria-label="デバイスのカメラをMacのQRコードに向けて読み取ると、デバイスにチェックが出て、Macに「登録しました」と表示される様子"><div className="hf-in" aria-hidden="true"><div className="hf-lap hf5-lap"><div className="hf-scr"><div className="hf-lbar"><i></i><b></b><b></b><span className="hf-tray"><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span></div><div className="hf5-card"><b>端末を追加</b><svg viewBox="0 0 19 19"><use href="#hs-qr"/></svg></div><div className="hf5-done"><i>✓</i><b>iPhone を<br />登録しました</b></div></div><div className="hf-base"></div></div><div className="hf-ph hf5-ph"><div className="hf5-cam"><span className="hf5-qrs"><svg viewBox="0 0 19 19"><use href="#hs-qr"/></svg></span><span className="hf5-find"><i></i><i></i><i></i><i></i></span><span className="hf5-scan"></span><span className="hf5-ok">✓</span><em>QRコードを読み取る</em></div></div></div></div>{/* /fig:5 */}
                </li>
                <li>
                  <p>Macのウィンドウに「✅（デバイスの名前）を登録しました」と出たら、登録は終わりです。ウィンドウは閉じてかまいません。</p>
                </li>
              </ol>
              <div className="help-note"><b>アカウントの登録は、要りません。</b>登録したデバイスは、MOTHERSHIP HOSTのメニューの「登録済みの端末」に並びます。カメラで読み取れないときは、QRコードのウィンドウの「リンクをコピー」で取ったリンクを、デバイスの入力欄に貼り付けて登録することもできます。</div>
  
              <h3 id="setup-connect"><span className="no">ステップ3</span>つなぐ</h3>
              <ol className="help-steps">
                <li>
                  <p>デバイスのMOTHERSHIPに、登録したMacが出ます。Macとデバイスが同じWi-Fiにつながっていれば、「● 自宅 LAN で接続できます」と表示されます。</p>
                </li>
                <li>
                  <p><b>「接続」</b>をタップします。少し待つと、Macの画面がデバイスに映ります。</p>
                  {/* fig:6 */}<div className="hf hf6 is-room" role="img" aria-label="デバイスに登録したMacが出て「自宅 LAN で接続できます」と表示される。「接続」をタップすると、Macの画面がデバイスに映る様子"><div className="hf-in" aria-hidden="true"><div className="hf-lap hf6-lap"><div className="hf-scr"><div className="hf-lbar"><i></i><b></b><b></b><span className="hf-tray"><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span></div><span className="hf-w hf-w1"><b></b><i></i><i></i><i></i></span><span className="hf-w hf-w2"><b></b><em><i></i><i></i><i></i><i></i></em></span></div><div className="hf-base"></div></div><span className="hf6-wifi"><i></i><i></i><i></i></span><div className="hf-ph hf6-ph"><div className="hf6-list"><p>登録した Mac</p><div className="hf6-card"><b>Mac mini</b><small>● 自宅 LAN で接続できます</small><em>接続</em></div></div><div className="hf6-desk"><span className="hf-w hf-w1"><b></b><i></i><i></i><i></i></span><span className="hf-w hf-w2"><b></b><em><i></i><i></i><i></i><i></i></em></span></div></div></div></div>{/* /fig:6 */}
                </li>
                <li>
                  <p>終わるときは、画面の「切断」を押します。</p>
                </li>
              </ol>
              <div className="help-note"><b>14日間、ぜんぶ試せます。</b>はじめてつないだ日から14日間は、すべての機能を無料で使えます。</div>
              <p className="help-next">次は、必要なものだけ進めてください：<a href="#voice">声で書く準備</a>／<a href="#outside">外から使う</a>。</p>
            </section>
  
            {/* 3 声で書く準備 */}
            <section className="article" id="voice" aria-labelledby="voice-title">
              <h2 id="voice-title"><span className="no">3</span>声で書く準備（Aqua Voice）</h2>
              <p>デバイスに話しかけた声を、Macで文字にするための準備です。<b>作業は、すべてMacで行います。</b>デバイスの側に、準備は要りません。</p>
  
              <h3 id="voice-how">しくみと、やること</h3>
              <p>声を文字にするのは、Macの音声入力アプリ「Aqua Voice」です。Aqua Voiceは、Macのマイクの音を聞いて文字にします。そこで、デバイスから届いた声を「マイクの音」としてAqua Voiceに渡すための、仮想のマイクが要ります。それが「BlackHole 2ch」です。</p>
              {/* fig:7 */}<div className="hfv" role="img" aria-label="声の通り道の図。デバイスで話した声は、MacのMOTHERSHIP HOSTに届く。MOTHERSHIP HOSTは、その声を仮想のマイク「BlackHole 2ch」に流す。Aqua VoiceがBlackHole 2chの声を聞いて文字にし、開いているアプリに入力する。Macに入れるのは、BlackHole 2chとAqua Voiceの2つ">
                <div className="hfv-row" aria-hidden="true">
                  <div className="hfv-node hfv-n1"><b>デバイス</b><span>🎤を押して話す</span></div>
                  <i className="hfv-link hfv-l1"></i>
                  <div className="hfv-mac">
                    <p>Macの中</p>
                    <div className="hfv-node hfv-n2"><b>MOTHERSHIP HOST</b><span>声を受け取って、流す</span></div>
                    <i className="hfv-link hfv-l2"></i>
                    <div className="hfv-node hfv-n3 is-need"><em>入れる</em><b>BlackHole 2ch</b><span>仮想のマイク</span></div>
                    <i className="hfv-link hfv-l3"></i>
                    <div className="hfv-node hfv-n4 is-need"><em>入れる</em><b>Aqua Voice</b><span>声を文字にする</span></div>
                    <i className="hfv-link hfv-l4"></i>
                    <div className="hfv-node hfv-n5"><b>開いているアプリ</b><span>文字が入る</span></div>
                  </div>
                </div>
              </div>{/* /fig:7 */}
              <p>やることは、次の6つです。</p>
              <ol className="help-steps">
                <li><p><a href="#voice-aqua">Aqua Voiceを入れる</a></p></li>
                <li><p><a href="#voice-terminal">ターミナルを開く</a></p></li>
                <li><p><a href="#voice-brew">Homebrewを入れる</a>（BlackHole 2chを入れるための道具）</p></li>
                <li><p><a href="#voice-blackhole">BlackHole 2chを入れる</a></p></li>
                <li><p><a href="#voice-mic">Aqua Voiceのマイクを「BlackHole 2ch」にする</a></p></li>
                <li><p><a href="#voice-try">デバイスから話してみる</a></p></li>
              </ol>
              <div className="help-note"><b>別の会社などのソフトです。</b>Aqua Voice・Homebrew・BlackHoleは、MOTHERSHIPとは別の会社や人たちが作っているソフトです（MOTHERSHIPには含まれません）。入れ方や画面の表記は、変わることがあります。</div>
  
              <h3 id="voice-aqua"><span className="no">3-1</span>Aqua Voiceを入れる</h3>
              <p>Aqua Voiceの公式サイト（<a href="https://aquavoice.com/mac" rel="noopener noreferrer" target="_blank">aquavoice.com</a>）から、Mac版をダウンロードして入れます。Apple シリコンのMacにも、IntelのMacにも対応しています。</p>
              <p>入れたら、まず<b>Macの前でふつうに使えること</b>を確かめます。メモなど、文字を打てる場所をクリックします。キーボードの <kbd>fn</kbd> キーを押している間だけ話して、離します。話した文が入れば、大丈夫です。</p>
              {/* fig:8 */}<div className="hf hf8" role="img" aria-label="Macの前で、キーボードのfnキーを押している間だけ話す。キーを離すと、話した文がメモに入る様子"><div className="hf-in" aria-hidden="true"><div className="hf-win hf8-note"><div className="hf-wbar"><i></i><i></i><i></i><b>メモ</b></div><div className="hf-wbody"><p className="hf8-text"><span>明日の会議は、10時からです。</span><i className="hf-caret"></i></p></div></div><p className="hf8-bubble"><b>話す</b>「明日の会議は、10時からです」</p><p className="hf8-pill"><span className="hf-wave"><i></i><i></i><i></i><i></i><i></i></span>聞き取り中</p><div className="hf8-deck"></div><div className="hf8-keys"><span>fn</span><span>⌃</span><span>⌥</span><span>⌘</span><span></span><span>⌘</span><span>⌥</span></div><i className="hf-fin hf8-fin"></i></div></div>{/* /fig:8 */}
              <div className="help-warn"><b>録音のキーは、fnのままに。</b>MOTHERSHIPは、Aqua Voiceの「fnを押している間だけ聞き取る」動きを使います。Aqua Voiceの録音のキーを別のキーに変えていると、デバイスから話しても文字になりません。Aqua Voiceのはじめの設定は <kbd>fn</kbd> です。変えたかどうかは、Aqua Voiceの設定の「Keybindings」で確かめられます。</div>
  
              <h3 id="voice-terminal"><span className="no">3-2</span>ターミナルを開く</h3>
              <p>ここからは、Macにはじめから入っているアプリ「ターミナル」を使います。ターミナルは、文字の命令（コマンド）でMacを動かすアプリです。むずかしく見えますが、このページのコマンドを、そのまま貼り付けるだけです。</p>
              <ol className="help-steps">
                <li><p><kbd>⌘</kbd>（command）キーを押しながら、スペースキーを押します。検索の欄（Spotlight）が出ます。</p></li>
                <li><p>「ターミナル」と打って、<kbd>return</kbd> キーを押します。</p></li>
                <li><p>文字だけのウィンドウが開きます。ここにコマンドを貼り付けて <kbd>return</kbd> キーを押すと、実行されます。</p></li>
              </ol>
              {/* fig:9 */}<div className="hf hf9" role="img" aria-label="commandキーとスペースキーを押すと、検索の欄が出る。「ターミナル」と打ってreturnキーを押すと、ターミナルのウィンドウが開く様子"><div className="hf-in" aria-hidden="true"><div className="hf-mbar"><i></i><b></b><b></b><b></b><span className="hf-tray "><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span><u></u><u></u></div><div className="hf9-spot"><i></i><p><span className="hf9-type">ターミナル</span><i className="hf-caret"></i></p></div><div className="hf9-res"><i>&gt;_</i><b>ターミナル</b><small>アプリケーション</small></div><div className="hf9-ka"><span className="hf-key">⌘</span>＋<span className="hf-key">スペース</span></div><div className="hf9-kb"><span className="hf-key">return</span></div><div className="hf-win hf9-term"><div className="hf-wbar"><i></i><i></i><i></i><b>ターミナル</b></div><div className="hf-tbody"><p><span className="pr">user@Mac ~ %</span> <i className="hf-caret"></i></p></div></div></div></div>{/* /fig:9 */}
              <div className="help-note"><b>コマンドのコピーのしかた</b>このページの紺色の枠の中をクリックすると、コマンド全体が選ばれます。<kbd>⌘</kbd>＋<kbd>C</kbd> でコピーし、ターミナルで <kbd>⌘</kbd>＋<kbd>V</kbd> で貼り付けて、<kbd>return</kbd> キーを押します。</div>
  
              <h3 id="voice-brew"><span className="no">3-3</span>Homebrewを入れる</h3>
              <p>Homebrew（ホームブルー）は、Macにソフトを入れるための、無料の道具です。BlackHole 2chを入れるのに使います。</p>
              <ol className="help-steps">
                <li>
                  <p><b>もう入っているか、確かめます。</b>次のコマンドを実行します。</p>
                  <pre className="help-code"><code>{"brew --version"}</code></pre>
                  <ul>
                    <li>「Homebrew」と数字が出たら、もう入っています。<a href="#voice-blackhole">3-4 BlackHole 2chを入れる</a>へ進みます。</li>
                    <li>「command not found」と出たら、まだ入っていません。次へ進みます。</li>
                  </ul>
                </li>
                <li>
                  <p><b>Homebrewを入れます。</b>次のコマンドを実行します（1行です）。</p>
                  <pre className="help-code"><code>{"/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""}</code></pre>
                  <ul>
                    <li>「Password:」と出たら、Macにログインするときのパスワードを打って、<kbd>return</kbd> キーを押します。<b>打った文字は画面に出ませんが、入力されています。</b></li>
                    <li>「Press RETURN/ENTER to continue」と出たら、<kbd>return</kbd> キーを押します。</li>
                    <li>数分かかります。途中で「Command Line Tools」という部品も、いっしょに入ります。</li>
                    <li>「Installation successful!」と出たら、終わりです。</li>
                  </ul>
                </li>
                <li>
                  <p><b>「Next steps」のコマンドを実行します。</b>最後のほうに「Next steps:」と出て、その下に、コマンドが2〜3行書いてあることがあります。出ていたら、その行をコピーして、1行ずつ実行します。ターミナルからHomebrewを使えるようにするための設定です。</p>
                  <p>たとえば、次のようなコマンドです（これは例です。<b>実際は、あなたの画面に出たものを使ってください</b>）。</p>
                  <pre className="help-code"><code>{"echo >> ~/.zprofile\necho 'eval \"$(/opt/homebrew/bin/brew shellenv)\"' >> ~/.zprofile\neval \"$(/opt/homebrew/bin/brew shellenv)\""}</code></pre>
                </li>
                <li>
                  <p><b>入ったことを確かめます。</b>もう一度、次のコマンドを実行します。「Homebrew」と数字が出れば、成功です。</p>
                  <pre className="help-code"><code>{"brew --version"}</code></pre>
                </li>
              </ol>
              {/* fig:10 */}<div className="hf hf10 is-tall" role="img" aria-label="ターミナルにコマンドを貼り付けて実行する様子。「Password:」ではMacのパスワードを打つ（打った文字は出ない）。「Press RETURN/ENTER to continue」ではreturnキーを押す。数分待つと「Installation successful!」と出る。最後の「Next steps:」の下に出たコマンドを、コピーして実行する"><div className="hf-in" aria-hidden="true"><div className="hf-win hf10-term"><div className="hf-wbar"><i></i><i></i><i></i><b>ターミナル</b></div><div className="hf-tbody"><p className="l1"><span className="pr">%</span> <span>/bin/bash -c &quot;$(curl -fsSL https://…/install.sh)&quot;</span></p><p className="l2"><span className="ar">==&gt;</span> Checking for sudo access…</p><p className="l3">Password: 🔑<i className="hf-caret"></i></p><p className="l4"><span className="ar">==&gt;</span> This script will install: /opt/homebrew</p><p className="l5">Press RETURN/ENTER to continue…</p><p className="l6"><span className="ar">==&gt;</span> Downloading and installing Homebrew…</p><p className="l7"><span className="hf10-bar"><i></i></span></p><p className="l8">==&gt; Installation successful!</p><p className="l9"><span className="ar">==&gt;</span> Next steps:</p><div className="hf10-next"><p>echo &gt;&gt; ~/.zprofile</p><p>eval &quot;$(/opt/homebrew/bin/brew shellenv)&quot;</p></div></div></div><span className="hf-tag hf10-t3"><i>打っても、文字は出ません</i></span><span className="hf-tag hf10-t5"><i>return キーを押す</i></span><span className="hf-tag hf10-t7"><i>数分かかります</i></span><span className="hf-tag hf10-t11"><i>↑ この行をコピーして、1行ずつ実行</i></span></div></div>{/* /fig:10 */}
              <div className="help-note"><b>このコマンドは、公式のものです。</b>Homebrewの公式サイト（<a href="https://brew.sh/ja/" rel="noopener noreferrer" target="_blank">brew.sh</a>）に書いてあるコマンドと同じです。心配なときは、公式サイトからコピーしてください。</div>
  
              <h3 id="voice-blackhole"><span className="no">3-4</span>BlackHole 2chを入れる</h3>
              <ol className="help-steps">
                <li>
                  <p>ターミナルで、次のコマンドを実行します。</p>
                  <pre className="help-code"><code>{"brew install --cask blackhole-2ch"}</code></pre>
                  <ul><li>パスワードを聞かれたら、Macのパスワードを打って <kbd>return</kbd> キーを押します。</li></ul>
                </li>
                <li>
                  <p><b>Macを再起動します。</b>再起動するまで、BlackHole 2chは使えません（インストールの最後にも、再起動が必要だと表示されます）。</p>
                </li>
                <li>
                  <p><b>入ったことを確かめます。</b>「システム設定」›「サウンド」›「入力」を開きます。一覧に「BlackHole 2ch」があれば、入っています。</p>
                  {/* fig:11 */}<div className="hf hf11" role="img" aria-label="Macの「システム設定」の「サウンド」の「入力」の画面。一覧に「BlackHole 2ch」が増えている。選ばれているのは、いつものマイクのまま"><div className="hf-in" aria-hidden="true"><div className="hf-win hf-set"><div className="hf-wbar"><i></i><i></i><i></i><b>システム設定</b></div><div className="hf-wbody"><div className="hf-side"><div className="hf-skel"></div><div className="hf-skel"></div><span className="is-sel">サウンド</span><div className="hf-skel"></div><div className="hf-skel"></div></div><div className="hf-main"><h4>サウンド</h4><div className="hf11-seg"><span>出力</span><span>入力</span></div><div className="hf11-th"><span>名前</span><span>種類</span></div><div className="hf11-row hf11-r1 is-sel"><b>MacBookのマイク</b><small>内蔵</small><span className="hf-tag"><i>選ぶのは、こちら</i></span></div><div className="hf11-row hf11-r2"><b>BlackHole 2ch</b><small>仮想</small><span className="hf-tag"><i>入っています</i></span></div><div className="hf11-level"><span>入力レベル</span><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div></div></div></div>{/* /fig:11 */}
                </li>
              </ol>
              <div className="help-warn"><b>ここでは、BlackHole 2chを選ばないでください。</b>「サウンド」の入力は、いつものマイク（内蔵マイクなど）のままにします。BlackHole 2chを選ぶのは、次の「Aqua Voiceの設定」の中だけです。</div>
              <div className="help-note"><b>いま再起動できないとき</b>AIの作業の途中などで再起動できないときは、ターミナルで次のコマンドを実行すると、再起動しなくても使えるようになることがあります（Macの音が一瞬とぎれます）。一覧に出てこないときは、再起動してください。<pre className="help-code"><code>{"sudo killall coreaudiod"}</code></pre></div>
  
              <h3 id="voice-mic"><span className="no">3-5</span>Aqua Voiceのマイクを「BlackHole 2ch」にする</h3>
              <ol className="help-steps">
                <li><p>Aqua Voiceの設定（Settings）を開きます。</p></li>
                <li><p>「Audio」を開き、使うマイクに<b>「BlackHole 2ch」</b>を選びます。</p></li>
              </ol>
              {/* fig:12 */}<div className="hf hf12" role="img" aria-label="Aqua Voiceの設定で「Audio」を開き、マイクの一覧から「BlackHole 2ch」を選ぶ様子"><div className="hf-in" aria-hidden="true"><div className="hf-win hf-set"><div className="hf-wbar"><i></i><i></i><i></i><b>Aqua Voice</b></div><div className="hf-wbody"><div className="hf-side"><i className="hf12-sel"></i><span>General</span><span>Audio</span><span>Keybindings</span></div><div className="hf-main"><div className="hf12-gen"><div className="hf-skel"></div><div className="hf-skel"></div><div className="hf-skel"></div><div className="hf-skel"></div></div><div className="hf12-audio"><h4>Audio</h4><div className="hf12-mic"><b>Microphone</b><div className="hf12-dd"><span>MacBookのマイク</span><span>BlackHole 2ch</span></div></div><div className="hf12-list"><span>MacBookのマイク</span><span>BlackHole 2ch</span><span>イヤホンのマイク</span></div></div></div></div></div><svg className="hf-cur hf12-cur" viewBox="0 0 12 16"><path d="M1 1v12l3.2-2.8 2 4.6 2-.9-2-4.5H11z" fill="#14203a" stroke="#fff" strokeWidth="1" strokeLinejoin="round"/></svg></div></div>{/* /fig:12 */}
              <p>これで、準備は終わりです。</p>
  
              <h3 id="voice-mac">Macの前でも、今までどおり使えます</h3>
              <p>「Aqua VoiceのマイクをBlackHole 2chにしたら、Macの前で話しても聞こえないのでは？」と思うかもしれません。大丈夫です。</p>
              <p><b>MOTHERSHIP HOSTが動いている間は、Macの前でも、今までどおりAqua Voiceを使えます。</b>あなたがMacの前でAqua Voiceを使うと、MOTHERSHIP HOSTが、Macのマイクの音をBlackHole 2chに渡すからです。<kbd>fn</kbd> キーを押して話せば、今までどおり文字になります。マイクを切り替える必要は、ありません。</p>
              <ul className="ticks">
                <li>Macのスピーカーやマイクの設定は、変わりません。BlackHole 2chを入れても、音の通り道が1つ増えるだけです。</li>
                <li>Macの前で使うマイクは、「システム設定」›「サウンド」›「入力」で選んでいるマイクです。イヤホンのマイクなどに替えても、そのまま使えます。</li>
                <li>Macのマイクを使うのは、Aqua Voiceが聞き取っている間だけです。</li>
                <li>デバイスから話している間は、デバイスの声だけをAqua Voiceに渡します。</li>
              </ul>
              {/* fig:13 */}<div className="hfv hfv-two" role="img" aria-label="声の通り道を2つ並べた図。Macの前で話すときは、Macのマイクの声を、MOTHERSHIP HOSTがBlackHole 2chに流す。デバイスから話すときは、デバイスのマイクの声を、MOTHERSHIP HOSTがBlackHole 2chに流す。どちらも、BlackHole 2chからAqua Voiceに届いて文字になる">
                <p className="hfv-case" aria-hidden="true"><span>Macの前で話すとき</span><span>デバイスから話すとき</span></p>
                <div className="hfv-row" aria-hidden="true">
                  <div className="hfv-src">
                    <div className="hfv-node hfv-sa"><b>Macのマイク</b><span>fnを押して話す</span></div>
                    <div className="hfv-node hfv-sb"><b>デバイスのマイク</b><span>🎤を押して話す</span></div>
                  </div>
                  <i className="hfv-link hfv-m1"></i>
                  <div className="hfv-node hfv-h1"><b>MOTHERSHIP HOST</b><span>どちらかの声を流す</span></div>
                  <i className="hfv-link hfv-m2"></i>
                  <div className="hfv-node hfv-h2"><b>BlackHole 2ch</b><span>仮想のマイク</span></div>
                  <i className="hfv-link hfv-m3"></i>
                  <div className="hfv-node hfv-h3"><b>Aqua Voice</b><span>文字にする</span></div>
                </div>
              </div>{/* /fig:13 */}
              <div className="help-warn">
                <b>気をつけること（3つ）</b>
                <ul>
                  <li><b>マイクの許可：</b>はじめてのとき、MOTHERSHIP HOSTが「マイク」の許可を求めます。「許可」を選んでください。</li>
                  <li><b>MOTHERSHIP HOSTを終了しているとき：</b>Macの前で話した声が、Aqua Voiceに届きません。MOTHERSHIP HOSTの「ログイン時に起動」をオンにしておくと安心です（<a href="#keep-awake">5 Macを起こしておく</a>）。MOTHERSHIP HOSTを使わない日は、Aqua Voiceのマイクを元のマイクに戻せば、元どおり使えます。</li>
                  <li><b>「サウンド」の入力：</b>「システム設定」の入力を「BlackHole 2ch」にしていると、Macの前の声は渡されません。入力は、いつものマイクにしておきます。</li>
                </ul>
              </div>
  
              <h3 id="voice-try"><span className="no">3-6</span>デバイスから話してみる</h3>
              <ol className="help-steps">
                <li><p>デバイスから、Macにつなぎます。</p></li>
                <li><p>Macの画面で、文字を入れたい場所をタップします（メモや、AIの入力欄など）。</p></li>
                <li><p>画面の <b>🎤 ボタンを押したまま話し</b>、話し終えたら離します。はじめてのときは、デバイスがマイクの許可を求めるので、許可します。</p></li>
                <li><p>少し待つと、話した文がMacに入ります。</p></li>
              </ol>
              {/* fig:14 */}<div className="hf hf14 is-room" role="img" aria-label="デバイスの🎤ボタンを押している間だけ話す。ボタンを離すと、話した文がMacの入力欄に入る様子"><div className="hf-in" aria-hidden="true"><div className="hf-lap hf14-lap"><div className="hf-scr"><div className="hf-lbar"><i></i><b></b><b></b><span className="hf-tray"><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span></div><div className="hf14-ai"><b></b><i></i><i></i><i></i><div className="hf14-in"><u></u></div></div></div><div className="hf-base"></div></div><div className="hf-ph hf14-ph"><div className="hf14-desk"><div className="hf14-ai"><b></b><i></i><i></i><i></i><div className="hf14-in"><span>次は、グラフを直してください。</span></div></div><div className="hf14-wave"><span className="hf-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div><div className="hf14-bar"><span>🎤</span><span>⌫</span><span>⏎</span><span>⇥</span></div></div></div><span className="hf-tag hf14-ta"><i>押している間だけ、話す</i></span><span className="hf-tag hf14-tb"><i>離すと、Macに文字が入る</i></span></div></div>{/* /fig:14 */}
              <ul className="ticks">
                <li>言い直したいときは、押したまま指をボタンの外へ滑らせて離すと、取り消せます。</li>
                <li>🎤 の横のボタンで、Enterや削除を押せます。置くボタンは、デバイスの設定の「音声入力のバー」で入れ替えられます。</li>
                <li>外付けキーボードのキーで話したいときは、デバイスの設定の「音声入力（Mac の Aqua Voice）」で「キーを登録…」を押します。</li>
              </ul>
  
              <h3 id="voice-trouble">声で書けないとき</h3>
              <dl className="help-qa">
                <div><dt>デバイスに「Mac に BlackHole 2ch が入っていません」と出る</dt><dd>BlackHole 2chが入っていないか、入れたあとに再起動していません。<a href="#voice-blackhole">3-4</a>をやり直して、Macを再起動します。</dd></div>
                <div><dt>デバイスに「Aqua Voice が BlackHole 2ch から録音していません」と出る</dt><dd><ul><li>MacでAqua Voiceが動いているかを確かめます。</li><li>Aqua Voiceのマイクが「BlackHole 2ch」になっているかを確かめます（<a href="#voice-mic">3-5</a>）。</li><li>Aqua Voiceの録音のキーが <kbd>fn</kbd> になっているかを確かめます（<a href="#voice-aqua">3-1</a>）。</li></ul></dd></div>
                <div><dt>Macの前で、Aqua Voiceが反応しなくなった</dt><dd>「<a href="#voice-mac">Macの前でも、今までどおり使えます</a>」の「気をつけること」の3つを確かめます。</dd></div>
                <div><dt>Macの前で話すと、最初のことばが欠ける</dt><dd><kbd>fn</kbd> キーを押してから、ひと呼吸おいて話しはじめます。</dd></div>
              </dl>
            </section>
  
            {/* 4 外から使う */}
            <section className="article" id="outside" aria-labelledby="outside-title">
              <h2 id="outside-title"><span className="no">4</span>外から使う（Tailscale）</h2>
              <p>家の外からつなぐには、「Tailscale（テイルスケール）」を使います。Tailscaleは、離れた機器どうしを安全につなぐサービスで、個人なら無料で使えます。ルーターの設定を変える必要は、ありません。</p>
              <ol className="help-steps">
                <li><p>Tailscaleのアカウントを作ります。</p></li>
                <li><p>MacとデバイスにTailscaleのアプリを入れて、<b>同じアカウント</b>でログインします。</p></li>
                <li><p>家のWi-Fiで、いちどMOTHERSHIPでMacにつなぎます。デバイスが、外からのつなぎ先を覚えます。</p></li>
                <li><p><b>出かける前に、試します。</b>スマホのWi-Fiを切ってモバイル回線にし、MOTHERSHIPの「接続」をタップします。Macの画面が映れば、準備は終わりです。</p></li>
              </ol>
              {/* fig:15 */}<div className="hfv hfv-out" role="img" aria-label="外出先のデバイスが、Tailscaleの暗号化された通り道を通って、家のMacにつながる図。操作はデバイスからMacへ、画面はMacからデバイスへ、直接やり取りする。MOTHERSHIPのサーバーは通らない">
                <div className="hfv-row" aria-hidden="true">
                  <div className="hfv-node hfv-o1"><b>外出先のデバイス</b><span>モバイル回線や、外のWi-Fi</span></div>
                  <div className="hfv-tunnel"><b>Tailscale</b><span>暗号化された通り道</span><i></i><i></i><i></i><i></i></div>
                  <div className="hfv-node hfv-o2"><b>家のMac</b><span>MOTHERSHIP HOST</span></div>
                </div>
                <p className="hfv-legend" aria-hidden="true"><span>操作（デバイス → Mac）</span><span>画面（Mac → デバイス）</span></p>
                <p className="hfv-x" aria-hidden="true"><s>MOTHERSHIPのサーバー</s>は通りません。ルーターの設定も、要りません。</p>
              </div>{/* /fig:15 */}
              <p>外では、デバイスのTailscaleがオンになっていることを確かめて、「接続」をタップするだけです。Macのところに「○ 自宅 LAN では見つかっていません（外出先は Tailscale で接続）」と出ていても、そのまま「接続」を押せます。</p>
              <div className="help-note"><b>つながらないとき</b>デバイスの「アドレスを直接入力」に、MacのTailscaleの名前（例：<code>my-mac.tail1234.ts.net</code>）を入れて試します。名前は、Tailscaleのアプリで確かめられます。</div>
              <div className="help-note">
                <b>外からつないだときの、Macの画面</b>
                <p>外からつなぐと、自宅のMacの画面は、自動で隠れます（家にいる人に見えないようにするため）。切断すると、Macはロックされます。</p>
                <p>デバイスの設定「外出先から接続したら、自宅の Mac の画面を自動で隠す」と、MOTHERSHIP HOSTの「画面を隠していたときは、切断したら Mac をロックする」で、変えられます。</p>
              </div>
            </section>
  
            {/* 5 Macを起こしておく */}
            <section className="article" id="keep-awake" aria-labelledby="keep-awake-title">
              <h2 id="keep-awake-title"><span className="no">5</span>Macを起こしておく</h2>
              <p>Macがスリープすると、外からつなげません。出かける前に、MOTHERSHIP HOSTのメニューで、2つのスイッチをオンにします。</p>
              <dl className="help-need">
                <div><dt>待機中も Mac をスリープさせない</dt><dd>オンにすると、MOTHERSHIP HOSTが動いている間、Macはスリープしません。</dd></div>
                <div><dt>ログイン時に起動</dt><dd>オンにすると、Macにログインしたときに、MOTHERSHIP HOSTが自動で動きはじめます。</dd></div>
              </dl>
              {/* fig:16 */}<div className="hf hf16" role="img" aria-label="MOTHERSHIP HOSTのメニューで、「ログイン時に起動」と「待機中も Mac をスリープさせない」のスイッチを、順にオンにする様子"><div className="hf-in" aria-hidden="true"><div className="hf-mbar"><i></i><b></b><b></b><b></b><span className="hf-tray "><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span><u></u><u></u></div><div className="hf-pop "><div className="hf-r"><b>Mothership Host</b><small>接続を待っています</small></div><div className="hf-r"><span>登録済みの端末</span><em className="hf-btn ">端末を追加…</em></div><div className="hf-r"><i className="hf-dot is-ok"></i><span>画面収録</span></div><div className="hf-r"><i className="hf-dot is-ok"></i><span>アクセシビリティ</span></div><div className="hf-r hf16-r1"><span>ログイン時に起動</span><i className="hf-tg hf16-t1"></i></div><div className="hf-r hf16-r2"><span>待機中も Mac をスリープさせない</span><i className="hf-tg hf16-t2"></i></div></div><svg className="hf-cur hf16-cur" viewBox="0 0 12 16"><path d="M1 1v12l3.2-2.8 2 4.6 2-.9-2-4.5H11z" fill="#14203a" stroke="#fff" strokeWidth="1" strokeLinejoin="round"/></svg></div></div>{/* /fig:16 */}
              <ul className="ticks">
                <li>ノート型のMacは、ふたを閉じるとスリープすることがあります。電源につないで、ふたを開けたままにしておきます。</li>
                <li>Macを再起動したあとは、ログインするまで、MOTHERSHIP HOSTが動きません。ログインするまでは、つなげません。</li>
              </ul>
            </section>
  
            {/* 6 うまくいかないとき */}
            <section className="article" id="trouble" aria-labelledby="trouble-title">
              <h2 id="trouble-title"><span className="no">6</span>うまくいかないとき</h2>
              <dl className="help-qa">
                <div><dt>家で、デバイスにMacが見つからない</dt><dd><ul><li>Macとデバイスが、同じWi-Fiにつながっているかを確かめます。</li><li>Macのメニューバーに、MOTHERSHIP HOSTのアイコンがあるかを確かめます。なければ、MOTHERSHIP HOSTを開きます。</li><li>iPhone・iPadは、「設定」›「プライバシーとセキュリティ」›「ローカルネットワーク」で、Mothershipがオンになっているかを確かめます。</li></ul></dd></div>
                <div><dt>QRコードで登録できない</dt><dd>QRコードが使えるのは、5分間・1回だけです。Macのウィンドウで「新しい登録リンクと QR コードを作成」を押して、新しいQRコードを読み取ります。</dd></div>
                <div><dt>つながるのに、画面が映らない・操作できない</dt><dd>Macの許可が外れているかもしれません。MOTHERSHIP HOSTのメニューで、「画面収録」と「アクセシビリティ」に緑のチェックが付いているかを確かめます（<a href="#setup-mac">ステップ1</a>）。</dd></div>
                <div><dt>外からつながらない</dt><dd><ul><li>デバイスとMacのTailscaleがオンで、同じアカウントかを確かめます。</li><li>Macがスリープしていないか、MOTHERSHIP HOSTが動いているかを確かめます（<a href="#keep-awake">5 Macを起こしておく</a>）。</li><li>「アドレスを直接入力」に、MacのTailscaleの名前を入れて試します（<a href="#outside">4 外から使う</a>）。</li></ul></dd></div>
                <div><dt>声で書けない</dt><dd>「<a href="#voice-trouble">声で書けないとき</a>」を見てください。</dd></div>
                <div><dt>「試用期間が終了しました」と出る</dt><dd>デバイスのMOTHERSHIPで購入します（試用終了の画面か、設定の「ライセンス」）。購入したデバイスでMacにつなぐと、そのMacでも使えるようになります。</dd></div>
                <div><dt>デバイスをなくした</dt><dd>MOTHERSHIP HOSTのメニューの「登録済みの端末」から、そのデバイスを削除します。削除したデバイスからは、つなげなくなります。Tailscaleを使っている場合は、Tailscaleでも、そのデバイスを外します。</dd></div>
              </dl>
              <div className="callout">
                <h2>それでも解決しないとき</h2>
                <p><Link href="/contact/">お問い合わせ</Link>から、ご連絡ください。お使いのMacとデバイスの種類、OSのバージョン、表示された文を書いていただくと、早くお答えできます。</p>
              </div>
            </section>
          </article>
        </div>
      </main>
  );
}
