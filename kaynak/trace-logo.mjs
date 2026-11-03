// Traces the logo mark into one SVG per colour layer, then recolours it for the site.
import sharp from 'sharp';
import potrace from 'potrace';
import fs from 'node:fs';

const SRC = '../logo/fav.png', S = 768;
const { data, info } = await sharp(SRC).resize(S, S, { kernel: 'lanczos3' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const LAYERS = { body: [136, 85, 187], lime: [204, 212, 68], swoosh: [51, 34, 85] };
const near = (r, g, b) => {
  let best = null, d = 1e9;
  for (const [k, c] of Object.entries(LAYERS)) { const e = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2; if (e < d) { d = e; best = k; } }
  return best;
};
const masks = Object.fromEntries(Object.keys(LAYERS).map((k) => [k, Buffer.alloc(S * S, 255)]));
for (let i = 0, p = 0; i < data.length; i += 4, p++) {
  if (data[i + 3] < 128) continue;
  masks[near(data[i], data[i + 1], data[i + 2])][p] = 0;
}
const trace = (buf) => new Promise((ok, no) => sharp(buf, { raw: { width: S, height: S, channels: 1 } }).png().toBuffer().then((png) =>
  potrace.trace(png, { turdSize: 40, optTolerance: 0.4, alphaMax: 1 }, (err, svg) => err ? no(err) : ok(svg.match(/ d="([^"]+)"/)[1]))));
const paths = {};
for (const k of Object.keys(LAYERS)) paths[k] = await trace(masks[k]);
fs.writeFileSync('logo-paths.json', JSON.stringify(paths));
const svg = (fill) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}"><path d="${paths.swoosh}" fill="${fill.swoosh}"/><path d="${paths.body}" fill="${fill.body}"/><path d="${paths.lime}" fill="${fill.lime}"/></svg>`;
fs.writeFileSync('../logo/mark-original.svg', svg({ body: '#8855BB', lime: '#CCD444', swoosh: '#332255' }));
fs.writeFileSync('../logo/mark-site.svg', svg({ body: '#FFFFFF', lime: '#7CF2C6', swoosh: 'rgba(255,255,255,.55)' }));
// preview: original next to the site version on the section colours
const bgs = ['#051DAA', '#2A0FA8', '#0A5A3C', '#6A1045', '#6B3A08', '#010419'];
const tiles = [];
tiles.push({ input: await sharp(Buffer.from(svg({ body: '#8855BB', lime: '#CCD444', swoosh: '#332255' }))).resize(160, 160).flatten({ background: '#ffffff' }).toBuffer(), left: 20, top: 20 });
for (const [i, bg] of bgs.entries()) tiles.push({ input: await sharp(Buffer.from(svg({ body: '#FFFFFF', lime: '#7CF2C6', swoosh: 'rgba(255,255,255,.55)' }))).resize(160, 160).flatten({ background: bg }).toBuffer(), left: 200 + i * 180, top: 20 });
await sharp({ create: { width: 1300, height: 200, channels: 3, background: '#222' } }).composite(tiles).png().toFile('../logo/preview.png');
console.log(Object.fromEntries(Object.entries(paths).map(([k, v]) => [k, v.length])));
