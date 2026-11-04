"use client";

/**
 * Plays narration lines. Uses the recorded file /cases/<id>/narration/<LINE-ID>.mp3 when it exists,
 * otherwise falls back to the device's voice so the case stays playable before recordings land.
 */
import { duckMusic } from "./sound";

let current: HTMLAudioElement | null = null;
const missing = new Set<string>();
// bumped on every stop/start, so a line that was stopped or replaced never reports "finished"
let token = 0;

function stop() {
  token++;
  try {
    current?.pause();
  } catch {}
  current = null;
  duckMusic(false);
  try {
    window.speechSynthesis?.cancel();
  } catch {}
}

function tts(text: string, done: () => void) {
  try {
    const s = window.speechSynthesis;
    if (!s) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.94;
    u.pitch = 0.85;
    const v = s.getVoices().find((v) => /en[-_](GB|IN)/i.test(v.lang));
    if (v) u.voice = v;
    u.onend = done;
    s.speak(u);
  } catch {}
}

/** what is playing now: a narration line, or an exhibit brief (which narration must not cut off) */
let kind: "line" | "brief" = "line";

/**
 * Plays one line. `onEnd` runs only if the line plays to its end (not when stopped or replaced).
 * A narration line never interrupts a brief that is playing: it is skipped and the caller can retry later.
 * Returns false when skipped.
 */
export function speakLine(caseId: string, id: string, text: string, onEnd?: () => void, as: "line" | "brief" = "line") {
  if (as === "line" && briefPlaying()) return false;
  stop();
  kind = as;
  const mine = token;
  const done = () => {
    if (token !== mine) return;
    duckMusic(false);
    onEnd?.();
  };
  const src = `/cases/${caseId}/narration/${id}.mp3`;
  if (missing.has(src)) {
    tts(text, done);
    return true;
  }
  const a = new Audio(src);
  current = a;
  a.onplay = () => current === a && duckMusic(true);
  a.onended = done;
  a.onerror = () => {
    missing.add(src);
    if (current === a) tts(text, done);
  };
  a.play().catch(() => {
    /* autoplay blocked or file missing; onerror covers the missing case */
  });
  return true;
}

export const stopNarration = stop;

/** true while an exhibit brief is playing */
export function briefPlaying() {
  return kind === "brief" && isSpeaking();
}

/** stops narration lines but leaves a playing brief alone */
export function stopLines() {
  if (!briefPlaying()) stop();
}

/** true while a recorded line or the device voice is speaking */
export function isSpeaking() {
  try {
    if (current && !current.paused && !current.ended) return true;
    return !!window.speechSynthesis?.speaking;
  } catch {
    return false;
  }
}
