"use client";

/**
 * Plays narration lines. Uses the recorded file /cases/<id>/narration/<LINE-ID>.mp3 when it exists,
 * otherwise falls back to the device's voice so the case stays playable before recordings land.
 */
import { duckMusic } from "./sound";

let current: HTMLAudioElement | null = null;
const missing = new Set<string>();

function stop() {
  try {
    current?.pause();
  } catch {}
  current = null;
  duckMusic(false);
  try {
    window.speechSynthesis?.cancel();
  } catch {}
}

function tts(text: string) {
  try {
    const s = window.speechSynthesis;
    if (!s) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.94;
    u.pitch = 0.85;
    const v = s.getVoices().find((v) => /en[-_](GB|IN)/i.test(v.lang));
    if (v) u.voice = v;
    s.speak(u);
  } catch {}
}

export function speakLine(caseId: string, id: string, text: string) {
  stop();
  const src = `/cases/${caseId}/narration/${id}.mp3`;
  if (missing.has(src)) return tts(text);
  const a = new Audio(src);
  current = a;
  a.onplay = () => current === a && duckMusic(true);
  a.onended = () => current === a && duckMusic(false);
  a.onerror = () => {
    missing.add(src);
    if (current === a) tts(text);
  };
  a.play().catch(() => {
    /* autoplay blocked or file missing; onerror covers the missing case */
  });
}

export const stopNarration = stop;

/** true while a recorded line or the device voice is speaking */
export function isSpeaking() {
  try {
    if (current && !current.paused && !current.ended) return true;
    return !!window.speechSynthesis?.speaking;
  } catch {
    return false;
  }
}
