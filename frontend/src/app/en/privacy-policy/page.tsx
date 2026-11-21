import type { Metadata } from "next";
import { EnMain } from "@/components/EnMain";
import { JsonLd } from "@/components/JsonLd";
import { PRIVACY } from "@/content/en/pages";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ lang: "en", path: "/privacy-policy/", title: PRIVACY.title, description: PRIVACY.description });

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "MOTHERSHIP", path: "/en/" }, { name: "Privacy Policy", path: "/en/privacy-policy/" }])} />
      <EnMain page={PRIVACY} />
    </>
  );
}
