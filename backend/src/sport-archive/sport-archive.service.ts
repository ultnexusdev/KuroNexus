import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Salon 06 · Spor Arşivi — okuma servisi.
 *
 * Mevcut `SportService`ten AYRI bir modül: o, evren tabanlı eski spor verisini
 * (SportPlayer/SportLegend/RaceEvent/DriverStanding) sunuyor ve GsHall/F1Hall
 * onunla çalışıyor. Bu modül yeni arşiv modellerini sunuyor. İkisi bir süre
 * yan yana yaşayacak; göç ayrı bir karar (bkz. şema yorumu "karar 4").
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
   * Landing yalnızca "bu dünyanın içinde gösterilecek bir şey var mı" bilgisine
   * ihtiyaç duyuyor; kayıtların kendisini çekmiyor. İki `count` yeterli ve
   * ikisi de kapsayıcı indeksten (`[isPublished, isDeleted, orderIndex]`)
   * karşılanıyor.
   *
   * Sayı sıfırsa ön yüz o dünyanın bandını HİÇ çizmiyor — boş oda yasağı.
   */
  async getOverview() {
    const [footballClubs, f1Circuits] = await Promise.all([
      this.prisma.footballClub.count({ where: SportArchiveService.LIVE }),
      this.prisma.f1Circuit.count({ where: SportArchiveService.LIVE }),
    ]);
    return { footballClubs, f1Circuits };
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
   */
  async getF1Hub() {
    const circuits = await this.prisma.f1Circuit.findMany({
      where: SportArchiveService.LIVE,
      orderBy: [{ personalRank: 'asc' }, { orderIndex: 'asc' }],
      select: {
        slug: true,
        name: true,
        countryCode: true,
        lengthMeters: true,
        cornerCount: true,
        firstGrandPrixYear: true,
        personalRank: true,
      },
    });
    return { circuits };
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
}
