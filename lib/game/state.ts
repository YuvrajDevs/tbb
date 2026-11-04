import type { CaseFile, NarrationLine } from "../types";

export type Vote = { suspect: string; method: string; motive: string };
export type Player = { name: string; joinedAt: number };

/** State everyone in a room shares. In solo the one device is the host. */
export interface Shared {
  v: number;
  caseId: string;
  phase: "lobby" | "play";
  hostId: string;
  players: Record<string, Player>;
  mode: "shared" | "split";
  timerEnabled: boolean;
  startedAt: number | null;
  unlocked: number;
  solved: Record<number, "correct" | "skipped">;
  wrongTries: Record<number, number>;
  lastAnswer: { round: number; choice: string; correct: boolean; at: number } | null;
  roundStartedAt: Record<number, number>;
  narration: { script: string; line: number };
  /** split mode: fileId -> playerId */
  assign: Record<string, string>;
  /** hints used per player (for the report card) */
  hints: Record<string, number>;
  votes: Record<string, Vote>;
  accusation: Vote | null;
  finishedAt: number | null;
  /** 0..reveal.length; reveal.length means the report card is showing */
  revealStep: number;
  /** removed by the host; their join requests are ignored */
  kicked?: string[];
  /** last intent sequence applied per player (dedupes retries) */
  seq?: Record<string, number>;
  /** table chat, newest last, capped */
  chat?: ChatMsg[];
  /** players' suggested checkpoint answers for the current round */
  suggest?: Record<string, string>;
  /** "look at this": last exhibit someone pointed the table to */
  pointer?: { by: string; fileId: string; at: number } | null;
  /** split mode: files a holder has shown to everyone */
  shown?: string[];
}

export type ChatMsg = { id: string; by: string; text: string; at: number };
export const CHAT_MAX = 60;

export type SuspectMark = "none" | "suspicious" | "cleared";

/** Never leaves the device. */
export interface Private {
  viewed: string[];
  starred: string[];
  notes: string;
  suspects: Record<string, SuspectMark>;
  hintsUsed: Record<number, number>;
  voice: boolean;
  /** newest table-chat message this device has seen */
  chatReadAt?: number;
}

export const emptyPrivate = (): Private => ({ viewed: [], starred: [], notes: "", suspects: {}, hintsUsed: {}, voice: false });

export const MAX_PLAYERS = 6;

export function newShared(c: CaseFile, hostId: string, hostName: string, solo: boolean, now = Date.now()): Shared {
  const s: Shared = {
    v: 1,
    caseId: c.id,
    phase: solo ? "play" : "lobby",
    hostId,
    players: { [hostId]: { name: hostName, joinedAt: now } },
    mode: "shared",
    timerEnabled: true,
    startedAt: solo ? now : null,
    unlocked: 1,
    solved: {},
    wrongTries: {},
    lastAnswer: null,
    roundStartedAt: solo ? { 1: now } : {},
    narration: { script: "briefing", line: 0 },
    assign: {},
    hints: {},
    votes: {},
    accusation: null,
    finishedAt: null,
    revealStep: 0,
  };
  return s;
}

export type Action =
  | { t: "join"; name: string }
  | { t: "start" }
  | { t: "setMode"; mode: "shared" | "split" }
  | { t: "setTimer"; on: boolean }
  | { t: "line"; d: 1 | -1 }
  | { t: "answer"; round: number; choice: string }
  | { t: "skip"; round: number }
  | { t: "unlock" }
  | { t: "hint" }
  | { t: "vote"; vote: Vote }
  | { t: "accuse"; vote: Vote }
  | { t: "reveal"; d: number }
  | { t: "kick"; id: string }
  | { t: "handover"; id: string }
  | { t: "say"; text: string }
  | { t: "suggest"; choice: string }
  | { t: "point"; fileId: string }
  | { t: "show"; fileId: string };

/** Actions any player may send. Everything else is the host's. */
const OPEN: Action["t"][] = ["join", "hint", "vote", "say", "suggest", "point", "show"];

export interface Ctx {
  now: number;
  /** ids currently connected, used for split assignment and name re-claim */
  online: string[];
}

export function scriptLines(c: CaseFile, script: string): NarrationLine[] {
  if (script === "briefing") return c.narration.briefing;
  if (script === "accusation") return c.narration.accusation;
  if (script === "reveal") return c.narration.reveal;
  const n = Number(script.replace("round-", ""));
  return c.narration.rounds[n] ?? [];
}

export const lastRound = (c: CaseFile) => c.rounds[c.rounds.length - 1].number;
export const allSolved = (c: CaseFile, s: Shared) => c.rounds.every((r) => s.solved[r.number]);

export function sortedPlayers(s: Shared, onlyIds?: string[]) {
  return Object.entries(s.players)
    .filter(([id]) => !onlyIds || onlyIds.includes(id))
    .sort((a, b) => a[1].joinedAt - b[1].joinedAt || a[0].localeCompare(b[0]))
    .map(([id]) => id);
}

function assignRound(c: CaseFile, s: Shared, round: number, online: string[]): Record<string, string> {
  const r = c.rounds.find((x) => x.number === round);
  if (!r) return s.assign;
  const ids = sortedPlayers(s, online);
  if (!ids.length) return s.assign;
  const next = { ...s.assign };
  // rotate the starting player each round so nobody always gets the first exhibit
  r.files.forEach((f, i) => (next[f.id] = ids[(i + round - 1) % ids.length]));
  return next;
}

/** Who can open a file in split mode right now. Offline holders hand their files on. */
export function holderOf(c: CaseFile, s: Shared, fileId: string, online: string[]): string | null {
  if (s.mode !== "split" || s.shown?.includes(fileId)) return null;
  const assigned = s.assign[fileId];
  if (assigned && online.includes(assigned)) return assigned;
  const ids = sortedPlayers(s, online);
  if (!ids.length) return assigned ?? null;
  const all = c.rounds.flatMap((r) => r.files.map((f) => f.id));
  return ids[all.indexOf(fileId) % ids.length];
}

/** Pure rules. Returns the same object when nothing changes. */
export function reduce(c: CaseFile, s: Shared, a: Action, actor: string, ctx: Ctx): Shared {
  const isHost = actor === s.hostId;
  if (!OPEN.includes(a.t) && !isHost) return s;
  const bump = (n: Partial<Shared>): Shared => ({ ...s, ...n, v: s.v + 1 });

  switch (a.t) {
    case "join": {
      if (s.kicked?.includes(actor)) return s;
      const name = a.name.trim().slice(0, 24) || "Detective";
      if (s.players[actor]) return s;
      // same name, offline: treat as the same person coming back on a new tab or phone
      const old = Object.entries(s.players).find(([id, p]) => p.name.toLowerCase() === name.toLowerCase() && !ctx.online.includes(id));
      if (old) {
        const [oldId, p] = old;
        const players = { ...s.players, [actor]: p };
        delete players[oldId];
        const move = <T,>(rec: Record<string, T>) => {
          if (!(oldId in rec)) return rec;
          const n = { ...rec, [actor]: rec[oldId] };
          delete n[oldId];
          return n;
        };
        const assign = Object.fromEntries(Object.entries(s.assign).map(([f, id]) => [f, id === oldId ? actor : id]));
        return bump({ players, votes: move(s.votes), hints: move(s.hints), assign, hostId: s.hostId === oldId ? actor : s.hostId });
      }
      if (Object.keys(s.players).length >= MAX_PLAYERS) return s;
      // two different people with one name: number the newcomer
      const taken = new Set(Object.values(s.players).map((p) => p.name.toLowerCase()));
      let unique = name;
      for (let n = 2; taken.has(unique.toLowerCase()); n++) unique = `${name} ${n}`;
      return bump({ players: { ...s.players, [actor]: { name: unique, joinedAt: ctx.now } } });
    }
    case "handover":
      return s.players[a.id] && a.id !== s.hostId && ctx.online.includes(a.id) ? bump({ hostId: a.id }) : s;
    case "say": {
      const text = a.text.trim().slice(0, 280);
      if (!text || !s.players[actor]) return s;
      const chat = [...(s.chat ?? []), { id: `${actor}-${ctx.now}`, by: actor, text, at: ctx.now }].slice(-CHAT_MAX);
      return bump({ chat });
    }
    case "suggest": {
      const r = c.rounds.find((x) => x.number === s.unlocked);
      if (!s.players[actor] || s.phase !== "play" || s.solved[s.unlocked] || !r?.checkpoint.choices.some((ch) => ch.id === a.choice)) return s;
      if (s.suggest?.[actor] === a.choice) return s;
      return bump({ suggest: { ...(s.suggest ?? {}), [actor]: a.choice } });
    }
    case "point": {
      const ok = c.rounds.some((r) => r.number <= s.unlocked && r.files.some((x) => x.id === a.fileId));
      if (!ok || !s.players[actor]) return s;
      return bump({ pointer: { by: actor, fileId: a.fileId, at: ctx.now } });
    }
    case "show": {
      if (s.mode !== "split" || s.shown?.includes(a.fileId)) return s;
      if (holderOf(c, s, a.fileId, ctx.online) !== actor) return s;
      return bump({ shown: [...(s.shown ?? []), a.fileId] });
    }
    case "kick": {
      if (a.id === s.hostId || !s.players[a.id]) return s;
      const players = { ...s.players };
      delete players[a.id];
      return bump({ players, kicked: [...(s.kicked ?? []), a.id] });
    }
    case "start": {
      if (s.phase !== "lobby") return s;
      const base = { ...s, phase: "play" as const, startedAt: ctx.now, roundStartedAt: { 1: ctx.now }, narration: { script: "briefing", line: 0 } };
      return bump({ ...base, assign: assignRound(c, base, 1, ctx.online) });
    }
    case "setMode":
      return s.phase === "lobby" && s.mode !== a.mode ? bump({ mode: a.mode }) : s;
    case "setTimer": {
      if (s.timerEnabled === a.on) return s;
      // restart the current round's clock when switching it back on
      return bump({ timerEnabled: a.on, roundStartedAt: a.on ? { ...s.roundStartedAt, [s.unlocked]: ctx.now } : s.roundStartedAt });
    }
    case "line": {
      const n = scriptLines(c, s.narration.script).length;
      const line = Math.max(0, Math.min(n - 1, s.narration.line + a.d));
      return line === s.narration.line ? s : bump({ narration: { ...s.narration, line } });
    }
    case "answer": {
      if (s.phase !== "play" || a.round !== s.unlocked || s.solved[a.round]) return s;
      const r = c.rounds.find((x) => x.number === a.round);
      if (!r || !r.checkpoint.choices.some((ch) => ch.id === a.choice)) return s;
      const correct = r.checkpoint.answer === a.choice;
      const lastAnswer = { round: a.round, choice: a.choice, correct, at: ctx.now };
      if (!correct) return bump({ lastAnswer, wrongTries: { ...s.wrongTries, [a.round]: (s.wrongTries[a.round] ?? 0) + 1 } });
      const final = a.round === lastRound(c);
      return bump({
        lastAnswer,
        solved: { ...s.solved, [a.round]: "correct" },
        narration: final ? { script: "accusation", line: 0 } : s.narration,
      });
    }
    case "skip": {
      if (s.phase !== "play" || a.round !== s.unlocked || s.solved[a.round] || (s.wrongTries[a.round] ?? 0) < 3) return s;
      const final = a.round === lastRound(c);
      return bump({
        lastAnswer: null,
        solved: { ...s.solved, [a.round]: "skipped" },
        narration: final ? { script: "accusation", line: 0 } : s.narration,
      });
    }
    case "unlock": {
      const next = s.unlocked + 1;
      if (!s.solved[s.unlocked] || !c.rounds.some((r) => r.number === next)) return s;
      const base = { ...s, unlocked: next };
      return bump({
        unlocked: next,
        lastAnswer: null,
        roundStartedAt: { ...s.roundStartedAt, [next]: ctx.now },
        narration: { script: `round-${next}`, line: 0 },
        assign: assignRound(c, base, next, ctx.online),
        suggest: {},
      });
    }
    case "hint":
      return bump({ hints: { ...s.hints, [actor]: (s.hints[actor] ?? 0) + 1 } });
    case "vote": {
      if (!s.players[actor] || s.finishedAt || !allSolved(c, s)) return s;
      return bump({ votes: { ...s.votes, [actor]: a.vote } });
    }
    case "accuse": {
      if (s.finishedAt || !allSolved(c, s)) return s;
      return bump({ accusation: a.vote, finishedAt: ctx.now, revealStep: 0, narration: { script: "reveal", line: 0 } });
    }
    case "reveal": {
      if (!s.finishedAt) return s;
      const n = c.narration.reveal.length;
      const step = Math.max(0, Math.min(n, s.revealStep + a.d));
      return step === s.revealStep ? s : bump({ revealStep: step, narration: { script: "reveal", line: Math.min(step, n - 1) } });
    }
  }
}

export function score(c: CaseFile, a: Vote | null) {
  const parts = a ? [a.suspect === c.solution.suspect, a.method === c.solution.method, a.motive === c.solution.motive] : [false, false, false];
  const right = parts.filter(Boolean).length;
  let verdict = "Case unsolved";
  if (right === 3) verdict = "Case solved";
  else if (parts[0]) verdict = "Right killer, wrong story";
  else if (a?.suspect === "kapoor") verdict = "You found the fraud. You missed the hand.";
  return { parts, right, verdict };
}
