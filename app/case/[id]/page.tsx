import { ArrowLeft } from "@/components/Arrow";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cases } from "@/lib/cases/hollow-pines";
import { CoverActions } from "@/components/CoverActions";

export function generateStaticParams() {
  return Object.keys(cases).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const c = cases[(await params).id];
  if (!c) return { title: "Case not found" };
  return { title: `Case No. ${c.number} · ${c.title}`, description: `${c.subtitle} ${c.genre}, ${c.players} players, ${c.playTime.toLowerCase()}.` };
}

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = cases[id];
  if (!c) notFound();
  return (
    <div className="wrap" style={{ paddingTop: 28, paddingBottom: 80, maxWidth: 980 }}>
      <Link href="/cases" className="btn ghost" style={{ paddingLeft: 0 }}>{ArrowLeft} Case archive</Link>
      <div style={{ position: "relative", marginTop: 24 }}>
        {/* tab */}
        <div style={{ width: 220, height: 30, background: "var(--manila-2)", border: "1px solid var(--kraft)", borderBottom: 0, borderRadius: "5px 14px 0 0", fontFamily: "var(--type)", fontSize: 12, letterSpacing: ".2em", color: "var(--brown-deep)", padding: "7px 16px" }}>
          FILE · NO. {c.number}
        </div>
        <div style={{ background: "var(--manila)", border: "1px solid var(--kraft)", borderRadius: "0 6px 6px 6px", color: "var(--ink)", padding: "clamp(24px, 5vw, 56px)", boxShadow: "0 30px 70px rgba(0,0,0,.55)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(62,42,24,.035) 0 1px, transparent 1px 4px)", pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap", position: "relative" }}>
            <div>
              <div style={{ fontFamily: "var(--type)", fontSize: 12, letterSpacing: ".3em", color: "var(--brown-deep)" }}>THE BLACKWOOD BUREAU</div>
              <div style={{ fontFamily: "var(--type)", fontSize: "clamp(30px,5vw,44px)", letterSpacing: ".12em", fontWeight: 700, marginTop: 6 }}>CASE NO. {c.number}</div>
            </div>
            <span className="stamp" style={{ fontSize: 18, transform: "rotate(7deg)", borderWidth: 3 }}>Confidential</span>
          </div>
          <div style={{ position: "relative", marginTop: 34 }}>
            <h1 style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: "clamp(28px,4.4vw,44px)", lineHeight: 1.12, margin: 0 }}>{c.title}</h1>
            <p style={{ fontStyle: "italic", fontSize: 19, margin: "10px 0 0", color: "var(--brown-deep)" }}>{c.subtitle}</p>
          </div>
          {/* typed slip */}
          <div className="paper" style={{ marginTop: 34, padding: "26px 28px", boxShadow: "0 8px 20px rgba(0,0,0,.22)", transform: "rotate(-.4deg)" }}>
            <p style={{ margin: 0 }}>{c.summary}</p>
            <hr className="thin" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px 20px", fontSize: 13 }}>
              <div><div className="muted small">GENRE</div>{c.genre}</div>
              <div><div className="muted small">PLAYERS</div>{c.players}</div>
              <div><div className="muted small">PLAY TIME</div>{c.playTime}</div>
              <div><div className="muted small">OPENED</div>{c.dateOpened}</div>
            </div>
            <div className="small muted" style={{ marginTop: 10 }}>{c.location}</div>
          </div>
          <CoverActions caseId={c.id} />
        </div>
      </div>
    </div>
  );
}
