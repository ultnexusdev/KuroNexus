import type { CharacterOverlay } from "./types";
import { ITACHI_ID, ITACHI_IDENTITY, ITACHI_QUOTES } from "./itachi-experience";

/**
 * Itachi Uchiha — katman kaydı.
 *
 * Bu karakterin sayfası klasik dossier DEĞİL: rota, characterId 14 için
 * `ItachiExperience`e dallanıyor (interaktif deneyim sayfası; içerik
 * `itachi-experience.ts`te). Bu ince katmanın iki işi var:
 *
 * 1. Deneyim bileşeni bir gün kaldırılırsa dossier'in çıplak AniList
 *    künyesine değil, en azından epigraph + künye + alıntılara düşmesi.
 * 2. (Henüz tüketilmiyor) curatedCharacterIds ile dizin rozeti — dizin
 *    bileşeni o listeyi okumaya başladığında Itachi kendiliğinden dahil.
 */
export const ITACHI_UCHIHA: CharacterOverlay = {
  characterId: ITACHI_ID,
  epigraph: ITACHI_IDENTITY.epigraph,
  tags: [
    { tr: "Akatsuki", en: "Akatsuki" },
    { tr: "Eski ANBU Yüzbaşısı", en: "Former ANBU Captain" },
    { tr: "Uchiha Klanı", en: "Uchiha Clan" },
  ],
  facts: ITACHI_IDENTITY.facts.map((fact) => ({
    label: fact.label,
    value: fact.value,
  })),
  quotes: ITACHI_QUOTES.map((quote) => ({ text: quote.text })),
};
