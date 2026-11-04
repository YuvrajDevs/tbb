"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSolo, markRoomCreator, soloStatus } from "@/lib/game/game";
import { loadProgress, useAuth } from "@/lib/account";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
function makeCode() {
  let s = "";
  const r = new Uint32Array(5);
  crypto.getRandomValues(r);
  r.forEach((n) => (s += ALPHABET[n % ALPHABET.length]));
  return s;
}

export function CoverActions({ caseId }: { caseId: string }) {
  const [status, setStatus] = useState<string>("New");
  const [confirm, setConfirm] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    const local = soloStatus(caseId);
    setStatus(local);
    // new device, signed in: the account may hold a case in progress
    if (user && local === "New")
      void loadProgress(caseId)
        .then((p) => p && setStatus(p.state.finishedAt ? "Solved" : "In progress"))
        .catch(() => {});
  }, [caseId, user]);

  const darkBtn = { background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" };
  const lineBtn = { color: "var(--ink)", borderColor: "var(--brown)" };

  return (
    <div style={{ position: "relative", marginTop: 34 }}>
      <div style={{ fontFamily: "var(--type)", fontSize: 11, letterSpacing: ".22em", color: "var(--brown-deep)", marginBottom: 12 }}>HOW WILL YOU PLAY?</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
        <div className="mode-card">
          <div style={{ fontFamily: "var(--display)", fontSize: 20 }}>Solo detective</div>
          <p>One player. Work through the folders round by round on this device.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href={`/case/${caseId}/desk`} className="btn" style={darkBtn}>
              {status === "New" ? "Open the file" : status === "Solved" ? "Review file" : "Continue"}
            </Link>
            {status !== "New" &&
              (confirm ? (
                <button
                  className="btn"
                  style={lineBtn}
                  onClick={() => {
                    clearSolo(caseId);
                    setStatus("New");
                    setConfirm(false);
                  }}
                >
                  Clear notes &amp; restart?
                </button>
              ) : (
                <button className="btn" style={lineBtn} onClick={() => setConfirm(true)}>Restart</button>
              ))}
          </div>
        </div>
        <div className="mode-card">
          <div style={{ fontFamily: "var(--display)", fontSize: 20 }}>Party room</div>
          <p>2 to 6 players. Friends join with a code and get the evidence on their own phones.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className="btn"
              style={darkBtn}
              onClick={() => {
                const code = makeCode();
                markRoomCreator(code);
                router.push(`/room/${code}`);
              }}
            >
              Open a room
            </button>
            <Link href="/room" className="btn" style={lineBtn}>Join</Link>
          </div>
        </div>
        <div className="mode-card">
          <div style={{ fontFamily: "var(--display)", fontSize: 20 }}>Print game night</div>
          <p>2 to 8 players. Print the evidence, sort it into envelopes, run the narrator from one phone.</p>
          <Link href={`/case/${caseId}/kit`} className="btn" style={lineBtn}>Case kit</Link>
        </div>
      </div>
    </div>
  );
}
