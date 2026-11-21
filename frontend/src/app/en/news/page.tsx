/* eslint-disable @next/next/no-html-link-for-pages -- 英語のページどうし・言語の切り替えは、ふつうのリンクで読み込み直す（<html lang> と public/en/en.js の動きを付け直すため） */
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { formatDateEn, getAllPostsEn } from "@/lib/wordpress";

// 英語のお知らせの一覧。英語版のある記事（本文に「ここから英語」の区切りがある記事）だけを並べる
export async function generateMetadata(): Promise<Metadata> {
  const count = (await getAllPostsEn()).length;
  return pageMeta({
    lang: "en",
    path: "/news/",
    title: "News & Updates",
    description: "News and updates from MOTHERSHIP, the Mac remote desktop app for foldable phones, iPhone, iPad, and Android.",
    noindex: count === 0,   // 英語の記事が無いあいだは、中身の無いページなので、検索に載せない
  });
}

export default async function NewsIndexEn() {
  const posts = await getAllPostsEn();
  return (
    <main id="main" className="page-main">
      <JsonLd data={breadcrumbLd([{ name: "MOTHERSHIP", path: "/en/" }, { name: "News", path: "/en/news/" }])} />
      <PageHero kicker="NEWS" title="The latest from MOTHERSHIP" />
      <section className="entry">
        <div className="wrap">
          {posts.length === 0 ? (
            <p className="news-empty">There’s no news in English yet. <a href="/news/" hrefLang="ja">See the news in Japanese</a>.</p>
          ) : (
            <ul className="news-list">
              {posts.map((post) => (
                <li key={post.databaseId} className="news-item">
                  <a href={`/en/news/${post.databaseId}/`}>
                    <time dateTime={post.date}>{formatDateEn(post.date)}</time>
                    <h2>{post.title}</h2>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
