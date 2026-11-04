# Image brief — The Blackwood Bureau, Case 017

Everything a designer or an image generator needs to make the five photographs for Case No. 017,
*The Silence at Hollow Pines*, so they sit naturally inside the game.

Each image is evidence. Players study them closely and check them against the written documents, so
**the details listed under "Must show" are clues and have to be right.** Anything not listed is free.

---

## 1. Look and feel of the game

**The idea.** You are a detective handed a real case file by a private bureau founded in 1961. Every
exhibit looks like the actual document or photograph the police collected: nothing looks like a game,
an illustration or a film still.

**Mood.** Quiet, serious, late-night. Old money in a misty hill station. A death everyone wants to call
natural. Restraint over drama: no gore, no blood, no faces twisted in fear.

**Setting.** Mussoorie, Uttarakhand, India, October 2026. Hollow Pines is a 1920s British-era hill-station
house: wood-panelled rooms, sash windows, fireplaces, dhurrie rugs, brass fittings, deodar and pine
trees outside, low cloud and mist.

**The app around the images.** A near-black desk (`#0f0d0b`), cream paper (`#f1e9d8`), manila folders
(`#c9a66b`), dark brown ink (`#3e2a18`) and a rust-red rubber stamp (`#6e2f1c`). Type is serif
(Libre Baskerville), typewriter (Courier Prime) and handwriting (Caveat). The page frames each photo
itself, so **images have no borders, frames, captions or watermarks.**

**Photographic style for all five.**
- Realistic, documentary, unstaged. It should look like it was taken by a police constable or a family
  member, not a professional photographer.
- Muted, natural colour (photo 13 is black and white). Slightly flat light. Mild grain.
- Normal lenses (24–50 mm equivalent). Eye level. No tilt, no fisheye, no shallow-focus "cinematic" look.
- Indian people, clothing, objects and interiors that are accurate for a well-off North Indian family.
- No text, logos or brand names anywhere unless listed under "Must show".

**Common problems to reject.** Extra or merged fingers, garbled lettering, modern phones or LED lights
in the 2011/2015 photos, Western-looking interiors, glossy "AI" skin, symmetrical stock-photo framing,
dramatic movie lighting, and anything that looks like a drawing.

**Text on images.** Generators usually garble text. For the CCTV still (13) and the ampoule (17), it is
fine to generate the image **without** the text and leave the plate or label plain. Tell Claude and the
text will be added on top accurately, matching the documents exactly.

---

## 2. The cast (keep faces consistent)

Generate the people once, then reuse the same faces across images (photos 33 and 34 show Meera at two
ages; photo 34 shows all three together).

| Person | Age in 2026 | Look |
| --- | --- | --- |
| **Vikram Singh Rathore**, the deceased | 64 (53 in 2015) | Tall, heavy-set Rajput man. Silver hair swept back, trimmed grey moustache, gold-rimmed reading glasses. Dignified, old-fashioned. |
| **Meera Rathore** (born Nisha Meera Kapoor), his wife | 46 (35 in 2015, 30 in 2011) | Slim, composed, calm. Shoulder-length dark hair. Small gold nose stud. Good posture of a former ICU nurse. |
| **Dr. Anand Kapoor**, family doctor, Meera's elder brother | 59 (48 in 2015) | Medium build, receding hair (greying by 2015), rimless glasses, clean-shaven. Should look clearly related to Meera: same eyes and brow. |

---

## 3. The five photographs

Save each as JPG, long side **2000 px or more**, at the exact file name, into
`public/cases/017/media/`. It appears in the game on the next page load.

### 3.1 `exhibit-03-study.jpg` — Scene photograph of the study

| | |
| --- | --- |
| Shape | **16:10** landscape |
| Where it appears | Exhibit 3, Envelope 1. Captioned "Photo No. 3/A · 11.10.2026 08:32 · View: from doorway, facing north · flash off". |
| Feel | A police scene photo taken in dim morning light, flash off. Grey daylight leaks round drawn curtains; the desk lamp gives a warm pool. Still, cold, slightly underexposed. |

**Must show** (these are checked against the inquest report and floor plan):
- Taken from the study doorway, looking into the room. The **cold fireplace full of grey ash** is ahead, slightly left; a **wooden mantel clock** sits on the mantelpiece.
- A **high-backed brown leather armchair** facing the fireplace, seen mostly from behind and the side. In it, an elderly man: only the **back of his head, silver hair, right shoulder and grey wool shawl** are visible, **head slumped to the right**. Do not show his face.
- **Gold-rimmed reading glasses resting in his lap** (just visible).
- A **round side table** beside the chair with a **steel tumbler of milk** (two-thirds full) and a glass coaster. **One corner of the table is freshly chipped.**
- A **dhurrie rug rucked up and pushed toward the hearth**.
- A **book lying face down on the rug, to the left of the chair**.
- To the right, a **wooden desk with its desk lamp switched ON**, and **one brown leather chappal (sandal) under the desk**.
- A **bookshelf on the right wall with a brown vintage Philips transistor radio** on it.
- **Curtains drawn** on the windows.
- **Seven small white numbered police evidence tents**: 1 by the tumbler, 2 near the lap, 3 by the book, 4 by the chappal, 5 by the radio, 6 on the mantel by the clock, 7 by the chipped table corner.

**Must not show:** his face, any blood or injury, police officers, a second person, a lit fire, daylight streaming in, a phone, modern furniture.

**Prompt:**
> Documentary police crime-scene photograph, flash off, dim grey morning light leaking round drawn curtains, warm desk lamp on. Interior of a 1920s wood-panelled study in an old Indian hill-station house in Mussoorie. Seen from the doorway: a cold stone fireplace full of grey ash ahead and slightly left, wooden mantel clock on the mantelpiece. A high-backed brown leather armchair faces the fireplace with an elderly Indian man slumped in it, seen from behind, only his silver hair, right shoulder and grey wool shawl visible, head fallen to the right, gold-rimmed reading glasses in his lap. Beside the chair a small round wooden side table with a steel tumbler of milk and a glass coaster, one corner of the table freshly chipped. A dhurrie rug rucked up and pushed toward the hearth, a hardback book lying face down on the rug left of the chair. On the right a wooden writing desk with its lamp switched on and a single brown leather chappal under it, a bookshelf with a brown vintage transistor radio. Seven small white numbered evidence markers 1 to 7 placed by the tumbler, the lap, the book, the chappal, the radio, the mantel clock and the chipped table corner. Muted natural colour, slight grain, 24 mm lens, eye level, realistic, unstaged, no text.

**Avoid:** gore, blood, face, dramatic lighting, fire burning, police tape, people standing, cinematic depth of field, illustration.

---

### 3.2 `exhibit-13-cctv-gate.jpg` — CCTV still from the gate camera

| | |
| --- | --- |
| Shape | **16:9** landscape |
| Where it appears | Exhibit 13, Envelope 2. Captioned "Frame grab · CAM1 · Frame 21:58:37.12". |
| Feel | A grainy infrared night frame from a cheap security camera on a gate pillar. Black and white only, blown-out headlights, compression blocks. |

**Must show:**
- **Black-and-white infrared** night image from a camera mounted high on a gate pillar, looking down at the drive.
- A **silver Honda City sedan seen from behind**, driving **out** through an **open wrought-iron gate**, tail lights flaring white.
- The **rear number plate `UK07 CK 0059`** (or a plain plate, to be filled in).
- Burned-in white monospace overlay text (or none, to be added): top-left `10-10-2026 SAT 21:58:37`, top-right `CAM1`, bottom-left `HOLLOW PINES · IR ON · REC ●`.
- Gravel drive, stone gate pillars, pine trees fading into darkness, mist in the IR light.

**Must not show:** the driver's face, any other vehicle or person, colour, daylight.

**Prompt:**
> Grainy black-and-white infrared CCTV frame at night from a security camera on a stone gate pillar, looking down at a gravel drive. A silver Honda City sedan seen from behind, driving out through an open wrought-iron gate, tail lights flaring, rear number plate visible, pine trees and mist fading into darkness. Low resolution, scan lines, compression artefacts, slight fisheye of a cheap security camera, blown highlights. No people.

**Avoid:** colour, cinematic lighting, sharp detail, a visible driver, other cars.

---

### 3.3 `exhibit-17-ampoule.jpg` — Fragment from the fireplace

| | |
| --- | --- |
| Shape | **6:5** (nearly square) |
| Where it appears | Exhibit 17, Envelope 3, beside an evidence tag. |
| Feel | A flat, evenly lit forensic photograph on a cream card, shot straight down, like a lab record. |

**Must show:**
- A **clear plastic police evidence bag** with a **black strip reading `EVIDENCE · DO NOT OPEN`** (or a plain strip), lying flat on **cream card**.
- Inside: **scorched, broken glass from a 10 ml glass ampoule**. One body fragment with a **partly burnt white printed label** reading `…ASSIUM CHLORI…` / `INJ. 15% w/v 10ml` / `B.No. KC26… EXP 03/28` (the start and end burnt away). And the **broken-off neck of the ampoule with a brown ring** round it.
- **Grey ash dust** in the bag.
- A small **1 cm scale ruler** beside the bag.

**Must not show:** a whole intact ampoule, a syringe, a readable full drug name, hands.

**Prompt:**
> Forensic evidence photograph shot straight down, flat even lighting, on cream card. A clear plastic police evidence bag with a black tamper strip, containing scorched broken glass from a small 10 ml pharmaceutical glass ampoule: one fragment with a partly burnt white printed label, and the snapped-off ampoule neck with a brown ring. Grey ash dust in the bag. A small forensic scale ruler beside it. Realistic, clinical, sharp, neutral colour, no hands.

**Avoid:** dramatic lighting, an intact ampoule, syringes, blood, colourful backgrounds.

---

### 3.4 `exhibit-33-id-photo.jpg` — Nurse's service-card photo, 2011

| | |
| --- | --- |
| Shape | **3:4** portrait |
| Where it appears | Exhibit 33, Envelope 5, pasted on a hospital service-record card for "Nisha Meera Kapoor, Staff Nurse, ICU/CCU". |
| Feel | A small, slightly faded 2011 passport-style photo. Plain, official, head and shoulders. |

**Must show:**
- **Meera at about 30**: same face as the wedding photo and the cast sheet.
- **White nurse's uniform and white nurse's cap**, hair **tied back**, small gold nose stud.
- **Plain pale background**, straight to camera, neutral expression.
- Slightly faded colour of a 2011 print.

**Must not show:** a modern smartphone-selfie look, jewellery beyond the nose stud, a hospital background.

**Prompt:**
> 2011 passport-style ID photograph of an Indian woman about 30 years old, slim, calm, composed face, dark hair tied back, small gold nose stud, wearing a white nurse's uniform and white nurse's cap. Plain pale background, straight to camera, neutral expression, flat studio light, slightly faded colour print, realistic.

**Avoid:** smiling widely, heavy makeup, modern filters, any text.

---

### 3.5 `exhibit-34-wedding.jpg` — Wedding photograph, February 2015

| | |
| --- | --- |
| Shape | **4:3** landscape |
| Where it appears | Exhibit 34, Envelope 5. A framed print taken from the drawing room. On the back is written: "Nisha & Vikram — 14th Feb 2015, Hollow Pines. Bhaiya did the kanyadaan." |
| Feel | A warm, slightly faded printed family photograph from 2015. Happy, daytime, garden. |

**Must show:**
- A **daytime garden wedding at Hollow Pines**: lawn, the old house or its verandah behind, **pine and deodar trees**, winter sun.
- **Vikram (about 53)** in a **cream sherwani** and safa, silver hair, grey moustache.
- **Meera (about 35)** in a **red bridal lehenga**, the same face as the ID photo.
- A **marigold-decorated mandap**.
- **Dr. Anand Kapoor (about 48)** standing beside them in a **turban (safa)**, rimless glasses, **his hand on Meera's shoulder**, clearly acting as **the bride's family** (performing the kanyadaan, the bride's brother giving her away).
- The three faces must be recognisable, because players compare them with photo 33 and the statements.

**Must not show:** other guests in focus, phones, modern LED decor, any text.

**Prompt:**
> Warm colour family photograph from 2015 of a daytime Indian garden wedding at an old British-era hill-station house in Mussoorie, pine and deodar trees, winter sun. A marigold-decorated mandap. The groom, a tall heavy-set Indian man about 53 with silver hair and a trimmed grey moustache, in a cream sherwani and safa. The bride, a slim Indian woman about 35 with a small gold nose stud, in a red bridal lehenga. Beside them the bride's elder brother, an Indian man about 48 with rimless glasses and a clean-shaven face, wearing a safa turban, his hand on the bride's shoulder as he performs the kanyadaan. Slightly faded printed-photo look, natural, candid, realistic.

**Avoid:** studio lighting, crowds, phones, Western wedding styling, oversaturated colour.

---

## 4. Optional extras for the website

Not needed for the game; nice to have for sharing the link.

| File | Shape | What |
| --- | --- | --- |
| `public/og.jpg` | 1200 × 630 | Share image for WhatsApp, X and so on. A manila case folder marked "CASE NO. 017" and a typed memo with a rust "CONFIDENTIAL" stamp on a dark wooden desk, lit by one warm lamp. Leave the left third darker and empty so the title can be set on it. |
| `public/hero-desk.jpg` | 16:9, 2400 px | Optional landing-page backdrop: the same dark desk from above, a pen, a steel tumbler, scattered photographs face down, very dark and soft so text stays readable over it. |

---

## 5. Audio still to supply

`exhibit-20-voicemail.mp3` (about 38 seconds): Kabir Sethi's voicemail recorded at a loud wedding
sangeet. The script and direction are in `docs/ASSETS.md`. Claude can generate it in VoiceStudio if you
prefer.
