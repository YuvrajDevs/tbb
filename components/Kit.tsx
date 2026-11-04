"use client";

import Link from "next/link";
import type { CaseFile } from "@/lib/types";
import { Evidence } from "./evidence";

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="print-page" style={{ marginBottom: 40 }}>
      <div className="paper" style={{ maxWidth: 820, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

export function Kit({ c }: { c: CaseFile }) {
  return (
    <div className="wrap" style={{ paddingTop: 28, paddingBottom: 80, maxWidth: 920 }}>
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
        <Link href={`/case/${c.id}`} className="btn ghost" style={{ paddingLeft: 0 }}>← Case cover</Link>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: "var(--text-3)", fontSize: 14, fontStyle: "italic" }}>A4 · every page carries the case and envelope number</span>
          <button className="btn primary" onClick={() => window.print()}>Print case kit</button>
        </div>
      </div>

      {/* host guide */}
      <Sheet>
        <div className="small" style={{ letterSpacing: ".25em" }}>THE BLACKWOOD BUREAU · CASE NO. {c.number}</div>
        <h1 style={{ fontSize: 30, margin: "6px 0 2px" }}>Host guide</h1>
        <div className="serif" style={{ fontStyle: "italic" }}>{c.title} · {c.players} players · {c.playTime}</div>
        <hr className="double" />
        <div className="serif" style={{ fontWeight: 700 }}>Set up in ten minutes</div>
        <ol>
          <li>Print this kit. Cut out the four envelope labels and stick one on each envelope.</li>
          {c.rounds.map((r) => (
            <li key={r.number}>
              <b>{r.envelope}</b> — {r.title}: Exhibits {r.files[0].exhibit}–{r.files[r.files.length - 1].exhibit}. {r.files.some((f) => f.type === "audio") && "(The voicemail page has a transcript; play it in the app if you like.)"}
            </li>
          ))}
          <li>Fold the solution page in half and seal it. Do not open it until the reveal.</li>
          <li>Open the case on one phone or laptop. It runs the narrator, the checkpoints and the accusation.</li>
        </ol>
        <div className="serif" style={{ fontWeight: 700 }}>How a round works</div>
        <p>The narrator reads a short scene and tells you to open the next envelope. Spread its pages on the table and investigate together. When the group agrees, answer the checkpoint in the app. A right answer opens the next round. A wrong one simply says &ldquo;Look again&rdquo;. After three wrong tries you may skip.</p>
        <p>Hints are in the app, three per round, from a nudge to the round&apos;s answer. They never name the killer.</p>
        <p>After envelope four, the group makes one accusation: who, how and why. Then the narrator plays the reveal.</p>
      </Sheet>

      {/* envelope labels */}
      <Sheet>
        <div className="small" style={{ letterSpacing: ".25em", marginBottom: 14 }}>ENVELOPE LABELS — CUT ALONG THE DASHED LINES</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {c.rounds.map((r) => (
            <div key={r.number} style={{ border: "1.5px dashed var(--ink-2)", padding: "26px 22px", textAlign: "center", minHeight: 190 }}>
              <div className="small" style={{ letterSpacing: ".25em" }}>CASE NO. {c.number}</div>
              <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: ".12em", marginTop: 6 }}>ENVELOPE {r.number}</div>
              <div className="serif" style={{ fontStyle: "italic", fontSize: 17 }}>{r.title}</div>
              <div style={{ marginTop: 14 }}><span className="stamp" style={{ fontSize: 11 }}>Do not open until instructed</span></div>
            </div>
          ))}
        </div>
      </Sheet>

      {/* evidence */}
      {c.rounds.map((r) =>
        r.files.map((f) => (
          <div key={f.id} className="print-page" style={{ marginBottom: 40 }}>
            <Evidence file={f} />
          </div>
        ))
      )}

      {/* case board */}
      <Sheet>
        <div className="small" style={{ letterSpacing: ".25em" }}>CASE NO. {c.number} · CASE BOARD</div>
        <h2 style={{ fontSize: 24, margin: "6px 0 12px" }}>Suspects, timeline &amp; notes</h2>
        <table className="grid">
          <thead><tr><th>Suspect</th><th style={{ width: "22%" }}>Motive?</th><th style={{ width: "22%" }}>Opportunity?</th><th style={{ width: 90 }}>Cleared</th></tr></thead>
          <tbody>
            {c.suspects.map((s) => <tr key={s.id}><td>{s.name}<div className="small muted">{s.role}, {s.age}</div></td><td /><td /><td /></tr>)}
          </tbody>
        </table>
        <div className="serif" style={{ fontWeight: 700, marginTop: 18 }}>Timeline — Saturday 10 October</div>
        <table className="grid" style={{ marginTop: 6 }}>
          <tbody>
            {["19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "07:00"].map((t) => (
              <tr key={t}><td style={{ width: 70 }} className="mono">{t}</td><td style={{ height: 30 }} /></tr>
            ))}
          </tbody>
        </table>
      </Sheet>

      {/* sealed solution */}
      <Sheet>
        <div style={{ border: "3px double var(--ink)", padding: 26, textAlign: "center" }}>
          <div className="small" style={{ letterSpacing: ".25em" }}>CASE NO. {c.number}</div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: ".1em", margin: "8px 0" }}>SOLUTION</div>
          <span className="stamp" style={{ fontSize: 16 }}>Sealed — open only after the accusation</span>
        </div>
        <div style={{ marginTop: 160, transform: "rotate(180deg)" }}>
          <p><b>Who:</b> {c.suspects.find((s) => s.id === c.solution.suspect)?.name}</p>
          <p><b>How:</b> {c.accusation.methods.find((m) => m.id === c.solution.method)?.label}</p>
          <p><b>Why:</b> {c.accusation.motives.find((m) => m.id === c.solution.motive)?.label}</p>
          <ol className="small">{c.solution.proofs.map((p, i) => <li key={i}>{p.clue} (Exh. {p.exhibit})</li>)}</ol>
        </div>
      </Sheet>
      <p className="small no-print" style={{ textAlign: "center", color: "var(--text-3)" }}>Demo kit · purchased kits carry the buyer&apos;s name and order number on every page.</p>
    </div>
  );
}
