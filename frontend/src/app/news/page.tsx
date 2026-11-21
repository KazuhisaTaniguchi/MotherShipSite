import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { formatDate, getAllPosts } from "@/lib/wordpress";

export const metadata: Metadata = pageMeta({
  path: "/news/",
  title: "お知らせ",
  description: "MOTHERSHIP（折りたたみスマホ・iPhone・iPad・AndroidからMacを操作するリモートデスクトップアプリ）からのお知らせです。アプリの公開や更新の情報を掲載します。",
});

export default async function NewsIndex() {
  const posts = await getAllPosts();

  return (
    <main id="main" className="page-main">
      <JsonLd data={breadcrumbLd([{ name: "MOTHERSHIP", path: "/" }, { name: "お知らせ", path: "/news/" }])} />
      <PageHero kicker="NEWS" title="お知らせ" />
      <section className="entry">
        <div className="wrap">
          {posts.length === 0 ? (
            <p className="news-empty">お知らせはまだありません。</p>
          ) : (
            <ul className="news-list">
              {posts.map((post) => (
                <li key={post.databaseId} className="news-item">
                  <Link href={`/news/${post.databaseId}/`}>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <h2>{post.title}</h2>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
