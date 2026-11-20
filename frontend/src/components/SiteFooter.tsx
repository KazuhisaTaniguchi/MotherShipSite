import Link from "next/link";
import { NAV_ITEMS } from "./nav";

export function SiteFooter() {
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
            <Link href="/news/">お知らせ</Link>
            <Link href="/terms-of-service/">利用規約</Link>
            <Link href="/privacy-policy/">プライバシーポリシー</Link>
            <Link href="/commercial-transactions/">特定商取引法に基づく表記</Link>
            <Link href="/contact/">お問い合わせ</Link>
          </nav>
        </div>
        <p className="trademark">Mac、macOS、iPhone、iPad、iPadOS、App Store、Face ID、Touch ID、Mission Controlは、米国およびその他の国や地域で登録されたApple Inc.の商標です。iPhoneの商標は、アイホン株式会社のライセンスにもとづき使用されています。Android、Google PlayはGoogle LLCの商標です。Galaxy Z Foldは、Samsung Electronics Co., Ltd.の商標または登録商標です。TailscaleはTailscale Inc.の商標です。Aqua Voice、BlackHoleは、それぞれの権利者の商標または製品名です。</p>
        <p className="trademark">MOTHERSHIPは独立して開発されたアプリであり、Apple Inc.、Google LLC、Tailscale Inc.、Aqua Voiceの提供元が認定・後援・承認したものではありません。</p>
        <div className="footer-bottom"><small>© 2026 MOTHERSHIP</small><a href="#top">ページの先頭へ ↑</a></div>
      </div>
    </footer>
  );
}
