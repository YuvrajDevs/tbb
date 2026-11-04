"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CaseFile, EvidenceFile, NudgeKind, Round } from "@/lib/types";
import type { Game } from "@/lib/game/game";
import { allSolved, holderOf, lastRound, scriptLines, sortedPlayers, type Private, type Shared, type SuspectMark, type Vote } from "@/lib/game/state";
import { isSpeaking, speakLine, stopNarration } from "@/lib/game/narrator";
import { checkAnswer, fetchHint, fetchVerdict, skipRound } from "@/lib/game/api";
import { playClick, playPageTurn } from "@/lib/game/sound";
import { SoundControls } from "./SoundSettings";
import { RatingPrompt } from "./RatingPrompt";
import { recordFinish, useAuth } from "@/lib/account";
import { FileIcon, FolderIcon, Glyph, type FolderState } from "./Icons";
import { Evidence } from "./evidence";

/** quiet time before the narrator nudges; `localStorage["blackwood:idleMs"]` overrides it for testing */
const IDLE_MS = (() => {
  try {
    return Number(window.localStorage.getItem("blackwood:idleMs")) || 150_000;
  } catch {
    return 150_000;
  }
})();

type Panel = null |"notebook" | "hints" | "checkpoint" | "settings" | "accuse" | "reveal" | "table";
type Toast = { id: number; text: string; action?: { label: string; run: () => void } };

const fileById = (c: CaseFile, id: string) => c.rounds.flatMap((r) => r.files).find((f) => f.id === id);

export function Desk({ g, exitHref }: { g: Game; exitHref: string }) {
  const { c, s, priv, setPriv } = g;
  // the folder you picked stays open until the room opens a new one
  const [picked, setPicked] = useState<{ round: number; at: number } | null>(null);
  const folder = picked && picked.at === s.unlocked && picked.round <= s.unlocked ? picked.round : s.unlocked;
  const [fileId, setFileId] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [zoom, setZoom] = useState(1);
  const [narOpen, setNarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // the desk shell leaves room at the bottom for the narration dock, whatever its height
  const deskRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const d = dockRef.current;
    if (!d) return;
    const set = () => deskRef.current?.style.setProperty("--dock-h", `${d.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(d);
    return () => ro.disconnect();
  }, []);

  const current = c.rounds.find((r) => r.number === s.unlocked)!;
  const solvedAll = allSolved(c, s);
  const name = useCallback((id: string) => (id === g.me ? "You" : s.players[id]?.name ?? "A player"), [g.me, s.players]);
  const allFiles = useMemo(() => c.rounds.flatMap((r) => r.files), [c]);
  const openFile = allFiles.find((f) => f.id === fileId) ?? null;

  const holder = (f: EvidenceFile) => (g.party ? holderOf(c, s, f.id, g.online) : null);
  const canOpen = (f: EvidenceFile) => {
    const h = holder(f);
    return h === null || h === g.me;
  };

  const view = (f: EvidenceFile) => {
    if (f.id !== fileId) playPageTurn();
    setFileId(f.id);
    setZoom(1);
    setPanel(null);
    setPicked({ round: c.rounds.find((r) => r.files.includes(f))!.number, at: s.unlocked });
    if (!priv.viewed.includes(f.id)) setPriv((x) => ({ ...x, viewed: [...x.viewed, f.id] }));
  };

  /* ---------- toasts ---------- */
  const toast = useCallback((text: string, action?: Toast["action"]) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text, action }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 6000);
  }, []);

  const prev = useRef<{ s: Shared; online: string[] } | null>(null);
  const panelRef = useRef(panel);
  panelRef.current = panel;
  useEffect(() => {
    const p = prev.current;
    prev.current = { s, online: g.online };
    if (!p || !g.party) return;
    const was = p.s;
    const here = (ids: string[], st: Shared) => ids.filter((id) => st.players[id] && id !== g.me);
    for (const id of here(g.online, s)) if (!here(p.online, was).includes(id)) toast(`${s.players[id].name} joined the table`);
    for (const id of here(p.online, was)) if (!g.online.includes(id) && s.players[id]) toast(`${s.players[id].name} left the table`);
    if (was.hostId !== s.hostId) toast(s.hostId === g.me ? "You are now the host" : `${name(s.hostId)} is now the host`);
    if (s.unlocked > was.unlocked && s.hostId !== g.me) toast(`Folder ${s.unlocked} is open`);
    if (s.lastAnswer && s.lastAnswer !== was.lastAnswer && !s.lastAnswer.correct && s.hostId !== g.me && panelRef.current !== "checkpoint") {
      toast("The host's answer was wrong. Look again.", { label: "Checkpoint", run: () => setPanel("checkpoint") });
    }
    const newMsgs = (s.chat ?? []).filter((m) => m.by !== g.me && !(was.chat ?? []).some((x) => x.id === m.id));
    if (newMsgs.length && panelRef.current !== "table") {
      const m = newMsgs[newMsgs.length - 1];
      toast(`${name(m.by)}: ${m.text.length > 70 ? m.text.slice(0, 70) + "…" : m.text}`, { label: "Reply", run: () => setPanel("table") });
    }
    if (s.pointer && s.pointer.at !== was.pointer?.at && s.pointer.by !== g.me) {
      const f = fileById(c, s.pointer.fileId);
      if (f) {
        const h = holderOf(c, s, f.id, g.online);
        toast(
          `${name(s.pointer.by)} points to Exhibit ${f.exhibit}${h && h !== g.me ? ` (held by ${name(h)})` : ""}`,
          !h || h === g.me ? { label: "Open", run: () => view(f) } : undefined
        );
      }
    }
    for (const id of s.shown ?? []) {
      if ((was.shown ?? []).includes(id)) continue;
      const f = fileById(c, id);
      if (f && was.assign[id] !== g.me) toast(`Exhibit ${f.exhibit} is now visible to everyone`, { label: "Open", run: () => view(f) });
    }
  }); // runs after every render, compares with the last snapshot

  /* ---------- room-driven panel changes ---------- */
  const lastUnlocked = useRef(s.unlocked);
  useEffect(() => {
    if (s.unlocked !== lastUnlocked.current) {
      lastUnlocked.current = s.unlocked;
      setFileId(null);
      setPanel((p) => (p === "checkpoint" || p === "hints" ? null : p));
    }
  }, [s.unlocked]);

  // signed in: file the closed case in the player's history (once per game; every player in a room gets theirs)
  const { user } = useAuth();
  useEffect(() => {
    if (!user || !s.finishedAt || !s.result) return;
    const mins = s.startedAt ? Math.max(0, Math.round((s.finishedAt - s.startedAt) / 60000)) : null;
    void recordFinish({
      case_id: c.id,
      mode: g.party ? "party" : "solo",
      verdict: s.result.verdict,
      correct: s.result.right,
      minutes: mins,
      hints: Object.values(s.hints).reduce((t, n) => t + n, 0),
      players: Math.max(1, Object.keys(s.players).length),
      finished_at: new Date(s.finishedAt).toISOString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, s.finishedAt, !!s.result]);

  const lastFinished = useRef(s.finishedAt);
  useEffect(() => {
    if (s.finishedAt && s.finishedAt !== lastFinished.current) setPanel("reveal");
    lastFinished.current = s.finishedAt;
  }, [s.finishedAt]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (panel) setPanel(null);
      else setFileId(null);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [panel]);

  /* ---------- chat unread ---------- */
  const chat = s.chat ?? [];
  const unread = chat.filter((m) => m.by !== g.me && m.at > (priv.chatReadAt ?? 0)).length;
  useEffect(() => {
    if (panel === "table" && chat.length && chat[chat.length - 1].at > (priv.chatReadAt ?? 0)) {
      setPriv((x) => ({ ...x, chatReadAt: chat[chat.length - 1].at }));
    }
  }, [panel, chat, priv.chatReadAt, setPriv]);

  /* ---------- narration ---------- */
  const lines = scriptLines(c, s.narration.script, s);
  const line = lines[Math.min(s.narration.line, lines.length - 1)];
  const spoken = useRef<string>("");
  // Continuous play: when a line finishes, the next one starts on its own (host or solo moves the
  // narration for everyone). Stops at the end of each script, e.g. at "Open folder one."
  const [auto, setAuto] = useState(true);
  const lineEnded = useRef<() => void>(() => {});
  lineEnded.current = () => {
    // only a connected host moves the room on; a dropped host must not keep changing the state
    if (!auto || !g.isHost || (g.party && (!g.connected || g.pausedAt))) return;
    const reveal = s.narration.script === "reveal";
    const at = reveal ? s.revealStep : s.narration.line;
    if (at >= lines.length - 1) return;
    const from = line?.id;
    window.setTimeout(() => {
      // skip if the line moved on meanwhile
      if (lineIdRef.current !== from) return;
      g.act(reveal ? { t: "reveal", d: 1 } : { t: "line", d: 1 });
    }, 700);
  };
  const lineIdRef = useRef(line?.id);
  lineIdRef.current = line?.id;
  const speak = useCallback(
    (l: { id: string; text: string; src?: string }) => speakLine(c.id, l.id, l.text, () => lineEnded.current(), l.src),
    [c.id]
  );
  // Reads the current line if it hasn't been read yet.
  const readCurrent = useRef<() => void>(() => {});
  readCurrent.current = () => {
    if (!priv.voice || !line || spoken.current === line.id) return;
    if (speak(line)) spoken.current = line.id;
  };
  useEffect(() => readCurrent.current(), [priv.voice, line, speak]);
  useEffect(
    () => () => {
      stopNarration();
      spoken.current = ""; // so a remount (or returning to the desk) reads the current line again
    },
    []
  );
  useEffect(() => {
    setNarOpen(false);
  }, [line?.id]);

  /* ---------- nudges after a quiet spell ---------- */
  // Any touch, key or scroll counts as activity. After IDLE_MS with nothing happening, the narrator
  // says one casual line that fits the situation; it waits another IDLE_MS before the next one.
  const lastActive = useRef(Date.now());
  const nudged = useRef<Record<string, number>>({});
  useEffect(() => {
    const mark = () => (lastActive.current = Date.now());
    const evs = ["pointerdown", "keydown", "wheel", "touchmove"] as const;
    evs.forEach((e) => window.addEventListener(e, mark, { passive: true }));
    return () => evs.forEach((e) => window.removeEventListener(e, mark));
  }, []);
  useEffect(() => {
    lastActive.current = Date.now();
  }, [s.unlocked, s.narration.line, s.narration.script, fileId, panel]);
  const nudgeRef = useRef<() => void>(() => {});
  nudgeRef.current = () => {
    if (!priv.voice || s.phase !== "play" || s.finishedAt || panel === "reveal" || panel === "accuse") return;
    if (Date.now() - lastActive.current < IDLE_MS || isSpeaking()) return;
    const files = current.files.filter(canOpen);
    const kind: NudgeKind = solvedAll
      ? "accuse"
      : !files.some((f) => priv.viewed.includes(f.id))
        ? "noFile"
        : files.some((f) => !priv.viewed.includes(f.id))
          ? "unread"
          : s.solved[current.number]
            ? "stuck"
            : "answer";
    const key = `${s.unlocked}:${kind}`;
    const pool = c.narration.nudges[kind];
    const said = nudged.current[key] ?? 0;
    // situation lines once per round each; after that, rotate the general ones
    const pickFrom = said > 0 && kind !== "stuck" ? c.narration.nudges.stuck : pool;
    const line = pickFrom[(nudged.current.total ?? 0) % pickFrom.length];
    nudged.current[key] = said + 1;
    nudged.current.total = (nudged.current.total ?? 0) + 1;
    lastActive.current = Date.now();
    speakLine(c.id, line.id, line.text);
    toast(line.text);
  };
  useEffect(() => {
    const t = window.setInterval(() => nudgeRef.current(), 5000);
    return () => window.clearInterval(t);
  }, []);

  const folderState = (r: Round): FolderState => {
    if (r.number > s.unlocked) return "locked";
    if (folder === r.number) return "open";
    if (r.files.some((f) => canOpen(f) && !priv.viewed.includes(f.id))) return "new";
    return "closed";
  };
  const activeRound = c.rounds.find((r) => r.number === folder) ?? current;
  const playersHere = g.online.filter((id) => s.players[id]).length;
  const go = (p: Panel) => {
    setPanel(p);
  };
  const accuseTarget: Panel = s.finishedAt ? "reveal" : "accuse";

  return (
    <div className="desk" data-unlocked={s.unlocked} ref={deskRef}>
      {/* ---------- top bar ---------- */}
      <header className="desk-top">
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <Link href={exitHref} className="iconbtn" aria-label="Leave the desk">{Glyph.back}</Link>
          <div style={{ minWidth: 0 }}>
            <div className="eyebrow" style={{ fontSize: 10 }}>
              Case No. {c.number}
              {g.room && <> · Room {g.room.code}</>}
            </div>
            <div className="desk-title">{c.title}</div>
          </div>
        </div>
        <div className="desk-actions">
          {s.timerEnabled && !solvedAll && (
            <TimerChip g={g} round={current} onTimeUp={() => go("checkpoint")} onUp={() => toast(`Time is up for round ${s.unlocked}. Answer the checkpoint when you are ready.`, { label: "Checkpoint", run: () => setPanel("checkpoint") })} />
          )}
          {g.party && (
            <button className="btn sm ghost hide-sm" onClick={() => go("table")} aria-label="Table: players and chat">
              <span className="dot" /> {playersHere}
              {unread > 0 && <span className="badge">{unread}</span>}
            </button>
          )}
          <button className="btn sm ghost hide-sm" onClick={() => go("notebook")}>Notebook</button>
          <button className="btn sm ghost hide-sm" onClick={() => go("hints")}>Hints</button>
          <button className="iconbtn" onClick={() => go("settings")} aria-label="Settings">{Glyph.gear}</button>
          <button className="btn sm hide-sm" disabled={!solvedAll} onClick={() => go(accuseTarget)} title={solvedAll ? "" : `Answer all ${c.rounds.length} checkpoints first`}>
            {s.finishedAt ? "Report" : "Accuse"}
          </button>
        </div>
      </header>

      {g.party && g.hostAway && (
        <div className="banner" role="status">
          <span>{name(s.hostId)} (host) has lost connection. The room is paused; control passes to the next player in a few seconds.</span>
        </div>
      )}
      {g.party && !g.connected && <div className="banner" role="status"><span>Reconnecting to the room…</span></div>}

      {toasts.length > 0 && (
        <div className="toasts" role="status" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className="toast">
              <span>{t.text}</span>
              {t.action && (
                <button
                  className="btn sm"
                  onClick={() => {
                    t.action!.run();
                    setToasts((x) => x.filter((y) => y.id !== t.id));
                  }}
                >
                  {t.action.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={`desk-body ${openFile ? "has-file" : ""}`}>
        {/* ---------- folders + files ---------- */}
        <section className="desk-left">
          <div className="folders">
            {c.rounds.map((r) => {
              const st = folderState(r);
              return (
                <button
                  key={r.number}
                  className={`folder ${folder === r.number ? "sel" : ""}`}
                  onClick={() => {
                    if (st === "locked") return;
                    if (folder !== r.number) playClick();
                    setPicked({ round: r.number, at: s.unlocked });
                    setFileId(null);
                  }}
                  aria-disabled={st === "locked"}
                  aria-label={st === "locked" ? `Round ${r.number}, sealed` : `Round ${r.number}, ${r.title}`}
                >
                  <FolderIcon state={st} size={64} label={`ENV. ${r.number}`} />
                  <div className="folder-label">
                    <span>Round {r.number}</span>
                    <span className="t">{st === "locked" ? "Sealed" : r.title}</span>
                  </div>
                  {s.solved[r.number] && <span className="tick">{s.solved[r.number] === "correct" ? "SOLVED" : "SKIPPED"}</span>}
                </button>
              );
            })}
          </div>

          <div className="files">
            <div className="files-head">
              <div>
                <div className="eyebrow">
                  {activeRound.envelope} · {activeRound.files.length} files
                  {g.party && s.mode === "split" && " · split"}
                </div>
                <div className="files-title">Round {activeRound.number} — {activeRound.title}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className={`iconbtn ${layout === "list" ? "on" : ""}`} onClick={() => setLayout("list")} aria-label="List view">{Glyph.list}</button>
                <button className={`iconbtn ${layout === "grid" ? "on" : ""}`} onClick={() => setLayout("grid")} aria-label="Grid view">{Glyph.grid}</button>
              </div>
            </div>
            {layout === "list" ? (
              <ul className="filelist">
                {activeRound.files.map((f) => {
                  const ok = canOpen(f);
                  const h = holder(f);
                  const starred = priv.starred.includes(f.id);
                  return (
                    <li key={f.id} className={`${fileId === f.id ? "sel" : ""} ${ok ? "" : "held"}`}>
                      <button className="fl-main" onClick={() => ok && view(f)} disabled={!ok} aria-label={`Open exhibit ${f.exhibit}, ${f.name}`}>
                        <FileIcon type={f.type} size={20} />
                        <span className="fl-name">
                          <span className="ex">Exhibit {f.exhibit} — </span>
                          {f.name}
                          {!ok && h && <span className="heldby">Held by {name(h)} — ask them to read it out</span>}
                          {g.party && s.mode === "split" && ok && h === g.me && <span className="heldby mine">Yours to read out</span>}
                        </span>
                        <span className="fl-date mono-cell hide-sm">{f.date}</span>
                      </button>
                      {ok && (
                        <span className="fl-tags">
                          <button
                            className="star"
                            aria-label={starred ? `Unstar exhibit ${f.exhibit}` : `Star exhibit ${f.exhibit}`}
                            onClick={() => setPriv((x) => ({ ...x, starred: starred ? x.starred.filter((id) => id !== f.id) : [...x.starred, f.id] }))}
                          >
                            {Glyph.star(starred)}
                          </button>
                          {priv.viewed.includes(f.id) ? <span className="tag">Viewed</span> : <span className="tag new">New</span>}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="filegrid">
                {activeRound.files.map((f) => {
                  const ok = canOpen(f);
                  const h = holder(f);
                  return (
                    <button key={f.id} className={`filecard ${fileId === f.id ? "sel" : ""} ${ok ? "" : "held"}`} onClick={() => ok && view(f)} disabled={!ok}>
                      <FileIcon type={f.type} size={36} />
                      <span className="ex">Exhibit {f.exhibit}</span>
                      <span className="nm">{f.name}</span>
                      {!ok && h && <span className="heldby">Held by {name(h)}</span>}
                      {ok && !priv.viewed.includes(f.id) && <span className="tag new">New</span>}
                    </button>
                  );
                })}
              </div>
            )}
            <CheckpointStrip g={g} round={activeRound} onOpen={() => go("checkpoint")} />
          </div>
        </section>

        {/* ---------- viewer ---------- */}
        <section className="desk-right">
          {openFile ? (
            <div className="viewer">
              <div className="viewer-bar">
                <button className="iconbtn" onClick={() => setFileId(null)} aria-label="Close file">{Glyph.close}</button>
                <div className="viewer-title">
                  <FileIcon type={openFile.type} size={16} />
                  <span>Exhibit {openFile.exhibit} — {openFile.name}</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {g.party && s.mode === "split" && holder(openFile) === g.me && (
                    <button className="btn sm" onClick={() => g.act({ t: "show", fileId: openFile.id })} title="Let every player open this file">Show all</button>
                  )}
                  {g.party && (
                    <button
                      className="iconbtn"
                      onClick={() => {
                        g.act({ t: "point", fileId: openFile.id });
                        toast(`You pointed the table to Exhibit ${openFile.exhibit}`);
                      }}
                      aria-label="Point the table to this exhibit"
                      title="Point the table here"
                    >
                      {Glyph.point}
                    </button>
                  )}
                  <button className="iconbtn hide-xs" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))} aria-label="Zoom out">{Glyph.zoomOut}</button>
                  <button className="iconbtn hide-xs" onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.15).toFixed(2)))} aria-label="Zoom in">{Glyph.zoomIn}</button>
                </div>
              </div>
              <ZoomBox zoom={zoom}>
                {canOpen(openFile) ? <Evidence file={openFile} /> : <p className="muted-dark">This file is now held by another player.</p>}
              </ZoomBox>
            </div>
          ) : (
            <div className="empty">
              <div className="eyebrow">No file open</div>
              <p style={{ color: "var(--text-3)", maxWidth: 340, textAlign: "center", fontStyle: "italic" }}>
                Choose a folder, then a file. Everything you need is somewhere in these pages.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* ---------- dock: narration + phone tabs ---------- */}
      <div className="dock" ref={dockRef}>
        {line && (
          <footer className="narration">
            <div className="nar-prog">
              {lines.map((_, i) => <span key={i} className={i <= s.narration.line ? "on" : ""} />)}
            </div>
            <div className="nar-id">{line.id}</div>
            <button className={`nar-text ${narOpen ? "open" : ""}`} onClick={() => setNarOpen((o) => !o)} aria-expanded={narOpen}>
              {line.text}
            </button>
            <div className="nar-ctl">
              {g.isHost && (
                <button className="iconbtn" onClick={() => g.act({ t: "line", d: -1 })} disabled={s.narration.line === 0} aria-label="Previous line">{Glyph.prev}</button>
              )}
              <button className="iconbtn" onClick={() => {
                  stopNarration();
                  speak(line);
                }} aria-label="Replay this line on this device">{Glyph.replay}</button>
              <button
                className={`iconbtn ${auto && priv.voice ? "on" : ""}`}
                onClick={() => {
                  if (auto && priv.voice) {
                    setAuto(false);
                    stopNarration();
                    return;
                  }
                  setAuto(true);
                  if (!priv.voice) {
                    spoken.current = line.id; // the voice effect would read it too; read it once here
                    setPriv((x) => ({ ...x, voice: true }));
                  }
                  speak(line);
                }}
                aria-label={auto && priv.voice ? "Stop continuous narration" : "Play the narration continuously"}
                title={auto && priv.voice ? "Stop" : "Play continuously"}
              >
                {auto && priv.voice ? Glyph.pause : Glyph.play}
              </button>
              <button
                className={`iconbtn ${priv.voice ? "on" : ""}`}
                onClick={() => {
                  if (priv.voice) stopNarration();
                  spoken.current = "";
                  setPriv((x) => ({ ...x, voice: !x.voice }));
                }}
                aria-label={priv.voice ? "Turn narrator voice off" : "Turn narrator voice on"}
              >
                {priv.voice ? Glyph.voiceOn : Glyph.voiceOff}
              </button>
              {g.isHost && (
                <button className="iconbtn" onClick={() => g.act({ t: "line", d: 1 })} disabled={s.narration.line >= lines.length - 1} aria-label="Next line">{Glyph.next}</button>
              )}
            </div>
          </footer>
        )}
        <nav className="tabbar" aria-label="Desk">
          <button className={!panel && !openFile ? "on" : ""} onClick={() => { setPanel(null); setFileId(null); }}>
            {Glyph.files}<span>Files</span>
          </button>
          <button className={panel === "notebook" ? "on" : ""} onClick={() => go("notebook")}>{Glyph.notes}<span>Notebook</span></button>
          <button className={panel === "hints" ? "on" : ""} onClick={() => go("hints")}>{Glyph.hint}<span>Hints</span></button>
          {g.party && (
            <button className={panel === "table" ? "on" : ""} onClick={() => go("table")}>
              {Glyph.table}<span>Table</span>
              {unread > 0 && <span className="badge">{unread}</span>}
            </button>
          )}
          <button className={panel === "accuse" || panel === "reveal" ? "on" : ""} disabled={!solvedAll} onClick={() => go(accuseTarget)}>
            {Glyph.accuse}<span>{s.finishedAt ? "Report" : "Accuse"}</span>
          </button>
        </nav>
      </div>

      {/* ---------- panels ---------- */}
      {panel && (
        <div className="overlay" onClick={() => setPanel(null)}>
          <div className={`sheet ${panel === "reveal" ? "wide" : ""}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="sheet-grip" aria-hidden />
            <button className="iconbtn sheet-x" onClick={() => setPanel(null)} aria-label="Close">{Glyph.close}</button>
            {panel === "checkpoint" && <CheckpointPanel g={g} round={current} onClose={() => setPanel(null)} />}
            {panel === "hints" && (
              <HintsPanel
                g={g}
                round={current}
                onUse={async () => {
                  const n = priv.hintsUsed[current.number] ?? 0;
                  if (n >= 3) return;
                  const h = await fetchHint(c.id, current.number, n + 1); // throws on failure; the panel shows it
                  setPriv((x) => ({
                    ...x,
                    hintsUsed: { ...x.hintsUsed, [current.number]: Math.max(x.hintsUsed[current.number] ?? 0, n + 1) },
                    hintTexts: { ...(x.hintTexts ?? {}), [`${current.number}-${n + 1}`]: h.text },
                  }));
                  g.act({ t: "hint" });
                  if (priv.voice && h.voice) speakLine(c.id, h.voice.id, h.voice.text, undefined, h.voice.src);
                }}
              />
            )}
            {panel === "notebook" && <NotebookPanel g={g} />}
            {panel === "settings" && <SettingsPanel g={g} />}
            {panel === "table" && <TablePanel g={g} />}
            {panel === "accuse" && <AccusePanel g={g} />}
            {panel === "reveal" && <RevealPanel g={g} onClose={() => setPanel(null)} />}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================== */

/** Own clock so the rest of the desk does not depend on it. */
function TimerChip({ g, round, onTimeUp, onUp }: { g: Game; round: Round; onTimeUp: () => void; onUp: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const { s } = g;
  const clock = (g.pausedAt ?? now) + g.skew;
  const start = s.roundStartedAt[s.unlocked] ?? clock;
  const remaining = Math.max(0, round.minutes * 60 - Math.floor((clock - start) / 1000));
  const up = s.phase === "play" && remaining === 0 && !s.solved[s.unlocked];
  const announced = useRef<number | null>(null);
  useEffect(() => {
    if (up && announced.current !== s.unlocked) {
      announced.current = s.unlocked;
      onUp();
    }
  }, [up, s.unlocked, onUp]);
  const label = g.pausedAt ? "PAUSED" : `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  return (
    <button
      className={`timer ${remaining < 120 && !g.pausedAt ? "low" : ""} ${up ? "up" : ""}`}
      title={up ? "Time is up: answer the checkpoint when ready" : `Round ${s.unlocked} timer`}
      onClick={up ? onTimeUp : undefined}
      aria-label={up ? "Time is up. Open the checkpoint" : `Time left in round ${s.unlocked}: ${label}`}
    >
      {up ? "TIME" : label}
    </button>
  );
}

function CheckpointStrip({ g, round, onOpen }: { g: Game; round: Round; onOpen: () => void }) {
  const { s, c } = g;
  const solved = s.solved[round.number];
  const isCurrent = round.number === s.unlocked;
  const hasNext = c.rounds.some((r) => r.number === round.number + 1);
  if (solved) {
    return (
      <div className="checkpoint-strip">
        <span>
          <span className="eyebrow" style={{ display: "block" }}>Checkpoint {solved === "correct" ? "answered" : "skipped"}</span>
          {round.checkpoint.question}
        </span>
        {isCurrent && hasNext &&
          (g.isHost ? (
            <button className="btn primary sm" onClick={() => g.act({ t: "unlock" })}>Open folder {round.number + 1}{g.party ? " for everyone" : ""}</button>
          ) : (
            <span className="muted-dark" style={{ fontSize: 14 }}>Waiting for the host to open folder {round.number + 1}</span>
          ))}
        {isCurrent && !hasNext && !s.finishedAt && <span className="muted-dark" style={{ fontSize: 14 }}>Make your accusation when ready</span>}
      </div>
    );
  }
  if (!isCurrent) return null;
  const suggestions = Object.keys(s.suggest ?? {}).filter((id) => s.players[id]).length;
  return (
    <div className="checkpoint-strip">
      <span>
        <span className="eyebrow" style={{ display: "block" }}>Checkpoint{g.party && suggestions ? ` · ${suggestions} suggested` : ""}</span>
        {round.checkpoint.question}
      </span>
      <button className="btn primary sm" onClick={onOpen}>{g.isHost ? "Answer" : "Suggest"}</button>
    </div>
  );
}

function CheckpointPanel({ g, round, onClose }: { g: Game; round: Round; onClose: () => void }) {
  const { s, c } = g;
  const [pick, setPick] = useState<string | null>(g.isHost ? null : s.suggest?.[g.me] ?? null);
  const solved = s.solved[round.number];
  const tries = s.wrongTries[round.number] ?? 0;
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  // a round closed before answers moved server-side: fetch its answer (and token) once
  const [legacy, setLegacy] = useState<{ answer: string; explanation: string } | null>(null);
  const known = s.answers?.[round.number] ?? legacy;
  useEffect(() => {
    if (!solved || s.answers?.[round.number]) return;
    skipRound(c.id, round.number)
      .then((res) => {
        if (g.isHost) g.act({ t: "learn", round: round.number, res });
        else if (res.answer) setLegacy({ answer: res.answer, explanation: res.explanation ?? "" });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved, round.number]);
  const ans = known ? round.checkpoint.choices.find((ch) => ch.id === known.answer) : undefined;
  const run = async (f: () => Promise<void>) => {
    setBusy(true);
    setErr("");
    try {
      await f();
    } catch {
      setErr("The Bureau could not be reached. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };
  const submit = (choice: string) =>
    run(async () => {
      const res = await checkAnswer(c.id, round.number, choice);
      g.act({ t: "answer", round: round.number, choice, res });
    });
  const giveUp = () =>
    run(async () => {
      const res = await skipRound(c.id, round.number);
      g.act({ t: "skip", round: round.number, res });
    });
  const last = s.lastAnswer && s.lastAnswer.round === round.number ? s.lastAnswer : null;
  const hasNext = c.rounds.some((r) => r.number === round.number + 1);
  const isLast = round.number === lastRound(c);
  const tally: Record<string, string[]> = {};
  if (g.party) {
    for (const [id, ch] of Object.entries(s.suggest ?? {})) if (s.players[id]) (tally[ch] ??= []).push(id === g.me ? "you" : s.players[id].name);
  }

  return (
    <div>
      <div className="eyebrow">Checkpoint · Round {round.number}</div>
      <h2 className="sheet-h">{round.checkpoint.question}</h2>
      {solved ? (
        <div>
          <div className="answer-box">
            <span className="stamp">{solved === "correct" ? "Correct" : "Answer shown"}</span>
            <p style={{ margin: "14px 0 6px", fontFamily: "var(--display)", fontSize: 19 }}>{ans?.label ?? "…"}</p>
            <p style={{ margin: 0, color: "var(--text-2)" }}>{known?.explanation}</p>
          </div>
          <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {hasNext && s.unlocked === round.number ? (
              g.isHost ? (
                <button className="btn primary" onClick={() => { g.act({ t: "unlock" }); onClose(); }}>
                  Open folder {round.number + 1}{g.party ? " for everyone" : ""}
                </button>
              ) : (
                <span className="muted-dark">Waiting for the host to open folder {round.number + 1}.</span>
              )
            ) : (
              <button className="btn primary" onClick={onClose}>Back to the desk</button>
            )}
            {isLast && <span className="muted-dark">All {c.rounds.length} checkpoints done. Make your accusation when ready.</span>}
          </div>
        </div>
      ) : (
        <>
          {g.party && (
            <p className="muted-dark" style={{ marginTop: -6 }}>
              {g.isHost ? "Players' suggestions show beside each answer. You submit the room's answer." : "Tap an answer to suggest it. The host sees everyone's pick and submits."}
            </p>
          )}
          <div className="choices">
            {round.checkpoint.choices.map((ch) => (
              <label key={ch.id} className={`choice ${pick === ch.id ? "on" : ""} ${last && !last.correct && last.choice === ch.id ? "wrong" : ""}`}>
                <input
                  type="radio"
                  name="cp"
                  checked={pick === ch.id}
                  onChange={() => {
                    setPick(ch.id);
                    if (!g.isHost) g.act({ t: "suggest", choice: ch.id });
                  }}
                />
                <span style={{ flex: 1 }}>{ch.label}</span>
                {tally[ch.id]?.length ? <span className="votes">{tally[ch.id].join(", ")}</span> : null}
              </label>
            ))}
          </div>
          {last && !last.correct && <p className="lookagain">Look again.</p>}
          {err && <p className="lookagain">{err}</p>}
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap", alignItems: "center" }}>
            {g.isHost && (
              <button className="btn primary" disabled={!pick || busy} onClick={() => pick && submit(pick)}>
                {busy ? "Checking…" : "Submit answer"}
              </button>
            )}
            {g.isHost && tries >= 3 && (
              <button className="btn" disabled={busy} onClick={giveUp}>Skip and show answer</button>
            )}
            <span className="muted-dark" style={{ fontSize: 14 }}>
              {tries > 0 ? `${tries} wrong ${tries === 1 ? "try" : "tries"}${tries < 3 ? " · you can skip after 3" : ""}` : "No penalty for wrong answers"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Magnifies a document like a loupe: the document is laid out once at 100% for the panel's width and
 * then scaled as a whole, so zooming never re-wraps text or reshapes the page. Scrolls both ways.
 */
function ZoomBox({ zoom, children }: { zoom: number; children: React.ReactNode }) {
  const scroller = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const sc = scroller.current, el = inner.current;
    if (!sc || !el) return;
    const measure = () => {
      const cs = getComputedStyle(sc);
      const w = sc.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (w <= 0) return; // hidden or not laid out yet; keep the last good measurement
      setBox((b) => (b && b.w === w && b.h === el.offsetHeight ? b : { w, h: el.offsetHeight }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const w = box?.w ?? 0;
  return (
    <div className="viewer-scroll" ref={scroller}>
      <div className="zoom-outer" style={box ? { width: w * zoom, height: box.h * zoom } : undefined}>
        <div ref={inner} className="zoom-inner" style={box ? { width: w, transform: `scale(${zoom})` } : undefined}>
          {children}
        </div>
      </div>
    </div>
  );
}

function HintsPanel({ g, round, onUse }: { g: Game; round: Round; onUse: () => Promise<void> }) {
  const { c, priv, setPriv } = g;
  const names = ["A nudge", "Where to look", "The answer to this round"];
  const used = priv.hintsUsed[round.number] ?? 0;
  const text = (lvl: number) => priv.hintTexts?.[`${round.number}-${lvl}`];
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  // hints opened before they moved server-side have no stored text yet: fetch them again (already counted)
  useEffect(() => {
    for (let lvl = 1; lvl <= used; lvl++) {
      if (text(lvl)) continue;
      fetchHint(c.id, round.number, lvl)
        .then((h) => setPriv((x) => ({ ...x, hintTexts: { ...(x.hintTexts ?? {}), [`${round.number}-${lvl}`]: h.text } })))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.number, used]);
  const open = async () => {
    setBusy(true);
    setErr("");
    try {
      await onUse();
    } catch {
      setErr("The hint could not be fetched. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <div className="eyebrow">Hints · Round {round.number}</div>
      <h2 className="sheet-h">{round.checkpoint.question}</h2>
      <p className="muted-dark" style={{ marginTop: -4 }}>Hints show only on this device and never name the killer. The report card counts them.</p>
      <ol className="hints">
        {names.map((name, i) => (
          <li key={i} className={i < used ? "shown" : ""}>
            <div className="eyebrow">{name}</div>
            {i < used ? (
              <p>{text(i + 1) ?? "…"}</p>
            ) : i === used ? (
              <button className="btn sm" onClick={open} disabled={busy} style={{ marginTop: 8 }}>{busy ? "Opening…" : `Reveal hint ${i + 1}`}</button>
            ) : (
              <p className="muted-dark">Sealed</p>
            )}
          </li>
        ))}
      </ol>
      {err && <p className="lookagain">{err}</p>}
    </div>
  );
}

function NotebookPanel({ g }: { g: Game }) {
  const { c, priv, setPriv } = g;
  const cycle: SuspectMark[] = ["none", "suspicious", "cleared"];
  return (
    <div>
      <div className="eyebrow">Notebook{g.party ? " · private to this device" : ""}</div>
      <h2 className="sheet-h">Suspects</h2>
      <div className="suspects">
        {c.suspects.map((x) => {
          const m = priv.suspects[x.id] ?? "none";
          return (
            <button key={x.id} className={`suspect ${m}`} onClick={() => setPriv((p: Private) => ({ ...p, suspects: { ...p.suspects, [x.id]: cycle[(cycle.indexOf(m) + 1) % 3] } }))}>
              <span style={{ fontFamily: "var(--display)", fontSize: 17 }}>{x.name}</span>
              <span className="muted-dark" style={{ fontSize: 13 }}>{x.role}, {x.age} · {x.note}</span>
              <span className="mark">{m === "none" ? "Unmarked" : m === "suspicious" ? "Suspicious" : "Cleared"}</span>
            </button>
          );
        })}
      </div>
      <p className="muted-dark" style={{ fontSize: 13, margin: "8px 0 18px" }}>Tap a name to mark it suspicious, cleared, or unmarked.</p>
      <h2 className="sheet-h">Notes</h2>
      <textarea className="notes" value={priv.notes} placeholder="Times, contradictions, questions…" aria-label="Your notes" onChange={(e) => { const v = e.target.value; setPriv((x) => ({ ...x, notes: v })); }} />
      {priv.starred.length > 0 && (
        <>
          <h2 className="sheet-h" style={{ marginTop: 18 }}>Starred exhibits</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-2)" }}>
            {c.rounds.flatMap((r) => r.files).filter((f) => priv.starred.includes(f.id)).map((f) => <li key={f.id}>Exhibit {f.exhibit} — {f.name}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}

function SettingsPanel({ g }: { g: Game }) {
  const { s, priv, setPriv } = g;
  return (
    <div>
      <div className="eyebrow">Settings</div>
      <h2 className="sheet-h">Table settings</h2>
      <label className={`toggle ${g.isHost ? "" : "disabled"}`}>
        <input type="checkbox" checked={s.timerEnabled} disabled={!g.isHost} onChange={() => g.act({ t: "setTimer", on: !s.timerEnabled })} />
        <span>
          <b>Round timer.</b> A countdown for each round{g.party ? ", shown on every screen" : ""}. When it ends you are prompted to move on; nothing is forced.
          {!g.isHost && " Only the host can change this."}
        </span>
      </label>
      <label className="toggle">
        <input type="checkbox" checked={priv.voice} onChange={() => { if (priv.voice) stopNarration(); setPriv((x) => ({ ...x, voice: !x.voice })); }} />
        <span><b>Narrator voice{g.party ? " on this device" : ""}.</b> Reads each line aloud. Captions always show.</span>
      </label>
      <SoundControls party={g.party} />
    </div>
  );
}

function TablePanel({ g }: { g: Game }) {
  const { s } = g;
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const chat = s.chat ?? [];
  const link = typeof window !== "undefined" && g.room ? `${window.location.origin}/room/${g.room.code}` : "";
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [chat.length]);
  const send = () => {
    const t = text.trim();
    if (!t) return;
    g.act({ t: "say", text: t });
    setText("");
  };
  const time = (at: number) => new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <div className="eyebrow">Room {g.room?.code}</div>
      <h2 className="sheet-h">The table</h2>
      <ul className="roster">
        {sortedPlayers(s).map((id) => (
          <li key={id}>
            <span className={`dot ${g.online.includes(id) ? "" : "off"}`} />
            <span style={{ flex: 1 }}>{s.players[id].name}{id === g.me ? " (you)" : ""}</span>
            {id === s.hostId && <span className="tag new">Host</span>}
            {!g.online.includes(id) && <span className="muted-dark" style={{ fontSize: 13 }}>away</span>}
            {g.isHost && id !== g.me && g.online.includes(id) && (
              <button className="btn ghost sm" onClick={() => g.act({ t: "handover", id })}>Make host</button>
            )}
          </li>
        ))}
      </ul>
      <p className="muted-dark" style={{ fontSize: 14, margin: "0 0 14px" }}>
        {s.mode === "split"
          ? "Evidence is split. Read your files out, or use Show all on a file to let everyone open it."
          : "Evidence is shared. Everyone sees every unlocked file."}
      </p>

      <div className="eyebrow" style={{ marginBottom: 8 }}>Table talk</div>
      <div className="chat" ref={listRef}>
        {chat.length === 0 && <p className="muted-dark" style={{ margin: 0, fontSize: 14 }}>Not on a call? Talk it through here. Messages go to everyone at the table.</p>}
        {chat.map((m) => (
          <div key={m.id} className={`msg ${m.by === g.me ? "mine" : ""}`}>
            <div className="msg-meta">{m.by === g.me ? "You" : s.players[m.by]?.name ?? "Someone"} · {time(m.at)}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>
      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input className="field-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Say something to the table" aria-label="Message the table" maxLength={280} enterKeyHint="send" />
        <button className="iconbtn send" aria-label="Send" disabled={!text.trim()}>{Glyph.send}</button>
      </form>

      {link && (
        <button className="btn sm" style={{ marginTop: 16 }} onClick={() => { navigator.clipboard?.writeText(link).then(() => setCopied(true), () => {}); }}>
          {copied ? "Link copied" : "Copy invite link"}
        </button>
      )}
    </div>
  );
}

function ChoiceGroup({ title, items, val, set, tally }: { title: string; items: { id: string; label: string }[]; val: string; set: (v: string) => void; tally?: Record<string, string[]> }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{title}</div>
      <div className="choices">
        {items.map((i) => (
          <label key={i.id} className={`choice ${val === i.id ? "on" : ""}`}>
            <input type="radio" name={title} checked={val === i.id} onChange={() => set(i.id)} />
            <span style={{ flex: 1 }}>{i.label}</span>
            {tally?.[i.id]?.length ? <span className="votes">{tally[i.id].join(", ")}</span> : null}
          </label>
        ))}
      </div>
    </div>
  );
}

function AccusePanel({ g }: { g: Game }) {
  const { c, s } = g;
  const mine = s.votes[g.me];
  const [v, setV] = useState<Vote>(mine ?? { suspect: "", method: "", motive: "" });
  const [confirming, setConfirming] = useState(false);
  const complete = !!(v.suspect && v.method && v.motive);
  const tally = (k: keyof Vote) => {
    const t: Record<string, string[]> = {};
    Object.entries(s.votes).forEach(([id, vote]) => {
      if (!s.players[id]) return;
      (t[vote[k]] ??= []).push(id === g.me ? "you" : s.players[id].name);
    });
    return t;
  };
  const here = g.online.filter((id) => s.players[id]);
  const voted = here.filter((id) => s.votes[id]).length;
  const myVoteSent = mine && mine.suspect === v.suspect && mine.method === v.method && mine.motive === v.motive;
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  // the server only issues the verdict and the reveal against a token for every closed round
  const accuse = async () => {
    setBusy(true);
    setErr("");
    try {
      const tokens: Record<number, string> = { ...(s.tokens ?? {}) };
      for (const r of c.rounds) {
        if (tokens[r.number]) continue;
        const res = await skipRound(c.id, r.number); // rounds closed before tokens existed
        if (res.token) tokens[r.number] = res.token;
        g.act({ t: "learn", round: r.number, res });
      }
      const result = await fetchVerdict(c.id, v, tokens);
      g.act({ t: "accuse", vote: v, result });
    } catch {
      setErr("The Bureau could not be reached. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  if (s.finishedAt) return <p>The accusation has been made.</p>;

  return (
    <div>
      <div className="eyebrow">Final report</div>
      <h2 className="sheet-h">The accusation</h2>
      <p className="muted-dark" style={{ marginTop: -4 }}>
        {c.narration.accusation[0].text} There is no second chance.
        {g.party && " Everyone votes. The host submits the room's answer."}
      </p>
      <ChoiceGroup title="Who" items={c.suspects.map((x) => ({ id: x.id, label: `${x.name} — ${x.role}` }))} val={v.suspect} set={(x) => { setV({ ...v, suspect: x }); setConfirming(false); }} tally={g.party ? tally("suspect") : undefined} />
      <ChoiceGroup title="How" items={c.accusation.methods} val={v.method} set={(x) => { setV({ ...v, method: x }); setConfirming(false); }} tally={g.party ? tally("method") : undefined} />
      <ChoiceGroup title="Why" items={c.accusation.motives} val={v.motive} set={(x) => { setV({ ...v, motive: x }); setConfirming(false); }} tally={g.party ? tally("motive") : undefined} />
      <div className="sticky-actions">
        {g.party && (
          <button className="btn" disabled={!complete || !!myVoteSent} onClick={() => g.act({ t: "vote", vote: v })}>
            {myVoteSent ? "Vote cast" : mine ? "Update my vote" : "Cast my vote"}
          </button>
        )}
        {g.isHost &&
          (confirming ? (
            <button className="btn primary" disabled={busy} onClick={accuse}>{busy ? "Filing…" : "Submit anyway"}</button>
          ) : (
            <button
              className="btn primary"
              disabled={!complete || busy}
              onClick={() => (g.party && voted < here.length ? setConfirming(true) : accuse())}
            >
              {busy ? "Filing…" : g.party ? "Submit the room's accusation" : "Submit and close the file"}
            </button>
          ))}
        {g.party && (
          <span className="muted-dark" style={{ fontSize: 14 }}>
            {confirming ? `Only ${voted} of ${here.length} at the table have voted.` : `${voted} of ${here.length} voted`}
          </span>
        )}
        {err && <span className="lookagain" style={{ margin: 0 }}>{err}</span>}
      </div>
    </div>
  );
}

function RevealPanel({ g, onClose }: { g: Game; onClose: () => void }) {
  const { c, s } = g;
  const lines = s.result?.reveal ?? [];
  const step = s.revealStep;
  if (!s.finishedAt || !s.result) return null;

  if (step < lines.length) {
    return (
      <div className="reveal">
        <div className="eyebrow">The reveal · {lines[step].id}</div>
        <p className="reveal-line">{lines[step].text}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 26, gap: 12, flexWrap: "wrap" }}>
          <div className="reveal-prog">{lines.map((_, k) => <span key={k} className={k <= step ? "on" : ""} />)}</div>
          {g.isHost ? (
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn ghost sm" disabled={step === 0} onClick={() => g.act({ t: "reveal", d: -1 })}>Back</button>
              <button className="btn ghost sm" onClick={() => g.act({ t: "reveal", d: lines.length })}>Skip</button>
              <button className="btn primary" onClick={() => g.act({ t: "reveal", d: 1 })}>Continue</button>
            </div>
          ) : (
            <span className="muted-dark">The host is reading the reveal.</span>
          )}
        </div>
      </div>
    );
  }

  const a = s.accusation;
  const { parts, right, verdict, solution, proofs } = s.result;
  const mins = s.finishedAt && s.startedAt ? Math.max(0, Math.round((s.finishedAt - s.startedAt) / 60000)) : 0;
  const hints = Object.values(s.hints).reduce((t, n) => t + n, 0);
  const skipped = Object.values(s.solved).filter((x) => x === "skipped").length;
  const suspect = c.suspects.find((x) => x.id === a?.suspect);
  const real = c.suspects.find((x) => x.id === solution.suspect)!;

  return (
    <div>
      <div className="reportcard paper" style={{ padding: "34px 30px 26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div className="small" style={{ letterSpacing: ".25em" }}>THE BLACKWOOD BUREAU · CASE REPORT</div>
            <h2 style={{ fontFamily: "var(--display)", fontSize: 24, fontWeight: 400, margin: "6px 0 0" }}>Case No. {c.number} — {c.title}</h2>
          </div>
          <span className="stamp" style={{ fontSize: 18, transform: "rotate(-6deg)", borderWidth: 3 }}>{right === 3 ? "Solved" : "Unsolved"}</span>
        </div>
        <hr className="double" />
        <table className="grid" style={{ fontSize: 13.5 }}>
          <tbody>
            <tr><th style={{ width: "28%" }}>Accused</th><td>{suspect?.name ?? "—"}</td><td style={{ width: 40 }}>{parts[0] ? "✓" : "✗"}</td></tr>
            <tr><th>Method</th><td>{c.accusation.methods.find((x) => x.id === a?.method)?.label}</td><td>{parts[1] ? "✓" : "✗"}</td></tr>
            <tr><th>Motive</th><td>{c.accusation.motives.find((x) => x.id === a?.motive)?.label}</td><td>{parts[2] ? "✓" : "✗"}</td></tr>
          </tbody>
        </table>
        {!parts[0] && <p style={{ margin: "10px 0 0", fontSize: 13.5 }}>The killer was <b>{real.name}</b>.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 12, marginTop: 18, textAlign: "center" }}>
          <div><div className="small muted">VERDICT</div><div className="serif" style={{ fontSize: 16 }}>{verdict}</div></div>
          <div><div className="small muted">TIME TAKEN</div><div className="serif" style={{ fontSize: 17 }}>{Math.floor(mins / 60)}h {mins % 60}m</div></div>
          <div><div className="small muted">HINTS USED</div><div className="serif" style={{ fontSize: 17 }}>{hints}</div></div>
          <div><div className="small muted">CHECKPOINTS</div><div className="serif" style={{ fontSize: 17 }}>{c.rounds.length - skipped} of {c.rounds.length} unaided</div></div>
        </div>
        {g.party && Object.keys(s.votes).length > 0 && (
          <>
            <hr className="thin" />
            <div className="serif" style={{ fontWeight: 700, marginBottom: 6 }}>How the table voted</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5 }}>
              {Object.entries(s.votes).filter(([id]) => s.players[id]).map(([id, vote]) => (
                <li key={id}>{s.players[id].name}: {c.suspects.find((x) => x.id === vote.suspect)?.name} {vote.suspect === solution.suspect ? "✓" : "✗"}</li>
              ))}
            </ul>
          </>
        )}
        <hr className="thin" />
        <div className="serif" style={{ fontWeight: 700, marginBottom: 6 }}>The clues that proved it</div>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13.5 }}>
          {proofs.map((pr, k) => <li key={k} style={{ margin: "3px 0" }}>{pr.clue} <span className="muted">(Exh. {pr.exhibit})</span></li>)}
        </ol>
      </div>
      <RatingPrompt
        caseId={c.id}
        gameKey={String(s.finishedAt)}
        mode={g.party ? "party" : "solo"}
        players={Math.max(1, Object.keys(s.players).length)}
        verdict={verdict}
        minutes={mins}
      />
      <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        {g.isHost && <button className="btn" onClick={() => g.act({ t: "reveal", d: -lines.length })}>Replay the reveal</button>}
        <button className="btn" onClick={onClose}>Back to the evidence</button>
        <Link className="btn ghost" href="/cases">Case archive</Link>
      </div>
    </div>
  );
}
