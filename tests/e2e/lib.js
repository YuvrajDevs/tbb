// Shared helpers for the end-to-end tests. Every player gets their own browser context:
// separate storage, separate network, optionally a skewed clock, like a separate phone.
const { chromium, devices } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:3000';
const RELAY = process.env.RELAY || 'http://localhost:8787';
const fails = [];
const ok = (cond, msg) => {
  if (!cond) throw new Error('FAIL: ' + msg);
  console.log('ok -', msg);
};

async function launch() {
  return chromium.launch();
}

/** A player's device. opts: { phone, skewMs } */
async function device(browser, label, opts = {}) {
  const ctx = await browser.newContext(opts.phone ? { ...devices['iPhone 13'] } : { viewport: { width: 1280, height: 860 } });
  if (opts.skewMs) {
    await ctx.addInitScript((off) => {
      const real = Date.now.bind(Date);
      Date.now = () => real() + off;
    }, opts.skewMs);
  }
  const errors = [];
  const page = await ctx.newPage();
  const watch = (p) => p.on('pageerror', (e) => errors.push(`${label}: ${e.message}${process.env.STACK ? '\n' + e.stack : ''}`));
  watch(page);
  return {
    label, ctx, page, errors,
    async newPage() { this.page = await ctx.newPage(); watch(this.page); return this.page; },
    offline: (v) => ctx.setOffline(v),
  };
}

async function enterName(p, name) {
  await p.fill('input[aria-label="Your name"]', name);
  await p.click('text=Enter the room');
}

async function openRoom(d, name) {
  const p = d.page;
  await p.goto(BASE + '/case/017');
  await p.click('text=Open a room');
  await p.waitForURL(/\/room\//);
  await enterName(p, name);
  await p.waitForSelector('[data-testid=room-code]', { timeout: 15000 });
  return (await p.textContent('[data-testid=room-code]')).trim();
}

async function joinByCode(d, code, name) {
  const p = d.page;
  await p.goto(BASE + '/room');
  await p.fill('input[aria-label="Room code"]', code);
  await p.click('button:has-text("Join")');
  await p.waitForURL(/\/room\/[A-Z0-9]{5}/);
  await enterName(p, name);
}

const until = (p, fn, arg, timeout = 15000) => p.waitForFunction(fn, arg, { timeout, polling: 200 });
const text = (p, sel) => p.evaluate((s) => document.querySelector(s)?.textContent ?? '', sel);

async function relayStats() {
  try { return await (await fetch(RELAY + '/stats')).json(); } catch { return null; }
}
async function relayConfig(cfg) {
  await fetch(RELAY + '/config', { method: 'POST', body: JSON.stringify(cfg) });
}

/** Desk helpers */
const openPanel = async (p, tab) => {
  // phones use the tab bar, desktops the top bar; both open the same panel
  const phone = await p.evaluate(() => innerWidth <= 900);
  if (phone) await p.click(`.tabbar button:has-text("${tab}")`);
  else if (tab === 'Table') await p.click('[aria-label="Table: players and chat"]');
  else await p.click(`header button:has-text("${tab}")`);
  await p.waitForSelector('.sheet');
};
const closePanel = async (p) => { if (await p.$('.sheet-x')) await p.click('.sheet-x'); };
const openableFiles = (p) => p.$$eval('.filelist li .fl-main:not([disabled])', (els) => els.map((e) => e.getAttribute('aria-label')));
const heldFiles = (p) => p.$$eval('.filelist li .fl-main[disabled]', (els) => els.map((e) => e.getAttribute('aria-label')));

module.exports = { BASE, RELAY, ok, launch, device, enterName, openRoom, joinByCode, until, text, relayStats, relayConfig, openPanel, closePanel, openableFiles, heldFiles, fails };
