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
  FavouritePlayer,
} from "./players/types";

export { DEFAULT_SECTION_ORDER } from "./players/types";
export { FAVOURITE_PLAYERS } from "./players/index";

import type { FavouritePlayer, PlayerImageSlot } from "./players/types";
import { FAVOURITE_PLAYERS } from "./players/index";

export function findFavouritePlayer(slug: string): FavouritePlayer | undefined {
  return FAVOURITE_PLAYERS.find((player) => player.slug === slug);
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
 * Küratör paneli ve künye toplayıcı bunu okuyor; yuva eklendiğinde iki yerde
 * birden güncellemek gerekmesin diye burada türetiliyor.
 */
export function allSlotsOf(player: FavouritePlayer): PlayerImageSlot[] {
  return [
    player.hero,
    player.card,
    player.stats.club.crest,
    ...player.career.map((stop) => stop.image),
    ...player.nights.map((night) => night.image),
    ...player.gallery,
  ];
}
