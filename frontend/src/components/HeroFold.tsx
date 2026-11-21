"use client";

import { useState } from "react";

// HERO のアニメ（2026-11-21 に作り直し）。Galaxy Z Fold7 を開いて、家の Mac の AI を動かす。CSS だけで動く（src/styles/hero-fold.css）。
// 開いてつなぐ → AI の進み具合 → 指で確かめる → 声で頼む → 縦に持ち替える（ぴったり合う）→ 指で拡大 → 閉じる（カバー画面に映る）。
// 図の HTML は、モックで tools/hero-fold/build.py が mock/design/index.html に書き出したものの写し（.hx-pt の中身は .hx-scr の写しで、build.py が入れる）。
// 直すときは、モックで build.py を実行してから、図の HTML をここへ、mock/design/hero-fold.css を src/styles/hero-fold.css へ写す。
// ここで持つ状態は、一時停止のボタンだけ。
export function HeroFold() {
  const [paused, setPaused] = useState(false);
  return (
    <div className={paused ? "hx is-paused" : "hx"}>
      <div className="hx-fig" role="img" aria-label="Galaxy Z Fold7で、家のMacのAIを動かす様子のイメージ。Fold7を開いて家のMacにつなぐと、Macの画面が広げた画面いっぱいに映る。AIが確認を待っているので、指で「許可」を押し、スクロールして結果を確かめる。🎤を押して「いちばん売上が高い月を、目立たせてください。」と話すと、AIへの指示の欄に文字が入る。縦に持ち替えると、Macの画面が新しい形にぴったり合う。2本の指で広げると売上のグラフが拡大され、くっきり映し直される。閉じると、カバー画面いっぱいに売上のグラフの窓が映る。"><div className="hx-in" aria-hidden="true">
      <div className="hx-half hx-top"></div>
      <div className="hx-half hx-bot"></div>
      <div className="hx-open">
      <i className="hx-wall"></i>
      <div className="hx-scr">
      <div className="hx-desk">
      <i className="hx-mbar"></i>
      <div className="hx-ai"><b>AI アシスタント</b>
      <div className="hx-log"><div className="hx-logi">
      <p className="hx-me">先月の売上を、レポートにまとめてください。</p>
      <div className="hx-work"><i></i><i></i><i></i><i></i><i></i></div>
      <p className="hx-done">✓ レポートができました</p>
      <p className="hx-me hx-me2">いちばん売上が高い月を、目立たせてください。</p>
      </div></div>
      <div className="hx-ask"><span>続けてよいですか？</span><em className="hx-ok">許可</em></div>
      <div className="hx-input"><span className="hx-hint">次の指示を入力</span><span className="hx-typed">いちばん売上が高い月を、目立たせてください。</span></div>
      </div>
      <div className="hx-rep"><b><i></i><i></i><i></i></b><p>売上レポート</p><em><i><u>45万</u></i><i><u>70万</u></i><i><u>55万</u></i><i className="hx-top4"><u>92万</u><s>最高</s></i><i><u>62万</u></i></em><span className="hx-plab"><i>6月</i><i>7月</i><i>8月</i><i>9月</i><i>10月</i></span></div>
      </div>
      <div className="hx-vbar"><span className="hx-mic">🎤</span><span>⌫</span><span className="hx-enter">⏎</span><span>⇥</span><span>⌘C</span><span>⌘V</span></div>
      </div>
      <div className="hx-list"><p className="hx-lt">登録済みの Mac</p><div className="hx-row"><i className="hx-mico"></i><p><b>Mac mini（自宅）</b><small><i></i>自宅 LAN で接続できます</small></p><em className="hx-conn"><span>接続</span></em><span className="hx-wait">接続中…</span></div></div>
      <i className="hx-hinge"></i>
      </div>
      <div className="hx-pt"><div className="hx-scr2">
      <div className="hx-desk">
      <i className="hx-mbar"></i>
      <div className="hx-ai"><b>AI アシスタント</b>
      <div className="hx-log"><div className="hx-logi">
      <p className="hx-me">先月の売上を、レポートにまとめてください。</p>
      <div className="hx-work"><i></i><i></i><i></i><i></i><i></i></div>
      <p className="hx-done">✓ レポートができました</p>
      <p className="hx-me hx-me2">いちばん売上が高い月を、目立たせてください。</p>
      </div></div>
      <div className="hx-ask"><span>続けてよいですか？</span><em className="hx-ok">許可</em></div>
      <div className="hx-input"><span className="hx-hint">次の指示を入力</span><span className="hx-typed">いちばん売上が高い月を、目立たせてください。</span></div>
      </div>
      <div className="hx-rep"><b><i></i><i></i><i></i></b><p>売上レポート</p><em><i><u>45万</u></i><i><u>70万</u></i><i><u>55万</u></i><i className="hx-top4"><u>92万</u><s>最高</s></i><i><u>62万</u></i></em><span className="hx-plab"><i>6月</i><i>7月</i><i>8月</i><i>9月</i><i>10月</i></span></div>
      </div>
      <div className="hx-vbar"><span className="hx-mic">🎤</span><span>⌫</span><span className="hx-enter">⏎</span><span>⇥</span><span>⌘C</span><span>⌘V</span></div>
      </div><i className="hx-phinge"></i><i className="hx-fito"></i><i className="hx-fitc hx-fit1"></i><i className="hx-fitc hx-fit2"></i><i className="hx-fitc hx-fit3"></i><i className="hx-fitc hx-fit4"></i><i className="hx-off"></i></div>
      <div className="hx-cl"><div className="hx-ph hx-pl"></div><div className="hx-ph hx-pr"></div><div className="hx-cov"><div className="hx-cv"><b><i></i><i></i><i></i></b><p>売上レポート</p><em><i><u>45万</u></i><i><u>70万</u></i><i><u>55万</u></i><i><u>92万</u><s>最高</s></i><i><u>62万</u></i></em><span><i>6月</i><i>7月</i><i>8月</i><i>9月</i><i>10月</i></span></div></div></div>
      <span className="hx-fitb">✓ 画面にぴったり</span>
      <span className="hx-said">🎤 いちばん売上が高い月を、目立たせてください。</span>
      <span className="hx-f hx-f-conn"></span><span className="hx-f hx-f-ok"></span><span className="hx-f2"><i></i><i></i></span><span className="hx-f hx-f-mic"></span><span className="hx-f hx-f-enter"></span><span className="hx-f hx-pz1"></span><span className="hx-f hx-pz2"></span>
      <span className="hx-cap hx-c1"><i>Fold7を開いて、つなぐ</i></span>
      <span className="hx-cap hx-c2"><i>AIの進み具合を見る</i></span>
      <span className="hx-cap hx-c3"><i>指で、確かめる</i></span>
      <span className="hx-cap hx-c4"><i>声で、次を頼む</i></span>
      <span className="hx-cap hx-c5"><i>縦に持ち替えても、ぴったり</i></span>
      <span className="hx-cap hx-c6"><i>指で広げて拡大。文字はくっきり</i></span>
      <span className="hx-cap hx-c7"><i>閉じても、カバー画面で見られる</i></span>
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
