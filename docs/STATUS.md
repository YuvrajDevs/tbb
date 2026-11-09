# The Blackwood Bureau — status and handoff

Last updated: 9 Nov 2026. Branch: `main` on `YuvrajDevs/tbb`.

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

- **Live:** https://www.theblackwoodbureau.com on Vercel (apex redirects to www). Supabase project "the blackwood bureau"
  for Google sign-in, saved solo progress (`solo_progress`), case history, ratings and client errors; party rooms run on
  Supabase Realtime broadcast channels (nothing stored). Google sign-in branding is verified.
- **Screens:** landing page (with the Instagram tip line), case shelf, case cover (solo / party room / print kit), case desk,
  party lobby, join-by-code, print kit, account page, privacy and terms.
- **Case desk:**
  - Folders per round, file list or grid, document viewer with zoom, narration dock (fixed two-line height, captions, replay, voice).
  - **Briefing:** a photo per narration line (`public/cases/017/briefing/`) with a slow camera move and a dissolve; played once
    per player. Folder 1 stays sealed until the briefing ends ("Skip the briefing" available).
  - Checkpoints with "Look again" and skip after 3 tries; 3-level private hints; round timer, off by default (Settings).
  - **Time only exists in a race.** Solo and classic co-op have no clock, no costs and no time penalty.
  - **Investigate** panel (one button, one phone tab): Interview, plus a Theory tab in a race. Every open exhibit has
    **Show to…** to put it in front of a suspect directly.
    (Searching the house was built and then removed: pressing a button per room added no real deduction.)
  - **Interviews:** ask any of the five about each other or show them an exhibit from an open folder. Answers are text,
    served by the server (`lib/server/interviews-017.ts`); transcripts kept per player.
  - **Notebook:** deduction grid in Who / How / Why tabs; each row has Ruled out / Possible / Likely buttons and each tab a
    summary. **Lines of enquiry open with the evidence:** a method or motive appears only once its folder is open
    (`from` on the choice: the land sale from folder 2, the injection from 3, the Trust fraud from 4), with a notice that
    does not name it. The accusation is pre-filled from single "likely" marks.
  - **Interview** works like a messenger: on wide screens the people list (with the last answer as a preview) sits left
    and the chat right; on phones the list comes first and a tap opens the chat, with a back arrow.
  - **Accusation:** pick who, how and why, lock it, then answer five scored detail questions (answers server-side).
  - **Report card:** who/how/why, the details, grid accuracy, questions asked, hints, and a Bureau rating out of 100
    (accusation 60, details 30, grid 10, minus hints and skipped checkpoints); in a race also the case time.
- **Content protection:** checkpoint answers, hints, the solution, the reveal, the detail answers, interview answers and
  race disproofs all live server-side (`lib/server/`) and are released against signed round tokens.
- **Evidence:** every exhibit drawn in code (`components/evidence/round1..5.tsx`); photos and audio supplied (see ASSETS.md).
- **Play styles:**
  - **Solo:** classic only.
  - **Party room, Classic:** one shared case solved together. Host controls narration, answers and the accusation; shared or
    split evidence; table chat; point the table to an exhibit; votes; host hand-over and the robustness work in git history.
  - **Party room, Race** (2 to 6): every player gets their own copy of the case (`useRaceGame` in `lib/game/game.ts`,
    the solo engine kept per room on each device) and reports their folder, clock and finish to the room. Standings and
    chat in the Race panel. **Case time** = real time since the race began + penalties (question 15 min, hint 30, wrong
    checkpoint answer 20, theory 30). The lowest correct case time wins; the result settles once nobody still working could
    beat the leader. A wrong accusation is out. Up to 3 **theories to the Bureau**
    per racer (30 min each): the server rules out one wrong part with an exhibit from a folder the racer has opened
    (`disproof` in `lib/server/case-017.ts`), and gives the same reply when nothing is ruled out, so it never confirms.
- **Phones:** bottom tab bar (Files, Investigate, Notebook, Hints, Table or Race, Accuse), bottom sheets.
- **Tests** (`tests/e2e/`, Playwright): the original suites predate the new mechanics; new features were checked by hand in
  headless browsers.

## Architecture in one paragraph

`lib/cases/hollow-pines.ts` holds all case data. `lib/game/state.ts` is the single pure reducer (rules) used by both
solo and rooms; shared state vs. private per-device state (notes, hints, viewed, voice). `lib/game/game.ts` has the solo
store (localStorage) and the room hook (heartbeats, host election, intent queue, catch-up, seat reclaim).
`lib/game/transport.ts` picks Supabase Realtime (if `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`),
else the relay (`NEXT_PUBLIC_ROOM_RELAY`, `scripts/relay.mjs`), else same-browser BroadcastChannel.
`components/Desk.tsx` is the whole desk UI for both modes.

## Left to do

- Payments, per-buyer watermarked kit ZIP, Hindi / Hinglish, Android wrapper / PWA (from the PRD, not started).
- Extend `tests/e2e/` to cover interviews, the clock, theories, the grid and the two-step accusation.
- Playtesting with real groups.
- Marketing material lives in `reel/` (reels, carousel, brand exports); it is gitignored on purpose.
