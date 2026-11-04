"use client";

import { useEffect, useState } from "react";

/**
 * Shown under the report card. Each device rates once per finished game; the rating goes to /api/rate.
 */
export function RatingPrompt({ caseId, gameKey, mode, players, verdict, minutes }: {
  caseId: string;
  /** identifies this finished game, so a device is asked once per game */
  gameKey: string;
  mode: "solo" | "party";
  players: number;
  verdict: string;
  minutes: number;
}) {
  const storeKey = `blackwood:rated:${caseId}:${gameKey}`;
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"ask" | "sending" | "done" | "error">("ask");
  useEffect(() => {
    try {
      if (window.localStorage.getItem(storeKey)) setState("done");
    } catch {}
  }, [storeKey]);

  const send = async () => {
    if (!stars) return;
    setState("sending");
    try {
      const r = await fetch("/api/rate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ caseId, stars, comment, mode, players, verdict, minutes }),
      });
      if (!r.ok) throw new Error();
      try {
        window.localStorage.setItem(storeKey, String(stars));
      } catch {}
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="rating done" role="status">
        <span className="stamp" style={{ fontSize: 11 }}>Filed</span>
        <span>Thank you, detective. The Bureau has your report.</span>
      </div>
    );
  }

  const shown = hover || stars;
  const labels = ["", "Not for me", "It was fine", "Good case", "Very good", "Superb"];
  return (
    <div className="rating">
      <div className="eyebrow">Before you close the file</div>
      <div className="rating-h">How was this case?</div>
      <div className="rating-stars" role="radiogroup" aria-label="Rate this case out of five" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={stars === n}
            aria-label={`${n} of 5 — ${labels[n]}`}
            className={`rating-star ${n <= shown ? "on" : ""}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => setStars(n)}
          >
            ★
          </button>
        ))}
        <span className="rating-label">{shown ? labels[shown] : "Tap a star"}</span>
      </div>
      {stars > 0 && (
        <>
          <textarea
            className="rating-note"
            value={comment}
            maxLength={1000}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Anything to tell the Bureau? Too hard, too easy, a favourite clue… (optional)"
            aria-label="Comment (optional)"
          />
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn primary sm" onClick={send} disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send rating"}
            </button>
            {state === "error" && <span className="lookagain" style={{ margin: 0 }}>It did not send. Try again.</span>}
          </div>
        </>
      )}
    </div>
  );
}
