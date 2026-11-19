import { HeroPlayer } from "@/components/HeroPlayer";

// トップページ（LP）。mock/design/index.html の <main> をそのまま JSX にしたもの
export default function Home() {
  return (
    <main id="main">
  
      {/* S1 HERO：動画が主役 */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-bg" aria-hidden="true"></div>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="pill pill-glass hero-label">Macを、もっと自由に。</p>
            <h1 id="hero-title">離れていても、<br /><span className="grad-text">Macはそばに。</span></h1>
            <p className="hero-lead">スマホから、いつものMacへ。<br />作業の続きに、どこからでも。</p>
            <a className="hero-voice" href="#voice">
              {/* eslint-disable-next-line @next/next/no-img-element */}
  <img className="hero-voice-icon" src="/media/aqua-voice-icon.png" alt="Aqua Voiceのアイコン" width={56} height={56} />
              <span className="hero-voice-text"><span className="hero-voice-kicker">声で入力</span><b>Aqua Voiceにも対応</b><span className="hero-voice-sub"><span className="nb">話すだけで文字が入るから、</span><span className="nb"><mark>キーボードいらず。</mark></span></span></span>
              <span className="hero-voice-arrow" aria-hidden="true">→</span>
            </a>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#download">ダウンロード <span aria-hidden="true">→</span></a>
              <a className="btn btn-ghost" href="#features">特長を見る</a>
            </div>
            <p className="hero-note">14日間、すべての機能を無料で。買い切り・月額なし。</p>
            <p className="hero-platforms">iPhone <i>·</i> iPad <i>·</i> Android <i>·</i> Mac</p>
          </div>
  
          <div className="hero-stage">
            <div className="stage-glow" aria-hidden="true"></div>
            <HeroPlayer />
            <div className="stage-chip chip-a" aria-hidden="true"><b>60</b>fps まで</div>
            <div className="stage-chip chip-b" aria-hidden="true"><span className="dot"></span>暗号化して直接つなぐ</div>
          </div>
        </div>
        <p className="wrap hero-foot">Macの画面を、スマホ・タブレット・別のMacへ。</p>
      </section>
  
      {/* S2 3つの約束 */}
      <section className="section promise" aria-labelledby="promise-title">
        <div className="wrap">
          <h2 className="section-title center" id="promise-title">Mothershipが大切にしている、<br className="sp" />3つのこと。</h2>
          <div className="promise-grid">
            <article className="card">
              <span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="4" width={18} height={13} rx="2.5"/><path d="M8 21h8M12 17v4"/></svg></span>
              <h3>くっきり見える</h3>
              <p>デバイスごとに、ぴったりの大きさの画面をMacに用意。小さな画面でも、文字がつぶれません。</p>
            </article>
            <article className="card">
              <span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.7-2.3L4 14.5a1.6 1.6 0 0 1 2.5-2L9 14.5"/></svg></span>
              <h3>思いどおりに動かせる</h3>
              <p>タッチ、トラックパッド、Mac配列のキーボード。日本語の入力も、いつもの感覚で。</p>
            </article>
            <article className="card">
              <span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="10.5" width={14} height={10} rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg></span>
              <h3>安心してつなげる</h3>
              <p>通信は暗号化して、Macとデバイスの間で直接。自宅のMacの画面は、ワンタップで隠せます。</p>
            </article>
          </div>
        </div>
      </section>
  
      {/* S3 こんなときに */}
      <section className="section scenes" aria-labelledby="scenes-title">
        <div className="wrap">
          <h2 className="section-title" id="scenes-title">こんなとき、<br />Macがそばにあったら。</h2>
          <ol className="scene-list">
            <li><span className="num">01</span><h3>外出先で、あのファイルを確かめたい</h3><p>カフェでも、移動中でも。自宅のMacを開いて、資料をさっと確認できます。</p></li>
            <li><span className="num">02</span><h3>ソファから、デスクのMacを使いたい</h3><p>Mac miniやiMacの前に座らなくても大丈夫。iPadやスマホが、そのままMacの画面になります。</p></li>
            <li><span className="num">03</span><h3>Macに任せた作業の様子を見たい</h3><p>書き出し、ビルド、AIに任せた長い作業。席を離れていても、進み具合を見て、次の指示を出せます。</p></li>
            <li><span className="num">04</span><h3>MacBookから、もう1台のMacへ</h3><p>持ち歩くのは軽いMacBookだけ。パワーが要る作業は、家のMacに任せましょう。</p></li>
          </ol>
        </div>
      </section>
  
      {/* S4 特長 */}
      <section className="section features" id="features" aria-labelledby="features-title">
        <div className="wrap">
          <div className="section-head center">
            <p className="kicker">特長</p>
            <h2 className="section-title" id="features-title">映すだけじゃない。<br className="sp" />ちゃんと使える。</h2>
            <p className="section-lead">Mothershipは、離れた場所からMacを「見る」ためではなく、「使う」ために作りました。小さな画面で文字を読み、日本語を打ち、ファイルを動かす。その一つひとつを、Macに合わせて作り込んでいます。</p>
          </div>
  
          {/* F1 */}
          <article className="feature-lead">
            <div className="feature-lead-copy">
              <p className="pill pill-brand feature-tag">いちばんの違い</p>
              <h3>小さな画面でも、<br />文字はくっきり。</h3>
              <p>27インチのモニターをそのままスマホに映すと、文字は小さすぎて読めません。Mothershipは、つないでいる間だけ、あなたのデバイスと同じ大きさ・同じ形の専用モニターをMacに追加します。画面いっぱいに、点と点がぴったり合った状態で映るので、小さな文字までくっきり読めます。</p>
              <ul className="ticks">
                <li>デバイスを縦にすれば縦長の画面に、横にすれば横長の画面に。向きに合わせて切り替わります。</li>
                <li>画面の動きが止まると、すぐに高画質で送り直すので、文字がにじみません。</li>
                <li>ピンチで拡大すると、見ている部分を高い解像度で取り込み直します。</li>
                <li>いつも使っているモニターを、そのまま映すこともできます。</li>
              </ul>
              <p className="fine">専用モニターは、接続を切ると自動で消えます。</p>
            </div>
            <div className="fit-diagram" role="img" aria-label="大きなモニターをそのまま縮めると文字が読めないが、デバイスと同じ形の専用モニターなら文字が大きく読める、という比較の図">
              <div className="fit-col">
                <div className="fit-phone"><div className="fit-screen fit-shrunk"><span></span><span></span><span></span><span></span><span></span><span></span></div></div>
                <p><b>そのまま映すと</b>大きな画面が縮んで、文字が読めない</p>
              </div>
              <div className="fit-arrow" aria-hidden="true">→</div>
              <div className="fit-col">
                <div className="fit-phone is-good"><div className="fit-screen fit-native"><span></span><span></span><span></span><span></span></div></div>
                <p><b>Mothershipなら</b>デバイスの形に合わせた画面で、文字が大きい</p>
              </div>
            </div>
          </article>
  
          {/* F2〜F6 */}
          <div className="feature-grid">
            <article className="feature">
              <h3>指でも、キーボードでも、思いどおり。</h3>
              <p>触った場所がそのままクリックになる「直接タッチ」。画面全体をトラックパッドとして使うモード。⌘や⌥がそろったMac配列のキーボード。使い方に合わせて選べます。</p>
              <ul className="ticks small">
                <li>タップでクリック、長押しで右クリック、2本指でスクロール。</li>
                <li>3本指で、Mission Controlやデスクトップの切り替え。</li>
                <li>よく使う操作は、ショートカットバーからワンタップで。並びは自分で変えられます。</li>
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
              <p>デバイスとMacの間の壁を、できるだけなくしました。</p>
              <ul className="ticks small">
                <li>片方でコピーして、もう片方でペースト。文字も画像も共有できます。</li>
                <li>ファイルは、デバイスからMacへ、Macからデバイスへ。iPadなら、Macの画面の上にドラッグ＆ドロップするだけ。</li>
                <li>Macの音を、手元のデバイスで聞けます（設定でオンにします）。</li>
              </ul>
            </article>
  
            <article className="feature">
              <h3>見られたくない画面は、見せない。</h3>
              <p>外出先からつないでいる間、自宅のMacの画面は、そばにいる人から見える状態になります。Mothershipは、Macの画面を黒く隠したまま、あなたのデバイスにだけ画面を映せます。</p>
              <ul className="ticks small">
                <li>外出先からつないだときは、自動で画面を隠します。隠していた場合、切断するとMacをロックします。</li>
                <li>通信は暗号化（TLS 1.3など）。映像と操作は、Macとデバイスの間で直接。Mothershipのサーバーは通りません。</li>
                <li>登録はQRコードで。登録したデバイスだけが接続できます。</li>
                <li>アプリを開くときに、Face ID・Touch ID・指紋でロックをかけられます。</li>
                <li>ルーターの設定（ポートの開放）は要りません。</li>
              </ul>
            </article>
  
            <article className="feature feature-wide">
              <div>
                <h3>家でも、外でも。切れても、すぐ戻る。</h3>
                <p>自宅のWi-Fiでは、登録したMacを自動で見つけてつながります。外出先からは、Tailscale（個人なら無料で使えるVPNサービス）を通して接続。Wi-Fiからモバイル回線に切り替わっても、自動でつなぎ直します。</p>
                <p className="fine">外出先から使うには、MacとデバイスにTailscaleのアプリを入れ、同じアカウントでログインしておく必要があります。</p>
              </div>
              <ul className="ticks small">
                <li>画質は3種類：バランス（最大60fps）、文字優先、滑らかさ優先。</li>
                <li>通信量は、回線に合わせて自動で調整します。</li>
                <li>Macは何台でも登録して、切り替えて使えます。</li>
                <li>折りたたみスマホなら、半分に折って机に置くと、上がMacの画面、下がトラックパッドとキーボードに（Galaxy Z Fold7で動作を確認）。</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
  
      {/* 声で入力（Aqua Voice 連携） */}
      <section className="section voice" id="voice" aria-labelledby="voice-title">
        <div className="wrap voice-grid">
          <div className="voice-copy">
            <p className="kicker light">声で入力</p>
            <h2 className="section-title" id="voice-title"><span className="nb">話すだけで、</span><span className="nb">文字になる。</span><br /><span className="nb">キーボードは、</span><span className="nb">しまったままで。</span></h2>
            <p className="section-lead">小さな画面で長い文章を打つのは、たいへんです。Mothershipは、Macの音声入力アプリ「Aqua Voice」とつながります。手元のデバイスに話しかけると、その声がMacに届き、開いているアプリに文字が入ります。メールの返信も、メモも、AIへの指示も、声だけで。</p>
            <ol className="voice-steps">
              <li><b>押す</b><span>🎤ボタンを押している間だけ、声を送ります。</span></li>
              <li><b>話す</b><span>デバイスのマイクに向かって、ふつうに話します。</span></li>
              <li><b>離す</b><span>MacのAqua Voiceが文字にして、カーソルの位置に入力します。</span></li>
            </ol>
            <ul className="ticks small on-dark">
              <li>🎤ボタンは、好きな場所に動かせます。隣には、削除（⌫）と改行（⏎）のボタン。</li>
              <li>言い直したいときは、押したまま指を外へ滑らせて離すと取り消せます。</li>
              <li>外付けキーボードの好きなキーを、「話すキー」にもできます。</li>
              <li>iPhone・iPad・Androidで使えます。</li>
            </ul>
          </div>
  
          <div className="voice-visual" aria-hidden="true">
            <div className="voice-card">
              <div className="voice-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
              <p className="voice-said">「あしたの打ち合わせは、15時からに変更でお願いします。」</p>
              <div className="voice-arrow">↓</div>
              <p className="voice-typed">あしたの打ち合わせは、15時からに変更でお願いします。<span className="caret"></span></p>
              <div className="voice-buttons"><span className="vb vb-mic">🎤</span><span className="vb">⌫</span><span className="vb">⏎</span></div>
            </div>
            <p className="voice-visual-note">イメージ図です</p>
          </div>
  
          <aside className="voice-need">
            <h3>使うために必要なもの</h3>
            <p>Aqua Voiceは、Mothershipとは別の会社が提供している音声入力アプリです（Mothershipには含まれません）。Macに「Aqua Voice」と、無料の仮想オーディオ「BlackHole 2ch」を入れ、Aqua Voiceのマイクを「BlackHole 2ch」にしておきます。文字にする精度は、Aqua Voiceによります。</p>
          </aside>
        </div>
      </section>
  
      {/* S5 対応デバイス */}
      <section className="section devices" aria-labelledby="devices-title">
        <div className="wrap">
          <h2 className="section-title center" id="devices-title">いつものデバイスが、<br className="sp" />Macへの入口に。</h2>
          <div className="device-grid">
            <article className="device is-host"><p className="role">操作されるMac</p><h3>Mothership Host</h3><p>macOS 14以降<br /><small>Appleシリコン搭載のMacで動作を確認</small></p></article>
            <article className="device"><p className="role">操作する側</p><h3>iPhone・iPad</h3><p>Mothership<br /><small>対応するOSは、公開時にご案内します</small></p></article>
            <article className="device"><p className="role">操作する側</p><h3>Android</h3><p>Mothership<br /><small>Android 13以降。折りたたみにも対応</small></p></article>
            <article className="device"><p className="role">操作する側</p><h3>別のMac</h3><p>Mothership<br /><small>macOS 15以降</small></p></article>
          </div>
          <p className="note center">操作できるのはMacだけです。WindowsやLinuxのパソコンは操作できません。</p>
        </div>
      </section>
  
      {/* S6 使い方 */}
      <section className="section how" id="how" aria-labelledby="how-title">
        <div className="wrap how-grid">
          <div>
            <p className="kicker">使い方</p>
            <h2 className="section-title" id="how-title">はじめかたは、<br />3ステップ。</h2>
            <ol className="steps">
              <li><span className="step-n">1</span><div><h3>MacにMothership Hostを入れる</h3><p>操作したいMacに入れると、メニューバーに小さなアイコンが出ます。案内にそって「画面収録」と「アクセシビリティ」を許可してください。</p></div></li>
              <li><span className="step-n">2</span><div><h3>デバイスでQRコードを読む</h3><p>iPhone・iPad・AndroidにMothershipを入れ、Macに表示したQRコードを読み取ります。アカウントの登録は要りません。</p></div></li>
              <li><span className="step-n">3</span><div><h3>つなぐ</h3><p>同じWi-Fiにいれば、Macが自動で見つかります。あとはタップするだけで、Macの画面が手元に。</p></div></li>
            </ol>
            <aside className="callout">
              <h3>外出先から使うには</h3>
              <p>MacとデバイスにTailscaleを入れて、同じアカウントでログインしておきます。これだけで、外からでも同じようにつながります。ルーターの設定は要りません。Macがスリープするとつながらないので、Mothership Hostの「待機中もMacをスリープさせない」をオンにしておくと安心です。</p>
            </aside>
          </div>
          <figure className="phone how-phone">
            <div className="phone-screen">{/* eslint-disable-next-line @next/next/no-img-element */}
  <img src="/images/app-iphone-connect-portrait.png" alt="Mothershipの最初の画面。Macを登録する手順が表示されている" loading="lazy" width={1206} height={2622} /></div>
            <figcaption>シミュレーターで撮った画面です。実機では、QRコードを読み取るボタンが表示されます。</figcaption>
          </figure>
        </div>
      </section>
  
      {/* S7 料金 */}
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
              <li>一度の購入で、お持ちのMacを何台でも使えます。</li>
              <li>購入は、iPhone・iPadのMothershipの中から（App Storeの決済）。</li>
              <li>機種を変えても、「購入を復元」で引き継げます。</li>
            </ul>
            <p className="fine">試用期間が終わると、購入するまでデバイスから接続できなくなります。</p>
          </div>
        </div>
      </section>
  
      {/* S8 よくある質問 */}
      <section className="section faq" id="faq" aria-labelledby="faq-title">
        <div className="wrap faq-wrap">
          <h2 className="section-title center" id="faq-title">よくある質問</h2>
          <div className="faq-list">
            <details><summary>Windowsのパソコンも操作できますか？</summary><p>いいえ。操作できるのはMacだけです。操作する側は、iPhone・iPad・Android・Macに対応しています。</p></details>
            <details><summary>外出先からも使えますか？</summary><p>はい。MacとデバイスにTailscale（個人なら無料で使えるVPNサービス）を入れておくと、外出先からも接続できます。ルーターの設定を変える必要はありません。</p></details>
            <details><summary>月額料金はかかりますか？</summary><p>かかりません。14日間の試用のあとは、一度の購入でずっと使えます。</p></details>
            <details><summary>Macを2台持っています。2回買う必要がありますか？</summary><p>いいえ。一度の購入で、お持ちのMacを何台でも使えます。</p></details>
            <details><summary>画面や操作の内容は、どこかのサーバーを通りますか？</summary><p>Mothershipのサーバーは通りません。自宅では家のネットワークの中で、外出先ではTailscaleの暗号化されたネットワークを通して、Macとデバイスが直接やり取りします。</p></details>
            <details><summary>アカウントの登録は必要ですか？</summary><p>Mothershipには、アカウントの登録がありません。Macに表示したQRコードを読み取るだけで使いはじめられます。外出先から使う場合だけ、Tailscaleのアカウントが必要です。</p></details>
            <details><summary>声で入力するには、何が必要ですか？</summary><p>Macに、音声入力アプリ「Aqua Voice」（別の会社の製品です）と、無料の仮想オーディオ「BlackHole 2ch」を入れ、Aqua Voiceのマイクを「BlackHole 2ch」にしておきます。あとは、デバイスの🎤ボタンを押している間に話すだけです。</p></details>
            <details><summary>声は、どこかに保存されますか？</summary><p>Mothershipは、声を保存しません。声はデバイスからMacへ直接送られ、Macの中でAqua Voiceに渡されます。Aqua Voiceでの声の扱いは、Aqua Voiceの説明をご確認ください。</p></details>
            <details><summary>Macがスリープしているときは？</summary><p>スリープ中は接続できません。Mothership Hostの「待機中もMacをスリープさせない」をオンにしてください。ノート型のMacは、ふたを閉じるとスリープすることがあります。</p></details>
            <details><summary>Macを再起動したあとは使えますか？</summary><p>Macにログインするまでは、Mothership Hostが動かないため接続できません。ログインしたあとは、自動で待ち受けをはじめます（「ログイン時に起動」をオンにした場合）。</p></details>
            <details><summary>複数のデバイスから同時につなげますか？</summary><p>1台のMacにつなげるのは、一度に1台です。別のデバイスからつなぐと、そちらに切り替わります。</p></details>
            <details><summary>どんな作業に向いていますか？</summary><p>書類やブラウザでの作業、プログラミング、デザインの確認など、文字や画面をしっかり見る作業に向いています。動きの激しいゲームには向きません。</p></details>
            <details><summary>通信量はどのくらいですか？</summary><p>画面の動きと回線の状態に合わせて、自動で調整します。画面が止まっている間は、ほとんど通信しません。</p></details>
            <details><summary>Macにはどんな許可が必要ですか？</summary><p>「画面収録」（Macの画面を映すため）と「アクセシビリティ」（キーボードやマウスの操作を伝えるため）の2つです。Mothership Hostのメニューから、設定の画面を開けます。</p></details>
            <details><summary>デバイスをなくしたら？</summary><p>Mothership Hostのメニューにある「登録済みの端末」から、そのデバイスを削除してください。削除したデバイスからは接続できなくなります。</p></details>
          </div>
        </div>
      </section>
  
      {/* S9 ダウンロード */}
      <section className="section download" id="download" aria-labelledby="download-title">
        <div className="wrap">
          <div className="download-panel">
            <h2 className="section-title center" id="download-title"><span className="nb">今日から、</span><span className="nb">Macはそばに。</span></h2>
            <p className="section-lead center">14日間、すべての機能を無料で。まずは、操作したいMacにMothership Hostを入れるところからはじめましょう。</p>
            <div className="download-grid">
              <div className="dl is-primary"><p className="dl-step">1. 操作されるMacに</p><h3>Mothership Host</h3><p>macOS 14以降</p><span className="pill pill-soft soon">近日公開</span></div>
              <div className="dl"><p className="dl-step">2. 手元のデバイスに</p><h3>iPhone・iPad</h3><p>App Store</p><span className="pill pill-ghost soon">近日公開</span></div>
              <div className="dl"><p className="dl-step">2. 手元のデバイスに</p><h3>Android</h3><p>Google Play</p><span className="pill pill-ghost soon">近日公開</span></div>
              <div className="dl"><p className="dl-step">2. 手元のデバイスに</p><h3>別のMac</h3><p>macOS 15以降</p><span className="pill pill-ghost soon">近日公開</span></div>
            </div>
            <p className="fine center">最初に、操作されるMacへ「Mothership Host」を入れてください。そのあとで、手元のデバイスに「Mothership」を入れます。</p>
          </div>
        </div>
      </section>
    </main>  );
}
