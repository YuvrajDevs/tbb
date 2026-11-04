"use client";

import { getSupabase } from "./supabase";

/*
 * Error reporting. Every unexpected browser error is filed in the Supabase table `client_errors` (no names
 * or emails; kept 90 days). If NEXT_PUBLIC_SENTRY_DSN is set, errors also go to Sentry, which emails alerts.
 */

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const RELEASE = (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "dev").slice(0, 12);
const MAX_PER_PAGE = 5;

// noise that is not a bug: autoplay refusals, aborted media, browser extensions, resize loops
const IGNORE = [/NotAllowedError/i, /AbortError/i, /play\(\) request was interrupted/i, /ResizeObserver loop/i, /extension:\/\//i, /^Script error\.?$/i];

let sent = 0;
const seen = new Set<string>();
let sentry: typeof import("@sentry/browser") | null = null;

export function reportError(err: unknown, where?: string) {
  if (typeof window === "undefined") return;
  const e = err instanceof Error ? err : new Error(typeof err === "string" ? err : JSON.stringify(err ?? "unknown"));
  const message = `${where ? `[${where}] ` : ""}${e.message || String(err)}`.slice(0, 500);
  if (IGNORE.some((r) => r.test(message)) || IGNORE.some((r) => r.test(e.stack ?? ""))) return;
  if (seen.has(message) || sent >= MAX_PER_PAGE) return;
  seen.add(message);
  sent++;
  sentry?.captureException(e);
  void getSupabase().then((sb) =>
    sb
      ?.from("client_errors")
      .insert({
        message,
        stack: (e.stack ?? "").slice(0, 4000) || null,
        path: window.location.pathname.slice(0, 200),
        agent: navigator.userAgent.slice(0, 300),
        release: RELEASE,
      })
      .then(() => {}, () => {})
  );
}

let started = false;
export function startErrorReporting() {
  if (started || typeof window === "undefined") return;
  started = true;
  window.addEventListener("error", (ev) => reportError(ev.error ?? ev.message, "window"));
  window.addEventListener("unhandledrejection", (ev) => reportError(ev.reason, "promise"));
  if (DSN) {
    void import("@sentry/browser").then((S) => {
      S.init({ dsn: DSN, release: RELEASE, environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development", sampleRate: 1, tracesSampleRate: 0, defaultIntegrations: false, integrations: [S.dedupeIntegration(), S.linkedErrorsIntegration()] });
      sentry = S;
    });
  }
}
