const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:3000';
const ok = (c, m) => { if (!c) throw new Error('FAIL: ' + m); console.log('ok -', m); };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } });
  // let a page "lose its network": its outgoing room messages are dropped
  await ctx.addInitScript(() => {
    const orig = BroadcastChannel.prototype.postMessage;
    BroadcastChannel.prototype.postMessage = function (m) { if (!window.__mute) orig.call(this, m); };
  });
  const errs = [];
  const mk = async () => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); return p; };
  const enter = async (p, n) => { await p.fill('input[aria-label="Your name"]', n); await p.click('text=Enter the room'); };

  const A = await mk();
  await A.goto(BASE + '/case/017'); await A.click('text=Open a room'); await A.waitForURL(/room/);
  await enter(A, 'Asha'); await A.waitForSelector('[data-testid=room-code]');
  const code = (await A.textContent('[data-testid=room-code]')).trim();
  const B = await mk(); await B.goto(`${BASE}/room/${code}`); await enter(B, 'Bilal');
  const C = await mk(); await C.goto(`${BASE}/room/${code}`); await enter(C, 'Chitra');
  await A.waitForFunction(() => document.querySelectorAll('.roster li').length === 3, null, { timeout: 8000 });

  // remove Chitra; she must stay out
  await A.click('[aria-label="Remove Chitra"]');
  await C.waitForSelector('text=You were removed from this room', { timeout: 5000 });
  await A.waitForTimeout(4000);
  ok((await A.$$('.roster li')).length === 2, 'removed player stays removed');

  // refresh in the lobby keeps the room
  await B.reload();
  await B.waitForSelector('text=Waiting for Asha to start the case', { timeout: 8000 });
  ok(true, 'player refresh returns to lobby without re-entering name');

  await A.click('text=Start case');
  await A.waitForSelector('.desk'); await B.waitForSelector('.desk');

  // host goes silent (network drop, no goodbye)
  await A.evaluate(() => { window.__mute = true; });
  await B.waitForSelector('text=The host has lost connection', { timeout: 15000 });
  ok(await B.isVisible('.timer >> text=PAUSED'), 'timer pauses while host is gone');
  await B.waitForSelector('[aria-label="Next line"]', { timeout: 15000 });
  ok(true, 'silent host replaced by Bilal');
  await B.click('[aria-label="Next line"]');

  // old host comes back and steps down
  await A.evaluate(() => { window.__mute = false; });
  await A.waitForFunction(() => !document.querySelector('[aria-label="Next line"]'), null, { timeout: 10000 });
  await A.waitForFunction(() => document.querySelector('.nar-id')?.textContent === 'B-02', null, { timeout: 10000 });
  ok(true, 'returning host becomes a player and catches up');
  await B.waitForTimeout(3000);
  ok(!!(await B.$('[aria-label="Next line"]')), 'only one host after the network heals');

  // host refresh mid-game keeps the game and the host seat
  await B.reload();
  await B.waitForSelector('[aria-label="Next line"]', { timeout: 10000 });
  ok((await B.textContent('.nar-id')) === 'B-02', 'host refresh keeps state and control');
  console.log('errors:', JSON.stringify(errs));
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
