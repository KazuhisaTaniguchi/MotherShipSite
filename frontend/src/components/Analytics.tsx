"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isEnPath } from "@/lib/i18n";

// Google のタグ（Google Analytics 4）と、解析への同意の確認。
// ・タグの ID は環境変数 NEXT_PUBLIC_GTM_ID（公開してよい値）。空のあいだは何も読み込まない
// ・はじめは「同意していない」状態でタグを読み込む（Google の同意モード。クッキーは使われない）。
//   画面の下の確認で「同意する」を押した人だけ、解析のクッキーを使って計測する。選んだ結果はブラウザーに覚えておく
// ・フッターの「クッキーの設定」（data-consent-open）で、あとから選び直せる
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";
const KEY = "ms-analytics-consent";   // "granted" か "denied"

type Choice = "granted" | "denied";
const gtag = (...args: unknown[]) => {
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.gtag?.(...args);
};

export function Analytics() {
  const en = isEnPath(usePathname() ?? "/");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!GTM_ID) return;
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch { /* 保存できないブラウザーでは、毎回たずねる */ }
    // まだ選んでいない人にだけ、確認を出す（ページを開いた直後に出す）
    const timer = saved !== "granted" && saved !== "denied" ? setTimeout(() => setOpen(true), 0) : undefined;
    const reopen = (e: Event) => { if ((e.target as HTMLElement).closest("[data-consent-open]")) setOpen(true); };
    document.addEventListener("click", reopen);
    return () => { clearTimeout(timer); document.removeEventListener("click", reopen); };
  }, []);

  if (!GTM_ID) return null;

  const choose = (choice: Choice) => {
    try { localStorage.setItem(KEY, choice); } catch { /* 保存できなくても、このページでは反映する */ }
    gtag("consent", "update", { analytics_storage: choice });
    setOpen(false);
  };

  return (
    <>
      {/* 同意の初期値（すべて「同意していない」）を、タグより先に知らせる。前に「同意する」を選んだ人は、すぐ反映する */}
      <Script id="ga-consent" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
        try { if (localStorage.getItem('${KEY}') === 'granted') gtag('consent', 'update', { analytics_storage: 'granted' }); } catch (e) {}
        gtag('js', new Date());
      `}</Script>
      <Script id="ga-tag" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`} />
      {open && (
        <div className="consent" role="dialog" aria-live="polite" aria-label={en ? "Analytics cookies" : "アクセス解析のクッキー"}>
          <p>
            {en
              ? <>We’d like to use Google Analytics to see how this site is used and make it better. May we use analytics cookies? See our <Link href="/en/privacy-policy/">Privacy Policy</Link>.</>
              : <>サイトを良くするために、Google Analyticsで使われ方を調べたいと考えています。解析のクッキーを使ってもよいですか。くわしくは<Link href="/privacy-policy/">プライバシーポリシー</Link>をご覧ください。</>}
          </p>
          <div className="consent-actions">
            <button type="button" className="btn btn-ghost" onClick={() => choose("denied")}>{en ? "No thanks" : "同意しない"}</button>
            <button type="button" className="btn btn-primary" onClick={() => choose("granted")}>{en ? "Allow" : "同意する"}</button>
          </div>
        </div>
      )}
    </>
  );
}
