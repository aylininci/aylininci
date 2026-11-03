// Draft-only copy edits for the post texts: no first person, plain and direct.
// Reported speech in quotes (a client's or a reader's words) is left as written.
const ALL = [
  // "Bu yazıda … anlatıyorum." → "Bu yazı … anlatıyor."
  [/Bu yazıda([^.]*?)anlatıyorum\./g, 'Bu yazı$1anlatıyor.'],
  [/Bu rehberde([^.]*?)anlatıyorum\./g, 'Bu rehber$1anlatıyor.'],
  [/Bu yazıda([^.]*?)ele alıyorum\./g, 'Bu yazı$1ele alıyor.'],
  ['yazımda daha ayrıntılı anlattım', 'yazısında daha ayrıntılı anlatılıyor'],
  ['yazımda ayrıntılı ele aldım', 'yazısında ayrıntılı ele alınıyor'],
  ['yazımda ayrıntılı anlattım', 'yazısında ayrıntılı anlatılıyor'],
  ['yazımda adım adım anlattım', 'yazısında adım adım anlatılıyor'],
  ['yazımda', 'yazısında'],
];
const BY = {
  'anahtar-kelime-kanibalizasyonu-analizi': [
    ['cümlesini SEO danışmanlığında sık duyarım', 'cümlesi SEO danışmanlığında sık duyulur'],
    ['Bunu belirlerken baktığım kriterler:', 'Bunu belirlerken bakılacak kriterler:'],
    ['En sık karşılaştığım üç senaryo:', 'En sık görülen üç senaryo:'],
    ['Danıştığım bir B2B yazılım şirketinde,', 'Bir B2B yazılım şirketinin sitesinde,'],
    ['ana sayfa olarak seçtik;', 'ana sayfa olarak seçildi;'],
    ['ana sayfaya taşıdık ve iki eski yazıyı 301 ile yönlendirdik', 'ana sayfaya taşındı ve iki eski yazı 301 ile yönlendirildi'],
    ['301 yönlendirme mi, canonical etiketi mi kullanmalıyım?', '301 yönlendirme mi, canonical etiketi mi kullanılmalı?'],
    ['Kanibalizasyonu düzelttikten sonra sonucu ne zaman görürüm?', 'Kanibalizasyon düzeltildikten sonra sonuç ne zaman görülür?'],
    ['Kanibalizasyonu önlemek için içerik takvimini nasıl kurmalıyım?', 'Kanibalizasyonu önlemek için içerik takvimi nasıl kurulmalı?'],
  ],
  'chatgpt-trafigi-ga4-olcumu': [
    ['GA4\'te yapay zeka asistanları için nasıl ayrı kanal oluştururum?', 'GA4\'te yapay zeka asistanları için ayrı kanal nasıl oluşturulur?'],
  ],
  'core-web-vitals-performans-optimizasyonu': [
    ['Sahada gördüğüm en yaygın yanılgı:', 'Sahada en sık görülen yanılgı:'],
    ['Sahada en sık karşılaştığım', 'Sahada en sık görülen'],
    ['Core Web Vitals iyileştirmesine ne kadar zaman ayırmalıyım?', 'Core Web Vitals iyileştirmesine ne kadar zaman ayrılmalı?'],
    ['yukarıda anlattığım', 'yukarıda anlatılan'],
  ],
  'google-ai-modu-seo': [
    ['elimizdeki verinin', 'eldeki verinin'],
    ['Bu tür rakamlara iki nedenle temkinli yaklaşıyorum:', 'Bu tür rakamlara iki nedenle temkinli yaklaşmak gerekiyor:'],
    ['Benim önerdiğim üç adımlık okuma şu:', 'Önerilen üç adımlık okuma şu:'],
    ['Tıklamalarım düştü; içeriği AI özetlerinden çıkarmalı mıyım?', 'Tıklamalar düştüyse içerik AI özetlerinden çıkarılmalı mı?'],
  ],
  'google-eylul-2026-spam-guncellemesi': [
    ['Konuyu <a', 'Konu <a'],
    ['Spam güncellemesinden etkilendiğimi nasıl anlarım?', 'Bir sitenin spam güncellemesinden etkilendiği nasıl anlaşılır?'],
    ['Spam güncellemesinden sonra ne kadar sürede toparlanırım?', 'Spam güncellemesinden sonra toparlanma ne kadar sürer?'],
  ],
  'shopify-agentic-storefronts-chatgpt': [
    ['Bu raporu <a', 'Bu rapor <a'],
    ['Ürünlerimin AI asistanları tarafından önerilmesi için ne yapmalıyım?', 'Ürünlerin AI asistanları tarafından önerilmesi için ne yapılmalı?'],
  ],
  'shopify-gecisi-seo-rehberi': [
    ['Shopify\'a geçince Google sıralamalarım düşer mi?', 'Shopify\'a geçince Google sıralamaları düşer mi?'],
    ['Shopify\'da en fazla kaç URL yönlendirmesi oluşturabilirim?', 'Shopify\'da en fazla kaç URL yönlendirmesi oluşturulabilir?'],
    ['Yönlendirmeleri ne kadar süre tutmalıyım?', 'Yönlendirmeler ne kadar süre tutulmalı?'],
  ],
  'shopify-liquid-performans-optimizasyonu': [
    ['Bu yazıda paylaştığım yöntemler', 'Bu yazıdaki yöntemler'],
    ['Danıştığım bir moda mağazasında,', 'Bir moda mağazasında,'],
    ['Sayfa kaynak kodunu incelediğimizde', 'Sayfa kaynak kodu incelendiğinde'],
    ['yüklendiğini gördük', 'yüklendiği görüldü'],
    ['örneğinde uyguladığımız değişikliklerin', 'örneğinde uygulanan değişikliklerin'],
    ['envanterini çıkarmanızı öneririm', 'envanterini çıkarmanız önerilir'],
    ['Her yeni section için ayrı bir JavaScript dosyası mı yüklemeliyim?', 'Her yeni section için ayrı bir JavaScript dosyası mı yüklenmeli?'],
  ],
  'yapay-zeka-arama-icin-icerik-yapisi': [
    ['Bu yazıyı yazarken kendi mesleki alanımdan (SEO ve web geliştirme danışmanlığı) örnekler kullanıyorum, ama', 'Örnekler SEO ve web geliştirme alanından seçildi, ama'],
    ['ilk yazımızda ele aldığımız ', ''],
    ['Danıştığım bir SaaS şirketinin', 'Bir SaaS şirketinin'],
    ['robots.txt üzerinden AI botlarını engellemeli miyim?', 'AI botları robots.txt üzerinden engellenmeli mi?'],
    ['yeniden yapılandırdık:', 'yeniden yapılandırıldı:'],
    ['bloğu ekledik;', 'bloğu eklendi;'],
    ['alt başlıkları soru formatına çevirdik;', 'alt başlıklar soru formatına çevrildi;'],
    ['şemasını ekledik.', 'şeması eklendi.'],
    ['İçeriği yeniden yazmadık; sadece zaten doğru olan bilgiyi, bir makinenin daha kolay ayrıştırabileceği bir düzene soktuk.', 'İçerik yeniden yazılmadı; zaten doğru olan bilgi, bir makinenin daha kolay ayrıştırabileceği bir düzene sokuldu.'],
  ],
  'yapay-zeka-icerik-google-seo': [
    ['Önerdiğim iş akışı şöyle:', 'Önerilen iş akışı şöyle:'],
    ['Yapay zekayla oluşturulmuş yazar profili kullanabilir miyim?', 'Yapay zekayla oluşturulmuş yazar profili kullanılabilir mi?'],
    ['sistemli bir değerlendirme öneririm:', 'sistemli bir değerlendirme önerilir:'],
    ['Bu süreci <a', 'Bu süreç <a'],
    ['Yapay zeka kullandığımı belirtmem gerekiyor mu?', 'Yapay zeka kullanıldığını belirtmek gerekiyor mu?'],
    ['Sitemde çok sayıda eski yapay zeka içeriği var, ne yapmalıyım?', 'Sitede çok sayıda eski yapay zeka içeriği varsa ne yapılmalı?'],
  ],
};
export function rewrite(slug, html, missing) {
  for (const [a, b] of BY[slug] || []) {
    if (!html.includes(a)) { missing.push(slug + ': ' + a.slice(0, 60)); continue; }
    html = html.split(a).join(b);
  }
  for (const [a, b] of ALL) html = typeof a === 'string' ? html.split(a).join(b) : html.replace(a, b);
  return html;
}
// Every edit must apply somewhere across the post's lead and body
export const seen = (slug) => (BY[slug] || []).map(([a]) => a);
// Same edits for text outside the body (structured data, meta), without the presence check
export function rewriteText(slug, s) {
  for (const [a, b] of BY[slug] || []) s = s.split(a).join(b);
  for (const [a, b] of ALL) s = typeof a === 'string' ? s.split(a).join(b) : s.replace(a, b);
  return s;
}
