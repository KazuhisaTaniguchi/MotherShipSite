/* eslint-disable @next/next/no-html-link-for-pages -- 英語のページどうし・言語の切り替えは、ふつうのリンクで読み込み直す（<html lang> と public/en/en.js の動きを付け直すため） */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { langAlternates } from "@/lib/i18n";
import { EMPTY_PARAM, formatDateEn, getAllPostsEn, toPlainText } from "@/lib/wordpress";

// 英語のお知らせの記事。URL は /en/news/{投稿ID}/（日本語の /news/{投稿ID}/ と同じ記事の、英語の部分）
let cache: ReturnType<typeof getAllPostsEn> | null = null;
const posts = () => (cache ??= getAllPostsEn());

export async function generateStaticParams() {
  const all = await posts();
  // 静的書き出しでは、0 件だとビルドが止まる。英語の記事が無いときは仮の 1 件（中身は 404）を書き出す
  if (all.length === 0) return [{ id: EMPTY_PARAM }];
  return all.map((post) => ({ id: String(post.databaseId) }));
}

const load = async (id: string) => (await posts()).find((p) => String(p.databaseId) === id) ?? null;

export async function generateMetadata({ params }: PageProps<"/en/news/[id]">): Promise<Metadata> {
  const post = await load((await params).id);
  if (!post) return {};
  const description = toPlainText(post.content);
  return {
    title: post.title,
    description,
    alternates: langAlternates(`/news/${post.databaseId}/`, "en"),
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: post.featuredImage ? [post.featuredImage.sourceUrl] : ["/og-en.png"],
    },
  };
}

export default async function NewsPostEn({ params }: PageProps<"/en/news/[id]">) {
  const post = await load((await params).id);
  if (!post) notFound();
  return (
    <main id="main" className="page-main">
      <PageHero kicker="NEWS" title={post.title}>
        <p className="page-meta"><time dateTime={post.date}>{formatDateEn(post.date)}</time></p>
      </PageHero>
      <article className="entry">
        <div className="wrap">
          {post.featuredImage && (
            <figure className="entry-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.featuredImage.sourceUrl} alt={post.featuredImage.altText} width={post.featuredImage.width ?? undefined} height={post.featuredImage.height ?? undefined} />
            </figure>
          )}
          {/* 本文は WordPress の管理者が書いた HTML の、英語の部分 */}
          <div className="entry-body" dangerouslySetInnerHTML={{ __html: post.content }} />
          <a className="back-link" href="/en/news/">← All news</a>
        </div>
      </article>
    </main>
  );
}
