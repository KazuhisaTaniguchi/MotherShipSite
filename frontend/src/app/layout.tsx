import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SkipLink } from "@/components/SkipLink";
import "./globals.css";

const DESCRIPTION =
  "Galaxy Z Foldなどの折りたたみスマホから、家のMacをリモートデスクトップで操作。端末の形に合わせた画面で文字がくっきり読め、Claude CodeやCodexなどMacのAIの進み具合を外出先から確かめて、指示は声で。iPhone・iPad・Androidでも使えます。買い切り・月額なし、14日間無料。";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mothershipremote.com"),
  title: {
    default: "折りたたみスマホでMacをリモート操作｜MacのAIも手もとで｜MOTHERSHIP",
    template: "%s｜MOTHERSHIP",
  },
  description: DESCRIPTION,
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
  openGraph: {
    title: "折りたたみスマホでMacをリモート操作｜MacのAIも手もとで｜MOTHERSHIP",
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
    <html lang="ja" suppressHydrationWarning>
      <body>
        <SkipLink />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
