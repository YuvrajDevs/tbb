import { F, Hand, Paper, Q, RoundSeal, Sign, Stamp, StatementPaper } from "./parts";
import { ImageSlot } from "../Media";

/* Exhibit 28 — NVR service report */
export function NvrReport() {
  const log: [string, string][] = [
    ["2026-10-09 14:09:51", "Power loss. Recording stopped."],
    ["(no entries)", "UPS exhausted. Unit off 14:10 – 16:40 (UPCL outage, Camel's Back Rd feeder)"],
    ["1970-01-01 00:00:04", "Boot. RTC battery low. System time reset to default."],
    ["1970-01-01 00:00:31", "NTP sync FAILED (router unreachable)"],
    ["2026-10-09 16:52:00", "System time set MANUALLY via front panel, user: admin"],
    ["2026-10-09 16:52:09", "Recording resumed, CAM1"],
    ["2026-10-09 17:00:00", "NTP sync FAILED (router config changed after outage) — repeats hourly"],
    ["2026-10-14 11:20:33", "Service login: technician T. Rawat"],
  ];
  return (
    <Paper exhibit={28} envelope={5} variant="white" width={860}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div className="serif" style={{ fontSize: 19, fontWeight: 700 }}>HIKSAFE SECURITY SOLUTIONS · DEHRADUN</div>
          <div className="small">Authorised service centre · 41 Chakrata Road · 0135 271 4410</div>
        </div>
        <div className="small" style={{ textAlign: "right" }}>
          SERVICE REPORT No. SR-26-1093<br />14-10-2026 · Site visit at request of P.S. Mussoorie
        </div>
      </div>
      <hr className="double" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", fontSize: 13 }}>
        <F k="Site:" v="Hollow Pines, Camel's Back Rd" />
        <F k="Unit:" v="NVR-8, s/n HS8-2219-0447" />
        <F k="Channel:" v="CAM1 (gate / drive)" />
        <F k="Technician:" v="Tarun Rawat" />
      </div>
      <div className="serif" style={{ fontWeight: 700, marginTop: 14 }}>1. Clock check</div>
      <table className="grid mono" style={{ fontSize: 12, marginTop: 6 }}>
        <tbody>
          <tr><th style={{ width: "44%" }}>Reference time (NTP, IST), at check</th><td>14-10-2026 11:24:00</td></tr>
          <tr><th>NVR system time, same instant</th><td>14-10-2026 11:42:02</td></tr>
          <tr><th>Offset</th><td><b>NVR FAST by 18 min 02 s</b></td></tr>
          <tr><th>Drift since manual set (5 days)</th><td>negligible (&lt; 1 s)</td></tr>
        </tbody>
      </table>
      <div className="serif" style={{ fontWeight: 700, marginTop: 14 }}>2. System event log (extract)</div>
      <table className="grid mono" style={{ fontSize: 11.5, marginTop: 6 }}>
        <thead><tr><th style={{ width: 170 }}>NVR time</th><th>Event</th></tr></thead>
        <tbody>
          {log.map(([t, e], i) => (
            <tr key={i}><td style={{ whiteSpace: "nowrap" }}>{t}</td><td>{e}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="serif" style={{ fontWeight: 700, marginTop: 14 }}>3. Finding</div>
      <p style={{ margin: "4px 0" }}>
        After the outage on 09-10-2026 the recorder could not reach its time server and the clock was set by hand from the front panel. Every timestamp burned into CAM1 footage and every entry in the event register from 09-10-2026 16:52 (NVR time) onward is <b>18 minutes 02 seconds ahead of true time</b>. The footage itself is continuous and unedited.
      </p>
      <p style={{ margin: "4px 0" }}>Chowkidar Mohan Lal states he set the recorder from the wall clock in the guard hut. That clock, checked at 11:30 today, is 18 minutes fast. He keeps it fast &ldquo;so I am never late for my rounds&rdquo;.</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14, flexWrap: "wrap", gap: 10 }}>
        <div>
          <Sign style={{ fontSize: 28 }}>Tarun Rawat</Sign>
          <div className="small">Service Engineer</div>
        </div>
        <Stamp rotate={-4} size={12}>Clock corrected 14.10.26</Stamp>
      </div>
    </Paper>
  );
}

/* Exhibit 29 — Chowkidar's gate register */
export function GateRegister() {
  const rows: [string, string, string][] = [
    ["9/10", "2.00", "Bijli gayi"],
    ["", "4.40", "Bijli aayi. Camera band tha — chalu kiya, ghadi hut wali ghadi se mila di"],
    ["10/10", "5.05", "Arjun baba scooter andar"],
    ["", "6.15", "Doodhwala"],
    ["", "6.55", "Duty shuru — Mohan Lal"],
    ["", "8.50", "Doctor sahib gaadi andar (UK07 CK 0059)"],
    ["", "9.40", "Doctor sahib gaadi bahar"],
    ["", "11.00", "Gate band. Sab theek"],
    ["", "12.00", "Bholu bhaunka, peeche wala gate. Dekha — koi nahi"],
    ["11/10", "6.20", "Gate khola"],
    ["", "7.40", "Doctor sahib gaadi andar"],
    ["", "8.05", "Police jeep andar"],
  ];
  return (
    <Paper exhibit={29} envelope={5} variant="ruled" width={720} style={{ paddingLeft: 78 }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 58, width: 1.5, background: "rgba(110,47,28,.45)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--serif)", fontSize: 12, color: "var(--ink-3)", marginTop: -20, marginBottom: 6 }}>
        <span>GATE REGISTER · HOLLOW PINES</span>
        <span>Page 61</span>
      </div>
      <table style={{ lineHeight: "28px" }}>
        <tbody>
          {rows.map(([d, t, e], i) => (
            <tr key={i}>
              <td style={{ width: 64, verticalAlign: "top" }}><Hand style={{ lineHeight: "28px" }}>{d}</Hand></td>
              <td style={{ width: 64, verticalAlign: "top" }}><Hand style={{ lineHeight: "28px" }}>{t}</Hand></td>
              <td><Hand style={{ lineHeight: "28px" }}>{e}</Hand></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 18, borderLeft: "3px solid var(--ink)", paddingLeft: 12, fontSize: 13 }}>
        <div className="serif" style={{ fontWeight: 700 }}>Translation and note (IO)</div>
        <p style={{ margin: "4px 0" }}>9/10: &ldquo;2.00 Power went. 4.40 Power came. Camera was off — switched it on, set its clock by the clock in the hut.&rdquo; 10/10: &ldquo;8.50 Doctor sahib car in. 9.40 Doctor sahib car out. 11.00 Gate shut, all well. 12.00 Bholu barked at the back gate; looked, nobody.&rdquo; 11/10: &ldquo;7.40 Doctor sahib car in. 8.05 Police jeep in.&rdquo;</p>
        <p style={{ margin: "4px 0" }}>Mohan Lal writes his entries from the clock on his mobile phone, and on his own admission they are &ldquo;roughly&rdquo; timed, to the nearest few minutes. See Exhibit 28 for the hut clock.</p>
        <Sign style={{ fontSize: 26 }}>R. K. Bisht</Sign>
      </div>
    </Paper>
  );
}

/* Exhibit 30 — Statement of Sunanda Kapoor */
export function SunandaStatement() {
  return (
    <StatementPaper
      exhibit={30}
      envelope={5}
      name="Smt. Sunanda Kapoor w/o Dr. Anand Kapoor"
      age={56}
      relation="Wife of Dr. Anand Kapoor (trustee)"
      address="'Shanti Kunj', Kulri Bazaar, Mussoorie"
      date="14.10.2026"
      time="10:15 hrs"
      place="Drawing room, Shanti Kunj"
      recordedBy="Inspector R. K. Bisht, SHO"
      signature="Sunanda K."
      language="Hindi / English"
    >
      <p>My husband goes to Hollow Pines every Saturday evening. On Saturday he came home at about ten to ten. I remember because I had put the dal on for him and the ten o&apos;clock news had not yet started. He sat with me and watched the news. He was very quiet.</p>
      <p>At about quarter past ten his phone rang. He looked at it and went out into the garden to take it. He was out there a long time, perhaps ten minutes, in the cold, without his shawl. When he came in he looked grey. I asked who it was. He said, &ldquo;A patient. Nothing.&rdquo;</p>
      <p>He did not sleep. I heard him walking downstairs until late.</p>
      <Q q="Do you know anything of a firm called Kapoor Diagnostics?">No. I have never heard the name. My husband does not discuss money with me.</Q>
      <Q q="Who lives in the first-floor flat of this house?">Nobody, for years now. It is kept locked. Anand has the key.</Q>
    </StatementPaper>
  );
}

/* Exhibit 31 — Second statement of Dr. Anand Kapoor */
export function KapoorSecond() {
  return (
    <StatementPaper
      exhibit={31}
      envelope={5}
      name="Dr. Anand Kapoor s/o Late Dr. R. N. Kapoor"
      age={59}
      relation="Family physician; Trustee, Rathore Charitable Trust"
      address="'Shanti Kunj', Kulri Bazaar, Mussoorie"
      date="14.10.2026"
      time="15:00 hrs"
      place="P.S. Mussoorie, in presence of counsel Shri V. Dobhal"
      recordedBy="Inspector R. K. Bisht, SHO"
      signature="A Kapoor"
      language="English"
    >
      <p>I make this statement voluntarily and against the advice of my counsel.</p>
      <p>Kapoor Diagnostics LLP is a firm I set up in June 2025. It has never done a single test. I approved its invoices to the Trust as Medical Trustee, every month, for fourteen months. The money — about one crore eighty-four lakh — is gone. I lost a great deal in the markets and I was ashamed. That is the whole of it.</p>
      <p>The second partner&apos;s name, Nisha, belongs to a member of my family. I used it to file the papers. She knew nothing. I will not name her further.</p>
      <p>When the bank wrote on Thursday that Vikram had asked for fourteen months of statements, I knew it was over. On Friday I drew two ampoules of potassium chloride from the pharmacy. I meant them for myself, if it came out on Monday. On Saturday night I lost my nerve and flushed both of them away at home.</p>
      <p>I did not harm Vikram. I gave him his B12 and I left at 9.40, as I told you on Sunday. You have my car on your camera.</p>
      <Q q="Did anyone telephone you on Saturday night after you got home?">No. Nobody.</Q>
      <Q q="Then why did you tell the family a post-mortem was unnecessary?">Because I knew what you would find in the Trust accounts once you started looking. I wanted it all to stop.</Q>
    </StatementPaper>
  );
}

/* Exhibit 32 — Meera's handset call log */
export function MeeraCallLog() {
  const rows: [string, string, string, string, string, string][] = [
    ["08-10-2026", "11:47", "Outgoing", "Bhaiya", "+91 94120 51187", "08:20"],
    ["09-10-2026", "20:15", "Outgoing", "Bhaiya", "+91 94120 51187", "02:02"],
    ["10-10-2026", "13:22", "Outgoing", "Bhaiya", "+91 94120 51187", "03:40"],
    ["10-10-2026", "18:05", "Incoming", "Ritu (salon)", "+91 99171 04432", "01:10"],
    ["10-10-2026", "22:14", "Outgoing", "Bhaiya", "+91 94120 51187", "06:12"],
    ["11-10-2026", "07:14", "Outgoing", "Bhaiya", "+91 94120 51187", "01:02"],
    ["11-10-2026", "07:29", "Outgoing", "P.S. Mussoorie", "+91 135 263 2013", "02:15"],
    ["11-10-2026", "09:52", "Incoming", "Bhaiya", "+91 94120 51187", "Declined"],
  ];
  return (
    <Paper exhibit={32} envelope={5} variant="white" width={820}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div className="serif" style={{ fontSize: 18, fontWeight: 700 }}>HANDSET EXTRACTION — CALL HISTORY</div>
          <div className="small">Device: Item 9, mobile phone (rose gold) of Smt. Meera Rathore, seized 13.10.2026 under seizure memo</div>
          <div className="small">Extracted by Digital Forensics Cell, Dehradun · Report DFC/MSR/2026/331 · Names as saved on the handset</div>
        </div>
        <Stamp rotate={-5} size={11}>Police use only</Stamp>
      </div>
      <hr className="double" />
      <div className="mono" style={{ overflowX: "auto" }}>
        <table className="grid" style={{ fontSize: 12, minWidth: 640 }}>
          <thead>
            <tr><th>Date</th><th>Time</th><th>Type</th><th>Contact</th><th>Number</th><th>Duration</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="small" style={{ marginTop: 10 }}>
        Cell site for the calls of 10-10 22:14 and 11-10 07:14: MSR-0412, Camel&apos;s Back Road — the cell that serves Hollow Pines. Wi-Fi log shows the handset connected to &ldquo;HollowPines_Study&rdquo; access point from 21:39 to 22:47 on 10-10-2026, then &ldquo;HollowPines_Upstairs&rdquo; from 22:48.
      </div>
      <div className="small" style={{ marginTop: 6 }}>Call log for 10-10 between 21:00 and 22:14 shows no entries. Recent-calls list on the handset itself had been cleared; the above was recovered from the device database.</div>
      <div style={{ marginTop: 12 }}>
        <F k="Examiner:" v="Insp. (Tech.) G. Rana, DFC" />
      </div>
    </Paper>
  );
}

/* Exhibit 33 — Nursing service card */
export function ServiceCard() {
  return (
    <Paper exhibit={33} envelope={5} variant="aged" width={760}>
      <div style={{ textAlign: "center" }}>
        <div className="serif" style={{ fontSize: 17, fontWeight: 700, letterSpacing: ".06em" }}>RATHORE MEMORIAL HOSPITAL, DEHRADUN</div>
        <div className="serif small">Nursing Establishment · Service Record Card</div>
      </div>
      <hr className="double" />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 150px", gap: 20, alignItems: "start" }} className="tag-grid">
        <div>
          <F k="Card No.:" v="NE/2011/0318" />
          <F k="Name:" v={<Hand style={{ fontSize: 21 }}>Nisha Meera Kapoor</Hand>} />
          <F k="Father's name:" v={<Hand style={{ fontSize: 21 }}>Dr. R. N. Kapoor (late)</Hand>} />
          <F k="Date of birth:" v={<Hand style={{ fontSize: 21 }}>22-07-1980</Hand>} />
          <F k="Address:" v={<Hand style={{ fontSize: 21 }}>1st floor, &lsquo;Shanti Kunj&rsquo;, Kulri, Mussoorie</Hand>} />
          <F k="Post:" v={<Hand style={{ fontSize: 21 }}>Staff Nurse Gr. II, ICU / CCU</Hand>} />
          <F k="Qualification:" v={<Hand style={{ fontSize: 21 }}>B.Sc. Nursing, CMC Ludhiana (2003)</Hand>} />
          <F k="Emergency contact:" v={<Hand style={{ fontSize: 21 }}>Dr. Anand Kapoor (brother), ext. 201</Hand>} />
        </div>
        <div>
          <div style={{ border: "1px solid var(--ink-2)", padding: 4, background: "#f1e9d8" }}>
            <ImageSlot file="exhibit-33-id-photo.jpg" ratio="4 / 5" label="ID photo" alt="Worn 2011 ID photo of a young woman in a white nurse's uniform and cap, with a small nose stud; water damage and scratches have worn away her eyes and upper face." />
          </div>
          <div className="small" style={{ textAlign: "center", marginTop: 4 }}>Attested</div>
        </div>
      </div>
      <div className="serif" style={{ fontWeight: 700, marginTop: 14 }}>Competencies certified</div>
      <table className="grid small" style={{ marginTop: 6 }}>
        <thead><tr><th>Competency</th><th style={{ width: 110 }}>Date</th><th style={{ width: 130 }}>Assessor</th></tr></thead>
        <tbody>
          <tr><td>Peripheral IV cannulation &amp; venepuncture</td><td>06/2011</td><td>Sr. Tutor M. Joseph</td></tr>
          <tr><td>Administration of high-alert IV drugs, incl. concentrated electrolytes (KCl)</td><td>11/2011</td><td>Dr. A. Kapoor</td></tr>
          <tr><td>Cardiac monitoring &amp; arrhythmia recognition</td><td>02/2012</td><td>Dr. A. Kapoor</td></tr>
          <tr><td>Basic &amp; advanced life support</td><td>2012, 2014</td><td>AHA instructor</td></tr>
        </tbody>
      </table>
      <div className="serif" style={{ fontWeight: 700, marginTop: 14 }}>Service</div>
      <p style={{ margin: "4px 0" }}><Hand style={{ fontSize: 20 }}>Joined 01-03-2011. Excellent record. Nursed Bed 4 (Mr. V.S. Rathore, AF) Nov 2014. Resigned 31-01-2015 on marriage.</Hand></p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10 }}>
        <div>
          <Sign style={{ fontSize: 26 }}>M. Joseph</Sign>
          <div className="small">Nursing Superintendent</div>
        </div>
        <RoundSeal top="RATHORE MEMORIAL HOSP." bottom="NURSING ESTT." center="RMH" size={86} rotate={-10} />
      </div>
      <div className="small muted" style={{ marginTop: 8 }}>Retrieved from hospital personnel archive, 14.10.2026, SI P. Joshi.</div>
    </Paper>
  );
}

/* Exhibit 34 — Wedding photograph */
export function WeddingPhoto() {
  return (
    <Paper exhibit={34} envelope={5} variant="white" width={760}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
        <span>PHOTOGRAPH, FRAMED · FROM THE DRAWING ROOM, HOLLOW PINES</span>
        <span>SEIZED 14.10.2026</span>
      </div>
      <div style={{ background: "#fff", padding: "14px 14px 40px", boxShadow: "0 6px 18px rgba(0,0,0,.18)", transform: "rotate(-.6deg)" }}>
        <ImageSlot
          file="exhibit-34-wedding.jpg"
          ratio="3 / 2"
          label="Wedding photograph"
          alt="Colour photo, February 2015, taken from behind at a garden wedding at Hollow Pines: the groom in a cream sherwani and turban, the bride in a red lehenga, and beside her a man in a saffron turban with his hand on her shoulder, before a marigold mandap."
        />
      </div>
      <div style={{ marginTop: 22 }}>
        <div className="serif" style={{ fontWeight: 700, fontSize: 14 }}>Written on the back of the print</div>
        <div style={{ border: "1px solid rgba(27,22,17,.3)", padding: "14px 18px", marginTop: 6, background: "#f3ecdd" }}>
          <Hand style={{ display: "block", fontSize: 23 }}>Nisha &amp; Vikram — 14th Feb 2015, Hollow Pines.</Hand>
          <Hand style={{ display: "block", fontSize: 23 }}>Bhaiya did the kanyadaan. Papa would have cried.</Hand>
        </div>
      </div>
    </Paper>
  );
}
