import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AnilistMedia } from '../anime/anilist.service';
import type { TmdbMovie } from '../movies/tmdb.service';
import type { TmdbShow } from '../shows/tmdb-tv.service';
import { slugify } from '../common/utils/slugify';
/* "Son eklenenler" şeridinin adresleri salonların KENDİ slug üreticilerinden
   geliyor; burada yeniden türetilmiyor (gerekçe `buildAdditions`ın başında). */
import { withSlugs as withMovieSlugs } from '../movies/movies.service';
import {
  withSlugs as withShowSlugs,
  type EntryWithSeasons,
} from '../shows/shows.service';
import {
  withSlugs as withAnimeSlugs,
  type EntryWithParts,
} from '../anime/anime.service';
import {
  ARCHIVE_OMIT as BOOK_ARCHIVE_OMIT,
  CREDITS_INCLUDE as BOOK_CREDITS_INCLUDE,
  withSlugs as withBookSlugs,
  type BookEntryWithCredits,
} from '../books/books.service';
import type { MovieEntry } from '../generated/prisma/client';

/**
 * "Nexus'u Keşfet" sayfasının tek veri kaynağı.
 *
 * Sayfa beş ayrı bölümden oluşuyor (Temürkan baş köşesi, salon kapıları,
 * "şu an" şeridi, evrenler rafı, künye şeridi) ve hepsi tek istekte doluyor:
 * beş ayrı uca gitmek sayfayı hem yavaşlatır hem büyüdükçe dağıtır.
 *
 * Buradaki her sayı **veritabanından** geliyor; dış API'ye hiç çıkılmıyor
 * (künye alanları arşive eklenirken zaten cache'lenmişti). Sayfa bu yüzden
 * TMDB/AniList düşse de eksiksiz açılır.
 */

/** Baş köşedeki mühürlü evren — sitenin kendi eseri. */
const FEATURED_UNIVERSE_SLUG = 'temurkan-efsaneleri';

/** "Son eklenenler" şeridi kaç kart taşır. */
const ADDITION_LIMIT = 12;

export interface PulseHall {
  slug: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  /** Salon numarası ana sayfayla aynı sırayı takip eder (frontend hesaplar) */
  universeCount: number;
  /** Kapının altındaki canlı satır; salona göre farklı şeyi anlatır */
  line: string | null;
  /**
   * Salonun büyüklüğü. **Arşivdeki TOPLAM** — "izleyeceğim" listesi dahil
   * (kullanıcı kararı). Önceden `status !== 'WATCHLIST'` süzülüyordu ve
   * salonun kendi sayfasındaki başlıktan (ör. "316 film") küçük çıkıyordu;
   * ziyaretçi aynı arşiv için iki farklı sayı görüyordu.
   */
  count: number | null;
  /**
   * `count` neyi sayıyor. Her salon kendi diliyle konuşuyor: film salonunda
   * film, Kadim Dünyalar'da evren, Temürkan'da bölüm. Metin BURADA
   * üretilmiyor — frontend bu anahtarı kendi diline çeviriyor (kural 1).
   */
  countUnit:
    | 'film'
    | 'dizi'
    | 'seri'
    | 'kitap'
    | 'evren'
    | 'sanatci'
    | null;
}

export interface PulseEntry {
  kind: 'FILM' | 'DIZI' | 'ANIME' | 'CHAPTER' | 'WIKI';
  title: string;
  subtitle: string | null;
  href: string;
  image: string | null;
  /** ISO tarih; şeritte "3 gün önce" olarak yazılır */
  at: string | null;
}

/**
 * Arşive en son giren tek bir kayıt — "son eklenenler" şeridinin kartı.
 *
 * `PulseEntry`den ayrı bir tip: o şerit "şu an ne izliyorum"u anlatıyor ve
 * ölçüsü izleme anı (`at`), buradaki ölçü ise **arşive giriş** anı
 * (`addedAt`). 2005'te izlenmiş bir film bugün eklenmiş olabilir; iki şerit
 * bu yüzden aynı veriyi paylaşamıyor.
 */
export interface PulseAddition {
  kind: 'FILM' | 'DIZI' | 'ANIME' | 'KITAP';
  title: string;
  /** Kartın ikinci satırı: film/dizi/anime'de yıl, kitapta yazar */
  meta: string | null;
  /** Arşivdeki kendi sayfasının TAM yolu, ör. "/dark-stories/category/film/dune" */
  href: string;
  /** Kapak. Çözümü `kind`a göre: FILM/DIZI -> TMDB göreli yol,
      ANIME -> tam adres, KITAP -> bizim /uploads yolumuz.
      (Var olan `PulseEntry.image` ile AYNI sözleşme.) */
  image: string | null;
  /** Arşive giriş anı, ISO (entry.createdAt) */
  addedAt: string;
}

export interface PulseFeatured {
  slug: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  chapterCount: number;
  entryCount: number;
  latestChapter: { title: string; slug: string; at: string | null } | null;
}

export interface PulseUniverse {
  slug: string;
  name: string;
  coverImage: string | null;
  categorySlug: string | null;
  storyCount: number;
}

export interface Pulse {
  featured: PulseFeatured | null;
  halls: PulseHall[];
  recent: PulseEntry[];
  /** Arşive EN SON giren kayıtlar, createdAt azalan, en fazla 12 */
  additions: PulseAddition[];
  universes: PulseUniverse[];
  totals: {
    universes: number;
    chapters: number;
    films: number;
    animeEpisodes: number;
    wikiEntries: number;
  };
}

@Injectable()
export class PulseService {
  constructor(private readonly prisma: PrismaService) {}

  async getPulse(): Promise<Pulse> {
    const [
      categories,
      universes,
      stories,
      wikiEntries,
      movies,
      animeEntries,
      shows,
      bookArchive,
      musicActCount,
    ] = await Promise.all([
      this.prisma.universeCategory.findMany({
        where: { isDeleted: false },
      }),
      this.prisma.wikiUniverse.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.story.findMany({
        where: { isDeleted: false, isPublished: true },
        orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
        select: {
          title: true,
          slug: true,
          publishedAt: true,
          updatedAt: true,
          universeId: true,
        },
      }),
      this.prisma.wikiEntry.findMany({
        where: { isDeleted: false },
        orderBy: { updatedAt: 'desc' },
        select: {
          title: true,
          slug: true,
          updatedAt: true,
          universeId: true,
          category: true,
        },
      }),
      /**
       * DİKKAT: film/dizi/anime sorgularının üçü de kendi salonlarının ARŞİV
       * sorgusuyla birebir aynı — süzgeç, `include` ve SIRA dahil.
       *
       * Sıra tesadüf değil zorunluluk: "son eklenenler" şeridi kartların
       * adresini `withSlugs`ten alıyor ve slug listenin tamamına + sırasına
       * bağlı (`used` kümesi birikiyor). Arşivden farklı sıralarsak aynı adı
       * taşıyan iki kayıtta slug kayar ve karttan tıklayan 404 alır.
       *
       * Bu listeler `buildHalls`, `buildRecent` ve `buildAdditions` tarafından
       * PAYLAŞILIYOR — ilk yazımda "sıralaması farklı" diye ikinci bir kopya
       * açılmıştı ve ana sayfa her açılışında film/dizi tablolarını ağır
       * `externalData` JSON'larıyla ikişer kez okuyordu. Sırayı değiştirmen
       * gerekiyorsa `buildAdditions` için ayrı sorgu aç, bunu bozma.
       */
      this.prisma.movieEntry.findMany({
        where: { isDeleted: false },
        orderBy: [{ watchedAt: 'desc' }, { createdAt: 'desc' }],
      }),
      /**
       * DİKKAT: bu sorgu anime salonunun arşiv sorgusuyla (`anime.service.ts`,
       * `getArchive`) BİREBİR aynı — süzgeç, `include` ve sıra dahil. "Son
       * eklenenler" şeridi serilerin adresini `withSlugs`ten alıyor ve slug
       * listenin sırasına bağlı olduğu için ikinci bir sorgu açmak yerine bu
       * liste paylaşılıyor. Sırası değişirse anime kartları yanlış adrese
       * gider; değiştirmen gerekiyorsa `buildAdditions`a ayrı sorgu aç.
       */
      this.prisma.animeEntry.findMany({
        where: { isDeleted: false },
        include: { parts: { orderBy: { orderIndex: 'asc' } } },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.showEntry.findMany({
        where: { isDeleted: false },
        // `seasons` şeridin slug'ı için şart: `toArchiveShow` sezonsuz çalışmaz
        include: { seasons: { orderBy: { orderIndex: 'asc' } } },
        orderBy: [{ watchedAt: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.bookEntry.findMany({
        where: { isDeleted: false },
        orderBy: [{ finishedAt: 'desc' }, { createdAt: 'desc' }],
        include: BOOK_CREDITS_INCLUDE,
        // Kitap salonunun sorgusuyla AYNI kalmak zorunda (üstteki yorum);
        // salon 2026-08-22'de hiç okunmayan externalData'yı taşımayı bıraktı.
        omit: BOOK_ARCHIVE_OMIT,
      }),
      /* Salon 06 · Müzik kapısının ölçüsü. `count` yeterli — kapı yalnızca
         sayıyı gösteriyor, künyeye ihtiyaç yok (kitap salonunda da öyle). */
      this.prisma.musicalAct.count({ where: { isDeleted: false } }),
    ]);

    const universeById = new Map(universes.map((u) => [u.id, u]));
    const storiesByUniverse = new Map<string, typeof stories>();
    for (const story of stories) {
      if (!story.universeId) {
        continue;
      }
      const list = storiesByUniverse.get(story.universeId) ?? [];
      list.push(story);
      storiesByUniverse.set(story.universeId, list);
    }

    return {
      featured: this.buildFeatured(
        universes,
        storiesByUniverse,
        wikiEntries.length > 0 ? wikiEntries : [],
      ),
      halls: this.buildHalls(
        categories,
        universes,
        movies,
        animeEntries,
        shows,
        // Ayrı bir `count` sorgusu vardı; aynı `where` ile bu liste zaten
        // geldiği için ölü kalıyordu
        bookArchive.length,
        musicActCount,
      ),
      recent: this.buildRecent(
        movies,
        animeEntries,
        shows,
        stories,
        universeById,
        universes,
      ),
      additions: this.buildAdditions(
        movies,
        shows,
        animeEntries,
        bookArchive,
      ),
      universes: universes.map((universe) => ({
        slug: universe.slug,
        name: universe.name,
        coverImage: universe.coverImage,
        categorySlug:
          categories.find((c) => c.id === universe.categoryId)?.slug ?? null,
        storyCount: storiesByUniverse.get(universe.id)?.length ?? 0,
      })),
      totals: {
        universes: universes.length,
        chapters: stories.length,
        films: movies.filter((movie) => movie.status !== 'WATCHLIST').length,
        animeEpisodes: animeEntries.reduce(
          (total, entry) =>
            total +
            entry.parts.reduce((sum, part) => sum + part.watchedEpisodes, 0),
          0,
        ),
        wikiEntries: wikiEntries.length,
      },
    };
  }

  /** Baş köşe: Temürkan. Kayıt yoksa bölüm hiç çizilmez (null döner). */
  private buildFeatured(
    universes: Array<{
      id: string;
      slug: string;
      name: string;
      description: string | null;
      coverImage: string | null;
    }>,
    storiesByUniverse: Map<
      string,
      Array<{ title: string; slug: string; publishedAt: Date | null }>
    >,
    wikiEntries: Array<{ universeId: string }>,
  ): PulseFeatured | null {
    const universe = universes.find(
      (item) => item.slug === FEATURED_UNIVERSE_SLUG,
    );
    if (!universe) {
      return null;
    }
    const chapters = storiesByUniverse.get(universe.id) ?? [];
    const latest = chapters[0] ?? null;

    return {
      slug: universe.slug,
      name: universe.name,
      description: universe.description,
      coverImage: universe.coverImage,
      chapterCount: chapters.length,
      entryCount: wikiEntries.filter(
        (entry) => entry.universeId === universe.id,
      ).length,
      latestChapter: latest
        ? {
            title: latest.title,
            slug: latest.slug,
            at: latest.publishedAt ? latest.publishedAt.toISOString() : null,
          }
        : null,
    };
  }

  /**
   * Salon kapıları. Kapının altındaki satır her salonda başka bir şeyi
   * anlatıyor — sayılar burada **çeviri anahtarı + değer** olarak değil hazır
   * metin olarak dönmüyor; frontend kendi diliyle yazsın diye ham veri
   * `count` ve `line` alanlarında taşınıyor (kural 1).
   */
  private buildHalls(
    categories: Array<{
      id: string;
      slug: string;
      name: string;
      description: string | null;
      coverImage: string | null;
    }>,
    universes: Array<{ categoryId: string | null }>,
    movies: Array<{ status: string; watchedAt: Date | null }>,
    animeEntries: Array<{
      status: string;
      externalData: unknown;
      parts: Array<{ watchedEpisodes: number; externalData: unknown }>;
    }>,
    shows: Array<{
      status: string;
      watchedAt: Date | null;
      externalData: unknown;
    }>,
    bookCount: number,
    musicActCount: number,
  ): PulseHall[] {
    return categories.map((category) => {
      const universeCount = universes.filter(
        (universe) => universe.categoryId === category.id,
      ).length;

      /* Arşivi olmayan salonlarda (Spor, Kadim Dünyalar) ölçü evren sayısı:
         o salonların içeriği zaten evrenlerden oluşuyor. Böylece şeritte
         sayısız kapı kalmıyor ama uydurma bir ölçü de yazılmıyor. */
      let count: number | null = universeCount > 0 ? universeCount : null;
      let countUnit: PulseHall['countUnit'] = universeCount > 0 ? 'evren' : null;
      let line: string | null = null;

      if (category.slug === 'film') {
        count = movies.length;
        countUnit = 'film';
        // İkinci sayı "sırada bekleyen" — canlıda denenen "bu yıl" ölçüsü
        // toplamla aynı çıkıyordu (her film eklendiği gün izlenmiş sayılıyor),
        // yani aynı sayıyı iki kez söylüyordu
        line = String(
          movies.filter((movie) => movie.status === 'WATCHLIST').length,
        );
      }

      if (category.slug === 'anime') {
        count = animeEntries.length;
        countUnit = 'seri';
        // Kapının satırı: şu an izlediğim serinin adı
        const watching = animeEntries.find(
          (entry) => entry.status === 'WATCHING',
        );
        const media = (watching?.externalData ?? null) as AnilistMedia | null;
        line = media?.title ?? null;
      }

      if (category.slug === 'dizi') {
        count = shows.length;
        countUnit = 'dizi';
        // Kapının satırı anime salonundakiyle aynı: şu an izlediğim dizi.
        // Dizide "izliyorum" haftalarca sürer, bu yüzden sıradakilerin
        // sayısından daha canlı bir bilgi.
        const watching = shows.find((show) => show.status === 'WATCHING');
        const data = (watching?.externalData ?? null) as TmdbShow | null;
        line = data?.title ?? null;
      }

      /* Kitap salonunun kategori kaydı var ama arşivi ayrı bir tabloda;
         sayı yalnızca `bookEntry.count` ile geliyor (künye gerekmiyor). */
      if (category.slug === 'kitap') {
        count = bookCount;
        countUnit = 'kitap';
      }

      /* Müzik salonu (06) kitapla aynı durumda: kategori kaydı yalnızca kapı
         için var (ad + kapak), içerik `Music*` tablolarında. Ölçü SANATÇI:
         "albüm" daha büyük bir sayı verirdi ama kapının söylediği şey arşivin
         genişliği, derinliği değil — ziyaretçi "48 sanatçı" ile ne bulacağını
         kestirebiliyor, "214 albüm" ile kestiremiyor.
         ⚠️ Evren sayısı KULLANILMAZ: müzik hiç `WikiUniverse` taşımıyor,
         yoksa kapının altında "0 evren" yazardı. */
      if (category.slug === 'muzik') {
        count = musicActCount;
        countUnit = 'sanatci';
      }

      return {
        slug: category.slug,
        name: category.name,
        description: category.description,
        coverImage: category.coverImage,
        universeCount,
        line,
        count,
        countUnit,
      };
    });
  }

  /**
   * "Şu an Nexus'ta": arşivin nabzı. Her türden en yeni bir kayıt alınıp
   * tarihe göre diziliyor — hepsi aynı türden olmasın diye tür başına bir
   * tane.
   */
  private buildRecent(
    movies: Array<{
      tmdbId: number;
      watchedAt: Date | null;
      updatedAt: Date;
      externalData: unknown;
    }>,
    animeEntries: Array<{
      anilistId: number;
      updatedAt: Date;
      externalData: unknown;
      parts: Array<{
        watchedEpisodes: number;
        isCompleted: boolean;
        externalData: unknown;
      }>;
    }>,
    shows: Array<{
      tmdbId: number;
      watchedAt: Date | null;
      updatedAt: Date;
      externalData: unknown;
    }>,
    stories: Array<{
      title: string;
      slug: string;
      publishedAt: Date | null;
      updatedAt: Date;
      universeId: string | null;
    }>,
    universeById: Map<string, { slug: string; name: string }>,
    universes: Array<{ slug: string; name: string; coverImage: string | null }>,
  ): PulseEntry[] {
    const entries: PulseEntry[] = [];

    const lastMovie = movies[0];
    if (lastMovie) {
      const data = (lastMovie.externalData ?? null) as TmdbMovie | null;
      const title = data?.title ?? `#${lastMovie.tmdbId}`;
      entries.push({
        kind: 'FILM',
        title,
        subtitle: data?.director ?? null,
        href: `/dark-stories/category/film/${slugify(title) || `film-${lastMovie.tmdbId}`}`,
        image: data?.posterPath ?? null,
        at: (lastMovie.watchedAt ?? lastMovie.updatedAt).toISOString(),
      });
    }

    const lastShow = shows[0];
    if (lastShow) {
      const data = (lastShow.externalData ?? null) as TmdbShow | null;
      const title = data?.title ?? `#${lastShow.tmdbId}`;
      entries.push({
        kind: 'DIZI',
        title,
        subtitle: data?.director ?? null,
        href: `/dark-stories/category/dizi/${slugify(title) || `dizi-${lastShow.tmdbId}`}`,
        image: data?.posterPath ?? null,
        at: (lastShow.watchedAt ?? lastShow.updatedAt).toISOString(),
      });
    }

    const lastAnime = animeEntries[0];
    if (lastAnime) {
      const media = (lastAnime.externalData ?? null) as AnilistMedia | null;
      const title = media?.title ?? `#${lastAnime.anilistId}`;
      // Alt satır: elde kalan sezon ve kaçıncı bölümde kaldığım
      const current =
        lastAnime.parts.find(
          (part) => !part.isCompleted && part.watchedEpisodes > 0,
        ) ?? lastAnime.parts.find((part) => !part.isCompleted);
      const currentMedia = (current?.externalData ??
        null) as AnilistMedia | null;
      entries.push({
        kind: 'ANIME',
        title,
        subtitle: currentMedia
          ? `${currentMedia.title} · ${current?.watchedEpisodes ?? 0}${
              currentMedia.episodes ? `/${currentMedia.episodes}` : ''
            }`
          : null,
        href: `/dark-stories/category/anime/${slugify(title) || `anime-${lastAnime.anilistId}`}`,
        image: media?.coverImage ?? null,
        at: lastAnime.updatedAt.toISOString(),
      });
    }

    const lastStory = stories[0];
    if (lastStory?.universeId) {
      const universe = universeById.get(lastStory.universeId);
      if (universe) {
        entries.push({
          kind: 'CHAPTER',
          title: lastStory.title,
          subtitle: universe.name,
          href: `/dark-stories/${universe.slug}/${lastStory.slug}`,
          image:
            universes.find((item) => item.slug === universe.slug)?.coverImage ??
            null,
          at: (lastStory.publishedAt ?? lastStory.updatedAt).toISOString(),
        });
      }
    }

    return entries.sort((a, b) => ((a.at ?? '') < (b.at ?? '') ? 1 : -1));
  }

  /**
   * "Son eklenenler": dört arşivin `createdAt` azalan ortak listesi.
   *
   * Adres BURADA türetilmiyor, salonun kendi `withSlugs`i veriyor. Gerekçe:
   * slug sütunda tutulmuyor, başlıktan türetiliyor ve çakışmada yıl/numara
   * ekleniyor — yani bir kaydın adresi listenin TAMAMINA ve SIRASINA bağlı.
   * Aynı liste aynı sırayla okunmazsa aynı adı taşıyan iki kayıtta slug kayar
   * ve ana sayfadan tıklayan okur 404 alır. Kitap kanadındaki
   * `findArchivedBySource` aynı gerekçeyle aynı yolu izliyor; slug mantığının
   * ikinci bir kopyası bu yüzden yazılmıyor.
   *
   * Kayıtlar `withSlugs`ten sırası korunarak (1:1) döndüğü için `createdAt`
   * ham satırdan aynı dizinle okunuyor — `ArchiveAnime`/`ArchiveBook`ta
   * "arşive giriş" alanı yok, film/dizideki `addedAt`in karşılığı orada
   * bulunmuyor.
   */
  private buildAdditions(
    movieRows: MovieEntry[],
    showRows: EntryWithSeasons[],
    animeRows: EntryWithParts[],
    bookRows: BookEntryWithCredits[],
  ): PulseAddition[] {
    const additions: PulseAddition[] = [];

    withMovieSlugs(movieRows).forEach((movie, index) => {
      additions.push({
        kind: 'FILM',
        title: movie.title,
        meta: movie.releaseYear ? String(movie.releaseYear) : null,
        href: `/dark-stories/category/film/${movie.slug}`,
        image: movie.posterPath,
        addedAt: movieRows[index].createdAt.toISOString(),
      });
    });

    withShowSlugs(showRows).forEach((show, index) => {
      additions.push({
        kind: 'DIZI',
        title: show.title,
        meta: show.releaseYear ? String(show.releaseYear) : null,
        href: `/dark-stories/category/dizi/${show.slug}`,
        image: show.posterPath,
        addedAt: showRows[index].createdAt.toISOString(),
      });
    });

    withAnimeSlugs(animeRows).forEach((anime, index) => {
      additions.push({
        kind: 'ANIME',
        title: anime.title,
        meta: anime.startYear ? String(anime.startYear) : null,
        href: `/dark-stories/category/anime/${anime.slug}`,
        image: anime.coverImage,
        addedAt: animeRows[index].createdAt.toISOString(),
      });
    });

    withBookSlugs(bookRows).forEach((book, index) => {
      /* Yazar önce düz metin sütunundan okunuyor: ilişkisel künye (Faz 2a)
         Google/Open Library'den eklenmiş eski kayıtlarda boş olabiliyor. */
      const author =
        book.authors[0] ??
        book.credits.people.find((person) => person.role === 'AUTHOR')?.name ??
        null;
      additions.push({
        kind: 'KITAP',
        title: book.title,
        meta: author,
        href: `/dark-stories/category/kitap/${book.slug}`,
        image: book.coverImage,
        addedAt: bookRows[index].createdAt.toISOString(),
      });
    });

    // ISO tarihler sözlük sırasıyla zaman sırasına eşit; ayrıca ayrıştırmaya
    // gerek yok (`buildRecent` ile aynı karar).
    return additions
      .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1))
      .slice(0, ADDITION_LIMIT);
  }
}
