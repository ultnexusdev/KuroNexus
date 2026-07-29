import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * AniList erişimi (GraphQL, anahtar gerektirmez).
 *
 * TMDB servisiyle aynı desen: her yanıt `ExternalCache`e yazılır, TTL dolmadan
 * dış istek atılmaz, dış kaynak düşerse bayat kayıt sunulur (kural 4/14).
 *
 * Neden AniList: sezon zinciri (`relations`), yayın durumu, sıradaki bölümün
 * geri sayımı ve manga bağı tek yerden geliyor. TMDB'de anime sezonları
 * güvenilmez, MyAnimeList'in resmi ucu yok.
 */

const ANILIST_URL = 'https://graphql.anilist.co';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
// Devam eden yapımın "sıradaki bölüm"ü her gün değişir — künyeden kısa tutulur
const AIRING_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
// Kadro (karakter + seslendiren) neredeyse hiç değişmez
const CHARACTER_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/**
 * Zincir durakları. İlk sürümde tek bir sayı vardı (14) ve **filmler/OVA'lar
 * kotayı doldurup sezonları dışarıda bırakıyordu**: My Hero Academia'da 7.
 * sezon, Naruto'da Shippuden sonrası hiç inmedi. Artık TV sezonları önce
 * geziliyor ve yan yapımların ayrı, küçük bir kotası var.
 */
const CHAIN_MAX_NODES = 34;
const CHAIN_MAX_EXTRAS = 14;
/** Sezon sayılan formatlar — kotası ayrı, önceliği yüksek. */
const CHAIN_MAIN_FORMATS = new Set(['TV', 'TV_SHORT']);

/** Sezon zincirine giren ilişki türleri — spin-off/alternatif sürüm alınmaz. */
const CHAIN_RELATIONS = new Set(['SEQUEL', 'PREQUEL', 'PARENT', 'SIDE_STORY']);
/** Zincire giren formatlar; müzik klibi/reklam alınmaz. */
const CHAIN_FORMATS = new Set([
  'TV',
  'TV_SHORT',
  'MOVIE',
  'OVA',
  'ONA',
  'SPECIAL',
]);

export type AnilistStatus =
  'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';

export interface AnilistMedia {
  anilistId: number;
  malId: number | null;
  title: string;
  titleRomaji: string | null;
  titleNative: string | null;
  format: string | null;
  status: AnilistStatus | null;
  episodes: number | null;
  duration: number | null;
  season: string | null;
  seasonYear: number | null;
  startYear: number | null;
  description: string | null;
  coverImage: string | null;
  bannerImage: string | null;
  genres: string[];
  /** AniList'te "Shounen" bir genre değil tag — süzgeç ikisini birlikte kullanır */
  tags: string[];
  studios: string[];
  averageScore: number | null;
  /** Devam eden yapımlarda sıradaki bölüm ve yayın zamanı (unix saniye) */
  nextEpisode: number | null;
  nextAiringAt: number | null;
  source: string | null;
  /** Uyarlandığı manga (Faz B'de "anime nerede bitti" bağı için) */
  manga: {
    anilistId: number;
    title: string;
    chapters: number | null;
    volumes: number | null;
    status: string | null;
  } | null;
}

export interface AnilistCharacter {
  name: string;
  image: string | null;
  role: string | null;
  voiceActor: string | null;
  voiceActorImage: string | null;
}

export interface AnilistRelation {
  relationType: string;
  anilistId: number;
  format: string | null;
}

export interface AnilistSearchResult {
  anilistId: number;
  title: string;
  format: string | null;
  status: AnilistStatus | null;
  episodes: number | null;
  seasonYear: number | null;
  coverImage: string | null;
  averageScore: number | null;
}

const MEDIA_FIELDS = `
  id
  idMal
  title { romaji english native }
  format
  status
  episodes
  duration
  season
  seasonYear
  startDate { year }
  description(asHtml: false)
  coverImage { large }
  bannerImage
  genres
  tags { name rank isGeneralSpoiler }
  studios(isMain: true) { nodes { name } }
  averageScore
  source
  nextAiringEpisode { episode airingAt }
  relations {
    edges {
      relationType
      node { id type format }
    }
  }
`;

interface RawMedia {
  id: number;
  idMal: number | null;
  title: { romaji?: string; english?: string; native?: string };
  format: string | null;
  status: AnilistStatus | null;
  episodes: number | null;
  duration: number | null;
  season: string | null;
  seasonYear: number | null;
  startDate?: { year: number | null };
  description: string | null;
  coverImage?: { large?: string };
  bannerImage: string | null;
  genres?: string[];
  tags?: Array<{ name: string; rank: number; isGeneralSpoiler: boolean }>;
  studios?: { nodes?: Array<{ name: string }> };
  averageScore: number | null;
  source: string | null;
  nextAiringEpisode?: { episode: number; airingAt: number } | null;
  relations?: {
    edges?: Array<{
      relationType: string;
      node: {
        id: number;
        type: string;
        format: string | null;
        title?: { romaji?: string; english?: string };
        chapters?: number | null;
        volumes?: number | null;
        status?: string | null;
      };
    }>;
  };
}

@Injectable()
export class AnilistService {
  private readonly logger = new Logger(AnilistService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Arşive seri eklerken kullanılan arama — cache'lenmez, sorgu hep farklı. */
  async search(query: string): Promise<AnilistSearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }
    const data = await this.request<{
      Page: { media: RawMedia[] };
    }>(
      `query($s:String){Page(perPage:20){media(search:$s,type:ANIME,sort:SEARCH_MATCH){
        id title{romaji english} format status episodes seasonYear
        coverImage{large} averageScore
      }}}`,
      { s: trimmed },
    );
    return (data.Page?.media ?? []).map((media) => ({
      anilistId: media.id,
      title: pickTitle(media),
      format: media.format,
      status: media.status,
      episodes: media.episodes,
      seasonYear: media.seasonYear,
      coverImage: media.coverImage?.large ?? null,
      averageScore: media.averageScore,
    }));
  }

  /**
   * Tek yapımın künyesi. Devam eden yapımlarda TTL kısadır: "sıradaki bölüm 2
   * gün sonra" bilgisi bir hafta bekletilirse yanlış olur.
   */
  async getMedia(anilistId: number): Promise<AnilistMedia> {
    const cacheKey = `anilist:media:${anilistId}`;
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    const previous = cached
      ? (cached.payload as unknown as { media: AnilistMedia })
      : null;
    const ttl =
      previous?.media?.status === 'RELEASING' ||
      previous?.media?.status === 'NOT_YET_RELEASED'
        ? AIRING_CACHE_TTL_MS
        : CACHE_TTL_MS;
    if (cached && Date.now() - cached.fetchedAt.getTime() < ttl) {
      return previous!.media;
    }

    try {
      const { media, relations } = await this.fetchMedia(anilistId);
      await this.writeCache(cacheKey, { media, relations });
      return media;
    } catch (error) {
      if (previous) {
        this.logger.warn(
          `AniList ${anilistId} yenilenemedi, bayat cache sunuluyor: ${String(error)}`,
        );
        return previous.media;
      }
      throw error;
    }
  }

  /** Künye + ham ilişki listesi (zincir kurmak için). */
  async getMediaWithRelations(
    anilistId: number,
  ): Promise<{ media: AnilistMedia; relations: AnilistRelation[] }> {
    const cacheKey = `anilist:media:${anilistId}`;
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    const previous = cached
      ? (cached.payload as unknown as {
          media: AnilistMedia;
          relations: AnilistRelation[];
        })
      : null;
    const ttl =
      previous?.media?.status === 'RELEASING' ||
      previous?.media?.status === 'NOT_YET_RELEASED'
        ? AIRING_CACHE_TTL_MS
        : CACHE_TTL_MS;
    if (cached && previous && Date.now() - cached.fetchedAt.getTime() < ttl) {
      return previous;
    }

    try {
      const fresh = await this.fetchMedia(anilistId);
      await this.writeCache(cacheKey, fresh);
      return fresh;
    } catch (error) {
      if (previous) {
        this.logger.warn(
          `AniList ${anilistId} yenilenemedi, bayat cache sunuluyor: ${String(error)}`,
        );
        return previous;
      }
      throw error;
    }
  }

  /**
   * Serinin sezon zinciri: kökten başlayıp önceki/sonraki sezonları,
   * yan hikâyeleri ve filmleri gezer (genişlik öncelikli, `CHAIN_MAX_NODES`
   * durağı). Sonuç yayın tarihine göre sıralı döner — izleme sırası budur.
   *
   * Her yapım tek tek cache'lendiği için ikinci ekleme neredeyse bedava.
   */
  async getFranchise(rootId: number): Promise<AnilistMedia[]> {
    const seen = new Set<number>([rootId]);
    // İki sıra: sezonlar (TV) her zaman önce gezilir. Tek sıra kullanılınca
    // araya giren filmler kotayı doldurup son sezonları dışarıda bırakıyordu.
    const mainQueue: number[] = [rootId];
    const extraQueue: number[] = [];
    const found: AnilistMedia[] = [];
    let extras = 0;

    while (
      (mainQueue.length > 0 || extraQueue.length > 0) &&
      found.length < CHAIN_MAX_NODES
    ) {
      const fromMain = mainQueue.length > 0;
      if (!fromMain && extras >= CHAIN_MAX_EXTRAS) {
        break;
      }
      const current = fromMain ? mainQueue.shift()! : extraQueue.shift()!;
      let node: { media: AnilistMedia; relations: AnilistRelation[] };
      try {
        node = await this.getMediaWithRelations(current);
      } catch (error) {
        // Zincirin bir halkası düşerse seri yine de kurulur, eksik kurulur
        this.logger.warn(
          `AniList zincir halkası atlandı (${current}): ${String(error)}`,
        );
        continue;
      }
      found.push(node.media);
      if (!fromMain) {
        extras += 1;
      }

      for (const relation of node.relations) {
        if (
          seen.has(relation.anilistId) ||
          !CHAIN_RELATIONS.has(relation.relationType) ||
          !relation.format ||
          !CHAIN_FORMATS.has(relation.format)
        ) {
          continue;
        }
        seen.add(relation.anilistId);
        if (CHAIN_MAIN_FORMATS.has(relation.format)) {
          mainQueue.push(relation.anilistId);
        } else {
          extraQueue.push(relation.anilistId);
        }
      }
    }

    return found.sort(byAirDate);
  }

  /**
   * Karakterler ve seslendirenler (anime sayfası için).
   *
   * Ayrı sorgu ve ayrı cache: künye her tazelendiğinde kadroyu da çekmek
   * gereksiz — kadro neredeyse hiç değişmiyor. Alınamazsa boş döner, sayfa
   * karaktersiz açılır.
   */
  async getCharacters(anilistId: number): Promise<AnilistCharacter[]> {
    const cacheKey = `anilist:characters:${anilistId}`;
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (cached && Date.now() - cached.fetchedAt.getTime() < CHARACTER_TTL_MS) {
      return cached.payload as unknown as AnilistCharacter[];
    }

    try {
      const data = await this.request<{
        Media: {
          characters?: {
            edges?: Array<{
              role: string | null;
              node: { name?: { full?: string }; image?: { medium?: string } };
              voiceActors?: Array<{
                name?: { full?: string };
                image?: { medium?: string };
              }>;
            }>;
          };
        };
      }>(
        `query($id:Int){Media(id:$id,type:ANIME){characters(sort:[ROLE,FAVOURITES_DESC],perPage:12){edges{
          role
          node{name{full} image{medium}}
          voiceActors(language:JAPANESE){name{full} image{medium}}
        }}}}`,
        { id: anilistId },
      );
      const characters: AnilistCharacter[] = (
        data.Media?.characters?.edges ?? []
      ).map((edge) => ({
        name: edge.node?.name?.full ?? '',
        image: edge.node?.image?.medium ?? null,
        role: edge.role,
        voiceActor: edge.voiceActors?.[0]?.name?.full ?? null,
        voiceActorImage: edge.voiceActors?.[0]?.image?.medium ?? null,
      }));
      await this.writeCache(cacheKey, characters);
      return characters;
    } catch (error) {
      if (cached) {
        return cached.payload as unknown as AnilistCharacter[];
      }
      this.logger.warn(
        `AniList kadro alınamadı (${anilistId}): ${String(error)}`,
      );
      return [];
    }
  }

  private async fetchMedia(
    anilistId: number,
  ): Promise<{ media: AnilistMedia; relations: AnilistRelation[] }> {
    const data = await this.request<{ Media: RawMedia }>(
      `query($id:Int){Media(id:$id,type:ANIME){${MEDIA_FIELDS}}}`,
      { id: anilistId },
    );
    return normalize(data.Media);
  }

  private async writeCache(cacheKey: string, payload: object): Promise<void> {
    await this.prisma.externalCache.upsert({
      where: { cacheKey },
      create: { cacheKey, payload, fetchedAt: new Date() },
      update: { payload, fetchedAt: new Date() },
    });
  }

  private async request<T>(
    query: string,
    variables: Record<string, unknown>,
  ): Promise<T> {
    const response = await fetch(ANILIST_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!response.ok) {
      this.logger.warn(`AniList → ${response.status}`);
      throw new ServiceUnavailableException('ANIME.SOURCE_UNAVAILABLE');
    }
    const payload = (await response.json()) as {
      data?: T;
      errors?: Array<{ message: string }>;
    };
    if (payload.errors?.length || !payload.data) {
      this.logger.warn(
        `AniList hata: ${payload.errors?.[0]?.message ?? 'boş yanıt'}`,
      );
      throw new ServiceUnavailableException('ANIME.SOURCE_UNAVAILABLE');
    }
    return payload.data;
  }
}

function pickTitle(media: {
  title: { romaji?: string; english?: string; native?: string };
  id: number;
}): string {
  return (
    media.title?.english ??
    media.title?.romaji ??
    media.title?.native ??
    `#${media.id}`
  );
}

function normalize(raw: RawMedia): {
  media: AnilistMedia;
  relations: AnilistRelation[];
} {
  const edges = raw.relations?.edges ?? [];
  const mangaEdge = edges.find(
    (edge) => edge.relationType === 'ADAPTATION' && edge.node.type === 'MANGA',
  );

  const media: AnilistMedia = {
    anilistId: raw.id,
    malId: raw.idMal ?? null,
    title: pickTitle(raw),
    titleRomaji: raw.title?.romaji ?? null,
    titleNative: raw.title?.native ?? null,
    format: raw.format,
    status: raw.status,
    episodes: raw.episodes,
    duration: raw.duration,
    season: raw.season,
    seasonYear: raw.seasonYear,
    startYear: raw.startDate?.year ?? null,
    description: raw.description,
    coverImage: raw.coverImage?.large ?? null,
    bannerImage: raw.bannerImage,
    genres: raw.genres ?? [],
    // Spoiler etiketleri künyeye alınmaz; sıralama AniList'in kendi puanı
    tags: (raw.tags ?? [])
      .filter((tag) => !tag.isGeneralSpoiler && tag.rank >= 60)
      .slice(0, 8)
      .map((tag) => tag.name),
    studios: (raw.studios?.nodes ?? []).map((studio) => studio.name),
    averageScore: raw.averageScore,
    nextEpisode: raw.nextAiringEpisode?.episode ?? null,
    nextAiringAt: raw.nextAiringEpisode?.airingAt ?? null,
    source: raw.source,
    manga: mangaEdge
      ? {
          anilistId: mangaEdge.node.id,
          title:
            mangaEdge.node.title?.english ??
            mangaEdge.node.title?.romaji ??
            `#${mangaEdge.node.id}`,
          chapters: mangaEdge.node.chapters ?? null,
          volumes: mangaEdge.node.volumes ?? null,
          status: mangaEdge.node.status ?? null,
        }
      : null,
  };

  const relations: AnilistRelation[] = edges
    .filter((edge) => edge.node.type === 'ANIME')
    .map((edge) => ({
      relationType: edge.relationType,
      anilistId: edge.node.id,
      format: edge.node.format,
    }));

  return { media, relations };
}

/** İzleme sırası: yayın yılı, sonra format (TV önce), sonra id. */
function byAirDate(a: AnilistMedia, b: AnilistMedia): number {
  const yearA = a.seasonYear ?? a.startYear ?? 9999;
  const yearB = b.seasonYear ?? b.startYear ?? 9999;
  if (yearA !== yearB) {
    return yearA - yearB;
  }
  const weight = (media: AnilistMedia) => (media.format === 'TV' ? 0 : 1);
  const weightDiff = weight(a) - weight(b);
  return weightDiff !== 0 ? weightDiff : a.anilistId - b.anilistId;
}
