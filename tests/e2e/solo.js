const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:3000';
const ok = (c, m) => { if (!c) throw new Error('FAIL: ' + m); console.log('ok -', m); };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  pg.on('console', m => m.type() === 'error' && !/404|Failed to load resource/.test(m.text()) && errs.push(m.text()));
  await pg.goto(BASE + '/case/017');
  await pg.click('text=Open the file');
  await pg.waitForSelector('.desk');
  // every exhibit renders
  for (let r = 1; r <= 5; r++) {
    // can't open locked folders; we open files as we progress
  }
  const answers = [
    'Around 9:45 PM on Saturday',
    'Dr. Anand Kapoor',
    'An injection of potassium chloride into a vein',
    'Take irregular Trust payments to his lawyer',
    '21:40, before Vikram fell',
  ];
  for (let i = 0; i < 5; i++) {
    const rows = await pg.$$('.filelist li .fl-main');
    for (const row of rows) { await row.click(); await pg.waitForTimeout(60); }
    ok((await pg.$$('.paper')).length > 0, `round ${i + 1}: files open (${rows.length})`);
    if (i === 0) {
      // wrong answer path
      await pg.click('.checkpoint-strip >> text=Answer');
      await pg.click('.choice >> text=Around 1:00 AM on Sunday');
      await pg.click('text=Submit answer');
      ok(await pg.isVisible('text=Look again.'), 'wrong answer shows Look again');
      await pg.click('.sheet-x');
      // hints
      await pg.click('text=Hints');
      await pg.click('text=Reveal hint 1');
      ok(await pg.isVisible('.hints li.shown'), 'hint revealed');
      await pg.click('.sheet-x');
      // narration next
      await pg.click('[aria-label="Next line"]');
      ok((await pg.textContent('.nar-id')) === 'I-02', 'narration advances');
    }
    await pg.click('.checkpoint-strip >> text=Answer');
    await pg.click(`.choice >> text=${answers[i]}`);
    await pg.click('text=Submit answer');
    await pg.waitForSelector('.answer-box');
    if (i < 4) {
      await pg.click(`.sheet >> text=Open folder ${i + 2}`);
      await pg.waitForTimeout(150);
      ok((await pg.textContent('.files-head')).includes(`Round ${i + 2}`), `folder ${i + 2} opened`);
      ok((await pg.textContent('.nar-id')) === `R${i + 2}-01`, `narration moved to R${i + 2}-01`);
    } else {
      await pg.click('.sheet >> text=Back to the desk');
    }
  }
  // reload keeps progress
  await pg.reload(); await pg.waitForSelector('.desk');
  ok((await pg.textContent('.files-head')).includes('Round 5'), 'progress survives reload');
  // accuse
  await pg.click('header >> text=Accuse');
  await pg.click('.choice >> text=Meera Rathore — Wife');
  await pg.click('.choice >> text=Injected potassium chloride into a vein');
  await pg.click('.choice >> text=To stop Vikram exposing');
  await pg.click('text=Submit and close the file');
  await pg.waitForSelector('.reveal-line');
  ok((await pg.textContent('.reveal .eyebrow')).includes('V-01'), 'reveal starts at V-01');
  for (let k = 0; k < 12; k++) await pg.click('.reveal >> text=Continue');
  await pg.waitForSelector('.reportcard');
  ok((await pg.textContent('.reportcard')).includes('Case solved'), 'report says Case solved');
  await pg.screenshot({ path: '/tmp/bb-' + Date.now() + '.png' });
  // cover shows solved status
  await pg.goto(BASE + '/case/017');
  ok(await pg.isVisible('text=Review file'), 'cover shows Review file');
  // all 34 exhibits render in the kit
  await pg.goto(BASE + '/case/017/kit'); await pg.waitForTimeout(800);
  const n = await pg.$$eval('.print-page', els => els.length);
  ok(n === 34 + 4, `kit renders ${n} pages`);
  console.log('errors:', JSON.stringify(errs));
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
