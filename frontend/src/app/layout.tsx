import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SkipLink } from "@/components/SkipLink";
import { Analytics } from "@/components/Analytics";
import { FigureMotion } from "@/components/FigureMotion";
import "./globals.css";

// Web フォント（2026-11-28）：Mac・iPhone は端末のヒラギノ（英語は San Francisco）で表示し、それが無い端末（Android・Windows）だけ、
// 近い形の Noto Sans JP（英語は Inter）を使う。順番は tokens.css の --font-sans。
// ・ビルドのときに Google Fonts から取り込み、このサイトから配る（見る人のブラウザーは Google に通信しない）
// ・preload しない：ヒラギノがある端末では使われないので、読み込まれない。日本語は文字の範囲ごとのファイルなので、使う文字の分だけ読む
const notoJp = Noto_Sans_JP({ variable: "--font-noto-jp", display: "swap", preload: false, adjustFontFallback: false });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", preload: false, adjustFontFallback: false });

const DESCRIPTION =
  "iPhone・iPad・Androidのスマホやタブレットから、家のMacやMac miniをリモートデスクトップで操作。端末の形に合わせた画面で文字がくっきり読め、Claude CodeやCodexなどMacのAIの進み具合を外出先から確かめて、指示は声で。折りたたみスマホにも対応。買い切り・月額なし、14日間無料。";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mothershipremote.com"),
  title: {
    default: "Macのリモートデスクトップ｜iPhone・iPad・Androidから操作｜MOTHERSHIP",
    template: "%s｜MOTHERSHIP",
  },
  description: DESCRIPTION,
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
  // Google Search Console の、サイトの持ち主の確認（公開してよい値。全ページの <head> に出る）
  verification: { google: "wMEqxsov95lwYJm9sRNeN9Xc7AItyl0NAOACSPgNLrY" },
  openGraph: {
    title: "Macのリモートデスクトップ｜iPhone・iPad・Androidから操作｜MOTHERSHIP",
    description: DESCRIPTION,
    siteName: "MOTHERSHIP",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MOTHERSHIP｜折りたたみスマホが、MacのAIの操作席になる。" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#e9eefa",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // 英語のページ（/en/…）は、書き出したあとで lang="en" に書き換える（scripts/set-lang.mjs）。ここでは ja のままなので、ちがいの警告を止める
    <html lang="ja" className={`${notoJp.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <SkipLink />
        <SiteHeader />
        {children}
        <SiteFooter />
        <FigureMotion />
        <Analytics />
      </body>
    </html>
  );
}
