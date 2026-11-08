export type FileType = "document" | "photo" | "statement" | "audio" | "record" | "map" | "chat";

export interface EvidenceFile {
  id: string;
  exhibit: number;
  name: string; // e.g. "Police inquest report.pdf"
  type: FileType;
  date: string; // in-story date
  /** Plain-text transcript, used for audio playback and for search in notes */
  transcript?: string;
}

export interface Choice {
  id: string;
  label: string;
}

export interface Round {
  number: number;
  title: string;
  envelope: string;
  minutes: number;
  files: EvidenceFile[];
  /** the answer, its explanation and the hints are server-side (lib/server); see CheckResult */
  checkpoint: {
    question: string;
    choices: Choice[];
  };
}

export interface NarrationLine {
  id: string; // e.g. "R2-03"
  speaker?: string;
  text: string;
  /** audio path when it is not the default /cases/<id>/narration/<id>.mp3 (server-issued lines) */
  src?: string;
  /** a still shown in the empty viewer while this line is read (briefing), under /public */
  image?: string;
}

/** What the server says about a checkpoint answer. `token` proves the round was closed, for the verdict. */
export interface CheckResult {
  correct: boolean;
  answer?: string;
  explanation?: string;
  token?: string;
}

/** A hint handed out by the server: the words on screen and the narrator's casual version. */
export interface HintResult {
  text: string;
  voice?: NarrationLine;
}

/** Everything the reveal and the report card need, issued by the server after the accusation. */
export interface CaseResult {
  solution: { suspect: string; method: string; motive: string };
  proofs: { clue: string; exhibit: number }[];
  reveal: NarrationLine[];
  parts: [boolean, boolean, boolean];
  right: number;
  verdict: string;
  /** the precise questions asked after the accusation: whether each was right, and the right choice */
  details?: { id: string; correct: boolean; answer: string }[];
}

/** what the player has (not) done when a quiet spell triggers a nudge */
export type NudgeKind = "noFile" | "unread" | "answer" | "stuck" | "accuse";

export interface Suspect {
  id: string;
  name: string;
  role: string;
  age: number;
  note: string;
}

export interface CaseFile {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  genre: string;
  players: string;
  playTime: string;
  price: string;
  dateOpened: string;
  location: string;
  summary: string;
  suspects: Suspect[];
  rounds: Round[];
  narration: {
    briefing: NarrationLine[];
    /** lines played when round N unlocks (keyed by round number) */
    rounds: Record<number, NarrationLine[]>;
    accusation: NarrationLine[];
    /** casual nudges spoken after a quiet spell, chosen by situation */
    nudges: Record<NudgeKind, NarrationLine[]>;
  };
  accusation: {
    methods: Choice[];
    motives: Choice[];
    /** precise questions asked once who, how and why are locked; answers live on the server */
    details?: { id: string; q: string; choices: Choice[] }[];
  };
}

export interface ShelfEntry {
  number: string;
  title: string;
  genre: string;
  status: "available" | "sealed";
  id?: string;
}
