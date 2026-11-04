"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { EvidenceFile, Round } from "@/lib/types";
import type { Game } from "@/lib/game/game";
import { allSolved, holderOf, lastRound, score, scriptLines, sortedPlayers, type Private, type SuspectMark, type Vote } from "@/lib/game/state";
import { speakLine, stopNarration } from "@/lib/game/narrator";
import { FileIcon, FolderIcon, Glyph, type FolderState } from "./Icons";
import { Evidence } from "./evidence";

type Panel = null | "notebook" | "hints" | "checkpoint" | "settings" | "accuse" | "reveal" | "players";

export function Desk({ g, exitHref }: { g: Game; exitHref: string }) {
  const { c, s, priv, setPriv } = g;
  // the folder you picked stays open until the room opens a new one
  const [picked, setPicked] = useState<{ round: number; at: number } | null>(null);
  const folder = picked && picked.at === s.unlocked && picked.round <= s.unlocked ? picked.round : s.unlocked;
  const [fileId, setFileId] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [zoom, setZoom] = useState(1);
  const [now, setNow] = useState(() => Date.now());

  const current = c.rounds.find((r) => r.number === s.unlocked)!;
  const solvedAll = allSolved(c, s);
  const name = (id: string) => s.players[id]?.name ?? "A player";
  const allFiles = useMemo(() => c.rounds.flatMap((r) => r.files), [c]);
  const openFile = allFiles.find((f) => f.id === fileId) ?? null;

  const [narOpen, setNarOpen] = useState(false);
  useEffect(() => window.scrollTo(0, 0), []);

  /* clock */
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  /* follow the room when a new folder opens */
  const lastUnlocked = useRef(s.unlocked);
  useEffect(() => {
    if (s.unlocked !== lastUnlocked.current) {
      lastUnlocked.current = s.unlocked;
      setFileId(null);
      setPanel((p) => (p === "checkpoint" || p === "hints" ? null : p));
    }
  }, [s.unlocked]);

  /* everyone sees the reveal when the accusation is made */
  const lastFinished = useRef(s.finishedAt);
  useEffect(() => {
    if (s.finishedAt && s.finishedAt !== lastFinished.current) setPanel("reveal");
    lastFinished.current = s.finishedAt;
  }, [s.finishedAt]);

  /* escape closes things */
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (panel) setPanel(null);
      else setFileId(null);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [panel]);

  /* narration */
  const lines = scriptLines(c, s.narration.script);
  const line = lines[Math.min(s.narration.line, lines.length - 1)];
  const spoken = useRef<string>("");
  useEffect(() => {
    if (!priv.voice || !line) return;
    if (spoken.current === line.id) return;
    spoken.current = line.id;
    speakLine(c.id, line.id, line.text);
  }, [priv.voice, line, c.id]);
  useEffect(() => () => stopNarration(), []);

  /* timer (frozen while the room is paused) */
  const clock = (g.pausedAt ?? now) + g.skew;
  const roundStart = s.roundStartedAt[s.unlocked] ?? clock;
  const remaining = Math.max(0, current.minutes * 60 - Math.floor((clock - roundStart) / 1000));
  const timeUp = s.phase === "play" && s.timerEnabled && remaining === 0 && !s.solved[s.unlocked];

  const view = (f: EvidenceFile) => {
    setFileId(f.id);
    setZoom(1);
    if (!priv.viewed.includes(f.id)) setPriv((x) => ({ ...x, viewed: [...x.viewed, f.id] }));
  };

  const holder = (f: EvidenceFile) => (g.party ? holderOf(c, s, f.id, g.online) : null);
  const canOpen = (f: EvidenceFile) => {
    const h = holder(f);
    return h === null || h === g.me;
  };

  const folderState = (r: Round): FolderState => {
    if (r.number > s.unlocked) return "locked";
    if (folder === r.number) return "open";
    if (r.files.some((f) => canOpen(f) && !priv.viewed.includes(f.id))) return "new";
    return "closed";
  };
  const activeRound = c.rounds.find((r) => r.number === folder) ?? current;

  return (
    <div className="desk" data-unlocked={s.unlocked}>
      {/* ---------- top bar ---------- */}
      <header className="desk-top">
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
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
            <div className={`timer ${remaining < 120 && !g.pausedAt ? "low" : ""}`} title={`Round ${s.unlocked} timer`}>
              {g.pausedAt ? "PAUSED" : `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`}
            </div>
          )}
          {g.party && (
            <button className="btn sm ghost" onClick={() => setPanel("players")} aria-label="Players in the room">
              <span className="dot" /> {g.online.filter((id) => s.players[id]).length}
            </button>
          )}
          <button className="btn sm ghost" onClick={() => setPanel("notebook")}>Notebook</button>
          <button className="btn sm ghost" onClick={() => setPanel("hints")}>Hints</button>
          <button className="btn sm ghost hide-sm" onClick={() => setPanel("settings")} aria-label="Settings">Settings</button>
          <button className="btn sm ghost show-sm" onClick={() => setPanel("settings")} aria-label="Settings">⋯</button>
          <button
            className="btn sm"
            disabled={!solvedAll}
            onClick={() => setPanel(s.finishedAt ? "reveal" : "accuse")}
            title={solvedAll ? "" : `Answer all ${c.rounds.length} checkpoints first`}
          >
            {s.finishedAt ? "Report" : "Accuse"}
          </button>
        </div>
      </header>

      {g.party && g.hostAway && (
        <div className="banner">
          <span>The host has lost connection. The room is paused, and control passes to the next player in a few seconds.</span>
        </div>
      )}
      {g.party && !g.connected && (
        <div className="banner">
          <span>Reconnecting to the room…</span>
        </div>
      )}
      {timeUp && !g.pausedAt && (
        <div className="banner">
          <span>Time is up for round {s.unlocked}. When you are ready, answer the checkpoint and move on.</span>
          <button className="btn sm" onClick={() => setPanel("checkpoint")}>Checkpoint</button>
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
                    setPicked({ round: r.number, at: s.unlocked });
                    setFileId(null);
                  }}
                  aria-disabled={st === "locked"}
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
                <div style={{ fontFamily: "var(--display)", fontSize: 20, marginTop: 2 }}>Round {activeRound.number} — {activeRound.title}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className={`iconbtn ${layout === "list" ? "on" : ""}`} onClick={() => setLayout("list")} aria-label="List view">{Glyph.list}</button>
                <button className={`iconbtn ${layout === "grid" ? "on" : ""}`} onClick={() => setLayout("grid")} aria-label="Grid view">{Glyph.grid}</button>
              </div>
            </div>
            {layout === "list" ? (
              <table className="filetable">
                <thead>
                  <tr><th style={{ width: 36 }} /><th>Name</th><th className="hide-sm">Date</th><th style={{ width: 92 }}>Tag</th></tr>
                </thead>
                <tbody>
                  {activeRound.files.map((f) => {
                    const ok = canOpen(f);
                    const h = holder(f);
                    const starred = priv.starred.includes(f.id);
                    return (
                      <tr key={f.id} className={`${fileId === f.id ? "sel" : ""} ${ok ? "" : "held"}`} onClick={() => ok && view(f)}>
                        <td><FileIcon type={f.type} size={20} /></td>
                        <td>
                          <span className="ex">Exhibit {f.exhibit} — </span>
                          {f.name}
                          {!ok && h && <span className="heldby">Held by {name(h)} — ask them to read it out</span>}
                        </td>
                        <td className="hide-sm mono-cell">{f.date}</td>
                        <td>
                          {ok && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <button
                                className="star"
                                aria-label={starred ? "Unstar" : "Star"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPriv((x) => ({ ...x, starred: starred ? x.starred.filter((id) => id !== f.id) : [...x.starred, f.id] }));
                                }}
                              >
                                {Glyph.star(starred)}
                              </button>
                              {priv.viewed.includes(f.id) ? <span className="tag">Viewed</span> : <span className="tag new">New</span>}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
            <CheckpointStrip g={g} round={activeRound} onOpen={() => setPanel("checkpoint")} />
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
                  <button className="iconbtn" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))} aria-label="Zoom out">{Glyph.zoomOut}</button>
                  <button className="iconbtn" onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.15).toFixed(2)))} aria-label="Zoom in">{Glyph.zoomIn}</button>
                </div>
              </div>
              <div className="viewer-scroll">
                <div style={{ zoom } as React.CSSProperties}>
                  {canOpen(openFile) ? <Evidence file={openFile} /> : <p className="muted-dark">This file is now held by another player.</p>}
                </div>
              </div>
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

      {/* ---------- narration bar ---------- */}
      {line && (
        <footer className="narration">
          <div className="nar-prog">
            {lines.map((_, i) => <span key={i} className={i <= s.narration.line ? "on" : ""} />)}
          </div>
          <div className="nar-id">{line.id}</div>
          <div className={`nar-text ${narOpen ? "open" : ""}`} onClick={() => setNarOpen((o) => !o)}>{line.text}</div>
          <div className="nar-ctl">
            {g.isHost && (
              <button className="iconbtn" onClick={() => g.act({ t: "line", d: -1 })} disabled={s.narration.line === 0} aria-label="Previous line">{Glyph.prev}</button>
            )}
            <button className="iconbtn" onClick={() => speakLine(c.id, line.id, line.text)} aria-label="Replay this line on this device">{Glyph.replay}</button>
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

      {/* ---------- panels ---------- */}
      {panel && (
        <div className="overlay" onClick={() => setPanel(null)}>
          <div className={`sheet ${panel === "reveal" ? "wide" : ""}`} onClick={(e) => e.stopPropagation()}>
            <button className="iconbtn sheet-x" onClick={() => setPanel(null)} aria-label="Close">{Glyph.close}</button>
            {panel === "checkpoint" && <CheckpointPanel g={g} round={current} onClose={() => setPanel(null)} />}
            {panel === "hints" && (
              <HintsPanel
                round={current}
                used={priv.hintsUsed[current.number] ?? 0}
                onUse={() => {
                  if ((priv.hintsUsed[current.number] ?? 0) >= 3) return;
                  setPriv((x) => ({ ...x, hintsUsed: { ...x.hintsUsed, [current.number]: (x.hintsUsed[current.number] ?? 0) + 1 } }));
                  g.act({ t: "hint" });
                }}
              />
            )}
            {panel === "notebook" && <NotebookPanel g={g} />}
            {panel === "settings" && <SettingsPanel g={g} />}
            {panel === "players" && <PlayersPanel g={g} />}
            {panel === "accuse" && <AccusePanel g={g} />}
            {panel === "reveal" && <RevealPanel g={g} onClose={() => setPanel(null)} />}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================== */

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
  return (
    <div className="checkpoint-strip">
      <span>
        <span className="eyebrow" style={{ display: "block" }}>Checkpoint</span>
        {round.checkpoint.question}
      </span>
      <button className="btn primary sm" onClick={onOpen}>{g.isHost ? "Answer" : "View"}</button>
    </div>
  );
}

function CheckpointPanel({ g, round, onClose }: { g: Game; round: Round; onClose: () => void }) {
  const { s, c } = g;
  const [pick, setPick] = useState<string | null>(null);
  const solved = s.solved[round.number];
  const tries = s.wrongTries[round.number] ?? 0;
  const ans = round.checkpoint.choices.find((ch) => ch.id === round.checkpoint.answer)!;
  const last = s.lastAnswer && s.lastAnswer.round === round.number ? s.lastAnswer : null;
  const hasNext = c.rounds.some((r) => r.number === round.number + 1);
  const isLast = round.number === lastRound(c);

  return (
    <div>
      <div className="eyebrow">Checkpoint · Round {round.number}</div>
      <h2 className="sheet-h">{round.checkpoint.question}</h2>
      {solved ? (
        <div>
          <div className="answer-box">
            <span className="stamp">{solved === "correct" ? "Correct" : "Answer shown"}</span>
            <p style={{ margin: "14px 0 6px", fontFamily: "var(--display)", fontSize: 19 }}>{ans.label}</p>
            <p style={{ margin: 0, color: "var(--text-2)" }}>{round.checkpoint.explanation}</p>
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
          {!g.isHost && <p className="muted-dark" style={{ marginTop: -6 }}>Talk it through together. The host submits the room&apos;s answer.</p>}
          <div className="choices">
            {round.checkpoint.choices.map((ch) => (
              <label key={ch.id} className={`choice ${pick === ch.id ? "on" : ""} ${last && !last.correct && last.choice === ch.id ? "wrong" : ""} ${g.isHost ? "" : "readonly"}`}>
                <input type="radio" name="cp" checked={pick === ch.id} disabled={!g.isHost} onChange={() => setPick(ch.id)} />
                <span>{ch.label}</span>
              </label>
            ))}
          </div>
          {last && !last.correct && <p className="lookagain">Look again.</p>}
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap", alignItems: "center" }}>
            {g.isHost && (
              <button className="btn primary" disabled={!pick} onClick={() => pick && g.act({ t: "answer", round: round.number, choice: pick })}>
                Submit answer
              </button>
            )}
            {g.isHost && tries >= 3 && (
              <button className="btn" onClick={() => g.act({ t: "skip", round: round.number })}>Skip and show answer</button>
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

function HintsPanel({ round, used, onUse }: { round: Round; used: number; onUse: () => void }) {
  const names = ["A nudge", "Where to look", "The answer to this round"];
  return (
    <div>
      <div className="eyebrow">Hints · Round {round.number}</div>
      <h2 className="sheet-h">{round.checkpoint.question}</h2>
      <p className="muted-dark" style={{ marginTop: -4 }}>Hints show only on this device and never name the killer. The report card counts them.</p>
      <ol className="hints">
        {round.hints.map((h, i) => (
          <li key={i} className={i < used ? "shown" : ""}>
            <div className="eyebrow">{names[i]}</div>
            {i < used ? <p>{h}</p> : i === used ? <button className="btn sm" onClick={onUse} style={{ marginTop: 8 }}>Reveal hint {i + 1}</button> : <p className="muted-dark">Sealed</p>}
          </li>
        ))}
      </ol>
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
      <textarea className="notes" value={priv.notes} placeholder="Times, contradictions, questions…" onChange={(e) => { const v = e.target.value; setPriv((x) => ({ ...x, notes: v })); }} />
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
    </div>
  );
}

function PlayersPanel({ g }: { g: Game }) {
  const { s } = g;
  const [copied, setCopied] = useState(false);
  const link = typeof window !== "undefined" && g.room ? `${window.location.origin}/room/${g.room.code}` : "";
  return (
    <div>
      <div className="eyebrow">Room {g.room?.code}</div>
      <h2 className="sheet-h">Detectives at the table</h2>
      <ul className="roster">
        {sortedPlayers(s).map((id) => (
          <li key={id}>
            <span className={`dot ${g.online.includes(id) ? "" : "off"}`} />
            <span style={{ flex: 1 }}>{s.players[id].name}{id === g.me ? " (you)" : ""}</span>
            {id === s.hostId && <span className="tag new">Host</span>}
            {!g.online.includes(id) && <span className="muted-dark" style={{ fontSize: 13 }}>away</span>}
          </li>
        ))}
      </ul>
      <p className="muted-dark" style={{ fontSize: 14 }}>
        Evidence is {s.mode === "split" ? "split between players. Read your files aloud to the others." : "shared. Everyone sees every unlocked file."}
      </p>
      {link && (
        <button className="btn sm" onClick={() => { navigator.clipboard?.writeText(link).then(() => setCopied(true), () => {}); }}>
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
  const complete = !!(v.suspect && v.method && v.motive);
  const tally = (k: keyof Vote) => {
    const t: Record<string, string[]> = {};
    Object.entries(s.votes).forEach(([id, vote]) => {
      if (!s.players[id]) return;
      (t[vote[k]] ??= []).push(s.players[id].name);
    });
    return t;
  };
  const voters = Object.keys(s.votes).filter((id) => s.players[id]).length;

  if (s.finishedAt) return <p>The accusation has been made.</p>;

  return (
    <div>
      <div className="eyebrow">Final report</div>
      <h2 className="sheet-h">The accusation</h2>
      <p className="muted-dark" style={{ marginTop: -4 }}>
        {c.narration.accusation[0].text} There is no second chance.
        {g.party && " Everyone votes. The host submits the room's answer."}
      </p>
      <ChoiceGroup title="Who" items={c.suspects.map((x) => ({ id: x.id, label: `${x.name} — ${x.role}` }))} val={v.suspect} set={(x) => setV({ ...v, suspect: x })} tally={g.party ? tally("suspect") : undefined} />
      <ChoiceGroup title="How" items={c.accusation.methods} val={v.method} set={(x) => setV({ ...v, method: x })} tally={g.party ? tally("method") : undefined} />
      <ChoiceGroup title="Why" items={c.accusation.motives} val={v.motive} set={(x) => setV({ ...v, motive: x })} tally={g.party ? tally("motive") : undefined} />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {g.party && (
          <button className="btn" disabled={!complete} onClick={() => g.act({ t: "vote", vote: v })}>
            {mine ? "Update my vote" : "Cast my vote"}
          </button>
        )}
        {g.isHost && (
          <button className="btn primary" disabled={!complete} onClick={() => g.act({ t: "accuse", vote: v })}>
            {g.party ? "Submit the room's accusation" : "Submit and close the file"}
          </button>
        )}
        {g.party && <span className="muted-dark" style={{ fontSize: 14 }}>{voters} of {Object.keys(s.players).length} voted</span>}
      </div>
    </div>
  );
}

function RevealPanel({ g, onClose }: { g: Game; onClose: () => void }) {
  const { c, s } = g;
  const lines = c.narration.reveal;
  const step = s.revealStep;
  if (!s.finishedAt) return null;

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
              <button className="btn ghost sm" onClick={() => g.act({ t: "reveal", d: lines.length })}>Skip to report</button>
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
  const { parts, right, verdict } = score(c, a);
  const mins = s.finishedAt && s.startedAt ? Math.max(0, Math.round((s.finishedAt - s.startedAt) / 60000)) : 0;
  const hints = Object.values(s.hints).reduce((t, n) => t + n, 0);
  const skipped = Object.values(s.solved).filter((x) => x === "skipped").length;
  const suspect = c.suspects.find((x) => x.id === a?.suspect);
  const real = c.suspects.find((x) => x.id === c.solution.suspect)!;

  return (
    <div>
      <div className="reportcard paper" style={{ padding: "34px 34px 26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div className="small" style={{ letterSpacing: ".25em" }}>THE BLACKWOOD BUREAU · CASE REPORT</div>
            <h2 style={{ fontFamily: "var(--display)", fontSize: 26, fontWeight: 400, margin: "6px 0 0" }}>Case No. {c.number} — {c.title}</h2>
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
                <li key={id}>{s.players[id].name}: {c.suspects.find((x) => x.id === vote.suspect)?.name} {vote.suspect === c.solution.suspect ? "✓" : "✗"}</li>
              ))}
            </ul>
          </>
        )}
        <hr className="thin" />
        <div className="serif" style={{ fontWeight: 700, marginBottom: 6 }}>The clues that proved it</div>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13.5 }}>
          {c.solution.proofs.map((pr, k) => <li key={k} style={{ margin: "3px 0" }}>{pr.clue} <span className="muted">(Exh. {pr.exhibit})</span></li>)}
        </ol>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        {g.isHost && <button className="btn" onClick={() => g.act({ t: "reveal", d: -lines.length })}>Replay the reveal</button>}
        <button className="btn" onClick={onClose}>Back to the evidence</button>
        <Link className="btn ghost" href="/">Case archive</Link>
      </div>
    </div>
  );
}
