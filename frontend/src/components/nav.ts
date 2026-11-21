// ヘッダーとフッターのリンク。LP の各節へは「/#…」で飛ぶ（ほかのページからでも戻れるように）
export const NAV_ITEMS = [
  { href: "/#features", label: "特長" },
  { href: "/#voice", label: "声で入力" },
  { href: "/#how", label: "使い方" },
  { href: "/#pricing", label: "料金" },
  { href: "/#faq", label: "よくある質問" },
] as const;

// 英語（/en/…）
export const NAV_ITEMS_EN = [
  { href: "/en/#features", label: "Features" },
  { href: "/en/#voice", label: "Voice" },
  { href: "/en/#how", label: "How it works" },
  { href: "/en/#pricing", label: "Pricing" },
  { href: "/en/#faq", label: "FAQ" },
] as const;

// 配信予定・インストール先（/#download）へのリンクの文言（日本語）。2026-11-21：公開前なので「配信予定」。
// 配信を始めたら label を「ダウンロード」、cta を「ダウンロード」に戻す（ヘッダー・フッター・HERO・404 がここを使う）
export const DOWNLOAD_LINK = { href: "/#download", label: "配信予定", cta: "配信予定を見る" } as const;
