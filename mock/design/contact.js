// お問い合わせフォーム：入力の確認と送信
// ・送る前に、必須の項目とメールアドレスの形を確かめ、エラーをその項目の下に出す
// ・送信先は WordPress の Contact Form 7 の REST API（フォームの data-cf7-id にフォームの ID を入れる）
//     POST https://api.mothershipremote.com/wp-json/contact-form-7/v1/contact-forms/{ID}/feedback
//   ID が空のとき（このモック）は送らずに、送信できたときの表示だけを見せる
(() => {
  const form = document.getElementById('contact-form');
  const done = document.getElementById('form-done');
  if (!form || !done) return;
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('button[type="submit"]');
  const API_BASE = 'https://api.mothershipremote.com/wp-json/contact-form-7/v1/contact-forms/';
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const wrapOf = (el) => el.closest('.field, .agree-wrap');
  const isValid = (el) => {
    if (el.type === 'checkbox') return el.checked;
    const value = el.value.trim();
    if (!value) return false;
    if (el.type === 'email') return EMAIL.test(value);
    return true;
  };
  const check = (el) => {
    const ok = isValid(el);
    wrapOf(el)?.classList.toggle('is-invalid', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  };
  const required = () => [...form.querySelectorAll('[required]')];

  // 一度エラーになった項目は、直したらすぐにエラーを消す
  form.addEventListener('input', (e) => {
    if (e.target.matches('[required]') && wrapOf(e.target)?.classList.contains('is-invalid')) check(e.target);
  });
  form.addEventListener('change', (e) => {
    if (e.target.matches('[required]') && wrapOf(e.target)?.classList.contains('is-invalid')) check(e.target);
  });

  const showDone = () => {
    form.hidden = true;
    done.hidden = false;
    done.focus();
    done.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    status.classList.remove('is-error');
    const invalid = required().filter((el) => !check(el));
    if (invalid.length) {
      invalid[0].focus();
      status.textContent = `入力の内容を確かめてください（${invalid.length}か所）。`;
      status.classList.add('is-error');
      return;
    }

    const id = form.dataset.cf7Id;
    if (!id) {            // モック：送らない
      showDone();
      return;
    }

    submit.disabled = true;
    try {
      const body = new FormData(form);
      body.append('_wpcf7_unit_tag', `wpcf7-f${id}-o1`);   // Contact Form 7 の 5.8 以降で必要
      const res = await fetch(`${API_BASE}${id}/feedback`, { method: 'POST', body });
      const json = await res.json();
      if (json.status === 'mail_sent') {
        showDone();
      } else {
        // 項目ごとのエラー（Contact Form 7 の判定）を、その項目の下に出す
        (json.invalid_fields || []).forEach((f) => {
          const el = form.querySelector(`[name="${f.field}"], [name="${f.field}[]"]`);
          if (el) check(el) || wrapOf(el)?.classList.add('is-invalid');
        });
        throw new Error(json.message || '送信できませんでした。');
      }
    } catch (err) {
      status.textContent = `送信できませんでした。時間をおいて、もう一度お試しください。（${err.message}）`;
      status.classList.add('is-error');
    } finally {
      submit.disabled = false;
    }
  });
})();
