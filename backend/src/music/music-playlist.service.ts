import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';

/**
 * Küratörün kendi kurduğu çalma listeleri.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * NEDEN AYRI BİR SERVİS VE NEDEN MİGRATION GEREKMEDİ
 *
 * `MusicPlaylist.spotifyId` şemada **nullable ve unique**. Yani kimliksiz bir
 * satır tamamen geçerli ve `MusicSyncService` ona asla dokunamıyor: sync
 * listeleri `where: { spotifyId }` ile buluyor, null olan hiçbir aramaya
 * düşmüyor. Kişisel katmanın senkronizasyondan ayrı tutulması kuralı burada
 * şemadan bedavaya geliyor — ayrı bir tabloya da migration'a da gerek yok.
 *
 * ⚠️ Bu servis `MusicSyncService`in yazdığı alanlara (artwork, trackCount,
 * durationMs, externalData) DOKUNMUYOR. Spotify'dan gelen bir listenin adını
 * buradan değiştirmek serbest ama bir sonraki tazelemede geri gelir; o yüzden
 * `rename` yalnızca yerel listelerde tam anlamıyla kalıcı.
 * ══════════════════════════════════════════════════════════════════════════
 */

/** Bir listeye sığdırılan üst sınır. Kuyruk çalarken de bu kadar parça yükleniyor. */
const MAX_TRACKS = 1000;

@Injectable()
export class MusicPlaylistService {
  constructor(private readonly prisma: PrismaService) {}

  /** Küratör panelinin liste kutusu — parça sayısıyla birlikte. */
  async list() {
    const playlists = await this.prisma.musicPlaylist.findMany({
      where: { isDeleted: false },
      orderBy: [{ isFavorite: 'desc' }, { orderIndex: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        isFavorite: true,
        orderIndex: true,
        spotifyId: true,
        _count: { select: { tracks: true } },
      },
    });
    return playlists.map((playlist) => ({
      id: playlist.id,
      slug: playlist.slug,
      name: playlist.name,
      description: playlist.description,
      isFavorite: playlist.isFavorite,
      orderIndex: playlist.orderIndex,
      /** Bizim listemiz mi — Spotify'dan gelene parça eklemek yanıltıcı olurdu */
      isLocal: playlist.spotifyId === null,
      trackCount: playlist._count.tracks,
    }));
  }

  /**
   * Yeni yerel liste. `spotifyId` yazılMIYOR — listeyi sync'in erişemeyeceği
   * tarafta tutan tek şey o.
   */
  async create(input: { name: string; description?: string }) {
    const name = input.name.trim();
    if (name.length === 0) {
      throw new BadRequestException('MUSIC.PLAYLIST_NAME_REQUIRED');
    }
    const slug = await this.uniqueSlug(name);

    return this.prisma.musicPlaylist.create({
      data: {
        name,
        slug,
        description: input.description?.trim() || null,
        // Yerel listenin toplamları parçalardan türetiliyor; sütunlar
        // Spotify'ın verdiği künye için ayrılmış ve boş kalmalı
        trackCount: null,
        durationMs: null,
      },
      select: { id: true, slug: true, name: true, description: true },
    });
  }

  async update(
    id: string,
    dto: {
      name?: string;
      description?: string;
      isFavorite?: boolean;
      orderIndex?: number;
    },
  ) {
    await this.assertExists(id);
    if (dto.name !== undefined && dto.name.trim().length === 0) {
      throw new BadRequestException('MUSIC.PLAYLIST_NAME_REQUIRED');
    }

    return this.prisma.musicPlaylist.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description.trim() || null }
          : {}),
        ...(dto.isFavorite !== undefined ? { isFavorite: dto.isFavorite } : {}),
        ...(dto.orderIndex !== undefined ? { orderIndex: dto.orderIndex } : {}),
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        isFavorite: true,
        orderIndex: true,
      },
    });
  }

  /**
   * Yumuşak silme. Satır duruyor çünkü `MusicPlaylistTrack` cascade ile
   * silinirdi ve listeyi geri getirmenin yolu kalmazdı; ayrıca slug da
   * serbest kalıp bir sonraki listeye verilirdi (eski adres yanlış listeyi
   * açardı).
   */
  async remove(id: string) {
    await this.assertExists(id);
    await this.prisma.musicPlaylist.update({
      where: { id },
      data: { isDeleted: true },
    });
    return { id, isDeleted: true };
  }

  /**
   * Parçayı listenin SONUNA ekler.
   *
   * Aynı parça iki kez eklenemez: `@@id([playlistId, trackId])` bileşik
   * anahtarı bunu şema düzeyinde engelliyor. Hata fırlatmak yerine sessizce
   * "zaten var" dönüyoruz — küratör aynı parçaya iki kez basınca ekranda
   * kırmızı bir uyarı görmesinin bir değeri yok, listede zaten duruyor.
   */
  async addTrack(playlistId: string, trackId: string) {
    await this.assertExists(playlistId);
    const track = await this.prisma.musicTrack.findFirst({
      where: { id: trackId, isDeleted: false },
      select: { id: true, title: true },
    });
    if (!track) {
      throw new NotFoundException('MUSIC.TRACK_NOT_FOUND');
    }

    const existing = await this.prisma.musicPlaylistTrack.findUnique({
      where: { playlistId_trackId: { playlistId, trackId } },
      select: { position: true },
    });
    if (existing) {
      return { playlistId, trackId, position: existing.position, added: false };
    }

    const count = await this.prisma.musicPlaylistTrack.count({
      where: { playlistId },
    });
    if (count >= MAX_TRACKS) {
      throw new BadRequestException('MUSIC.PLAYLIST_FULL');
    }

    const last = await this.prisma.musicPlaylistTrack.findFirst({
      where: { playlistId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    const position = (last?.position ?? -1) + 1;

    await this.prisma.musicPlaylistTrack.create({
      data: { playlistId, trackId, position, addedAt: new Date() },
    });
    return { playlistId, trackId, position, added: true };
  }

  /**
   * Parçayı çıkarır ve **sonraki sıraları kaydırır.**
   *
   * Boşluk bırakmak da çalışırdı (sıralama yine doğru olurdu) ama sıra
   * numaraları listede görünüyor; 1, 2, 4, 5 diye giden bir liste "üçüncü
   * parça nerede" sorusunu doğurur.
   */
  async removeTrack(playlistId: string, trackId: string) {
    const entry = await this.prisma.musicPlaylistTrack.findUnique({
      where: { playlistId_trackId: { playlistId, trackId } },
      select: { position: true },
    });
    if (!entry) {
      throw new NotFoundException('MUSIC.PLAYLIST_TRACK_NOT_FOUND');
    }

    await this.prisma.$transaction([
      this.prisma.musicPlaylistTrack.delete({
        where: { playlistId_trackId: { playlistId, trackId } },
      }),
      this.prisma.musicPlaylistTrack.updateMany({
        where: { playlistId, position: { gt: entry.position } },
        data: { position: { decrement: 1 } },
      }),
    ]);
    return { playlistId, trackId, removed: true };
  }

  /**
   * Listenin sırasını **tümüyle** yeniden yazar (gönderilen dizi son hâl).
   *
   * ⚠️ İki aşamalı: önce negatif geçici sıralar, sonra gerçek sıralar. Tek
   * aşamada yazmak `@@index([playlistId, position])` üzerinde geçici çakışma
   * üretmiyor (unique değil) ama iki parçanın aynı anda aynı pozisyonda
   * görünmesi sıralamayı belirsiz bırakırdı; geçici aralık bunu kapatıyor.
   */
  async reorder(playlistId: string, trackIds: string[]) {
    await this.assertExists(playlistId);
    const current = await this.prisma.musicPlaylistTrack.findMany({
      where: { playlistId },
      select: { trackId: true },
    });
    const known = new Set(current.map((entry) => entry.trackId));
    const unique = [...new Set(trackIds)];
    if (unique.length !== known.size || unique.some((id) => !known.has(id))) {
      throw new BadRequestException('MUSIC.PLAYLIST_ORDER_MISMATCH');
    }

    await this.prisma.$transaction([
      ...unique.map((trackId, index) =>
        this.prisma.musicPlaylistTrack.update({
          where: { playlistId_trackId: { playlistId, trackId } },
          data: { position: -(index + 1) },
        }),
      ),
      ...unique.map((trackId, index) =>
        this.prisma.musicPlaylistTrack.update({
          where: { playlistId_trackId: { playlistId, trackId } },
          data: { position: index },
        }),
      ),
    ]);
    return { playlistId, count: unique.length };
  }

  /* ── Yardımcılar ─────────────────────────────────────────────────────── */

  private async assertExists(id: string): Promise<void> {
    const playlist = await this.prisma.musicPlaylist.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });
    if (!playlist) {
      throw new NotFoundException('MUSIC.PLAYLIST_NOT_FOUND');
    }
  }

  /**
   * Benzersiz slug. Silinmiş listelerin slug'ı da hesaba katılıyor
   * (`isDeleted` filtresi YOK): eski adres yeni bir listeyi açmasın.
   */
  private async uniqueSlug(name: string): Promise<string> {
    const base = slugify(name) || 'liste';
    let candidate = base;
    for (let suffix = 2; suffix < 200; suffix += 1) {
      const clash = await this.prisma.musicPlaylist.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      if (!clash) {
        return candidate;
      }
      candidate = `${base}-${suffix}`;
    }
    throw new BadRequestException('MUSIC.PLAYLIST_SLUG_EXHAUSTED');
  }
}
