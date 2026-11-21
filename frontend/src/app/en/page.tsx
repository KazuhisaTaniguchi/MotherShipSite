import type { Metadata } from "next";
import { EnMain } from "@/components/EnMain";
import { TOP, TOP_FAQ } from "@/content/en/pages";
import { faqLd, pageMeta, siteLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { getAllPostsEn } from "@/lib/wordpress";

export const metadata: Metadata = pageMeta({ lang: "en", path: "/", absolute: true, title: TOP.fullTitle, description: TOP.description });

// 検索エンジン向けの構造化データ：サイトと運営元、アプリの情報、よくある質問（ページの <details> と同じ中身。sync-en.py が取り出す）
const STRUCTURED_DATA = [
  ...siteLd("en"),
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MOTHERSHIP",
    "alternateName": "MOTHERSHIP REMOTE",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Android 13+, iOS 27+, iPadOS 27+, macOS 14+",
    "description": TOP.description,
    "url": "https://mothershipremote.com/en/",
    "image": "https://mothershipremote.com/og-en.png",
    "inLanguage": "en",
    "offers": { "@type": "Offer", "price": "19.99", "priceCurrency": "USD" },
  },
  faqLd(TOP_FAQ, "en"),
];

const esc = (s: string) => s.replace(/&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function Page() {
  // 最新のお知らせ：英語版のある記事を 3 件まで。0 件のときは、節ごと出さない
  const posts = (await getAllPostsEn()).slice(0, 3);
  const items = posts.map((p) => `<li><a href="/en/news/${p.databaseId}/">${esc(p.title)}</a></li>`).join("");
  const news = posts.length > 0 ? (TOP.newsSection ?? "").replace("%%NEWS_ITEMS%%", items) : "";
  return (
    <>
      <JsonLd data={STRUCTURED_DATA} />
      <EnMain page={TOP} html={TOP.html.replace("%%NEWS%%", news)} />
    </>
  );
}
