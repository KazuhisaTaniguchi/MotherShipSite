// HERO のアニメの 4 案（くらべて選ぶための一時的なファイル。案が決まったら script.js に移して消す）
// ・index.html の HERO（.hero）を 4 つに増やし、それぞれに案 A〜D のアニメを入れる
// ・画面の状態は時刻 t だけで決まる（render）。案ごとの違いは、下の VARIANTS の「場面」と「クラスを付ける時刻」だけ
// ・確認用：URL に ?demo=15000 を付けると、4 案ともその時刻（ミリ秒）で止まる。__heroDemo.a.seek(15000) でも止められる
// ・本物の動画（media/hero-demo.mp4）への切り替えは、この 4 案には入れていない（案が決まってから戻す）
(() => {
  const hero = document.querySelector('.hero');
  const first = hero && hero.querySelector('[data-hv]');
  if (!first) return;

  const T1 = 'あしたの打ち合わせは、15時からに変更でお願いします。';
  const T2 = '資料は、このあとすぐに送ります。';

  // MacBook の場面（メニューバーのアイコン → 端末を追加 → QR コード）。s は始まりの時刻、k は速さ（1 がふつう）
  const macIntro = (k = 1, qrUntil = null) => {
    const m = (t) => Math.round(t * k);
    const end = m(4700);
    return {
      end,
      lap: {
        'is-cur-icon': [[m(600), m(2200)]],
        'is-click': [[m(1300), m(1550)], [m(3000), m(3250)]],
        'is-menu': [[m(1450), m(3300)]],
        'is-cur-add': [[m(2200), qrUntil ?? end]],
        'is-qr': [[m(3200), qrUntil ?? end]],
      },
    };
  };
  // 向きを変える場面（横向き → 縦向きに戻す）
  const rotate = (s) => ({
    pad: { 'is-rot': [[s + 500, s + 3800]] },
    demo: { 'is-land': [[s + 1500, s + 4800]], 'is-reflow': [[s + 1250, s + 1500], [s + 4550, s + 4800]] },
  });

  const VARIANTS = (() => {
    const out = {};

    // 案 A：順番に、ていねいに
    {
      const mac = macIntro(); const L = 26500; const rot = rotate(20000);
      out.a = {
        name: '順番に、ていねいに',
        note: 'MacBookでアイコンを押して「端末を追加」→ 消えて、iPadが縦向きで登場 →「つなぐ」→ メモとグラフ → 声で入力 → 向きを変える。ご指定の流れを、そのまま 1 つずつ見せる基本の案です。',
        length: L, still: 9000, badge: '<mark>キーボードいらず。</mark>話すだけ',
        scenes: [[0, 'Macで、端末を追加'], [4700, 'iPadから、つなぐ'], [8200, 'Macの画面が、手元に'], [13000, '声で入力。キーボードいらず'], [20000, '向きを変えても、ぴったり']],
        root: { 'is-mac': [[0, mac.end]], 'is-pad': [[mac.end - 200, L]], 'is-badge': [[14200, 19600]] },
        lap: mac.lap,
        pad: rot.pad,
        demo: { 'is-tap': [[5900, 6600]], 'is-connecting': [[6600, 8200]], 'is-live': [[8200, L]], 'is-sheet': [[10200, 12400]], 'is-voice': [[13000, 19800]], 'is-mic': [[13800, 17400]], 'is-enter': [[18000, 18500]], ...rot.demo },
        text: T1, typing: [{ at: 14400, per: 95, upto: T1.length }],
      };
    }

    // 案 B：2 台のつながりを見せる（MacBook を小さく残す）
    {
      const L = 26500; const mac = macIntro(1, 8200); const rot = rotate(20000);
      out.b = {
        name: '2台のつながりを見せる',
        note: '流れは案 A と同じですが、MacBookを消さずに、小さくして左上に残します。QRコードを出したまま待ち、つながると「iPadから操作中」に変わります。「離れたMacを、手元のiPadで動かしている」関係が、ずっと見えます。',
        length: L, still: 9000, badge: '<mark>キーボードいらず。</mark>話すだけ',
        scenes: [[0, 'Macで、端末を追加'], [4700, 'iPadから、つなぐ'], [8200, 'Macの画面が、手元に'], [13000, '声で入力。キーボードいらず'], [20000, '向きを変えても、ぴったり']],
        root: { 'is-mac': [[0, 4700]], 'is-pad': [[4500, L]], 'is-badge': [[14200, 19600]] },
        lap: { ...mac.lap, 'is-linked': [[8200, L]] },
        pad: rot.pad,
        demo: { 'is-tap': [[5900, 6600]], 'is-connecting': [[6600, 8200]], 'is-live': [[8200, L]], 'is-sheet': [[10200, 12400]], 'is-voice': [[13000, 19800]], 'is-mic': [[13800, 17400]], 'is-enter': [[18000, 18500]], ...rot.demo },
        text: T1, typing: [{ at: 14400, per: 95, upto: T1.length }],
      };
    }

    // 案 C：声が主役（準備は短く、声の場面を長く）
    {
      const mac = macIntro(0.83); const L = 26000; const rot = rotate(19600);
      const full = `${T1}\n${T2}`;
      out.c = {
        name: '声が主役',
        note: 'MacBookとつなぐ場面を短くして、声で入力する場面を長くとります。話した言葉を吹き出しで出し、それがMacに文字として入る様子を 2 回くり返します。1 文目のあと、バーの「Enter」で改行します。',
        length: L, still: 8000, badge: '話すだけ。<mark>キーボードいらず。</mark>',
        scenes: [[0, 'Macで、端末を追加'], [3900, 'iPadから、つなぐ'], [6600, 'Macの画面が、手元に'], [9600, '声で入力。キーボードいらず'], [19600, '向きを変えても、ぴったり']],
        root: { 'is-mac': [[0, mac.end]], 'is-pad': [[mac.end - 200, L]], 'is-badge': [[10400, 19200]], 'is-bubble': [[10600, 13600], [15000, 17600]] },
        lap: mac.lap,
        pad: rot.pad,
        demo: { 'is-tap': [[4700, 5300]], 'is-connecting': [[5300, 6600]], 'is-live': [[6600, L]], 'is-sheet': [[7800, 9200]], 'is-voice': [[9600, 19400]], 'is-mic': [[10400, 13600], [14900, 17600]], 'is-enter': [[13900, 14400], [17900, 18400]], ...rot.demo },
        text: full, typing: [{ at: 11000, per: 85, upto: T1.length }, { at: 14150, per: 1, upto: T1.length + 1 }, { at: 15400, per: 85, upto: full.length }],
        bubbles: [[10600, `「${T1}」`], [15000, `「${T2}」`]],
      };
    }

    // 案 D：キーボードとくらべる（QR コードの読み取りも見せる）
    {
      const mac = macIntro(); const L = 30000; const rot = rotate(23400);
      out.d = {
        name: 'キーボードとくらべる',
        note: 'iPadでMacのQRコードを読み取る場面を入れます。つないだあと、まず画面のキーボードで少しずつ打ち、そのあとキーボードをしまって声に切り替えると、残りが一気に入ります。「キーボードいらず」を、くらべて伝える案です（いちばん長い 30 秒）。',
        length: L, still: 10500, badge: 'キーボードは、<mark>しまったままで。</mark>',
        scenes: [[0, 'Macで、QRコードを出す'], [4700, 'iPadで読み取って、つなぐ'], [9600, 'Macの画面が、手元に'], [13200, 'キーボードで打つと…'], [17200, '声なら、話すだけ'], [23400, '向きを変えても、ぴったり']],
        root: { 'is-mac': [[0, mac.end]], 'is-pad': [[mac.end - 200, L]], 'is-badge': [[18000, 23000]] },
        lap: mac.lap,
        pad: rot.pad,
        demo: { 'is-scan': [[4500, 6900]], 'is-reg': [[6700, 8000]], 'is-tap': [[7700, 8300]], 'is-connecting': [[8300, 9600]], 'is-live': [[9600, L]], 'is-sheet': [[11000, 12800]], 'is-keys': [[13200, 17000]], 'is-voice': [[17200, 23200]], 'is-mic': [[17900, 21000]], 'is-enter': [[21500, 22000]], ...rot.demo },
        text: T1, typing: [{ at: 14000, per: 420, upto: 6 }, { at: 18400, per: 85, upto: T1.length }],
      };
    }
    return out;
  })();

  // QR コードの絵（本物ではない。読み取れない模様）
  const qr = () => {
    const N = 11; let cells = '';
    const finder = (x, y) => [[0, 0], [N - 3, 0], [0, N - 3]].some(([fx, fy]) => x >= fx && x < fx + 3 && y >= fy && y < fy + 3 && !(x === fx + 1 && y === fy + 1 && false));
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const on = finder(x, y) || ((x * 7 + y * 13 + x * y * 3) % 5 < 2 && !(x < 4 && y < 4) && !(x > N - 5 && y < 4) && !(x < 4 && y > N - 5));
      cells += `<i${on ? ' class="on"' : ''}></i>`;
    }
    return `<div class="hv-qr">${cells}</div>`;
  };
  const rep = (n, s = '<i></i>') => s.repeat(n);

  const template = (v) => `
    <div class="hv-stage">
      <div class="hv-laptop" aria-hidden="true">
        <div class="hv-lscreen"><div class="lm-in">
          <div class="lm-bar"><b></b><span>Finder</span><span>ファイル</span><span>編集</span><i class="lm-icon"></i><em>9:41</em></div>
          <div class="lm-win">${rep(7)}</div>
          <div class="lm-menu"><p class="lm-head">Mothership Host</p><p class="lm-state"><i></i>待機中</p><hr><p class="lm-add">端末を追加…</p><p>登録済みの端末</p><p>設定…</p></div>
          <div class="lm-qr"><h4>端末を追加</h4>${qr()}<p>iPadのMothershipで<br>QRコードを読み取ります</p></div>
          <div class="lm-linked"><i></i>iPadから操作中</div>
          <span class="lm-click"></span><span class="lm-cursor"></span>
        </div></div>
        <div class="hv-lbase"></div>
      </div>
      <figure class="phone tablet hero-phone hv-pad" role="img" aria-label="Mothershipの使い方のイメージ。Macで端末を追加し、iPadからつなぐと、Macの画面がiPadに映る。声で話すと、Macに文字が入る。iPadの向きを変えると、Macの画面もその形に変わる">
        <div class="phone-screen">
          <div class="demo" data-scene="1" aria-hidden="true">
            <div class="d-connect">
              <img src="../contents/images/app-ipad-connect-portrait.png" alt="" width="1640" height="2360">
              <div class="d-list"><p>登録済みのMac</p><div class="d-host"><b>Mac mini</b><span>自宅のMac</span><em>つなぐ</em></div></div>
              <span class="d-tap"></span>
              <div class="d-connecting"><i></i>接続中…</div>
            </div>
            <div class="d-scan"><div class="d-scan-frame">${qr()}<span class="d-scan-line"></span></div><p>MacのQRコードを読み取ります</p></div>
            <div class="d-reg">✓ Mac mini を登録しました</div>
            <div class="d-live">
              <div class="d-mac">
                <div class="m-menubar"><b></b><span>ファイル</span><span>編集</span><span>表示</span><i>9:41</i></div>
                <div class="m-window m-doc">
                  <div class="m-title"><i></i><i></i><i></i><span>メモ</span></div>
                  <div class="m-body"><div class="m-scroll">
                    <h4>打ち合わせメモ</h4>
                    <p class="m-typed"><span class="m-text"></span><span class="m-caret"></span></p>
                    <ul>${rep(8, '<li></li>')}</ul>
                    <div class="m-fig"></div>
                    <ul>${rep(4, '<li></li>')}</ul>
                  </div></div>
                </div>
                <div class="m-window m-sheet">
                  <div class="m-title"><i></i><i></i><i></i><span>グラフ</span></div>
                  <div class="m-body"><div class="m-bars">${rep(6)}</div></div>
                </div>
                <div class="m-dock">${rep(5)}</div>
              </div>
              <div class="d-keys">
                <div class="k-bar"><span>コピー</span><span>ペースト</span><span class="k-switch">アプリ切替</span><span>Spotlight</span></div>
                <div class="k-row">${'qwertyuiop'.split('').map((c) => `<i>${c}</i>`).join('')}</div>
                <div class="k-row">${'asdfghjkl'.split('').map((c) => `<i>${c}</i>`).join('')}</div>
                <div class="k-row"><i>⇧</i>${'zxcvbnm'.split('').map((c) => `<i>${c}</i>`).join('')}<i>⌫</i></div>
                <div class="k-row k-mod"><i>⌃</i><i>⌥</i><i class="k-cmd">⌘</i><i class="k-space"></i><i class="k-tab">⇥</i><i>⏎</i></div>
              </div>
              <!-- 音声入力のバー：ボタン 6 個（🎤・削除・Enter・Tab・コピー・ペースト） -->
              <div class="d-vbar"><span class="v-grip">≡</span><div class="v-wave">${rep(6)}</div><span class="v-key v-mic">🎤</span><span class="v-key">⌫</span><span class="v-key v-enter">⏎</span><span class="v-key">⇥</span><span class="v-key v-copy"><small>コピー</small></span><span class="v-key"><small>ペースト</small></span></div>
            </div>
          </div>
        </div>
      </figure>
      <div class="hv-bubble" aria-hidden="true"></div>
      <div class="hv-badge" aria-hidden="true">${v.badge}</div>
    </div>
    <div class="demo-bar">
      <button class="video-toggle" type="button" aria-label="アニメーションを一時停止"><span class="icon-pause" aria-hidden="true"></span></button>
      <span class="d-label" aria-hidden="true"></span>
      <span class="d-dots" aria-hidden="true">${rep(v.scenes.length)}</span>
    </div>
    <p class="demo-note">イメージです（実際の画面とは異なります）</p>`;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const at = Number(new URLSearchParams(location.search).get('demo'));
  const inRanges = (ranges, t) => ranges.some(([a, b]) => t >= a && t < b);
  window.__heroDemo = {};

  const start = (root, key) => {
    const v = VARIANTS[key];
    root.dataset.variant = key;
    root.innerHTML = template(v);
    const el = { root, lap: root.querySelector('.lm-in'), pad: root.querySelector('.hv-pad'), demo: root.querySelector('.demo') };
    const toggle = root.querySelector('.video-toggle');
    const label = root.querySelector('.d-label');
    const typed = root.querySelector('.m-text');
    const bubble = root.querySelector('.hv-bubble');

    const render = (t) => {
      let scene = 0;
      v.scenes.forEach(([s], i) => { if (t >= s) scene = i; });
      root.dataset.scene = String(scene + 1);
      label.textContent = v.scenes[scene][1];
      ['root', 'lap', 'pad', 'demo'].forEach((target) => {
        Object.entries(v[target] || {}).forEach(([cls, ranges]) => el[target].classList.toggle(cls, inRanges(ranges, t)));
      });
      let n = 0; let base = 0;
      v.typing.forEach((seg) => { if (t >= seg.at) n = Math.min(seg.upto, base + Math.floor((t - seg.at) / seg.per) + 1); base = seg.upto; });
      const text = v.text.slice(0, n);
      if (typed.textContent !== text) typed.textContent = text;
      (v.bubbles || []).forEach(([s, words]) => { if (t >= s && bubble.textContent !== words) bubble.textContent = words; });
    };

    let userPaused = reduce || at > 0;
    let visible = true;
    let elapsed = at > 0 ? at % v.length : (reduce ? v.still : 0);
    let last = null;
    let raf = 0;
    const snap = (t) => { root.classList.add('is-snap'); el.demo.classList.add('is-snap'); render(t); void root.offsetWidth; root.classList.remove('is-snap'); el.demo.classList.remove('is-snap'); };
    const frame = (now) => {
      if (last !== null) elapsed += now - last;
      last = now;
      if (elapsed >= v.length) { elapsed %= v.length; snap(elapsed); } else render(elapsed);
      raf = requestAnimationFrame(frame);
    };
    const running = () => raf !== 0;
    const setPaused = (p) => { el.demo.classList.toggle('is-paused', p); root.classList.toggle('is-paused-all', p); };
    const play = () => { if (!raf) { last = null; raf = requestAnimationFrame(frame); } setPaused(false); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; setPaused(true); };
    const apply = () => {
      if (!userPaused && visible) play(); else stop();
      toggle.setAttribute('aria-label', running() ? 'アニメーションを一時停止' : 'アニメーションを再生');
      toggle.classList.toggle('is-paused', !running());
    };
    toggle.addEventListener('click', () => { userPaused = running(); apply(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; apply(); }, { threshold: 0.2 }).observe(root);
    }
    document.addEventListener('visibilitychange', () => { last = null; });
    snap(elapsed);
    apply();
    window.__heroDemo[key] = { seek: (t) => { userPaused = true; elapsed = t; apply(); snap(t); }, time: () => elapsed, length: v.length };
  };

  // HERO を 4 つに増やして、案の名前と説明を付ける
  const keys = Object.keys(VARIANTS);
  const sections = keys.map((key, i) => {
    const section = i === 0 ? hero : hero.cloneNode(true);
    if (i > 0) {
      section.classList.add('is-clone');
      section.querySelectorAll('[id]').forEach((n) => { n.id = `${n.id}-${key}`; });
      section.setAttribute('aria-labelledby', `hero-title-${key}`);
    }
    section.id = `hero-${key}`;
    return section;
  });
  sections.forEach((section, i) => {
    const key = keys[i];
    if (i > 0) sections[i - 1].after(section);
    const pick = document.createElement('div');
    pick.className = 'wrap';
    pick.innerHTML = `<div class="hv-pick"><b>案 ${key.toUpperCase()}</b><strong>${VARIANTS[key].name}</strong><span>${VARIANTS[key].note}</span></div>`;
    section.querySelector('.hero-grid').before(pick);
    start(section.querySelector('[data-hv]'), key);
  });
  const jump = document.createElement('nav');
  jump.className = 'hv-jump';
  jump.setAttribute('aria-label', 'HERO の案へ移動');
  jump.innerHTML = `HERO の案${keys.map((k) => `<a href="#hero-${k}">${k.toUpperCase()}</a>`).join('')}`;
  document.body.append(jump);
})();
