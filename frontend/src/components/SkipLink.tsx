"use client";

import { usePathname } from "next/navigation";
import { isEnPath } from "@/lib/i18n";

// 「本文へ移動」のリンク。英語のページでは英語に
export function SkipLink() {
  const en = isEnPath(usePathname() ?? "/");
  return <a className="skip-link" href="#main">{en ? "Skip to main content" : "本文へ移動"}</a>;
}
