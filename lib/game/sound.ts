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

// Browsers block sound until the person has interacted with the page. Keep listening for a tap, click
// or key until the music has actually started (one listener set, however many times play was blocked).
let listening = false;
function unlockOnGesture() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  const evs = ["pointerdown", "click", "touchend", "keydown"] as const;
  const go = () => {
    if (!wanted || !music || settings.music === 0) return;
    music.volume = settings.music * (ducked ? DUCK : 1);
    music
      .play()
      .then(() => {
        listening = false;
        evs.forEach((e) => window.removeEventListener(e, go, true));
      })
      .catch(() => {});
  };
  evs.forEach((e) => window.addEventListener(e, go, true));
}

// The track is looped by hand rather than with `loop`: some browsers stall at the end of a looped MP3
// and never restart. A watchdog also restarts it if it is ever paused or frozen without being asked to.
let lastTime = -1;
let frozenFor = 0;
let watchdog: number | null = null;
function keepAlive() {
  if (!wanted || !music || settings.music === 0) return;
  if (music.paused || music.ended) {
    if (music.ended) music.currentTime = 0;
    void music.play().catch(unlockOnGesture);
    frozenFor = 0;
  } else if (Math.abs(music.currentTime - lastTime) < 0.01) {
    // playing but not moving: a stalled download; reload from the same spot after a few seconds
    frozenFor += 2;
    if (frozenFor >= 6) {
      const at = music.currentTime;
      music.load();
      music.currentTime = at;
      void music.play().catch(() => {});
      frozenFor = 0;
    }
  } else frozenFor = 0;
  lastTime = music.currentTime;
}

export function startMusic() {
  load();
  wanted = true;
  if (!music) {
    music = new Audio("/audio/music-suspense.mp3");
    music.loop = false;
    music.preload = "auto";
    (window as unknown as { __bbMusic?: HTMLAudioElement }).__bbMusic = music; // for checking playback in the console
    music.addEventListener("ended", () => {
      if (!wanted || !music) return;
      music.currentTime = 0;
      void music.play().catch(() => {});
    });
    // if the browser pauses it on its own (another tab's media, a device change), pick it up again
    music.addEventListener("pause", () => {
      if (wanted && settings.music > 0) window.setTimeout(() => music?.paused && void music.play().catch(unlockOnGesture), 800);
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) keepAlive();
    });
    watchdog = window.setInterval(keepAlive, 2000);
  }
  if (!music.paused) return applyVolume();
  music.volume = settings.music * (ducked ? DUCK : 1);
  if (settings.music > 0) music.play().catch(unlockOnGesture);
}

// Browsers only allow sound after the visitor interacts, so the 1.7 MB track is not even fetched until
// then: the first tap, click or key on any page starts it, and later pages start it straight away.
let interacted = false;
let waiting = false;
export function startMusicWhenAllowed() {
  if (typeof window === "undefined") return;
  wanted = true;
  if (interacted) return startMusic();
  if (waiting) return;
  waiting = true;
  const evs = ["pointerdown", "keydown", "touchstart"] as const;
  const go = () => {
    evs.forEach((e) => window.removeEventListener(e, go, true));
    waiting = false;
    interacted = true;
    if (wanted) startMusic();
  };
  evs.forEach((e) => window.addEventListener(e, go, { capture: true, passive: true }));
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
