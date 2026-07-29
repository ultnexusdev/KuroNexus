import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AnilistService,
  type AnilistCharacter,
  type AnilistMedia,
} from './anilist.service';
import { JikanService } from './jikan.service';
import { slugify } from '../common/utils/slugify';
import { CreateAnimeEntryDto } from './dto/create-anime-entry.dto';
import { UpdateAnimeEntryDto } from './dto/update-anime-entry.dto';
import { UpdateAnimePartDto } from './dto/update-anime-part.dto';
import type { AnimeEntry, AnimePart, Prisma } from '../generated/prisma/client';

/**
 * Anime arşivi.
 *
 * Film arşivinden ayrılan yeri: bir kayıt **seri**dir, sezonlar/filmler
 * `AnimePart` olarak altındadır ve ilerleme part'ta tutulur. Serinin
 * ilerlemesi ve yayın durumu part'lardan **türetilir** — iki yerde ayrı
 * tutulursa birbirini tutmaz.
 */

/** Yapımın kendi durumu — benim izleme durumumdan ayrı eksen. */
export type AiringState =
  | 'RELEASING' // yayında, yeni bölüm geliyor
  | 'UPCOMING' // yeni sezon duyuruldu, henüz başlamadı
  | 'FINISHED' // seri final yaptı
  | 'HIATUS' // ara verildi
  | 'CANCELLED';

export interface ArchiveAnimePart {
  id: string;
  anilistId: number;
  malId: number | null;
  title: string;
  format: string | null;
  airingStatus: string | null;
  episodes: number | null;
  watchedEpisodes: number;
  isCompleted: boolean;
  personalRating: number | null;
  seasonYear: number | null;
  coverImage: string | null;
  orderIndex: number;
  nextEpisode: number | null;
  nextAiringAt: number | null;
  mangaChapter: number | null;
}

export interface ArchiveAnime {
  id: string;
  /** Anime sayfasının adresi. Başlıktan türetilir, veritabanında tutulmaz. */
  slug: string;
  anilistId: number;
  malId: number | null;
  status: AnimeEntry['status'];
  isFavorite: boolean;
  personalRating: number | null;
  personalNote: string | null;
  title: string;
  titleNative: string | null;
  description: string | null;
  coverImage: string | null;
  bannerImage: string | null;
  genres: string[];
  tags: string[];
  studios: string[];
  averageScore: number | null;
  startYear: number | null;
  /** Yapımın durumu (part'lardan türetilir), benim durumumdan bağımsız */
  airingState: AiringState;
  totalEpisodes: number | null;
  watchedEpisodes: number;
  /** Şu an hangi parçadayım — "S2 · 14/23" satırı bundan yazılır */
  currentPart: ArchiveAnimePart | null;
  nextEpisode: number | null;
  nextAiringAt: number | null;
  parts: ArchiveAnimePart[];
  manga: AnilistMedia['manga'];
}

export interface PartEpisode {
  number: number;
  title: string | null;
  filler: boolean;
  recap: boolean;
  state: 'WATCHED' | 'SKIPPED' | 'UNWATCHED';
}

export interface AnimeArchiveStats {
  series: number;
  watching: number;
  completedSeries: number;
  watchedEpisodes: number;
  topTag: string | null;
}

type EntryWithParts = AnimeEntry & { parts: AnimePart[] };

@Injectable()
export class AnimeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistService,
    private readonly jikan: JikanService,
  ) {}

  // --- Public ---

  /** Salon tek istekte dolar (film salonuyla aynı yaklaşım). */
  async getArchive(): Promise<{
    entries: ArchiveAnime[];
    stats: AnimeArchiveStats;
    studios: Array<{ name: string; count: number }>;
    genres: string[];
    tags: string[];
  }> {
    const rows = await this.prisma.animeEntry.findMany({
      where: { isDeleted: false },
      include: { parts: { orderBy: { orderIndex: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });

    const entries = withSlugs(rows);
    return {
      entries,
      stats: buildStats(entries),
      studios: topStudios(entries),
      genres: collect(entries, (entry) => entry.genres),
      tags: collect(entries, (entry) => entry.tags),
    };
  }

  /**
   * Anime sayfası: künye + sezon zaman çizelgesi + kadro.
   *
   * Bölüm listeleri burada gelmez — her sezon için ayrı Jikan isteği demek
   * olurdu. Sayfa açıldıktan sonra sezon başına ayrı çekilir.
   */
  async getDetail(
    slug: string,
  ): Promise<{ anime: ArchiveAnime; characters: AnilistCharacter[] }> {
    const rows = await this.prisma.animeEntry.findMany({
      where: { isDeleted: false },
      include: { parts: { orderBy: { orderIndex: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
    const anime = withSlugs(rows).find((entry) => entry.slug === slug);
    if (!anime) {
      throw new NotFoundException('ANIME.NOT_FOUND');
    }
    // Kadro alınamazsa sayfa karaktersiz açılır (kural 4 ruhu)
    const characters = await this.anilist.getCharacters(anime.anilistId);
    return { anime, characters };
  }

  /**
   * Bir sezonun bölüm listesi: filler/recap bayrakları Jikan'dan, izleme
   * durumu bizden. Kaynak düşerse liste yine kurulur — bölüm sayısı AniList
   * künyesinde var, yalnızca başlık ve filler bilgisi eksik kalır.
   */
  async getPartEpisodes(partId: string): Promise<{
    episodes: PartEpisode[];
    fillerCount: number;
    hasSourceData: boolean;
  }> {
    const part = await this.prisma.animePart.findUnique({
      where: { id: partId },
    });
    if (!part) {
      throw new NotFoundException('ANIME.PART_NOT_FOUND');
    }
    const media = (part.externalData ?? null) as AnilistMedia | null;
    const isAiring = media?.status === 'RELEASING';
    const source = part.malId
      ? await this.jikan.episodes(part.malId, isAiring)
      : [];

    const total = media?.episodes ?? source.length;
    const marks = (part.episodeMarks ?? {}) as Record<string, string>;
    const byNumber = new Map(
      source.map((episode) => [episode.number, episode]),
    );

    const episodes: PartEpisode[] = [];
    for (let number = 1; number <= total; number += 1) {
      const item = byNumber.get(number);
      const mark = marks[String(number)];
      episodes.push({
        number,
        title: item?.title ?? null,
        filler: item?.filler ?? false,
        recap: item?.recap ?? false,
        // "Geçildi" açık bir işaret; onun dışında sayaç neredeyse orası izlendi
        state:
          mark === 'SKIPPED'
            ? 'SKIPPED'
            : number <= part.watchedEpisodes
              ? 'WATCHED'
              : 'UNWATCHED',
      });
    }

    return {
      episodes,
      fillerCount: episodes.filter((episode) => episode.filler).length,
      hasSourceData: source.length > 0,
    };
  }

  // --- Admin ---

  search(query: string) {
    return this.anilist.search(query);
  }

  /**
   * Seriyi arşive alır: kök yapımın sezon zinciri gezilip her halka bir
   * `AnimePart` olur. Zincir eksik gelirse kayıt yine açılır (kök tek part).
   */
  async create(
    dto: CreateAnimeEntryDto,
    userId: string,
  ): Promise<EntryWithParts> {
    const existing = await this.prisma.animeEntry.findFirst({
      where: { userId, anilistId: dto.anilistId, isDeleted: false },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('ANIME.ALREADY_IN_ARCHIVE');
    }

    const franchise = await this.franchiseOrRoot(dto.anilistId);
    const root =
      franchise.find((media) => media.anilistId === dto.anilistId) ??
      franchise[0];

    const entry = await this.prisma.animeEntry.upsert({
      // Soft-delete edilmiş kayıt varsa unique kısıt yüzünden create patlar
      where: { userId_anilistId: { userId, anilistId: dto.anilistId } },
      create: {
        anilistId: dto.anilistId,
        malId: root.malId,
        status: dto.status ?? 'WATCHING',
        isFavorite: dto.isFavorite ?? false,
        personalRating: dto.personalRating,
        personalNote: dto.personalNote,
        externalData: root as unknown as Prisma.InputJsonValue,
        externalDataFetchedAt: new Date(),
        userId,
      },
      update: {
        status: dto.status ?? 'WATCHING',
        isDeleted: false,
        externalData: root as unknown as Prisma.InputJsonValue,
        externalDataFetchedAt: new Date(),
      },
    });

    await this.syncParts(entry.id, franchise);
    // "Bitirdim" diyerek eklenen seride bütün bölümler izlenmiş demektir —
    // sonra tek tek işaretlemek anlamsız (kullanıcı geri bildirimi)
    if ((dto.status ?? 'WATCHING') === 'COMPLETED') {
      await this.markAllPartsWatched(entry.id);
    }
    return this.findByIdOrFail(entry.id);
  }

  async update(id: string, dto: UpdateAnimeEntryDto): Promise<EntryWithParts> {
    const entry = await this.findByIdOrFail(id);
    const data: Prisma.AnimeEntryUncheckedUpdateInput = {
      status: dto.status,
      isFavorite: dto.isFavorite,
      personalRating: dto.personalRating,
      personalNote: dto.personalNote,
    };
    // "Bitirdim" denince tarih kendiliğinden düşsün — elle girdirmek yorar
    if (dto.status === 'COMPLETED' && !entry.finishedAt) {
      data.finishedAt = new Date();
    }
    if (dto.status === 'WATCHING' && !entry.startedAt) {
      data.startedAt = new Date();
    }
    await this.prisma.animeEntry.update({ where: { id }, data });
    // Durumu "bitirdim"e çevirmek de bütün bölümleri izlenmiş sayar
    if (dto.status === 'COMPLETED') {
      await this.markAllPartsWatched(id);
    }
    return this.findByIdOrFail(id);
  }

  /**
   * Bir parçanın ilerlemesi. `delta` günlük kullanım içindir ("+1 bölüm"),
   * `watchedEpisodes` doğrudan atama yapar (ızgaradan işaretleme, Faz B).
   */
  async updatePart(
    partId: string,
    dto: UpdateAnimePartDto,
  ): Promise<EntryWithParts> {
    const part = await this.prisma.animePart.findUnique({
      where: { id: partId },
    });
    if (!part) {
      throw new NotFoundException('ANIME.PART_NOT_FOUND');
    }

    const media = (part.externalData ?? null) as AnilistMedia | null;
    const total = media?.episodes ?? null;
    const raw =
      dto.watchedEpisodes !== undefined
        ? dto.watchedEpisodes
        : part.watchedEpisodes + (dto.delta ?? 0);
    // Bölüm sayısı bilinmeyen (devam eden) yapımda üst sınır yok
    const watched = Math.max(0, total === null ? raw : Math.min(raw, total));

    const marks = { ...((part.episodeMarks ?? {}) as Record<string, string>) };
    if (dto.markEpisode !== undefined) {
      if (dto.markState === 'SKIPPED') {
        marks[String(dto.markEpisode)] = 'SKIPPED';
      } else {
        delete marks[String(dto.markEpisode)];
      }
    }
    // "Filler'ları geçildi say": kanon ilerlemesi bozulmasın diye toplu işaret
    if (dto.skipFillers && part.malId) {
      const source = await this.jikan.episodes(
        part.malId,
        media?.status === 'RELEASING',
      );
      for (const episode of source) {
        if (episode.filler) {
          marks[String(episode.number)] = 'SKIPPED';
        }
      }
    }

    await this.prisma.animePart.update({
      where: { id: partId },
      data: {
        watchedEpisodes: watched,
        isCompleted:
          dto.isCompleted ?? (total !== null && watched >= total && total > 0),
        personalRating: dto.personalRating ?? part.personalRating,
        mangaChapter: dto.mangaChapter ?? part.mangaChapter,
        episodeMarks: marks as unknown as Prisma.InputJsonValue,
      },
    });

    await this.syncEntryStatus(part.entryId);
    return this.findByIdOrFail(part.entryId);
  }

  /**
   * "Bitirdim" işareti: bütün parçalar tamamlanmış sayılır. Hem seriyi
   * bitirdim diyerek eklerken hem de durumu sonradan çevirirken kullanılır.
   */
  private async markAllPartsWatched(entryId: string): Promise<void> {
    const parts = await this.prisma.animePart.findMany({ where: { entryId } });
    for (const part of parts) {
      const media = (part.externalData ?? null) as AnilistMedia | null;
      const total = media?.episodes ?? null;
      // Bölüm sayısı bilinmeyen (devam eden) yapımda sayaç uydurulmaz
      if (total === null || total <= 0) {
        continue;
      }
      await this.prisma.animePart.update({
        where: { id: part.id },
        data: { watchedEpisodes: total, isCompleted: true },
      });
    }
  }

  /**
   * "Buraya kadar hepsini izledim": seçilen parça ve ondan önceki bütün
   * parçalar tamamlanmış sayılır. Uzun franchise'larda tek hamle.
   */
  async completeThrough(partId: string): Promise<EntryWithParts> {
    const part = await this.prisma.animePart.findUnique({
      where: { id: partId },
    });
    if (!part) {
      throw new NotFoundException('ANIME.PART_NOT_FOUND');
    }
    const earlier = await this.prisma.animePart.findMany({
      where: { entryId: part.entryId, orderIndex: { lte: part.orderIndex } },
    });
    for (const item of earlier) {
      const media = (item.externalData ?? null) as AnilistMedia | null;
      const total = media?.episodes ?? null;
      if (total === null || total <= 0) {
        continue;
      }
      await this.prisma.animePart.update({
        where: { id: item.id },
        data: { watchedEpisodes: total, isCompleted: true },
      });
    }
    await this.syncEntryStatus(part.entryId);
    return this.findByIdOrFail(part.entryId);
  }

  async softDelete(id: string): Promise<AnimeEntry> {
    await this.findByIdOrFail(id);
    return this.prisma.animeEntry.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  /** Künyeleri ve zinciri AniList'ten tazeler; ilerleme ve puan korunur. */
  async refresh(id: string): Promise<EntryWithParts> {
    const entry = await this.findByIdOrFail(id);
    const franchise = await this.franchiseOrRoot(entry.anilistId);
    const root =
      franchise.find((media) => media.anilistId === entry.anilistId) ??
      franchise[0];
    await this.prisma.animeEntry.update({
      where: { id },
      data: {
        malId: root.malId,
        externalData: root as unknown as Prisma.InputJsonValue,
        externalDataFetchedAt: new Date(),
      },
    });
    await this.syncParts(id, franchise);
    return this.findByIdOrFail(id);
  }

  findAllForAdmin() {
    return this.prisma.animeEntry.findMany({
      where: { isDeleted: false },
      include: { parts: { orderBy: { orderIndex: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // --- İç işler ---

  /** Zincir alınamazsa seri tek parçayla açılır — ekleme hiç düşmesin. */
  private async franchiseOrRoot(rootId: number): Promise<AnilistMedia[]> {
    const franchise = await this.anilist.getFranchise(rootId);
    if (franchise.length > 0) {
      return franchise;
    }
    return [await this.anilist.getMedia(rootId)];
  }

  /**
   * Zinciri part kayıtlarına yazar. Var olan part'ın **ilerlemesi ve puanı
   * korunur**, yalnızca künye tazelenir; sıralama yayın tarihinden gelir.
   */
  private async syncParts(
    entryId: string,
    franchise: AnilistMedia[],
  ): Promise<void> {
    for (const [index, media] of franchise.entries()) {
      await this.prisma.animePart.upsert({
        where: { entryId_anilistId: { entryId, anilistId: media.anilistId } },
        create: {
          entryId,
          anilistId: media.anilistId,
          malId: media.malId,
          orderIndex: index,
          externalData: media as unknown as Prisma.InputJsonValue,
          externalDataFetchedAt: new Date(),
        },
        update: {
          malId: media.malId,
          orderIndex: index,
          externalData: media as unknown as Prisma.InputJsonValue,
          externalDataFetchedAt: new Date(),
        },
      });
    }
  }

  /** Bütün parçalar bitmişse seri kendiliğinden "bitirdim"e geçer. */
  private async syncEntryStatus(entryId: string): Promise<void> {
    const entry = await this.prisma.animeEntry.findUnique({
      where: { id: entryId },
      include: { parts: true },
    });
    if (!entry || entry.status === 'DROPPED' || entry.status === 'ON_HOLD') {
      return;
    }
    const view = toArchiveAnime(entry);
    const everyPartDone =
      entry.parts.length > 0 && entry.parts.every((part) => part.isCompleted);
    // Yayını süren seride "bitirdim" demek yanlış olur: bekleyen bölüm var
    const shouldComplete = everyPartDone && view.airingState === 'FINISHED';

    if (shouldComplete && entry.status !== 'COMPLETED') {
      await this.prisma.animeEntry.update({
        where: { id: entryId },
        data: {
          status: 'COMPLETED',
          finishedAt: entry.finishedAt ?? new Date(),
        },
      });
      return;
    }
    if (
      !shouldComplete &&
      entry.status === 'PLANNED' &&
      view.watchedEpisodes > 0
    ) {
      await this.prisma.animeEntry.update({
        where: { id: entryId },
        data: { status: 'WATCHING', startedAt: entry.startedAt ?? new Date() },
      });
    }
  }

  private async findByIdOrFail(id: string): Promise<EntryWithParts> {
    const entry = await this.prisma.animeEntry.findFirst({
      where: { id, isDeleted: false },
      include: { parts: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!entry) {
      throw new NotFoundException('ANIME.NOT_FOUND');
    }
    return entry;
  }
}

/**
 * Serilere adres verir. Slug veritabanında tutulmuyor: başlıktan türetiliyor,
 * iki seri aynı slug'a düşerse sonrakine AniList numarası ekleniyor. Böylece
 * hem şema sade kalıyor hem de künye tazelenip başlık değişse adres kendini
 * düzeltiyor.
 */
function withSlugs(rows: EntryWithParts[]): ArchiveAnime[] {
  const used = new Set<string>();
  return rows.map((row) => {
    const anime = toArchiveAnime(row);
    const base = slugify(anime.title) || `anime-${anime.anilistId}`;
    const slug = used.has(base) ? `${base}-${anime.anilistId}` : base;
    used.add(slug);
    return { ...anime, slug };
  });
}

function toArchiveAnime(entry: EntryWithParts): ArchiveAnime {
  const root = (entry.externalData ?? null) as AnilistMedia | null;
  const parts = [...entry.parts]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((part) => toArchivePart(part));

  const totals = parts.reduce(
    (acc, part) => {
      acc.watched += part.watchedEpisodes;
      if (part.episodes !== null) {
        acc.total += part.episodes;
      } else {
        acc.unknown = true;
      }
      return acc;
    },
    { watched: 0, total: 0, unknown: false },
  );

  /**
   * "Nerede kaldım" parçası. Sıralama önemli:
   *  1. elde kalan (başlanmış ama bitmemiş) parça,
   *  2. bitmemiş ilk **sezon**,
   *  3. bitmemiş herhangi bir parça.
   *
   * İkinci adım canlı veriden çıktı: sırf yayın tarihi sırasına bakınca
   * araya giren tek bölümlük bir özel ("Heroes:Rising Epilogue Plus")
   * "nerede kaldım" satırını kaçırıyor, 5. sezon yerine onu gösteriyordu.
   */
  const currentPart =
    parts.find((part) => !part.isCompleted && part.watchedEpisodes > 0) ??
    parts.find(
      (part) =>
        !part.isCompleted &&
        (part.format === 'TV' || part.format === 'TV_SHORT'),
    ) ??
    parts.find((part) => !part.isCompleted) ??
    parts[parts.length - 1] ??
    null;

  const airing = parts.find((part) => part.nextAiringAt !== null) ?? null;

  return {
    id: entry.id,
    slug: '',
    anilistId: entry.anilistId,
    malId: entry.malId,
    status: entry.status,
    isFavorite: entry.isFavorite,
    personalRating: entry.personalRating,
    personalNote: entry.personalNote,
    // Künye alınamamışsa AniList numarası gösterilir, salon çökmez
    title: root?.title ?? `#${entry.anilistId}`,
    titleNative: root?.titleNative ?? null,
    description: root?.description ?? null,
    coverImage: root?.coverImage ?? null,
    bannerImage: root?.bannerImage ?? null,
    genres: root?.genres ?? [],
    tags: root?.tags ?? [],
    studios: root?.studios ?? [],
    averageScore: root?.averageScore ?? null,
    startYear: root?.seasonYear ?? root?.startYear ?? null,
    airingState: deriveAiringState(entry.parts),
    totalEpisodes: totals.unknown && totals.total === 0 ? null : totals.total,
    watchedEpisodes: totals.watched,
    currentPart,
    nextEpisode: airing?.nextEpisode ?? null,
    nextAiringAt: airing?.nextAiringAt ?? null,
    parts,
    manga: root?.manga ?? null,
  };
}

function toArchivePart(part: AnimePart): ArchiveAnimePart {
  const media = (part.externalData ?? null) as AnilistMedia | null;
  return {
    id: part.id,
    anilistId: part.anilistId,
    malId: part.malId,
    title: media?.title ?? `#${part.anilistId}`,
    format: media?.format ?? null,
    airingStatus: media?.status ?? null,
    episodes: media?.episodes ?? null,
    watchedEpisodes: part.watchedEpisodes,
    isCompleted: part.isCompleted,
    personalRating: part.personalRating,
    seasonYear: media?.seasonYear ?? media?.startYear ?? null,
    coverImage: media?.coverImage ?? null,
    orderIndex: part.orderIndex,
    nextEpisode: media?.nextEpisode ?? null,
    nextAiringAt: media?.nextAiringAt ?? null,
    mangaChapter: part.mangaChapter,
  };
}

/**
 * Serinin yayın durumu: rozetin kaynağı. Bir parçası yayındaysa seri
 * "yayında"dır; hiçbiri yayında değil ama duyurulmuş bir sezon varsa
 * "bekleniyor"dur. Kullanıcının izleme durumuyla ilgisi yoktur.
 */
function deriveAiringState(parts: AnimePart[]): AiringState {
  const states = parts.map((part) => {
    const media = (part.externalData ?? null) as AnilistMedia | null;
    return media?.status ?? null;
  });
  if (states.includes('RELEASING')) {
    return 'RELEASING';
  }
  if (states.includes('NOT_YET_RELEASED')) {
    return 'UPCOMING';
  }
  if (states.includes('HIATUS')) {
    return 'HIATUS';
  }
  if (states.length > 0 && states.every((state) => state === 'CANCELLED')) {
    return 'CANCELLED';
  }
  return 'FINISHED';
}

function buildStats(entries: ArchiveAnime[]): AnimeArchiveStats {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const tag of [...entry.tags, ...entry.genres]) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  const topTag =
    [...counts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr'),
    )[0]?.[0] ?? null;

  return {
    series: entries.length,
    watching: entries.filter((entry) => entry.status === 'WATCHING').length,
    completedSeries: entries.filter((entry) => entry.status === 'COMPLETED')
      .length,
    watchedEpisodes: entries.reduce(
      (acc, entry) => acc + entry.watchedEpisodes,
      0,
    ),
    topTag,
  };
}

// Film salonundaki "yönetmenler" şeridinin karşılığı
function topStudios(
  entries: ArchiveAnime[],
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const studio of entry.studios) {
      const weight = entry.isFavorite ? 2 : 1;
      counts.set(studio, (counts.get(studio) ?? 0) + weight);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'tr'))
    .slice(0, 6);
}

function collect(
  entries: ArchiveAnime[],
  pick: (entry: ArchiveAnime) => string[],
): string[] {
  const seen = new Set<string>();
  for (const entry of entries) {
    for (const value of pick(entry)) {
      seen.add(value);
    }
  }
  return [...seen].sort((a, b) => a.localeCompare(b, 'tr'));
}
