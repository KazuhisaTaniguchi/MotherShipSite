import type { Metadata } from "next";
import { EnMain } from "@/components/EnMain";
import { TERMS } from "@/content/en/pages";
import { langAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: TERMS.title,
  description: TERMS.description,
  alternates: langAlternates("/terms-of-service/", "en"),
};

export default function Page() {
  return <EnMain page={TERMS} />;
}
