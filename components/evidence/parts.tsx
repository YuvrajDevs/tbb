import type { CSSProperties, ReactNode } from "react";

export function Paper({
  children,
  exhibit,
  envelope,
  variant,
  clip,
  punch,
  style,
  width = 760,
}: {
  children: ReactNode;
  exhibit: number;
  envelope: number;
  variant?: "aged" | "ruled" | "white";
  clip?: boolean;
  punch?: boolean;
  style?: CSSProperties;
  width?: number;
}) {
  return (
    <div
      className={`paper ${variant === "aged" ? "aged" : variant === "ruled" ? "ruled" : ""}`}
      style={{ maxWidth: width, margin: "0 auto", ...(variant === "white" ? { backgroundColor: "#f7f3ea" } : {}), ...style }}
    >
      {clip && <span className="clip no-print" />}
      {punch && (
        <>
          <span className="punch no-print" style={{ top: "22%" }} />
          <span className="punch no-print" style={{ top: "72%" }} />
        </>
      )}
      {children}
      <ExhibitFooter exhibit={exhibit} envelope={envelope} />
    </div>
  );
}

export function ExhibitFooter({ exhibit, envelope }: { exhibit: number; envelope: number }) {
  return (
    <div
      style={{
        marginTop: 36,
        paddingTop: 8,
        borderTop: "1px solid rgba(27,22,17,.25)",
        display: "flex",
        justifyContent: "space-between",
        fontFamily: "var(--type)",
        fontSize: 10,
        letterSpacing: ".18em",
        color: "var(--ink-3)",
        textTransform: "uppercase",
      }}
    >
      <span>Blackwood Bureau · Case No. 017</span>
      <span>
        Env. {envelope} · Exhibit {String(exhibit).padStart(2, "0")}
      </span>
    </div>
  );
}

export function Stamp({
  children,
  rotate = -4,
  size = 13,
  style,
  double,
}: {
  children: ReactNode;
  rotate?: number;
  size?: number;
  style?: CSSProperties;
  double?: boolean;
}) {
  return (
    <span
      className="stamp"
      style={{
        transform: `rotate(${rotate}deg)`,
        fontSize: size,
        ...(double ? { outline: "1.5px solid var(--stamp)", outlineOffset: 2 } : {}),
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function RoundSeal({ top, bottom, center, size = 110, rotate = -12, style }: { top: string; bottom: string; center: string; size?: number; rotate?: number; style?: CSSProperties }) {
  const id = `arc-${top.replace(/\W/g, "")}-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ transform: `rotate(${rotate}deg)`, opacity: 0.78, mixBlendMode: "multiply", ...style }} aria-hidden>
      <defs>
        <path id={id + "t"} d="M 18 60 A 42 42 0 0 1 102 60" />
        <path id={id + "b"} d="M 16 60 A 44 44 0 0 0 104 60" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="#6e2f1c" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="34" fill="none" stroke="#6e2f1c" strokeWidth="1.2" />
      <text fontFamily="Courier Prime, monospace" fontWeight="700" fontSize="10.5" fill="#6e2f1c" letterSpacing="1.6">
        <textPath href={`#${id}t`} startOffset="50%" textAnchor="middle">{top}</textPath>
      </text>
      <text fontFamily="Courier Prime, monospace" fontWeight="700" fontSize="9.5" fill="#6e2f1c" letterSpacing="1.4">
        <textPath href={`#${id}b`} startOffset="50%" textAnchor="middle" dominantBaseline="hanging">{bottom}</textPath>
      </text>
      <text x="60" y="64" textAnchor="middle" fontFamily="Courier Prime, monospace" fontWeight="700" fontSize="11" fill="#6e2f1c">
        {center}
      </text>
    </svg>
  );
}

export function F({ k, v, w }: { k: string; v: ReactNode; w?: number }) {
  return (
    <div className="field">
      <span className="k" style={w ? { width: w } : undefined}>{k}</span>
      <span className="v">{v}</span>
    </div>
  );
}

export function Hand({ children, style, brown }: { children: ReactNode; style?: CSSProperties; brown?: boolean }) {
  return (
    <span className={`hand ${brown ? "brown" : ""}`} style={style}>
      {children}
    </span>
  );
}

export function Sign({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span className="sign" style={style}>
      {children}
    </span>
  );
}

export function StatementPaper({
  exhibit,
  envelope,
  name,
  age,
  relation,
  address,
  date,
  time,
  place,
  recordedBy,
  children,
  signature,
  language = "Hindi and English (translated where noted)",
}: {
  exhibit: number;
  envelope: number;
  name: string;
  age: number;
  relation: string;
  address: string;
  date: string;
  time: string;
  place: string;
  recordedBy: string;
  children: ReactNode;
  signature: string;
  language?: string;
}) {
  return (
    <Paper exhibit={exhibit} envelope={envelope} punch>
      <div style={{ textAlign: "center" }}>
        <div className="serif" style={{ fontSize: 13, letterSpacing: ".2em" }}>UTTARAKHAND POLICE</div>
        <div className="serif" style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>Statement of Witness</div>
        <div className="small">Recorded under Section 180, Bharatiya Nagarik Suraksha Sanhita, 2023</div>
        <div className="small">Police Station Mussoorie, District Dehradun · GD Entry No. 14/2026-10-11</div>
      </div>
      <hr className="double" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
        <F k="Name:" v={name} />
        <F k="Age:" v={`${age} years`} />
        <F k="Relation to deceased:" v={relation} />
        <F k="Language:" v={language} />
        <F k="Date:" v={date} />
        <F k="Time:" v={time} />
      </div>
      <F k="Address:" v={address} />
      <F k="Place of recording:" v={place} />
      <hr className="thin" />
      <div style={{ whiteSpace: "normal" }}>{children}</div>
      <hr className="thin" />
      <div className="small" style={{ marginTop: 10 }}>
        Read over to the witness, who admits it to be correctly recorded.
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18, gap: 20, flexWrap: "wrap" }}>
        <div>
          <Sign>{signature}</Sign>
          <div className="small" style={{ borderTop: "1px solid var(--ink)", paddingTop: 2, minWidth: 180 }}>Signature of witness</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <Sign style={{ fontSize: 30 }}>R. K. Bisht</Sign>
          <div className="small" style={{ borderTop: "1px solid var(--ink)", paddingTop: 2, minWidth: 220 }}>{recordedBy}</div>
        </div>
      </div>
    </Paper>
  );
}

export function Q({ q, children }: { q: string; children: ReactNode }) {
  return (
    <div style={{ margin: "10px 0" }}>
      <div style={{ fontWeight: 700 }}>Q. {q}</div>
      <div>A. {children}</div>
    </div>
  );
}
