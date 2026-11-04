# The Blackwood Bureau — web

*Open the file. Find the truth.*

A detective mystery played as an official case file, solo or as a party room. This build ships one
complete case, **No. 017 — The Silence at Hollow Pines** (5 envelopes, 34 exhibits, up to 1 hour).

## Run

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

## Party rooms

Rooms sync over **Supabase Realtime** (broadcast only, no tables). Set two environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon or publishable key>
```

Other transports, chosen in this order when Supabase is not set:

- `NEXT_PUBLIC_ROOM_RELAY=http://host:8787` uses the dependency-free relay in `scripts/relay.mjs`
  (`node scripts/relay.mjs`). Good for LAN play and the end-to-end tests; it can add latency, jitter and loss.
- Otherwise, **same-device mode** over `BroadcastChannel`: tabs in one browser only.

How a room works:

- The host taps **Open a room** on the case cover and shares the 5-character code or link. Players join
  at `/room/<CODE>` (or **Join a room** on the home page), enter a name and wait in the lobby. Up to 6.
- The host picks **shared** or **split** evidence and whether timers run, then starts the case.
- The host moves the narration, submits checkpoint answers and opens each folder for everyone.
- Built for players who are not in the same place: a **table chat**, **suggested answers** shown to the
  host with names, **point** (send everyone a link to an exhibit), and in split mode **Show all** to
  release a file you hold. Hints and notes stay private to each device.
- Everyone votes on the accusation; the host submits (with a confirmation if votes are missing) and
  the reveal plays on every screen, then a shared report card.

What keeps it steady:

- Every device holds the room state; the host's device is the only writer and versions every change.
- Player actions are queued, numbered and retried until the host acknowledges them, so nothing is lost
  or applied twice on a bad connection. Devices that fall behind are caught up from the heartbeat.
- If the host drops, everyone sees the room pause, and control passes to the next player who joined.
  The host can also hand over on purpose. Timers are corrected for devices whose clocks are wrong.
- A closed tab reopens into the same seat without asking for a name. A person on a new phone gets their
  seat back by entering the same name. The room survives everyone leaving and coming back.
- The host can remove a player from the lobby; a 7th player is told the room is full.

## Media

Photos, the voicemail and narration recordings are supplied separately. See
[`docs/ASSETS.md`](docs/ASSETS.md) for every file name and what it must show. Until a file exists the
exhibit shows a labelled placeholder, and narration falls back to the device's voice.

## Structure

| Path | What it is |
| --- | --- |
| `app/page.tsx` | Case shelf |
| `app/case/[id]` | Case cover: solo, party room, print kit |
| `app/case/[id]/desk` | Solo case desk |
| `app/room/[code]` | Party room: name, lobby, shared desk |
| `app/case/[id]/kit` | Print-ready case kit |
| `lib/cases/hollow-pines.ts` | Case data: rounds, checkpoints, hints, narration, solution |
| `lib/game/state.ts` | The rules: one pure reducer used by solo and rooms |
| `lib/game/game.ts` | Solo store and room sync (heartbeats, host hand-over, rejoin) |
| `lib/game/transport.ts` | Supabase Realtime or same-device transport |
| `components/evidence/` | Every exhibit drawn as its own document |
| `docs/CASE-017-BIBLE.md` | The solution and timeline (spoilers) |

## Not yet built

Payments, accounts and cross-device progress for solo, and the watermarked ZIP download.

## Answers stay on the server

Checkpoint answers, hints, the solution and the reveal live in `lib/server/` (marked `server-only`, so
the build fails if page code imports them) and are handed out by `POST /api/cases/<id>` one checkpoint
at a time. Each closed round returns a signed token; the verdict and the reveal are only issued against a
token for every round. Set `CASE_TOKEN_SECRET` in the deployment to sign them.

Ratings after the reveal go to `POST /api/rate` and into the Supabase table `ratings` (insert-only).

## Tests

End-to-end tests drive real browsers. Each player gets a separate browser context (own storage, own
network, optionally a skewed clock), connected through the relay with added lag and packet loss.

| Test | Covers |
| --- | --- |
| `tests/e2e/solo.js` | A full solo case: wrong answers, hints, narration, all five rounds, reload, accusation, reveal, report, print kit |
| `tests/e2e/mobile.js` | Phone navigation: tab bar, sheets, every round 1 exhibit, nothing wider than the screen (all 34 exhibits), leaving the desk, party desk and chat on a phone |
| `tests/e2e/remote-2p.js` | Two devices: join by code, split deal, Show all, pointing, chat and unread badge, timers across a 4-minute clock skew, suggestions, wrong-answer notice, closed tab reopening into the same seat, host network loss and hand-over, finishing from the phone, vote confirmation, shared reveal |
| `tests/e2e/remote-4p.js` | Four to six devices: simultaneous joins, duplicate names, removing a player, split across four, late joiner, a player dropping and their files being passed on, deliberate host hand-over, four messages at once in the same order everywhere, three suggestions, partial votes, reveal on five screens, everyone leaving and the room surviving, room full |

```bash
PORT=8787 RELAY_LATENCY=120 RELAY_JITTER=150 RELAY_DROP=0.05 node scripts/relay.mjs &
NEXT_PUBLIC_ROOM_RELAY=http://localhost:8787 npm run build && npm start &
BASE=http://localhost:3000 npm run test:e2e
```

## Accounts (Google sign-in)

Players sign in with Google through Supabase Auth. An account keeps a profile (the name used in party
rooms), saved solo progress (`solo_progress`, synced across devices; whichever copy went further wins) and
closed cases (`case_history`, shown on `/account`). Every table is private to its owner (row level
security). Private notes stay on the device.

Sign-in is **required to play** (desk, rooms, print kit; the case cover asks visitors to sign in). The
landing page, archive and case covers stay open. `NEXT_PUBLIC_REQUIRE_SIGNIN=false` turns the requirement off:
the automated tests build with it (`NEXT_PUBLIC_REQUIRE_SIGNIN=false npm run build`), and it is the emergency
switch if Google sign-in ever breaks.

Setup: Google Cloud OAuth client (web) with redirect URI `https://<project>.supabase.co/auth/v1/callback`;
Supabase → Authentication → Providers → Google (client ID and secret); Supabase → Authentication → URL
Configuration: Site URL = the live site, Redirect URLs = `https://<site>/auth/callback` and
`http://localhost:3000/auth/callback`.
