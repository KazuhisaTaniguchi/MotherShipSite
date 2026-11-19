import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { getAllPages, toPlainText, uriToSegments, type Page } from "@/lib/wordpress";

// 固定ページは WordPress の URL のまま（例：/sample-page/、親子なら /company/about/）
// /news/ は Next.js 側のページが優先されるので、ここでは作らない

// ビルド中に何度も読み込まないよう、1 回の結果を使い回す
let pagesCache: Promise<Page[]> | null = null;
const pages = () => (pagesCache ??= getAllPages());

const findPage = async (slug: string[]) => {
  const path = slug.map((s) => decodeURIComponent(s)).join("/");
  return (await pages()).find((p) => uriToSegments(p.uri).join("/") === path) ?? null;
};

export async function generateStaticParams() {
  return (await pages())
    .map((p) => uriToSegments(p.uri))
    .filter((slug) => slug.length > 0 && slug[0] !== "news")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await findPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: toPlainText(page.content) || undefined,
    alternates: { canonical: `/${slug.join("/")}/` },
  };
}

export default async function FixedPage({ params }: PageProps<"/[...slug]">) {
  const { slug } = await params;
  const page = await findPage(slug);
  if (!page) notFound();

  return (
    <main id="main" className="page-main">
      <PageHero title={page.title} />
      <article className="entry">
        <div className="wrap">
          {/* 本文は WordPress の管理者が書いた HTML（WPGraphQL で整形済み） */}
          <div className="entry-body" dangerouslySetInnerHTML={{ __html: page.content ?? "" }} />
        </div>
      </article>
    </main>
  );
}
