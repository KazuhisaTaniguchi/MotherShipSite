"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- 英語のページどうし・言語の切り替えは、ふつうのリンクで読み込み直す（<html lang> と public/en/en.js の動きを付け直すため） */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EN_PUBLIC, isEnPath, langPaths } from "@/lib/i18n";
import { BrandMark } from "./BrandMark";
import { NAV_ITEMS, NAV_ITEMS_EN } from "./nav";

// mock/design/script.js の「メニューの開閉」と「スクロールしたら背景を付ける」
// 英語のページ（/en/…）では、文言とリンク先を英語にする。右上の JA／EN は、同じページのもう片方の言語へ（<html lang> が変わるので、ふつうのリンクで読み込み直す）
export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const en = isEnPath(pathname);
  const paths = langPaths(pathname);
  const items = en ? NAV_ITEMS_EN : NAV_ITEMS;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onResize = () => { if (window.innerWidth > 860) setOpen(false); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`} id="top">
      <div className="wrap header-inner">
        {en ? (
          <a className="brand" href="/en/" aria-label="MOTHERSHIP home"><BrandMark /><span>MOTHERSHIP</span></a>
        ) : (
          <Link className="brand" href="/" aria-label="MOTHERSHIP トップページへ">
            <BrandMark />
            <span>MOTHERSHIP</span>
          </Link>
        )}
        <button
          className="menu-toggle"
          type="button"
          aria-label={en ? (open ? "Close menu" : "Open menu") : (open ? "メニューを閉じる" : "メニューを開く")}
          aria-controls="site-nav"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
        </button>
        <nav
          className={`site-nav${open ? " is-open" : ""}`}
          id="site-nav"
          aria-label={en ? "Main navigation" : "メインナビゲーション"}
          onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); }}
        >
          {items.map((item) => (en
            ? <a key={item.href} href={item.href}>{item.label}</a>
            : <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
          {(EN_PUBLIC || en) && (
            <span className="lang-switch" role="group" aria-label={en ? "Language" : "言語"}>
              <a href={paths.ja} lang="ja" hrefLang="ja" aria-current={en ? undefined : "true"} aria-label="日本語">JA</a>
              <a href={paths.en} lang="en" hrefLang="en" aria-current={en ? "true" : undefined} aria-label="English">EN</a>
            </span>
          )}
          {en ? <a className="nav-cta" href="/en/#download">Download</a> : <Link className="nav-cta" href="/#download">ダウンロード</Link>}
        </nav>
      </div>
    </header>
  );
}
