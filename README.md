# The Blackwood Bureau — web

*Open the file. Find the truth.*

A detective mystery played as an official case file, solo or as a party room. This build ships one
complete case, **No. 017 — The Silence at Hollow Pines** (5 envelopes, 34 exhibits, about 2 hours).

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

Without them, rooms run in **same-device mode** over `BroadcastChannel`: every tab in one browser can
join, which is handy for development, but phones cannot reach each other.

How a room works:

- The host taps **Open a room** on the case cover and gets a 5-character code and link. Players join at
  `/room/<CODE>`, enter a name and wait in the lobby. Up to 6 players.
- The host picks **shared** or **split** evidence and whether timers run, then starts the case.
- The host moves the narration, submits checkpoint answers and opens each folder for everyone. Any
  player can replay a line, use hints (private), take notes (private) and vote on the accusation.
- The room's state lives on every device. If the host drops, the room pauses and control passes to
  the next player who joined. A player who rejoins with the same name gets their seat back.

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

Payments, accounts and cross-device progress for solo, the watermarked ZIP download, and server-side
answer protection (answers ship in the page in this build).

## Tests

End-to-end tests drive a real browser through a full solo case, a three-player room (split evidence,
host hand-over, rejoin, votes, shared reveal) and room edge cases (removing a player, a host losing
network and coming back, refreshes). Room tests use same-device mode, so run the server without the
Supabase keys. They need Playwright and a running server:

```bash
npm run build && npm start &
BASE=http://localhost:3000 npm run test:e2e
```
