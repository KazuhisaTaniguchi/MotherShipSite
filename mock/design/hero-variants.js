// HERO のアニメの 3 案（案 C をもとにした C-1・C-2・C-3。くらべて選ぶための一時的なファイル。決まったら script.js に移して消す）
// 共通の流れ：MacBook で「端末を追加」→ iPad が横向きで登場して「つなぐ」→ 横長の画面にメモとグラフ
//            → 横向きのまま声で入力 → 縦に回すと、Mac の画面が横幅ぴったりに作り直る → 最初へ
// ・index.html の HERO（.hero）を 3 つに増やし、それぞれに案を入れる
// ・画面の状態は時刻 t だけで決まる（render）。案ごとの違いは、下の VARIANTS だけ
// ・声の入力は実物と同じ順番：🎤 を押している間は話した言葉が吹き出しに出て、離すと Mac に文字が入る
// ・確認用：URL に ?demo=12000 を付けると、3 案ともその時刻（ミリ秒）で止まる。__heroDemo.c1.seek(12000) でも止められる
// ・本物の動画（media/hero-demo.mp4）への切り替えは入れていない（案が決まってから戻す）
// ・前の 4 案（A〜D）は Git の履歴にある（コミット「mock：HERO のアニメの 4 案（A〜D）を並べる」）
(() => {
  const hero = document.querySelector('.hero');
  const first = hero && hero.querySelector('[data-hv]');
  if (!first) return;

  const TYPE_MS = 22;       // 離したあと、文字が入る速さ（1 文字あたり）
  const MAC_END = 3900;     // MacBook の場面の終わり
  const LIVE = 6600;        // つながって、Mac の画面が映る時刻

  // MacBook の場面（メニューバーのアイコン → 端末を追加 → QR コード）
  const macIntro = () => {
    const m = (t) => Math.round(t * 0.83);
    return {
      'is-cur-icon': [[m(600), m(2200)]],
      'is-click': [[m(1300), m(1550)], [m(3000), m(3250)]],
      'is-menu': [[m(1450), m(3300)]],
      'is-cur-add': [[m(2200), MAC_END]],
      'is-qr': [[m(3200), MAC_END]],
    };
  };

  // 案の内容（utter ＝ 1 回の発話）から、クラスを付ける時刻の一覧を組み立てる
  //   utter: { hold: [🎤 を押す, 離す], say: 話す言葉, into: 入力先, text: 入る文字（省くと say と同じ） }
  //   rotAt: 縦に回しはじめる時刻。そこから 5 秒で 1 周が終わる
  const plan = (o) => {
    const R = o.rotAt; const L = R + 5000;
    const typing = [...(o.typing || [])];
    o.utter.forEach((u) => typing.push({ sel: u.into, text: u.text ?? u.say, at: u.hold[1] + 250, per: TYPE_MS }));
    typing.sort((a, b) => a.at - b.at);
    return {
      ...o, length: L, typing,
      root: {
        'is-mac': [[200, MAC_END]],                  // くり返しの頭は、フェードインで入る
        'is-pad': [[MAC_END - 200, L - 600]],        // 終わりは、フェードアウトで抜ける
        'is-badge': [o.badgeAt],
        'is-bubble': o.utter.map((u) => [u.hold[0] + 150, u.hold[1] + 450]),
        'is-fit': [[R + 1500, L - 700]],
      },
      lap: macIntro(),
      // 向き：はじめから横向き（枠＝is-rot、中身＝is-land）。R で枠を縦に戻し、少し遅れて中身を縦長に作り直す
      pad: { 'is-rot': [[0, R]] },
      demo: {
        'is-land': [[0, R + 1000]], 'is-reflow': [[R + 750, R + 1000]],
        'is-tap': [[4700, 5300]], 'is-connecting': [[5300, LIVE]], 'is-live': [[LIVE, L]],
        'is-voice': [[o.voiceAt, L]], 'is-mic': o.utter.map((u) => u.hold), 'is-enter': o.enter || [],
        ...(o.demo || {}),
      },
    };
  };

  const T1 = 'あしたの打ち合わせは、15時からに変更でお願いします。';
  const VARIANTS = {
    // C-1：速さ ── 話し終えたら、もう文字になっている
    c1: plan({
      label: 'C-1', name: '速さ ── 話し終えたら、もう文字に',
      note: 'いちばん素直な形です。横向きのまま 2 文を続けて話し、🎤 を離すたびに、文字が一気にメモに入ります。1 文目のあとは、バーの Enter で改行します。',
      badge: '話すだけで、<mark>一気に文字に。</mark>', badgeAt: [8600, 16600], still: 12000,
      scenes: [[0, 'Macで、端末を追加'], [MAC_END, 'iPadから、つなぐ'], [LIVE, 'Macの画面が、手元に'], [7800, '声で入力。話し終えたら、文字に'], [17200, '縦にしても、横幅ぴったり']],
      fit: '横幅ぴったり', voiceAt: 7800, rotAt: 17200,
      utter: [
        { hold: [8200, 11000], say: T1, into: '.m-text' },
        { hold: [13200, 15400], say: '資料は、このあとすぐに送ります。', into: '.m-text' },
      ],
      enter: [[12300, 12700]], typing: [{ sel: '.m-text', text: '\n', at: 12450, per: 1 }],
    }),

    // C-2：広さ ── キーボードを出さないから、画面を広く使える
    c2: plan({
      label: 'C-2', name: '広さ ── キーボードを出さないから、画面は広いまま',
      note: '声の前に、「キーボードを出したら隠れる範囲」を点線で見せてから消します。小さなバーだけで、メモもグラフも見えたまま入力します。グラフを見ながら、気づいたことを話す例文にしています。',
      badge: 'キーボードは、しまったまま。<br><mark>画面は、広いまま。</mark>', badgeAt: [10400, 17800], still: 13600,
      scenes: [[0, 'Macで、端末を追加'], [MAC_END, 'iPadから、つなぐ'], [LIVE, 'Macの画面が、手元に'], [7600, 'キーボードを出さずに、声で入力'], [18400, '縦にすれば、縦長の画面に']],
      fit: '横幅ぴったり', voiceAt: 7600, rotAt: 18400,
      utter: [
        { hold: [10000, 12800], say: '売上は、3か月続けて伸びています。', into: '.m-text' },
        { hold: [14900, 16800], say: '来週の会議で、共有します。', into: '.m-text' },
      ],
      enter: [[14000, 14400]], typing: [{ sel: '.m-text', text: '\n', at: 14150, per: 1 }],
      demo: { 'is-ghost': [[7700, 9500]] },
    }),

    // C-3：使い道 ── メモも、メールの返信も、声だけで
    c3: plan({
      label: 'C-3', name: '使い道 ── メモも、返信も、声だけで',
      note: '1 文目はメモに入れます。そのあと右の窓がグラフからメールに変わり、2 文目は返信として入力して、バーの Enter で送ります。上の札の文言も、途中で「メモも」から「メールの返信も」に変わります。',
      badge: 'メモも、<mark>声だけで。</mark>', badgeAt: [8600, 17200], still: 11600,
      scenes: [[0, 'Macで、端末を追加'], [MAC_END, 'iPadから、つなぐ'], [LIVE, 'Macの画面が、手元に'], [7800, 'メモを、声で'], [12200, '返信も、声で'], [17800, '向きを変えても、ぴったり']],
      fit: '横幅ぴったり', voiceAt: 7800, rotAt: 17800,
      utter: [
        { hold: [8200, 10800], say: T1, into: '.m-text' },
        { hold: [13200, 15600], say: '承知しました。資料は、このあとお送りします。', into: '.m-text-mail' },
      ],
      enter: [[16500, 16900]],
      demo: { 'is-mail': [[12200, 18800]], 'is-sent': [[16800, 18800]] },
      swap: [{ sel: '.hv-badge', at: 0, html: 'メモも、<mark>声だけで。</mark>' }, { sel: '.hv-badge', at: 12200, html: 'メールの返信も、<mark>声だけで。</mark>' }],
    }),
  };

  // QR コードの絵（本物ではない。読み取れない模様）
  const qr = () => {
    const N = 11; let cells = '';
    const finder = (x, y) => [[0, 0], [N - 3, 0], [0, N - 3]].some(([fx, fy]) => x >= fx && x < fx + 3 && y >= fy && y < fy + 3);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const on = finder(x, y) || ((x * 7 + y * 13 + x * y * 3) % 5 < 2 && !(x < 4 && y < 4) && !(x > N - 5 && y < 4) && !(x < 4 && y > N - 5));
      cells += `<i${on ? ' class="on"' : ''}></i>`;
    }
    return `<div class="hv-qr">${cells}</div>`;
  };
  const rep = (n, s = '<i></i>') => s.repeat(n);

  // .d-fit ＝ 端末の向きに合わせて形が変わる層（横向きのときは横長の箱になる）。Mac の画面（.d-mac）と同じ動きをする
  const template = (v) => `
    <div class="hv-stage">
      <div class="hv-laptop" aria-hidden="true">
        <div class="hv-lscreen"><div class="lm-in">
          <div class="lm-bar"><b></b><span>Finder</span><span>ファイル</span><span>編集</span><i class="lm-icon"></i><em>9:41</em></div>
          <div class="lm-win">${rep(7)}</div>
          <div class="lm-menu"><p class="lm-head">Mothership Host</p><p class="lm-state"><i></i>待機中</p><hr><p class="lm-add">端末を追加…</p><p>登録済みの端末</p><p>設定…</p></div>
          <div class="lm-qr"><h4>端末を追加</h4>${qr()}<p>iPadのMothershipで<br>QRコードを読み取ります</p></div>
          <span class="lm-click"></span><span class="lm-cursor"></span>
        </div></div>
        <div class="hv-lbase"></div>
      </div>
      <figure class="phone tablet hero-phone hv-pad" role="img" aria-label="Mothershipの使い方のイメージ。Macで端末を追加し、横向きのiPadからつなぐと、Macの画面がiPadに映る。iPadに話しかけると、Macに文字が入る。iPadを縦向きにすると、Macの画面も縦長になり、横幅がぴったり合う">
        <div class="phone-screen">
          <div class="demo" data-scene="1" aria-hidden="true">
            <!-- つなぐ前の画面（横向き。描いた絵で、実際の画面とは見た目が違う） -->
            <div class="d-connect d-fit">
              <div class="c-head"><div><small>MOTHERSHIP</small><b>Mothership</b><span>Mac を、手元の画面へ。</span></div><i></i></div>
              <div class="c-list"><p>登録済みのMac</p><div class="d-host"><b>Mac mini</b><span>自宅のMac</span><em>つなぐ</em></div></div>
              <span class="d-tap"></span>
              <div class="d-connecting"><i></i>接続中…</div>
            </div>
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
                <div class="m-window m-mail">
                  <div class="m-title"><i></i><i></i><i></i><span>メール</span></div>
                  <div class="m-body">
                    <p class="m-mailhead"><b>Re: お打ち合わせの件</b><span class="m-reply">返信</span><span class="m-sent">✓ 送信</span></p>
                    <p class="m-typed"><span class="m-text-mail"></span><span class="m-caret"></span></p>
                    <ul>${rep(3, '<li></li>')}</ul>
                  </div>
                </div>
                <div class="m-dock">${rep(5)}</div>
              </div>
              <div class="d-ui d-fit">
                <!-- 画面のキーボードを出したら隠れる範囲（案 C-2） -->
                <div class="d-ghost"><p>キーボードを出すと、ここまで隠れます</p></div>
                <!-- 音声入力のバー：ボタン 6 個（🎤・削除・Enter・Tab・コピー・ペースト）。つながっている間は、いつも出ている -->
                <div class="d-vbar"><span class="v-grip">≡</span><div class="v-wave">${rep(6)}</div><span class="v-key v-mic">🎤</span><span class="v-key">⌫</span><span class="v-key v-enter">⏎</span><span class="v-key">⇥</span><span class="v-key"><small>コピー</small></span><span class="v-key"><small>ペースト</small></span></div>
              </div>
            </div>
          </div>
        </div>
      </figure>
      <div class="hv-bubble" aria-hidden="true"><span class="hv-bubble-text"></span></div>
      <div class="hv-badge" aria-hidden="true">${v.badge}</div>
      <div class="hv-fit" aria-hidden="true"><i></i><b>${v.fit}</b><i></i></div>
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
    const bubble = root.querySelector('.hv-bubble-text');
    const find = (() => { const cache = {}; return (sel) => (cache[sel] ??= root.querySelector(sel)); })();
    const swapped = {};

    const render = (t) => {
      let scene = 0;
      v.scenes.forEach(([s], i) => { if (t >= s) scene = i; });
      root.dataset.scene = String(scene + 1);
      label.textContent = v.scenes[scene][1];
      ['root', 'lap', 'pad', 'demo'].forEach((target) => {
        Object.entries(v[target] || {}).forEach(([cls, ranges]) => el[target].classList.toggle(cls, inRanges(ranges, t)));
      });
      // Mac に入る文字（同じ入力先のものは、時刻の順につなぐ）
      const typed = {};
      v.typing.forEach((seg) => {
        const n = t >= seg.at ? Math.min(seg.text.length, Math.floor((t - seg.at) / seg.per) + 1) : 0;
        typed[seg.sel] = (typed[seg.sel] || '') + seg.text.slice(0, n);
      });
      Object.entries(typed).forEach(([sel, text]) => { const node = find(sel); if (node.textContent !== text) node.textContent = text; });
      // 吹き出し：🎤 を押している間に、話した言葉が少しずつ出る
      let said = '';
      v.utter.forEach((u) => {
        if (t < u.hold[0]) return;
        const full = `「${u.say}」`;
        const per = (u.hold[1] - u.hold[0] - 700) / full.length;
        said = full.slice(0, Math.max(0, Math.min(full.length, Math.floor((t - u.hold[0] - 250) / per) + 1)));
      });
      if (bubble.textContent !== said) bubble.textContent = said;
      // 途中で変わる文言（札など）
      const now = {};
      (v.swap || []).forEach((s) => { if (t >= s.at) now[s.sel] = s.html; });
      Object.entries(now).forEach(([sel, html]) => { if (swapped[sel] !== html) { find(sel).innerHTML = html; swapped[sel] = html; } });
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

  // HERO を案の数だけ増やして、案の名前と説明を付ける
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
    pick.innerHTML = `<div class="hv-pick"><b>案 ${VARIANTS[key].label}</b><strong>${VARIANTS[key].name}</strong><span>${VARIANTS[key].note}</span></div>`;
    section.querySelector('.hero-grid').before(pick);
    start(section.querySelector('[data-hv]'), key);
  });
  const jump = document.createElement('nav');
  jump.className = 'hv-jump';
  jump.setAttribute('aria-label', 'HERO の案へ移動');
  jump.innerHTML = `HERO の案${keys.map((k) => `<a href="#hero-${k}">${VARIANTS[k].label}</a>`).join('')}`;
  document.body.append(jump);
})();
