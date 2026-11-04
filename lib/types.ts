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
  checkpoint: {
    question: string;
    choices: Choice[];
    answer: string;
    explanation: string;
  };
  hints: [string, string, string];
}

export interface NarrationLine {
  id: string; // e.g. "R2-03"
  speaker?: string;
  text: string;
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
    reveal: NarrationLine[];
    /** casual spoken versions of each round's three hints (id H-<round>-<n>), read when a hint is revealed */
    hints: Record<number, NarrationLine[]>;
    /** casual nudges spoken after a quiet spell, chosen by situation */
    nudges: Record<NudgeKind, NarrationLine[]>;
  };
  accusation: {
    methods: Choice[];
    motives: Choice[];
  };
  solution: {
    suspect: string;
    method: string;
    motive: string;
    proofs: { clue: string; exhibit: number }[];
  };
}

export interface ShelfEntry {
  number: string;
  title: string;
  genre: string;
  status: "available" | "sealed";
  id?: string;
}
