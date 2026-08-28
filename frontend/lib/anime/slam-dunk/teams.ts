import type { Localized, TeamId } from "./types";

/**
 * SLAM DUNK EVRENİ — BEŞ TAKIM.
 *
 * ── ⚠️ BURADA RENK YOK ───────────────────────────────────────────────────
 * Takımın rengi bir CSS meselesi ve `SlamDunk.module.css` içinde
 * `[data-team="…"]` bloklarında duruyor (karakter sayfası sisteminde
 * öğrenilen düzen: palet bileşenin kendi modülünde, `globals.css`te değil).
 * Kayıtta hex tutmak, aynı rengin iki dosyada ayrışmasına açık kapı
 * bırakırdı.
 *
 * ── KAYNAK ───────────────────────────────────────────────────────────────
 * Skorlar ve kadro bilgisi `slamdunk.fandom.com` takım sayfalarındaki maç
 * çizelgelerinden; kanji adlar ja.wikipedia "SLAM DUNKの登場人物"tan.
 * ⚠️ Fandom'un kadro listeleri Bleach turunda üç kez yanlış çıkmıştı —
 * buradaki her satır künye kutusundan tek tek doğrulandı.
 */

export interface Team {
  id: TeamId;
  /** Latin harfli kısa ad — ÇEVRİLMEZ */
  name: string;
  /** Tam okul adı — ÇEVRİLMEZ */
  school: string;
  /** Kanji — ÇEVRİLMEZ */
  kanji: string;
  /** İl. Dördü Kanagawa, Sannoh Akita. ÇEVRİLMEZ (özel ad). */
  prefecture: string;
  /** Kaptan / koç kadro kimliği (`roster.ts`) */
  captain: string;
  coach: string;
  /** Sıralama satırı — turnuvadaki yeri */
  standing: Localized;
  /** İki cümlelik takım karakteri */
  blurb: Localized;
  /** Shohoku ile oynadığı en belirleyici maç: skor satırı */
  clash: {
    /** "70-66" — Shohoku ÖNCE yazılır. ÇEVRİLMEZ. */
    score: string;
    stage: Localized;
    /** Shohoku kazandı mı */
    shohokuWon: boolean;
  } | null;
}

export const TEAMS: Record<TeamId, Team> = {
  shohoku: {
    id: "shohoku",
    name: "Shohoku",
    school: "Shohoku High School",
    kanji: "湘北高校",
    prefecture: "Kanagawa",
    captain: "akagi",
    coach: "anzai",
    standing: {
      tr: "Kanagawa 2.’si · Ulusal turnuva 3. tur",
      en: "Kanagawa runner-up · National tournament round 3",
    },
    blurb: {
      tr: "Kimsenin adını bilmediği okul. Bir yıl önce elemelerden çıkamayan kadro, dört yeni parçayla ülkenin bir numarasını deviriyor: acemi bir ribaunt canavarı, bir çaylak dâhi, dönen bir üç sayıcı ve yıldırım hızında bir kurucu.",
      en: "The school nobody had heard of. A squad that could not clear the prelims a year earlier topples the country's number one with four new parts: a rookie rebounding monster, a freshman prodigy, a returning three-point shooter and a point guard made of lightning.",
    },
    clash: null,
  },

  ryonan: {
    id: "ryonan",
    name: "Ryonan",
    school: "Ryonan High School",
    kanji: "陵南高校",
    prefecture: "Kanagawa",
    captain: "uozumi",
    coach: "taoka",
    standing: {
      tr: "Kanagawa 3.’sü",
      en: "Kanagawa third place",
    },
    blurb: {
      tr: "Sahilin öbür ucundaki okul; Shohoku’nun aynadaki yansıması. Taoka’nın acımasız kondisyon programı ve Sendoh’un okuma gücü, Kanagawa’nın en dengeli hücum üçlüsünü kuruyor — ama yedek kulübesi ince.",
      en: "The school at the other end of the coast, Shohoku's mirror image. Taoka's brutal conditioning and Sendoh's reading of the game build Kanagawa's most balanced scoring trio — but the bench is thin.",
    },
    clash: {
      score: "70-66",
      stage: { tr: "Kanagawa finalleri, 3. tur", en: "Kanagawa finals, round 3" },
      shohokuWon: true,
    },
  },

  kainan: {
    id: "kainan",
    name: "Kainan",
    school: "Kainan University Affiliated High School",
    kanji: "海南大附属高校",
    prefecture: "Kanagawa",
    captain: "maki",
    coach: "takato",
    standing: {
      tr: "Kanagawa şampiyonu · 17 yıldır ulusal turnuvada · Ülke 2.’si",
      en: "Kanagawa champions · 17 straight national appearances · National runner-up",
    },
    blurb: {
      tr: "“Kanagawa’nın Kralları.” On yedi yıl üst üste ulusal turnuva, dipsiz bir yedek kulübesi ve hiç bitmeyen kondisyon. Maki tek başına bir hücum sistemi; yedekleri bile bölge yarı finalisti takımları dağıtıyor.",
      en: "The \"Kings of Kanagawa.\" Seventeen straight trips to the nationals, a bottomless bench and stamina that never runs out. Maki is an offence on his own; even their reserves dismantle regional semi-finalists.",
    },
    clash: {
      score: "88-90",
      stage: { tr: "Kanagawa finalleri, 1. tur", en: "Kanagawa finals, round 1" },
      shohokuWon: false,
    },
  },

  shoyo: {
    id: "shoyo",
    name: "Shoyo",
    school: "Shoyo High School",
    kanji: "翔陽高校",
    prefecture: "Kanagawa",
    captain: "fujima",
    coach: "fujima",
    standing: {
      tr: "Kanagawa çeyrek finali",
      en: "Kanagawa quarter-finals",
    },
    blurb: {
      tr: "Kanagawa’nın en uzun kadrosu: ilk beşin dördü 190 santimin üstünde. Kaptanları aynı zamanda koçları — Fujima kenarda takımı yönetiyor, sahaya girdiğinde maçın temposunu tek başına değiştiriyor.",
      en: "Kanagawa's tallest line-up: four of the starting five stand over 190 cm. Their captain is also their coach — Fujima runs the team from the sideline, then changes the tempo single-handedly when he steps on court.",
    },
    clash: {
      score: "62-60",
      stage: { tr: "Kanagawa çeyrek finali", en: "Kanagawa quarter-final" },
      shohokuWon: true,
    },
  },

  sannoh: {
    id: "sannoh",
    name: "Sannoh",
    school: "Sannoh Industry Affiliated High School",
    kanji: "山王工業高校",
    prefecture: "Akita",
    captain: "fukatsu",
    coach: "domoto",
    standing: {
      tr: "Üç yıllık ulusal şampiyon · AA sınıfı",
      en: "Three-year defending national champions · Class AA",
    },
    blurb: {
      tr: "Japonya’nın bir numarası. Ülkenin en iyi pivotu ve en iyi lise oyuncusu aynı beşte. Zayıf rakibi bile gece boyunca çalışıyor, üniversite takımlarıyla prova yapıyorlar — ve adı duyulmamış bir Kanagawa takımına bir sayı farkla yeniliyorlar.",
      en: "Japan's number one. The country's best centre and best high-school player in the same starting five. They study even weak opponents all night and scrimmage against college teams — then lose by a single point to an unknown Kanagawa side.",
    },
    clash: {
      score: "79-78",
      stage: {
        tr: "Ulusal turnuva, 2. tur",
        en: "National tournament, round 2",
      },
      shohokuWon: true,
    },
  },
};

/** Çizim sırası: ev sahibi önce, sonra rakipler zorluk sırasına yakın. */
export const TEAM_ORDER: TeamId[] = [
  "shohoku",
  "ryonan",
  "kainan",
  "shoyo",
  "sannoh",
];

/** Rakip seçicide görünenler — Shohoku ev sahibi, listede yok. */
export const RIVAL_ORDER: TeamId[] = ["ryonan", "kainan", "shoyo", "sannoh"];
