import type { Metadata } from "next";
import { EnMain } from "@/components/EnMain";
import { HELP } from "@/content/en/pages";
import { langAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: HELP.title,
  description: HELP.description,
  alternates: langAlternates("/help/", "en"),
};

export default function Page() {
  return <EnMain page={HELP} />;
}
