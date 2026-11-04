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
    briefs: [
      { id: "E-01", text: "A memo from the Bureau's director, E. D. Blackwood, dated Sunday morning. Inspector Bisht has asked for help with the death of Vikram Singh Rathore. Dr. Kapoor called it a cardiac arrest at about one in the morning, but the inspector has ordered a post-mortem. Five people of interest are listed: Meera, Arjun, Dr. Kapoor, Kabir Sethi, and the housekeeper, Sunita. A note in pen at the bottom: trust Bisht's instincts, check his times." },
      { id: "E-02", text: "The police inquest report, signed by Inspector Bisht. Vikram was found in his armchair, cold, fully stiff by a quarter past eight, with a small graze on his right temple. His left slipper was under the desk, and the rug was pushed toward the fireplace. The radio on the shelf was still playing, and the milk beside him was untouched. Dr. Kapoor called the death natural, at about one a.m. The inspector was not satisfied, and sent the body for a post-mortem." },
      { id: "E-03", text: "A police photograph of the study, taken from the doorway at eight thirty-two that morning. Seven numbered markers: the untouched milk, the glasses in his lap, a book face down on the rug, a slipper under the desk, the radio, the mantel clock, and a chipped corner on the side table." },
      { id: "E-04", text: "The ground floor plan of Hollow Pines. The study is at the front, nine metres from the kitchen, and the stairs lead up to the bedrooms. Behind the house, a service gate opens onto a back lane, with no camera. The only camera on the estate covers the main gate and the drive." },
      { id: "E-05", text: "Vikram's smartwatch data, pulled by the police forensics cell. It shows his heart rate through the evening, and a blood pressure reading entered just before nine. From nine forty-two, a run of alerts: a sudden high heart rate, an irregular rhythm, a low rate, then a hard fall at nine forty-four. The emergency call was cancelled by a tap on the screen. From nine forty-eight, no heart rate at all. The watch stayed on his wrist until morning." },
      { id: "E-06", text: "The statement of Sunita Negi, the housekeeper. She heard Vikram shout at Arjun around eight, and saw Meera go upstairs at about nine. Dr. Kapoor arrived just before nine. At twenty past nine the doctor took the milk from her at the study door, and the room smelt like a hospital. Around a quarter past ten she heard one low voice in the study. Bholu, the dog, barked at the back gate around midnight. In the morning she found Vikram still wearing the watch he always took off at night." },
      { id: "E-07", text: "Dr. Kapoor's handwritten note on the death, dated ten to eight on Sunday morning. He lists Vikram's heart condition and medicines, writes that there is no external injury, puts the time of death at about one a.m., and says a post-mortem is not required. The inspector has written across it: not accepted." },
      { id: "E-08", text: "Meera Rathore's statement. Married eleven years, she filled his pill organiser every Sunday. She heard the argument at eight, greeted Dr. Kapoor in the hall, and went upstairs with a migraine. She says she took a sleeping tablet at half past nine and heard nothing until morning. She says she knows of no letters or appointments, and has never read the will." },
      { id: "E-09", text: "Arjun Rathore's statement. His café owes six lakh rupees by Tuesday. His father refused to help, and they argued. He says he left the study at ten past eight and stayed in his room all night, with his headphones on. He admits sending his father one angry message, and an apology straight after." },
      { id: "E-10", text: "Dr. Anand Kapoor's statement. Vikram's doctor for twenty years, and a trustee of the hospital trust. He says he arrived at ten to nine, took the blood pressure, gave the vitamin injection into the left shoulder, talked hospital business, and let himself out at about nine forty. He mentions that Meera was once one of his I C U nurses. He still believes a post-mortem is unnecessary." },
      { id: "E-11", text: "Kabir Sethi's statement. He wants to buy the lower land at Hollow Pines for a resort, and has already spent nearly two crore. Vikram went quiet on him, and on Friday Kabir sent an angry email. He says that on Saturday night he was at a family wedding in Dehradun, and called Vikram twice around ten to apologise." },
      { id: "E-12", text: "The event register from the camera at the main gate. Arjun's scooter comes in at five. Dr. Kapoor's car comes in at twenty-one ten, and goes out at twenty-one fifty-eight. Next morning, the doctor's car and then the police jeep arrive. A line at the top says the recorder's clock was set by hand." },
      { id: "E-13", text: "A night-vision frame from the gate camera, stamped twenty-one fifty-eight. A silver Honda City, Dr. Kapoor's car, leaves through the main gate. The driver can't be seen. There is no other movement at the gate until it closes for the night." },
      { id: "E-14", text: "The message thread between Arjun and his father on Saturday. Arjun begs for six lakh, and his father says they'll talk after dinner. At eight thirty-one Arjun writes: you'll regret this. Two minutes later: sorry. A message at nine fourteen was deleted. At eight minutes to midnight: Papa, I'm home." },
      { id: "E-15", text: "Vikram's phone records for the week. Calls with his lawyer, Advocate Mehta, on Wednesday and on Saturday morning, and a call to the bank's trust desk. Several calls from Kabir Sethi, including two missed around ten on Saturday night, with a voicemail, both from a tower in Dehradun. And a one-minute call to Dr. Kapoor on Saturday afternoon." },
      { id: "E-16", text: "The post-mortem report from Doon Medical College. The body lay on its right side for some time after death, and was later sat up. There is a graze on the temple, an injection mark in the left shoulder, and a second, fresh needle mark in the vein at the left elbow. The heart is diseased, but not enough to explain death, and potassium is high, highest at the elbow. Death most likely between nine and eleven p.m. The cause given: the heart's rhythm failed after potassium was injected into a vein." },
      { id: "E-17", text: "An evidence tag, with a photograph. Sieving the ash from the study grate, the police found scorched glass from a ten millilitre ampoule. The burnt label still reads part of: potassium chloride, injection. A note says it is a hospital-only drug, not sold by chemists in Mussoorie, and never prescribed to Vikram." },
      { id: "E-18", text: "A page from the hospital pharmacy's injection register, for Friday the ninth. Dr. Kapoor collected one vitamin B12 ampoule for a private patient and, a minute later, two ampoules of potassium chloride for Ward 3. That line has no ward countersign. The chief pharmacist has added: Ward 3 never asked for them, and never received them." },
      { id: "E-19", text: "A bar tab from the Clocktower Bar in Landour, in Arjun's name, opened at twenty-one twelve and closed at twenty-three forty-eight, with two card payments declined. A police note says Arjun has changed his story. He slipped out by the service gate at about a quarter to nine, and came back around five to midnight. The bar staff and the bar's own camera say he was at the counter all evening." },
      { id: "E-20", text: "Kabir Sethi's voicemail to Vikram, left at eleven minutes past ten on Saturday night, with wedding music loud behind him. He apologises for his email, and asks Vikram to call him back before Monday, before he says anything to anyone." },
      { id: "E-21", text: "A page from Vikram's pocket diary. Wednesday: Mehta agrees it looks bad, Monday at eleven. Thursday: the bank is sending fourteen months of trust statements, and copies go to every trustee. So he will see I asked. Saturday: no to Arjun. Then: A, nine p.m., B12. Say nothing. Be normal. Thirty years. And Monday, circled: Mehta, eleven a.m." },
      { id: "E-22", text: "The trust's hospital account statement for September, found under Vikram's desk blotter. One payment, twelve lakh sixty-five thousand rupees to Kapoor Diagnostics for pathology, approved by trustee A K, is boxed in pencil: our own lab does all pathology. Vikram has listed the same payment for all fourteen months, about one crore eighty-four lakh in total, and written: who are K D? A bank note says copies of these statements went to all three trustees." },
      { id: "E-23", text: "A private letter from Advocate Harish Mehta to Vikram, dated the seventh of October. It confirms their meeting on Monday at eleven, about monthly payments to an outside pathology firm, approved by a single trustee, which may be criminal breach of trust. He advises Vikram not to raise it with the trustee who approved them. The inspector notes that the letter was found sealed in Meera's jewellery box, and that the envelope had been glued shut again." },
      { id: "E-24", text: "Government company records for Kapoor Diagnostics, set up in June twenty twenty-five. Two partners: Anand Kapoor, and Nisha M. Kapoor. Its address is the empty first-floor flat of the Kapoor family house. The police found no lab and no staff there, and the hospital says it has never sent them a single sample." },
      { id: "E-25", text: "Kabir Sethi's email to Vikram, sent late on Friday night. Three weeks of silence, one point nine crore spent, and a board meeting on Tuesday. He has heard about the lawyer on Monday, and writes: if you block it on Monday, you will regret it. A police note confirms Kabir was at the wedding in Dehradun all of Saturday evening." },
      { id: "E-26", text: "An extract of Vikram's will, from twenty nineteen. The house goes to Meera for her lifetime, then to Arjun. The rest is split forty per cent to Meera, forty per cent to Arjun, held until he is thirty-five, and twenty per cent to the charitable trust. The executor, Harish Mehta, certifies there is no later will, and that Vikram never raised his will with him this year." },
      { id: "E-27", text: "Meera's second statement, taken on Tuesday. She now says that on Thursday a letter came by hand from Mehta and Associates. Sure that Vikram was changing his will, she hid it in her jewellery box. She swears she never opened it, and says she knew nothing about any trouble at the trust." },
      { id: "E-28", text: "A service report on the gate camera's recorder. After a power cut on Friday, its clock was set by hand. The technician checked it against true time: the recorder is eighteen minutes and two seconds fast, and every time it has stamped since Friday afternoon is ahead by that much. The chowkidar set it from the clock in his hut, which he keeps fast on purpose." },
      { id: "E-29", text: "Mohan Lal the chowkidar's handwritten gate book, in Hindi, with the inspector's translation. Friday: power cut, camera switched back on and set by the hut clock. Saturday: the doctor's car in at eight fifty, out at nine forty. Gate shut at eleven. At midnight Bholu barked at the back gate, and nobody was there. Sunday: the doctor in at seven forty, the police at eight oh five. He writes his times roughly, from his phone." },
      { id: "E-30", text: "The statement of Sunanda Kapoor, the doctor's wife. She says her husband came home on Saturday at about ten to ten, before the news. At about a quarter past ten his phone rang, and he took it out in the garden for ten minutes, in the cold. He came back looking grey, and said it was a patient. She has never heard of Kapoor Diagnostics. The first-floor flat has been locked for years, and Anand has the key." },
      { id: "E-31", text: "Dr. Kapoor's second statement, made with his lawyer present. He admits Kapoor Diagnostics never did a single test, and that about one crore eighty-four lakh of the trust's money is gone. The second partner, Nisha, is a member of his family, and he won't say more. He says he drew the potassium ampoules for himself, then flushed them away. He insists he left at nine forty, and that nobody phoned him that night." },
      { id: "E-32", text: "Calls recovered from Meera's phone. Several calls that week to a contact saved as Bhaiya, on a number ending five one one eight seven. One at twenty-two fourteen on Saturday night lasted six minutes, through the tower that serves Hollow Pines. Her phone was on the study's wi-fi from twenty-one thirty-nine to twenty-two forty-seven. The recent calls list on the handset had been cleared." },
      { id: "E-33", text: "A nurse's service card from Rathore Memorial Hospital, from twenty eleven. Name: Nisha Meera Kapoor. Father: the late Dr. R. N. Kapoor. Emergency contact: Dr. Anand Kapoor, brother. A staff nurse in the I C U, certified to give high-alert intravenous drugs, including potassium chloride. She nursed Mr. Rathore in twenty fourteen, and resigned in twenty fifteen, on her marriage." },
      { id: "E-34", text: "A framed wedding photograph from the drawing room, February twenty fifteen, in the garden at Hollow Pines. Vikram and his bride at the mandap, with Dr. Kapoor beside them. On the back, in her hand: Nisha and Vikram, fourteenth February twenty fifteen. Bhaiya did the kanyadaan. Papa would have cried." },
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
