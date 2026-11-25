import type { MetadataRoute } from "next";
import { EN_PUBLIC } from "@/lib/i18n";
import { getAllPosts, getAllPostsEn } from "@/lib/wordpress";
import { USE_CASE_SLUGS } from "@/content/usecases";

// サイトマップ（/sitemap.xml）。静的書き出しなので、ビルドのときに作る。
// 日本語と英語の両方にあるページは、言語の対応（hreflang）も書く。お知らせの記事も入れる
export const dynamic = "force-static";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mothershipremote.com";
type Entry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [posts, enPosts] = await Promise.all([getAllPosts(), getAllPostsEn()]);
  const enIds = new Set(enPosts.map((p) => p.databaseId));
  const langs = (path: string) => ({ languages: { ja: `${SITE}${path}`, en: `${SITE}/en${path}`, "x-default": `${SITE}/en${path}` } });

  // 日本語と英語の両方にあるページ
  const both: { path: string; freq: Entry["changeFrequency"]; pri: number }[] = [
    { path: "/", freq: "weekly", pri: 1 },
    { path: "/help/", freq: "monthly", pri: 0.8 },
    { path: "/contact/", freq: "yearly", pri: 0.4 },
    { path: "/terms-of-service/", freq: "yearly", pri: 0.3 },
    { path: "/privacy-policy/", freq: "yearly", pri: 0.3 },
  ];
  const out: MetadataRoute.Sitemap = [];
  for (const p of both) {
    const alternates = EN_PUBLIC ? langs(p.path) : undefined;
    out.push({ url: `${SITE}${p.path}`, lastModified: now, changeFrequency: p.freq, priority: p.pri, alternates });
    if (EN_PUBLIC) out.push({ url: `${SITE}/en${p.path}`, lastModified: now, changeFrequency: p.freq, priority: Math.max(0.1, p.pri - 0.1), alternates });
  }
  // お知らせの一覧（英語は、英語の記事があるときだけ）
  const newsEn = EN_PUBLIC && enPosts.length > 0;
  out.push({ url: `${SITE}/news/`, lastModified: now, changeFrequency: "weekly", priority: 0.6, alternates: newsEn ? langs("/news/") : undefined });
  if (newsEn) out.push({ url: `${SITE}/en/news/`, lastModified: now, changeFrequency: "weekly", priority: 0.5, alternates: langs("/news/") });
  // 日本語だけのページ
  out.push({ url: `${SITE}/commercial-transactions/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 });
  // 用途別のページ（日本語だけ。src/content/usecases.ts）
  for (const slug of USE_CASE_SLUGS) out.push({ url: `${SITE}/${slug}/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
  // お知らせの記事
  for (const post of posts) {
    const path = `/news/${post.databaseId}/`;
    const hasEn = EN_PUBLIC && enIds.has(post.databaseId);
    out.push({ url: `${SITE}${path}`, lastModified: post.date, changeFrequency: "yearly", priority: 0.5, alternates: hasEn ? langs(path) : undefined });
  }
  if (EN_PUBLIC) {
    for (const post of enPosts) {
      const path = `/news/${post.databaseId}/`;
      out.push({ url: `${SITE}/en${path}`, lastModified: post.modified, changeFrequency: "yearly", priority: 0.4, alternates: langs(path) });
    }
  }
  return out;
}
