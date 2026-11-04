import Link from "next/link";
import { Shelf } from "@/components/Shelf";
import { SettingsButton } from "@/components/SoundSettings";
import { SiteFooter } from "@/components/SiteFooter";
import { AccountButton } from "@/components/SignIn";

export const metadata = {
  title: "Case archive",
  description: "The Bureau's open case files. Play solo, in a party room for 2 to 6, or print the kit for game night.",
};

export default function CaseArchive() {
  return (
    <div className="page">
      <div className="wrap page-main">
        <nav className="archive-nav">
          <Link href="/" className="btn ghost back-link">← The Bureau</Link>
          <div className="nav-right">
            <SettingsButton />
            <AccountButton />
          </div>
        </nav>
        <header className="archive-head">
          <div>
            <div className="eyebrow">Private enquiries · Est. 1961</div>
            <h1 className="archive-title">The Blackwood Bureau</h1>
            <div className="archive-tag">Open the file. Find the truth.</div>
          </div>
          <div className="archive-side">
            <div className="eyebrow">Case archive</div>
            <Link href="/room" className="btn">Join a party room <span aria-hidden>→</span></Link>
          </div>
        </header>
        <hr className="rule archive-rule" />
        <Shelf />
      </div>
      <SiteFooter />
    </div>
  );
}
