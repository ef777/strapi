import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Set public permissions
    await setPublicPermissions(strapi);
    
    // Check if data already exists
    const existingKategoriler = await strapi.entityService.findMany('api::kategori.kategori');
    
    if (existingKategoriler && existingKategoriler.length > 0) {
      console.log('📰 Örnek veriler zaten mevcut, seed atlanıyor...');
      return;
    }

    console.log('🌱 Örnek veriler ekleniyor...');

    // 1. Kategoriler
    const kategoriler = [
      { isim: 'Gündem', slug: 'gundem', renk: '#e74c3c', sira: 1, aktif: true, aciklama: 'Güncel haberler ve son gelişmeler' },
      { isim: 'Ekonomi', slug: 'ekonomi', renk: '#3498db', sira: 2, aktif: true, aciklama: 'Ekonomi ve finans haberleri' },
      { isim: 'Spor', slug: 'spor', renk: '#27ae60', sira: 3, aktif: true, aciklama: 'Spor haberleri ve sonuçlar' },
      { isim: 'Teknoloji', slug: 'teknoloji', renk: '#9b59b6', sira: 4, aktif: true, aciklama: 'Teknoloji ve bilim haberleri' },
      { isim: 'Dünya', slug: 'dunya', renk: '#f39c12', sira: 5, aktif: true, aciklama: 'Dünyadan haberler' },
      { isim: 'Sağlık', slug: 'saglik', renk: '#1abc9c', sira: 6, aktif: true, aciklama: 'Sağlık haberleri ve bilgileri' },
    ];

    const createdKategoriler: any[] = [];
    for (const kategori of kategoriler) {
      const created = await strapi.entityService.create('api::kategori.kategori', {
        data: { ...kategori, publishedAt: new Date() },
      });
      createdKategoriler.push(created);
    }
    console.log(`✅ ${createdKategoriler.length} kategori eklendi`);

    // 2. Yazarlar
    const yazarlar = [
      { isim: 'Ahmet Yılmaz', slug: 'ahmet-yilmaz', email: 'ahmet@habersitesi.com', biyografi: 'Gündem editörü, 10 yıllık deneyim', aktif: true },
      { isim: 'Fatma Demir', slug: 'fatma-demir', email: 'fatma@habersitesi.com', biyografi: 'Ekonomi muhabiri', aktif: true },
      { isim: 'Mehmet Kaya', slug: 'mehmet-kaya', email: 'mehmet@habersitesi.com', biyografi: 'Spor editörü', aktif: true },
      { isim: 'Ayşe Öztürk', slug: 'ayse-ozturk', email: 'ayse@habersitesi.com', biyografi: 'Teknoloji yazarı', aktif: true },
    ];

    const createdYazarlar: any[] = [];
    for (const yazar of yazarlar) {
      const created = await strapi.entityService.create('api::yazar.yazar', {
        data: { ...yazar, publishedAt: new Date() },
      });
      createdYazarlar.push(created);
    }
    console.log(`✅ ${createdYazarlar.length} yazar eklendi`);

    // 3. Etiketler
    const etiketler = [
      { isim: 'Son Dakika', slug: 'son-dakika' },
      { isim: 'Türkiye', slug: 'turkiye' },
      { isim: 'Ekonomi', slug: 'ekonomi-etiketi' },
      { isim: 'Dolar', slug: 'dolar' },
      { isim: 'Futbol', slug: 'futbol' },
      { isim: 'Basketbol', slug: 'basketbol' },
      { isim: 'Yapay Zeka', slug: 'yapay-zeka' },
      { isim: 'Kripto', slug: 'kripto' },
      { isim: 'Sağlık', slug: 'saglik-etiketi' },
      { isim: 'Eğitim', slug: 'egitim' },
    ];

    const createdEtiketler: any[] = [];
    for (const etiket of etiketler) {
      const created = await strapi.entityService.create('api::etiket.etiket', {
        data: { ...etiket, publishedAt: new Date() },
      });
      createdEtiketler.push(created);
    }
    console.log(`✅ ${createdEtiketler.length} etiket eklendi`);

    // 4. Haberler
    const haberler = [
      {
        baslik: 'Merkez Bankası Faiz Kararını Açıkladı',
        slug: 'merkez-bankasi-faiz-kararini-acikladi',
        ozet: 'Merkez Bankası Para Politikası Kurulu toplantısı sonrası faiz kararı açıklandı. Piyasalar yakından takip etti.',
        icerik: `<p>Türkiye Cumhuriyet Merkez Bankası (TCMB) Para Politikası Kurulu (PPK) toplantısı bugün gerçekleştirildi. Toplantı sonrasında açıklanan karara göre, politika faizi mevcut seviyesinde tutuldu.</p>
        <p>Kurul, enflasyondaki düşüş eğiliminin devam ettiğini ve para politikasındaki sıkı duruşun sürdürüleceğini belirtti. Ekonomistler, kararı beklentiler doğrultusunda değerlendirdi.</p>
        <p>Piyasalar karar sonrasında pozitif bir seyir izledi. Borsa İstanbul'da yükseliş yaşanırken, döviz kurlarında sakinlik gözlemlendi.</p>`,
        kategori: createdKategoriler[1].id, // Ekonomi
        yazar: createdYazarlar[1].id, // Fatma Demir
        etiketler: [createdEtiketler[2].id, createdEtiketler[3].id], // Ekonomi, Dolar
        yayin_tarihi: new Date(),
        durum: 'yayinda',
        manset: true,
        manset_sira: 1,
        sondakika: true,
        okunma_sayisi: 1520,
      },
      {
        baslik: 'Süper Lig\'de Haftanın Maçları Tamamlandı',
        slug: 'super-ligde-haftanin-maclari-tamamlandi',
        ozet: 'Süper Lig\'de bu hafta oynanan maçlar sonuçlandı. Liderlik yarışı kızışıyor.',
        icerik: `<p>Süper Lig'in 20. haftası heyecanlı maçlara sahne oldu. Hafta boyunca oynanan 10 maçta toplam 28 gol atıldı.</p>
        <p>Lider takım, deplasmanda aldığı galibiyetle puan farkını korudu. Takipçiler de kazanarak liderlik yarışını sürdürdü.</p>
        <p>Haftanın en dikkat çekici maçı, iki büyük takım arasında oynanan derbi oldu. Maç 2-2 beraberlikle sonuçlandı.</p>`,
        kategori: createdKategoriler[2].id, // Spor
        yazar: createdYazarlar[2].id, // Mehmet Kaya
        etiketler: [createdEtiketler[4].id], // Futbol
        yayin_tarihi: new Date(Date.now() - 3600000), // 1 saat önce
        durum: 'yayinda',
        manset: true,
        manset_sira: 2,
        sondakika: false,
        okunma_sayisi: 2340,
      },
      {
        baslik: 'Yapay Zeka Teknolojisinde Yeni Gelişmeler',
        slug: 'yapay-zeka-teknolojisinde-yeni-gelismeler',
        ozet: 'Dünya genelinde yapay zeka alanında önemli gelişmeler yaşanıyor. Yeni modeller tanıtıldı.',
        icerik: `<p>Yapay zeka teknolojisi hızla gelişmeye devam ediyor. Bu hafta büyük teknoloji şirketleri yeni yapay zeka modellerini tanıttı.</p>
        <p>Yeni modeller, özellikle doğal dil işleme ve görüntü tanıma alanlarında önemli ilerlemeler kaydetti. Uzmanlar, bu gelişmelerin birçok sektörü dönüştüreceğini belirtiyor.</p>
        <p>Türkiye'de de yapay zeka alanında önemli çalışmalar yapılıyor. Yerli şirketler ve üniversiteler, uluslararası projelerden pay almak için yarışıyor.</p>`,
        kategori: createdKategoriler[3].id, // Teknoloji
        yazar: createdYazarlar[3].id, // Ayşe Öztürk
        etiketler: [createdEtiketler[6].id], // Yapay Zeka
        yayin_tarihi: new Date(Date.now() - 7200000), // 2 saat önce
        durum: 'yayinda',
        manset: true,
        manset_sira: 3,
        sondakika: false,
        okunma_sayisi: 890,
      },
      {
        baslik: 'TBMM\'de Yeni Yasa Tasarısı Görüşüldü',
        slug: 'tbmmde-yeni-yasa-tasarisi-gorusuldu',
        ozet: 'TBMM Genel Kurulu\'nda önemli yasa tasarısı görüşüldü. Milletvekilleri değerlendirmelerini paylaştı.',
        icerik: `<p>Türkiye Büyük Millet Meclisi Genel Kurulu'nda bugün önemli bir yasa tasarısı görüşüldü. Tasarı, ekonomik reformları kapsıyor.</p>
        <p>Görüşmeler sırasında muhalefet partileri eleştirilerini dile getirirken, iktidar partisi tasarının önemini vurguladı.</p>
        <p>Tasarının yarın yapılacak oylamada kabul edilmesi bekleniyor.</p>`,
        kategori: createdKategoriler[0].id, // Gündem
        yazar: createdYazarlar[0].id, // Ahmet Yılmaz
        etiketler: [createdEtiketler[0].id, createdEtiketler[1].id], // Son Dakika, Türkiye
        yayin_tarihi: new Date(Date.now() - 10800000), // 3 saat önce
        durum: 'yayinda',
        manset: true,
        manset_sira: 4,
        sondakika: true,
        okunma_sayisi: 3210,
      },
      {
        baslik: 'Kripto Para Piyasalarında Son Durum',
        slug: 'kripto-para-piyasalarinda-son-durum',
        ozet: 'Bitcoin ve diğer kripto paralar bugün yükselişe geçti. Analistler piyasaları değerlendirdi.',
        icerik: `<p>Kripto para piyasaları bugün pozitif bir seyir izledi. Bitcoin, son 24 saatte yüzde 5'in üzerinde değer kazandı.</p>
        <p>Ethereum ve diğer büyük altcoinler de Bitcoin'in izinden giderek yükseliş kaydetti. Toplam piyasa değeri önemli bir artış gösterdi.</p>
        <p>Analistler, kurumsal yatırımcıların artan ilgisinin piyasayı desteklediğini belirtiyor.</p>`,
        kategori: createdKategoriler[1].id, // Ekonomi
        yazar: createdYazarlar[3].id, // Ayşe Öztürk
        etiketler: [createdEtiketler[7].id, createdEtiketler[2].id], // Kripto, Ekonomi
        yayin_tarihi: new Date(Date.now() - 14400000), // 4 saat önce
        durum: 'yayinda',
        manset: false,
        sondakika: false,
        okunma_sayisi: 1150,
      },
      {
        baslik: 'Sağlık Bakanlığı\'ndan Grip Sezonu Uyarısı',
        slug: 'saglik-bakanligindan-grip-sezonu-uyarisi',
        ozet: 'Sağlık Bakanlığı, grip sezonunda alınması gereken önlemleri açıkladı.',
        icerik: `<p>Sağlık Bakanlığı, kış aylarında artan grip vakalarına karşı vatandaşları uyardı. Bakanlık yetkilileri, aşı olmayı ve hijyen kurallarına uymayı önerdi.</p>
        <p>Açıklamada, özellikle kronik hastalığı olanların ve yaşlıların dikkatli olması gerektiği belirtildi.</p>
        <p>Bakanlık, grip belirtileri görüldüğünde en yakın sağlık kuruluşuna başvurulmasını tavsiye etti.</p>`,
        kategori: createdKategoriler[5].id, // Sağlık
        yazar: createdYazarlar[0].id, // Ahmet Yılmaz
        etiketler: [createdEtiketler[8].id], // Sağlık
        yayin_tarihi: new Date(Date.now() - 18000000), // 5 saat önce
        durum: 'yayinda',
        manset: false,
        sondakika: false,
        okunma_sayisi: 780,
      },
      {
        baslik: 'Dünya Liderleri İklim Zirvesi\'nde Buluştu',
        slug: 'dunya-liderleri-iklim-zirvesinde-bulustu',
        ozet: 'BM İklim Zirvesi başladı. Liderler iklim değişikliğiyle mücadele planlarını açıkladı.',
        icerik: `<p>Birleşmiş Milletler İklim Zirvesi bugün başladı. Dünya liderlerinin katıldığı zirvede iklim değişikliğiyle mücadele ele alınıyor.</p>
        <p>Zirvenin ilk gününde birçok ülke karbon emisyonu hedeflerini açıkladı. Türkiye de 2050 net sıfır hedefini yineledi.</p>
        <p>Zirve, önümüzdeki hafta boyunca devam edecek ve somut kararlarla sonuçlanması bekleniyor.</p>`,
        kategori: createdKategoriler[4].id, // Dünya
        yazar: createdYazarlar[1].id, // Fatma Demir
        etiketler: [createdEtiketler[0].id], // Son Dakika
        yayin_tarihi: new Date(Date.now() - 21600000), // 6 saat önce
        durum: 'yayinda',
        manset: true,
        manset_sira: 5,
        sondakika: false,
        okunma_sayisi: 1890,
      },
      {
        baslik: 'Basketbol Süper Ligi\'nde Heyecan Devam Ediyor',
        slug: 'basketbol-super-liginde-heyecan-devam-ediyor',
        ozet: 'Basketbol Süper Ligi\'nde kritik maçlar oynandı. Play-off yarışı kızışıyor.',
        icerik: `<p>Basketbol Süper Ligi'nde bu hafta önemli maçlar oynandı. Lider takım, zorlu deplasmandan galibiyetle döndü.</p>
        <p>Play-off hattındaki yarış giderek kızışıyor. Son haftalarda form grafiği yükselen takımlar, üst sıralara göz dikti.</p>
        <p>Lig, sezon sonuna kadar heyecanını koruyacak gibi görünüyor.</p>`,
        kategori: createdKategoriler[2].id, // Spor
        yazar: createdYazarlar[2].id, // Mehmet Kaya
        etiketler: [createdEtiketler[5].id], // Basketbol
        yayin_tarihi: new Date(Date.now() - 25200000), // 7 saat önce
        durum: 'yayinda',
        manset: false,
        sondakika: false,
        okunma_sayisi: 650,
      },
    ];

    for (const haber of haberler) {
      await strapi.entityService.create('api::haber.haber', {
        data: { ...haber, publishedAt: new Date() } as any,
      });
    }
    console.log(`✅ ${haberler.length} haber eklendi`);

    // 5. Site Ayarları
    await strapi.entityService.create('api::site-ayarlari.site-ayarlari', {
      data: {
        site_adi: 'Haber Sitesi',
        site_aciklamasi: 'Güncel haberler, son dakika gelişmeleri ve daha fazlası',
        iletisim_email: 'info@habersitesi.com',
        footer_text: '© 2026 Haber Sitesi. Tüm hakları saklıdır.',
        sosyal_medya: {
          twitter: 'https://twitter.com/habersitesi',
          facebook: 'https://facebook.com/habersitesi',
          instagram: 'https://instagram.com/habersitesi',
        },
      },
    });
    console.log('✅ Site ayarları eklendi');

    console.log('🎉 Örnek veriler başarıyla eklendi!');
  },
};

// Helper function to set public permissions
async function setPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    console.log('⚠️ Public role not found');
    return;
  }

  const permissions = [
    { action: 'api::haber.haber.find' },
    { action: 'api::haber.haber.findOne' },
    { action: 'api::kategori.kategori.find' },
    { action: 'api::kategori.kategori.findOne' },
    { action: 'api::yazar.yazar.find' },
    { action: 'api::yazar.yazar.findOne' },
    { action: 'api::etiket.etiket.find' },
    { action: 'api::etiket.etiket.findOne' },
    { action: 'api::site-ayarlari.site-ayarlari.find' },
  ];

  for (const perm of permissions) {
    const existingPerm = await strapi.query('plugin::users-permissions.permission').findOne({
      where: { action: perm.action, role: publicRole.id },
    });

    if (!existingPerm) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: { action: perm.action, role: publicRole.id },
      });
    }
  }

  console.log('✅ Public API izinleri ayarlandı');
}
