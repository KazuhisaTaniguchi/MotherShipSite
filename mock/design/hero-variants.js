// HERO のアニメ（資料づくり ── AI に指示して Mac を動かす）。案 2-B に決定（3 本指で Mission Control を開き、最後は広げて横幅いっぱい）。まだ一時的なファイル。
// 1 つに決まったら、styles.css・script.js・index.html に移して、このファイルは消す。
// 見出し「指で動かす。声で書く。」と、リード「家のMacで、AIが作業中。進み具合を指で確かめて、直しは話すだけ。」の実演にする。
// 流れ：MacBook で「端末を追加」→ iPad が横向きで登場して「つなぐ」→ 横長の画面に「AI アシスタント｜売上レポート」
//      → 進み具合を見る → 指で動かす（スクロール）→ 声で書く（直しの指示）→ AI が直す
//      → 縦に回す（窓は大きさを変えずに残り、重なる）→ Mission Control で窓の一覧 → レポートをタップ → グラフが見える
// ・向きを変えても、Mac の窓は自動では並び直らない。だから、縦にしたあとは「重なった窓を Mission Control で選ぶ」形にしている
//      → 緑のボタンで広げて、横幅いっぱい
// ・Mission Control は、3 本指で上にスワイプして開く（設定なしで使える操作）
// ・画面の状態は時刻 t だけで決まる（render）。内容と時刻は、下の VARIANTS と plan() にまとめてある
// ・声の入力は実物と同じ順番：🎤 を押している間は話した言葉が吹き出しに出て、離すと Mac に文字が入る
// ・AI の窓と Mission Control は、描いた絵（AI の名前は「AI アシスタント」。数字や実在の名前は書かない）
// ・確認用：URL に ?demo=12000 を付けると、その時刻（ミリ秒）で止まる。__heroDemo.v2b.seek(12000) でも止められる
// ・本物の動画（media/hero-demo.mp4）への切り替えは入れていない（片付けのときに戻す）
// ・前の案は Git の履歴にある（4 案 A〜D：e05bc58 ／ 3 案 C-1〜C-3：2d81c28 ／ 2 案 開発・資料づくり：dad0f1d ／ 広げてから縦へ：aec01a1 ／ Mission Control の 4 案：8d42298）
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

  // 案の内容から、クラスを付ける時刻の一覧を組み立てる
  //   utter:  { hold: [🎤 を押す, 離す], say: 話す言葉 } … 離すと、AI への指示の欄（.m-text-ai）に文字が入る
  //   sendAt: バーの Enter で送る時刻。指示の欄が空になり、同じ文がやりとりの欄に出る
  //   rotAt:  縦に回しはじめる時刻（R）。1 秒後に、Mac の画面が縦長に作り直り、2 つの窓が重なる
  //   M ＝ 3 本指で上にスワイプして Mission Control を開く操作 ／ Z ＝ レポートの緑のボタンをタップ ／ L ＝ 1 周の長さ
  const plan = (o) => {
    const R = o.rotAt; const u = o.utter;
    const M = R + 1800; const Z = M + 3600; const L = M + 8000;
    return {
      ...o, length: L,
      scenes: [[0, 'Macで、端末を追加'], [MAC_END, 'iPadから、つなぐ'], [LIVE, 'AIの進み具合を見る'], [o.fingerAt, '指で動かす'], [o.voiceAt, '声で書く'],
        [R, '縦にすると、縦長の画面に'], [M - 200, 'Mission Controlで、窓を選ぶ'], [Z - 200, '広げて、横幅ぴったり']],
      typing: [{ sel: '.m-text-ai', text: u.say, at: u.hold[1] + 250, per: TYPE_MS, until: o.sendAt }],
      root: {
        'is-mac': [[200, MAC_END]],                  // くり返しの頭は、フェードインで入る
        'is-pad': [[MAC_END - 200, L - 600]],        // 終わりは、フェードアウトで抜ける
        'is-badge': [[u.hold[0] + 400, R - 300]],
        'is-bubble': [[u.hold[0] + 150, u.hold[1] + 450]],
        'is-fit': [[M + 4800, M + 7300]],
      },
      lap: macIntro(),
      // 向き：はじめから横向き（枠＝is-rot、中身＝is-land）。R で枠を縦に戻し、少し遅れて中身を縦長に作り直す
      pad: { 'is-rot': [[0, R]] },
      demo: {
        'is-land': [[0, R + 1000]], 'is-reflow': [[R + 750, R + 1000]],
        'is-tap': [[4700, 5300]], 'is-connecting': [[5300, LIVE]], 'is-live': [[LIVE, L]],
        'is-ghost': [o.ghostAt], 'is-voice': [[o.ghostAt[1], L]], 'is-mic': [u.hold],
        'is-enter': [[o.sendAt - 200, o.sendAt + 250]],
        // Mission Control：3 本指の印（is-swipe → 上へ is-swiped）→ 窓の一覧（is-mc）→ レポートをタップ（is-picktap）→ レポートが手前に（is-front）
        'is-swipe': [[M - 150, M + 850]], 'is-swiped': [[M + 200, M + 850]],
        'is-mc': [[M + 500, M + 2500]], 'is-picktap': [[M + 2000, M + 2550]], 'is-front': [[M + 2500, L + 1]],
        // 広げる：指の印 → 広がる間だけ位置の動きを付ける（is-zooming）→ 広げたまま（is-zoom）
        'is-zoomtap': [[Z, Z + 550]], 'is-zooming': [[Z + 450, Z + 1300]], 'is-zoom': [[Z + 500, L + 1]],
        ...(o.demo || {}),
      },
    };
  };

  // やりとりの欄の 1 行：
  //   me   … 自分の指示（at から出る）
  //   step … AI の作業（at から「run」の文と回る印、doneAt から「done」の文と ✓）
  const SAY = 'いちばん売上が高い月を、目立たせてください。';
  const VARIANTS = {
    v2b: plan({
      label: '案 2-B', name: '3 本指で Mission Control ／ 広げて、横幅いっぱいで終わる',
      badge: 'キーボードは、しまったまま。<br><mark>画面は、広いまま。</mark>', still: 16700, outTitle: '売上レポート',
      fingerAt: 9200, voiceAt: 10900, ghostAt: [11000, 12700], utter: { hold: [13100, 16000], say: SAY }, sendAt: 17300, rotAt: 19500,
      chat: [
        { kind: 'me', text: '先月の売上を、レポートにまとめてください。', at: 0 },
        { kind: 'step', run: 'データを読み込んでいます…', done: 'データを読み込みました', at: 6900, doneAt: 7500 },
        { kind: 'step', run: 'グラフを作っています…', done: 'グラフを作りました', at: 7600, doneAt: 8300 },
        { kind: 'step', run: 'レポートを仕上げています…', done: 'レポートができました', at: 8400, doneAt: 9000 },
        { kind: 'me', text: SAY, at: 17300 },
        { kind: 'step', run: 'グラフを更新中…', done: 'グラフを更新しました', at: 17800, doneAt: 18900 },
      ],
      demo: { 'is-doc': [[7200, 99999]], 'is-chart': [[7900, 99999]], 'is-finger': [[9500, 11000]], 'is-scrolled': [[10000, 99999]], 'is-mark': [[18900, 99999]] },
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

  const chatItem = (c, i) => {
    if (c.kind === 'me') return `<p class="ai-item ai-me" data-i="${i}">${c.text}</p>`;
    return `<p class="ai-item ai-step" data-i="${i}"><i class="ai-mark"></i><span class="t-run">${c.run}</span><span class="t-done">${c.done}</span></p>`;
  };
  // 右の窓：AI が作っているもの
  const outBody = {
    // 売上レポート：見出し・本文の行・棒グラフ
    report: `
      <div class="out-scroll">
        <h4>先月の売上</h4>
        <ul>${rep(5, '<li></li>')}</ul>
        <div class="m-bars">${rep(6)}</div>
        <ul>${rep(3, '<li></li>')}</ul>
      </div>
      <span class="out-finger"></span>`,
  };

  // .d-fit ＝ 端末の向きに合わせて形が変わる層（横向きのときは横長の箱になる）。Mac の画面（.d-mac）と同じ動きをする
  const template = (v) => `
    <div class="hv-stage">
      <div class="hv-laptop" aria-hidden="true">
        <div class="hv-lscreen"><div class="lm-in">
          <div class="lm-bar"><b></b><span>Finder</span><span>ファイル</span><span>編集</span><i class="lm-icon"></i><em>9:41</em></div>
          <div class="lm-win">${rep(7)}</div>
          <div class="lm-menu"><p class="lm-head">MOTHERSHIP HOST</p><p class="lm-state"><i></i>待機中</p><hr><p class="lm-add">端末を追加…</p><p>登録済みの端末</p><p>設定…</p></div>
          <div class="lm-qr"><h4>端末を追加</h4>${qr()}<p>iPadのMOTHERSHIPで<br>QRコードを読み取ります</p></div>
          <span class="lm-click"></span><span class="lm-cursor"></span>
        </div></div>
        <div class="hv-lbase"></div>
      </div>
      <figure class="phone tablet hero-phone hv-pad" role="img" aria-label="MOTHERSHIPの使い方のイメージ。Macで端末を追加し、横向きのiPadからつなぐと、AIが作業しているMacの画面がiPadに映る。指でスクロールし、iPadに話しかけると、AIへの次の指示がMacに入る。iPadを縦向きにすると、Macの画面も横幅ぴったりの縦長になり、2つの窓が重なる。3本指で上にスワイプしてMission Controlで窓の一覧を出し、レポートをタップすると、グラフが見える。最後にレポートの窓を広げると、横幅いっぱいに大きく映る">
        <div class="phone-screen">
          <div class="demo" data-scene="1" aria-hidden="true">
            <!-- つなぐ前の画面（横向き。描いた絵で、実際の画面とは見た目が違う） -->
            <div class="d-connect d-fit">
              <div class="c-head"><div><small>MOTHERSHIP</small><b>MOTHERSHIP</b><span>Mac を、手元の画面へ。</span></div><i></i></div>
              <div class="c-list"><p>登録済みのMac</p><div class="d-host"><b>Mac mini</b><span>自宅のMac</span><em>つなぐ</em></div></div>
              <span class="d-tap"></span>
              <div class="d-connecting"><i></i>接続中…</div>
            </div>
            <div class="d-live">
              <div class="d-mac">
                <div class="m-menubar"><b></b><span>ファイル</span><span>編集</span><span>表示</span><i>9:41</i></div>
                <!-- 左（縦向きは上）：AI アシスタント。やりとりの欄と、指示を書く欄 -->
                <div class="m-window m-ai">
                  <div class="m-title"><i></i><i></i><i></i><span>AI アシスタント</span></div>
                  <div class="m-body ai-body">
                    <div class="ai-chat">${v.chat.map(chatItem).join('')}</div>
                    <div class="ai-prompt"><span class="ai-in"><span class="m-text-ai"></span><span class="m-caret"></span><span class="ai-ph">次の指示を入力</span></span><em>⏎</em></div>
                  </div>
                </div>
                <!-- 右（縦向きは下）：AI が作っているもの -->
                <div class="m-window m-out out-report">
                  <div class="m-title"><i></i><i></i><i></i><span>${v.outTitle}</span><b class="out-zoomtap"></b></div>
                  <div class="m-body out-body">${outBody.report}</div>
                </div>
                <div class="m-dock">${rep(5)}</div>
                <!-- Mission Control（窓の一覧）のときに出る、窓の名前と、レポートをタップする指の印 -->
                <p class="mc-name mc-name-ai">AI アシスタント</p>
                <p class="mc-name mc-name-out">売上レポート</p>
                <span class="mc-pick"></span>
              </div>
              <div class="d-ui d-fit">
                <!-- 画面のキーボードを出したら隠れる範囲 -->
                <div class="d-ghost"><p>キーボードを出すと、ここまで隠れます</p></div>
                <!-- 3 本指で上にスワイプ（Mission Control を開く） -->
                <div class="d-swipe"><i></i><i></i><i></i></div>
                <!-- 音声入力のバー：ボタン 6 個（🎤・削除・Enter・Tab・コピー・ペースト）。つながっている間は、いつも出ている -->
                <div class="d-vbar"><span class="v-grip">≡</span><div class="v-wave">${rep(6)}</div><span class="v-key v-mic">🎤</span><span class="v-key">⌫</span><span class="v-key v-enter">⏎</span><span class="v-key">⇥</span><span class="v-key"><small>コピー</small></span><span class="v-key"><small>ペースト</small></span></div>
              </div>
            </div>
          </div>
        </div>
      </figure>
      <div class="hv-bubble" aria-hidden="true"><span class="hv-bubble-text"></span></div>
      <div class="hv-badge" aria-hidden="true">${v.badge}</div>
      <div class="hv-fit" aria-hidden="true"><i></i><b>横幅ぴったり</b><i></i></div>
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

  // speed：再生の速さ（1 ＝ いまの速さ）。時刻の進み方と、CSS の動き（transition・animation）の両方を speed 倍にする
  const start = (root, key, speed = 1, id = key) => {
    const v = VARIANTS[key];
    root.dataset.variant = key;
    root.dataset.speed = String(speed);
    root.innerHTML = template(v);
    const el = { root, lap: root.querySelector('.lm-in'), pad: root.querySelector('.hv-pad'), demo: root.querySelector('.demo') };
    const toggle = root.querySelector('.video-toggle');
    const label = root.querySelector('.d-label');
    const bubble = root.querySelector('.hv-bubble-text');
    const items = [...root.querySelectorAll('.ai-item')];
    const find = (() => { const cache = {}; return (sel) => (cache[sel] ??= root.querySelector(sel)); })();

    const render = (t) => {
      let scene = 0;
      v.scenes.forEach(([s], i) => { if (t >= s) scene = i; });
      root.dataset.scene = String(scene + 1);
      label.textContent = v.scenes[scene][1];
      ['root', 'lap', 'pad', 'demo'].forEach((target) => {
        Object.entries(v[target] || {}).forEach(([cls, ranges]) => el[target].classList.toggle(cls, inRanges(ranges, t)));
      });
      // やりとりの欄：1 行ずつ、出す／✓ にする、を時刻で決める
      v.chat.forEach((c, i) => {
        const node = items[i];
        node.classList.toggle('is-on', t >= c.at && (c.hideAt == null || t < c.hideAt));
        node.classList.toggle('is-done', c.doneAt != null && t >= c.doneAt);
      });
      // Mac に入る文字（until を過ぎたら消す ＝ 送った）
      const typed = {};
      v.typing.forEach((seg) => {
        const n = t >= seg.at && !(seg.until != null && t >= seg.until) ? Math.min(seg.text.length, Math.floor((t - seg.at) / seg.per) + 1) : 0;
        typed[seg.sel] = (typed[seg.sel] || '') + seg.text.slice(0, n);
      });
      Object.entries(typed).forEach(([sel, text]) => { const node = find(sel); if (node.textContent !== text) node.textContent = text; });
      // 吹き出し：🎤 を押している間に、話した言葉が少しずつ出る
      const u = v.utter; let said = '';
      if (t >= u.hold[0]) {
        const full = `「${u.say}」`;
        const per = (u.hold[1] - u.hold[0] - 700) / full.length;
        said = full.slice(0, Math.max(0, Math.min(full.length, Math.floor((t - u.hold[0] - 250) / per) + 1)));
      }
      if (bubble.textContent !== said) bubble.textContent = said;
    };

    let userPaused = reduce || at > 0;
    let visible = true;
    let elapsed = at > 0 ? at % v.length : (reduce ? v.still : 0);
    let last = null;
    let raf = 0;
    const snap = (t) => { root.classList.add('is-snap'); el.demo.classList.add('is-snap'); render(t); void root.offsetWidth; root.classList.remove('is-snap'); el.demo.classList.remove('is-snap'); };
    const frame = (now) => {
      if (last !== null) elapsed += (now - last) * speed;
      last = now;
      if (elapsed >= v.length) { elapsed %= v.length; snap(elapsed); } else render(elapsed);
      if (speed !== 1) root.getAnimations({ subtree: true }).forEach((a) => { if (a.playbackRate !== speed) a.playbackRate = speed; });
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
    window.__heroDemo[id] = { seek: (t) => { userPaused = true; elapsed = t; apply(); snap(t); }, time: () => elapsed, length: v.length };
  };

  // 再生の速さ：2026-11-20 に 1.2・1.4・1.6 倍を並べて比べ、1.4 倍に決定（1 周 約20.9秒）。
  // VARIANTS の時刻はそのままで、再生のときに 1.4 倍で進める。SPEEDS に 2 つ以上入れると、HERO を並べて比べられる
  const key = Object.keys(VARIANTS)[0];
  const SPEEDS = [1.4];
  const sec = (ms) => `約${(Math.round(ms / 100) / 10).toFixed(1)}秒`;
  const slug = (x) => String(x).replace('.', '_');
  const sections = SPEEDS.map((speed, i) => {
    const section = i === 0 ? hero : hero.cloneNode(true);
    if (i > 0) {
      section.classList.add('is-clone');
      section.querySelectorAll('[id]').forEach((n) => { n.id = `${n.id}-x${slug(speed)}`; });
      section.setAttribute('aria-labelledby', `hero-title-x${slug(speed)}`);
    }
    if (SPEEDS.length > 1) section.id = `hero-x${slug(speed)}`;
    return section;
  });
  sections.forEach((section, i) => {
    const speed = SPEEDS[i];
    if (i > 0) sections[i - 1].after(section);
    if (SPEEDS.length > 1) {
      const pick = document.createElement('div');
      pick.className = 'wrap';
      pick.innerHTML = `<div class="hv-pick"><b>${speed === 1 ? '1倍（いま）' : `${speed}倍`}</b><strong>1 周 ${sec(VARIANTS[key].length / speed)}</strong><span>${speed === 1 ? 'いまの速さです。' : `いまの HERO のアニメを ${speed} 倍の速さで再生しています（場面の切り替わりも、窓や端末の動きも ${speed} 倍）。`}比べるための表示で、決まったら消します。</span></div>`;
      section.querySelector('.hero-grid').before(pick);
    }
    start(section.querySelector('[data-hv]'), key, speed, SPEEDS.length > 1 && i > 0 ? `${key}x${slug(speed)}` : key);
  });
  if (SPEEDS.length < 2) return;
  const jump = document.createElement('nav');
  jump.className = 'hv-jump';
  jump.setAttribute('aria-label', 'HERO の速さの比較へ移動');
  jump.innerHTML = `HERO の速さ${SPEEDS.map((x) => `<a href="#hero-x${slug(x)}">${x}倍</a>`).join('')}`;
  document.body.append(jump);
})();
