import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = { title: "File not found" };

export default function NotFound() {
  return (
    <div className="page">
      <div className="wrap page-main nf">
        <div className="eyebrow">Error 404 · Records office</div>
        <h1 className="nf-title">No such file.</h1>
        <p className="nf-p">The Bureau has no record at this address. The file may have been moved, or the reference copied wrong.</p>
        <div className="lhero-cta">
          <Link href="/cases" className="btn primary">Open the case archive</Link>
          <Link href="/" className="btn">The Bureau</Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
