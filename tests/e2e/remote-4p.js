// Four to six players, each on a separate device over a lossy relay.
const L = require('./lib');
const { ok, until, text } = L;

const ANSWERS = ['Around 9:45 PM on Saturday', 'Dr. Anand Kapoor', 'An injection of potassium chloride into a vein', 'Take irregular Trust payments to his lawyer', '21:40, before Vikram fell'];
const rosterCount = (p) => p.evaluate(() => document.querySelectorAll('.roster li').length);

(async () => {
  const b = await L.launch();
  const A = await L.device(b, 'Asha');
  const B = await L.device(b, 'Bilal', { phone: true });
  const C = await L.device(b, 'Chitra', { skewMs: -3 * 60 * 1000 });
  const D = await L.device(b, 'Dev', { phone: true, skewMs: 90 * 1000 });
  const code = await L.openRoom(A, 'Asha');

  // three people join at the same moment
  await Promise.all([L.joinByCode(B, code, 'Bilal'), L.joinByCode(C, code, 'Chitra'), L.joinByCode(D, code, 'Dev')]);
  await until(A.page, () => document.querySelectorAll('.roster li').length === 4, null, 20000);
  for (const d of [B, C, D]) await until(d.page, () => document.querySelectorAll('.roster li').length === 4, null, 20000);
  ok(true, 'three simultaneous joins: everyone sees 4 at the table');

  // a different person with a taken name is numbered, and can be removed
  const E = await L.device(b, 'Bilal-two');
  await L.joinByCode(E, code, 'Bilal');
  await until(A.page, () => document.querySelector('.roster')?.textContent.includes('Bilal 2'));
  ok(true, 'second "Bilal" joins as "Bilal 2"');
  await A.page.click('[aria-label="Remove Bilal 2"]');
  await E.page.waitForSelector('text=You were removed from this room', { timeout: 15000 });
  await A.page.waitForTimeout(3000);
  ok((await rosterCount(A.page)) === 4, 'removed player stays out');

  await A.page.click('.choice:has-text("Split")');
  await A.page.click('text=Start case');
  for (const d of [B, C, D]) await d.page.waitForSelector('.desk', { timeout: 15000 });

  // split across four
  const sets = [];
  for (const d of [A, B, C, D]) sets.push(await L.openableFiles(d.page));
  const all = sets.flat();
  ok(all.length === 7 && new Set(all).size === 7 && sets.every((s) => s.length >= 1), `7 files dealt across 4: ${sets.map((s) => s.length).join('/')}`);

  // a late joiner lands mid-round
  const F = await L.device(b, 'Farah', { phone: true });
  await L.joinByCode(F, code, 'Farah');
  await F.page.waitForSelector('.desk', { timeout: 15000 });
  ok((await text(F.page, '.files-title')).includes('Round 1'), 'late joiner lands on the current round');

  // Chitra drops: after the timeout her files are handed to the others; she comes back and gets them again
  const chitraFiles = sets[2];
  await C.offline(true);
  await until(A.page, (f) => {
    const open = [...document.querySelectorAll('.filelist li .fl-main:not([disabled])')].map((e) => e.getAttribute('aria-label'));
    return [...document.querySelectorAll('.heldby')].every((h) => !h.textContent.includes('Chitra')) && open.length >= 1;
  }, chitraFiles, 25000);
  ok(true, "an offline player's files pass to people still at the table");
  await C.offline(false);
  await until(C.page, (n) => document.querySelectorAll('.filelist li .fl-main:not([disabled])').length === n, chitraFiles.length, 25000);
  ok(true, 'she gets her own files back when she reconnects');

  // host hands over to Dev
  await L.openPanel(A.page, 'Table');
  await A.page.click('.roster li:has-text("Dev") >> text=Make host');
  await until(D.page, () => !!document.querySelector('[aria-label="Next line"]'));
  ok(!(await A.page.$('[aria-label="Next line"]')), 'host handed over to Dev');
  await L.closePanel(A.page);

  // everyone talks at once
  const talkers = [A, B, C, F];
  await Promise.all(talkers.map(async (d) => {
    await L.openPanel(d.page, 'Table');
    await d.page.fill('input[aria-label="Message the table"]', `note from ${d.label}`);
    await d.page.press('input[aria-label="Message the table"]', 'Enter');
  }));
  await L.openPanel(D.page, 'Table');
  for (const d of [A, B, C, D, F]) await until(d.page, () => document.querySelectorAll('.chat .msg').length === 4, null, 20000);
  const orders = [];
  for (const d of [A, B, C, D, F]) orders.push(await d.page.$$eval('.chat .msg', (m) => m.map((x) => x.textContent.replace(/.*·\s*\d\d:\d\d/, '')).join('|')));
  ok(new Set(orders).size === 1, 'four simultaneous messages arrive everywhere, in the same order');
  for (const d of [A, B, C, D, F]) await L.closePanel(d.page);

  // suggestions from three players
  for (const [d, pick] of [[A, ANSWERS[0]], [B, ANSWERS[0]], [F, 'Around 1:00 AM on Sunday']]) {
    await d.page.click('.checkpoint-strip button:has-text("Suggest")');
    await d.page.click(`.choice:has-text("${pick}")`);
    await L.closePanel(d.page);
  }
  await D.page.click('.checkpoint-strip button:has-text("Answer")');
  await until(D.page, () => {
    const c = [...document.querySelectorAll('.choice')];
    const v = (t) => c.find((x) => x.textContent.includes(t))?.querySelector('.votes')?.textContent ?? '';
    return v('9:45').includes('Asha') && v('9:45').includes('Bilal') && v('1:00 AM').includes('Farah');
  });
  ok(true, 'host sees all three suggestions with names');

  // Dev plays the rounds; the others follow
  for (let i = 0; i < 5; i++) {
    if (i > 0) await D.page.click('.checkpoint-strip button:has-text("Answer")');
    await D.page.click(`.choice:has-text("${ANSWERS[i]}")`);
    await D.page.click('text=Submit answer');
    await D.page.waitForSelector('.answer-box');
    if (i < 4) {
      await D.page.click(`.sheet >> text=Open folder ${i + 2} for everyone`);
      for (const d of [A, B, C, F]) await until(d.page, (n) => document.querySelector('.files-title')?.textContent.includes('Round ' + n), i + 2);
    } else await D.page.click('.sheet >> text=Back to the desk');
  }
  ok(true, 'five rounds: every device followed each new folder');
  ok((await L.openableFiles(F.page)).length >= 1, 'late joiner was dealt files in later rounds');

  // three of five vote (one of them wrong), host submits
  const vote = async (d, who) => {
    await L.openPanel(d.page, 'Accuse');
    await d.page.click(`.choice:has-text("${who}")`);
    await d.page.click('.choice:has-text("Injected potassium chloride into a vein")');
    await d.page.click('.choice:has-text("To stop Vikram exposing")');
    await d.page.click('text=Cast my vote');
  };
  await vote(A, 'Meera Rathore — Wife');
  await vote(B, 'Dr. Anand Kapoor — Family physician');
  await vote(C, 'Meera Rathore — Wife');
  await L.openPanel(D.page, 'Accuse');
  await until(D.page, () => document.body.innerText.includes('3 of 5 voted'), null, 20000);
  ok(true, 'host sees 3 of 5 votes with names');
  await D.page.click('.choice:has-text("Meera Rathore — Wife")');
  await D.page.click('.choice:has-text("Injected potassium chloride into a vein")');
  await D.page.click('.choice:has-text("To stop Vikram exposing")');
  await D.page.click("text=Submit the room's accusation");
  await D.page.click('text=Submit anyway');
  for (const d of [A, B, C, F]) await d.page.waitForSelector('.reveal-line', { timeout: 15000 });
  ok(true, 'reveal opens on all five devices');
  await D.page.click('.reveal >> text=Skip');
  for (const d of [A, B, C, F]) await d.page.waitForSelector('.reportcard', { timeout: 15000 });
  const rep = await text(B.page, '.reportcard');
  ok(rep.includes('Case solved') && rep.includes('Bilal: Dr. Anand Kapoor ✗'), 'report shows the verdict and each vote');

  // everybody leaves; the host comes back first and the room is still there
  for (const d of [A, B, C, D, F]) await d.page.close();
  await new Promise((r) => setTimeout(r, 2000));
  const pd = await D.newPage();
  await pd.goto(`${L.BASE}/room/${code}`);
  await pd.waitForSelector('.desk', { timeout: 20000 });
  await pd.waitForSelector('.reportcard, [aria-label="Next line"]', { timeout: 15000 });
  ok(true, 'room survives everyone closing their tabs');
  const pa = await A.newPage();
  await pa.goto(`${L.BASE}/room/${code}`);
  await pa.waitForSelector('.desk', { timeout: 20000 });
  await L.openPanel(pa, 'Report');
  ok((await text(pa, '.reportcard')).includes('Case solved'), 'a returning player sees the finished case');

  // fill to six, the seventh is turned away
  const G = await L.device(b, 'Gita');
  await L.joinByCode(G, code, 'Gita');
  await G.page.waitForSelector('.desk', { timeout: 15000 });
  const H = await L.device(b, 'Hari');
  await L.joinByCode(H, code, 'Hari');
  await H.page.waitForSelector('text=This room is full', { timeout: 20000 }).catch(async (e) => {
    console.log('H errors:', H.errors);
    throw e;
  });
  ok(true, 'a seventh player is told the room is full');

  const st = await L.relayStats();
  if (st) console.log(`relay: ${st.delivered} delivered, ${st.dropped} dropped`);
  const errs = [A, B, C, D, E, F, G, H].flatMap((d) => d.errors);
  console.log('errors:', JSON.stringify(errs));
  await b.close();
  if (errs.length) process.exit(1);
})().catch((e) => { console.error(e.message); process.exit(1); });
