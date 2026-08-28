import type { SlotRatio, SlotTreatment } from "@/lib/curated/contract";
import { ROSTER } from "./roster";
import { TEAM_ORDER, TEAMS } from "./teams";
import type { Localized, TeamId } from "./types";

/**
 * SLAM DUNK EVRENİ — KÜRATÖR YUVA MANİFESTOSU.
 *
 * Sayfadaki HER görsel alanı burada tanımlı. Çıplak `<Image>` kullanılmıyor;
 * her kadraj `<CourtImage slotId="…" />` üzerinden çiziliyor ve küratör
 * modunda tek tek düzenlenebiliyor.
 *
 * ── ⚠️ YUVA LİSTESİ ELLE YAZILMIYOR ──────────────────────────────────────
 * Kırk beş oyuncu yuvasının kimliği `ROSTER`dan, beş takım yuvası
 * `TEAM_ORDER`dan TÜRETİLİYOR. Bleach'te ölçülmüş arıza: koridorun yazdığı
 * kimlik (`bleach:bankai:katen-kyokotsu-karamatsu`) ile manifestonunki
 * (`katen-kyokotsu`) ayrışınca `slotDef()` `undefined` döndü, `CuratedImage`
 * sessizce `null` bastı ve küratör "yükledim ama görünmüyor" dedi. İki kopya
 * tutulmadığı sürece o sınıf hata doğamaz.
 *
 * ── ⚠️ KİMLİK DEĞİŞTİRME ─────────────────────────────────────────────────
 * `id` veritabanındaki satırın anahtarı (`CuratedImage.slotId`). Yeniden
 * adlandırmak küratörün o yuvaya yüklediği kareyi KOPARIR. Kadrodan bir isim
 * çıkarsa kaydı yetim kalır, hiçbir şey kırılmaz.
 */

/** Veritabanındaki `surface` sütununun değeri. ⚠️ Değiştirme: bütün kayıtlar buna bağlı. */
export const SLAM_DUNK_SURFACE = "anime/slam-dunk";

/**
 * Görsel yokken ne çizilecek.
 *
 * ⚠️ HİÇBİRİ BOŞ KUTU DEĞİL. Kırk beş kartın hepsi fotoğrafsız yayına
 * girecek ve hiçbiri "eksik" görünmemeli — futbol kanadında ve Bleach'te
 * ölçülmüş aynı karar.
 *
 *   jersey  → forma numarası + kanji; kartın kendisi tipografik bir afiş olur
 *   court   → saha çizgisi deseni; geniş sahne kadrajlarının yedeği
 *   void    → takım renginde ışık havuzu + doku, yazı yok
 */
export const SLOT_FALLBACKS = ["jersey", "court", "void"] as const;
export type SlotFallback = (typeof SLOT_FALLBACKS)[number];

/** Küratör panelindeki gruplar — sayfanın çeyrekleriyle birebir. */
export const SLAM_DUNK_SECTIONS = [
  "tipoff",
  "shohoku",
  "matchup",
  "bench",
  "buzzer",
] as const;
export type SlamDunkSectionId = (typeof SLAM_DUNK_SECTIONS)[number];

export const SECTION_LABELS: Record<SlamDunkSectionId, Localized> = {
  tipoff: { tr: "1. Çeyrek · Hava Atışı", en: "1st Quarter · Tip-Off" },
  shohoku: { tr: "2. Çeyrek · Shohoku", en: "2nd Quarter · Shohoku" },
  matchup: { tr: "Devre Arası · Rakipler", en: "Half Time · The Rivals" },
  bench: { tr: "3. Çeyrek · Kenar", en: "3rd Quarter · The Bench" },
  buzzer: { tr: "4. Çeyrek · Son Düdük", en: "4th Quarter · Final Buzzer" },
};

/** TASARIMIN yuva hakkında bildiği her şey — kodda, veritabanında değil. */
export interface CuratedSlotDef {
  /** ⚠️ KARARLI kimlik. Backend biçimi: `^[a-z0-9][a-z0-9:-]*$` */
  id: string;
  section: SlamDunkSectionId;
  /** Küratör panelinde görünen ad */
  label: Localized;
  /** "Ne bulmam gerek" notu — YALNIZCA küratör modunda görünür */
  hint: Localized;
  /** Önerilen piksel boyutu — panelde yazılı */
  size: { w: number; h: number };
  /** İzin verilen oranlar; İLK eleman varsayılan */
  ratios: readonly [SlotRatio, ...SlotRatio[]];
  /** Duotone ve parıltı rengini veren takım. Takımsız kadrajlarda `neutral`. */
  team: TeamId | "neutral";
  /** Varsayılan işlem biçimi — küratör ezebilir */
  treatment: SlotTreatment;
  /** Görsel yokken devreye giren tasarım */
  fallback: SlotFallback;
  /** Yedek üstüne basılacak işaret: forma numarası ya da kanji */
  glyph?: string;
  /** İlk kıvrım: `priority` */
  eager?: boolean;
}

// ---------------------------------------------------------------------------
// Yuva aileleri — kimlikler TEK yerden türetiliyor
// ---------------------------------------------------------------------------

/** Bir kadro kaydının portre yuvası. */
export const playerSlotId = (id: string) => `slam-dunk:player:${id}`;
/** Takımın geniş sahne bandı. */
export const teamSlotId = (team: TeamId) => `slam-dunk:team:${team}`;

/**
 * Kırk beş portre yuvası — `ROSTER`dan türetiliyor.
 *
 * Oran 3:4 çünkü kart dikey ve manga kareleri de dikey kadrajlanıyor. Koç ve
 * menajer kayıtlarında yedek `jersey` değil `void`: forma numaraları yok ve
 * boş bir numara alanı çizmek "eksik veri" hissi üretirdi.
 */
const PLAYER_SLOTS: CuratedSlotDef[] = ROSTER.map((member) => {
  const isStarter = member.team === "shohoku" && member.starter;
  return {
    id: playerSlotId(member.id),
    section:
      member.team === "shohoku"
        ? member.role === "player"
          ? "shohoku"
          : "bench"
        : member.role === "player"
          ? "matchup"
          : "bench",
    label: {
      tr: `${member.name} · ${TEAMS[member.team].name}`,
      en: `${member.name} · ${TEAMS[member.team].name}`,
    },
    hint:
      member.role === "player"
        ? {
            tr: `${member.name} tek başına, forması görünecek şekilde dikey kadraj. Manga karesi ya da anime ekran görüntüsü olabilir.`,
            en: `${member.name} alone, framed vertically with the jersey visible. A manga panel or an anime still both work.`,
          }
        : {
            tr: `${member.name} — kenardan, portre kadraj.`,
            en: `${member.name} — a portrait framing from the sideline.`,
          },
    size: { w: 640, h: 854 },
    ratios: ["3:4", "4:5", "1:1"],
    team: member.team,
    treatment: "photo",
    fallback: member.role === "player" ? "jersey" : "void",
    glyph: member.role === "player" ? String(member.number ?? "") : member.kanji,
    /* Sahnedeki beş kart ilk kıvrımda: `priority` yalnızca onlarda. */
    eager: isStarter,
  } satisfies CuratedSlotDef;
});

/** Beş takım bandı — takım seçildiğinde arkaya yerleşen geniş kadraj. */
const TEAM_SLOTS: CuratedSlotDef[] = TEAM_ORDER.map((team) => ({
  id: teamSlotId(team),
  section: team === "shohoku" ? "shohoku" : "matchup",
  label: {
    tr: `${TEAMS[team].name} · takım bandı`,
    en: `${TEAMS[team].name} · team band`,
  },
  hint: {
    tr: `${TEAMS[team].school} kadrosu bir arada ya da salonda geniş bir sahne karesi. Yatay, metnin arkasına yerleşecek.`,
    en: `The ${TEAMS[team].school} squad together, or a wide court scene. Landscape — it sits behind the text.`,
  },
  size: { w: 1920, h: 823 },
  ratios: ["21:9", "2:1", "16:9"],
  team,
  treatment: "duotone",
  fallback: "court",
}));

/**
 * Sahne kadrajları — takıma bağlı olmayan geniş kareler.
 *
 * ⚠️ `hero` `eager`: ilk kıvrımın tamamını o kaplıyor ve geç gelmesi
 * sayfanın açılışını boş bırakırdı.
 */
const SCENE_SLOTS: CuratedSlotDef[] = [
  {
    id: "slam-dunk:hero",
    section: "tipoff",
    label: { tr: "Açılış kadrajı", en: "Opening frame" },
    hint: {
      tr: "Sayfanın açılış karesi: Shohoku ilk beşi ya da parkeye yukarıdan bakan geniş bir sahne. Çok geniş kadraj, metin üstüne biner.",
      en: "The opening frame: the Shohoku starting five, or a wide look down at the floor. Ultra-wide — text sits on top of it.",
    },
    size: { w: 2560, h: 1097 },
    ratios: ["21:9", "2:1", "16:9"],
    team: "shohoku",
    treatment: "photo",
    fallback: "court",
    eager: true,
  },
  {
    id: "slam-dunk:coast",
    section: "tipoff",
    label: { tr: "Kamakura sahil yolu", en: "The Kamakura coast" },
    hint: {
      tr: "Serinin açılış sahnesi: sahil yolu, demiryolu geçidi, deniz. Paralaks bandın arkasına yerleşiyor — yatay ve sakin bir kare olmalı.",
      en: "The series' opening scene: the coast road, the level crossing, the sea. It sits behind the parallax band, so a calm landscape frame works best.",
    },
    size: { w: 2560, h: 1280 },
    ratios: ["2:1", "21:9", "16:9"],
    team: "neutral",
    treatment: "duotone",
    fallback: "void",
  },
  {
    id: "slam-dunk:gym",
    section: "matchup",
    label: { tr: "Salon", en: "The gym" },
    hint: {
      tr: "Rakip seçicinin arkasındaki salon: tribün, parke, ışık. Kalabalık bir maç anı iyi durur.",
      en: "The gym behind the matchup selector: stands, floor, lights. A crowded game moment works well.",
    },
    size: { w: 1920, h: 1080 },
    ratios: ["16:9", "2:1", "21:9"],
    team: "neutral",
    treatment: "duotone",
    fallback: "court",
  },
  {
    id: "slam-dunk:buzzer",
    section: "buzzer",
    label: { tr: "Son saniye", en: "The final second" },
    hint: {
      tr: "Sannoh maçının son sayısı — Sakuragi ile Rukawa’nın el çakışması ya da bitiş sireni anı. Sayfanın kapanış karesi.",
      en: "The last basket of the Sannoh game — the high five between Sakuragi and Rukawa, or the buzzer itself. This is the page's closing frame.",
    },
    size: { w: 2560, h: 1097 },
    ratios: ["21:9", "2:1", "16:9"],
    team: "shohoku",
    treatment: "photo",
    fallback: "court",
  },
];

/**
 * MANİFESTO — tek doğruluk kaynağı.
 *
 * 45 portre + 5 takım bandı + 4 sahne = 54 yuva.
 */
export const SLAM_DUNK_SLOTS: CuratedSlotDef[] = [
  ...SCENE_SLOTS,
  ...TEAM_SLOTS,
  ...PLAYER_SLOTS,
];

const BY_ID = new Map(SLAM_DUNK_SLOTS.map((slot) => [slot.id, slot]));

/** Kimlikten yuva tanımı. Tanınmayan kimlikte `undefined` — çizim sessizce düşer. */
export function slotDef(id: string): CuratedSlotDef | undefined {
  return BY_ID.get(id);
}

/** Yuvanın varsayılan oranı — kayıt bir şey söylemediyse bu geçerli. */
export function defaultRatio(slot: CuratedSlotDef): SlotRatio {
  return slot.ratios[0];
}

/**
 * Kayıttaki oran geçerli mi?
 *
 * Doğrulama BACKEND'DE DEĞİL burada: hangi oranların geçerli olduğunu yalnızca
 * manifesto biliyor. Tanınmayan değer sessizce varsayılana düşüyor.
 */
export function resolveRatio(
  slot: CuratedSlotDef,
  stored: string | null | undefined,
): SlotRatio {
  const allowed = slot.ratios as readonly string[];
  return stored && allowed.includes(stored)
    ? (stored as SlotRatio)
    : defaultRatio(slot);
}

/** Küratör panelinin bölüm bölüm listesi. */
export function slotsBySection(): {
  section: SlamDunkSectionId;
  slots: CuratedSlotDef[];
}[] {
  return SLAM_DUNK_SECTIONS.map((section) => ({
    section,
    slots: SLAM_DUNK_SLOTS.filter((slot) => slot.section === section),
  })).filter((group) => group.slots.length > 0);
}
