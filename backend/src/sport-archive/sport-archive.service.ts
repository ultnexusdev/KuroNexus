import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Salon 06 · Spor Arşivi — okuma servisi.
 *
 * Kanadın TEK okuma servisi. Eskiden yanında `SportService` vardı (evren
 * tabanlı SportPlayer/SportLegend/RaceEvent/DriverStanding, GsHall/F1Hall'a
 * hizmet ediyordu); salon bileşenleri 8 Ağustos'ta, servisin kendisi
 * 15 Ağustos'ta silindi. O dört tablo ŞEMADA DURUYOR ama artık hiçbir kod
 * yolu okumuyor — veri göçü hâlâ ayrı bir karar (bkz. şema yorumu).
 *
 * ── YAYIN KAPISI ──────────────────────────────────────────────────────────
 * Her sorgu `isPublished: true, isDeleted: false` süzüyor. Anlatının GERÇEKTEN
 * dolu olduğunu ayrıca kontrol etmiyoruz çünkü veritabanı bunu zaten garanti
 * ediyor: `FootballEra_published_has_narrative` ve kardeşleri, anlatısı boş
 * (ya da yalnızca boşluk karakteri olan) bir satırın `isPublished = true`
 * olmasına izin vermiyor. Yani "yayınlanmış" burada "gösterilebilir" demek.
 * Bu, boş oda yasağının servis katmanındaki karşılığı — kural DDL'de, bu
 * dosya yalnızca ona güveniyor.
 */
@Injectable()
export class SportArchiveService {
  constructor(private readonly prisma: PrismaService) {}

  /** Yayınlanmış + silinmemiş — her sorgunun tabanı. */
  private static readonly LIVE = { isPublished: true, isDeleted: false };

  /**
   * ⚠️ TASARIMIN TEK KIRILMA NOKTASI, TEK YERDE TOPLANDI.
   *
   * `FootballEraFigure` "efsane hangi dönemde" sorusunun yetkilisi; "efsane
   * hangi kulübün" sorusunun yetkilisi ise `FootballLegend.clubId`. İki yol
   * arasındaki tutarsızlık — Fenerbahçe efsanesini Galatasaray dönemine
   * bağlamak — bir CHECK ile engellenemiyor (çapraz tablo) ve test edilemeyen
   * bir veritabanında tetikleyici kabul edilmedi.
   *
   * Güvence bu yardımcıda: dönem figürleri HER ZAMAN kulüp süzgeciyle okunur.
   * Süzgecin bedeli yok — `FootballLegend @@index([clubId, isPublished,
   * isDeleted, orderIndex])` tarafından karşılanıyor.
   *
   * Bu yardımcıyı atlayıp elle `figures: { include: { legend: true } }` yazan
   * her sorgu sessizce yanlış veri döndürebilir.
   */
  private figuresOfClub(clubId: string) {
    return {
      where: { legend: { clubId, ...SportArchiveService.LIVE } },
      orderBy: { orderIndex: 'asc' as const },
      include: {
        legend: {
          select: {
            slug: true,
            name: true,
            epithetTr: true,
            epithetEn: true,
            portraitImage: true,
            countryCode: true,
          },
        },
      },
    };
  }

  /**
   * Sayfa 1 — `/spor` girişi.
   *
   * ── GENİŞLETİLDİ (13 Ağustos 2026) ───────────────────────────────────────
   * Önceki sürüm iki `count` döndürüyordu ve landing bunlarla yalnızca "bandı
   * çiz / çizme" kararı veriyordu. Sonuç: iki kapı, arkalarında ne olduğuna
   * dair tek işaret yok. Bir arşiv girişinin söylemesi gereken şey elindeki
   * kapı sayısı değil, KOLEKSİYONUN ÖLÇÜSÜ ve ŞEKLİ.
   *
   * Şimdi dört şey dönüyor ve dördü de zaten yazılmış veriden geliyor —
   * hiçbiri uydurulmuş bir rozet değil:
   *   1. `counts`     — koleksiyon künyesi (kaç dünya, kulüp, efsane, pist, an)
   *   2. `football`   — kapının ardındaki isimler (öne çıkan kulüp + efsane)
   *   3. `f1`         — kapının ardındaki ölçü (pist + senkronize sezon aralığı)
   *   4. `chronology` — iki dünyanın anlarını TEK zaman şeridinde birleştiren
   *                     kronoloji; sayfa 1'de yoktu, çünkü hiçbir uç iki dünyayı
   *                     birlikte okumuyordu.
   *
   * ⚠️ `footballClubs` / `f1Circuits` KALDIRILMADI. Ön yüz iki servisi ayrı
   * deploy ediyor; eski frontend yeni backend'e bir süre bakacak. Bu iki alan
   * o pencerede sayfanın çalışmaya devam etmesini sağlıyor.
   *
   * Sayı sıfırsa ön yüz o dünyanın bandını HİÇ çizmiyor — boş oda yasağı.
   */
  async getOverview() {
    const [
      footballClubs,
      f1Circuits,
      legendCount,
      footballMomentCount,
      f1MomentCount,
      featuredClub,
      featuredLegend,
      featuredCircuit,
      raceSpan,
      raceCount,
      footballMoments,
      f1Moments,
      driverSpans,
      f1Legends,
      footballLegends,
    ] = await Promise.all([
      this.prisma.footballClub.count({ where: SportArchiveService.LIVE }),
      this.prisma.f1Circuit.count({ where: SportArchiveService.LIVE }),
      this.prisma.footballLegend.count({ where: SportArchiveService.LIVE }),
      this.prisma.footballMoment.count({ where: SportArchiveService.LIVE }),
      this.prisma.f1Moment.count({ where: SportArchiveService.LIVE }),

      this.prisma.footballClub.findFirst({
        where: { ...SportArchiveService.LIVE, isFeatured: true },
        orderBy: { orderIndex: 'asc' },
        select: {
          slug: true,
          name: true,
          foundedYear: true,
          cityName: true,
          taglineTr: true,
          taglineEn: true,
          // Bandın arkasındaki görsel. Yoksa bant bugünkü hâliyle — yalnız
          // ışıkla — çiziliyor; yarım bir görsel katmanı gösterilmiyor.
          coverImage: true,
          // Kırpmanın odağı ve büyütmesi — küratör yazıyor, `null` ise
          // ön yüz CSS varsayılanına düşüyor (bkz. şema notu).
          coverPosition: true,
          coverScale: true,
        },
      }),
      // "Sıralamamda 1." — `personalRank` null olanlar sona (Postgres ASC
      // varsayılanı), yani küratör sıralaması yoksa küratör düzenine düşüyor.
      this.prisma.footballLegend.findFirst({
        where: SportArchiveService.LIVE,
        orderBy: [{ personalRank: 'asc' }, { orderIndex: 'asc' }],
        select: {
          slug: true,
          name: true,
          epithetTr: true,
          epithetEn: true,
          countryCode: true,
          yearsFrom: true,
          yearsTo: true,
          personalRank: true,
          club: { select: { slug: true, name: true } },
        },
      }),
      this.prisma.f1Circuit.findFirst({
        where: SportArchiveService.LIVE,
        orderBy: [{ personalRank: 'asc' }, { orderIndex: 'asc' }],
        select: {
          slug: true,
          name: true,
          countryCode: true,
          cityName: true,
          nicknameTr: true,
          nicknameEn: true,
          lengthMeters: true,
          cornerCount: true,
          firstGrandPrixYear: true,
          coverImage: true,
          coverPosition: true,
          coverScale: true,
        },
      }),

      // Podyum tarihi OLGU katmanı: `isPublished` süzgeci yok (bkz. getCircuit)
      this.prisma.f1RaceResult.aggregate({
        where: { isDeleted: false },
        _min: { seasonYear: true },
        _max: { seasonYear: true },
      }),
      this.prisma.f1RaceResult.count({
        where: { isDeleted: false, position: 1 },
      }),

      this.prisma.footballMoment.findMany({
        where: { ...SportArchiveService.LIVE, isHighlight: true },
        orderBy: { year: 'asc' },
        select: {
          year: true,
          titleTr: true,
          titleEn: true,
          kind: true,
          // Kartın üstündeki arşiv fotoğrafı şeridi. Boşsa şerit HİÇ
          // çizilmiyor ve kart kısalıyor — kartlar eksene yaslandığı için
          // farklı yükseklikler tırtıklı bir kenar üretmiyor.
          imageUrl: true,
          // Kartın küçük alt satırı. Eskiden kulübün adından TÜRETİLİYORDU;
          // artık küratörün yazdığı serbest metin (bkz. şema notu).
          labelTr: true,
          labelEn: true,
          month: true,
          day: true,
          // Bağ kolonu duruyor ama kart artık TIKLANMIYOR (kullanıcı
          // isteği, 14 Ağustos 2026) — ileride sayfaya bağlanacak.
          era: {
            select: {
              slug: true,
              club: { select: { slug: true } },
            },
          },
        },
      }),
      this.prisma.f1Moment.findMany({
        where: { ...SportArchiveService.LIVE, isHighlight: true },
        orderBy: { seasonYear: 'asc' },
        select: {
          seasonYear: true,
          titleTr: true,
          titleEn: true,
          imageUrl: true,
          labelTr: true,
          labelEn: true,
          month: true,
          day: true,
          circuit: { select: { slug: true } },
        },
      }),
      /*
       * ⚠️ PİSTİN İLK GRAND PRIX'İ ARTIK KRONOLOJİYE GİRMİYOR.
       *
       * Buradaki sorgu, `firstGrandPrixYear` dolu her pist için sanal bir
       * kronoloji satırı üretiyordu ('1950 · Takvime giriyor · MONZA').
       * İki şeyi birden bozuyordu:
       *
       *   1. O satır bir KAYIT DEĞİLDİ. Küratör panelindeki 'Mevcut
       *      kayıtlar' listesinde görünmüyor, düzenlenemiyor, silinemiyordu
       *      (kullanıcı bildirimi: '1950 küratör modunda görünmüyor').
       *   2. Şeridin F1 ucunu tek bir PİSTİN adıyla dolduruyordu. Monza
       *      bir pist, Formula 1'in tamamı değil (kullanıcı bildirimi).
       *
       * Sorgu tamamen kaldırıldı; aynı bilgi istenirse artık normal bir
       * an kaydı olarak eklenir ve düzenlenebilir olur.
       */

      /**
       * EFSANELER — İKİ TABLODAN TEK LİSTE.
       *
       * Futbol efsanesi `FootballLegend`, F1 sürücüsü `F1Driver`; ortak bir
       * üst tablo YOK ve olması da gerekmiyor (biri forma numarası ve kulüp
       * taşıyor, diğeri şampiyonluk ve pol sayısı). Birleştirme burada,
       * gösterim katmanının ihtiyacı olan alanlara indirgenerek yapılıyor.
       *
       * ⚠️ F1 portresinin künyesi (lisans + sanatçı + kaynak) ZORUNLU
       * taşınıyor: Commons görselleri CC BY / CC BY-SA ve atıfsız gösterim
       * telif ihlali. Üçü birden dolu değilse ön yüz görseli çizmiyor.
       */
      /**
       * ⚠️ SÜRÜCÜ KÜNYESİ YARIŞ KAYDINDAN TAMAMLANIYOR.
       *
       * `sync-f1-results.ts` sürücü satırına yalnızca ad, slug ve portre
       * yazıyor — `countryCode`, `activeFrom/To` ve `championships` BOŞ
       * kalıyor. Panteona alınan bir sürücünün kartı bu yüzden çıplak bir
       * isme düşüyordu: bayrak yok, yıl yok, künye satırı boş.
       *
       * Eksik olan bilgi aslında elde: podyum satırları hem uyruğu hem de
       * sürücünün arşivdeki ilk/son sezonunu taşıyor. Aşağıdaki toplama onu
       * çıkarıyor. Uydurma değil, YEDEK: küratör alanı doldurduğu an kayıt
       * kazanıyor (bkz. birleştirmedeki `??` sırası).
       */
      this.prisma.f1RaceResult.groupBy({
        by: ['driverId', 'driverNationality'],
        where: { isDeleted: false, driverId: { not: null } },
        _min: { seasonYear: true },
        _max: { seasonYear: true },
      }),
      this.prisma.f1Driver.findMany({
        where: SportArchiveService.LIVE,
        orderBy: [{ personalRank: 'asc' }, { orderIndex: 'asc' }],
        take: 12,
        select: {
          id: true,
          slug: true,
          name: true,
          nicknameTr: true,
          nicknameEn: true,
          countryCode: true,
          activeFrom: true,
          activeTo: true,
          championships: true,
          personalRank: true,
          photo: true,
          portraitLicense: true,
          portraitAuthor: true,
          portraitSourceUrl: true,
        },
      }),
      this.prisma.footballLegend.findMany({
        where: SportArchiveService.LIVE,
        orderBy: [{ personalRank: 'asc' }, { orderIndex: 'asc' }],
        take: 12,
        select: {
          slug: true,
          name: true,
          epithetTr: true,
          epithetEn: true,
          countryCode: true,
          yearsFrom: true,
          yearsTo: true,
          personalRank: true,
          portraitImage: true,
          club: { select: { slug: true, name: true } },
        },
      }),
    ]);

    /**
     * TEK ZAMAN ŞERİDİ. İki dünyanın anları burada birleşiyor — ön yüz üç ayrı
     * diziyi elde birleştirmiyor, çünkü sıralama kararı (aynı yıla düşen iki
     * kayıtta hangisi önce) veri katmanının işi.
     *
     * `world` alanı ön yüzde renk/işaret seçiyor; `*Slug` alanları adresi
     * ön yüzde `sportHref` ile kuruluyor — adres dizesi backend'e sızmıyor.
     *
     * ⚠️ `label` KÜRATÖRÜN YAZDIĞI METİN, türetilmiş değil. Eskiden burada
     * kulübün/pistin adı vardı ve F1 şeridinin her kaydında 'MONZA'
     * yazıyordu — tek bir pist bütün bir dünya gibi görünüyordu (kullanıcı
     * bildirimi, 14 Ağustos 2026). Boş bırakılabilir; boşsa kartta o satır
     * hiç çizilmiyor.
     *
     * `month`/`day` de isteğe bağlı: aynı yıla düşen iki kaydı ayırmak için
     * (kullanıcı isteği). Sıralama (yıl, ay, gün) üçlüsüne göre.
     */
    const chronology = [
      ...footballMoments.map((m) => ({
        year: m.year,
        month: m.month,
        day: m.day,
        world: 'football' as const,
        kind: String(m.kind),
        titleTr: m.titleTr,
        titleEn: m.titleEn,
        labelTr: m.labelTr,
        labelEn: m.labelEn,
        imageUrl: m.imageUrl,
        clubSlug: m.era?.club.slug ?? null,
        eraSlug: m.era?.slug ?? null,
        circuitSlug: null as string | null,
      })),
      ...f1Moments.map((m) => ({
        year: m.seasonYear,
        month: m.month,
        day: m.day,
        world: 'f1' as const,
        kind: 'F1_MOMENT',
        titleTr: m.titleTr,
        titleEn: m.titleEn,
        labelTr: m.labelTr,
        labelEn: m.labelEn,
        imageUrl: m.imageUrl,
        clubSlug: null as string | null,
        eraSlug: null as string | null,
        circuitSlug: m.circuit?.slug ?? null,
      })),
    ].sort(
      (a, b) =>
        a.year - b.year ||
        (a.month ?? 0) - (b.month ?? 0) ||
        (a.day ?? 0) - (b.day ?? 0) ||
        a.world.localeCompare(b.world),
    );

    /**
     * Sürücü → arşivdeki uyruk ve ilk/son sezon. `groupBy` uyruğu da eksene
     * kattığı için teorik olarak bir sürücü iki satırla dönebilir (kaynakta
     * uyruk yazımı değişmişse); ilk satır kazanıyor ve yıl aralığı
     * genişletiliyor — sürücünün iki ayrı kaydı olmuş gibi görünmesindense
     * eldeki en geniş aralık doğru cevap.
     */
    const spanByDriver = new Map<
      string,
      { nationality: string | null; from: number | null; to: number | null }
    >();
    for (const row of driverSpans) {
      if (!row.driverId) continue;
      const current = spanByDriver.get(row.driverId);
      spanByDriver.set(row.driverId, {
        nationality: current?.nationality ?? row.driverNationality,
        from: Math.min(
          current?.from ?? Number.POSITIVE_INFINITY,
          row._min.seasonYear ?? Number.POSITIVE_INFINITY,
        ),
        to: Math.max(current?.to ?? 0, row._max.seasonYear ?? 0),
      });
    }

    return {
      // ── geriye uyum: eski frontend bu ikisini okuyor ──
      footballClubs,
      f1Circuits,

      counts: {
        worlds: (footballClubs > 0 ? 1 : 0) + (f1Circuits > 0 ? 1 : 0),
        clubs: footballClubs,
        legends: legendCount,
        circuits: f1Circuits,
        moments: footballMomentCount + f1MomentCount,
      },
      football: { featuredClub, featuredLegend },

      /**
       * Panteon — iki dünyanın efsaneleri tek listede, küratör sırasına göre.
       *
       * `spanByDriver` yukarıdaki toplamanın sözlüğe çevrilmiş hâli; F1
       * sürücüsünün boş künye alanlarını yarış kaydından tamamlıyor.
       *
       * `world` alanı ön yüzde ADRESİ seçiyor: futbol efsanesi
       * `/spor/futbol/efsaneler/…`, F1 sürücüsü `/spor/formula-1/surucular/…`.
       * İki kanat kendi kapısından giriliyor; ortak bir "efsaneler" ağacı
       * kurulsaydı kırıntı hangi dünyaya döneceğini bilemezdi.
       */
      legends: [
        ...footballLegends.map((l) => ({
          world: 'football' as const,
          slug: l.slug,
          name: l.name,
          epithetTr: l.epithetTr,
          epithetEn: l.epithetEn,
          countryCode: l.countryCode,
          yearsFrom: l.yearsFrom,
          yearsTo: l.yearsTo,
          personalRank: l.personalRank,
          nationality: null as string | null,
          subject: l.club?.name ?? null,
          championships: null as number | null,
          portrait: l.portraitImage,
          // Futbol portresi küratörün kendi yüklediği görsel — künye yok
          portraitLicense: null as string | null,
          portraitAuthor: null as string | null,
          portraitSourceUrl: null as string | null,
        })),
        ...f1Legends.map((d) => {
          // Küratörün yazdığı değer HER ZAMAN önce; yarış kaydı yalnızca yedek
          const span = spanByDriver.get(d.id);
          return {
            world: 'f1' as const,
            slug: d.slug,
            name: d.name,
            epithetTr: d.nicknameTr,
            epithetEn: d.nicknameEn,
            countryCode: d.countryCode,
            /** Ülke kodu yoksa bayrağı uyruk sözcüğünden aramak için */
            nationality: d.countryCode ? null : (span?.nationality ?? null),
            yearsFrom: d.activeFrom ?? span?.from ?? null,
            yearsTo: d.activeTo ?? span?.to ?? null,
            personalRank: d.personalRank,
            subject: null as string | null,
            championships: d.championships,
            portrait: d.photo,
            portraitLicense: d.portraitLicense,
            portraitAuthor: d.portraitAuthor,
            portraitSourceUrl: d.portraitSourceUrl,
          };
        }),
      ].sort(
        (a, b) =>
          (a.personalRank ?? 9999) - (b.personalRank ?? 9999) ||
          a.name.localeCompare(b.name),
      ),

      f1: {
        featuredCircuit,
        raceCount,
        seasonFrom: raceSpan._min.seasonYear,
        seasonTo: raceSpan._max.seasonYear,
      },
      chronology,
    };
  }

  /**
   * Sayfa 2 — `/spor/futbol` hub'ı.
   *
   * Üç keşif yüzeyi, üçü de boş olabilir ve boşsa ön yüzde hiç çizilmez:
   *   1. öne çıkan dünya (`isFeatured`)
   *   2. efsane şeridi — `personalRank` önce, sonra küratör sırası
   *   3. tarih şeridi — yalnızca `isHighlight` anlar
   */
  async getFootballHub() {
    const [featuredClub, clubs, legends, moments] = await Promise.all([
      this.prisma.footballClub.findFirst({
        where: { ...SportArchiveService.LIVE, isFeatured: true },
        orderBy: { orderIndex: 'asc' },
      }),
      this.prisma.footballClub.findMany({
        where: SportArchiveService.LIVE,
        orderBy: { orderIndex: 'asc' },
        select: {
          slug: true,
          name: true,
          foundedYear: true,
          crestImage: true,
          taglineTr: true,
          taglineEn: true,
        },
      }),
      this.prisma.footballLegend.findMany({
        where: SportArchiveService.LIVE,
        // `personalRank` null olanlar sona: "benim ilk 10'um" listede olmayanı
        // öne almasın. Postgres varsayılanı ASC'de NULL'ları SONA koyar.
        orderBy: [{ personalRank: 'asc' }, { orderIndex: 'asc' }],
        select: {
          slug: true,
          name: true,
          epithetTr: true,
          epithetEn: true,
          portraitImage: true,
          countryCode: true,
          yearsFrom: true,
          yearsTo: true,
          personalRank: true,
        },
      }),
      this.prisma.footballMoment.findMany({
        where: { ...SportArchiveService.LIVE, isHighlight: true },
        orderBy: { year: 'asc' },
        select: {
          year: true,
          titleTr: true,
          titleEn: true,
          kind: true,
          era: { select: { slug: true, club: { select: { slug: true } } } },
        },
      }),
    ]);
    return { featuredClub, clubs, legends, moments };
  }

  /**
   * Sayfa 3 — `/spor/futbol/[clubSlug]` kulüp dünyası.
   *
   * Omurga kronolojik dönemler; anlar ve figürler DÖNEMİN İÇİNDE geliyor,
   * ayrı bir ızgarada değil. Tek sorgu, iç içe `include` — Prisma ilişki başına
   * bir ifade atıyor, satır başına değil.
   */
  async getClub(slug: string) {
    const club = await this.prisma.footballClub.findFirst({
      where: { slug, ...SportArchiveService.LIVE },
    });
    if (!club) {
      throw new NotFoundException('SPORT_ARCHIVE.CLUB_NOT_FOUND');
    }

    const eras = await this.prisma.footballEra.findMany({
      where: { clubId: club.id, ...SportArchiveService.LIVE },
      orderBy: [{ orderIndex: 'asc' }, { startYear: 'asc' }],
      include: {
        moments: {
          where: SportArchiveService.LIVE,
          orderBy: [{ orderIndex: 'asc' }, { year: 'asc' }],
          include: {
            legend: { select: { slug: true, name: true } },
            match: true,
          },
        },
        // Kulüp tutarlılık süzgeci burada — elle yazılmıyor (bkz. figuresOfClub)
        figures: this.figuresOfClub(club.id),
        quotes: {
          where: SportArchiveService.LIVE,
          orderBy: { orderIndex: 'asc' },
        },
        images: {
          where: { isDeleted: false },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    const [quotes, images] = await Promise.all([
      this.prisma.sportQuote.findMany({
        where: { clubId: club.id, ...SportArchiveService.LIVE },
        orderBy: { orderIndex: 'asc' },
      }),
      this.prisma.sportImage.findMany({
        where: { clubId: club.id, isDeleted: false },
        orderBy: { orderIndex: 'asc' },
      }),
    ]);

    return { club, eras, quotes, images };
  }

  /**
   * Sayfa 4 — `/spor/futbol/efsaneler/[slug]` efsane sayfası.
   *
   * Anlar DÖNEMLER ARASINDAN tek taramada geliyor: `FootballMoment` üzerindeki
   * `[legendId, isPublished, isDeleted, year]` indeksi tam bunun için. Efsanede
   * ikinci bir sahip alanı tutmaya gerek kalmıyor.
   */
  async getLegend(slug: string) {
    const legend = await this.prisma.footballLegend.findFirst({
      where: { slug, ...SportArchiveService.LIVE },
      include: {
        club: { select: { slug: true, name: true, crestImage: true } },
      },
    });
    if (!legend) {
      throw new NotFoundException('SPORT_ARCHIVE.LEGEND_NOT_FOUND');
    }

    const [moments, eraFigures, quotes, images] = await Promise.all([
      this.prisma.footballMoment.findMany({
        where: { legendId: legend.id, ...SportArchiveService.LIVE },
        orderBy: { year: 'asc' },
        include: {
          era: { select: { slug: true, titleTr: true, titleEn: true } },
          match: true,
        },
      }),
      this.prisma.footballEraFigure.findMany({
        where: { legendId: legend.id, era: SportArchiveService.LIVE },
        orderBy: { orderIndex: 'asc' },
        include: {
          era: {
            select: {
              slug: true,
              titleTr: true,
              titleEn: true,
              startYear: true,
              endYear: true,
            },
          },
        },
      }),
      this.prisma.sportQuote.findMany({
        where: { legendId: legend.id, ...SportArchiveService.LIVE },
        orderBy: { orderIndex: 'asc' },
      }),
      this.prisma.sportImage.findMany({
        where: { legendId: legend.id, isDeleted: false },
        orderBy: { orderIndex: 'asc' },
      }),
    ]);

    return { legend, moments, eraFigures, quotes, images };
  }

  /**
   * Sayfa 5 — `/spor/formula-1` hub'ı. Sayfanın kendisi bir dizin, o yüzden
   * dönen şey de bir dizin: künye satırları, anlatı gövdesi değil.
   *
   * ── DEFTER EKLENDİ (13 Ağustos 2026) ─────────────────────────────────────
   * Hub tek bir pist tablosuydu ve "Formula 1 arşivi" değil "bir pist tablosu"
   * gibi okunuyordu. Eksik olan şey içerik DEĞİLDİ: `F1RaceResult` senkronize
   * edilmiş yüzlerce podyum satırı taşıyor ve hiçbir sayfa onu okumuyordu.
   *
   * Defter o satırlardan TÜRETİLİYOR — elle yazılmış tek bir sayı yok:
   *   · kazananlar   — pistlerdeki galibiyet sayısına göre sürücüler
   *   · takımlar     — aynı sayım, konstrüktör ekseninde
   *   · kapsam       — kaç yarış, hangi sezon aralığı, kaç isim
   *
   * ⚠️ SÜZGEÇ `position: 1`. "Podyum" ve "galibiyet" aynı şey değil; defterin
   * başlığı galibiyet diyorsa sorgu da galibiyet saymalı. Podyum sayısı ayrı
   * bir sütun olarak sonradan eklenebilir — uydurulamaz.
   *
   * ⚠️ `isPublished` süzgeci YOK ve bilinçli: bu satırlar küratörün yazdığı
   * anlatı değil senkronizasyonun getirdiği olgu (bkz. getCircuit yorumu).
   */
  async getF1Hub() {
    const WON = { isDeleted: false, position: 1 };

    const [circuits, winners, constructors, podiumNames, span, raceCount] =
      await Promise.all([
        this.prisma.f1Circuit.findMany({
          where: SportArchiveService.LIVE,
          orderBy: [{ personalRank: 'asc' }, { orderIndex: 'asc' }],
          select: {
            slug: true,
            name: true,
            countryCode: true,
            cityName: true,
            nicknameTr: true,
            nicknameEn: true,
            lengthMeters: true,
            cornerCount: true,
            firstGrandPrixYear: true,
            lapRecordTime: true,
            lapRecordYear: true,
            personalRank: true,
          },
        }),

        this.prisma.f1RaceResult.groupBy({
          by: ['driverName', 'driverNationality'],
          where: WON,
          _count: { _all: true },
          _min: { seasonYear: true },
          _max: { seasonYear: true },
          orderBy: [{ _count: { driverName: 'desc' } }, { driverName: 'asc' }],
          take: 12,
        }),

        this.prisma.f1RaceResult.groupBy({
          by: ['constructorName'],
          where: { ...WON, constructorName: { not: null } },
          _count: { _all: true },
          _min: { seasonYear: true },
          _max: { seasonYear: true },
          orderBy: [
            { _count: { constructorName: 'desc' } },
            { constructorName: 'asc' },
          ],
          take: 10,
        }),

        // Podyuma çıkmış farklı isim sayısı — kapsamın gerçek genişliği.
        // `take` yok: sayının kendisi lazım, satırlar değil.
        this.prisma.f1RaceResult.groupBy({
          by: ['driverName'],
          where: { isDeleted: false },
          _count: { _all: true },
        }),

        this.prisma.f1RaceResult.aggregate({
          where: { isDeleted: false },
          _min: { seasonYear: true },
          _max: { seasonYear: true },
        }),

        this.prisma.f1RaceResult.count({ where: WON }),
      ]);

    return {
      circuits,
      ledger: {
        raceCount,
        seasonFrom: span._min.seasonYear,
        seasonTo: span._max.seasonYear,
        podiumNameCount: podiumNames.length,
        winners: winners.map((w) => ({
          name: w.driverName,
          nationality: w.driverNationality,
          wins: w._count._all,
          firstYear: w._min.seasonYear,
          lastYear: w._max.seasonYear,
        })),
        constructors: constructors.map((c) => ({
          name: c.constructorName as string,
          wins: c._count._all,
          firstYear: c._min.seasonYear,
          lastYear: c._max.seasonYear,
        })),
      },
    };
  }

  /**
   * Sayfa 7 — `/spor/formula-1/surucular/[slug]` sürücü sayfası.
   *
   * Futbol efsanesinin karşılığı ama AYNI SAYFA DEĞİL: futbolda omurga
   * anlatı ve dönemler, burada omurga KAYIT. Sürücünün arşivdeki podyum
   * satırları senkronizasyondan geliyor ve sayfanın gövdesini onlar kuruyor;
   * küratör anlatısı yazıldığında onun ÜSTÜNE oturuyor, yerine değil.
   *
   * `isPublished` süzgeci var: 96 sürücü kaydı var ama sayfası olan yalnızca
   * küratörün panteona aldıkları. Yayınlanmamış sürücünün adresi 404 döner.
   */
  async getDriver(slug: string) {
    const driver = await this.prisma.f1Driver.findFirst({
      where: { slug, ...SportArchiveService.LIVE },
    });
    if (!driver) {
      throw new NotFoundException('SPORT_ARCHIVE.DRIVER_NOT_FOUND');
    }

    const [results, moments, lapRecords, quotes] = await Promise.all([
      this.prisma.f1RaceResult.findMany({
        where: { driverId: driver.id, isDeleted: false },
        orderBy: [{ seasonYear: 'desc' }, { position: 'asc' }],
        select: {
          id: true,
          seasonYear: true,
          position: true,
          raceName: true,
          constructorName: true,
          timeText: true,
          // Sürücünün `countryCode`u boş (sync yazmıyor); bayrak bu alandan
          // türetiliyor — aynı bilginin başka yazımı, uydurma değil.
          driverNationality: true,
          circuit: { select: { slug: true, name: true, countryCode: true } },
        },
      }),
      this.prisma.f1Moment.findMany({
        where: { driverId: driver.id, ...SportArchiveService.LIVE },
        orderBy: { seasonYear: 'asc' },
        select: {
          id: true,
          seasonYear: true,
          titleTr: true,
          titleEn: true,
          narrativeTr: true,
          narrativeEn: true,
          circuit: { select: { slug: true, name: true } },
        },
      }),
      // "Bu pistin tur rekoru bende" — FK sayesinde sürücü ucundan sorulabiliyor
      this.prisma.f1Circuit.findMany({
        where: { lapRecordDriverId: driver.id, ...SportArchiveService.LIVE },
        orderBy: { lapRecordYear: 'asc' },
        select: {
          slug: true,
          name: true,
          lapRecordTime: true,
          lapRecordYear: true,
        },
      }),
      this.prisma.sportQuote.findMany({
        where: { driverId: driver.id, ...SportArchiveService.LIVE },
        orderBy: { orderIndex: 'asc' },
      }),
    ]);

    return { driver, results, moments, lapRecords, quotes };
  }

  /**
   * Sayfa 6 — `/spor/formula-1/pistler/[slug]` pist sayfası.
   *
   * Virajlar çizimin üstüne oturacak (`markerX/markerY`), o yüzden çizim
   * verisiyle birlikte tek pakette dönüyorlar.
   */
  async getCircuit(slug: string) {
    const circuit = await this.prisma.f1Circuit.findFirst({
      where: { slug, ...SportArchiveService.LIVE },
      include: {
        lapRecordDriver: { select: { slug: true, name: true } },
        corners: {
          where: SportArchiveService.LIVE,
          orderBy: [{ orderIndex: 'asc' }, { number: 'asc' }],
        },
      },
    });
    if (!circuit) {
      throw new NotFoundException('SPORT_ARCHIVE.CIRCUIT_NOT_FOUND');
    }

    const [moments, quotes, images, results] = await Promise.all([
      this.prisma.f1Moment.findMany({
        where: { circuitId: circuit.id, ...SportArchiveService.LIVE },
        orderBy: { seasonYear: 'asc' },
        include: {
          driver: { select: { slug: true, name: true } },
          season: { select: { slug: true, year: true } },
        },
      }),
      this.prisma.sportQuote.findMany({
        where: { circuitId: circuit.id, ...SportArchiveService.LIVE },
        orderBy: { orderIndex: 'asc' },
      }),
      this.prisma.sportImage.findMany({
        where: { circuitId: circuit.id, isDeleted: false },
        orderBy: { orderIndex: 'asc' },
      }),
      /**
       * VERİ KATMANI — podyum tarihi.
       *
       * `isPublished` süzgeci YOK ve bu bilinçli: bu satırlar küratörün
       * yazdığı anlatı değil, senkronizasyonun getirdiği olgu. Yayın kararı
       * anlatı katmanının kavramı; olgunun "taslağı" olmaz.
       *
       * Portre künyesi (lisans + sanatçı) sürücüyle birlikte geliyor çünkü
       * gösterimde ZORUNLU: Commons görsellerinin çoğu CC BY / CC BY-SA.
       * Üçü birden dolu değilse ön yüz görseli çizmiyor.
       */
      this.prisma.f1RaceResult.findMany({
        where: { circuitId: circuit.id, isDeleted: false },
        orderBy: [{ seasonYear: 'desc' }, { position: 'asc' }],
        include: {
          driver: {
            select: {
              slug: true,
              photo: true,
              portraitLicense: true,
              portraitAuthor: true,
              portraitSourceUrl: true,
            },
          },
        },
      }),
    ]);

    return { circuit, moments, quotes, images, results };
  }
  /**
   * Favori futbolcu sayfasının görsel yuvaları — düz harita.
   *
   * ── NEDEN HARİTA, DİZİ DEĞİL ─────────────────────────────────────────────
   * Tüketici tarafta her yuva kendi kimliğiyle aranıyor ("hero" nerede?).
   * Dizi dönseydi ön yüz her çizimde `find()` yapardı; harita o aramayı
   * sunucuda bir kez yapıyor ve JSON da daha küçük oluyor.
   *
   * Futbolcunun defterde olup olmadığı BURADA bilinmiyor — defter depoda bir
   * TypeScript dosyası. O yüzden bilinmeyen slug 404 değil boş harita döner:
   * "kaydı yok" ile "fotoğrafı yok" bu uç için aynı şey.
   */
  async getPlayerImages(playerSlug: string): Promise<Record<string, string>> {
    const rows = await this.prisma.favouritePlayerImage.findMany({
      where: { playerSlug, isDeleted: false },
      select: { slotId: true, url: true },
    });

    const map: Record<string, string> = {};
    for (const row of rows) map[row.slotId] = row.url;
    return map;
  }

  /**
   * BÜTÜN futbolcuların yuvaları — tek sorgu, iki katlı harita.
   *
   * Hub ve efsaneler salonu defterdeki her futbolcunun kart yuvasını çiziyor;
   * futbolcu başına bir istek atmak yirmi üç kayıtta yirmi dört tur demekti.
   * Tablo küçük (yuva başına bir satır) ve `isDeleted` filtresi dışında
   * daraltılacak bir şey yok, o yüzden tamamı tek seferde okunuyor.
   */
  async getAllPlayerImages(): Promise<Record<string, Record<string, string>>> {
    const rows = await this.prisma.favouritePlayerImage.findMany({
      where: { isDeleted: false },
      select: { playerSlug: true, slotId: true, url: true },
    });

    const out: Record<string, Record<string, string>> = {};
    for (const row of rows) {
      const bucket = (out[row.playerSlug] ??= {});
      bucket[row.slotId] = row.url;
    }
    return out;
  }
}
