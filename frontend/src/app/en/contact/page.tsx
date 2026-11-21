import type { Metadata } from "next";
import { EnMain } from "@/components/EnMain";
import { CONTACT } from "@/content/en/pages";
import { RECAPTCHA_KEY } from "@/lib/recaptcha";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

// 英語のお問い合わせ。送信先は、WordPress の Contact Form 7 の英語用のフォーム（確認メールが英語）。
// ID は環境変数 NEXT_PUBLIC_CF7_CONTACT_FORM_ID_EN。空のあいだは送らずに「準備中」と出す（public/en/en.js）
const FORM_ID = process.env.NEXT_PUBLIC_CF7_CONTACT_FORM_ID_EN ?? "";

export const metadata: Metadata = pageMeta({ lang: "en", path: "/contact/", title: CONTACT.title, description: CONTACT.description });

export default function Page() {
  const html = CONTACT.html
    .replace("%%CF7_ID%%", FORM_ID.replace(/[^0-9]/g, ""))
    .replace("%%RECAPTCHA_KEY%%", RECAPTCHA_KEY.replace(/[^\w-]/g, ""));   // reCAPTCHA v3 のサイトキー（空なら読み込まない）
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "MOTHERSHIP", path: "/en/" }, { name: "Contact", path: "/en/contact/" }])} />
      <EnMain page={CONTACT} html={html} />
    </>
  );
}
