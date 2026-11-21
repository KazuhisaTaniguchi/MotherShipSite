"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- 英語のページどうし・言語の切り替えは、ふつうのリンクで読み込み直す（<html lang> と public/en/en.js の動きを付け直すため） */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TRADEMARKS } from "@/content/en/pages";
import { isEnPath, langPaths } from "@/lib/i18n";
import { NAV_ITEMS, NAV_ITEMS_EN } from "./nav";

// 解析（Google のタグ）を入れているときだけ、「クッキーの設定」を出す（押すと、同意の確認がもう一度出る）
const HAS_ANALYTICS = Boolean(process.env.NEXT_PUBLIC_GTM_ID);

// 英語のページ（/en/…）のフッター。商標の文は mock/design_en のもの（scripts/sync-en.py が取り込む）
function SiteFooterEn({ jaPath }: { jaPath: string }) {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <a className="brand" href="/en/"><span>MOTHERSHIP</span></a>
          <nav aria-label="Footer navigation">
            {NAV_ITEMS_EN.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
            <a href="/en/#download">Download</a>
            <a href="/en/help/">Help</a>
            <a href="/en/news/">News</a>
            <a href="/en/terms-of-service/">Terms of Service</a>
            <a href="/en/privacy-policy/">Privacy Policy</a>
            <a href="/commercial-transactions/" hrefLang="ja">Legal Notice (Japan, in Japanese)</a>
            <a href="/en/contact/">Contact</a>
            {HAS_ANALYTICS && <button type="button" className="consent-open" data-consent-open>Cookie settings</button>}
            <a className="nav-lang" href={jaPath} lang="ja" hrefLang="ja">日本語</a>
          </nav>
        </div>
        <p className="footer-tagline">MOTHERSHIP is a Mac remote desktop app for foldable phones, iPhone, iPad, and Android.</p>
        {TRADEMARKS.map((html, i) => (
          <p key={i} className="trademark" dangerouslySetInnerHTML={{ __html: html }} />
        ))}
        <div className="footer-bottom"><small>© 2026 MOTHERSHIP</small><a href="#top">Back to top ↑</a></div>
      </div>
    </footer>
  );
}

export function SiteFooter() {
  const pathname = usePathname() ?? "/";
  if (isEnPath(pathname)) return <SiteFooterEn jaPath={langPaths(pathname).ja} />;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <Link className="brand" href="/"><span>MOTHERSHIP</span></Link>
          <nav aria-label="フッターナビゲーション">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
            <Link href="/#download">ダウンロード</Link>
            <Link href="/help/">ヘルプ</Link>
            <Link href="/news/">お知らせ</Link>
            <Link href="/terms-of-service/">利用規約</Link>
            <Link href="/privacy-policy/">プライバシーポリシー</Link>
            <Link href="/commercial-transactions/">特定商取引法に基づく表記</Link>
            <Link href="/contact/">お問い合わせ</Link>
            {HAS_ANALYTICS && <button type="button" className="consent-open" data-consent-open>クッキーの設定</button>}
          </nav>
        </div>
        <p className="footer-tagline">MOTHERSHIPは、折りたたみスマホ・iPhone・iPad・AndroidからMacを操作する、リモートデスクトップアプリです。</p>
        <p className="trademark">Mac、macOS、iPhone、iPad、iPadOS、App Store、Face ID、Touch ID、Mission Controlは、米国およびその他の国や地域で登録されたApple Inc.の商標です。iPhoneの商標は、アイホン株式会社のライセンスにもとづき使用されています。Android、Google PlayはGoogle LLCの商標です。Galaxy Z Foldは、Samsung Electronics Co., Ltd.の商標または登録商標です。TailscaleはTailscale Inc.の商標です。Claude CodeはAnthropic PBCの、CodexはOpenAIの商標です。Aqua Voice、BlackHoleは、それぞれの権利者の商標または製品名です。</p>
        <p className="trademark">MOTHERSHIPは独立して開発されたアプリであり、Apple Inc.、Google LLC、Samsung Electronics Co., Ltd.、Anthropic PBC、OpenAI、Tailscale Inc.、Aqua Voiceの提供元が認定・後援・承認したものではありません。</p>
        <div className="footer-bottom"><small>© 2026 MOTHERSHIP</small><a href="#top">ページの先頭へ ↑</a></div>
      </div>
    </footer>
  );
}
