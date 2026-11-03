// Cross-engine check of the live site: WebKit (iPhone, iPad, Mac Safari), Chromium (Android, Windows), Firefox (Windows/Mac)
import { chromium, webkit, firefox, devices } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';

const BASE = process.env.BASE || 'https://aylininci.com';
const PAGES = ['/', '/en/', '/blog/', '/blog/google-ai-modu-seo'];
const SETUPS = [
  ['webkit', 'iPhone SE', devices['iPhone SE']],
  ['webkit', 'iPhone 15', devices['iPhone 15']],
  ['webkit', 'iPad Pro 11', devices['iPad Pro 11']],
  ['webkit', 'Mac Safari 1440', { viewport: { width: 1440, height: 900 } }],
  ['chromium', 'Pixel 7', devices['Pixel 7']],
  ['chromium', 'Galaxy S9+', devices['Galaxy S9+']],
  ['chromium', 'Windows 1366', { viewport: { width: 1366, height: 768 } }],
  ['chromium', 'Windows 1920', { viewport: { width: 1920, height: 1080 } }],
  ['firefox', 'Firefox 1440', { viewport: { width: 1440, height: 900 } }],
  ['firefox', 'Firefox 1280', { viewport: { width: 1280, height: 720 } }],
];
const engines = { chromium, webkit, firefox };
const report = [], shots = [];
fs.mkdirSync('../shots/matrix', { recursive: true });

for (const [eng, name, opts] of SETUPS) {
  const browser = await engines[eng].launch(eng === 'chromium' ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' } : {});
  const ctx = await browser.newContext({ ...opts, locale: 'tr-TR' });
  for (const u of PAGES) {
    const page = await ctx.newPage();
    const errors = [], failed = [];
    page.on('pageerror', (e) => errors.push(e.message.slice(0, 140)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 140)); });
    page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('favicon')) failed.push(r.status() + ' ' + r.url()); });
    try {
      await page.goto(BASE + u, { waitUntil: 'load', timeout: 45000 });
      await page.waitForTimeout(3500);
      const top = await page.evaluate(() => {
        const W = innerWidth, cw = document.documentElement.clientWidth;
        const brand = document.querySelector('.brand'), logo = brand && brand.querySelector('img');
        const navLinks = [...document.querySelectorAll('.top-links a')].filter((a) => a.getBoundingClientRect().width > 0).map((a) => a.textContent.trim());
        const imgs = [...document.images].filter((i) => i.getBoundingClientRect().width > 0 && i.loading !== 'lazy');
        const word = document.querySelector('.word span'), cell = document.querySelector('.word');
        let mapInk = null; const cv = document.querySelector('#map, #amap, #pmap');
        if (cv) { try { const c = cv.getContext('2d'), d = c.getImageData(0, 0, cv.width, cv.height).data; let n = 0; for (let i = 0; i < d.length; i += 4000) if (d[i] + d[i + 1] + d[i + 2] > 300) n++; mapInk = n; } catch (e) { mapInk = 'err'; } }
        return {
          W, sw: document.documentElement.scrollWidth, cw,
          fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')).filter((v, i, a) => a.indexOf(v) === i).join('+'),
          logo: logo ? logo.complete && logo.naturalWidth > 0 : false,
          nav: navLinks.join('|'),
          brokenImgs: imgs.filter((i) => !i.naturalWidth).map((i) => i.src.split('/').pop()),
          wordFits: word && cell && getComputedStyle(cell).display !== 'none' && word.getBoundingClientRect().height > 0 ? (word.getBoundingClientRect().top >= cell.getBoundingClientRect().top - 2 && word.getBoundingClientRect().bottom <= cell.getBoundingClientRect().bottom + 2) : 'n/a',
          mapInk,
        };
      });
      // header fits, and on small screens the menu opens, shows its links and closes again
      top.headerFits = await page.evaluate(() => [...document.querySelectorAll('.top > *, .top-links > *')].filter((e) => e.getBoundingClientRect().width > 0).every((e) => e.getBoundingClientRect().right <= document.documentElement.clientWidth + 1 && e.getBoundingClientRect().left >= -1));
      const btn = page.locator('.menu-btn');
      if (await btn.isVisible()) {
        await btn.click(); await page.waitForTimeout(300);
        const open = await page.evaluate(() => { const m = document.getElementById('menu'); return !m.hidden && [...m.querySelectorAll('a')].filter((a) => a.getBoundingClientRect().height > 30).length; });
        await page.screenshot({ path: `../shots/matrix/${name.replace(/\W+/g, '_')}${u.replace(/\W+/g, '_')}menu.jpg`, type: 'jpeg', quality: 55 });
        await page.keyboard.press('Escape'); await page.waitForTimeout(200);
        const closed = await page.evaluate(() => document.getElementById('menu').hidden);
        top.menu = open === 4 && closed ? 'ok' : `open:${open} closed:${closed}`;
      } else top.menu = 'desktop';
      await page.screenshot({ path: `../shots/matrix/${name.replace(/\W+/g, '_')}${u.replace(/\W+/g, '_')}0.jpg`, type: 'jpeg', quality: 55 });
      shots.push([name, u, `../shots/matrix/${name.replace(/\W+/g, '_')}${u.replace(/\W+/g, '_')}0.jpg`]);
      // walk down the page and collect text that leaves the screen
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      const outside = new Set(); let maxSw = top.sw;
      const steps = Math.min(14, Math.ceil(H / (opts.viewport ? opts.viewport.height : 800)));
      for (let s = 1; s <= steps; s++) {
        await page.evaluate((y) => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, y); }, Math.round(H * s / (steps + 1)));
        await page.waitForTimeout(900);
        const r = await page.evaluate(() => ({
          sw: document.documentElement.scrollWidth,
          out: [...document.querySelectorAll('main *, footer *, header *')].filter((e) => {
            if (!e.childNodes.length || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return false;
            if (e.closest('[aria-hidden="true"], .filters, .stage, .codeloop, pre, .table')) return false;
            const b = e.getBoundingClientRect(); if (b.width < 2 || b.bottom < 60 || b.top > innerHeight) return false;
            const st = getComputedStyle(e); if (st.visibility === 'hidden' || +st.opacity === 0) return false;
            return b.left < -2 || b.right > document.documentElement.clientWidth + 2;
          }).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]} "${e.textContent.trim().slice(0, 28)}" ${Math.round(e.getBoundingClientRect().left)}..${Math.round(e.getBoundingClientRect().right)}`),
        }));
        maxSw = Math.max(maxSw, r.sw); r.out.forEach((x) => outside.add(x));
        if (s === Math.ceil(steps / 2)) {
          const n = `../shots/matrix/${name.replace(/\W+/g, '_')}${u.replace(/\W+/g, '_')}1.jpg`;
          await page.screenshot({ path: n, type: 'jpeg', quality: 55 }); shots.push([name, u + ' (mid)', n]);
        }
      }
      report.push({ eng, name, u, ...top, maxSw, overflow: maxSw > top.cw + 1, outside: [...outside].slice(0, 6), errors: [...new Set(errors)].slice(0, 4), failed: failed.slice(0, 4) });
    } catch (e) { report.push({ eng, name, u, crash: e.message.slice(0, 160) }); }
    await page.close();
  }
  await browser.close();
}
fs.writeFileSync('matrix.json', JSON.stringify(report, null, 1));
for (const r of report) {
  if (r.crash) { console.log('CRASH', r.name, r.u, r.crash); continue; }
  const flags = [];
  if (r.overflow) flags.push('OVERFLOW ' + r.maxSw + '>' + r.cw);
  if (r.outside.length) flags.push('OUTSIDE ' + r.outside.join(' ; '));
  if (r.errors.length) flags.push('ERRORS ' + r.errors.join(' ; '));
  if (r.failed.length) flags.push('FAILED ' + r.failed.join(' ; '));
  if (r.brokenImgs.length) flags.push('BROKEN IMG ' + r.brokenImgs);
  if (!r.logo) flags.push('NO LOGO');
  if (r.wordFits === false) flags.push('WORD CUT');
  if (r.mapInk === 0) flags.push('MAP EMPTY');
  if (!/Instrument Sans/.test(r.fonts)) flags.push('FONT ' + r.fonts);
  if (!r.headerFits) flags.push('HEADER DOES NOT FIT');
  if (r.menu !== 'ok' && r.menu !== 'desktop') flags.push('MENU ' + r.menu);
  console.log(`${r.eng.padEnd(8)} ${r.name.padEnd(16)} ${r.u.padEnd(26)} nav[${r.nav}] ${flags.length ? flags.join(' | ') : 'ok'}`);
}
// contact sheet of the first screens
const pick = shots.filter((s) => !s[1].includes('mid'));
const tiles = await Promise.all(pick.map(async ([, , f]) => sharp(f).resize(240, 300, { fit: 'contain', background: '#222' }).toBuffer()));
const cols = 8;
await sharp({ create: { width: 240 * cols, height: 300 * Math.ceil(tiles.length / cols), channels: 3, background: '#111' } }).composite(tiles.map((d, i) => ({ input: d, left: (i % cols) * 240, top: Math.floor(i / cols) * 300 }))).jpeg({ quality: 70 }).toFile('../shots/matrix-sheet.jpg');
const mid = shots.filter((s) => s[1].includes('mid'));
const t2 = await Promise.all(mid.map(async ([, , f]) => sharp(f).resize(240, 300, { fit: 'contain', background: '#222' }).toBuffer()));
await sharp({ create: { width: 240 * cols, height: 300 * Math.ceil(t2.length / cols), channels: 3, background: '#111' } }).composite(t2.map((d, i) => ({ input: d, left: (i % cols) * 240, top: Math.floor(i / cols) * 300 }))).jpeg({ quality: 70 }).toFile('../shots/matrix-sheet-mid.jpg');
