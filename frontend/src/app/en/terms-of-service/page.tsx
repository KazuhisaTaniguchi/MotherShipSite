import type { Metadata } from "next";
import { EnMain } from "@/components/EnMain";
import { JsonLd } from "@/components/JsonLd";
import { TERMS } from "@/content/en/pages";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ lang: "en", path: "/terms-of-service/", title: TERMS.title, description: TERMS.description });

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "MOTHERSHIP", path: "/en/" }, { name: "Terms of Service", path: "/en/terms-of-service/" }])} />
      <EnMain page={TERMS} />
    </>
  );
}
