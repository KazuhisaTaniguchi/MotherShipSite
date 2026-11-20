import type { Metadata } from "next";
import Link from "next/link";
import { HeroDemo } from "@/components/HeroDemo";
import { getAllPosts } from "@/lib/wordpress";

// トップページ（LP）。mock/design/index.html の <main> をそのまま JSX にしたもの（原稿は mock/contents/lp-content.md の第2版）。
// モックで赤い枠の「未確定：…」を付けた所（Mac のロック解除 2 か所）は、
// 対応を確かめるまで、いま確かな文だけを出している（くわしくは mock/contents/README.md の未確定事項 5・7）。
export const metadata: Metadata = {
  title: { absolute: "MOTHERSHIP｜スマホからMacをリモート操作。指で動かす、声で書く" },
};

export default async function Home() {
  // 最新のお知らせ（WordPress の投稿の新しい順に 3 件まで）。ビルドのときに読む。投稿が変わると、WordPress からの合図でサイトが作り直される
  const latestPosts = (await getAllPosts()).slice(0, 3);

  return (
  <main id="main">

      {/* S1 HERO：動画が主役 */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-bg" aria-hidden="true"></div>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="pill pill-glass hero-label">AIが働くMacを、手もとから。</p>
            <h1 id="hero-title">指で動かす。<br /><span className="grad-text">声で書く。</span></h1>
            <p className="hero-lead">家のMacで、AIが作業中。<br />進み具合を指で確かめて、直しは話すだけ。</p>
            <a className="hero-voice" href="#voice">
              <span className="hero-voice-text"><span className="hero-voice-kicker">声で書く</span><b>Aqua Voiceに対応</b><span className="hero-voice-sub"><span className="nb">話すだけで文字が入るから、</span><span className="nb"><mark>キーボードいらず。</mark></span></span><span className="hero-voice-note">Aqua Voiceは別の会社のアプリです。</span></span>
              <span className="hero-voice-arrow" aria-hidden="true">→</span>
            </a>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#download">ダウンロード <span aria-hidden="true">→</span></a>
              <a className="btn btn-ghost" href="#features">特長を見る</a>
            </div>
            <p className="hero-note">14日間、すべての機能を無料で。<span className="nb">買い切り・月額なし・アカウント登録なし。</span></p>
            <p className="hero-platforms">iPhone <i>·</i> iPad <i>·</i> Android <i>·</i> Mac</p>
          </div>

          <div className="hero-stage">
            <div className="stage-glow" aria-hidden="true"></div>
            <HeroDemo />
            <div className="stage-chip chip-a" aria-hidden="true"><b>60</b>fps まで</div>
            <div className="stage-chip chip-b" aria-hidden="true"><span className="dot"></span>暗号化して直接つなぐ</div>
          </div>
        </div>
        <p className="wrap hero-foot">Macの画面を、スマホ・タブレット・別のMacへ。</p>
      </section>

      {/* S2 共感：席を離れたあとの困りごと */}
      <section className="section pains" aria-labelledby="pains-title">
        <div className="wrap">
          <h2 className="section-title center" id="pains-title">席を離れたあと、<br className="sp" />こうなっていませんか。</h2>
          <ol className="scene-list is-three">
            <li><span className="num">01</span><h3>戻ったら、AIが止まっていた</h3><p>長い作業を任せて席を離れたら、AIは確認を待ったまま。離れている間、進んだのか止まったのか、分かりません。</p></li>
            <li><span className="num">02</span><h3>スマホでつないでも、文字が読めない</h3><p>大きなモニターをそのままスマホに映すと、文字は小さすぎて読めません。拡大して、ずらして、また拡大。</p></li>
            <li><span className="num">03</span><h3>次の指示が、打ちにくい</h3><p>画面のキーボードを出すと、画面の半分近くが隠れます。AIへの長い指示を、小さなキーで打つのはたいへんです。</p></li>
          </ol>
          <p className="pains-answer"><span className="nb">MOTHERSHIPは、</span><span className="nb">この3つをなくすために作った</span><span className="nb">リモートデスクトップアプリです。</span></p>
        </div>
      </section>

      {/* S3 3つの柱（いつも「くっきり見える → 指で動かす → 声で書く」の順番） */}
      <section className="section promise" aria-labelledby="promise-title">
        <div className="wrap">
          <h2 className="section-title center" id="promise-title">見て、動かして、<br className="sp" />話すだけ。</h2>
          <div className="promise-grid">
            <article className="card">
              <span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2.5"/><path d="M8 21h8M12 17v4"/></svg></span>
              <h3>くっきり見える</h3>
              <p>デバイスと同じ形の画面を、Macに用意。縦でも横でも横幅ぴったりで、小さな文字までくっきり読めます。</p>
              <a className="card-link" href="#features">くわしく見る<span aria-hidden="true"> →</span></a>
            </article>
            <article className="card">
              <span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.7-2.3L4 14.5a1.6 1.6 0 0 1 2.5-2L9 14.5"/></svg></span>
              <h3>指で動かす</h3>
              <p>触った場所が、そのままクリック。3本指のスワイプで、開いている窓の一覧も出せます。</p>
              <a className="card-link" href="#touch">くわしく見る<span aria-hidden="true"> →</span></a>
            </article>
            <article className="card">
              <span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg></span>
              <h3>声で書く</h3>
              <p>話すだけで、Macに文字が入ります（Aqua Voiceに対応）。キーボードはしまったまま、画面は広いまま。</p>
              <a className="card-link" href="#voice">くわしく見る<span aria-hidden="true"> →</span></a>
            </article>
          </div>
          <ul className="promise-band">
            <li>買い切り・月額なし</li>
            <li>アカウント登録なし</li>
            <li>通信は、Macとデバイスの間で直接</li>
          </ul>
        </div>
      </section>

      {/* S4 場面の流れ */}
      <section className="section flow" aria-labelledby="flow-title">
        <div className="wrap">
          <div className="section-head center">
            <h2 className="section-title" id="flow-title">AIに任せて、出かける。</h2>
            <p className="section-lead">家のMacは、働かせたまま。<span className="nb">あなたは、スマホを持って出かけるだけです。</span></p>
          </div>
          {/* 場面の流れの図（2026-11-21）。下の 4 つの手順と同じ時計で動く（16 秒で 1 周）。CSS だけ */}
          <div className="flow-demo" role="img" aria-label="AIに任せて出かける流れの図。家のMacで、AIにレポートづくりを頼み、Macを起こしたままにして出かける。外出先でスマホを開くと、Macの画面が映り、AIが確認を待っているのが分かる。指で「許可」を押し、スクロールして結果を確かめる。スマホの🎤を押して「いちばん売上が高い月を、目立たせてください。」と話すと、Macの入力欄に入り、グラフのいちばん高い棒が目立つ。">
            <div className="fd-fig" aria-hidden="true">
              <div className="fd-in">
                <span className="fd-place fd-home">家</span>
                <span className="fd-place fd-away">外出先</span>
                <div className="fd-mac">
                  <div className="fd-scr">
                    <div className="fd-mbar"><i></i><b></b><b></b><span className="fd-awake">スリープさせない<u></u></span></div>
                    <div className="fd-ui">
                      <div className="fd-ai">
                        <b>AI アシスタント</b>
                        <div className="fd-log"><div className="fd-logi">
                          <p className="fd-me fd-me1">先月の売上を、レポートにまとめてください。</p>
                          <div className="fd-work"><i></i><i></i><i></i><i></i><i></i><i></i></div>
                          <p className="fd-done">✓ レポートができました</p>
                          <p className="fd-me fd-me2">いちばん売上が高い月を、目立たせてください。</p>
                        </div></div>
                        <div className="fd-ask"><span>続けてよいですか？</span><em>許可</em></div>
                        <div className="fd-input"><span className="fd-hint">次の指示を入力</span><span className="fd-t fd-t1">先月の売上を、レポートにまとめてください。</span><span className="fd-t fd-t2">いちばん売上が高い月を、目立たせてください。</span></div>
                      </div>
                      <div className="fd-rep"><b><i></i><i></i><i></i></b><p>売上レポート</p><em><i></i><i></i><i></i><i></i><i></i></em></div>
                    </div>
                  </div>
                  <i className="fd-stand"></i>
                </div>
                <div className="fd-link"><i></i></div>
                <div className="fd-ph">
                  <div className="fd-ui">
                    <div className="fd-ai">
                      <b>AI アシスタント</b>
                      <div className="fd-log"><div className="fd-logi">
                        <p className="fd-me fd-me1">先月の売上を、レポートにまとめてください。</p>
                        <div className="fd-work"><i></i><i></i><i></i><i></i><i></i><i></i></div>
                        <p className="fd-done">✓ レポートができました</p>
                        <p className="fd-me fd-me2">いちばん売上が高い月を、目立たせてください。</p>
                      </div></div>
                      <div className="fd-ask"><span>続けてよいですか？</span><em>許可</em></div>
                      <div className="fd-input"><span className="fd-hint">次の指示を入力</span><span className="fd-t fd-t2">いちばん売上が高い月を、目立たせてください。</span></div>
                    </div>
                  </div>
                  <div className="fd-bar"><span className="fd-mic">🎤</span><i></i><i></i><i></i><i></i></div>
                </div>
                <span className="fd-f fd-tap"></span>
                <span className="fd-f2"><i></i><i></i></span>
                <span className="fd-f fd-press"></span>
                <p className="fd-said">いちばん売上が高い月を、目立たせてください。</p>
              </div>
            </div>
            <p className="fd-note">イメージです（実際の画面とは異なります）</p>
          </div>

          <ol className="flow-list">
            <li><span className="step-n">1</span><h3>出かける前に、頼んでおく</h3><p>いつものMacで、いつものAIに。MOTHERSHIP HOSTの設定で、Macを起こしたままにしておけます。</p></li>
            <li><span className="step-n">2</span><h3>出先で、のぞく</h3><p>MOTHERSHIPを開いて、Macをタップ。Macの画面が、そのまま手もとに映ります。進んだのか、止まっているのか、ひと目で分かります。</p></li>
            <li><span className="step-n">3</span><h3>指で、確かめる</h3><p>スクロールして結果を読む。窓を切り替える。確認のボタンを押す。ぜんぶ、指で。</p></li>
            <li><span className="step-n">4</span><h3>声で、次を頼む</h3><p>🎤を押して話すだけ。話した言葉が、Macの入力欄に入ります。</p></li>
          </ol>
          <p className="flow-end">家に着いたら、そのまま大きな画面で続きを。</p>

          <div className="say">
            <h3 className="say-title">こんな指示を、声で</h3>
            <ul className="say-list">
              <li>「テストが通ったら、プルリクエストを作ってください。」</li>
              <li>「いちばん売上が高い月を、目立たせてください。」</li>
              <li>「この内容で、返信の下書きを作ってください。」</li>
            </ul>
          </div>

          <aside className="callout">
            <h3>どのAIでも、いつものまま。</h3>
            <p>MOTHERSHIPは、Macの画面をそのまま映して動かすアプリです。ターミナルで動くAIも、エディターのAIも、ブラウザーのAIも、いつもの画面のまま使えます。AIの側の設定や、アカウントの連携は要りません。</p>
            <p className="fine">MOTHERSHIPに、AIの機能は入っていません。あなたがMacで使っているAIを、そのまま動かします。</p>
          </aside>
          <p className="note center">外出先から使うには、Tailscaleの準備が要ります。<a href="#how">出かける前の準備を見る</a></p>
        </div>
      </section>

      {/* 特長（S5 くっきり見える・S6 指で動かす） */}
      <section className="section features" id="features" aria-labelledby="features-title">
        <div className="wrap">
          <div className="section-head center">
            <p className="kicker">特長</p>
            <h2 className="section-title" id="features-title">映すだけじゃない。<br className="sp" />ちゃんと使える。</h2>
            <p className="section-lead">MOTHERSHIPは、離れた場所からMacを「見る」ためではなく、「使う」ために作りました。小さな画面で文字を読み、指で動かし、声で書く。その一つひとつを、作り込んでいます。</p>
          </div>

          {/* S5 特長 1：くっきり見える */}
          <article className="feature-lead">
            <div className="feature-lead-copy">
              <p className="pill pill-brand feature-tag">1　くっきり見える</p>
              <h3>小さな画面でも、<br />文字はくっきり。</h3>
              <p>27インチのモニターをそのままスマホに映すと、文字は小さすぎて読めません。MOTHERSHIPは、つないでいる間だけ、あなたのデバイスと同じ大きさ・同じ形の専用モニターをMacに追加します。画面いっぱいに、点と点がぴったり合った状態で映るので、ターミナルの小さな文字も、表の数字も、くっきり読めます。</p>
              <ul className="ticks">
                <li>デバイスを縦にすれば縦長の画面に、横にすれば横長の画面に。どちらでも、横幅ぴったりで映ります。縦にしたときは、窓を広げれば横幅いっぱいの大きさで読めます。</li>
                <li>画面の動きが止まると、すぐに高画質で送り直します。AIが書いた文を読むときも、文字がにじみません。</li>
                <li>細かい文字が多いときは、画質を「文字優先」に。</li>
                <li>ピンチで拡大すると、見ている部分を高い解像度で取り込み直します。</li>
                <li>いつも使っているモニターを、そのまま映すこともできます。</li>
              </ul>
              <p className="fine">専用モニターは、接続を切ると自動で消えます。向きを変えても、Macの窓は自動では並び直りません（Macのふつうの動きです）。重なった窓は、3本指のスワイプで一覧にして選べます。</p>
            </div>
            {/* 図：HERO のアニメと同じ流れ（横向き → 縦に回す → 窓が重なる → レポートを横幅いっぱいに）を、左右で同時に動かして比べる。CSS だけで動く */}
            <div className="fit-diagram" role="img" aria-label="タブレットを横から縦に回したときの比較の図。大きな画面をそのまま映すと、縦では細い帯のように縮んで文字が読めない。MOTHERSHIPなら、縦にするとMacの画面も縦長になり、文字は大きいまま。重なった窓を広げると、横幅いっぱいに映る。">
              <div className="fit-col">
                <div className="fit-stage" aria-hidden="true">
                  <div className="fit-dev">
                    <div className="fit-mac fit-mac-shrunk">
                      <i className="fit-mbar"></i>
                      <div className="fit-win fw-1"><b></b><span></span><span></span><span></span><span></span></div>
                      <div className="fit-win fw-2"><b></b><span></span><span></span><span></span></div>
                      <div className="fit-win fw-3"><b></b><span></span><span></span><span></span><span></span></div>
                    </div>
                  </div>
                </div>
                <p><b>そのまま映すと</b>大きな画面が縮んで、文字が読めない。縦にすると、細い帯になる</p>
              </div>
              <div className="fit-arrow" aria-hidden="true">→</div>
              <div className="fit-col">
                <div className="fit-stage" aria-hidden="true">
                  <div className="fit-dev is-good">
                    <div className="fit-mac fit-mac-native">
                      <i className="fit-mbar"></i>
                      <div className="fit-win fit-ai"><b></b><span></span><span></span><span></span></div>
                      <div className="fit-win fit-out"><b></b><em><i></i><i></i><i></i><i></i></em></div>
                    </div>
                  </div>
                </div>
                <p><b>MOTHERSHIPなら</b>縦でも横でも、デバイスの形の画面に。窓を広げれば、横幅いっぱい</p>
              </div>
            </div>
          </article>

          {/* S6 特長 2：指で動かす */}
          <div className="feature-grid">
            <article className="feature feature-wide" id="touch">
              <div>
                <p className="pill pill-brand feature-tag">2　指で動かす</p>
                <h3>マウスがなくても、指でMacを動かせる。</h3>
                <p>触った場所が、そのままクリックになる「直接タッチ」。Macの画面に、じかに触っている感覚で使えます。AIが確認を求めてきたら、そのボタンを指で押すだけです。</p>
                <p className="fine">キーボードも使えます（下の「キーボードも、ちゃんとMac。」）。</p>
              </div>
              <ul className="ticks small">
                <li>タップでクリック、長押しで右クリック、2本指でスクロール。</li>
                <li>3本指で上にスワイプすると、Mission Control（開いている窓の一覧）。下にスワイプで、いま使っているアプリの窓の一覧。左右で、デスクトップの切り替え（Androidは、トラックパッドのモードで）。</li>
                <li>窓を選ぶ、広げる、閉じる。窓の左上のボタンも、指でそのまま押せます。</li>
                <li>細かい場所をねらうときは、画面全体をトラックパッドとして使うモードに切り替えられます。</li>
              </ul>
              {/* 図：指の操作を 4 つ、順に見せる（12 秒で 1 周。CSS だけで動く）。タップで「許可」→ 2本指でスクロール → 3本指で上にスワイプして窓の一覧、レポートを選ぶ → 緑のボタンで横幅いっぱい */}
              <div className="touch-demo" role="img" aria-label="指でMacを動かす様子の図。AIの確認のボタンを指でタップして許可する。2本指でスクロールする。3本指で上にスワイプして開いている窓の一覧を出し、レポートを選ぶ。窓の緑のボタンを押して、横幅いっぱいに広げる。">
                <div className="td-stage" aria-hidden="true">
                  <div className="td-dev">
                    <div className="td-mac">
                      <i className="td-mbar"></i>
                      <div className="td-win td-ai">
                        <b></b>
                        <div className="td-view"><div className="td-scroll"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div></div>
                        <div className="td-ask"><span></span><em>許可</em></div>
                      </div>
                      <div className="td-win td-out">
                        <b><i></i><i></i><i></i></b>
                        <p className="td-name">売上レポート</p>
                        <div className="td-bars"><i></i><i></i><i></i><i></i><i></i></div>
                      </div>
                      <i className="td-dim"></i>
                      <span className="td-f td-tap1"></span>
                      <span className="td-f2"><i></i><i></i></span>
                      <span className="td-f3"><i></i><i></i><i></i></span>
                      <span className="td-f td-tap2"></span>
                      <span className="td-f td-tap3"></span>
                    </div>
                  </div>
                </div>
                <ol className="td-steps" aria-hidden="true">
                  <li><b>タップ</b>AIの確認のボタンを、指で押す</li>
                  <li><b>2本指</b>上へなぞって、スクロール</li>
                  <li><b>3本指</b>上へスワイプで、窓の一覧。レポートを選ぶ</li>
                  <li><b>広げる</b>緑のボタンで、横幅いっぱい</li>
                </ol>
                <p className="td-note">イメージです（実際の画面とは異なります）</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* S7 特長 3：声で書く（Aqua Voice 連携） */}
      <section className="section voice" id="voice" aria-labelledby="voice-title">
        <div className="wrap voice-grid">
          <div className="voice-copy">
            <p className="kicker light">3　声で書く</p>
            <h2 className="section-title" id="voice-title"><span className="nb">話すだけで、</span><span className="nb">文字になる。</span><br /><span className="nb">キーボードは、</span><span className="nb">しまったままで。</span></h2>
            <p className="section-lead">AIへの指示は、文章です。小さな画面のキーボードで打つには長く、キーボードを出せば画面が隠れます。MOTHERSHIPは、Macの音声入力アプリ「Aqua Voice」とつながります。手もとのデバイスに話しかけると、その声がMacに届き、開いているアプリに文字が入ります。AIへの指示も、メールの返信も、メモも、声だけで。</p>
            <ol className="voice-steps">
              <li><b>押す</b><span>🎤ボタンを押している間だけ、声を送ります。</span></li>
              <li><b>話す</b><span>デバイスのマイクに向かって、ふつうに話します。</span></li>
              <li><b>離す</b><span>MacのAqua Voiceが文字にして、カーソルの位置に入力します。</span></li>
            </ol>
          </div>

          {/* 図 1：押す → 話す → 離す → Enter で送る（12 秒で 1 周。左の「押す・話す・離す」の枠も、同じ時計で明るくなる） */}
          <div className="voice-visual" aria-hidden="true">
            <div className="voice-card">
              <div className="voice-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
              <p className="voice-said"><span>「テストが通ったら、</span><span>プルリクエストを</span><span>作ってください。」</span></p>
              <div className="voice-arrow">↓</div>
              <p className="voice-typed"><span className="vt-start"><span className="caret"></span></span><span className="vt-text">テストが通ったら、プルリクエストを作ってください。</span><span className="vt-end"><span className="caret"></span></span><span className="vt-sent">⏎ Enterで送信</span></p>
              <div className="voice-buttons"><span className="vb vb-mic">🎤</span><span className="vb">⌫</span><span className="vb vb-enter">⏎</span><span className="vb">⇥</span><span className="vb"><small>コピー</small></span><span className="vb"><small>ペースト</small></span></div>
              <p className="voice-phase"><span><b>1</b>押す</span><span><b>2</b>話す</span><span><b>3</b>離すと、Macに文字が入る</span><span><b>4</b>Enterで送る。キーボードは出しません</span></p>
            </div>
            <p className="voice-visual-note">イメージ図です</p>
          </div>

          <div className="voice-more">
            <ul className="ticks small on-dark">
              <li>音声入力のバーには、ボタンを6個まで置けます。はじめは、🎤・削除・Enter・Tab・コピー・ペースト。話して、Enterで送る。ここまで、キーボードは出しません。</li>
              <li>バーのボタンは、よく使うキーに入れ替えられます（Esc、矢印、取り消す、Mission Controlなど）。バーは、好きな場所に動かせます。</li>
              <li>言い直したいときは、押したまま指を外へ滑らせて離すと取り消せます。</li>
              <li>外付けキーボードの好きなキーを、「話すキー」にもできます。</li>
              <li>iPhone・iPad・Androidで使えます。</li>
            </ul>
            {/* 図 3：バーの小わざ（上の箇条書きの 2・3 番目を絵にしたもの） */}
            <div className="voice-minis" aria-hidden="true">
              <div className="vm vm-cancel">
                <div className="vm-fig"><div className="vm-in">
                  <span className="vm-field"><span className="caret"></span></span>
                  <span className="vm-tag">取り消し</span>
                  <div className="vm-bar"><span className="vk vk-mic">🎤</span><span className="vk">⌫</span><span className="vk">⏎</span></div>
                </div></div>
                <p><b>滑らせて、取り消し</b>押したまま、指を外へ</p>
              </div>
              <div className="vm vm-move">
                <div className="vm-fig"><div className="vm-in">
                  <span className="vm-win"><b></b><i></i><i></i><i></i><i></i></span>
                  <div className="vm-drag"><div className="vm-bar"><span className="vm-grip">≡</span><span className="vk vk-mic">🎤</span><span className="vk">⌫</span><span className="vk">⏎</span></div></div>
                </div></div>
                <p><b>バーを、好きな場所へ</b>重なったら、指で動かす</p>
              </div>
              <div className="vm vm-swap">
                <div className="vm-fig"><div className="vm-in">
                  <div className="vm-tray"><span>esc</span><span>←</span><span>→</span><span>⌃↑</span></div>
                  <div className="vm-bar"><span className="vk vk-mic">🎤</span><span className="vk vk-flip"><em>⇥</em><em><small>esc</small></em></span><span className="vk vk-flip"><em><small>コピー</small></em><em>←</em></span><span className="vk vk-flip"><em><small>ペースト</small></em><em>→</em></span></div>
                </div></div>
                <p><b>ボタンを、入れ替え</b>よく使うキーを、バーに置く</p>
              </div>
            </div>
          </div>

          {/* 図 2：キーボードで打つと／声で書くと（8 秒で 1 周） */}
          <div className="voice-compare-wrap">
            <div className="voice-compare" role="img" aria-label="キーボードで打つ場合と、声で書く場合を比べた図。キーボードを出すと、画面の下半分が隠れてレポートが見えなくなり、文字は少しずつしか入らない。声で書くと、画面は広いままで、話した文がまとめて入る。">
              <div className="vc-col" aria-hidden="true">
                <div className="vc-phone">
                  <div className="vc-mac">
                    <div className="vc-win vc-ai"><b></b><span></span><span></span><span></span><div className="vc-prompt"><i></i></div></div>
                    <div className="vc-win vc-out"><b></b><em><i></i><i></i><i></i><i></i></em></div>
                  </div>
                  <div className="vc-kb"><i></i><i></i><i></i><i></i><span className="vc-tap"></span></div>
                </div>
                <p><b>キーボードで打つと</b>画面の半分が隠れる。<br />長い文は、打ちにくい</p>
              </div>
              <div className="vc-arrow" aria-hidden="true">→</div>
              <div className="vc-col" aria-hidden="true">
                <div className="vc-phone is-good">
                  <div className="vc-mac">
                    <div className="vc-win vc-ai"><b></b><span></span><span></span><span></span><div className="vc-prompt"><i></i><span className="vc-ok">✓</span></div></div>
                    <div className="vc-win vc-out"><b></b><em><i></i><i></i><i></i><i></i></em></div>
                  </div>
                  <div className="vc-bar"><i></i><i></i><i></i><i></i><i></i><i></i></div>
                </div>
                <p><b>声で書くと</b>画面は広いまま。<br />長い文も、話すだけ</p>
              </div>
            </div>
            <p className="voice-visual-note" aria-hidden="true">イメージ図です</p>
          </div>

          <aside className="voice-need">
            <h3>使うために必要なもの</h3>
            <p>Aqua Voiceは、MOTHERSHIPとは別の会社が提供している音声入力アプリです（MOTHERSHIPには含まれません）。Macに「Aqua Voice」と、無料の仮想オーディオ「BlackHole 2ch」を入れ、Aqua Voiceのマイクを「BlackHole 2ch」にしておきます。文字にする精度は、Aqua Voiceによります。</p>
            {/* 図 4：声の通り道（6 秒で 1 周。左から順に明るくなる） */}
            <div className="voice-flow" role="img" aria-label="声の通り道の図。手もとのデバイスで話した声は、MacのMOTHERSHIP HOSTに届く。MOTHERSHIP HOSTは、その声を仮想のマイク「BlackHole 2ch」に流す。Aqua VoiceがBlackHole 2chの声を聞いて文字にし、開いているアプリのカーソルの位置に入力する。Macに入れておくのは、BlackHole 2chとAqua Voiceの2つ。">
              <p className="vf-title" aria-hidden="true">声の通り道</p>
              <div className="vf-row" aria-hidden="true">
                <div className="vf-node vf-n1"><b>手もとのデバイス</b><span>🎤を押している間、声を送る</span></div>
                <i className="vf-link vf-l1"></i>
                <div className="vf-mac">
                  <p>Macの中</p>
                  <div className="vf-node vf-n2"><b>MOTHERSHIP HOST</b><span>声を受け取って、流す</span></div>
                  <i className="vf-link vf-l2"></i>
                  <div className="vf-node vf-n3 is-need"><em>入れておく</em><b>BlackHole 2ch</b><span>声を渡す、仮想のマイク</span></div>
                  <i className="vf-link vf-l3"></i>
                  <div className="vf-node vf-n4 is-need"><em>入れておく</em><b>Aqua Voice</b><span>声を文字にする</span></div>
                  <i className="vf-link vf-l4"></i>
                  <div className="vf-node vf-n5"><b>開いているアプリ</b><span>カーソルの位置に入る</span></div>
                </div>
              </div>
            </div>
            <p className="voice-need-sub">Aqua Voiceを使わないときは、アプリ内のキーボードか、スマホのキーボード（フリック入力など）で文字を入力できます。</p>
          </aside>
        </div>
      </section>

      {/* S8 特長 4：任せたままにできる */}
      <section className="section stay" aria-labelledby="stay-title">
        <div className="wrap">
          <article className="feature feature-wide">
            <div>
              <p className="pill pill-brand feature-tag">任せたまま</p>
              <h3 id="stay-title">Macは起きたまま。切れても、すぐ戻る。</h3>
              <p>Macがスリープすると、任せた作業も、外からの接続も止まります。MOTHERSHIP HOSTには、待っている間もMacをスリープさせない設定があります。あなたのデバイスからは、家でも外でも、同じようにつながります。</p>
              <p className="fine">外出先から使うには、MacとデバイスにTailscaleのアプリを入れ、同じアカウントでログインしておく必要があります。ノート型のMacは、ふたを閉じるとスリープすることがあります。</p>
            </div>
            <ul className="ticks small">
              <li>MOTHERSHIP HOSTの「待機中もMacをスリープさせない」と「ログイン時に起動」をオンにしておきます。</li>
              <li>自宅のWi-Fiでは、登録したMacを自動で見つけてつながります。</li>
              <li>外出先からは、Tailscale（個人なら無料で使えるVPNサービス）を通して接続します。ルーターの設定は要りません。</li>
              <li>Wi-Fiからモバイル回線に切り替わっても、自動でつなぎ直します。</li>
              <li>画面が止まっている間は、ほとんど通信しません。通信量は、回線に合わせて自動で調整します。</li>
              <li>画質は3種類：バランス（最大60fps）、文字優先、滑らかさ優先。</li>
              <li>操作がないまま時間がたつと、自動で切断します（はじめの設定は30分）。</li>
            </ul>
          </article>
        </div>
      </section>

      {/* S9 比べる：ふつうの画面共有とのちがい（ほかの製品の名前は出さない） */}
      <section className="section compare" aria-labelledby="compare-title">
        <div className="wrap">
          <div className="section-head center">
            <h2 className="section-title" id="compare-title">ふつうの画面共有と、<br className="sp" />どこがちがう？</h2>
            <p className="section-lead">Macのモニターを、そのままスマホに映す。それが、ふつうの画面共有です。<span className="nb">MOTHERSHIPは、映し方から変えました。</span></p>
          </div>
          <table className="compare-table">
            <thead>
              <tr><td></td><th scope="col">大きな画面をそのまま映すと</th><th scope="col" className="is-ours">MOTHERSHIPなら</th></tr>
            </thead>
            <tbody>
              <tr><th scope="row">画面の形</th><td>Macのモニターの形のまま。スマホでは余白ができて、全体が小さく映る</td><td className="is-ours">デバイスと同じ形の専用モニターを用意。画面いっぱいに映る</td></tr>
              <tr><th scope="row">文字</th><td>縮んで小さくなる。読むには拡大が要る</td><td className="is-ours">点と点がぴったり合うので、そのままで読める</td></tr>
              <tr><th scope="row">向きを変えたとき</th><td>画面の形は変わらない</td><td className="is-ours">縦長・横長に切り替わる</td></tr>
              <tr><th scope="row">指での操作</th><td>小さく映ったボタンは、指で押しにくい</td><td className="is-ours">大きく映るので、指でねらいやすい。3本指のスワイプも使える</td></tr>
              <tr><th scope="row">文字の入力</th><td>画面のキーボードで打つ。出している間、画面が隠れる</td><td className="is-ours">声で入力できる（Aqua Voiceに対応）。キーボードも使える</td></tr>
            </tbody>
          </table>
          <div className="compare-notes">
            <div>
              <h3>MOTHERSHIPについて</h3>
              <ul className="ticks small">
                <li>料金は買い切り。月額料金はありません。</li>
                <li>アカウントの登録はありません。</li>
                <li>映像と操作は、Macとデバイスの間で直接やり取りします。MOTHERSHIPのサーバーは通りません。</li>
              </ul>
            </div>
            <div>
              <h3>向いていないこと</h3>
              <ul className="plain-list">
                <li>動きの激しいゲーム。</li>
                <li>WindowsやLinuxのパソコンの操作（操作できるのはMacだけです）。</li>
                <li>何人かで同時に同じMacを使うこと（つなげるのは、一度に1台です）。</li>
              </ul>
            </div>
          </div>
          <p className="note center">MOTHERSHIPでも、いつも使っているモニターをそのまま映せます。</p>
        </div>
      </section>

      {/* S10 安心・S11 そのほかの特長 */}
      <section className="section others" aria-labelledby="others-title">
        <div className="wrap">
          {/* S10 安心 */}
          <article className="feature feature-wide">
            <div>
              <h3>見られたくない画面は、見せない。</h3>
              <p>外出先からつないでいる間、自宅のMacの画面は、そばにいる人から見える状態になります。MOTHERSHIPは、Macの画面を黒く隠したまま、あなたのデバイスにだけ画面を映せます。</p>
            </div>
            <ul className="ticks small">
              <li>外出先からつないだときは、自動で画面を隠します。隠していた場合、切断するとMacをロックします。</li>
              <li>通信は暗号化（TLS 1.3など）。映像と操作は、Macとデバイスの間で直接やり取りします。MOTHERSHIPのサーバーは通りません。</li>
              <li>登録はQRコードで。登録したデバイスだけが接続できます。デバイスごとの鍵は、そのデバイスの安全な領域から取り出せません。</li>
              <li>アプリを開くときに、Face ID・Touch ID・指紋でロックをかけられます。</li>
              <li>接続と切断は、Macに通知します。</li>
              <li>ルーターの設定（ポートの開放）は要りません。</li>
            </ul>
          </article>

          {/* S11 そのほか */}
          <div className="section-head center others-head">
            <h2 className="section-title" id="others-title">いつものMacを、<br className="sp" />いつもどおりに。</h2>
            <p className="section-lead">声や指だけでは足りないときのために。</p>
          </div>
          <div className="feature-grid">
            <article className="feature">
              <h3>キーボードも、ちゃんとMac。</h3>
              <p>⌘や⌥がそろった、Mac配列のキーボードをアプリの中に用意しました。</p>
              <ul className="ticks small">
                <li>よく使う操作（コピー、ペースト、アプリの切り替えなど）は、ショートカットバーからワンタップで。並びは自分で変えられます。</li>
                <li>外付けのキーボードやマウスも、そのまま使えます（iPhoneはキーボードのみ）。</li>
              </ul>
              <div className="keys" aria-hidden="true"><kbd>⌘</kbd><kbd>⌥</kbd><kbd>⌃</kbd><kbd>⇧</kbd><kbd>⌘C</kbd><kbd>⌘V</kbd></div>
            </article>

            <article className="feature">
              <h3>日本語も、いつもどおりに打てる。</h3>
              <p>リモート操作でつまずきやすい日本語入力に、2つの方法を用意しました。Macの日本語入力でそのまま変換する方法と、スマホのキーボード（フリック入力など）で変換してから送る方法。ボタンひとつで切り替えられます。</p>
              <ul className="ticks small">
                <li>「英数」「かな」キーに対応。US配列のMacでも、入力モードを切り替えられます。</li>
                <li>キーボードの刻印は、Macで使っている入力ソースに合わせて表示します。</li>
              </ul>
            </article>

            <article className="feature">
              <h3>コピーも、ファイルも、音も。</h3>
              <ul className="ticks small">
                <li>片方でコピーして、もう片方でペースト。文字も画像も共有できます。</li>
                <li>ファイルは、デバイスからMacへ、Macからデバイスへ。iPadなら、Macの画面の上にドラッグ＆ドロップするだけ。</li>
                <li>Macの音を、手もとのデバイスで聞けます（設定でオンにします）。</li>
              </ul>
            </article>

            <article className="feature">
              <h3>Macを、切り替えて。</h3>
              <p>Macは何台でも登録して、切り替えて使えます。一度の購入で使えるMacは、3台までです。</p>
            </article>

            <article className="feature">
              <h3>MacBookから、家のMacへ。</h3>
              <p>持ち歩くのは軽いMacBookだけ。パワーが要る作業は、家のMacに任せましょう。Mac版のMOTHERSHIPで、同じようにつなげます。</p>
            </article>

            <article className="feature">
              <h3>折りたたみスマホが、小さなMacになる。</h3>
              <p>半分に折って机に置くと、上の画面がMacのモニターに、下の画面がトラックパッドとキーボードになります。</p>
              <p className="fine">Galaxy Z Fold7で動作を確認しています。</p>
            </article>
          </div>

          <div className="no-ai">
            <h3>AIを使わない日にも。</h3>
            <ul className="plain-list">
              <li>外出先で、あのファイルを確かめたい。自宅のMacを開いて、さっと確認できます。</li>
              <li>ソファから、デスクのMacを使いたい。iPadやスマホが、そのままMacの画面になります。</li>
              <li>書き出しやビルドの進み具合を、席を離れて見たい。</li>
            </ul>
          </div>
        </div>
      </section>

      {/* S12 対応デバイス */}
      <section className="section devices" aria-labelledby="devices-title">
        <div className="wrap">
          <h2 className="section-title center" id="devices-title">いつものデバイスが、<br className="sp" />Macへの入口に。</h2>
          <div className="device-grid">
            <article className="device is-host"><p className="role">操作されるMac</p><h3>MOTHERSHIP HOST</h3><p>macOS 14以降<br /><small>Appleシリコン搭載のMacで動作を確認</small></p></article>
            <article className="device"><p className="role">操作する側</p><h3>iPhone・iPad</h3><p>MOTHERSHIP<br /><small>対応するOSは、公開時にご案内します</small></p></article>
            <article className="device"><p className="role">操作する側</p><h3>Android</h3><p>MOTHERSHIP<br /><small>Android 13以降。折りたたみにも対応</small></p></article>
            <article className="device"><p className="role">操作する側</p><h3>別のMac</h3><p>MOTHERSHIP<br /><small>macOS 15以降</small></p></article>
          </div>
          <p className="note center">操作できるのはMacだけです。WindowsやLinuxのパソコンは操作できません。</p>
        </div>
      </section>

      {/* S13 使い方（2026-11-20 作り直し：3 つのステップを、続きものの動く図で見せる。14 秒で 1 周。細かい設定は書かず、ヘルプへのリンクにする） */}
      <section className="section how" id="how" aria-labelledby="how-title">
        {/* 図で使い回す絵（ロゴの印と、QR コードふうの模様。模様は本物の QR コードではない） */}
        <svg className="svg-defs" aria-hidden="true"><symbol id="hs-mark" viewBox="0 0 128 128"><path d="M60 28 22 86 49 80 60 91 60 75 48 70 60 54Z" fill="#fff"/><path d="M68 28 106 86 79 80 68 91 68 75 80 70 68 54Z" fill="#a8f8ff"/><path d="M64 86 72 98 64 105 56 98Z" fill="#fff"/></symbol><symbol id="hs-qr" viewBox="0 0 19 19"><path d="M0 0h7v1h-7zM8 0h2v1h-2zM12 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM8 1h1v1h-1zM10 1h1v1h-1zM12 1h1v1h-1zM18 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h1v1h-1zM10 2h1v1h-1zM12 2h1v1h-1zM14 2h3v1h-3zM18 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM8 3h3v1h-3zM12 3h1v1h-1zM14 3h3v1h-3zM18 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM8 4h1v1h-1zM10 4h1v1h-1zM12 4h1v1h-1zM14 4h3v1h-3zM18 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM12 5h1v1h-1zM18 5h1v1h-1zM0 6h7v1h-7zM9 6h1v1h-1zM12 6h7v1h-7zM8 7h1v1h-1zM10 7h1v1h-1zM0 8h3v1h-3zM4 8h1v1h-1zM7 8h1v1h-1zM9 8h3v1h-3zM13 8h2v1h-2zM16 8h2v1h-2zM1 9h1v1h-1zM6 9h1v1h-1zM8 9h2v1h-2zM11 9h1v1h-1zM13 9h1v1h-1zM18 9h1v1h-1zM3 10h1v1h-1zM8 10h1v1h-1zM13 10h2v1h-2zM16 10h1v1h-1zM18 10h1v1h-1zM8 11h2v1h-2zM11 11h3v1h-3zM15 11h2v1h-2zM0 12h7v1h-7zM10 12h3v1h-3zM15 12h4v1h-4zM0 13h1v1h-1zM6 13h1v1h-1zM10 13h4v1h-4zM0 14h1v1h-1zM2 14h3v1h-3zM6 14h1v1h-1zM9 14h1v1h-1zM14 14h3v1h-3zM18 14h1v1h-1zM0 15h1v1h-1zM2 15h3v1h-3zM6 15h1v1h-1zM8 15h10v1h-10zM0 16h1v1h-1zM2 16h3v1h-3zM6 16h1v1h-1zM9 16h5v1h-5zM18 16h1v1h-1zM0 17h1v1h-1zM6 17h1v1h-1zM8 17h3v1h-3zM12 17h2v1h-2zM16 17h1v1h-1zM18 17h1v1h-1zM0 18h7v1h-7zM12 18h3v1h-3zM18 18h1v1h-1z" fill="#14203a"/></symbol></svg>
        <div className="wrap">
          <div className="section-head center">
            <p className="kicker">使い方</p>
            <h2 className="section-title" id="how-title">はじめかたは、<br className="sp" />3ステップ。</h2>
            <p className="section-lead">家のWi-Fiなら、この3つで使いはじめられます。</p>
          </div>

          <ol className="how-steps">
            <li className="hs hs-1">
              <div className="hs-fig" role="img" aria-label="MacにMOTHERSHIP HOSTを入れると、メニューバーにアイコンが出る。続けて「画面収録」と「アクセシビリティ」の2つの許可をオンにする様子">
                <div className="hs-in" aria-hidden="true">
                  <div className="hs-lap">
                    <div className="hs-scr">
                      <div className="hs-mbar"><i></i><b></b><b></b><b></b><span className="hs-tray"><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span><u></u><u></u></div>
                      <span className="hs-app"><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span>
                      <div className="hs-perm"><p><span>画面収録</span><i className="hs-tg"></i></p><p><span>アクセシビリティ</span><i className="hs-tg"></i></p></div>
                      <svg className="hs-cur" viewBox="0 0 12 16"><path d="M1 1v12l3.2-2.8 2 4.6 2-.9-2-4.5H11z" fill="#14203a" stroke="#fff" strokeWidth="1" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="hs-base"></div>
                  </div>
                </div>
              </div>
              <div className="hs-head"><span className="hs-n"><b>1</b><i>✓</i></span><h3>Macに入れる</h3></div>
              <p>MOTHERSHIP HOSTを入れて、案内にそって2つの許可をオンにします。</p>
            </li>
            <li className="hs hs-2">
              <div className="hs-fig" role="img" aria-label="Macに表示したQRコードを、スマホのMOTHERSHIPで読み取って登録する様子">
                <div className="hs-in" aria-hidden="true">
                  <div className="hs-lap">
                    <div className="hs-scr">
                      <div className="hs-mbar"><i></i><b></b><b></b><b></b><span className="hs-tray"><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span><u></u><u></u></div>
                      <div className="hs-qrcard"><b>端末を追加</b><svg viewBox="0 0 19 19"><use href="#hs-qr"/></svg></div>
                    </div>
                    <div className="hs-base"></div>
                  </div>
                  <div className="hs-ph">
                    <div className="hs-cam">
                      <span className="hs-qrs"><svg viewBox="0 0 19 19"><use href="#hs-qr"/></svg></span>
                      <span className="hs-find"><i></i><i></i><i></i><i></i></span>
                      <span className="hs-scan"></span>
                      <span className="hs-okb">✓</span>
                      <em>QRコードを読み取る</em>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hs-head"><span className="hs-n"><b>2</b><i>✓</i></span><h3>QRコードを読む</h3></div>
              <p>デバイスにMOTHERSHIPを入れて、MacのQRコードを読み取ります。</p>
            </li>
            <li className="hs hs-3">
              <div className="hs-fig" role="img" aria-label="スマホに登録済みのMacが出て、「つなぐ」をタップすると、Macの画面がスマホに映る様子">
                <div className="hs-in" aria-hidden="true">
                  <div className="hs-lap">
                    <div className="hs-scr">
                      <div className="hs-mbar"><i></i><b></b><b></b><b></b><span className="hs-tray"><svg viewBox="0 0 128 128"><use href="#hs-mark"/></svg></span><u></u><u></u></div>
                      <span className="hs-w hs-w1"><b></b><i></i><i></i><i></i></span><span className="hs-w hs-w2"><b></b><em><i></i><i></i><i></i><i></i></em></span>
                    </div>
                    <div className="hs-base"></div>
                  </div>
                  <span className="hs-wifi"><i></i><i></i><i></i></span>
                  <div className="hs-ph">
                    <div className="hs-list">
                      <p>登録済みのMac</p>
                      <span className="hs-search"><i></i><i></i><i></i></span>
                      <div className="hs-row"><b>Mac mini</b><small>自宅のMac</small><em>つなぐ</em></div>
                    </div>
                    <div className="hs-desk"><span className="hs-w hs-w1"><b></b><i></i><i></i><i></i></span><span className="hs-w hs-w2"><b></b><em><i></i><i></i><i></i><i></i></em></span></div>
                  </div>
                </div>
              </div>
              <div className="hs-head"><span className="hs-n"><b>3</b><i>✓</i></span><h3>つなぐ</h3></div>
              <p>タップすると、Macの画面が手もとに。同じWi-Fiなら、Macは自動で見つかります。</p>
            </li>
          </ol>
          <p className="how-note">イメージです（実際の画面とは異なります）</p>
          <p className="how-more"><Link className="btn btn-ghost" href="/help/">くわしい手順は、ヘルプへ <span aria-hidden="true">→</span></Link></p>

          <aside className="how-prep" aria-labelledby="prep-title">
            <div className="how-prep-head">
              <h3 id="prep-title">出かける前に</h3>
              <p>外から使うときは、準備が少しあります。</p>
            </div>
            <ul className="prep-list">
              <li><Link href="/help/#outside"><b>外からつなぐ</b><span>Tailscaleを、Macとデバイスに。</span><i>くわしく <span aria-hidden="true">→</span></i></Link></li>
              <li><Link href="/help/#keep-awake"><b>Macを起こしておく</b><span>スリープさせない設定を、オンに。</span><i>くわしく <span aria-hidden="true">→</span></i></Link></li>
              <li><Link href="/help/#voice"><b>声で書く</b><span>Aqua VoiceとBlackHole 2chを、Macに。</span><i>くわしく <span aria-hidden="true">→</span></i></Link></li>
            </ul>
          </aside>
        </div>
      </section>

      {/* S14 料金 */}
      <section className="section pricing" id="pricing" aria-labelledby="pricing-title">
        <div className="wrap pricing-grid">
          <div>
            <p className="kicker">料金</p>
            <h2 className="section-title" id="pricing-title">まずは14日間、<br />ぜんぶ試せます。</h2>
            <p className="section-lead">アプリのダウンロードは無料です。はじめてMacにつないだ日から14日間、すべての機能を制限なしで使えます。気に入ったら、一度の購入でずっと。月額料金はありません。</p>
          </div>
          <div className="price-card">
            <p className="price-label">買い切り</p>
            <p className="price"><span>US$</span>19.99</p>
            <p className="fine">日本円の価格は、公開時にご案内します。</p>
            <ul className="ticks small">
              <li>一度の購入で、Macを3台まで使えます。</li>
              <li>購入は、MOTHERSHIPの中から。iPhone・iPadはApp Store、AndroidはGoogle Playの決済です。</li>
              <li>機種を変えても、「購入を復元」で引き継げます。</li>
            </ul>
            <p className="fine">試用期間が終わると、購入するまでデバイスから接続できなくなります。</p>
          </div>
        </div>
      </section>

      {/* S15 よくある質問（主役の読者が気にする順） */}
      <section className="section faq" id="faq" aria-labelledby="faq-title">
        <div className="wrap faq-wrap">
          <h2 className="section-title center" id="faq-title">よくある質問</h2>

          <h3 className="faq-group">AIと使い方</h3>
          <div className="faq-list">
            <details><summary>どのAIで使えますか？</summary><p>Macで動くAIなら、どれでも使えます。MOTHERSHIPは、Macの画面をそのまま映して動かすアプリです。ターミナルで動くAIも、エディターのAIも、ブラウザーのAIも、いつもの画面のまま使えます。AIの側の設定は要りません。MOTHERSHIPに、AIの機能は入っていません。</p></details>
            <details><summary>AIの作業が終わったら、知らせてくれますか？</summary><p>いいえ。MOTHERSHIPは、Macの画面を映して動かすアプリです。作業の終わりを知らせる機能はありません。気になったときに開いて、進み具合を見る使い方になります。</p></details>
            <details><summary>スマホの小さな画面でも、ターミナルの文字は読めますか？</summary><p>はい。デバイスと同じ形の専用モニターをMacに用意するので、文字が縮みません。もっと大きく見たいときは、ピンチで拡大できます。細かい文字が多いときは、画質の「文字優先」が向いています。</p></details>
            <details><summary>ほかのリモートデスクトップと、何がちがいますか？</summary><p>映し方がちがいます。MOTHERSHIPは、Macのモニターをそのまま映すのではなく、デバイスと同じ形の専用モニターをMacに用意します。だから、小さな画面でも文字が縮みません。文字の入力に声を使えること（Aqua Voiceに対応）と、買い切りであることも特長です。</p></details>
            <details><summary>どんな作業に向いていますか？</summary><p>AIに任せた作業の確認と次の指示、プログラミング、書類やブラウザでの作業、デザインの確認など、文字や画面をしっかり見る作業に向いています。動きの激しいゲームには向きません。</p></details>
            <details><summary>Windowsのパソコンも操作できますか？</summary><p>いいえ。操作できるのはMacだけです。操作する側は、iPhone・iPad・Android・Macに対応しています。</p></details>
          </div>

          <h3 className="faq-group">声で入力</h3>
          <div className="faq-list">
            <details><summary>声で入力するには、何が必要ですか？</summary><p>Macに、音声入力アプリ「Aqua Voice」（別の会社の製品です）と、無料の仮想オーディオ「BlackHole 2ch」を入れ、Aqua Voiceのマイクを「BlackHole 2ch」にしておきます。あとは、デバイスの🎤ボタンを押している間に話すだけです。</p></details>
            <details><summary>Aqua Voiceがなくても使えますか？</summary><p>はい。Aqua Voiceを使うのは、声で入力する機能だけです。画面を見る、指で動かす、キーボードで打つなど、ほかの機能はAqua Voiceなしで使えます。</p></details>
            <details><summary>声は、どこかに保存されますか？</summary><p>MOTHERSHIPは、声を保存しません。声はデバイスからMacへ直接送られ、Macの中でAqua Voiceに渡されます。Aqua Voiceでの声の扱いは、Aqua Voiceの説明をご確認ください。</p></details>
          </div>

          <h3 className="faq-group">外から使う・Macの状態</h3>
          <div className="faq-list">
            <details><summary>外出先からも使えますか？</summary><p>はい。MacとデバイスにTailscale（個人なら無料で使えるVPNサービス）を入れておくと、外出先からも接続できます。ルーターの設定を変える必要はありません。</p></details>
            <details><summary>出かけている間、Macはつけたままにするのですか？</summary><p>はい。Macがスリープすると、外からつなげません。MOTHERSHIP HOSTの「待機中もMacをスリープさせない」をオンにしておきます。ノート型のMacは、ふたを閉じるとスリープすることがあります。</p></details>
            <details><summary>Macがロックされているときは？</summary><p>Mac版のMOTHERSHIPでは、接続先のMacのパスワードを入力してロックを解除できます。</p></details>
            <details><summary>Macを再起動したあとは使えますか？</summary><p>Macにログインするまでは、MOTHERSHIP HOSTが動かないため接続できません。ログインしたあとは、自動で待ち受けをはじめます（「ログイン時に起動」をオンにした場合）。</p></details>
            <details><summary>通信量はどのくらいですか？</summary><p>画面の動きと回線の状態に合わせて、自動で調整します。画面が止まっている間は、ほとんど通信しません。</p></details>
            <details><summary>複数のデバイスから同時につなげますか？</summary><p>1台のMacにつなげるのは、一度に1台です。別のデバイスからつなぐと、そちらに切り替わります。</p></details>
          </div>

          <h3 className="faq-group">安全</h3>
          <div className="faq-list">
            <details><summary>画面や操作の内容は、どこかのサーバーを通りますか？</summary><p>MOTHERSHIPのサーバーは通りません。自宅では家のネットワークの中で、外出先ではTailscaleの暗号化されたネットワークを通して、Macとデバイスが直接やり取りします。</p></details>
            <details><summary>アカウントの登録は必要ですか？</summary><p>MOTHERSHIPには、アカウントの登録がありません。Macに表示したQRコードを読み取るだけで使いはじめられます。外出先から使う場合だけ、Tailscaleのアカウントが必要です。</p></details>
            <details><summary>Macにはどんな許可が必要ですか？</summary><p>「画面収録」（Macの画面を映すため）と「アクセシビリティ」（キーボードやマウスの操作を伝えるため）の2つです。MOTHERSHIP HOSTのメニューから、設定の画面を開けます。</p></details>
            <details><summary>デバイスをなくしたら？</summary><p>MOTHERSHIP HOSTのメニューにある「登録済みの端末」から、そのデバイスを削除してください。削除したデバイスからは接続できなくなります。</p></details>
          </div>

          <h3 className="faq-group">料金</h3>
          <div className="faq-list">
            <details><summary>月額料金はかかりますか？</summary><p>かかりません。14日間の試用のあとは、一度の購入でずっと使えます。</p></details>
            <details><summary>Macを2台持っています。2回買う必要がありますか？</summary><p>いいえ。一度の購入で、Macを3台まで使えます。</p></details>
            <details><summary>Macを買い替えたときや、4台目のMacで使うときは？</summary><p>デバイスの設定の「ライセンス」で、使わなくなったMacを外すと、別のMacに使えます。そのMacにつながずに外せるのは、90日に1回です。Macを手放す前に、MOTHERSHIP HOSTのメニューの「この Mac のライセンスを外す」で外しておくと確実です。</p></details>
          </div>
        </div>
      </section>

      {/* S16 ダウンロード */}
      <section className="section download" id="download" aria-labelledby="download-title">
        <div className="wrap">
          <div className="download-panel">
            <h2 className="section-title center" id="download-title"><span className="nb">Macに任せて、</span><span className="nb">出かけよう。</span></h2>
            <p className="section-lead center">14日間、すべての機能を無料で。まずは、操作したいMacにMOTHERSHIP HOSTを入れるところからはじめましょう。</p>
            <div className="download-grid">
              <div className="dl is-primary"><p className="dl-step">1. 操作されるMacに</p><h3>MOTHERSHIP HOST</h3><p>macOS 14以降</p><span className="pill pill-soft soon">近日公開</span></div>
              <div className="dl"><p className="dl-step">2. 手もとのデバイスに</p><h3>iPhone・iPad</h3><p>App Store</p><span className="pill pill-ghost soon">近日公開</span></div>
              <div className="dl"><p className="dl-step">2. 手もとのデバイスに</p><h3>Android</h3><p>Google Play</p><span className="pill pill-ghost soon">近日公開</span></div>
              <div className="dl"><p className="dl-step">2. 手もとのデバイスに</p><h3>別のMac</h3><p>macOS 15以降</p><span className="pill pill-ghost soon">近日公開</span></div>
            </div>
            <p className="fine center">最初に、操作されるMacへ「MOTHERSHIP HOST」を入れてください。そのあとで、手もとのデバイスに「MOTHERSHIP」を入れます。</p>
          </div>
        </div>
      </section>

      {/* 最新のお知らせ：タイトルだけを 3 件まで（1 件なら 1 件）。0 件のときは、この節ごと出さない */}
      {latestPosts.length > 0 && (
        <section className="section latest-news" aria-labelledby="latest-news-title">
          <div className="wrap latest-news-inner">
            <div className="latest-news-head">
              <p className="kicker">NEWS</p>
              <h2 id="latest-news-title">お知らせ</h2>
            </div>
            <ul className="latest-news-list">
              {latestPosts.map((post) => (
                <li key={post.databaseId}><Link href={`/news/${post.databaseId}/`}>{post.title}</Link></li>
              ))}
            </ul>
            <Link className="btn btn-ghost latest-news-more" href="/news/">お知らせ一覧へ <span aria-hidden="true">→</span></Link>
          </div>
        </section>
      )}
    </main>
  );
}
