import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { UseCasePage } from "@/components/UseCasePage";
import { getUseCaseEn } from "@/content/usecases-en";

// 用途別のページ（英語）。中身は src/content/usecases-en.ts。日本語は src/app/codex-from-phone/
const page = getUseCaseEn("codex-from-phone");
export const metadata: Metadata = pageMeta({ lang: "en", path: "/codex-from-phone/", title: page.title, description: page.description });

export default function Page() {
  return <UseCasePage page={page} />;
}
