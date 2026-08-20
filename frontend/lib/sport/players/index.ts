import type { FavouritePlayer } from "./types";
import { mauroIcardi } from "./icardi";

/**
 * FUTBOLCU DEFTERİNİN KAYIT LİSTESİ.
 *
 * Sıra ÖNEMLİ: hub sayfasındaki favori futbolcu rayı (`PlayerRail`) bu diziyi
 * olduğu gibi basıyor ve ilk kart çift genişlikte çiziliyor. Yani buradaki
 * ilk kayıt şeridin açılış kartı oluyor.
 *
 * Efsaneler salonu ayrı bir liste tutmuyor: `legendEpithet` alanı dolu olan
 * her kayıt salonda DA görünüyor. Bir oyuncunun iki yerde birden olması
 * kullanıcının açık kararı (20 Ağustos 2026) ve iki kart da aynı sayfaya
 * gidiyor — `sportHref.favouritePlayer(slug)`.
 *
 * Yeni kayıt eklerken: `players/<slug>.ts` dosyasını aç, buraya import et,
 * diziye yaz. Başka hiçbir yere dokunma.
 */
export const FAVOURITE_PLAYERS: FavouritePlayer[] = [mauroIcardi];
