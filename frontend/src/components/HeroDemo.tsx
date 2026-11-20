"use client";

import { useEffect, useRef } from "react";
import { HERO_HTML, mountHeroDemo } from "./hero-demo-script";

// HERO のアニメ（案 2-B）。HTML はビルドのときに書き出し、ブラウザーで hero-demo-script.js が動かす。
// このコンポーネントは state を持たず再描画されないので、中の DOM は hero-demo-script.js が直接さわる。
export function HeroDemo() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? mountHeroDemo(ref.current) : undefined), []);
  return <div className="hv" ref={ref} dangerouslySetInnerHTML={{ __html: HERO_HTML }} />;
}
