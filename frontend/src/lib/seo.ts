import type { Metadata } from "next";
import { EN_PUBLIC } from "./i18n";

// 検索と共有のための設定をまとめて作る（タイトル・説明文・正規の URL・言語の対応・OGP・X のカード・構造化データ）。
// ねらう言葉と、ページごとの方針は、Obsidian の「LPとSEOの方針」と frontend/README.md の「SEO」を参照。

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mothershipremote.com").replace(/\/$/, "");
type Lang = "ja" | "en";
const SUFFIX = { ja: "｜MOTHERSHIP", en: " | MOTHERSHIP" } as const;
const OG_IMAGE = { ja: "/og.png", en: "/og-en.png" } as const;
const OG_ALT = {
  ja: "MOTHERSHIP：折りたたみスマホ・iPhone・iPad・AndroidからMacを操作するリモートデスクトップアプリ",
  en: "MOTHERSHIP: a Mac remote desktop app for foldable phones, iPhone, iPad, and Android",
} as const;

type PageMeta = {
  /** ページの言語（省くと日本語） */
  lang?: Lang;
  /** 日本語のパス（例："/help/"）。英語のページでも日本語のパスで指定する */
  path: string;
  /** タイトル。あとに「｜MOTHERSHIP」が付く（absolute を true にすると、そのまま使う） */
  title: string;
  absolute?: boolean;
  description: string;
  /** 日本語と英語の両方にあるページか（hreflang を付ける）。省くと true */
  both?: boolean;
  type?: "website" | "article";
  image?: string;
  noindex?: boolean;
  published?: string;
  modified?: string;
};

export function pageMeta(o: PageMeta): Metadata {
  const lang = o.lang ?? "ja";
  const both = (o.both ?? true) && EN_PUBLIC;
  const jaUrl = o.path;
  const enUrl = `/en${o.path}`;
  const url = lang === "ja" ? jaUrl : enUrl;
  const full = o.absolute ? o.title : `${o.title}${SUFFIX[lang]}`;
  const image = o.image ?? OG_IMAGE[lang];
  return {
    title: { absolute: full },
    description: o.description,
    alternates: both ? { canonical: url, languages: { ja: jaUrl, en: enUrl, "x-default": enUrl } } : { canonical: url },
    robots: o.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: o.type ?? "website",
      title: full,
      description: o.description,
      url,
      siteName: "MOTHERSHIP",
      locale: lang === "ja" ? "ja_JP" : "en_US",
      alternateLocale: both ? [lang === "ja" ? "en_US" : "ja_JP"] : undefined,
      images: [{ url: image, ...(o.image ? {} : { width: 1200, height: 630 }), alt: OG_ALT[lang] }],
      ...(o.type === "article" ? { publishedTime: o.published, modifiedTime: o.modified } : {}),
    },
    twitter: { card: "summary_large_image", title: full, description: o.description, images: [image] },
  };
}

// ---- 構造化データ（JSON-LD）----
const abs = (path: string) => `${SITE_URL}${path}`;

/** サイトと運営元（トップページに置く）。ストアでの名前「MOTHERSHIP REMOTE」も別名として知らせる */
export const siteLd = (lang: Lang) => [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": "MOTHERSHIP",
    "alternateName": "MOTHERSHIP REMOTE",
    "url": abs("/"),
    "logo": abs("/favicon.svg"),
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${abs(lang === "ja" ? "/" : "/en/")}#website`,
    "name": "MOTHERSHIP",
    "alternateName": ["MOTHERSHIP REMOTE", "mothershipremote.com"],
    "url": abs(lang === "ja" ? "/" : "/en/"),
    "inLanguage": lang,
    "publisher": { "@id": `${SITE_URL}/#organization` },
  },
];

/** パンくず（トップ → このページ）。path は、そのページの実際のパス（英語なら /en/…） */
export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, i) => ({ "@type": "ListItem", "position": i + 1, "name": item.name, "item": abs(item.path) })),
});

/** お知らせの記事 */
export const articleLd = (o: { lang: Lang; path: string; title: string; description: string; published: string; modified: string; image?: string | null }) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": o.title,
  "description": o.description,
  "datePublished": o.published,
  "dateModified": o.modified,
  "inLanguage": o.lang,
  "mainEntityOfPage": abs(o.path),
  "image": o.image ?? abs(o.lang === "ja" ? "/og.png" : "/og-en.png"),
  "author": { "@id": `${SITE_URL}/#organization`, "@type": "Organization", "name": "MOTHERSHIP" },
  "publisher": { "@id": `${SITE_URL}/#organization`, "@type": "Organization", "name": "MOTHERSHIP", "logo": { "@type": "ImageObject", "url": abs("/favicon.svg") } },
});

/** よくある質問 */
export const faqLd = (items: { q: string; a: string }[], lang: Lang) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "inLanguage": lang,
  "mainEntity": items.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
});
