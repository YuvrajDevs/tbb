import "server-only";
import type { NarrationLine } from "@/lib/types";

/*
 * CASE 017 — server-only. Answers, hints, the solution and the reveal never ship in the page code; the
 * API routes in app/api/cases/[id]/ hand them out one checkpoint at a time.
 *
 * Writer's bible:
 *  - Killer: Meera Rathore, born Nisha Meera Kapoor, former ICU sister, younger sister of Dr. Anand Kapoor.
 *  - Anand and Meera ran a ₹1.84 crore fraud on the Rathore Trust through a sham lab, Kapoor Diagnostics LLP.
 *  - Vikram found it and booked his lawyer for Monday. Meera opened the lawyer's letter and resealed it.
 *  - Anand drew the potassium chloride and handed Meera a filled syringe in the hall at ~21:00.
 *  - Anand left at 21:40 (truth). The gate camera runs 18 min fast (set from the hut clock), so it shows 21:58.
 *  - Meera told Vikram Anand wanted a blood sample, injected KCl at ~21:42; he fell 21:44; she cancelled SOS.
 *  - 22:14 she phoned Anand from the study (Sunita's "voices"), then staged the chair and burned the ampoule.
 *  - Red herrings: Arjun (lies about the bar), Kabir (threatening email), Meera's "will" story, Anand's "lie".
 */

export interface CaseSecret {
  rounds: Record<number, { answer: string; explanation: string; hints: [string, string, string] }>;
  /** casual spoken hints, H-<round>-<n> */
  hintVoice: Record<number, NarrationLine[]>;
  reveal: NarrationLine[];
  solution: { suspect: string; method: string; motive: string; proofs: { clue: string; exhibit: number }[] };
  /** answers to the precise report questions (CaseFile.accusation.details) */
  details?: Record<string, string>;
  /** race-mode theories: for each wrong option ("s:", "m:", "w:" + id), the exhibit that rules it out and its round */
  disproof?: Record<string, { exhibit: number; round: number; text: string }>;
  /** narration files that would give answers away are stored under unguessable names */
  audio: Record<string, string>;
}

export const case017: CaseSecret = {
  "rounds": {
    "1": {
      "answer": "b",
      "explanation": "His watch registers a hard fall at 21:44 and loses his pulse at 21:48, while still strapped to his wrist. Rigor was already full at 08:15. Whatever Sunita heard at a quarter past ten, it was not Vikram.",
      "hints": [
        "Dr. Kapoor's estimate is an opinion. Look for something in the room that recorded the night as it happened.",
        "Read the smartwatch export line by line. Then ask what the police found switched on in the study.",
        "The watch loses his pulse at 21:48. He died at about 9:45 PM. The 'voices' at 10:15 came from someone or something else."
      ]
    },
    "2": {
      "answer": "kapoor",
      "explanation": "Dr. Kapoor says he let himself out at about 9:40. The camera has his car leaving at 21:58, ten minutes after Vikram's pulse stopped. One of them is wrong.",
      "hints": [
        "Everyone tells you when they arrived and when they left. Check each of them against something that keeps time.",
        "Put Dr. Kapoor's statement next to the main gate CCTV register.",
        "Dr. Kapoor says 9:40 PM. The camera says his car left at 21:58. It is his account the camera contradicts."
      ]
    },
    "3": {
      "answer": "c",
      "explanation": "A fresh puncture in the vein at the left elbow, raised potassium at that site, a burnt ampoule of potassium chloride in the grate, and two such ampoules drawn from the hospital on Friday.",
      "hints": [
        "A weekly vitamin shot goes into the muscle. Count the marks on the body.",
        "Read the post-mortem's external findings, then the fireplace evidence tag and the dispensary register together.",
        "A vein puncture, high potassium, a potassium chloride ampoule in the grate. He was injected with potassium chloride."
      ]
    },
    "4": {
      "answer": "c",
      "explanation": "Advocate Mehta's letter confirms an 11 AM meeting on Monday about irregular payments out of the Trust, and tells Vikram to say nothing to the trustee who approved them. The will was never going to change.",
      "hints": [
        "Three people feared Monday for three different reasons. Only one document says what Monday was actually about.",
        "The letter Meera hid is not about the will. Read it alongside the bank statement Vikram marked up.",
        "Monday at 11 AM: Advocate Mehta, about ₹1.84 crore paid by the Trust to Kapoor Diagnostics LLP."
      ]
    },
    "5": {
      "answer": "b",
      "explanation": "The recorder's clock was set by hand from the guard hut's wall clock after Friday's power cut, and runs 18 minutes fast. Dr. Kapoor's car left at 21:40 — four minutes before Vikram fell. He told the truth about the one thing everyone thought he lied about.",
      "hints": [
        "The gate camera has seemed right about everything so far. Has it?",
        "Compare the camera's time for the police jeep with the inquest report, and its time for Dr. Kapoor's morning arrival with the time written on his note.",
        "The recorder runs 18 minutes fast. Take 18 minutes off 21:58."
      ]
    }
  },
  "hintVoice": {
    "1": [
      {
        "id": "H-1-1",
        "text": "Here's a thought. Dr. Kapoor's estimate is just his opinion. Is there anything in that room that actually recorded the night as it happened?"
      },
      {
        "id": "H-1-2",
        "text": "Okay, try this. Go through the smartwatch export line by line. Then ask yourself what the police found switched on in the study."
      },
      {
        "id": "H-1-3",
        "text": "Alright, here it is. The watch loses his pulse at twenty-one forty-eight, so he died at about a quarter to ten. Those voices at ten fifteen came from someone, or something, else."
      }
    ],
    "2": [
      {
        "id": "H-2-1",
        "text": "Little nudge. Everyone's telling you when they arrived and when they left. Check each of them against something that keeps time."
      },
      {
        "id": "H-2-2",
        "text": "Put Dr. Kapoor's statement right next to the gate camera register. Go on."
      },
      {
        "id": "H-2-3",
        "text": "Fine, I'll say it. Dr. Kapoor says he left at nine forty. The camera says twenty-one fifty-eight. His is the account the camera contradicts."
      }
    ],
    "3": [
      {
        "id": "H-3-1",
        "text": "Think about it. A weekly vitamin shot goes into the muscle. So, count the marks on the body."
      },
      {
        "id": "H-3-2",
        "text": "Read the external findings in the post-mortem. Then the fireplace evidence tag, and the dispensary register, all together."
      },
      {
        "id": "H-3-3",
        "text": "Here's the answer. A puncture in the vein, high potassium, and a potassium chloride ampoule in the grate. He was injected with potassium chloride."
      }
    ],
    "4": [
      {
        "id": "H-4-1",
        "text": "Funny thing. Three people were dreading Monday, for three different reasons. Only one document says what Monday was actually about."
      },
      {
        "id": "H-4-2",
        "text": "That letter Meera hid? It's not about the will. Read it alongside the bank statement Vikram marked up."
      },
      {
        "id": "H-4-3",
        "text": "Okay. Monday, eleven in the morning, with Advocate Mehta. About one crore, eighty-four lakh rupees the Trust paid to Kapoor Diagnostics."
      }
    ],
    "5": [
      {
        "id": "H-5-1",
        "text": "The gate camera's been right about everything so far. Hasn't it? Hmm. Has it?"
      },
      {
        "id": "H-5-2",
        "text": "Compare the camera's time for the police jeep with the inquest report. Then its time for Dr. Kapoor's morning arrival, with the time on his note."
      },
      {
        "id": "H-5-3",
        "text": "Here you go. The recorder runs eighteen minutes fast. Take eighteen minutes off twenty-one fifty-eight."
      }
    ]
  },
  "reveal": [
    {
      "id": "V-01",
      "text": "Friday afternoon. The power fails across Camel's Back Road. When it returns, the chowkidar sets the gate camera's clock by the old wall clock in his hut. That clock runs eighteen minutes fast. Nobody notices."
    },
    {
      "id": "V-02",
      "text": "Saturday, eight fifty-two. Dr. Anand Kapoor arrives for his weekly visit. In the hall, Meera comes down to greet him. Something passes from his bag to her hand: a syringe, already filled."
    },
    {
      "id": "V-03",
      "text": "Anand takes Vikram's blood pressure, gives the vitamin shot into the shoulder, and leaves at 9:40, exactly as he said. The camera writes 21:58. The one thing he told the truth about was the thing that made him look guilty."
    },
    {
      "id": "V-04",
      "text": "Two minutes later, Meera knocks on the study door. Anand wants a blood sample before Monday, she says. She was an ICU sister for four years. Her husband rolls up his sleeve."
    },
    {
      "id": "V-05",
      "text": "Potassium chloride, into the vein at the elbow. At 9:44 his heart stumbles and he falls against the side table. His watch asks if he needs help. His wife taps: I'm OK."
    },
    {
      "id": "V-06",
      "text": "At a quarter past ten, Sunita hears a voice in the study, low, like someone on the phone. It is not the radio. It is Meera, calling the only number she can. Bhaiya. Brother."
    },
    {
      "id": "V-07",
      "text": "Put him in the chair. Glasses in his lap. Glass in the fire. I will write it up in the morning."
    },
    {
      "id": "V-08",
      "text": "Meera Rathore was born Nisha Meera Kapoor. The second partner in Kapoor Diagnostics LLP was never Anand's wife. It was his sister. One crore, eighty-four lakh rupees, from the Trust her husband chaired."
    },
    {
      "id": "V-09",
      "text": "On Thursday she steamed open a lawyer's letter, read the words 'criminal breach of trust', and glued it shut again. She told you she thought it was about the will."
    },
    {
      "id": "V-10",
      "text": "In the morning Anand wrote 'one o'clock' and 'cardiac', and begged the family to be spared a post-mortem. On Wednesday he confessed to fraud rather than let you look at his sister."
    },
    {
      "id": "V-11",
      "text": "Arjun hid a bar tab. Kabir feared a Monday that was never about him. Vikram wrote 'Thirty years' beside the name of the man he suspected. He never suspected the woman who filled his pill box every Sunday."
    },
    {
      "id": "V-12",
      "text": "Case No. 017 is closed."
    }
  ],
  "solution": {
    "suspect": "meera",
    "method": "kcl",
    "motive": "fraud",
    "proofs": [
      {
        "clue": "The watch logs a hard fall at 21:44, an SOS cancelled by a tap at 21:45 and no pulse from 21:48. Someone was standing beside him.",
        "exhibit": 5
      },
      {
        "clue": "A vein puncture at the left elbow and raised potassium: an intravenous injection of potassium chloride, from ampoules Dr. Kapoor drew on Friday.",
        "exhibit": 16
      },
      {
        "clue": "The gate recorder runs 18 minutes fast: the police jeep shows 08:21 against an arrival of 08:05; Dr. Kapoor 'arrives' at 07:56 but wrote his note at 07:50.",
        "exhibit": 28
      },
      {
        "clue": "So Dr. Kapoor left at 21:40, before the fall. The chowkidar's own book says 9.40.",
        "exhibit": 29
      },
      {
        "clue": "Meera, 'asleep since 9.30', made a six-minute call from Hollow Pines at 22:14 — the 'voices' Sunita heard.",
        "exhibit": 32
      },
      {
        "clue": "She called 'Bhaiya' on +91 94120 51187: Dr. Kapoor's number. Sunanda Kapoor saw him take that call in the garden.",
        "exhibit": 30
      },
      {
        "clue": "Meera is Nisha Meera Kapoor, Dr. Kapoor's sister, a former ICU sister certified to give intravenous drugs.",
        "exhibit": 33
      },
      {
        "clue": "Nisha M. Kapoor is the second partner in Kapoor Diagnostics LLP, which took ₹1.84 crore from the Trust.",
        "exhibit": 24
      },
      {
        "clue": "The lawyer's letter had been slit open and glued shut: Meera knew exactly what Monday was about.",
        "exhibit": 23
      }
    ]
  },
  "details": { "source": "hospital", "phone": "study", "voices": "meera-call", "letter": "steamed", "pair": "meera-kapoor" },
  "disproof": {
    "s:arjun": { "exhibit": 19, "round": 3, "text": "Arjun was drinking at the Clocktower Bar until nearly midnight. He was not in the house when Vikram died." },
    "s:kabir": { "exhibit": 15, "round": 2, "text": "Kabir's calls that night come from a tower in Dehradun. He was at the sangeet, an hour away." },
    "s:kapoor": { "exhibit": 28, "round": 5, "text": "The gate recorder runs eighteen minutes fast. Dr. Kapoor's car really left at 21:40, before Vikram fell." },
    "s:sunita": { "exhibit": 16, "round": 3, "text": "The fatal dose went into a vein at the elbow, the work of a trained hand. Sunita has no such training." },
    "m:sleep": { "exhibit": 16, "round": 3, "text": "The post-mortem finds no zolpidem, benzodiazepines or alcohol in his blood. Nothing put him to sleep." },
    "m:smother": { "exhibit": 16, "round": 3, "text": "The post-mortem gives the cause of death as a potassium injection into a vein, not suffocation." },
    "m:digoxin": { "exhibit": 16, "round": 3, "text": "The post-mortem finds his heart medicines, metoprolol and apixaban, at ordinary therapeutic levels. No overdose." },
    "m:natural": { "exhibit": 5, "round": 1, "text": "His watch logs a hard fall, an SOS cancelled by a tap, then no pulse. Someone was standing beside him." },
    "w:will": { "exhibit": 26, "round": 4, "text": "The will had not changed and was not going to: nobody gained by killing him before Monday." },
    "w:debt": { "exhibit": 22, "round": 4, "text": "The money that mattered was not a loan. It was the Trust's, paid out to a laboratory." },
    "w:land": { "exhibit": 23, "round": 4, "text": "The lawyer's letter shows Monday's meeting was about the Trust's payments, not the land." },
    "w:grudge": { "exhibit": 6, "round": 1, "text": "By her own account, and everyone else's, Vikram was fair to Sunita and paid her son's school fees." }
  },
  "audio": {
    "V-01": "V-01.50b47098a573",
    "V-02": "V-02.43084ae28908",
    "V-03": "V-03.939ce51b2a0b",
    "V-04": "V-04.ddb42572871c",
    "V-05": "V-05.bae4515c889b",
    "V-06": "V-06.e95ce4429456",
    "V-07": "V-07.fe0edf30ecf0",
    "V-08": "V-08.964ec0af6e07",
    "V-09": "V-09.963bab73aa24",
    "V-10": "V-10.594d578a27ab",
    "V-11": "V-11.5e1538e41845",
    "V-12": "V-12.bc172b6e92f0",
    "H-1-1": "H-1-1.3e3bd153c107",
    "H-1-2": "H-1-2.6dfb6883ce8d",
    "H-1-3": "H-1-3.47bf0c363c95",
    "H-2-1": "H-2-1.9d76b5a66abb",
    "H-2-2": "H-2-2.ad9c04b07aeb",
    "H-2-3": "H-2-3.852cee2ccbb6",
    "H-3-1": "H-3-1.9fbdb43f4f11",
    "H-3-2": "H-3-2.591056cc983b",
    "H-3-3": "H-3-3.b18869916da1",
    "H-4-1": "H-4-1.8b2d104067d8",
    "H-4-2": "H-4-2.69b6e811ba2b",
    "H-4-3": "H-4-3.6e8325cd1692",
    "H-5-1": "H-5-1.212a95321989",
    "H-5-2": "H-5-2.5e1dbc1a5c3b",
    "H-5-3": "H-5-3.5182db5149d4"
  }
};
