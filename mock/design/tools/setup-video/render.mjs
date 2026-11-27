// 使い方：node render.mjs <stage.html の場所> <voice|outside> shots <出力フォルダー> [秒,秒,…]
//         node render.mjs <stage.html の場所> <voice|outside> frames <出力フォルダー> [fps=30] [scale=1.5]
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";
const [stage, which, mode, out, a1, a2] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const scale = mode === "frames" ? parseFloat(a2 || "1.5") : 1;
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--hide-scrollbars", "--font-render-hinting=none"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: scale });
await page.goto("file://" + path.resolve(stage) + `?v=${which}&capture=1`);
await page.waitForFunction("document.documentElement.dataset.ready === '1'");
await page.evaluate(() => document.fonts.ready);
const total = await page.evaluate("window.TOTAL");
const scenes = await page.evaluate("window.SCENES");
console.log("TOTAL", total, JSON.stringify(scenes));
const snap = async (t, file, type = "png") => {
  await page.evaluate((x) => window.seek(x), t);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.screenshot({ path: file, type, ...(type === "jpeg" ? { quality: 95 } : {}) });
};
if (mode === "shots") {
  const times = a1 ? a1.split(",").map(Number) : scenes.flatMap(([, a, b]) => [a + (b - a) * 0.45, b - 0.4]);
  for (const t of times) await snap(t, path.join(out, `${which}-${t.toFixed(2).padStart(6, "0")}.png`));
} else {
  const fps = parseInt(a1 || "30", 10);
  const n = Math.round(total * fps);
  for (let i = 0; i < n; i++) {
    await snap(i / fps, path.join(out, `f${String(i).padStart(5, "0")}.jpg`), "jpeg");
    if (i % 300 === 0) console.log(i, "/", n);
  }
  console.log("frames", n);
}
await browser.close();
