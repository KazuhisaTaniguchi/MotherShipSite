// HERO のアニメ（案 2：資料づくり ── AI に指示して Mac を動かす。2026-11-20 にユーザーが決定）
// まだ一時的なファイル。動きを確かめてもらったら、styles.css・script.js・index.html に移して、このファイルは消す。
// 見出し「指で動かす。声で書く。」と、リード「AIもビルドも、家のMacに任せたまま。進み具合を見て、次の指示は話すだけ。」の実演にする。
// 流れ：MacBook で「端末を追加」→ iPad が横向きで登場して「つなぐ」→ 横長の画面に「AI アシスタント｜売上レポート」
//      → 進み具合を見る → 指で動かす（スクロール）→ 声で書く（直しの指示）→ AI が直す
//      → レポートの窓を指で広げる → 縦に回すと、レポートが横幅ぴったりで大きく映る → 最初へ
// ・向きを変えても、Mac の窓は自動では並び直らない。だから「窓を広げてから回す」形にしている（広げた窓は、画面の形に合わせて変わる）
// ・画面の状態は時刻 t だけで決まる（render）。内容と時刻は、下の VARIANTS にまとめてある
// ・声の入力は実物と同じ順番：🎤 を押している間は話した言葉が吹き出しに出て、離すと Mac に文字が入る
// ・AI の窓は、特定の製品に見えないように描いた絵（名前は「AI アシスタント」。数字や実在の名前は書かない）
// ・確認用：URL に ?demo=12000 を付けると、その時刻（ミリ秒）で止まる。__heroDemo.ai2.seek(12000) でも止められる
// ・本物の動画（media/hero-demo.mp4）への切り替えは入れていない（片付けのときに戻す）
// ・前の案は Git の履歴にある（4 案 A〜D：e05bc58 ／ 3 案 C-1〜C-3：2d81c28 ／ 2 案（開発・資料づくり）：dad0f1d）
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
  //   zoomAt: レポートの窓の緑のボタンを指でタップする時刻。0.5 秒後から、窓が横いっぱいに広がる
  //   rotAt:  縦に回しはじめる時刻。そこから 4.6 秒で 1 周が終わる
  const plan = (o) => {
    const R = o.rotAt; const L = R + 4600; const u = o.utter; const Z = o.zoomAt;
    return {
      ...o, length: L,
      typing: [{ sel: '.m-text-ai', text: u.say, at: u.hold[1] + 250, per: TYPE_MS, until: o.sendAt }],
      root: {
        'is-mac': [[200, MAC_END]],                  // くり返しの頭は、フェードインで入る
        'is-pad': [[MAC_END - 200, L - 600]],        // 終わりは、フェードアウトで抜ける
        'is-badge': [[u.hold[0] + 400, Z - 200]],
        'is-bubble': [[u.hold[0] + 150, u.hold[1] + 450]],
        'is-fit': [[R + 1500, L - 700]],
      },
      lap: macIntro(),
      // 向き：はじめから横向き（枠＝is-rot、中身＝is-land）。R で枠を縦に戻し、少し遅れて中身を縦長に作り直す
      pad: { 'is-rot': [[0, R]] },
      demo: {
        'is-land': [[0, R + 1000]], 'is-reflow': [[R + 750, R + 1000]],
        'is-tap': [[4700, 5300]], 'is-connecting': [[5300, LIVE]], 'is-live': [[LIVE, L]],
        'is-ghost': [o.ghostAt], 'is-voice': [[o.ghostAt[1], L]], 'is-mic': [u.hold],
        'is-enter': [[o.sendAt - 200, o.sendAt + 250]],
        // 広げる：指の印 → 広がる間だけ位置の動きを付ける（is-zooming）→ 広げたまま（is-zoom）で縦へ
        'is-zoomtap': [[Z, Z + 550]], 'is-zooming': [[Z + 450, Z + 1300]], 'is-zoom': [[Z + 500, L + 1]],
        ...(o.demo || {}),
      },
    };
  };

  const BADGE = 'キーボードは、しまったまま。<br><mark>画面は、広いまま。</mark>';
  const scenes = (finger, voice, zoom) => [[0, 'Macで、端末を追加'], [MAC_END, 'iPadから、つなぐ'], [LIVE, 'AIの進み具合を見る'], [finger, '指で動かす'], [voice, '声で書く'], [zoom, '広げて、縦に。横幅ぴったり']];

  // やりとりの欄の 1 行：
  //   me   … 自分の指示（at から出る）
  //   step … AI の作業（at から「run」の文と回る印、doneAt から「done」の文と ✓）
  const SAY2 = 'いちばん売上が高い月を、目立たせてください。';
  const VARIANTS = {
    // 案 2：資料づくり ── AI が作ったものを指で確かめて、直しを声で頼み、広げて縦で読む
    ai2: plan({
      label: '案 2', name: '資料づくり ── 指で確かめて、声で直しを頼む',
      note: 'AI に売上のレポートを任せている場面です。できあがったレポートを指でスクロールしてグラフを確かめ、直しの指示「いちばん売上が高い月を、目立たせてください。」を声で送ります。送ると、グラフのいちばん高い棒の色が変わります。',
      badge: BADGE, still: 16700, out: 'report', outTitle: '売上レポート',
      scenes: scenes(9200, 10900, 19300),
      ghostAt: [11000, 12700], utter: { hold: [13100, 16000], say: SAY2 }, sendAt: 17300, zoomAt: 19400, rotAt: 20900,
      chat: [
        { kind: 'me', text: '先月の売上を、レポートにまとめてください。', at: 0 },
        { kind: 'step', run: 'データを読み込んでいます…', done: 'データを読み込みました', at: 6900, doneAt: 7500 },
        { kind: 'step', run: 'グラフを作っています…', done: 'グラフを作りました', at: 7600, doneAt: 8300 },
        { kind: 'step', run: 'レポートを仕上げています…', done: 'レポートができました', at: 8400, doneAt: 9000 },
        { kind: 'me', text: SAY2, at: 17300 },
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
          <div class="lm-menu"><p class="lm-head">Mothership Host</p><p class="lm-state"><i></i>待機中</p><hr><p class="lm-add">端末を追加…</p><p>登録済みの端末</p><p>設定…</p></div>
          <div class="lm-qr"><h4>端末を追加</h4>${qr()}<p>iPadのMothershipで<br>QRコードを読み取ります</p></div>
          <span class="lm-click"></span><span class="lm-cursor"></span>
        </div></div>
        <div class="hv-lbase"></div>
      </div>
      <figure class="phone tablet hero-phone hv-pad" role="img" aria-label="Mothershipの使い方のイメージ。Macで端末を追加し、横向きのiPadからつなぐと、AIが作業しているMacの画面がiPadに映る。指でスクロールし、iPadに話しかけると、AIへの次の指示がMacに入る。できあがったレポートの窓を指で広げてからiPadを縦向きにすると、Macの画面も縦長になり、レポートが横幅ぴったりで大きく映る">
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
                <!-- 左（縦向きは上）：AI アシスタント。やりとりの欄と、指示を書く欄 -->
                <div class="m-window m-ai">
                  <div class="m-title"><i></i><i></i><i></i><span>AI アシスタント</span></div>
                  <div class="m-body ai-body">
                    <div class="ai-chat">${v.chat.map(chatItem).join('')}</div>
                    <div class="ai-prompt"><span class="ai-in"><span class="m-text-ai"></span><span class="m-caret"></span><span class="ai-ph">次の指示を入力</span></span><em>⏎</em></div>
                  </div>
                </div>
                <!-- 右（縦向きは下）：AI が作っているもの -->
                <div class="m-window m-out out-${v.out}">
                  <div class="m-title"><i></i><i></i><i></i><span>${v.outTitle}</span><b class="out-zoomtap"></b></div>
                  <div class="m-body out-body">${outBody[v.out]}</div>
                </div>
                <div class="m-dock">${rep(5)}</div>
              </div>
              <div class="d-ui d-fit">
                <!-- 画面のキーボードを出したら隠れる範囲 -->
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

  const start = (root, key) => {
    const v = VARIANTS[key];
    root.dataset.variant = key;
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

  // 案が 2 つ以上あるときは、HERO を案の数だけ増やして、案の名前と説明を付ける（いまは 1 つなので、そのまま 1 つの HERO に入れる）
  const keys = Object.keys(VARIANTS);
  const sections = keys.map((key, i) => {
    const section = i === 0 ? hero : hero.cloneNode(true);
    if (i > 0) {
      section.classList.add('is-clone');
      section.querySelectorAll('[id]').forEach((n) => { n.id = `${n.id}-${key}`; });
      section.setAttribute('aria-labelledby', `hero-title-${key}`);
    }
    if (keys.length > 1) section.id = `hero-${key}`;
    return section;
  });
  sections.forEach((section, i) => {
    const key = keys[i];
    if (i > 0) sections[i - 1].after(section);
    if (keys.length > 1) {
      const pick = document.createElement('div');
      pick.className = 'wrap';
      pick.innerHTML = `<div class="hv-pick"><b>${VARIANTS[key].label}</b><strong>${VARIANTS[key].name}</strong><span>${VARIANTS[key].note}</span></div>`;
      section.querySelector('.hero-grid').before(pick);
    }
    start(section.querySelector('[data-hv]'), key);
  });
  if (keys.length < 2) return;
  const jump = document.createElement('nav');
  jump.className = 'hv-jump';
  jump.setAttribute('aria-label', 'HERO の案へ移動');
  jump.innerHTML = `HERO の案${keys.map((k) => `<a href="#hero-${k}">${VARIANTS[k].label}</a>`).join('')}`;
  document.body.append(jump);
})();
