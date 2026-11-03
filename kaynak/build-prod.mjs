// Builds the live site files from the approved draft.
// Keeps each live page's SEO head (title, description, canonical, hreflang, Open Graph, JSON-LD) and swaps in the new body.
import fs from 'node:fs';
import path from 'node:path';
import { rewriteText } from './rewrites.mjs';

const SITE = '../site';
const TODAY = '2026-11-03';
const FONTS = fs.readFileSync('../fonts/fonts.css', 'utf8').trim();
const live = (p) => fs.readFileSync(path.join('live-src', p), 'utf8').replace(/\r\n/g, '\n');
const draft = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const out = (p, s) => { const f = path.join(SITE, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };

// Only the SEO part of a live head survives: no old styles, scripts, fonts or theme colours
function seoHead(html, slug) {
  let h = html.match(/<head>([\s\S]*?)<\/head>/)[1];
  // JSON-LD may quote tags like <script> in its text, so it is set aside before the head is cleaned
  const ld = [];
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, (m) => `@@LD${ld.push(m) - 1}@@`);
  h = h.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<meta charset[^>]*>|<meta name="viewport"[^>]*>|<meta name="theme-color"[^>]*>/gi, '')
    .replace(/<link rel="(stylesheet|preload|preconnect)"[^>]*>/g, '')
    .replace(/<script(?![^>]*ld\+json)[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/@@LD(\d+)@@/g, (m, i) => ld[+i])
    // the photo is no longer on the site
    .replace(/,?\s*"image":\s*"https:\/\/aylininci\.com\/aylin-inci[^"]*"/g, '');
  if (slug) h = rewriteText(slug, h).replace(/"dateModified":\s*"[^"]*"/, `"dateModified": "${TODAY}"`);
  return h.split('\n').map((l) => l.trimEnd()).filter((l) => l.trim()).join('\n');
}
const page = (lang, htmlAttr, head, bg, css, body) => `<!DOCTYPE html>
<html lang="${lang}"${htmlAttr}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${head}
<meta name="theme-color" content="${bg}">
<link rel="preload" href="/assets/fonts/instrument-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>
${FONTS}
${css}
</style>
</head>
<body>
${body.trim()}
</body>
</html>
`;
// FAQPage structured data always matches the questions and answers shown on the page
const text = (s) => s.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
function faqFromPage(head, body) {
  const qa = [...body.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map((m) => [text(m[1]), text(m[2])]);
  const block = /<script type="application\/ld\+json">\s*\{\s*"@context": "https:\/\/schema\.org",\s*"@type": "FAQPage"[\s\S]*?<\/script>/;
  if (!qa.length) return head.replace(block, '');
  const json = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }, null, 2);
  const tag = '<script type="application/ld+json">\n' + json + '\n</script>';
  return block.test(head) ? head.replace(block, () => tag) : head + '\n' + tag;
}
const noDraftMark =(s) => s.replace(/<small>Taslak<\/small>/g, '');
const cv = (s) => s.split('https://aylininci.com/Aylin_Inci_CV_TR.pdf').join('/Aylin_Inci_CV_TR.pdf');

// Home
const home = draft('draft-home.html');
const homeCss = home.match(/<style>([\s\S]*?)<\/style>/)[1].trim();
let homeBody = home.slice(home.indexOf('</style>') + 8);
homeBody = cv(noDraftMark(homeBody))
  .replace(/href="yazi\/([a-z0-9-]+)\.html"/g, 'href="/blog/$1"')
  .replace(/"u":"yazi\/([a-z0-9-]+)\.html"/g, '"u":"/blog/$1"')
  .replace(/href="blog\.html"/g, 'href="/blog/"')
  .replace(/src="img\//g, 'src="/assets/img/');
out('index.html', page('tr', '', seoHead(live('index.html')), '#051DAA', homeCss, homeBody));

// Blog pages: draft body, live SEO head
const blogLinks = (s) => cv(noDraftMark(s))
  .replace(/href="\.\.\/blog\.html"/g, 'href="/blog/"')
  .replace(/href="blog\.html"/g, 'href="/blog/"')
  .replace(/href="\.\.\/(#[^"]*)?"/g, 'href="/$1"')
  .replace(/href="\.\/(#[^"]*)?"/g, 'href="/$1"')
  .replace(/href="yazi\/([a-z0-9-]+)\.html"/g, 'href="/blog/$1"')
  .replace(/href="([a-z0-9-]+)\.html(#[^"]*)?"/g, 'href="/blog/$1$2"')
  .replace(/"href":"yazi\/([a-z0-9-]+)\.html"/g, '"href":"/blog/$1"');
function blogPage(draftFile, liveFile, slug) {
  const d = draft(draftFile);
  const attr = (d.match(/<html lang="tr"([^>]*)>/) || [])[1] || '';
  const css = d.match(/<style>([\s\S]*?)<\/style>/)[1].trim();
  const bg = (attr.match(/--page:(#[0-9A-Fa-f]{6})/) || [])[1] || '#0B1B5E';
  const body = blogLinks(d.slice(d.indexOf('<body>') + 6, d.lastIndexOf('</body>')));
  return page('tr', attr, faqFromPage(seoHead(live(liveFile), slug), body), bg, css, body);
}
out('blog/index.html', blogPage('../prev/blog.html', 'blog/index.html'));
const slugs = fs.readdirSync('../prev/yazi').filter((f) => f.endsWith('.html')).map((f) => f.replace('.html', ''));
for (const s of slugs) out(`blog/${s}.html`, blogPage(`../prev/yazi/${s}.html`, `blog/${s}.html`, s));

// Fonts and images
for (const f of fs.readdirSync('../fonts').filter((x) => x.endsWith('.woff2'))) fs.copyFileSync(`../fonts/${f}`, path.join(SITE, 'assets/fonts', f));
fs.mkdirSync(path.join(SITE, 'assets/img'), { recursive: true });
for (const f of fs.readdirSync('../prev/img').filter((x) => /^(bolum-|kart-uzmanlik)/.test(x))) fs.copyFileSync(`../prev/img/${f}`, path.join(SITE, 'assets/img', f));

// Sitemap: new dates for the redesigned pages, no images that are no longer on them
let map = fs.readFileSync(path.join(SITE, 'sitemap.xml'), 'utf8');
map = map.replace(/\s*<image:image>[\s\S]*?<\/image:image>/g, '')
  .replace(/(<loc>https:\/\/aylininci\.com\/(blog\/[^<]*)?<\/loc>[\s\S]*?<lastmod>)[^<]*(<\/lastmod>)/g, `$1${TODAY}$3`);
fs.writeFileSync(path.join(SITE, 'sitemap.xml'), map);
console.log('built: index, blog/index,', slugs.length, 'posts');
