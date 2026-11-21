"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { loadRecaptcha, recaptchaToken } from "@/lib/recaptcha";

// お問い合わせフォーム（mock/design/contact.html のフォームと contact.js を React にしたもの）。添付ファイルは JPEG・PNG・PDF、1 つ 5MB まで、3 つまで
// 送信先：WordPress の Contact Form 7 の REST API
//   POST {NEXT_PUBLIC_WORDPRESS_URL}/wp-json/contact-form-7/v1/contact-forms/{ID}/feedback
// ID は環境変数 NEXT_PUBLIC_CF7_CONTACT_FORM_ID（ビルドのときに埋め込まれる）。
// ID が無いあいだは送らない（「送信しました」と見せかけない）。
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://api.mothershipremote.com";
const FORM_ID = process.env.NEXT_PUBLIC_CF7_CONTACT_FORM_ID ?? "";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RequiredName = "inquiry-type" | "your-name" | "your-email" | "your-subject" | "your-message" | "acceptance-privacy";
const REQUIRED: RequiredName[] = ["inquiry-type", "your-name", "your-email", "your-subject", "your-message", "acceptance-privacy"];

// 添付ファイル：JPEG・PNG・PDF だけ、1 つ 5MB まで、3 つまで。拡張子と、先頭の数バイト（中身の種類）の両方を確かめる。
// WordPress の側（Contact Form 7 の your-file-1〜3 と、テーマの確認）でも、もう一度確かめる
const MAX_FILES = 3;
const MAX_BYTES = 5 * 1024 * 1024;
const KINDS: Record<string, "jpeg" | "png" | "pdf"> = { jpg: "jpeg", jpeg: "jpeg", png: "png", pdf: "pdf" };
type Attachment = { file: File; url: string };

const sizeText = (n: number) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))}KB` : `${(n / 1024 / 1024).toFixed(1)}MB`);

const sniff = async (file: File): Promise<string> => {
  const b = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return "pdf"; // %PDF
  return "";
};

function AttachThumb({ item }: { item: Attachment }) {
  const [broken, setBroken] = useState(false);
  if (!item.url || broken) return <span className="attach-thumb">{item.url ? "IMG" : "PDF"}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <span className="attach-thumb"><img src={item.url} alt="" onError={() => setBroken(true)} /></span>;
}

type Cf7Response = {
  status: string;
  message?: string;
  invalid_fields?: { field: string; message: string }[];
};

const isFilled = (form: HTMLFormElement, name: RequiredName): boolean => {
  const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
  if (!el) return true;
  if (el instanceof HTMLInputElement && el.type === "checkbox") return el.checked;
  const value = el.value.trim();
  if (!value) return false;
  if (name === "your-email") return EMAIL.test(value);
  return true;
};

export function ContactForm() {
  const [errors, setErrors] = useState<Partial<Record<string, boolean>>>({});
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [agreed, setAgreed] = useState(false); // 同意のチェックが入っているときだけ送信ボタンを押せる
  const [done, setDone] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [attachErrors, setAttachErrors] = useState<string[]>([]);

  useEffect(() => { loadRecaptcha(); }, []);   // このページを開いたら、reCAPTCHA を読み込む
  const attachRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<Attachment[]>([]);

  // ページを離れるときに、サムネイル用の URL を片付ける
  useEffect(() => { filesRef.current = files; }, [files]);
  useEffect(() => () => filesRef.current.forEach((f) => { if (f.url) URL.revokeObjectURL(f.url); }), []);

  const onPick = async (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // 同じファイルを、外したあとにもう一度選べるように
    const next = [...files];
    const errs: string[] = [];
    for (const file of picked) {
      const ext = (file.name.split(".").pop() ?? "").toLowerCase();
      if (next.some((f) => f.file.name === file.name && f.file.size === file.size)) continue;
      if (next.length >= MAX_FILES) { errs.push(`添付できるのは${MAX_FILES}つまでです。`); break; }
      if (!KINDS[ext]) { errs.push(`「${file.name}」：JPEG・PNG・PDFのファイルだけ添付できます。`); continue; }
      if (file.size > MAX_BYTES) { errs.push(`「${file.name}」：5MBより大きいため、添付できません（${sizeText(file.size)}）。`); continue; }
      if ((await sniff(file)) !== KINDS[ext]) { errs.push(`「${file.name}」：ファイルの中身が、JPEG・PNG・PDFではないようです。`); continue; }
      next.push({ file, url: KINDS[ext] === "pdf" ? "" : URL.createObjectURL(file) });
    }
    setFiles(next);
    setAttachErrors(errs);
  };

  const removeFile = (index: number) => {
    const target = files[index];
    if (target?.url) URL.revokeObjectURL(target.url);
    setFiles(files.filter((_, i) => i !== index));
    setAttachErrors([]);
    attachRef.current?.focus();
  };

  useEffect(() => {
    if (!done) return;
    doneRef.current?.focus();
    doneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [done]);

  const invalid = (name: string) => Boolean(errors[name]);
  const fieldClass = (name: string, base = "field") => `${base}${invalid(name) ? " is-invalid" : ""}`;

  // 一度エラーになった項目は、直したらすぐにエラーを消す
  const recheck = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    const name = target.name as RequiredName;
    if (!REQUIRED.includes(name) || !errors[name]) return;
    setErrors((prev) => ({ ...prev, [name]: !isFilled(e.currentTarget, name) }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("");
    const next: Record<string, boolean> = {};
    REQUIRED.forEach((name) => { next[name] = !isFilled(form, name); });
    setErrors(next);
    const bad = REQUIRED.filter((name) => next[name]);
    if (bad.length) {
      (form.elements.namedItem(bad[0]) as HTMLElement | null)?.focus();
      setStatus(`入力の内容を確かめてください（${bad.length}か所）。`);
      return;
    }
    if (!FORM_ID) {
      setStatus("ただいまフォームの準備中です。恐れ入りますが、しばらくしてからお試しください。");
      return;
    }

    setSending(true);
    try {
      const body = new FormData(form);
      body.append("_wpcf7_unit_tag", `wpcf7-f${FORM_ID}-o1`); // Contact Form 7 の 5.8 以降で必要
      files.forEach((f, i) => body.append(`your-file-${i + 1}`, f.file)); // Contact Form 7 のファイルの項目（your-file-1〜3）
      const token = await recaptchaToken();   // reCAPTCHA v3（キーが無いあいだは空）
      if (token) body.append("_wpcf7_recaptcha_response", token);
      const res = await fetch(`${WP_URL}/wp-json/contact-form-7/v1/contact-forms/${FORM_ID}/feedback`, { method: "POST", body });
      const json = (await res.json()) as Cf7Response;
      if (json.status === "mail_sent") {
        setDone(true);
        return;
      }
      // 項目ごとのエラー（Contact Form 7 の判定）を、その項目の下に出す
      const fromServer: Record<string, boolean> = {};
      const fileErrors: string[] = [];
      (json.invalid_fields ?? []).forEach((f) => {
        if (/^your-file-/.test(f.field)) { fileErrors.push(f.message); return; } // 添付ファイルのエラー
        fromServer[f.field.replace(/\[\]$/, "")] = true;
      });
      if (fileErrors.length) setAttachErrors(fileErrors);
      setErrors((prev) => ({ ...prev, ...fromServer }));
      setStatus(json.message || "送信できませんでした。");
    } catch {
      setStatus("送信できませんでした。時間をおいて、もう一度お試しください。");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="contact-form form-done" ref={doneRef} tabIndex={-1}>
        <span className="form-done-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 12.5 4 4L18 8" /></svg></span>
        <h3>送信しました</h3>
        <p>お問い合わせ、ありがとうございます。<br />内容を確認のうえ、順にお返事します。</p>
        <p className="form-done-note">ご入力のメールアドレスに、受付の確認メールをお送りしました。届いていない場合は、迷惑メールのフォルダーもご確認ください。それでも見当たらないときは、メールアドレスに誤りがないかお確かめのうえ、もう一度お送りください。</p>
        <Link className="btn btn-ghost" href="/">トップページへ</Link>
      </div>
    );
  }

  return (
    <form className="contact-form" noValidate aria-describedby="form-note" onSubmit={onSubmit} onInput={recheck} onChange={recheck}>
      <p className="form-note" id="form-note"><span className="req">必須</span> は、かならずご記入ください。</p>

      <div className={fieldClass("inquiry-type")}>
        <label htmlFor="inquiry-type">お問い合わせの種類 <span className="req">必須</span></label>
        <select className="input" id="inquiry-type" name="inquiry-type" required defaultValue="" aria-invalid={invalid("inquiry-type")} aria-describedby="inquiry-type-error">
          <option value="">選んでください</option>
          <option>使い方について</option>
          <option>不具合のご報告</option>
          <option>購入・ライセンスについて</option>
          <option>ご意見・ご要望</option>
          <option>そのほか（取材など）</option>
        </select>
        <p className="error-text" id="inquiry-type-error">お問い合わせの種類を選んでください。</p>
      </div>

      <div className="field-row">
        <div className={fieldClass("your-name")}>
          <label htmlFor="your-name">お名前 <span className="req">必須</span></label>
          <input className="input" id="your-name" name="your-name" type="text" autoComplete="name" required placeholder="例：山田 太郎" aria-invalid={invalid("your-name")} aria-describedby="your-name-error" />
          <p className="error-text" id="your-name-error">お名前を入力してください。</p>
        </div>
        <div className={fieldClass("your-email")}>
          <label htmlFor="your-email">メールアドレス <span className="req">必須</span></label>
          <input className="input" id="your-email" name="your-email" type="email" autoComplete="email" inputMode="email" required placeholder="例：you@example.com" aria-invalid={invalid("your-email")} aria-describedby="your-email-hint your-email-error" />
          <p className="hint" id="your-email-hint">お返事は、このアドレスにお送りします。</p>
          <p className="error-text" id="your-email-error">メールアドレスを正しく入力してください。</p>
        </div>
      </div>

      <fieldset className={fieldClass("device")} aria-describedby="device-hint">
        <legend>お使いのデバイス <span className="opt">任意</span></legend>
        <p className="hint" id="device-hint">Macを操作している側のデバイスを選んでください（いくつでも）。</p>
        <div className="choices">
          {[["iPhone", "iPhone"], ["iPad", "iPad"], ["Android", "Android"], ["Mac", "別のMac"]].map(([value, label]) => (
            <label className="choice" key={value}><input type="checkbox" name="device[]" value={value} /><span>{label}</span></label>
          ))}
        </div>
      </fieldset>

      <div className="field-row">
        <div className="field">
          <label htmlFor="macos-version">操作されるMacのmacOS <span className="opt">任意</span></label>
          <input className="input" id="macos-version" name="macos-version" type="text" placeholder="例：macOS 15.3（Mac mini M2）" />
        </div>
        <div className="field">
          <label htmlFor="app-version">アプリのバージョン <span className="opt">任意</span></label>
          <input className="input" id="app-version" name="app-version" type="text" placeholder="例：Host 1.0.0／iPhone 1.0.0" />
        </div>
      </div>

      <div className={fieldClass("your-subject")}>
        <label htmlFor="your-subject">件名 <span className="req">必須</span></label>
        <input className="input" id="your-subject" name="your-subject" type="text" required placeholder="例：外出先からつながらない" aria-invalid={invalid("your-subject")} aria-describedby="your-subject-error" />
        <p className="error-text" id="your-subject-error">件名を入力してください。</p>
      </div>

      <div className={fieldClass("your-message")}>
        <label htmlFor="your-message">お問い合わせの内容 <span className="req">必須</span></label>
        <textarea className="input" id="your-message" name="your-message" required placeholder="不具合のときは、何をしたときに、どうなったかを書いていただけると助かります。" aria-invalid={invalid("your-message")} aria-describedby="your-message-error"></textarea>
        <p className="error-text" id="your-message-error">お問い合わせの内容を入力してください。</p>
      </div>

      {/* 添付ファイル（任意）。JPEG・PNG・PDF だけ、1 つ 5MB まで、3 つまで。送るときに your-file-1〜3 として付ける */}
      <div className={`field attach${attachErrors.length ? " is-invalid" : ""}`} id="attach-field">
        <p className="attach-label" id="attach-label">添付ファイル <span className="opt">任意</span></p>
        <p className="hint" id="attach-hint">画面の写真（スクリーンショット）があると、状況がよく分かります。JPEG・PNG・PDF、1つ5MBまで、3つまで。</p>
        <p className="attach-warn" id="attach-warn">パスワード、QRコード、ほかの方の個人情報が写った画像は、送らないでください。写る場合は、その部分を隠してから添付してください。</p>
        <div className="attach-pick">
          <input ref={attachRef} className="attach-input" id="attach-input" type="file" multiple accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" disabled={files.length >= MAX_FILES} onChange={onPick} aria-labelledby="attach-label attach-button" aria-describedby="attach-hint attach-warn attach-error" />
          <label className="btn btn-ghost attach-button" id="attach-button" htmlFor="attach-input"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5 12.6 20a5.2 5.2 0 0 1-7.4-7.4l8.8-8.8a3.5 3.5 0 0 1 4.9 4.9l-8.8 8.8a1.7 1.7 0 0 1-2.5-2.5l8.1-8.1" /></svg>ファイルを選ぶ</label>
          <span className="attach-count">{files.length} / {MAX_FILES}</span>
        </div>
        {files.length > 0 && (
          <ul className="attach-list" aria-label="添付するファイル">
            {files.map((f, i) => (
              <li className="attach-item" key={`${f.file.name}-${f.file.size}`}>
                <AttachThumb item={f} />
                <span className="attach-meta"><span className="attach-name">{f.file.name}</span><span className="attach-size">{sizeText(f.file.size)}</span></span>
                <button type="button" className="attach-remove" aria-label={`${f.file.name}を外す`} onClick={() => removeFile(i)}>外す</button>
              </li>
            ))}
          </ul>
        )}
        <p className="error-text" id="attach-error" role="status">{attachErrors.join("\n")}</p>
      </div>

      <div className={fieldClass("acceptance-privacy", "agree-wrap")}>
        <label className="agree">
          <input type="checkbox" name="acceptance-privacy" value="1" required checked={agreed} onChange={(e) => setAgreed(e.target.checked)} aria-invalid={invalid("acceptance-privacy")} aria-describedby="agree-error" />
          <span><Link href="/terms-of-service/">利用規約</Link>と<Link href="/privacy-policy/">プライバシーポリシー</Link>を読み、内容に同意して送信します。</span>
        </label>
        <p className="error-text" id="agree-error">送信するには、同意のチェックが必要です。</p>
      </div>

      <div className="form-actions">
        <button className={`btn btn-primary${sending ? " is-sending" : ""}`} type="submit" disabled={!agreed || sending} aria-describedby="submit-note">
          {sending ? "送信しています…" : <>内容を送信する <span aria-hidden="true">→</span></>}
        </button>
        <p className={`fine${agreed ? "" : " is-locked"}`} id="submit-note">
          {agreed ? "送信すると、確認のメールが届きます。" : "利用規約とプライバシーポリシーに同意すると、送信できます。"}
        </p>
      </div>
      <p className={`form-status${status ? " is-error" : ""}`} role="alert" aria-live="assertive">{status}</p>
    </form>
  );
}
