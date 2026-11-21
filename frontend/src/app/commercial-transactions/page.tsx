import type { Metadata } from "next";
import Link from "next/link";

// 特定商取引法に基づく表記。mock/design/commercial-transactions.html の <main> を JSX にしたもの（スタイルは src/styles/legal.css）
// WordPress にも同じスラッグの固定ページ（中身は空）があるが、表示はこのファイルの内容を使う
// （src/app/[...slug]/page.tsx は、このスラッグを書き出さない）
export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description:
    "MOTHERSHIPのライセンス（買い切り）の販売についての、特定商取引法に基づく表記です。販売価格、支払い方法、引き渡しの時期、返品・返金、動作環境を記載しています。",
  alternates: { canonical: "/commercial-transactions/" },
};

export default function CommercialTransactions() {
  return (
    <main id="main">
      <section className="legal-hero" aria-labelledby="legal-title">
        <div className="legal-hero-bg" aria-hidden="true"></div>
        <div className="wrap">
          <p className="pill pill-glass">特定商取引法に基づく表記</p>
          <h1 id="legal-title">特定商取引法に基づく表記</h1>
          <p className="legal-hero-lead">MOTHERSHIPのライセンス（買い切り）の販売について、<br />特定商取引法にもとづいてお知らせします。</p>
          <dl className="legal-dates">
            <div><dt>最終更新日</dt><dd>2026年11月21日</dd></div>
          </dl>
        </div>
      </section>
      
      <div className="wrap legal-layout is-single">
        <article className="legal">
          <aside className="callout" aria-labelledby="store-note-title">
            <h2 id="store-note-title">ご購入は、App Store・Google Playから</h2>
            <p>MOTHERSHIPのライセンスは、アプリの中から、App Store・Google Playの決済で購入します。代金のお支払いと返金の手続きは、それぞれのストアで行います。まずは14日間、すべての機能を無料でお試しください。</p>
          </aside>
      
          <section className="article" id="seller" aria-labelledby="seller-title">
            <h2 id="seller-title">販売事業者について</h2>
            <div className="legal-table-wrap">
              <table className="legal-table is-spec">
                <tbody>
                  <tr><th scope="row">販売事業者</th><td>谷口 和久（Kazuhisa Taniguchi）<span className="sub">App Store・Google Playで表示される販売者の名前と同じです。</span></td></tr>
                  <tr><th scope="row">運営統括責任者</th><td>谷口 和久</td></tr>
                  <tr><th scope="row">所在地</th><td>ご請求があれば、遅滞なく開示します。</td></tr>
                  <tr><th scope="row">電話番号</th><td>ご請求があれば、遅滞なく開示します。<span className="sub">お問い合わせは、お問い合わせフォームとメールでお受けしています。</span></td></tr>
                  <tr><th scope="row">メールアドレス</th><td>info@mothershipremote.com</td></tr>
                  <tr><th scope="row">お問い合わせ</th><td><Link href="/contact/">お問い合わせフォーム</Link></td></tr>
                </tbody>
              </table>
            </div>
          </section>
      
          <section className="article" id="terms" aria-labelledby="terms-title">
            <h2 id="terms-title">販売の条件</h2>
            <div className="legal-table-wrap">
              <table className="legal-table is-spec">
                <tbody>
                  <tr><th scope="row">販売するもの</th><td>「MOTHERSHIP」のライセンス（買い切り）<span className="sub">試用期間のあとも、MOTHERSHIP HOSTを入れたMacに、デバイスからずっと接続できるようになる権利です（アプリ内課金）。一度の購入で、Macを3台まで使えます。使わなくなったMacを外すと、ほかのMacに使えます。</span></td></tr>
                  <tr><th scope="row">販売価格</th><td>3,000円（税込）<span className="sub">購入画面に表示される金額が、お支払いの金額です。日本以外のストアでは、その国の価格になります（米国は US$19.99）。</span></td></tr>
                  <tr><th scope="row">月額料金</th><td>ありません。一度の購入で、ずっと使えます。</td></tr>
                  <tr><th scope="row">試用期間</th><td>はじめてMacにつないだ日から14日間、すべての機能を無料で使えます。<span className="sub">試用期間が終わると、購入するまでデバイスから接続できなくなります。</span></td></tr>
                  <tr><th scope="row">商品代金以外に必要な料金</th><td>インターネットの通信料金（利用者の負担です）。<span className="sub">外出先から使うためのTailscale、声で入力するためのAqua Voiceなど、ほかの会社のサービスの料金は、それぞれの会社の定めによります。</span></td></tr>
                  <tr><th scope="row">お支払い方法</th><td>
                    <p>iPhone・iPad：App Store（Appleの決済）</p>
                    <p>Android：Google Play（Googleの決済）</p>
                    <span className="sub">それぞれのストアで使えるお支払い方法をお選びいただけます。</span>
                  </td></tr>
                  <tr><th scope="row">お支払いの時期</th><td>購入の手続きが完了したときに、各ストアの定めにしたがってお支払いいただきます。</td></tr>
                  <tr><th scope="row">引き渡しの時期</th><td>購入の手続きが完了したあと、すぐに使えます。<span className="sub">購入したデバイスからMacに接続し、ライセンスに加えると、そのMacが購入済みになります（3台まで）。機種を変えたときは、アプリの「購入を復元」で引き継げます。</span></td></tr>
                  <tr><th scope="row">返品・キャンセル</th><td>
                    <p>デジタルコンテンツのため、購入後の返品・キャンセルはお受けしておりません。</p>
                    <p>返金をご希望のときは、購入したストアにお申し出ください。返金するかどうかは、Apple・Googleの定めにより、各ストアが判断します。運営者から直接返金することはできません。</p>
                    <span className="sub">購入の前に、14日間の試用期間で、お使いの環境で動くことをお確かめください。</span>
                  </td></tr>
                  <tr><th scope="row">動作環境</th><td>
                    <p>操作されるMac：MOTHERSHIP HOST（macOS 14以降。Appleシリコン搭載のMac。Intel搭載のMacには対応していません）</p>
                    <p>iPhone・iPad：MOTHERSHIP（iOS 27・iPadOS 27以降）</p>
                    <p>Android：MOTHERSHIP（Android 13以降）</p>
                    <p>別のMac：MOTHERSHIP（macOS 15以降。Appleシリコン搭載のMac。このサイトから配布）</p>
                    <span className="sub">操作できるのはMacだけです。WindowsやLinuxのパソコンは操作できません。外出先から使うには、MacとデバイスにTailscaleが必要です。</span>
                  </td></tr>
                </tbody>
              </table>
            </div>
          </section>
      
          <div className="legal-end">
            <p><Link href="/terms-of-service/">利用規約</Link>・<Link href="/privacy-policy/">プライバシーポリシー</Link>もあわせてご覧ください。</p>
            <p><Link href="/">← トップページへ</Link></p>
          </div>
        </article>
      </div>
    </main>
  );
}
