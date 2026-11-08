import "server-only";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import type { CaseResult, CheckResult, HintResult, NarrationLine } from "@/lib/types";
import { case017, type CaseSecret } from "./case-017";
import { interviews017, type Interview } from "./interviews-017";
import { search017 } from "./search-017";
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
/** recorded interview lines live under names nobody can guess from the topic (see reel/scripts/interviews/gen.py) */
const ivAudio = (caseId: string, who: string, key: string) =>
  `/cases/${caseId}/interviews/${createHash("sha256").update(`iv${caseId}:${who}|${key}`).digest("hex").slice(0, 16)}.mp3`;

export function ask(caseId: string, who: string, topic: string, tokens: Record<string, unknown>): { text: string; known: boolean; src: string } | "locked" | null {
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
  if (said) return { text: said, known: true, src: ivAudio(caseId, who, topic) };
  // a steady fallback for the same topic, so asking twice gives the same answer
  const h = [...topic].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) | 0, 7);
  const i = Math.abs(h) % iv.fallback.length;
  return { text: iv.fallback[i], known: false, src: ivAudio(caseId, who, `fb:${i}`) };
}

export const interviewIntro = (caseId: string, who: string) => {
  const t = INTERVIEWS[caseId]?.[who]?.intro;
  return t ? { text: t, src: ivAudio(caseId, who, "intro") } : null;
};

/* ---------- searching the house ---------- */
const SEARCHES: Record<string, Record<string, { round: number; text: string }[]>> = { "017": search017 };

/** the newest folder this player has opened, proven by consecutive round tokens */
function openedUpTo(caseId: string, tokens: Record<string, unknown>) {
  const c = cases[caseId];
  let n = 1;
  while (c && n < c.rounds.length && tokenOk(caseId, n, tokens?.[n])) n++;
  return n;
}

/** The next finding in a room that this player has not found yet and may see now; index -1 when there is none. */
export function search(caseId: string, room: string, found: number[], tokens: Record<string, unknown>): { index: number; text: string } | null {
  const list = SEARCHES[caseId]?.[room];
  if (!list) return null;
  const upTo = openedUpTo(caseId, tokens);
  const i = list.findIndex((f, k) => f.round <= upTo && !found.includes(k));
  if (i < 0) return { index: -1, text: "You go over the room again, slowly. Nothing new turns up, for now." };
  return { index: i, text: list[i].text };
}
