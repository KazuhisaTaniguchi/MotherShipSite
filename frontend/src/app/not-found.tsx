import type { Metadata } from "next";
import Link from "next/link";
import { DOWNLOAD_LINK } from "@/components/nav";

// 404 ページ。mock/design/404.html の <main> を JSX にしたもの（スタイルは src/styles/404.css）
// noindex は Next.js が自動で付ける
export const metadata: Metadata = {
  title: "ページが見つかりません",
};

const POPULAR_LINKS = [
  { href: "/#features", label: "特長" },
  { href: "/#how", label: "使い方" },
  { href: "/#pricing", label: "料金" },
  { href: DOWNLOAD_LINK.href, label: DOWNLOAD_LINK.label },
] as const;

export default function NotFound() {
  return (
    <main id="main">
      <section className="nf" aria-labelledby="nf-title">
        <div className="nf-bg" aria-hidden="true"></div>
        <div className="wrap nf-grid">
          <div className="nf-copy">
            <p className="pill pill-glass nf-label">404 Not Found</p>
            <h1 id="nf-title">お探しのページに、<br /><span className="grad-text">つながりませんでした。</span></h1>
            <p className="nf-lead">ページが移動したか、削除された可能性があります。<br className="pc" />URLをお確かめのうえ、トップページからお探しください。</p>
            {/* 404 のページは 1 枚だけ（英語の URL でも、この日本語のページが出る）。英語の人のために 1 行だけ添える */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- 言語が変わるので、読み込み直す */}
            <p className="nf-lead" lang="en" style={{ marginTop: "var(--space-3)", fontSize: "var(--text-small)" }}>Page not found. <a href="/en/">Go to the English home page →</a></p>
            <div className="nf-actions">
              <Link className="btn btn-primary" href="/">トップページへ <span aria-hidden="true">→</span></Link>
              <Link className="btn btn-ghost" href="/#faq">よくある質問</Link>
            </div>
            <nav className="nf-links" aria-label="よく見られているページ">
              <p className="nf-links-title">よく見られているページ</p>
              <ul>
                {POPULAR_LINKS.map((link) => (
                  <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
                ))}
              </ul>
            </nav>
          </div>

          {/* 端末の枠（.phone）の中に、「つながらない」画面を描いたもの（飾り） */}
          <div className="nf-stage" aria-hidden="true">
            <div className="nf-glow"></div>
            <div className="phone nf-phone">
              <div className="phone-screen">
                <div className="nf-screen">
                  <span className="nf-icon">
                    <svg viewBox="0 0 24 24"><path d="M2 8.8a15 15 0 0 1 4.2-2.6M9.5 5.2A15 15 0 0 1 22 8.8M5 12.5a10 10 0 0 1 4-2.1M14.6 10.5A10 10 0 0 1 19 12.5M8.5 16a5 5 0 0 1 7 0" /><circle cx="12" cy="19.5" r="1" /><path d="m3 3 18 18" /></svg>
                  </span>
                  <p className="nf-code">404</p>
                  <p className="nf-screen-title"><span className="nb">ページが</span><span className="nb">見つかりません</span></p>
                  <p className="nf-screen-text">このURLの先には、<br />何もありませんでした。</p>
                </div>
              </div>
            </div>
            <div className="nf-chip"><span className="dot nf-dot"></span>つながっていません</div>
          </div>
        </div>
      </section>
    </main>
  );
}
