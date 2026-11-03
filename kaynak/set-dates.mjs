// Spreads the post dates to two a week (Tuesday and Friday), never before an event a post describes.
import fs from 'node:fs';
const DATES = {
  'core-web-vitals-performans-optimizasyonu': '2026-09-22',
  'shopify-liquid-performans-optimizasyonu': '2026-09-25',
  'anahtar-kelime-kanibalizasyonu-analizi': '2026-09-29',
  'yapay-zeka-arama-icin-icerik-yapisi': '2026-10-02',
  'google-ai-modu-seo': '2026-10-06', // mentions the report opening to all sites on 31 August
  'shopify-agentic-storefronts-chatgpt': '2026-10-09',
  'yapay-zeka-icerik-google-seo': '2026-10-13', // Google's updates in the first week of October
  'shopify-gecisi-seo-rehberi': '2026-10-16',
  'chatgpt-trafigi-ga4-olcumu': '2026-10-20', // the drop recovered on 15 October
  'google-eylul-2026-spam-guncellemesi': '2026-10-23', // says "as of 23 October"
};
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const tr = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
for (const [slug, iso] of Object.entries(DATES)) {
  const f = `live-src/blog/${slug}.html`;
  let h = fs.readFileSync(f, 'utf8');
  const old = h.match(/"datePublished":\s*"([^"]+)"/)[1];
  const day = new Date(iso + 'T12:00:00Z').getUTCDay();
  if (day !== 2 && day !== 5) throw new Error(slug + ' is not a Tuesday or Friday');
  h = h.replace(/("datePublished":\s*")[^"]+"/g, `$1${iso}"`)
    .replace(/("dateModified":\s*")[^"]+"/g, `$1${iso}"`)
    .replace(/(<meta property="article:published_time" content=")[^"]+"/g, `$1${iso}"`)
    .split(`>\n        ${tr(old)}\n`).join(`>\n        ${tr(iso)}\n`);
  fs.writeFileSync(f, h);
  console.log(slug.padEnd(44), old, '→', iso, '|', (h.match(new RegExp(iso, 'g')) || []).length, 'places');
}
