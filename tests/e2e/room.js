const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:3000';
const ok = (c, m) => { if (!c) throw new Error('FAIL: ' + m); console.log('ok -', m); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } });
  const errs = [];
  const mk = async () => {
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(e.message));
    return p;
  };
  const enter = async (p, name) => {
    await p.fill('input[aria-label="Your name"]', name);
    await p.click('text=Enter the room');
  };
  // host opens a room
  const A = await mk();
  await A.goto(BASE + '/case/017');
  await A.click('text=Open a room');
  await A.waitForURL(/\/room\//);
  await enter(A, 'Asha');
  await A.waitForSelector('[data-testid=room-code]', { timeout: 10000 });
  const code = (await A.textContent('[data-testid=room-code]')).trim();
  ok(code.length === 5, 'room code ' + code);

  const B = await mk(); await B.goto(`${BASE}/room/${code}`); await enter(B, 'Bilal');
  const C = await mk(); await C.goto(`${BASE}/room/${code}`); await enter(C, 'Chitra');
  await B.waitForSelector('text=Waiting for Asha to start the case', { timeout: 10000 });
  await C.waitForSelector('text=Waiting for Asha to start the case', { timeout: 10000 });
  await A.waitForFunction(() => document.querySelectorAll('.roster li').length === 3, null, { timeout: 8000 });
  ok(true, 'lobby shows 3 players');

  // host picks split and starts
  await A.click('.choice >> text=Split');
  await B.waitForSelector('.choice.on >> text=Split');
  ok(true, 'mode change reaches players');
  await A.click('text=Start case');
  for (const p of [A, B, C]) await p.waitForSelector('.desk', { timeout: 8000 });
  ok(true, 'everyone is at the desk');

  // split: each sees some files held by others
  const counts = [];
  for (const p of [A, B, C]) counts.push(await p.$$eval('.filetable tbody tr:not(.held)', r => r.length));
  ok(counts.reduce((a, c) => a + c, 0) === 7 && counts.every(n => n >= 2), 'split deals 7 files: ' + counts.join('/'));
  ok(await B.isVisible('.heldby'), 'held-by label shown');

  // narration: only host has next; moves everyone
  ok(!(await B.$('[aria-label="Next line"]')), 'non-host has no Next');
  await A.click('[aria-label="Next line"]');
  await B.waitForFunction(() => document.querySelector('.nar-id')?.textContent === 'B-02', null, { timeout: 5000 });
  ok(true, 'host line change reaches players');

  // checkpoint: wrong then right, non-host sees feedback
  await A.click('.checkpoint-strip >> text=Answer');
  await A.click('.choice >> text=Around 1:00 AM on Sunday');
  await A.click('text=Submit answer');
  await B.click('.checkpoint-strip >> text=View');
  await B.waitForSelector('text=Look again.', { timeout: 5000 });
  ok(true, 'wrong answer visible to players');
  await A.click('.choice >> text=Around 9:45 PM on Saturday');
  await A.click('text=Submit answer');
  await B.waitForSelector('.answer-box', { timeout: 5000 });
  ok(await B.isVisible('text=Waiting for the host to open folder 2'), 'player waits for host to unlock');
  await A.click('.sheet >> text=Open folder 2 for everyone');
  await C.waitForFunction(() => document.querySelector('.files-head')?.textContent.includes('Round 2'), null, { timeout: 5000 });
  ok(true, 'folder 2 opened on all screens');
  await B.click('.sheet-x').catch(() => {});

  // hint from player is counted
  await C.click('text=Hints'); await C.click('text=Reveal hint 1'); await C.click('.sheet-x');

  // host leaves: Bilal (next joined) takes over
  await A.close();
  await B.waitForSelector('[aria-label="Next line"]', { timeout: 20000 });
  ok(true, 'host control passed to Bilal');
  ok(!(await C.$('[aria-label="Next line"]')), 'Chitra is still a player');

  // Asha rejoins in a new tab with the same name and gets her seat back
  const A2 = await mk(); await A2.goto(`${BASE}/room/${code}`); await enter(A2, 'Asha');
  await A2.waitForSelector('.desk', { timeout: 10000 });
  ok((await A2.textContent('.files-head')).includes('Round 2'), 'rejoiner lands on current round');
  await B.click('[aria-label="Players in the room"]');
  await B.waitForFunction(() => [...document.querySelectorAll('.roster li')].length === 3, null, { timeout: 8000 });
  ok(true, 'roster still has 3 (seat reclaimed, no duplicate)');
  await B.click('.sheet-x');

  // new host plays through the remaining checkpoints
  const answers = ['Dr. Anand Kapoor', 'An injection of potassium chloride into a vein', 'Take irregular Trust payments to his lawyer', '21:40, before Vikram fell'];
  for (let i = 0; i < 4; i++) {
    const before = await B.evaluate(() => document.querySelector('.files-head')?.textContent);
    await B.click('.checkpoint-strip >> text=Answer');
    const s1 = await B.evaluate(() => !!document.querySelector('.sheet'));
    await B.waitForTimeout(300);
    const s2 = await B.evaluate(() => !!document.querySelector('.sheet'));
    await B.click(`.choice >> text=${answers[i]}`, { timeout: 5000 });
    await B.click('text=Submit answer');
    await B.waitForSelector('.answer-box');
    if (i < 3) {
      await B.click(`.sheet >> text=Open folder ${i + 3} for everyone`);
      await C.waitForFunction((n) => document.querySelector('.files-head')?.textContent.includes('Round ' + n), i + 3, { timeout: 5000 });
    } else await B.click('.sheet >> text=Back to the desk');
  }
  ok(true, 'all five checkpoints done');

  // votes
  const vote = async (p, who) => {
    await p.click('header >> text=Accuse');
    await p.click(`.choice >> text=${who}`);
    await p.click('.choice >> text=Injected potassium chloride into a vein');
    await p.click('.choice >> text=To stop Vikram exposing');
    await p.click('text=Cast my vote');
  };
  await vote(C, 'Dr. Anand Kapoor — Family physician');
  await vote(A2, 'Meera Rathore — Wife');
  await vote(B, 'Meera Rathore — Wife');
  await B.waitForSelector('text=3 of 3 voted', { timeout: 5000 });
  ok(true, 'host sees all 3 votes');
  await B.click("text=Submit the room's accusation");
  for (const p of [C, A2]) await p.waitForSelector('.reveal-line', { timeout: 6000 });
  ok(true, 'reveal opens for everyone');
  ok(await C.isVisible('text=The host is reading the reveal'), 'players follow host through reveal');
  await B.click('.reveal >> text=Continue');
  await C.waitForFunction(() => document.querySelector('.reveal .eyebrow')?.textContent.includes('V-02'), null, { timeout: 5000 });
  ok(true, 'reveal step syncs');
  await B.click('.reveal >> text=Skip to report');
  await C.waitForSelector('.reportcard', { timeout: 5000 });
  const rep = await C.textContent('.reportcard');
  ok(rep.includes('Case solved') && rep.includes('How the table voted') && rep.includes('Chitra'), 'report card for all with votes');
  ok(/HINTS USED\s*1/.test(rep), 'room hint count = 1');
  await C.screenshot({ path: '/tmp/bb-' + Date.now() + '.png' });
  console.log('errors:', JSON.stringify(errs));
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
