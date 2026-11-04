"use client";

import { useEffect, useRef, useState } from "react";
import { Glyph } from "./Icons";

/** All case media lives in /public/cases/<id>/media. Missing files show a labelled placeholder. */
export const mediaPath = (file: string) => `/cases/017/media/${file}`;

export function ImageSlot({
  file,
  alt,
  ratio = "16 / 10",
  label,
  dark,
}: {
  file: string;
  alt: string;
  ratio?: string;
  label?: string;
  dark?: boolean;
}) {
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete) setState(img.naturalWidth > 0 ? "ok" : "missing");
  }, []);
  return (
    <div style={{ position: "relative", aspectRatio: ratio, background: dark ? "#0b0a09" : "#e3d8c2", overflow: "hidden" }}>
      {state !== "missing" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={mediaPath(file)}
          alt={alt}
          onLoad={() => setState("ok")}
          onError={() => setState("missing")}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: state === "ok" ? 1 : 0 }}
        />
      )}
      {state === "missing" && (
        <div
          role="img"
          aria-label={alt}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 20,
            textAlign: "center",
            color: dark ? "#8b8376" : "#7a6a55",
            border: `1px dashed ${dark ? "#3d3328" : "#b9a888"}`,
            fontFamily: "var(--type)",
          }}
        >
          <svg width="34" height="28" viewBox="0 0 34 28" aria-hidden>
            <rect x="1" y="5" width="32" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <rect x="11" y="1" width="12" height="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="17" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase" }}>{label ?? "Photograph"}</div>
          <div style={{ fontSize: 13, maxWidth: 420, lineHeight: 1.45 }}>{alt}</div>
        </div>
      )}
    </div>
  );
}

export function AudioSlot({ file, seconds }: { file: string; seconds: number }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(seconds);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (a.error) setState("missing");
    else if (a.readyState >= 1) setState("ok");
    return () => a.pause();
  }, []);

  const bars = Array.from({ length: 76 }, (_, i) => 6 + Math.abs(Math.sin(i * 1.7) * 18 + Math.sin(i * 0.37) * 10));
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="no-print">
      <audio
        ref={ref}
        src={mediaPath(file)}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setState("ok");
          if (isFinite(e.currentTarget.duration)) setDur(e.currentTarget.duration);
        }}
        onError={() => setState("missing")}
        onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setPos(0);
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", border: "1px solid rgba(27,22,17,.5)", background: "rgba(27,22,17,.04)", opacity: state === "missing" ? 0.6 : 1 }}>
        <button
          disabled={state !== "ok"}
          onClick={() => {
            const a = ref.current;
            if (!a) return;
            if (a.paused) a.play().catch(() => setState("missing"));
            else a.pause();
          }}
          aria-label={playing ? "Pause" : "Play"}
          style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid #1b1611", background: "#1b1611", color: "#f1e9d8", display: "grid", placeItems: "center", cursor: state === "ok" ? "pointer" : "not-allowed", flex: "none" }}
        >
          {playing ? Glyph.pause : Glyph.play}
        </button>
        <div
          style={{ flex: 1, display: "flex", alignItems: "center", gap: 2, height: 40, overflow: "hidden", cursor: state === "ok" ? "pointer" : "default" }}
          onClick={(e) => {
            const a = ref.current;
            if (!a || state !== "ok") return;
            const r = e.currentTarget.getBoundingClientRect();
            a.currentTime = ((e.clientX - r.left) / r.width) * dur;
          }}
        >
          {bars.map((h, i) => (
            <span key={i} style={{ width: 3, height: h, background: i / bars.length <= pos / dur ? "#1b1611" : "rgba(27,22,17,.25)", flex: "none" }} />
          ))}
        </div>
        <span className="mono small" style={{ flex: "none" }}>
          {fmt(pos)} / {fmt(dur)}
        </span>
      </div>
      {state === "missing" && (
        <div className="small muted" style={{ marginTop: 6 }}>
          Recording not yet on file. The transcript below is complete.
        </div>
      )}
    </div>
  );
}
