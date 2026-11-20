import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const DESCRIPTION =
  "Galaxy Z Foldなどの折りたたみスマホから、家のMacをリモート操作。端末の形に合わせた画面で文字がそのまま読め、直しは声で（Aqua Voiceに対応）。Claude CodeやCodexなど、MacのAIの進み具合も手もとで。iPhone・iPad・Macからも使えます。買い切り・月額なし。14日間、すべての機能を無料で試せます。";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mothershipremote.com"),
  title: {
    default: "MOTHERSHIP｜折りたたみスマホでMacのAIを操作するリモートアプリ",
    template: "%s｜MOTHERSHIP",
  },
  description: DESCRIPTION,
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
  openGraph: {
    title: "折りたたみスマホが、MacのAIの操作席になる。｜MOTHERSHIP",
    description: "開けば、Macの画面がそのまま読める。直しは、話すだけ。Galaxy Z Foldなどの折りたたみスマホから、家のMacを操作するリモートアプリ。",
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
    <html lang="ja">
      <body>
        <a className="skip-link" href="#main">本文へ移動</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
