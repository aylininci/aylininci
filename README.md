# Aylin İnci — Kişisel Portföy Sitesi

SEO, GEO ve web geliştirme uzmanlıklarının, çalışma yaklaşımının ve içeriklerin paylaşıldığı iki dilli (TR/EN) kişisel site. Açık/koyu tema desteklidir.

## Klasör içeriği
- `index.html` — Türkçe ana sayfa
- `en/index.html` — İngilizce ana sayfa (`/en/`)
- `blog/` — blog yazıları; `blog/index.html` tüm yazıların listesi (`/blog/`)
- `cerez-politikasi.html`, `gizlilik-politikasi.html`, `kvkk-aydinlatma-metni.html` — yasal metinler
- `aylin-inci-logo.webp` — header ve footer logosu (`aylin-inci-logo.png` yapılandırılmış veride kullanılıyor)
- `favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png` — sekme ve ana ekran ikonları
- `og-image.png`, `og-image-en.png` — LinkedIn/WhatsApp paylaşım görselleri (1200×630)
- `sitemap.xml`, `robots.txt`, `llms.txt` — arama motorları ve yapay zeka sistemleri için
- `Aylin_Inci_CV_TR.pdf` — Türkçe özgeçmiş
- `Aylin_Inci_CV_EN.pdf` — İngilizce özgeçmiş
- `.nojekyll` — GitHub Pages'in dosyaları olduğu gibi yayınlaması için

## Nasıl çalışıyor
- **Dil (TR/EN):** Türkçe sayfa `/`, İngilizce sayfa `/en/` adresinde; sağ üstteki TR/EN butonu iki sayfa arasında geçiş yapar. İki sayfa `hreflang` ile birbirine bağlı. Ana sayfada bir metni değiştirdiğinde İngilizcesini `en/index.html` içinde de güncelle.
- **Google Analytics:** `index.html` ve `en/index.html` içindeki `var GA_ID = '';` satırına GA4 ölçüm kimliğini (`G-...`) yaz. Kimlik girilince çerez onay banner'ı görünür ve Analytics yalnızca "Kabul Et" sonrası yüklenir.
- **Yeni blog yazısı:** `blog/` içine ekle, ardından `blog/index.html`, `sitemap.xml` ve `llms.txt` listelerine de ekle.
- **Tema:** Açık/koyu tema butonu; tercih tarayıcıda saklanır.
- **İletişim formu:** Ziyaretçinin e-posta uygulamasını açar ve mesajı `aylinvinci@gmail.com` adresine yönlendirir.
- **LinkedIn:** https://www.linkedin.com/in/aylin-inci/

## GitHub Pages'te yayınlama
1. Yeni bir repo oluştur (ör. `aylin-inci` veya `kullaniciadin.github.io`).
2. Bu klasördeki tüm dosyaları reponun köküne yükle (CV PDF'leri ve `.nojekyll` dahil).
3. Repo → **Settings → Pages** → *Source: Deploy from a branch* → **main / (root)**.
4. Birkaç dakika içinde site yayına girer.
5. Özel alan adı için **Settings → Pages → Custom domain** alanını kullan.

## Not
Formun ziyaretçinin mail uygulamasını açmadan doğrudan kutuna düşmesini istersen Formspree gibi ücretsiz bir servise geçebiliriz.
