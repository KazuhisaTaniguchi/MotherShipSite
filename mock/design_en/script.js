// メニューの開閉（スマホ）
(() => {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (!button || !nav) return;
  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  };
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) setOpen(false); });
})();

// ヘッダー：スクロールしたら背景を付ける
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// HERO のアニメ（Fold7、2026-11-21）：一時停止のボタン。押すと .hx に is-paused を付け外しする（アニメは CSS だけで動く）
document.querySelectorAll('[data-hx-pause]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const hx = btn.closest('.hx');
    const paused = hx.classList.toggle('is-paused');
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
  });
});

// 図の動き（2026-11-21）：画面の外にある図は止める。動く図が見えている間だけ、左下に「図の動きを止める」ボタンを出す
// ・動く図のある節（HERO 以外）に data-motion、画面の外にある間は data-offscreen を付ける（止めるのは CSS：designSystem/components.css）
// ・ボタンで止めると html に motion-paused を付け、localStorage に覚える（次に開いたときも止まったまま）
// ・「視差効果を減らす」の設定では、図はもともと止まっているので、ボタンは出さない（CSS で隠す）
(() => {
  if (!('IntersectionObserver' in window)) return;
  const en = document.documentElement.lang.startsWith('en');
  const KEY = 'mothership-motion-paused';
  const label = (paused) => (paused ? (en ? 'Play animations' : '図を動かす') : (en ? 'Pause animations' : '図の動きを止める'));
  const sections = [...document.querySelectorAll('main section, main aside')].filter((s) => !s.closest('.hero') && (!s.getAnimations || s.getAnimations({ subtree: true }).length > 0));
  if (!sections.length) return;
  let paused = false;
  try { paused = localStorage.getItem(KEY) === '1'; } catch (e) { /* 保存できない環境では覚えない */ }
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'motion-toggle';
  btn.innerHTML = '<span class="motion-toggle-icon" aria-hidden="true"></span><span class="motion-toggle-text"></span>';
  const render = () => { document.documentElement.classList.toggle('motion-paused', paused); btn.querySelector('.motion-toggle-text').textContent = label(paused); };
  btn.addEventListener('click', () => { paused = !paused; try { localStorage.setItem(KEY, paused ? '1' : '0'); } catch (e) { /* 何もしない */ } render(); });
  render();
  document.body.appendChild(btn);
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { e.target.toggleAttribute('data-offscreen', !e.isIntersecting); if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
    btn.classList.toggle('is-shown', visible.size > 0);
  }, { rootMargin: '0px 0px -15% 0px' });
  sections.forEach((s) => { s.setAttribute('data-motion', ''); io.observe(s); });
})();

// ---- setup-video:start ----
// セットアップ動画（英語版。2026-11-27）：figure[data-setup-video] のプレーヤー。日本語のモック（../design/script.js）と同じ動きで、文だけ英語。
// ここから「setup-video:end」までを、frontend/scripts/sync-en.py が本番の public/en/en.js に写す（再生の開始と終わりを GA に送る行は、本番だけで効く）
// ・動画のテロップは下の端にある。ブラウザーの再生バーはそこに重なるので、操作は動画の下に自前で出す（JavaScript が動かないときは controls のまま）
// ・data-chapters="秒:名前|秒:名前…" のボタンで、そのステップへ飛ぶ（秒は tools/setup-video/stage.html の場面の頭）
// ・モックは 1280×720 だけ。本番は、広い画面で 1920×1080 も使う
document.querySelectorAll('figure[data-setup-video]').forEach((fig) => {
  const player = fig.querySelector('.sv-player'), frame = fig.querySelector('.sv-frame'), video = fig.querySelector('video');
  if (!player || !frame || !video) return;
  const { title, length } = fig.dataset;
  const duration = parseFloat(fig.dataset.duration);
  const chapters = fig.dataset.chapters.split('|').map((c) => { const i = c.indexOf(':'); return { t: parseFloat(c.slice(0, i)), label: c.slice(i + 1) }; });
  const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const spoken = (s) => (s >= 60 ? `${Math.floor(s / 60)} min ${Math.floor(s % 60)} sec` : `${Math.floor(s)} sec`);
  const el = (tag, cls, attrs = {}) => { const e = document.createElement(tag); if (cls) e.className = cls; Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); return e; };
  const FULL = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V3h4M17 7V3h-4M3 13v4h4M17 13v4h-4"/></svg>';
  const UNFULL = FULL.replace(/d="[^"]+"/, 'd="M7 3v4H3M13 3v4h4M7 17v-4H3M13 17v-4h4"');

  video.controls = false;
  player.setAttribute('data-ready', '');

  const start = el('button', 'sv-start', { type: 'button', 'aria-label': `Play video: ${title} (${length})` });
  start.innerHTML = `<span class="sv-start-pill"><span class="sv-ico-play" aria-hidden="true"></span>Watch the video<small>${length}</small></span>`;
  frame.appendChild(start);

  const bar = el('div', 'sv-bar');
  const playBtn = el('button', 'sv-btn', { type: 'button', 'aria-label': 'Play' });
  const playIco = el('span', 'sv-ico-play', { 'aria-hidden': 'true' });
  playBtn.appendChild(playIco);
  const range = el('input', 'sv-seek', { type: 'range', min: '0', max: String(duration), step: '0.1', value: '0', 'aria-label': 'Playback position' });
  const timeText = el('span', 'sv-time', { 'aria-hidden': 'true' });
  const fullBtn = el('button', 'sv-btn', { type: 'button', 'aria-label': 'Full screen' });
  fullBtn.innerHTML = FULL;
  bar.append(playBtn, range, timeText, fullBtn);

  const list = el('ol', 'sv-chapters', { 'aria-label': 'Jump to a step' });
  const chips = chapters.map((c) => {
    const li = el('li'), b = el('button', '', { type: 'button' });
    b.textContent = c.label;
    b.addEventListener('click', () => seek(c.t, true));
    li.appendChild(b); list.appendChild(li);
    return b;
  });
  player.append(bar, list);

  const show = (t) => {
    const x = Math.min(t, duration);
    range.value = String(x);
    range.style.setProperty('--sv-pos', `${(x / duration) * 100}%`);
    range.setAttribute('aria-valuetext', `${spoken(x)} of ${spoken(Math.round(duration))}`);
    timeText.textContent = `${clock(x)} / ${clock(Math.round(duration))}`;
    const cur = chapters.reduce((found, c, i) => (x >= c.t - 0.05 ? i : found), -1);
    chips.forEach((b, i) => { if (i === cur) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  };
  const toggle = () => { if (video.paused) video.play().catch(() => {}); else video.pause(); };
  // まだ読み込んでいない動画は、長さが分かってから位置を合わせる
  function seek(t, play) {
    const set = () => { video.currentTime = t; };
    if (video.readyState >= 1) set(); else video.addEventListener('loadedmetadata', set, { once: true });
    show(t);
    if (play) video.play().catch(() => {}); else if (video.readyState < 1) video.load();
  }
  const setPlaying = (on) => { playIco.className = on ? 'sv-ico-pause' : 'sv-ico-play'; playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play'); };

  start.addEventListener('click', toggle);
  video.addEventListener('click', toggle);
  playBtn.addEventListener('click', toggle);
  range.addEventListener('input', () => seek(parseFloat(range.value), false));
  video.addEventListener('play', () => {
    document.querySelectorAll('video').forEach((o) => { if (o !== video) o.pause(); });   // ほかの動画は止める
    if (start.isConnected && window.gtag) window.gtag('event', 'video_start', { video_title: title, video_provider: 'self' });
    start.remove();
    setPlaying(true);
  });
  video.addEventListener('pause', () => setPlaying(false));
  video.addEventListener('ended', () => { setPlaying(false); if (window.gtag) window.gtag('event', 'video_complete', { video_title: title, video_provider: 'self' }); });
  video.addEventListener('timeupdate', () => show(video.currentTime));
  fullBtn.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (player.requestFullscreen) player.requestFullscreen().catch(() => {});
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();   // iPhone：動画だけを全画面にできる（操作は iOS のもの）
  });
  document.addEventListener('fullscreenchange', () => {
    const on = document.fullscreenElement === player;
    fullBtn.innerHTML = on ? UNFULL : FULL;
    fullBtn.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
  });
  show(0);
});
// ---- setup-video:end ----
