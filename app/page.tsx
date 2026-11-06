import Link from "next/link";
import { cases } from "@/lib/cases/hollow-pines";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroActions, LandingNavActions, WayAction } from "@/components/LandingActions";

const c = cases["017"];
const exhibits = c.rounds.reduce((n, r) => n + r.files.length, 0);

const SERVICES = [
  {
    k: "I",
    h: "The case file, complete",
    p: "Every case arrives as the police and the Bureau assembled it: statements, a post-mortem, call records, a gate camera's register, a pocket diary, a lawyer's letter. Each exhibit is drawn as the real document, to be read closely.",
  },
  {
    k: "II",
    h: "A narrator at your shoulder",
    p: "A calm voice opens the file, sets the scene before each envelope and sums up any exhibit on request. It tells you what happened. It never tells you what it means.",
  },
  {
    k: "III",
    h: "Opened in order, like a real enquiry",
    p: "Five sealed envelopes, released one at a time. Each ends with a single question the evidence can answer. Get it right and the next envelope opens.",
  },
];

const STEPS = [
  ["Read the briefing", "The Director's memo, the inquest report, the people of interest. The narrator explains how you came to be holding the file."],
  ["Work the envelope", "Open each exhibit. Compare times, statements and records. Keep notes and mark your suspects in a private notebook."],
  ["Answer the checkpoint", "One question closes each round. If you are stuck, three sealed hints go from a nudge to the answer, and the report counts them."],
  ["Make your accusation", "When the last envelope is read, name who did it, how it was done and why. In a party room, everyone votes first."],
  ["Hear the reveal", "The narrator walks through the night as it really happened, then the Bureau issues its report on your work."],
];

const CASES = [
  { h: "Classic murder", p: "A death everyone is ready to call natural, and one inspector who is not.", open: true },
  { h: "Poison and medicine", p: "Doctors, dispensaries and drugs that leave very little behind." },
  { h: "Money and fraud", p: "Trusts, ledgers and the paper trail that someone hoped nobody would follow." },
  { h: "Alibis and timelines", p: "Gate registers, call logs and clocks that are not quite right." },
  { h: "Disappearances", p: "A person gone, a room left as it was, and the people who last saw them." },
  { h: "Cold cases", p: "Files closed years ago and reopened because one detail never sat right." },
];

const WAYS = [
  {
    tag: "1 player",
    h: "Solo detective",
    p: "Work the file alone, at your own pace. Your progress, notes and hints are kept on your device, so you can stop and come back.",
    cta: { label: "Open the archive", href: "/cases" },
  },
  {
    tag: "2 to 6 players",
    h: "Party room, anywhere",
    p: "One host opens a room and shares a five-letter code. Everyone joins from their own phone or laptop, in the same room or different cities: table chat, suggested answers, point everyone to an exhibit, and vote on the accusation.",
    cta: { label: "Join a party room", href: "/room" },
  },
  {
    tag: "House party · game night",
    h: "The printed kit",
    p: "Print the whole case for the table: a host guide, envelope labels, every exhibit, a case board and a sealed solution. Lay out the envelopes, dim the lights and open the first one together.",
    cta: { label: "See the case", href: `/case/${c.id}` },
  },
];

const FAQ = [
  ["Do we need to download anything?", "No. Cases play in the browser on a phone, tablet or computer. Party rooms work across separate devices."],
  ["How long does a case take?", "A case can take up to an hour. Solo progress is saved on your device, so you can stop and pick it up again later."],
  ["Will the hints spoil it?", "Hints are sealed in three levels and show only on the device that asks. They never name the killer."],
  ["Are the cases real?", "No. Every character, place and document in the Bureau's files is fictional."],
];

export default function Landing() {
  return (
    <div className="page landing">
      <header className="lnav">
        <div className="wrap lnav-in">
          <Link href="/" className="lnav-mark" aria-label="The Blackwood Bureau, home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stamp-light.png" alt="The Blackwood Bureau" className="lnav-stamp" />
          </Link>
          <nav className="lnav-links" aria-label="Sections">
            <a href="#what">What we do</a>
            <a href="#how">How it works</a>
            <a href="#cases">Our cases</a>
            <a href="#play">Ways to play</a>
          </nav>
          <LandingNavActions />
        </div>
      </header>

      {/* ---------- hero ---------- */}
      <section className="lhero wrap">
        <div className="lhero-copy">
          <div className="eyebrow">Private enquiries · Est. 1961 · Dehradun</div>
          <h1 className="lhero-title">The Blackwood Bureau</h1>
          <p className="lhero-tag">Open the file. Find the truth.</p>
          <p className="lhero-lead">
            For sixty-five years the Bureau has been called in on the deaths the police could not close. We do not
            solve them for you. We hand you the file, every statement, record and photograph, and we wait for your
            report.
          </p>
          <HeroActions />
          <div className="lhero-facts">
            <span>{c.players} players</span>
            <span>{c.playTime}</span>
            <span>Phone or computer</span>
          </div>
        </div>
        <div className="lhero-art" aria-hidden>
          <div className="lmemo paper">
            <div className="lmemo-head">
              <span className="serif" style={{ fontWeight: 700, letterSpacing: ".06em" }}>INTERNAL MEMORANDUM</span>
              <span className="stamp" style={{ fontSize: 11 }}>Confidential</span>
            </div>
            <div className="lmemo-row"><span>TO:</span><span>Assigned Detective (you)</span></div>
            <div className="lmemo-row"><span>FROM:</span><span>D. Blackwood, Director</span></div>
            <div className="lmemo-row"><span>RE:</span><span>Case No. {c.number}</span></div>
            <p className="lmemo-p">Work only from what is in the file. Hearsay, instinct and the reputations of doctors are not evidence.</p>
            <div className="lmemo-sign">D. Blackwood</div>
          </div>
          <div className="lhero-folder">
            <div className="tab" />
            <div className="body">
              <span className="eyebrow" style={{ color: "var(--brown-deep)" }}>Case No. {c.number}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/stamp.png" alt="" className="lhero-stamp" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what we do ---------- */}
      <section id="what" className="lsec wrap">
        <div className="lsec-head">
          <div className="eyebrow">What we do</div>
          <h2>We give you the file. You find the truth.</h2>
          <p>The Bureau does not tell stories. It keeps records. Each case is a complete investigation, waiting for a detective to read it properly.</p>
        </div>
        <div className="lgrid3">
          {SERVICES.map((s) => (
            <article key={s.k} className="lcard">
              <div className="lcard-k">{s.k}</div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- how it works ---------- */}
      <section id="how" className="lsec wrap">
        <div className="lsec-head">
          <div className="eyebrow">How a case works</div>
          <h2>Five envelopes. One question each. One accusation.</h2>
        </div>
        <ol className="lsteps">
          {STEPS.map(([h, p], i) => (
            <li key={h}>
              <span className="lsteps-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- cases we take ---------- */}
      <section id="cases" className="lsec wrap">
        <div className="lsec-head">
          <div className="eyebrow">The cases we take</div>
          <h2>Murder, money, medicine and the clocks in between.</h2>
          <p>One case is open on the archive today. The others are being written, and each new file joins the archive when it is ready.</p>
        </div>
        <div className="lgrid3">
          {CASES.map((k) => (
            <article key={k.h} className={`lcard ltype ${k.open ? "open" : ""}`}>
              <div className="ltype-top">
                <h3>{k.h}</h3>
                <span className={`stamp ${k.open ? "" : "dark"}`} style={{ fontSize: 9.5, padding: "2px 7px" }}>{k.open ? "Open" : "In preparation"}</span>
              </div>
              <p>{k.p}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- featured case ---------- */}
      <section className="lsec wrap">
        <div className="lfeature paper">
          <div className="lfeature-copy">
            <div className="lfeature-eyebrow">Now open · Case No. {c.number}</div>
            <h2>{c.title}</h2>
            <p className="lfeature-sub">{c.subtitle}</p>
            <p>{c.summary}</p>
            <div className="lfeature-cta">
              <Link href={`/case/${c.id}`} className="btn lfeature-btn">Open Case No. {c.number}</Link>
            </div>
          </div>
          <dl className="lfeature-facts">
            <div><dt>Genre</dt><dd>{c.genre}</dd></div>
            <div><dt>Players</dt><dd>{c.players}</dd></div>
            <div><dt>Play time</dt><dd>{c.playTime}</dd></div>
            <div><dt>Envelopes</dt><dd>{c.rounds.length}</dd></div>
            <div><dt>Exhibits</dt><dd>{exhibits}</dd></div>
            <div><dt>Location</dt><dd>Mussoorie</dd></div>
          </dl>
        </div>
      </section>

      {/* ---------- ways to play ---------- */}
      <section id="play" className="lsec wrap">
        <div className="lsec-head">
          <div className="eyebrow">Ways to play</div>
          <h2>Alone at midnight, with friends across cities, or round the dining table.</h2>
        </div>
        <div className="lgrid3">
          {WAYS.map((w) => (
            <article key={w.h} className="lcard lway">
              <div className="eyebrow">{w.tag}</div>
              <h3>{w.h}</h3>
              <p>{w.p}</p>
              <WayAction href={w.cta.href} label={w.cta.label} needsSignIn={w.cta.href === "/room"} />
            </article>
          ))}
        </div>
      </section>

      {/* ---------- director's note ---------- */}
      <section className="lsec wrap">
        <blockquote className="lquote">
          <p>&ldquo;Trust the inspector&apos;s instincts. Check his times.&rdquo;</p>
          <footer>D. Blackwood, Director · note on File No. {c.number}</footer>
        </blockquote>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="lsec wrap">
        <div className="lsec-head">
          <div className="eyebrow">Before you begin</div>
          <h2>Questions the Bureau is often asked</h2>
        </div>
        <div className="lfaq">
          {FAQ.map(([q, a]) => (
            <div key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- closing CTA ---------- */}
      <section className="lclose wrap">
        <div className="eyebrow">A file is waiting</div>
        <h2>Somebody in that house is lying to you.</h2>
        <div className="lhero-cta" style={{ justifyContent: "center" }}>
          <Link href="/cases" className="btn primary">Open the case archive</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
