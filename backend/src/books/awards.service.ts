import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleBooksService, type BookSource } from './google-books.service';
import { BooksService } from './books.service';
import {
  AWARDS,
  findAward,
  type AwardDefinition,
  type AwardWinner,
} from './data/awards.data';

/**
 * Ödül rafları (Faz B).
 *
 * Liste kodda duruyor (`data/awards.data.ts`), dış kaynak yalnızca **kapak
 * ve kimlik** için kullanılıyor. Asıl mesele burada mimari:
 *
 * **Sayfa dış isteği BEKLEMEZ.** Dokuz ödülde iki yüzü aşkın kitap var;
 * hepsini Google'da eşleştirmek yüzlerce istek demek. Eşleşme sayfa
 * yüklenirken yapılsaydı ödül sayfası ilk açılışta onlarca saniye sürerdi
 * (ve Google kotasını bir açılışta yerdi). Bunun yerine:
 *
 *  1. Uç, `ExternalCache`de **ne varsa** onu döner — eksik kapak `null`
 *     kalır, arayüz boş çerçeve çizer (kural 4: eksik alan sayfayı bozmaz,
 *     arşivde kapaksız kitap zaten böyle çiziliyor).
 *  2. Aynı istek arkada, **sınırlı sayıda** eksik kaydı doldurmaya başlar.
 *     Kullanıcı sayfayı ikinci kez açtığında kapaklar yerindedir.
 *  3. Haftalık cron bütün listeyi ısıtır (`awards.cron.ts`).
 *
 * Eşleşme **kitap başına** cache'leniyor, ödül başına değil: aynı kitap iki
 * ödülü birden almış olabiliyor (Ancillary Justice hem Hugo hem Nebula,
 * Jonathan Strange hem Hugo hem World Fantasy) ve o zaman tek eşleşme iki
 * rafı birden dolduruyor.
 */

/** Künye TTL'inden uzun: ödüllü kitabın kapağı değişmiyor. */
const CACHE_TTL_MS = 90 * 24 * 60 * 60 * 1000;

/**
 * Bir istekte arkada doldurulacak en fazla kayıt. Düşük tutuluyor: amaç
 * sayfayı hızlandırmak, Google kotasını bir açılışta tüketmek değil.
 */
const BACKFILL_PER_REQUEST = 6;

/** Eşzamanlı dış istek — Google'ı zorlamamak için bilerek düşük. */
const BACKFILL_CONCURRENCY = 2;

export interface AwardWinnerCard {
  year: number;
  title: string;
  author: string;
  /** Türkçe baskı adı; yoksa null (arayüz orijinal adı gösterir) */
  titleTr: string | null;
  shared: boolean;
  notableWork: string | null;
  /** Google eşleşmesinden; henüz eşleşmediyse null */
  googleId: string | null;
  coverImage: string | null;
  pageCount: number | null;
  /** Kitap kullanıcının arşivinde mi — rozet ve "okudum" sayacı bundan */
  inArchive: boolean;
  /** Arşivdeyse kitap sayfasının adresi */
  archiveSlug: string | null;
}

export interface AwardSummary {
  key: string;
  name: string;
  shortName: string;
  grantedTo: 'BOOK' | 'AUTHOR';
  coverage: string;
  blurb: string;
  total: number;
  /** Kaçı arşivde — "39 kitaptan 4'ü sende" satırını besler */
  inArchive: number;
  /** Rafın kapağı: arşivdeki ilk eşleşme, yoksa eşleşmiş ilk kitap */
  coverImage: string | null;
}

export interface AwardDetail extends AwardSummary {
  winners: AwardWinnerCard[];
}

@Injectable()
export class AwardsService {
  private readonly logger = new Logger(AwardsService.name);
  /** Aynı anda tek arka plan turu — istek yağmuru olmasın */
  private backfilling = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly source: GoogleBooksService,
    /**
     * Arşiv dizini buradan okunuyor, doğrudan Prisma'dan DEĞİL: kitap
     * sayfasının `slug`'ı sütun değil, başlıktan türetiliyor ve çakışmada
     * yıl/sıra ekleniyor (`withSlugs`). Aynı mantığı burada tekrarlamak
     * "arşivde var" rozetinin yanlış adrese gitmesi demek olurdu.
     */
    private readonly books: BooksService,
  ) {}

  /** Ödüller sayfasının üst listesi. Dış istek YOK, hep hızlı. */
  async list(): Promise<AwardSummary[]> {
    const [matches, archive] = await Promise.all([
      this.readMatches(AWARDS.flatMap((award) => award.winners)),
      this.readArchiveIndex(),
    ]);

    return AWARDS.map((award) => this.summarize(award, matches, archive));
  }

  /** Tek ödülün rafı. Cache'de ne varsa döner, eksikleri arkada doldurur. */
  async getAward(key: string): Promise<AwardDetail> {
    const award = findAward(key);
    if (!award) {
      throw new NotFoundException('BOOKS.AWARD_NOT_FOUND');
    }

    const [matches, archive] = await Promise.all([
      this.readMatches(award.winners),
      this.readArchiveIndex(),
    ]);

    const winners = award.winners.map((winner) =>
      this.toCard(winner, matches, archive),
    );

    // Yanıtı bekletmeden arkada devam: bir sonraki açılışta kapaklar yerinde
    void this.backfill(award.winners);

    return {
      ...this.summarize(award, matches, archive),
      winners,
    };
  }

  /**
   * Bütün listeyi ısıtır — cron buradan çağırıyor. `limit` ile turu bölmek
   * mümkün: haftalık cron her turda bir dilim alıyor.
   */
  async warm(limit: number): Promise<{ checked: number; filled: number }> {
    const all = AWARDS.flatMap((award) => award.winners);
    const settled = await this.readSettled(all);
    const missing = all.filter((winner) => !settled.has(cacheKey(winner)));
    const filled = await this.resolveMany(missing.slice(0, limit));
    return { checked: all.length, filled };
  }

  // ---- iç yardımcılar ----

  private summarize(
    award: AwardDefinition,
    matches: Map<string, BookSource>,
    archive: ArchiveIndex,
  ): AwardSummary {
    const cards = award.winners.map((winner) =>
      this.toCard(winner, matches, archive),
    );
    const owned = cards.filter((card) => card.inArchive);
    return {
      key: award.key,
      name: award.name,
      shortName: award.shortName,
      grantedTo: award.grantedTo,
      coverage: award.coverage,
      blurb: award.blurb,
      total: award.winners.length,
      inArchive: owned.length,
      coverImage:
        owned.find((card) => card.coverImage)?.coverImage ??
        cards.find((card) => card.coverImage)?.coverImage ??
        null,
    };
  }

  private toCard(
    winner: AwardWinner,
    matches: Map<string, BookSource>,
    archive: ArchiveIndex,
  ): AwardWinnerCard {
    const match = matches.get(cacheKey(winner)) ?? null;
    // Arşiv eşleşmesi iki yoldan: Google kimliği kesin, ad+yazar yedek.
    // Yedek gerekli çünkü kullanıcı kitabı BAŞKA bir baskıyla eklemiş
    // olabilir (Türkçe cilt eklenmişken ödül listesi orijinali arıyor).
    const entry =
      (match?.googleId ? archive.byGoogleId.get(match.googleId) : undefined) ??
      archive.byTitle.get(titleKey(winner.title, winner.author)) ??
      (winner.titleTr
        ? archive.byTitle.get(titleKey(winner.titleTr, winner.author))
        : undefined);

    return {
      year: winner.year,
      title: winner.title,
      author: winner.author,
      /**
       * Gösterilen Türkçe ad **eşleşen ciltten** gelir, listedeki tahminden
       * DEĞİL. Sebebi ölçümle çıktı: listedeki `titleTr` elle derlendi ve
       * hiçbir kaynakla doğrulanamıyor — Google Türkçe baskıların çoğunu
       * indekslemiyor (112 addan 61'i "bulunamadı" döndü, oysa çoğu gerçek
       * çeviri). Tahmini ekranda göstermek uydurma künye demek olurdu.
       * Eşleşen cilt Türkçeyse adı zaten gerçek veridir; değilse ekranda
       * yalnızca orijinal ad durur.
       */
      titleTr: match?.language === 'tr' ? match.title : null,
      shared: winner.shared ?? false,
      notableWork: winner.notableWork ?? null,
      googleId: match?.googleId ?? null,
      // Arşivdeki kapak önce gelir: küratör elle kapak koymuş olabilir
      coverImage: entry?.coverImage ?? match?.coverImage ?? null,
      pageCount: match?.pageCount ?? null,
      inArchive: Boolean(entry),
      archiveSlug: entry?.slug ?? null,
    };
  }

  /** Cache'deki eşleşmeleri tek sorguda okur. */
  private async readMatches(
    winners: AwardWinner[],
  ): Promise<Map<string, BookSource>> {
    const keys = [...new Set(winners.map((winner) => cacheKey(winner)))];
    const rows = await this.prisma.externalCache.findMany({
      where: { cacheKey: { in: keys } },
    });
    const map = new Map<string, BookSource>();
    for (const row of rows) {
      if (Date.now() - row.fetchedAt.getTime() > CACHE_TTL_MS) {
        continue;
      }
      const payload = row.payload as unknown as AwardMatchPayload | null;
      // Eşleşmesi bulunamayan kitaplar da yazılıyor (bkz. resolveOne) ki her
      // açılışta yeniden aranmasınlar; onlar `matched: false` taşıyor
      if (!payload || payload.matched !== true) {
        continue;
      }
      map.set(row.cacheKey, payload.book);
    }
    return map;
  }

  /**
   * Cache'de **eşleşmediği bilinen** kayıtların anahtarları. `readMatches`
   * bunları atladığı için, arka plan doldurması onları sürekli yeniden
   * aramasın diye ayrıca okunuyor.
   */
  private async readSettled(winners: AwardWinner[]): Promise<Set<string>> {
    const keys = [...new Set(winners.map((winner) => cacheKey(winner)))];
    const rows = await this.prisma.externalCache.findMany({
      where: { cacheKey: { in: keys } },
      select: { cacheKey: true, fetchedAt: true },
    });
    return new Set(
      rows
        .filter((row) => Date.now() - row.fetchedAt.getTime() <= CACHE_TTL_MS)
        .map((row) => row.cacheKey),
    );
  }

  /** Arşivdeki kitapların kimlik ve ad dizini — "sende var" rozeti için. */
  private async readArchiveIndex(): Promise<ArchiveIndex> {
    const { books } = await this.books.getArchive();

    const byGoogleId = new Map<string, ArchiveHit>();
    const byTitle = new Map<string, ArchiveHit>();
    for (const book of books) {
      const hit: ArchiveHit = {
        slug: book.slug,
        coverImage: book.coverImage,
      };
      if (book.googleId) {
        byGoogleId.set(book.googleId, hit);
      }
      // Yazar adı olmayan kayıt olabilir; anahtar yine de kurulur ki
      // ad eşleşmesi tamamen kaybolmasın
      const author = book.authors[0] ?? '';
      byTitle.set(titleKey(book.title, author), hit);
      if (book.originalTitle) {
        byTitle.set(titleKey(book.originalTitle, author), hit);
      }
    }
    return { byGoogleId, byTitle };
  }

  /** Hiç denenmemiş kayıtlardan bir dilimi arkada doldurur; hata yutulur. */
  private async backfill(winners: AwardWinner[]): Promise<void> {
    if (this.backfilling) {
      return;
    }
    // `matches` değil `settled` bakılıyor: Google'ın bilmediği kitap da
    // cache'e yazılmış oluyor, onu her açılışta yeniden aramak kotayı yer
    const settled = await this.readSettled(winners);
    const missing = winners
      .filter((winner) => !settled.has(cacheKey(winner)))
      .slice(0, BACKFILL_PER_REQUEST);
    if (missing.length === 0) {
      return;
    }

    this.backfilling = true;
    try {
      await this.resolveMany(missing);
    } catch (error) {
      this.logger.warn(`Ödül eşleştirmesi arkada düştü: ${String(error)}`);
    } finally {
      this.backfilling = false;
    }
  }

  /** Sınırlı eşzamanlılıkla eşleştirir; kaç tanesinin tuttuğunu döner. */
  private async resolveMany(winners: AwardWinner[]): Promise<number> {
    let filled = 0;
    const queue = [...winners];
    const workers = Array.from(
      { length: Math.min(BACKFILL_CONCURRENCY, queue.length) },
      async () => {
        for (;;) {
          const winner = queue.shift();
          if (!winner) {
            return;
          }
          if (await this.resolveOne(winner)) {
            filled++;
          }
        }
      },
    );
    await Promise.all(workers);
    return filled;
  }

  /**
   * Tek kitabı Google'da bulup cache'e yazar.
   *
   * Eşleşme **bulunamazsa da** yazılır (`matched: false`): listede Google'ın
   * hiç bilmediği eski kitaplar var, onları her açılışta yeniden aramak
   * kotayı boşa harcar. TTL dolunca yeniden denenir.
   *
   * **Sorgu orijinal addan kurulur, Türkçe addan değil.** Önce tersi
   * denenmişti ve ölçümde altı kitap birden ıskalandı: `titleTr` listedeki
   * en kırılgan alan (elle derleniyor, yayıncı çevirisi farklı olabiliyor,
   * hiç yayımlanmamış olabiliyor) ve yanlış bir Türkçe adla arama **sıfır
   * sonuç** dönüyor — kitap da 90 gün "eşleşmedi" olarak çakılı kalıyordu.
   * Orijinal ad Google'da her zaman kayıtlı; Türkçe baskı varsa `search()`
   * zaten onu başa alıyor. Türkçe ad yalnızca **yedek sorgu** olarak ve
   * `pickBest`te ikinci bir ad anahtarı olarak kullanılıyor.
   */
  private async resolveOne(winner: AwardWinner): Promise<boolean> {
    const key = cacheKey(winner);
    // Nobel'de aranan şey yazarın temsilci eseri, yazarın adı değil
    const wanted = winner.notableWork ?? winner.title;
    const queries = [`${wanted} ${winner.author}`];
    if (winner.titleTr) {
      queries.push(`${winner.titleTr} ${winner.author}`);
    }

    try {
      let best: BookSource | null = null;
      let sawResults = false;
      for (const query of queries) {
        const results = await this.source.search(query);
        sawResults ||= results.length > 0;
        best = pickBest(results, winner, wanted);
        if (best) {
          break;
        }
      }

      /**
       * Arama **hiç sonuç vermediyse** olumsuz cevap yazılmıyor.
       *
       * Ölçümde yakalandı: iki kitap bir turda eşleşip bir sonrakinde
       * ıskalandı, sorgular birebir aynıyken. Sebep Google'ın anlık boş/hata
       * yanıtı. `matched: false` yazılsaydı geçici bir aksaklık o kitabı
       * **90 gün** kapaksız bırakırdı. "Sonuç geldi ama hiçbiri tutmadı"
       * gerçek bir cevaptır ve yazılır; "hiç sonuç gelmedi" değildir.
       */
      if (!best && !sawResults) {
        return false;
      }
      /**
       * Zarf kullanılıyor, çıplak `null` değil: Prisma'nın `InputJsonValue`ı
       * null kabul etmiyor (`Prisma.JsonNull` gerekirdi) ve "aradık,
       * bulamadık" ile "hiç aranmadı" ayrımı zaten açıkça durmalı.
       */
      const payload: AwardMatchPayload = best
        ? { matched: true, book: best }
        : { matched: false };
      await this.writeCache(key, payload);
      return best !== null;
    } catch (error) {
      this.logger.warn(
        `"${wanted}" ödül eşleşmesi alınamadı: ${String(error)}`,
      );
      return false;
    }
  }

  /**
   * `google-books.service` içindeki yardımcının eşi ve **aynı sebeple** var.
   *
   * Parametre `unknown`: `BookSource` bir `interface` olduğu için örtük index
   * imzası yok ve Prisma'nın `InputJsonValue`ına doğrudan geçmiyor. Değeri
   * burada `object`e çevirmek zorunlu — ama çağıran taraf zaten tipli olduğu
   * için `no-unnecessary-type-assertion` kuralı çağrı yerinde tetikleniyordu.
   * Dönüşümü `unknown` parametreli bu yardımcının içine almak ikisini de
   * memnun ediyor (bkz. STATE.md'deki lint/derleyici çelişkisi notu).
   */
  private async writeCache(cacheKey: string, payload: unknown): Promise<void> {
    await this.prisma.externalCache.upsert({
      where: { cacheKey },
      create: { cacheKey, payload: payload as object, fetchedAt: new Date() },
      update: { payload: payload as object, fetchedAt: new Date() },
    });
  }
}

/**
 * Cache'e yazılan biçim. `matched: false` "arandı, Google bilmiyor" demek —
 * bu da bir sonuç ve saklanıyor, yoksa o kitap her açılışta yeniden aranırdı.
 *
 * `interface` değil **tür takma adı**: örtük index imzası sayesinde Prisma'nın
 * `InputJsonValue`ına dönüşümsüz geçiyor (`BookShowcaseCover` ile aynı sebep).
 */
type AwardMatchPayload =
  { matched: true; book: BookSource } | { matched: false };

interface ArchiveHit {
  slug: string;
  coverImage: string | null;
}

interface ArchiveIndex {
  byGoogleId: Map<string, ArchiveHit>;
  byTitle: Map<string, ArchiveHit>;
}

/** Kitap başına cache anahtarı — aynı kitap iki ödülde de aynı anahtarı alır */
function cacheKey(winner: AwardWinner): string {
  const wanted = winner.notableWork ?? winner.title;
  return `books:award:v1:${titleKey(wanted, winner.author)}`;
}

/** Ad+yazar karşılaştırma anahtarı; noktalama ve büyük/küçük harf elenir. */
function titleKey(title: string, author: string): string {
  return `${normalize(title)}|${normalize(author)}`;
}

function normalize(value: string): string {
  return value
    .toLocaleLowerCase('tr')
    .replace(/[’'`]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Arama sonucundan doğru cildi seçer.
 *
 * Google alaka sırasına körü körüne güvenmek yanlış sonuç veriyor: "Dune"
 * araması film tie-in'ini, inceleme kitaplarını ve "Dreamer of Dune"u da
 * getiriyor. Bu yüzden yazar adı tutmayan kayıtlar eleniyor, kalanlar
 * içinde kapaklı olan tercih ediliyor (kapaksız cilt rafta boş çerçeve).
 *
 * Sınıfın dışında ve **dışa açık**: saf bir işlev ve rafın doğruluğu buna
 * bağlı, `awards.service.spec.ts` bunu doğrudan sınıyor.
 */
export function pickBest(
  results: BookSource[],
  winner: AwardWinner,
  wanted: string,
): BookSource | null {
  const authorKey = normalize(winner.author);
  const titleKeys = [
    normalize(wanted),
    winner.titleTr ? normalize(winner.titleTr) : null,
  ].filter((value): value is string => value !== null);

  const plausible = results.filter((item) => {
    const authorHit = item.authors.some((name) => {
      const key = normalize(name);
      return (
        key === authorKey || key.includes(authorKey) || authorKey.includes(key)
      );
    });
    if (!authorHit) {
      return false;
    }
    // Ad da tutmalı: aynı yazarın BAŞKA kitabı gelmesin
    const itemTitle = normalize(item.title);
    return titleKeys.some(
      (key) => itemTitle.includes(key) || key.includes(itemTitle),
    );
  });

  if (plausible.length === 0) {
    return null;
  }

  const score = (item: BookSource): number =>
    (item.coverImage ? 4 : 0) +
    (item.language === 'tr' ? 2 : 0) +
    (item.pageCount ? 1 : 0);

  return [...plausible].sort((a, b) => score(b) - score(a))[0];
}
