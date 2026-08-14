import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateSportMomentDto,
  FeatureF1DriverDto,
  SetSportCoverFocusDto,
  SetSportImageDto,
  UpdateSportMomentDto,
} from './dto/curator.dto';

/**
 * Salon 06 · Spor Arşivi — KÜRATÖR servisi.
 *
 * Okuma servisinden (`SportArchiveService`) ayrı bir sınıf ve bu bilinçli:
 * o dosyanın her sorgusu `isPublished: true` süzüyor ve süzmek ZORUNDA.
 * Küratör tam tersini yapıyor — yayınlanmamış kaydı görmesi, yazması ve
 * yayına almak için düzenlemesi gerekiyor. İki kuralı tek dosyada tutmak,
 * bir gün yanlış yerde `LIVE` yazıp taslakları herkese açmanın en kısa yolu.
 *
 * ⚠️ YETKİ BU DOSYADA DEĞİL. Kapı `@Roles('ADMIN')` ile controller'da; bu
 * servis çağrıldıysa yetki zaten doğrulanmıştır.
 */
@Injectable()
export class SportArchiveCuratorService {
  constructor(private readonly prisma: PrismaService) {}

  /** Silinmemiş — küratör YAYINLANMAMIŞI da görür, silinmişi görmez. */
  private static readonly ALIVE = { isDeleted: false };

  /**
   * Formun açılır listeleri. Tek istek: küratör paneli açıldığında dört ayrı
   * çağrı yapmak, panelin açılışını ağ turlarının toplamı kadar geciktirirdi.
   *
   * `driverCandidates` ayrı ve SINIRLI: 96 sürücünün tamamını bir `<select>`e
   * dökmek kullanılabilir değil. Podyum sayısına göre ilk 40 — panteona
   * girecek isim istatistiksel olarak bu kümenin içinde.
   */
  async context() {
    const [
      clubs,
      circuits,
      legends,
      drivers,
      podiums,
      footballMoments,
      f1Moments,
    ] = await Promise.all([
      this.prisma.footballClub.findMany({
        where: SportArchiveCuratorService.ALIVE,
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          slug: true,
          name: true,
          coverImage: true,
          // Kaydırıcılar açılırken kayıtlı değeri göstersin diye
          coverPosition: true,
          coverScale: true,
          eras: {
            where: SportArchiveCuratorService.ALIVE,
            orderBy: [{ orderIndex: 'asc' }, { startYear: 'asc' }],
            select: {
              id: true,
              slug: true,
              titleTr: true,
              startYear: true,
              endYear: true,
            },
          },
        },
      }),
      this.prisma.f1Circuit.findMany({
        where: SportArchiveCuratorService.ALIVE,
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          slug: true,
          name: true,
          coverImage: true,
          coverPosition: true,
          coverScale: true,
        },
      }),
      this.prisma.footballLegend.findMany({
        where: SportArchiveCuratorService.ALIVE,
        orderBy: [{ personalRank: 'asc' }, { orderIndex: 'asc' }],
        select: {
          id: true,
          slug: true,
          name: true,
          portraitImage: true,
          personalRank: true,
          isPublished: true,
        },
      }),
      this.prisma.f1Driver.findMany({
        where: SportArchiveCuratorService.ALIVE,
        orderBy: [{ personalRank: 'asc' }, { name: 'asc' }],
        select: {
          id: true,
          slug: true,
          name: true,
          photo: true,
          portraitLicense: true,
          portraitAuthor: true,
          personalRank: true,
          isPublished: true,
          championships: true,
        },
      }),
      // Adayları sıralayan ölçü: kaç kez podyuma çıkmış
      this.prisma.f1RaceResult.groupBy({
        by: ['driverId'],
        where: { isDeleted: false, driverId: { not: null } },
        _count: { _all: true },
      }),

      /**
       * MEVCUT KAYITLAR. Küratör yalnızca yeni an EKLEYEBİLİYORDU; eklediği
       * bir kaydın fotoğrafını sonradan koyamıyor, yanlış eklediğini
       * silemiyordu. Liste taslakları da taşıyor (`isPublished` süzgeci yok)
       * — küratörün yayına almadığı kaydı görememesi, onu düzenleyememesi
       * demek olurdu.
       */
      this.prisma.footballMoment.findMany({
        where: SportArchiveCuratorService.ALIVE,
        orderBy: { year: 'asc' },
        take: 200,
        select: {
          id: true,
          year: true,
          titleTr: true,
          imageUrl: true,
          isPublished: true,
          isHighlight: true,
          era: { select: { club: { select: { name: true } } } },
        },
      }),
      this.prisma.f1Moment.findMany({
        where: SportArchiveCuratorService.ALIVE,
        orderBy: { seasonYear: 'asc' },
        take: 200,
        select: {
          id: true,
          seasonYear: true,
          titleTr: true,
          imageUrl: true,
          isPublished: true,
          isHighlight: true,
          circuit: { select: { name: true } },
        },
      }),
    ]);

    const podiumCount = new Map(
      podiums.map((p) => [p.driverId as string, p._count._all]),
    );

    const driverCandidates = drivers
      .map((d) => ({ ...d, podiums: podiumCount.get(d.id) ?? 0 }))
      // Yayındakiler her zaman listede kalsın (yayından kaldırmak da küratör
      // işi); geri kalanı podyum sayısına göre sıralanır.
      .sort(
        (a, b) =>
          Number(b.isPublished) - Number(a.isPublished) ||
          b.podiums - a.podiums ||
          a.name.localeCompare(b.name),
      )
      .slice(0, 40);

    const moments = [
      ...footballMoments.map((m) => ({
        id: m.id,
        world: 'football' as const,
        year: m.year,
        titleTr: m.titleTr,
        subject: m.era.club.name,
        imageUrl: m.imageUrl,
        isPublished: m.isPublished,
        isHighlight: m.isHighlight,
      })),
      ...f1Moments.map((m) => ({
        id: m.id,
        world: 'f1' as const,
        year: m.seasonYear,
        titleTr: m.titleTr,
        subject: m.circuit?.name ?? 'Formula 1',
        imageUrl: m.imageUrl,
        isPublished: m.isPublished,
        isHighlight: m.isHighlight,
      })),
    ].sort((a, b) => a.year - b.year || a.world.localeCompare(b.world));

    return { clubs, circuits, legends, drivers: driverCandidates, moments };
  }

  /**
   * Zaman şeridine yeni kayıt.
   *
   * Bağ kontrolü BURADA, DTO'da değil: "futbolsa eraId olmalı" bir alanın
   * kendi kuralı değil, iki alan arasındaki ilişki. `class-validator` bunu
   * ifade edebilir ama okunmaz hâle gelir; hata mesajı da burada anlamlı
   * olur çünkü kaydın gerçekten var olup olmadığını da aynı anda sorabiliyoruz.
   */
  async createMoment(dto: CreateSportMomentDto) {
    const highlight = dto.isHighlight ?? true;
    const published = dto.isPublished ?? true;

    if (dto.world === 'football') {
      if (!dto.eraId) {
        throw new BadRequestException('SPORT_ARCHIVE.ERA_REQUIRED');
      }
      const era = await this.prisma.footballEra.findFirst({
        where: { id: dto.eraId, isDeleted: false },
        select: { id: true },
      });
      if (!era) {
        throw new NotFoundException('SPORT_ARCHIVE.ERA_NOT_FOUND');
      }

      return this.prisma.footballMoment.create({
        data: {
          eraId: era.id,
          year: dto.year,
          titleTr: dto.titleTr.trim(),
          titleEn: dto.titleEn?.trim() || null,
          narrativeTr: dto.narrativeTr?.trim() || null,
          narrativeEn: dto.narrativeEn?.trim() || null,
          kind: dto.kind ?? 'MILESTONE',
          imageUrl: dto.imageUrl?.trim() || null,
          isHighlight: highlight,
          isPublished: published,
        },
        select: { id: true, year: true, titleTr: true },
      });
    }

    if (!dto.circuitId) {
      throw new BadRequestException('SPORT_ARCHIVE.CIRCUIT_REQUIRED');
    }
    const circuit = await this.prisma.f1Circuit.findFirst({
      where: { id: dto.circuitId, isDeleted: false },
      select: { id: true },
    });
    if (!circuit) {
      throw new NotFoundException('SPORT_ARCHIVE.CIRCUIT_NOT_FOUND');
    }

    return this.prisma.f1Moment.create({
      data: {
        circuitId: circuit.id,
        seasonYear: dto.year,
        titleTr: dto.titleTr.trim(),
        titleEn: dto.titleEn?.trim() || null,
        narrativeTr: dto.narrativeTr?.trim() || null,
        narrativeEn: dto.narrativeEn?.trim() || null,
        imageUrl: dto.imageUrl?.trim() || null,
        isHighlight: highlight,
        isPublished: published,
      },
      select: { id: true, seasonYear: true, titleTr: true },
    });
  }

  async updateMoment(
    world: 'football' | 'f1',
    id: string,
    dto: UpdateSportMomentDto,
  ) {
    const shared = {
      titleTr: dto.titleTr?.trim(),
      titleEn: dto.titleEn?.trim() || null,
      narrativeTr: dto.narrativeTr?.trim() || null,
      narrativeEn: dto.narrativeEn?.trim() || null,
      isHighlight: dto.isHighlight,
      isPublished: dto.isPublished,
    };

    if (world === 'football') {
      const existing = await this.prisma.footballMoment.findFirst({
        where: { id, isDeleted: false },
        select: { id: true },
      });
      if (!existing) {
        throw new NotFoundException('SPORT_ARCHIVE.MOMENT_NOT_FOUND');
      }
      return this.prisma.footballMoment.update({
        where: { id },
        data: { ...shared, year: dto.year, kind: dto.kind },
        select: { id: true },
      });
    }

    const existing = await this.prisma.f1Moment.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('SPORT_ARCHIVE.MOMENT_NOT_FOUND');
    }
    return this.prisma.f1Moment.update({
      where: { id },
      data: { ...shared, seasonYear: dto.year },
      select: { id: true },
    });
  }

  /**
   * YUMUŞAK SİLME. Kayıt `isDeleted` ile işaretleniyor, satır duruyor.
   * Bir arşivde "yanlışlıkla sildim" geri alınabilir olmalı; ayrıca anlara
   * bağlı maç/efsane kayıtları sert silmede yetim kalırdı.
   */
  async deleteMoment(world: 'football' | 'f1', id: string) {
    if (world === 'football') {
      const existing = await this.prisma.footballMoment.findFirst({
        where: { id, isDeleted: false },
        select: { id: true },
      });
      if (!existing) {
        throw new NotFoundException('SPORT_ARCHIVE.MOMENT_NOT_FOUND');
      }
      await this.prisma.footballMoment.update({
        where: { id },
        data: { isDeleted: true, isPublished: false },
      });
      return { ok: true };
    }

    const existing = await this.prisma.f1Moment.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('SPORT_ARCHIVE.MOMENT_NOT_FOUND');
    }
    await this.prisma.f1Moment.update({
      where: { id },
      data: { isDeleted: true, isPublished: false },
    });
    return { ok: true };
  }

  /**
   * Görseli kayda bağla (ya da boş dize göndererek kaldır).
   *
   * Adresin `/uploads/` ile başladığı DTO'da doğrulanıyor. Dosyanın kendisi
   * `POST /admin/uploads` ile zaten kendi sunucumuza inmiş oluyor; bu uç
   * yalnızca "hangi kayda ait" bağını kuruyor.
   */
  /**
   * Kapağın odak noktası ve büyütmesi.
   *
   * ⚠️ GÖRSELDEN AYRI BİR UÇ. `setImage` ile birleştirmek cazipti ama
   * ikisi farklı zamanlarda kullanılıyor: görsel bir kez yükleniyor,
   * odak noktası kaydırıcı sürüklendikçe defalarca kaydediliyor. Tek uç
   * olsaydı her odak kaydında görsel adresi de gönderilmek zorunda
   * kalırdı ve boş gönderilen bir istek görseli SİLERDİ.
   *
   * Boş `position` = ortaya dön (null yazılır). `scale` verilmezse
   * dokunulmuyor — iki alan birbirinden bağımsız kaydedilebiliyor.
   */
  async setCoverFocus(dto: SetSportCoverFocusDto) {
    const slug = dto.ref.trim();
    const data: { coverPosition?: string | null; coverScale?: number | null } =
      {};
    if (dto.position !== undefined) {
      data.coverPosition = dto.position.trim() || null;
    }
    if (dto.scale !== undefined) data.coverScale = dto.scale;

    if (dto.target === 'CLUB_COVER') {
      const club = await this.prisma.footballClub.findFirst({
        where: { slug, isDeleted: false },
        select: { id: true },
      });
      if (!club) throw new NotFoundException('SPORT_ARCHIVE.CLUB_NOT_FOUND');
      return this.prisma.footballClub.update({
        where: { id: club.id },
        data,
        select: { slug: true, coverPosition: true, coverScale: true },
      });
    }

    const circuit = await this.prisma.f1Circuit.findFirst({
      where: { slug, isDeleted: false },
      select: { id: true },
    });
    if (!circuit) {
      throw new NotFoundException('SPORT_ARCHIVE.CIRCUIT_NOT_FOUND');
    }
    return this.prisma.f1Circuit.update({
      where: { id: circuit.id },
      data,
      select: { slug: true, coverPosition: true, coverScale: true },
    });
  }

  async setImage(dto: SetSportImageDto) {
    const url = dto.url.trim() || null;
    const slug = dto.ref.trim();

    switch (dto.target) {
      case 'CLUB_COVER':
      case 'CLUB_CREST': {
        const club = await this.prisma.footballClub.findFirst({
          where: { slug, isDeleted: false },
          select: { id: true },
        });
        if (!club) throw new NotFoundException('SPORT_ARCHIVE.CLUB_NOT_FOUND');
        return this.prisma.footballClub.update({
          where: { id: club.id },
          data:
            dto.target === 'CLUB_COVER'
              ? { coverImage: url }
              : { crestImage: url },
          select: { slug: true, coverImage: true, crestImage: true },
        });
      }
      case 'CIRCUIT_COVER': {
        const circuit = await this.prisma.f1Circuit.findFirst({
          where: { slug, isDeleted: false },
          select: { id: true },
        });
        if (!circuit) {
          throw new NotFoundException('SPORT_ARCHIVE.CIRCUIT_NOT_FOUND');
        }
        return this.prisma.f1Circuit.update({
          where: { id: circuit.id },
          data: { coverImage: url },
          select: { slug: true, coverImage: true },
        });
      }
      case 'LEGEND_PORTRAIT': {
        const legend = await this.prisma.footballLegend.findFirst({
          where: { slug, isDeleted: false },
          select: { id: true },
        });
        if (!legend) {
          throw new NotFoundException('SPORT_ARCHIVE.LEGEND_NOT_FOUND');
        }
        return this.prisma.footballLegend.update({
          where: { id: legend.id },
          data: { portraitImage: url },
          select: { slug: true, portraitImage: true },
        });
      }
      case 'DRIVER_PORTRAIT': {
        const driver = await this.prisma.f1Driver.findFirst({
          where: { slug, isDeleted: false },
          select: { id: true },
        });
        if (!driver) {
          throw new NotFoundException('SPORT_ARCHIVE.DRIVER_NOT_FOUND');
        }
        /**
         * ⚠️ KÜNYE SIFIRLANIYOR. Küratörün yüklediği görselin Commons
         * künyesi (lisans + sanatçı + kaynak) ARTIK GEÇERLİ DEĞİL — o künye
         * senkronizasyonun indirdiği başka bir fotoğrafa aitti. Eski künyeyi
         * yeni görselin altında bırakmak, yanlış fotoğrafçıya atıf yapmak
         * olurdu; atıfsız yayından da kötü.
         */
        return this.prisma.f1Driver.update({
          where: { id: driver.id },
          data: url
            ? {
                photo: url,
                portraitLicense: null,
                portraitAuthor: null,
                portraitSourceUrl: null,
              }
            : { photo: null },
          select: { slug: true, photo: true },
        });
      }
      /**
       * Zaman şeridi kartının fotoğrafı. `ref` burada slug değil `cuid` —
       * anın slug'ı yok (bkz. `SetSportImageDto.ref` yorumu).
       */
      case 'MOMENT_FOOTBALL': {
        const moment = await this.prisma.footballMoment.findFirst({
          where: { id: slug, isDeleted: false },
          select: { id: true },
        });
        if (!moment) {
          throw new NotFoundException('SPORT_ARCHIVE.MOMENT_NOT_FOUND');
        }
        return this.prisma.footballMoment.update({
          where: { id: moment.id },
          data: { imageUrl: url },
          select: { id: true, imageUrl: true },
        });
      }
      case 'MOMENT_F1': {
        const moment = await this.prisma.f1Moment.findFirst({
          where: { id: slug, isDeleted: false },
          select: { id: true },
        });
        if (!moment) {
          throw new NotFoundException('SPORT_ARCHIVE.MOMENT_NOT_FOUND');
        }
        return this.prisma.f1Moment.update({
          where: { id: moment.id },
          data: { imageUrl: url },
          select: { id: true, imageUrl: true },
        });
      }
    }
  }

  /** F1 sürücüsünü panteona al / çıkar. */
  async featureDriver(slug: string, dto: FeatureF1DriverDto) {
    const driver = await this.prisma.f1Driver.findFirst({
      where: { slug, isDeleted: false },
      select: { id: true },
    });
    if (!driver) {
      throw new NotFoundException('SPORT_ARCHIVE.DRIVER_NOT_FOUND');
    }

    return this.prisma.f1Driver.update({
      where: { id: driver.id },
      data: {
        isPublished: dto.isPublished,
        personalRank: dto.personalRank ?? null,
        nicknameTr: dto.nicknameTr?.trim() || undefined,
        nicknameEn: dto.nicknameEn?.trim() || undefined,
        narrativeTr: dto.narrativeTr?.trim() || undefined,
        narrativeEn: dto.narrativeEn?.trim() || undefined,
      },
      select: { slug: true, isPublished: true, personalRank: true },
    });
  }
}
