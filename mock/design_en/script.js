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
