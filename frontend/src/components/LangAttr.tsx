"use client";

import { useEffect } from "react";

// <html lang> を英語にする。書き出した HTML は scripts/set-lang.mjs が書き換えるが、開発中（next dev）と、ページを読み込み直さずに移ったときのために、ここでも合わせる
export function LangAttr({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => { document.documentElement.lang = "ja"; };   // 英語のページを離れたら、日本語に戻す
  }, [lang]);
  return null;
}
