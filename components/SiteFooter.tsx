import Link from "next/link";

/** Page footer, pinned to the bottom of short pages by the `.page` layout. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer-in">
        <span>All characters, places and documents in these files are fictional.</span>
        <span className="site-footer-right">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <span className="site-footer-mark">BLACKWOOD HOUSE · DEHRADUN</span>
        </span>
      </div>
    </footer>
  );
}
