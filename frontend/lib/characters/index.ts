import type { CharacterOverlay } from "./types";
import { ZARAKI_KENPACHI } from "./zaraki-kenpachi";
import { ITACHI_UCHIHA } from "./itachi-uchiha";

/**
 * Elle tasarlanmış karakter sayfaları.
 *
 * Kayıt yoksa sayfa yalnızca AniList künyesiyle açılır — 195 karakterin
 * hepsinin burada olması gerekmiyor ve **beklenmiyor**. Kullanıcı kararı
 * (6 Ağustos 2026): "talep benden gelsin, ben sana Naruto'yu yap derim".
 *
 * Yeni karakter eklemek: `<slug>.ts` dosyası yaz, buraya bir satır ekle.
 */
const OVERLAYS: CharacterOverlay[] = [ZARAKI_KENPACHI, ITACHI_UCHIHA];

const BY_ID = new Map(OVERLAYS.map((overlay) => [overlay.characterId, overlay]));

export function getCharacterOverlay(
  characterId: number,
): CharacterOverlay | null {
  return BY_ID.get(characterId) ?? null;
}

/** Elle tasarlanmış sayfası olan karakterler — dizinde işaretlemek için. */
export function curatedCharacterIds(): number[] {
  return [...BY_ID.keys()];
}

export type { CharacterOverlay } from "./types";
