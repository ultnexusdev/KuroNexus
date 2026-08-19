import { apiFetch } from "./client";

/**
 * Salon 06 · Futbol · CANLI VERİ — okuma istemcisi.
 *
 * Backend'deki `football-live` modülünün ön yüz karşılığı. İki uç, iki farklı
 * yaşam süresi:
 *
 * `fetchClubLive()` — sayfanın TAMAMI, tek istek. Sunucu bileşeninden çağrılıyor.
 * `fetchLiveScore()` — yalnızca canlı skor. Maç saatinde istemciden yoklanıyor;
 *                      sayfanın tamamını yeniden çekmemek için ayrı ve küçük.
 *
 * ── TİPLER NEDEN "OLABİLİR NULL" ─────────────────────────────────────────
 * Bu kanadın verisi kaynağa göre KADEMELİ doluyor: puan durumu ve fikstür
 * bugün gerçek veriyle geliyor (TFF), canlı dakika ve oyuncu istatistiği ise
 * ancak API-Football planı yükseltilince açılıyor. Alanları zorunlu yazmak,
 * bugün var olmayan veriyi varmış gibi göstermeye zorlardı. `capabilities`
 * alanı da tam bu yüzden var: sayfa "bu bölüm neden yok" sorusunu tahminle
 * değil, sunucunun beyanıyla cevaplıyor.
 */

export type LiveMatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "HALFTIME"
  | "FINISHED"
  | "POSTPONED"
  | "CANCELLED";

export interface LiveTeamRef {
  name: string;
  key: string;
  crest: string | null;
}

export interface LiveMatch {
  id: string;
  kickoffAt: string | null;
  competition: string;
  round: string | null;
  home: LiveTeamRef;
  away: LiveTeamRef;
  homeGoals: number | null;
  awayGoals: number | null;
  status: LiveMatchStatus;
  minute: number | null;
  venue: string | null;
  source: string;
}

export interface LiveStandingRow {
  position: number;
  team: LiveTeamRef;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  note: string | null;
}

export interface LiveStandings {
  seasonLabel: string;
  rows: LiveStandingRow[];
  updateNote: string | null;
  /** CC BY-SA / resmî kaynak künyesi — ÇİZİLMESİ ZORUNLU, bkz. tablo altı */
  attribution: string;
  source: string;
}

export interface LivePlayerSeasonStats {
  appearances: number | null;
  minutes: number | null;
  goals: number | null;
  assists: number | null;
  yellowCards: number | null;
  redCards: number | null;
  rating: number | null;
}

export interface LiveSquadPlayer {
  id: string;
  name: string;
  position: string | null;
  shirtNumber: number | null;
  photo: string | null;
  nationality: string | null;
  birthDate: string | null;
  /**
   * Sezon istatistiği — YALNIZCA istatistik sağlayıcısı açıkken dolu.
   * Ücretsiz katmanda alan hiç gelmiyor; aşağıdaki künye alanları geliyor.
   */
  season?: LivePlayerSeasonStats;
  age?: number | null;
  heightInCm?: number | null;
  foot?: string | null;
  marketValueInEur?: number | null;
  /** "Centre-Forward", "Left-Back" — `position`tan daha ayrıntılı */
  detailedPosition?: string | null;
  /** Küratörün admin panelinden elle eklediği oyuncu mu? */
  isManual?: boolean;
}

export interface LiveScorer {
  name: string;
  team: string | null;
  goals: number;
}

export interface LiveTeamSeasonStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  cleanSheets: number | null;
  goalsForPerMatch: number | null;
  goalsAgainstPerMatch: number | null;
}

export interface ClubNewsItem {
  title: string;
  link: string;
  publishedAt: string | null;
  summary: string | null;
}

export interface PositionPoint {
  week: number;
  position: number;
  points: number;
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

export interface ClubLiveOverview {
  season: { label: string; startYear: number };
  club: ClubIdentity | null;
  lastMatch: LiveMatch | null;
  nextMatch: LiveMatch | null;
  live: LiveMatch | null;
  form: LiveMatch[];
  fixtures: LiveMatch[];
  standings: LiveStandings | null;
  teamStats: LiveTeamSeasonStats | null;
  /**
   * Haftalık sıralama. Ligin bütün sonuçlarından TÜRETİLİYOR — hiçbir kaynak
   * geçmiş haftaların tablosunu vermiyor ama 306 maçın skoru elimizde ve
   * kümülatif tablo toplama işleminden ibaret.
   */
  positionHistory: PositionPoint[];
  scorers: LiveScorer[];
  /** Kulübün RESMÎ RSS beslemesinden gelen haberler (haber şeridi) */
  news: ClubNewsItem[];
  squad: LiveSquadPlayer[];
  capabilities: { liveScore: boolean; playerSeasonStats: boolean };
  updatedAt: string | null;
}

/**
 * Sayfanın veri çağrısı.
 *
 * `no-store`: veri günde bir cron'la tazeleniyor ama küratör panelden elle de
 * tetikleyebiliyor ve maç günü skor değişiyor — arada bir ön yüz cache'i
 * beklemek istenmiyor. Backend zaten cache'ten okuduğu için bu istek ucuz.
 */
export function fetchClubLive(clubSlug: string): Promise<ClubLiveOverview> {
  return apiFetch<ClubLiveOverview>(
    `/football-live/club/${encodeURIComponent(clubSlug)}`,
    { cache: "no-store" },
  );
}

export function fetchLiveScore(): Promise<{
  match: LiveMatch | null;
  updatedAt: string | null;
}> {
  return apiFetch<{ match: LiveMatch | null; updatedAt: string | null }>(
    "/football-live/live",
    { cache: "no-store" },
  );
}

// ---- Türetilmiş okuyucular -------------------------------------------------

export type FormResult = "W" | "D" | "L";

/**
 * Bir maçın bizim açımızdan sonucu. Maç bitmemişse ya da skor eksikse null —
 * "bilinmiyor"u beraberlik saymak formu yanlış gösterirdi.
 */
export function resultOf(match: LiveMatch, clubKey: string): FormResult | null {
  if (match.status !== "FINISHED") return null;
  const isHome = match.home.key === clubKey;
  const mine = isHome ? match.homeGoals : match.awayGoals;
  const theirs = isHome ? match.awayGoals : match.homeGoals;
  if (mine === null || theirs === null) return null;
  if (mine > theirs) return "W";
  if (mine < theirs) return "L";
  return "D";
}

/** Kulübün bu maçtaki rakibi. */
export function opponentOf(match: LiveMatch, clubKey: string): LiveTeamRef {
  return match.home.key === clubKey ? match.away : match.home;
}

/** Maç kulübün sahasında mı? */
export function isHomeGame(match: LiveMatch, clubKey: string): boolean {
  return match.home.key === clubKey;
}

/**
 * Sayfanın "maç günü kipi".
 *
 * Brief dört durum istiyor ve dördü de VERİDEN türetiliyor, elle
 * ayarlanmıyor:
 *   live     — şu an oynanıyor
 *   today    — ilk vuruşa 6 saatten az
 *   soon     — 72 saatten az
 *   complete — son maç 12 saat içinde bitti
 *   idle     — hiçbiri
 *
 * `now` dışarıdan veriliyor ki sunucu ve istemci aynı ana baksın; bileşen
 * içinde `Date.now()` çağırmak hidrasyon uyuşmazlığı üretirdi.
 */
export type MatchdayMode = "live" | "today" | "soon" | "complete" | "idle";

export function matchdayMode(
  overview: Pick<ClubLiveOverview, "live" | "nextMatch" | "lastMatch">,
  now: number,
): MatchdayMode {
  if (overview.live) return "live";

  const kickoff = overview.nextMatch?.kickoffAt
    ? Date.parse(overview.nextMatch.kickoffAt)
    : null;
  if (kickoff !== null && Number.isFinite(kickoff)) {
    const delta = kickoff - now;
    if (delta > 0 && delta <= 6 * 3600_000) return "today";
    if (delta > 0 && delta <= 72 * 3600_000) return "soon";
  }

  const last = overview.lastMatch?.kickoffAt
    ? Date.parse(overview.lastMatch.kickoffAt)
    : null;
  if (last !== null && Number.isFinite(last)) {
    const since = now - last;
    // İlk vuruştan 2 saat sonra maç bitmiş sayılıyor; 14 saate kadar
    // "maç tamamlandı" hâli sürüyor (gece maçından sonraki sabah dahil).
    if (since >= 2 * 3600_000 && since <= 14 * 3600_000) return "complete";
  }

  return "idle";
}
