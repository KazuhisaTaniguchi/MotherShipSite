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

// ダウンロード（/#download）へのリンクの文言（日本語）。ヘッダー・フッター・HERO・404 がここを使う。
// 2026-11-24：iPhone・iPad版をApp Storeで公開したので、「配信予定」から「ダウンロード」に変えた
// App Store の URL は日本のストア。ほかの国のストアで公開されたら、英語版（mock/design_en）にもリンクを入れる
export const DOWNLOAD_LINK = { href: "/#download", label: "ダウンロード", cta: "ダウンロード" } as const;

// iPhone・iPad版（App Store）
export const APP_STORE_URL = "https://apps.apple.com/jp/app/mothership-remote/id6837504217";
