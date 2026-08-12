import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '../generated/prisma/client';

/**
 * Müzik salonunun okuma katmanı.
 *
 * **Hiçbir metot Spotify'a çıkmaz.** Sayfalar yalnızca veritabanındaki
 * senkronize kopyadan servis edilir (kullanıcı kararı, plan Bölüm 7). Dış
 * istek atan tek yer `music-sync.service.ts` ve o da cron/admin yolundan
 * çağrılıyor. Sonuç: Spotify düşse de salon eksiksiz açılır (kural 4).
 *
 * Metotlar tasarım ekranlarına birebir karşılık geliyor:
 *   getOverview()      → 2a  Müzik kavşağı  (/muzik)
 *   getGenreRoom(slug) → 2b  Tür odası      (/muzik/tur/:slug)
 *   getAct(slug)       → 2c  Sanatçı sayfası (/muzik/:slug)
 *   getListening(range)→ 2d  Dinleme kaydı  (/muzik/dinleme)
 */

/** 2d'deki dönem seçicisi. Spotify'ın top-items aralıklarıyla aynı üçlü. */
export type ListeningRange = 'FOUR_WEEKS' | 'SIX_MONTHS' | 'ALL_TIME';

const RANGE_DAYS: Record<ListeningRange, number | null> = {
  FOUR_WEEKS: 28,
  SIX_MONTHS: 182,
  ALL_TIME: null,
};

/** 2a favori sanatçı listesi ve 2d çubukları kaç satır taşır. */
const TOP_ARTIST_LIMIT = 12;
/** 2b/2d "son dinlenenler" şeridi. */
const RECENT_LIMIT = 12;
/** 2c "en çok dinlediğim parçalar". */
const TOP_TRACK_LIMIT = 10;

export interface GenreShare {
  slug: string;
  name: string;
  /** `globals.css` içindeki `[data-genre="…"]` anahtarı; hex DEĞİL */
  accentKey: string | null;
  /** Tam sayıya yuvarlanmış yüzde */
  percent: number;
}

@Injectable()
export class MusicService {
  constructor(private readonly prisma: PrismaService) {}

  /* ── 2a · Müzik kavşağı ──────────────────────────────────────────────── */

  async getOverview() {
    const [actCount, albumCount, trackCount, playlistCount, lastSync] =
      await Promise.all([
        this.prisma.musicalAct.count({ where: { isDeleted: false } }),
        this.prisma.musicAlbum.count({ where: { isDeleted: false } }),
        this.prisma.musicTrack.count({ where: { isDeleted: false } }),
        this.prisma.musicPlaylist.count({ where: { isDeleted: false } }),
        this.prisma.musicSyncState.findFirst({
          where: { status: 'OK' },
          orderBy: { lastRunAt: 'desc' },
          select: { lastRunAt: true },
        }),
      ]);

    const [playlists, acts, rooms, recent] = await Promise.all([
      this.getFavoritePlaylists(),
      this.getTopActs('ALL_TIME', TOP_ARTIST_LIMIT),
      this.getGenreRooms(),
      this.getRecentPlays(1),
    ]);

    return {
      counts: {
        acts: actCount,
        albums: albumCount,
        tracks: trackCount,
        playlists: playlistCount,
      },
      lastSyncedAt: lastSync?.lastRunAt ?? null,
      playlists,
      acts,
      rooms,
      /**
       * Salonun alt şeridi. Tasarım (2a) burada "şu an çalan" gösteriyor ama
       * o veri Faz 5'e ait (Authorization Code + refresh token). Faz 1'de
       * dürüst karşılığı **en son dinlenen** kayıt: gerçek veri, gerçek
       * etiket. Canlı çalıyormuş gibi bir eşitleyici animasyonu göstermek
       * ziyaretçiye yanlış bir şey söylerdi.
       */
      lastPlay: recent[0] ?? null,
    };
  }

  /**
   * Favori çalma listeleri ve **tür karışımı**.
   *
   * Yüzde sütunda SAKLANMIYOR, burada türetiliyor: parça → albüm → act → tür
   * zinciri zaten şemada var. Sütuna yazmak, bir tür onayı değiştiğinde
   * (`MusicGenre.isApproved`) sessizce yanlış kalacak ikinci bir gerçek
   * üretirdi.
   *
   * Yalnızca ONAYLI türler sayılır; onay bekleyen ("album rock", "post-grunge"
   * gibi Spotify varyantları) çubuğu anlamsız kılardı.
   */
  private async getFavoritePlaylists() {
    const playlists = await this.prisma.musicPlaylist.findMany({
      where: { isDeleted: false },
      orderBy: [{ isFavorite: 'desc' }, { orderIndex: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        artwork: true,
        trackCount: true,
        durationMs: true,
        isFavorite: true,
        tracks: {
          select: {
            track: {
              select: {
                album: {
                  select: {
                    act: {
                      select: {
                        genres: {
                          where: { genre: { isApproved: true } },
                          select: {
                            genre: {
                              select: {
                                slug: true,
                                name: true,
                                accentKey: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return playlists.map((playlist) => {
      const tally = new Map<
        string,
        { name: string; accentKey: string | null; count: number }
      >();
      let total = 0;
      for (const entry of playlist.tracks) {
        // Bir parça birden çok türe bağlı act'e ait olabilir; her tür payını
        // alır ve toplam da o kadar artar — yüzdeler yine 100'e tamamlanır
        for (const link of entry.track.album.act.genres) {
          const genre = link.genre;
          const current = tally.get(genre.slug);
          if (current) {
            current.count += 1;
          } else {
            tally.set(genre.slug, {
              name: genre.name,
              accentKey: genre.accentKey,
              count: 1,
            });
          }
          total += 1;
        }
      }

      const genreMix: GenreShare[] =
        total === 0
          ? []
          : [...tally.entries()]
              .map(([slug, value]) => ({
                slug,
                name: value.name,
                accentKey: value.accentKey,
                percent: Math.round((value.count / total) * 100),
              }))
              .sort((a, b) => b.percent - a.percent);

      return {
        id: playlist.id,
        slug: playlist.slug,
        name: playlist.name,
        description: playlist.description,
        artwork: playlist.artwork,
        trackCount: playlist.trackCount ?? playlist.tracks.length,
        durationMs: playlist.durationMs,
        isFavorite: playlist.isFavorite,
        genreMix,
      };
    });
  }

  /** Onaylı tür odaları — salon üst gezinmesi ve 2a'daki "YOL 01" kartı. */
  async getGenreRooms() {
    const genres = await this.prisma.musicGenre.findMany({
      where: { isApproved: true, parentId: null },
      orderBy: { name: 'asc' },
      select: {
        slug: true,
        name: true,
        key: true,
        accentKey: true,
        _count: { select: { acts: true } },
      },
    });
    return genres.map((genre) => ({
      slug: genre.slug,
      name: genre.name,
      key: genre.key,
      accentKey: genre.accentKey,
      actCount: genre._count.acts,
    }));
  }

  /* ── 2b · Tür odası ──────────────────────────────────────────────────── */

  async getGenreRoom(slug: string) {
    const genre = await this.prisma.musicGenre.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        key: true,
        accentKey: true,
        isApproved: true,
        children: {
          where: { isApproved: true },
          select: { slug: true, name: true, accentKey: true },
        },
      },
    });
    // Onay bekleyen tür odası açılmaz: süzgeçte görünmeyen bir türün kendi
    // sayfası olması, onay kapısını adres üstünden delmek olurdu
    if (!genre || !genre.isApproved) {
      throw new NotFoundException('MUSIC.GENRE_NOT_FOUND');
    }

    const acts = await this.prisma.musicalAct.findMany({
      where: {
        isDeleted: false,
        genres: { some: { genreId: genre.id } },
      },
      // ⚠️ `popularity` İLE SIRALANMIYOR: bu uygulamanın gördüğü Spotify
      // sanatçı nesnesi o alanı HİÇ vermiyor (11 Ağustos 2026'da ölçüldü,
      // bkz. `spotify.service.ts` başlığı) — yani alan her zaman null ve
      // onunla sıralamak "sıralamıyorum" demenin süslü hâliydi.
      // Albüm sayısı gerçek bir ölçü: arşivde daha çok yeri olan act önce.
      orderBy: [{ albums: { _count: 'desc' } }, { sortName: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        image: true,
        actKind: true,
        formedYear: true,
        genres: {
          where: { genre: { isApproved: true } },
          select: { genre: { select: { slug: true, name: true } } },
        },
        _count: { select: { albums: true } },
      },
    });

    const actIds = acts.map((act) => act.id);
    const [albums, trackCount, plays] = await Promise.all([
      this.prisma.musicAlbum.findMany({
        where: {
          isDeleted: false,
          actId: { in: actIds },
          // Single ve derleme albüm ızgarasını dolduruyordu; oda yalnızca
          // albüm ve EP gösteriyor (tasarım 2b "ALBÜMLER")
          albumType: { in: ['ALBUM', 'EP'] },
        },
        orderBy: [{ releaseDate: 'desc' }, { title: 'asc' }],
        select: {
          slug: true,
          title: true,
          artwork: true,
          releaseDate: true,
          releaseDatePrecision: true,
          albumType: true,
          act: { select: { slug: true, name: true } },
        },
      }),
      this.prisma.musicTrack.count({
        where: { isDeleted: false, album: { actId: { in: actIds } } },
      }),
      this.getRecentPlays(RECENT_LIMIT, actIds),
    ]);

    const playCounts = await this.getPlayCountsForActs(actIds, 'ALL_TIME');

    /**
     * Odanın çalma listeleri — küratörün bu odaya bağladıkları.
     *
     * ⚠️ İçerikten TÜRETİLMİYOR: liste hangi odada görünecekse
     * `MusicPlaylist.genreId` onu söylüyor ve kararı küratör veriyor
     * (gerekçe şemada). Parçaların türlerinden çoğunluk hesaplasaydık
     * "yarısı rock yarısı pop" bir listede sonuç keyfî olurdu.
     */
    const playlists = await this.prisma.musicPlaylist.findMany({
      where: { isDeleted: false, genreId: genre.id },
      orderBy: [{ isFavorite: 'desc' }, { orderIndex: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        artwork: true,
        trackCount: true,
        durationMs: true,
        _count: { select: { tracks: true } },
      },
    });

    return {
      genre: {
        slug: genre.slug,
        name: genre.name,
        key: genre.key,
        accentKey: genre.accentKey,
        subgenres: genre.children,
      },
      playlists: playlists.map((playlist) => ({
        id: playlist.id,
        slug: playlist.slug,
        name: playlist.name,
        description: playlist.description,
        artwork: playlist.artwork,
        // Sütun Spotify künyesi için; elle kurulan listede parça sayımı gerçek
        trackCount: playlist.trackCount ?? playlist._count.tracks,
        durationMs: playlist.durationMs,
      })),
      counts: {
        acts: acts.length,
        albums: albums.length,
        tracks: trackCount,
      },
      acts: acts.map((act) => ({
        slug: act.slug,
        name: act.name,
        image: act.image,
        actKind: act.actKind,
        formedYear: act.formedYear,
        albumCount: act._count.albums,
        genres: act.genres.map((link) => link.genre),
        playCount: playCounts.get(normalizeName(act.name)) ?? 0,
      })),
      albums,
      recentPlays: plays,
    };
  }

  /* ── 2c · Sanatçı sayfası ────────────────────────────────────────────── */

  async getAct(slug: string) {
    const act = await this.prisma.musicalAct.findFirst({
      where: { slug, isDeleted: false },
      select: {
        id: true,
        slug: true,
        name: true,
        actKind: true,
        bio: true,
        image: true,
        bannerImage: true,
        formedYear: true,
        disbandedYear: true,
        originCity: true,
        originCountry: true,
        bannerPosition: true,
        popularity: true,
        followers: true,
        spotifyId: true,
        genres: {
          where: { genre: { isApproved: true } },
          orderBy: { genre: { name: 'asc' } },
          select: {
            genre: {
              select: { slug: true, name: true, accentKey: true },
            },
          },
        },
        eras: {
          where: { isDeleted: false },
          orderBy: { orderIndex: 'asc' },
          select: {
            slug: true,
            name: true,
            startedAt: true,
            endedAt: true,
            description: true,
          },
        },
        memberships: {
          orderBy: { orderIndex: 'asc' },
          select: {
            isCurrent: true,
            startedAt: true,
            endedAt: true,
            person: { select: { slug: true, name: true, photo: true } },
            role: { select: { key: true, slug: true } },
          },
        },
      },
    });
    if (!act) {
      throw new NotFoundException('MUSIC.ACT_NOT_FOUND');
    }

    const albums = await this.prisma.musicAlbum.findMany({
      where: { actId: act.id, isDeleted: false },
      orderBy: [{ releaseDate: 'asc' }, { title: 'asc' }],
      select: {
        slug: true,
        title: true,
        artwork: true,
        albumType: true,
        releaseDate: true,
        releaseDatePrecision: true,
        totalTracks: true,
        spotifyId: true,
        era: { select: { slug: true, name: true } },
      },
    });

    const [topTracks, playCount, roomMates] = await Promise.all([
      this.getTopTracksForAct(act.id, act.name),
      this.getPlayCountsForActs([act.id], 'ALL_TIME'),
      this.getRoomMates(act.id),
    ]);

    return {
      ...act,
      genres: act.genres.map((link) => link.genre),
      albums: albums.filter(
        (album) => album.albumType === 'ALBUM' || album.albumType === 'EP',
      ),
      singles: albums.filter((album) => album.albumType === 'SINGLE'),
      topTracks,
      playCount: playCount.get(normalizeName(act.name)) ?? 0,
      roomMates,
    };
  }

  /**
   * "En çok dinlediğim parçalar" (2c).
   *
   * Ölçü `MusicPlay`ten geliyor. Dinleme kaydı henüz aktarılmamışsa liste boş
   * kalmaz: albüm/parça sırasına düşer. Boş bir bölüm çizmek, ziyaretçiye
   * "burada bir şey yok" demek olurdu; oysa parçalar var, yalnızca sıralama
   * ölçüsü yok.
   */
  private async getTopTracksForAct(actId: string, actName: string) {
    const grouped = await this.prisma.musicPlay.groupBy({
      by: ['trackId'],
      where: {
        trackId: { not: null },
        track: { album: { actId } },
      },
      _count: { _all: true },
      orderBy: { _count: { trackId: 'desc' } },
      take: TOP_TRACK_LIMIT,
    });

    if (grouped.length > 0) {
      const ids = grouped
        .map((row) => row.trackId)
        .filter((id): id is string => Boolean(id));
      const tracks = await this.prisma.musicTrack.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          slug: true,
          title: true,
          durationMs: true,
          spotifyId: true,
          album: { select: { slug: true, title: true, artwork: true } },
        },
      });
      const byId = new Map(tracks.map((track) => [track.id, track]));
      return grouped
        .map((row) => {
          const track = row.trackId ? byId.get(row.trackId) : undefined;
          return track
            ? { ...track, playCount: row._count._all, measured: true }
            : null;
        })
        .filter((row): row is NonNullable<typeof row> => row !== null);
    }

    // Dinleme kaydı yok — albüm sırasına düş
    const fallback = await this.prisma.musicTrack.findMany({
      where: { isDeleted: false, album: { actId } },
      orderBy: [
        { album: { releaseDate: 'asc' } },
        { discNumber: 'asc' },
        { trackNumber: 'asc' },
      ],
      take: TOP_TRACK_LIMIT,
      select: {
        id: true,
        slug: true,
        title: true,
        durationMs: true,
        spotifyId: true,
        album: { select: { slug: true, title: true, artwork: true } },
      },
    });
    void actName;
    return fallback.map((track) => ({
      ...track,
      playCount: 0,
      /** Ön yüz bunu okuyup "dinlemeye göre" etiketini gizliyor */
      measured: false,
    }));
  }

  /** "Aynı odadan" (2c): act'in türlerini paylaşan diğer act'ler. */
  private async getRoomMates(actId: string) {
    const genreLinks = await this.prisma.musicGenreOnAct.findMany({
      where: { actId, genre: { isApproved: true } },
      select: { genreId: true },
    });
    if (genreLinks.length === 0) {
      return [];
    }
    return this.prisma.musicalAct.findMany({
      where: {
        isDeleted: false,
        id: { not: actId },
        genres: { some: { genreId: { in: genreLinks.map((l) => l.genreId) } } },
      },
      // ⚠️ `popularity` İLE SIRALANMIYOR: bu uygulamanın gördüğü Spotify
      // sanatçı nesnesi o alanı HİÇ vermiyor (11 Ağustos 2026'da ölçüldü,
      // bkz. `spotify.service.ts` başlığı) — yani alan her zaman null ve
      // onunla sıralamak "sıralamıyorum" demenin süslü hâliydi.
      // Albüm sayısı gerçek bir ölçü: arşivde daha çok yeri olan act önce.
      orderBy: [{ albums: { _count: 'desc' } }, { sortName: 'asc' }],
      take: 8,
      select: { slug: true, name: true, image: true },
    });
  }

  /* ── Sanatçı dizini ──────────────────────────────────────────────────── */

  /**
   * Arşivdeki bütün sanatçılar — `/muzik/sanatcilar`.
   *
   * ⚠️ Bu dizin OLMADAN yeni eklenen bir sanatçıya ulaşmanın yolu yoktu:
   * salondaki "YOL 02 · Sanatçı sayfaları" kartı `overview.acts[0]`e, yani
   * **her zaman aynı sanatçıya** gidiyordu. Arşivde tek sanatçı varken
   * (Linkin Park) fark edilmiyordu; ikincisi eklendiğinde kart yine birinciyi
   * açardı ve ikinci sanatçı yalnızca tür odasından bulunabilirdi.
   *
   * Sıralama albüm sayısına göre — `popularity` her zaman null (Spotify o
   * alanı bu uygulamaya vermiyor, 11 Ağustos ölçümü), onunla sıralamak
   * "sıralamıyorum" demenin süslü hâli olurdu.
   */
  async getActs() {
    const acts = await this.prisma.musicalAct.findMany({
      where: { isDeleted: false },
      orderBy: [{ albums: { _count: 'desc' } }, { sortName: 'asc' }],
      select: {
        slug: true,
        name: true,
        image: true,
        actKind: true,
        formedYear: true,
        disbandedYear: true,
        originCountry: true,
        _count: { select: { albums: true } },
        genres: {
          where: { genre: { isApproved: true } },
          orderBy: { genre: { name: 'asc' } },
          select: {
            genre: { select: { slug: true, name: true, accentKey: true } },
          },
        },
      },
    });

    return acts.map((act) => ({
      slug: act.slug,
      name: act.name,
      image: act.image,
      actKind: act.actKind,
      formedYear: act.formedYear,
      disbandedYear: act.disbandedYear,
      originCountry: act.originCountry,
      albumCount: act._count.albums,
      genres: act.genres.map((link) => link.genre),
    }));
  }

  /* ── Albüm sayfası ───────────────────────────────────────────────────── */

  /**
   * Tek albüm — `/muzik/:actSlug/:albumSlug`.
   *
   * Sanatçı sayfasındaki diskografi ızgarası bu adrese bağlıydı ama **rota
   * yoktu**: her kapak tıklaması 404'e gidiyordu (kullanıcı bildirimi).
   *
   * Albüm act slug'ıyla BİRLİKTE aranıyor. `albumSlug` zaten tekil, yani act
   * olmadan da bulunurdu; birlikte aramanın sebebi başka bir sanatçının
   * albümünü onun adresi altında göstermemek — `/muzik/adele/meteora` 404
   * vermeli, Meteora'yı değil.
   */
  async getAlbum(actSlug: string, albumSlug: string) {
    const album = await this.prisma.musicAlbum.findFirst({
      where: {
        slug: albumSlug,
        isDeleted: false,
        act: { slug: actSlug, isDeleted: false },
      },
      select: {
        id: true,
        actId: true,
        slug: true,
        title: true,
        originalTitle: true,
        albumType: true,
        releaseDate: true,
        releaseDatePrecision: true,
        totalTracks: true,
        label: true,
        artwork: true,
        spotifyId: true,
        era: { select: { slug: true, name: true } },
        act: {
          select: {
            slug: true,
            name: true,
            image: true,
            genres: {
              where: { genre: { isApproved: true } },
              orderBy: { genre: { name: 'asc' } },
              select: {
                genre: { select: { slug: true, name: true, accentKey: true } },
              },
            },
          },
        },
        tracks: {
          where: { isDeleted: false },
          orderBy: [{ discNumber: 'asc' }, { trackNumber: 'asc' }],
          select: {
            id: true,
            slug: true,
            title: true,
            discNumber: true,
            trackNumber: true,
            durationMs: true,
            isExplicit: true,
            spotifyId: true,
          },
        },
      },
    });
    if (!album) {
      throw new NotFoundException('MUSIC.ALBUM_NOT_FOUND');
    }

    /**
     * Parça başına dinleme sayısı. Kayıt aktarılmamışsa hepsi 0 döner ve ön
     * yüz sütunu hiç çizmez — sıfır dolu bir sütun "hiç dinlemedim" değil
     * "ölçüm yok" demek olurdu ve ikisi aynı şey değil.
     */
    const plays = await this.prisma.musicPlay.groupBy({
      by: ['trackId'],
      where: { trackId: { in: album.tracks.map((track) => track.id) } },
      _count: { _all: true },
    });
    const playByTrack = new Map(
      plays.map((row) => [row.trackId, row._count._all]),
    );

    /* Aynı sanatçının diğer albümleri — albümden albüme geçiş için */
    const otherAlbums = await this.prisma.musicAlbum.findMany({
      where: { actId: album.actId, isDeleted: false, id: { not: album.id } },
      orderBy: [{ releaseDate: 'asc' }, { title: 'asc' }],
      take: 12,
      select: {
        slug: true,
        title: true,
        artwork: true,
        releaseDate: true,
        albumType: true,
      },
    });

    return {
      ...album,
      act: {
        ...album.act,
        genres: album.act.genres.map((link) => link.genre),
      },
      tracks: album.tracks.map((track) => ({
        ...track,
        playCount: playByTrack.get(track.id) ?? 0,
      })),
      /** Ölçüm gerçek mi — hiç dinleme yoksa ön yüz sütunu gizliyor */
      measured: plays.length > 0,
      otherAlbums,
    };
  }

  /* ── Çalma listeleri ─────────────────────────────────────────────────── */

  /**
   * Bütün çalma listeleri — `/muzik/listeler`.
   *
   * Favori şeridiyle aynı hesabı kullanıyor (tür karışımı dahil); fark, orada
   * salonun kavşağına yalnızca bir şerit sığması. Burada hepsi var.
   */
  async getPlaylists() {
    return this.getFavoritePlaylists();
  }

  /**
   * Tek liste ve parçaları — `/muzik/liste/:slug`.
   *
   * ⚠️ `spotifyId` null olan listeler **bizim listelerimiz**: küratör elle
   * kurdu, Spotify'dan gelmedi. Sync onlara asla dokunmuyor (eşleşecek
   * `spotifyId` yok) — kişisel katmanın sync'ten ayrı tutulması kuralı burada
   * şemadan bedavaya geliyor, ayrı bir tabloya gerek kalmadı.
   */
  async getPlaylist(slug: string) {
    const playlist = await this.prisma.musicPlaylist.findFirst({
      where: { slug, isDeleted: false },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        artwork: true,
        trackCount: true,
        durationMs: true,
        isFavorite: true,
        spotifyId: true,
        genre: { select: { id: true, slug: true, name: true } },
        tracks: {
          orderBy: { position: 'asc' },
          select: {
            position: true,
            addedAt: true,
            track: {
              select: {
                id: true,
                slug: true,
                title: true,
                durationMs: true,
                spotifyId: true,
                album: {
                  select: {
                    slug: true,
                    title: true,
                    artwork: true,
                    act: { select: { slug: true, name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!playlist) {
      throw new NotFoundException('MUSIC.PLAYLIST_NOT_FOUND');
    }

    /**
     * Süre listenin kendi sütunundan DEĞİL parçalardan toplanıyor: elle
     * kurulan listede `durationMs` sütunu boş (onu Spotify dolduruyordu) ve
     * künyede boş bir süre görünürdü. Sütun doluysa o kazanıyor — Spotify'dan
     * gelen listede parçaların bir kısmı arşivde olmayabilir ve toplam eksik
     * çıkardı.
     */
    const summed = playlist.tracks.reduce(
      (total, entry) => total + (entry.track.durationMs ?? 0),
      0,
    );

    return {
      ...playlist,
      /** Bizim listemiz mi, Spotify'dan mı geldi — ön yüz rozeti buna bakıyor */
      isLocal: playlist.spotifyId === null,
      trackCount: playlist.trackCount ?? playlist.tracks.length,
      durationMs: playlist.durationMs ?? (summed > 0 ? summed : null),
      tracks: playlist.tracks.map((entry) => ({
        position: entry.position,
        addedAt: entry.addedAt,
        ...entry.track,
      })),
    };
  }

  /* ── 2d · Dinleme kaydı ──────────────────────────────────────────────── */

  async getListening(range: ListeningRange) {
    const where = this.rangeFilter(range);

    const [totals, distinctArtists, topActs, recent, playlists] =
      await Promise.all([
        this.prisma.musicPlay.aggregate({
          where,
          _count: { _all: true },
          _sum: { msPlayed: true },
        }),
        this.prisma.musicPlay.groupBy({
          by: ['artistName'],
          where: { ...where, artistName: { not: null } },
          _count: { _all: true },
        }),
        this.getTopActs(range, TOP_ARTIST_LIMIT),
        this.getRecentPlays(RECENT_LIMIT),
        this.prisma.musicPlaylist.findMany({
          where: { isDeleted: false },
          orderBy: [{ isFavorite: 'desc' }, { orderIndex: 'asc' }],
          select: {
            slug: true,
            name: true,
            artwork: true,
            trackCount: true,
            durationMs: true,
          },
        }),
      ]);

    const [genreShare, busiestDay] = await Promise.all([
      this.getGenreShare(range),
      this.getBusiestDay(range),
    ]);

    return {
      range,
      totals: {
        plays: totals._count._all,
        msPlayed: totals._sum.msPlayed ?? 0,
        distinctArtists: distinctArtists.length,
      },
      busiestDay,
      topActs,
      genreShare,
      recentPlays: recent,
      playlists,
      /**
       * Ölçüm var mı? Ön yüz bunu okuyup "dinleme kaydı henüz aktarılmadı"
       * durumunu çiziyor. Sıfır dinlemeyi boş bir grafik olarak göstermek,
       * STATE.md'deki bilinen tuzağın (bulgu Ö-8) tekrarı olurdu: sessiz boş
       * yanıt gerçek boşlukla karışıyor.
       */
      hasData: totals._count._all > 0,
    };
  }

  /**
   * "En çok dinlenen sanatçılar".
   *
   * ⚠️ Ölçü `MusicPlay.artistName` (düz metin) üzerinden, `trackId` üzerinden
   * DEĞİL. Sebep ölçülebilir: dinlediğim her parça arşivde olmak zorunda
   * değil, ama içe aktarılan her satırda sanatçı adı var. `trackId` ile
   * saymak, arşive girmemiş sanatçıları listeden tamamen düşürürdü.
   *
   * Ad, arşivdeki act'e eşleşirse sayfa bağlantısı da eklenir; eşleşmezse
   * satır yine görünür (bağlantısız).
   */
  private async getTopActs(range: ListeningRange, limit: number) {
    const grouped = await this.prisma.musicPlay.groupBy({
      by: ['artistName'],
      where: { ...this.rangeFilter(range), artistName: { not: null } },
      _count: { _all: true },
      _sum: { msPlayed: true },
      orderBy: { _count: { artistName: 'desc' } },
      take: limit,
    });

    if (grouped.length === 0) {
      // Dinleme kaydı yok: popülerliğe göre act listesi (2a boş kalmasın)
      const acts = await this.prisma.musicalAct.findMany({
        where: { isDeleted: false },
        // ⚠️ `popularity` İLE SIRALANMIYOR: bu uygulamanın gördüğü Spotify
        // sanatçı nesnesi o alanı HİÇ vermiyor (11 Ağustos 2026'da ölçüldü,
        // bkz. `spotify.service.ts` başlığı) — yani alan her zaman null ve
        // onunla sıralamak "sıralamıyorum" demenin süslü hâliydi.
        // Albüm sayısı gerçek bir ölçü: arşivde daha çok yeri olan act önce.
        orderBy: [{ albums: { _count: 'desc' } }, { sortName: 'asc' }],
        take: limit,
        select: {
          slug: true,
          name: true,
          image: true,
          genres: {
            where: { genre: { isApproved: true } },
            take: 1,
            select: { genre: { select: { name: true, accentKey: true } } },
          },
        },
      });
      return acts.map((act) => ({
        name: act.name,
        slug: act.slug,
        image: act.image,
        genreName: act.genres[0]?.genre.name ?? null,
        accentKey: act.genres[0]?.genre.accentKey ?? null,
        playCount: 0,
        msPlayed: 0,
        measured: false,
      }));
    }

    const names = grouped
      .map((row) => row.artistName)
      .filter((name): name is string => Boolean(name));
    const acts = await this.prisma.musicalAct.findMany({
      where: { isDeleted: false, name: { in: names, mode: 'insensitive' } },
      select: {
        slug: true,
        name: true,
        image: true,
        genres: {
          where: { genre: { isApproved: true } },
          take: 1,
          select: { genre: { select: { name: true, accentKey: true } } },
        },
      },
    });
    const byName = new Map(acts.map((act) => [normalizeName(act.name), act]));

    return grouped.map((row) => {
      const name = row.artistName ?? '';
      const act = byName.get(normalizeName(name));
      return {
        name,
        slug: act?.slug ?? null,
        image: act?.image ?? null,
        genreName: act?.genres[0]?.genre.name ?? null,
        accentKey: act?.genres[0]?.genre.accentKey ?? null,
        playCount: row._count._all,
        msPlayed: row._sum.msPlayed ?? 0,
        measured: true,
      };
    });
  }

  /**
   * "Odaların payı" (2d).
   *
   * Dinlemeler sanatçı adı üzerinden act'e, act üzerinden onaylı türe
   * bağlanıyor. Arşivde karşılığı olmayan sanatçıların dinlemesi hiçbir odaya
   * yazılmıyor ve yüzde hesabına da girmiyor — "%23 diğer" gibi anlamsız bir
   * dilim üretmemek için.
   */
  private async getGenreShare(range: ListeningRange): Promise<GenreShare[]> {
    const grouped = await this.prisma.musicPlay.groupBy({
      by: ['artistName'],
      where: { ...this.rangeFilter(range), artistName: { not: null } },
      _count: { _all: true },
    });
    if (grouped.length === 0) {
      return [];
    }

    const names = grouped
      .map((row) => row.artistName)
      .filter((name): name is string => Boolean(name));
    const acts = await this.prisma.musicalAct.findMany({
      where: { isDeleted: false, name: { in: names, mode: 'insensitive' } },
      select: {
        name: true,
        genres: {
          where: { genre: { isApproved: true } },
          select: {
            genre: { select: { slug: true, name: true, accentKey: true } },
          },
        },
      },
    });
    const byName = new Map(acts.map((act) => [normalizeName(act.name), act]));

    const tally = new Map<
      string,
      { name: string; accentKey: string | null; count: number }
    >();
    let total = 0;
    for (const row of grouped) {
      const act = byName.get(normalizeName(row.artistName ?? ''));
      if (!act) {
        continue;
      }
      for (const link of act.genres) {
        const genre = link.genre;
        const current = tally.get(genre.slug);
        if (current) {
          current.count += row._count._all;
        } else {
          tally.set(genre.slug, {
            name: genre.name,
            accentKey: genre.accentKey,
            count: row._count._all,
          });
        }
        total += row._count._all;
      }
    }
    if (total === 0) {
      return [];
    }

    return [...tally.entries()]
      .map(([slug, value]) => ({
        slug,
        name: value.name,
        accentKey: value.accentKey,
        percent: Math.round((value.count / total) * 100),
      }))
      .sort((a, b) => b.percent - a.percent);
  }

  /**
   * "En yoğun gün" (2d).
   *
   * Haftanın günü SQL tarafında hesaplanıyor: satırları Node'a çekip gruplamak
   * onbinlerce kaydı belleğe almak demekti. `EXTRACT(DOW …)` PostgreSQL'de
   * 0=Pazar. Gün ADI burada üretilmiyor — sayı döndürülüyor ve çeviri ön yüzde
   * (`messages/*.json`) yapılıyor (kural 1).
   */
  private async getBusiestDay(
    range: ListeningRange,
  ): Promise<{ dayOfWeek: number; plays: number } | null> {
    const days = RANGE_DAYS[range];
    const rows =
      days === null
        ? await this.prisma.$queryRaw<Array<{ dow: number; plays: bigint }>>`
            SELECT EXTRACT(DOW FROM "playedAt")::int AS dow, COUNT(*) AS plays
            FROM "MusicPlay"
            GROUP BY dow
            ORDER BY plays DESC
            LIMIT 1
          `
        : await this.prisma.$queryRaw<Array<{ dow: number; plays: bigint }>>`
            SELECT EXTRACT(DOW FROM "playedAt")::int AS dow, COUNT(*) AS plays
            FROM "MusicPlay"
            WHERE "playedAt" >= NOW() - (${days} || ' days')::interval
            GROUP BY dow
            ORDER BY plays DESC
            LIMIT 1
          `;
    const row = rows[0];
    if (!row) {
      return null;
    }
    return { dayOfWeek: row.dow, plays: Number(row.plays) };
  }

  /** "Son dinlenenler" şeridi; oda sayfasında act süzgeciyle. */
  private async getRecentPlays(limit: number, actIds?: string[]) {
    const where: Prisma.MusicPlayWhereInput = actIds
      ? { trackId: { not: null }, track: { album: { actId: { in: actIds } } } }
      : {};
    const plays = await this.prisma.musicPlay.findMany({
      where,
      orderBy: { playedAt: 'desc' },
      take: limit,
      select: {
        playedAt: true,
        trackName: true,
        artistName: true,
        albumName: true,
        track: {
          select: {
            slug: true,
            spotifyId: true,
            album: {
              select: {
                slug: true,
                artwork: true,
                act: { select: { slug: true } },
              },
            },
          },
        },
      },
    });
    return plays;
  }

  /** Act adlarına göre dinleme sayısı — 2b/2c'deki "DİNLEME" sayacı. */
  private async getPlayCountsForActs(
    actIds: string[],
    range: ListeningRange,
  ): Promise<Map<string, number>> {
    const result = new Map<string, number>();
    if (actIds.length === 0) {
      return result;
    }
    const acts = await this.prisma.musicalAct.findMany({
      where: { id: { in: actIds } },
      select: { name: true },
    });
    const names = acts.map((act) => act.name);
    if (names.length === 0) {
      return result;
    }
    const grouped = await this.prisma.musicPlay.groupBy({
      by: ['artistName'],
      where: {
        ...this.rangeFilter(range),
        artistName: { in: names, mode: 'insensitive' },
      },
      _count: { _all: true },
    });
    for (const row of grouped) {
      if (!row.artistName) {
        continue;
      }
      result.set(normalizeName(row.artistName), row._count._all);
    }
    return result;
  }

  private rangeFilter(range: ListeningRange): Prisma.MusicPlayWhereInput {
    const days = RANGE_DAYS[range];
    if (days === null) {
      return {};
    }
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return { playedAt: { gte: since } };
  }
}

/**
 * Ad karşılaştırma anahtarı.
 *
 * Dinleme kaydındaki sanatçı adı ile arşivdeki act adı birebir aynı olmak
 * zorunda değil ("Tiësto" / "Tiesto", boşluk farkları). Türkçe yerelinde
 * küçük harfe indirmek şart: `toLowerCase()` "I" harfini "i" yapar ama
 * Türkçede "ı" olması gerekir.
 */
function normalizeName(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ');
}
