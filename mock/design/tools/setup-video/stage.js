// セットアップ動画の時計。場面（.sc[data-len]）を順に並べ、中の部品は data-* の秒（場面の頭から）で動かす。
// ・ふつうに開くと、最初から最後まで再生して繰り返す
// ・?capture=1 で開くと止まったまま。window.seek(秒) でその時刻の絵にする（render.mjs がコマ撮りに使う）
(() => {
  const q = new URLSearchParams(location.search);
  const which = q.get("v") || "voice";
  document.querySelectorAll("main[data-v]").forEach((m) => { if (m.dataset.v !== which) m.remove(); });
  const root = document.querySelector("main[data-v]");
  const scenes = [...root.querySelectorAll(".sc")];
  let T = 0;
  scenes.forEach((s) => { s._a = T; T += parseFloat(s.dataset.len); s._b = T; });
  const anims = [];
  // テロップ：STEP の札のほかを 1 つにまとめる（文の途中の <kbd> で列が分かれないように）
  root.querySelectorAll(".cap").forEach((c) => {
    const tx = document.createElement("span");
    [...c.childNodes].filter((n) => !(n.classList && n.classList.contains("st"))).forEach((n) => tx.appendChild(n));
    c.appendChild(tx);
  });
  const num = (v) => parseFloat(v);

  // pts：[[秒, スタイル, イージング?], …]（秒は動画の頭から）。0 秒と最後を足して、1 本のアニメーションにする
  function key(el, pts) {
    const frames = [];
    const first = pts[0], last = pts[pts.length - 1];
    if (first[0] > 0) frames.push({ ...first[1], offset: 0 });
    pts.forEach(([t, st, ease]) => frames.push({ ...st, offset: Math.min(1, Math.max(0, t / T)), ...(ease ? { easing: ease } : {}) }));
    if (last[0] < T) frames.push({ ...last[1], offset: 1 });
    anims.push(el.animate(frames, { duration: T * 1000, fill: "both" }));
  }
  const E = "cubic-bezier(.2,.7,.2,1)";

  scenes.forEach((s) => {
    const a = s._a, b = s._b;
    const fin = a === 0 ? 0.01 : 0.4;
    key(s, [[a, { opacity: 0 }], [a + fin, { opacity: 1 }], [b - 0.3, { opacity: 1 }], [b, { opacity: b === T ? 1 : 0 }]]);

    s.querySelectorAll("[data-in]").forEach((el) => {
      const t0 = a + num(el.dataset.in);
      const dy = el.dataset.dy !== undefined ? num(el.dataset.dy) : 14;
      const base = el.dataset.tf || "";
      const pts = [[t0, { opacity: 0, transform: `${base} translateY(${dy}px)` }, E], [t0 + 0.4, { opacity: 1, transform: `${base} translateY(0px)` }]];
      if (el.dataset.out !== undefined) {
        const t1 = a + num(el.dataset.out);
        pts.push([t1 - 0.3, { opacity: 1, transform: `${base} translateY(0px)` }], [t1, { opacity: 0, transform: `${base} translateY(0px)` }]);
      }
      key(el, pts);
    });
    // 文字を打つ（左から順に出す）
    s.querySelectorAll("[data-type]").forEach((el) => {
      const [t, d] = el.dataset.type.split(",").map(num);
      const n = Math.max(1, [...el.textContent].length);
      key(el, [[a + t, { clipPath: "inset(0% 100% 0% 0%)" }, `steps(${n}, end)`], [a + t + d, { clipPath: "inset(0% 0% 0% 0%)" }]]);
    });
    // 伸びる（進み具合・矢印）
    s.querySelectorAll("[data-grow]").forEach((el) => {
      const [t, d] = el.dataset.grow.split(",").map(num);
      key(el, [[a + t, { transform: "scaleX(0)" }, "ease-in-out"], [a + t + d, { transform: "scaleX(1)" }]]);
    });
    // 動かす（カーソル）："秒,長さ,x,y; 秒,長さ,x,y"（x・y は元の位置からのずれ）
    s.querySelectorAll("[data-move]").forEach((el) => {
      let px = 0, py = 0;
      const pts = [];
      el.dataset.move.split(";").forEach((seg) => {
        const [t, d, x, y] = seg.split(",").map(num);
        pts.push([a + t, { transform: `translate(${px}px, ${py}px)` }, "ease-in-out"], [a + t + d, { transform: `translate(${x}px, ${y}px)` }]);
        px = x; py = y;
      });
      key(el, pts);
    });
    // 押した印（輪が広がる）："秒;秒"
    s.querySelectorAll("[data-pulse]").forEach((el) => {
      const pts = [];
      el.dataset.pulse.split(";").map(num).forEach((t) => {
        pts.push([a + t, { opacity: 0, transform: "scale(.2)" }], [a + t + 0.01, { opacity: 0.9, transform: "scale(.2)" }, "ease-out"], [a + t + 0.55, { opacity: 0, transform: "scale(1)" }]);
      });
      key(el, pts);
    });
    // その間だけ見せる（切り替えの上の層）："秒,秒"（終わりを省くと、場面の終わりまで）
    s.querySelectorAll("[data-show]").forEach((el) => {
      const [t0, t1] = el.dataset.show.split(",").map(num);
      const pts = [[a + t0, { opacity: 0 }], [a + t0 + 0.15, { opacity: 1 }]];
      if (!Number.isNaN(t1) && t1 !== undefined) pts.push([a + t1, { opacity: 1 }], [a + t1 + 0.15, { opacity: 0 }]);
      key(el, pts);
    });
    // その時刻に消す
    s.querySelectorAll("[data-hide]").forEach((el) => {
      const t = a + num(el.dataset.hide);
      key(el, [[t, { opacity: 1 }], [t + 0.2, { opacity: 0 }]]);
    });
    // 声の波：その間だけ上下する
    s.querySelectorAll("[data-wave]").forEach((el) => {
      const [t0, t1] = el.dataset.wave.split(",").map(num);
      [...el.children].forEach((bar, i) => {
        const pts = [[a + t0, { transform: "scaleY(.15)" }]];
        for (let t = t0, k = 0; t < t1; t += 0.16, k++) pts.push([a + t, { transform: `scaleY(${0.25 + 0.75 * Math.abs(Math.sin(k * 1.3 + i * 1.9))})` }]);
        pts.push([a + t1, { transform: "scaleY(.15)" }]);
        key(bar, pts);
      });
    });
  });

  // 上のステップの札：data-from・data-to の場面の間だけ明るくする
  root.querySelectorAll(".chip .on").forEach((el) => {
    const f = root.querySelector(el.dataset.from), t = root.querySelector(el.dataset.to);
    key(el, [[f._a, { opacity: 0 }], [f._a + 0.3, { opacity: 1 }], [t._b - 0.3, { opacity: 1 }], [t._b, { opacity: 0 }]]);
  });
  const bar = document.querySelector(".bar");
  if (bar) key(bar, [[0, { transform: "scaleX(0)" }], [T, { transform: "scaleX(1)" }]]);

  window.TOTAL = T;
  window.SCENES = scenes.map((s) => [s.id, s._a, s._b]);
  window.seek = (t) => { anims.forEach((an) => { an.pause(); an.currentTime = Math.min(T * 1000 - 1, Math.max(0, t * 1000)); }); };
  if (q.get("capture")) window.seek(q.get("t") ? num(q.get("t")) : 0);
  else if (q.get("t")) window.seek(num(q.get("t")));
  else anims.forEach((an) => { an.effect.updateTiming({ iterations: Infinity }); });
  document.documentElement.dataset.ready = "1";
})();
