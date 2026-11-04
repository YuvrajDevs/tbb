# The Blackwood Bureau — status and handoff

Last updated: 4 Nov 2026. Branch: `ccr-896914d4-bekm4q` on `YuvrajDevs/tbb`. No pull request opened yet.

Read with: the PRD (original PDF, not in the repo), `README.md`, `docs/CASE-017-BIBLE.md` (solution, spoilers),
`docs/ASSETS.md` (media to supply), `docs/mockups/` (UI showcase images).

## What it is

A web detective game played as an official case file (Next.js 15, React 19, TypeScript, no UI library).
Solo or party room for 2 to 6. One complete case: **No. 017 — The Silence at Hollow Pines**
(5 envelopes, 34 exhibits, up to 1 hour, killer is Meera; see the bible).

Design brief from the owner: minimal, dark, serious; only black, white, brown and cream; serif type
(Times New Roman / Libre Baskerville), Courier Prime for typed documents, Caveat for handwriting.
The owner likes the current UI — keep it.

## Done

- **Screens:** case shelf (one open case + "more cases being written" card), case cover (solo / party room / print kit),
  case desk, party lobby, join-by-code page, print kit (host guide, envelope labels, all exhibits, case board, sealed solution).
- **Case desk:** folders per round (closed / open / locked / new), file list or grid, document viewer with zoom,
  narration bar (captions, line IDs, replay, voice), round timers, checkpoints with "Look again" and skip after 3 tries,
  3-level private hints, private notebook with suspect marks, accusation (who / how / why), line-by-line reveal, report card.
- **Evidence:** every exhibit drawn in code as a real document (`components/evidence/round1..5.tsx`).
  Photos and audio are slots for owner-supplied files with labelled placeholders (`components/Media.tsx`).
  No video by design.
- **Party rooms:**
  - Host controls narration, submits checkpoint answers, opens folders, submits the accusation.
  - Shared or split evidence. In split mode a holder can "Show all" a file.
  - Built for players in different places: table chat with unread badge, suggested checkpoint answers shown to the
    host by name, "point the table to this exhibit", votes with names, confirmation if votes are missing, event toasts.
  - Robustness: host-authoritative versioned state; player actions queued, numbered and retried until acknowledged
    (no loss, no double-apply); heartbeat catch-up; host loss pauses the room and hands control to the next joiner;
    manual host hand-over; timers corrected for clock skew; closed tab reopens into the same seat; same name on a new
    device reclaims the seat; duplicate names numbered ("Bilal 2"); room survives everyone leaving; host can remove
    players in the lobby; 7th player told the room is full.
- **Phones:** bottom tab bar (Files, Notebook, Hints, Table, Accuse), bottom sheets, folder strip, collapsible
  narration, 44px+ targets, every exhibit fits a 390px screen.
- **Tests** (`tests/e2e/`, Playwright, each player a separate browser context through a lossy relay):
  solo 21 checks, mobile 32, two devices 19, four-to-six devices 18 — all passing, zero page errors.
  Run instructions in `README.md`.

## Architecture in one paragraph

`lib/cases/hollow-pines.ts` holds all case data. `lib/game/state.ts` is the single pure reducer (rules) used by both
solo and rooms; shared state vs. private per-device state (notes, hints, viewed, voice). `lib/game/game.ts` has the solo
store (localStorage) and the room hook (heartbeats, host election, intent queue, catch-up, seat reclaim).
`lib/game/transport.ts` picks Supabase Realtime (if `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`),
else the relay (`NEXT_PUBLIC_ROOM_RELAY`, `scripts/relay.mjs`), else same-browser BroadcastChannel.
`components/Desk.tsx` is the whole desk UI for both modes.

## Left to do

**Blocking real cross-phone play**
1. **Supabase project.** Not created; the owner said "not now". Rooms between separate phones need it
   (or the self-hosted relay). The Supabase transport code exists but has **never been run against a real project** —
   test it end to end once keys exist (`tests/e2e/remote-*.js` can be pointed at a build with Supabase keys).
2. **Deploy.** Not deployed anywhere yet (Vercel is the natural fit; the relay does not run on Vercel serverless).

**Owner supplies**
3. Media per `docs/ASSETS.md`: 5 photos, 1 voicemail, 32 narration MP3s, into `public/cases/017/`.

**Deferred by the owner**
4. Payments (Razorpay), accounts, purchases, cross-device progress for solo.
5. "More cases coming soon" marketing beyond the current placeholder card.

**From the PRD, not built yet**
6. Case kit as a per-buyer watermarked ZIP (today it is a print page).
7. Content protection: answers and solution ship in the client bundle; should load only after each checkpoint (server).
8. Hindi / Hinglish versions; Android wrapper; PWA install.

**Known behaviours / small gaps**
- If the host's phone locks for more than ~12 s, host control passes to the next player (PRD rule). They can be made host again from the Table.
- Same-browser fallback mode: a second tab joins as "Name 2" (only affects the no-Supabase mode).
- Narration falls back to the device voice until recordings exist.
- No analytics, no rating prompt after the reveal (PRD metric: average rating).
- Playtesting with real groups (PRD: at least 3 groups) has not happened.
