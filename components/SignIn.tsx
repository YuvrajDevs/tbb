"use client";

import { ArrowLeft } from "@/components/Arrow";
import Link from "next/link";
import { useState } from "react";
import { accountsAvailable, signInRequired, signInWithGoogle, useAuth } from "@/lib/account";

const GoogleG = (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

export function GoogleButton({ next, label = "Continue with Google" }: { next?: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="btn google-btn"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await signInWithGoogle(next);
        } finally {
          window.setTimeout(() => setBusy(false), 4000);
        }
      }}
    >
      <span className="google-g">{GoogleG}</span>
      {busy ? "Opening Google…" : label}
    </button>
  );
}

/**
 * Shows the page only to signed-in players when sign-in is required; otherwise a sign-in card.
 * When sign-in is not required (or accounts are not set up), it simply shows the page.
 */
export function SignInGate({ children, what = "open this case" }: { children: React.ReactNode; what?: string }) {
  const { ready, user } = useAuth();
  if (!signInRequired) return <>{children}</>;
  if (!ready) return <div className="gate-wait eyebrow">Checking your Bureau credentials…</div>;
  if (user) return <>{children}</>;
  return (
    <div className="page">
      <div className="wrap page-main gate">
        <Link href="/cases" className="btn ghost back-link">{ArrowLeft} Case archive</Link>
        <div className="gate-card paper">
          <div className="gate-eyebrow">The Blackwood Bureau · Credentials</div>
          <h1 className="gate-title">Sign in to {what}</h1>
          <p className="gate-p">
            The Bureau keeps a file on every detective. Sign in once and your progress, your closed cases and your name at the
            table follow you to any phone or computer.
          </p>
          <GoogleButton />
          <p className="gate-small">
            We only use your name, email and picture from Google, and never post anything. By continuing you agree to the{" "}
            <Link href="/terms">terms</Link> and <Link href="/privacy">privacy policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

/** For page headers: "Sign in", or the player's initial and name linking to their account. */
export function AccountButton({ compact = false }: { compact?: boolean }) {
  const { ready, user, profile } = useAuth();
  if (!accountsAvailable || !ready) return null;
  if (!user) {
    return (
      <button className={`btn ${compact ? "sm" : ""}`} onClick={() => signInWithGoogle()}>
        Sign in
      </button>
    );
  }
  const name = profile?.display_name ?? "Detective";
  return (
    <Link href="/account" className={`btn account-btn ${compact ? "sm" : ""}`} title="Your account">
      {profile?.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={profile.avatar_url} alt="" className="account-avatar" referrerPolicy="no-referrer" />
      ) : (
        <span className="account-avatar initial">{name.slice(0, 1).toUpperCase()}</span>
      )}
      <span className="account-name">{name.split(" ")[0]}</span>
    </Link>
  );
}
