// Two players on separate devices, over a lossy, laggy relay; the second phone's clock is 4 minutes fast.
const L = require('./lib');
const { ok, until, text } = L;

const ANSWERS = ['Around 9:45 PM on Saturday', 'Dr. Anand Kapoor', 'An injection of potassium chloride into a vein', 'Take irregular Trust payments to his lawyer', '21:40, before Vikram fell'];

(async () => {
  const b = await L.launch();
  const A = await L.device(b, 'Asha');
  const B = await L.device(b, 'Bilal', { phone: true, skewMs: 4 * 60 * 1000 });
  const pa = () => A.page, pb = () => B.page;

  const code = await L.openRoom(A, 'Asha');
  ok(code.length === 5, `room ${code} opened`);
  await L.joinByCode(B, code, 'Bilal');
  await until(pb(), () => document.body.innerText.includes('Waiting for Asha to start'));
  await until(pa(), () => document.querySelectorAll('.roster li').length === 2);
  ok(true, 'second phone joined by typing the code');

  await pa().click('.choice:has-text("Split")');
  await until(pb(), () => document.querySelector('.choice.on')?.textContent.includes('Split'));
  await pa().click('text=Start case');
  await pb().waitForSelector('.desk', { timeout: 15000 });
  await pa().waitForSelector('.desk');

  // split: 7 files dealt between two players, nothing lost, nothing doubled
  await until(pb(), () => document.querySelectorAll('.filelist li').length === 7);
  const aOpen = await L.openableFiles(pa()), bOpen = await L.openableFiles(pb());
  ok(aOpen.length + bOpen.length === 7 && !aOpen.some((f) => bOpen.includes(f)), `split ${aOpen.length}/${bOpen.length}, no overlap`);

  // Bilal shows one of his files to everyone
  await pb().click('.filelist li .fl-main:not([disabled])');
  await pb().click('button:has-text("Show all")');
  await until(pa(), () => document.querySelectorAll('.filelist li .fl-main:not([disabled])').length === 0 || true);
  await until(pa(), (n) => document.querySelectorAll('.filelist li .fl-main:not([disabled])').length === n, aOpen.length + 1);
  ok(true, '"Show all" makes a held file openable for the other player');
  await pb().click('[aria-label="Close file"]');

  // Asha points the table to an exhibit; Bilal gets a toast
  await pa().click('.filelist li .fl-main:not([disabled])');
  await pa().click('[aria-label="Point the table to this exhibit"]');
  await until(pb(), () => [...document.querySelectorAll('.toast')].some((t) => t.textContent.includes('Asha points to Exhibit')));
  ok(true, 'pointing reaches the other phone');
  await pa().click('[aria-label="Close file"]');

  // chat both ways, with unread badge
  await L.openPanel(pb(), 'Table');
  await pb().fill('input[aria-label="Message the table"]', 'Watch says 21:48. Doctor note says 1 am.');
  await pb().press('input[aria-label="Message the table"]', 'Enter');
  await until(pa(), () => document.querySelector('.badge')?.textContent === '1');
  ok(true, 'chat message arrives with an unread badge');
  await L.openPanel(pa(), 'Table');
  await until(pa(), () => document.querySelector('.chat')?.textContent.includes('Doctor note says 1 am'));
  await pa().fill('input[aria-label="Message the table"]', 'Agreed, go with 9:45');
  await pa().press('input[aria-label="Message the table"]', 'Enter');
  await until(pb(), () => document.querySelector('.chat')?.textContent.includes('Agreed, go with 9:45'));
  ok(!(await pa().$('.badge')), 'reading the table clears the badge');
  await L.closePanel(pa());
  await L.closePanel(pb());

  // timers agree although Bilal's clock is 4 minutes fast
  const ta = await text(pa(), '.timer'), tb = await text(pb(), '.timer');
  const secs = (t) => { const [m, s] = t.split(':').map(Number); return m * 60 + s; };
  ok(Math.abs(secs(ta) - secs(tb)) <= 3, `timers agree across skewed clocks (${ta} vs ${tb})`);

  // suggestion -> host sees it; wrong answer -> player told; right answer -> unlock
  await pb().click('.checkpoint-strip button:has-text("Suggest")');
  await pb().click('.choice:has-text("Around 9:45 PM on Saturday")');
  await L.closePanel(pb());
  await pa().click('.checkpoint-strip button:has-text("Answer")');
  await until(pa(), () => [...document.querySelectorAll('.choice')].some((c) => c.textContent.includes('9:45') && c.textContent.includes('Bilal')));
  ok(true, "host sees the player's suggestion beside the answer");
  await pa().click('.choice:has-text("Around 1:00 AM on Sunday")');
  await pa().click('text=Submit answer');
  await until(pb(), () => [...document.querySelectorAll('.toast')].some((t) => t.textContent.includes('Look again')));
  ok(true, 'player is told the answer was wrong');
  await pa().click('.choice:has-text("Around 9:45 PM on Saturday")');
  await pa().click('text=Submit answer');
  await pa().click('.sheet >> text=Open folder 2 for everyone');
  await until(pb(), () => document.querySelector('.files-title')?.textContent.includes('Round 2'));
  ok(true, 'folder 2 opens on the phone');

  // Bilal closes the tab and reopens the link: same seat, no name prompt
  await pb().close();
  const p2 = await B.newPage();
  await p2.goto(`${L.BASE}/room/${code}`);
  await p2.waitForSelector('.desk', { timeout: 15000 });
  ok((await text(p2, '.files-title')).includes('Round 2'), 'reopened tab returns to the current round without asking for a name');
  await L.openPanel(pa(), 'Table');
  await until(pa(), () => document.querySelectorAll('.roster li').length === 2 && !document.querySelector('.roster').textContent.includes('Bilal 2'));
  ok(true, 'still two seats, no duplicate player');
  await L.closePanel(pa());

  // Asha's network drops: room pauses, Bilal takes over, Asha comes back as a player
  await A.offline(true);
  await until(pb(), () => document.body.innerText.includes('has lost connection'), null, 20000);
  ok((await text(pb(), '.timer')) === 'PAUSED', 'room pauses while the host is gone');
  await until(pb(), () => !!document.querySelector('[aria-label="Next line"]'), null, 20000);
  ok(true, 'host control passes to Bilal');
  await A.offline(false);
  await until(pa(), () => !document.querySelector('[aria-label="Next line"]'), null, 20000);
  ok(true, 'Asha reconnects as a player');

  // Bilal (phone) plays out the case
  for (let i = 1; i < 5; i++) {
    await pb().click('.checkpoint-strip button:has-text("Answer")');
    await pb().click(`.choice:has-text("${ANSWERS[i]}")`);
    await pb().click('text=Submit answer');
    await pb().waitForSelector('.answer-box');
    if (i < 4) {
      await pb().click(`.sheet >> text=Open folder ${i + 2} for everyone`);
      await until(pa(), (n) => document.querySelector('.files-title')?.textContent.includes('Round ' + n), i + 2);
    } else await pb().click('.sheet >> text=Back to the desk');
  }
  ok(true, 'all five checkpoints done from the phone');

  await L.openPanel(pa(), 'Accuse');
  await pa().click('.choice:has-text("Meera Rathore — Wife")');
  await pa().click('.choice:has-text("Injected potassium chloride into a vein")');
  await pa().click('.choice:has-text("To stop Vikram exposing")');
  await pa().click('text=Cast my vote');
  await L.openPanel(pb(), 'Accuse');
  await until(pb(), () => document.body.innerText.includes('1 of 2 voted'));
  await pb().click('.choice:has-text("Meera Rathore — Wife")');
  await pb().click('.choice:has-text("Injected potassium chloride into a vein")');
  await pb().click('.choice:has-text("To stop Vikram exposing")');
  await pb().click("text=Submit the room's accusation");
  ok(await pb().isVisible('text=Submit anyway'), 'host is asked to confirm when not everyone has voted');
  await pb().click('text=Submit anyway');
  await pa().waitForSelector('.reveal-line', { timeout: 15000 });
  await pb().click('.reveal >> text=Continue');
  await until(pa(), () => document.querySelector('.reveal .eyebrow')?.textContent.includes('V-02'));
  await pb().click('.reveal >> text=Skip');
  await pa().waitForSelector('.reportcard', { timeout: 15000 });
  ok((await text(pa(), '.reportcard')).includes('Case solved'), 'both see the report: Case solved');

  const st = await L.relayStats();
  if (st) console.log(`relay: ${st.delivered} delivered, ${st.dropped} dropped`);
  const errs = [...A.errors, ...B.errors];
  console.log('errors:', JSON.stringify(errs));
  await b.close();
  if (errs.length) process.exit(1);
})().catch((e) => { console.error(e.message); process.exit(1); });
