import { titleKeys } from './reading-orders.service';
import {
  findReadingOrder,
  READING_ORDERS,
  type ReadingOrderEntry,
} from './data/reading-orders.data';

/**
 * Okuma sırasının değeri iki şeye bağlı: listenin kendisi doğru dizilmiş
 * olmalı ve duraklar arşivle **doğru** eşleşmeli. İkisi de sessizce bozulur —
 * yanlış eşleşen durak "sende var" der ve kimse fark etmez. Bu yüzden burada
 * ağ YOK, sabit veriyle sınanıyor.
 */

function entry(partial: Partial<ReadingOrderEntry>): ReadingOrderEntry {
  return {
    order: 1,
    year: 1950,
    position: { track: 'Ara Kitap', index: null },
    originalTitle: 'Foundation',
    titles: ['Vakıf'],
    sourceSlug: null,
    ...partial,
  };
}

describe('titleKeys', () => {
  it('orijinal adı ve Türkçe adların hepsini anahtara çevirir', () => {
    expect(
      titleKeys(
        entry({
          originalTitle: 'The Naked Sun',
          titles: ['Güneşin Tanrıları', 'Çıplak Güneş'],
        }),
      ),
    ).toEqual(['the-naked-sun', 'gunesin-tanrilari', 'ciplak-gunes']);
  });

  /**
   * Orijinal ad sütununda eğik çizgi **iki ayrı İngilizce adı** ayırıyor.
   * Bölünmeseydi anahtar "the-stars-like-dust-the-rebellious-stars" olur ve
   * arşivdeki hiçbir kayda tutmazdı.
   */
  it('orijinal addaki eğik çizgiyi iki ayrı ada böler', () => {
    expect(
      titleKeys(
        entry({
          originalTitle: 'The Stars Like Dust / The Rebellious Stars',
          titles: [],
        }),
      ),
    ).toEqual(['the-stars-like-dust', 'the-rebellious-stars']);
  });

  it('katlanınca boşalan adı anahtar saymaz', () => {
    // `slugify` ASCII dışı yazıyı tamamen eliyor; boş anahtar arşivde
    // alakasız bir kayda tutardı
    expect(titleKeys(entry({ originalTitle: '雪国', titles: [] }))).toEqual([]);
  });
});

describe('okuma sırası verisi', () => {
  it('her sıranın anahtarı tekil', () => {
    const keys = READING_ORDERS.map((order) => order.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('duraklar 1den başlayıp kesintisiz gidiyor', () => {
    for (const order of READING_ORDERS) {
      const numbers = order.entries.map((item) => item.order);
      expect(numbers).toEqual(
        Array.from({ length: order.entries.length }, (_, i) => i + 1),
      );
    }
  });

  it('her durağın en az bir aranabilir adı var', () => {
    for (const order of READING_ORDERS) {
      for (const item of order.entries) {
        expect(titleKeys(item).length).toBeGreaterThan(0);
      }
    }
  });

  it('Vakıf evreni listesi tabloyla aynı uzunlukta', () => {
    // Kaynak tablo 17 satır; eksilme ya da tekrar sessizce olmasın
    expect(findReadingOrder('vakif')?.entries).toHaveLength(17);
  });

  it('bilinmeyen anahtar için tanım dönmez', () => {
    expect(findReadingOrder('yok-boyle-bir-sey')).toBeUndefined();
  });

  /**
   * Kaynak anahtarları tek tek ölçüldü (kaynakta arandı, yazarı doğrulandı).
   * Biçim bozulursa hem künye sayfası hem "tek tıkla ekle" sessizce düşer.
   */
  it('kaynak anahtarları kimlik ekiyle yazılmış', () => {
    for (const order of READING_ORDERS) {
      for (const item of order.entries) {
        if (item.sourceSlug !== null) {
          expect(item.sourceSlug).toMatch(/^[a-z0-9-]+--\d+$/);
        }
      }
    }
  });

  it('aynı kaynak anahtarı iki durakta geçmiyor', () => {
    for (const order of READING_ORDERS) {
      const slugs = order.entries
        .map((item) => item.sourceSlug)
        .filter((slug): slug is string => slug !== null);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});
