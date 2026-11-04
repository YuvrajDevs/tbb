"use client";

import Link from "next/link";
import { accountsAvailable, signInWithGoogle, signOut, useAuth } from "@/lib/account";

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
