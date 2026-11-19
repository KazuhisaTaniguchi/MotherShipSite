// 見本帳（index.html）だけのスクリプト。
// 値（色のコード・大きさ・コントラスト比・HTML の例）を、ページに直接書かずに、
// いま読み込まれている tokens.css と、見本そのものから取り出して表示する。
// → トークンや部品を直すと、見本帳の表示も一緒に変わる（書き写しのずれが起きない）。
(() => {
  const root = document.documentElement;
  const rootStyle = getComputedStyle(root);

  // ---- 色を数字に直す道具 ----
  const probe = document.createElement('span');
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const toRgba = (value) => {
    probe.style.color = '';
    probe.style.color = value;
    const m = getComputedStyle(probe).color.match(/[\d.]+/g);
    if (!m) return null;
    const n = m.map(Number);
    return { r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 };
  };
  const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const luminance = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const contrast = (a, b) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };

  // ---- 写す（クリックで var(--名前) をコピー） ----
  const toast = document.querySelector('.ds-toast');
  let toastTimer = 0;
  const say = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 1600);
  };
  const copy = (text) => {
    if (!navigator.clipboard) { say(text); return; }
    navigator.clipboard.writeText(text).then(() => say(`${text} をコピーしました`), () => say(text));
  };

  // ---- 色の札：コードを表示 ----
  document.querySelectorAll('.ds-swatch[data-token]').forEach((el) => {
    const name = el.dataset.token;
    const c = toRgba(`var(${name})`);
    const out = el.querySelector('.ds-hex');
    if (c && out) out.textContent = c.a < 1 ? `白 ${Math.round(c.a * 100)}%` : hex(c);
    el.addEventListener('click', () => copy(`var(${name})`));
  });

  // ---- トークンの値をそのまま表示 ----
  document.querySelectorAll('[data-value-of]').forEach((el) => {
    el.textContent = rootStyle.getPropertyValue(el.dataset.valueOf).trim().replace(/\s+/g, ' ');
  });

  // ---- コントラスト比 ----
  document.querySelectorAll('tr[data-fg][data-bg]').forEach((row) => {
    const fg = toRgba(`var(${row.dataset.fg})`);
    const bg = toRgba(`var(${row.dataset.bg})`);
    if (!fg || !bg) return;
    const ratio = contrast(fg, bg);
    const pair = row.querySelector('.ds-pair');
    if (pair) { pair.style.color = hex(fg); pair.style.background = hex(bg); }
    const out = row.querySelector('.ds-ratio');
    if (out) out.textContent = (Math.floor(ratio * 100) / 100).toFixed(2) + ' : 1';
    const grade = row.querySelector('.ds-grade');
    if (grade) {
      const [label, cls] = ratio >= 4.5 ? ['どの大きさでも使える', 'is-ok'] : ratio >= 3 ? ['大きな文字だけ', 'is-large'] : ['文字には使わない', 'is-ng'];
      grade.textContent = label;
      grade.classList.add(cls);
    }
  });

  // ---- 文字の大きさ（いまの画面の幅での実際の値） ----
  const showSizes = () => {
    document.querySelectorAll('.ds-type-row').forEach((row) => {
      const sample = row.querySelector('.ds-type-sample > *') || row.querySelector('.ds-type-sample');
      const out = row.querySelector('.ds-px');
      if (!sample || !out) return;
      const cs = getComputedStyle(sample);
      const px = Math.round(parseFloat(cs.fontSize) * 10) / 10;
      const lh = Math.round((parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)) * 100) / 100;
      out.textContent = `${px}px ／ 太さ ${cs.fontWeight} ／ 行間 ${lh}`;
    });
  };
  showSizes();
  window.addEventListener('resize', showSizes);

  // ---- 部品の見本から、HTML の例を作る ----
  const dedent = (html) => {
    const lines = html.replace(/\t/g, '  ').split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
    return lines.map((l) => l.slice(indent)).join('\n');
  };
  // data-code を付けた要素の中身が、そのまま例になる（例は、見本の枠 .ds-demo のすぐ下に出す）
  document.querySelectorAll('[data-code]').forEach((source) => {
    const details = document.createElement('details');
    details.className = 'ds-code';
    const summary = document.createElement('summary');
    summary.textContent = 'HTML を見る';
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = dedent(source.innerHTML);
    pre.appendChild(code);
    details.append(summary, pre);
    (source.closest('.ds-demo') || source).insertAdjacentElement('afterend', details);
  });

  // ---- 見本の中のメニュー（スマホの幅のとき） ----
  document.querySelectorAll('.ds-demo .menu-toggle').forEach((button) => {
    const nav = button.parentElement.querySelector('.site-nav');
    if (!nav) return;
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
      nav.classList.toggle('is-open', open);
    });
  });
  document.querySelectorAll('.ds-demo a[href="#"]').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));

  // ---- 目次：いま見ている節に印を付ける ----
  const links = new Map();
  document.querySelectorAll('.ds-nav a[href^="#"]').forEach((a) => links.set(a.getAttribute('href').slice(1), a));
  if ('IntersectionObserver' in window && links.size) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        const a = links.get(entry.target.id);
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    links.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }
})();
