# Strapi Backend Kurulumu

## Hızlı Kurulum

```bash
# Yeni Strapi projesi oluştur
npx create-strapi-app@latest backend --quickstart

# veya TypeScript ile
npx create-strapi-app@latest backend --quickstart --typescript
```

## Manuel Kurulum (Önerilen)

```bash
npx create-strapi-app@latest backend

# Sorulara şu şekilde cevap ver:
# ? Choose your installation type: Custom (manual settings)
# ? Choose your preferred language: JavaScript (veya TypeScript)
# ? Choose your default database client: sqlite (geliştirme için)
# ? Start with an example structure & data? No
```

## Çalıştırma

```bash
cd backend
npm run develop
```

Admin panel: http://localhost:1337/admin

## İçerik Tiplerini Oluşturma

Admin panelde **Content-Type Builder** bölümüne git ve aşağıdaki modelleri oluştur:

---

### 1. Kategori (Category)

| Alan | Tip | Ayarlar |
|------|-----|---------|
| isim | Text | Required |
| slug | UID | Target: isim |
| aciklama | Text (Long) | - |
| renk | Text | Default: #e74c3c |
| ikon | Text | - |
| sira | Number (Integer) | Default: 0 |

---

### 2. Yazar (Author)

| Alan | Tip | Ayarlar |
|------|-----|---------|
| isim | Text | Required |
| slug | UID | Target: isim |
| email | Email | - |
| biyografi | Rich Text | - |
| foto | Media (Single) | Images only |
| sosyal_medya | JSON | - |
| aktif | Boolean | Default: true |

**sosyal_medya JSON örneği:**
```json
{
  "twitter": "https://twitter.com/username",
  "linkedin": "https://linkedin.com/in/username"
}
```

---

### 3. Etiket (Tag)

| Alan | Tip | Ayarlar |
|------|-----|---------|
| isim | Text | Required, Unique |
| slug | UID | Target: isim |

---

### 4. Haber (Article) - Ana Model

| Alan | Tip | Ayarlar |
|------|-----|---------|
| baslik | Text | Required |
| slug | UID | Target: baslik |
| ozet | Text (Long) | Max: 300 |
| icerik | Rich Text | Required |
| kapak_resmi | Media (Single) | Images only |
| kategori | Relation | Many-to-One with Kategori |
| yazar | Relation | Many-to-One with Yazar |
| etiketler | Relation | Many-to-Many with Etiket |
| yayin_tarihi | DateTime | Required |
| guncelleme_tarihi | DateTime | - |
| okunma_sayisi | Number (Integer) | Default: 0 |
| one_cikan | Boolean | Default: false |
| aktif | Boolean | Default: true |

---

### 5. Sayfa (Page) - Statik Sayfalar

| Alan | Tip | Ayarlar |
|------|-----|---------|
| baslik | Text | Required |
| slug | UID | Target: baslik |
| icerik | Rich Text | Required |
| meta_description | Text | Max: 160 |

---

## API Permissions

**Settings > Users & Permissions > Roles > Public**

Şu endpointlere `find` ve `findOne` izni ver:
- ✅ Haber (Article)
- ✅ Kategori (Category)
- ✅ Yazar (Author)
- ✅ Etiket (Tag)
- ✅ Sayfa (Page)

---

## API Token Oluşturma

**Settings > API Tokens > Create new API Token**

| Alan | Değer |
|------|-------|
| Name | Frontend API |
| Token type | Full access (veya Read-only) |
| Token duration | Unlimited |

Oluşturulan token'ı `.env.local` dosyasına ekle:
```
STRAPI_API_TOKEN=your-token-here
```

---

## Örnek Veri

Admin panelden şu sırayla veri ekle:

1. **Kategoriler:** Gündem, Ekonomi, Spor, Teknoloji, Magazin
2. **Yazarlar:** Test editör oluştur
3. **Etiketler:** son-dakika, ozel-haber, guncel
4. **Haberler:** Birkaç test haber ekle

---

## Production Ayarları

### Database (PostgreSQL)

```bash
npm install pg
```

`config/database.js`:
```javascript
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
```

### Upload (Cloudinary)

```bash
npm install @strapi/provider-upload-cloudinary
```

`config/plugins.js`:
```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    },
  },
});
```

---

## Faydalı Pluginler

```bash
# SEO
npm install @strapi/plugin-seo

# GraphQL (opsiyonel)
npm install @strapi/plugin-graphql

# Slug otomatik oluşturma
npm install strapi-plugin-slugify
```
