"use client";

import { ArrowLeft } from "@/components/Arrow";
import Link from "next/link";
import { useEffect, useState } from "react";
import { hollowPines } from "@/lib/cases/hollow-pines";
import { NAME_KEY, roomNameKey, useRoomGame, type Game } from "@/lib/game/game";
import { MAX_PLAYERS, sortedPlayers } from "@/lib/game/state";
import { Desk } from "./Desk";
import { accountsAvailable, useAuth } from "@/lib/account";


export function Room({ code }: { code: string }) {
  const [name, setName] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(roomNameKey(code));
      const inRoom = raw ? (JSON.parse(raw) as string) : null;
      if (inRoom) setName(inRoom);
      setDraft(inRoom ?? localStorage.getItem(NAME_KEY) ?? "");
    } catch {}
    setReady(true);
  }, [code]);

  // signed in: sit down under the account's name, no need to ask
  const { ready: authReady, user, profile } = useAuth();
  useEffect(() => {
    if (!ready || name || !authReady || !user || !profile) return;
    const n = profile.display_name.trim().slice(0, 24) || "Detective";
    try {
      localStorage.setItem(NAME_KEY, n);
      localStorage.setItem(roomNameKey(code), JSON.stringify(n));
    } catch {}
    setName(n);
  }, [ready, name, authReady, user, profile, code]);

  const { game, status } = useRoomGame(hollowPines, code, name);

  if (!ready || (accountsAvailable && !authReady) || (user && !name)) return null;

  if (code.length !== 5) {
    return (
      <Shell>
        <h1 className="room-h">That room code doesn&apos;t look right</h1>
        <p className="muted-dark">Room codes are five letters and numbers.</p>
        <Link className="btn" href="/room">Try again</Link>
      </Shell>
    );
  }

  if (!name) {
    return (
      <Shell>
        <div className="eyebrow">Room {code} · Case No. {hollowPines.number}</div>
        <h1 className="room-h">What should the table call you?</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const n = draft.trim().slice(0, 24);
            if (!n) return;
            try {
              localStorage.setItem(NAME_KEY, n);
              localStorage.setItem(roomNameKey(code), JSON.stringify(n));
            } catch {}
            setName(n);
          }}
          style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          <input className="field-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Your name" aria-label="Your name" maxLength={24} autoFocus />
          <button className="btn primary" disabled={!draft.trim()}>Enter the room</button>
        </form>
      </Shell>
    );
  }

  if (!game) {
    return (
      <Shell>
        <div className="eyebrow">Room {code}</div>
        <h1 className="room-h">{status === "waiting" ? "Waiting for the host" : status === "full" ? "This room is full" : "Connecting…"}</h1>
        <p className="muted-dark">
          {status === "waiting"
            ? "Nobody has opened this room yet. Keep this page open; you will join as soon as the host arrives."
            : status === "full"
              ? `A room holds up to ${MAX_PLAYERS} players.`
              : "Finding the table."}
        </p>
      </Shell>
    );
  }

  if (status === "removed" && !game.s.players[game.me]) {
    return (
      <Shell>
        <h1 className="room-h">You were removed from this room</h1>
        <p className="muted-dark">Ask the host for a new invite if this was a mistake.</p>
        <Link className="btn" href="/cases">Case archive</Link>
      </Shell>
    );
  }

  if (status === "full" && !game.s.players[game.me]) {
    return (
      <Shell>
        <h1 className="room-h">This room is full</h1>
        <p className="muted-dark">A room holds up to {MAX_PLAYERS} players.</p>
        <Link className="btn" href="/cases">Case archive</Link>
      </Shell>
    );
  }

  if (!game.s.players[game.me]) {
    return (
      <Shell>
        <div className="eyebrow">Room {code}</div>
        <h1 className="room-h">Taking your seat…</h1>
        <p className="muted-dark">Waiting for the host&apos;s device to let you in.</p>
      </Shell>
    );
  }

  if (game.s.phase === "lobby") return <Lobby g={game} />;
  return <Desk g={game} exitHref="/cases" />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="wrap" style={{ paddingTop: 28, paddingBottom: 80, maxWidth: 640 }}>
      <Link href="/cases" className="btn ghost" style={{ paddingLeft: 0 }}>{ArrowLeft} Case archive</Link>
      <div style={{ marginTop: 40 }}>{children}</div>
    </div>
  );
}

function Lobby({ g }: { g: Game }) {
  const { s, c } = g;
  const [copied, setCopied] = useState(false);
  const link = typeof window !== "undefined" ? `${window.location.origin}/room/${g.room!.code}` : "";
  const ids = sortedPlayers(s);
  const here = ids.filter((id) => g.online.includes(id));

  return (
    <Shell>
      <div className="eyebrow">Case No. {c.number} · {c.title}</div>
      <h1 className="room-h">The lobby</h1>
      <div className="lobby-code">
        <div>
          <div className="eyebrow">Room code</div>
          <div className="code-big" data-testid="room-code">{g.room!.code}</div>
        </div>
        <button
          className="btn sm"
          onClick={() => {
            navigator.clipboard?.writeText(link).then(() => setCopied(true), () => {});
          }}
        >
          {copied ? "Link copied" : "Copy invite link"}
        </button>
      </div>
      <p className="muted-dark" style={{ fontSize: 14, marginTop: 8 }}>Friends open <span className="mono-inline">{link.replace(/^https?:\/\//, "")}</span>, or tap Join a room and enter the code.</p>
      {g.room!.transport === "local" && (
        <p className="note">Same-device mode: this room only connects tabs in this browser. Add the Supabase keys to play across phones.</p>
      )}

      <div className="eyebrow" style={{ marginTop: 30 }}>At the table · {here.length} of {MAX_PLAYERS}</div>
      <ul className="roster">
        {ids.map((id) => (
          <li key={id}>
            <span className={`dot ${g.online.includes(id) ? "" : "off"}`} />
            <span style={{ flex: 1 }}>{s.players[id].name}{id === g.me ? " (you)" : ""}</span>
            {id === s.hostId && <span className="tag new">Host</span>}
            {g.isHost && id !== g.me && (
              <button className="btn ghost sm" onClick={() => g.act({ t: "kick", id })} aria-label={`Remove ${s.players[id].name}`}>Remove</button>
            )}
          </li>
        ))}
      </ul>

      <div className="eyebrow" style={{ marginTop: 26 }}>Evidence</div>
      <div className="choices" style={{ marginTop: 8 }}>
        {(["shared", "split"] as const).map((m) => (
          <label key={m} className={`choice ${s.mode === m ? "on" : ""} ${g.isHost ? "" : "readonly"}`}>
            <input type="radio" name="mode" checked={s.mode === m} disabled={!g.isHost} onChange={() => g.act({ t: "setMode", mode: m })} />
            <span>
              <b>{m === "shared" ? "Shared" : "Split"}</b>
              <span className="muted-dark" style={{ display: "block", fontSize: 14 }}>
                {m === "shared" ? "Every player sees every unlocked file." : "Files are dealt out between players. You must read yours aloud to the others."}
              </span>
            </span>
          </label>
        ))}
      </div>
      <label className={`toggle ${g.isHost ? "" : "disabled"}`} style={{ marginTop: 10 }}>
        <input type="checkbox" checked={s.timerEnabled} disabled={!g.isHost} onChange={() => g.act({ t: "setTimer", on: !s.timerEnabled })} />
        <span><b>Round timers.</b> A shared countdown of 20 to 25 minutes per round.</span>
      </label>

      <div style={{ marginTop: 26, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        {g.isHost ? (
          <>
            <button className="btn primary" onClick={() => g.act({ t: "start" })}>Start case</button>
            <span className="muted-dark" style={{ fontSize: 14 }}>{here.length < 2 ? "Best with 2 to 6 players. You can start alone." : "Everyone joins the same line of the story."}</span>
          </>
        ) : (
          <span className="muted-dark">Waiting for {s.players[s.hostId]?.name ?? "the host"} to start the case.</span>
        )}
      </div>
      {g.hostAway && <p className="note">The host has lost connection. Control passes to the next player shortly.</p>}
    </Shell>
  );
}
