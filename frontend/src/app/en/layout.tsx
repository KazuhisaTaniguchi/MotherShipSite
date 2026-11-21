import type { Metadata } from "next";
import Script from "next/script";
import { LangAttr } from "@/components/LangAttr";
import { EN_JS_VERSION, TOP } from "@/content/en/pages";
import { EN_PUBLIC } from "@/lib/i18n";

// 英語のページ（/en/…）。中身は mock/design_en を scripts/sync-en.py で取り込んだもの。
// ヘッダーとフッターは、上のレイアウト（src/app/layout.tsx）の部品が、URL を見て英語に切り替える。
export const metadata: Metadata = {
  title: { default: TOP.fullTitle, template: "%s | MOTHERSHIP" },
  description: TOP.description,
  openGraph: {
    title: "Your foldable is mission control for your Mac's AI. | MOTHERSHIP",
    description: "Unfold it, and your Mac's screen is right there, sharp and readable. Need a change? Just say it. A remote app for running your Mac at home from a Galaxy Z Fold or any other foldable phone.",
    siteName: "MOTHERSHIP",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-en.png", width: 1200, height: 630, alt: "MOTHERSHIP: Your foldable is mission control for your Mac's AI." }],
  },
  twitter: { card: "summary_large_image", images: ["/og-en.png"] },
  robots: EN_PUBLIC ? undefined : { index: false, follow: false },
};

export default function EnLayout({ children }: LayoutProps<"/en">) {
  return (
    <>
      <LangAttr lang="en" />
      {children}
      {/* ?v= は、en.js の中身から作った印。中身が変わると URL も変わるので、ブラウザーが古いファイルを使い続けない */}
      <Script src={`/en/en.js?v=${EN_JS_VERSION}`} strategy="afterInteractive" />
    </>
  );
}
