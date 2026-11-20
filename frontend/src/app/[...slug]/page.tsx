import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { EMPTY_PARAM, getAllPages, toPlainText, uriToSegments, type Page } from "@/lib/wordpress";

// 固定ページは WordPress の URL のまま（例：/sample-page/、親子なら /company/about/）
// Next.js に専用のページがある URL は、ここでは作らない（同じ URL を 2 回書き出さないため）
//   news：お知らせ（src/app/news/）
//   terms-of-service：利用規約（src/app/terms-of-service/。WordPress の固定ページは空のまま）
//   contact：お問い合わせ（src/app/contact/。WordPress の固定ページ「お問い合わせ窓口」は使わない）
//   privacy-policy：プライバシーポリシー（src/app/privacy-policy/。WordPress の固定ページは空のまま）
const DEDICATED_ROUTES = new Set(["news", "terms-of-service", "contact", "privacy-policy"]);

// ビルド中に何度も読み込まないよう、1 回の結果を使い回す
let pagesCache: Promise<Page[]> | null = null;
const pages = () => (pagesCache ??= getAllPages());

const findPage = async (slug: string[]) => {
  const path = slug.map((s) => decodeURIComponent(s)).join("/");
  return (await pages()).find((p) => uriToSegments(p.uri).join("/") === path) ?? null;
};

export async function generateStaticParams() {
  const params = (await pages())
    .map((p) => uriToSegments(p.uri))
    .filter((slug) => slug.length > 0 && !DEDICATED_ROUTES.has(slug[0]))
    .map((slug) => ({ slug }));
  // 静的書き出しでは、0 件だとビルドが止まる。固定ページが無いときは仮の 1 件（中身は 404）を書き出す
  return params.length > 0 ? params : [{ slug: [EMPTY_PARAM] }];
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
