"use client";

import { useCallback, useEffect, useState } from "react";

export type SuspectMark = "none" | "suspicious" | "cleared";

export interface Progress {
  startedAt: number | null;
  finishedAt: number | null;
  /** highest round unlocked (1-based) */
  unlocked: number;
  /** checkpoints solved, keyed by round */
  solved: Record<number, "correct" | "skipped">;
  wrongTries: Record<number, number>;
  hintsUsed: Record<number, number>;
  viewed: string[];
  starred: string[];
  notes: string;
  suspects: Record<string, SuspectMark>;
  /** narration: which script and which line */
  narration: { script: string; line: number };
  accusation: { suspect: string; method: string; motive: string } | null;
  timerEnabled: boolean;
  voice: boolean;
  roundStartedAt: Record<number, number>;
}

export const emptyProgress = (): Progress => ({
  startedAt: null,
  finishedAt: null,
  unlocked: 1,
  solved: {},
  wrongTries: {},
  hintsUsed: {},
  viewed: [],
  starred: [],
  notes: "",
  suspects: {},
  narration: { script: "briefing", line: 0 },
  accusation: null,
  timerEnabled: true,
  voice: false,
  roundStartedAt: {},
});

const key = (caseId: string) => `blackwood:case:${caseId}`;

export function loadProgress(caseId: string): Progress | null {
  try {
    const raw = localStorage.getItem(key(caseId));
    if (!raw) return null;
    return { ...emptyProgress(), ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function saveProgress(caseId: string, p: Progress) {
  try {
    localStorage.setItem(key(caseId), JSON.stringify(p));
  } catch {
    /* storage unavailable: play continues in memory */
  }
}

export function clearProgress(caseId: string) {
  try {
    localStorage.removeItem(key(caseId));
  } catch {}
}

export function useProgress(caseId: string) {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p = loadProgress(caseId) ?? emptyProgress();
    if (!p.startedAt) {
      p.startedAt = Date.now();
      p.roundStartedAt = { 1: Date.now() };
    }
    setProgress(p);
    setReady(true);
  }, [caseId]);

  const update = useCallback(
    (fn: (p: Progress) => Progress) => {
      setProgress((prev) => {
        const next = fn(prev);
        saveProgress(caseId, next);
        return next;
      });
    },
    [caseId]
  );

  return { progress, update, ready };
}

export function caseStatus(caseId: string): "New" | "In progress" | "Solved" {
  const p = loadProgress(caseId);
  if (!p || !p.startedAt) return "New";
  if (p.finishedAt) return "Solved";
  return "In progress";
}
