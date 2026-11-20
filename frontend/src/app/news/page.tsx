import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { formatDate, getAllPosts } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "MOTHERSHIPからのお知らせ",
};

export default async function NewsIndex() {
  const posts = await getAllPosts();

  return (
    <main id="main" className="page-main">
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
