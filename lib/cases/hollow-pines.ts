import type { CaseFile, ShelfEntry } from "../types";

export const hollowPines: CaseFile = {
  id: "017",
  number: "017",
  title: "The Silence at Hollow Pines",
  subtitle: "A death in the study, a doctor at the door, and a watch that kept the time.",
  genre: "Classic murder",
  players: "1 to 6",
  playTime: "About 2 hours",
  price: "Free demo",
  dateOpened: "11 October 2026",
  location: "Hollow Pines Estate, Camel's Back Road, Mussoorie, Uttarakhand",
  summary:
    "Vikram Singh Rathore, sixty-four, retired tea exporter and chairman of the Rathore Charitable Trust, was found dead in the armchair of his study on a cold Sunday morning. His family doctor called it his heart. The police are not so sure. Four people had reason to be near him that night. One of them made certain he would not live to see Monday.",
  suspects: [
    { id: "meera", name: "Meera Rathore", role: "Wife", age: 46, note: "Married to Vikram for eleven years. Inherits the estate." },
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
          "The watch registers a hard fall at 21:43 and loses his pulse by 21:47. The voices Sunita heard at 10:15 came from the radio, found still switched on.",
      },
      hints: [
        "Dr. Kapoor's estimate is an opinion. Look for something in the room that recorded the night as it happened.",
        "Read the smartwatch export line by line, and compare it with what the police found switched on in the study.",
        "The watch loses his pulse at 21:47. Sunita's 'voices' at 10:15 were the radio. He died at about 9:45 PM.",
      ],
    },
    {
      number: 2,
      title: "The Household",
      envelope: "Envelope 2",
      minutes: 30,
      files: [
        { id: "r2-meera", exhibit: 8, name: "Statement — Meera Rathore.pdf", type: "statement", date: "11 Oct 2026" },
        { id: "r2-arjun", exhibit: 9, name: "Statement — Arjun Rathore.pdf", type: "statement", date: "11 Oct 2026" },
        { id: "r2-kapoor", exhibit: 10, name: "Statement — Dr. Anand Kapoor.pdf", type: "statement", date: "11 Oct 2026" },
        { id: "r2-kabir", exhibit: 11, name: "Statement — Kabir Sethi.pdf", type: "statement", date: "11 Oct 2026" },
        { id: "r2-cctvlog", exhibit: 12, name: "Main gate CCTV register.csv", type: "record", date: "10 Oct 2026" },
        { id: "r2-cctvstill", exhibit: 13, name: "CCTV still — Gate cam 1, 21.58.jpg", type: "photo", date: "10 Oct 2026" },
        { id: "r2-chat", exhibit: 14, name: "Chat printout — Arjun and Vikram.pdf", type: "chat", date: "10 Oct 2026" },
        { id: "r2-calls", exhibit: 15, name: "Call log — Vikram's mobile.pdf", type: "record", date: "10 Oct 2026" },
      ],
      checkpoint: {
        question: "Who was the last person known to be with Vikram while he was alive?",
        choices: [
          { id: "meera", label: "Meera Rathore" },
          { id: "arjun", label: "Arjun Rathore" },
          { id: "kapoor", label: "Dr. Anand Kapoor" },
          { id: "kabir", label: "Kabir Sethi" },
          { id: "sunita", label: "Sunita Negi" },
        ],
        answer: "kapoor",
        explanation:
          "Dr. Kapoor says he left at 9:40. The gate camera shows his car leaving at 21:58, eleven minutes after Vikram's pulse stopped.",
      },
      hints: [
        "Everyone tells you when they last saw Vikram. Not everyone is telling the truth. Check their times against something that cannot lie.",
        "Put Dr. Kapoor's statement next to the main gate CCTV register.",
        "Dr. Kapoor claims he left at 9:40 PM. His car leaves the gate at 21:58. He was there when Vikram died.",
      ],
    },
    {
      number: 3,
      title: "What the Body Said",
      envelope: "Envelope 3",
      minutes: 30,
      files: [
        { id: "r3-pm", exhibit: 16, name: "Post-mortem report.pdf", type: "document", date: "12 Oct 2026" },
        { id: "r3-tag", exhibit: 17, name: "Evidence tag — fireplace fragment.jpg", type: "photo", date: "11 Oct 2026" },
        { id: "r3-pharmacy", exhibit: 18, name: "Hospital dispensary register.pdf", type: "record", date: "09 Oct 2026" },
        { id: "r3-receipt", exhibit: 19, name: "Receipt — Clocktower Bar.jpg", type: "record", date: "10 Oct 2026" },
        {
          id: "r3-voicemail",
          exhibit: 20,
          name: "Voicemail — Kabir Sethi, 22.11.m4a",
          type: "audio",
          date: "10 Oct 2026",
          transcript:
            "Vikram, it's Kabir. Again. Look, I know you're angry about the email. I shouldn't have written it like that. But pick up, yaar. We need to talk before Monday. Before you say anything to anyone. Call me back. Tonight, please. ... I'm at Pinky's sangeet, it's mad here, but I'll step out. Call me.",
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
          "The post-mortem finds a fresh puncture in a vein of the left elbow and raised potassium. A broken ampoule of potassium chloride lay in the fireplace, and Dr. Kapoor drew two such ampoules from the hospital the day before.",
      },
      hints: [
        "A weekly vitamin shot goes into the muscle. Count the marks on the body.",
        "Read the post-mortem's external findings, then the fireplace evidence tag and the dispensary register together.",
        "A vein puncture, high potassium, a potassium chloride ampoule in the grate, and two drawn by Dr. Kapoor on 9 October. He was injected with potassium chloride.",
      ],
    },
    {
      number: 4,
      title: "The Ledger",
      envelope: "Envelope 4",
      minutes: 30,
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
          { id: "a", label: "Change his will in Meera's favour" },
          { id: "b", label: "Block Kabir's sale of the lower estate land" },
          { id: "c", label: "Take irregular Trust payments to his lawyer" },
          { id: "d", label: "Cut Arjun off without a rupee" },
        ],
        answer: "c",
        explanation:
          "Advocate Mehta's letter confirms an 11 AM meeting on Monday about 'irregularities in Trust disbursements', and advises Vikram to say nothing to the other trustees.",
      },
      hints: [
        "Several people feared Monday. Only one document says what Monday was actually about.",
        "The lawyer's letter that Meera hid is not about the will. Read it alongside the bank statement Vikram marked up.",
        "Monday at 11 AM: Advocate Mehta, about irregular payments out of the Rathore Trust to Kapoor Diagnostics LLP.",
      ],
    },
  ],
  narration: {
    briefing: [
      { id: "B-01", text: "Mussoorie. Sunday, the eleventh of October. The mist has not lifted from Camel's Back Road, and at Hollow Pines the curtains of the study are still drawn." },
      { id: "B-02", text: "At ten past seven, the housekeeper found Vikram Singh Rathore in his armchair, cold, his reading glasses in his lap." },
      { id: "B-03", text: "His doctor of twenty years called it his heart. The inspector called the Bureau." },
      { id: "B-04", text: "Your file has four envelopes. Each round, one opens. At the end of each, a single question stands between you and the next." },
      { id: "B-05", text: "Find who killed him, how it was done, and why. Everything you need is in the evidence. I will not tell you what it means." },
      { id: "B-06", text: "Open folder one." },
    ],
    rounds: {
      2: [
        { id: "R2-01", text: "The time on the watch does not agree with the time on the doctor's note. Inspector Bisht has taken statements from everyone who was at Hollow Pines, or near it." },
        { id: "R2-02", text: "He has also pulled the register from the camera at the main gate." },
        { id: "R2-03", text: "Open folder two." },
      ],
      3: [
        { id: "R3-01", text: "Monday. The post-mortem is complete. And the ash from the study grate, sieved this morning, holds something the fire did not finish." },
        { id: "R3-02", text: "Arjun has asked to speak to the inspector again. He says he has something to correct." },
        { id: "R3-03", text: "Open folder three." },
      ],
      4: [
        { id: "R4-01", text: "Tuesday. In Meera's dressing table, folded inside a jewellery box, the police find an unopened appointment Vikram never kept." },
        { id: "R4-02", text: "On his desk, under the blotter, a bank statement covered in his own pencil." },
        { id: "R4-03", text: "Open folder four. When you are ready, make your accusation." },
      ],
    },
    accusation: [
      { id: "A-01", text: "The file is complete. Name the one who killed Vikram Rathore. Say how. Say why." },
    ],
    reveal: [
      { id: "V-01", text: "Saturday, five minutes to nine. Dr. Anand Kapoor's car passes the main gate for his weekly visit, as it has every Saturday for years." },
      { id: "V-02", text: "In the study, he takes Vikram's blood pressure, and gives the usual vitamin shot into the shoulder. Vikram says nothing about the bank statement under his blotter. He has been told to say nothing until Monday." },
      { id: "V-03", text: "But Anand already knows. The Trust's bank had called to confirm the chairman's request for fourteen months of statements." },
      { id: "V-04", text: "So there is a second needle. Potassium chloride, drawn from the hospital the day before against a ward that never received it, pushed into the vein at the elbow." },
      { id: "V-05", text: "At 9:43 the heart falters and Vikram falls. His watch asks if he needs help. Someone presses cancel." },
      { id: "V-06", text: "Anand lifts him into the armchair, sets the glasses in his lap, and throws the ampoule into the fire. The radio stays on. Sunita will hear 'voices' at a quarter past ten." },
      { id: "V-07", text: "At 21:58 the camera sees his car leave. He will tell the police he left at 9:40. In the morning he will write 'about 1 AM', and 'cardiac arrest', and suggest the family be spared a post-mortem." },
      { id: "V-08", text: "Arjun lied to hide a bar tab and a debt. Meera hid a letter she feared was about the will. Kabir feared a Monday that was never about him." },
      { id: "V-09", text: "Monday was about one crore, eighty-four lakh rupees, paid by the Trust to a laboratory that existed only on paper, owned by Anand and Nisha Kapoor." },
      { id: "V-10", text: "Case No. 017 is closed." },
    ],
  },
  accusation: {
    methods: [
      { id: "kcl", label: "Injected potassium chloride into a vein during the weekly visit" },
      { id: "sleep", label: "Crushed sleeping tablets into his evening milk" },
      { id: "smother", label: "Smothered him in the armchair" },
      { id: "natural", label: "No method. He died of natural causes" },
      { id: "digoxin", label: "Swapped his heart tablets for a stronger dose" },
    ],
    motives: [
      { id: "trust", label: "To stop Vikram exposing money stolen from the Rathore Trust" },
      { id: "will", label: "To inherit before the will could be changed" },
      { id: "debt", label: "To pay off debts after he refused another loan" },
      { id: "land", label: "To push through the sale of the lower estate land" },
      { id: "grudge", label: "Revenge for years of mistreatment in service" },
    ],
  },
  solution: {
    suspect: "kapoor",
    method: "kcl",
    motive: "trust",
    proofs: [
      { clue: "The watch logs a hard fall at 21:43, an SOS cancelled by hand at 21:44 and no pulse from 21:47.", exhibit: 5 },
      { clue: "The radio was found switched on, which explains the 'voices' Sunita heard at 22:15.", exhibit: 2 },
      { clue: "Dr. Kapoor's car leaves the main gate at 21:58, not 21:40 as he stated.", exhibit: 12 },
      { clue: "Two punctures: a deltoid injection for B12, and a fresh vein puncture at the left elbow. Raised vitreous potassium.", exhibit: 16 },
      { clue: "A potassium chloride ampoule fragment recovered from the study fireplace.", exhibit: 17 },
      { clue: "Two ampoules of potassium chloride issued to Dr. Kapoor on 9 October, never countersigned by Ward 3.", exhibit: 18 },
      { clue: "₹1.84 crore paid by the Trust to Kapoor Diagnostics LLP, partners Anand and Nisha Kapoor.", exhibit: 24 },
      { clue: "Monday's appointment was about Trust disbursements, with advice to tell no other trustee.", exhibit: 23 },
    ],
  },
};

export const shelf: ShelfEntry[] = [
  { number: "017", title: "The Silence at Hollow Pines", genre: "Classic murder", status: "available", id: "017" },
  { number: "018", title: "The Widow of Landour Bazaar", genre: "Supernatural", status: "sealed" },
  { number: "019", title: "Nine Minutes at Marine Drive", genre: "Heist", status: "sealed" },
];

export const cases: Record<string, CaseFile> = { "017": hollowPines };
