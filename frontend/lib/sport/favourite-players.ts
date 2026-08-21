/**
 * Salon 06 · Futbol — FAVORİ FUTBOLCULAR DEFTERİ (dışarıya bakan yüz).
 *
 * ── NEDEN BURADA, VERİTABANINDA DEĞİL ────────────────────────────────────
 * Kulüp, efsane ve dönem kayıtları backend'de çünkü küratör panelinden
 * yazılıyorlar ve iki dilli. Favori futbolcu BAŞKA bir şey: bu bir liste
 * değil, bir SEÇKİ — her girdi kendi renk atmosferini, kendi kompozisyonunu
 * ve kendi anlatı ritmini taşıyor. Bunlar veri değil TASARIM.
 *
 * Ama fotoğraf veridir: küratör bir kare yüklediğinde herkeste, her cihazda
 * görünmeli. Bu yüzden görseller veritabanında (`FavouritePlayerImage`),
 * defter kodda. Bu ayrım bilinçli ve korunmalı.
 *
 * ── DOSYA NEDEN BÖLÜNDÜ (20 Ağustos 2026) ────────────────────────────────
 * Kayıtlar `players/<slug>.ts` altına taşındı; bu dosya artık yalnızca bir
 * YÜZ: tipleri ve yardımcıları dışarı veriyor. Gerekçesi `players/types.ts`
 * başında yazılı (boyut + çakışma).
 *
 * ⚠️ Bu dosyanın import yolu KORUNDU. `@/lib/sport/favourite-players` yazan
 * her bileşen (sayfa, PlayerHero, PlayerRail, LegendsHall, küratör) tek harf
 * değiştirmeden çalışmaya devam ediyor.
 */

export type {
  PlayerImageSlot,
  PlayerPalette,
  PlayerVoice,
  PlayerHeroForm,
  PlayerSignature,
  PlayerRhythm,
  PlayerTexture,
  PlayerSection,
  PlayerDesign,
  CareerStop,
  UnforgettableNight,
  PersonalNote,
  StatEntry,
  PlayerStats,
  PlayerFilm,
  FavouritePlayer,
} from "./players/types";

export {
  DEFAULT_SECTION_ORDER,
  clubLangOf,
  nameLangOf,
  nameLangOfCode,
} from "./players/types";
export { FAVOURITE_PLAYERS } from "./players/index";

import { slotsOf, type FavouritePlayer, type PlayerImageSlot } from "./players/types";
import { FAVOURITE_PLAYERS } from "./players/index";

export function findFavouritePlayer(slug: string): FavouritePlayer | undefined {
  return FAVOURITE_PLAYERS.find((player) => player.slug === slug);
}

/**
 * Bu slug defterde var mı?
 *
 * ── NİYE GEREKLİ ─────────────────────────────────────────────────────────
 * Efsaneler İKİ kaynaktan geliyor: backend kayıtları (`FootballLegend`) ve
 * defterdeki futbolcular. Hagi 21 Ağustos 2026'da deftere taşındı ama
 * backend kaydı da yerinde duruyor — yani aynı kişi iki kaynakta birden
 * var. Süzülmezse salonda iki kez görünür ve iki kart FARKLI sayfalara
 * gider (biri eski belge düzenine, biri yeni postere).
 *
 * Kural: aynı slug iki kaynakta varsa DEFTER kazanır. Defter kaydı tasarım
 * eksenlerini taşıyor, yani asıl sayfa o.
 */
export function isInNotebook(slug: string): boolean {
  return FAVOURITE_PLAYERS.some((player) => player.slug === slug);
}

/**
 * Efsaneler salonunda görünecek kayıtlar.
 *
 * Ayrı bir liste tutulmuyor: `legendEpithet` dolu olan her futbolcu salona
 * giriyor. Aynı oyuncunun favori şeridinde DE durması bir çakışma değil,
 * kullanıcının kararı — iki kart da aynı sayfaya gidiyor.
 */
export function legendaryPlayers(): FavouritePlayer[] {
  return FAVOURITE_PLAYERS.filter((player) => Boolean(player.legendEpithet));
}

/**
 * Sayfadaki BÜTÜN görsel yuvaları, tek düz liste.
 *
 * ⚠️ Sayım burada DEĞİL, `players/types.ts` içinde (`slotsOf`). Kayıt
 * defteri de aynı listeyi okuyup yuvalara sahibini damgalıyor; iki kopya
 * tutulsaydı biri güncellenip diğeri unutulabilirdi. Bu ad yalnızca
 * dışarıya bakan yüz — çağıran hiçbir sayfa değişmedi.
 */
export const allSlotsOf: (player: FavouritePlayer) => PlayerImageSlot[] =
  slotsOf;
