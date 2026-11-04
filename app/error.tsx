"use client";

import Link from "next/link";
import { useEffect } from "react";
import { reportError } from "@/lib/errors";

/** Shown if a page crashes: a calm message in the Bureau's style instead of a blank screen. The error is filed. */
export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => reportError(error, "page"), [error]);
  return (
    <div className="wrap nf">
      <div className="eyebrow">Records office · An error</div>
      <h1 className="nf-title">The file slipped.</h1>
      <p className="nf-p">Something went wrong opening this page. It has been reported. Your saved progress is safe.</p>
      <div className="lhero-cta">
        <button className="btn primary" onClick={() => reset()}>Try again</button>
        <Link href="/cases" className="btn">Case archive</Link>
      </div>
    </div>
  );
}
