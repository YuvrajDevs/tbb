"use client";

import { useEffect, useRef, useState } from "react";
import { setSound, useSound } from "@/lib/game/sound";
import { Glyph } from "./Icons";

/** Music volume and sound effects, per device. Used on the desk's settings sheet and on the archive. */
export function SoundControls({ party = false }: { party?: boolean }) {
  const sound = useSound();
  const pct = Math.round(sound.music * 100);
  return (
    <>
      <label className="toggle range">
        <span>
          <b>Background music{party ? " on this device" : ""}.</b> {pct}%{sound.music === 0 ? " (off)" : ""}. It softens while the narrator speaks.
          <input type="range" min={0} max={100} step={5} value={pct} onChange={(e) => setSound({ music: Number(e.target.value) / 100 })} aria-label="Background music volume" />
        </span>
      </label>
      <label className="toggle">
        <input type="checkbox" checked={sound.sfx} onChange={() => setSound({ sfx: !sound.sfx })} />
        <span><b>Sound effects.</b> A page turn when you open a file, a click when you open a folder.</span>
      </label>
    </>
  );
}

/** A gear button that opens a small settings card. Closes on outside click or Escape. */
export function SettingsButton() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);
  return (
    <div className="settings-wrap" ref={box}>
      <button className={`btn settings-btn ${open ? "on" : ""}`} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Sound settings">
        {Glyph.gear}
        <span>Settings</span>
      </button>
      {open && (
        <div className="settings-pop" role="dialog" aria-label="Sound settings">
          <div className="eyebrow">Settings</div>
          <div className="settings-h">Sound</div>
          <SoundControls />
        </div>
      )}
    </div>
  );
}
