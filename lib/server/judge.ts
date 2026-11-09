import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import type { CaseResult, CheckResult, HintResult, NarrationLine } from "@/lib/types";
import { case017, type CaseSecret } from "./case-017";
import { interviews017, type Interview } from "./interviews-017";
import { cases } from "@/lib/cases/hollow-pines";

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

export type Vote = { suspect: string; method: string; motive: string; details?: Record<string, string> };

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
    details: Object.entries(s.details ?? {}).map(([id, answer]) => ({ id, answer, correct: vote.details?.[id] === answer })),
  };
}

/* ---------- interviews ---------- */
const INTERVIEWS: Record<string, Record<string, Interview>> = { "017": interviews017 };

/**
 * What a person says about a topic: "p:<person>" or "e:<exhibit>". An exhibit can only be shown once its folder is
 * open, proven by the token of the round before it.
 */
export function ask(caseId: string, who: string, topic: string, tokens: Record<string, unknown>): { text: string; known: boolean } | "locked" | null {
  const iv = INTERVIEWS[caseId]?.[who];
  const c = cases[caseId];
  if (!iv || !c) return null;
  if (topic.startsWith("e:")) {
    const n = Number(topic.slice(2));
    const round = c.rounds.find((r) => r.files.some((f) => f.exhibit === n));
    if (!round) return null;
    if (round.number > 1 && !tokenOk(caseId, round.number - 1, tokens?.[round.number - 1])) return "locked";
  } else if (!topic.startsWith("p:")) return null;
  const said = iv.topics[topic];
  if (said) return { text: said, known: true };
  // a steady fallback for the same topic, so asking twice gives the same answer
  const h = [...topic].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) | 0, 7);
  return { text: iv.fallback[Math.abs(h) % iv.fallback.length], known: false };
}

export const interviewIntro = (caseId: string, who: string) => {
  const t = INTERVIEWS[caseId]?.[who]?.intro;
  return t ? { text: t } : null;
};

/** the newest folder this player has opened, proven by consecutive round tokens */
function openedUpTo(caseId: string, tokens: Record<string, unknown>) {
  const c = cases[caseId];
  let n = 1;
  while (c && n < c.rounds.length && tokenOk(caseId, n, tokens?.[n])) n++;
  return n;
}

/* ---------- race-mode theories ---------- */
/**
 * A racer puts who/how/why to the Bureau. The answer rules out one wrong part with an exhibit the racer can already
 * read (who first, then how, then why). If nothing in the open folders rules anything out, the answer is the same
 * whether the theory is right or not, so it can never be used to test for the solution.
 */
export function theory(caseId: string, vote: Vote, tokens: Record<string, unknown>): { part: "suspect" | "method" | "motive" | null; exhibit?: number; text: string } | null {
  const s = caseSecret(caseId);
  if (!s?.disproof) return null;
  const upTo = openedUpTo(caseId, tokens);
  // a method or motive that no open folder has raised yet cannot be put to the Bureau
  const c = cases[caseId];
  const early = (list: { id: string; from?: number }[], id: string) => (list.find((x) => x.id === id)?.from ?? 1) > upTo;
  if (c && (early(c.accusation.methods, vote.method) || early(c.accusation.motives, vote.motive)))
    return { part: null, text: "That line of enquiry has not come up in your folders yet." };
  const parts: ["suspect" | "method" | "motive", string][] = [
    ["suspect", `s:${vote.suspect}`],
    ["method", `m:${vote.method}`],
    ["motive", `w:${vote.motive}`],
  ];
  const sol = s.solution;
  for (const [part, key] of parts) {
    const right = key === `s:${sol.suspect}` || key === `m:${sol.method}` || key === `w:${sol.motive}`;
    const d = s.disproof[key];
    if (!right && d && d.round <= upTo) return { part, exhibit: d.exhibit, text: d.text };
  }
  return { part: null, text: "Nothing in the folders you have opened rules this out. That is not the same as proof." };
}
