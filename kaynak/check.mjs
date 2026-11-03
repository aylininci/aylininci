import fs from 'node:fs'; import path from 'node:path'; import { JSDOM } from 'jsdom';
const S = path.resolve('../site');
const pages = ['404.html','index.html','en/index.html','blog/index.html',...fs.readdirSync(S+'/blog').filter(f=>f.endsWith('.html')&&f!=='index.html').map(f=>'blog/'+f),'cerez-politikasi.html','gizlilik-politikasi.html','kvkk-aydinlatma-metni.html'];
let bad = 0;
for (const p of pages) {
  const d = new JSDOM(fs.readFileSync(path.join(S,p),'utf8')).window.document;
  for (const s of d.querySelectorAll('script[type="application/ld+json"]')) { try { JSON.parse(s.textContent); } catch (e) { bad++; console.log('BAD JSON-LD', p, e.message); } }
  const refs = [...d.querySelectorAll('[href],[src]')].map(e => e.getAttribute('href') ?? e.getAttribute('src'));
  for (let r of refs) {
    if (/^(https?:|mailto:|#|data:)/.test(r)) { if (r.startsWith('https://aylininci.com/')) r = '/' + r.slice('https://aylininci.com/'.length); else continue; }
    r = r.split('#')[0]; if (!r) continue;
    let f = r.startsWith('/') ? path.join(S, r) : path.join(S, path.dirname(p), r);
    if (r.endsWith('/')) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) && !fs.existsSync(f + '.html')) { bad++; console.log('BROKEN', p, '->', r); }
  }
  const h1 = d.querySelectorAll('h1').length;
  console.log(p.padEnd(52), 'h1:'+h1, '| title', d.title.length, '| desc', d.querySelector('meta[name=description]')?.content.length, '| canon', d.querySelector('link[rel=canonical]')?.href.replace('https://aylininci.com',''), '| hreflang', d.querySelectorAll('link[hreflang]').length);
}
console.log(bad ? bad + ' problems' : 'all links + JSON-LD OK');
