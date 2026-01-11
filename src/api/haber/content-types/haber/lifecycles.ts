// Haber lifecycle hooks - SEO ve arama motoru bildirimleri

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const SITE_URL = process.env.SITE_URL || 'https://example.com';
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '';

async function pingSearchEngines(slug: string, action: string = 'publish') {
  try {
    // Frontend API'yi cagir
    const response = await fetch(`${FRONTEND_URL}/api/ping-search-engines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, action }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`[SEO] Arama motorlari bilgilendirildi: ${slug}`, result);
    }
  } catch (error) {
    console.error(`[SEO] Ping hatasi: ${slug}`, error);
  }
}

async function directIndexNowPing(url: string) {
  if (!INDEXNOW_KEY) return;

  try {
    const host = new URL(SITE_URL).host;
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: [url],
      }),
    });
    console.log(`[IndexNow] Ping sonucu: ${response.status}`);
  } catch (error) {
    console.error('[IndexNow] Ping hatasi:', error);
  }
}

export default {
  // Haber olusturulduktan sonra
  async afterCreate(event) {
    const { result } = event;

    // Sadece yayinda olan haberler icin ping at
    if (result.durum === 'yayinda' && result.slug) {
      console.log(`[SEO] Yeni haber yayinlandi: ${result.slug}`);

      // Asenkron olarak ping at (response bekleme)
      setTimeout(() => {
        pingSearchEngines(result.slug, 'publish');
      }, 1000);
    }
  },

  // Haber guncellendikten sonra
  async afterUpdate(event) {
    const { result, params } = event;

    // Durum taslaktan yayindaya gectiginde
    if (result.durum === 'yayinda' && result.slug) {
      // Onceki durumu kontrol et (eger mumkunse)
      const previousData = params?.data;

      // Yayinda durumuna gecis veya icerik guncellemesi
      console.log(`[SEO] Haber guncellendi: ${result.slug}`);

      setTimeout(() => {
        pingSearchEngines(result.slug, 'update');
      }, 1000);
    }
  },

  // Haber silindikten sonra (URL'yi indexten kaldirmak icin)
  async afterDelete(event) {
    const { result } = event;

    if (result.slug) {
      console.log(`[SEO] Haber silindi: ${result.slug}`);
      // Silinen URL'yi IndexNow ile bildir (404 olacagi icin indexten duser)
      const url = `${SITE_URL}/haber/${result.slug}`;
      directIndexNowPing(url);
    }
  },
};
