// お問い合わせフォーム：入力の確認と送信
// ・送る前に、必須の項目とメールアドレスの形を確かめ、エラーをその項目の下に出す
// ・添付ファイル（任意）は、JPEG・PNG・PDF だけ、1 つ 5MB まで、3 つまで。送るときに your-file-1〜3 として付ける
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

  // reCAPTCHA v3（迷惑メールの送信を防ぐ）。フォームの data-recaptcha-key にサイトキーがあるときだけ読み込む。
  // 送るときに、受け取ったトークンを _wpcf7_recaptcha_response として付ける（判定は Contact Form 7 が行う）
  const RECAPTCHA_KEY = form.dataset.recaptchaKey || '';
  if (RECAPTCHA_KEY) {
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_KEY)}`;
    s.async = true;
    document.head.appendChild(s);
  }
  const recaptchaToken = () => new Promise((resolve) => {
    const g = window.grecaptcha;
    if (!RECAPTCHA_KEY || !g) { resolve(''); return; }
    const timer = setTimeout(() => resolve(''), 8000);
    g.ready(() => g.execute(RECAPTCHA_KEY, { action: 'contactform' }).then(
      (token) => { clearTimeout(timer); resolve(token); },
      () => { clearTimeout(timer); resolve(''); },
    ));
  });

  // 同意のチェックが入っているときだけ、送信ボタンを押せるようにする
  const agree = form.querySelector('[name="acceptance-privacy"]');
  const submitNote = document.getElementById('submit-note');
  let sending = false;
  const updateSubmit = () => {
    const agreed = agree.checked;
    submit.disabled = !agreed || sending;
    submit.classList.toggle('is-sending', sending);
    submitNote.classList.toggle('is-locked', !agreed);
    submitNote.textContent = agreed
      ? 'We\'ll send a confirmation email when you submit.'
      : 'Agree to the Terms of Service and Privacy Policy to send your message.';
  };
  agree.addEventListener('change', updateSubmit);
  updateSubmit();

  // ---- 添付ファイル（JPEG・PNG・PDF、1 つ 5MB まで、3 つまで）----
  // 拡張子と、ファイルの先頭の数バイト（中身の種類）の両方を確かめる。WordPress の側でも、もう一度確かめる
  const MAX_FILES = 3;
  const MAX_BYTES = 5 * 1024 * 1024;
  const KINDS = { jpg: 'jpeg', jpeg: 'jpeg', png: 'png', pdf: 'pdf' };
  const attachInput = document.getElementById('attach-input');
  const attachList = document.getElementById('attach-list');
  const attachCount = document.getElementById('attach-count');
  const attachError = document.getElementById('attach-error');
  const attachField = document.getElementById('attach-field');
  let files = [];   // { file, url }
  const sizeText = (n) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);
  const sniff = async (file) => {
    const b = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
    if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return 'pdf';   // %PDF
    return '';
  };
  const showAttachError = (messages) => {
    attachError.textContent = messages.join('\n');
    attachField.classList.toggle('is-invalid', messages.length > 0);
  };
  const renderAttach = () => {
    attachList.textContent = '';
    files.forEach((f, i) => {
      const li = document.createElement('li');
      li.className = 'attach-item';
      const thumb = document.createElement('span');
      thumb.className = 'attach-thumb';
      if (f.url) { const img = document.createElement('img'); img.alt = ''; img.onerror = () => { thumb.textContent = 'IMG'; }; img.src = f.url; thumb.append(img); } else thumb.textContent = 'PDF';
      const meta = document.createElement('span');
      meta.className = 'attach-meta';
      meta.innerHTML = '<span class="attach-name"></span><span class="attach-size"></span>';
      meta.firstChild.textContent = f.file.name;
      meta.lastChild.textContent = sizeText(f.file.size);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'attach-remove';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${f.file.name}`);
      remove.addEventListener('click', () => {
        if (files[i].url) URL.revokeObjectURL(files[i].url);
        files.splice(i, 1);
        showAttachError([]);
        renderAttach();
        attachInput.focus();
      });
      li.append(thumb, meta, remove);
      attachList.append(li);
    });
    attachCount.textContent = `${files.length} / ${MAX_FILES}`;
    attachInput.disabled = files.length >= MAX_FILES;
  };
  attachInput.addEventListener('change', async () => {
    const picked = [...attachInput.files];
    attachInput.value = '';   // 同じファイルを、外したあとにもう一度選べるように
    const errors = [];
    for (const file of picked) {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      if (files.some((f) => f.file.name === file.name && f.file.size === file.size)) continue;
      if (files.length >= MAX_FILES) { errors.push(`You can attach up to ${MAX_FILES} files.`); break; }
      if (!KINDS[ext]) { errors.push(`“${file.name}”: only JPEG, PNG, and PDF files can be attached.`); continue; }
      if (file.size > MAX_BYTES) { errors.push(`“${file.name}”: this file is larger than 5 MB and can't be attached (${sizeText(file.size)}).`); continue; }
      if ((await sniff(file)) !== KINDS[ext]) { errors.push(`“${file.name}”: this file doesn't appear to be a JPEG, PNG, or PDF.`); continue; }
      files.push({ file, url: KINDS[ext] === 'pdf' ? '' : URL.createObjectURL(file) });
    }
    showAttachError(errors);
    renderAttach();
  });
  renderAttach();

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
      status.textContent = `Please check the highlighted ${invalid.length === 1 ? 'field' : 'fields'} (${invalid.length}).`;
      status.classList.add('is-error');
      return;
    }

    const id = form.dataset.cf7Id;
    if (!id) {            // モック：送らない
      showDone();
      return;
    }

    sending = true;
    updateSubmit();
    try {
      const body = new FormData(form);
      body.append('_wpcf7_unit_tag', `wpcf7-f${id}-o1`);   // Contact Form 7 の 5.8 以降で必要
      files.forEach((f, i) => body.append(`your-file-${i + 1}`, f.file));   // Contact Form 7 のファイルの項目（your-file-1〜3）
      const token = await recaptchaToken();
      if (token) body.append('_wpcf7_recaptcha_response', token);
      const res = await fetch(`${API_BASE}${id}/feedback`, { method: 'POST', body });
      const json = await res.json();
      if (json.status === 'mail_sent') {
        showDone();
      } else {
        // 項目ごとのエラー（Contact Form 7 の判定）を、その項目の下に出す
        (json.invalid_fields || []).forEach((f) => {
          if (/^your-file-/.test(f.field)) { showAttachError([f.message]); return; }   // 添付ファイルのエラー
          const el = form.querySelector(`[name="${f.field}"], [name="${f.field}[]"]`);
          if (el) check(el) || wrapOf(el)?.classList.add('is-invalid');
        });
        throw new Error(json.message || 'Your message couldn\'t be sent.');
      }
    } catch (err) {
      status.textContent = `Your message couldn't be sent. Please wait a moment and try again. (${err.message})`;
      status.classList.add('is-error');
    } finally {
      sending = false;
      updateSubmit();
    }
  });
})();
