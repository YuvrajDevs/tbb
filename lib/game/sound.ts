"use client";

import { useEffect, useState } from "react";

/**
 * Background music and sound effects. Settings are per device (not per room), kept in localStorage.
 * Music loops while a case desk is open; it dips while the narrator speaks so the voice stays clear.
 */
export type SoundSettings = { music: number; sfx: boolean };

const KEY = "blackwood:sound";
const DEFAULTS: SoundSettings = { music: 0.3, sfx: true };
const DUCK = 0.45; // music level while the narrator speaks, as a share of the chosen level

let settings: SoundSettings = DEFAULTS;
let loaded = false;
const listeners = new Set<(s: SoundSettings) => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) settings = { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
}

export function getSound(): SoundSettings {
  load();
  return settings;
}

export function setSound(patch: Partial<SoundSettings>) {
  load();
  settings = { ...settings, ...patch, music: Math.max(0, Math.min(1, patch.music ?? settings.music)) };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {}
  applyVolume();
  listeners.forEach((l) => l(settings));
}

export function useSound(): SoundSettings {
  const [s, set] = useState<SoundSettings>(DEFAULTS);
  useEffect(() => {
    set(getSound());
    listeners.add(set);
    return () => void listeners.delete(set);
  }, []);
  return s;
}

/* ---------- music ---------- */

let music: HTMLAudioElement | null = null;
let wanted = false;
let ducked = false;

function applyVolume() {
  if (!music) return;
  const v = settings.music * (ducked ? DUCK : 1);
  music.volume = v;
  if (v === 0) music.pause();
  else if (wanted && music.paused) void music.play().catch(() => {});
}

// Browsers block sound until the person has touched the page; retry on the first touch.
function unlockOnGesture() {
  const go = () => {
    window.removeEventListener("pointerdown", go);
    window.removeEventListener("keydown", go);
    if (wanted) applyVolume();
  };
  window.addEventListener("pointerdown", go, { once: true });
  window.addEventListener("keydown", go, { once: true });
}

export function startMusic() {
  load();
  wanted = true;
  if (!music) {
    music = new Audio("/audio/music-suspense.mp3");
    music.loop = true;
    music.preload = "auto";
  }
  music.volume = 0;
  applyVolume();
  if (music.paused && settings.music > 0) music.play().catch(unlockOnGesture);
}

export function stopMusic() {
  wanted = false;
  music?.pause();
}

export function duckMusic(on: boolean) {
  if (ducked === on) return;
  ducked = on;
  applyVolume();
}

/* ---------- effects ---------- */

const sfxCache: Record<string, HTMLAudioElement> = {};

function sfx(name: "page" | "click", volume: number) {
  load();
  if (!settings.sfx || typeof window === "undefined") return;
  try {
    const base = (sfxCache[name] ??= Object.assign(new Audio(`/audio/sfx-${name}.mp3`), { preload: "auto" }));
    const a = base.cloneNode() as HTMLAudioElement;
    a.volume = volume;
    void a.play().catch(() => {});
  } catch {}
}

export const playPageTurn = () => sfx("page", 0.7);
export const playClick = () => sfx("click", 0.6);
