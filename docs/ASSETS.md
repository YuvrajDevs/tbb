# Case 017 — media to supply

Everything else in the case is drawn in code. These are the only files the case needs from you.
Drop each file at the exact path below and it appears in the app on the next page load; until then
the exhibit shows a labelled placeholder and the game is fully playable. No video is used.

For full art direction and ready-to-use prompts for every image, see [`IMAGE-BRIEF.md`](IMAGE-BRIEF.md).

## Cast (keep faces consistent across images)

| Character | In 2026 | Look |
| --- | --- | --- |
| Vikram Singh Rathore | 64 | Tall, heavy-set, silver hair swept back, trimmed grey moustache, gold-rimmed reading glasses |
| Meera Rathore (born Nisha Meera Kapoor) | 46 (35 in 2015, 30 in 2011) | Slim, composed, shoulder-length dark hair, small gold nose stud |
| Dr. Anand Kapoor | 59 (48 in 2015) | Medium build, receding grey hair, rimless glasses, clean-shaven |

## Photographs — `public/cases/017/media/`

All five are in place (supplied 5 Nov 2026, no faces shown). The marker numbers on 3, the plate and recorder text on 13, and the label and tamper-strip text on 17 were added on top of the generated images so they match the documents exactly.

All photos: realistic, documentary, no text or logos except where stated. Muted, natural colour;
the page frames them, so no borders. JPG, long side 2000 px or more.

| File | Ratio | Exhibit | What it shows |
| --- | --- | --- | --- |
| `exhibit-03-study.jpg` | 16:10 | 3, scene photograph | Police scene photo, flash off, 08:32 on a misty morning, taken from the study doorway facing north. Wood-panelled study in an old hill-station house. A high-backed brown leather armchair faces a cold fireplace full of ash; an elderly man (Vikram, back and shoulder visible, grey shawl, head slumped right) sits in it, glasses in his lap. Round side table beside the chair with a steel tumbler of milk and a chipped corner. Dhurrie rug rucked toward the hearth. Book face down on the rug, left of the chair. One brown chappal under a desk to the right, desk lamp on. Brown Philips transistor radio on a bookshelf. Mantel clock. Small white numbered evidence tents: 1 tumbler, 2 lap, 3 book, 4 chappal, 5 radio, 6 mantel clock, 7 side-table corner. Tasteful, no visible face or injury. |
| `exhibit-13-cctv-gate.jpg` | 16:9 | 13, CCTV still | Grainy black-and-white infrared CCTV frame at night from a camera on a gate pillar. A silver Honda City seen from behind, tail lights flaring, driving out through an open iron gate. Rear plate readable: `UK07 CK 0059`. Burned-in white monospace text top-left `10-10-2026 SAT 21:58:37`, top-right `CAM1`, bottom-left `HOLLOW PINES · IR ON · REC ●`. Scan lines and compression noise. |
| `exhibit-17-ampoule.jpg` | 6:5 | 17, fireplace fragment | Forensic photo on cream card: a clear police evidence bag with a black "EVIDENCE · DO NOT OPEN" strip, holding scorched glass from a 10 ml ampoule — one body fragment with a partly burnt white label reading `…ASSIUM CHLORI…` / `INJ. 15% w/v 10ml` / `B.No. KC26… EXP 03/28`, and a broken neck with a brown ring. Grey ash dust in the bag. A small 1 cm scale ruler alongside. |
| `exhibit-33-id-photo.jpg` | 3:4 | 33, nursing service card | 2011 passport-style photo of Meera at about 30, in a white nurse's uniform and cap, hair tied back, plain pale background, slightly faded. |
| `exhibit-34-wedding.jpg` | 4:3 | 34, wedding photograph | Colour photo, February 2015, a daytime garden wedding at a hill-station house with pine trees. Vikram (about 53) in a cream sherwani and Meera (about 35) in a red lehenga at a marigold mandap. Beside them Dr. Anand Kapoor (about 48) in a turban, his hand on Meera's shoulder, clearly the bride's family (performing the kanyadaan). Slightly warm, printed-photo look. |

## Audio — `public/cases/017/media/`

In place (5 Nov 2026). Kabir's lines were generated in VoiceStudio and cloned from one take so he is one voice. The background is "Bollywood Punjabi Music Bhangra Beat" by aar_music (Pixabay, Pixabay licence), muffled as if from the next room, under synthesised crowd chatter and claps, with short pauses between lines, and passed through a phone-line filter (300–3400 Hz, 8 kHz). MP3 64 kbps mono, 17.1 s.

| File | Length | Exhibit | Content |
| --- | --- | --- | --- |
| `exhibit-20-voicemail.mp3` | ~17 s | 20, voicemail | Kabir Sethi (48, Delhi-Punjabi accent, tense, slightly drunk-tired) leaving a phone voicemail from a loud wedding sangeet: dhol and film music behind him the whole time. Script below. Phone-line EQ. |

Voicemail script (as recorded):

```
00:00  [bhangra music and crowd]
00:01  Vikram, it's Kabir. Again.
00:03  Look, I know you're angry about the email. I shouldn't have written it like that.
00:07  But pick up, yaar. We need to talk before Monday. Before you say anything to anyone.
00:11  Call me back. Tonight, please.
00:13  I'm at Pinky's sangeet, it's mad here, but I'll step out. Call me.
00:17  [end]
```

## Narration — `public/cases/017/narration/`

One MP3 per line, named by the line ID. The narrator is a calm, low game-master voice: it states
what happened, never what it means. Missing files fall back to the device's voice.

One voice for every line. `B-03.mp3` was made in VoiceStudio (OmniVoice engine) with the voice design
`male, middle-aged, very low pitch, american accent`, speed 0.88, seed 7, broadcast effect. Every other line
is cloned from that recording (reference audio `B-03`, its text as reference text, speed 0.88, seed 7), so
they all share the exact same voice. Silence trimmed, MP3 96 kbps mono. Numbers such as 9:40 are spelled out
for the voice. All 56 files are in place.

**Introduction** (the narrator explains the case before the briefing)

| File | Line |
| --- | --- |
| `I-01.mp3` | This is the Blackwood Bureau. You have been handed Case Number zero one seven: The Silence at Hollow Pines. |
| `I-02.mp3` | A wealthy man is dead in his study, and everyone around him agrees it was his heart. The local police are not so sure. That is why the file is on your desk. |
| `I-03.mp3` | Listen to the briefing. Then read every exhibit, test every statement, and trust nothing that you cannot prove. |

**Briefing**

| File | Line |
| --- | --- |
| `B-01.mp3` | Mussoorie. Sunday, the eleventh of October. The mist has not lifted from Camel's Back Road, and at Hollow Pines the curtains of the study are still drawn. |
| `B-02.mp3` | At ten past seven, the housekeeper found Vikram Singh Rathore in his armchair, cold, his reading glasses in his lap. |
| `B-03.mp3` | His doctor of twenty years called it his heart. The inspector called the Bureau. |
| `B-04.mp3` | Your file has five envelopes. Each round, one opens. At the end of each, a single question stands between you and the next. |
| `B-05.mp3` | Find who killed him, how it was done, and why. Everything you need is in the evidence. I will not tell you what it means. |
| `B-06.mp3` | Open folder one. |

**Round 2 opens**

| File | Line |
| --- | --- |
| `R2-01.mp3` | The time on the watch does not agree with the time on the doctor's note. Inspector Bisht has taken statements from everyone who was at Hollow Pines, or near it. |
| `R2-02.mp3` | He has also pulled the register from the camera at the main gate. It is the only camera on the estate. |
| `R2-03.mp3` | Open folder two. |

**Round 3 opens**

| File | Line |
| --- | --- |
| `R3-01.mp3` | Monday. The post-mortem is complete. And the ash from the study grate, sieved this morning, holds something the fire did not finish. |
| `R3-02.mp3` | Arjun has come to the police station on his own. He says he has something to correct. |
| `R3-03.mp3` | Open folder three. |

**Round 4 opens**

| File | Line |
| --- | --- |
| `R4-01.mp3` | Tuesday. In Meera's dressing table, folded inside a jewellery box, the police find a lawyer's letter that Vikram never saw. |
| `R4-02.mp3` | On his desk, under the blotter, a bank statement covered in his own pencil. |
| `R4-03.mp3` | Open folder four. |

**Round 5 opens**

| File | Line |
| --- | --- |
| `R5-01.mp3` | Wednesday. Dr. Kapoor has asked to make a second statement, with his lawyer beside him. He has a great deal to confess. Murder, he says, is not part of it. |
| `R5-02.mp3` | And a technician from the camera company has come up to Hollow Pines, because the chowkidar said something odd about a clock. |
| `R5-03.mp3` | Open folder five. When you are ready, make your accusation. |

**Accusation**

| File | Line |
| --- | --- |
| `A-01.mp3` | The file is complete. Name the one who killed Vikram Rathore. Say how. Say why. |

**Reveal**

| File | Line |
| --- | --- |
| `V-01.mp3` | Friday afternoon. The power fails across Camel's Back Road. When it returns, the chowkidar sets the gate camera's clock by the old wall clock in his hut. That clock runs eighteen minutes fast. Nobody notices. |
| `V-02.mp3` | Saturday, eight fifty-two. Dr. Anand Kapoor arrives for his weekly visit. In the hall, Meera comes down to greet him. Something passes from his bag to her hand: a syringe, already filled. |
| `V-03.mp3` | Anand takes Vikram's blood pressure, gives the vitamin shot into the shoulder, and leaves at 9:40, exactly as he said. The camera writes 21:58. The one thing he told the truth about was the thing that made him look guilty. |
| `V-04.mp3` | Two minutes later, Meera knocks on the study door. Anand wants a blood sample before Monday, she says. She was an ICU sister for four years. Her husband rolls up his sleeve. |
| `V-05.mp3` | Potassium chloride, into the vein at the elbow. At 9:44 his heart stumbles and he falls against the side table. His watch asks if he needs help. His wife taps: I'm OK. |
| `V-06.mp3` | At a quarter past ten, Sunita hears a voice in the study, low, like someone on the phone. It is not the radio. It is Meera, calling the only number she can. Bhaiya. Brother. |
| `V-07.mp3` | Put him in the chair. Glasses in his lap. Glass in the fire. I will write it up in the morning. |
| `V-08.mp3` | Meera Rathore was born Nisha Meera Kapoor. The second partner in Kapoor Diagnostics LLP was never Anand's wife. It was his sister. One crore, eighty-four lakh rupees, from the Trust her husband chaired. |
| `V-09.mp3` | On Thursday she steamed open a lawyer's letter, read the words 'criminal breach of trust', and glued it shut again. She told you she thought it was about the will. |
| `V-10.mp3` | In the morning Anand wrote 'one o'clock' and 'cardiac', and begged the family to be spared a post-mortem. On Wednesday he confessed to fraud rather than let you look at his sister. |
| `V-11.mp3` | Arjun hid a bar tab. Kabir feared a Monday that was never about him. Vikram wrote 'Thirty years' beside the name of the man he suspected. He never suspected the woman who filled his pill box every Sunday. |
| `V-12.mp3` | Case No. 017 is closed. |

**Hints and nudges** (casual wording, same voice)

Each revealed hint is read in a casual voice: `H-<round>-<1..3>.mp3`, 15 files; the spoken words are in
`narration.hints` in `lib/cases/hollow-pines.ts` (the screen keeps the original hint text). After about
2½ minutes with no touch, key or scroll, the narrator says one nudge that fits the moment and shows it
as a toast: `N-01` no file opened yet, `N-02` a file still unread, `N-03` folder read but question
unanswered, `N-04`–`N-06` general (rotate), `N-07` every checkpoint done, time to accuse. Nudges need
the narrator voice on and stay quiet during the accusation and reveal.

## Music and sound effects — `public/audio/`

| File | Use |
| --- | --- |
| `music-suspense.mp3` | Background loop on the case desk, 30% by default, adjustable in Settings; softens while the narrator speaks. Pixabay, "Suspense" by leberch. |
| `sfx-page.mp3` | Page turn when a file opens. Pixabay, "Turn a page" by creatorshome. |
| `sfx-click.mp3` | Click when a folder opens. Pixabay, "Computer mouse click" by universfield. |
