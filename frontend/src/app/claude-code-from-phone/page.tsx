import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { UseCasePage } from "@/components/UseCasePage";
import { getUseCase } from "@/content/usecases";

// 用途別のページ（日本語）。中身は src/content/usecases.ts。英語は src/app/en/claude-code-from-phone/
const page = getUseCase("claude-code-from-phone");
export const metadata: Metadata = pageMeta({ path: "/claude-code-from-phone/", title: page.title, description: page.description });

export default function Page() {
  return <UseCasePage page={page} />;
}
