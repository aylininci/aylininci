# Yeni tasarımın kaynakları

Canlı site 2026-11-03'te bu betiklerle üretildi. Eski sürüm: `eski-tasarim-2026-11-03` etiketi ve `yedek/eski-tasarim` dalı.

- `build-taslak.mjs`: Ana sayfa (veri + şablon). `build-taslak-en.mjs`: Aynı betikten İngilizce ana sayfa (`/en/`). `taslak.js` harita motoru, `taslak-anim.js` dinozor, kod ve kart animasyonları, `taslak-motion.css` kaydırma efektleri.
- `build-blog.mjs`: Blog arşivi ve yazı sayfaları. `blog.js` ve `blog.css` ile birlikte çalışır. `rewrites.mjs`, yazı metinlerindeki birinci şahıs düzeltmelerini içerir.
- `build-prod.mjs`: Canlı dosyaları üretir. Canlı sayfaların SEO başlığını (`live-src/`) korur, gövdeyi yeni tasarımdan alır, SSS yapılandırılmış verisini sayfadaki metinden üretir.
- `check.mjs`: Kırık link ve JSON-LD kontrolü. `serve.mjs`: Uzantısız adreslerle yerel sunucu. `lh2.mjs`: Lighthouse.

Sıra: `node build-blog.mjs` → `node build-taslak.mjs` → taslağı `draft-home.html` olarak kopyala → `node build-prod.mjs` → `node check.mjs`. Betiklerdeki göreli yollar eski çalışma klasörüne göre yazıldı; tekrar kullanmadan önce kontrol edin.
