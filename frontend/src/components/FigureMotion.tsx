"use client";

// 図の動き（2026-11-21。mock/design/script.js の「図の動き」と同じ）
// ・画面の外にある図は止める：動く図のある節（HERO 以外）に data-motion、画面の外にある間は data-offscreen を付ける
// ・動く図が見えている間だけ、左下に「図の動きを止める」ボタンを出す。押すと html に motion-paused を付け、localStorage に覚える
// ・止めるのは CSS（src/styles/components.css）。「視差効果を減らす」の設定では、ボタンは CSS で隠す
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { isEnPath } from "@/lib/i18n";

const KEY = "mothership-motion-paused";
const EVENT = "mothership-motion";

// 止めたかどうかは localStorage に覚える（保存できない環境では、このページを開いている間だけ覚える）
let memory = false;
const readPaused = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return memory;
  }
};
const writePaused = (next: boolean) => {
  memory = next;
  try {
    localStorage.setItem(KEY, next ? "1" : "0");
  } catch {
    /* 何もしない */
  }
  window.dispatchEvent(new Event(EVENT));
};
const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
};

export function FigureMotion() {
  const pathname = usePathname();
  const en = isEnPath(pathname);
  const paused = useSyncExternalStore(subscribe, readPaused, () => false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("motion-paused", paused);
  }, [paused]);

  // ページごとに、動く図のある節を見張る
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section, main aside")).filter(
      (s) => !s.closest(".hero") && (!s.getAnimations || s.getAnimations({ subtree: true }).length > 0),
    );
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.target.toggleAttribute("data-offscreen", !e.isIntersecting);
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        });
        setShown(visible.size > 0);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    sections.forEach((s) => {
      s.setAttribute("data-motion", "");
      io.observe(s);
    });
    return () => {
      io.disconnect();
      sections.forEach((s) => {
        s.removeAttribute("data-motion");
        s.removeAttribute("data-offscreen");
      });
      setShown(false);
    };
  }, [pathname]);

  const toggle = () => writePaused(!paused);

  const label = paused ? (en ? "Play animations" : "図を動かす") : en ? "Pause animations" : "図の動きを止める";
  return (
    <button type="button" className={`motion-toggle${shown ? " is-shown" : ""}`} onClick={toggle}>
      <span className="motion-toggle-icon" aria-hidden="true"></span>
      <span className="motion-toggle-text">{label}</span>
    </button>
  );
}
