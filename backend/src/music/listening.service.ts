import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Dinleme kaydı — tasarım 2d ekranının tek veri kaynağı.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * NEDEN İÇE AKTARMA GEREKİYOR
 *
 * Spotify Web API'sinde **çalma sayısı ucu YOKTUR.** Tasarımdaki "1.842
 * dinleme", "61s 24d dinleme süresi", "en yoğun gün: Cuma", "%23 yeni keşif"
 * hiçbir istekle gelmiyor. Gelen iki şey de yetersiz:
 *
 *   /me/top/artists|tracks       SIRALAMA verir, sayı vermez. Zaman
 *                                aralıkları (short/medium/long_term) tam
 *                                olarak tasarımdaki "4 hafta · 6 ay · tüm
 *                                zamanlar" seçicisine karşılık geliyor.
 *   /me/player/recently-played   Yalnızca SON 50 kayıt. Geçmiş arşivi yok.
 *
 * Yani gerçek sayılar ancak bizim tuttuğumuz bir kayıttan çıkar. Kullanıcı
 * kararı (11 Ağustos 2026): Spotify hesap ayarlarından istenen **"Extended
 * streaming history"** dosyaları bir kez içe aktarılır — tüm zamanları
 * kapsıyor, yani 2d ilk günden gerçek sayılarla dolu olur. Sonrası Faz 5'te
 * `recently-played` yoklamasıyla güncel kalır.
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ `MusicPlay` KİŞİSEL VERİDİR. Katalog sync'i o tabloya yazmaz ve oradan
 * silmez (bkz. `music-sync.service.ts` başındaki yazma izni kuralı). Bu
 * servis tek yazma yoludur.
 */

/**
 * Kaç milisaniyeden kısa çalmalar sayılmaz.
 *
 * Spotify kaydı her açılışı yazıyor — bir parçayı 3 saniye dinleyip
 * geçtiğinde de satır düşüyor. Eşik olmadan "en çok dinlenen sanatçı"
 * listesini atladığın parçalar belirlerdi. 30 saniye, Spotify'ın kendi
 * "dinlendi sayılır" eşiğiyle aynı.
 */
const MIN_MS_PLAYED = 30_000;

/** Tek `createMany` çağrısında kaç satır. Büyük dosyalar bölünerek yazılıyor. */
const BATCH_SIZE = 1_000;

/**
 * Dosya başına en fazla kayıt. Uzatılmış geçmiş yıllara göre onbinlerce satır
 * olabiliyor; sınır bir güvenlik değil bellek koruması — tek istekte sınırsız
 * JSON ayrıştırmak süreci düşürebilir.
 */
const MAX_ENTRIES_PER_FILE = 200_000;

export interface ImportResult {
  /** Dosyada okunan toplam satır */
  read: number;
  /** Eşiği geçip yazılmaya uygun bulunan */
  eligible: number;
  /** Gerçekten eklenen (tekrarlar düşülmüş) */
  inserted: number;
  /** Zaten kayıtlı olduğu için atlanan */
  duplicate: number;
  /** Podcast bölümü, parça adı olmayan ya da eşiğin altında kalan */
  skipped: number;
  /** Arşivdeki bir parçaya bağlanabilen */
  matched: number;
}

/* ── Spotify'ın iki dosya biçimi ─────────────────────────────────────────── */

/** "Extended streaming history" (istenmesi gereken, tüm zamanlar) */
interface ExtendedEntry {
  ts?: string;
  ms_played?: number;
  master_metadata_track_name?: string | null;
  master_metadata_album_artist_name?: string | null;
  master_metadata_album_album_name?: string | null;
  spotify_track_uri?: string | null;
  /** Podcast satırlarında dolu; o satırlar atlanır */
  episode_name?: string | null;
  spotify_episode_uri?: string | null;
}

/** "Account data" içindeki `StreamingHistory*.json` (yalnızca son 1 yıl) */
interface BasicEntry {
  endTime?: string;
  artistName?: string;
  trackName?: string;
  msPlayed?: number;
}

type RawEntry = ExtendedEntry & BasicEntry;

interface NormalizedPlay {
  playedAt: Date;
  msPlayed: number;
  spotifyTrackUri: string | null;
  trackName: string;
  artistName: string | null;
  albumName: string | null;
}

@Injectable()
export class ListeningService {
  private readonly logger = new Logger(ListeningService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Bir geçmiş dosyasını içe aktarır. İki biçimi de tanır (uzatılmış geçmiş
   * ve eski `StreamingHistory`), hangisi olduğunu alanlardan anlar.
   *
   * **Tekrar tekrar çalıştırmak güvenli.** `@@unique([userId, playedAt,
   * spotifyTrackUri])` kısıtı sayesinde aynı dosyayı ikinci kez aktarmak
   * kopya üretmiyor; `skipDuplicates` ile sessizce atlanıyor. Zip içindeki
   * dosyaları tek tek yüklemek de bu yüzden sorun değil.
   */
  async importHistoryFile(
    buffer: Buffer,
    userId: string,
  ): Promise<ImportResult> {
    const entries = this.parse(buffer);
    const result: ImportResult = {
      read: entries.length,
      eligible: 0,
      inserted: 0,
      duplicate: 0,
      skipped: 0,
      matched: 0,
    };

    const normalized: NormalizedPlay[] = [];
    for (const entry of entries) {
      const play = normalize(entry);
      if (!play) {
        result.skipped += 1;
        continue;
      }
      normalized.push(play);
    }
    result.eligible = normalized.length;
    if (normalized.length === 0) {
      return result;
    }

    /**
     * Parça eşleştirmesi tek sorguda: satır satır `findUnique` çağırmak
     * onbinlerce sorgu demekti. Arşivde karşılığı olmayan dinleme de yazılır
     * (`trackId` null kalır) — `F1RaceResult.driverName` ile aynı gerekçe:
     * kayıt açılmamışken de satır yazılabilsin.
     */
    const uris = [
      ...new Set(
        normalized
          .map((play) => play.spotifyTrackUri)
          .filter((uri): uri is string => Boolean(uri)),
      ),
    ];
    const trackIdByUri = await this.mapUrisToTracks(uris);

    for (let index = 0; index < normalized.length; index += BATCH_SIZE) {
      const slice = normalized.slice(index, index + BATCH_SIZE);
      const rows = slice.map((play) => {
        const trackId = play.spotifyTrackUri
          ? (trackIdByUri.get(play.spotifyTrackUri) ?? null)
          : null;
        if (trackId) {
          result.matched += 1;
        }
        return {
          userId,
          playedAt: play.playedAt,
          msPlayed: play.msPlayed,
          spotifyTrackUri: play.spotifyTrackUri,
          trackName: play.trackName,
          artistName: play.artistName,
          albumName: play.albumName,
          source: 'IMPORT' as const,
          trackId,
        };
      });

      const written = await this.prisma.musicPlay.createMany({
        data: rows,
        skipDuplicates: true,
      });
      result.inserted += written.count;
      result.duplicate += rows.length - written.count;
    }

    this.logger.log(
      `Dinleme içe aktarımı: ${result.inserted} eklendi, ${result.duplicate} tekrar, ${result.skipped} atlandı, ${result.matched} parça eşleşti`,
    );
    return result;
  }

  /**
   * İçe aktarılmış dinlemeleri arşivdeki parçalara yeniden bağlar.
   *
   * Neden gerekli: geçmiş dosyası genelde katalogdan ÖNCE aktarılıyor, yani o
   * anda eşleşecek parça yok. Yeni bir sanatçı senkronize edildikçe eski
   * dinlemeler bağlanabilir hâle geliyor. Bu uç o boşluğu kapatıyor —
   * kitap kanadındaki `credits/backfill` ile aynı desen.
   */
  async backfillTrackLinks(limit = 5_000): Promise<{ linked: number }> {
    const pending = await this.prisma.musicPlay.findMany({
      where: { trackId: null, spotifyTrackUri: { not: null } },
      select: { id: true, spotifyTrackUri: true },
      take: limit,
    });
    if (pending.length === 0) {
      return { linked: 0 };
    }

    const uris = [
      ...new Set(
        pending
          .map((play) => play.spotifyTrackUri)
          .filter((uri): uri is string => Boolean(uri)),
      ),
    ];
    const trackIdByUri = await this.mapUrisToTracks(uris);

    let linked = 0;
    // Aynı parçaya ait bütün dinlemeler tek `updateMany` ile bağlanıyor
    for (const [uri, trackId] of trackIdByUri) {
      const updated = await this.prisma.musicPlay.updateMany({
        where: { spotifyTrackUri: uri, trackId: null },
        data: { trackId },
      });
      linked += updated.count;
    }
    return { linked };
  }

  /** `spotify:track:ID` → arşivdeki parça kimliği. */
  private async mapUrisToTracks(uris: string[]): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    if (uris.length === 0) {
      return result;
    }
    const byId = new Map<string, string>();
    for (const uri of uris) {
      const id = trackIdFromUri(uri);
      if (id) {
        byId.set(id, uri);
      }
    }
    if (byId.size === 0) {
      return result;
    }

    // `IN` listesini parçalayarak sor: on binlerce kimlikle tek sorgu
    // PostgreSQL parametre sınırına dayanır
    const ids = [...byId.keys()];
    for (let index = 0; index < ids.length; index += BATCH_SIZE) {
      const slice = ids.slice(index, index + BATCH_SIZE);
      const tracks = await this.prisma.musicTrack.findMany({
        where: { spotifyId: { in: slice } },
        select: { id: true, spotifyId: true },
      });
      for (const track of tracks) {
        if (!track.spotifyId) {
          continue;
        }
        const uri = byId.get(track.spotifyId);
        if (uri) {
          result.set(uri, track.id);
        }
      }
    }
    return result;
  }

  /** Dosyayı ayrıştırır; iki biçimden hangisi olduğuna karar vermez — o `normalize`in işi. */
  private parse(buffer: Buffer): RawEntry[] {
    let parsed: unknown;
    try {
      parsed = JSON.parse(buffer.toString('utf8')) as unknown;
    } catch {
      throw new BadRequestException('MUSIC.HISTORY_INVALID_JSON');
    }
    if (!Array.isArray(parsed)) {
      throw new BadRequestException('MUSIC.HISTORY_NOT_AN_ARRAY');
    }
    if (parsed.length > MAX_ENTRIES_PER_FILE) {
      throw new BadRequestException('MUSIC.HISTORY_TOO_LARGE');
    }
    return parsed as RawEntry[];
  }
}

/* ── Yardımcılar ─────────────────────────────────────────────────────────── */

/**
 * İki biçimi tek şekle indirir. Uygun olmayan satırda `null` döner:
 *  - podcast bölümü (uzatılmış geçmişte `episode_name` dolu)
 *  - parça adı yok
 *  - zaman damgası okunamıyor
 *  - eşiğin altında çalınmış (bkz. `MIN_MS_PLAYED`)
 */
function normalize(entry: RawEntry): NormalizedPlay | null {
  if (entry.episode_name || entry.spotify_episode_uri) {
    return null;
  }

  const trackName = (
    entry.master_metadata_track_name ??
    entry.trackName ??
    ''
  ).trim();
  if (!trackName) {
    return null;
  }

  const rawTime = entry.ts ?? entry.endTime;
  if (!rawTime) {
    return null;
  }
  const playedAt = parseTimestamp(rawTime);
  if (!playedAt) {
    return null;
  }

  const msPlayed = entry.ms_played ?? entry.msPlayed;
  if (typeof msPlayed !== 'number' || !Number.isFinite(msPlayed)) {
    return null;
  }
  if (msPlayed < MIN_MS_PLAYED) {
    return null;
  }

  return {
    playedAt,
    msPlayed: Math.round(msPlayed),
    spotifyTrackUri: entry.spotify_track_uri?.trim() || null,
    trackName,
    artistName:
      (
        entry.master_metadata_album_artist_name ??
        entry.artistName ??
        ''
      ).trim() || null,
    albumName: (entry.master_metadata_album_album_name ?? '').trim() || null,
  };
}

/**
 * Uzatılmış geçmiş ISO 8601 veriyor ("2023-05-01T12:34:56Z"). Eski biçim ise
 * **saat dilimi bilgisi olmayan** "2023-05-01 12:34" yazıyor; o durumda araya
 * `T` ve sonuna `Z` konuyor.
 *
 * Neden UTC varsayılıyor: Spotify eski dosyayı UTC üretiyor. Yerel saat
 * varsayılsaydı "en yoğun gün" ve saat dağılımı sunucunun saat dilimine göre
 * kayardı — ölçüm sessizce yanlış çıkardı.
 */
function parseTimestamp(value: string): Date | null {
  const trimmed = value.trim();
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(trimmed)
    ? `${trimmed.replace(' ', 'T')}${trimmed.length === 16 ? ':00' : ''}Z`
    : trimmed;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "spotify:track:2nLtzopw4rPReszdYBJU6h" → "2nLtzopw4rPReszdYBJU6h" */
function trackIdFromUri(uri: string): string | null {
  const match = /^spotify:track:([A-Za-z0-9]+)$/.exec(uri.trim());
  return match ? match[1] : null;
}
