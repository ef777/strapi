import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::yorum.yorum', ({ strapi }) => ({
  // Belirli bir haberin yorumlarini getir
  async findByHaber(ctx) {
    const { haberId } = ctx.params;

    const yorumlar = await strapi.entityService.findMany('api::yorum.yorum', {
      filters: {
        haber: { id: haberId },
        durum: 'onaylandi',
        parent_yorum: { id: { $null: true } }
      },
      populate: {
        kullanici: {
          fields: ['username']
        },
        cevaplar: {
          filters: { durum: 'onaylandi' },
          populate: {
            kullanici: {
              fields: ['username']
            }
          },
          sort: { createdAt: 'asc' }
        }
      },
      sort: { createdAt: 'desc' }
    });

    return yorumlar;
  },

  // Habere yorum ekle
  async createForHaber(ctx) {
    const { haberId } = ctx.params;
    const { icerik, parent_yorum, misafir_adi, misafir_email } = ctx.request.body;

    // Kullanici giris yapmis mi kontrol et
    const user = ctx.state.user;

    // Haber var mi kontrol et
    const haber = await strapi.entityService.findOne('api::haber.haber', haberId);
    if (!haber) {
      return ctx.notFound('Haber bulunamadi');
    }

    // Yorum icerigi bos mu kontrol et
    if (!icerik || icerik.trim().length === 0) {
      return ctx.badRequest('Yorum icerigi bos olamaz');
    }

    // Misafir ise isim ve email zorunlu
    if (!user && (!misafir_adi || !misafir_email)) {
      return ctx.badRequest('Misafir yorumlari icin isim ve e-posta zorunludur');
    }

    const yorum = await strapi.entityService.create('api::yorum.yorum', {
      data: {
        icerik: icerik.trim(),
        haber: haberId,
        parent_yorum: parent_yorum || null,
        kullanici: user?.id || null,
        misafir_adi: user ? null : misafir_adi,
        misafir_email: user ? null : misafir_email,
        durum: user ? 'onaylandi' : 'beklemede',
        ip_adresi: ctx.request.ip
      }
    });

    return {
      data: yorum,
      meta: {
        message: user
          ? 'Yorumunuz yayinlandi'
          : 'Yorumunuz onay bekliyor'
      }
    };
  },

  // Yorumu begen
  async like(ctx) {
    const { id } = ctx.params;

    const yorum = await strapi.entityService.findOne('api::yorum.yorum', id);
    if (!yorum) {
      return ctx.notFound('Yorum bulunamadi');
    }

    const updated = await strapi.entityService.update('api::yorum.yorum', id, {
      data: {
        begeni_sayisi: (yorum.begeni_sayisi || 0) + 1
      }
    });

    return updated;
  }
}));
