import fs from 'node:fs';
const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (!s.includes(a)) throw new Error(file + ' not found: ' + a.slice(0, 80)); s = s.split(a).join(b); }
  fs.writeFileSync(file, s);
};

// 1) Blog build: only posts dated up to PUBLISH_UNTIL go out; summaries for the new posts
edit('build-blog.mjs', [
  ["const posts = fs.readdirSync(SRC)", "// posts dated after PUBLISH_UNTIL stay out, and so do links pointing to them\nconst UNTIL = process.env.PUBLISH_UNTIL || '9999-12-31';\nconst dateOf = (f) => (fs.readFileSync(path.join(SRC, f), 'utf8').match(/\"datePublished\":\\s*\"([^\"]+)\"/) || [])[1] || '';\nsetPublished(fs.readdirSync(SRC).filter((f) => f.endsWith('.html') && f !== 'index.html' && dateOf(f) <= UNTIL).map((f) => f.replace(/\\.html$/, '')));\nfor (const o of OUTS) fs.rmSync(path.join(o, 'yazi'), { recursive: true, force: true });\nconst posts = fs.readdirSync(SRC)"],
  ["}).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'tr'));", "}).filter((p) => p.date <= UNTIL).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'tr'));"],
  ["import { rewrite } from './rewrites.mjs';", "import { rewrite, setPublished } from './rewrites.mjs';"],
  ['  "yapay-zeka-arama-icin-icerik-yapisi": ', `  "shopify-fall-26-edition": "Shopify'ın ilk sonbahar sürümü ajanlarla alışverişi öne çıkarıyor. Ürün verisi, işletme bilgileri ve mağaza tarafında önce kontrol edilecekler.",\n  "robots-txt-yapay-zeka-egitimi": "Google'ın 2027'de desteklemeyi planladığı ortak yapay zeka eğitim sinyali ve robots.txt'de eğitim ile aramayı ayırmanın yolu.",\n  "yapay-zeka-arama-icin-icerik-yapisi": `],
]);
// the summaries are read before posts are parsed, so setPublished must run before rewrite(); move the rewrite call after filtering

// 2) Links from older posts to the new ones appear only once the new post is out
edit('rewrites.mjs', [
  ["export function rewrite(slug, html, missing) {\n  for (const [a, b] of BY[slug] || []) {\n    if (!html.includes(a)) { missing.push(slug + ': ' + a.slice(0, 60)); continue; }",
   "let PUBLISHED = null;\nexport const setPublished = (list) => { PUBLISHED = new Set(list); };\nconst live = (needs) => !needs || !PUBLISHED || PUBLISHED.has(needs);\nexport function rewrite(slug, html, missing) {\n  for (const [a, b, needs] of BY[slug] || []) {\n    if (!live(needs)) continue;\n    if (!html.includes(a)) { missing.push(slug + ': ' + a.slice(0, 60)); continue; }"],
  ["  for (const [a, b] of BY[slug] || []) s = s.split(a).join(b);", "  for (const [a, b, needs] of BY[slug] || []) if (live(needs)) s = s.split(a).join(b);"],
  ["    ['robots.txt üzerinden AI botlarını engellemeli miyim?', 'AI botları robots.txt üzerinden engellenmeli mi?'],",
   "    ['robots.txt üzerinden AI botlarını engellemeli miyim?', 'AI botları robots.txt üzerinden engellenmeli mi?'],\n    ['rekabetçi/özel içerik söz konusuysa engellemek daha mantıklı olabilir.', 'rekabetçi/özel içerik söz konusuysa engellemek daha mantıklı olabilir. Ekim 2026\\'da duyurulan ortak eğitim sinyali için <a href=\"/blog/robots-txt-yapay-zeka-egitimi\">robots.txt ile yapay zeka eğitimini kontrol etmek</a> yazısına bakabilirsiniz.', 'robots-txt-yapay-zeka-egitimi'],"],
  ["    ['Tıklamalarım düştü; içeriği AI özetlerinden çıkarmalı mıyım?', 'Tıklamalar düştüyse içerik AI özetlerinden çıkarılmalı mı?'],",
   "    ['Tıklamalarım düştü; içeriği AI özetlerinden çıkarmalı mıyım?', 'Tıklamalar düştüyse içerik AI özetlerinden çıkarılmalı mı?'],\n    ['görünürken tıklanmaya değer olmaktır.', 'görünürken tıklanmaya değer olmaktır. Yapay zeka eğitimi için robots.txt\\'de önerilen yeni ortak sinyal <a href=\"/blog/robots-txt-yapay-zeka-egitimi\">robots.txt ile yapay zeka eğitimini kontrol etmek</a> yazısında anlatılıyor.', 'robots-txt-yapay-zeka-egitimi'],"],
  ["    ['Ürünlerimin AI asistanları tarafından önerilmesi için ne yapmalıyım?', 'Ürünlerin AI asistanları tarafından önerilmesi için ne yapılmalı?'],",
   "    ['Ürünlerimin AI asistanları tarafından önerilmesi için ne yapmalıyım?', 'Ürünlerin AI asistanları tarafından önerilmesi için ne yapılmalı?'],\n    ['kanal genişlediğinde hazır olmayı sağlayan bir hazırlık.', 'kanal genişlediğinde hazır olmayı sağlayan bir hazırlık. Kanalın Ekim 2026 sonundaki genişlemesi <a href=\"/blog/shopify-fall-26-edition\">Shopify Fall \\'26 Edition</a> yazısında anlatılıyor.', 'shopify-fall-26-edition'],"],
]);

// 3) English home: English titles for the new posts
edit('build-taslak-en.mjs', [
  ["const EN = {\n", "const EN = {\n  'shopify-fall-26-edition': [\"Shopify Fall '26 Edition: what changed for stores\", 'AI shopping agents, business details sent to AI channels, product data by channel and what to check first in your store.'],\n  'robots-txt-yapay-zeka-egitimi': ['Controlling AI training with robots.txt', \"The shared AI training signal Google plans to support in 2027, how it relates to Google-Extended, and robots.txt settings.\"],\n"],
]);

// 4) Live build: new posts in the sitemap and llms.txt
edit('build-prod.mjs', [
  ["fs.writeFileSync(path.join(SITE, 'sitemap.xml'), map);", `for (const s of slugs) {
  const loc = \`https://aylininci.com/blog/\${s}\`;
  if (!map.includes(\`<loc>\${loc}</loc>\`)) map = map.replace('</urlset>', \`  <url>\\n    <loc>\${loc}</loc>\\n    <lastmod>\${TODAY}</lastmod>\\n    <changefreq>yearly</changefreq>\\n    <priority>0.8</priority>\\n  </url>\\n</urlset>\`);
}
fs.writeFileSync(path.join(SITE, 'sitemap.xml'), map);
// llms.txt: newest posts first in the blog list
const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
let llms = fs.readFileSync(path.join(SITE, 'llms.txt'), 'utf8').replace(/\\r\\n/g, '\\n');
for (const p of posts.slice().reverse()) {
  const u = \`https://aylininci.com/blog/\${p.slug}\`;
  if (!llms.includes(\`(\${u})\`)) llms = llms.replace('## Blog\\n', \`## Blog\\n- [\${p.title}](\${u}): \${p.desc}\\n\`);
}
fs.writeFileSync(path.join(SITE, 'llms.txt'), llms);`],
]);
console.log('ok');
