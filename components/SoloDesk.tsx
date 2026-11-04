"use client";

import type { CaseFile } from "@/lib/types";
import { useSoloGame } from "@/lib/game/game";
import { Desk } from "./Desk";
import { SignInGate } from "./SignIn";

export function SoloDesk({ c }: { c: CaseFile }) {
  return (
    <SignInGate what="open this case">
      <SoloInner c={c} />
    </SignInGate>
  );
}

function SoloInner({ c }: { c: CaseFile }) {
  const g = useSoloGame(c);
  if (!g) return <div style={{ padding: 40 }} className="eyebrow">Opening file…</div>;
  return <Desk g={g} exitHref={`/case/${c.id}`} />;
}
