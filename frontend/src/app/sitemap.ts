import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/wordpress";

// サイトマップ（/sitemap.xml）。静的書き出しなので、ビルドのときに作る。お知らせの記事も入れる
export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mothershipremote.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/help/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/news/`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/contact/`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/terms-of-service/`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/privacy-policy/`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/commercial-transactions/`, changeFrequency: "yearly", priority: 0.3 },
  ];
  const posts = (await getAllPosts()).map((post) => ({
    url: `${SITE}/news/${post.databaseId}/`,
    lastModified: post.date,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));
  return [...pages, ...posts];
}
