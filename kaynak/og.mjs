// Share images (1200x630) for the new posts, in the site's look: topic colour, logo, title, a small constellation
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ITEMS = [
  ['shopify-fall-26-edition', "Shopify Fall '26 Edition: Mağazalar İçin Neler Değişti?", 'Shopify', '#0A5A3C'],
  ['robots-txt-yapay-zeka-egitimi', 'robots.txt ile Yapay Zeka Eğitimini Kontrol Etmek', 'Teknik SEO', '#051DAA'],
];
const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.resolve('../fonts', f)).toString('base64');
const logo = fs.readFileSync('../prev/img/logo-mark.svg', 'utf8');
fs.mkdirSync('og', { recursive: true });
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
for (const [slug, title, cat, bg] of ITEMS) {
  const p = await b.newPage();
  await p.setViewport({ width: 1200, height: 630 });
  await p.setContent(`<!doctype html><html><head><style>
@font-face{font-family:IS;src:url(${font('instrument-sans-latin.woff2')}) format('woff2');font-weight:400 500}
@font-face{font-family:IS;src:url(${font('instrument-sans-latin-ext.woff2')}) format('woff2');font-weight:400 500;unicode-range:U+0100-024F}
@font-face{font-family:GM;src:url(${font('geist-mono-latin.woff2')}) format('woff2');font-weight:300 400}
@font-face{font-family:GM;src:url(${font('geist-mono-latin-ext.woff2')}) format('woff2');font-weight:300 400;unicode-range:U+0100-024F}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:${bg};color:#fff;font-family:IS;position:relative;overflow:hidden}
canvas{position:absolute;inset:0}
.top{position:absolute;left:64px;top:56px;display:flex;align-items:center;gap:16px;font-weight:500;font-size:30px}
.top svg{width:48px;height:48px}
.foot{position:absolute;left:64px;right:330px;bottom:64px;display:flex;flex-direction:column;align-items:flex-start;gap:22px}
.cat{font:400 22px GM;color:#7CF2C6;border:1px solid rgba(255,255,255,.35);padding:6px 14px;border-radius:999px}
h1{font-weight:500;font-size:58px;line-height:1.02;letter-spacing:-.025em}
.url{position:absolute;right:64px;bottom:64px;font:300 22px GM;color:rgba(255,255,255,.75)}
</style></head><body><canvas id="c" width="1200" height="630"></canvas>
<div class="top">${logo.replace('<svg ', '<svg aria-hidden="true" ')}Aylin İnci</div><div class="url">aylininci.com/blog</div>
<div class="foot"><span class="cat">${cat}</span><h1>${title}</h1></div>
<script>
const c=document.getElementById('c').getContext('2d');let h=2166136261;for(const ch of '${slug}'){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}
const r=()=>{h=Math.imul(h^(h>>>15),2246822507);h=Math.imul(h^(h>>>13),3266489909);h^=h>>>16;return (h>>>0)/4294967296;};
const g=c.createRadialGradient(985,265,0,985,265,300);g.addColorStop(0,'rgba(1,4,25,.55)');g.addColorStop(1,'rgba(1,4,25,0)');c.fillStyle=g;c.fillRect(0,0,1200,630);
const C=[985,265];const hubs=[];for(let i=0;i<4;i++){const a=i/4*6.283+r()*.6,d=80+r()*55;hubs.push([C[0]+Math.cos(a)*d*1.15,C[1]+Math.sin(a)*d*.8]);}
c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1.2;for(const p of hubs){c.beginPath();c.moveTo(...C);c.lineTo(...p);c.stroke();
for(let j=0;j<6;j++){const a=r()*6.283,d=22+r()*34,q=[p[0]+Math.cos(a)*d,p[1]+Math.sin(a)*d];c.strokeStyle='rgba(150,180,255,.4)';c.beginPath();c.moveTo(...p);c.lineTo(...q);c.stroke();
if(r()<.3){c.fillStyle='#010419';c.fillRect(q[0]-11,q[1]-8,22,16);c.strokeStyle='rgba(255,255,255,.8)';c.strokeRect(q[0]-11,q[1]-8,22,16);c.fillStyle='#fff';c.fillRect(q[0]-7,q[1]-4,9,8);c.fillRect(q[0]+4,q[1]-4,4,4);}else{c.fillStyle='rgba(210,225,255,.95)';c.beginPath();c.arc(q[0],q[1],3,0,6.283);c.fill();}}
c.fillStyle='#6084FF';c.fillRect(p[0]-6,p[1]-6,12,12);}
c.strokeStyle='#fff';c.beginPath();c.arc(...C,9,0,6.283);c.stroke();c.fillStyle='#7CF2C6';c.fillRect(C[0]-3,C[1]-3,6,6);
c.fillStyle='rgba(255,255,255,.3)';for(let i=0;i<120;i++)c.fillRect(r()*1200,r()*630,r()<.85?1.5:2.5,r()<.85?1.5:2.5);
</script></body></html>`, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 300));
  const fit = await p.evaluate(() => { const h = document.querySelector('h1').getBoundingClientRect(), c = document.querySelector('.cat').getBoundingClientRect(); return h.top > c.bottom + 10; });
  await p.screenshot({ path: `og/${slug}-og.jpg`, type: 'jpeg', quality: 86 });
  console.log(slug, 'title clear of label:', fit, Math.round(fs.statSync(`og/${slug}-og.jpg`).size / 1024) + 'KB');
  await p.close();
}
await b.close();
