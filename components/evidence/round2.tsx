import { F, Paper, Q, Stamp, StatementPaper } from "./parts";
import { ImageSlot } from "../Media";

export function MeeraStatement() {
  return (
    <StatementPaper
      exhibit={8}
      envelope={2}
      name="Smt. Meera Rathore w/o Shri Vikram Singh Rathore"
      age={46}
      relation="Wife"
      address="Hollow Pines Estate, Camel's Back Road, Mussoorie"
      date="11.10.2026"
      time="11:20 hrs"
      place="Drawing room, Hollow Pines"
      recordedBy="Inspector R. K. Bisht, SHO"
      signature="Meera Rathore"
      language="English"
    >
      <p>My husband and I have been married eleven years. We were happy. He was not a well man, but he was careful. He took his tablets on time; I filled the organiser myself every Sunday.</p>
      <p>Last night after dinner he went into the study with Arjun. I did not want to be present. Arjun asks for money and his father refuses; it has been like that for a year. I heard raised voices at about eight.</p>
      <p>I had a migraine. At about nine I told Sunita I was going up and was not to be disturbed. Anand — Dr. Kapoor — had just arrived; I said hello to him in the hall. He seemed his usual self. A little quiet perhaps.</p>
      <p>Upstairs I took one tablet of Zolpidem 10 mg, which I take when the migraine is bad, at about half past nine. I fell asleep reading. I heard nothing until Sunita screamed in the morning.</p>
      <p>I telephoned Anand at once, at about quarter past seven. He came within half an hour. He examined Vikram and said it was his heart, in the night. He said there was no need to call the police and put the family through a post-mortem. Arjun insisted. I telephoned the police station at half past seven.</p>
      <Q q="Had your husband been worried about anything recently?">For about two weeks he had been working late in the study over papers. When I asked, he said, &ldquo;Trust business. Nothing for you to worry about.&rdquo;</Q>
      <Q q="Do you know of any letters or appointments he had for the coming week?">No. My husband did not discuss business with me. I know of no letters.</Q>
      <Q q="Do you know the terms of his will?">I believe I am a beneficiary, with Arjun. I have never read it.</Q>
      <Q q="Did you leave your room at any time after half past nine?">No. The tablet knocks me out. I did not wake until morning.</Q>
    </StatementPaper>
  );
}

export function ArjunStatement() {
  return (
    <StatementPaper
      exhibit={9}
      envelope={2}
      name="Shri Arjun Rathore s/o Shri Vikram Singh Rathore"
      age={31}
      relation="Son"
      address="Hollow Pines Estate, Mussoorie; café premises: 'Bean & Bough', Landour Cantt."
      date="11.10.2026"
      time="11:55 hrs"
      place="Verandah, Hollow Pines"
      recordedBy="Inspector R. K. Bisht, SHO"
      signature="Arjun R."
      language="English / Hindi"
    >
      <p>I run a café in Landour. It has not been doing well since the monsoon. The landlord has given me notice for six lakh rupees in arrears, due on Tuesday.</p>
      <p>After dinner I asked my father to help me, one last time. He refused. We argued. I said things I should not have. I left the study at about ten past eight and went to my room.</p>
      <p>I stayed in my room the whole night. I had my headphones on, I was listening to music and then watching something on my laptop. I fell asleep by eleven. I did not go out. I did not hear anything.</p>
      <p>In the morning I heard Sunita didi scream and came running. My father was in his chair.</p>
      <Q q="Did you send your father any message last night?">Yes, one message. I was angry. I wrote, &ldquo;You&apos;ll regret this.&rdquo; I said sorry straight after. I did not mean anything by it.</Q>
      <Q q="Why did you insist on informing the police?">Because Uncle Anand was in a hurry to have it over with. Papa had a bruise on his head. I am not a doctor, but I am not a fool.</Q>
      <Q q="Who benefits from your father's death?">I don&apos;t know the will. I suppose Meera and I. I did not want his money like this.</Q>
    </StatementPaper>
  );
}

export function KapoorStatement() {
  return (
    <StatementPaper
      exhibit={10}
      envelope={2}
      name="Dr. Anand Kapoor s/o Late Dr. R. N. Kapoor"
      age={59}
      relation="Family physician (20 yrs); Trustee, Rathore Charitable Trust"
      address="'Shanti Kunj', Kulri Bazaar, Mussoorie"
      date="11.10.2026"
      time="12:40 hrs"
      place="Study, Kapoor Clinic, Kulri"
      recordedBy="Inspector R. K. Bisht, SHO"
      signature="A Kapoor"
      language="English"
    >
      <p>I have known Vikram for thirty years and been his physician for twenty. I am a trustee of the Rathore Charitable Trust and Medical Director of Rathore Memorial Hospital.</p>
      <p>Every Saturday evening I visit Hollow Pines to check his blood pressure and give his Vitamin B12 injection, which he has had weekly since 2021 for a deficiency.</p>
      <p>Yesterday I arrived at about ten minutes to nine. Vikram was a little agitated after a disagreement with Arjun but settled quickly. His BP was 142/88, which I entered on his watch app for him. I gave Inj. Methylcobalamin 1000 mcg intramuscular, in the <u>left deltoid</u>, at about five past nine.</p>
      <p>We then sat and talked about hospital matters — the dialysis wing, a staffing problem. He was in good spirits. When I left he was in his armchair with a book. I let myself out at <b>about 9.40 pm</b>. I am certain, because I was home in time for the ten o&apos;clock news. My wife Sunanda can confirm this.</p>
      <p>Vikram&apos;s heart rhythm was first found in 2014, when he spent nine days in our ICU. Meera nursed him through it — she was one of our ICU sisters in those days. That is how they met.</p>
      <p>This morning Meera telephoned at about 7.15. I found Vikram dead in the chair. In my experience, from the feel of the body and the state of the rigor, death occurred around 1 am. It was a cardiac death. He had a weak heart for many years.</p>
      <Q q="Did you give the deceased any other injection or medicine?">No. Only the B12, as always.</Q>
      <Q q="Did he mention any appointment or concern for the coming week?">No. Nothing at all.</Q>
      <Q q="Why did you advise against a post-mortem?">Out of kindness to the family. I have seen what it does to people. I still believe it is unnecessary.</Q>
    </StatementPaper>
  );
}

export function KabirStatement() {
  return (
    <StatementPaper
      exhibit={11}
      envelope={2}
      name="Shri Kabir Sethi s/o Shri Jagdish Sethi"
      age={48}
      relation="Business associate; MD, Sethi Developers Pvt. Ltd."
      address="12-A Vasant Vihar, Dehradun"
      date="11.10.2026"
      time="15:10 hrs"
      place="Office of Sethi Developers, Rajpur Road, Dehradun"
      recordedBy="SI P. Joshi, on behalf of SHO Mussoorie"
      signature="Kabir Sethi"
      language="English"
    >
      <p>I have known Vikram ji for eight years. In June he agreed in principle to sell me the lower part of Hollow Pines, about fourteen bighas below the road, for a boutique resort, Pinecrest Retreat. I have already spent nearly two crore on drawings and approvals.</p>
      <p>In the last month he went cold. He would not sign. On Friday I wrote him a strong email. I regret the tone. I was under pressure from my board, which meets on Tuesday.</p>
      <p>Last night I was at my cousin Pinky&apos;s sangeet at Hotel Madhuban, Rajpur Road, Dehradun, from about seven in the evening until half past one. There were two hundred guests. I called Vikram ji twice at about ten to apologise and to ask him not to do anything on Monday before we spoke. He did not answer. I left a voicemail.</p>
      <Q q="What did you think was happening on Monday?">He had told me on the phone on Saturday morning that he was meeting his lawyer on Monday. I assumed it was to block the sale or put the land in the Trust.</Q>
      <Q q="When were you last at Hollow Pines?">About three weeks ago, in September. Not this week.</Q>
    </StatementPaper>
  );
}

export function CctvLog() {
  const rows: [string, string, string, string, string][] = [
    ["10-10-2026", "17:23:41", "IN", "Scooter, black", "UK07-S-2291 (A. Rathore)"],
    ["10-10-2026", "18:31:02", "OUT", "Pedestrian", "Milk delivery (Doodhwala)"],
    ["10-10-2026", "19:12:55", "IN", "Pedestrian", "Mohan Lal, chowkidar, night duty"],
    ["10-10-2026", "21:10:14", "IN", "Car, silver sedan", "UK07-CK-0059 (Dr. A. Kapoor)"],
    ["10-10-2026", "21:21:20", "—", "Motion", "Animal (dog) — no entry"],
    ["10-10-2026", "21:58:37", "OUT", "Car, silver sedan", "UK07-CK-0059 (Dr. A. Kapoor)"],
    ["10-10-2026", "23:20:10", "—", "Gate closed", "Mohan Lal, rounds"],
    ["11-10-2026", "06:40:18", "—", "Gate opened", "Mohan Lal"],
    ["11-10-2026", "07:56:50", "IN", "Car, silver sedan", "UK07-CK-0059 (Dr. A. Kapoor)"],
    ["11-10-2026", "08:21:12", "IN", "Police Gypsy", "UK07-GA-1123"]
  ];
  return (
    <Paper exhibit={12} envelope={2} variant="white" width={860}>
      <div className="mono" style={{ fontSize: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>HIKSAFE NVR-8 · EVENT REGISTER</div>
            <div>site: HOLLOW PINES · channel: CAM1 GATE/DRIVE · 1080p IR</div>
            <div>range: 10-10-2026 17:00 → 11-10-2026 08:30</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>NVR time source: manual (set 09-10-2026 16:52)</div>
            <div>Examined: SI P. Joshi, 11-10-2026 13:15</div>
          </div>
        </div>
        <hr className="thin" />
        <div style={{ overflowX: "auto" }}>
          <table className="grid" style={{ fontSize: 11.5, minWidth: 600 }}>
            <thead>
              <tr><th>date</th><th>time</th><th>dir</th><th>object</th><th>identified (by IO)</th></tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} style={{ whiteSpace: j < 3 ? "nowrap" : undefined }}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 8 }}>
          # Plates read from recorded video, not ANPR. Identification by IO from RTO records.
          <br /># CAM1 covers main gate and first 20 m of drive only. Service gate (rear) not covered.
        </div>
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <Stamp rotate={2} size={11}>Copy for Bureau</Stamp>
        </div>
      </div>
    </Paper>
  );
}

export function CctvStill() {
  return (
    <Paper exhibit={13} envelope={2} variant="white" width={820}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
        <span>FRAME GRAB · CAM1 · EXPORTED BY SI P. JOSHI</span>
        <span>FRAME 21:58:37.12</span>
      </div>
      <div style={{ background: "#000", padding: 6 }}>
        <ImageSlot
          file="exhibit-13-cctv-gate.jpg"
          dark
          ratio="16 / 9"
          label="CCTV frame"
          alt="Grainy night-vision frame from the gate camera: a silver Honda City seen from behind, leaving through the open main gate, plate UK07 CK 0059 readable. Burned-in text: 10-10-2026 SAT 21:58:37 CAM1."
        />
      </div>
      <div className="small" style={{ marginTop: 12 }}>
        Silver Honda City, reg. UK07-CK-0059, registered owner Dr. Anand Kapoor, Shanti Kunj, Kulri, Mussoorie (RTO Dehradun). Vehicle exits gate heading east towards Kulri. Driver not visible. No other vehicle or pedestrian movement at the main gate between 21:10 and 23:20 (recorder time).
      </div>
    </Paper>
  );
}

type Msg = { t: string; from: "A" | "V"; text: string; status: string; deleted?: boolean };

export function ChatPrintout() {
  const msgs: Msg[] = [
    { t: "14:12", from: "A", text: "Papa landlord ne final notice de diya. 6 lakh by Tuesday or he takes the café. All of it.", status: "Read 14:38" },
    { t: "14:40", from: "V", text: "We'll talk after dinner. Not on the phone.", status: "Read 14:40" },
    { t: "14:41", from: "A", text: "Please Papa. Last time. I promise.", status: "Read 15:02" },
    { t: "16:03", from: "V", text: "After dinner. And don't make a scene in front of Meera.", status: "Read 16:05" },
    { t: "20:31", from: "A", text: "You'll regret this. I swear you will.", status: "Read 20:32" },
    { t: "20:33", from: "A", text: "Sorry. I didn't mean that. Sorry Papa.", status: "Read 20:40" },
    { t: "21:14", from: "A", text: "This message was deleted", status: "—", deleted: true },
    { t: "23:52", from: "A", text: "Papa I'm home. Can we talk tomorrow. Please don't be angry", status: "Delivered · not read" },
  ];
  return (
    <Paper exhibit={14} envelope={2} variant="white" width={720}>
      <div className="serif" style={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>EXHIBIT — PRINTOUT OF MESSAGING THREAD</div>
      <div className="small" style={{ textAlign: "center" }}>Extracted from Item 3 (deceased&apos;s mobile) by Digital Forensics Cell · Thread: &ldquo;Arjun&rdquo; (+91 98370 4•••• ) · Saturday 10 October 2026</div>
      <hr className="double" />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }} className="mono">
        <span>◀ Arjun (son)</span>
        <span>Vikram (device owner) ▶</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "V" ? "flex-end" : "flex-start" }}>
            <div
              style={{
                maxWidth: "74%",
                border: "1px solid rgba(27,22,17,.55)",
                padding: "7px 11px 5px",
                background: m.from === "V" ? "rgba(201,166,107,.18)" : "transparent",
                fontStyle: m.deleted ? "italic" : "normal",
                color: m.deleted ? "var(--ink-3)" : undefined,
              }}
            >
              <div>{m.text}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 3, textAlign: "right" }}>
                {m.t} · {m.status}
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr className="thin" />
      <div className="small">
        Examiner&apos;s note: deleted message at 21:14 not recoverable from recipient&apos;s device. Location data not attached to messages. Read receipts reflect deceased&apos;s device.
      </div>
    </Paper>
  );
}

export function CallLog() {
  const rows: [string, string, string, string, string, string][] = [
    ["07-10-2026", "16:22", "Incoming", "Adv. Harish Mehta", "+91 135 265 0912", "06:51"],
    ["08-10-2026", "11:05", "Outgoing", "Doon Valley Co-op Bank (Trust desk)", "+91 135 274 0112", "09:30"],
    ["09-10-2026", "18:40", "Incoming", "Kabir Sethi", "+91 98970 21460", "Missed"],
    ["09-10-2026", "19:02", "Incoming", "Kabir Sethi", "+91 98970 21460", "Missed"],
    ["10-10-2026", "09:14", "Outgoing", "Adv. Harish Mehta", "+91 135 265 0912", "04:12"],
    ["10-10-2026", "11:30", "Incoming", "Kabir Sethi", "+91 98970 21460", "00:48"],
    ["10-10-2026", "16:47", "Outgoing", "Anand (Dr.)", "+91 94120 51187", "01:05"],
    ["10-10-2026", "22:05", "Incoming", "Kabir Sethi", "+91 98970 21460", "Missed"],
    ["10-10-2026", "22:11", "Incoming", "Kabir Sethi", "+91 98970 21460", "Missed · voicemail 00:38"],
    ["11-10-2026", "06:58", "Incoming", "(not saved)", "+91 70172 30995", "Missed"]
  ];
  return (
    <Paper exhibit={15} envelope={2} variant="white" width={800}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div className="serif" style={{ fontSize: 18, fontWeight: 700 }}>CALL DETAIL RECORD — EXTRACT</div>
          <div className="small">Subscriber: Vikram Singh Rathore · MSISDN +91 94120 ••••7 · Operator: Jio (UP-W/UK circle)</div>
          <div className="small">Period: 07-10-2026 00:00 to 11-10-2026 08:30 · Obtained u/s 94 BNSS, Req. No. MSR/CDR/2026/77</div>
        </div>
        <Stamp rotate={-5} size={11}>Police use only</Stamp>
      </div>
      <hr className="double" />
      <div className="mono" style={{ overflowX: "auto" }}>
        <table className="grid" style={{ fontSize: 12, minWidth: 680 }}>
          <thead>
            <tr><th>Date</th><th>Time</th><th>Type</th><th>Other party (as saved)</th><th>Number</th><th>Duration</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="small" style={{ marginTop: 10 }}>
        Tower for all calls 10-10 and 11-10: MSR-0412 (Camel&apos;s Back Rd). Kabir Sethi&apos;s calls of 10-10 22:05 and 22:11 originate from tower DDN-1187 (Rajpur Road, Dehradun). The unknown number at 06:58 traced to a newspaper delivery agent.
      </div>
      <div style={{ marginTop: 12 }}>
        <F k="Verified by:" v="SI P. Joshi, 11.10.2026" />
      </div>
    </Paper>
  );
}
