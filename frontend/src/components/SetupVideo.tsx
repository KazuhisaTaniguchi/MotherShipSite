"use client";

// セットアップ動画のプレーヤー（2026-11-27。mock/design/script.js の「セットアップ動画」と同じ動き）
// ・動画のテロップは下の端にある。ブラウザーの再生バーはそこに重なるので、操作は動画の下に自前で出す
// ・JavaScript が動かないときは、ブラウザーの再生バー（controls）のまま見られる
// ・「見たいところから」のボタンで、そのステップへ飛ぶ（秒は mock/design/tools/setup-video/stage.html の場面の頭。動画を作り直したら、ここも直す）
// ・広い画面では 1920×1080、ほかは 1280×720 を読む。押すまで動画は読み込まない（preload="none"）
// ・再生を始めたとき・最後まで見たときに、GA へイベントを送る（video_start・video_complete。同意の扱いは Analytics.tsx）
// ・lang="en" のときは、英語版の動画（setup-*-en.mp4。テロップも画面の文も英語）と、英語の操作の文を出す（2026-11-27）
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

// 英語版（動画は mock/design/tools/setup-video/stage-en.html。場面の秒・長さは日本語版と同じ）
const SETUP_VIDEOS_EN: Record<SetupVideoId, { title: string; length: string; label: string; chapters: string[] }> = {
  outside: {
    title: "Remote access setup (Tailscale)",
    length: "52 sec",
    label: "Video: setting up remote access. Create a Tailscale account, install Tailscale on your Mac and your device and sign in to the same account, connect once with MOTHERSHIP on your home Wi-Fi, then turn off Wi-Fi and test. No sound.",
    chapters: ["How it works", "1 Account", "2 Install the app", "3 Connect at home", "4 Test outside"],
  },
  voice: {
    title: "Voice input setup (Aqua Voice, BlackHole 2ch)",
    length: "1 min 25 sec",
    label: "Video: setting up voice input. Install Aqua Voice, install Homebrew and BlackHole 2ch in Terminal and restart your Mac, set Aqua Voice's microphone to BlackHole 2ch, then talk from your device to check. No sound.",
    chapters: ["How it works", "1 Aqua Voice", "2 BlackHole 2ch", "3 Choose the mic", "Try talking"],
  },
};

const spokenEn = (s: number) => (s >= 60 ? `${Math.floor(s / 60)} min ${Math.floor(s % 60)} sec` : `${Math.floor(s)} sec`);
const UI = {
  ja: {
    start: (title: string, length: string) => `動画を再生：${title}（${length}）`, watch: "動画を見る", play: "再生", pause: "一時停止", position: "再生位置",
    full: "全画面で見る", unfull: "全画面をやめる", chapters: "見たいところから再生", caption: "動画で見る：", silent: "・音は出ません", brew: "STEP 2で使う「Homebrew」の公式サイト：",
  },
  en: {
    start: (title: string, length: string) => `Play video: ${title} (${length})`, watch: "Watch the video", play: "Play", pause: "Pause", position: "Playback position",
    full: "Full screen", unfull: "Exit full screen", chapters: "Jump to a step", caption: "Watch: ", silent: " · No sound", brew: "Official site for Homebrew, used in Step 2: ",
  },
} as const;

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const spoken = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}分${Math.floor(s % 60)}秒` : `${Math.floor(s)}秒`);
const noop = () => () => {};
const track = (name: string, title: string) => {
  (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", name, { video_title: title, video_provider: "self" });
};

type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/** lang：動画・操作の文・リンク先の言語 */
export function SetupVideo({ id, lang = "ja" }: { id: SetupVideoId; lang?: "ja" | "en" }) {
  const base = SETUP_VIDEOS[id];
  const en = lang === "en";
  const v = en
    ? { ...base, title: SETUP_VIDEOS_EN[id].title, length: SETUP_VIDEOS_EN[id].length, label: SETUP_VIDEOS_EN[id].label, chapters: base.chapters.map((c, i) => ({ t: c.t, label: SETUP_VIDEOS_EN[id].chapters[i] })) }
    : base;
  const ui = UI[lang];
  const file = `/videos/setup-${id}${en ? "-en" : ""}`;
  const say = en ? spokenEn : spoken;
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
            poster={`${file}-poster.jpg`}
            width={1280}
            height={720}
            aria-label={v.label}
            onClick={ready ? toggle : undefined}
            onPlay={onPlay}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onEnded={() => { setPlaying(false); track("video_complete", v.title); }}
          >
            <source src={`${file}-1080.mp4`} type="video/mp4" media="(min-width: 1000px)" />
            <source src={`${file}.mp4`} type="video/mp4" />
          </video>
          {ready && !started && (
            <button type="button" className="sv-start" onClick={toggle} aria-label={ui.start(v.title, v.length)}>
              <span className="sv-start-pill"><span className="sv-ico-play" aria-hidden="true"></span>{ui.watch}<small>{v.length}</small></span>
            </button>
          )}
        </div>
        {ready && (
          <>
            <div className="sv-bar">
              <button type="button" className="sv-btn" onClick={toggle} aria-label={playing ? ui.pause : ui.play}>
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
                aria-label={ui.position}
                aria-valuetext={`${say(time)}${en ? " of " : "／"}${say(Math.round(v.duration))}`}
                style={{ "--sv-pos": `${(Math.min(time, v.duration) / v.duration) * 100}%` } as CSSProperties}
              />
              <span className="sv-time" aria-hidden="true">{clock(time)} / {clock(Math.round(v.duration))}</span>
              <button type="button" className="sv-btn" onClick={toggleFull} aria-label={full ? ui.unfull : ui.full}>
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {full ? <path d="M7 3v4H3M13 3v4h4M7 17v-4H3M13 17v-4h4" /> : <path d="M3 7V3h4M17 7V3h-4M3 13v4h4M17 13v4h-4" />}
                </svg>
              </button>
            </div>
            <ol className="sv-chapters" aria-label={ui.chapters}>
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
        <b>{ui.caption}{v.title}</b>{v.length}{ui.silent}
        {v.homebrew && (
          <span className="sv-link">{ui.brew}<a href={HOMEBREW_URL[lang]} target="_blank" rel="noopener noreferrer">{HOMEBREW_URL[lang].replace("https://", "")}</a></span>
        )}
      </figcaption>
    </figure>
  );
}
