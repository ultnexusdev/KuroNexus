import { createHash } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AnilistService,
  type AnilistCharacter,
  type AnilistCharacterAppearance,
  type AnilistCharacterCard,
  type AnilistCharacterDetail,
  type AnilistMedia,
} from './anilist.service';
import { JikanService } from './jikan.service';
import {
  CharacterImagesService,
  type CharacterImageRecord,
} from './character-images.service';
import { HiddenCharactersService } from './hidden-characters.service';
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

/** Anime sayfasının altındaki küçük bağlantı kartları. */
export type AnimeLinkKind =
  'MANGA' | 'TRAILER' | 'OPENING' | 'ENDING' | 'OFFICIAL' | 'ANILIST' | 'MAL';

export interface AnimeLink {
  kind: AnimeLinkKind;
  url: string;
}

/**
 * Küratörün elle girdiği bağlantılar — `AnimeEntry.links` alanının şekli.
 * Manga okuma adresini ve OP/ED klibini hiçbir API vermiyor; fragman ile
 * resmi site AniList'ten geliyor ama buradan ezilebiliyor.
 */
export interface AnimeCustomLinks {
  manga?: string;
  trailer?: string;
  opening?: string;
  ending?: string;
  official?: string;
}

/** Elle girilebilen bağlantı alanları — kaydetme döngüsü bunları gezer. */
const LINK_FIELDS = [
  'manga',
  'trailer',
  'opening',
  'ending',
  'official',
] as const satisfies ReadonlyArray<keyof AnimeCustomLinks>;

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
  /** Sayfanın üstündeki sabit banner (küratör seçimi > kök künye > sezonlar) */
  bannerImage: string | null;
  /** Yalnızca küratörün seçtiği banner — form bunu doldurur, boşsa AniList'inki */
  customBanner: string | null;
  genres: string[];
  tags: string[];
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
  /** Gösterilecek dış bağlantılar (elle girilenler + AniList'ten türetilenler) */
  links: AnimeLink[];
  /** Küratör formunun doldurduğu ham değerler — yalnızca elle girilenler */
  customLinks: AnimeCustomLinks;
}

// Salon girişinin iki yanındaki afişler — başlık burada, yol AniList'ten gelir
const SHOWCASE_LEFT_ANIME = 'One Piece';
const SHOWCASE_RIGHT_ANIME = 'Naruto';
const SHOWCASE_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface ShowcasePoster {
  title: string;
  /** AniList kapak URL'i (tam adres, TMDB'deki gibi göreli yol değil) */
  posterPath: string;
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

/* --- Karakter dizini ---------------------------------------------------- */

/**
 * Arşiv karakteri: AniList kadro kaydının, "hangi serilerimizde görünüyor"
 * bilgisiyle zenginleştirilmiş hâli.
 *
 * Alan adlarında bilinçli olarak `anilist` geçmiyor: bu şekli ileride TMDB
 * `credits`inden (film/dizi karakterleri) de doldurmak mümkün olsun — arayüz
 * bileşenleri kaynağı bilmiyor.
 */
export interface ArchiveCharacter {
  characterId: number;
  name: string;
  nameNative: string | null;
  image: string | null;
  /** MAIN | SUPPORTING | BACKGROUND */
  role: string | null;
  voiceActor: string | null;
  favourites: number | null;
  series: Array<{ slug: string; title: string }>;
}

export interface CharacterSeriesFacet {
  slug: string;
  title: string;
  coverImage: string | null;
  count: number;
}

/** Karakter dizininin yanıtı — derlenmiş hâli de süzülmüş hâli de bu şekilde. */
export interface CharacterIndexPayload {
  characters: ArchiveCharacter[];
  series: CharacterSeriesFacet[];
  stats: { characters: number; series: number; main: number };
}

/** Karakterin göründüğü yapım + arşivde karşılığı varsa kendi adresimiz. */
export interface ArchiveCharacterAppearance extends AnilistCharacterAppearance {
  archiveSlug: string | null;
}

const EMPTY_CHARACTER_STATS = { characters: 0, series: 0, main: 0 };
/** Derlenmiş dizin bir gün taze sayılır; kadroların kendi TTL'i 30 gün. */
const CHARACTER_INDEX_TTL_MS = 24 * 60 * 60 * 1000;
/**
 * Soğuk başlangıçta paralel AniList isteği sayısı. AniList dakikada 90 istek
 * kabul ediyor; dörtte kalmak hem kotanın çok altında hem de 30 serilik bir
 * arşivi tek sayfa açılışında toplayacak kadar hızlı.
 */
const CHARACTER_FETCH_CONCURRENCY = 4;
/** "Yakındaki karakterler" için taranacak seri sayısı. */
const RELATED_SERIES_LIMIT = 3;
/** Şeritte gösterilecek karakter sayısı. */
const RELATED_LIMIT = 12;

export type EntryWithParts = AnimeEntry & { parts: AnimePart[] };

@Injectable()
export class AnimeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly anilist: AnilistService,
    private readonly jikan: JikanService,
    private readonly characterImages: CharacterImagesService,
    private readonly hiddenCharacters: HiddenCharactersService,
  ) {}

  // --- Public ---

  /** Salon tek istekte dolar (film salonuyla aynı yaklaşım). */
  async getArchive(): Promise<{
    entries: ArchiveAnime[];
    stats: AnimeArchiveStats;
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
      genres: collect(entries, (entry) => entry.genres),
      tags: collect(entries, (entry) => entry.tags),
    };
  }

  /**
   * Salon girişinin iki yanındaki afişler (film lobisiyle aynı desen).
   *
   * Afiş yolları koda GÖMÜLMEZ: başlıkla AniList'te aranır ve sonuç 30 gün
   * cache'lenir. Kaynak düşerse boş döner — lobi afişsiz açılır, çökmez.
   * Afişi değiştirmek = aşağıdaki iki başlık sabitini değiştirmek.
   */
  async showcase(): Promise<{
    left: ShowcasePoster | null;
    right: ShowcasePoster | null;
  }> {
    const cacheKey = 'anime:showcase:v1';
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (
      cached &&
      Date.now() - cached.fetchedAt.getTime() < SHOWCASE_CACHE_TTL_MS
    ) {
      return cached.payload as unknown as {
        left: ShowcasePoster | null;
        right: ShowcasePoster | null;
      };
    }

    const resolve = async (query: string): Promise<ShowcasePoster | null> => {
      try {
        const results = await this.anilist.search(query);
        // Arama "One Piece Film" gibi yan yapımları da getiriyor; en çok
        // bölümü olan TV kaydı serinin kendisidir
        const match =
          results.find(
            (item) =>
              item.format === 'TV' &&
              item.title.toLowerCase() === query.toLowerCase(),
          ) ??
          results.find((item) => item.format === 'TV') ??
          results[0];
        const cover = match?.coverImageLarge ?? match?.coverImage;
        if (!match || !cover) {
          return null;
        }
        return { title: match.title, posterPath: cover };
      } catch {
        return null;
      }
    };

    const [left, right] = await Promise.all([
      resolve(SHOWCASE_LEFT_ANIME),
      resolve(SHOWCASE_RIGHT_ANIME),
    ]);
    const payload = { left, right };

    // İkisi de boşsa cache'leme: kaynak toparlayınca hemen dolsun
    if (left || right) {
      await this.prisma.externalCache.upsert({
        where: { cacheKey },
        create: {
          cacheKey,
          payload: payload as unknown as object,
          fetchedAt: new Date(),
        },
        update: {
          payload: payload as unknown as object,
          fetchedAt: new Date(),
        },
      });
    } else if (cached) {
      return cached.payload as unknown as {
        left: ShowcasePoster | null;
        right: ShowcasePoster | null;
      };
    }
    return payload;
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
   * Karakter dizini: arşivdeki bütün serilerin kadroları tek listede.
   *
   * Neden ayrı bir cache: liste, seri başına bir kadro kaydından derleniyor.
   * Kadrolar zaten 30 gün cache'li, yani ısınmış durumda derleme yalnızca N
   * tane `findUnique` — ucuz. Pahalı olan **soğuk** hâl: arşivde 30 seri
   * varsa 30 AniList isteği. Derlenmiş liste bu yüzden ayrıca saklanıyor.
   *
   * Cache anahtarı arşivdeki seri kimliklerinden türetiliyor: seri eklenince
   * ya da çıkarılınca anahtar değişir ve liste kendiliğinden tazelenir.
   */
  async getCharacterIndex(): Promise<CharacterIndexPayload> {
    /*
     * Gizleme süzgeci ÖNBELLEKTEN SONRA uygulanıyor, önce değil.
     *
     * Derlenmiş dizin 24 saat cache'li ve anahtarı arşivdeki seri
     * kimliklerinden türetiliyor. Gizleme cache'in içine karışsaydı,
     * küratörün "kaldır" dediği karakter bir gün boyunca listede kalırdı
     * (ya da her gizlemede anahtarı değiştirip bütün dizini yeniden
     * derlemek gerekirdi — 17 AniList turu).
     *
     * Bu sırayla: pahalı derleme cache'te kalıyor, ucuz süzgeç her istekte
     * çalışıyor ve gizleme anında etkili oluyor.
     */
    /*
     * Küratör portreleri de ÖNBELLEKTEN SONRA biniyor, aynı gerekçeyle:
     * derlenmiş dizin 24 saat cache'li, yüklenen portre ise anında
     * görünmeli. Yükleme cache'in içine karışsaydı küratör kareyi yükler,
     * karakter sayfasında görür ama dizinde bir gün boyunca AniList'in
     * küçük kartını görmeye devam ederdi.
     */
    const [full, hidden, portraits] = await Promise.all([
      this.buildCharacterIndex(),
      this.hiddenCharacters.listIds(),
      this.characterImages.portraitMap(),
    ]);
    if (hidden.size === 0) {
      return { ...full, characters: withPortraits(full.characters, portraits) };
    }

    const characters = withPortraits(
      full.characters.filter((character) => !hidden.has(character.characterId)),
      portraits,
    );

    // Seri süzgecindeki sayılar da düşmeli: "Bleach · 12" yazarken listede
    // 9 karakter göstermek küratöre yanlış bilgi verir
    const perSeries = new Map<string, number>();
    for (const character of characters) {
      for (const series of character.series) {
        perSeries.set(series.slug, (perSeries.get(series.slug) ?? 0) + 1);
      }
    }

    return {
      characters,
      series: full.series
        .map((facet) => ({ ...facet, count: perSeries.get(facet.slug) ?? 0 }))
        // Bütün karakterleri gizlenmiş bir seri süzgeçte durmasın
        .filter((facet) => facet.count > 0),
      stats: {
        characters: characters.length,
        series: perSeries.size,
        main: characters.filter((item) => item.role === 'MAIN').length,
      },
    };
  }

  /** Dizinin derlenmiş, süzülmemiş hâli — cache burada. */
  private async buildCharacterIndex(): Promise<CharacterIndexPayload> {
    const rows = await this.prisma.animeEntry.findMany({
      where: { isDeleted: false },
      include: { parts: { orderBy: { orderIndex: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
    const entries = withSlugs(rows);
    if (entries.length === 0) {
      return { characters: [], series: [], stats: EMPTY_CHARACTER_STATS };
    }

    const fingerprint = createHash('sha1')
      .update(
        entries
          .map((entry) => entry.anilistId)
          .sort((a, b) => a - b)
          .join(','),
      )
      .digest('hex')
      .slice(0, 12);
    // v2: kadro portreleri büyüdü (anilist.service `characters:v3`), derlenmiş
    // dizin de o adresleri taşıdığı için birlikte sürümlendi
    const cacheKey = `anime:character-index:v2:${fingerprint}`;
    const cached = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (
      cached &&
      Date.now() - cached.fetchedAt.getTime() < CHARACTER_INDEX_TTL_MS
    ) {
      return cached.payload as unknown as CharacterIndexPayload;
    }

    const casts = await mapWithLimit(
      entries,
      CHARACTER_FETCH_CONCURRENCY,
      (entry) =>
        this.anilist
          .getCharacters(entry.anilistId)
          .then((characters) => ({ entry, characters }))
          // Tek serinin kadrosu alınamazsa dizin o seri eksik kurulur; bütün
          // sayfanın düşmesi için sebep değil (kural 4)
          .catch(() => ({ entry, characters: [] as AnilistCharacter[] })),
    );

    const merged = new Map<number, ArchiveCharacter>();
    const seriesCount = new Map<string, CharacterSeriesFacet>();

    for (const { entry, characters } of casts) {
      for (const character of characters) {
        const existing = merged.get(character.characterId);
        const appearance = { slug: entry.slug, title: entry.title };
        if (existing) {
          // Aynı karakter iki seride de olabilir (crossover, yan seri).
          // Rol olarak en yükseği tutulur: bir yerde başrolse başroldür.
          if (!existing.series.some((item) => item.slug === entry.slug)) {
            existing.series.push(appearance);
          }
          if (roleWeight(character.role) < roleWeight(existing.role)) {
            existing.role = character.role;
          }
          existing.image = existing.image ?? character.image;
        } else {
          merged.set(character.characterId, {
            characterId: character.characterId,
            name: character.name,
            nameNative: character.nameNative,
            image: character.image,
            role: character.role,
            voiceActor: character.voiceActor,
            favourites: character.favourites,
            series: [appearance],
          });
        }
      }
      if (characters.length > 0) {
        seriesCount.set(entry.slug, {
          slug: entry.slug,
          title: entry.title,
          coverImage: entry.coverImage,
          count: characters.length,
        });
      }
    }

    const characters = [...merged.values()].sort(byRoleThenFame);
    const payload = {
      characters,
      series: [...seriesCount.values()].sort((a, b) =>
        a.title.localeCompare(b.title),
      ),
      stats: {
        characters: characters.length,
        series: seriesCount.size,
        main: characters.filter((item) => item.role === 'MAIN').length,
      },
    };

    // Hiç karakter derlenemediyse cache'leme: kaynak toparlayınca ilk istekte
    // dolsun, boş liste 24 saat çakılı kalmasın (afiş cache'iyle aynı karar)
    if (characters.length > 0) {
      /*
       * ⚠️ Aşağıdaki `as unknown as object` dönüşümü SİLİNMEMELİ.
       *
       * `eslint --fix` bunu "gereksiz dönüşüm" diye kaldırmak ister ve
       * kaldırınca derleme kırılır: Prisma'nın `Json` alanı TypeScript'te
       * `InputJsonValue` bekliyor, o tip de **index imzası** şart koşuyor.
       * `ArchiveCharacter` gibi adlandırılmış arayüzlerde index imzası yok,
       * dolayısıyla doğrudan atanamıyorlar. Aynı desen bu dosyada `showcase`
       * ve `episodeMarks` yazımlarında da var, aynı sebeple.
       */
      await this.prisma.externalCache.upsert({
        where: { cacheKey },
        create: {
          cacheKey,
          payload: payload as unknown as object,
          fetchedAt: new Date(),
        },
        update: {
          payload: payload as unknown as object,
          fetchedAt: new Date(),
        },
      });
    }
    return payload;
  }

  /** Adı geçen karakterlerin küçük künyeleri — servis yalnızca aktarıyor. */
  getCharacterCards(ids: number[]): Promise<AnilistCharacterCard[]> {
    return this.anilist.getCharacterCards(ids);
  }

  /**
   * Karakter sayfası: AniList künyesi + arşivimizle köprü.
   *
   * İki köprü kuruluyor:
   *  - karakterin göründüğü yapım arşivde varsa `archiveSlug` dolar ve kart
   *    dışarıya değil kendi sayfamıza gider,
   *  - aynı serilerdeki diğer karakterler "yakındaki karakterler" şeridini
   *    doldurur (kadrolar zaten cache'li, ek dış istek yok).
   */
  async getCharacterDetail(characterId: number): Promise<{
    character: AnilistCharacterDetail;
    appearances: ArchiveCharacterAppearance[];
    related: ArchiveCharacter[];
    images: CharacterImageRecord[];
  }> {
    /*
     * Elle yüklenen görseller künyeyle BİRLİKTE dönüyor, ayrı bir istekte
     * değil: sayfa zaten bu uca gidiyor ve görseller olmadan çizilemiyor
     * (kapak portresi hero'nun içinde). İkinci bir tur, ilk boyamayı
     * bekletirdi.
     */
    const [character, images] = await Promise.all([
      this.anilist.getCharacter(characterId),
      this.characterImages.listFor(characterId),
    ]);
    if (!character) {
      throw new NotFoundException('ANIME.CHARACTER_NOT_FOUND');
    }

    const rows = await this.prisma.animeEntry.findMany({
      where: { isDeleted: false },
      include: { parts: { orderBy: { orderIndex: 'asc' } } },
      orderBy: { updatedAt: 'desc' },
    });
    const entries = withSlugs(rows);

    // Bir yapım arşivde ya serinin kökü ya da bir sezonu olarak duruyor;
    // ikisi de aynı seri sayfasına çıkar
    const slugByAnilistId = new Map<number, ArchiveAnime>();
    for (const entry of entries) {
      slugByAnilistId.set(entry.anilistId, entry);
      for (const part of entry.parts) {
        slugByAnilistId.set(part.anilistId, entry);
      }
    }

    const appearances: ArchiveCharacterAppearance[] = character.appearances.map(
      (appearance) => ({
        ...appearance,
        archiveSlug: slugByAnilistId.get(appearance.anilistId)?.slug ?? null,
      }),
    );

    const ownSeries = [
      ...new Set(
        appearances
          .map((appearance) => slugByAnilistId.get(appearance.anilistId))
          .filter((entry): entry is ArchiveAnime => Boolean(entry))
          .map((entry) => entry.slug),
      ),
    ];

    // "Yakındaki karakterler" de dizinin bir parçası: küratörün kaldırdığı
    // bir karakter oradan da çıkmalı, yoksa gizleme yarım kalır
    const hidden = await this.hiddenCharacters.listIds();
    const nearby = (
      await this.collectRelated(
        entries.filter((entry) => ownSeries.includes(entry.slug)),
        characterId,
      )
    ).filter((item) => !hidden.has(item.characterId));

    /* Şerit de dizinin bir parçası: küratörün yüklediği portre orada da
       görünmeli, yoksa aynı karakter iki sayfada iki farklı yüzle çıkar.
       Harita yalnızca şeritteki 12 kimlik için isteniyor. */
    const related = withPortraits(
      nearby,
      await this.characterImages.portraitMap(
        nearby.map((item) => item.characterId),
      ),
    );

    return { character, appearances, related, images };
  }

  /** Aynı serilerdeki diğer karakterler — yalnızca cache'ten, dış istek yok. */
  private async collectRelated(
    entries: ArchiveAnime[],
    excludeId: number,
  ): Promise<ArchiveCharacter[]> {
    const casts = await mapWithLimit(
      entries.slice(0, RELATED_SERIES_LIMIT),
      CHARACTER_FETCH_CONCURRENCY,
      (entry) =>
        this.anilist
          .getCharacters(entry.anilistId)
          .then((characters) => ({ entry, characters }))
          .catch(() => ({ entry, characters: [] as AnilistCharacter[] })),
    );

    const merged = new Map<number, ArchiveCharacter>();
    for (const { entry, characters } of casts) {
      for (const character of characters) {
        if (character.characterId === excludeId) {
          continue;
        }
        const existing = merged.get(character.characterId);
        if (existing) {
          if (!existing.series.some((item) => item.slug === entry.slug)) {
            existing.series.push({ slug: entry.slug, title: entry.title });
          }
          continue;
        }
        merged.set(character.characterId, {
          characterId: character.characterId,
          name: character.name,
          nameNative: character.nameNative,
          image: character.image,
          role: character.role,
          voiceActor: character.voiceActor,
          favourites: character.favourites,
          series: [{ slug: entry.slug, title: entry.title }],
        });
      }
    }
    return [...merged.values()].sort(byRoleThenFame).slice(0, RELATED_LIMIT);
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
    // Boş metin "temizle" demektir: küratör alanı silince AniList'ten gelen
    // banner/bağlantı yeniden devreye girsin
    if (dto.bannerImage !== undefined) {
      data.bannerImage = normalizeUrl(dto.bannerImage);
    }
    if (dto.links !== undefined) {
      const incoming = dto.links;
      const merged: AnimeCustomLinks = { ...readCustomLinks(entry) };
      for (const field of LINK_FIELDS) {
        // Gönderilmeyen alan olduğu gibi kalır; boş gönderilen alan silinir
        if (incoming[field] === undefined) {
          continue;
        }
        const url = normalizeUrl(incoming[field]);
        if (url) {
          merged[field] = url;
        } else {
          delete merged[field];
        }
      }
      data.links = merged as unknown as Prisma.InputJsonValue;
    }
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
 * Sınırlı paralellikte eşleme.
 *
 * `Promise.all` ile hepsini birden atmak, 30 serilik bir arşivde AniList'e tek
 * anda 30 istek demek — kaynak 429 döndürüp dizini yarım bırakır. Sıra sıra
 * gitmek ise soğuk başlangıçta sayfayı bekletir. Ortadaki yol bu.
 */
async function mapWithLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, () =>
    (async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await worker(items[index]);
      }
    })(),
  );
  await Promise.all(runners);
  return results;
}

/** Sıralama ağırlığı: başrol önce, arka plan en sonda. */
function roleWeight(role: string | null): number {
  if (role === 'MAIN') {
    return 0;
  }
  if (role === 'SUPPORTING') {
    return 1;
  }
  return 2;
}

/**
 * Karakter sıralaması: önce rol, sonra AniList favori sayısı, sonra ad.
 * Ad son basamak çünkü favori sayısı eşit olan (çoğu zaman `null`) karakterler
 * aksi hâlde her istekte farklı sırada gelir — liste kıpırdıyor gibi görünür.
 */
function byRoleThenFame(a: ArchiveCharacter, b: ArchiveCharacter): number {
  const byRole = roleWeight(a.role) - roleWeight(b.role);
  if (byRole !== 0) {
    return byRole;
  }
  const fame = (b.favourites ?? 0) - (a.favourites ?? 0);
  return fame !== 0 ? fame : a.name.localeCompare(b.name);
}

/**
 * Küratörün yüklediği portreyi karakter künyesine işler.
 *
 * Kaynak sırası dosya sayfasındakiyle aynı: **yükleme kazanır**, AniList
 * kartı yalnızca yükleme yoksa devrede. Adres göreli bırakılıyor
 * (`/uploads/...`) — mutlak hâle getirmek sunucunun kendi adını yanıta
 * gömmek demek; ön yüz `apiUrl()` ile çözüyor (kapak ve afiş adresleriyle
 * aynı sözleşme).
 *
 * Yeni dizi dönüyor, künyeler yerinde değiştirilmiyor: `full.characters`
 * derlenmiş dizinin CACHE'İNDEN geliyor ve aynı nesneler bir sonraki
 * istekte yeniden kullanılıyor — yerinde yazmak, portre kaydı silinse
 * bile eski adresin bellekte kalması demekti.
 */
function withPortraits(
  characters: ArchiveCharacter[],
  portraits: Map<number, string>,
): ArchiveCharacter[] {
  if (portraits.size === 0) {
    return characters;
  }
  return characters.map((character) => {
    const uploaded = portraits.get(character.characterId);
    return uploaded ? { ...character, image: uploaded } : character;
  });
}

/**
 * Serilere adres verir. Slug veritabanında tutulmuyor: başlıktan türetiliyor,
 * iki seri aynı slug'a düşerse sonrakine AniList numarası ekleniyor. Böylece
 * hem şema sade kalıyor hem de künye tazelenip başlık değişse adres kendini
 * düzeltiyor.
 *
 * **Dışa açık** çünkü nabız servisi de ("son eklenenler" şeridi) seri
 * adreslerini buradan alıyor: slug listenin tamamına ve sırasına bağlı, o
 * yüzden mantık tek yerde kalmalı — kopyası kayan adres üretir.
 */
export function withSlugs(rows: EntryWithParts[]): ArchiveAnime[] {
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
  const isSeason = (part: ArchiveAnimePart) =>
    part.format === 'TV' || part.format === 'TV_SHORT';
  const currentPart =
    parts.find((part) => !part.isCompleted && part.watchedEpisodes > 0) ??
    parts.find((part) => !part.isCompleted && isSeason(part)) ??
    parts.find((part) => !part.isCompleted) ??
    // Her şey bitmişse son sezon gösterilir; sona düşen tek bölümlük bir
    // özel ("…the Genie, and the Three Wishes") serinin yüzü olmamalı
    [...parts].reverse().find(isSeason) ??
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
    bannerImage: pickBanner(entry, root),
    customBanner: entry.bannerImage,
    genres: root?.genres ?? [],
    tags: root?.tags ?? [],
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
    links: buildLinks(entry, root),
    customLinks: readCustomLinks(entry),
  };
}

/**
 * Sayfanın üstündeki banner. Sıra bilinçli:
 *  1. küratörün seçtiği görsel — künye tazelense de değişmez,
 *  2. kök yapımın AniList banner'ı,
 *  3. sezonların banner'ı (önce TV sezonları, sıralı ilk dolu olan).
 *
 * Üçüncü adım rastgele değil **sıralı**: kökün banner'ı yoksa bile sayfa her
 * açılışta aynı görselle açılsın (kullanıcı geri bildirimi: banner sürekli
 * değişiyor ve bazıları düşük çözünürlüklü).
 */
function pickBanner(
  entry: EntryWithParts,
  root: AnilistMedia | null,
): string | null {
  if (entry.bannerImage) {
    return entry.bannerImage;
  }
  if (root?.bannerImage) {
    return root.bannerImage;
  }
  const ordered = [...entry.parts].sort((a, b) => a.orderIndex - b.orderIndex);
  const banners = ordered.map((part) => {
    const media = (part.externalData ?? null) as AnilistMedia | null;
    return media;
  });
  const season = banners.find(
    (media) =>
      media?.bannerImage &&
      (media.format === 'TV' || media.format === 'TV_SHORT'),
  );
  return (
    season?.bannerImage ??
    banners.find((media) => media?.bannerImage)?.bannerImage ??
    null
  );
}

/**
 * Küratörün yapıştırdığı adresi temizler. Boş metin "temizle" demek (null
 * döner); `/uploads/...` gibi kendi yüklediğimiz yollar olduğu gibi kalır;
 * şemasız yapıştırılan adrese `https://` eklenir — "myanimelist.net/anime/1"
 * yazınca bağlantının sayfanın kendi yoluna gitmesi hataydı.
 */
function normalizeUrl(value: string | null | undefined): string | null {
  const trimmed = (value ?? '').trim();
  if (!trimmed) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function readCustomLinks(entry: EntryWithParts): AnimeCustomLinks {
  return (entry.links ?? {}) as AnimeCustomLinks;
}

/**
 * Dış bağlantı kartları. Elle girilen adres her zaman kazanır; girilmemişse
 * AniList künyesinden türetilir. Adresi olmayan tür hiç kart açmaz — boş bir
 * karta tıklamak, kartın hiç olmamasından kötü.
 */
function buildLinks(
  entry: EntryWithParts,
  root: AnilistMedia | null,
): AnimeLink[] {
  const custom = readCustomLinks(entry);
  const candidates: Array<{ kind: AnimeLinkKind; url: string | null }> = [
    {
      kind: 'MANGA',
      url:
        custom.manga ??
        (root?.manga
          ? `https://anilist.co/manga/${root.manga.anilistId}`
          : null),
    },
    { kind: 'TRAILER', url: custom.trailer ?? root?.trailerUrl ?? null },
    // OP/ED'yi hiçbir kaynak vermiyor: yalnızca elle girilir
    { kind: 'OPENING', url: custom.opening ?? null },
    { kind: 'ENDING', url: custom.ending ?? null },
    { kind: 'OFFICIAL', url: custom.official ?? root?.officialSite ?? null },
    { kind: 'ANILIST', url: `https://anilist.co/anime/${entry.anilistId}` },
    {
      kind: 'MAL',
      url: entry.malId ? `https://myanimelist.net/anime/${entry.malId}` : null,
    },
  ];

  return candidates
    .filter((item): item is { kind: AnimeLinkKind; url: string } =>
      Boolean(item.url),
    )
    .map((item) => ({ kind: item.kind, url: item.url }));
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
