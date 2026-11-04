"use client";

import Link from "next/link";
import { accountsAvailable, signInWithGoogle, signOut, useAuth } from "@/lib/account";
import { ArrowRight } from "./Arrow";

/**
 * Landing page header, top right.
 * Signed out: a single "Sign in". Signed in: "Sign out" and "Case archive", the same size.
 */
export function LandingNavActions() {
  const { ready, user } = useAuth();
  if (accountsAvailable && !ready) return <div className="nav-right" aria-hidden />;
  if (accountsAvailable && !user) {
    return (
      <div className="nav-right">
        <button className="btn primary sm" onClick={() => signInWithGoogle("/cases")}>Sign in</button>
      </div>
    );
  }
  return (
    <div className="nav-right">
      {accountsAvailable && <button className="btn sm" onClick={() => void signOut()}>Sign out</button>}
      <Link href="/cases" className="btn primary sm">Case archive</Link>
    </div>
  );
}

/**
 * Hero buttons. Signed out: "Open the case archive" and "Sign in".
 * Signed in: "Open the case archive" and "Join a party room".
 */
export function HeroActions() {
  const { ready, user } = useAuth();
  const signedOut = accountsAvailable && ready && !user;
  return (
    <div className="lhero-cta">
      <Link href="/cases" className="btn primary">Open the case archive</Link>
      {signedOut ? (
        <button className="btn" onClick={() => signInWithGoogle("/cases")}>Sign in</button>
      ) : (
        <Link href="/room" className="btn" style={accountsAvailable && !ready ? { visibility: "hidden" } : undefined}>
          Join a party room
        </Link>
      )}
    </div>
  );
}

/** Archive header, right side: "Join a party room" only for signed-in players. */
export function ArchiveJoin() {
  const { ready, user } = useAuth();
  if (accountsAvailable && (!ready || !user)) return null;
  return (
    <Link href="/room" className="btn">
      Join a party room {ArrowRight}
    </Link>
  );
}

/** "Ways to play" card buttons: anything that starts a game asks signed-out visitors to sign in first. */
export function WayAction({ href, label, needsSignIn }: { href: string; label: string; needsSignIn?: boolean }) {
  const { ready, user } = useAuth();
  if (needsSignIn && accountsAvailable && ready && !user) {
    return (
      <button className="btn sm lway-cta" onClick={() => signInWithGoogle("/cases")}>
        Sign in to play {ArrowRight}
      </button>
    );
  }
  return (
    <Link href={href} className="btn sm lway-cta" style={needsSignIn && accountsAvailable && !ready ? { visibility: "hidden" } : undefined}>
      {label} {ArrowRight}
    </Link>
  );
}
