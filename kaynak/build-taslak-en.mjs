// English home: the Turkish builder with English content (taken from the live English page, impersonal voice).
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

let src = fs.readFileSync('build-taslak.mjs', 'utf8').replace(/\r\n/g, '\n');
const swap = (a, b) => { if (!src.includes(a)) throw new Error('not found: ' + a.slice(0, 80)); src = src.split(a).join(b); };
const block = (from, to, text) => {
  const i = src.indexOf(from), j = src.indexOf(to, i);
  if (i < 0 || j < 0) throw new Error('block not found: ' + from);
  src = src.slice(0, i) + text + src.slice(j);
};

block('const XP = [', '\nconst STEPS', `const XP = [
  { id: 'teknik-seo', name: 'Technical SEO', short: 'Technical SEO', bg: '#051DAA', title: '',
    desc: 'Analyzing and improving technical structures so websites are crawled, understood and indexed more accurately by search engines.',
    items: ['Crawl and indexing issues', 'Canonical and hreflang structures', 'Redirect chains and 404 checks', 'Robots.txt and sitemap reviews', 'Site architecture and URL structures', 'JavaScript-related SEO issues', 'Core Web Vitals and page performance', 'Structured data checks', 'Site migration planning'],
    tools: 'Screaming Frog, Google Search Console, Ahrefs, PageSpeed Insights', file: 'robots.txt',
    code: \`User-agent: *\\nAllow: /\\n\\nUser-agent: GPTBot\\nAllow: /\\n\\nSitemap: https://aylininci.com/sitemap.xml\`,
    cta: ['Core Web Vitals guide (Turkish)', \`\${LIVE}/blog/core-web-vitals-performans-optimizasyonu\`] },
  { id: 'geo', name: 'GEO and Search Visibility', short: 'GEO', bg: '#2A0FA8', title: '',
    desc: 'Content and technical work that helps brands be understood correctly not only in traditional search results, but also in AI-powered search and answer systems.',
    items: ['Entity and topical consistency', 'Clear, verifiable content structure', 'Semantic content architecture', 'Question-and-answer oriented content', 'Sourcing and expertise signals', 'Schema and structured data', 'Supporting brand and topical authority', 'AI Overview and generative search analysis'],
    tools: 'Google Search Console, Ahrefs, Schema', file: 'query-fan-out.txt',
    code: \`query: "which platform for a small online store?"\\n ├─ shopify cost\\n ├─ woocommerce comparison\\n ├─ payment providers in turkey\\n └─ source: the page with the clearest answer\`,
    cta: ['Google AI Mode article (Turkish)', \`\${LIVE}/blog/google-ai-modu-seo\`] },
  { id: 'icerik', name: 'Content SEO and Strategy', short: 'Content', bg: '#4A0B7A', title: '',
    desc: "Planning content structures aligned with search intent, user needs and the website's commercial goals.",
    items: ['Keyword and competitor analysis', 'Search intent classification', 'Content plans and topic clusters', 'Category and product page optimization', 'Internal linking strategy', 'Content briefs', 'Cannibalization analysis', 'Meta title and description optimization', 'Turkish and English content work'],
    tools: 'Ahrefs, SEMrush, Google Search Console, Screaming Frog', file: 'content-brief.md',
    code: \`query:   keyword cannibalization\\nintent:  informational\\npage:    one main guide\\nlinks:   from 3 related articles\\ncheck:   Search Console, 28 days\`,
    cta: ['AI content article (Turkish)', \`\${LIVE}/blog/yapay-zeka-icerik-google-seo\`] },
  { id: 'shopify', name: 'Shopify and Liquid Development', short: 'Shopify', bg: '#0A5A3C', title: '',
    desc: 'Developing Shopify stores in line with their technical infrastructure, theme structure, user experience and SEO needs.',
    items: ['Theme customizations', 'Liquid code edits', 'Custom section and block development', 'Product and collection page adjustments', 'JSON template structures', 'Mobile responsiveness improvements', 'Site speed and image optimization', 'Multilingual store structures', 'Canonical and indexing checks', 'Theme management via GitHub', 'Technical error analysis and resolution'],
    tools: 'Shopify, Liquid, JSON, HTML, CSS, JavaScript, GitHub', file: 'sections/product-cards.liquid',
    code: \`{% for product in collection.products limit: 4 %}\\n  {{ product.featured_image\\n     | image_url: width: 800\\n     | image_tag: loading: 'lazy' }}\\n{% endfor %}\`,
    cta: ['Shopify migration guide (Turkish)', \`\${LIVE}/blog/shopify-gecisi-seo-rehberi\`] },
  { id: 'wordpress', name: 'WordPress and Front-End Development', short: 'WordPress', bg: '#074B66', title: '',
    desc: 'User-experience and performance-focused interface development for corporate sites, landing pages and content-driven projects.',
    items: ['WordPress site edits', 'Elementor interface development', 'Custom HTML and CSS', 'JavaScript-based interactions', 'Mobile responsiveness', 'Page speed optimization', 'Form and redirect structures', 'Single-page and corporate site designs', 'SEO-friendly page structures', 'Theme and plugin error resolution'],
    tools: 'WordPress, Elementor, HTML, CSS, JavaScript, PHP', file: 'style.css',
    code: \`img {\\n  max-width: 100%;\\n  height: auto;\\n}\\n.hero-image { aspect-ratio: 3 / 2; }\`,
    cta: ['Get in touch', '#iletisim'] },
  { id: 'veri', name: 'Data Analysis and Measurement', short: 'Data', bg: '#6A1045', title: '',
    desc: 'Evaluating SEO and web performance not by rankings alone, but together with user behavior and conversion data.',
    items: ['GA4 performance analysis', 'Google Search Console reports', 'Organic traffic and visibility assessments', 'Conversion tracking', 'Google Tag Manager checks', 'Landing page performance', 'Channel and referrer analysis', 'Management and client reports', 'Turning data into understandable outputs'],
    tools: 'GA4, GSC, GTM, Looker Studio, Excel', file: 'ga4-channel-group.regex',
    code: \`chatgpt\\\\.com|chat\\\\.openai\\\\.com|\\nperplexity\\\\.ai|gemini\\\\.google\\\\.com|\\ncopilot\\\\.microsoft\\\\.com|claude\\\\.ai\`,
    cta: ['Measuring ChatGPT traffic (Turkish)', \`\${LIVE}/blog/chatgpt-trafigi-ga4-olcumu\`] },
  { id: 'otomasyon', name: 'Automation and Technical Optimization', short: 'Automation', bg: '#6B3A08', title: '',
    desc: 'Making repetitive data processing, reporting and content operations more controlled and efficient.',
    items: ['Processing CSV and Excel data', 'Classifying SEO data', 'Bulk redirect checks', 'Image size and file optimization', 'Reporting automation', 'Data cleaning and structuring', 'Simplifying repetitive workflows'],
    tools: 'Python, Pandas, OpenPyXL, ImageMagick, Pillow', file: 'redirect_check.py',
    code: \`import pandas as pd\\n\\nurls = pd.read_csv("redirects.csv")\\nbroken = urls[urls["status"] != 301]\\nbroken.to_excel("check.xlsx", index=False)\`,
    cta: ['See the tools', '#araclar'] },
];`);
block('const STEPS = [', '\nconst FEED', `const STEPS = [
  ['Analysis', "The site's technical infrastructure, content structure, organic performance and user experience are examined together. Decisions are shaped by existing data, crawl results and real user behavior rather than assumptions."],
  ['Prioritization', 'Findings are classified by their potential impact, implementation requirements and business goals. Critical technical issues are addressed first.'],
  ['Implementation', 'Technical adjustments, content improvements and code changes are broken down into tasks. These tasks are applied directly or carried out with the relevant teams.'],
  ['Measurement', 'The effects on organic traffic, impressions, clicks, rankings and conversion performance are tracked. New priorities are set based on the results.'],
];`);
// English titles for the Turkish articles, from the live English page
const EN = {
  'yapay-zeka-icerik-google-seo': ['AI-generated content and Google', "What Google's October 2026 content guidance update means and how to use AI without hurting SEO."],
  'chatgpt-trafigi-ga4-olcumu': ['Measuring ChatGPT traffic in GA4', 'Why ChatGPT visits showed up as Direct in October 2026 and how to set up an AI-assistant channel in GA4.'],
  'google-eylul-2026-spam-guncellemesi': ['Google September 2026 spam update', "How to tell whether a site was affected by the year's longest spam update, and Google's recovery guidance."],
  'shopify-gecisi-seo-rehberi': ['SEO when migrating to Shopify', 'URL mapping, 301 redirects, Shopify limitations and a launch-day checklist to keep organic traffic when replatforming.'],
  'google-ai-modu-seo': ['Google AI Mode and SEO', "How query fan-out works, what the click data really says, and how to measure AI visibility with Search Console's new Generative AI report."],
  'shopify-agentic-storefronts-chatgpt': ['Shopify Agentic Storefronts: selling in ChatGPT and AI Mode', 'How Shopify connects stores to ChatGPT, Copilot and Google AI Mode, who can sell there, and how to prepare product data for AI assistants.'],
  'core-web-vitals-performans-optimizasyonu': ['Improving Core Web Vitals performance', 'Work on the loading, interaction and visual stability metrics that affect real user experience, not just the PageSpeed score.'],
  'shopify-liquid-performans-optimizasyonu': ['Preserving performance in Liquid development', 'Preventing unnecessary JavaScript, render delays and theme performance issues when adding custom sections and features to Shopify themes.'],
  'anahtar-kelime-kanibalizasyonu-analizi': ['Analyzing keyword cannibalization', 'Identifying pages competing for similar queries, separating content intent, and merging pages where necessary.'],
  'yapay-zeka-arama-icin-icerik-yapisi': ['Content structure for AI-powered search systems', 'Evaluating content in terms of topical consistency, clarity, sourcing and structured data.'],
};
const CAT = { 'Analitik': 'Analytics', 'Teknik SEO': 'Technical SEO', 'İçerik Stratejisi': 'Content Strategy', 'Shopify': 'Shopify', 'GEO': 'GEO' };
block('const POSTS = [', '\nconst TOOLS', `const EN = ${JSON.stringify(EN)};
const CAT = ${JSON.stringify(CAT)};
const POSTS = Object.keys(EN).slice(0, 6).map((s) => [s, '', EN[s][0]]);`);
swap(`const ALLPOSTS = [...POSTS, ['core-web-vitals-performans-optimizasyonu', '', 'Core Web Vitals Performansının Geliştirilmesi'], ['shopify-liquid-performans-optimizasyonu', '', 'Shopify Liquid Geliştirmelerinde Performans'], ['anahtar-kelime-kanibalizasyonu-analizi', '', 'Anahtar Kelime Kanibalizasyonunun Analizi'], ['yapay-zeka-arama-icin-icerik-yapisi', '', 'Yapay Zeka Araması İçin İçerik Yapısı']];`,
  `const ALLPOSTS = Object.keys(EN).map((s) => [s, '', EN[s][0]]);`);

const pairs = [
  ["const OUT = '../site/redesign-taslak.html';", "const OUT = '../site/redesign-taslak-en.html';"],
  ["[['hakkimda', 'Hakkımda'], ...XP.map((x) => [x.id, x.short]), ['yaklasim', 'Yaklaşım'], ['yazilar', 'Yazılar'], ['araclar', 'Araçlar'], ['iletisim', 'İletişim']]", "[['hakkimda', 'About'], ...XP.map((x) => [x.id, x.short]), ['yaklasim', 'Approach'], ['yazilar', 'Articles'], ['araclar', 'Tools'], ['iletisim', 'Contact']]"],
  ["hakkimda: 'Türkçe ve İngilizce projeler.', yaklasim: 'Analiz, önceliklendirme, uygulama, ölçümleme.', yazilar: 'Son yazılar.', araclar: `${TOOLS.length} araç ve teknoloji.`, iletisim: 'LinkedIn ya da e-posta.'", "hakkimda: 'Turkish and English projects.', yaklasim: 'Analysis, prioritization, implementation, measurement.', yazilar: 'Latest articles, written in Turkish.', araclar: `${TOOLS.length} tools and technologies.`, iletisim: 'LinkedIn or e-mail.'"],
  ['data-note="${esc(`Araçlar: ${x.tools}`)}"', 'data-note="${esc(`Tools: ${x.tools}`)}"'],
  ['alt="${esc(x.short)} çalışmalarını anlatan arayüz görseli"', 'alt="Interface illustration for ${esc(x.short)} work"'],
  ["items: ['Strateji ve Teknik Uygulama', 'Veri Odaklı Karar Süreci', 'Uygulanabilir Çözümler'].map(it)", "items: ['Strategy and Technical Implementation', 'Data-Driven Decisions', 'Applicable Solutions'].map(it)"],
  ["{ id: 'yaklasim', name: 'Yaklaşım',", "{ id: 'yaklasim', name: 'Approach',"],
  ["{ id: 'yazilar', name: 'Yazılar',", "{ id: 'yazilar', name: 'Articles',"],
  ["{ id: 'araclar', name: 'Araçlar',", "{ id: 'araclar', name: 'Tools',"],
  ["fs.readFileSync('taslak.js', 'utf8')", "fs.readFileSync('taslak.js', 'utf8').replace(\"'Yazıyı oku'\", \"'Read the article'\").replace(\"'Bölüme git'\", \"'Go to section'\")"],
  ['<nav class="top-links" aria-label="Ana menü">', '<nav class="top-links" aria-label="Main menu">'],
  ['<a href="#hakkimda">Hakkımda</a><a href="blog.html">Yazılar</a><a href="#iletisim">İletişim</a><a href="/en/" lang="en" hreflang="en">EN</a>', '<a href="#hakkimda">About</a><a href="blog.html">Articles</a><a href="#iletisim">Contact</a><a href="/" lang="tr" hreflang="tr">TR</a>'],
  ['<a class="cta" href="${LIVE}/Aylin_Inci_CV_TR.pdf" target="_blank" rel="noopener">Özgeçmiş</a>', '<a class="cta" href="${LIVE}/Aylin_Inci_CV_EN.pdf" target="_blank" rel="noopener">Résumé</a>'],
  ['<span>Görünürlük</span>', '<span>Visibility</span>'],
  ['<p>SEO, GEO ve Web Geliştirme Uzmanı</p>', '<p>SEO, GEO &amp; Web Development Specialist</p>'],
  ['aria-label="Uzmanlık alanları"', 'aria-label="Areas of expertise"'],
  ['<p>alan, ${XP.reduce((n, x) => n + x.items.length, 0)} çalışma başlığı</p>', '<p>areas, ${XP.reduce((n, x) => n + x.items.length, 0)} work topics</p>'],
  ['<p>blog yazısı</p>', '<p>articles</p>'],
  ['<p>araç ve teknoloji</p>', '<p>tools and technologies</p>'],
  ['aria-label="Uzmanlık alanlarını ve çalışma başlıklarını gösteren bağlantı haritası"', 'aria-label="Connection map of areas of expertise and work topics"'],
  ['<p class="maphint">Bir noktaya tıklayın</p>', '<p class="maphint">Click a point</p>'],
  ['aria-label="Bölümler"', 'aria-label="Sections"'],
  ['<aside class="notes" id="notes" aria-label="Notlar"><b>Notlar</b>', '<aside class="notes" id="notes" aria-label="Notes"><b>Notes</b>'],
  ['<h2>SEO stratejisinden teknik uygulamaya</h2>', '<h2>From SEO strategy to technical implementation</h2>'],
  ['<p>SEO, içerik ve web geliştirme ayrı işler olarak değil, aynı sürecin parçaları olarak ele alınır.</p>', '<p>SEO, content and web development are treated not as separate jobs, but as parts of the same process.</p>'],
  ['<p>Shopify ve WordPress projelerinde teknik SEO, içerik optimizasyonu, tema geliştirme, site geçişleri, yönlendirme planları, performans iyileştirmeleri ve ölçümleme altyapıları üzerine çalışmalar.</p>', '<p>Work on Shopify and WordPress projects covers technical SEO, content optimization, theme development, site migrations, redirect plans, performance improvements and measurement infrastructure.</p>'],
  ['<p>Analiz sonuçları yalnızca raporlanmaz. Gerekli düzenlemeler kod, içerik ve kullanıcı deneyimi düzeyinde uygulanır.</p>', '<p>Analysis results are not only reported. The necessary changes are applied at the code, content and user-experience level.</p>'],
  ['<h2>Analizden ölçümlemeye</h2>', '<h2>From analysis to measurement</h2>'],
  ['<h2>Yazılar</h2>', '<h2>Articles</h2>'],
  ["${i ? '' : 'Son yazı · '}${esc(p.cat)} · ${dot(p.date)} · ${p.rt} dk</small><strong>${esc(p.title)}</strong>${i ? '' : `<p>${esc(p.desc)}</p><span class=\"pill\">Yazıyı okuyun</span>`}",
    "${i ? '' : 'Latest · '}${esc(CAT[p.cat] || p.cat)} · ${dot(p.date)} · ${p.rt} min</small><strong>${esc(EN[p.slug][0])}</strong>${i ? '' : `<p>${esc(EN[p.slug][1])}</p><span class=\"pill\">Read the article (Turkish)</span>`}"],
  ['<a class="card post${i ? \'\' : \' post-lead\'}" href="yazi/${p.slug}.html"', '<a class="card post${i ? \'\' : \' post-lead\'}" href="yazi/${p.slug}.html" hreflang="tr"'],
  ['rel="noopener">Tüm yazılar</a>', 'rel="noopener">All articles (Turkish)</a>'],
  ['<h2>Araçlar</h2>', '<h2>Tools</h2>'],
  ['<h2>İletişim</h2>', '<h2>Contact</h2>'],
  ['<p>Profesyonel deneyim, uzmanlık alanları ve yazılar hakkında LinkedIn ya da e-posta ile iletişime geçebilirsiniz.</p>', '<p>You can get in touch on LinkedIn or by e-mail about professional experience, areas of expertise and articles.</p>'],
  ['<a class="pill" href="${LIVE}/Aylin_Inci_CV_TR.pdf" target="_blank" rel="noopener">Özgeçmiş</a>', '<a class="pill" href="${LIVE}/Aylin_Inci_CV_EN.pdf" target="_blank" rel="noopener">Résumé</a>'],
  ['<nav class="legal" aria-label="Yasal metinler"><a href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</a><a href="/cerez-politikasi">Çerez Politikası</a><a href="/gizlilik-politikasi">Gizlilik Politikası</a><a href="/en/" lang="en" hreflang="en">English</a></nav>',
    '<nav class="legal" aria-label="Legal notices"><a href="/kvkk-aydinlatma-metni" hreflang="tr">Privacy Notice (KVKK, Turkish)</a><a href="/cerez-politikasi" hreflang="tr">Cookie Policy (Turkish)</a><a href="/gizlilik-politikasi" hreflang="tr">Privacy Policy (Turkish)</a><a href="/" lang="tr" hreflang="tr">Türkçe</a></nav>'],
];
for (const [a, b] of pairs) swap(a, b);

const gen = 'build-taslak-en.gen.mjs';
fs.writeFileSync(gen, src);
await import(pathToFileURL(gen).href + '?t=' + Date.now());
