// WordPress（WPGraphQL）から中身を読み込む。ビルドのときだけ呼ばれる（SSG）。
const ENDPOINT =
  process.env.WORDPRESS_GRAPHQL_ENDPOINT ?? "https://api.mothershipremote.com/graphql";

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

async function fetchGraphQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`WPGraphQL の読み込みに失敗しました（HTTP ${res.status}）：${ENDPOINT}`);
  }
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(`WPGraphQL のエラー：${json.errors.map((e) => e.message).join(" / ")}`);
  }
  if (!json.data) throw new Error("WPGraphQL から data が返りませんでした");
  return json.data;
}

type PageInfo = { hasNextPage: boolean; endCursor: string | null };

// 100 件ずつ、最後までたどる
async function fetchAll<N>(
  query: string,
  pick: (data: never) => { nodes: N[]; pageInfo: PageInfo },
): Promise<N[]> {
  const all: N[] = [];
  let after: string | null = null;
  do {
    const data = await fetchGraphQL<never>(query, { after });
    const { nodes, pageInfo } = pick(data);
    all.push(...nodes);
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);
  return all;
}

export type FeaturedImage = { sourceUrl: string; altText: string; width: number | null; height: number | null };

export type PostSummary = {
  databaseId: number;
  title: string;
  date: string;
  excerpt: string | null;
};

export type Post = PostSummary & {
  content: string | null;
  modified: string;
  featuredImage: FeaturedImage | null;
  /** 英語版（本文に「ここから英語」の区切りがある記事だけ） */
  en: { title: string; content: string } | null;
};

/** 英語のお知らせ（一覧と記事で使う） */
export type EnPost = { databaseId: number; title: string; date: string; modified: string; content: string; featuredImage: FeaturedImage | null };

// お知らせは、1 つの記事の本文に日本語と英語を書く。区切りより上が日本語、下が英語。
// 区切り：クラス news-en の付いた区切り線（テーマのパターン「ここから英語版」）。または「[English]」とだけ書いた段落
// 英語のタイトル：区切りのすぐ下の見出し（無ければ、日本語のタイトルを使う）
const EN_MARK = /<hr[^>]*class="[^"]*\bnews-en\b[^"]*"[^>]*>|<p[^>]*>\s*\[(?:English|EN)\]\s*<\/p>/i;
export function splitLang(content: string | null, jaTitle: string): { ja: string | null; en: { title: string; content: string } | null } {
  const m = content ? EN_MARK.exec(content) : null;
  if (!content || !m) return { ja: content, en: null };
  const ja = content.slice(0, m.index).trim();
  let body = content.slice(m.index + m[0].length).trim();
  let title = jaTitle;
  const h = /^<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i.exec(body);
  if (h) {
    title = h[1].replace(/<[^>]+>/g, "").trim() || jaTitle;
    body = body.slice(h[0].length).trim();
  }
  return { ja, en: body ? { title, content: body } : null };
}

export type Page = {
  databaseId: number;
  title: string;
  uri: string;
  content: string | null;
  modified: string;
};

const FEATURED_IMAGE = `featuredImage { node { sourceUrl altText mediaDetails { width height } } }`;

type RawImage = { node: { sourceUrl: string; altText: string; mediaDetails: { width: number; height: number } | null } } | null;

const toImage = (raw: RawImage): FeaturedImage | null =>
  raw?.node
    ? {
        sourceUrl: raw.node.sourceUrl,
        altText: raw.node.altText ?? "",
        width: raw.node.mediaDetails?.width ?? null,
        height: raw.node.mediaDetails?.height ?? null,
      }
    : null;

/** 公開済みのお知らせ（新しい順） */
export async function getAllPosts(): Promise<PostSummary[]> {
  return fetchAll<PostSummary>(
    `query AllPosts($after: String) {
      posts(first: 100, after: $after, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
        pageInfo { hasNextPage endCursor }
        nodes { databaseId title date excerpt }
      }
    }`,
    (d: { posts: { nodes: PostSummary[]; pageInfo: PageInfo } }) => d.posts,
  );
}

export async function getPost(id: number): Promise<Post | null> {
  const data = await fetchGraphQL<{
    post: (Omit<Post, "featuredImage"> & { status: string; featuredImage: RawImage }) | null;
  }>(
    `query Post($id: ID!) {
      post(id: $id, idType: DATABASE_ID) {
        databaseId title date modified excerpt content status
        ${FEATURED_IMAGE}
      }
    }`,
    { id: String(id) },
  );
  const post = data.post;
  if (!post || post.status !== "publish") return null;
  const split = splitLang(post.content, post.title);   // 英語の部分は、日本語のページには出さない
  return {
    databaseId: post.databaseId,
    title: post.title,
    date: post.date,
    modified: post.modified,
    excerpt: post.excerpt,
    content: split.ja,
    featuredImage: toImage(post.featuredImage),
    en: split.en,
  };
}

/** 英語版のあるお知らせ（新しい順）。本文に区切りのある記事だけ */
export async function getAllPostsEn(): Promise<EnPost[]> {
  type Raw = { databaseId: number; title: string; date: string; modified: string; content: string | null; featuredImage: RawImage };
  const posts = await fetchAll<Raw>(
    `query AllPostsEn($after: String) {
      posts(first: 100, after: $after, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
        pageInfo { hasNextPage endCursor }
        nodes { databaseId title date modified content ${FEATURED_IMAGE} }
      }
    }`,
    (d: { posts: { nodes: Raw[]; pageInfo: PageInfo } }) => d.posts,
  );
  return posts.flatMap((post) => {
    const en = splitLang(post.content, post.title).en;
    return en ? [{ databaseId: post.databaseId, title: en.title, date: post.date, modified: post.modified, content: en.content, featuredImage: toImage(post.featuredImage) }] : [];
  });
}

/** 英語の日付（例：November 21, 2026） */
export const formatDateEn = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Tokyo" });

/** 公開済みの固定ページ（トップページに設定したものは除く。トップは Next.js の LP） */
export async function getAllPages(): Promise<Page[]> {
  const pages = await fetchAll<Page & { isFrontPage: boolean }>(
    `query AllPages($after: String) {
      pages(first: 100, after: $after, where: { status: PUBLISH }) {
        pageInfo { hasNextPage endCursor }
        nodes { databaseId title uri content modified isFrontPage }
      }
    }`,
    (d: { pages: { nodes: (Page & { isFrontPage: boolean })[]; pageInfo: PageInfo } }) => d.pages,
  );
  return pages
    .filter((p) => !p.isFrontPage)
    .map((p) => ({ databaseId: p.databaseId, title: p.title, uri: p.uri, content: p.content, modified: p.modified }));
}

/**
 * 書き出すページが 0 件のときの仮の URL の部品（静的書き出しは 0 件だとビルドが止まるため）。
 * 実在しない値なので、そのページは 404 の中身になる。
 */
export const EMPTY_PARAM = "_empty";

/** "/company/about/" → ["company", "about"] */
export const uriToSegments = (uri: string): string[] =>
  uri.split("/").filter(Boolean).map((s) => decodeURIComponent(s));

/** HTML のタグを外して、説明文（meta description）に使える長さにする */
export const toPlainText = (html: string | null | undefined, max = 120): string => {
  const text = (html ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8230;|&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

export const formatDate = (iso: string): string => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${y}年${m}月${d}日`;
};
