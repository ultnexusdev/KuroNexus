import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { BooksService, type ArchiveBook } from './books.service';
import {
  findReadingOrder,
  READING_ORDERS,
  type ReadingOrderDefinition,
  type ReadingOrderEntry,
} from './data/reading-orders.data';

/**
 * Okuma sıraları (`/kitap/okuma-sirasi/...`).
 *
 * Liste kod içinde (`data/reading-orders.data.ts`); bu servisin tek işi onu
 * **arşivle buluşturmak**: hangi durak sende var, hangisini okudun. Sayfanın
 * asıl sorusu bu — yoksa liste sabit bir tablodan ibaret kalırdı.
 *
 * Dış istek YOK. Yazarın portresi ve biyografisi kişi sayfasının kendi
 * yolundan geliyor (`BooksService.getPerson`), yani arşivde kaydı olan yazarda
 * veritabanından, olmayanda kaynağın 30 günlük cache'inden.
 */

/**
 * Tablodaki bir satır — listedeki hâline arşiv karşılığı eklenmiş.
 * `sourceSlug` tanımdan geliyor: arşivde olmayan durak onun sayesinde künye
 * sayfasına gidebiliyor ve küratör tek tıkla ekleyebiliyor.
 */
export interface ReadingOrderCard extends ReadingOrderEntry {
  /** Kitap arşivimde mi — sayfanın ilerleme çubuğu bundan */
  inArchive: boolean;
  /** Arşivdeyse kitap sayfasının adresi */
  archiveSlug: string | null;
  coverImage: string | null;
  /** Arşivdeyse okuma durumu; değilse null */
  status: ArchiveBook['status'] | null;
}

export interface ReadingOrderSummary {
  key: string;
  name: string;
  blurb: string;
  author: { name: string; slug: string };
  /** Kaç durak var */
  total: number;
  inArchive: number;
  readCount: number;
  /** Listenin kapağı: arşivdeki ilk eşleşmenin kapağı */
  coverImage: string | null;
  /** "1950–1993" — listenin kapsadığı yayım yılları */
  years: string;
  tracks: Array<{ name: string; count: number }>;
}

export interface ReadingOrderDetail extends ReadingOrderSummary {
  notes: string[];
  /** Yazarın künyesi; hiçbir yerden bulunamazsa yalnızca ad döner */
  author: {
    name: string;
    slug: string;
    photo: string | null;
    biography: string | null;
  };
  /**
   * "Buradayım" imi: kaçıncı durakta olduğum. 0 = im konmamış. Küratör
   * koyuyor, ziyaretçi görüyor — arşivin geri kalanı gibi.
   */
  currentOrder: number;
  entries: ReadingOrderCard[];
}

/** Bir kitabın geçtiği okuma sırası — kitap sayfasındaki geri bağ. */
export interface BookReadingOrderLink {
  key: string;
  name: string;
  /** Kitabın o sıradaki durak numarası */
  order: number;
  total: number;
}

@Injectable()
export class ReadingOrdersService {
  private readonly logger = new Logger(ReadingOrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    /**
     * Arşiv dizini buradan okunuyor, doğrudan Prisma'dan DEĞİL: kitap
     * sayfasının `slug`'ı sütun değil, başlıktan türetiliyor. Aynı gerekçe
     * ödül servisinde de yazılı.
     */
    private readonly books: BooksService,
  ) {}

  /** Okuma sıralarının listesi. Dış istek yok, hep hızlı. */
  async list(): Promise<ReadingOrderSummary[]> {
    const index = await this.readArchiveIndex();
    return READING_ORDERS.map((order) => this.summarize(order, index));
  }

  /** Tek bir okuma sırası: tablo, ilerleme ve yazar künyesi. */
  async getOrder(key: string): Promise<ReadingOrderDetail> {
    const order = findReadingOrder(key);
    if (!order) {
      throw new NotFoundException('BOOKS.READING_ORDER_NOT_FOUND');
    }

    const [index, progress] = await Promise.all([
      this.readArchiveIndex(),
      this.prisma.readingOrderProgress.findFirst({
        where: { orderKey: key },
        select: { currentOrder: true },
      }),
    ]);
    return {
      ...this.summarize(order, index),
      notes: order.notes,
      author: await this.readAuthor(order),
      currentOrder: progress?.currentOrder ?? 0,
      entries: order.entries.map((entry) => this.toCard(entry, index)),
    };
  }

  /**
   * "Buradayım" imini koyar ya da kaldırır (`0`).
   *
   * Kayıt **silinmiyor**, sıfırlanıyor: imi kaldırıp geri koymak sık yapılan
   * bir şey ve her seferinde satır açıp kapatmanın bir faydası yok.
   */
  async setProgress(
    key: string,
    currentOrder: number,
    userId: string,
  ): Promise<{ currentOrder: number }> {
    const order = findReadingOrder(key);
    if (!order) {
      throw new NotFoundException('BOOKS.READING_ORDER_NOT_FOUND');
    }
    // Listenin dışına im konamaz; 0 "im yok" demek
    const clamped = Math.max(0, Math.min(order.entries.length, currentOrder));
    const saved = await this.prisma.readingOrderProgress.upsert({
      where: { userId_orderKey: { userId, orderKey: key } },
      create: { userId, orderKey: key, currentOrder: clamped },
      update: { currentOrder: clamped },
    });
    return { currentOrder: saved.currentOrder };
  }

  /**
   * Bu kitabın geçtiği okuma sıraları — kitap sayfasındaki geri bağ.
   *
   * Kitap tarafından çağrılıyor, yani eşleştirme **tersine** çalışıyor: elde
   * bir kitap var, listelerde yeri aranıyor. Anahtarlar aynı (`titleKeys`),
   * o yüzden iki yön de aynı sonucu veriyor.
   */
  forBook(book: {
    title: string;
    originalTitle: string | null;
    binKitapSlug: string | null;
  }): BookReadingOrderLink[] {
    const keys = new Set(
      [book.title, book.originalTitle]
        .map((name) => (name ? slugify(name) : ''))
        .filter((key) => key.length > 0),
    );

    const found: BookReadingOrderLink[] = [];
    for (const order of READING_ORDERS) {
      const hit = order.entries.find(
        (entry) =>
          (book.binKitapSlug !== null &&
            entry.sourceSlug === book.binKitapSlug) ||
          titleKeys(entry).some((key) => keys.has(key)),
      );
      if (hit) {
        found.push({
          key: order.key,
          name: order.name,
          order: hit.order,
          total: order.entries.length,
        });
      }
    }
    return found;
  }

  // ---- iç yardımcılar ----

  private summarize(
    order: ReadingOrderDefinition,
    index: ArchiveIndex,
  ): ReadingOrderSummary {
    const cards = order.entries.map((entry) => this.toCard(entry, index));
    const owned = cards.filter((card) => card.inArchive);
    const years = order.entries.map((entry) => entry.year);

    const counts = new Map<string, number>();
    for (const entry of order.entries) {
      const track = entry.position.track;
      counts.set(track, (counts.get(track) ?? 0) + 1);
    }

    return {
      key: order.key,
      name: order.name,
      blurb: order.blurb,
      author: order.author,
      total: order.entries.length,
      inArchive: owned.length,
      readCount: cards.filter((card) => card.status === 'READ').length,
      coverImage: owned.find((card) => card.coverImage)?.coverImage ?? null,
      years: `${Math.min(...years)}–${Math.max(...years)}`,
      // Sıra listedeki ilk görünüşe göre: renk şeridi tabloyla aynı dili konuşsun
      tracks: [...counts.entries()].map(([name, count]) => ({ name, count })),
    };
  }

  private toCard(
    entry: ReadingOrderEntry,
    index: ArchiveIndex,
  ): ReadingOrderCard {
    /**
     * İki kademe:
     *
     *  1. **Kaynak anahtarı** — kesin. Listedeki `sourceSlug` ölçülmüş bir
     *     değer ve arşivdeki kayıt da aynı anahtarı taşıyorsa aynı baskıdır.
     *  2. **Adlar** — orijinal ad(lar) ve Türkçe adların hepsi. Tek ada bakmak
     *     yetmiyor: aynı kitap arşive hangi baskıyla eklendiyse o adla duruyor
     *     ("Çıplak Güneş" ile "Güneşin Tanrıları" aynı kitap) ve listedeki
     *     adların hangisi olduğu bilinmiyor.
     *
     * İkinci kademe tek başına yetmiyordu: kaynak "Vakıf'ın Sınırı" yazarken
     * liste "Vakfın Sınırı" diyor ve kesme işareti yüzünden anahtarlar
     * tutmuyor.
     */
    const hit =
      (entry.sourceSlug !== null
        ? index.bySourceSlug.get(entry.sourceSlug)
        : undefined) ??
      titleKeys(entry)
        .map((key) => index.byTitle.get(key))
        .find((book): book is ArchiveHit => book !== undefined);

    return {
      ...entry,
      inArchive: hit !== undefined,
      archiveSlug: hit?.slug ?? null,
      coverImage: hit?.coverImage ?? null,
      status: hit?.status ?? null,
    };
  }

  /**
   * Yazarın portresi ve biyografisi. Kişi sayfasının kendi yolundan geliyor:
   * arşivde kaydı varsa veritabanından, yoksa kaynaktan.
   *
   * Düşerse sayfa **yalnızca adla** çiziliyor (kural 4) — tablo zaten
   * sayfanın asıl içeriği, yazar rayı onu tamamlayan bir şey.
   */
  private async readAuthor(
    order: ReadingOrderDefinition,
  ): Promise<ReadingOrderDetail['author']> {
    try {
      const person = await this.books.getPerson(order.author.slug);
      return {
        // Ad tanımdan: kaynak adı farklı yazmış olabilir, sayfanın başlığı bizim
        name: order.author.name,
        slug: person.slug,
        photo: person.photo,
        biography: person.biography,
      };
    } catch (error) {
      this.logger.warn(
        `Okuma sırası yazarı alınamadı (${order.author.slug}): ${String(error)}`,
      );
      return { ...order.author, photo: null, biography: null };
    }
  }

  /** Arşivdeki kitapların dizini — "sende var" işareti için. */
  private async readArchiveIndex(): Promise<ArchiveIndex> {
    const { books } = await this.books.getArchive();
    const byTitle = new Map<string, ArchiveHit>();
    const bySourceSlug = new Map<string, ArchiveHit>();
    for (const book of books) {
      const hit: ArchiveHit = {
        slug: book.slug,
        coverImage: book.coverImage,
        status: book.status,
      };
      if (book.binKitapSlug) {
        bySourceSlug.set(book.binKitapSlug, hit);
      }
      for (const name of [book.title, book.originalTitle]) {
        const key = name ? slugify(name) : '';
        // Boş anahtar atlanıyor: `slugify` ASCII dışı yazıyı tamamen eliyor ve
        // iki boş anahtar alakasız iki kitabı eşleştirirdi
        if (key && !byTitle.has(key)) {
          byTitle.set(key, hit);
        }
      }
    }
    return { byTitle, bySourceSlug };
  }
}

interface ArchiveHit {
  slug: string;
  coverImage: string | null;
  status: ArchiveBook['status'];
}

interface ArchiveIndex {
  byTitle: Map<string, ArchiveHit>;
  bySourceSlug: Map<string, ArchiveHit>;
}

/**
 * Bir durağın aranabilir ad anahtarları: orijinal ad ve bütün Türkçe adlar.
 *
 * Orijinal ad sütununda eğik çizgi **iki ayrı orijinal adı** ayırıyor
 * ("The Stars Like Dust / The Rebellious Stars" — aynı kitabın iki İngilizce
 * adı), o yüzden o da bölünüyor.
 *
 * Sınıfın dışında ve dışa açık: saf bir işlev ve tablonun arşivle buluşması
 * buna bağlı (`reading-orders.service.spec.ts` bunu doğrudan sınıyor).
 */
export function titleKeys(entry: ReadingOrderEntry): string[] {
  return [...entry.originalTitle.split('/'), ...entry.titles]
    .map((name) => slugify(name.trim()))
    .filter((key) => key.length > 0);
}
