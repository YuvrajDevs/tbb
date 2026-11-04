import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import type { CaseResult, CheckResult, HintResult, NarrationLine } from "@/lib/types";
import { case017, type CaseSecret } from "./case-017";

/*
 * The only code that knows the answers. Checkpoints are judged here one at a time; a correct (or skipped)
 * round returns a signed token, and the verdict, the solution and the reveal are only issued in exchange
 * for tokens for every round. Nothing here is ever bundled into the page.
 */

const SECRETS: Record<string, CaseSecret> = { "017": case017 };
const KEY = process.env.CASE_TOKEN_SECRET || "blackwood-dev-only-token-key";

export const caseSecret = (id: string) => SECRETS[id] ?? null;

function token(caseId: string, round: number) {
  return createHmac("sha256", KEY).update(`${caseId}:${round}`).digest("hex").slice(0, 32);
}
function tokenOk(caseId: string, round: number, t: unknown) {
  if (typeof t !== "string" || t.length !== 32) return false;
  const want = Buffer.from(token(caseId, round));
  const got = Buffer.from(t);
  return want.length === got.length && timingSafeEqual(want, got);
}

/** Lines whose audio would give the game away live under unguessable names; attach their paths. */
function withAudio(caseId: string, s: CaseSecret, l: NarrationLine): NarrationLine {
  const f = s.audio[l.id];
  return f ? { ...l, src: `/cases/${caseId}/narration/${f}.mp3` } : l;
}

export function check(caseId: string, round: number, choice: string): CheckResult | null {
  const s = caseSecret(caseId);
  const r = s?.rounds[round];
  if (!s || !r) return null;
  if (r.answer !== choice) return { correct: false };
  return { correct: true, answer: r.answer, explanation: r.explanation, token: token(caseId, round) };
}

/** After three wrong tries the table may give up on a round: the answer is shown and the round closes. */
export function skip(caseId: string, round: number): CheckResult | null {
  const s = caseSecret(caseId);
  const r = s?.rounds[round];
  if (!s || !r) return null;
  return { correct: false, answer: r.answer, explanation: r.explanation, token: token(caseId, round) };
}

export function hint(caseId: string, round: number, level: number): HintResult | null {
  const s = caseSecret(caseId);
  const r = s?.rounds[round];
  if (!s || !r || level < 1 || level > 3) return null;
  const voice = s.hintVoice[round]?.[level - 1];
  return { text: r.hints[level - 1], voice: voice ? withAudio(caseId, s, voice) : undefined };
}

export type Vote = { suspect: string; method: string; motive: string };

export function verdict(caseId: string, vote: Vote, tokens: Record<string, unknown>): CaseResult | "locked" | null {
  const s = caseSecret(caseId);
  if (!s) return null;
  const rounds = Object.keys(s.rounds).map(Number);
  if (!rounds.every((n) => tokenOk(caseId, n, tokens?.[n]))) return "locked";
  const sol = s.solution;
  const parts: [boolean, boolean, boolean] = [vote.suspect === sol.suspect, vote.method === sol.method, vote.motive === sol.motive];
  const right = parts.filter(Boolean).length;
  let v = "Case unsolved";
  if (right === 3) v = "Case solved";
  else if (parts[0]) v = "Right killer, wrong story";
  else if (vote.suspect === "kapoor") v = "You found the fraud. You missed the hand.";
  return {
    solution: { suspect: sol.suspect, method: sol.method, motive: sol.motive },
    proofs: sol.proofs,
    reveal: s.reveal.map((l) => withAudio(caseId, s, l)),
    parts,
    right,
    verdict: v,
  };
}
