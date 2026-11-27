"use client";

// セットアップ動画のプレーヤー（2026-11-27。mock/design/script.js の「セットアップ動画」と同じ動き）
// ・動画のテロップは下の端にある。ブラウザーの再生バーはそこに重なるので、操作は動画の下に自前で出す
// ・JavaScript が動かないときは、ブラウザーの再生バー（controls）のまま見られる
// ・「見たいところから」のボタンで、そのステップへ飛ぶ（秒は mock/design/tools/setup-video/stage.html の場面の頭。動画を作り直したら、ここも直す）
// ・広い画面では 1920×1080、ほかは 1280×720 を読む。押すまで動画は読み込まない（preload="none"）
// ・再生を始めたとき・最後まで見たときに、GA へイベントを送る（video_start・video_complete。同意の扱いは Analytics.tsx）
// ・動画に出てくる道具の公式サイトを、動画の下に出す（Homebrew。URL は日本語と英語でちがう：nav.ts の HOMEBREW_URL）
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { HOMEBREW_URL } from "@/components/nav";

export const SETUP_VIDEOS = {
  outside: {
    title: "外から使う準備（Tailscale）",
    length: "52秒",
    duration: 51.5,
    label: "外から使う準備の動画。Tailscaleのアカウントを作る、MacとデバイスにTailscaleを入れて同じアカウントでログインする、家のWi-FiでいちどMOTHERSHIPでつなぐ、Wi-Fiを切って試す、の順に説明する。音は出ない",
    chapters: [
      { t: 4.5, label: "しくみ" },
      { t: 12.5, label: "1 アカウント" },
      { t: 19, label: "2 アプリを入れる" },
      { t: 28.5, label: "3 家でつなぐ" },
      { t: 36.5, label: "4 外で試す" },
    ],
    homebrew: false,
  },
  voice: {
    title: "声で書く準備（Aqua Voice・BlackHole 2ch）",
    length: "1分25秒",
    duration: 84.5,
    label: "声で書く準備の動画。Aqua Voiceを入れる、ターミナルでHomebrewとBlackHole 2chを入れてMacを再起動する、Aqua VoiceのマイクをBlackHole 2chにする、デバイスから話して確かめる、の順に説明する。音は出ない",
    chapters: [
      { t: 4.5, label: "しくみ" },
      { t: 12, label: "1 Aqua Voice" },
      { t: 26.5, label: "2 BlackHole 2ch" },
      { t: 63, label: "3 マイクを選ぶ" },
      { t: 70.5, label: "話して確かめる" },
    ],
    homebrew: true,   // STEP 2 で Homebrew を使う
  },
} as const;

export type SetupVideoId = keyof typeof SETUP_VIDEOS;

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const spoken = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}分${Math.floor(s % 60)}秒` : `${Math.floor(s)}秒`);
const noop = () => () => {};
const track = (name: string, title: string) => {
  (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", name, { video_title: title, video_provider: "self" });
};

type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/** lang：リンク先の言語（動画そのものは、いまは日本語だけ） */
export function SetupVideo({ id, lang = "ja" }: { id: SetupVideoId; lang?: "ja" | "en" }) {
  const v = SETUP_VIDEOS[id];
  const player = useRef<HTMLDivElement>(null);
  const video = useRef<FullscreenVideo>(null);
  // JavaScript が動いているときだけ、自前の操作に切り替える（サーバーで作る HTML は controls 付き）
  const ready = useSyncExternalStore(noop, () => true, () => false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const onFull = () => setFull(document.fullscreenElement === player.current);
    document.addEventListener("fullscreenchange", onFull);
    return () => document.removeEventListener("fullscreenchange", onFull);
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
  };
  // まだ読み込んでいない動画は、長さが分かってから位置を合わせる
  const seek = (t: number, play: boolean) => {
    const el = video.current;
    if (!el) return;
    const set = () => { el.currentTime = t; };
    if (el.readyState >= 1) set();
    else el.addEventListener("loadedmetadata", set, { once: true });
    setTime(t);
    if (play) void el.play().catch(() => {});
    else if (el.readyState < 1) el.load();
  };
  const toggleFull = () => {
    const box = player.current, el = video.current;
    if (!box || !el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (box.requestFullscreen) void box.requestFullscreen().catch(() => {});
    else el.webkitEnterFullscreen?.();   // iPhone：動画だけを全画面にできる（操作は iOS のもの）
  };
  const onPlay = () => {
    // ほかの動画は止める（2 本を並べているため）
    document.querySelectorAll("video").forEach((o) => { if (o !== video.current) o.pause(); });
    if (!started) track("video_start", v.title);
    setStarted(true);
    setPlaying(true);
  };

  const current = v.chapters.reduce((found, c, i) => (time >= c.t - 0.05 ? i : found), -1);

  return (
    <figure className="setup-video">
      <div className="sv-player" ref={player} data-ready={ready ? "" : undefined} data-full={full ? "" : undefined}>
        <div className="sv-frame">
          <video
            ref={video}
            controls={!ready}
            playsInline
            preload="none"
            poster={`/videos/setup-${id}-poster.jpg`}
            width={1280}
            height={720}
            aria-label={v.label}
            onClick={ready ? toggle : undefined}
            onPlay={onPlay}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onEnded={() => { setPlaying(false); track("video_complete", v.title); }}
          >
            <source src={`/videos/setup-${id}-1080.mp4`} type="video/mp4" media="(min-width: 1000px)" />
            <source src={`/videos/setup-${id}.mp4`} type="video/mp4" />
          </video>
          {ready && !started && (
            <button type="button" className="sv-start" onClick={toggle} aria-label={`動画を再生：${v.title}（${v.length}）`}>
              <span className="sv-start-pill"><span className="sv-ico-play" aria-hidden="true"></span>動画を見る<small>{v.length}</small></span>
            </button>
          )}
        </div>
        {ready && (
          <>
            <div className="sv-bar">
              <button type="button" className="sv-btn" onClick={toggle} aria-label={playing ? "一時停止" : "再生"}>
                <span className={playing ? "sv-ico-pause" : "sv-ico-play"} aria-hidden="true"></span>
              </button>
              <input
                type="range"
                className="sv-seek"
                min={0}
                max={v.duration}
                step={0.1}
                value={Math.min(time, v.duration)}
                onChange={(e) => seek(parseFloat(e.currentTarget.value), false)}
                aria-label="再生位置"
                aria-valuetext={`${spoken(time)}／${spoken(Math.round(v.duration))}`}
                style={{ "--sv-pos": `${(Math.min(time, v.duration) / v.duration) * 100}%` } as CSSProperties}
              />
              <span className="sv-time" aria-hidden="true">{clock(time)} / {clock(Math.round(v.duration))}</span>
              <button type="button" className="sv-btn" onClick={toggleFull} aria-label={full ? "全画面をやめる" : "全画面で見る"}>
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {full ? <path d="M7 3v4H3M13 3v4h4M7 17v-4H3M13 17v-4h4" /> : <path d="M3 7V3h4M17 7V3h-4M3 13v4h4M17 13v4h-4" />}
                </svg>
              </button>
            </div>
            <ol className="sv-chapters" aria-label="見たいところから再生">
              {v.chapters.map((c, i) => (
                <li key={c.t}>
                  <button type="button" onClick={() => seek(c.t, true)} aria-current={i === current ? "true" : undefined}>{c.label}</button>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
      <figcaption>
        <b>動画で見る：{v.title}</b>{v.length}・音は出ません
        {v.homebrew && (
          <span className="sv-link">STEP 2で使う「Homebrew」の公式サイト：<a href={HOMEBREW_URL[lang]} target="_blank" rel="noopener noreferrer">{HOMEBREW_URL[lang].replace("https://", "")}</a></span>
        )}
      </figcaption>
    </figure>
  );
}
