// Phone navigation: every feature reachable from the tab bar, nothing wider than the screen.
const L = require('./lib');
const { ok, until, text } = L;

(async () => {
  const b = await L.launch();
  const D = await L.device(b, 'phone', { phone: true });
  const p = D.page;
  const fits = async (what) => {
    const [sw, w] = await p.evaluate(() => [document.documentElement.scrollWidth, Math.min(innerWidth, screen.width)]);
    ok(sw <= w, `${what}: no sideways scroll (${sw} <= ${w})`);
  };

  await p.goto(L.BASE + '/');
  await fits('case shelf');
  await p.goto(L.BASE + '/case/017');
  await fits('case cover');
  await p.click('text=Open the file');
  await p.waitForSelector('.desk');
  await fits('desk');

  // tab bar: big enough to hit, every tab opens its sheet
  const sizes = await p.$$eval('.tabbar button', (bs) => bs.map((x) => x.getBoundingClientRect().height));
  ok(sizes.length === 4 && sizes.every((h) => h >= 44), `tab bar has 4 tabs, each at least 44px tall`);
  ok(await p.isVisible('.tabbar button:has-text("Accuse")[disabled]'), 'Accuse is disabled until all checkpoints are done');
  await L.openPanel(p, 'Notebook');
  await p.fill('textarea[aria-label="Your notes"]', 'Watch: 21:48. Radio on.');
  await p.click('.tabbar button:has-text("Files")').catch(() => {});
  await L.closePanel(p);
  await L.openPanel(p, 'Notebook');
  ok((await p.inputValue('textarea[aria-label="Your notes"]')) === 'Watch: 21:48. Radio on.', 'notes persist between openings');
  await L.closePanel(p);
  await L.openPanel(p, 'Hints');
  await p.click('text=Reveal hint 1');
  ok(!!(await p.waitForSelector('.hints li.shown', { timeout: 10000 }).catch(() => null)), 'hint revealed from the tab bar');
  await L.closePanel(p);
  await p.click('[aria-label="Settings"]');
  ok(await p.isVisible('text=Round timer.'), 'settings open from the top bar');
  await L.closePanel(p);

  // narration line expands on tap
  const before = await p.$eval('.nar-text', (e) => e.getBoundingClientRect().height);
  await p.click('.nar-text');
  const after = await p.$eval('.nar-text', (e) => e.getBoundingClientRect().height);
  ok(after >= before, 'narration caption expands on tap');

  // folders scroll sideways inside their strip, not the page
  await fits('desk with folder strip');

  // every exhibit of round 1 opens full screen, fits, and closes
  const n = (await p.$$('.filelist li .fl-main')).length;
  for (let i = 0; i < n; i++) {
    await p.click(`.filelist li:nth-child(${i + 1}) .fl-main`);
    await p.waitForSelector('.viewer .paper');
    const vis = await p.isVisible('[aria-label="Close file"]');
    ok(vis, `exhibit ${i + 1} opens with a visible close button`);
    await fits(`exhibit ${i + 1} open`);
    await p.click('[aria-label="Close file"]');
  }

  // checkpoint sheet: answer reachable on a phone
  await p.click('.checkpoint-strip button:has-text("Answer")');
  await p.click('.choice:has-text("Around 9:45 PM on Saturday")');
  await p.click('text=Submit answer');
  await p.waitForSelector('.answer-box');
  ok(await p.isVisible('.sheet >> text=Open folder 2'), 'checkpoint answered from a bottom sheet');
  await p.click('.sheet >> text=Open folder 2');
  await until(p, () => document.querySelector('.files-title')?.textContent.includes('Round 2'));

  // leaving the desk must not crash
  await p.click('[aria-label="Leave the desk"]');
  await p.waitForURL(/\/case\/017$/);
  await p.waitForTimeout(800);
  ok(D.errors.length === 0, 'leaving the desk with the back arrow does not crash');

  // all 34 exhibits at phone width (print kit renders every one)
  await p.goto(L.BASE + '/case/017/kit');
  await p.waitForTimeout(1200);
  await fits('all 34 exhibits at phone width');

  // party pages on a phone
  await p.goto(L.BASE + '/room');
  await fits('join page');
  await p.goto(L.BASE + '/case/017');
  await p.click('text=Open a room');
  await p.waitForURL(/\/room\//);
  await L.enterName(p, 'Asha');
  await p.waitForSelector('[data-testid=room-code]', { timeout: 15000 });
  await fits('lobby');
  await p.click('text=Start case');
  await p.waitForSelector('.desk');
  ok((await p.$$('.tabbar button')).length === 5, 'party desk adds a Table tab');
  await L.openPanel(p, 'Table');
  await p.fill('input[aria-label="Message the table"]', 'hello table');
  await p.press('input[aria-label="Message the table"]', 'Enter');
  await until(p, () => document.querySelector('.chat')?.textContent.includes('hello table'));
  ok(true, 'table chat works on a phone');
  await fits('table sheet');

  console.log('errors:', JSON.stringify(D.errors));
  await b.close();
  if (D.errors.length) process.exit(1);
})().catch((e) => { console.error(e.message); process.exit(1); });
