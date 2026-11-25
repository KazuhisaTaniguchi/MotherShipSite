import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { UseCasePage } from "@/components/UseCasePage";
import { getUseCase } from "@/content/usecases";

// 用途別のページ（日本語）。中身は src/content/usecases.ts。英語は src/app/en/mac-mini-remote-desktop/
const page = getUseCase("mac-mini-remote-desktop");
export const metadata: Metadata = pageMeta({ path: "/mac-mini-remote-desktop/", title: page.title, description: page.description });

export default function Page() {
  return <UseCasePage page={page} />;
}
