import { F, Hand, Paper, Q, RoundSeal, Sign, Stamp, StatementPaper } from "./parts";

const KD_PAYMENTS: [string, number][] = [
  ["Aug 2025", 1180000], ["Sep 2025", 1240000], ["Oct 2025", 1295000], ["Nov 2025", 1310000],
  ["Dec 2025", 1260000], ["Jan 2026", 1345000], ["Feb 2026", 1320000], ["Mar 2026", 1380000],
  ["Apr 2026", 1305000], ["May 2026", 1390000], ["Jun 2026", 1355000], ["Jul 2026", 1370000],
  ["Aug 2026", 1385000], ["Sep 2026", 1265000],
];
const inr = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function BankStatement() {
  const total = KD_PAYMENTS.reduce((s, [, v]) => s + v, 0);
  type Row = [string, string, string, string, number | null, number | null, number, boolean?];
  let bal = 41286540.5;
  const raw: [string, string, string, string, number | null, number | null, boolean?][] = [
    ["01-09-26", "SAL/SEP/26 BULK", "Staff salaries — Sep", "Trustee (Fin.) R.B.", 6842300, null],
    ["03-09-26", "NEFT/UTTARAKHAND PWR", "Electricity — Aug", "Admin", 412880, null],
    ["05-09-26", "RTGS/GOVT OF UK", "Grant — Ayushman reimb.", "—", null, 9850000],
    ["08-09-26", "NEFT/MEDIPLUS SURG", "Consumables inv. MP/2231", "Trustee (Med.) A.K.", 1145600, null],
    ["12-09-26", "NEFT/KAPOOR DIAGNOSTICS LLP", "Pathology outsourcing inv. KD/26/09", "Trustee (Med.) A.K.", 1265000, null, true],
    ["15-09-26", "CHQ 004471 DEP", "Donation — Smt. Kanta Joshi", "—", null, 250000],
    ["19-09-26", "NEFT/DOON OXY GASES", "Oxygen cylinders inv. 7781", "Admin", 98400, null],
    ["24-09-26", "NEFT/SIEMENS HC", "AMC — CT scanner", "Trustee (Fin.) R.B.", 588000, null],
    ["29-09-26", "INT CR", "Interest Q2", "—", null, 312760],
  ];
  const rows: Row[] = raw.map(([d, ref, part, auth, dr, cr, mark]) => {
    bal = bal - (dr ?? 0) + (cr ?? 0);
    return [d, ref, part, auth, dr, cr, bal, mark];
  });
  return (
    <Paper exhibit={22} envelope={4} variant="white" width={920}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div className="serif" style={{ fontSize: 20, fontWeight: 700, letterSpacing: ".03em" }}>THE DOON VALLEY CO-OPERATIVE BANK LTD.</div>
          <div className="small">Rajpur Road Branch, Dehradun 248001 · IFSC DVCB0000112</div>
        </div>
        <div className="small" style={{ textAlign: "right" }}>
          Statement of Account · Page 14 of 14<br />Period: 01-09-2026 to 30-09-2026
        </div>
      </div>
      <hr className="double" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", fontSize: 13 }}>
        <F k="Account name:" v="RATHORE CHARITABLE TRUST — HOSPITAL OPERATING A/C" />
        <F k="A/c No.:" v="0112 0045 8831" />
        <F k="Signatories:" v="Any two of three trustees" />
        <F k="Type:" v="Current — Trust" />
      </div>
      <div style={{ position: "relative", marginTop: 10 }}>
        <div className="mono" style={{ overflowX: "auto" }}>
          <table className="grid" style={{ fontSize: 11.2, minWidth: 780 }}>
            <thead>
              <tr><th>Date</th><th>Ref</th><th>Particulars</th><th>Authorised</th><th style={{ textAlign: "right" }}>Debit</th><th style={{ textAlign: "right" }}>Credit</th><th style={{ textAlign: "right" }}>Balance</th></tr>
            </thead>
            <tbody>
              <tr><td>01-09-26</td><td colSpan={5}>OPENING BALANCE</td><td style={{ textAlign: "right" }}>{inr(41286540.5)}</td></tr>
              {rows.map(([d, ref, part, auth, dr, cr, b, mark], i) => (
                <tr key={i} style={mark ? { outline: "2px solid #4a4a4a", outlineOffset: -1 } : undefined}>
                  <td>{d}</td><td>{ref}</td><td>{part}{mark && <Hand style={{ display: "block", fontSize: 17, color: "#3b3b3b" }}>our own lab does ALL pathology!</Hand>}</td><td>{auth}</td>
                  <td style={{ textAlign: "right" }}>{dr ? inr(dr) : ""}</td>
                  <td style={{ textAlign: "right" }}>{cr ? inr(cr) : ""}</td>
                  <td style={{ textAlign: "right" }}>{inr(b)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="tag-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 22, marginTop: 16 }}>
        <div style={{ border: "1px dashed #4a4a4a", padding: "10px 14px", color: "#3b3b3b" }}>
          <Hand style={{ display: "block", fontSize: 19, color: "#3b3b3b" }}>K.D. LLP — all 14 statements:</Hand>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 14 }}>
            {KD_PAYMENTS.map(([m, v]) => (
              <Hand key={m} style={{ fontSize: 17, color: "#3b3b3b" }}>{m} — {(v / 100000).toFixed(2)} L</Hand>
            ))}
          </div>
          <Hand style={{ display: "block", fontSize: 22, color: "#3b3b3b", marginTop: 4 }}>
            Total = <span className="underline-hand">₹ {(total / 10000000).toFixed(2)} Cr</span>. All &ldquo;A.K.&rdquo; Who are KD??
          </Hand>
        </div>
        <div className="small">
          <div className="serif" style={{ fontWeight: 700, fontSize: 13 }}>Statement issue note</div>
          <p style={{ margin: "4px 0" }}>Duplicate statements for 01-08-2025 to 30-09-2026 (14 pages) issued on written request of the Chairman, Shri V. S. Rathore, received 08-10-2026.</p>
          <p style={{ margin: "4px 0" }}>As per standing Board mandate dated 02-04-2019, intimation and copies dispatched on 08-10-2026 to <b>all authorised signatories</b>: Shri V. S. Rathore; Dr. A. Kapoor; Smt. R. Bhandari.</p>
          <div style={{ textAlign: "right", marginTop: 6 }}>
            <RoundSeal top="DOON VALLEY CO-OP BANK" bottom="RAJPUR ROAD" center="✓" size={80} rotate={14} />
          </div>
        </div>
      </div>
      <div className="small muted" style={{ marginTop: 10 }}>Pencil annotations in the hand of the deceased (identified by Smt. M. Rathore). Found under desk blotter, study, 13.10.2026.</div>
    </Paper>
  );
}

export function MehtaLetter() {
  return (
    <Paper exhibit={23} envelope={4} width={720} style={{ backgroundColor: "#f6f1e5" }}>
      <div style={{ textAlign: "center" }}>
        <div className="serif" style={{ fontSize: 24, letterSpacing: ".12em" }}>MEHTA &amp; ASSOCIATES</div>
        <div className="serif" style={{ fontStyle: "italic", fontSize: 13 }}>Advocates &amp; Solicitors</div>
        <div className="small">22, Astley Hall, Dehradun 248001 · 0135 265 0912 · chambers@mehtalaw.in</div>
      </div>
      <hr />
      <div className="serif" style={{ fontFamily: "var(--serif)", fontSize: 15.5, lineHeight: 1.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Ref: HM/RCT/2026/41</span>
          <span>7th October, 2026</span>
        </div>
        <div style={{ marginTop: 14, fontWeight: 700, letterSpacing: ".08em" }}>PRIVATE &amp; CONFIDENTIAL — BY HAND</div>
        <div style={{ marginTop: 10 }}>
          Shri Vikram Singh Rathore<br />Chairman, Rathore Charitable Trust<br />Hollow Pines, Camel&apos;s Back Road<br />Mussoorie
        </div>
        <p><b>Re: Irregularities in disbursements — Rathore Charitable Trust</b></p>
        <p>Dear Vikram ji,</p>
        <p>Further to our telephone conversation this afternoon, I write to confirm our meeting at my chambers on <b>Monday, 12th October, at 11:00 a.m.</b></p>
        <p>From what you describe — recurring monthly payments to an outside pathology vendor that the hospital does not use, approved under a single trustee&apos;s authority — the matter is serious and may amount to criminal breach of trust under Section 316 of the Bharatiya Nyaya Sanhita, in addition to a report to the Charity Commissioner.</p>
        <p>Kindly bring: (i) the Trust&apos;s bank statements for the full period; (ii) any contract or invoices from the vendor; (iii) the approval notes bearing the authorising trustee&apos;s signature; and (iv) the Trust deed.</p>
        <p>Until we have met, I would strongly advise that you <u>do not raise this matter with the other trustees</u>, and in particular not with the trustee who approved these payments. Please carry on as normal.</p>
        <p>With warm regards,</p>
        <Sign>Harish Mehta</Sign>
        <div>Harish Mehta<br /><span className="small">Advocate, Enrol. No. UK/412/1991</span></div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, gap: 10, flexWrap: "wrap" }}>
        <Hand brown style={{ fontSize: 18 }}>Found sealed in search of house 13.10.26, not among deceased's papers. Opened by IO. NB envelope flap cockled, fresh glue laid over the original gum — sent to FSL — RKB</Hand>
        <Stamp rotate={-7}>Received 08 Oct</Stamp>
      </div>
    </Paper>
  );
}

export function LlpMaster() {
  return (
    <Paper exhibit={24} envelope={4} variant="white" width={820}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div className="serif" style={{ fontSize: 13, letterSpacing: ".18em" }}>MINISTRY OF CORPORATE AFFAIRS · GOVERNMENT OF INDIA</div>
          <div className="serif" style={{ fontSize: 20, fontWeight: 700 }}>LLP Master Data</div>
        </div>
        <div className="small mono" style={{ textAlign: "right" }}>Printed 12-10-2026 17:42<br />by SI P. Joshi</div>
      </div>
      <hr className="double" />
      <table className="grid mono" style={{ fontSize: 12.5 }}>
        <tbody>
          {[
            ["LLPIN", "AAX-4471"],
            ["LLP Name", "KAPOOR DIAGNOSTICS LLP"],
            ["Number of Partners", "0"],
            ["Number of Designated Partners", "2"],
            ["ROC Code", "RoC-Uttarakhand"],
            ["Date of Incorporation", "14/06/2025"],
            ["Registered Address", "FLAT 3, 'SHANTI KUNJ', KULRI BAZAAR, MUSSOORIE, DEHRADUN, UTTARAKHAND 248179"],
            ["Email ID", "kd.accounts@gm•••.com"],
            ["Main division of business activity", "86 — Human health activities (Medical laboratory)"],
            ["Total Obligation of Contribution (₹)", "1,00,000"],
            ["Last financial year end date for Annual Return", "— not filed —"],
            ["LLP Status", "Active"],
          ].map(([k, v]) => (
            <tr key={k}><th style={{ width: "42%" }}>{k}</th><td>{v}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="serif" style={{ fontWeight: 700, marginTop: 14 }}>Designated partners</div>
      <table className="grid mono" style={{ fontSize: 12.5, marginTop: 4 }}>
        <thead><tr><th>DIN/DPIN</th><th>Name</th><th>Begin date</th></tr></thead>
        <tbody>
          <tr><td>08741196</td><td>ANAND KAPOOR</td><td>14/06/2025</td></tr>
          <tr><td>08741197</td><td>NISHA M. KAPOOR</td><td>14/06/2025</td></tr>
        </tbody>
      </table>
      <div style={{ marginTop: 16, borderLeft: "3px solid var(--ink)", paddingLeft: 12 }}>
        <div className="serif" style={{ fontWeight: 700 }}>Field verification (IO)</div>
        <p style={{ margin: "4px 0" }}>13.10.2026, 10:00. Registered address is the first-floor flat of Shanti Kunj, the Kapoor family house. Neighbours say it was last lived in by a younger relative of Dr. Kapoor and has been empty for some years. No laboratory, equipment, signage or staff. Rathore Memorial Hospital pathology department (Dr. S. Nautiyal, HoD) confirms all tests are done in-house and the department has never sent samples to &ldquo;Kapoor Diagnostics&rdquo;.</p>
        <Sign style={{ fontSize: 26 }}>P. Joshi</Sign> <span className="small">SI, P.S. Mussoorie</span>
      </div>
    </Paper>
  );
}

export function KabirEmail() {
  return (
    <Paper exhibit={25} envelope={4} variant="white" width={760}>
      <div className="mono" style={{ fontSize: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Mail — v.s.rathore@hollowpines.in</span>
          <span>Printed 12/10/2026, 11:02</span>
        </div>
        <hr className="thin" />
        <div style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, margin: "6px 0 10px" }}>Pinecrest — enough is enough</div>
        <div><b>From:</b> Kabir Sethi &lt;kabir@sethidevelopers.in&gt;</div>
        <div><b>To:</b> Vikram Rathore &lt;v.s.rathore@hollowpines.in&gt;</div>
        <div><b>Date:</b> Fri, 9 Oct 2026, 22:47</div>
        <div><b>Attachments:</b> Pinecrest_MoU_draft_v6.pdf (1.2 MB)</div>
      </div>
      <hr className="thin" />
      <div style={{ fontFamily: "var(--serif)", fontSize: 15.5, lineHeight: 1.6 }}>
        <p>Vikram ji,</p>
        <p>Three weeks of silence. You shook my hand in June. On the strength of that handshake I have spent ₹1.9 crore on drawings, soil tests and MDDA fees, and I have a board meeting on Tuesday where I must either show a signed MoU or explain why I don&apos;t have one.</p>
        <p>I hear you are seeing your lawyer on Monday. If that meeting is to put the lower land into the Trust and block this sale, please understand what you are doing to me. I have put everything into this. <b>If you block it on Monday, you will regret it.</b></p>
        <p>Call me. Please.</p>
        <p>Kabir</p>
      </div>
      <hr className="thin" />
      <div className="small">IO note: no reply sent from deceased&apos;s account. Sethi&apos;s presence at Hotel Madhuban, Dehradun, from 19:05 to 01:30 on 10/11 Oct confirmed by hotel CCTV, the wedding photographer&apos;s time-stamped images, and the tower location of his phone (Exhibit 15).</div>
    </Paper>
  );
}

export function WillExtract() {
  return (
    <Paper exhibit={26} envelope={4} variant="aged" width={720}>
      <div style={{ textAlign: "center" }}>
        <div className="small" style={{ letterSpacing: ".2em" }}>CERTIFIED EXTRACT</div>
        <div className="serif" style={{ fontSize: 24, fontWeight: 700, fontStyle: "italic", marginTop: 4 }}>Last Will &amp; Testament</div>
        <div className="serif">of Vikram Singh Rathore</div>
        <div className="small">Registered at the office of the Sub-Registrar, Mussoorie, Book III, Vol. 88, No. 214, on 3rd March 2019</div>
      </div>
      <hr className="double" />
      <div style={{ fontFamily: "var(--serif)", fontSize: 15, lineHeight: 1.6 }}>
        <p><b>Clause 4.</b> I give the property known as Hollow Pines, Camel&apos;s Back Road, Mussoorie, together with its contents, to my wife MEERA RATHORE for her lifetime, and thereafter absolutely to my son ARJUN RATHORE.</p>
        <p><b>Clause 5.</b> I give the residue of my estate, after debts and duties, in the following shares: forty per cent to my wife Meera; forty per cent to my son Arjun, to be held in trust until he attains the age of thirty-five years; and twenty per cent to the RATHORE CHARITABLE TRUST.</p>
        <p><b>Clause 7.</b> I appoint Shri HARISH MEHTA, Advocate, of Dehradun, as sole executor of this my Will.</p>
        <p style={{ color: "var(--ink-3)" }}>[Clauses 1–3, 6 and 8–11 omitted from extract]</p>
      </div>
      <hr className="thin" />
      <div className="small">
        Certificate of executor: I certify that the above is a true extract, and that <b>no later Will or codicil</b> has been lodged with me or instructed by the testator up to the date of his death. The testator did not raise his Will with me at any point in 2026.
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12 }}>
        <div>
          <Sign>Harish Mehta</Sign>
          <div className="small">Executor · 13.10.2026</div>
        </div>
        <RoundSeal top="SUB-REGISTRAR MUSSOORIE" bottom="REGISTERED" center="2019" size={90} rotate={-20} />
      </div>
    </Paper>
  );
}

export function MeeraSupplementary() {
  return (
    <StatementPaper
      exhibit={27}
      envelope={4}
      name="Smt. Meera Rathore w/o Late Shri Vikram Singh Rathore"
      age={46}
      relation="Wife"
      address="Hollow Pines Estate, Camel's Back Road, Mussoorie"
      date="13.10.2026"
      time="14:30 hrs"
      place="P.S. Mussoorie"
      recordedBy="Inspector R. K. Bisht, SHO"
      signature="Meera Rathore"
      language="English"
    >
      <p>I wish to correct my statement of Sunday. I told you I knew of no letters. That was not true.</p>
      <p>On Thursday, the 8th, the chowkidar brought an envelope by hand from Mehta &amp; Associates. Harish Mehta drew up Vikram&apos;s will. Vikram and I had quarrelled that week about Arjun; he said I was turning him against his son. When I saw the envelope I was sure he was changing his will. I panicked. I took it before he saw it and hid it in my jewellery box. I did not open it. I meant to put it back.</p>
      <p>I did not know it was about the Trust. I did not know anything was wrong at the Trust.</p>
      <p>I have nothing to do with my husband&apos;s death. I am ashamed that I lied. I was ashamed of the letter, not of anything else.</p>
      <Q q="Did you open the envelope?">No. I swear it. I never opened it.</Q>
    </StatementPaper>
  );
}
