// next build のあとに実行する。書き出した英語のページ（out/en/…）の <html lang="ja"> を lang="en" に書き換える。
// （レイアウトは 1 つで、URL ごとに <html lang> を変えられないため。英語だけの CSS は html[lang="en"] で効かせている）
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "out", "en");
let count = 0;
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".html")) {
      const html = readFileSync(p, "utf8");
      const next = html.replace(/<html([^>]*?)\slang="ja"/, '<html$1 lang="en"');
      if (next === html) { console.warn(`set-lang: <html lang="ja"> が無い（そのまま）：${p}`); continue; }
      writeFileSync(p, next);
      count += 1;
    }
  }
};
walk(root);
console.log(`set-lang: ${count} ページを lang="en" にしました`);
