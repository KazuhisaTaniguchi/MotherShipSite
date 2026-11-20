"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

// お問い合わせフォーム（mock/design/contact.html のフォームと contact.js を React にしたもの）
// 送信先：WordPress の Contact Form 7 の REST API
//   POST {NEXT_PUBLIC_WORDPRESS_URL}/wp-json/contact-form-7/v1/contact-forms/{ID}/feedback
// ID は環境変数 NEXT_PUBLIC_CF7_CONTACT_FORM_ID（ビルドのときに埋め込まれる）。
// ID が無いあいだは送らない（「送信しました」と見せかけない）。
const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://api.mothershipremote.com";
const FORM_ID = process.env.NEXT_PUBLIC_CF7_CONTACT_FORM_ID ?? "";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RequiredName = "inquiry-type" | "your-name" | "your-email" | "your-subject" | "your-message" | "acceptance-privacy";
const REQUIRED: RequiredName[] = ["inquiry-type", "your-name", "your-email", "your-subject", "your-message", "acceptance-privacy"];

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
  const [done, setDone] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);

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
      const res = await fetch(`${WP_URL}/wp-json/contact-form-7/v1/contact-forms/${FORM_ID}/feedback`, { method: "POST", body });
      const json = (await res.json()) as Cf7Response;
      if (json.status === "mail_sent") {
        setDone(true);
        return;
      }
      // 項目ごとのエラー（Contact Form 7 の判定）を、その項目の下に出す
      const fromServer: Record<string, boolean> = {};
      (json.invalid_fields ?? []).forEach((f) => { fromServer[f.field.replace(/\[\]$/, "")] = true; });
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

      <div className={fieldClass("acceptance-privacy", "agree-wrap")}>
        <label className="agree">
          <input type="checkbox" name="acceptance-privacy" value="1" required aria-invalid={invalid("acceptance-privacy")} aria-describedby="agree-error" />
          <span><Link href="/terms-of-service/">利用規約</Link>と<a href="#">プライバシーポリシー</a><span className="tbd">【未確定：URL】</span>を読み、内容に同意して送信します。</span>
        </label>
        <p className="error-text" id="agree-error">送信するには、同意のチェックが必要です。</p>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? "送信しています…" : <>内容を送信する <span aria-hidden="true">→</span></>}
        </button>
        <p className="fine">送信すると、確認のメールが届きます。</p>
      </div>
      <p className={`form-status${status ? " is-error" : ""}`} role="alert" aria-live="assertive">{status}</p>
    </form>
  );
}
