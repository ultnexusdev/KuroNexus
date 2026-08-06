import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Dış isteğin en fazla süresi.
 *
 * Zaman aşımı olmadan asılı kalan bir istek, çağıranı da askıda tutar ve
 * soket havuzunu doldurur — dışarıdan tetiklenebilen bir kaynak tükenmesi
 * yüzeyi. 2026-08-04'te tam olarak bu eksiklik Open Library üzerinden kitap
 * aramasını 40 saniyeye çıkardı; bu kaynak o gün ayakta olduğu için burada
 * fark edilmemişti.
 */
const REQUEST_TIMEOUT_MS = 8_000;

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

/**
 * Sezon zincirine giren ilişki türleri. Spin-off'lar kullanıcı kararıyla
 * dahil (MHA: Vigilantes gibi yan seriler aynı kartta görünsün); alternatif
 * sürüm/özet (ALTERNATIVE, SUMMARY) hâlâ dışarıda — aynı hikâyenin ikinci
 * çekimi çizelgeyi kirletir.
 */
const CHAIN_RELATIONS = new Set([
  'SEQUEL',
  'PREQUEL',
  'PARENT',
  'SIDE_STORY',
  'SPIN_OFF',
]);
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
  /** Fragman (YouTube/Dailymotion) — dış bağlantı kartlarının kaynağı */
  trailerUrl: string | null;
  /** Yapımın resmi sitesi (AniList `externalLinks` içinden) */
  officialSite: string | null;
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
  /**
   * AniList karakter id'si. Karakter sayfasının adresi budur — kadro listesi
   * uzun süre yalnızca ad/görsel döndüğü için karaktere link kurulamıyordu.
   */
  characterId: number;
  name: string;
  nameNative: string | null;
  /** Büyük portre — karakter dizinindeki 2:3 levhalar için */
  image: string | null;
  /**
   * Küçük portre. İki boy birden dönüyor çünkü aynı kadro iki yerde
   * kullanılıyor: anime sayfasındaki 42px'lik yüzler ve karakter dizinindeki
   * 220px'lik levhalar. Tek boy dönseydi biri bulanık, öteki israf olurdu.
   */
  imageSmall: string | null;
  role: string | null;
  voiceActor: string | null;
  voiceActorImage: string | null;
  /** AniList'te kaç kişinin favorilediği — listeyi sıralamak için */
  favourites: number | null;
}

/** Karakterin göründüğü bir yapım (anime ya da manga). */
export interface AnilistCharacterAppearance {
  anilistId: number;
  title: string;
  /** ANIME | MANGA */
  mediaType: string | null;
  format: string | null;
  seasonYear: number | null;
  coverImage: string | null;
  /** MAIN | SUPPORTING | BACKGROUND */
  role: string | null;
  voiceActor: string | null;
  voiceActorImage: string | null;
}

/**
 * Açıklama metninin bir parçası. AniList açıklamaları `~!...!~` işaretiyle
 * spoiler bloğu taşır; metin düz string olarak verilirse o blok ekranda
 * çıplak kalır. Parçalara bölünmesinin tek sebebi bu: arayüz spoiler'lı
 * parçayı dokunarak açılan bir kapının ardına koyabilsin (AGENTS.md kural 2/5).
 */
export interface AnilistTextSegment {
  text: string;
  spoiler: boolean;
}

/** Açıklamanın başındaki `__Anahtar:__ Değer` satırlarından çıkarılan künye. */
export interface AnilistCharacterTrait {
  label: string;
  value: string;
  spoiler: boolean;
}

export interface AnilistCharacterDetail {
  characterId: number;
  name: string;
  nameNative: string | null;
  /** Takma adlar — spoiler işaretli olanlar alınmaz */
  alternativeNames: string[];
  image: string | null;
  /** Serbest metin (künye satırları ayıklandıktan sonra kalan) */
  description: AnilistTextSegment[];
  /** `__Boy:__ 202 cm` biçiminde yazılmış satırlardan türeyen künye tablosu */
  traits: AnilistCharacterTrait[];
  gender: string | null;
  age: string | null;
  bloodType: string | null;
  /** Kısmi tarih olabilir (yılsız doğum günü yaygın); biçimlendirme arayüzde */
  dateOfBirth: {
    year: number | null;
    month: number | null;
    day: number | null;
  } | null;
  favourites: number | null;
  siteUrl: string | null;
  appearances: AnilistCharacterAppearance[];
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
  /**
   * Tam boy kapak. AniList adlandırması yanıltıcı: `large` aslında medium
   * dosyasını, `extraLarge` gerçek büyük dosyayı veriyor. Lobi afişleri gibi
   * büyük yerlerde bu kullanılır; 48px küçük resimlerde `coverImage` yeter.
   */
  coverImageLarge: string | null;
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
  trailer { id site }
  externalLinks { site url type }
  nextAiringEpisode { episode airingAt }
  relations {
    edges {
      relationType
      # Manga künyesi de buradan okunuyor: yalnızca id/format istenirse
      # "Uyarlandığı manga" satırı başlıksız kalıyor (canlıda görüldü)
      node { id type format title { romaji english } chapters volumes status }
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
  coverImage?: { large?: string; extraLarge?: string };
  bannerImage: string | null;
  genres?: string[];
  tags?: Array<{ name: string; rank: number; isGeneralSpoiler: boolean }>;
  studios?: { nodes?: Array<{ name: string }> };
  averageScore: number | null;
  source: string | null;
  trailer?: { id: string | null; site: string | null } | null;
  externalLinks?: Array<{
    site: string | null;
    url: string | null;
    type: string | null;
  }> | null;
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

interface RawCharacter {
  id: number;
  name?: { full?: string; native?: string; alternative?: string[] | null };
  image?: { large?: string };
  description: string | null;
  gender: string | null;
  age: string | null;
  bloodType: string | null;
  dateOfBirth?: {
    year: number | null;
    month: number | null;
    day: number | null;
  } | null;
  favourites: number | null;
  siteUrl: string | null;
  media?: {
    edges?: Array<{
      characterRole: string | null;
      voiceActors?: Array<{
        name?: { full?: string };
        image?: { large?: string; medium?: string };
      }>;
      node: {
        id: number;
        type: string | null;
        format: string | null;
        seasonYear: number | null;
        title?: { romaji?: string; english?: string; native?: string };
        coverImage?: { extraLarge?: string; large?: string };
      };
    }>;
  } | null;
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
        coverImage{large extraLarge} averageScore
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
      coverImageLarge:
        media.coverImage?.extraLarge ?? media.coverImage?.large ?? null,
      averageScore: media.averageScore,
    }));
  }

  /**
   * Tek yapımın künyesi. Devam eden yapımlarda TTL kısadır: "sıradaki bölüm 2
   * gün sonra" bilgisi bir hafta bekletilirse yanlış olur.
   */
  async getMedia(anilistId: number): Promise<AnilistMedia> {
    const cacheKey = `anilist:media:v3:${anilistId}`;
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
    const cacheKey = `anilist:media:v3:${anilistId}`;
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
    /*
     * v3: portreler `medium` yerine `large` çekiliyor.
     *
     * v2'de `image { medium }` isteniyordu — o dosya AniList'te ~100px genişlik
     * ve kadro listesindeki 56px yüzler için yeterliydi. Karakter dizinindeki
     * levhalar ise 2:3 oranında ~140-220px; aynı dosya orada gözle görülür
     * biçimde bulanık çıkıyor. `large` bu kaynağın karakterler için verdiği
     * EN BÜYÜK boy (medya kapaklarındaki `extraLarge`in karakter karşılığı yok).
     */
    const cacheKey = `anilist:characters:v3:${anilistId}`;
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
              node: {
                id: number;
                name?: { full?: string; native?: string };
                image?: { large?: string; medium?: string };
                favourites?: number | null;
              };
              voiceActors?: Array<{
                name?: { full?: string };
                image?: { large?: string; medium?: string };
              }>;
            }>;
          };
        };
      }>(
        `query($id:Int){Media(id:$id,type:ANIME){characters(sort:[ROLE,FAVOURITES_DESC],perPage:12){edges{
          role
          node{id name{full native} image{large medium} favourites}
          voiceActors(language:JAPANESE){name{full} image{large medium}}
        }}}}`,
        { id: anilistId },
      );
      const characters: AnilistCharacter[] = (
        data.Media?.characters?.edges ?? []
      )
        // id'siz bir kenar gelirse (AniList tarafında silinmiş kayıt) atlanır:
        // adresi kurulamayan bir kart listede tıklanınca 404 verirdi
        .filter((edge) => typeof edge.node?.id === 'number')
        .map((edge) => ({
          characterId: edge.node.id,
          name: edge.node?.name?.full ?? '',
          nameNative: edge.node?.name?.native ?? null,
          // `large` yoksa `medium`e düş: eski/eksik kayıtlarda kart boş kalmasın
          image: edge.node?.image?.large ?? edge.node?.image?.medium ?? null,
          imageSmall: edge.node?.image?.medium ?? edge.node?.image?.large ?? null,
          role: edge.role,
          voiceActor: edge.voiceActors?.[0]?.name?.full ?? null,
          voiceActorImage:
            edge.voiceActors?.[0]?.image?.large ??
            edge.voiceActors?.[0]?.image?.medium ??
            null,
          favourites: edge.node?.favourites ?? null,
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

  /**
   * Tek karakterin künyesi (karakter sayfası).
   *
   * Kadro sorgusundan ayrı: kadro yalnızca ad/görsel taşır, burada açıklama,
   * doğum tarihi, kan grubu ve karakterin göründüğü bütün yapımlar var.
   * Kadro gibi bu da neredeyse hiç değişmez → aynı 30 günlük TTL.
   *
   * Kaynak düşerse ve elde bayat kayıt varsa o sunulur; hiç kayıt yoksa `null`
   * döner ve sayfa 404 verir — yarım bir künye göstermektense sayfa açılmasın.
   */
  async getCharacter(
    characterId: number,
  ): Promise<AnilistCharacterDetail | null> {
    // v2: göründüğü yapımların kapakları `large` yerine `extraLarge`.
    // Bu dosyanın 200. satırındaki not zaten uyarıyordu — AniList'te `large`
    // aslında orta boy dosyayı veriyor, gerçek büyük olan `extraLarge`.
    const cacheKey = `anilist:character:v2:${characterId}`;
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (cached && Date.now() - cached.fetchedAt.getTime() < CHARACTER_TTL_MS) {
      return cached.payload as unknown as AnilistCharacterDetail;
    }

    try {
      const data = await this.request<{ Character: RawCharacter | null }>(
        `query($id:Int){Character(id:$id){
          id
          name{full native alternative}
          image{large}
          description(asHtml:false)
          gender
          age
          bloodType
          dateOfBirth{year month day}
          favourites
          siteUrl
          media(sort:POPULARITY_DESC,perPage:16){edges{
            characterRole
            voiceActors(language:JAPANESE){name{full} image{large medium}}
            node{id type format seasonYear title{romaji english native} coverImage{extraLarge large}}
          }}
        }}`,
        { id: characterId },
      );
      if (!data.Character) {
        return null;
      }
      const detail = normalizeCharacter(data.Character);
      await this.writeCache(cacheKey, detail);
      return detail;
    } catch (error) {
      if (cached) {
        this.logger.warn(
          `AniList karakter ${characterId} yenilenemedi, bayat cache sunuluyor: ${String(error)}`,
        );
        return cached.payload as unknown as AnilistCharacterDetail;
      }
      this.logger.warn(
        `AniList karakter alınamadı (${characterId}): ${String(error)}`,
      );
      return null;
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
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
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
    trailerUrl: trailerUrl(raw.trailer),
    officialSite: officialSite(raw.externalLinks),
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

/**
 * AniList fragmanı yalnızca site adı + video id veriyor; izlenebilir adresi
 * biz kuruyoruz. Tanımadığımız bir kaynak gelirse bağlantı hiç gösterilmez —
 * yarım bir adres üretmektense kart eksik kalsın.
 */
function trailerUrl(
  trailer: { id: string | null; site: string | null } | null | undefined,
): string | null {
  if (!trailer?.id || !trailer.site) {
    return null;
  }
  const site = trailer.site.toLowerCase();
  if (site === 'youtube') {
    return `https://www.youtube.com/watch?v=${trailer.id}`;
  }
  if (site === 'dailymotion') {
    return `https://www.dailymotion.com/video/${trailer.id}`;
  }
  return null;
}

/**
 * Resmi site: `externalLinks` içinde yayın platformları (Crunchyroll, Netflix)
 * ve sosyal hesaplar da geliyor — yalnızca "Official Site" işaretlisi alınır.
 */
function officialSite(
  links:
    | Array<{ site: string | null; url: string | null; type: string | null }>
    | null
    | undefined,
): string | null {
  const match = (links ?? []).find(
    (link) => link.site?.toLowerCase() === 'official site' && link.url,
  );
  return match?.url ?? null;
}

function normalizeCharacter(raw: RawCharacter): AnilistCharacterDetail {
  const { traits, description } = parseCharacterDescription(raw.description);
  const birth = raw.dateOfBirth;
  const hasBirth = Boolean(birth && (birth.year || birth.month || birth.day));

  return {
    characterId: raw.id,
    name: raw.name?.full?.trim() || `#${raw.id}`,
    nameNative: raw.name?.native ?? null,
    // AniList'te takma ad listesi bazen onlarca satır oluyor (her dildeki
    // yazılışı). Künye satırı olmaktan çıkmasın diye sekizle sınırlı.
    alternativeNames: (raw.name?.alternative ?? [])
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .slice(0, 8),
    image: raw.image?.large ?? null,
    description,
    traits,
    gender: raw.gender,
    age: raw.age,
    bloodType: raw.bloodType,
    dateOfBirth: hasBirth
      ? {
          year: birth?.year ?? null,
          month: birth?.month ?? null,
          day: birth?.day ?? null,
        }
      : null,
    favourites: raw.favourites,
    siteUrl: raw.siteUrl,
    appearances: (raw.media?.edges ?? [])
      .filter((edge) => typeof edge.node?.id === 'number')
      .map((edge) => ({
        anilistId: edge.node.id,
        title:
          edge.node.title?.english ??
          edge.node.title?.romaji ??
          edge.node.title?.native ??
          `#${edge.node.id}`,
        mediaType: edge.node.type,
        format: edge.node.format,
        seasonYear: edge.node.seasonYear,
        coverImage:
          edge.node.coverImage?.extraLarge ??
          edge.node.coverImage?.large ??
          null,
        role: edge.characterRole,
        voiceActor: edge.voiceActors?.[0]?.name?.full ?? null,
        voiceActorImage:
          edge.voiceActors?.[0]?.image?.large ??
          edge.voiceActors?.[0]?.image?.medium ??
          null,
      })),
  };
}

/**
 * AniList karakter açıklamasını künye satırları + serbest metin olarak ayırır.
 *
 * Kaynak metin iki şey birden taşıyor ve tek blok olarak basılırsa ikisi de
 * kötü görünüyor:
 *   __Height:__ 202 cm          ← aslında bir künye satırı, cümle değil
 *   __Birthday:__ November 11
 *
 *   Zaraki Kenpachi is the captain of…   ← asıl metin
 *   ~!Bankai'sinde görünümü…!~            ← spoiler
 *
 * Bu yüzden künye satırları tabloya, kalanı paragrafa, `~!…!~` blokları da
 * dokunarak açılan kapının ardına gidiyor. Ayrıştırma burada yapılıyor çünkü
 * sonuç cache'e yazılıyor: her sayfa açılışında yeniden çözümlenmiyor.
 */
function parseCharacterDescription(raw: string | null): {
  traits: AnilistCharacterTrait[];
  description: AnilistTextSegment[];
} {
  if (!raw) {
    return { traits: [], description: [] };
  }

  const traits: AnilistCharacterTrait[] = [];
  const description: AnilistTextSegment[] = [];

  for (const chunk of splitSpoilerChunks(raw)) {
    const prose: string[] = [];
    for (const line of chunk.text.split('\n')) {
      const trait = TRAIT_LINE.exec(line);
      if (trait) {
        const label = stripMarkdown(trait[1]);
        const value = stripMarkdown(trait[2]);
        // Anahtarı ya da değeri boş kalan satır künyeye girmez — tabloda
        // yarım bir satır, hiç olmayan satırdan kötü
        if (label && value) {
          traits.push({ label, value, spoiler: chunk.spoiler });
          continue;
        }
      }
      const clean = stripMarkdown(line);
      if (clean) {
        prose.push(clean);
      }
    }
    const text = prose.join('\n');
    if (text) {
      description.push({ text, spoiler: chunk.spoiler });
    }
  }

  return { traits, description };
}

/** `__Boy:__ 202 cm` ve `__Boy__: 202 cm` yazımlarının ikisini de yakalar. */
const TRAIT_LINE =
  /^\s*(?:__|\*\*)\s*([^:\n]{1,48}?)\s*:?\s*(?:__|\*\*)\s*:?\s*(.+)$/;

/** `~!…!~` blokları metni spoiler'lı/spoiler'sız parçalara böler. */
function splitSpoilerChunks(
  raw: string,
): Array<{ text: string; spoiler: boolean }> {
  const normalized = raw.replace(/<br\s*\/?>/gi, '\n').replace(/\r\n/g, '\n');
  const chunks: Array<{ text: string; spoiler: boolean }> = [];
  const pattern = /~!([\s\S]*?)!~/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(normalized)) !== null) {
    if (match.index > cursor) {
      chunks.push({
        text: normalized.slice(cursor, match.index),
        spoiler: false,
      });
    }
    chunks.push({ text: match[1], spoiler: true });
    cursor = match.index + match[0].length;
  }
  if (cursor < normalized.length) {
    chunks.push({ text: normalized.slice(cursor), spoiler: false });
  }
  return chunks;
}

/**
 * AniList markdown'ından düz metin.
 *
 * `dangerouslySetInnerHTML` bilinçli olarak kullanılmıyor (kural 6): dış
 * kaynaktan gelen metin HTML olarak basılırsa XSS yüzeyi açılır. Bu yüzden
 * biçimlendirme işaretleri **atılıyor**, HTML'e çevrilmiyor.
 */
function stripMarkdown(value: string): string {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // görsel
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // link → yalnızca metni
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // kalın
    .replace(/`([^`]*)`/g, '$1')
    .replace(/[ \t]+/g, ' ')
    .trim();
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
