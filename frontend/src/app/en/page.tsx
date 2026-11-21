import type { Metadata } from "next";
import { EnMain } from "@/components/EnMain";
import { TOP } from "@/content/en/pages";
import { langAlternates } from "@/lib/i18n";
import { getAllPostsEn } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: { absolute: TOP.fullTitle },
  description: TOP.description,
  alternates: langAlternates("/", "en"),
};

// 検索エンジン向けの構造化データ（アプリの情報）
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MOTHERSHIP",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Android 13+, iOS 27+, iPadOS 27+, macOS 14+",
  "description": TOP.description,
  "url": "https://mothershipremote.com/en/",
  "image": "https://mothershipremote.com/og-en.png",
  "inLanguage": "en",
  "offers": { "@type": "Offer", "price": "19.99", "priceCurrency": "USD" },
};

const esc = (s: string) => s.replace(/&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function Page() {
  // 最新のお知らせ：英語版のある記事を 3 件まで。0 件のときは、節ごと出さない
  const posts = (await getAllPostsEn()).slice(0, 3);
  const items = posts.map((p) => `<li><a href="/en/news/${p.databaseId}/">${esc(p.title)}</a></li>`).join("");
  const news = posts.length > 0 ? (TOP.newsSection ?? "").replace("%%NEWS_ITEMS%%", items) : "";
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, "\\u003c") }} />
      <EnMain page={TOP} html={TOP.html.replace("%%NEWS%%", news)} />
    </>
  );
}
