import type { CaseFile, ShelfEntry } from "../types";

/* CASE 017 — The Silence at Hollow Pines. Answers, hints, the solution and the reveal live server-side in lib/server/case-017.ts. */
export const hollowPines: CaseFile = {
  id: "017",
  number: "017",
  title: "The Silence at Hollow Pines",
  subtitle: "A death in the study, a doctor at the door, and a clock that nobody checked.",
  genre: "Classic murder",
  players: "1 to 6",
  playTime: "Up to 1 hour",
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
      minutes: 12,
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
      },
    },
    {
      number: 2,
      title: "The Household",
      envelope: "Envelope 2",
      minutes: 12,
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
      },
    },
    {
      number: 3,
      title: "What the Body Said",
      envelope: "Envelope 3",
      minutes: 12,
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
      },
    },
    {
      number: 4,
      title: "The Ledger",
      envelope: "Envelope 4",
      minutes: 12,
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
      },
    },
    {
      number: 5,
      title: "The Wrong Clock",
      envelope: "Envelope 5",
      minutes: 12,
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
      },
    },
  ],
  narration: {
    briefing: [
      { id: "I-01", image: "/cases/017/briefing/I-01.webp", text: "This is the Blackwood Bureau. You have been handed Case Number zero one seven: The Silence at Hollow Pines." },
      { id: "I-02", image: "/cases/017/briefing/I-02.webp", text: "A wealthy man is dead in his study, and everyone around him agrees it was his heart. The local police are not so sure. That is why the file is on your desk." },
      { id: "I-03", image: "/cases/017/briefing/I-03.webp", text: "Listen to the briefing. Then read every exhibit, test every statement, and trust nothing that you cannot prove." },
      { id: "B-01", image: "/cases/017/briefing/B-01.webp", text: "Mussoorie. Sunday, the eleventh of October. The mist has not lifted from Camel's Back Road, and at Hollow Pines the curtains of the study are still drawn." },
      { id: "B-02", image: "/cases/017/briefing/B-02.webp", text: "At ten past seven, the housekeeper found Vikram Singh Rathore in his armchair, cold, his reading glasses in his lap." },
      { id: "B-03", image: "/cases/017/briefing/B-03.webp", text: "His doctor of twenty years called it his heart. The inspector called the Bureau." },
      { id: "B-04", image: "/cases/017/briefing/B-04.webp", text: "Your file has five envelopes. Each round, one opens. At the end of each, a single question stands between you and the next." },
      { id: "B-05", image: "/cases/017/briefing/B-05.webp", text: "Find who killed him, how it was done, and why. Everything you need is in the evidence. I will not tell you what it means." },
      { id: "B-06", image: "/cases/017/briefing/B-06.webp", text: "Open folder one." },
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
      { id: "kcl", label: "Injected potassium chloride into a vein", from: 3 },
      { id: "sleep", label: "Crushed sleeping tablets into his evening milk" },
      { id: "smother", label: "Smothered him in the armchair" },
      { id: "digoxin", label: "Swapped his heart tablets for a dangerous dose" },
      { id: "natural", label: "No method. He died of natural causes" },
    ],
    motives: [
      { id: "fraud", label: "To stop Vikram exposing the money stolen from the Rathore Trust", from: 4 },
      { id: "will", label: "To inherit before the will could be changed" },
      { id: "debt", label: "To pay off debts after he refused another loan" },
      { id: "land", label: "To push through the sale of the lower estate land", from: 2 },
      { id: "grudge", label: "Revenge for years of mistreatment in service" },
    ],
    details: [
      {
        id: "source",
        q: "Where did the means of killing come from?",
        choices: [
          { id: "hospital", label: "Hospital stock, drawn under Dr. Kapoor's name" },
          { id: "cabinet", label: "The medicine cabinet at Hollow Pines" },
          { id: "chemist", label: "A chemist in Dehradun" },
          { id: "kabir", label: "Brought to the house by Kabir Sethi" },
          { id: "none", label: "Nothing was used. He died naturally" },
        ],
      },
      {
        id: "camera",
        q: "Why does the gate camera disagree with Dr. Kapoor's account of his evening?",
        choices: [
          { id: "fast", label: "The recorder's clock runs 18 minutes fast" },
          { id: "lied", label: "Dr. Kapoor lied about when he left" },
          { id: "edited", label: "Someone edited the footage" },
          { id: "service", label: "He left by the service gate, which has no camera" },
        ],
      },
      {
        id: "voices",
        q: "Who did Sunita hear in the study at about 10:15 PM?",
        choices: [
          { id: "vikram", label: "Vikram, talking on the phone" },
          { id: "meera-call", label: "Meera, on a phone call" },
          { id: "arjun", label: "Arjun, arguing with his father" },
          { id: "kapoor", label: "Dr. Kapoor, who had come back" },
          { id: "radio", label: "The radio on the shelf" },
        ],
      },
      {
        id: "letter",
        q: "What happened to the lawyer's letter?",
        choices: [
          { id: "steamed", label: "It was steamed open, read and glued shut again" },
          { id: "burned", label: "It was burned in the study fire" },
          { id: "unread", label: "It never reached the house" },
          { id: "hidden", label: "Vikram read it and hid it" },
        ],
      },
      {
        id: "pair",
        q: "Which two people worked together?",
        choices: [
          { id: "meera-kapoor", label: "Meera Rathore and Dr. Kapoor" },
          { id: "arjun-kabir", label: "Arjun Rathore and Kabir Sethi" },
          { id: "sunita-arjun", label: "Sunita Negi and Arjun Rathore" },
          { id: "kabir-kapoor", label: "Kabir Sethi and Dr. Kapoor" },
          { id: "alone", label: "Nobody. The killer acted alone" },
        ],
      },
    ],
  },
};

export const shelf: ShelfEntry[] = [
  { number: "017", title: "The Silence at Hollow Pines", genre: "Classic murder", status: "available", id: "017" },
  { number: "018", title: "More cases are being written", genre: "Coming soon", status: "sealed" },
];

export const cases: Record<string, CaseFile> = { "017": hollowPines };
