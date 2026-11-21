import type { Metadata } from "next";
import Script from "next/script";
import { LangAttr } from "@/components/LangAttr";
import { EN_JS_VERSION } from "@/content/en/pages";
import { EN_PUBLIC } from "@/lib/i18n";

// 英語のページ（/en/…）。中身は mock/design_en を scripts/sync-en.py で取り込んだもの。
// ヘッダーとフッターは、上のレイアウト（src/app/layout.tsx）の部品が、URL を見て英語に切り替える。
export const metadata: Metadata = {
  // タイトル・説明文・OGP は、ページごとに pageMeta（src/lib/seo.ts）が付ける
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
