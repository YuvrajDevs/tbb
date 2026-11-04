"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CaseFile, EvidenceFile, NarrationLine, Round } from "@/lib/types";
import { useProgress, type Progress, type SuspectMark } from "@/lib/progress";
import { FileIcon, FolderIcon, Glyph, type FolderState } from "./Icons";
import { Evidence } from "./evidence";

type Panel = null | "notebook" | "hints" | "checkpoint" | "settings" | "accuse" | "reveal";

function scriptLines(c: CaseFile, script: string): NarrationLine[] {
  if (script === "briefing") return c.narration.briefing;
  if (script === "accusation") return c.narration.accusation;
  if (script === "reveal") return c.narration.reveal;
  const n = Number(script.replace("round-", ""));
  return c.narration.rounds[n] ?? [];
}

function speak(text: string) {
  try {
    const s = window.speechSynthesis;
    if (!s) return;
    s.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.94;
    u.pitch = 0.82;
    const v = s.getVoices().find((v) => /en[-_](GB|IN)/i.test(v.lang));
    if (v) u.voice = v;
    s.speak(u);
  } catch {}
}

export function Desk({ c }: { c: CaseFile }) {
  const { progress: p, update, ready } = useProgress(c.id);
  const [folder, setFolder] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [zoom, setZoom] = useState(1);
  const [cpRound, setCpRound] = useState(1);
  const openCheckpoint = (n: number) => { setCpRound(n); setPanel("checkpoint"); };

  const allFiles = useMemo(() => c.rounds.flatMap((r) => r.files.map((f) => ({ ...f, round: r.number }))), [c]);
  const openFile = allFiles.find((f) => f.id === fileId) ?? null;
  const current = c.rounds.find((r) => r.number === p.unlocked)!;
  const allSolved = c.rounds.every((r) => p.solved[r.number]);

  useEffect(() => {
    if (ready && folder === null) setFolder(p.unlocked);
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (ready && p.finishedAt) setPanel("reveal");
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const view = (f: EvidenceFile) => {
    setFileId(f.id);
    setZoom(1);
    if (!p.viewed.includes(f.id)) update((x) => ({ ...x, viewed: [...x.viewed, f.id] }));
  };

  /* ---------- narration ---------- */
  const lines = scriptLines(c, p.narration.script);
  const line = lines[Math.min(p.narration.line, lines.length - 1)];
  const lastSpoken = useRef<string>("");
  useEffect(() => {
    if (!ready || !p.voice || !line) return;
    if (lastSpoken.current === line.id) return;
    lastSpoken.current = line.id;
    speak(line.text);
  }, [ready, p.voice, line]);

  const step = (d: number) =>
    update((x) => {
      const ls = scriptLines(c, x.narration.script);
      const n = Math.max(0, Math.min(ls.length - 1, x.narration.line + d));
      return { ...x, narration: { ...x.narration, line: n } };
    });

  /* ---------- timer ---------- */
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const roundStart = p.roundStartedAt[p.unlocked] ?? now;
  const remaining = Math.max(0, current.minutes * 60 - Math.floor((now - roundStart) / 1000));
  const timeUp = p.timerEnabled && remaining === 0 && !p.solved[p.unlocked];

  /* ---------- checkpoint solve ---------- */
  const solveRound = (r: Round, how: "correct" | "skipped") =>
    update((x) => {
      const next = r.number + 1;
      const hasNext = c.rounds.some((rr) => rr.number === next);
      return {
        ...x,
        solved: { ...x.solved, [r.number]: how },
        unlocked: hasNext ? Math.max(x.unlocked, next) : x.unlocked,
        roundStartedAt: hasNext ? { ...x.roundStartedAt, [next]: Date.now() } : x.roundStartedAt,
        narration: { script: hasNext ? `round-${next}` : "accusation", line: 0 },
      };
    });

  if (!ready) return <div style={{ padding: 40 }} className="eyebrow">Opening file…</div>;

  const folderState = (r: Round): FolderState => {
    if (r.number > p.unlocked) return "locked";
    if (folder === r.number) return "open";
    if (r.files.some((f) => !p.viewed.includes(f.id))) return "new";
    return "closed";
  };

  const activeRound = c.rounds.find((r) => r.number === folder) ?? null;

  return (
    <div className="desk">
      {/* ---------- top bar ---------- */}
      <header className="desk-top">
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <Link href={`/case/${c.id}`} className="iconbtn" aria-label="Back to case cover">{Glyph.back}</Link>
          <div style={{ minWidth: 0 }}>
            <div className="eyebrow" style={{ fontSize: 10 }}>Case No. {c.number}</div>
            <div style={{ fontFamily: "var(--display)", fontSize: 17, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {p.timerEnabled && !allSolved && (
            <div className={`timer ${remaining < 120 ? "low" : ""}`} title={`Round ${p.unlocked} timer`}>
              {String(Math.floor(remaining / 60)).padStart(2, "0")}:{String(remaining % 60).padStart(2, "0")}
            </div>
          )}
          <button className="btn sm ghost" onClick={() => setPanel("notebook")}>Notebook</button>
          <button className="btn sm ghost hide-sm" onClick={() => setPanel("hints")}>Hints</button>
          <button className="btn sm ghost hide-sm" onClick={() => setPanel("settings")}>Settings</button>
          <button className="btn sm" disabled={!allSolved} onClick={() => setPanel(p.finishedAt ? "reveal" : "accuse")} title={allSolved ? "" : "Answer all four checkpoints first"}>
            {p.finishedAt ? "Report" : "Accuse"}
          </button>
        </div>
      </header>

      {timeUp && (
        <div className="timeup">
          <span>Time is up for round {p.unlocked}. When you are ready, answer the checkpoint to move on.</span>
          <button className="btn sm" onClick={() => openCheckpoint(p.unlocked)}>Checkpoint</button>
        </div>
      )}

      <div className={`desk-body ${openFile ? "has-file" : ""}`}>
        {/* ---------- folders + file list ---------- */}
        <section className="desk-left">
          <div className="folders">
            {c.rounds.map((r) => {
              const st = folderState(r);
              return (
                <button
                  key={r.number}
                  className={`folder ${folder === r.number ? "sel" : ""}`}
                  onClick={() => st !== "locked" && (setFolder(r.number), setFileId(null))}
                  aria-disabled={st === "locked"}
                >
                  <FolderIcon state={st} size={74} label={`ENV. ${r.number}`} />
                  <div className="folder-label">
                    <span>Round {r.number}</span>
                    <span className="t">{st === "locked" ? "Sealed" : r.title}</span>
                  </div>
                  {p.solved[r.number] && <span className="tick">{p.solved[r.number] === "correct" ? "SOLVED" : "SKIPPED"}</span>}
                </button>
              );
            })}
          </div>

          {activeRound && (
            <div className="files">
              <div className="files-head">
                <div>
                  <div className="eyebrow">{activeRound.envelope} · {activeRound.files.length} files</div>
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
                    <tr><th style={{ width: 40 }} /><th>Name</th><th className="hide-sm">Date</th><th style={{ width: 84 }}>Tag</th></tr>
                  </thead>
                  <tbody>
                    {activeRound.files.map((f) => {
                      const starred = p.starred.includes(f.id);
                      return (
                        <tr key={f.id} className={fileId === f.id ? "sel" : ""} onClick={() => view(f)}>
                          <td><FileIcon type={f.type} size={20} /></td>
                          <td>
                            <span className="ex">Exhibit {f.exhibit} — </span>
                            {f.name}
                          </td>
                          <td className="hide-sm mono-cell">{f.date}</td>
                          <td>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <button
                                className="star"
                                aria-label={starred ? "Unstar" : "Star"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  update((x) => ({ ...x, starred: starred ? x.starred.filter((s) => s !== f.id) : [...x.starred, f.id] }));
                                }}
                              >
                                {Glyph.star(starred)}
                              </button>
                              {!p.viewed.includes(f.id) ? <span className="tag new">New</span> : <span className="tag">Viewed</span>}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="filegrid">
                  {activeRound.files.map((f) => (
                    <button key={f.id} className={`filecard ${fileId === f.id ? "sel" : ""}`} onClick={() => view(f)}>
                      <FileIcon type={f.type} size={38} />
                      <span className="ex">Exhibit {f.exhibit}</span>
                      <span className="nm">{f.name}</span>
                      {!p.viewed.includes(f.id) && <span className="tag new">New</span>}
                    </button>
                  ))}
                </div>
              )}
              <div className="checkpoint-strip">
                {p.solved[activeRound.number] ? (
                  <span className="muted-dark">Checkpoint {p.solved[activeRound.number] === "correct" ? "answered" : "skipped"} · {activeRound.checkpoint.question}</span>
                ) : (
                  <>
                    <span>
                      <span className="eyebrow" style={{ display: "block" }}>Checkpoint</span>
                      {activeRound.checkpoint.question}
                    </span>
                    <button className="btn primary sm" onClick={() => openCheckpoint(activeRound.number)}>Answer</button>
                  </>
                )}
              </div>
            </div>
          )}
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
                  <Evidence file={openFile} />
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
          <div className="nar-id">{line.id}</div>
          <div className="nar-text">{line.text}</div>
          <div className="nar-ctl">
            <button className="iconbtn" onClick={() => step(-1)} disabled={p.narration.line === 0} aria-label="Previous line">{Glyph.prev}</button>
            <button className="iconbtn" onClick={() => speak(line.text)} aria-label="Replay line">{Glyph.replay}</button>
            <button
              className={`iconbtn ${p.voice ? "on" : ""}`}
              onClick={() => {
                if (p.voice) try { window.speechSynthesis.cancel(); } catch {}
                lastSpoken.current = "";
                update((x) => ({ ...x, voice: !x.voice }));
              }}
              aria-label="Narrator voice"
            >
              {p.voice ? Glyph.voiceOn : Glyph.voiceOff}
            </button>
            <button className="iconbtn" onClick={() => step(1)} disabled={p.narration.line >= lines.length - 1} aria-label="Next line">{Glyph.next}</button>
          </div>
          <div className="nar-prog">
            {lines.map((_, i) => <span key={i} className={i <= p.narration.line ? "on" : ""} />)}
          </div>
        </footer>
      )}

      {/* ---------- panels ---------- */}
      {panel && (
        <div className="overlay" onClick={() => panel !== "reveal" && setPanel(null)}>
          <div className={`sheet ${panel === "reveal" ? "wide" : ""}`} onClick={(e) => e.stopPropagation()}>
            {panel !== "reveal" && (
              <button className="iconbtn sheet-x" onClick={() => setPanel(null)} aria-label="Close">{Glyph.close}</button>
            )}
            {panel === "checkpoint" && (
              <CheckpointPanel
                round={c.rounds.find((r) => r.number === cpRound)!}
                p={p}
                onWrong={(n) => update((x) => ({ ...x, wrongTries: { ...x.wrongTries, [n]: (x.wrongTries[n] ?? 0) + 1 } }))}
                onSolve={(r, how) => {
                  solveRound(r, how);
                  const next = r.number + 1;
                  if (c.rounds.some((rr) => rr.number === next)) {
                    setFolder(next);
                    setFileId(null);
                  }
                }}
                onClose={() => setPanel(null)}
              />
            )}
            {panel === "hints" && <HintsPanel round={current} used={p.hintsUsed[current.number] ?? 0} onUse={() => update((x) => ({ ...x, hintsUsed: { ...x.hintsUsed, [current.number]: Math.min(3, (x.hintsUsed[current.number] ?? 0) + 1) } }))} />}
            {panel === "notebook" && <NotebookPanel c={c} p={p} update={update} />}
            {panel === "settings" && <SettingsPanel p={p} update={update} />}
            {panel === "accuse" && (
              <AccusePanel
                c={c}
                onSubmit={(a) => {
                  update((x) => ({ ...x, accusation: a, finishedAt: Date.now(), narration: { script: "reveal", line: 0 } }));
                  setPanel("reveal");
                }}
              />
            )}
            {panel === "reveal" && <RevealPanel c={c} p={p} onClose={() => setPanel(null)} />}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================== */

function CheckpointPanel({ round, p, onWrong, onSolve, onClose }: { round: Round; p: Progress; onWrong: (n: number) => void; onSolve: (r: Round, how: "correct" | "skipped") => void; onClose: () => void }) {
  const [pick, setPick] = useState<string | null>(null);
  const [state, setState] = useState<"ask" | "wrong" | "right" | "skipped">(p.solved[round.number] ? "right" : "ask");
  const tries = p.wrongTries[round.number] ?? 0;
  const ans = round.checkpoint.choices.find((c) => c.id === round.checkpoint.answer)!;

  if (round.number > p.unlocked) return null;

  return (
    <div>
      <div className="eyebrow">Checkpoint · Round {round.number}</div>
      <h2 className="sheet-h">{round.checkpoint.question}</h2>
      {state === "right" || state === "skipped" ? (
        <div>
          <div className="answer-box">
            <span className="stamp" style={{ transform: "rotate(-3deg)" }}>{state === "right" ? "Correct" : "Answer shown"}</span>
            <p style={{ margin: "14px 0 6px", fontFamily: "var(--display)", fontSize: 19 }}>{ans.label}</p>
            <p style={{ margin: 0, color: "var(--text-2)" }}>{round.checkpoint.explanation}</p>
          </div>
          <button className="btn primary" style={{ marginTop: 18 }} onClick={onClose}>
            {round.number < 4 ? `Open folder ${round.number + 1}` : "Back to the desk"}
          </button>
        </div>
      ) : (
        <>
          <div className="choices">
            {round.checkpoint.choices.map((ch) => (
              <label key={ch.id} className={`choice ${pick === ch.id ? "on" : ""}`}>
                <input type="radio" name="cp" checked={pick === ch.id} onChange={() => { setPick(ch.id); setState("ask"); }} />
                <span>{ch.label}</span>
              </label>
            ))}
          </div>
          {state === "wrong" && <p className="lookagain">Look again.</p>}
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap", alignItems: "center" }}>
            <button
              className="btn primary"
              disabled={!pick}
              onClick={() => {
                if (pick === round.checkpoint.answer) {
                  setState("right");
                  onSolve(round, "correct");
                } else {
                  setState("wrong");
                  onWrong(round.number);
                }
              }}
            >
              Submit answer
            </button>
            {tries >= 3 && (
              <button className="btn" onClick={() => { setState("skipped"); onSolve(round, "skipped"); }}>
                Skip and show answer
              </button>
            )}
            <span className="muted-dark" style={{ fontSize: 14 }}>{tries > 0 ? `${tries} wrong ${tries === 1 ? "try" : "tries"}${tries < 3 ? ` · skip after 3` : ""}` : "No penalty for wrong answers"}</span>
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
      <p className="muted-dark" style={{ marginTop: -4 }}>Hints are private and never name the killer. Your report card will show how many you used.</p>
      <ol className="hints">
        {round.hints.map((h, i) => (
          <li key={i} className={i < used ? "shown" : ""}>
            <div className="eyebrow">{names[i]}</div>
            {i < used ? <p>{h}</p> : i === used ? <button className="btn sm" onClick={onUse}>Reveal hint {i + 1}</button> : <p className="muted-dark">Sealed</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function NotebookPanel({ c, p, update }: { c: CaseFile; p: Progress; update: (fn: (p: Progress) => Progress) => void }) {
  const cycle: SuspectMark[] = ["none", "suspicious", "cleared"];
  return (
    <div>
      <div className="eyebrow">Notebook</div>
      <h2 className="sheet-h">Suspects</h2>
      <div className="suspects">
        {c.suspects.map((s) => {
          const m = p.suspects[s.id] ?? "none";
          return (
            <button
              key={s.id}
              className={`suspect ${m}`}
              onClick={() => update((x) => ({ ...x, suspects: { ...x.suspects, [s.id]: cycle[(cycle.indexOf(m) + 1) % 3] } }))}
            >
              <span style={{ fontFamily: "var(--display)", fontSize: 17 }}>{s.name}</span>
              <span className="muted-dark" style={{ fontSize: 13 }}>{s.role}, {s.age} · {s.note}</span>
              <span className="mark">{m === "none" ? "Unmarked" : m === "suspicious" ? "Suspicious" : "Cleared"}</span>
            </button>
          );
        })}
      </div>
      <p className="muted-dark" style={{ fontSize: 13, margin: "8px 0 18px" }}>Tap a name to mark it suspicious, cleared, or unmarked.</p>
      <h2 className="sheet-h">Notes</h2>
      <textarea
        className="notes"
        value={p.notes}
        placeholder="Times, contradictions, questions…"
        onChange={(e) => {
          const v = e.target.value;
          update((x) => ({ ...x, notes: v }));
        }}
      />
      {p.starred.length > 0 && (
        <>
          <h2 className="sheet-h" style={{ marginTop: 18 }}>Starred exhibits</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-2)" }}>
            {c.rounds.flatMap((r) => r.files).filter((f) => p.starred.includes(f.id)).map((f) => (
              <li key={f.id}>Exhibit {f.exhibit} — {f.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function SettingsPanel({ p, update }: { p: Progress; update: (fn: (p: Progress) => Progress) => void }) {
  return (
    <div>
      <div className="eyebrow">Settings</div>
      <h2 className="sheet-h">Table settings</h2>
      <label className="toggle">
        <input type="checkbox" checked={p.timerEnabled} onChange={() => update((x) => ({ ...x, timerEnabled: !x.timerEnabled }))} />
        <span><b>Round timer.</b> A countdown for each round. When it ends you are prompted to move on; nothing is forced.</span>
      </label>
      <label className="toggle">
        <input type="checkbox" checked={p.voice} onChange={() => update((x) => ({ ...x, voice: !x.voice }))} />
        <span><b>Narrator voice.</b> Reads each line aloud using this device&apos;s voice. Captions always show.</span>
      </label>
    </div>
  );
}

function AccusePanel({ c, onSubmit }: { c: CaseFile; onSubmit: (a: { suspect: string; method: string; motive: string }) => void }) {
  const [s, setS] = useState("");
  const [m, setM] = useState("");
  const [mo, setMo] = useState("");
  const Group = ({ title, items, val, set }: { title: string; items: { id: string; label: string }[]; val: string; set: (v: string) => void }) => (
    <div style={{ marginBottom: 18 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{title}</div>
      <div className="choices">
        {items.map((i) => (
          <label key={i.id} className={`choice ${val === i.id ? "on" : ""}`}>
            <input type="radio" name={title} checked={val === i.id} onChange={() => set(i.id)} />
            <span>{i.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
  return (
    <div>
      <div className="eyebrow">Final report</div>
      <h2 className="sheet-h">The accusation</h2>
      <p className="muted-dark" style={{ marginTop: -4 }}>{c.narration.accusation[0].text} There is no second chance.</p>
      <Group title="Who" items={c.suspects.map((x) => ({ id: x.id, label: `${x.name} — ${x.role}` }))} val={s} set={setS} />
      <Group title="How" items={c.accusation.methods} val={m} set={setM} />
      <Group title="Why" items={c.accusation.motives} val={mo} set={setMo} />
      <button className="btn primary" disabled={!s || !m || !mo} onClick={() => onSubmit({ suspect: s, method: m, motive: mo })}>
        Submit and close the file
      </button>
    </div>
  );
}

function RevealPanel({ c, p, onClose }: { c: CaseFile; p: Progress; onClose: () => void }) {
  const [i, setI] = useState(0);
  const a = p.accusation;
  const lines = c.narration.reveal;
  const done = i >= lines.length;
  const score = a ? [a.suspect === c.solution.suspect, a.method === c.solution.method, a.motive === c.solution.motive] : [false, false, false];
  const right = score.filter(Boolean).length;
  const verdict = right === 3 ? "Case solved" : score[0] ? "Right suspect, wrong story" : "Case unsolved";
  const mins = p.finishedAt && p.startedAt ? Math.round((p.finishedAt - p.startedAt) / 60000) : 0;
  const hints = Object.values(p.hintsUsed).reduce((s, n) => s + n, 0);
  const skipped = Object.values(p.solved).filter((v) => v === "skipped").length;
  const suspect = c.suspects.find((s) => s.id === a?.suspect);

  const next = useCallback(() => setI((x) => x + 1), []);
  useEffect(() => {
    if (!done && p.voice) speak(lines[i].text);
  }, [i, done, p.voice, lines]);

  if (!done) {
    return (
      <div className="reveal">
        <div className="eyebrow">The reveal · {lines[i].id}</div>
        <p className="reveal-line">{lines[i].text}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 26 }}>
          <div className="nar-prog" style={{ position: "static" }}>{lines.map((_, k) => <span key={k} className={k <= i ? "on" : ""} />)}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn ghost sm" onClick={() => setI(lines.length)}>Skip to report</button>
            <button className="btn primary" onClick={next}>Continue</button>
          </div>
        </div>
      </div>
    );
  }

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
            <tr><th style={{ width: "28%" }}>Your accusation</th><td>{suspect?.name ?? "—"}</td><td style={{ width: 40 }}>{score[0] ? "✓" : "✗"}</td></tr>
            <tr><th>Method</th><td>{c.accusation.methods.find((x) => x.id === a?.method)?.label}</td><td>{score[1] ? "✓" : "✗"}</td></tr>
            <tr><th>Motive</th><td>{c.accusation.motives.find((x) => x.id === a?.motive)?.label}</td><td>{score[2] ? "✓" : "✗"}</td></tr>
          </tbody>
        </table>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 12, marginTop: 18, textAlign: "center" }}>
          <div><div className="small muted">VERDICT</div><div className="serif" style={{ fontSize: 17 }}>{verdict}</div></div>
          <div><div className="small muted">TIME TAKEN</div><div className="serif" style={{ fontSize: 17 }}>{Math.floor(mins / 60)}h {mins % 60}m</div></div>
          <div><div className="small muted">HINTS USED</div><div className="serif" style={{ fontSize: 17 }}>{hints} of 12</div></div>
          <div><div className="small muted">CHECKPOINTS</div><div className="serif" style={{ fontSize: 17 }}>{4 - skipped} of 4 unaided</div></div>
        </div>
        <hr className="thin" />
        <div className="serif" style={{ fontWeight: 700, marginBottom: 6 }}>The clues that proved it</div>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13.5 }}>
          {c.solution.proofs.map((pr, k) => (
            <li key={k} style={{ margin: "3px 0" }}>{pr.clue} <span className="muted">(Exh. {pr.exhibit})</span></li>
          ))}
        </ol>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        <button className="btn" onClick={() => setI(0)}>Replay the reveal</button>
        <button className="btn" onClick={onClose}>Back to the evidence</button>
        <Link className="btn ghost" href="/">Case archive</Link>
      </div>
    </div>
  );
}
