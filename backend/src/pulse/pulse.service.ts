import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AnilistMedia } from '../anime/anilist.service';
import type { TmdbMovie } from '../movies/tmdb.service';
import type { TmdbShow } from '../shows/tmdb-tv.service';
import { slugify } from '../common/utils/slugify';

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

export interface PulseHall {
  slug: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  /** Salon numarası ana sayfayla aynı sırayı takip eder (frontend hesaplar) */
  universeCount: number;
  /** Kapının altındaki canlı satır; salona göre farklı şeyi anlatır */
  line: string | null;
  /** Sayı rozeti (ör. film sayısı) — yoksa null */
  count: number | null;
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
      this.prisma.movieEntry.findMany({
        where: { isDeleted: false },
        orderBy: [{ watchedAt: 'desc' }, { updatedAt: 'desc' }],
      }),
      this.prisma.animeEntry.findMany({
        where: { isDeleted: false },
        include: { parts: { orderBy: { orderIndex: 'asc' } } },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.showEntry.findMany({
        where: { isDeleted: false },
        orderBy: [{ watchedAt: 'desc' }, { updatedAt: 'desc' }],
      }),
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
      ),
      recent: this.buildRecent(
        movies,
        animeEntries,
        shows,
        stories,
        universeById,
        universes,
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
  ): PulseHall[] {
    return categories.map((category) => {
      const universeCount = universes.filter(
        (universe) => universe.categoryId === category.id,
      ).length;

      let count: number | null = null;
      let line: string | null = null;

      if (category.slug === 'film') {
        count = movies.filter((movie) => movie.status !== 'WATCHLIST').length;
        // İkinci sayı "sırada bekleyen" — canlıda denenen "bu yıl" ölçüsü
        // toplamla aynı çıkıyordu (her film eklendiği gün izlenmiş sayılıyor),
        // yani aynı sayıyı iki kez söylüyordu
        line = String(
          movies.filter((movie) => movie.status === 'WATCHLIST').length,
        );
      }

      if (category.slug === 'anime') {
        count = animeEntries.length;
        // Kapının satırı: şu an izlediğim serinin adı
        const watching = animeEntries.find(
          (entry) => entry.status === 'WATCHING',
        );
        const media = (watching?.externalData ?? null) as AnilistMedia | null;
        line = media?.title ?? null;
      }

      if (category.slug === 'dizi') {
        count = shows.filter((show) => show.status !== 'WATCHLIST').length;
        // Kapının satırı anime salonundakiyle aynı: şu an izlediğim dizi.
        // Dizide "izliyorum" haftalarca sürer, bu yüzden sıradakilerin
        // sayısından daha canlı bir bilgi.
        const watching = shows.find((show) => show.status === 'WATCHING');
        const data = (watching?.externalData ?? null) as TmdbShow | null;
        line = data?.title ?? null;
      }

      return {
        slug: category.slug,
        name: category.name,
        description: category.description,
        coverImage: category.coverImage,
        universeCount,
        line,
        count,
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
}
