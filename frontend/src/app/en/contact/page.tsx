import type { Metadata } from "next";
import { EnMain } from "@/components/EnMain";
import { CONTACT } from "@/content/en/pages";
import { langAlternates } from "@/lib/i18n";
import { RECAPTCHA_KEY } from "@/lib/recaptcha";

// 英語のお問い合わせ。送信先は、WordPress の Contact Form 7 の英語用のフォーム（確認メールが英語）。
// ID は環境変数 NEXT_PUBLIC_CF7_CONTACT_FORM_ID_EN。空のあいだは送らずに「準備中」と出す（public/en/en.js）
const FORM_ID = process.env.NEXT_PUBLIC_CF7_CONTACT_FORM_ID_EN ?? "";

export const metadata: Metadata = {
  title: CONTACT.title,
  description: CONTACT.description,
  alternates: langAlternates("/contact/", "en"),
};

export default function Page() {
  const html = CONTACT.html
    .replace("%%CF7_ID%%", FORM_ID.replace(/[^0-9]/g, ""))
    .replace("%%RECAPTCHA_KEY%%", RECAPTCHA_KEY.replace(/[^\w-]/g, ""));   // reCAPTCHA v3 のサイトキー（空なら読み込まない）
  return <EnMain page={CONTACT} html={html} />;
}
