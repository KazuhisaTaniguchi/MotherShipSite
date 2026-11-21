import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { articleLd, breadcrumbLd, pageMeta } from "@/lib/seo";
import { EMPTY_PARAM, formatDate, getAllPosts, getPost, toPlainText } from "@/lib/wordpress";

// URL は /news/{投稿ID}/（WordPress の投稿 ID = databaseId）
export async function generateStaticParams() {
  const posts = await getAllPosts();
  // 静的書き出しでは、0 件だとビルドが止まる。投稿が無いときは仮の 1 件（中身は 404）を書き出す
  if (posts.length === 0) return [{ id: EMPTY_PARAM }];
  return posts.map((post) => ({ id: String(post.databaseId) }));
}

const loadPost = async (id: string) => {
  if (!/^\d+$/.test(id)) return null;
  return getPost(Number(id));
};

export async function generateMetadata({ params }: PageProps<"/news/[id]">): Promise<Metadata> {
  const post = await loadPost((await params).id);
  if (!post) return {};
  const description = toPlainText(post.en ? post.content : post.excerpt || post.content);
  return pageMeta({
    path: `/news/${post.databaseId}/`,
    both: Boolean(post.en),            // 英語版のある記事だけ、言語の対応を付ける
    title: post.title,
    description,
    type: "article",
    image: post.featuredImage?.sourceUrl,   // アイキャッチが無い記事は、サイト共通の OGP 画像
    published: post.date,
    modified: post.modified,
  });
}

export default async function NewsPost({ params }: PageProps<"/news/[id]">) {
  const post = await loadPost((await params).id);
  if (!post) notFound();

  return (
    <main id="main" className="page-main">
      <JsonLd data={[
        breadcrumbLd([{ name: "MOTHERSHIP", path: "/" }, { name: "お知らせ", path: "/news/" }, { name: post.title, path: `/news/${post.databaseId}/` }]),
        articleLd({ lang: "ja", path: `/news/${post.databaseId}/`, title: post.title, description: toPlainText(post.content), published: post.date, modified: post.modified, image: post.featuredImage?.sourceUrl }),
      ]} />
      <PageHero kicker="NEWS" title={post.title}>
        <p className="page-meta"><time dateTime={post.date}>{formatDate(post.date)}</time></p>
      </PageHero>
      <article className="entry">
        <div className="wrap">
          {post.featuredImage && (
            <figure className="entry-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featuredImage.sourceUrl}
                alt={post.featuredImage.altText}
                width={post.featuredImage.width ?? undefined}
                height={post.featuredImage.height ?? undefined}
              />
            </figure>
          )}
          {/* 本文は WordPress の管理者が書いた HTML（WPGraphQL で整形済み） */}
          <div className="entry-body" dangerouslySetInnerHTML={{ __html: post.content ?? "" }} />
          <Link className="back-link" href="/news/">← お知らせの一覧へ</Link>
        </div>
      </article>
    </main>
  );
}
