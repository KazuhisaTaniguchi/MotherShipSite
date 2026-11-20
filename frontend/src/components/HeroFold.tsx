"use client";

import { useState } from "react";

// HERO のアニメ（2026-11-21）。Galaxy Z Fold7 を開いて、家の Mac の AI を動かす。CSS だけで動く（src/styles/hero-fold.css）。
// 図の HTML は mock/design/tools/hero-fold/figure.html の写し（直すときは、モックで build.py を実行してから写す）。
// ここで持つ状態は、一時停止のボタンだけ。
export function HeroFold() {
  const [paused, setPaused] = useState(false);
  return (
    <div className={paused ? "hx is-paused" : "hx"}>
      <div className="hx-fig" role="img" aria-label="Galaxy Z Fold7で、家のMacのAIを動かす様子のイメージ。Fold7を開いて家のMacにつなぐと、Macの画面が広げた画面いっぱいに映る。AIが確認を待っているので、指で「許可」を押し、スクロールして結果を確かめる。🎤を押して「いちばん売上が高い月を、目立たせてください。」と話すと、AIへの指示の欄に文字が入る。半分に折って机に置くと、上の画面がMacの画面、下の画面がトラックパッドになり、なぞるとポインターが動く。"><div className="hx-in" aria-hidden="true">
        <div className="hx-half hx-top"><div className="hx-tt"><i className="hx-mbar"></i><div className="hx-ai"><b>AI アシスタント</b><div className="hx-tlines"><i></i><i></i><i></i><i></i></div></div><div className="hx-rep"><b><i></i><i></i><i></i></b><p>売上レポート</p><em><i></i><i></i><i></i><i className="is-top"></i><i></i></em></div><i className="hx-ptr"></i></div></div>
        <div className="hx-half hx-bot"><div className="hx-ctl"><p className="hx-chips"><span>コピー</span><span>ペースト</span><span>⌘Tab</span><span>⌨</span></p><div className="hx-pad"></div><span className="hx-f hx-pf"></span></div></div>
        <div className="hx-open">
          <div className="hx-desk">
            <i className="hx-mbar"></i>
            <div className="hx-ai"><b>AI アシスタント</b>
              <div className="hx-log"><div className="hx-logi">
                <p className="hx-me">先月の売上を、レポートにまとめてください。</p>
                <div className="hx-work"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
                <p className="hx-done">✓ レポートができました</p>
                <p className="hx-me hx-me2">いちばん売上が高い月を、目立たせてください。</p>
              </div></div>
              <div className="hx-ask"><span>続けてよいですか？</span><em className="hx-ok">許可</em></div>
              <div className="hx-input"><span className="hx-hint">次の指示を入力</span><span className="hx-typed">いちばん売上が高い月を、目立たせてください。</span></div>
            </div>
            <div className="hx-rep"><b><i></i><i></i><i></i></b><p>売上レポート</p><em><i></i><i></i><i></i><i className="hx-top4"></i><i></i></em></div>
            <div className="hx-vbar"><span className="hx-mic">🎤</span><span>⌫</span><span className="hx-enter">⏎</span><span>⇥</span><span>⌘C</span><span>⌘V</span></div>
          </div>
          <div className="hx-list"><p className="hx-lt">登録済みの Mac</p><div className="hx-row"><i className="hx-mico"></i><p><b>Mac mini（自宅）</b><small><i></i>自宅 LAN で接続できます</small></p><em className="hx-conn"><span>接続</span></em><span className="hx-wait">接続中…</span></div></div>
          <i className="hx-hinge"></i>
        </div>
        <span className="hx-said">🎤 いちばん売上が高い月を、目立たせてください。</span>
        <span className="hx-f hx-f-conn"></span><span className="hx-f hx-f-ok"></span><span className="hx-f2"><i></i><i></i></span><span className="hx-f hx-f-mic"></span><span className="hx-f hx-f-enter"></span>
        <span className="hx-cap hx-c1"><i>Fold7を開いて、つなぐ</i></span>
        <span className="hx-cap hx-c2"><i>AIの進み具合を見る</i></span>
        <span className="hx-cap hx-c3"><i>指で、確かめる</i></span>
        <span className="hx-cap hx-c4"><i>声で、次を頼む</i></span>
        <span className="hx-cap hx-c5"><i>半分に折れば、小さなノートパソコン</i></span>
      </div></div>
      <div className="hx-ui">
        <button className="hx-pause" type="button" aria-pressed={paused} aria-label={paused ? "アニメーションを再生" : "アニメーションを一時停止"} onClick={() => setPaused((p) => !p)}>
          <span aria-hidden="true">❚❚</span>
        </button>
        <p className="hx-note">イメージです（実際の画面とは異なります）</p>
      </div>
    </div>
  );
}
