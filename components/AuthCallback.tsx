"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

/** Google sends the player back here; Supabase finishes the sign-in, then we return to where they were. */
export function AuthCallback() {
  const router = useRouter();
  const [err, setErr] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("next") || "/cases";
    const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/cases"; // only ever return inside the site
    if (params.get("error")) {
      setErr(params.get("error_description") || "Google sign-in was cancelled.");
      return;
    }
    let done = false;
    void getSupabase().then(async (sb) => {
      if (!sb) return setErr("Accounts are not set up on this site.");
      const finish = () => {
        if (done) return;
        done = true;
        router.replace(next);
      };
      const code = params.get("code");
      const existing = await sb.auth.getSession();
      if (existing.data.session) return finish();
      if (code) {
        const { error } = await sb.auth.exchangeCodeForSession(code);
        if (!error) return finish();
        const again = await sb.auth.getSession(); // the client may already have used the code
        if (again.data.session) return finish();
        setErr(error.message);
        return;
      }
      setErr("The sign-in link was incomplete. Please try again.");
    });
  }, [router]);
  return (
    <div className="wrap" style={{ paddingTop: "22vh", textAlign: "center" }}>
      {err ? (
        <>
          <div className="eyebrow">Sign-in did not finish</div>
          <p style={{ color: "var(--text-2)" }}>{err}</p>
          <Link href="/cases" className="btn">Back to the case archive</Link>
        </>
      ) : (
        <div className="eyebrow">Checking your Bureau credentials…</div>
      )}
    </div>
  );
}
