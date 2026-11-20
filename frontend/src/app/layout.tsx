import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const DESCRIPTION =
  "MOTHERSHIPは、iPhone・iPad・Android・別のMacから、家のMacを操作できるリモートデスクトップアプリです。AIやビルドに任せた作業の進み具合を見て、指で動かし、次の指示は声で（Aqua Voiceに対応）。デバイスの形にぴったり合う画面で、小さな文字までくっきり。買い切り・月額なし。14日間、すべての機能を無料で試せます。";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mothershipremote.com"),
  title: {
    default: "MOTHERSHIP｜スマホからMacをリモート操作。指で動かす、声で書く",
    template: "%s｜Mothership",
  },
  description: DESCRIPTION,
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
  openGraph: {
    title: "指で動かす。声で書く。離れたMacを、スマホから。｜MOTHERSHIP",
    description: "家のMacで、AIが作業中。進み具合を指で確かめて、直しは話すだけ。",
    siteName: "MOTHERSHIP",
    locale: "ja_JP",
    type: "website",
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
