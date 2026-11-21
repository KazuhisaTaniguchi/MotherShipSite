import type { EnPage } from "@/content/en/pages";

// 英語のページの本文。mock/design_en の <main> の HTML を、そのまま出す（scripts/sync-en.py が取り込んだもの）。
// 動き（HERO の一時停止、お問い合わせフォーム）は public/en/en.js（src/app/en/layout.tsx で読み込む）
export function EnMain({ page, html }: { page: EnPage; html?: string }) {
  return <main id="main" className={page.mainClass || undefined} dangerouslySetInnerHTML={{ __html: html ?? page.html }} />;
}
