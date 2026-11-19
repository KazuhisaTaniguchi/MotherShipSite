"use client";

import { useEffect, useRef } from "react";

// HERO：自作のアニメ（イメージ）と、本物の動画への切り替え（mock/design/script.js の写し）
// ・ふだんは .demo のアニメを繰り返す（約 22 秒で 1 周）。画面の状態は時刻 t だけで決まる（render）
// ・public/media/hero-demo.mp4 が読めたら、アニメの代わりに動画を再生する
// ・「視差効果を減らす」の設定では動かさず、Mac の画面が映った場面で止めておく（ボタンで再生できる）
// ・画面の外に出たら止める
// このコンポーネントは state を持たず再描画されないので、クラスの付け外しは DOM を直接さわる。
const LENGTH = 22000;
const SCENES: [number, string][] = [[0, "つなぐ"], [3000, "Macの画面が、手元に"], [7000, "キーボードで操作"], [11000, "声で入力"], [16000, "向きを変えても、ぴったり"]];
const TEXT = "あしたの打ち合わせは、15時からに変更でお願いします。";
const between = (t: number, a: number, b: number) => t >= a && t < b;

declare global {
  interface Window { __heroDemo?: { seek: (t: number) => void; time: () => number; length: number } }
}

export function HeroPlayer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const player = ref.current;
    if (!player) return;
    const demo = player.querySelector<HTMLElement>(".demo")!;
    const video = player.querySelector<HTMLVideoElement>("video")!;
    const toggle = player.querySelector<HTMLButtonElement>(".video-toggle")!;
    const label = player.querySelector<HTMLElement>(".d-label")!;
    const typed = demo.querySelector<HTMLElement>(".m-text")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = (t: number) => {
      let scene = 0;
      SCENES.forEach(([start], i) => { if (t >= start) scene = i; });
      demo.dataset.scene = player.dataset.scene = String(scene + 1);
      label.textContent = SCENES[scene][1];
      demo.classList.toggle("is-tap", between(t, 900, 1700));
      demo.classList.toggle("is-connecting", between(t, 1700, 3000));
      demo.classList.toggle("is-finger", between(t, 4000, 6100));
      demo.classList.toggle("is-scrolled", between(t, 4500, 7000));
      demo.classList.toggle("is-cmd", between(t, 8100, 8900) || between(t, 9700, 10300));
      demo.classList.toggle("is-sheet", between(t, 8700, 10100));
      demo.classList.toggle("is-mic", between(t, 11600, 14900));
      // 向きを変える：枠が回る → Mac の画面がその形に作り直される（横向き → 縦向きに戻す）
      player.classList.toggle("is-rot", between(t, 16500, 19800));
      demo.classList.toggle("is-land", between(t, 17500, 20800));
      demo.classList.toggle("is-reflow", between(t, 17250, 17500) || between(t, 20550, 20800));
      const n = Math.max(0, Math.min(TEXT.length, Math.floor((t - 12300) / 90)));
      const text = t >= 11000 ? TEXT.slice(0, n) : "";
      if (typed.textContent !== text) typed.textContent = text;
    };

    let mode: "demo" | "video" = "demo";
    let userPaused = reduce;
    let visible = true;
    let elapsed = reduce ? 3800 : 0;
    let last: number | null = null;
    let raf = 0;

    const snapRender = (t: number) => {
      demo.classList.add("is-snap");
      render(t);
      void demo.offsetWidth;
      demo.classList.remove("is-snap");
    };
    const frame = (now: number) => {
      if (last !== null) elapsed += now - last;
      last = now;
      if (elapsed >= LENGTH) {            // 1 周したら、動きを付けずに最初へ戻す
        elapsed %= LENGTH;
        snapRender(elapsed);
      } else {
        render(elapsed);
      }
      raf = requestAnimationFrame(frame);
    };
    const demoRunning = () => raf !== 0;
    const startDemo = () => { if (!raf) { last = null; raf = requestAnimationFrame(frame); } demo.classList.remove("is-paused"); };
    const stopDemo = () => { cancelAnimationFrame(raf); raf = 0; demo.classList.add("is-paused"); };

    const isPlaying = () => (mode === "video" ? !video.paused : demoRunning());
    const renderToggle = () => {
      const what = mode === "video" ? "動画" : "アニメーション";
      toggle.setAttribute("aria-label", isPlaying() ? `${what}を一時停止` : `${what}を再生`);
      toggle.classList.toggle("is-paused", !isPlaying());
    };
    const apply = () => {
      const shouldPlay = !userPaused && visible;
      if (mode === "video") {
        stopDemo();
        if (shouldPlay) video.play().catch(() => {}).finally(renderToggle); else video.pause();
      } else if (shouldPlay) startDemo(); else stopDemo();
      renderToggle();
    };

    const onToggle = () => { userPaused = isPlaying(); apply(); };
    const onLoaded = () => { mode = "video"; player.classList.add("has-video"); apply(); };
    const onVisibility = () => { last = null; };
    toggle.addEventListener("click", onToggle);
    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("play", renderToggle);
    video.addEventListener("pause", renderToggle);
    document.addEventListener("visibilitychange", onVisibility);
    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; apply(); }, { threshold: 0.2 });
      observer.observe(player);
    }
    // 画面の表示（hydration）より先に動画が読み込み終わっていた場合も、動画に切り替える
    if (video.readyState >= 2) onLoaded();

    snapRender(elapsed);
    apply();

    // 確認用：場面を時刻で指定して止める（例：__heroDemo.seek(8800)、または URL に ?demo=8800）
    const seek = (t: number) => { userPaused = true; elapsed = t; apply(); render(t); };
    const at = Number(new URLSearchParams(location.search).get("demo"));
    if (at > 0) { userPaused = true; elapsed = at; demo.classList.add("is-snap"); apply(); render(at); }
    window.__heroDemo = { seek, time: () => elapsed, length: LENGTH };

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      toggle.removeEventListener("click", onToggle);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("play", renderToggle);
      video.removeEventListener("pause", renderToggle);
      document.removeEventListener("visibilitychange", onVisibility);
      delete window.__heroDemo;
    };
  }, []);

  return (
    <figure
      ref={ref}
      className="phone tablet hero-phone"
      data-hero-player=""
      role="img"
      aria-label="Mothershipの使い方のイメージ。つなぐと、Macの画面がiPadに映り、キーボードや声で操作できる。iPadの向きを変えると、Macの画面もその形に変わる"
    >
      <div className="phone-screen">
        {/* 自作のアニメ（イメージ）。本物の動画 public/media/hero-demo.mp4 を置くと、そちらに切り替わる */}
        <div className="demo" data-scene="1" aria-hidden="true">
          <div className="d-connect">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/app-ipad-connect-portrait.png" alt="" width={1640} height={2360} />
            <div className="d-list"><p>登録済みのMac</p><div className="d-host"><b>Mac mini</b><span>自宅のMac</span><em>つなぐ</em></div></div>
            <span className="d-tap"></span>
            <div className="d-connecting"><i></i>接続中…</div>
          </div>
          <div className="d-live">
            <div className="d-mac">
              <div className="m-menubar"><b></b><span>ファイル</span><span>編集</span><span>表示</span><i>9:41</i></div>
              <div className="m-window m-doc">
                <div className="m-title"><i></i><i></i><i></i><span>メモ</span></div>
                <div className="m-body"><div className="m-scroll">
                  <h4>打ち合わせメモ</h4>
                  <p className="m-typed"><span className="m-text"></span><span className="m-caret"></span></p>
                  <ul><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>
                  <div className="m-fig"></div>
                  <ul><li></li><li></li><li></li><li></li></ul>
                </div></div>
              </div>
              <div className="m-window m-sheet">
                <div className="m-title"><i></i><i></i><i></i><span>グラフ</span></div>
                <div className="m-body"><div className="m-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
              </div>
              <div className="m-dock"><i></i><i></i><i></i><i></i><i></i></div>
            </div>
            <div className="d-keys">
              <div className="k-bar"><span>コピー</span><span>ペースト</span><span className="k-switch">アプリ切替</span><span>Spotlight</span></div>
              <div className="k-row"><i>q</i><i>w</i><i>e</i><i>r</i><i>t</i><i>y</i><i>u</i><i>i</i><i>o</i><i>p</i></div>
              <div className="k-row"><i>a</i><i>s</i><i>d</i><i>f</i><i>g</i><i>h</i><i>j</i><i>k</i><i>l</i></div>
              <div className="k-row"><i>⇧</i><i>z</i><i>x</i><i>c</i><i>v</i><i>b</i><i>n</i><i>m</i><i>⌫</i></div>
              <div className="k-row k-mod"><i>⌃</i><i>⌥</i><i className="k-cmd">⌘</i><i className="k-space"></i><i className="k-tab">⇥</i><i>⏎</i></div>
            </div>
            <div className="d-voice"><div className="d-wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span className="d-mic">🎤</span><span>⌫</span><span>⏎</span></div>
            <span className="d-finger"></span>
          </div>
        </div>
        <video className="hero-video" muted loop playsInline preload="metadata" aria-label="iPadのMothershipから、Macを操作している様子">
          <source src="/media/hero-demo.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="demo-bar">
        <button className="video-toggle" type="button" aria-label="アニメーションを一時停止"><span className="icon-pause" aria-hidden="true"></span></button>
        <span className="d-label" aria-hidden="true">つなぐ</span>
        <span className="d-dots" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
      </div>
      <figcaption className="demo-note">イメージです（実際の画面とは異なります）</figcaption>
    </figure>
  );
}
