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
