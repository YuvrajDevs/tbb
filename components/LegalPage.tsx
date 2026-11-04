import Link from "next/link";
import { ArrowLeft } from "./Arrow";
import { SiteFooter } from "./SiteFooter";
import { CONTACT_EMAIL, POLICY_DATE } from "@/lib/site";

/** Shared frame for the privacy policy and terms: a typed document on paper, in the site's style. */
export function LegalPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="page">
      <div className="wrap page-main legal">
        <nav className="archive-nav">
          <Link href="/" className="btn ghost back-link">{ArrowLeft} The Bureau</Link>
        </nav>
        <article className="legal-doc paper">
          <div className="gate-eyebrow">{eyebrow}</div>
          <h1 className="legal-title">{title}</h1>
          <div className="legal-date">Last updated {POLICY_DATE}</div>
          {children}
        </article>
      </div>
      <SiteFooter />
    </div>
  );
}

/** How to reach the people behind the site, or a note that it is being set up. */
export function Contact() {
  return CONTACT_EMAIL ? (
    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
  ) : (
    <span>the contact address that will be published on this page</span>
  );
}
