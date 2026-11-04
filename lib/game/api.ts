"use client";

import type { CaseResult, CheckResult, HintResult } from "../types";
import type { Vote } from "./state";

/** Talks to /api/cases/<id>. The answers, hints and solution only ever come from here. */
async function post<T>(caseId: string, body: Record<string, unknown>): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`/api/cases/${caseId}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      if (r.ok) return (await r.json()) as T;
      if (r.status < 500) throw new Error((await r.json().catch(() => ({})))?.error ?? `HTTP ${r.status}`);
      lastErr = new Error(`HTTP ${r.status}`);
    } catch (e) {
      lastErr = e;
      if (e instanceof Error && !/fetch|network|HTTP 5/i.test(e.message)) throw e;
    }
    await new Promise((res) => setTimeout(res, 600 * (i + 1)));
  }
  throw lastErr instanceof Error ? lastErr : new Error("The Bureau could not be reached");
}

export const checkAnswer = (caseId: string, round: number, choice: string) => post<CheckResult>(caseId, { op: "check", round, choice });
export const skipRound = (caseId: string, round: number) => post<CheckResult>(caseId, { op: "skip", round });
export const fetchHint = (caseId: string, round: number, level: number) => post<HintResult>(caseId, { op: "hint", round, level });
export const fetchVerdict = (caseId: string, vote: Vote, tokens: Record<number, string>) =>
  post<CaseResult>(caseId, { op: "verdict", vote, tokens });
