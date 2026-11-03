// First screen on phones and a tablet: is the word, the intro card and the map visible without scrolling?
import { chromium, webkit, devices } from 'playwright';
import sharp from 'sharp';
const BASE = process.env.BASE || 'http://localhost:8765';
const SET = [['webkit', 'iPhone SE'], ['webkit', 'iPhone 15'], ['chromium', 'Pixel 7'], ['chromium', 'Galaxy S9+'], ['webkit', 'iPad Mini']];
const shots = [];
for (const [eng, dev] of SET) {
  const b = await (eng === 'webkit' ? webkit : chromium).launch(eng === 'chromium' ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' } : {});
  const p = await (await b.newContext({ ...devices[dev] })).newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  for (const u of ['/', '/en/']) {
    await p.goto(BASE + u, { waitUntil: 'load' }); await p.waitForTimeout(3200);
    const r = await p.evaluate(() => {
      const H = innerHeight, box = (s) => document.querySelector(s).getBoundingClientRect();
      const w = box('.word span'), t = box('.stack > .tile'), m = box('.mapbox');
      return { H, word: Math.round(w.bottom) <= H, intro: Math.round(t.bottom) <= H, mapTop: Math.round(m.top), mapH: Math.round(m.height), mapVisible: Math.round(Math.min(m.bottom, H) - m.top), sw: document.documentElement.scrollWidth > innerWidth };
    });
    console.log(dev.padEnd(10), u.padEnd(4), JSON.stringify(r), errs.length ? 'ERR ' + errs : '');
    if (u === '/') { const n = `../shots/first-${dev.replace(/\W+/g, '_')}.jpg`; await p.screenshot({ path: n, type: 'jpeg', quality: 60 }); shots.push(n); }
  }
  await b.close();
}
const tiles = await Promise.all(shots.map((n) => sharp(n).resize(300, 640, { fit: 'contain', background: '#222' }).toBuffer()));
await sharp({ create: { width: 300 * tiles.length, height: 640, channels: 3, background: '#222' } }).composite(tiles.map((d, i) => ({ input: d, left: i * 300, top: 0 }))).jpeg({ quality: 72 }).toFile('../shots/first-sheet.jpg');
