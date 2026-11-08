import type { CaseFile, CaseResult, CheckResult, NarrationLine } from "../types";

export type Vote = { suspect: string; method: string; motive: string; details?: Record<string, string> };
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
  /** minutes on the investigation clock: questions, searches, hints and wrong answers cost time */
  spent?: number;
  /** party rooms: "classic" solves one case together; "race" gives every player their own case and a winner */
  play?: "classic" | "race";
  /** race standings, one entry per player, reported by each player's own case */
  race?: Record<string, RaceEntry>;
  /** the first player to close the case correctly */
  winner?: string | null;
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
  /** answers and explanations of closed rounds, as issued by the server */
  answers?: Record<number, { answer: string; explanation: string }>;
  /** server-signed proof that each round was closed; the verdict is only issued against all of them */
  tokens?: Record<number, string>;
  /** the solution, the reveal and the score, issued by the server after the accusation */
  result?: CaseResult | null;
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
  /** hint texts this device has been given, keyed "<round>-<level>" */
  hintTexts?: Record<string, string>;
  voice: boolean;
  /** newest table-chat message this device has seen */
  chatReadAt?: number;
  /** set once the briefing has reached its last line: its photos never play again and folder 1 stays open */
  briefed?: boolean;
  /** the deduction grid: "s:<suspect>", "m:<method>", "w:<motive>" -> mark */
  grid?: Record<string, GridMark>;
  /** interview answers this device has heard, keyed "<person>|<topic>", in the order they were asked */
  interviews?: Record<string, string>;
  /** what this device has found searching the house: room -> finding indexes, and "room:index" -> text */
  searched?: Record<string, number[]>;
  findings?: Record<string, string>;
  /** the exhibit a finding points to, same keys as findings */
  findingExhibit?: Record<string, number>;
  /** rooms searched bare, and the folder that was open at the time */
  searchedOut?: Record<string, number>;
  /** the how-to-play guide has been shown once */
  guided?: boolean;
  /** race mode: theories put to the Bureau and its answers */
  theories?: { vote: Vote; part: "suspect" | "method" | "motive" | null; exhibit?: number; text: string }[];
  /** late-clock notices already given ("8h", "midnight") */
  clockNotes?: string[];
}

export type GridMark = "out" | "maybe" | "likely";

/** where a racer stands: their open folder, their clock, and how their case ended */
export type RaceEntry = { round: number; spent: number; finishedAt?: number; correct?: boolean; rating?: number };

export const emptyPrivate = (): Private => ({ viewed: [], starred: [], notes: "", suspects: {}, hintsUsed: {}, voice: true });

export const MAX_PLAYERS = 6;

export function newShared(c: CaseFile, hostId: string, hostName: string, solo: boolean, now = Date.now()): Shared {
  const s: Shared = {
    v: 1,
    caseId: c.id,
    phase: solo ? "play" : "lobby",
    hostId,
    players: { [hostId]: { name: hostName, joinedAt: now } },
    mode: "shared",
    timerEnabled: false, // the round timer is opt-in, from Settings
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
  /** `res` is the server's judgement, fetched by the host before sending */
  | { t: "answer"; round: number; choice: string; res: CheckResult }
  | { t: "skip"; round: number; res: CheckResult }
  /** stores the server's answer/token for a round that was closed before answers moved server-side */
  | { t: "learn"; round: number; res: CheckResult }
  | { t: "unlock" }
  | { t: "hint" }
  | { t: "vote"; vote: Vote }
  | { t: "accuse"; vote: Vote; result: CaseResult }
  | { t: "reveal"; d: number }
  | { t: "kick"; id: string }
  | { t: "handover"; id: string }
  | { t: "say"; text: string }
  | { t: "suggest"; choice: string }
  | { t: "point"; fileId: string }
  | { t: "show"; fileId: string }
  /** time on the investigation clock for a question or a search */
  | { t: "spend"; min: number }
  /** lobby: classic (together) or race (everyone on their own case) */
  | { t: "setPlay"; play: "classic" | "race" }
  /** a racer's progress on their own case */
  | { t: "raceStatus"; round: number; spent: number }
  /** a racer closed their case; the first correct one wins */
  | { t: "raceFinish"; correct: boolean; rating: number };

/** Actions any player may send. Everything else is the host's. */
const OPEN: Action["t"][] = ["join", "hint", "vote", "say", "suggest", "point", "show", "spend", "raceStatus", "raceFinish"];

/** What each kind of work costs on the investigation clock, in minutes. */
export const COST = { question: 15, search: 20, hint: 30, wrong: 20, theory: 30 } as const;
/** race mode: theories each racer may put to the Bureau */
export const THEORIES_PER_RACE = 3;
/** The clock starts when the Bureau takes the case: Sunday 11 October 2026, 09:05. */
export const CLOCK_START = Date.UTC(2026, 9, 11, 9, 5);

export interface Ctx {
  now: number;
  /** ids currently connected, used for split assignment and name re-claim */
  online: string[];
}

export function scriptLines(c: CaseFile, script: string, s?: Shared | null): NarrationLine[] {
  if (script === "briefing") return c.narration.briefing;
  if (script === "accusation") return c.narration.accusation;
  if (script === "reveal") return s?.result?.reveal ?? [];
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
      const n = scriptLines(c, s.narration.script, s).length;
      const line = Math.max(0, Math.min(n - 1, s.narration.line + a.d));
      return line === s.narration.line ? s : bump({ narration: { ...s.narration, line } });
    }
    case "answer": {
      if (s.phase !== "play" || a.round !== s.unlocked || s.solved[a.round]) return s;
      const r = c.rounds.find((x) => x.number === a.round);
      if (!r || !r.checkpoint.choices.some((ch) => ch.id === a.choice)) return s;
      const correct = !!a.res?.correct;
      const lastAnswer = { round: a.round, choice: a.choice, correct, at: ctx.now };
      if (!correct) return bump({ lastAnswer, wrongTries: { ...s.wrongTries, [a.round]: (s.wrongTries[a.round] ?? 0) + 1 }, spent: (s.spent ?? 0) + COST.wrong });
      const final = a.round === lastRound(c);
      return bump({
        lastAnswer,
        solved: { ...s.solved, [a.round]: "correct" },
        ...learned(s, a.round, a.res),
        narration: final ? { script: "accusation", line: 0 } : s.narration,
      });
    }
    case "skip": {
      if (s.phase !== "play" || a.round !== s.unlocked || s.solved[a.round] || (s.wrongTries[a.round] ?? 0) < 3 || !a.res?.answer) return s;
      const final = a.round === lastRound(c);
      return bump({
        lastAnswer: null,
        solved: { ...s.solved, [a.round]: "skipped" },
        ...learned(s, a.round, a.res),
        narration: final ? { script: "accusation", line: 0 } : s.narration,
      });
    }
    case "learn":
      return s.solved[a.round] && a.res?.answer && !s.tokens?.[a.round] ? bump(learned(s, a.round, a.res)) : s;
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
      return bump({ hints: { ...s.hints, [actor]: (s.hints[actor] ?? 0) + 1 }, spent: (s.spent ?? 0) + COST.hint });
    case "setPlay":
      return s.phase === "lobby" && (s.play ?? "classic") !== a.play ? bump({ play: a.play }) : s;
    case "raceStatus": {
      const cur = s.race?.[actor];
      if (s.play !== "race" || s.phase !== "play" || !s.players[actor] || cur?.finishedAt) return s;
      const round = Math.max(1, Math.min(c.rounds.length, Math.round(a.round)));
      const spent = Math.max(0, Math.round(a.spent));
      if (cur && cur.round === round && cur.spent === spent) return s;
      return bump({ race: { ...(s.race ?? {}), [actor]: { ...(cur ?? {}), round, spent } } });
    }
    case "raceFinish": {
      const cur = s.race?.[actor];
      if (s.play !== "race" || s.phase !== "play" || !s.players[actor] || cur?.finishedAt) return s;
      const entry: RaceEntry = { round: c.rounds.length, spent: cur?.spent ?? 0, ...cur, finishedAt: ctx.now, correct: a.correct, rating: Math.max(0, Math.min(100, Math.round(a.rating))) };
      return bump({ race: { ...(s.race ?? {}), [actor]: entry }, winner: s.winner ?? (a.correct ? actor : null) });
    }
    case "spend":
      if (s.phase !== "play" || s.finishedAt || !s.players[actor]) return s;
      return bump({ spent: (s.spent ?? 0) + Math.max(0, Math.min(60, Math.round(a.min))) });
    case "vote": {
      if (!s.players[actor] || s.finishedAt || !allSolved(c, s)) return s;
      return bump({ votes: { ...s.votes, [actor]: a.vote } });
    }
    case "accuse": {
      if (s.finishedAt || !allSolved(c, s) || !a.result?.reveal?.length) return s;
      return bump({ accusation: a.vote, result: a.result, finishedAt: ctx.now, revealStep: 0, narration: { script: "reveal", line: 0 } });
    }
    case "reveal": {
      if (!s.finishedAt) return s;
      const n = s.result?.reveal.length ?? 0;
      const step = Math.max(0, Math.min(n, s.revealStep + a.d));
      return step === s.revealStep ? s : bump({ revealStep: step, narration: { script: "reveal", line: Math.min(step, n - 1) } });
    }
  }
}

/** what a closed round adds to the shared state: its answer for display and its token for the verdict */
function learned(s: Shared, round: number, res: CheckResult): Partial<Shared> {
  const out: Partial<Shared> = {};
  if (res.answer) out.answers = { ...(s.answers ?? {}), [round]: { answer: res.answer, explanation: res.explanation ?? "" } };
  if (res.token) out.tokens = { ...(s.tokens ?? {}), [round]: res.token };
  return out;
}
