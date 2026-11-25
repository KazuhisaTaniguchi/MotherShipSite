import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { UseCasePage } from "@/components/UseCasePage";
import { getUseCaseEn } from "@/content/usecases-en";

// 用途別のページ（英語）。中身は src/content/usecases-en.ts。日本語は src/app/mac-mini-remote-desktop/
const page = getUseCaseEn("mac-mini-remote-desktop");
export const metadata: Metadata = pageMeta({ lang: "en", path: "/mac-mini-remote-desktop/", title: page.title, description: page.description });

export default function Page() {
  return <UseCasePage page={page} />;
}
