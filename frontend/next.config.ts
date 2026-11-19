import type { NextConfig } from "next";

// SSG：`next build` で、すべてのページを HTML に書き出す（out/ フォルダー）。
// WordPress の中身はビルドのときに WPGraphQL から読み込む。記事を更新したら、もう一度ビルドする。
const nextConfig: NextConfig = {
  output: "export",
  // /news/1 → out/news/1/index.html。Apache（エックスサーバー）でそのまま配信できる
  trailingSlash: true,
  // 静的書き出しでは、画像の自動最適化は使えない
  images: { unoptimized: true },
};

export default nextConfig;
