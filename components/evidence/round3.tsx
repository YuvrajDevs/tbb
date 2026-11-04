"use client";

import { useEffect, useRef, useState } from "react";
import { F, Hand, Paper, RoundSeal, Sign, Stamp } from "./parts";
import { Glyph } from "../Icons";

export function PostMortem() {
  return (
    <Paper exhibit={16} envelope={3} punch>
      <div style={{ textAlign: "center" }}>
        <div className="serif small" style={{ letterSpacing: ".2em" }}>GOVERNMENT DOON MEDICAL COLLEGE &amp; HOSPITAL, DEHRADUN</div>
        <div className="serif small">Department of Forensic Medicine &amp; Toxicology</div>
        <div className="serif" style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>Post-Mortem Examination Report</div>
      </div>
      <hr className="double" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <F k="P.M. No.:" v="418 / 2026" />
        <F k="Requisition:" v="P.S. Mussoorie, Inq. 11/2026" />
        <F k="Body received:" v="11.10.2026, 14:10 hrs" />
        <F k="Examination:" v="12.10.2026, 10:30–12:45 hrs" />
        <F k="Name:" v="Vikram Singh Rathore" />
        <F k="Age / Sex:" v="64 / M" />
        <F k="Identified by:" v="Arjun Rathore (son)" />
        <F k="Height / Wt.:" v="172 cm / 78 kg" />
      </div>
      <div className="serif" style={{ fontWeight: 700, marginTop: 14 }}>A. General</div>
      <p style={{ margin: "4px 0" }}>Rigor mortis passing off from jaw and neck, present in limbs. Post-mortem lividity fixed, present over <u>back and right side of trunk, right arm and right side of face</u>; faint over backs of thighs. Pattern indicates the body lay on its right side for some time after death and was later placed in a sitting position.</p>
      <div className="serif" style={{ fontWeight: 700, marginTop: 12 }}>B. External injuries</div>
      <div className="tag-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 190px", gap: 18, alignItems: "start" }}>
        <ol style={{ margin: "4px 0", paddingLeft: 22 }}>
          <li>Abrasion 1.5 × 0.5 cm over right temple, reddish, ante-mortem. Consistent with a fall against a hard edge.</li>
          <li>Needle puncture, left deltoid, with small intramuscular bruise 1 cm. Consistent with an <b>intramuscular</b> injection within 24 hours of death.</li>
          <li><b>Fresh needle puncture over left antecubital fossa, entering the median cubital vein</b>, with surrounding bruise 0.5 cm. Ante-mortem. No record of IV line, blood test or cannula in the medical history provided.</li>
        </ol>
        <svg viewBox="0 0 120 240" width="100%" aria-label="Body diagram marking injuries" style={{ border: "1px solid rgba(27,22,17,.4)", background: "#f7f3ea" }}>
          <g fill="none" stroke="#1b1611" strokeWidth="1.2">
            <circle cx="60" cy="26" r="15" />
            <path d="M45 44 Q60 50 75 44 L92 54 L104 116 L96 118 L84 70 L82 128 L88 226 L70 226 L62 140 L58 140 L50 226 L32 226 L38 128 L36 70 L24 118 L16 116 L28 54 Z" />
          </g>
          <g fontFamily="Courier Prime, monospace" fontSize="9" fill="#6e2f1c" fontWeight="700">
            <circle cx="47" cy="22" r="4" fill="none" stroke="#6e2f1c" strokeWidth="1.5" />
            <text x="22" y="16">1</text>
            {/* left side of body = viewer's right */}
            <circle cx="88" cy="60" r="4" fill="none" stroke="#6e2f1c" strokeWidth="1.5" />
            <text x="96" y="56">2</text>
            <circle cx="95" cy="90" r="4" fill="none" stroke="#6e2f1c" strokeWidth="1.5" />
            <text x="103" y="94">3</text>
          </g>
          <text x="60" y="236" textAnchor="middle" fontFamily="Courier Prime, monospace" fontSize="8">ANTERIOR</text>
        </svg>
      </div>
      <div className="serif" style={{ fontWeight: 700, marginTop: 12 }}>C. Internal examination</div>
      <p style={{ margin: "4px 0" }}><b>Heart</b> 410 g, left ventricular hypertrophy. Coronaries: moderate atheroma, LAD narrowed ~40%. <u>No fresh thrombus. No infarct, recent or old.</u> Findings are not in themselves sufficient to explain death.</p>
      <p style={{ margin: "4px 0" }}><b>Stomach</b> ~200 ml partly digested rice, dal and vegetables; particles identifiable. Suggests death within about two to three hours of the last meal.</p>
      <p style={{ margin: "4px 0" }}><b>Brain, lungs, liver, kidneys</b>: congestion only. No intracranial bleed beneath the temple abrasion.</p>
      <div className="serif" style={{ fontWeight: 700, marginTop: 12 }}>D. Laboratory (preliminary)</div>
      <table className="grid small" style={{ marginTop: 6 }}>
        <thead><tr><th>Sample</th><th>Test</th><th>Result</th></tr></thead>
        <tbody>
          <tr><td>Vitreous humour</td><td>Potassium</td><td>15.9 mmol/L — <b>above</b> range expected for interval since death</td></tr>
          <tr><td>Tissue, L antecubital site</td><td>Potassium vs. control (R arm)</td><td>Markedly raised at injection site (×3.4 control)</td></tr>
          <tr><td>Blood (femoral)</td><td>Metoprolol, apixaban</td><td>Therapeutic levels</td></tr>
          <tr><td>Blood (femoral)</td><td>Zolpidem, benzodiazepines, alcohol</td><td>Not detected</td></tr>
          <tr><td>Blood (femoral)</td><td>Vitamin B12</td><td>Raised, consistent with recent injection</td></tr>
          <tr><td>Item 1 (milk)</td><td>General toxic screen</td><td>Nothing abnormal detected</td></tr>
        </tbody>
      </table>
      <div className="serif" style={{ fontWeight: 700, marginTop: 12 }}>E. Opinion</div>
      <p style={{ margin: "4px 0" }}>
        Time since death at examination: about 36–40 hours. Taking stomach contents into account, death most probably occurred <b>between 21:00 and 23:00 hrs on 10.10.2026</b>.
      </p>
      <p style={{ margin: "4px 0" }}>
        Cause of death: <b>cardiac arrhythmia due to acute hyperkalaemia following intravenous injection of potassium salt</b>, in a person with underlying hypertensive heart disease. An intramuscular vitamin injection is not given into a vein. Manner: to be determined by investigation; findings are not consistent with natural death.
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16, flexWrap: "wrap", gap: 12 }}>
        <RoundSeal top="DEPT. FORENSIC MEDICINE" bottom="G.D.M.C. DEHRADUN" center="PM" size={90} />
        <div style={{ textAlign: "right" }}>
          <Sign>S. Rawal</Sign>
          <div className="small">Dr. Shalini Rawal, MD (Forensic Med.)</div>
          <div className="small">Associate Professor &amp; Autopsy Surgeon</div>
        </div>
      </div>
    </Paper>
  );
}

export function EvidenceTag() {
  return (
    <Paper exhibit={17} envelope={3} variant="white" width={760}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", gap: 22, alignItems: "center" }} className="tag-grid">
        <svg viewBox="0 0 360 300" width="100%" role="img" aria-label="Clear evidence bag holding scorched glass fragments of an ampoule">
          <defs>
            <linearGradient id="bag" x1="0" x2="1">
              <stop offset="0" stopColor="#e9e3d6" stopOpacity=".6" />
              <stop offset=".5" stopColor="#ffffff" stopOpacity=".2" />
              <stop offset="1" stopColor="#d9d1c0" stopOpacity=".6" />
            </linearGradient>
          </defs>
          <rect x="20" y="20" width="320" height="260" fill="#f1e9d8" />
          <rect x="40" y="36" width="280" height="230" rx="4" fill="url(#bag)" stroke="#7a6a55" />
          <rect x="40" y="36" width="280" height="22" fill="#1b1611" />
          <text x="180" y="51" textAnchor="middle" fill="#f1e9d8" fontFamily="Courier Prime, monospace" fontSize="11" letterSpacing="2">EVIDENCE · DO NOT OPEN</text>
          {/* ash dusting */}
          {[...Array(40)].map((_, i) => (
            <circle key={i} cx={70 + ((i * 53) % 220)} cy={180 + ((i * 29) % 70)} r={1 + (i % 3)} fill="#6f665c" opacity=".35" />
          ))}
          {/* ampoule body fragment */}
          <g transform="translate(120 120) rotate(-18)">
            <path d="M0 0 H86 Q96 0 96 10 V40 Q96 50 86 50 H0 L6 38 L-2 26 L5 14Z" fill="#cfc8ba" stroke="#4a4038" />
            <rect x="12" y="10" width="70" height="30" fill="#f1e9d8" opacity=".85" />
            <text x="16" y="21" fontFamily="JetBrains Mono, monospace" fontSize="7.4" fill="#1b1611">…ASSIUM CHLORI…</text>
            <text x="16" y="30" fontFamily="JetBrains Mono, monospace" fontSize="7.4" fill="#1b1611">INJ. 15% w/v 10ml</text>
            <text x="16" y="38" fontFamily="JetBrains Mono, monospace" fontSize="6.4" fill="#1b1611">B.No. KC26… EXP 03/28</text>
            <path d="M40 0 L50 50" stroke="#1b1611" strokeWidth=".6" opacity=".4" />
            <ellipse cx="70" cy="44" rx="10" ry="4" fill="#3e3226" opacity=".35" />
          </g>
          {/* ampoule neck */}
          <g transform="translate(232 196) rotate(28)">
            <path d="M0 0 Q10 -4 20 0 L22 10 Q30 12 30 22 L-10 22 Q-10 12 -2 10Z" fill="#cfc8ba" stroke="#4a4038" />
            <line x1="-6" y1="14" x2="26" y2="14" stroke="#6e2f1c" strokeWidth="2" />
          </g>
          {/* small shards */}
          <path d="M90 214 l10 -6 l4 10z" fill="#cfc8ba" stroke="#4a4038" />
          <path d="M270 120 l8 4 l-6 8z" fill="#cfc8ba" stroke="#4a4038" />
          {/* scale */}
          <g transform="translate(60 250)">
            <rect width="100" height="8" fill="#f1e9d8" stroke="#1b1611" strokeWidth=".6" />
            {[...Array(11)].map((_, i) => <rect key={i} x={i * 10} width=".8" height={i % 5 === 0 ? 6 : 3} fill="#1b1611" />)}
            <text x="106" y="8" fontSize="8" fontFamily="Courier Prime, monospace">1 cm</text>
          </g>
        </svg>
        <div style={{ position: "relative" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #7a6a55", position: "absolute", top: 12, left: 12, background: "#f1e9d8" }} />
          <div style={{ background: "#c9a66b", padding: "44px 18px 18px", clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%, 0 14%)", color: "#1b1611" }}>
            <div className="serif" style={{ fontWeight: 700, fontSize: 18, letterSpacing: ".1em" }}>EVIDENCE TAG</div>
            <div className="small">P.S. Mussoorie · Malkhana Reg. 2026/219</div>
            <hr />
            <F k="Item No.:" v="5-A (from Item 5, ash)" />
            <F k="Description:" v="Glass fragments, ampoule body with printed label, broken neck with brown ring" />
            <F k="Found at:" v="Study grate, Hollow Pines" />
            <F k="Recovered:" v="On sieving ash, 12.10.2026, 09:15" />
            <F k="By:" v="HC D. Rawat No. 412" />
            <F k="Witness:" v="Sunita Negi" />
            <F k="Sent to:" v="FSL Dehradun — chemical, fingerprints" />
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Hand style={{ fontSize: 18 }}>prints unlikely — fire</Hand>
              <Stamp rotate={-8} size={11}>Sealed</Stamp>
            </div>
          </div>
        </div>
      </div>
      <div className="small" style={{ marginTop: 14 }}>
        IO note: Potassium Chloride Inj. is a hospital-only concentrate, diluted in IV fluid before use. Not stocked by chemists in Mussoorie. Not prescribed to the deceased. No ampoules of any kind found elsewhere in the study.
      </div>
    </Paper>
  );
}

export function DispensaryRegister() {
  const rows: { t: string; item: string; qty: string; batch: string; to: string; by: string; counter: string; flag?: boolean }[] = [
    { t: "08:40", item: "Inj. Ceftriaxone 1 g", qty: "10 vials", batch: "CF2591", to: "Ward 2 (Gen. Med.)", by: "Sr. Mary T.", counter: "Mary T. ✓" },
    { t: "09:55", item: "Inj. Pantoprazole 40 mg", qty: "20 vials", batch: "PZ2617", to: "Ward 1 (Surgery)", by: "Br. Rakesh", counter: "R.K. ✓" },
    { t: "10:15", item: "Inj. Methylcobalamin 1000 mcg", qty: "1 amp", batch: "MB2602", to: "OPD — private pt. (V.S.R.)", by: "Dr. A. Kapoor", counter: "A.K." },
    { t: "10:16", item: "Inj. Potassium Chloride 15% w/v 10 ml", qty: "2 amps", batch: "KC2604", to: "Ward 3 — stock top-up", by: "Dr. A. Kapoor", counter: "", flag: true },
    { t: "11:30", item: "Inj. Human Insulin 40 IU", qty: "4 vials", batch: "HI2588", to: "ICU", by: "Sr. Bindu", counter: "Bindu ✓" },
    { t: "14:05", item: "Inj. Ondansetron 4 mg", qty: "10 amps", batch: "ON2610", to: "Ward 3", by: "Sr. Kamla", counter: "Kamla ✓" },
  ];
  return (
    <Paper exhibit={18} envelope={3} variant="aged" width={900}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div className="serif" style={{ fontSize: 18, fontWeight: 700 }}>RATHORE MEMORIAL HOSPITAL, DEHRADUN</div>
          <div className="serif">Central Pharmacy · Indent &amp; Issue Register — Injectables (Book 7)</div>
        </div>
        <div className="small" style={{ textAlign: "right" }}>Page 143<br />Date: <Hand style={{ fontSize: 20 }}>Fri 09/10/26</Hand></div>
      </div>
      <hr className="double" />
      <div style={{ overflowX: "auto" }}>
        <table className="grid" style={{ fontSize: 12.5, minWidth: 720 }}>
          <thead>
            <tr><th>Time</th><th>Item</th><th>Qty</th><th>Batch</th><th>Issued to / for</th><th>Received by</th><th>Ward countersign</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td><Hand style={{ fontSize: 19 }}>{r.t}</Hand></td>
                <td><Hand style={{ fontSize: 19 }}>{r.item}</Hand></td>
                <td><Hand style={{ fontSize: 19 }}>{r.qty}</Hand></td>
                <td><Hand style={{ fontSize: 19 }}>{r.batch}</Hand></td>
                <td><Hand style={{ fontSize: 19 }}>{r.to}</Hand></td>
                <td><Sign style={{ fontSize: 24 }}>{r.by}</Sign></td>
                <td style={r.flag ? { background: "rgba(110,47,28,.08)" } : undefined}>
                  {r.counter ? <Hand style={{ fontSize: 19 }}>{r.counter}</Hand> : <span className="small muted">— blank —</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 18, borderLeft: "3px solid var(--stamp)", paddingLeft: 12 }}>
        <Hand brown style={{ fontSize: 20, display: "block" }}>
          12/10 — Checked with Sr. Kamla, Ward 3: no KCl indent raised by ward this week. Ward 3 KCl stock on 09/10 = 12 amps (full). 2 amps KC2604 not received on ward. Reported to MS.
        </Hand>
        <div style={{ marginTop: 6 }}>
          <Sign style={{ fontSize: 26 }}>R. Uniyal</Sign> <span className="small">Chief Pharmacist</span>
        </div>
      </div>
      <div style={{ textAlign: "right", marginTop: 8 }}>
        <Stamp rotate={-3} size={11}>Photocopy · seized 12.10.26</Stamp>
      </div>
    </Paper>
  );
}

export function BarReceipt() {
  const items: [string, number, number][] = [
    ["Old Monk (L) 60ml", 3, 240],
    ["Kingfisher Premium 650", 2, 310],
    ["Chicken momos (steam)", 1, 260],
    ["Masala peanuts", 1, 140],
    ["Old Monk (L) 60ml", 2, 240],
  ];
  const sub = items.reduce((s, [, q, p]) => s + q * p, 0);
  const gst = Math.round(sub * 0.18);
  const total = sub + gst;
  return (
    <Paper exhibit={19} envelope={3} variant="white" width={760}>
      <div className="tag-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,300px) minmax(0,1fr)", gap: 28, alignItems: "start" }}>
        <div
          className="mono"
          style={{
            background: "#fbf8f1",
            padding: "20px 16px 26px",
            fontSize: 11.5,
            lineHeight: 1.45,
            boxShadow: "0 6px 16px rgba(0,0,0,.18)",
            transform: "rotate(-1.5deg)",
            clipPath: "polygon(0 0,100% 0,100% 97%,95% 100%,90% 97%,85% 100%,80% 97%,75% 100%,70% 97%,65% 100%,60% 97%,55% 100%,50% 97%,45% 100%,40% 97%,35% 100%,30% 97%,25% 100%,20% 97%,15% 100%,10% 97%,5% 100%,0 97%)",
          }}
        >
          <div style={{ textAlign: "center", fontWeight: 600 }}>THE CLOCKTOWER</div>
          <div style={{ textAlign: "center" }}>BAR &amp; GRILL</div>
          <div style={{ textAlign: "center" }}>Below Clock Tower, Mall Rd</div>
          <div style={{ textAlign: "center" }}>Landour, Mussoorie 248179</div>
          <div style={{ textAlign: "center" }}>GSTIN 05AHKPC7712R1Z4</div>
          <div>--------------------------------</div>
          <div>TAB #0937        TABLE 7 (BAR)</div>
          <div>GUEST: ARJUN R.</div>
          <div>OPENED: 10/10/26 21:12</div>
          <div>CLOSED: 10/10/26 23:48</div>
          <div>SERVER: RAVI</div>
          <div>--------------------------------</div>
          {items.map(([n, q, p], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{q} x {n}</span>
              <span>{(q * p).toFixed(2)}</span>
            </div>
          ))}
          <div>--------------------------------</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>SUBTOTAL</span><span>{sub.toFixed(2)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>CGST 9% + SGST 9%</span><span>{gst.toFixed(2)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}><span>TOTAL ₹</span><span>{total.toFixed(2)}</span></div>
          <div>--------------------------------</div>
          <div>UPI 21:40  ****  DECLINED</div>
          <div>UPI 23:46  ****  DECLINED</div>
          <div>CASH 23:48          2000.00</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}><span>BALANCE ON ACCT</span><span>{(total - 2000).toFixed(2)}</span></div>
          <div>--------------------------------</div>
          <div style={{ textAlign: "center" }}>THANK YOU · VISIT AGAIN</div>
          <Hand style={{ fontSize: 17, display: "block", marginTop: 6 }}>Arjun bhai — pay by Sunday!! — Ravi</Hand>
        </div>
        <div>
          <div className="serif" style={{ fontWeight: 700, fontSize: 17 }}>Police note, attached to receipt</div>
          <hr className="thin" />
          <p>Receipt produced voluntarily by Shri Arjun Rathore at P.S. Mussoorie on 12.10.2026 at 16:30 hrs, who withdrew the portion of his earlier statement (Exhibit 9) that he stayed in his room.</p>
          <p>He now states he left Hollow Pines at about 8.45 pm on foot <b>by the service gate</b> into the back lane, so that his father would not see him go, and walked to the Clocktower Bar. He returned the same way at about 11.55 pm. He lied because he did not want it known he had run up another unpaid tab.</p>
          <p>Bar owner and server Ravi Panwar confirm Arjun was at the bar counter continuously from about 9.10 pm until about 11.45 pm. Bar CCTV (internal) reviewed: confirms.</p>
          <div style={{ marginTop: 14 }}>
            <Sign style={{ fontSize: 28 }}>R. K. Bisht</Sign>
            <div className="small">Inspector / SHO</div>
          </div>
        </div>
      </div>
    </Paper>
  );
}

const VM_LINES: [string, string][] = [
  ["00:00", "[Loud dhol and film music in background. Crowd noise.]"],
  ["00:02", "Vikram, it's Kabir. Again."],
  ["00:05", "Look, I know you're angry about the email. I shouldn't have written it like that."],
  ["00:11", "But pick up, yaar. We need to talk before Monday. Before you say anything to anyone."],
  ["00:19", "Call me back. Tonight, please."],
  ["00:23", "[Pause. Someone shouts 'Kabir bhaiya, photo!']"],
  ["00:27", "I'm at Pinky's sangeet, it's mad here, but I'll step out. Call me."],
  ["00:38", "[End of message]"],
];

export function Voicemail({ transcript }: { transcript?: string }) {
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const tick = useRef<number | null>(null);

  const stop = () => {
    setPlaying(false);
    if (tick.current) window.clearInterval(tick.current);
    try { window.speechSynthesis?.cancel(); } catch {}
  };

  useEffect(() => stop, []);

  const play = () => {
    if (playing) return stop();
    setPlaying(true);
    setPos(0);
    try {
      if (transcript && "speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(transcript);
        u.rate = 1.02;
        u.pitch = 0.85;
        u.onend = () => stop();
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      }
    } catch {}
    const start = Date.now();
    tick.current = window.setInterval(() => {
      const s = (Date.now() - start) / 1000;
      if (s >= 38) { setPos(38); stop(); } else setPos(s);
    }, 200);
  };

  const bars = Array.from({ length: 76 }, (_, i) => 6 + Math.abs(Math.sin(i * 1.7) * 18 + Math.sin(i * 0.37) * 10));
  const mm = (s: number) => `00:${String(Math.floor(s)).padStart(2, "0")}`;

  return (
    <Paper exhibit={20} envelope={3} variant="white" width={760}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div className="serif" style={{ fontSize: 18, fontWeight: 700 }}>AUDIO EXHIBIT — VOICEMAIL</div>
          <div className="small mono">VM_20261010_221104.m4a · 00:38 · AAC 64 kbps mono</div>
          <div className="small">From: Kabir Sethi (+91 98970 2••••) · To: Vikram Rathore · Left: Sat 10.10.2026, 22:11</div>
        </div>
        <Stamp rotate={4} size={11}>Transcribed</Stamp>
      </div>
      <hr className="double" />
      <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", border: "1px solid rgba(27,22,17,.5)", background: "rgba(27,22,17,.04)" }}>
        <button onClick={play} aria-label={playing ? "Stop" : "Play"} style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid #1b1611", background: "#1b1611", color: "#f1e9d8", display: "grid", placeItems: "center", cursor: "pointer", flex: "none" }}>
          {playing ? Glyph.pause : Glyph.play}
        </button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 2, height: 40, overflow: "hidden" }}>
          {bars.map((h, i) => (
            <span key={i} style={{ width: 3, height: h, background: i / bars.length <= pos / 38 ? "#1b1611" : "rgba(27,22,17,.25)", flex: "none" }} />
          ))}
        </div>
        <span className="mono small" style={{ flex: "none" }}>{mm(pos)} / 00:38</span>
      </div>
      <div className="small muted no-print" style={{ marginTop: 6 }}>Playback uses your device&apos;s voice as a stand-in for the recorded clip.</div>
      <div className="serif" style={{ fontWeight: 700, marginTop: 16 }}>Transcript</div>
      <table style={{ marginTop: 6 }}>
        <tbody>
          {VM_LINES.map(([t, l], i) => (
            <tr key={i}>
              <td className="mono" style={{ width: 60, verticalAlign: "top", fontSize: 12, paddingTop: 3 }}>{t}</td>
              <td style={{ fontStyle: l.startsWith("[") ? "italic" : "normal", color: l.startsWith("[") ? "var(--ink-3)" : undefined, padding: "2px 0" }}>{l}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className="thin" />
      <div className="small">Transcribed by: Ct. Neha Bhatt, P.S. Mussoorie, 11.10.2026. Hindi words retained. Originating tower DDN-1187, Rajpur Road, Dehradun (see Exhibit 15).</div>
    </Paper>
  );
}

export function DiaryPage() {
  return (
    <Paper exhibit={21} envelope={3} variant="ruled" width={680} style={{ paddingLeft: 78 }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 58, width: 1.5, background: "rgba(110,47,28,.45)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--serif)", fontSize: 12, color: "var(--ink-3)", marginTop: -20, marginBottom: 12 }}>
        <span>OCTOBER 2026</span>
        <span>Week 41</span>
      </div>
      <div style={{ lineHeight: "28px" }}>
        <Hand style={{ display: "block", lineHeight: "28px" }}><b>Wed 7</b> — Mehta rang back. Agrees it looks bad. Mon 11 am, bring everything.</Hand>
        <Hand style={{ display: "block", lineHeight: "28px" }}><b>Thu 8</b> — Bank sending all 14 months of Trust statements. Clerk says copies go to every trustee &ldquo;as per mandate.&rdquo; <span className="underline-hand">So he will see I asked.</span></Hand>
        <Hand style={{ display: "block", lineHeight: "28px" }}>Kabir rang twice. Not now.</Hand>
        <Hand style={{ display: "block", lineHeight: "28px" }}><b>Fri 9</b> — Kabir&apos;s email. Childish. Land can wait.</Hand>
        <Hand style={{ display: "block", lineHeight: "28px" }}>Meera asked why I&apos;m up so late. Told her Trust business.</Hand>
        <Hand style={{ display: "block", lineHeight: "28px" }}><b>Sat 10</b> — Arjun wants 6 lakh. No. He has to learn. (Priya would have said yes. Am I too hard?)</Hand>
        <Hand style={{ display: "block", lineHeight: "28px" }}>A. 9 pm — B12. <span className="underline-hand">Say nothing. Be normal.</span> Thirty years.</Hand>
        <Hand style={{ display: "block", lineHeight: "28px" }}><b>Mon 12</b> — <span className="circled">Mehta 11 am</span> — statements + KD file.</Hand>
        <Hand style={{ display: "block", lineHeight: "28px", marginTop: 28, color: "#4a3d2f" }}>BP fine this week. Sleep poor.</Hand>
      </div>
      <div className="small" style={{ marginTop: 18, color: "var(--ink-3)" }}>Recovered from desk drawer, study. Pocket diary, leather, &ldquo;Rathore Tea Exports 2026&rdquo;. Seized 12.10.2026, SI P. Joshi.</div>
    </Paper>
  );
}
