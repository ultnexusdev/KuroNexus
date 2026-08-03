import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';
import { GoogleBooksService, type BookSource } from './google-books.service';
import {
  BinKitapRateLimitError,
  BinKitapService,
  pickEdition,
  type BinKitapDetail,
} from './bin-kitap.service';
import { BooksService } from './books.service';
import { BookCoverService } from './book-cover.service';
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
 * sayfayı hızlandırmak, kaynakları bir açılışta tüketmek değil.
 *
 * 6'dan 3'e indirildi: eşleştirme 1000Kitap'a taşınınca bir kazananın maliyeti
 * tek Google isteği olmaktan çıkıp 2–4 sayfa açmaya yükseldi (arama + künye
 * + gerekirse Türkçe baskı). Ölçüldü ki kaynak saniyede bir istekle ~25
 * istekten sonra 429 dönüyor; 3 kazanan bir turda o sınırın altında kalıyor.
 */
const BACKFILL_PER_REQUEST = 3;

/** Eşzamanlı dış istek — Google'ı zorlamamak için bilerek düşük. */
const BACKFILL_CONCURRENCY = 2;

/**
 * Bir istekte kaç kapak **indirilir** (eşleşmesi zaten cache'de olanlardan).
 *
 * Eşleştirmeden çok daha yüksek, çünkü bambaşka bir iş: künye çekmek
 * 1000Kitap'ın hız sınırlı sayfalarını açmak demek, kapak indirmek ise
 * yalnızca CDN'den (`1k-cdn.com`) bir dosya çekmek — o adres bu korumanın
 * arkasında değil (bkz. STATE.md'deki tuzak notu). Kullanıcı "kapaklar sayfa
 * yenilendikçe geliyor" diye bildirdi; tur başına üç kapak 30 kitaplık bir
 * rafta on tazeleme demekti.
 */
const LOCALIZE_PER_REQUEST = 12;

/** Kapak indirmede eşzamanlılık — dosyalar küçük, sunucu tek. */
const LOCALIZE_CONCURRENCY = 4;

/**
 * Bir kazanan için en fazla kaç kitap sayfası açılır.
 *
 * Arama sonucu künye taşımıyor: ad tutmadığında eşleşmeyi ancak kitap
 * sayfasındaki alt başlık ve baskı listesi doğrulayabiliyor (bkz.
 * `confirmMatch`). Sınır bunun için var — yoksa tek bir kazanan onlarca
 * sayfa açabilirdi. İki deneme ölçümde yetiyor.
 */
const DETAIL_ATTEMPTS = 2;

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
  /**
   * 1000Kitap künye sayfasının anahtarı. Arşivde olmayan kitap bu sayede
   * tıklanabiliyor: kart `/kitap/kaynak/<slug>` sayfasına gidiyor. Eşleşme
   * Google'dan geldiyse `null` kalır ve kart yine tıklanmaz.
   */
  sourceSlug: string | null;
  /**
   * Yazar sayfasının adresi (`/kitap/kisi/<slug>`).
   *
   * Kullanıcı isteği: kitap çevrilmemiş, hatta hiç eşleşmemiş olsa bile
   * yazarına tıklanabilsin. Bu yüzden **her zaman dolu**: önce arşivdeki kişi
   * kaydı, sonra kaynağın kendi adres anahtarı, o da yoksa adın katlanmış
   * hâli. Kişi sayfası arşivde kaydı olmayan yazarı kaynaktan çiziyor.
   */
  authorSlug: string | null;
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
  /**
   * Henüz **hiç denenmemiş** kazanan sayısı. Arayüz bunu görünce sayfayı
   * kendisi tazeliyor: eşleşme arkada dilim dilim doluyor ve kullanıcı
   * "kapaklar her yenilemede biraz daha geliyor" diye bildirdi. Sıfırsa
   * doldurulacak bir şey kalmamış demektir ve tazeleme durur.
   */
  pending: number;
}

@Injectable()
export class AwardsService {
  private readonly logger = new Logger(AwardsService.name);
  /** Aynı anda tek arka plan turu — istek yağmuru olmasın */
  private backfilling = false;
  /**
   * Kapağı bu süreçte indirilemeyen kayıtlar.
   *
   * Olmasaydı **sonsuz tazeleme** olurdu: kalıcı olarak inmeyen bir adres
   * (izinsiz sunucu, silinmiş dosya) cache'te `http` ile durmaya devam eder,
   * her açılışta yeniden kuyruğa girer ve arayüz "kapaklar doldurulıyor"
   * yazısını yirmi tur boyunca boşuna gösterirdi.
   *
   * Kalıcı DEĞİL, bilerek: sunucu her yeniden başladığında sıfırlanıyor, yani
   * geçici bir CDN arızası yüzünden kapak sonsuza dek dışarıda kalmıyor.
   */
  private readonly coverFailures = new Set<string>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly source: GoogleBooksService,
    /**
     * Ödüllerin **birinci** kaynağı (kullanıcı kararı). Google yedeğe
     * düştü: kaynağın bilmediği eski/çevrilmemiş kitaplar kapaksız
     * kalmasın diye o bacak duruyor.
     */
    private readonly binKitap: BinKitapService,
    /**
     * Arşiv dizini buradan okunuyor, doğrudan Prisma'dan DEĞİL: kitap
     * sayfasının `slug`'ı sütun değil, başlıktan türetiliyor ve çakışmada
     * yıl/sıra ekleniyor (`withSlugs`). Aynı mantığı burada tekrarlamak
     * "arşivde var" rozetinin yanlış adrese gitmesi demek olurdu.
     */
    private readonly books: BooksService,
    /**
     * Ödül kapakları da **kendi diskimize** iniyor (kullanıcı kararı:
     * hotlink yok). Eskiden cache'e kaynağın CDN adresi yazılıyordu ve raf
     * her açılışta o adresleri dışarıdan çekiyordu; kapak kaybolduğunda ya
     * da CDN referer kontrolü koyduğunda raf boşalırdı. Arşivdeki kitapların
     * kapağı zaten bu yoldan geçiyor, ödül rafı geride kalmıştı.
     */
    private readonly covers: BookCoverService,
  ) {}

  /** Ödüller sayfasının üst listesi. Dış istek YOK, hep hızlı. */
  async list(): Promise<AwardSummary[]> {
    const [matches, archive, people] = await Promise.all([
      this.readMatches(AWARDS.flatMap((award) => award.winners)),
      this.readArchiveIndex(),
      this.readPersonIndex(),
    ]);

    return AWARDS.map((award) =>
      this.summarize(award, matches, archive, people),
    );
  }

  /** Tek ödülün rafı. Cache'de ne varsa döner, eksikleri arkada doldurur. */
  async getAward(key: string): Promise<AwardDetail> {
    const award = findAward(key);
    if (!award) {
      throw new NotFoundException('BOOKS.AWARD_NOT_FOUND');
    }

    const [matches, archive, people, settled] = await Promise.all([
      this.readMatches(award.winners),
      this.readArchiveIndex(),
      this.readPersonIndex(),
      this.readSettled(award.winners),
    ]);

    const winners = award.winners.map((winner) =>
      this.toCard(winner, matches, archive, people),
    );

    /**
     * `matches` değil `settled` bakılıyor: kaynağın bilmediği kitap da cache'e
     * yazılıyor ("aradık, bulamadık") ve onu bekleyen saymak sayfayı sonsuza
     * dek tazeletirdi.
     */
    const missing = award.winners.filter(
      (winner) => !settled.has(cacheKey(winner)),
    );
    // Eşleşmiş ama kapağı hâlâ dışarıda duran kayıtlar — bunlar da bekleyen iş
    const remote = this.pendingCovers(matches);

    // Yanıtı bekletmeden arkada devam: bir sonraki açılışta kapaklar yerinde
    void this.backfill(missing, remote);

    return {
      ...this.summarize(award, matches, archive, people),
      winners,
      /**
       * Sayaç iki işi birden kapsıyor: hiç aranmamış kazananlar **ve** kapağı
       * hâlâ dışarıda duran eşleşmeler. İkincisi eklenmeseydi arayüz eski
       * kayıtlarda "her şey hazır" deyip tazelemeyi durdururdu, oysa kapaklar
       * daha kendi diskimize inmemiş olurdu.
       */
      pending: missing.length + remote.length,
    };
  }

  /**
   * Bütün listeyi ısıtır — cron/admin buradan çağırıyor. `limit` ile turu
   * bölmek mümkün: her turda bir dilim alınıyor.
   */
  async warm(
    limit: number,
  ): Promise<{ checked: number; filled: number; localized: number }> {
    const all = AWARDS.flatMap((award) => award.winners);
    const settled = await this.readSettled(all);
    const missing = all.filter((winner) => !settled.has(cacheKey(winner)));
    const filled = await this.resolveMany(missing.slice(0, limit));
    // Isıtma turunun ikinci yarısı: cache'de duran dış adresleri içeri al
    const localized = await this.localizeCovers(
      this.pendingCovers(await this.readMatches(all)).slice(0, limit),
    );
    return { checked: all.length, filled, localized };
  }

  // ---- iç yardımcılar ----

  private summarize(
    award: AwardDefinition,
    matches: Map<string, AwardMatch>,
    archive: ArchiveIndex,
    people: PersonIndex,
  ): AwardSummary {
    const cards = award.winners.map((winner) =>
      this.toCard(winner, matches, archive, people),
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
    matches: Map<string, AwardMatch>,
    archive: ArchiveIndex,
    people: PersonIndex,
  ): AwardWinnerCard {
    const found = matches.get(cacheKey(winner)) ?? null;
    const match = found?.book ?? null;
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
      sourceSlug: match?.binKitapSlug ?? null,
      authorSlug: personSlug(winner.author, found?.authorSeo ?? null, people),
    };
  }

  /**
   * Arşivdeki kişilerin adres dizini — yazar bağı önce buraya bakıyor.
   *
   * Tablo küçük (arşivdeki kitapların künyesi kadar) ve sorgu tek; kazanan
   * başına arama yapmak yerine bir kez okunuyor.
   */
  private async readPersonIndex(): Promise<PersonIndex> {
    const people = await this.prisma.bookPerson.findMany({
      select: { slug: true, name: true, binKitapSeoName: true },
    });
    const bySlug = new Map<string, string>();
    const bySeoName = new Map<string, string>();
    for (const person of people) {
      bySlug.set(person.slug, person.slug);
      bySlug.set(slugify(person.name), person.slug);
      if (person.binKitapSeoName) {
        bySeoName.set(person.binKitapSeoName, person.slug);
      }
    }
    return { bySlug, bySeoName };
  }

  /** Cache'deki eşleşmeleri tek sorguda okur. */
  private async readMatches(
    winners: AwardWinner[],
  ): Promise<Map<string, AwardMatch>> {
    const keys = [...new Set(winners.map((winner) => cacheKey(winner)))];
    const rows = await this.prisma.externalCache.findMany({
      where: { cacheKey: { in: keys } },
    });
    const map = new Map<string, AwardMatch>();
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
      // `authorSeo` sonradan eklendi ve **cache sürümü artırılmadı**: eski
      // kayıtlarda yok, o zaman yazar bağı adın katlanmış hâline düşüyor.
      // Sürüm artsaydı ölçülmüş 90 günlük eşleşmelerin tamamı çöpe giderdi.
      map.set(row.cacheKey, {
        book: payload.book,
        authorSeo: payload.authorSeo ?? null,
      });
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

  /**
   * Hiç denenmemiş kayıtlardan bir dilimi arkada doldurur; hata yutulur.
   *
   * Liste **zaten süzülmüş** geliyor (`getAward`): aynı `settled` sorgusunu
   * iki kez atmamak için — yanıt da o sayıyı `pending` olarak taşıyor.
   */
  private async backfill(
    missing: AwardWinner[],
    remote: CachedCover[],
  ): Promise<void> {
    if (this.backfilling || (missing.length === 0 && remote.length === 0)) {
      return;
    }

    this.backfilling = true;
    try {
      /**
       * Kapak indirme **önce ve soğumadan bağımsız** çalışıyor: hedef
       * `1k-cdn.com`, yani hız sınırının arkasındaki sayfa sunucusu değil.
       * Aynı `if`in içine konsaydı bir 429 sonrası raf, elde hazır künyeler
       * dururken kapaksız beklerdi.
       */
      if (remote.length > 0) {
        await this.localizeCovers(remote.slice(0, LOCALIZE_PER_REQUEST));
      }

      /**
       * Soğumadayken eşleştirme turu hiç başlamıyor. Başlasaydı kaynağın
       * kuyruğuna bir dakika beklemekten başka bir şey yapmayacak işler
       * dizilirdi ve **küratörün kendi araması da o sıranın arkasında
       * kalırdı** — kullanıcı tam bunu bildirdi ("arama simgesi dönüyor ama
       * sonuç gelmiyor").
       */
      if (missing.length > 0 && !this.binKitap.isCoolingDown()) {
        await this.resolveMany(missing.slice(0, BACKFILL_PER_REQUEST));
      }
    } catch (error) {
      this.logger.warn(`Ödül eşleştirmesi arkada düştü: ${String(error)}`);
    } finally {
      this.backfilling = false;
    }
  }

  /**
   * Cache'te dış adresle duran ödül kapaklarını kendi diskimize indirir.
   *
   * Kayıt `patchCache` ile güncelleniyor, `writeCache` ile değil: eşleşmenin
   * yaşı olduğu gibi kalmalı (gerekçe orada).
   *
   * İnmeyen kapak olduğu gibi bırakılıyor (kural 4): tek kırık adres yüzünden
   * raf boş kalmasın — kapak hâlâ `http` ile başladığı için bir sonraki turda
   * yeniden denenir.
   */
  /** İndirilebilecek kapaklar: dışarıda duranlardan, denenip düşenler hariç. */
  private pendingCovers(matches: Map<string, AwardMatch>): CachedCover[] {
    return remoteCovers(matches).filter(
      (item) => !this.coverFailures.has(item.cacheKey),
    );
  }

  private async localizeCovers(items: CachedCover[]): Promise<number> {
    let localized = 0;
    const queue = [...items];
    const workers = Array.from(
      { length: Math.min(LOCALIZE_CONCURRENCY, queue.length) },
      async () => {
        for (;;) {
          const item = queue.shift();
          if (!item) {
            return;
          }
          try {
            const local = await this.covers.download(item.book.coverImage);
            if (!local) {
              // `download` fırlatmaz, `null` döner: adres izinsiz sunucuda ya
              // da dosya gitmiş olabilir. İkinci kez sıraya girmesin.
              this.coverFailures.add(item.cacheKey);
              continue;
            }
            const payload: AwardMatchPayload = {
              matched: true,
              book: { ...item.book, coverImage: local },
              authorSeo: item.authorSeo,
            };
            await this.patchCache(item.cacheKey, payload);
            localized += 1;
          } catch (error) {
            this.logger.warn(
              `Ödül kapağı yerelleştirilemedi (${item.cacheKey}): ${String(error)}`,
            );
          }
        }
      },
    );
    await Promise.all(workers);
    return localized;
  }

  /**
   * Sınırlı eşzamanlılıkla eşleştirir; kaç tanesinin tuttuğunu döner.
   *
   * **Hız sınırı görülünce tur biter.** Kalan kazananlar cache'e hiç
   * yazılmadan bırakılıyor, yani bir sonraki açılışta yeniden denenecekler —
   * ısrar etmek yeni 429'dan başka bir şey getirmiyor (ölçüldü).
   */
  private async resolveMany(winners: AwardWinner[]): Promise<number> {
    let filled = 0;
    let rateLimited = false;
    const queue = [...winners];
    const workers = Array.from(
      { length: Math.min(BACKFILL_CONCURRENCY, queue.length) },
      async () => {
        for (;;) {
          const winner = queue.shift();
          if (!winner || rateLimited) {
            return;
          }
          try {
            if (await this.resolveOne(winner)) {
              filled++;
            }
          } catch (error) {
            if (!(error instanceof BinKitapRateLimitError)) {
              throw error;
            }
            this.logger.warn(
              'Ödül eşleştirmesi hız sınırına takıldı, tur bitiriliyor',
            );
            rateLimited = true;
            return;
          }
        }
      },
    );
    await Promise.all(workers);
    return filled;
  }

  /**
   * Tek kitabı eşleştirip cache'e yazar. **Önce 1000Kitap, sonra Google.**
   *
   * Eşleşme **bulunamazsa da** yazılır (`matched: false`): listede hiçbir
   * kaynağın bilmediği eski kitaplar var, onları her açılışta yeniden aramak
   * boşa yük. TTL dolunca yeniden denenir.
   *
   * **Google sorgusu orijinal addan kurulur, Türkçe addan değil.** Önce tersi
   * denenmişti ve ölçümde altı kitap birden ıskalandı: `titleTr` listedeki
   * en kırılgan alan (elle derleniyor, yayıncı çevirisi farklı olabiliyor,
   * hiç yayımlanmamış olabiliyor) ve yanlış bir Türkçe adla arama **sıfır
   * sonuç** dönüyor — kitap da 90 gün "eşleşmedi" olarak çakılı kalıyordu.
   * 1000Kitap tarafında kural **tersine dönüyor** (bkz. `resolveFromSource`):
   * orada Türkçe ad birinci sorgu, çünkü kaynak Türkçe bir okur sitesi.
   */
  private async resolveOne(winner: AwardWinner): Promise<boolean> {
    const key = cacheKey(winner);
    // Nobel'de aranan şey yazarın temsilci eseri, yazarın adı değil
    const wanted = winner.notableWork ?? winner.title;

    /**
     * 1000Kitap bacağı Google'dan **önce** ve ondan bağımsız deneniyor:
     * tuttuğunda Türkçe baskının adı, kapağı ve künyesi geliyor, üstelik
     * `binKitapSlug` sayesinde kart tıklanabilir hâle geliyor. Bu bacağın
     * düşmesi Google denemesini engellemiyor (kural 4).
     */
    try {
      const fromSource = await this.resolveFromSource(winner, wanted);
      if (fromSource) {
        await this.writeCache(key, {
          matched: true,
          book: await this.withLocalCover(fromSource.book),
          authorSeo: fromSource.authorSeo,
        });
        return true;
      }
    } catch (error) {
      /**
       * Hız sınırı bir **cevap değil**: yukarı fırlatılıyor ve tur orada
       * bitiyor. Yutulsaydı iki kötü şey olurdu — (1) Google bacağı devreye
       * girip Türkçe baskısı olan bir kitabı 90 gün İngilizce cildine
       * çakardı, (2) turdaki geri kalan kazananlar da sırayla 429 yiyip
       * aynı şeyi yapardı. Aynı ayrım Google bacağında `sawResults` ile
       * yapılıyor.
       */
      if (error instanceof BinKitapRateLimitError) {
        throw error;
      }
      this.logger.warn(
        `"${wanted}" 1000Kitap ödül eşleşmesi alınamadı: ${String(error)}`,
      );
    }

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
        ? { matched: true, book: await this.withLocalCover(best) }
        : { matched: false };
      await this.writeCache(key, payload);
      return best !== null;
    } catch (error) {
      this.logger.warn(
        `"${wanted}" Google ödül eşleşmesi alınamadı: ${String(error)}`,
      );
      return false;
    }
  }

  /**
   * Kazananı 1000Kitap'ta bulur ve **Türkçe baskıya kadar iner.**
   *
   * Üç adım, üçü de canlıda ölçüldü:
   *
   * 1. **Türkçe ad birinci sorgu.** Kaynak Türkçe bir okur sitesi; çeviriler
   *    orada Türkçe adıyla duruyor ve orijinal adla bağlı olmayabiliyor
   *    (*Flights* → *Koşucular*, iki ayrı kayıt). Google'da bunun tam tersi
   *    geçerli — oradaki gerekçe `resolveOne`da.
   * 2. **Ad tutmasa da kitap sayfası açılıyor.** Arama sonucu künye
   *    taşımıyor; *Septology* araması "The Other Name" döndürüyor ve bu
   *    kaydın doğru kitap olduğu ancak künyedeki alt başlıktan anlaşılıyor
   *    ("Septology I-II"). Bu yüzden yazarı tutan aday, adı tutmasa bile
   *    açılıyor — doğrulama `confirmMatch`e bırakılıyor.
   * 3. **Yabancı baskıdan Türkçe baskıya geçiliyor.** Bulunan cilt Türkçe
   *    değilse aynı eserin baskıları taranıyor (`raw.editions`, ek istek
   *    gerektirmiyor) ve Türkçe olan açılıyor: *The Other Name* → **Öteki
   *    İsim** (Monokl). Kullanıcının bildirdiği "Septoloji I-II" sorunu tam
   *    olarak buydu.
   *
   * Türkçe baskı bulunamazsa yabancı cilt olduğu gibi dönüyor — kapak ve
   * künye yine gerçek veri, yalnızca çevirisi yok demektir.
   */
  private async resolveFromSource(
    winner: AwardWinner,
    wanted: string,
  ): Promise<AwardMatch | null> {
    const queries = winner.titleTr
      ? [`${winner.titleTr} ${winner.author}`, `${wanted} ${winner.author}`]
      : [`${wanted} ${winner.author}`];

    const opened = new Set<string>();
    for (const query of queries) {
      // Deneme hakkı bittiyse ikinci sorguyu hiç sorma: yanıtı kullanamayız
      if (opened.size >= DETAIL_ATTEMPTS) {
        break;
      }
      const results = await this.binKitap.search(query);
      const candidates = orderCandidates(results, winner, wanted);

      for (const candidate of candidates) {
        const slug = candidate.binKitapSlug;
        // Aynı cilt iki sorgudan da gelebiliyor; sayfası iki kez açılmasın
        if (!slug || opened.has(slug)) {
          continue;
        }
        if (opened.size >= DETAIL_ATTEMPTS) {
          break;
        }
        opened.add(slug);

        const detail = await this.binKitap.getDetail(slug);
        if (!detail || !confirmMatch(detail, winner, wanted)) {
          continue;
        }
        return {
          book: await this.preferTurkish(detail),
          /**
           * Yazarın **kaynaktaki adres anahtarı**. Doğrulanmış künyeden
           * alınıyor, tahmin edilmiyor: yazar sayfası yalnızca bu biçimle
           * açılıyor (ölçüldü, bkz. `BookPerson.binKitapSeoName`) ve adın
           * katlanmış hâli her zaman aynısını vermiyor.
           */
          authorSeo: authorSeoName(detail, winner.author),
        };
      }
    }
    return null;
  }

  /** Türkçe değilse aynı eserin Türkçe baskısına geçer; yoksa olduğu gibi. */
  private async preferTurkish(detail: BinKitapDetail): Promise<BookSource> {
    if (detail.source.language === 'tr') {
      return detail.source;
    }
    const turkish = pickEdition(detail.raw.editions, 'tr', detail.raw.slug);
    if (!turkish) {
      return detail.source;
    }
    const translated = await this.binKitap.getDetail(turkish.slug);
    return translated?.source ?? detail.source;
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
  /**
   * Künyeyi **yerel** kapak adresiyle döner; indirilemezse olduğu gibi.
   *
   * Dış adres bilerek korunuyor: kapağı hiç göstermemektense bir tur daha
   * dışarıdan çekmek yeğ (kural 4). O kayıt bir sonraki turda `localizeCovers`
   * tarafından yeniden denenir, çünkü kapak hâlâ `http` ile başlıyor.
   */
  private async withLocalCover(book: BookSource): Promise<BookSource> {
    const local = await this.covers.download(book.coverImage);
    return local ? { ...book, coverImage: local } : book;
  }

  private async writeCache(cacheKey: string, payload: unknown): Promise<void> {
    await this.prisma.externalCache.upsert({
      where: { cacheKey },
      create: { cacheKey, payload: payload as object, fetchedAt: new Date() },
      update: { payload: payload as object, fetchedAt: new Date() },
    });
  }

  /**
   * Var olan kaydın yalnızca payload'ını değiştirir — **`fetchedAt` sabit
   * kalır.** Kapak indirmek eşleşmeyi tazelemek değildir; tarih güncellenseydi
   * 90 günlük TTL her kapak turunda baştan başlar ve künye hiç yenilenmezdi.
   *
   * Parametre `writeCache` ile aynı sebeple `unknown` (bkz. oradaki not).
   */
  private async patchCache(cacheKey: string, payload: unknown): Promise<void> {
    await this.prisma.externalCache.update({
      where: { cacheKey },
      data: { payload: payload as object },
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
  | { matched: true; book: BookSource; authorSeo?: string | null }
  | { matched: false };

/** Cache'ten okunmuş eşleşme — kitap ve (varsa) yazarın adres anahtarı. */
interface AwardMatch {
  book: BookSource;
  authorSeo: string | null;
}

/** Kapağı hâlâ dışarıda duran bir cache kaydı — yerelleştirme kuyruğunun işi. */
interface CachedCover extends AwardMatch {
  cacheKey: string;
}

/**
 * Kapağı kendi diskimizde **olmayan** eşleşmeler.
 *
 * Ölçüt adresin `http` ile başlaması: yerel kapaklar `/uploads/books/…`
 * biçiminde duruyor, kapağı hiç olmayan kayıt da `null` taşıyor ve ikisinin
 * de yapılacak bir işi yok.
 */
export function remoteCovers(matches: Map<string, AwardMatch>): CachedCover[] {
  const items: CachedCover[] = [];
  for (const [cacheKey, match] of matches) {
    if (match.book.coverImage?.startsWith('http')) {
      items.push({ cacheKey, ...match });
    }
  }
  return items;
}

interface ArchiveHit {
  slug: string;
  coverImage: string | null;
}

interface ArchiveIndex {
  byGoogleId: Map<string, ArchiveHit>;
  byTitle: Map<string, ArchiveHit>;
}

/** Arşivdeki kişilerin adres dizini: kendi slug'ımız ve kaynağın anahtarı. */
interface PersonIndex {
  bySlug: Map<string, string>;
  bySeoName: Map<string, string>;
}

/**
 * Künyeden kazananın yazarını bulup kaynaktaki adres anahtarını döndürür.
 *
 * Ad karşılaştırması gerekli: çok yazarlı ya da çevirmenli künyede ilk kişi
 * her zaman ödülün yazarı değil. Tutan kimse yoksa null döner ve yazar bağı
 * adın katlanmış hâline düşer.
 */
function authorSeoName(detail: BinKitapDetail, author: string): string | null {
  const wanted = normalize(author);
  const hit = detail.credits.people.find(
    (person) => person.role === 'AUTHOR' && normalize(person.name) === wanted,
  );
  return hit?.seoName ?? null;
}

/**
 * Yazar sayfasının adresi. Üç kademe, bu sırayla:
 *
 *  1. **Arşivdeki kişi kaydı** — o sayfada yazarın kitapları da var.
 *  2. **Kaynağın adres anahtarı** — arşivde yoksa sayfa kaynaktan çiziliyor.
 *  3. **Adın katlanmış hâli** — hiç eşleşmemiş kazananda tek elimizdeki bu.
 *
 * Üçüncü kademe bir tahmin ve tutmayabilir; yine de veriliyor çünkü kullanıcı
 * isteği açık: kitap çevrilmemiş olsa bile yazara tıklanabilsin. Tutmadığında
 * kişi sayfası 404 verir, kart tıklanmaz hâle gelmez.
 */
function personSlug(
  author: string,
  authorSeo: string | null,
  people: PersonIndex,
): string | null {
  const own = slugify(author);
  return (
    people.bySlug.get(own) ??
    (authorSeo ? people.bySeoName.get(authorSeo) : undefined) ??
    authorSeo ??
    (own || null)
  );
}

/**
 * Kitap başına cache anahtarı — aynı kitap iki ödülde de aynı anahtarı alır.
 *
 * v2: eşleştirme 1000Kitap'a taşındı. Sürüm artmasaydı v1'de "Google böyle
 * buldu" diye çakılı duran 90 günlük kayıtlar yeni kaynağın önünü keserdi;
 * kullanıcının bildirdiği yanlış eşleşmeler de düzelmezdi.
 */
function cacheKey(winner: AwardWinner): string {
  const wanted = winner.notableWork ?? winner.title;
  return `books:award:v2:${titleKey(wanted, winner.author)}`;
}

/** Ad+yazar karşılaştırma anahtarı; noktalama ve büyük/küçük harf elenir. */
function titleKey(title: string, author: string): string {
  return `${normalize(title)}|${normalize(author)}`;
}

/**
 * Karşılaştırma anahtarı — kod tabanının geri kalanıyla **aynı** katlayıcı.
 *
 * Eskiden yerel bir gerçekleme vardı ve `\p{L}`yi koruduğu için diakritikleri
 * katlamıyordu. Ölçümde bunun bedeli görüldü: kaynak "Kenzaburo Oe" yazarken
 * listede "Kenzaburō Ōe" duruyor ve yazar tutmadığı için kitap hiç
 * eşleşmiyordu (Szymborska, Kertész, Le Clézio aynı sebeple ıskalanıyordu).
 * `slugify` hem Türkçe harfleri hem de birleşen aksan işaretlerini katlıyor;
 * `BookPerson.slug` da zaten onunla üretiliyor, yani ikisi artık aynı dili
 * konuşuyor.
 *
 * Kesme işareti önce siliniyor: `slugify` onu ayraca çevirir ve
 * "Burger's Daughter" → "burger-s-daughter" olurdu.
 */
function normalize(value: string): string {
  return slugify(value.replace(/[’'`]/g, ''));
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

/**
 * Gevşek (içerme) eşleşmesinin kabul edildiği en kısa anahtar.
 *
 * Ödül listesinde üç harfli adlar var (*It*, *Us*, *Ru*). Sınır olmasaydı
 * "us" anahtarı "kürk mantolu madonna" dışında hemen her Türkçe ada tutardı;
 * tam eşitlik yine her uzunlukta geçerli.
 */
const MIN_LOOSE_KEY = 4;

/**
 * İki ad kümesinin ne kadar tuttuğu: 2 = birebir, 1 = içerme, 0 = tutmuyor.
 *
 * Üç kademe gerekli çünkü içerme tek başına yanıltıyor: "Dune Mesihi" adı
 * "Dune"u içeriyor ve serinin en çok okunan cildi olabiliyor — kademe
 * olmasaydı *Dune* ödülüne *Dune Mesihi* eşleşirdi.
 */
function titleRank(left: string[], right: string[]): 0 | 1 | 2 {
  let best: 0 | 1 | 2 = 0;
  for (const one of left) {
    for (const other of right) {
      /**
       * Boş anahtar atlanıyor. `slugify` ASCII dışı yazıları tamamen
       * eliyor (Japonca/Kiril bir orijinal ad boş dizeye düşüyor); guard
       * olmasaydı iki boş anahtar "birebir aynı" sayılır ve alakasız iki
       * kitap eşleşirdi.
       */
      if (!one || !other) {
        continue;
      }
      if (one === other) {
        return 2;
      }
      const [shorter, longer] =
        one.length <= other.length ? [one, other] : [other, one];
      if (shorter.length >= MIN_LOOSE_KEY && longer.includes(shorter)) {
        best = 1;
      }
    }
  }
  return best;
}

/** İki ad kümesinden herhangi bir çift örtüşüyor mu (kademe önemsizse). */
function keysOverlap(left: string[], right: string[]): boolean {
  return titleRank(left, right) > 0;
}

/** Kazananın aranabilir adları: orijinal ad ve (varsa) Türkçe ad. */
function awardTitleKeys(winner: AwardWinner, wanted: string): string[] {
  return [
    normalize(wanted),
    winner.titleTr ? normalize(winner.titleTr) : null,
  ].filter((value): value is string => value !== null);
}

/** Yazar adı tutuyor mu; "Erikson, Steven" gibi biçimler için gevşek. */
function matchesAuthor(authors: string[], author: string): boolean {
  const authorKey = normalize(author);
  if (!authorKey) {
    return false;
  }
  return authors.some((name) => {
    const key = normalize(name);
    return (
      key !== '' &&
      (key === authorKey || key.includes(authorKey) || authorKey.includes(key))
    );
  });
}

/**
 * 1000Kitap arama sonucunu deneme sırasına dizer.
 *
 * Yazarı tutmayan kayıt hiç listeye girmiyor. Kalanlar önce **ad kademesine**
 * (birebir > içerme > yok), sonra okunma sayısına göre sıralanıyor — ölçüldü ki bu
 * kaynakta gürültüyü ayıran en iyi tek sinyal okunma sayısı ("The Vegetarian"
 * 10.108, aynı yazarın alakasız cildi 1.204).
 *
 * **Adı tutmayan aday da listede kalıyor**, çünkü arama sonucu alt başlık
 * taşımıyor: *Septology* araması "The Other Name" döndürüyor ve doğru kitap
 * olduğu ancak künye açılınca anlaşılıyor. Eleme işini `confirmMatch` yapar.
 *
 * Saf işlev ve rafın doğruluğu buna bağlı — `awards.service.spec.ts` doğrudan
 * sınıyor (`pickBest` ile aynı gerekçe).
 */
export function orderCandidates(
  results: BookSource[],
  winner: AwardWinner,
  wanted: string,
): BookSource[] {
  const keys = awardTitleKeys(winner, wanted);
  return results
    .filter((item) => matchesAuthor(item.authors, winner.author))
    .map((item) => ({ item, rank: titleRank(keys, [normalize(item.title)]) }))
    .sort((a, b) => b.rank - a.rank || b.item.popularity - a.item.popularity)
    .map((entry) => entry.item);
}

/**
 * Açılan künye gerçekten bu kazananın kitabı mı.
 *
 * Ad birden çok yerde saklanabiliyor, hepsi deneniyor: baskının adı, **alt
 * başlığı** ("Septoloji I-II"), orijinal adı ve aynı eserin diğer baskılarının
 * adları. Son madde kritik — Türkçe baskının adı orijinaliyle hiç ilgisiz
 * olabiliyor (*Septology* → *Öteki İsim*) ve bağ ancak İngilizce baskının adı
 * üzerinden kuruluyor.
 *
 * **Seri adı bilerek DIŞARIDA.** Ölçümde yakalandı: *Wolf Hall* (Booker 2009)
 * aynı üçlemenin ikinci cildi olan *Bring Up the Bodies*'e eşleşti. Üçlemenin
 * adı da "Wolf Hall" ve künyeye `altbaslik` alanından giriyor; cilt işareti
 * taşıdığında `readSeries` onu `seriesName`e yazıyor. Seri adı kitabın adı
 * değildir ve listede eseriyle aynı adı taşıyan seriler var (Dune, Wolf Hall)
 * — yani bu anahtar yalnızca yanlış eşleşme üretebiliyor, doğru bir eşleşmeyi
 * kurtardığı tek bir hâl yok.
 *
 * **Doğrulanamayan kalan risk:** kaynak aynı adı cilt işareti OLMADAN
 * yazarsa `readSeries` onu seri saymıyor ve ad `subtitle`a düşüyor; oradan
 * yine geçer. Bu ihtimal canlıda sınanamadı (site o sırada 429 veriyordu).
 * Alt başlık anahtarı korunuyor çünkü Septology eşleşmesi tam da ona bağlı.
 */
export function confirmMatch(
  detail: BinKitapDetail,
  winner: AwardWinner,
  wanted: string,
): boolean {
  const { source } = detail;
  if (!matchesAuthor(source.authors, winner.author)) {
    return false;
  }
  const candidateKeys = [
    source.title,
    source.subtitle,
    source.originalTitle,
    ...detail.raw.editions.flatMap((edition) => [
      edition.title,
      edition.subtitle,
    ]),
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalize);

  return keysOverlap(awardTitleKeys(winner, wanted), candidateKeys);
}
