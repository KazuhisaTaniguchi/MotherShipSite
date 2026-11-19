import type { ReactNode } from "react";

// お知らせ・固定ページの見出しの帯
export function PageHero({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <div className="page-hero">
      <div className="wrap">
        {kicker && <p className="kicker">{kicker}</p>}
        <h1 className="section-title">{title}</h1>
        {children}
      </div>
    </div>
  );
}
