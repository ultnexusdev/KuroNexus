import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RemoteImageService } from '../uploads/remote-image.service';
import { UploadsService } from '../uploads/uploads.service';
import { FootballService } from '../football/football.service';
import { TffProvider } from './providers/tff.provider';
import { WikipediaProvider } from './providers/wikipedia.provider';
import {
  TheSportsDbProvider,
  type TsdbTeamAssets,
} from './providers/thesportsdb.provider';
import { ApiFootballProvider } from './providers/apifootball.provider';
import {
  ClubFeedProvider,
  type ClubNewsItem,
} from './providers/club-feed.provider';
import {
  GS_KEY,
  type LiveMatch,
  type LiveScorer,
  type LiveSquadPlayer,
  type LiveStandings,
  type LiveTeamSeasonStats,
} from './providers/types';
import type { Prisma } from '../generated/prisma/client';

/**
 * Salon 06 · Futbol · CANLI VERİ — normalleştirici.
 *
 * Kullanıcının çizdiği mimarinin ortadaki kutusu: kaynaklar → NORMALIZER →
 * Postgres (ExternalCache) → tek public uç → sayfa.
 *
 * ── KURAL 4/14: SAYFA RENDER'I DIŞARI ÇIKMAZ ─────────────────────────────
 * Public uçlar YALNIZCA cache'ten okuyor. Dış kaynağa çıkan tek şey cron.
 * Böylece TFF düşse bile sayfa dünkü veriyle açılıyor (bayat ama DOĞRU veri),
 * ve bir ziyaretçi dalgası resmî siteye yansımıyor.
 *
 * ── KAYNAK ÖNCELİĞİ ──────────────────────────────────────────────────────
 * Puan durumu:  TFF → (düşerse) Vikipedi
 * Fikstür:      TFF  (34 haftanın tamamı + tarih/saat/stat)
 * Görseller:    TheSportsDB (indirilip /uploads'a yazılıyor)
 * Canlı/oyuncu: API-Football — YALNIZCA plan kapsıyorsa
 * Gol krallığı: Vikipedi
 *
 * Yedek zinciri "her ikisini de çağır, birleştir" DEĞİL: birincil kaynak
 * başarılıysa ikincisine hiç gidilmiyor. İki kaynağı birleştirmek, ikisi
 * çeliştiğinde hangisinin doğru olduğuna karar vermeyi gerektirir ve o karar
 * verilemez — TFF ligin resmî kayıt tutucusu, çelişkide o kazanır.
 */

const KEY = {
  standings: 'fbl:standings',
  fixtures: (club: string) => `fbl:fixtures:${club}`,
  assets: 'fbl:assets',
  scorers: 'fbl:scorers',
  playerPhotos: 'fbl:player-photos',
  news: 'fbl:news',
  positionHistory: 'fbl:position-history',
  live: 'fbl:live',
  syncLast: 'fbl:sync:last',
} as const;

/** Sayfanın tek istekte aldığı biçim. */
export interface ClubLiveOverview {
  season: { label: string; startYear: number };
  club: ClubIdentity | null;
  lastMatch: LiveMatch | null;
  nextMatch: LiveMatch | null;
  live: LiveMatch | null;
  /** Son oynanan 5 maç, ESKİDEN YENİYE — form grafiği bu sırayı bekliyor */
  form: LiveMatch[];
  fixtures: LiveMatch[];
  standings: LiveStandings | null;
  teamStats: LiveTeamSeasonStats | null;
  /** Haftalık sıralama — ligin bütün sonuçlarından TÜRETİLİYOR (bkz. computePositionHistory) */
  positionHistory: Array<{ week: number; position: number; points: number }>;
  scorers: LiveScorer[];
  /** Kulübün RESMÎ RSS beslemesi — haber şeridinin kaynağı */
  news: ClubNewsItem[];
  squad: LiveSquadPlayer[];
  /** Ön yüz "bu bölüm neden yok" sorusunu buradan cevaplıyor */
  capabilities: { liveScore: boolean; playerSeasonStats: boolean };
  updatedAt: string | null;
}

export interface ClubIdentity {
  key: string;
  name: string;
  crest: string | null;
  banner: string | null;
  jersey: string | null;
  fanart: string[];
  stadium: string | null;
  stadiumCapacity: number | null;
  foundedYear: number | null;
  nicknames: string[];
}

@Injectable()
export class FootballLiveService {
  private readonly logger = new Logger(FootballLiveService.name);

  private readonly tff: TffProvider;
  private readonly wikipedia: WikipediaProvider;
  private readonly tsdb: TheSportsDbProvider;
  private readonly clubFeed: ClubFeedProvider;
  private readonly apiFootball: ApiFootballProvider | null;

  private readonly clubKey: string;
  private readonly seasonStartYear: number;
  private readonly seasonLabel: string;
  /**
   * TFF hattı açık mı?
   *
   * ── NEDEN KAPATILABİLİR OLMASI GEREKTİ ────────────────────────────────
   * 19 Ağustos 2026 canlı deploy'unda ölçüldü: üretim sunucusundan
   * tff.org'a ULAŞILAMIYOR (puan durumu sessizce Vikipedi yedeğine düştü,
   * fikstür ise yedeği olmadığı için 0 maçla açıldı). Yerelden aynı istek
   * 200 dönüyor — yani engel bizim kodumuzda değil, sunucunun çıkışında.
   *
   * Sebep bulunana kadar her senkron TFF'yi deneyip zaman aşımına düşüyor.
   * `FBL_TFF_ENABLED=false` o boşa beklemeyi kaldırıyor ve doğrudan
   * Vikipedi'den okuyor. Varsayılan AÇIK: TFF ligin resmî kaynağı ve
   * erişim geri geldiğinde kendiliğinden tercih edilsin.
   */
  private readonly tffEnabled: boolean;

  private syncRunning = false;
  private liveRunning = false;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly uploads: UploadsService,
    private readonly remoteImage: RemoteImageService,
    private readonly football: FootballService,
  ) {
    // Sezon başlangıç yılı: Temmuz'dan sonra yeni sezon. 2026-08 → 2026 (26/27).
    const now = new Date();
    const derived =
      now.getUTCMonth() >= 6 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
    this.seasonStartYear = Number(
      this.config.get<string>('FBL_SEASON', String(derived)),
    );
    this.seasonLabel = `${this.seasonStartYear}-${String(this.seasonStartYear + 1).slice(2)}`;
    this.clubKey = this.config.get<string>('FBL_CLUB_KEY', GS_KEY);
    this.tffEnabled =
      this.config.get<string>('FBL_TFF_ENABLED', 'true') !== 'false';

    this.tff = new TffProvider();
    this.wikipedia = new WikipediaProvider({ seasonLabel: this.seasonLabel });
    this.tsdb = new TheSportsDbProvider(
      this.config.get<string>('TSDB_API_KEY', '3'),
    );
    // Besleme adresi yapılandırılabilir: başka bir kulüp eklendiğinde kod
    // değil ortam değişkeni değişsin.
    this.clubFeed = new ClubFeedProvider(
      this.config.get<string>(
        'FBL_CLUB_FEED_URL',
        'https://www.galatasaray.org/xml/gs.rss',
      ),
    );

    const afKey = this.config.get<string>('API_FOOTBALL_KEY');
    this.apiFootball = afKey
      ? new ApiFootballProvider({
          apiKey: afKey,
          season: this.seasonStartYear,
          teamId: Number(
            this.config.get<string>('API_FOOTBALL_TEAM_ID', '645'),
          ),
        })
      : null;
  }

  // ---- Public okuma (yalnızca cache) ---------------------------------------

  /**
   * `/spor/futbol/[clubSlug]` sayfasının tamamı. Tek istek, kanadın
   * "bir sayfanın ihtiyacı olan her şey tek uçtan gelir" kuralı.
   *
   * Slug bilinen kulüp değilse boş bir kabuk dönüyor — 404 DEĞİL. Sayfa o
   * durumda editoryal (arşiv) düzenini çiziyor, canlı bölümler hiç
   * görünmüyor. Böylece yeni bir kulüp arşive eklendiğinde canlı veri
   * olmadan da sayfası açılıyor.
   */
  async getClubOverview(clubSlug: string): Promise<ClubLiveOverview> {
    const key = clubSlug.toLowerCase();
    const empty: ClubLiveOverview = {
      season: { label: this.seasonLabel, startYear: this.seasonStartYear },
      club: null,
      lastMatch: null,
      nextMatch: null,
      live: null,
      form: [],
      fixtures: [],
      standings: null,
      teamStats: null,
      positionHistory: [],
      scorers: [],
      news: [],
      squad: [],
      capabilities: { liveScore: false, playerSeasonStats: false },
      updatedAt: null,
    };
    if (key !== this.clubKey) return empty;

    const [
      standingsRow,
      fixturesRow,
      assetsRow,
      scorersRow,
      liveRow,
      historyRow,
      newsRow,
    ] = await Promise.all([
      this.readCache<LiveStandings>(KEY.standings),
      this.readCache<{ matches: LiveMatch[]; squad: LiveSquadPlayer[] }>(
        KEY.fixtures(key),
      ),
      this.readCache<Record<string, StoredAssets>>(KEY.assets),
      this.readCache<LiveScorer[]>(KEY.scorers),
      this.readCache<LiveMatch | null>(KEY.live),
      this.readCache<Array<{ week: number; position: number; points: number }>>(
        KEY.positionHistory,
      ),
      this.readCache<ClubNewsItem[]>(KEY.news),
    ]);

    const fixtures = fixturesRow?.payload?.matches ?? [];
    const assets = assetsRow?.payload ?? {};

    // ── KADRO: iki kaynaklı, öncelik sırası açık ────────────────────────────
    // 1. API-Football (senkronda yazılmış) — sezon istatistiğiyle birlikte
    //    gelir, ama plan bunu kapsamıyorsa boş olur.
    // 2. Transfermarkt tabloları + küratör düzeltmeleri — ücretsiz katmanda
    //    ÇALIŞAN yol. Ölçüm: 36 oyuncu, 36 fotoğraf, 34 forma numarası.
    //
    // ⚠️ İkisi BİRLEŞTİRİLMİYOR, biri seçiliyor. İki listeyi harmanlamak aynı
    // oyuncunun iki kaydını (farklı id, farklı yazım) yan yana koyma riski
    // taşır; istatistikli liste varsa o kazanır, yoksa künyeli liste çizilir.
    const apiSquad = fixturesRow?.payload?.squad ?? [];
    const squad =
      apiSquad.length > 0 ? apiSquad : await this.readTransfermarktSquad();

    // Armaları puan tablosuna ve fikstüre BURADA bağlıyoruz, senkronda değil:
    // görsel seti ayrı tazeleniyor ve iki cache satırını birbirine yazmak
    // ikisini de kirletir.
    const standings = standingsRow?.payload
      ? {
          ...standingsRow.payload,
          rows: standingsRow.payload.rows.map((row) => ({
            ...row,
            team: { ...row.team, crest: assets[row.team.key]?.crest ?? null },
          })),
        }
      : null;

    const withCrests = fixtures.map((match) => ({
      ...match,
      home: { ...match.home, crest: assets[match.home.key]?.crest ?? null },
      away: { ...match.away, crest: assets[match.away.key]?.crest ?? null },
    }));

    const played = withCrests
      .filter((m) => m.status === 'FINISHED')
      .sort(byKickoffThenRound);
    const upcoming = withCrests
      .filter((m) => m.status === 'SCHEDULED' || m.status === 'POSTPONED')
      .sort(byKickoffThenRound);

    const mine = assets[key];
    return {
      season: { label: this.seasonLabel, startYear: this.seasonStartYear },
      club: mine
        ? {
            key,
            name: mine.name,
            crest: mine.crest,
            banner: mine.banner,
            jersey: mine.jersey,
            fanart: mine.fanart,
            stadium: mine.stadium,
            stadiumCapacity: mine.stadiumCapacity,
            foundedYear: mine.foundedYear,
            nicknames: mine.nicknames,
          }
        : null,
      lastMatch: played.length > 0 ? played[played.length - 1] : null,
      nextMatch: upcoming.length > 0 ? upcoming[0] : null,
      live: liveRow?.payload ?? null,
      form: played.slice(-5),
      fixtures: withCrests.sort(byKickoffThenRound),
      standings,
      teamStats: computeTeamStats(played, key),
      positionHistory: historyRow?.payload ?? [],
      scorers: scorersRow?.payload ?? [],
      news: newsRow?.payload ?? [],
      squad,
      capabilities: {
        liveScore: this.apiFootball?.capabilities().liveScore ?? false,
        playerSeasonStats:
          this.apiFootball?.capabilities().playerSeasonStats ?? false,
      },
      updatedAt:
        fixturesRow?.fetchedAt?.toISOString() ??
        standingsRow?.fetchedAt?.toISOString() ??
        null,
    };
  }

  /**
   * Kadroyu Transfermarkt tablolarından okur ve ara biçime çevirir.
   *
   * `FootballService.getSquad()` çağrılıyor, sorgu tekrarlanmıyor: kadro
   * düzeltmeleri (gizlenen oyuncu, elle eklenen oyuncu) orada uygulanıyor ve
   * iki yerde uygulamak, birinde unutmanın en kısa yolu olurdu.
   *
   * Sezon istatistiği EKLENMİYOR — `season` alanı bilinçle boş. Veri setinde
   * bu sezonun maçı henüz yok (ölçüldü: `last_season` en fazla 2025) ve
   * "0 gol, 0 asist" yazmak, oynamamış bir oyuncuyla gol atamamış bir
   * oyuncuyu aynı gösterirdi.
   */
  private async readTransfermarktSquad(): Promise<LiveSquadPlayer[]> {
    try {
      const [{ players }, photoRow] = await Promise.all([
        this.football.getSquad(),
        this.readCache<Record<string, string>>(KEY.playerPhotos),
      ]);
      const localPhotos = photoRow?.payload ?? {};

      return players.map((p) => ({
        id: p.id,
        name: p.name,
        position: p.position,
        shirtNumber: p.number,
        // ⚠️ DIŞ ADRES SAYFAYA KOYULMUYOR. Veri setindeki foto adresi
        // `img.a.transfermarkt.technology` — CSP `img-src` beyaz listesinde
        // YOK, yani hotlink edilse 36 kartın 36'sı boş çerçeve olurdu
        // (ölçüldü). Senkron bunları indirip `/uploads/football/players/`
        // altına yazıyor; burada yalnızca yerel yol okunuyor. İnmemişse null
        // — kart fotoğrafsız çiziliyor, kırık görsel değil.
        photo: localPhotos[p.id] ?? null,
        nationality: null, // veri setinde var ama getSquad() taşımıyor
        birthDate: p.dateOfBirth,
        age: p.age,
        heightInCm: p.heightInCm,
        foot: p.foot,
        marketValueInEur: p.marketValueInEur,
        detailedPosition: p.subPosition,
        isManual: p.id.startsWith('manual:'),
      }));
    } catch (error) {
      this.logger.warn(`Transfermarkt kadrosu okunamadı: ${errMsg(error)}`);
      return [];
    }
  }

  /** Canlı skor için hafif uç — ön yüz maç saatinde bunu yokluyor. */
  async getLive(): Promise<{
    match: LiveMatch | null;
    updatedAt: string | null;
  }> {
    const row = await this.readCache<LiveMatch | null>(KEY.live);
    return {
      match: row?.payload ?? null,
      updatedAt: row?.fetchedAt?.toISOString() ?? null,
    };
  }

  async getSyncStatus() {
    const row = await this.readCache<unknown>(KEY.syncLast);
    return {
      running: this.syncRunning,
      last: row?.payload ?? null,
      lastAt: row?.fetchedAt ?? null,
      season: this.seasonLabel,
      club: this.clubKey,
    };
  }

  // ---- Senkron -------------------------------------------------------------

  /**
   * Günlük tam senkron — 04:20 UTC (07:20 TSİ).
   *
   * Saat bilinçli seçildi: mevcut cron'lar 04:00 (futbol kadro), 05:00 (anime),
   * 06:00 (müzik) dolu. Ayrıca gece maçları TSİ 23:00 civarı bitiyor; 07:20
   * hem sonuçların işlendiği hem de kimsenin siteyi kullanmadığı saat.
   */
  @Cron('20 4 * * *', { name: 'football-live-sync', timeZone: 'UTC' })
  handleDailySync() {
    this.logger.log('Günlük futbol canlı-veri senkronu tetikleniyor');
    this.startSync();
  }

  startSync(): { status: string } {
    if (this.syncRunning) return { status: 'ALREADY_RUNNING' };
    this.syncRunning = true;
    void this.runSync()
      .catch(async (error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`Futbol canlı-veri senkron hatası: ${message}`);
        await this.writeCache(KEY.syncLast, { ok: false, error: message });
      })
      .finally(() => {
        this.syncRunning = false;
      });
    return { status: 'STARTED' };
  }

  private async runSync(): Promise<void> {
    const diag: Record<string, unknown> = {
      season: this.seasonLabel,
      tffEnabled: this.tffEnabled,
    };

    // --- 1. Puan durumu: TFF, düşerse Vikipedi -----------------------------
    let standings: LiveStandings | null = null;
    try {
      if (!this.tffEnabled) throw new Error('TFF.DISABLED');
      standings = await this.tff.fetchStandings();
      diag.standingsSource = 'tff';
    } catch (error) {
      this.logger.warn(
        `TFF puan durumu alınamadı, Vikipedi deneniyor: ${errMsg(error)}`,
      );
      try {
        standings = await this.wikipedia.fetchStandings();
        diag.standingsSource = 'wikipedia';
      } catch (fallbackError) {
        diag.standingsError = errMsg(fallbackError);
      }
    }
    if (standings) {
      // Sezon etiketi TFF'de yazmıyor; kendi takvimimizden geleni koyuyoruz.
      standings.seasonLabel = standings.seasonLabel || this.seasonLabel;
      await this.writeCache(KEY.standings, standings);
      diag.standingsRows = standings.rows.length;
    }

    // --- 2. Fikstür: TFF ---------------------------------------------------
    // Önceki senkronda öğrenilen tarih/stat geri veriliyor; ikisi de bilinen
    // maçın detay sayfası TEKRAR ÇEKİLMİYOR (bkz. fetchClubFixtures başlığı).
    const previous = await this.readCache<{ matches: LiveMatch[] }>(
      KEY.fixtures(this.clubKey),
    );
    const known = new Map(
      (previous?.payload?.matches ?? []).map((m) => [
        m.id,
        { kickoffAt: m.kickoffAt, venue: m.venue },
      ]),
    );

    let matches: LiveMatch[] = [];
    try {
      if (!this.tffEnabled) throw new Error('TFF.DISABLED');
      matches = await this.tff.fetchClubFixtures(this.clubKey, known);
      diag.fixtureSource = 'tff';
    } catch (error) {
      diag.fixtureTffError = errMsg(error);
    }

    // ── VİKİPEDİ YEDEĞİ — ÜRETİMDE ÖLÇÜLDÜ, TEORİK DEĞİL ──────────────────
    // 19 Ağustos 2026 canlı deploy'unda TFF'ye ULAŞILAMADI: puan durumu
    // sessizce Vikipedi yedeğine düştü (`source: wikipedia`) ama fikstürün
    // yedeği olmadığı için sayfa 0 maçla açıldı. Yedek o gün eklendi.
    //
    // Vikipedi şablonu üstelik DAHA dolu: 306 maçın tamamında tarih var
    // (TFF yalnızca ilk üç haftayı tarihlendirmişti) ve hepsi tek istekte
    // geliyor. TFF yine de ÖNCE deneniyor — ligin resmî kayıt tutucusu o.
    if (matches.length === 0) {
      try {
        matches = await this.wikipedia.fetchClubFixtures(this.clubKey);
        diag.fixtureSource = 'wikipedia';
      } catch (error) {
        diag.fixtureWikiError = errMsg(error);
      }
    }

    diag.fixtureCount = matches.length;
    diag.fixtureWithKickoff = matches.filter((m) => m.kickoffAt).length;
    diag.fixtureWithVenue = matches.filter((m) => m.venue).length;

    // --- 3. Kadro + oyuncu istatistiği: yalnızca plan kapsıyorsa -----------
    let squad: LiveSquadPlayer[] = [];
    if (this.apiFootball && (await this.apiFootball.probe())) {
      try {
        squad = await this.apiFootball.fetchSquad();
        diag.squadCount = squad.length;

        // Avrupa kupası maçları TFF'de YOK — yalnızca lig var. Plan açıksa
        // API-Football'un fikstürüyle birleştiriyoruz; lig maçlarında TFF
        // kazanıyor (resmî kaynak), diğer organizasyonlar ekleniyor.
        const afMatches = await this.apiFootball.fetchClubFixtures(
          this.clubKey,
        );
        const extra = afMatches.filter(
          (m) => !/süper lig|super lig/i.test(m.competition),
        );
        matches = [...matches, ...extra];
        diag.europeanMatches = extra.length;
      } catch (error) {
        diag.squadError = errMsg(error);
      }
    } else {
      diag.squadSkipped = 'API-Football planı sezonu kapsamıyor';
    }

    if (matches.length > 0 || squad.length > 0) {
      await this.writeCache(KEY.fixtures(this.clubKey), { matches, squad });
    }

    // --- 3b. Sıralama geçmişi: ligin BÜTÜN sonuçlarından türetiliyor ------
    // Ayrı bir istek gerekiyor çünkü `fetchClubFixtures` yalnızca kulübün
    // maçlarını süzüyor; haftalık tablo için ligin tamamı lazım. Tek sayfa
    // isteği, detay çekilmiyor.
    // Aynı yedek zinciri: TFF'ye ulaşılamazsa ligin tamamı Vikipedi'den.
    try {
      let league: LiveMatch[] = [];
      try {
        if (!this.tffEnabled) throw new Error('TFF.DISABLED');
        league = await this.tff.fetchLeagueFixtures();
      } catch {
        league = await this.wikipedia.fetchLeagueFixtures();
        diag.leagueSource = 'wikipedia';
      }
      const history = computePositionHistory(league, this.clubKey);
      await this.writeCache(KEY.positionHistory, history);
      diag.positionHistory = history.length;
      diag.leagueMatches = league.length;
    } catch (error) {
      diag.positionHistoryError = errMsg(error);
    }

    // --- 4. Gol krallığı: Vikipedi ----------------------------------------
    try {
      const scorers = await this.wikipedia.fetchScorers();
      await this.writeCache(KEY.scorers, scorers);
      diag.scorers = scorers.length;
    } catch (error) {
      diag.scorersError = errMsg(error);
    }

    // --- 3c. Oyuncu portreleri: indirilip /uploads'a yazılıyor -------------
    // API-Football kadrosu yoksa (ücretsiz katman) kadro Transfermarkt
    // tablolarından geliyor ve oradaki foto adresi dış origin. CSP onu
    // engellediği için indiriliyor. Bir kez: sonraki senkronlarda atlanıyor.
    try {
      diag.playerPhotos = await this.syncPlayerPhotos();
    } catch (error) {
      diag.playerPhotoError = errMsg(error);
    }

    // --- 4b. Haber şeridi: kulübün RESMÎ RSS beslemesi --------------------
    // Diğer adımlardan bağımsız: besleme düşerse şerit çizilmiyor, sayfanın
    // geri kalanı etkilenmiyor.
    try {
      const news = await this.clubFeed.fetchNews();
      if (news.length > 0) {
        await this.writeCache(KEY.news, news);
      }
      diag.news = news.length;
    } catch (error) {
      diag.newsError = errMsg(error);
    }

    // --- 5. Görseller: ligdeki her takımın arması + kulübün fanart'ı -------
    if (standings) {
      try {
        diag.assets = await this.syncAssets(standings);
      } catch (error) {
        diag.assetsError = errMsg(error);
      }
    }

    await this.writeCache(KEY.syncLast, { ok: true, diag });
    this.logger.log(
      `Futbol canlı-veri senkronu bitti: ${JSON.stringify(diag)}`,
    );
  }

  /**
   * Arma ve atmosfer görsellerini indirip `/uploads/football/` altına yazar.
   *
   * ⚠️ HOTLINK YOK. Deponun ölçülmüş kuralı: dış adres saklanmaz, dosya
   * indirilir. Sebebi iki tane ve ikisi de yazılı — CSP `img-src` yabancı
   * origin'i engelliyor (görsel hiç görünmezdi) ve dış adres bir gün ölüyor.
   *
   * ⚠️ SABİT DOSYA ADI + `immutable` ÖNBELLEK ÇELİŞKİSİ. `/uploads` 365 gün
   * `immutable` ile sunuluyor; sabit ada üzerine yazmak, tarayıcıda eski
   * görselin bir yıl kalması demek. Bu yüzden dosya adı içeriğin adresinden
   * türetilen bir damgayla üretiliyor: kaynak görsel değişirse ad da değişiyor,
   * değişmediyse tekrar indirilmiyor.
   */
  private async syncAssets(standings: LiveStandings): Promise<number> {
    const dir = join(this.uploads.getUploadDir(), 'football');
    await mkdir(dir, { recursive: true });

    const existing =
      (await this.readCache<Record<string, StoredAssets>>(KEY.assets))
        ?.payload ?? {};
    const next: Record<string, StoredAssets> = { ...existing };
    let fetched = 0;

    for (const row of standings.rows) {
      const teamKey = row.team.key;
      const already = existing[teamKey];
      // Bir takımın armasını bir kez indiriyoruz. Arma yılda bir değişiyor;
      // her gün 18 görsel indirmek hem gereksiz hem nezaketsiz.
      if (already?.crest && already.name) continue;

      let assets: TsdbTeamAssets | null = null;
      try {
        assets = await this.tsdb.fetchTeamAssets(row.team.name);
      } catch (error) {
        this.logger.warn(
          `TheSportsDB künyesi alınamadı (${row.team.name}): ${errMsg(error)}`,
        );
      }
      if (!assets) continue;

      const crest = await this.ingestImage(
        dir,
        `crest-${teamKey}`,
        assets.badge,
      );
      // Fanart yalnızca KENDİ kulübümüz için: 18 takımın 4'er karesi 72 dosya
      // eder ve yalnızca bir takımın stadyum bölümü çiziliyor.
      const fanart =
        teamKey === this.clubKey
          ? (
              await Promise.all(
                assets.fanart
                  .slice(0, 4)
                  .map((url, i) =>
                    this.ingestImage(dir, `fanart-${teamKey}-${i}`, url),
                  ),
              )
            ).filter((p): p is string => p !== null)
          : [];
      const banner =
        teamKey === this.clubKey
          ? await this.ingestImage(dir, `banner-${teamKey}`, assets.banner)
          : null;
      const jersey =
        teamKey === this.clubKey
          ? await this.ingestImage(dir, `jersey-${teamKey}`, assets.jersey)
          : null;

      next[teamKey] = {
        name: assets.name,
        crest,
        banner,
        jersey,
        fanart,
        stadium: assets.stadium,
        stadiumCapacity: assets.stadiumCapacity,
        foundedYear: assets.foundedYear,
        nicknames: assets.nicknames,
      };
      fetched += 1;
      await sleep(400);
    }

    await this.writeCache(KEY.assets, next);
    return fetched;
  }

  /**
   * Oyuncu portrelerini indirip `/uploads/football/players/` altına yazar.
   *
   * Kaynak adresler Transfermarkt CDN'i ve CSP onları engelliyor — hotlink
   * edilse bütün kartlar boş çerçeve olurdu. Kural deponun uploads modülünde
   * yazılı ve arma/fanart için de aynısı uygulanıyor.
   *
   * Bir kez indiriliyor: cache'te yolu olan oyuncu atlanıyor. Yeni transfer
   * geldiğinde yalnızca onun portresi iniyor.
   */
  private async syncPlayerPhotos(): Promise<number> {
    const { players } = await this.football.getSquad();
    const withPhoto = players.filter((p) => p.photo);
    if (withPhoto.length === 0) return 0;

    const dir = join(this.uploads.getUploadDir(), 'football', 'players');
    await mkdir(dir, { recursive: true });

    const existing =
      (await this.readCache<Record<string, string>>(KEY.playerPhotos))
        ?.payload ?? {};
    const next: Record<string, string> = { ...existing };
    let fetched = 0;

    for (const player of withPhoto) {
      if (next[player.id]) continue;
      // Dosya adı oyuncu kimliğinden: `/uploads` 365 gün `immutable`
      // sunuluyor, ama portre yılda bir bile değişmiyor ve değişirse
      // cache anahtarı da silinip yeniden inecek.
      const local = await this.ingestImage(
        dir,
        `p-${player.id}`,
        player.photo,
        'football/players',
      );
      if (local) {
        next[player.id] = local;
        fetched += 1;
        await sleep(150);
      }
    }

    await this.writeCache(KEY.playerPhotos, next);
    return fetched;
  }

  /** Tek görseli indirip diske yazar; başarısızsa null (bölüm görselsiz çizilir). */
  private async ingestImage(
    dir: string,
    name: string,
    url: string | null,
    /** `/uploads/<burası>/<dosya>` — varsayılan armaların klasörü. */
    urlPrefix = 'football',
  ): Promise<string | null> {
    if (!url) return null;
    try {
      const image = await this.remoteImage.fetchImage(url);
      const filename = `${name}${image.extension}`;
      await writeFile(join(dir, filename), image.buffer);
      return `/uploads/${urlPrefix}/${filename}`;
    } catch (error) {
      this.logger.warn(`Görsel indirilemedi (${url}): ${errMsg(error)}`);
      return null;
    }
  }

  // ---- Canlı ---------------------------------------------------------------

  /**
   * Dakikalık canlı yoklama.
   *
   * ⚠️ NEREDEYSE HER ZAMAN HİÇBİR ŞEY YAPMIYOR ve bu bilinçli. Önce cache'teki
   * fikstüre bakıp "şu an bir maç penceresinde miyiz" sorusunu DIŞARI
   * ÇIKMADAN yanıtlıyor; değilsek anında dönüyor. Yalnızca maç saatinde ve
   * yalnızca API-Football planı açıksa gerçek bir istek atılıyor.
   *
   * Bu yapı olmadan dakikada bir dış istek = günde 1440 istek, ücretsiz
   * kotanın 14 katı.
   */
  @Cron('* * * * *', { name: 'football-live-tick', timeZone: 'UTC' })
  async handleLiveTick(): Promise<void> {
    if (this.liveRunning) return;
    if (!this.apiFootball) return;
    if (!this.apiFootball.capabilities().liveScore) return;

    const row = await this.readCache<{ matches: LiveMatch[] }>(
      KEY.fixtures(this.clubKey),
    );
    const matches = row?.payload?.matches ?? [];
    if (!isWithinMatchWindow(matches, Date.now())) {
      // Pencere dışındaysak ve cache'te bayat bir canlı kayıt varsa temizle.
      const live = await this.readCache<LiveMatch | null>(KEY.live);
      if (live?.payload) await this.writeCache(KEY.live, null);
      return;
    }

    this.liveRunning = true;
    try {
      const live = await this.apiFootball.fetchLive(this.clubKey);
      await this.writeCache(KEY.live, live[0] ?? null);
    } catch (error) {
      this.logger.warn(`Canlı yoklama hatası: ${errMsg(error)}`);
    } finally {
      this.liveRunning = false;
    }
  }

  // ---- Cache yardımcıları --------------------------------------------------

  private async readCache<T>(
    cacheKey: string,
  ): Promise<{ payload: T; fetchedAt: Date } | null> {
    const row = await this.prisma.externalCache.findUnique({
      where: { cacheKey },
    });
    if (!row) return null;
    return { payload: row.payload as T, fetchedAt: row.fetchedAt };
  }

  private async writeCache(cacheKey: string, payload: unknown): Promise<void> {
    await this.prisma.externalCache.upsert({
      where: { cacheKey },
      create: { cacheKey, payload: payload as Prisma.InputJsonValue },
      update: {
        payload: payload as Prisma.InputJsonValue,
        fetchedAt: new Date(),
      },
    });
  }
}

interface StoredAssets {
  name: string;
  crest: string | null;
  banner: string | null;
  jersey: string | null;
  fanart: string[];
  stadium: string | null;
  stadiumCapacity: number | null;
  foundedYear: number | null;
  nicknames: string[];
}

// ---- Saf yardımcılar -------------------------------------------------------

function errMsg(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Kronolojik sıra. Tarihi olmayan maçlar (detay bütçesi yetmemiş olabilir)
 * hafta numarasına düşüyor — sona atılmıyor, çünkü fikstür listesi sıralı
 * görünmek zorunda.
 */
function byKickoffThenRound(a: LiveMatch, b: LiveMatch): number {
  if (a.kickoffAt && b.kickoffAt) {
    return Date.parse(a.kickoffAt) - Date.parse(b.kickoffAt);
  }
  const weekOf = (m: LiveMatch): number => {
    const hit = /(\d+)/.exec(m.round ?? '');
    return hit ? Number(hit[1]) : Number.MAX_SAFE_INTEGER;
  };
  return weekOf(a) - weekOf(b);
}

/**
 * Sıralama geçmişi — kulübün her hafta sonunda kaçıncı olduğu.
 *
 * ── BU VERİ HİÇBİR KAYNAKTA HAZIR YOK ────────────────────────────────────
 * TFF yalnızca GÜNCEL tabloyu veriyor, geçmiş haftaların tablosunu değil.
 * Ama ligin 306 maçının SONUCU elimizde; haftalık kümülatif tabloyu
 * hesaplamak toplama işleminden ibaret. Yani bu sayı türetilmiş gerçek veri,
 * uydurma değil — brief'in "sezon boyunca sıralama değişimi" grafiğinin
 * kaynağı bu.
 *
 * ── SIRALAMA ÖLÇÜTÜ ──────────────────────────────────────────────────────
 * Puan → averaj → atılan gol → ad. TFF'nin resmî eşitlik bozma kuralı sezon
 * SONUNDA ikili averaja bakıyor ve o bilgi hafta ortasında zaten belirsiz;
 * bu yüzden burada genel averaj kullanılıyor. Sonuç: eşit puanlı takımlarda
 * geçmiş haftaların sırası resmî tablodan bir basamak ayrılabilir. GÜNCEL
 * sıra bundan etkilenmiyor — o doğrudan TFF'den okunuyor.
 */
export function computePositionHistory(
  leagueMatches: LiveMatch[],
  clubKey: string,
): Array<{ week: number; position: number; points: number }> {
  const weekOf = (m: LiveMatch): number | null => {
    const hit = /(\d+)/.exec(m.round ?? '');
    return hit ? Number(hit[1]) : null;
  };

  const played = leagueMatches.filter(
    (m) =>
      m.status === 'FINISHED' && m.homeGoals !== null && m.awayGoals !== null,
  );
  if (played.length === 0) return [];

  const weeks = [
    ...new Set(played.map(weekOf).filter((w): w is number => w !== null)),
  ].sort((a, b) => a - b);

  const table = new Map<
    string,
    { points: number; gd: number; gf: number; name: string }
  >();
  const out: Array<{ week: number; position: number; points: number }> = [];

  for (const week of weeks) {
    for (const match of played) {
      if (weekOf(match) !== week) continue;
      const home = table.get(match.home.key) ?? {
        points: 0,
        gd: 0,
        gf: 0,
        name: match.home.name,
      };
      const away = table.get(match.away.key) ?? {
        points: 0,
        gd: 0,
        gf: 0,
        name: match.away.name,
      };
      const hg = match.homeGoals as number;
      const ag = match.awayGoals as number;

      home.gf += hg;
      home.gd += hg - ag;
      away.gf += ag;
      away.gd += ag - hg;
      if (hg > ag) home.points += 3;
      else if (hg < ag) away.points += 3;
      else {
        home.points += 1;
        away.points += 1;
      }

      table.set(match.home.key, home);
      table.set(match.away.key, away);
    }

    const ranked = [...table.entries()].sort(
      (a, b) =>
        b[1].points - a[1].points ||
        b[1].gd - a[1].gd ||
        b[1].gf - a[1].gf ||
        a[1].name.localeCompare(b[1].name, 'tr'),
    );
    const index = ranked.findIndex(([key]) => key === clubKey);
    if (index >= 0) {
      out.push({ week, position: index + 1, points: ranked[index][1].points });
    }
  }

  return out;
}

/**
 * Takımın sezon istatistiği — OYNANMIŞ maçlardan HESAPLANIYOR, bir kaynaktan
 * okunmuyor. Sebebi: elimizdeki hiçbir ücretsiz kaynak takım bazlı sezon
 * özeti vermiyor, ama skorlar elimizde ve toplama işlemi uydurma değil
 * TÜRETME. Sıfır maç oynanmışsa null dönüyor ve bölüm çizilmiyor.
 *
 * xG ve topa sahip olma BİLİNÇLE YOK: hiçbir kaynağımız vermiyor ve
 * "ortalama" diye bir sayı uydurmak brief'in ilk yasağını çiğnerdi.
 */
export function computeTeamStats(
  played: LiveMatch[],
  clubKey: string,
): LiveTeamSeasonStats | null {
  if (played.length === 0) return null;

  let won = 0;
  let drawn = 0;
  let lost = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  let cleanSheets = 0;

  for (const match of played) {
    const isHome = match.home.key === clubKey;
    const mine = isHome ? match.homeGoals : match.awayGoals;
    const theirs = isHome ? match.awayGoals : match.homeGoals;
    if (mine === null || theirs === null) continue;

    goalsFor += mine;
    goalsAgainst += theirs;
    if (theirs === 0) cleanSheets += 1;
    if (mine > theirs) won += 1;
    else if (mine < theirs) lost += 1;
    else drawn += 1;
  }

  const total = won + drawn + lost;
  if (total === 0) return null;

  const round2 = (n: number): number => Math.round(n * 100) / 100;
  return {
    played: total,
    won,
    drawn,
    lost,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    cleanSheets,
    goalsForPerMatch: round2(goalsFor / total),
    goalsAgainstPerMatch: round2(goalsAgainst / total),
  };
}

/**
 * "Şu an bir maç penceresinde miyiz?" — dış istek atmadan, cache'teki
 * fikstürden. Pencere: ilk vuruştan 10 dakika ÖNCE başlıyor (diziliş ve
 * "birazdan başlıyor" durumu için) ve 150 dakika sonra bitiyor (uzatma +
 * penaltı + uzun VAR duraklamaları dahil).
 */
export function isWithinMatchWindow(
  matches: LiveMatch[],
  now: number,
): boolean {
  const BEFORE = 10 * 60_000;
  const AFTER = 150 * 60_000;
  return matches.some((m) => {
    if (!m.kickoffAt) return false;
    const kickoff = Date.parse(m.kickoffAt);
    if (!Number.isFinite(kickoff)) return false;
    return now >= kickoff - BEFORE && now <= kickoff + AFTER;
  });
}
