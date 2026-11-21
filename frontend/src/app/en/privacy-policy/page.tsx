import type { Metadata } from "next";
import { EnMain } from "@/components/EnMain";
import { PRIVACY } from "@/content/en/pages";
import { langAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: PRIVACY.title,
  description: PRIVACY.description,
  alternates: langAlternates("/privacy-policy/", "en"),
};

export default function Page() {
  return <EnMain page={PRIVACY} />;
}
