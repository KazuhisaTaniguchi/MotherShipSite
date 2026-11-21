// メニューの開閉（スマホ）
(() => {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (!button || !nav) return;
  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
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

// HERO：自作のアニメ（イメージ）と、本物の動画への切り替え
// ・ふだんは .demo のアニメを繰り返す（約 22 秒で 1 周）。画面の状態は時刻 t だけで決まる（render）
// ・media/hero-demo.mp4 が読めたら、アニメの代わりに動画を再生する
// ・「視差効果を減らす」の設定では動かさず、Mac の画面が映った場面で止めておく（ボタンで再生できる）
// ・画面の外に出たら止める
(() => {
  const player = document.querySelector('[data-hero-player]');
  if (!player) return;
  const demo = player.querySelector('.demo');
  const video = player.querySelector('video');
  const toggle = player.querySelector('.video-toggle');
  const label = player.querySelector('.d-label');
  const typed = demo.querySelector('.m-text');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const LENGTH = 22000;
  const SCENES = [[0, 'つなぐ'], [3000, 'Macの画面が、手元に'], [7000, 'キーボードで操作'], [11000, '声で入力'], [16000, '向きを変えても、ぴったり']];
  const TEXT = 'あしたの打ち合わせは、15時からに変更でお願いします。';
  const between = (t, a, b) => t >= a && t < b;

  const render = (t) => {
    let scene = 0;
    SCENES.forEach(([start], i) => { if (t >= start) scene = i; });
    demo.dataset.scene = player.dataset.scene = String(scene + 1);
    label.textContent = SCENES[scene][1];
    demo.classList.toggle('is-tap', between(t, 900, 1700));
    demo.classList.toggle('is-connecting', between(t, 1700, 3000));
    demo.classList.toggle('is-finger', between(t, 4000, 6100));
    demo.classList.toggle('is-scrolled', between(t, 4500, 7000));
    demo.classList.toggle('is-cmd', between(t, 8100, 8900) || between(t, 9700, 10300));
    demo.classList.toggle('is-sheet', between(t, 8700, 10100));
    demo.classList.toggle('is-mic', between(t, 11600, 14900));
    // 向きを変える：枠が回る → Mac の画面がその形に作り直される（横向き → 縦向きに戻す）
    player.classList.toggle('is-rot', between(t, 16500, 19800));
    demo.classList.toggle('is-land', between(t, 17500, 20800));
    demo.classList.toggle('is-reflow', between(t, 17250, 17500) || between(t, 20550, 20800));
    const n = Math.max(0, Math.min(TEXT.length, Math.floor((t - 12300) / 90)));
    const text = t >= 11000 ? TEXT.slice(0, n) : '';
    if (typed.textContent !== text) typed.textContent = text;
  };

  let mode = 'demo';          // 'demo' か 'video'
  let userPaused = reduce;
  let visible = true;
  let elapsed = reduce ? 3800 : 0;
  let last = null;
  let raf = 0;

  const frame = (now) => {
    if (last !== null) elapsed += now - last;
    last = now;
    if (elapsed >= LENGTH) {            // 1 周したら、動きを付けずに最初へ戻す
      elapsed %= LENGTH;
      demo.classList.add('is-snap');
      render(elapsed);
      void demo.offsetWidth;
      demo.classList.remove('is-snap');
    } else {
      render(elapsed);
    }
    raf = requestAnimationFrame(frame);
  };
  const demoRunning = () => raf !== 0;
  const startDemo = () => { if (!raf) { last = null; raf = requestAnimationFrame(frame); } demo.classList.remove('is-paused'); };
  const stopDemo = () => { cancelAnimationFrame(raf); raf = 0; demo.classList.add('is-paused'); };

  const isPlaying = () => (mode === 'video' ? !video.paused : demoRunning());
  const renderToggle = () => {
    const what = mode === 'video' ? '動画' : 'アニメーション';
    toggle.setAttribute('aria-label', isPlaying() ? `${what}を一時停止` : `${what}を再生`);
    toggle.classList.toggle('is-paused', !isPlaying());
  };
  const apply = () => {
    const shouldPlay = !userPaused && visible;
    if (mode === 'video') {
      stopDemo();
      if (shouldPlay) video.play().catch(() => {}).finally(renderToggle); else video.pause();
    } else if (shouldPlay) startDemo(); else stopDemo();
    renderToggle();
  };

  toggle.addEventListener('click', () => { userPaused = isPlaying(); apply(); });
  video.addEventListener('loadeddata', () => { mode = 'video'; player.classList.add('has-video'); apply(); });
  video.addEventListener('play', renderToggle);
  video.addEventListener('pause', renderToggle);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; apply(); }, { threshold: 0.2 }).observe(player);
  }
  document.addEventListener('visibilitychange', () => { last = null; });

  demo.classList.add('is-snap');
  render(elapsed);
  void demo.offsetWidth;
  demo.classList.remove('is-snap');
  apply();

  // 確認用：場面を時刻で指定して止める（例：__heroDemo.seek(8800)、または URL に ?demo=8800）
  const at = Number(new URLSearchParams(location.search).get('demo'));
  if (at > 0) { userPaused = true; elapsed = at; demo.classList.add('is-snap'); apply(); render(at); }
  window.__heroDemo = { seek: (t) => { userPaused = true; elapsed = t; apply(); render(t); }, time: () => elapsed, length: LENGTH };
})();

// HERO のアニメ（Fold7、2026-11-21）：一時停止のボタン。押すと .hx に is-paused を付け外しする（アニメは CSS だけで動く）
document.querySelectorAll('[data-hx-pause]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const hx = btn.closest('.hx');
    const paused = hx.classList.toggle('is-paused');
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', paused ? 'アニメーションを再生' : 'アニメーションを一時停止');
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
