// Writes the two new posts as source files in the same shape as the existing posts (live-src/blog).
import fs from 'node:fs';

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const tr = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const ext = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
const words = (h) => h.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

const POSTS = [
  {
    slug: 'shopify-fall-26-edition',
    date: '2026-11-03',
    cat: 'Shopify', catLang: 'en',
    title: "Shopify Fall '26 Edition: Mağazalar İçin Neler Değişti?",
    seoTitle: "Shopify Fall '26 Edition'da Neler Var? | Aylin İnci",
    h1: "Shopify Fall '26 Edition: Yapay Zeka Kanallarında ve SEO'da Ne Değişti?",
    desc: "Shopify Fall '26 Edition'da yapay zeka alışveriş kanalları, ürün verisi, Sidekick ve Canvas tarafında gelenler ve mağazanızda önce kontrol edilecekler.",
    ogDesc: 'Yapay zeka alışveriş ajanları, ajanlara giden işletme bilgileri, kanal bazında ürün verisi ve mağaza tarafındaki yenilikler.',
    crumb: "Shopify Fall '26 Edition",
    lead: "Shopify, 2022'den beri yılda iki kez yayımladığı Editions serisine ilk kez bir sonbahar sürümü ekledi. Fall '26 Edition'ın merkezinde yapay zeka alışveriş ajanları var: ürünleriniz artık ChatGPT, Claude, Copilot ve Google AI Modu gibi ortamlarda bulunup satın alınabiliyor. Bu yazı, 150'den fazla güncellemenin içinden bir mağazanın SEO'sunu, ürün verisini ve satış kanallarını doğrudan etkileyenleri ayırıyor.",
    related: ['shopify-agentic-storefronts-chatgpt', 'shopify-gecisi-seo-rehberi', 'shopify-liquid-performans-optimizasyonu', 'yapay-zeka-arama-icin-icerik-yapisi'],
    body: `
    <p>Shopify Editions, platformun yeni özelliklerini toplu olarak duyurduğu dönemsel sürümlerin adı. Ekim 2026'nın son haftasında yayımlanan Fall '26 Edition, serinin ilk sonbahar sürümü ve resmi sayfasında listelenen değişikliklerin büyük bölümü tek bir başlık altında toplanıyor: alışverişin yapay zeka ajanları üzerinden yapılması.</p>
    <p>Bu yazı, duyuruları tek tek saymak yerine bir mağaza sahibinin ya da SEO ve e-ticaret ekibinin bu hafta bakması gerekenleri sıralıyor. Bilgiler ${ext('https://www.shopify.com/editions/fall2026', "Shopify'ın Fall '26 Edition sayfasına")} dayanıyor; özelliklerin ülke bazında kullanılabilirliği sayfada belirtilmediği için her başlıkta yönetim panelinizden kontrol etmeniz gereken noktalar ayrıca not edildi.</p>

    <h2>1. Fall '26 Edition'ın ana teması: ajanlarla alışveriş</h2>
    <p><strong>Fall '26 Edition'ın en önemli değişikliği, bir Shopify mağazasının ürünlerinin artık yalnızca mağaza sitesinde değil, yapay zeka asistanlarının içinde de keşfedilip satın alınabilmesi.</strong> Shopify bunu birkaç katmanda kuruyor:</p>
    <ul>
      <li><strong>Shop skill:</strong> ChatGPT, Claude ve diğer ajanların ürünleri bulmasını, öneri sunmasını ve Shop Pay ile ödemeyi tamamlamasını sağlayan ortak beceri.</li>
      <li><strong>Google Arama ve AI Modu'nda satış:</strong> Alışveriş yapan kişi sohbetin içinden satın alıyor, ödeme Shopify üzerinden işliyor ve sipariş yönetim panelinize düşüyor.</li>
      <li><strong>Asistan bağlantıları:</strong> Mağazanızı Google Gemini, Microsoft Copilot ve Meta'nın asistanı Muse'a bağlayarak ürün, sipariş, stok ve indirim yönetmek mümkün hale geliyor.</li>
      <li><strong>Fiziksel mağazalar:</strong> Ajanlar, alışveriş yapan kişiyi en yakın mağaza noktasına yönlendirebiliyor.</li>
    </ul>
    <p>Bu altyapının ilk adımları Shopify Agentic Storefronts ile gelmişti. Kanalın nasıl çalıştığını ve Türkiye'deki mağazalar için bugünkü durumu <a href="/blog/shopify-agentic-storefronts-chatgpt">Shopify Agentic Storefronts</a> yazısında bulabilirsiniz. Fall '26 Edition bu kanalı daha fazla ajana ve Google'ın arama yüzeylerine genişletiyor.</p>

    <h2>2. Ajanlara giden işletme bilgileri artık onaylanabiliyor</h2>
    <p>Yeni "Your business details in AI channels" ekranı, yapay zeka kanallarına gönderilen iade politikası, kargo bilgisi ve sık sorulan sorular gibi işletme bilgilerini gözden geçirip onaylamanızı sağlıyor. Shopify bu ekranda içerik iyileştirmeleri de öneriyor.</p>
    <p>Bu, SEO açısından küçük görünen ama önemli bir değişiklik: Bir asistan kullanıcının "iade süresi kaç gün?" sorusunu artık sitenizdeki sayfayı yorumlayarak değil, sizin onayladığınız bilgiden cevaplayabiliyor. Politika sayfalarınızın net, güncel ve tek cümleyle cevap verebilir şekilde yazılması bu yüzden daha da önemli. Bu yazım biçiminin mantığı <a href="/blog/yapay-zeka-arama-icin-icerik-yapisi">yapay zeka destekli arama için içerik yapısı</a> yazısında anlatılıyor.</p>
    <div class="callout">
      <p><strong>Bu hafta yapılacak:</strong> İade, kargo ve teslimat sayfalarınızı açın; her birinin ilk paragrafının süre, ücret ve koşulu tek başına okunduğunda anlaşılır şekilde verdiğini kontrol edin. Sonra yönetim panelindeki işletme bilgileri ekranında ajanlara giden metni bu sayfalarla karşılaştırın.</p>
    </div>

    <h2>3. Ürün verisi: kanal bazında eşleme ve indirimli fiyat</h2>
    <p>Ajanların bir ürünü önermesi, büyük ölçüde ürün verisinin kalitesine bağlı. Fall '26 Edition bu tarafta üç yenilik getiriyor:</p>
    <table>
      <tr><th>Özellik</th><th>Ne yapıyor?</th></tr>
      <tr><td>Product data mapping by channel</td><td>Ürün verisini her satış kanalı için ayrı ayrı özelleştirip eşlemenizi ve katalog değiştikçe güncel tutmanızı sağlıyor.</td></tr>
      <tr><td>Compare-at price for AI agents</td><td>İndirimden önceki fiyatı Shopify Catalog üzerinden ajanlara iletiyor; ek bir kurulum gerekmiyor.</td></tr>
      <tr><td>Shopify Catalog uygunluk ekranı</td><td>Mağazanızın Shopify Catalog'a uygun olup olmadığını ve uygun hale gelmek için neyin değişmesi gerektiğini gösteriyor.</td></tr>
    </table>
    <p>Uygunluk ekranı, Türkiye'den yönetilen mağazalar için özellikle değerli: Duyurulan ajan özelliklerinin hangi pazarlarda açık olduğu Shopify'ın sayfasında belirtilmiyor, ancak bu ekran mağazanızın durumunu doğrudan gösteriyor.</p>
    <p>Ürün başlığı, açıklama, varyant, GTIN ve kategori alanlarının doğru doldurulması zaten iyi bir Shopify SEO'sunun temeliydi. Platform değiştirirken bu verinin nasıl korunacağı <a href="/blog/shopify-gecisi-seo-rehberi">Shopify'a geçişte SEO</a> rehberinde adım adım anlatılıyor; aynı kontrol listesi ajan kanalları için de geçerli.</p>

    <h2>4. Sidekick, Canvas ve tema tarafı</h2>
    <p>Shopify'ın yapay zeka asistanı Sidekick bu sürümde kod yazabiliyor, birden fazla değişikliği aynı anda hazırlayabiliyor ve internette araştırma yapabiliyor. Önerdiği mağaza iyileştirmelerini SimGym ile test edip sonuçları gösteriyor; hangisinin uygulanacağına siz karar veriyorsunuz. Temanın nasıl kurulduğunu ve tasarım tercihlerinizi markdown dosyalarıyla Sidekick'e öğretmek de mümkün.</p>
    <p>Canvas ise mağazanın tamamını tek bir görünümde düzenlemenizi sağlayan yeni tasarım alanı. Shopify ayrıca online mağaza sayfalarının artık yalnızca o sayfanın kullandığı CSS'i yükleyerek daha hızlı açıldığını belirtiyor.</p>
    <p>Bu araçlar tema değişikliğini hızlandırıyor, ama her yeni bölüm ve uygulama sayfaya maliyet ekliyor. Sidekick ya da Canvas ile yapılan değişikliklerden sonra Core Web Vitals değerlerini kontrol etmek için <a href="/blog/shopify-liquid-performans-optimizasyonu">Shopify Liquid performansı</a> yazısındaki alışkanlıklar doğrudan uygulanabilir.</p>

    <h2>5. Mağaza içi arama ve dil desteği</h2>
    <ul>
      <li><strong>Tahmine dayalı arama:</strong> Mağaza içi arama, kullanıcı yazarken daha iyi öneriler sunuyor. Shopify'a göre aramadan sepete ekleme oranı %8 arttı.</li>
      <li><strong>Çeviriler:</strong> Mağazada yapılan her düzenleme, Shopify Translate &amp; Adapt ile çevrilmiş sürümlerde de güncel kalıyor. Türkçe ve İngilizce satış yapan mağazalarda çeviri sayfalarının eski kalması, hreflang hatalarının sık görülen nedenlerinden biriydi.</li>
      <li><strong>Yeni diller:</strong> Arapça, İbranice ve Urduca gibi sağdan sola yazılan diller ve 13 yeni dil desteği eklendi.</li>
    </ul>

    <h2>6. Pazarlama ve ölçümleme</h2>
    <p>Campaign Autopilot, yapay zeka destekli kampanyaları yeni kanallarda yönetiyor ve Shopify'ın açıklamasına göre SEO'yu da yönetiyor. Duyuruda SEO tarafının kapsamı ayrıntılı anlatılmıyor; bu yüzden otomatik değişikliklerin başlık, açıklama ve URL'lere neler yaptığını takip etmek önemli.</p>
    <p>Birleşik pazarlama raporları ise trafik kaynaklarını ayırarak hangi kanalın satış getirdiğini daha az hatalı göstermeyi amaçlıyor. Yapay zeka asistanlarından gelen trafiğin analitikte nasıl kaybolabildiğini <a href="/blog/chatgpt-trafigi-ga4-olcumu">ChatGPT trafiğini GA4'te ölçmek</a> yazısında görebilirsiniz; Shopify raporlarını GA4 verisiyle karşılaştırmak bu dönemde iyi bir kontrol yöntemi.</p>

    <h2>7. Mağazanızda önce kontrol edilecekler</h2>
    <ul class="checklist">
      <li>Shopify Catalog uygunluk ekranında mağazanızın durumunu kontrol edin.</li>
      <li>İade, kargo ve sık sorulan sorular sayfalarını ajanlara giden işletme bilgileriyle karşılaştırın.</li>
      <li>En çok satan 20 ürünün başlık, açıklama, varyant ve GTIN alanlarını tamamlayın.</li>
      <li>İndirimli ürünlerde karşılaştırma fiyatının doğru girildiğini doğrulayın.</li>
      <li>Sidekick veya Canvas ile yapılan her tema değişikliğinden sonra mobil Core Web Vitals değerlerine bakın.</li>
      <li>Çevrilmiş sayfaların güncel kaldığını ve hreflang etiketlerinin doğru sayfaları gösterdiğini kontrol edin.</li>
      <li>Shopify'ın birleşik pazarlama raporunu GA4'teki kanal verisiyle karşılaştırın.</li>
    </ul>

    <h2>Sonuç</h2>
    <p>Fall '26 Edition, Shopify mağazası için "arama motorunda görünmek" ile "yapay zeka asistanında önerilmek" arasındaki farkı küçültüyor: İkisinin de temelinde aynı şey var, yani doğru, eksiksiz ve tutarlı ürün ve işletme verisi. Yeni özelliklerin bir kısmı her pazarda aynı anda açılmayabilir; ancak veri hazırlığı bugün yapılabilecek ve her kanalda işe yarayacak tek adım.</p>

    <h2>Sık sorulan sorular</h2>
    <div class="faq-item">
      <h3>Shopify Fall '26 Edition nedir?</h3>
      <p>Shopify'ın yeni özelliklerini toplu duyurduğu Editions serisinin ilk sonbahar sürümüdür. Ekim 2026'nın son haftasında yayımlandı ve 150'den fazla güncellemenin büyük kısmı yapay zeka alışveriş ajanları, Sidekick ve mağaza tasarımıyla ilgili.</p>
    </div>
    <div class="faq-item">
      <h3>Fall '26 Edition'daki ajan özellikleri Türkiye'deki mağazalarda kullanılabiliyor mu?</h3>
      <p>Shopify'ın duyuru sayfasında ülke bazında kullanılabilirlik belirtilmiyor. Mağazanızın durumunu yönetim panelindeki Shopify Catalog uygunluk ekranından kontrol edebilirsiniz; bu ekran mağazanın uygun olup olmadığını ve neyin değişmesi gerektiğini gösteriyor.</p>
    </div>
    <div class="faq-item">
      <h3>Yapay zeka ajanları ürün bilgilerini nereden alıyor?</h3>
      <p>Ürün bilgileri Shopify Catalog üzerinden, iade ve kargo gibi işletme bilgileri ise yönetim panelinde onayladığınız işletme bilgileri ekranından ajanlara iletiliyor. Bu yüzden ürün verisinin ve politika sayfalarının doğru ve güncel olması öneriyi doğrudan etkiliyor.</p>
    </div>
    <div class="faq-item">
      <h3>Fall '26 Edition SEO'yu etkiliyor mu?</h3>
      <p>Doğrudan bir sıralama değişikliği getirmiyor, ancak ürün verisi, sayfa hızı, çeviri güncelliği ve Campaign Autopilot'un SEO yönetimi gibi başlıklar mağazanın arama görünürlüğünü etkileyen alanlara dokunuyor. Otomatik yapılan değişikliklerin takip edilmesi önerilir.</p>
    </div>
`,
  },
  {
    slug: 'robots-txt-yapay-zeka-egitimi',
    date: '2026-11-06',
    cat: 'Teknik SEO',
    title: 'robots.txt ile Yapay Zeka Eğitimini Kontrol Etmek',
    seoTitle: 'robots.txt ile Yapay Zeka Eğitimi Kontrolü | Aylin İnci',
    h1: 'robots.txt ile Yapay Zeka Eğitimini Kontrol Etmek: Yeni Ortak Sinyal',
    desc: "Google'ın desteklemeyi planladığı ortak yapay zeka eğitim sinyali, Google-Extended ile ilişkisi ve robots.txt'de yapay zeka botları için doğru ayarlar.",
    ogDesc: 'Ortak AI eğitim sinyali __usage_ai-training, Google-Extended ile ilişkisi ve robots.txt için örnek ayarlar.',
    crumb: 'robots.txt ile yapay zeka eğitimi',
    lead: "Google, 30 Ekim 2026'da robots.txt üzerinden çalışan ortak bir yapay zeka eğitimi kontrolünü desteklemeyi planladığını duyurdu. Bu sinyal, içeriğinizin yapay zeka modellerinin eğitiminde kullanılmasına dair tercihinizi tek bir kuralla birden fazla sağlayıcıya bildirmeyi amaçlıyor. Bu yazı sinyalin nasıl yazıldığını, Google-Extended ile ilişkisini ve sitenizin robots.txt dosyasında bugün neyi değiştirmeniz gerektiğini anlatıyor.",
    related: ['yapay-zeka-arama-icin-icerik-yapisi', 'google-ai-modu-seo', 'yapay-zeka-icerik-google-seo', 'shopify-fall-26-edition'],
    body: `
    <p>Bugün bir site sahibi içeriğinin yapay zeka eğitiminde kullanılmasını istemiyorsa, her şirketin botunu robots.txt dosyasına tek tek yazmak zorunda: Google için Google-Extended, OpenAI için GPTBot ve diğerleri. Yeni bot isimleri çıktıkça liste uzuyor ve dosyayı güncel tutmak zorlaşıyor.</p>
    <p>${ext('https://developers.google.com/search/blog/2026/10/ai-training-control', "Google'ın Search Central blogunda 30 Ekim 2026'da yayımlanan duyuru")} bu soruna ortak bir çözüm öneriyor: IETF'in yapay zeka tercihleri (AIPREF) çalışmasına dayanan ve tüm sağlayıcıların okuyabileceği tek bir "politika belirteci".</p>

    <h2>1. Ortak eğitim sinyali nedir?</h2>
    <p><strong>Ortak eğitim sinyali, robots.txt dosyasında <code>__usage_ai-training</code> adlı bir politika belirteciyle yazılan ve içeriğin yapay zeka eğitiminde kullanılmasına dair tercihi bildiren bir kural grubudur.</strong> Belirteç, ${ext('https://datatracker.ietf.org/doc/draft-kelley-aipref-training-preference-signal/', 'IETF taslağı draft-kelley-aipref-training-preference-signal')} ile tanımlanıyor ve "yapay zeka eğitimi" kavramının anlamını IETF AIPREF çalışma grubunun ortak sözlüğünden alıyor.</p>
    <p>Sinyal yeni bir söz dizimi getirmiyor; robots.txt standardının (RFC 9309) bildiğimiz kural grubu yapısını kullanıyor. Taslaktaki örnek şu:</p>
    <pre><code>User-Agent: __usage_ai-training
Disallow: /
Allow: /press-kit/</code></pre>
    <p>Bu grup, sitenin tamamı için yapay zeka eğitimine karşı, <code>/press-kit/</code> klasörü için ise lehte bir tercih bildiriyor. Taslağa göre <code>Disallow</code> eğitime karşı, <code>Allow</code> ise eğitimden yana bir tercih anlamına geliyor.</p>
    <div class="callout">
      <p><strong>Önemli:</strong> Taslak şu an bireysel bir IETF taslağı; IETF tarafından onaylanmış bir standart değil. Google ise bu kontrolü diğer yapay zeka sağlayıcılarıyla birlikte 2027'de desteklemeyi hedeflediğini belirtiyor. Yani belirteci bugün eklemek zarar vermez, ama tek başına bugün bir şeyi engellemez.</p>
    </div>

    <h2>2. Tarama kuralı değil, kullanım tercihi</h2>
    <p>Bu sinyalin en sık yanlış anlaşılabilecek yönü şu: <code>__usage_ai-training</code> bir tarama kuralı değil. Taslak bunu açıkça belirtiyor; belirteç botların sitenizi tarayıp taramayacağını değil, taranan içeriğin eğitimde kullanılıp kullanılmayacağına dair tercihinizi bildiriyor. Taramayı sınırlamak isteyen bir site, botların kendi isimleriyle yazılan grupları kullanmaya devam etmeli.</p>
    <p>İki ayrıntı daha önemli:</p>
    <ul>
      <li><strong><code>User-agent: *</code> bu belirteci kapsamaz.</strong> Taslağa göre joker grup, politika belirteci için kullanılamaz; tercihinizi ayrı bir grupla yazmanız gerekir.</li>
      <li><strong>Grup yoksa tercih de yok.</strong> robots.txt dosyanızda <code>__usage_ai-training</code> grubu bulunmuyorsa, herhangi bir tercih bildirmemiş sayılırsınız.</li>
    </ul>

    <h2>3. Google-Extended ile ilişkisi</h2>
    <p>Google-Extended, Google'ın içeriğinizi Gemini modellerinin eğitimi ve Gemini uygulamalarında yanıtların temellendirilmesi için kullanmasını kontrol eden robots.txt belirteci. ${ext('https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers', "Google'ın tarayıcı belgelerine")} göre Google-Extended, sitenin Google Arama'ya dahil edilmesini ya da sıralamasını etkilemiyor.</p>
    <p>Duyuruya göre yeni sinyalle Google-Extended şöyle birlikte çalışacak:</p>
    <table>
      <tr><th>Durum</th><th>Google'ın yorumu</th></tr>
      <tr><td>Ortak sinyalle eğitime karşı tercih var, Google-Extended için ayrı kural yok</td><td>Google-Extended engellenmiş gibi değerlendirilir</td></tr>
      <tr><td>Ortak sinyalle eğitime karşı tercih var, Google-Extended açıkça izinli</td><td>Gemini uygulamalarında temellendirme yoluyla görünmeye ve tıklama almaya uygun kalır</td></tr>
      <tr><td>Şirkete özel kurallar var</td><td>Ortak sinyalin yanında çalışmaya devam eder</td></tr>
    </table>
    <p>Bu tablo, "eğitime kapalı ama Gemini'de kaynak olarak görünmeye açık" gibi ince ayarların mümkün olduğunu gösteriyor. Duyuru, sinyalin AI Bakışı ya da AI Modu üzerindeki etkisinden söz etmiyor. Arama sonuçlarındaki yapay zeka özelliklerinde görünmeyi sınırlamak için kullanılan <code>nosnippet</code> ve <code>max-snippet</code> gibi kontroller ayrı bir konu; bunlar <a href="/blog/google-ai-modu-seo">Google AI Modu ve SEO</a> yazısının "AI özelliklerinde görünmek istemezseniz" bölümünde anlatılıyor.</p>

    <h2>4. Eğitim, arama ve kullanıcı istekleri birbirinden ayrı</h2>
    <p>Yapay zeka şirketleri genellikle farklı işler için farklı botlar kullanıyor. Örneğin ${ext('https://developers.openai.com/api/docs/bots', 'OpenAI')}, model eğitimi için GPTBot'u, ChatGPT arama sonuçları için ise OAI-SearchBot'u ayrı belirteçlerle tanımlıyor. Bu ayrım önemli, çünkü:</p>
    <ul>
      <li>Eğitim botunu engellemek, içeriğinizin gelecekteki modellerin eğitiminde kullanılmasını sınırlar.</li>
      <li>Arama botunu engellemek ise içeriğinizin o asistanın arama yanıtlarında kaynak olarak gösterilmesini engelleyebilir ve trafik kaybına yol açabilir.</li>
    </ul>
    <p>Yapay zeka destekli aramada kaynak olarak seçilmenin ne kadar değerli olduğu <a href="/blog/yapay-zeka-arama-icin-icerik-yapisi">yapay zeka destekli arama için içerik yapısı</a> yazısında anlatılıyor. Bu yüzden "tüm yapay zeka botlarını engelle" kararı, çoğu işletme sitesi için görünürlük kaybı anlamına gelir.</p>

    <h2>5. robots.txt için örnek ayarlar</h2>
    <h3>Eğitime kapalı, aramaya açık</h3>
    <p>Yayıncılar ve içeriğin kendisini satan siteler için yaygın tercih budur. Ortak sinyal 2027'de desteklenmeye başlayana kadar şirket bazlı kuralların da yazılması gerekir:</p>
    <pre><code># Ortak eğitim sinyali (destek 2027'de bekleniyor)
User-Agent: __usage_ai-training
Disallow: /

# Bugün geçerli şirket bazlı kurallar
User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

# Arama botları ve Googlebot için kural yok: aramada görünmeye devam eder
User-agent: *
Allow: /

Sitemap: https://www.ornek.com/sitemap.xml</code></pre>
    <h3>Her şeye açık</h3>
    <p>Hizmet ve e-ticaret sitelerinin çoğu için yapay zeka asistanlarında görünmek bir kazançtır. Bu durumda engelleyici bir kural yazmamak yeterlidir; isterseniz tercihinizi açıkça belirtebilirsiniz:</p>
    <pre><code>User-Agent: __usage_ai-training
Allow: /</code></pre>
    <h3>Bölüm bazında tercih</h3>
    <p>Blog yazılarının eğitimde kullanılmasına izin verip ücretli rehberleri dışarıda tutmak gibi ayrımlar da mümkün:</p>
    <pre><code>User-Agent: __usage_ai-training
Allow: /
Disallow: /rehberler/</code></pre>
    <p>Shopify mağazalarında robots.txt dosyası doğrudan değil, ${ext('https://shopify.dev/docs/storefronts/themes/seo/robots-txt', 'Shopify belgelerinde anlatıldığı gibi')} temaya eklenen <code>robots.txt.liquid</code> şablonu üzerinden düzenleniyor. Tema dosyalarına dokunurken dikkat edilmesi gerekenler <a href="/blog/shopify-liquid-performans-optimizasyonu">Shopify Liquid geliştirmelerinde performans</a> yazısında, mağazaların yapay zeka kanallarındaki son durumu ise <a href="/blog/shopify-fall-26-edition">Shopify Fall '26 Edition</a> yazısında bulunuyor.</p>

    <h2>6. Hangi site ne seçmeli?</h2>
    <table>
      <tr><th>Site türü</th><th>Önerilen yaklaşım</th></tr>
      <tr><td>Haber ve içerik yayıncısı</td><td>Eğitime kapalı, aramaya açık. Google-Extended ve eğitim botlarını engelleyin, arama botlarına dokunmayın.</td></tr>
      <tr><td>E-ticaret</td><td>Genellikle her şeye açık. Ürünlerin asistanlarda önerilmesi satış getirir.</td></tr>
      <tr><td>Hizmet ve kurumsal site</td><td>Genellikle her şeye açık. Marka ve uzmanlık bilgisinin asistanlarda doğru aktarılması önemli.</td></tr>
      <tr><td>Ücretli içerik ve eğitim platformu</td><td>Bölüm bazında tercih. Ücretsiz tanıtım içeriği açık, ücretli içerik kapalı.</td></tr>
    </table>
    <p>Hangi yolu seçerseniz seçin, Googlebot'u engellemeyin: Bu, sitenizi Google Arama'dan tamamen çıkarır ve yapay zeka eğitimiyle ilgisi yoktur.</p>

    <h2>7. 2027'ye kadar takip edilecekler</h2>
    <ul class="checklist">
      <li>Google'ın duyuruda söz verdiği ilerleme güncellemelerini Search Central blogundan takip edin.</li>
      <li>IETF taslağının çalışma grubu belgesine dönüşüp dönüşmediğini ve belirteç adının değişip değişmediğini kontrol edin.</li>
      <li>Diğer yapay zeka sağlayıcılarının sinyali desteklediğini resmi belgelerinde açıklayıp açıklamadığını izleyin.</li>
      <li>robots.txt dosyanızı her değiştirdiğinizde Search Console'daki robots.txt raporuyla doğrulayın.</li>
      <li>Yapay zeka asistanlarından gelen trafiği analitikte ayrı bir kanal olarak izleyin ki bir değişikliğin etkisini görebilesiniz.</li>
    </ul>

    <h2>Sonuç</h2>
    <p>Ortak eğitim sinyali, yapay zeka tercihlerini robots.txt'de yönetmeyi sadeleştirmeyi vaat ediyor, ancak henüz bir taslak ve desteği 2027'de bekleniyor. Bugün yapılması gereken, eğitim ile aramayı birbirinden ayırarak bilinçli bir tercih yapmak ve bu tercihi şirket bazlı kurallarla uygulamaya devam etmek. Google'ın yapay zeka içeriğiyle ilgili diğer güncel değişiklikleri <a href="/blog/yapay-zeka-icerik-google-seo">yapay zeka içeriği ve Google</a> yazısında bulabilirsiniz.</p>

    <h2>Sık sorulan sorular</h2>
    <div class="faq-item">
      <h3>__usage_ai-training nedir?</h3>
      <p>robots.txt dosyasında içeriğin yapay zeka eğitiminde kullanılmasına dair tercihi bildirmek için önerilen ortak politika belirtecidir. IETF taslağı draft-kelley-aipref-training-preference-signal ile tanımlanır ve bir tarama kuralı değil, kullanım tercihidir.</p>
    </div>
    <div class="faq-item">
      <h3>Google bu sinyali ne zaman desteklemeye başlayacak?</h3>
      <p>Google, 30 Ekim 2026 tarihli duyurusunda bu kontrolü diğer yapay zeka sağlayıcılarıyla birlikte 2027'de desteklemeyi hedeflediğini belirtiyor. O zamana kadar Google-Extended gibi şirket bazlı kurallar geçerliliğini koruyor.</p>
    </div>
    <div class="faq-item">
      <h3>Yapay zeka eğitimini engellemek Google sıralamasını etkiler mi?</h3>
      <p>Google'ın belgelerine göre Google-Extended, sitenin Google Arama'ya dahil edilmesini ve sıralamasını etkilemez. Googlebot'u engellemek ise siteyi aramadan çıkarır; bu yüzden eğitim tercihleri için Googlebot'a dokunulmamalıdır.</p>
    </div>
    <div class="faq-item">
      <h3>User-agent: * kuralı yapay zeka eğitimini de kapsar mı?</h3>
      <p>Hayır. Taslağa göre joker grup, ortak eğitim belirteci yerine kullanılamaz. Tercihinizi bildirmek için User-Agent satırında __usage_ai-training yazan ayrı bir grup gerekir.</p>
    </div>
`,
  },
];

for (const p of POSTS) {
  const rt = Math.max(3, Math.round(words(p.lead + p.body) / 200));
  const url = `https://aylininci.com/blog/${p.slug}`, og = `https://aylininci.com/blog/images/${p.slug}-og.jpg`;
  const RELATED_TEXT = {
    'shopify-agentic-storefronts-chatgpt': ['Shopify Agentic Storefronts', "ChatGPT, Copilot ve AI Modu'nda satış için veri hazırlığı"],
    'shopify-gecisi-seo-rehberi': ["Shopify'a geçişte SEO", 'URL envanteri, 301 yönlendirme ve yayın günü kontrolü'],
    'shopify-liquid-performans-optimizasyonu': ['Shopify Liquid performansı', 'Tema değişikliklerinde hızı korumak'],
    'yapay-zeka-arama-icin-icerik-yapisi': ['Yapay zeka araması için içerik yapısı', 'GEO için yapılandırılmış veri ve içerik netliği'],
    'google-ai-modu-seo': ['Google AI Modu ve SEO', 'AI Modu trafiği ve Search Console Üretken AI raporu'],
    'yapay-zeka-icerik-google-seo': ['Yapay zeka içeriği ve Google', "Google'ın Ekim 2026 içerik rehberi güncellemesi"],
    'shopify-fall-26-edition': ["Shopify Fall '26 Edition", 'Yapay zeka alışveriş kanallarında ve ürün verisinde yenilikler'],
  };
  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${p.seoTitle}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow">
<meta name="author" content="Aylin İnci">
<meta property="og:type" content="article">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.ogDesc}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Aylin İnci">
<meta property="og:locale" content="tr_TR">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="article:published_time" content="${p.date}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${p.title}">
<meta name="twitter:description" content="${p.ogDesc}">
<meta name="twitter:image" content="${og}">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', image: og, headline: p.title, description: p.desc, author: { '@type': 'Person', '@id': 'https://aylininci.com/#person', name: 'Aylin İnci', url: 'https://aylininci.com/' }, publisher: { '@id': 'https://aylininci.com/#person' }, datePublished: p.date, dateModified: p.date, inLanguage: 'tr', mainEntityOfPage: { '@type': 'WebPage', '@id': url } }, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Anasayfa', item: 'https://aylininci.com/' }, { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://aylininci.com/blog/' }, { '@type': 'ListItem', position: 3, name: p.crumb, item: url }] }, null, 2)}
</script>
<script type="application/ld+json">
{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": []}
</script>
</head>
<body>
<main id="main">
<article>
  <header class="article-head">
    <div class="wrap">
      <span class="eyebrow"${p.catLang ? ` lang="${p.catLang}"` : ''}>${p.cat}</span>
      <h1>${p.h1}</h1>
      <div class="meta-row">
        <span>Aylin İnci</span>
        <span>·</span>
        <span>${tr(p.date)}</span>
        <span>·</span>
        <span>Yaklaşık ${rt} dakika okuma</span>
      </div>
      <p class="lead">${p.lead}</p>
    </div>
  </header>

  <div class="content wrap">
${p.body}
    <div class="author-box">
      <div>
        <strong>Aylin İnci</strong>
        <span>SEO, GEO ve web geliştirme üzerine çalışıyor. <a href="https://www.linkedin.com/in/aylin-inci/" target="_blank" rel="noopener">LinkedIn</a></span>
      </div>
    </div>
  </div>

  <div class="related wrap">
    <h2>İlgili içerikler</h2>
    <div class="related-list">
${p.related.map((s) => `      <a href="/blog/${s}">${RELATED_TEXT[s][0]}<span>${RELATED_TEXT[s][1]}</span></a>`).join('\n')}
    </div>
  </div>
</article>
</main>
</body>
</html>
`;
  fs.writeFileSync(`live-src/blog/${p.slug}.html`, html);
  console.log(p.slug, '| words', words(p.lead + p.body), '| read', rt, 'min | seoTitle', p.seoTitle.length, '| desc', p.desc.length, '| h1', p.h1.length);
}
