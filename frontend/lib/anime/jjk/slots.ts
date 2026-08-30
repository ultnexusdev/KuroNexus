import type { SlotRatio, SlotTreatment } from "@/lib/curated/contract";
import { ARCHETYPES } from "./archetypes";
import { DOMAINS } from "./domains";
import { SPIRITS } from "./spirits";
import type { DomainSlug, Localized } from "./types";

/**
 * JUJUTSU KAISEN EVRENİ — KÜRATÖR YUVA MANİFESTOSU.
 *
 * Bleach manifestosunun deseni aynen: sayfadaki HER görsel alanı burada
 * tanımlı, çıplak `<Image>` yok, her kadraj `<CuratedImage slotId>` ile
 * çiziliyor ve küratör modunda yerinde düzenleniyor.
 *
 * ── SAYFANIN GÖRSEL SÖZLEŞMESİ ───────────────────────────────────────────
 * "Lanetli Arşiv" mockup'ının dip notu: 11 bölüm tamamlandı, GÖRSELLER
 * BEKLENİYOR. Kullanıcı kararı (30 Ağustos 2026): önce yuvalar açılır,
 * görsel üretimi ayrı bir tur. Sayfa görselsiz EKSİKSİZ görünmek zorunda —
 * her yuvanın `typographic`/`void` yedeği tasarımın kendisi.
 *
 * Bilinçli olarak YUVASIZ bölümler: Parmaklar (mühürlü dosya dili),
 * Shibuya (operasyon haritası bir diyagram, fotoğraf değil), Kıyım kural
 * defteri ve Son Kayıt (kapanış metin sayfası). Buralara yuva eklemek
 * içerik kararıdır; "eksik" değil.
 *
 * ── ⚠️ KİMLİK DEĞİŞTİRME ─────────────────────────────────────────────────
 * `id` veritabanındaki satırın anahtarı (`CuratedImage.slotId`). Yeniden
 * adlandırmak küratörün yüklediği kareyi KOPARIR. Yuva kullanımdan
 * kalkarsa kimliği bırak, listeden çıkar.
 */

/** Veritabanındaki `surface` sütununun değeri. ⚠️ Değiştirme. */
export const JJK_SURFACE = "anime/jjk";

export {
  SLOT_RATIOS,
  SLOT_TREATMENTS,
  SLOT_BLENDS,
} from "@/lib/curated/contract";
export type {
  SlotRatio,
  SlotTreatment,
  SlotBlend,
} from "@/lib/curated/contract";

/** Görsel yokken ne çizilecek — Bleach'teki üçlü, aynı anlamlarla. */
export const SLOT_FALLBACKS = ["silhouette", "typographic", "void"] as const;
export type SlotFallback = (typeof SLOT_FALLBACKS)[number];

/** Manifestodaki bölüm başlıkları — panel bunlara göre gruplanıyor */
export const JJK_SECTIONS = [
  "veil",
  "society",
  "spirits",
  "domain",
  "archetypes",
  "culling",
] as const;
export type JjkSectionId = (typeof JJK_SECTIONS)[number];

export const SECTION_LABELS: Record<JjkSectionId, Localized> = {
  veil: { tr: "P01 · Perde", en: "P01 · The Veil" },
  society: { tr: "P04 · Jujutsu Toplumu", en: "P04 · Jujutsu Society" },
  spirits: { tr: "P06 · Lanet Arşivi", en: "P06 · The Curse Archive" },
  domain: { tr: "P07 · Alan Genişlemesi", en: "P07 · Domain Expansion" },
  archetypes: { tr: "P08 · Arketipler", en: "P08 · The Archetypes" },
  culling: { tr: "P11 · Kıyım Oyunu", en: "P11 · The Culling Game" },
};

/** TASARIMIN yuva hakkında bildiği her şey — Bleach sözleşmesinin aynısı. */
export interface CuratedSlotDef {
  /** ⚠️ KARARLI kimlik. Backend biçimi: `^[a-z0-9][a-z0-9:-]*$` */
  id: string;
  section: JjkSectionId;
  label: Localized;
  hint: Localized;
  size: { w: number; h: number };
  ratios: readonly [SlotRatio, ...SlotRatio[]];
  treatment: SlotTreatment;
  fallback: SlotFallback;
  src?: string;
  srcCredit?: string;
  eager?: boolean;
}

// ---------------------------------------------------------------------------
// Yuva aileleri — kimlikler veri dosyalarından TÜRETİLİYOR (Bankai dersi:
// elle ikinci kopya, bir gün sessizce kayar).
// ---------------------------------------------------------------------------

export const domainSlotId = (slug: DomainSlug) => `jjk:domain:${slug}`;
export const spiritSlotId = (slug: string) => `jjk:spirit:${slug}`;
export const archeSlotId = (slug: string) => `jjk:arche:${slug}`;
export const societySlotId = (key: string) => `jjk:society:${key}`;

const SOCIETY_FRAMES: { key: "tokyo" | "kyoto" | "hq"; name: string; hint: Localized }[] = [
  {
    key: "tokyo",
    name: "東京呪術高専 · Tokyo Jujutsu High",
    hint: {
      tr: "Tokyo kampüsü — geleneksel çatı hattı, merdivenler ya da tören kapısı. Geniş yatay kadraj; üstüne yazı binmiyor.",
      en: "The Tokyo campus — traditional roofline, stairs or the ceremonial gate. Wide horizontal frame; no text sits on it.",
    },
  },
  {
    key: "kyoto",
    name: "京都呪術高専 · Kyoto Jujutsu High",
    hint: {
      tr: "Kyoto kampüsü — daha eski, daha kapalı bir mimari. Geniş yatay kadraj; Tokyo karesiyle aynı ışıkta olmasa da olur, duotone eşitler.",
      en: "The Kyoto campus — older, more closed-off architecture. Wide horizontal; it need not match Tokyo's light, the duotone evens them out.",
    },
  },
  {
    key: "hq",
    name: "総監部 · Jujutsu Headquarters",
    hint: {
      tr: "Karargâh — yüz gösterilmez: koridor, perde arkası silüetler, boş toplantı salonu. Kurumun kendisi değil sorumsuzluğu hissedilsin.",
      en: "Headquarters — no faces: a corridor, silhouettes behind screens, an empty council room. What should read is not the institution but its unaccountability.",
    },
  },
];

// ---------------------------------------------------------------------------
// Manifesto
// ---------------------------------------------------------------------------

export const JJK_SLOTS: readonly CuratedSlotDef[] = [
  /* ══ P01 · PERDE ═════════════════════════════════════════════════════ */
  {
    id: "jjk:veil:skyline",
    section: "veil",
    label: { tr: "Açılış · Tokyo silueti", en: "Opening · Tokyo skyline" },
    hint: {
      tr: "Gece Tokyo silueti, geniş yatay — perde şehrin ÜZERİNE iniyor. Ufuk çizgisi karenin alt üçte birinde kalsın; üst taraf gökyüzü, oraya kızıl perde dokusu biniyor. Işıklı pencereler iyi, tek baskın bina kötü.",
      en: "A night skyline of Tokyo, wide horizontal — the curtain falls OVER the city. Keep the horizon in the lower third; the sky above receives the crimson veil texture. Lit windows read well, one dominant tower does not.",
    },
    size: { w: 2560, h: 1200 },
    ratios: ["21:9", "2:1", "16:9"],
    treatment: "duotone",
    fallback: "void",
    eager: true,
  },

  /* ══ P04 · JUJUTSU TOPLUMU ═══════════════════════════════════════════ */
  ...SOCIETY_FRAMES.map<CuratedSlotDef>((frame) => ({
    id: societySlotId(frame.key),
    section: "society",
    label: { tr: `Kurum · ${frame.name}`, en: `Institution · ${frame.name}` },
    hint: frame.hint,
    size: { w: 1600, h: 900 },
    ratios: ["16:9", "3:2", "2:1"],
    treatment: "duotone",
    fallback: "typographic",
  })),

  /* ══ P06 · LANET ARŞİVİ ══════════════════════════════════════════════
     Portre tehdit değerlendirme PANELİNDE duruyor, katalogda değil —
     katalogdaki silüet/blur dili bölümün tezi ve fotoğrafla bozulmaz. */
  ...SPIRITS.map<CuratedSlotDef>((spirit) => ({
    id: spiritSlotId(spirit.slug),
    section: "spirits",
    label: { tr: `Dosya · ${spirit.name}`, en: `File · ${spirit.name}` },
    hint: {
      tr: `${spirit.name} — dosya açılınca panelde görünen kare. Dikey portre, koyu zemin; yüz/biçim üst yarıda. Kayıt açılmış bir dosya gibi okunmalı, poster gibi değil.`,
      en: `${spirit.name} — the frame shown in the assessment panel once the file is opened. Vertical portrait, dark ground, the figure in the upper half. It should read like an opened file, not a poster.`,
    },
    size: { w: 720, h: 960 },
    ratios: ["3:4", "4:5"],
    treatment: "duotone",
    fallback: "typographic",
  })),

  /* ══ P07 · ALAN GENİŞLEMESİ ══════════════════════════════════════════
     Aynı yuva iki yerde çiziliyor: bölüm içindeki kadraj ve tam ekran
     devralma. Devralma `fill` ile çiziyor — ikinci yuva AÇILMADI, tek
     kare iki kadraj (Bleach hero'nun dört şerit kararıyla aynı sınıf). */
  ...DOMAINS.map<CuratedSlotDef>((domain) => ({
    id: domainSlotId(domain.slug),
    section: "domain",
    label: {
      tr: `Alan · ${domain.jp} · ${domain.caster}`,
      en: `Domain · ${domain.jp} · ${domain.caster}`,
    },
    hint: {
      tr: `${domain.caster} — ${domain.en}. Alanın kendisi: mekân, doku, ışık. Figür şart değil; kare tam ekran devralmada da basılıyor, o yüzden geniş ve sinematik düşün. Palet bölümünkiyle yarışmasın — duotone zaten alanın iki tonuna çekiyor.`,
      en: `${domain.caster} — ${domain.en}. The domain itself: place, texture, light. A figure is optional; the same frame is shown in the full-screen takeover, so think wide and cinematic. Don't fight the section palette — the duotone pulls it into the domain's own two tones.`,
    },
    size: { w: 2560, h: 1440 },
    ratios: ["16:9", "2:1", "21:9"],
    treatment: "duotone",
    fallback: "void",
  })),

  /* ══ P08 · ARKETİPLER ════════════════════════════════════════════════ */
  ...ARCHETYPES.map<CuratedSlotDef>((arche) => ({
    id: archeSlotId(arche.slug),
    section: "archetypes",
    label: { tr: `Portre · ${arche.name}`, en: `Portrait · ${arche.name}` },
    hint: {
      tr: `${arche.name} — seçili arketipin sağ panelindeki portre. Dikey kadraj (2:3), tek figür, sade zemin; yüz üst üçte birde. Naruto portre kutusu kuralı: kutunun oranı kaynağın oranı, kırpma yok.`,
      en: `${arche.name} — the portrait in the selected archetype's panel. Vertical (2:3), a single figure on a plain ground, face in the upper third. Same rule as the Naruto portrait boxes: the box takes the source's ratio, no cropping.`,
    },
    size: { w: 800, h: 1200 },
    ratios: ["2:3", "3:4"],
    treatment: "photo",
    fallback: "typographic",
  })),

  /* ══ P11 · KIYIM OYUNU ═══════════════════════════════════════════════ */
  {
    id: "jjk:culling:map",
    section: "culling",
    label: { tr: "Japonya haritası — koloni fonu", en: "Map of Japan — colony backdrop" },
    hint: {
      tr: "Japonya'nın soyut/koyu bir haritası ya da uydu gecesi — koloni iğneleri ÜSTÜNE biniyor, o yüzden düşük kontrast ve az detay şart. Kıyı çizgisi okunur olsun, şehir adları olmasın.",
      en: "An abstract/dark map of Japan or a night satellite view — the colony pins sit ON TOP, so low contrast and little detail are required. The coastline should read; city names should not exist.",
    },
    size: { w: 2400, h: 1050 },
    ratios: ["21:9", "2:1", "16:9"],
    treatment: "duotone",
    fallback: "void",
  },
];

// ---------------------------------------------------------------------------
// Yardımcılar — Bleach'in birebir kardeşleri
// ---------------------------------------------------------------------------

const BY_ID = new Map(JJK_SLOTS.map((slot) => [slot.id, slot]));

export function slotDef(id: string): CuratedSlotDef | undefined {
  return BY_ID.get(id);
}

export function slotsBySection(): { section: JjkSectionId; slots: CuratedSlotDef[] }[] {
  return JJK_SECTIONS.map((section) => ({
    section,
    slots: JJK_SLOTS.filter((slot) => slot.section === section),
  })).filter((group) => group.slots.length > 0);
}

export function defaultRatio(slot: CuratedSlotDef): SlotRatio {
  return slot.ratios[0];
}

export function resolveRatio(
  slot: CuratedSlotDef,
  stored: string | null | undefined,
): SlotRatio {
  const allowed = slot.ratios as readonly string[];
  return stored && allowed.includes(stored)
    ? (stored as SlotRatio)
    : defaultRatio(slot);
}
