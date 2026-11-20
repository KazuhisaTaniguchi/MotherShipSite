import type { Metadata } from "next";
import Link from "next/link";

// プライバシーポリシー。mock/design/privacy-policy.html の <main> を JSX にしたもの（スタイルは src/styles/legal.css）
// WordPress にも同じスラッグの固定ページ（中身は空）があるが、表示はこのファイルの内容を使う
// （src/app/[...slug]/page.tsx は、このスラッグを書き出さない）
export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "Mothership（Mothership Host と、iPhone・iPad・Android・Mac の Mothership）と、このウェブサイトのプライバシーポリシーです。画面や操作はMothershipのサーバーを通らず、アカウントの登録もありません。",
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPolicy() {
  return (
    <main id="main">
      <section className="legal-hero" aria-labelledby="legal-title">
        <div className="legal-hero-bg" aria-hidden="true"></div>
        <div className="wrap">
          <p className="pill pill-glass">プライバシーポリシー</p>
          <h1 id="legal-title">Mothership プライバシーポリシー</h1>
          <p className="legal-hero-lead">あなたのMacの画面は、あなたのデバイスにだけ。<br />Mothershipが、どんな情報を、どう扱うかをまとめました。</p>
          <dl className="legal-dates">
            <div><dt>制定日</dt><dd><span className="tbd">【未確定：公開日】</span></dd></div>
            <div><dt>最終更新日</dt><dd><span className="tbd">【未確定：公開日】</span></dd></div>
          </dl>
        </div>
      </section>
      
      <div className="wrap legal-layout">
        <nav className="legal-toc" aria-label="目次">
          <p className="legal-toc-title">目次</p>
          <ol>
            <li><a href="#pp-1"><span className="no">1.</span>基本の考え方</a></li>
            <li><a href="#pp-2"><span className="no">2.</span>このポリシーの対象</a></li>
            <li><a href="#pp-3"><span className="no">3.</span>アプリで扱う情報</a></li>
            <li><a href="#pp-4"><span className="no">4.</span>アプリが求める許可</a></li>
            <li><a href="#pp-5"><span className="no">5.</span>購入の情報</a></li>
            <li><a href="#pp-6"><span className="no">6.</span>ウェブサイトとお問い合わせ</a></li>
            <li><a href="#pp-7"><span className="no">7.</span>情報を使う目的</a></li>
            <li><a href="#pp-8"><span className="no">8.</span>ほかの人への提供</a></li>
            <li><a href="#pp-9"><span className="no">9.</span>ほかの会社のサービス</a></li>
            <li><a href="#pp-10"><span className="no">10.</span>安全のための取り組み</a></li>
            <li><a href="#pp-11"><span className="no">11.</span>保存する期間と削除</a></li>
            <li><a href="#pp-12"><span className="no">12.</span>開示・訂正・削除のご請求</a></li>
            <li><a href="#pp-13"><span className="no">13.</span>お子さまの利用</a></li>
            <li><a href="#pp-14"><span className="no">14.</span>このポリシーの変更</a></li>
            <li><a href="#pp-15"><span className="no">15.</span>お問い合わせ窓口</a></li>
          </ol>
        </nav>
      
        <article className="legal">
          <p className="legal-intro"><span className="tbd">【未確定：運営者の名前】</span>（以下「運営者」）は、リモートデスクトップアプリ「Mothership」と、ウェブサイト「mothershipremote.com」で扱う情報について、個人情報の保護に関する法律などの法令にしたがい、このプライバシーポリシー（以下「本ポリシー」）のとおり取り扱います。</p>
      
          <aside className="legal-summary" aria-labelledby="summary-title">
            <h2 id="summary-title">かんたんにまとめると</h2>
            <ul className="ticks small">
              <li>画面・操作・クリップボード・ファイル・音・声は、Macとデバイスの間で暗号化して直接やり取りします。<b>Mothershipのサーバーは通りません。</b>運営者は、その中身を受け取りません。</li>
              <li><b>アカウントの登録はありません。</b>名前やメールアドレスを、アプリに入力する必要はありません。</li>
              <li>アプリには、<b>利用状況の分析や広告のための仕組みを入れていません。</b></li>
              <li>代金の支払いは、App Store・Google Playが行います。運営者は、クレジットカードなどの情報を受け取りません。</li>
              <li>運営者が受け取るのは、お問い合わせのときにお寄せいただいた内容だけです。お返事のために使います。</li>
            </ul>
            <p className="fine">このまとめは、読みやすくするためのものです。正式な内容は、以下の各項目のとおりです。</p>
          </aside>
      
          <section className="article" id="pp-1" aria-labelledby="pp-1-title">
            <h2 id="pp-1-title"><span className="no">1.</span>基本の考え方</h2>
            <p>Mothershipは、離れた場所から、自分のMacを使うためのアプリです。Macの画面には、仕事の書類やメール、写真など、大切な情報が映ります。そのためMothershipは、<b>運営者が利用者の情報を集めなくても動く</b>ように作っています。必要な情報は、できるだけ利用者のMacとデバイスの中だけで扱います。</p>
          </section>
      
          <section className="article" id="pp-2" aria-labelledby="pp-2-title">
            <h2 id="pp-2-title"><span className="no">2.</span>このポリシーの対象</h2>
            <p>本ポリシーは、次のものに適用されます。</p>
            <ol className="items">
              <li>操作されるMacに入れる「Mothership Host」</li>
              <li>操作する側のiPhone・iPad・Android・Macに入れる「Mothership」</li>
              <li>ウェブサイト「mothershipremote.com」と、そのお問い合わせフォーム</li>
            </ol>
            <p>以下、1と2をまとめて「本アプリ」と呼びます。本アプリと組み合わせて使う、ほかの会社のサービスの情報の扱いは、それぞれの会社の定めによります（9.）。</p>
          </section>
      
          <section className="article" id="pp-3" aria-labelledby="pp-3-title">
            <h2 id="pp-3-title"><span className="no">3.</span>アプリで扱う情報</h2>
      
            <h3>Macとデバイスの間でやり取りする情報</h3>
            <p>画面の映像、キーボード・マウス・タッチの操作、クリップボード（文字と画像）、ファイル、Macの音、声で入力するときの声は、つないでいる間だけ、Macとデバイスの間で直接やり取りします。</p>
            <ul className="ticks small">
              <li>通信は暗号化します（TLS 1.3など）。自宅では家のネットワークの中で、外出先ではTailscaleの暗号化されたネットワークを通して、つながります。</li>
              <li>運営者のサーバーや、通信を中継するサーバーは使いません。<b>運営者は、これらの中身を受け取りません。</b></li>
              <li>入力した文字、クリップボードの中身、パスワードを、本アプリの記録（ログ）に残しません。</li>
              <li>声は保存しません。声はデバイスからMacへ送られ、Macの中で音声入力アプリ（Aqua Voice）に渡されます。</li>
              <li>受け取ったファイルは、受け取った側の端末の「ダウンロード」などのフォルダーに保存されます。</li>
            </ul>
      
            <h3>端末の中に保存する情報</h3>
            <p>本アプリは、動くために必要な次の情報を、<b>利用者のMacとデバイスの中にだけ</b>保存します。運営者には送りません。</p>
            <ul className="ticks small">
              <li>登録したMacの名前と接続先のアドレス、通信を確かめるための証明書の情報</li>
              <li>デバイスごとの鍵。デバイスの安全な領域（Secure Enclave、Android Keystoreなど）に保存し、外に取り出せません</li>
              <li>Mothership Hostに登録したデバイスの一覧（デバイスの名前と、確かめるための公開鍵）</li>
              <li>画質・表示・キーボードなどの設定</li>
              <li>試用期間の始まりの時刻と、購入済みかどうかの印（Mothership Host）。試用期間をやり直せないよう、アプリを削除しても、Macのキーチェーンなどに残ることがあります</li>
            </ul>
      
            <h3>運営者に送られる情報</h3>
            <p>本アプリには、アカウントの登録、利用状況の分析、広告、クラッシュの報告のための仕組みを入れていません。<b>本アプリから運営者に、情報が送られることはありません。</b></p>
          </section>
      
          <section className="article" id="pp-4" aria-labelledby="pp-4-title">
            <h2 id="pp-4-title"><span className="no">4.</span>アプリが求める許可</h2>
            <p>本アプリは、機能を使うために、OSの次の許可を求めることがあります。許可は、いつでもOSの設定から取り消せます（取り消すと、その機能が使えなくなります）。</p>
            <div className="legal-table-wrap">
              <table className="legal-table">
                <thead><tr><th scope="col">許可</th><th scope="col">求める端末</th><th scope="col">使い道</th></tr></thead>
                <tbody>
                  <tr><th scope="row">画面収録</th><td data-label="求める端末">操作されるMac</td><td data-label="使い道">Macの画面と音を、デバイスに映すため</td></tr>
                  <tr><th scope="row">アクセシビリティ</th><td data-label="求める端末">操作されるMac、操作する側のMac</td><td data-label="使い道">キーボードやマウスの操作をMacに伝えるため。操作する側のMacでは、全画面のときにショートカットを取り込むため</td></tr>
                  <tr><th scope="row">ローカルネットワーク</th><td data-label="求める端末">すべて</td><td data-label="使い道">自宅のWi-Fiで、登録したMacを見つけてつなぐため</td></tr>
                  <tr><th scope="row">カメラ</th><td data-label="求める端末">iPhone・iPad</td><td data-label="使い道">Macに表示したQRコードを読み取って、登録するため。映像は保存しません（Androidでは、Googleのコードスキャナーがカメラを使います。9.）</td></tr>
                  <tr><th scope="row">マイク</th><td data-label="求める端末">操作する側</td><td data-label="使い道">声で入力する機能を使うときだけ。🎤ボタン（またはキー）を押している間の声を、Macに送るため</td></tr>
                  <tr><th scope="row">通知</th><td data-label="求める端末">すべて</td><td data-label="使い道">接続と切断、ファイルの受け取り、試用期間などをお知らせするため</td></tr>
                  <tr><th scope="row">Face ID・Touch ID・指紋</th><td data-label="求める端末">操作する側</td><td data-label="使い道">アプリを開くときのロックのため。確認はOSが行い、本アプリは顔や指紋の情報を受け取りません</td></tr>
                </tbody>
              </table>
            </div>
            <p>iPhone・iPadでは、デバイスのクリップボードを読むときに、OSが許可を求めることがあります。写真やファイルを送るときは、利用者が選んだものだけを読み込みます。</p>
          </section>
      
          <section className="article" id="pp-5" aria-labelledby="pp-5-title">
            <h2 id="pp-5-title"><span className="no">5.</span>購入の情報</h2>
            <ol className="clauses">
              <li>ライセンスの購入と代金の支払いは、App Store・Google Playが行います。運営者は、利用者の名前、住所、クレジットカードなどの支払いの情報を受け取りません。</li>
              <li>購入したあと、ストアが署名した「購入の証明」を、デバイスからホストのMacに送り、<b>Macの中で</b>確かめます。確かめるために、運営者のサーバーやインターネットは使いません。</li>
              <li>Mothership Hostは、購入済みであることの印と、取引の番号を変換した値（ハッシュ）だけを保存します。個人を特定できる情報は保存しません。</li>
              <li>ストアでの購入の情報の扱いは、Apple・Googleのプライバシーポリシーによります。</li>
            </ol>
          </section>
      
          <section className="article" id="pp-6" aria-labelledby="pp-6-title">
            <h2 id="pp-6-title"><span className="no">6.</span>ウェブサイトとお問い合わせ</h2>
      
            <h3>お問い合わせのときにいただく情報</h3>
            <p>お問い合わせフォームでは、次の情報をお預かりします。</p>
            <ul className="ticks small">
              <li>お名前、メールアドレス（必須）</li>
              <li>お問い合わせの種類、件名、内容（必須）</li>
              <li>お使いのデバイス、MacのmacOSのバージョン、アプリのバージョン（任意）</li>
            <li>添付ファイル（任意。JPEG・PNG・PDF。1つ5MBまで、3つまで）</li>
            </ul>
            <p>いただいた内容は、メールとして運営者に届きます。また、受け付けたことをお知らせする確認のメールを、ご入力のメールアドレスにお送りします。パスワードなど、ログインや登録に使う情報は、お問い合わせに書かないでください。</p>

          <h3>添付ファイルについて</h3>
          <p>画面の写真（スクリーンショット）などを添付していただけます。添付ファイルは、お問い合わせのメールに付いて運営者に届きます。ウェブサイトのサーバーには、メールを送るあいだだけ一時的に置き、送ったあとに削除します。</p>
          <p>パスワード、QRコード、ほかの方のお名前やメールアドレスなどが写った画像は、送らないでください。写ってしまう場合は、その部分を隠してから添付してください。添付ファイルは、お問い合わせへのお返事と、不具合を調べるためにだけ使います。</p>
      
            <h3>アクセスの記録</h3>
            <p>ウェブサイトを置いているサーバー（エックスサーバー）は、ほかのウェブサイトと同じく、アクセスしたときのIPアドレス、ブラウザーの種類、日時などを、アクセスの記録として残します。運営者は、これを、ウェブサイトを安全に動かすためと、不正なアクセスを調べるためにだけ使います。</p>
      
            <h3>クッキーとアクセス解析</h3>
            <p>現在、ウェブサイトでは、アクセス解析のツールや、広告のためのクッキーを使っていません。今後使う場合は、本ポリシーを改定してお知らせします。</p>
          </section>
      
          <section className="article" id="pp-7" aria-labelledby="pp-7-title">
            <h2 id="pp-7-title"><span className="no">7.</span>情報を使う目的</h2>
            <p>運営者が受け取った情報は、次の目的にだけ使います。</p>
            <ol className="items">
              <li>お問い合わせへのお返事と、そのための連絡</li>
              <li>不具合の原因を調べることと、本アプリの改善</li>
              <li>本アプリやウェブサイトについての大切なお知らせ（利用規約やこのポリシーの変更など）</li>
              <li>不正なアクセスや、利用規約に反する使い方への対応</li>
            </ol>
            <p>お問い合わせでいただいたメールアドレスを、広告やメールマガジンに使うことはありません。</p>
          </section>
      
          <section className="article" id="pp-8" aria-labelledby="pp-8-title">
            <h2 id="pp-8-title"><span className="no">8.</span>ほかの人への提供</h2>
            <p>運営者は、次の場合を除いて、利用者の同意なく、個人の情報をほかの人に提供しません。</p>
            <ol className="items">
              <li>法令にもとづく場合</li>
              <li>人の生命・身体・財産を守るために必要で、本人の同意を得ることが難しい場合</li>
              <li>国や地方公共団体などが、法令の定める事務を行うことに協力する必要がある場合</li>
            </ol>
            <p>なお、ウェブサイトとメールのサーバー（エックスサーバー）は、運営者が情報を預ける先として使っています。</p>
          </section>
      
          <section className="article" id="pp-9" aria-labelledby="pp-9-title">
            <h2 id="pp-9-title"><span className="no">9.</span>ほかの会社のサービス</h2>
            <p>本アプリは、次のサービスと組み合わせて使います。これらのサービスでの情報の扱いは、それぞれの会社のプライバシーポリシーによります。運営者は、これらのサービスが持つ情報を受け取りません。</p>
            <div className="legal-table-wrap">
              <table className="legal-table">
                <thead><tr><th scope="col">サービス</th><th scope="col">提供元</th><th scope="col">関わる場面</th></tr></thead>
                <tbody>
                  <tr><th scope="row">App Store</th><td data-label="提供元">Apple Inc.</td><td data-label="関わる場面">iPhone・iPad版の入手と、ライセンスの購入</td></tr>
                  <tr><th scope="row">Google Play</th><td data-label="提供元">Google LLC</td><td data-label="関わる場面">Android版の入手と、ライセンスの購入</td></tr>
                  <tr><th scope="row">Google Play 開発者サービスのコードスキャナー</th><td data-label="提供元">Google LLC</td><td data-label="関わる場面">Android版で、QRコードを読み取るとき</td></tr>
                  <tr><th scope="row">Tailscale</th><td data-label="提供元">Tailscale Inc.</td><td data-label="関わる場面">外出先から接続するとき（利用者が自分で入れて、ログインします）</td></tr>
                  <tr><th scope="row">Aqua Voice</th><td data-label="提供元">Aqua Voiceの提供元</td><td data-label="関わる場面">声で入力するとき。声を文字にするのはAqua Voiceです</td></tr>
                  <tr><th scope="row">エックスサーバー</th><td data-label="提供元">エックスサーバー株式会社</td><td data-label="関わる場面">ウェブサイトとメールのサーバー</td></tr>
                </tbody>
              </table>
            </div>
          </section>
      
          <section className="article" id="pp-10" aria-labelledby="pp-10-title">
            <h2 id="pp-10-title"><span className="no">10.</span>安全のための取り組み</h2>
            <p>運営者は、情報がもれたり、なくなったり、書き換えられたりしないよう、次のような取り組みを行います。</p>
            <ul className="ticks small">
              <li>Macとデバイスの通信の暗号化と、証明書による接続先の確認</li>
              <li>QRコードで登録したデバイスだけが接続できる仕組み。くり返し失敗した接続は、しばらく受け付けません</li>
              <li>外出先からつないでいる間、ホストのMacの画面を隠す機能と、切断したときのロック</li>
              <li>お問い合わせのメールを扱うアカウントの、パスワードと設定の管理</li>
            </ul>
          </section>
      
          <section className="article" id="pp-11" aria-labelledby="pp-11-title">
            <h2 id="pp-11-title"><span className="no">11.</span>保存する期間と削除</h2>
            <ol className="clauses">
              <li>端末の中に保存する情報（3.）は、利用者が本アプリを削除したり、登録を解除したりすると消えます。ただし、試用期間の情報は、アプリを削除してもMacに残ることがあります。</li>
              <li>デバイスをなくしたときは、Mothership Hostのメニューの「登録済みの端末」から、そのデバイスを削除してください。</li>
              <li>お問い合わせの内容と添付ファイルは、お返事と、その後のやり取りに必要な間だけ保存し、必要がなくなったら削除します。</li>
            </ol>
          </section>
      
          <section className="article" id="pp-12" aria-labelledby="pp-12-title">
            <h2 id="pp-12-title"><span className="no">12.</span>開示・訂正・削除のご請求</h2>
            <p>運営者が保存している、ご本人の情報（お問い合わせの内容など）について、開示、訂正、削除、利用の停止をご希望のときは、15.の窓口にご連絡ください。ご本人であることを確かめたうえで、法令にしたがい、すみやかに対応します。</p>
            <p>本アプリが端末の中に保存する情報は、運営者は持っていません。本アプリの設定や削除で、利用者が自分で消すことができます。</p>
          </section>
      
          <section className="article" id="pp-13" aria-labelledby="pp-13-title">
            <h2 id="pp-13-title"><span className="no">13.</span>お子さまの利用</h2>
            <p>本アプリは、お子さまを対象にしたものではありません。未成年の方がお問い合わせをされるときは、保護者の方の同意を得てからお送りください。</p>
          </section>
      
          <section className="article" id="pp-14" aria-labelledby="pp-14-title">
            <h2 id="pp-14-title"><span className="no">14.</span>このポリシーの変更</h2>
            <p>運営者は、法令の変更や、本アプリの機能の変更に合わせて、本ポリシーを変更することがあります。大切な変更をするときは、ウェブサイトなどで前もってお知らせします。変更後の本ポリシーは、このページに掲載した時点から効力を持ちます。</p>
          </section>
      
          <section className="article" id="pp-15" aria-labelledby="pp-15-title">
            <h2 id="pp-15-title"><span className="no">15.</span>お問い合わせ窓口</h2>
            <p>本ポリシーと、情報の取り扱いについてのお問い合わせは、次の窓口で受け付けます。</p>
            <dl className="terms-list">
              <div><dt>運営者</dt><dd><span className="tbd">【未確定：運営者の名前】</span></dd></div>
              <div><dt>お問い合わせ</dt><dd><Link href="/contact/">お問い合わせフォーム</Link></dd></div>
            </dl>
          </section>
      
          <div className="legal-end">
            <p>本ポリシーは、<span className="tbd">【未確定：公開日】</span>から適用します。</p>
            <p><Link href="/terms-of-service/">利用規約</Link>もあわせてご覧ください。</p>
            <p><Link href="/">← トップページへ</Link></p>
          </div>
        </article>
      </div>
    </main>
  );
}
