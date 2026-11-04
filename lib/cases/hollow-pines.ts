import type { CaseFile, ShelfEntry } from "../types";

/*
 * CASE 017 — THE SILENCE AT HOLLOW PINES
 * Writer's bible (do not ship to players):
 *  - Killer: Meera Rathore, born Nisha Meera Kapoor, former ICU sister, younger sister of Dr. Anand Kapoor.
 *  - Anand and Meera ran a ₹1.84 crore fraud on the Rathore Trust through a sham lab, Kapoor Diagnostics LLP.
 *  - Vikram found it and booked his lawyer for Monday. Meera opened the lawyer's letter and resealed it.
 *  - Anand drew the potassium chloride and handed Meera a filled syringe in the hall at ~21:00.
 *  - Anand left at 21:40 (truth). The gate camera runs 18 min fast (set from the hut clock), so it shows 21:58.
 *  - Meera told Vikram Anand wanted a blood sample, injected KCl at ~21:42; he fell 21:44; she cancelled SOS.
 *  - 22:14 she phoned Anand from the study (Sunita's "voices"), then staged the chair and burned the ampoule.
 *  - Red herrings: Arjun (lies about the bar), Kabir (threatening email), Meera's "will" story, Anand's "lie".
 */
export const hollowPines: CaseFile = {
  id: "017",
  number: "017",
  title: "The Silence at Hollow Pines",
  subtitle: "A death in the study, a doctor at the door, and a clock that nobody checked.",
  genre: "Classic murder",
  players: "1 to 6",
  playTime: "About 2 hours",
  price: "Free",
  dateOpened: "11 October 2026",
  location: "Hollow Pines Estate, Camel's Back Road, Mussoorie, Uttarakhand",
  summary:
    "Vikram Singh Rathore, sixty-four, retired tea exporter and chairman of the Rathore Charitable Trust, was found dead in the armchair of his study on a cold Sunday morning. His family doctor called it his heart. The police are not so sure. Five people had reason to be near him that night. One of them made certain he would not live to see Monday.",
  suspects: [
    { id: "meera", name: "Meera Rathore", role: "Wife", age: 46, note: "Married to Vikram for eleven years. Was upstairs all night, she says." },
    { id: "arjun", name: "Arjun Rathore", role: "Son", age: 31, note: "From Vikram's first marriage. Owes money on a failed café." },
    { id: "kapoor", name: "Dr. Anand Kapoor", role: "Family physician", age: 59, note: "Treated Vikram for twenty years. Trustee of the Rathore Trust." },
    { id: "kabir", name: "Kabir Sethi", role: "Business partner", age: 48, note: "Developer. Wants the lower estate land for a resort." },
    { id: "sunita", name: "Sunita Negi", role: "Housekeeper", age: 52, note: "Nineteen years in service. Found the body." },
  ],
  rounds: [
    {
      number: 1,
      title: "The Morning After",
      envelope: "Envelope 1",
      minutes: 25,
      files: [
        { id: "r1-memo", exhibit: 1, name: "Bureau assignment memo.pdf", type: "document", date: "11 Oct 2026" },
        { id: "r1-inquest", exhibit: 2, name: "Police inquest report.pdf", type: "document", date: "11 Oct 2026" },
        { id: "r1-scene", exhibit: 3, name: "Scene photograph — the study.jpg", type: "photo", date: "11 Oct 2026" },
        { id: "r1-plan", exhibit: 4, name: "Ground floor plan — Hollow Pines.png", type: "map", date: "1998" },
        { id: "r1-watch", exhibit: 5, name: "Smartwatch health export.csv", type: "record", date: "10 Oct 2026" },
        { id: "r1-sunita", exhibit: 6, name: "Statement — Sunita Negi.pdf", type: "statement", date: "11 Oct 2026" },
        { id: "r1-deathnote", exhibit: 7, name: "Dr. Kapoor's note on death.pdf", type: "document", date: "11 Oct 2026" },
      ],
      checkpoint: {
        question: "What time did Vikram Rathore really die?",
        choices: [
          { id: "a", label: "Around 1:00 AM on Sunday" },
          { id: "b", label: "Around 9:45 PM on Saturday" },
          { id: "c", label: "Around 10:15 PM on Saturday" },
          { id: "d", label: "Around 11:30 PM on Saturday" },
        ],
        answer: "b",
        explanation:
          "His watch registers a hard fall at 21:44 and loses his pulse at 21:48, while still strapped to his wrist. Rigor was already full at 08:15. Whatever Sunita heard at a quarter past ten, it was not Vikram.",
      },
      hints: [
        "Dr. Kapoor's estimate is an opinion. Look for something in the room that recorded the night as it happened.",
        "Read the smartwatch export line by line. Then ask what the police found switched on in the study.",
        "The watch loses his pulse at 21:48. He died at about 9:45 PM. The 'voices' at 10:15 came from someone or something else.",
      ],
    },
    {
      number: 2,
      title: "The Household",
      envelope: "Envelope 2",
      minutes: 25,
      files: [
        { id: "r2-meera", exhibit: 8, name: "Statement — Meera Rathore.pdf", type: "statement", date: "11 Oct 2026" },
        { id: "r2-arjun", exhibit: 9, name: "Statement — Arjun Rathore.pdf", type: "statement", date: "11 Oct 2026" },
        { id: "r2-kapoor", exhibit: 10, name: "Statement — Dr. Anand Kapoor.pdf", type: "statement", date: "11 Oct 2026" },
        { id: "r2-kabir", exhibit: 11, name: "Statement — Kabir Sethi.pdf", type: "statement", date: "11 Oct 2026" },
        { id: "r2-cctvlog", exhibit: 12, name: "Main gate CCTV register.csv", type: "record", date: "10 Oct 2026" },
        { id: "r2-cctvstill", exhibit: 13, name: "CCTV still — Gate cam 1.jpg", type: "photo", date: "10 Oct 2026" },
        { id: "r2-chat", exhibit: 14, name: "Chat printout — Arjun and Vikram.pdf", type: "chat", date: "10 Oct 2026" },
        { id: "r2-calls", exhibit: 15, name: "Call log — Vikram's mobile.pdf", type: "record", date: "10 Oct 2026" },
      ],
      checkpoint: {
        question: "Whose account of the evening does the main gate camera contradict?",
        choices: [
          { id: "meera", label: "Meera Rathore" },
          { id: "arjun", label: "Arjun Rathore" },
          { id: "kapoor", label: "Dr. Anand Kapoor" },
          { id: "kabir", label: "Kabir Sethi" },
          { id: "sunita", label: "Sunita Negi" },
        ],
        answer: "kapoor",
        explanation:
          "Dr. Kapoor says he let himself out at about 9:40. The camera has his car leaving at 21:58, ten minutes after Vikram's pulse stopped. One of them is wrong.",
      },
      hints: [
        "Everyone tells you when they arrived and when they left. Check each of them against something that keeps time.",
        "Put Dr. Kapoor's statement next to the main gate CCTV register.",
        "Dr. Kapoor says 9:40 PM. The camera says his car left at 21:58. It is his account the camera contradicts.",
      ],
    },
    {
      number: 3,
      title: "What the Body Said",
      envelope: "Envelope 3",
      minutes: 25,
      files: [
        { id: "r3-pm", exhibit: 16, name: "Post-mortem report.pdf", type: "document", date: "12 Oct 2026" },
        { id: "r3-tag", exhibit: 17, name: "Evidence tag — fireplace fragment.jpg", type: "photo", date: "12 Oct 2026" },
        { id: "r3-pharmacy", exhibit: 18, name: "Hospital dispensary register.pdf", type: "record", date: "09 Oct 2026" },
        { id: "r3-receipt", exhibit: 19, name: "Receipt — Clocktower Bar.jpg", type: "record", date: "10 Oct 2026" },
        {
          id: "r3-voicemail",
          exhibit: 20,
          name: "Voicemail — Kabir Sethi, 22.11.m4a",
          type: "audio",
          date: "10 Oct 2026",
          transcript:
            "Vikram, it's Kabir. Again. Look, I know you're angry about the email. I shouldn't have written it like that. But pick up, yaar. We need to talk before Monday. Before you say anything to anyone. Call me back. Tonight, please. I'm at Pinky's sangeet, it's mad here, but I'll step out. Call me.",
        },
        { id: "r3-diary", exhibit: 21, name: "Diary page — Vikram Rathore.jpg", type: "document", date: "Oct 2026" },
      ],
      checkpoint: {
        question: "How was Vikram killed?",
        choices: [
          { id: "a", label: "A heart attack. Natural causes after all" },
          { id: "b", label: "An overdose of sleeping tablets" },
          { id: "c", label: "An injection of potassium chloride into a vein" },
          { id: "d", label: "Poison in his evening milk" },
        ],
        answer: "c",
        explanation:
          "A fresh puncture in the vein at the left elbow, raised potassium at that site, a burnt ampoule of potassium chloride in the grate, and two such ampoules drawn from the hospital on Friday.",
      },
      hints: [
        "A weekly vitamin shot goes into the muscle. Count the marks on the body.",
        "Read the post-mortem's external findings, then the fireplace evidence tag and the dispensary register together.",
        "A vein puncture, high potassium, a potassium chloride ampoule in the grate. He was injected with potassium chloride.",
      ],
    },
    {
      number: 4,
      title: "The Ledger",
      envelope: "Envelope 4",
      minutes: 20,
      files: [
        { id: "r4-bank", exhibit: 22, name: "Trust bank statement, annotated.pdf", type: "record", date: "Sep 2026" },
        { id: "r4-mehta", exhibit: 23, name: "Letter — Adv. Harish Mehta.pdf", type: "document", date: "07 Oct 2026" },
        { id: "r4-llp", exhibit: 24, name: "LLP master data — Kapoor Diagnostics.pdf", type: "record", date: "12 Oct 2026" },
        { id: "r4-email", exhibit: 25, name: "Email printout — Kabir to Vikram.pdf", type: "chat", date: "09 Oct 2026" },
        { id: "r4-will", exhibit: 26, name: "Extract of will.pdf", type: "document", date: "2019" },
        { id: "r4-meera2", exhibit: 27, name: "Supplementary statement — Meera Rathore.pdf", type: "statement", date: "13 Oct 2026" },
      ],
      checkpoint: {
        question: "What was Vikram planning to do on Monday morning?",
        choices: [
          { id: "a", label: "Change his will" },
          { id: "b", label: "Block Kabir's sale of the lower estate land" },
          { id: "c", label: "Take irregular Trust payments to his lawyer" },
          { id: "d", label: "Cut Arjun off without a rupee" },
        ],
        answer: "c",
        explanation:
          "Advocate Mehta's letter confirms an 11 AM meeting on Monday about irregular payments out of the Trust, and tells Vikram to say nothing to the trustee who approved them. The will was never going to change.",
      },
      hints: [
        "Three people feared Monday for three different reasons. Only one document says what Monday was actually about.",
        "The letter Meera hid is not about the will. Read it alongside the bank statement Vikram marked up.",
        "Monday at 11 AM: Advocate Mehta, about ₹1.84 crore paid by the Trust to Kapoor Diagnostics LLP.",
      ],
    },
    {
      number: 5,
      title: "The Wrong Clock",
      envelope: "Envelope 5",
      minutes: 25,
      files: [
        { id: "r5-nvr", exhibit: 28, name: "Service report — gate camera recorder.pdf", type: "record", date: "14 Oct 2026" },
        { id: "r5-gatebook", exhibit: 29, name: "Chowkidar's gate register.jpg", type: "document", date: "10 Oct 2026" },
        { id: "r5-sunanda", exhibit: 30, name: "Statement — Sunanda Kapoor.pdf", type: "statement", date: "14 Oct 2026" },
        { id: "r5-kapoor2", exhibit: 31, name: "Second statement — Dr. Anand Kapoor.pdf", type: "statement", date: "14 Oct 2026" },
        { id: "r5-meeraphone", exhibit: 32, name: "Call log — Meera's mobile.pdf", type: "record", date: "10 Oct 2026" },
        { id: "r5-service", exhibit: 33, name: "Nursing service card, 2011.pdf", type: "document", date: "2011" },
        { id: "r5-wedding", exhibit: 34, name: "Photograph — wedding, 2015.jpg", type: "photo", date: "14 Feb 2015" },
      ],
      checkpoint: {
        question: "When did Dr. Kapoor's car really leave Hollow Pines?",
        choices: [
          { id: "a", label: "21:58, as the camera shows" },
          { id: "b", label: "21:40, before Vikram fell" },
          { id: "c", label: "22:15, after the 'voices'" },
          { id: "d", label: "21:20, when Sunita brought the milk" },
        ],
        answer: "b",
        explanation:
          "The recorder's clock was set by hand from the guard hut's wall clock after Friday's power cut, and runs 18 minutes fast. Dr. Kapoor's car left at 21:40 — four minutes before Vikram fell. He told the truth about the one thing everyone thought he lied about.",
      },
      hints: [
        "The gate camera has seemed right about everything so far. Has it?",
        "Compare the camera's time for the police jeep with the inquest report, and its time for Dr. Kapoor's morning arrival with the time written on his note.",
        "The recorder runs 18 minutes fast. Take 18 minutes off 21:58.",
      ],
    },
  ],
  narration: {
    briefing: [
      { id: "I-01", text: "This is the Blackwood Bureau. You have been handed Case Number zero one seven: The Silence at Hollow Pines." },
      { id: "I-02", text: "A wealthy man is dead in his study, and everyone around him agrees it was his heart. The local police are not so sure. That is why the file is on your desk." },
      { id: "I-03", text: "Listen to the briefing. Then read every exhibit, test every statement, and trust nothing that you cannot prove." },
      { id: "B-01", text: "Mussoorie. Sunday, the eleventh of October. The mist has not lifted from Camel's Back Road, and at Hollow Pines the curtains of the study are still drawn." },
      { id: "B-02", text: "At ten past seven, the housekeeper found Vikram Singh Rathore in his armchair, cold, his reading glasses in his lap." },
      { id: "B-03", text: "His doctor of twenty years called it his heart. The inspector called the Bureau." },
      { id: "B-04", text: "Your file has five envelopes. Each round, one opens. At the end of each, a single question stands between you and the next." },
      { id: "B-05", text: "Find who killed him, how it was done, and why. Everything you need is in the evidence. I will not tell you what it means." },
      { id: "B-06", text: "Open folder one." },
    ],
    rounds: {
      2: [
        { id: "R2-01", text: "The time on the watch does not agree with the time on the doctor's note. Inspector Bisht has taken statements from everyone who was at Hollow Pines, or near it." },
        { id: "R2-02", text: "He has also pulled the register from the camera at the main gate. It is the only camera on the estate." },
        { id: "R2-03", text: "Open folder two." },
      ],
      3: [
        { id: "R3-01", text: "Monday. The post-mortem is complete. And the ash from the study grate, sieved this morning, holds something the fire did not finish." },
        { id: "R3-02", text: "Arjun has come to the police station on his own. He says he has something to correct." },
        { id: "R3-03", text: "Open folder three." },
      ],
      4: [
        { id: "R4-01", text: "Tuesday. In Meera's dressing table, folded inside a jewellery box, the police find a lawyer's letter that Vikram never saw." },
        { id: "R4-02", text: "On his desk, under the blotter, a bank statement covered in his own pencil." },
        { id: "R4-03", text: "Open folder four." },
      ],
      5: [
        { id: "R5-01", text: "Wednesday. Dr. Kapoor has asked to make a second statement, with his lawyer beside him. He has a great deal to confess. Murder, he says, is not part of it." },
        { id: "R5-02", text: "And a technician from the camera company has come up to Hollow Pines, because the chowkidar said something odd about a clock." },
        { id: "R5-03", text: "Open folder five. When you are ready, make your accusation." },
      ],
    },
    accusation: [
      { id: "A-01", text: "The file is complete. Name the one who killed Vikram Rathore. Say how. Say why." },
    ],
    reveal: [
      { id: "V-01", text: "Friday afternoon. The power fails across Camel's Back Road. When it returns, the chowkidar sets the gate camera's clock by the old wall clock in his hut. That clock runs eighteen minutes fast. Nobody notices." },
      { id: "V-02", text: "Saturday, eight fifty-two. Dr. Anand Kapoor arrives for his weekly visit. In the hall, Meera comes down to greet him. Something passes from his bag to her hand: a syringe, already filled." },
      { id: "V-03", text: "Anand takes Vikram's blood pressure, gives the vitamin shot into the shoulder, and leaves at 9:40, exactly as he said. The camera writes 21:58. The one thing he told the truth about was the thing that made him look guilty." },
      { id: "V-04", text: "Two minutes later, Meera knocks on the study door. Anand wants a blood sample before Monday, she says. She was an ICU sister for four years. Her husband rolls up his sleeve." },
      { id: "V-05", text: "Potassium chloride, into the vein at the elbow. At 9:44 his heart stumbles and he falls against the side table. His watch asks if he needs help. His wife taps: I'm OK." },
      { id: "V-06", text: "At a quarter past ten, Sunita hears a voice in the study, low, like someone on the phone. It is not the radio. It is Meera, calling the only number she can. Bhaiya. Brother." },
      { id: "V-07", text: "Put him in the chair. Glasses in his lap. Glass in the fire. I will write it up in the morning." },
      { id: "V-08", text: "Meera Rathore was born Nisha Meera Kapoor. The second partner in Kapoor Diagnostics LLP was never Anand's wife. It was his sister. One crore, eighty-four lakh rupees, from the Trust her husband chaired." },
      { id: "V-09", text: "On Thursday she steamed open a lawyer's letter, read the words 'criminal breach of trust', and glued it shut again. She told you she thought it was about the will." },
      { id: "V-10", text: "In the morning Anand wrote 'one o'clock' and 'cardiac', and begged the family to be spared a post-mortem. On Wednesday he confessed to fraud rather than let you look at his sister." },
      { id: "V-11", text: "Arjun hid a bar tab. Kabir feared a Monday that was never about him. Vikram wrote 'Thirty years' beside the name of the man he suspected. He never suspected the woman who filled his pill box every Sunday." },
      { id: "V-12", text: "Case No. 017 is closed." },
    ],
    hints: {
      1: [
        { id: "H-1-1", text: "Here's a thought. Dr. Kapoor's estimate is just his opinion. Is there anything in that room that actually recorded the night as it happened?" },
        { id: "H-1-2", text: "Okay, try this. Go through the smartwatch export line by line. Then ask yourself what the police found switched on in the study." },
        { id: "H-1-3", text: "Alright, here it is. The watch loses his pulse at twenty-one forty-eight, so he died at about a quarter to ten. Those voices at ten fifteen came from someone, or something, else." },
      ],
      2: [
        { id: "H-2-1", text: "Little nudge. Everyone's telling you when they arrived and when they left. Check each of them against something that keeps time." },
        { id: "H-2-2", text: "Put Dr. Kapoor's statement right next to the gate camera register. Go on." },
        { id: "H-2-3", text: "Fine, I'll say it. Dr. Kapoor says he left at nine forty. The camera says twenty-one fifty-eight. His is the account the camera contradicts." },
      ],
      3: [
        { id: "H-3-1", text: "Think about it. A weekly vitamin shot goes into the muscle. So, count the marks on the body." },
        { id: "H-3-2", text: "Read the external findings in the post-mortem. Then the fireplace evidence tag, and the dispensary register, all together." },
        { id: "H-3-3", text: "Here's the answer. A puncture in the vein, high potassium, and a potassium chloride ampoule in the grate. He was injected with potassium chloride." },
      ],
      4: [
        { id: "H-4-1", text: "Funny thing. Three people were dreading Monday, for three different reasons. Only one document says what Monday was actually about." },
        { id: "H-4-2", text: "That letter Meera hid? It's not about the will. Read it alongside the bank statement Vikram marked up." },
        { id: "H-4-3", text: "Okay. Monday, eleven in the morning, with Advocate Mehta. About one crore, eighty-four lakh rupees the Trust paid to Kapoor Diagnostics." },
      ],
      5: [
        { id: "H-5-1", text: "The gate camera's been right about everything so far. Hasn't it? Hmm. Has it?" },
        { id: "H-5-2", text: "Compare the camera's time for the police jeep with the inquest report. Then its time for Dr. Kapoor's morning arrival, with the time on his note." },
        { id: "H-5-3", text: "Here you go. The recorder runs eighteen minutes fast. Take eighteen minutes off twenty-one fifty-eight." },
      ],
    },
    nudges: {
      noFile: [
        { id: "N-01", text: "Go on, open a file. They don't bite. Well, most of them don't." },
      ],
      unread: [
        { id: "N-02", text: "There's still a file in this folder you haven't looked at. Just saying." },
      ],
      answer: [
        { id: "N-03", text: "You've seen everything in this folder. Whenever you're ready, take a crack at the question." },
      ],
      stuck: [
        { id: "N-04", text: "Still with me? If you're stuck, there's no shame in a hint. I won't tell anyone." },
        { id: "N-05", text: "Take your time. Put two statements side by side, and see which one blinks first." },
        { id: "N-06", text: "Try writing the times down in your notebook. Times are where people slip up." },
      ],
      accuse: [
        { id: "N-07", text: "That's the whole file. When you're ready, make your accusation. Who, how, and why." },
      ],
    },
  },
  accusation: {
    methods: [
      { id: "kcl", label: "Injected potassium chloride into a vein" },
      { id: "sleep", label: "Crushed sleeping tablets into his evening milk" },
      { id: "smother", label: "Smothered him in the armchair" },
      { id: "digoxin", label: "Swapped his heart tablets for a dangerous dose" },
      { id: "natural", label: "No method. He died of natural causes" },
    ],
    motives: [
      { id: "fraud", label: "To stop Vikram exposing the money stolen from the Rathore Trust" },
      { id: "will", label: "To inherit before the will could be changed" },
      { id: "debt", label: "To pay off debts after he refused another loan" },
      { id: "land", label: "To push through the sale of the lower estate land" },
      { id: "grudge", label: "Revenge for years of mistreatment in service" },
    ],
  },
  solution: {
    suspect: "meera",
    method: "kcl",
    motive: "fraud",
    proofs: [
      { clue: "The watch logs a hard fall at 21:44, an SOS cancelled by a tap at 21:45 and no pulse from 21:48. Someone was standing beside him.", exhibit: 5 },
      { clue: "A vein puncture at the left elbow and raised potassium: an intravenous injection of potassium chloride, from ampoules Dr. Kapoor drew on Friday.", exhibit: 16 },
      { clue: "The gate recorder runs 18 minutes fast: the police jeep shows 08:21 against an arrival of 08:05; Dr. Kapoor 'arrives' at 07:56 but wrote his note at 07:50.", exhibit: 28 },
      { clue: "So Dr. Kapoor left at 21:40, before the fall. The chowkidar's own book says 9.40.", exhibit: 29 },
      { clue: "Meera, 'asleep since 9.30', made a six-minute call from Hollow Pines at 22:14 — the 'voices' Sunita heard.", exhibit: 32 },
      { clue: "She called 'Bhaiya' on +91 94120 51187: Dr. Kapoor's number. Sunanda Kapoor saw him take that call in the garden.", exhibit: 30 },
      { clue: "Meera is Nisha Meera Kapoor, Dr. Kapoor's sister, a former ICU sister certified to give intravenous drugs.", exhibit: 33 },
      { clue: "Nisha M. Kapoor is the second partner in Kapoor Diagnostics LLP, which took ₹1.84 crore from the Trust.", exhibit: 24 },
      { clue: "The lawyer's letter had been slit open and glued shut: Meera knew exactly what Monday was about.", exhibit: 23 },
    ],
  },
};

export const shelf: ShelfEntry[] = [
  { number: "017", title: "The Silence at Hollow Pines", genre: "Classic murder", status: "available", id: "017" },
  { number: "018", title: "More cases are being written", genre: "Coming soon", status: "sealed" },
];

export const cases: Record<string, CaseFile> = { "017": hollowPines };
