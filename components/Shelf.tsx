"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { shelf } from "@/lib/cases/hollow-pines";
import { soloStatus } from "@/lib/game/game";

export function Shelf() {
  const [status, setStatus] = useState<Record<string, string>>({});
  useEffect(() => {
    const s: Record<string, string> = {};
    shelf.forEach((c) => c.id && (s[c.id] = soloStatus(c.id)));
    setStatus(s);
  }, []);

  return (
    <div className="shelf-grid">
      {shelf.map((c) => {
        const inner = (
          <>
            <div className="tab">NO. {c.number}</div>
            <div className="body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "var(--type)", fontSize: 11, letterSpacing: ".2em", color: "var(--brown-deep)" }}>
                  CASE NO. {c.number}
                </div>
                {c.status === "available" ? (
                  <span className="stamp" style={{ fontSize: 10, padding: "2px 7px", transform: "rotate(5deg)" }}>
                    {status[c.id!] ?? "New"}
                  </span>
                ) : (
                  <span className="stamp" style={{ fontSize: 10, padding: "2px 7px", transform: "rotate(5deg)", color: "var(--brown-deep)", borderColor: "var(--brown-deep)" }}>
                    Sealed
                  </span>
                )}
              </div>
              <div style={{ marginTop: "auto" }}>
                <div style={{ fontFamily: "var(--display)", fontSize: 21, lineHeight: 1.2, color: "var(--ink)" }}>{c.title}</div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", fontFamily: "var(--type)", fontSize: 11, color: "var(--brown-deep)", letterSpacing: ".08em" }}>
                  <span>{c.genre.toUpperCase()}</span>
                  <span>{c.status === "available" ? "OPEN" : "IN PREPARATION"}</span>
                </div>
              </div>
            </div>
          </>
        );
        return c.status === "available" ? (
          <Link key={c.number} href={`/case/${c.id}`} className="casefile">
            {inner}
          </Link>
        ) : (
          <div key={c.number} className="casefile sealed" aria-disabled>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
