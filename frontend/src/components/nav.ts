// ヘッダーとフッターのリンク。LP の各節へは「/#…」で飛ぶ（ほかのページからでも戻れるように）
export const NAV_ITEMS = [
  { href: "/#features", label: "特長" },
  { href: "/#voice", label: "声で入力" },
  { href: "/#how", label: "使い方" },
  { href: "/#pricing", label: "料金" },
  { href: "/#faq", label: "よくある質問" },
] as const;
