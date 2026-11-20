"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";
import { NAV_ITEMS } from "./nav";

// mock/design/script.js の「メニューの開閉」と「スクロールしたら背景を付ける」
export function SiteHeader() {
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
        <Link className="brand" href="/" aria-label="MOTHERSHIP トップページへ">
          <BrandMark />
          <span>MOTHERSHIP</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
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
          aria-label="メインナビゲーション"
          onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); }}
        >
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
          <Link className="nav-cta" href="/#download">ダウンロード</Link>
        </nav>
      </div>
    </header>
  );
}
