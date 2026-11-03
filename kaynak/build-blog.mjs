// Builds the draft blog archive and post pages from the live posts in ../site/blog.
import fs from 'node:fs';
import path from 'node:path';
import { rewrite } from './rewrites.mjs';
const MISSING = [];

const SRC = 'live-src/blog';
const OUTS = ['../prev'];
const LIVE = 'https://aylininci.com';
const BASE = '#0B1B5E';
const CATS = { 'GEO': '#2A0FA8', 'Teknik SEO': '#051DAA', 'İçerik Stratejisi': '#4A0B7A', 'Shopify': '#0A5A3C', 'Analitik': '#6A1045' };
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const CSS = fs.readFileSync('blog.css', 'utf8');
const SUM = {
  "chatgpt-trafigi-ga4-olcumu": "ChatGPT'den gelen ziyaretler Ekim 2026'da GA4'te Direct olarak görünmeye başladı. Bu trafiğin ayırt edilmesi ve ayrı bir kanalda izlenmesi.",
  "google-eylul-2026-spam-guncellemesi": "Eylül 2026 spam güncellemesi 13 gün sürdü. Bir sitenin etkilenip etkilenmediğini anlamak için bakılacak yerler.",
  "shopify-gecisi-seo-rehberi": "Başka bir altyapıdan Shopify'a geçerken organik trafiği korumak için URL listesiyle başlayan bir kontrol listesi.",
  "yapay-zeka-icerik-google-seo": "Google Ekim 2026'da içerik rehberini güncelledi. Yapay zekayla yazılan metinler için değişenler.",
  "google-ai-modu-seo": "AI Modu Türkiye'de açıldı ve birçok sitede tıklamalar azaldı. Etkiyi Search Console'daki yeni raporla ölçmenin yolu.",
  "shopify-agentic-storefronts-chatgpt": "Shopify mağazaları artık ChatGPT ve Copilot üzerinden de satış yapabiliyor. Türkiye'deki mağazalar için durum ve ürün verisinin hazırlanması.",
  "anahtar-kelime-kanibalizasyonu-analizi": "Aynı sorguda birbiriyle yarışan sayfaları Search Console'da bulmak ve hangisinin kalacağına karar vermek.",
  "core-web-vitals-performans-optimizasyonu": "PageSpeed skoru ile gerçek kullanıcı verisi aynı şey değil. LCP, INP ve CLS'i sahada iyileştiren adımlar.",
  "shopify-liquid-performans-optimizasyonu": "Temaya eklenen her section ve uygulama sayfayı biraz yavaşlatır. Bunu önleyen pratik alışkanlıklar.",
  "yapay-zeka-arama-icin-icerik-yapisi": "ChatGPT ve Google AI Overviews kaynak seçerken klasik aramadan farklı davranıyor. İçeriği bu sistemlerin daha kolay anlayacağı biçimde düzenlemek."
};
const JS = fs.readFileSync('blog.js', 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const slugify = (s) => decode(s).toLocaleLowerCase('tr').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const pick = (s, re) => { const m = s.match(re); return m ? m[1].trim() : ''; };
const dateTr = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const pad = (n) => String(n).padStart(2, '0');

const posts = fs.readdirSync(SRC).filter((f) => f.endsWith('.html') && f !== 'index.html').map((f) => {
  const html = fs.readFileSync(path.join(SRC, f), 'utf8').replace(/\r\n/g, '\n');
  const slug = f.replace(/\.html$/, '');
  const title = strip(pick(html, /<h1>([\s\S]*?)<\/h1>/));
  const cat = strip(pick(html, /<span class="eyebrow"[^>]*>([^<]*)</));
  const date = pick(html, /"datePublished":\s*"([^"]+)"/);
  const rt = pick(html, /(\d+) dakika okuma/);
  // lead and body are edited together so each rewrite is checked once per post
  const [lead, content] = rewrite(slug, pick(html, /<p class="lead">([\s\S]*?)<\/p>/) + '\u0000' + pick(html, /<div class="content wrap">([\s\S]*?)<div class="author-box">/), MISSING).split('\u0000');
  const desc = decode(pick(html, /<meta name="description" content="([^"]*)"/));
  const author = strip(pick(html, /<div class="author-box">[\s\S]*?<span>([\s\S]*?)<a /));
  const related = [...pick(html, /<div class="related-list">([\s\S]*?)<\/div>/).matchAll(/href="\/blog\/([^"]+)"/g)].map((m) => m[1]);
  if (!title || !cat || !date || !content) throw new Error('parse ' + f);
  if (!SUM[slug]) throw new Error('summary missing: ' + slug);
  return { slug, title, cat, date, rt, lead, desc, sum: SUM[slug], content, author, related, bg: CATS[cat] || BASE };
}).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'tr'));

const head = (title, desc, bg) => `<!doctype html>
<html lang="tr" style="--page:${bg}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500&family=Geist+Mono:wght@300;400&display=swap">
<style>${CSS}</style>
</head>
<body>
<canvas id="sky" aria-hidden="true"></canvas>`;
const top = (home, blog) => `<header class="top"><a class="brand" href="${home}">Aylin İnci<small>Taslak</small></a><nav class="top-links" aria-label="Ana menü"><a href="${home}#hakkimda">Hakkımda</a><a href="${blog}" aria-current="page">Yazılar</a><a href="${home}#iletisim">İletişim</a><a href="/en/" lang="en" hreflang="en">EN</a><a class="cta" href="${LIVE}/Aylin_Inci_CV_TR.pdf" target="_blank" rel="noopener">Özgeçmiş</a></nav></header>`;
const foot = (home, blog) => `<footer class="foot"><span>© 2026 Aylin İnci</span><span><a href="${home}">Anasayfa</a> · <a href="${blog}">Yazılar</a> · <a href="https://www.linkedin.com/in/aylin-inci/" target="_blank" rel="noopener">LinkedIn</a></span><span><a href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</a> · <a href="/cerez-politikasi">Çerez Politikası</a> · <a href="/gizlilik-politikasi">Gizlilik Politikası</a></span></footer>`;
const script = (data) => `<script>${JS.replace('/*DATA*/{}', () => JSON.stringify(data))}</script>\n</body>\n</html>\n`;
const write = (rel, html) => { for (const o of OUTS) { const f = path.join(o, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); } };

// archive
const cats = Object.keys(CATS).filter((k) => posts.some((p) => p.cat === k)).map((k) => ({ name: k, bg: CATS[k] }));
const [lead, ...rest] = posts;
const archive = head('Yazılar | Aylin İnci', 'SEO, GEO, Shopify ve analitik üzerine yazılar.', BASE) + top('./', 'blog.html') + `
<main>
<section class="ahero">
  <div class="ahero-text">
    <div><nav class="crumbs" aria-label="Sayfa yolu"><a href="./">Anasayfa</a><span>/</span><span>Yazılar</span></nav><h1 data-split>Yazılar</h1></div>
    <p>SEO, GEO, Shopify ve ölçümleme üzerine yazılar.</p>
    <div class="filters" role="group" aria-label="Kategoriye göre süz"><button type="button" class="chip" aria-pressed="true" data-cat="">Tümü<span>${posts.length}</span></button>${cats.map((k) => `<button type="button" class="chip" aria-pressed="false" data-cat="${esc(k.name)}"${k.name === 'Shopify' ? ' lang="en"' : ''}>${esc(k.name === 'İçerik Stratejisi' ? 'İçerik' : k.name)}<span>${posts.filter((p) => p.cat === k.name).length}</span></button>`).join('')}</div>
  </div>
  <div class="amap"><canvas id="amap" role="img" aria-label="Yazıların kategorilere göre bağlantı haritası"></canvas><p class="hint">Bir noktaya tıklayın</p></div>
</section>
<div class="wrap">
  <a class="lead-post rise" href="yazi/${lead.slug}.html">
    <div class="txt">
      <div class="meta"><span>Son yazı</span><span>${esc(lead.cat)}</span><time datetime="${lead.date}">${dateTr(lead.date)}</time></div>
      <h2>${esc(lead.title)}</h2>
      <p>${esc(lead.sum)}</p>
      <div class="meta"><span>${lead.rt} dakika okuma</span><span>Oku →</span></div>
    </div>
    <div class="art"><canvas id="leadArt" aria-hidden="true"></canvas></div>
  </a>
  <div class="sec-title rise"><h2>Tüm yazılar</h2><span class="mono">${posts.length}</span></div>
  <ol class="list">${posts.map((p, i) => `
    <li class="row rise" data-cat="${esc(p.cat)}" data-i="${i}" style="--d:${i}"><a href="yazi/${p.slug}.html"><span class="n">${pad(i + 1)}</span><time datetime="${p.date}">${p.date.split('-').reverse().join('.')}</time><h3>${esc(p.title)}</h3><span class="cat">${esc(p.cat)}</span><span class="rt">${p.rt} dk</span><span class="go" aria-hidden="true">→</span></a></li>`).join('')}
  </ol>
</div>
<div class="peek" id="peek" aria-hidden="true"><canvas></canvas></div>
</main>
` + foot('./', 'blog.html') + script({ page: 'archive', base: BASE, cats, posts: posts.map((p) => ({ slug: p.slug, title: p.title, cat: p.cat, bg: p.bg, href: `yazi/${p.slug}.html` })) });
write('blog.html', archive);

// posts
posts.forEach((p, idx) => {
  let c = p.content.replace(/\sstyle="[^"]*"/g, '');
  // older posts list their FAQ items without an "SSS" heading
  let faqAt = c.search(/<h2>Sık sorulan sorular<\/h2>/);
  if (faqAt < 0) faqAt = c.search(/<div class="faq-item">/);
  const faqSrc = faqAt >= 0 ? c.slice(faqAt) : '';
  if (faqAt >= 0) c = c.slice(0, faqAt);
  c = c.replace(/href="\/blog\/([a-z0-9-]+)"/g, 'href="$1.html"').replace(/href="\/blog\/"/g, 'href="../blog.html"').replace(/href="\/"/g, 'href="../"');
  c = c.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="table"><table>$1</table></div>');
  const sections = []; const refs = []; let sec = -1, k = 0;
  c = c.replace(/<h2>([\s\S]*?)<\/h2>|<a href="(https?:\/\/[^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (all, h, href, attrs, text) => {
    if (h !== undefined) {
      sec++; const t = strip(h).replace(/^\d+\.\s*/, ''); const id = slugify(t) || 'b' + sec;
      sections.push({ id, t, short: t.length > 26 ? t.slice(0, 25).trim() + '…' : t });
      return `<h2 id="${id}"><span class="no">${pad(sec + 1)}</span><span>${t}</span></h2>`;
    }
    k++; refs.push({ n: k, href, host: new URL(href).hostname.replace(/^www\./, ''), s: Math.max(sec, 0) });
    return `<a href="${href}" target="_blank" rel="noopener">${text}</a><a class="ref" href="#ref-${k}" aria-label="Kaynak ${k}">${k}</a>`;
  });
  // section weight for the map: how much each part holds
  const parts = c.split(/<h2 /).slice(1);
  sections.forEach((s, i) => { const x = parts[i] || ''; s.n = Math.max(2, Math.min(7, (x.match(/<(p|li|tr)\b/g) || []).length >> 1)); });
  const faqs = [...faqSrc.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)].map((m) => [m[1].trim(), m[2].trim()]);
  if (faqs.length) sections.push({ id: 'sss', t: 'Sık sorulan sorular', short: 'Sık sorulan sorular', n: faqs.length });
  const prev = posts[idx + 1], next = posts[idx - 1];
  const rel = p.related.map((s) => posts.find((q) => q.slug === s)).filter(Boolean).slice(0, 4);
  const html = head(`${p.title} | Aylin İnci`, p.desc, p.bg) + top('../', '../blog.html') + `
<div class="progress" id="bar" aria-hidden="true"></div>
<canvas id="wires" aria-hidden="true"></canvas>
<main>
<article>
  <header class="phero">
    <div class="phero-text">
      <div><nav class="crumbs" aria-label="Sayfa yolu"><a href="../">Anasayfa</a><span>/</span><a href="../blog.html">Yazılar</a><span>/</span><span${p.cat === 'Shopify' ? ' lang="en"' : ''}>${esc(p.cat)}</span></nav><h1 data-split>${esc(p.title)}</h1></div>
      <p class="lede">${p.lead}</p>
      <div class="meta"><span>Aylin İnci</span><time datetime="${p.date}">${dateTr(p.date)}</time><span>${p.rt} dakika okuma</span><span>${sections.length} bölüm</span></div>
    </div>
    <div class="pmap"><canvas id="pmap" role="img" aria-label="Yazının bölüm haritası"></canvas><p class="hint">Bölüme gitmek için bir noktaya tıklayın</p></div>
  </header>
  <div class="read">
    <nav class="toc" aria-label="İçindekiler"><b>İçindekiler</b><ol>${sections.map((s) => `<li><a href="#${s.id}">${esc(s.t)}</a></li>`).join('')}</ol></nav>
    <div class="body">
${c.trim()}
${faqs.length ? `<section class="faq"><h2 id="sss"><span class="no">${pad(sections.length)}</span><span>Sık sorulan sorular</span></h2>${faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</section>` : ''}
${refs.length ? `<section class="srcs" aria-label="Kaynaklar"><h3>Kaynaklar</h3><ol>${refs.map((r) => `<li id="ref-${r.n}"><a href="${r.href}" target="_blank" rel="noopener">${r.host}</a></li>`).join('')}</ol></section>` : ''}
      <div class="byline"><span class="mono-av" aria-hidden="true">Aİ</span><div><strong>Aylin İnci</strong><p>SEO, GEO ve web geliştirme üzerine çalışıyor. <a href="https://www.linkedin.com/in/aylin-inci/" target="_blank" rel="noopener">LinkedIn</a></p></div></div>
    </div>
    <aside class="notes" aria-label="Kaynaklar"><b>Kaynaklar</b>${refs.length ? `<ol>${refs.map((r) => `<li data-s="${r.s}"><span>[${r.n}]</span><a href="${r.href}" target="_blank" rel="noopener">${r.host}</a></li>`).join('')}</ol>` : '<p class="none">Bu yazıda dış kaynak bağlantısı yok.</p>'}</aside>
  </div>
</article>
<nav class="next" aria-label="Diğer yazılar">${prev ? `<a href="${prev.slug}.html"><span class="mono">← Önceki yazı</span><strong>${esc(prev.title)}</strong></a>` : '<span></span>'}${next ? `<a href="${next.slug}.html"><span class="mono">Sonraki yazı →</span><strong>${esc(next.title)}</strong></a>` : '<span></span>'}</nav>
${rel.length ? `<section class="related"><div class="sec-title rise"><h2>İlgili yazılar</h2><a class="chip" href="../blog.html">Tüm yazılar</a></div><div class="rel">${rel.map((q, i) => `<a class="rise" style="--d:${i}" href="${q.slug}.html"><div class="art"><canvas data-slug="${q.slug}" data-bg="${q.bg}" aria-hidden="true"></canvas></div><div class="t"><span class="mono">${esc(q.cat)} · ${q.rt} dk</span><strong>${esc(q.title)}</strong></div></a>`).join('')}</div></section>` : ''}
</main>
` + foot('../', '../blog.html') + script({ page: 'post', slug: p.slug, sections: sections.map((s) => ({ id: s.id, short: s.short, n: s.n })) });
  write(`yazi/${p.slug}.html`, html);
});
fs.writeFileSync('posts.json', JSON.stringify(posts.map((p) => ({ slug: p.slug, title: p.title, cat: p.cat, date: p.date, rt: p.rt, desc: p.sum, bg: p.bg }))));
if (MISSING.length) { console.log('NOT APPLIED', MISSING); process.exitCode = 1; }
console.log('posts', posts.map((p) => `${p.date} ${p.cat} ${p.slug}`).join('\n'));
