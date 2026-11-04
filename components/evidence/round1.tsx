import { F, Hand, Paper, RoundSeal, Sign, Stamp, StatementPaper } from "./parts";

/* Exhibit 1 — Bureau assignment memo */
export function Memo() {
  return (
    <Paper exhibit={1} envelope={1} clip>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div>
          <div className="serif" style={{ fontSize: 26, letterSpacing: ".06em", fontWeight: 700 }}>THE BLACKWOOD BUREAU</div>
          <div className="serif" style={{ fontStyle: "italic", fontSize: 13 }}>Private Enquiries · Consulting to Police &amp; Counsel · Est. 1961</div>
          <div className="small" style={{ marginTop: 4 }}>Blackwood House, 3 Rajpur Road, Dehradun 248001 · Tel. 0135 274 1961</div>
        </div>
        <Stamp rotate={6} size={15} double>Confidential</Stamp>
      </div>
      <hr className="double" />
      <div className="serif" style={{ fontSize: 15, letterSpacing: ".3em", textAlign: "center", margin: "6px 0 14px" }}>INTERNAL MEMORANDUM</div>
      <F k="TO:" v="Assigned Detective (you)" w={70} />
      <F k="FROM:" v="E. D. Blackwood, Director" w={70} />
      <F k="DATE:" v="Sunday, 11 October 2026 — 10:20 hrs" w={70} />
      <F k="RE:" v="CASE NO. 017 — Death of Shri Vikram Singh Rathore, Hollow Pines, Mussoorie" w={70} />
      <hr className="thin" />
      <p>1. At 09:05 this morning Inspector R. K. Bisht, SHO Mussoorie, asked for the Bureau's assistance in an unattended death at Hollow Pines Estate, Camel&apos;s Back Road. The deceased is Shri Vikram Singh Rathore, 64, retired chairman of Rathore Tea Exports and present chairman of the Rathore Charitable Trust, which runs Rathore Memorial Hospital, Dehradun.</p>
      <p>2. The family physician, Dr. Anand Kapoor, attended at 07:40 and has given his opinion that death was due to cardiac arrest at approximately 01:00 hrs. The Inspector has reservations and has ordered a post-mortem over the doctor&apos;s objection. He has not told the family why.</p>
      <p>3. Persons of interest, as given by the Inspector:</p>
      <table className="grid small" style={{ margin: "6px 0 12px" }}>
        <thead>
          <tr><th>Name</th><th>Age</th><th>Connection</th><th>Present on 10/10</th></tr>
        </thead>
        <tbody>
          <tr><td>Smt. Meera Rathore</td><td>46</td><td>Wife (m. 2015)</td><td>Yes, upstairs</td></tr>
          <tr><td>Shri Arjun Rathore</td><td>31</td><td>Son, first marriage</td><td>Yes, states so</td></tr>
          <tr><td>Dr. Anand Kapoor</td><td>59</td><td>Physician; Trustee</td><td>Evening visit</td></tr>
          <tr><td>Shri Kabir Sethi</td><td>48</td><td>Business associate</td><td>No — Dehradun</td></tr>
          <tr><td>Smt. Sunita Negi</td><td>52</td><td>Housekeeper</td><td>Yes, staff quarter</td></tr>
        </tbody>
      </table>
      <p>4. You will work the file in four envelopes, opened in order. Answer the question at the close of each before proceeding. Your final report must name <u>who</u>, <u>how</u> and <u>why</u>.</p>
      <p>5. Work only from what is in the file. Hearsay, instinct and the reputations of doctors are not evidence.</p>
      <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <Sign>E. D. Blackwood</Sign>
          <div className="small">Director</div>
        </div>
        <RoundSeal top="THE BLACKWOOD BUREAU" bottom="DEHRADUN · 1961" center="017" size={104} />
      </div>
      <Hand style={{ display: "block", marginTop: 12, fontSize: 20 }}>Bisht is good. Trust his instincts, check his times. — E.</Hand>
    </Paper>
  );
}

/* Exhibit 2 — Police inquest report */
export function Inquest() {
  return (
    <Paper exhibit={2} envelope={1} variant="aged" punch>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="small">Form No. 25 (Police)</div>
        <div className="small">Original / <s>Duplicate</s></div>
      </div>
      <div style={{ textAlign: "center", margin: "6px 0 2px" }}>
        <div className="serif" style={{ fontSize: 14, letterSpacing: ".25em" }}>UTTARAKHAND POLICE</div>
        <div className="serif" style={{ fontSize: 22, fontWeight: 700 }}>Inquest Report</div>
        <div className="small">(Section 194, Bharatiya Nagarik Suraksha Sanhita, 2023)</div>
      </div>
      <hr className="double" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <F k="Police Station:" v="Mussoorie" />
        <F k="District:" v="Dehradun" />
        <F k="GD Entry No.:" v="06 dt. 11.10.2026, 07:31 hrs" />
        <F k="Inquest No.:" v="11 / 2026" />
        <F k="Information by:" v="Smt. Meera Rathore (wife), by phone" />
        <F k="Arrival at scene:" v="08:05 hrs" />
      </div>
      <F k="Place of occurrence:" v="Study, ground floor, Hollow Pines Estate, Camel's Back Road, Mussoorie" />
      <F k="Name of deceased:" v="Vikram Singh Rathore, s/o Late Thakur Pratap Singh Rathore, M, 64 yrs" />
      <div className="serif" style={{ fontWeight: 700, marginTop: 14 }}>1. Position and condition of body</div>
      <p style={{ margin: "4px 0" }}>
        Deceased found seated in a high-backed leather armchair facing the fireplace, head inclined to right, chin on chest. Reading spectacles resting in lap. Book (<i>The Guide</i>, R. K. Narayan) lying face down on rug to left of chair. Dressed in kurta-pyjama, grey wool shawl, brown Peshawari chappals; left chappal found 1.2 m from chair, under desk.
      </p>
      <p style={{ margin: "4px 0" }}>
        Body cold to touch. Rigor mortis <u>fully established</u> in jaw, neck, upper and lower limbs at 08:15 hrs. Faint post-mortem staining noted on back of neck and shoulders. Small fresh abrasion, approx. 1.5 × 0.5 cm, over right temple. No bleeding from nose or ears. No ligature mark. Fingernails clean.
      </p>
      <div className="serif" style={{ fontWeight: 700, marginTop: 12 }}>2. Condition of room</div>
      <p style={{ margin: "4px 0" }}>
        Single door from hall, found closed, not locked. Both windows latched from inside, curtains drawn. Fireplace cold, grate full of ash. Desk lamp ON. Standard lamp beside armchair OFF. Dhurrie rug between desk and armchair rucked and displaced approx. 30 cm towards fireplace. Corner of side table chipped (fresh). On side table: one steel tumbler of milk, approx. two-thirds full, untouched (skin formed on surface), and one glass coaster.
      </p>
      <p style={{ margin: "4px 0" }}>
        Transistor radio (Philips, brown cabinet) on bookshelf found <b>switched ON</b>, low volume, tuned to AIR FM Gold, playing at time of arrival. Switched off by HC D. Rawat at 08:20 after photography.
      </p>
      <div className="serif" style={{ fontWeight: 700, marginTop: 12 }}>3. Articles taken into custody</div>
      <table className="grid small" style={{ marginTop: 6 }}>
        <thead><tr><th style={{ width: 42 }}>Item</th><th>Description</th><th style={{ width: 130 }}>Sealed by</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Steel tumbler with milk</td><td>HC D. Rawat</td></tr>
          <tr><td>2</td><td>Reading spectacles, gold frame</td><td>HC D. Rawat</td></tr>
          <tr><td>3</td><td>Mobile phone, black (deceased&apos;s), found on desk, 3 missed calls on screen</td><td>SI P. Joshi</td></tr>
          <tr><td>4</td><td>Medicine organiser (weekly), Sat-PM compartment empty</td><td>SI P. Joshi</td></tr>
          <tr><td>5</td><td>Ash sample from grate (to be sieved)</td><td>HC D. Rawat</td></tr>
          <tr><td>6</td><td>Smartwatch, &quot;Kronos Fit 4&quot;, worn on left wrist. Screen shows notification history. Sent for data extraction.</td><td>SI P. Joshi</td></tr>
        </tbody>
      </table>
      <div className="serif" style={{ fontWeight: 700, marginTop: 12 }}>4. Persons present at inquest</div>
      <p style={{ margin: "4px 0" }}>Smt. Meera Rathore; Shri Arjun Rathore; Smt. Sunita Negi; Dr. Anand Kapoor (arrived 07:40, before police).</p>
      <div className="serif" style={{ fontWeight: 700, marginTop: 12 }}>5. Opinion of panch witnesses &amp; IO</div>
      <p style={{ margin: "4px 0" }}>
        Dr. A. Kapoor opines death natural, cardiac, approx. 01:00 hrs, and requests that body be released without autopsy. In view of (i) abrasion on temple, (ii) displaced rug and chappal, (iii) degree of rigor, the IO is <u>not satisfied</u> as to cause or time. Body sent to Govt. Doon Medical College, Dehradun, for post-mortem. Next of kin informed.
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20, flexWrap: "wrap", gap: 16 }}>
        <div className="small">
          Panch 1: <Sign style={{ fontSize: 26 }}>Mohan Lal</Sign> (chowkidar, Hollow Pines)
          <br />
          Panch 2: <Sign style={{ fontSize: 26 }}>G. S. Rawat</Sign> (neighbour, Woodstock Villa)
        </div>
        <div style={{ textAlign: "right", position: "relative" }}>
          <RoundSeal top="STATION HOUSE OFFICER" bottom="P.S. MUSSOORIE" center="★" size={92} style={{ position: "absolute", right: 130, top: -46 }} />
          <Sign>R. K. Bisht</Sign>
          <div className="small">Inspector / SHO, P.S. Mussoorie</div>
          <div className="small">11.10.2026 · 09:40 hrs</div>
        </div>
      </div>
    </Paper>
  );
}

/* Exhibit 3 — Scene photograph */
export function ScenePhoto() {
  return (
    <Paper exhibit={3} envelope={1} variant="white" width={820}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
        <span>P.S. MUSSOORIE · SCENE OF CRIME UNIT</span>
        <span>PHOTO NO. 3/A</span>
      </div>
      <div style={{ background: "#1b1611", padding: 10 }}>
        <svg viewBox="0 0 800 520" width="100%" style={{ display: "block", filter: "sepia(.55) contrast(1.05)" }} role="img" aria-label="Sepia photograph of the study at Hollow Pines">
          <defs>
            <radialGradient id="lampglow" cx="72%" cy="30%" r="45%">
              <stop offset="0" stopColor="#d8c39a" stopOpacity=".55" />
              <stop offset="1" stopColor="#1b1611" stopOpacity="0" />
            </radialGradient>
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0" />
            </filter>
            <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4a3a2a" />
              <stop offset="1" stopColor="#21180f" />
            </linearGradient>
          </defs>
          {/* walls */}
          <rect width="800" height="330" fill="#3a2f24" />
          {[...Array(16)].map((_, i) => (
            <rect key={i} x={i * 50} y="0" width="1" height="330" fill="#2e251c" />
          ))}
          <rect y="300" width="800" height="30" fill="#2a2018" />
          {/* floor */}
          <rect y="330" width="800" height="190" fill="url(#floor)" />
          {/* fireplace */}
          <rect x="40" y="150" width="200" height="180" fill="#5b4a38" />
          <rect x="30" y="140" width="220" height="16" fill="#6c5a45" />
          <rect x="80" y="200" width="120" height="130" fill="#120d09" />
          <path d="M92 318 Q140 296 188 318 L188 330 L92 330Z" fill="#6f665c" />
          <circle cx="120" cy="316" r="4" fill="#8b8376" />
          <circle cx="150" cy="312" r="3" fill="#8b8376" />
          {/* clock on mantel */}
          <rect x="120" y="104" width="40" height="36" fill="#2a2018" />
          <circle cx="140" cy="122" r="12" fill="#d8c39a" />
          <line x1="140" y1="122" x2="140" y2="114" stroke="#1b1611" strokeWidth="1.5" />
          <line x1="140" y1="122" x2="146" y2="124" stroke="#1b1611" strokeWidth="1.5" />
          {/* bookshelf */}
          <rect x="300" y="40" width="170" height="290" fill="#2a2018" />
          {[0, 1, 2, 3, 4].map((r) => (
            <g key={r}>
              <rect x="300" y={40 + r * 58 + 54} width="170" height="5" fill="#4a3a2a" />
              {[...Array(11)].map((_, i) => (
                <rect key={i} x={306 + i * 14} y={40 + r * 58 + 14 + ((i * 7 + r * 3) % 9)} width={11} height={40 - ((i * 7 + r * 3) % 9)} fill={["#5b4a38", "#6c5a45", "#3e3226", "#7a6852"][(i + r) % 4]} />
              ))}
            </g>
          ))}
          {/* radio on shelf */}
          <rect x="330" y="214" width="76" height="36" fill="#6b4a2b" stroke="#2a2018" />
          <rect x="336" y="220" width="36" height="24" fill="#3e2a18" />
          <circle cx="388" cy="232" r="7" fill="#d8c39a" />
          <circle cx="372" cy="226" r="1.6" fill="#ece3d0" />
          {/* window with curtains */}
          <rect x="540" y="40" width="150" height="190" fill="#1b1611" />
          <path d="M530 34 H700 V250 Q660 230 640 250 Q620 236 610 250 V34Z" fill="#4a3426" opacity=".95" />
          <path d="M530 34 H620 V250 Q590 240 560 250 Q545 236 530 250Z" fill="#5a4030" />
          {/* desk + lamp */}
          <rect x="600" y="260" width="190" height="16" fill="#3e2a18" />
          <rect x="610" y="276" width="14" height="80" fill="#2a2018" />
          <rect x="766" y="276" width="14" height="80" fill="#2a2018" />
          <path d="M700 260 L708 200 L690 196" stroke="#1b1611" strokeWidth="4" fill="none" />
          <path d="M672 182 L708 182 L700 200 L680 200Z" fill="#2a2018" />
          <rect width="800" height="520" fill="url(#lampglow)" />
          <rect x="640" y="250" width="60" height="10" fill="#d8c39a" opacity=".7" />
          {/* rug displaced */}
          <path d="M300 400 L640 380 L700 470 L330 500Z" fill="#5b3a25" />
          <path d="M310 404 L630 385 L688 466 L338 494Z" fill="none" stroke="#8a6a43" strokeWidth="2" strokeDasharray="6 4" />
          <path d="M600 382 Q620 360 645 376 L640 380Z" fill="#6b4a2b" />
          {/* side table */}
          <ellipse cx="270" cy="372" rx="38" ry="10" fill="#3e2a18" />
          <rect x="262" y="372" width="16" height="70" fill="#2a2018" />
          <path d="M236 368 L246 366 L244 374Z" fill="#8a6a43" />
          <rect x="262" y="344" width="16" height="26" fill="#9b958b" />
          <ellipse cx="270" cy="344" rx="8" ry="2.5" fill="#d8c39a" />
          {/* armchair */}
          <path d="M150 300 Q150 250 200 248 H270 Q320 250 318 300 V420 H150Z" fill="#2a1a10" />
          <rect x="130" y="330" width="40" height="100" rx="12" fill="#3a2416" />
          <rect x="298" y="330" width="40" height="100" rx="12" fill="#3a2416" />
          <rect x="160" y="380" width="150" height="40" fill="#3a2416" />
          {/* seated figure, shawl */}
          <path d="M190 270 Q236 244 262 280 Q290 330 278 384 H186 Q174 330 190 270Z" fill="#6f665c" />
          <circle cx="250" cy="282" r="20" fill="#9b8b73" />
          <path d="M226 382 L230 440 M260 382 L262 440" stroke="#4a4038" strokeWidth="18" strokeLinecap="round" />
          <rect x="220" y="372" width="30" height="7" rx="3" fill="#d8c39a" />
          {/* book on floor */}
          <path d="M108 460 L160 448 L172 470 L118 484Z" fill="#7a6852" />
          {/* chappal under desk */}
          <ellipse cx="660" cy="400" rx="18" ry="7" fill="#5b3a25" />
          {/* evidence tents */}
          {[
            [262, 318, "1"],
            [210, 352, "2"],
            [130, 446, "3"],
            [664, 382, "4"],
            [360, 196, "5"],
            [164, 82, "6"],
            [240, 400, "7"],
          ].map(([x, y, n]) => (
            <g key={n as string} transform={`translate(${x} ${y})`}>
              <path d="M0 20 L10 0 L20 20Z" fill="#f1e9d8" stroke="#1b1611" />
              <text x="10" y="17" textAnchor="middle" fontFamily="Courier Prime, monospace" fontWeight="700" fontSize="11" fill="#1b1611">{n}</text>
            </g>
          ))}
          {/* scale ruler */}
          <g transform="translate(560 492)">
            <rect width="200" height="14" fill="#f1e9d8" />
            {[...Array(21)].map((_, i) => (
              <rect key={i} x={i * 10} y="0" width="1" height={i % 5 === 0 ? 10 : 5} fill="#1b1611" />
            ))}
            <text x="204" y="11" fontSize="10" fill="#f1e9d8" fontFamily="Courier Prime, monospace">1 m</text>
          </g>
          <rect width="800" height="520" filter="url(#grain)" />
          <text x="784" y="24" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="14" fill="#e9b26a">11.10.2026  08:32</text>
        </svg>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 24px", marginTop: 14, fontSize: 12.5 }}>
        <div><b>1</b> Steel tumbler of milk, untouched</div>
        <div><b>2</b> Spectacles in lap of deceased</div>
        <div><b>3</b> Book, face down on rug</div>
        <div><b>4</b> Left chappal, under desk</div>
        <div><b>5</b> Radio, switched on at arrival</div>
        <div><b>6</b> Mantel clock, running, correct time</div>
        <div><b>7</b> Chipped corner, side table</div>
        <div className="muted">Rug displaced ~30 cm (dotted: original line)</div>
      </div>
      <hr className="thin" />
      <div className="small" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span>Taken by: HC D. Rawat, No. 412 · Camera: Nikon D7500 · 18 mm · Flash off</span>
        <span>View: from doorway, facing north</span>
      </div>
    </Paper>
  );
}

/* Exhibit 4 — Floor plan */
export function FloorPlan() {
  const ink = "#1b1611";
  const T = (x: number, y: number, t: string, s = 13, a: "start" | "middle" = "middle") => (
    <text x={x} y={y} fontFamily="Courier Prime, monospace" fontSize={s} textAnchor={a} fill={ink}>{t}</text>
  );
  return (
    <Paper exhibit={4} envelope={1} variant="white" width={860}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div className="serif" style={{ fontSize: 20, fontWeight: 700 }}>HOLLOW PINES — GROUND FLOOR</div>
          <div className="small">Copied from sanctioned plan, Mussoorie Dehradun Dev. Authority, file MDDA/R/1998/0447. Annotations by P.S. Mussoorie.</div>
        </div>
        <div className="small" style={{ textAlign: "right" }}>Scale 1:150<br />Drawn: S. Thapliyal, Draughtsman</div>
      </div>
      <svg viewBox="0 0 820 560" width="100%" style={{ display: "block", background: "#f7f3ea", border: `1px solid ${ink}` }} role="img" aria-label="Ground floor plan of Hollow Pines">
        <defs>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={ink} strokeWidth=".6" />
          </pattern>
          <pattern id="gridp" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 H0 V20" fill="none" stroke="#c9b79a" strokeWidth=".4" />
          </pattern>
        </defs>
        <rect width="820" height="560" fill="url(#gridp)" />
        {/* outer walls */}
        <rect x="120" y="60" width="560" height="320" fill="none" stroke={ink} strokeWidth="6" />
        {/* interior walls */}
        <g stroke={ink} strokeWidth="3">
          <line x1="440" y1="60" x2="440" y2="220" />
          <line x1="440" y1="220" x2="680" y2="220" />
          <line x1="300" y1="60" x2="300" y2="220" />
          <line x1="120" y1="220" x2="380" y2="220" />
          <line x1="380" y1="220" x2="380" y2="380" />
          <line x1="540" y1="220" x2="540" y2="380" />
          <line x1="120" y1="300" x2="250" y2="300" />
        </g>
        {/* door gaps (white) */}
        <g stroke="#f7f3ea" strokeWidth="7">
          <line x1="440" y1="150" x2="440" y2="185" />
          <line x1="330" y1="220" x2="365" y2="220" />
          <line x1="380" y1="250" x2="380" y2="285" />
          <line x1="540" y1="250" x2="540" y2="285" />
          <line x1="300" y1="160" x2="300" y2="195" />
          <line x1="400" y1="380" x2="470" y2="380" />
          <line x1="120" y1="240" x2="120" y2="275" />
          <line x1="180" y1="300" x2="215" y2="300" />
        </g>
        {/* door swings */}
        <g fill="none" stroke={ink} strokeWidth="1">
          <path d="M440 185 A35 35 0 0 1 475 150" />
          <path d="M400 380 A35 35 0 0 1 435 345" />
        </g>
        {/* windows */}
        <g stroke={ink} strokeWidth="1.5">
          {[[500, 60, 580, 60], [600, 60, 660, 60], [680, 110, 680, 180], [160, 60, 260, 60]].map(([a, b, c, d], i) => (
            <g key={i}>
              <line x1={a} y1={b - 3} x2={c} y2={d - 3} />
              <line x1={a} y1={b + 3} x2={c} y2={d + 3} />
            </g>
          ))}
        </g>
        {/* study highlight */}
        <rect x="443" y="63" width="234" height="154" fill="#c9a66b" opacity=".28" />
        {/* furniture study */}
        <rect x="600" y="80" width="64" height="28" fill="none" stroke={ink} />
        {T(632, 98, "desk", 10)}
        <circle cx="520" cy="160" r="15" fill="none" stroke={ink} />
        {T(520, 164, "chair", 9)}
        <rect x="455" y="66" width="60" height="16" fill="url(#hatch)" stroke={ink} />
        {T(486, 96, "fireplace", 9)}
        <rect x="640" y="140" width="34" height="70" fill="none" stroke={ink} />
        {T(657, 178, "shelf", 9)}
        <text x="560" y="135" fontFamily="Caveat, cursive" fontSize="20" fill="#2b2a4a">body found ×</text>
        {/* staircase */}
        <g stroke={ink} strokeWidth="1">
          <rect x="390" y="230" width="140" height="40" fill="none" />
          {[...Array(9)].map((_, i) => <line key={i} x1={390 + i * 15.5} y1="230" x2={390 + i * 15.5} y2="270" />)}
        </g>
        {T(460, 290, "STAIRS UP ↑ (bedrooms,", 10)}
        {T(460, 303, "Mrs. Rathore's sitting rm)", 10)}
        {/* labels */}
        {T(560, 120, "STUDY", 16)}
        {T(370, 130, "DRAWING", 14)}
        {T(370, 146, "ROOM", 14)}
        {T(210, 130, "DINING", 14)}
        {T(250, 260, "KITCHEN", 13)}
        {T(185, 345, "PANTRY", 12)}
        {T(460, 345, "HALL", 14)}
        {T(610, 300, "ARJUN'S", 12)}
        {T(610, 315, "ROOM", 12)}
        {/* verandah */}
        <rect x="380" y="380" width="160" height="40" fill="none" stroke={ink} strokeDasharray="5 4" />
        {T(460, 405, "VERANDAH", 11)}
        {/* staff quarter */}
        <rect x="20" y="230" width="90" height="80" fill="none" stroke={ink} strokeWidth="3" />
        {T(65, 265, "STAFF", 11)}
        {T(65, 279, "QUARTER", 11)}
        {T(65, 295, "(S. Negi)", 10)}
        {/* back lane + service gate */}
        <line x1="10" y1="40" x2="10" y2="540" stroke={ink} strokeWidth="1" strokeDasharray="2 4" />
        {T(28, 30, "BACK LANE (to Kulri)", 11, "start")}
        <rect x="4" y="150" width="12" height="40" fill="#f7f3ea" stroke={ink} />
        {T(22, 176, "SERVICE GATE — no camera", 10, "start")}
        <path d="M24 196 Q70 210 116 250" fill="none" stroke={ink} strokeDasharray="3 3" />
        {T(30, 214, "footpath", 9, "start")}
        {/* shed */}
        <rect x="150" y="410" width="70" height="40" fill="none" stroke={ink} />
        {T(185, 434, "SHED", 10)}
        {T(185, 464, "(scooter kept here)", 9)}
        {/* drive + main gate */}
        <path d="M460 420 Q470 470 600 500 L800 500" fill="none" stroke={ink} strokeWidth="1" />
        <path d="M480 420 Q490 456 610 482 L800 482" fill="none" stroke={ink} strokeWidth="1" />
        {T(640, 474, "DRIVE", 10)}
        <rect x="770" y="470" width="14" height="44" fill={ink} />
        {T(760, 540, "MAIN GATE", 11)}
        <g transform="translate(748 450)">
          <path d="M0 0 L16 -6 L16 8 Z" fill={ink} />
          <path d="M-4 2 L-60 30 M-4 2 L-50 -18" stroke={ink} strokeDasharray="2 3" />
        </g>
        {T(700, 440, "CAM 1 (gate)", 10)}
        {/* compass */}
        <g transform="translate(760 80)">
          <circle r="22" fill="none" stroke={ink} />
          <path d="M0 -20 L6 6 L0 2 L-6 6Z" fill={ink} />
          {T(0, -26, "N", 12)}
        </g>
        {/* scale bar */}
        <g transform="translate(120 520)">
          <rect width="100" height="6" fill={ink} />
          <rect x="100" width="100" height="6" fill="none" stroke={ink} />
          {T(0, -6, "0", 10)}
          {T(100, -6, "5", 10)}
          {T(200, -6, "10 m", 10)}
        </g>
      </svg>
      <div className="small" style={{ marginTop: 10 }}>
        Note (IO): Only camera on premises is CAM 1 covering main gate and drive. Service gate opens onto back lane, latched from inside, no lock. Kitchen TV audible in hall. Study door is 9 m from kitchen.
      </div>
    </Paper>
  );
}

/* Exhibit 5 — Smartwatch export */
export function WatchExport() {
  const rows: [string, string, string, string, boolean?][] = [
    ["2026-10-10 19:30:00", "74", "97", "—"],
    ["2026-10-10 20:00:00", "79", "97", "—"],
    ["2026-10-10 20:06:12", "104", "96", "High heart rate while inactive (>100 for 10 min)"],
    ["2026-10-10 20:16:40", "98", "96", "—"],
    ["2026-10-10 20:30:00", "82", "97", "—"],
    ["2026-10-10 20:58:31", "80", "97", "BP reading synced: 142/88 (manual entry)"],
    ["2026-10-10 21:05:00", "73", "97", "—"],
    ["2026-10-10 21:15:00", "71", "97", "—"],
    ["2026-10-10 21:30:00", "70", "97", "—"],
    ["2026-10-10 21:38:00", "72", "96", "—"],
    ["2026-10-10 21:40:44", "118", "94", "—", true],
    ["2026-10-10 21:41:30", "—", "—", "IRREGULAR RHYTHM NOTIFICATION", true],
    ["2026-10-10 21:42:10", "41", "89", "Low heart rate (<45)", true],
    ["2026-10-10 21:43:05", "33", "—", "HARD FALL DETECTED", true],
    ["2026-10-10 21:43:06", "—", "—", "Prompt: 'It looks like you've taken a hard fall'. SOS in 60 s", true],
    ["2026-10-10 21:44:02", "—", "—", "SOS cancelled — user input (tap: 'I'm OK')", true],
    ["2026-10-10 21:45:00", "22", "—", "—", true],
    ["2026-10-10 21:47:18", "0", "—", "Heart rate unavailable. Wrist detection: ON", true],
    ["2026-10-10 22:00:00", "—", "—", "No reading. Wrist detection: ON"],
    ["2026-10-10 22:30:00", "—", "—", "No reading. Wrist detection: ON"],
    ["2026-10-10 23:00:00", "—", "—", "Bedtime reminder shown. Not acknowledged"],
    ["2026-10-11 01:00:00", "—", "—", "No reading. Wrist detection: ON"],
    ["2026-10-11 07:00:00", "—", "—", "Battery 31%. No reading. Wrist detection: ON"],
    ["2026-10-11 08:41:52", "—", "—", "Wrist detection: OFF (device removed)"],
  ];
  return (
    <Paper exhibit={5} envelope={1} variant="white" width={880}>
      <div className="mono" style={{ fontSize: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>KRONOS HEALTH · DATA EXPORT</div>
            <div>export_id: KH-EXP-7Q41-0093 · format: CSV (rendered)</div>
            <div>device: Kronos Fit 4 (41 mm) · serial KF4-IN-22817460 · fw 4.2.1</div>
            <div>account: v.s.rathore@hollowpines.in · tz: Asia/Kolkata (+05:30)</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>Extracted by: Digital Forensics Cell,</div>
            <div>Uttarakhand Police HQ, Dehradun</div>
            <div>Req. No. DFC/MSR/2026/318</div>
            <div>11-10-2026 15:20 IST</div>
          </div>
        </div>
        <hr className="thin" />
        <div style={{ overflowX: "auto" }}>
          <table className="grid" style={{ fontSize: 11.5, minWidth: 620 }}>
            <thead>
              <tr><th>timestamp_local</th><th>hr_bpm</th><th>spo2_%</th><th>event</th></tr>
            </thead>
            <tbody>
              {rows.map(([t, hr, sp, ev, mark], i) => (
                <tr key={i} style={mark ? { background: "rgba(201,166,107,.22)" } : undefined}>
                  <td style={{ whiteSpace: "nowrap" }}>{t}</td>
                  <td>{hr}</td>
                  <td>{sp}</td>
                  <td>{ev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 8 }}>
          # Readings sampled every 5 min at rest, continuously on alerts. Rows filtered 19:30–08:45 by examiner.
          <br /># &quot;Wrist detection: ON&quot; = device in skin contact (strap fastened). Sensor requires perfusion for HR.
          <br /># Fall/SOS events: on-device. Cancellation requires a physical tap on the screen.
        </div>
        <hr className="thin" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
          <div>SHA-256 of source image: 9f1c…e04a · Chain of custody: Item 6, Inquest 11/2026</div>
          <Stamp rotate={-3} size={11}>Certified true copy</Stamp>
        </div>
      </div>
    </Paper>
  );
}

/* Exhibit 6 — Statement of Sunita Negi */
export function SunitaStatement() {
  return (
    <StatementPaper
      exhibit={6}
      envelope={1}
      name="Smt. Sunita Negi w/o Late Shri Bhagat Singh Negi"
      age={52}
      relation="Housekeeper, 19 years"
      address="Staff quarter, Hollow Pines Estate; native village Thatyur, Tehri Garhwal"
      date="11.10.2026"
      time="10:05 hrs"
      place="Kitchen, Hollow Pines"
      recordedBy="Inspector R. K. Bisht, SHO"
      signature="Sunita"
      language="Garhwali / Hindi — translated"
    >
      <p>I have worked for Sahib since before Badi Memsahib passed. I cook, clean and keep the house. I live in the quarter behind the kitchen.</p>
      <p>Last night dinner was at half past seven. Sahib, Memsahib and Arjun baba ate. Doctor Sahib was not at dinner. After dinner Sahib and Arjun baba went to the study. At about eight I heard Sahib shout, &ldquo;Not one rupee more. Not one.&rdquo; Arjun baba came out and banged the door. I did not see where he went after. I thought to his room.</p>
      <p>I had lit the fire in the study at eight o&apos;clock, as always in October. Memsahib went upstairs at about nine with a headache. She told me not to disturb her.</p>
      <p>Doctor Sahib came at about five to nine. He comes every Saturday to check Sahib&apos;s pressure and give his vitamin injection. He had his black bag.</p>
      <p>At about twenty past nine I took Sahib his haldi milk. I knocked. Doctor Sahib opened the door only a little and took the tumbler from my hand. He said, &ldquo;We are nearly done, Sunita, you go.&rdquo; I could not see Sahib from the door. The room smelt like a hospital, like the spirit they put on cotton.</p>
      <p>I watched my serial on the kitchen TV until about ten. At around quarter past ten I came into the hall to lock the front door and I heard voices from the study, low, like talking. I thought Sahib was on the phone to someone. I did not knock. I did not hear Doctor Sahib&apos;s car go, the kitchen is at the back and the TV was on.</p>
      <p>I slept at about quarter to eleven. Around midnight our dog Bholu barked at the back gate, two or three minutes, then stopped. I did not get up.</p>
      <p>This morning at ten past seven I took Sahib&apos;s tea to the study because his bed was not slept in. He was in his chair, cold. His glasses were in his lap. The fire was dead. I screamed and called Memsahib.</p>
      <p>Sahib always took off his watch at night and put it on the charger by his bed. He said the light kept him awake. This morning it was still on his wrist.</p>
      <p>Arjun baba&apos;s scooter was in the shed in the morning.</p>
    </StatementPaper>
  );
}

/* Exhibit 7 — Dr. Kapoor's note on death */
export function DeathNote() {
  return (
    <Paper exhibit={7} envelope={1} width={640} style={{ backgroundColor: "#f5f0e4" }}>
      <div style={{ textAlign: "center" }}>
        <div className="serif" style={{ fontSize: 22, fontWeight: 700, letterSpacing: ".04em" }}>Dr. Anand Kapoor</div>
        <div className="serif small">M.B.B.S., M.D. (Medicine) · Reg. No. UMC/1994/2231</div>
        <div className="serif small">Medical Director, Rathore Memorial Hospital, Dehradun</div>
        <div className="serif small">KAPOOR CLINIC · Kulri Bazaar, Mussoorie · Ph. 0135 263 2418</div>
        <div className="small muted">Timings: 10–1 &amp; 5–8 · Sunday closed</div>
      </div>
      <hr className="double" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Hand>℞</Hand>
        <Hand>11/10/26 · 7.50 am</Hand>
      </div>
      <div style={{ lineHeight: 1.7, marginTop: 8 }}>
        <Hand style={{ display: "block" }}>To whomsoever it may concern</Hand>
        <Hand style={{ display: "block" }}>
          Seen Mr. V. S. Rathore, 64 M, at his residence Hollow Pines. Known case of Hypertension &amp; Atrial Fibrillation × 6 yrs, on T. Metoprolol 50 mg OD, T. Apixaban 5 mg BD, Inj. Vit B12 weekly.
        </Hand>
        <Hand style={{ display: "block" }}>
          O/E: No pulse, no heart sounds, no respiration. Pupils fixed &amp; dilated. Rigor present. <span className="underline-hand">No external injury.</span>
        </Hand>
        <Hand style={{ display: "block" }}>
          Opinion: Sudden cardiac death secondary to known cardiac disease. Probable time of death approx. <span className="circled">1.00 am</span> (11/10).
        </Hand>
        <Hand style={{ display: "block" }}>
          Death is natural. In my opinion post-mortem is not required &amp; family wishes to be spared distress.
        </Hand>
      </div>
      <div style={{ textAlign: "right", marginTop: 22 }}>
        <Sign>A Kapoor</Sign>
        <div className="small">(Dr. Anand Kapoor)</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
        <RoundSeal top="DR. ANAND KAPOOR" bottom="MUSSOORIE" center="M.D." size={84} rotate={8} />
        <Hand brown style={{ fontSize: 18, maxWidth: 300, textAlign: "right" }}>
          Received 08:10. Not accepted pending PM. — RKB
        </Hand>
      </div>
    </Paper>
  );
}
