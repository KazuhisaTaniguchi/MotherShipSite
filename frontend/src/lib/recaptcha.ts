// Google reCAPTCHA v3（迷惑メールの送信を防ぐ）。お問い合わせフォームのページだけで読み込む。
// サイトキーは環境変数 NEXT_PUBLIC_RECAPTCHA_SITE_KEY（公開してよい値）。空のあいだは何もしない。
// 判定は WordPress の Contact Form 7（「インテグレーション」→ reCAPTCHA にサイトキーとシークレットキーを入れる）が行う。
// フォームを送るときに、ここで受け取ったトークンを _wpcf7_recaptcha_response という名前で付ける。
export const RECAPTCHA_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

type Grecaptcha = { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> };
const api = () => (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;

/** reCAPTCHA の読み込みを始める（右下に「reCAPTCHA で保護されています」が出る） */
export function loadRecaptcha(): void {
  if (!RECAPTCHA_KEY || document.getElementById("recaptcha-v3")) return;
  const s = document.createElement("script");
  s.id = "recaptcha-v3";
  s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_KEY)}`;
  s.async = true;
  document.head.appendChild(s);
}

/** 送信のたびに、新しいトークンを受け取る。キーが無い・読み込めないときは空（Contact Form 7 の側の設定しだいで、送信がはじかれる） */
export function recaptchaToken(action = "contactform"): Promise<string> {
  return new Promise((resolve) => {
    const g = api();
    if (!RECAPTCHA_KEY || !g) { resolve(""); return; }
    const timer = setTimeout(() => resolve(""), 8000);
    g.ready(() => {
      g.execute(RECAPTCHA_KEY, { action }).then(
        (token) => { clearTimeout(timer); resolve(token); },
        () => { clearTimeout(timer); resolve(""); },
      );
    });
  });
}
