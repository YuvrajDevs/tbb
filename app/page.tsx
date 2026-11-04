import Link from "next/link";
import { Shelf } from "@/components/Shelf";

export default function Home() {
  return (
    <div className="wrap" style={{ paddingTop: 56, paddingBottom: 80 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div className="eyebrow">Private enquiries · Est. 1961</div>
          <h1 style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: "clamp(34px, 6vw, 58px)", margin: "10px 0 6px", letterSpacing: "-.01em", lineHeight: 1.05 }}>
            The Blackwood Bureau
          </h1>
          <div style={{ fontStyle: "italic", color: "var(--text-2)", fontSize: 19 }}>Open the file. Find the truth.</div>
        </div>
        <div style={{ textAlign: "right", color: "var(--text-3)", fontFamily: "var(--type)", fontSize: 12, letterSpacing: ".08em" }}>
          CASE ARCHIVE
          <br />
          <Link href="/room" style={{ color: "var(--text-2)" }}>Join a party room →</Link>
        </div>
      </header>
      <hr className="rule" style={{ margin: "34px 0 40px" }} />
      <Shelf />
      <footer style={{ marginTop: 80, color: "var(--text-3)", fontSize: 13, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span>All characters, places and documents in these files are fictional.</span>
        <span style={{ fontFamily: "var(--type)", letterSpacing: ".1em" }}>BLACKWOOD HOUSE · DEHRADUN</span>
      </footer>
    </div>
  );
}
