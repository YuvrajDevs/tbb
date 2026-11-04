"use client";

import { ArrowLeft } from "@/components/Arrow";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cases } from "@/lib/cases/hollow-pines";
import { listHistory, loadProgress, renameProfile, signOut, useAuth, type HistoryRow, type SavedProgress } from "@/lib/account";
import { GoogleButton } from "./SignIn";
import { SettingsButton } from "./SoundSettings";
import { SiteFooter } from "./SiteFooter";

export function AccountPage() {
  const { ready, user, profile } = useAuth();
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<"" | "saving" | "saved" | "error">("");
  const [history, setHistory] = useState<HistoryRow[] | null>(null);
  const [progress, setProgress] = useState<Record<string, SavedProgress | null>>({});

  useEffect(() => {
    if (profile) setName(profile.display_name);
  }, [profile]);
  useEffect(() => {
    if (!user) return;
    void listHistory().then(setHistory);
    void Promise.all(Object.keys(cases).map(async (id) => [id, await loadProgress(id).catch(() => null)] as const)).then((rows) => setProgress(Object.fromEntries(rows)));
  }, [user]);

  const inProgress = Object.entries(progress).filter(([, p]) => p && !p.state.finishedAt);
  const date = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="page">
      <div className="wrap page-main" style={{ maxWidth: 860 }}>
        <nav className="archive-nav">
          <Link href="/cases" className="btn ghost back-link">{ArrowLeft} Case archive</Link>
          <SettingsButton />
        </nav>
        {!ready ? (
          <div className="eyebrow" style={{ marginTop: 60 }}>Checking your Bureau credentials…</div>
        ) : !user ? (
          <div className="gate-card paper" style={{ marginTop: 40 }}>
            <div className="gate-eyebrow">The Blackwood Bureau · Credentials</div>
            <h1 className="gate-title">Your detective file</h1>
            <p className="gate-p">Sign in to see your closed cases and pick up any case where you left it, on any device.</p>
            <GoogleButton next="/account" />
          </div>
        ) : (
          <>
            <header className="acct-head">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="" className="acct-avatar" referrerPolicy="no-referrer" />
              ) : (
                <span className="acct-avatar initial">{(profile?.display_name ?? "D").slice(0, 1).toUpperCase()}</span>
              )}
              <div>
                <div className="eyebrow">Detective on file</div>
                <h1 className="acct-name">{profile?.display_name}</h1>
                <div className="acct-email">{user.email}</div>
              </div>
            </header>

            <section className="acct-sec">
              <h2 className="acct-h">Name at the table</h2>
              <p className="muted-dark">Shown to other players when you open or join a party room.</p>
              <form
                className="acct-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSaved("saving");
                  setSaved((await renameProfile(name)) ? "saved" : "error");
                }}
              >
                <input className="field-input" value={name} maxLength={40} onChange={(e) => { setName(e.target.value); setSaved(""); }} aria-label="Your name" />
                <button className="btn primary" disabled={!name.trim() || name.trim() === profile?.display_name || saved === "saving"}>
                  {saved === "saving" ? "Saving…" : "Save"}
                </button>
                {saved === "saved" && <span className="muted-dark">Saved.</span>}
                {saved === "error" && <span className="lookagain" style={{ margin: 0 }}>Could not save. Try again.</span>}
              </form>
            </section>

            {inProgress.length > 0 && (
              <section className="acct-sec">
                <h2 className="acct-h">Open cases</h2>
                <ul className="acct-list">
                  {inProgress.map(([id, p]) => {
                    const c = cases[id];
                    const solvedCount = Object.keys(p!.state.solved ?? {}).length;
                    return (
                      <li key={id}>
                        <div>
                          <div className="acct-case">Case No. {c.number} · {c.title}</div>
                          <div className="muted-dark">{solvedCount} of {c.rounds.length} envelopes closed</div>
                        </div>
                        <Link href={`/case/${id}/desk`} className="btn sm">Continue</Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <section className="acct-sec">
              <h2 className="acct-h">Closed cases</h2>
              {history === null ? (
                <p className="muted-dark">Opening the records…</p>
              ) : history.length === 0 ? (
                <p className="muted-dark">No closed cases yet. <Link href="/cases" style={{ color: "var(--text)" }}>Open a file</Link>.</p>
              ) : (
                <ul className="acct-list">
                  {history.map((h) => {
                    const c = cases[h.case_id];
                    return (
                      <li key={h.id}>
                        <div>
                          <div className="acct-case">Case No. {c?.number ?? h.case_id} · {c?.title ?? "Case"}</div>
                          <div className="muted-dark">
                            {date(h.finished_at)} · {h.mode === "party" ? `Party room${h.players ? `, ${h.players} players` : ""}` : "Solo"}
                            {h.minutes != null && ` · ${Math.floor(h.minutes / 60)}h ${h.minutes % 60}m`}
                            {h.hints != null && ` · ${h.hints} hint${h.hints === 1 ? "" : "s"}`}
                          </div>
                        </div>
                        <span className={`stamp acct-verdict ${h.correct === 3 ? "solved" : ""}`}>{h.correct === 3 ? "Solved" : `${h.correct ?? 0} of 3`}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section className="acct-sec">
              <button className="btn" onClick={() => void signOut()}>Sign out</button>
            </section>
          </>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
