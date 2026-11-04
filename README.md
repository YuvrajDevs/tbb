# The Blackwood Bureau — web prototype

*Open the file. Find the truth.*

A detective mystery game played as an official case file. This is the web build of
Phase 1 from the PRD: one case, solo mode, folders, file viewer, narration captions
(with optional device voice), round timers, checkpoints, hints, notebook, accusation,
reveal and report card, plus a printable case kit.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure

| Path | What it is |
| --- | --- |
| `app/page.tsx` | Case shelf |
| `app/case/[id]/page.tsx` | Case cover (solo / room / print) |
| `app/case/[id]/desk` | Case desk: folders, file manager, viewer, narration bar |
| `app/case/[id]/kit` | Print-ready case kit (host guide, envelope labels, all exhibits, case board, sealed solution) |
| `lib/cases/hollow-pines.ts` | Case 017 data: rounds, checkpoints, hints, narration script, solution |
| `components/evidence/` | Each exhibit drawn as its own document (27 in total) |
| `lib/progress.ts` | Progress, notes and settings saved in the browser |

## Case 017 — The Silence at Hollow Pines

Four envelopes, 27 exhibits: inquest report, scene photograph, floor plan, smartwatch
export, witness statements, CCTV register and still, chat printout, call records,
post-mortem, evidence tag, hospital dispensary register, bar receipt, voicemail,
diary page, annotated bank statement, lawyer's letter, LLP master data, email, will
extract. All characters and documents are fictional.

## Not yet built

- Rooms / party mode (needs Supabase Realtime)
- Accounts, purchases, cross-device sync (progress is per-browser for now)
- Per-buyer watermarked ZIP (the kit is a print page for now)
- Recorded narrator audio (device text-to-speech stands in)
- Content protection: answers ship in the client bundle in this prototype
