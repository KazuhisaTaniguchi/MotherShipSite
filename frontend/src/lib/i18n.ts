import type { Metadata } from "next";

// 日本語（/…）と英語（/en/…）の対応。英語のページの中身は scripts/sync-en.py が mock/design_en から取り込む。

/** 英語版を公開しているか。false にすると、JA／EN の切り替え・hreflang・サイトマップから英語が消え、英語のページは noindex になる */
export const EN_PUBLIC = true;

/** 英語のページがある、日本語のパス */
const BOTH = ["/", "/help/", "/contact/", "/terms-of-service/", "/privacy-policy/", "/news/"];

const withSlash = (p: string) => (p.endsWith("/") ? p : `${p}/`);

export const isEnPath = (pathname: string) => withSlash(pathname).startsWith("/en/");

/** いまのページの、日本語と英語の URL（片方にしか無いページは、その言語のトップか一覧へ） */
export function langPaths(pathname: string): { ja: string; en: string } {
  const p = withSlash(pathname);
  if (p.startsWith("/en/")) {
    const ja = p.slice(3);                                   // /en/help/ → /help/、/en/news/12/ → /news/12/
    return { ja, en: p };
  }
  if (BOTH.includes(p)) return { ja: p, en: `/en${p}` };
  if (p.startsWith("/news/")) return { ja: p, en: "/en/news/" };   // 記事：英語があるかは記事ごと。一覧へ
  return { ja: p, en: "/en/" };
}

/** <head> の canonical と hreflang（日本語のパスで指定する）。lang は、そのページ自身の言語 */
export function langAlternates(jaPath: string, lang: "ja" | "en" = "ja"): Metadata["alternates"] {
  const en = `/en${jaPath}`;
  const canonical = lang === "ja" ? jaPath : en;
  if (!EN_PUBLIC) return { canonical };
  return { canonical, languages: { ja: jaPath, en, "x-default": en } };
}
