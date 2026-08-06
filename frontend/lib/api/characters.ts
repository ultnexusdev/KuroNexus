import { apiFetch } from "./client";
import type { CharacterDetail, CharacterIndex } from "./types";

/**
 * Karakter dizini ve karakter dosyası.
 *
 * Uçlar şimdilik anime kanadının altında (`/anime/characters`) çünkü kaynak
 * AniList. Film/dizi karakterleri geldiğinde bu dosya ikinci bir çağırıcı
 * kazanır; **dönen tipler kaynağa bağlı değil**, bileşenler değişmez.
 */

const EMPTY_INDEX: CharacterIndex = {
  characters: [],
  series: [],
  stats: { characters: 0, series: 0, main: 0 },
};

/**
 * Dizin. Kaynak düşerse salon boş açılır, sayfa çökmez — arşivin geri kalanı
 * (AGENTS.md kural 4) aynı davranışı gösteriyor.
 *
 * Önbellek bir saat: liste backend'de zaten günlük cache'li, buradaki kısa
 * pencere yalnızca aynı dakika içindeki tekrar isteklerini eler.
 */
export async function getCharacterIndex(): Promise<CharacterIndex> {
  try {
    return await apiFetch<CharacterIndex>("/anime/characters", {
      next: { revalidate: 3600 },
    });
  } catch {
    return EMPTY_INDEX;
  }
}

/** Karakter dosyası. Bulunamazsa `null` → sayfa 404 verir. */
export async function getCharacterDetail(
  characterId: string,
): Promise<CharacterDetail | null> {
  // Sayısal olmayan kimlik backend'e hiç gitmesin: rota parametresi elle
  // yazılabilir bir yer ve `ParseIntPipe` orada 400 üretirdi — kullanıcıya
  // 404 göstermek doğru cevap, 400 değil
  if (!/^\d+$/.test(characterId)) {
    return null;
  }
  try {
    return await apiFetch<CharacterDetail>(
      `/anime/characters/${characterId}`,
      { next: { revalidate: 86400 } },
    );
  } catch {
    return null;
  }
}
