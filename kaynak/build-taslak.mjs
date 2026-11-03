// Generates the redesign draft (static HTML) from the site's real content.
import fs from 'node:fs';
const OUT = '../site/redesign-taslak.html';
const LIVE = 'https://aylininci.com';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const XP = [
  { id: 'teknik-seo', name: 'Teknik SEO', short: 'Teknik SEO', bg: '#051DAA', title: 'Taranabilir, anlaşılır, hızlı',
    desc: 'Web sitelerinin arama motorları tarafından daha doğru taranması, anlaşılması ve indekslenmesi için teknik yapıların analiz edilmesi ve geliştirilmesi.',
    items: ['Tarama ve indeksleme sorunları', 'Canonical ve hreflang yapıları', 'Yönlendirme zincirleri ve 404 kontrolleri', 'Robots.txt ve sitemap incelemeleri', 'Site mimarisi ve URL yapıları', 'JavaScript kaynaklı SEO sorunları', 'Core Web Vitals ve sayfa performansı', 'Yapılandırılmış veri kontrolleri', 'Site taşıma planlaması'],
    tools: 'Screaming Frog, Google Search Console, Ahrefs, PageSpeed Insights', file: 'robots.txt',
    code: `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nSitemap: https://aylininci.com/sitemap.xml`,
    cta: ['Core Web Vitals rehberi', `${LIVE}/blog/core-web-vitals-performans-optimizasyonu`] },
  { id: 'geo', name: 'GEO ve Arama Görünürlüğü', short: 'GEO', bg: '#2A0FA8', title: 'Yapay zeka yanıtlarında doğru anlaşılmak',
    desc: 'Markaların yalnızca geleneksel arama sonuçlarında değil, yapay zeka destekli arama ve yanıt sistemlerinde de doğru şekilde anlaşılmasını destekleyen içerik ve teknik yapı çalışmaları.',
    items: ['Entity ve konu bütünlüğü', 'Açık ve doğrulanabilir içerik yapısı', 'Semantik içerik mimarisi', 'Soru ve yanıt odaklı içerik yapıları', 'Kaynaklandırma ve uzmanlık sinyalleri', 'Schema ve yapılandırılmış veri', 'Marka ve konu otoritesinin desteklenmesi', 'AI Overview ve üretken arama analizleri'],
    tools: 'Google Search Console, Ahrefs, Schema', file: 'query-fan-out.txt',
    code: `soru: "küçük e-ticaret için hangi altyapı?"\n ├─ shopify maliyeti\n ├─ woocommerce karşılaştırma\n ├─ türkiye ödeme altyapısı\n └─ kaynak: en net cevabı veren sayfa`,
    cta: ['Google AI Modu yazısı', `${LIVE}/blog/google-ai-modu-seo`] },
  { id: 'icerik', name: 'İçerik SEO ve Strateji', short: 'İçerik', bg: '#4A0B7A', title: 'Niyete ve hedefe uygun içerik',
    desc: 'Arama niyetine, kullanıcı ihtiyacına ve web sitesinin ticari hedeflerine uygun içerik yapılarının planlanması.',
    items: ['Anahtar kelime ve rakip analizi', 'Arama niyeti sınıflandırması', 'İçerik planı ve konu kümeleri', 'Kategori ve ürün sayfası optimizasyonları', 'İç bağlantı stratejisi', 'İçerik briefleri', 'Kanibalizasyon analizi', 'Meta başlık ve açıklama optimizasyonları', 'Türkçe ve İngilizce içerik çalışmaları'],
    tools: 'Ahrefs, SEMrush, Google Search Console, Screaming Frog', file: 'icerik-brief.md',
    code: `sorgu:   anahtar kelime kanibalizasyonu\nniyet:   bilgi\nsayfa:   tek ana rehber\nbağlantı: 3 ilgili yazıdan iç link\nkontrol: Search Console, 28 gün`,
    cta: ['Yapay zeka içeriği yazısı', `${LIVE}/blog/yapay-zeka-icerik-google-seo`] },
  { id: 'shopify', name: 'Shopify ve Liquid Geliştirme', short: 'Shopify', bg: '#0A5A3C', lang: 'en', title: 'Tema, performans ve mağaza SEO’su',
    desc: 'Shopify mağazalarının teknik altyapı, tema yapısı, kullanıcı deneyimi ve SEO ihtiyaçları doğrultusunda geliştirilmesi.',
    items: ['Tema özelleştirmeleri', 'Liquid kod düzenlemeleri', 'Özel section ve block geliştirmeleri', 'Ürün ve koleksiyon sayfası düzenlemeleri', 'JSON template yapıları', 'Mobil uyumluluk geliştirmeleri', 'Site hızı ve görsel optimizasyonları', 'Çok dilli mağaza yapıları', 'Canonical ve indeksleme kontrolleri', 'GitHub üzerinden tema yönetimi', 'Teknik hata analizi ve çözümü'],
    tools: 'Shopify, Liquid, JSON, HTML, CSS, JavaScript, GitHub', file: 'sections/urun-kartlari.liquid',
    code: `{% for product in collection.products limit: 4 %}\n  {{ product.featured_image\n     | image_url: width: 800\n     | image_tag: loading: 'lazy' }}\n{% endfor %}`,
    cta: ['Shopify’a geçiş rehberi', `${LIVE}/blog/shopify-gecisi-seo-rehberi`] },
  { id: 'wordpress', name: 'WordPress ve Front-End Geliştirme', short: 'WordPress', bg: '#074B66', lang: 'en', title: 'Performans odaklı arayüzler',
    desc: 'Kurumsal web siteleri, landing page yapıları ve içerik odaklı projeler için kullanıcı deneyimi ve performans odaklı arayüz geliştirmeleri.',
    items: ['WordPress site düzenlemeleri', 'Elementor arayüz geliştirmeleri', 'Özel HTML ve CSS uygulamaları', 'JavaScript tabanlı etkileşimler', 'Mobil uyumluluk', 'Sayfa hızı optimizasyonları', 'Form ve yönlendirme yapıları', 'Tek sayfa ve kurumsal site tasarımları', 'SEO uyumlu sayfa yapıları', 'Tema ve eklenti kaynaklı hata çözümleri'],
    tools: 'WordPress, Elementor, HTML, CSS, JavaScript, PHP', file: 'style.css',
    code: `img {\n  max-width: 100%;\n  height: auto;\n}\n.hero-image { aspect-ratio: 3 / 2; }`,
    cta: ['İletişime geçin', '#iletisim'] },
  { id: 'veri', name: 'Veri Analizi ve Ölçümleme', short: 'Veri', bg: '#6A1045', title: 'Sıralamadan dönüşüme',
    desc: 'SEO ve web performansının yalnızca sıralamalarla değil, kullanıcı davranışı ve dönüşüm verileriyle birlikte değerlendirilmesi.',
    items: ['GA4 performans analizleri', 'Google Search Console raporları', 'Organik trafik ve görünürlük değerlendirmeleri', 'Dönüşüm takibi', 'Google Tag Manager kontrolleri', 'Landing page performansları', 'Kanal ve yönlendiren site analizleri', 'Yönetim ve müşteri raporları', 'Verilerin anlaşılır çıktılara dönüştürülmesi'],
    tools: 'GA4, GSC, GTM, Looker Studio, Excel', file: 'ga4-kanal-grubu.regex',
    code: `chatgpt\\.com|chat\\.openai\\.com|\nperplexity\\.ai|gemini\\.google\\.com|\ncopilot\\.microsoft\\.com|claude\\.ai`,
    cta: ['ChatGPT trafiğini ölçmek', `${LIVE}/blog/chatgpt-trafigi-ga4-olcumu`] },
  { id: 'otomasyon', name: 'Otomasyon ve Teknik Optimizasyon', short: 'Otomasyon', bg: '#6B3A08', title: 'Tekrarlayan işi kısaltmak',
    desc: 'Tekrarlayan veri işleme, raporlama ve içerik operasyonlarının daha kontrollü ve verimli hâle getirilmesi.',
    items: ['CSV ve Excel verilerinin işlenmesi', 'SEO verilerinin sınıflandırılması', 'Toplu yönlendirme kontrolleri', 'Görsel boyut ve dosya optimizasyonları', 'Raporlama otomasyonları', 'Veri temizleme ve düzenleme', 'Tekrarlayan iş akışlarının sadeleştirilmesi'],
    tools: 'Python, Pandas, OpenPyXL, ImageMagick, Pillow', file: 'yonlendirme_kontrol.py',
    code: `import pandas as pd\n\nurls = pd.read_csv("yonlendirmeler.csv")\nkirik = urls[urls["durum"] != 301]\nkirik.to_excel("kontrol.xlsx", index=False)`,
    cta: ['Araçları görün', '#araclar'] },
];
const STEPS = [
  ['Analiz', 'Web sitesinin teknik altyapısı, içerik yapısı, organik performansı ve kullanıcı deneyimi birlikte incelenir. Karar süreci varsayımlardan çok mevcut veriler, tarama sonuçları ve gerçek kullanıcı davranışları üzerinden şekillenir.'],
  ['Önceliklendirme', 'Bulgular olası etkilerine, uygulama gereksinimlerine ve iş hedeflerine göre sınıflandırılır. Kritik teknik sorunlar öncelikli olarak ele alınır.'],
  ['Uygulama', 'Teknik düzenlemeler, içerik iyileştirmeleri ve kod değişiklikleri görevlere ayrılır. Bu görevler doğrudan uygulanır ya da ilgili ekiplerle yürütülür.'],
  ['Ölçümleme', 'Çalışmaların organik trafik, gösterim, tıklama, sıralama ve dönüşüm performansı üzerindeki etkileri takip edilir. Sonuçlara göre yeni öncelikler belirlenir.'],
];
const FEED = JSON.parse(fs.readFileSync('posts.json', 'utf8')).slice(0, 6);
const dot = (iso) => iso.split('-').reverse().join('.');
const POSTS = [
  ['yapay-zeka-icerik-google-seo', 'İçerik Stratejisi', 'Yapay Zeka ile İçerik Üretimi ve Google'],
  ['chatgpt-trafigi-ga4-olcumu', 'Analitik', 'ChatGPT Trafiği GA4’te Neden Direct Görünüyor?'],
  ['google-eylul-2026-spam-guncellemesi', 'Teknik SEO', 'Google Eylül 2026 Spam Güncellemesi'],
  ['shopify-gecisi-seo-rehberi', 'Shopify', 'Shopify’a Geçişte SEO'],
  ['google-ai-modu-seo', 'GEO', 'Google AI Modu ve SEO'],
  ['shopify-agentic-storefronts-chatgpt', 'Shopify', 'Shopify Agentic Storefronts'],
];
const TOOLS = ['Screaming Frog', 'Google Search Console', 'Google Analytics 4', 'Google Tag Manager', 'PageSpeed Insights', 'Ahrefs', 'SEMrush', 'Looker Studio', 'Shopify', 'Liquid', 'WordPress', 'Elementor', 'GitHub', 'HTML', 'CSS', 'JavaScript', 'Python', 'PHP', 'Pandas', 'OpenPyXL', 'ImageMagick'];
const NAV = [['hakkimda', 'Hakkımda'], ...XP.map((x) => [x.id, x.short]), ['yaklasim', 'Yaklaşım'], ['yazilar', 'Yazılar'], ['araclar', 'Araçlar'], ['iletisim', 'İletişim']];
const notesFor = { hakkimda: 'Türkçe ve İngilizce projeler.', yaklasim: 'Analiz, önceliklendirme, uygulama, ölçümleme.', yazilar: 'Son yazılar.', araclar: `${TOOLS.length} araç ve teknoloji.`, iletisim: 'LinkedIn ya da e-posta.' };

const STAGE = {
  'teknik-seo': { ask: 50, spots: [[32.6, 40], [25.3, 69], [63, 38.6]] },
  geo: { ask: 4, spots: [[49.7, 22], [59, 46]] },
  icerik: { ask: 52, spots: [[80.8, 50], [36, 42]] },
  shopify: { ask: 52, spots: [[24.8, 72.6], [32, 85.7]] },
  wordpress: { ask: 4, spots: [[27.8, 22], [70.6, 50.4]] },
  veri: { ask: 6, spots: [[78.9, 43.3], [66, 22]] },
  otomasyon: { ask: 52, spots: [[73.4, 25.3], [73.4, 35.8], [85.9, 62.5]] },
};
const section = (x, i) => `
<section class="band" id="${x.id}" data-bg="${x.bg}" data-note="${esc(`Araçlar: ${x.tools}`)}">
  <div class="band-in">
    <h2${x.lang ? ` lang="${x.lang}"` : ''}>${x.short}</h2>
    <article class="card card-wide${i % 2 ? ' split' : ''}">
      <div class="card-text">
        <h3><i class="mark" aria-hidden="true"></i>${x.name}</h3>
        <p class="lede">${x.desc}</p>
        <a class="pill" href="${x.cta[1]}"${x.cta[1].startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${x.cta[0]}</a>
      </div>
      <div class="stage" data-id="${x.id}">
        <div class="float"><img class="shot" src="img/bolum-${x.id}.webp" alt="${esc(x.short)} çalışmalarını anlatan arayüz görseli" width="1400" height="933" loading="lazy">${STAGE[x.id].spots.map(([l, t], q) => `<i class="spot" style="left:${l}%;top:${t}%;animation-delay:${q * .6}s" aria-hidden="true"></i>`).join('')}</div>
        <div class="ask" style="left:${STAGE[x.id].ask}%" aria-hidden="true"><span>${x.short}</span><p></p><i class="send"><b></b><b></b></i></div>
      </div>
    </article>
    <ul class="points">${x.items.map((t, q) => `<li style="--n:${q}"><i class="mark" aria-hidden="true"></i>${t}</li>`).join('')}</ul>
  </div>
</section>`;

const POS = { 'teknik-seo': [.24, .2], geo: [.62, .13], icerik: [1.03, .2], shopify: [.14, .64], wordpress: [1.26, .46], veri: [.92, .88], otomasyon: [.5, .9] };
const ALLPOSTS = [...POSTS, ['core-web-vitals-performans-optimizasyonu', '', 'Core Web Vitals Performansının Geliştirilmesi'], ['shopify-liquid-performans-optimizasyonu', '', 'Shopify Liquid Geliştirmelerinde Performans'], ['anahtar-kelime-kanibalizasyonu-analizi', '', 'Anahtar Kelime Kanibalizasyonunun Analizi'], ['yapay-zeka-arama-icin-icerik-yapisi', '', 'Yapay Zeka Araması İçin İçerik Yapısı']];
const it = (t) => ({ t });
const HUBS = [{ id: 'hakkimda', name: 'Aylin İnci', n: 3, x: .7, y: .5, items: ['Strateji ve Teknik Uygulama', 'Veri Odaklı Karar Süreci', 'Uygulanabilir Çözümler'].map(it) }, ...XP.map((x) => ({ id: x.id, name: x.short, n: x.items.length, x: POS[x.id][0], y: POS[x.id][1], items: x.items.map(it) })),
  { id: 'yaklasim', name: 'Yaklaşım', n: STEPS.length, x: .42, y: .42, items: STEPS.map(([t]) => it(t)) }, { id: 'yazilar', name: 'Yazılar', n: 10, x: 1.02, y: .6, items: ALLPOSTS.map(([u, , t]) => ({ t, u: `${LIVE}/blog/${u}` })) }, { id: 'araclar', name: 'Araçlar', n: TOOLS.length, x: 1.3, y: .84, items: TOOLS.map(it) }];
const SCRIPT = fs.readFileSync('taslak.js', 'utf8').replace('/*HUBS*/[]', () => JSON.stringify(HUBS)) + '\n' + fs.readFileSync('taslak-anim.js', 'utf8').replace('/*CODE*/[]', () => JSON.stringify(XP.map((x) => [x.file, x.code]))).replace('/*ASK*/{}', () => JSON.stringify(Object.fromEntries(XP.map((x) => [x.id, x.items]))));
const page = `<title>Aylin İnci Taslak</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500&family=Geist+Mono:wght@300;400&display=swap">
<style>
/* Layout: a fixed left rail and right notes column around one content column; the page colour changes per discipline. */
:root{
  --ink:#010419; --blue:#051DAA; --fg:#FFFFFF; --fg-2:rgba(255,255,255,.78); --fg-3:rgba(255,255,255,.62);
  --line:rgba(255,255,255,.18); --panel:rgba(255,255,255,.08); --mint:#7CF2C6;
  --sans:'Instrument Sans','Helvetica Neue',Arial,sans-serif; --mono:'Geist Mono',ui-monospace,Menlo,Consolas,monospace;
  --page:var(--blue); --head:64px; color-scheme:dark;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:calc(var(--head) + 16px)}
body{margin:0;background:var(--page);color:var(--fg);font:400 16px/1.5 var(--sans);overflow-x:clip}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:60;background:var(--page)}
a{color:inherit}
:focus-visible{outline:2px solid var(--mint);outline-offset:3px}
#links{position:fixed;inset:0;width:100%;height:100%;pointer-events:none}
#links{z-index:2}
.top{position:sticky;top:env(safe-area-inset-top,0px);z-index:50;height:var(--head);display:flex;align-items:center;justify-content:space-between;gap:16px;background:var(--page);border-bottom:1px solid var(--line);padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.brand{display:flex;align-items:center;gap:10px;font-weight:500;font-size:17px;text-decoration:none;white-space:nowrap}
.brand img{display:block;flex:none;width:28px;height:28px}
.brand small{font:300 12px var(--mono);color:var(--fg-2)}
.top-links{display:flex;align-items:center;gap:24px;font-weight:500;font-size:15px}
.top-links a{text-decoration:none}.top-links a:hover{text-decoration:underline}
.cta{background:#fff;color:#0B1030;border-radius:999px;padding:9px 18px;text-decoration:none;font-weight:500;font-size:15px;white-space:nowrap}
.cta:hover{background:var(--mint)}
.hero{position:relative;z-index:3;display:grid;grid-template-columns:clamp(110px,12vw,172px) minmax(230px,280px) minmax(0,1fr);gap:10px;padding:10px max(16px,env(safe-area-inset-right,0px)) 10px max(16px,env(safe-area-inset-left,0px));min-height:calc(100vh - var(--head));min-height:calc(100dvh - var(--head))}
.word{position:relative;overflow:hidden;min-height:620px}
.word span{position:absolute;left:0;bottom:0;writing-mode:vertical-rl;transform:rotate(180deg);font-weight:500;font-size:clamp(96px,10.8vw,156px);line-height:1;letter-spacing:-.04em;white-space:nowrap}
.stack{display:grid;grid-template-columns:minmax(0,1fr);gap:10px;align-content:start;min-width:0}
.tile{min-width:0;border:1px solid var(--line);padding:12px;font:300 13px/1.45 var(--mono);background:var(--panel)}
.tile h1{font:500 22px/1.15 var(--sans);margin:0 0 6px}
.tile p{margin:0}
.tile-img img{display:block;width:calc(100% + 24px);max-width:none;height:auto;aspect-ratio:2/1;object-fit:cover;margin:-12px -12px 10px}
.tile-row{display:flex;align-items:baseline;gap:8px}
.tile .tile-row strong{font-size:24px;margin:0}
#dino{display:block;width:calc(100% + 24px);max-width:none;height:auto;aspect-ratio:186/48;margin:-12px -12px 10px;image-rendering:pixelated}
.codeloop{margin:-12px -12px 10px;background:var(--ink);padding:7px 10px;font:300 11px/1.4 var(--mono);color:#DDE6FF;overflow:hidden}
.codeloop small{display:block;font:inherit;color:var(--mint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.codeloop pre{margin:0;height:4.2em;font:inherit;white-space:pre;overflow:hidden}
.codeloop pre::after{content:"";display:inline-block;width:.55em;height:1em;background:#fff;vertical-align:-2px;margin-left:1px;animation:caret 1s steps(2) infinite}
@keyframes caret{50%{opacity:0}}
@media (min-width:861px) and (max-height:840px){.tile-img img{display:none}}
.tile strong{display:block;font:500 40px/1.05 var(--sans);margin-bottom:4px}
.index{list-style:none;margin:0;padding:0}
.index a{display:flex;justify-content:space-between;gap:8px;text-decoration:none;padding:1px 0}
.index a:hover{color:var(--mint)}
.index span{color:var(--fg-3);font-variant-numeric:tabular-nums}
.mapbox{position:relative;background:var(--ink);min-height:560px;min-width:0;overflow:hidden}
#map{position:absolute;inset:0;width:100%;height:100%;cursor:pointer;display:block}
.maphint{position:absolute;left:12px;bottom:10px;font:300 12px var(--mono);color:var(--fg-3)}
main{position:relative;z-index:3}
.rail{position:fixed;left:16px;top:50%;transform:translateY(-50%);z-index:4;width:150px;list-style:none;margin:0;padding:0;font:300 13px/1 var(--mono)}
.rail a{display:flex;justify-content:space-between;align-items:center;padding:6px 0;text-decoration:none;color:var(--fg-2)}
.rail a::after{content:"";width:6px;height:6px;border-radius:50%;border:1px solid var(--fg-2)}
.rail a[aria-current="true"]{color:#fff;font-weight:400}
.rail a[aria-current="true"]::after{background:#fff;border-color:#fff}
.notes{position:fixed;right:16px;top:calc(var(--head) + 120px);z-index:4;width:176px;border:1px solid var(--line);font:300 12px/1.45 var(--mono);background:var(--page);transition:background .7s ease}
.notes b{display:block;font-weight:300;color:var(--fg-2);padding:6px 8px;border-bottom:1px solid var(--line)}
.notes p{margin:0;padding:8px}
.rail,.notes{transition:opacity .3s ease,background .7s ease}
body.at-top .rail,body.at-top .notes{opacity:0;visibility:hidden}
.band{padding-block:clamp(72px,12vh,140px)}
.band-in{max-width:1040px;margin-inline:auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:grid;gap:clamp(28px,5vh,56px)}
h2{font-weight:500;font-size:clamp(52px,8.2vw,118px);line-height:1;letter-spacing:-.025em;margin:0;text-wrap:balance}
.card{background:var(--panel);border:1px solid var(--line);padding:24px;min-width:0}
.card-wide{display:grid;grid-template-columns:minmax(0,1fr);gap:24px}
.card-wide.split{grid-template-columns:minmax(0,.72fr) minmax(0,1fr);align-items:start}
.stage{position:relative;min-width:0;aspect-ratio:3/2;border-radius:16px;overflow:hidden}
.float{position:absolute;inset:0}
.shot{display:block;width:100%;height:100%;object-fit:cover}
.spot{position:absolute;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:var(--mint);animation:spot 2.4s ease-in-out infinite}
.spot::after{content:"";position:absolute;inset:-1px;border-radius:50%;border:1px solid var(--mint);animation:spot-ring 2.4s ease-out infinite;animation-delay:inherit}
@keyframes spot{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes spot-ring{0%{transform:scale(1);opacity:.9}100%{transform:scale(4.5);opacity:0}}
.ask{position:absolute;bottom:5%;width:min(46%,330px);background:#fff;color:#0B1030;border-radius:14px;padding:10px 12px;box-shadow:0 10px 30px rgba(0,0,0,.28);font:400 14px/1.3 var(--sans);opacity:0;transform:translateY(14px) scale(.97);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.8,.2,1)}
.stage.in .ask{opacity:1;transform:none}
.ask span{display:inline-block;background:#EEF0F6;border-radius:7px;padding:2px 8px;font-size:12px}
.ask p{margin:8px 0 0;padding-right:30px;min-height:2.6em;color:#0B1030}
.ask p::after{content:"";display:inline-block;width:1px;height:1em;background:#0B1030;vertical-align:-2px;margin-left:1px;animation:caret 1s steps(2) infinite}
.send{position:absolute;right:11px;bottom:11px;width:24px;height:24px;border-radius:50%;background:#5A31F4;transition:transform .2s ease}
.send::before{content:"";position:absolute;left:8px;top:9px;width:6px;height:6px;border-left:2px solid #fff;border-top:2px solid #fff;transform:rotate(45deg)}
.ask.go .send{transform:scale(.82)}
.send b{position:absolute;left:50%;top:50%;width:76px;height:76px;margin:-38px 0 0 -38px;border-radius:50%;border:1px solid #7C5CFF;animation:halo 3.2s ease-in-out infinite}
.send b+b{width:150px;height:150px;margin:-75px 0 0 -75px;animation-delay:-1.6s}
@keyframes halo{0%,100%{transform:scale(.86);opacity:.35}50%{transform:scale(1.06);opacity:1}}
.card-text{display:grid;gap:14px;justify-items:start;min-width:0}
h3{font-weight:500;font-size:19px;line-height:1.2;margin:0;display:flex;align-items:baseline;gap:10px}
.mark{flex:none;display:inline-block;width:6px;height:6px;border:1px solid currentColor;transform:translateY(-2px)}
.lede{font-size:clamp(19px,1.9vw,23px);line-height:1.22;letter-spacing:-.01em;color:var(--fg-2);margin:0;max-width:30ch}
.pill{display:inline-block;background:var(--ink);color:#fff;border-radius:999px;padding:6px 12px;font:300 13px var(--mono);text-decoration:none}
.pill:hover{background:#fff;color:var(--ink)}
.points{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0 24px;font-weight:500;line-height:1.25;letter-spacing:-.005em}
.points li{display:flex;gap:9px;align-items:baseline;min-width:0;padding:14px 0;border-top:1px solid var(--line)}
.about p{margin:0 0 14px;font-size:clamp(18px,1.7vw,21px);line-height:1.3;color:var(--fg-2)}
.about p:last-child{margin-bottom:0}
.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.step{display:grid;gap:10px;align-content:start}
.step p{margin:0;color:var(--fg-2)}
.post{padding:0;text-decoration:none;display:grid;grid-template-rows:auto 1fr;overflow:hidden;min-width:0}
.post:hover{border-color:#fff}
.post-art{position:relative;aspect-ratio:16/9;background:var(--ink);overflow:hidden}
.post-art canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.post-t{padding:14px;display:grid;gap:8px;align-content:start;justify-items:start}
.post small{font:300 12px var(--mono);color:var(--fg-2)}
.post strong{font-weight:500;font-size:17px;line-height:1.2}
.post-lead{grid-column:1 / 3;grid-row:1 / 3;grid-template-rows:minmax(260px,1fr) auto}
.post-lead .post-art{aspect-ratio:auto}
.post-lead .post-t{padding:22px;gap:12px}
.post-lead strong{font-size:clamp(26px,2.7vw,40px);line-height:1.04;letter-spacing:-.02em}
.post-lead p{margin:0;color:var(--fg-2);font-size:17px;line-height:1.35;max-width:52ch}
.post:hover strong{text-decoration:underline;text-underline-offset:4px}
.chips{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px;font:300 14px var(--mono)}
.chips li{border:1px solid var(--line);padding:6px 11px;border-radius:999px}
.contact p{margin:0;color:var(--fg-2)}
.contact .mail{font:300 15px var(--mono);color:#fff;text-underline-offset:4px}
.contact .mail:hover{color:var(--mint)}
.row{display:flex;flex-wrap:wrap;gap:10px}
footer{position:relative;z-index:3;border-top:1px solid var(--line);padding-block:24px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));font:300 13px var(--mono);color:var(--fg-2);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
footer .legal{display:flex;flex-wrap:wrap;gap:6px 18px}
footer a{text-decoration:none}footer a:hover{text-decoration:underline;color:#fff}
@media (max-width:1320px){.notes{display:none}}
@media (max-width:1120px){.rail{display:none}#links{display:none}.points{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:860px){
  .top-links a:not(.cta){display:none}
  .hero{grid-template-columns:minmax(0,1fr);min-height:0}
  .word{min-height:0}
  .word span{position:static;transform:none;writing-mode:horizontal-tb;display:block;font-size:clamp(58px,17.5vw,150px);line-height:1}
  .mapbox{order:-1;min-height:0;aspect-ratio:1/1}
  .points{grid-template-columns:minmax(0,1fr);gap:0}
  .card-wide.split{grid-template-columns:minmax(0,1fr)}
  .ask{width:62%;padding:8px 10px;font-size:12px}.ask span{font-size:11px}.ask p{margin-top:5px}
  .points li{padding:12px 0;border-top:1px solid var(--line)}
  .grid2,.grid3{grid-template-columns:minmax(0,1fr)}
  .post-lead{grid-column:auto;grid-row:auto;grid-template-rows:auto 1fr}
  .post-lead .post-art{aspect-ratio:16/10}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.spot,.spot::after,.send b,.ask p::after{animation:none}.spot{opacity:1}.spot::after{opacity:0}.ask{transition:none}}
${fs.readFileSync('taslak-motion.css', 'utf8')}</style>

<script>document.body.classList.add("at-top")</script>
<canvas id="map" aria-hidden="true"></canvas>
<canvas id="links" aria-hidden="true"></canvas>

<header class="top">
  <a class="brand" href="#ust"><img src="img/logo-mark.svg" alt="" width="28" height="28">Aylin İnci<small>Taslak</small></a>
  <nav class="top-links" aria-label="Ana menü">
    <a href="#hakkimda">Hakkımda</a><a href="blog.html">Yazılar</a><a href="#iletisim">İletişim</a><a href="/en/" lang="en" hreflang="en">EN</a>
    <a class="cta" href="${LIVE}/Aylin_Inci_CV_TR.pdf" target="_blank" rel="noopener">Özgeçmiş</a>
  </nav>
</header>

<div class="scene" id="ust"><div class="hero">
  <div class="word" aria-hidden="true"><span>Görünürlük</span></div>
  <div class="stack">
    <div class="tile"><h1>Aylin İnci</h1><p>SEO, GEO ve Web Geliştirme Uzmanı</p></div>
    <nav class="tile" aria-label="Uzmanlık alanları"><ul class="index">${XP.map((x) => `<li><a href="#${x.id}">${x.short}<span>${x.items.length}</span></a></li>`).join('')}</ul></nav>
    <div class="tile tile-img"><img src="img/kart-uzmanlik.webp" alt="" width="800" height="533"><div class="tile-row"><strong>${XP.length}</strong><p>alan, ${XP.reduce((n, x) => n + x.items.length, 0)} çalışma başlığı</p></div></div>
    <div class="tile"><canvas id="dino" width="186" height="48" aria-hidden="true"></canvas><div class="tile-row"><strong>10</strong><p>blog yazısı</p></div></div>
    <div class="tile"><div class="codeloop" aria-hidden="true"><small id="codeFile"></small><pre id="codeLoop"></pre></div><div class="tile-row"><strong>${TOOLS.length}</strong><p>araç ve teknoloji</p></div></div>
  </div>
  <div class="mapbox" role="group" aria-label="Uzmanlık alanlarını ve çalışma başlıklarını gösteren bağlantı haritası">
    <div id="mapHover"></div><div id="mapChips"></div><p class="maphint">Bir noktaya tıklayın</p>
  </div>
</div></div>

<ul class="rail" id="rail" aria-label="Bölümler">${NAV.map(([id, t], i) => `<li style="--i:${i}"><a href="#${id}">${t}</a></li>`).join('')}</ul>
<aside class="notes" id="notes" aria-label="Notlar"><b>Notlar</b><p id="noteText">${notesFor.hakkimda}</p></aside>

<main>
<section class="band" id="hakkimda" data-bg="#051DAA" data-note="${notesFor.hakkimda}">
  <div class="band-in">
    <h2>SEO stratejisinden teknik uygulamaya</h2>
    <article class="card about">
      <div>
        <p>SEO, içerik ve web geliştirme ayrı işler olarak değil, aynı sürecin parçaları olarak ele alınır.</p>
        <p>Shopify ve WordPress projelerinde teknik SEO, içerik optimizasyonu, tema geliştirme, site geçişleri, yönlendirme planları, performans iyileştirmeleri ve ölçümleme altyapıları üzerine çalışmalar.</p>
        <p>Analiz sonuçları yalnızca raporlanmaz. Gerekli düzenlemeler kod, içerik ve kullanıcı deneyimi düzeyinde uygulanır.</p>
      </div>
    </article>
  </div>
</section>
${XP.map(section).join('\n')}
<section class="band" id="yaklasim" data-bg="#3A0A2E" data-note="${notesFor.yaklasim}">
  <div class="band-in">
    <h2>Analizden ölçümlemeye</h2>
    <div class="grid2">${STEPS.map(([t, p]) => `<article class="card step"><h3><i class="mark" aria-hidden="true"></i>${t}</h3><p>${p}</p></article>`).join('')}</div>
  </div>
</section>
<section class="band" id="yazilar" data-bg="#0B1B5E" data-note="${notesFor.yazilar}">
  <div class="band-in">
    <h2>Yazılar</h2>
    <div class="grid3 posts">${FEED.map((p, i) => `<a class="card post${i ? '' : ' post-lead'}" href="yazi/${p.slug}.html" style="--n:${i}"><div class="post-art"><canvas data-slug="${p.slug}" data-bg="${p.bg}" aria-hidden="true"></canvas></div><div class="post-t"><small>${i ? '' : 'Son yazı · '}${esc(p.cat)} · ${dot(p.date)} · ${p.rt} dk</small><strong>${esc(p.title)}</strong>${i ? '' : `<p>${esc(p.desc)}</p><span class="pill">Yazıyı okuyun</span>`}</div></a>`).join('')}</div>
    <div><a class="pill" href="${LIVE}/blog/" target="_blank" rel="noopener">Tüm yazılar</a></div>
  </div>
</section>
<section class="band" id="araclar" data-bg="#141821" data-note="${notesFor.araclar}">
  <div class="band-in">
    <h2>Araçlar</h2>
    <ul class="chips">${TOOLS.map((t) => `<li>${t}</li>`).join('')}</ul>
  </div>
</section>
<section class="band" id="iletisim" data-bg="#010419" data-note="${notesFor.iletisim}">
  <div class="band-in">
    <h2>İletişim</h2>
    <article class="card contact" style="display:grid;gap:14px;justify-items:start">
      <p>Profesyonel deneyim, uzmanlık alanları ve yazılar hakkında LinkedIn ya da e-posta ile iletişime geçebilirsiniz.</p>
      <a class="mail" href="mailto:aylinvinci@gmail.com">aylinvinci@gmail.com</a>
      <div class="row"><a class="pill" href="https://www.linkedin.com/in/aylin-inci/" target="_blank" rel="noopener">LinkedIn</a><a class="pill" href="${LIVE}/Aylin_Inci_CV_TR.pdf" target="_blank" rel="noopener">Özgeçmiş</a></div>
    </article>
  </div>
</section>
</main>
<footer><span>© 2026 Aylin İnci</span><nav class="legal" aria-label="Yasal metinler"><a href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</a><a href="/cerez-politikasi">Çerez Politikası</a><a href="/gizlilik-politikasi">Gizlilik Politikası</a><a href="/en/" lang="en" hreflang="en">English</a></nav></footer>

<script>
${SCRIPT}
</script>
`;
const linked = page
  .replace(/https:\/\/aylininci\.com\/blog\/([a-z0-9-]+)"( target="_blank" rel="noopener")?/g, 'yazi/$1.html"')
  .replace(/https:\/\/aylininci\.com\/blog\/"( target="_blank" rel="noopener")?/g, 'blog.html"');
fs.writeFileSync(OUT, linked);
console.log('bytes', Buffer.byteLength(page));
