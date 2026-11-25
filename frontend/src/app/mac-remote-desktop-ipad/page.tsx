import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { UseCasePage } from "@/components/UseCasePage";
import { getUseCase } from "@/content/usecases";

// 用途別のページ（日本語）。中身は src/content/usecases.ts。英語は src/app/en/mac-remote-desktop-ipad/
const page = getUseCase("mac-remote-desktop-ipad");
export const metadata: Metadata = pageMeta({ path: "/mac-remote-desktop-ipad/", title: page.title, description: page.description });

export default function Page() {
  return <UseCasePage page={page} />;
}
