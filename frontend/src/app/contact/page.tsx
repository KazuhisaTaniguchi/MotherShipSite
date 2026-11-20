import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

// お問い合わせ。mock/design/contact.html の <main> を JSX にしたもの（スタイルは src/styles/contact.css）
// WordPress にも同じスラッグの固定ページ（お問い合わせ窓口）があるが、表示はこのファイルの内容を使う
// （src/app/[...slug]/page.tsx は、このスラッグを書き出さない）
export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "Mothershipのお問い合わせ窓口です。使い方のご質問、不具合のご報告、購入・ライセンスについて、ご意見・ご要望をお寄せください。",
  alternates: { canonical: "/contact/" },
};

export default function Contact() {
  return (
    <main id="main">
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="contact-hero-bg" aria-hidden="true"></div>
        <div className="wrap">
          <p className="pill pill-glass">お問い合わせ</p>
          <h1 id="contact-title">お問い合わせ</h1>
          <p className="contact-hero-lead">使い方のご質問、不具合のご報告、ご意見・ご要望など、<span className="nb">Mothershipについて、</span><span className="nb">お気軽にお寄せください。</span></p>
        </div>
      </section>

      {/* 送る前に、自分で解決できるかもしれないこと */}
      <section className="before" aria-labelledby="before-title">
        <div className="wrap">
          <h2 id="before-title">お問い合わせの前に</h2>
          <p className="before-lead">よくあるご質問は、すぐに答えが見つかるかもしれません。</p>
          <div className="before-grid">
            <article className="card">
              <h3>よくある質問</h3>
              <p>料金、外出先からの使い方、アカウント、声で入力するときに必要なものなど、よくいただくご質問をまとめています。</p>
              <Link className="card-link" href="/#faq">よくある質問を見る</Link>
            </article>
            <article className="card">
              <h3>つながらないときは</h3>
              <p>まず、次の点を確かめてください。</p>
              <ul className="ticks small">
                <li>Macがスリープしていないか（「待機中もMacをスリープさせない」をオン）</li>
                <li>Macで「画面収録」と「アクセシビリティ」を許可しているか</li>
                <li>自宅では、Macとデバイスが同じWi-Fiにいるか</li>
                <li>外出先では、両方のTailscaleが同じアカウントでログインしているか</li>
              </ul>
            </article>
            <article className="card">
              <h3>購入と返金について</h3>
              <p>代金の支払いと返金は、App Store・Google Playが行います。返金をご希望のときは、購入したストアにお申し出ください。機種を変えたときは、アプリの「購入を復元」で引き継げます。</p>
              <Link className="card-link" href="/terms-of-service/#art-7">利用規約（支払いと返金）を見る</Link>
            </article>
          </div>
        </div>
      </section>

      <section className="form-section" aria-labelledby="form-title">
        <div className="wrap">
          <h2 id="form-title">お問い合わせフォーム</h2>
          <div className="form-layout">
            <div className="form-wrap">
              <ContactForm />
            </div>

            <aside className="form-aside" aria-label="お問い合わせについて">
              <div className="aside-box">
                <h3>不具合のご報告のときは</h3>
                <p>次のことを書いていただくと、原因を早く見つけられます。</p>
                <ul className="ticks small">
                  <li>操作されるMacの機種と、macOSのバージョン</li>
                  <li>操作する側のデバイスと、OSのバージョン</li>
                  <li>自宅のWi-Fiか、外出先（Tailscale）か</li>
                  <li>何をしたときに、どうなったか</li>
                  <li>Mothership Hostのメニューに出ているメッセージ</li>
                </ul>
              </div>
              <div className="aside-box">
                <h3>お返事について</h3>
                <p>内容を確認のうえ、順にお返事します。お返事まで、数日いただくことがあります。土日・祝日は、お返事が遅くなることがあります。</p>
              </div>
              <div className="callout">
                <h3>パスワードは書かない・写さない</h3>
                <p>Macのパスワード、Tailscaleのパスワード、QRコードの画像など、ログインや登録に使う情報は、お問い合わせに書かないでください。添付する画像にも、写らないようにしてください。こちらからお聞きすることもありません。</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
