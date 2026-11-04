"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { caseStatus, clearProgress } from "@/lib/progress";

export function CoverActions({ caseId }: { caseId: string }) {
  const [status, setStatus] = useState<string>("New");
  useEffect(() => setStatus(caseStatus(caseId)), [caseId]);

  const darkBtn = { background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" };
  const lineBtn = { color: "var(--ink)", borderColor: "var(--brown)" };

  return (
    <div style={{ position: "relative", marginTop: 34 }}>
      <div style={{ fontFamily: "var(--type)", fontSize: 11, letterSpacing: ".22em", color: "var(--brown-deep)", marginBottom: 12 }}>HOW WILL YOU PLAY?</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
        <div style={{ border: "1px solid var(--brown)", padding: 18 }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 20 }}>Solo detective</div>
          <p style={{ margin: "6px 0 14px", fontSize: 15, color: "var(--brown-deep)" }}>One player. Work through the folders round by round on this device.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href={`/case/${caseId}/desk`} className="btn" style={darkBtn}>
              {status === "New" ? "Open the file" : status === "Solved" ? "Review file" : "Continue"}
            </Link>
            {status !== "New" && (
              <button
                className="btn"
                style={lineBtn}
                onClick={() => {
                  if (confirm("Start the case again? Your notes and progress will be cleared.")) {
                    clearProgress(caseId);
                    setStatus("New");
                  }
                }}
              >
                Restart
              </button>
            )}
          </div>
        </div>
        <div style={{ border: "1px dashed var(--brown)", padding: 18, opacity: 0.8 }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 20 }}>Party room</div>
          <p style={{ margin: "6px 0 14px", fontSize: 15, color: "var(--brown-deep)" }}>2 to 6 players join with a room code, each on their own phone.</p>
          <button className="btn" style={lineBtn} disabled>Open a room · soon</button>
        </div>
        <div style={{ border: "1px solid var(--brown)", padding: 18 }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 20 }}>Print game night</div>
          <p style={{ margin: "6px 0 14px", fontSize: 15, color: "var(--brown-deep)" }}>2 to 8 players. Print the evidence, sort it into envelopes, run the narrator here.</p>
          <Link href={`/case/${caseId}/kit`} className="btn" style={lineBtn}>Case kit</Link>
        </div>
      </div>
    </div>
  );
}
