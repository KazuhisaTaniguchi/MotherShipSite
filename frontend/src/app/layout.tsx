import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const DESCRIPTION =
  "Mothershipは、iPhone・iPad・Android・別のMacから、自宅や職場のMacを操作できるリモートデスクトップアプリです。デバイスの画面にぴったり合う専用の画面を用意するので、小さな画面でも文字がくっきり。14日間、すべての機能を無料で試せます。";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mothershipremote.com"),
  title: {
    default: "Mothership｜スマホ・タブレットからMacをリモート操作",
    template: "%s｜Mothership",
  },
  description: DESCRIPTION,
  icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
  openGraph: {
    title: "離れていても、Macはそばに。｜Mothership",
    description: "スマホから、いつものMacへ。作業の続きに、どこからでも。",
    siteName: "Mothership",
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
