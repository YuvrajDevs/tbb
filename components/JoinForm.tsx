"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function JoinForm() {
  const [code, setCode] = useState("");
  const router = useRouter();
  const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (clean.length === 5) router.push(`/room/${clean}`);
      }}
      style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
    >
      <input className="field-input code" value={clean} onChange={(e) => setCode(e.target.value)} placeholder="ROOM CODE" aria-label="Room code" autoFocus inputMode="text" autoCapitalize="characters" />
      <button className="btn primary" disabled={clean.length !== 5}>Join</button>
    </form>
  );
}
