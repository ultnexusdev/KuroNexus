import type { SlotRatio } from "@/lib/curated/contract";

/**
 * ANİME SALONU — KÜRATÖR YUVA MANİFESTOSU.
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * `/anime` giriş sayfasındaki kareler bugüne kadar **karakter görselleri
 * mekanizmasının** üzerinden geliyordu: Pain'in kaydına `ABILITY` slotu
 * olarak, `abilityName` alanına `akatsuki:hall-hero` gibi anahtarlar
 * yazılarak (`EXHIBIT_IMAGE_KEYS`). Sergi için yazılmış bir mekanizma
 * salonun kapı kareleri için ödünç alınmıştı.
 *
 * Bedeli kullanıcı bildirimiyle görüldü (29 Ağustos 2026): "anime kısmında
 * da küratör modu olsun, mesela Slam Dunk evrenini ekledik onun resmi yok."
 * O kareyi koymanın yolu admin panelinden Pain'in dosyasına gidip uydurma
 * bir yetenek adı yazmaktı — yani pratikte yolu yoktu.
 *
 * ── ⚠️ ESKİ KARELER KAYBOLMUYOR ──────────────────────────────────────────
 * Geçiş yıkıcı değil: `HallArt` önce bu yüzeydeki kaydı arıyor, yoksa
 * `EXHIBIT_IMAGE_KEYS` üzerinden gelen ESKİ kareye düşüyor. Yani hero,
 * Naruto ve Bleach kartları ilk günden olduğu gibi duruyor; küratör
 * üstlerine yazdığı anda yeni mekanizmaya geçiyorlar.
 *
 * ── YUVA SAYISI KÜÇÜK, BİLEREK ───────────────────────────────────────────
 * Bleach'in altmış yuvası var ve orada bölüm bölüm gruplanmış bir panel
 * gerekiyor. Burada yedi kare var; hepsi ekranda yan yana duruyor ve
 * kalemler kartların köşesinde. Ayrı bir "eksik görseller" paneli
 * yazılmadı — okunacak liste zaten sayfanın kendisi.
 */

/** Veritabanındaki `surface` sütununun değeri. ⚠️ Değiştirme: kayıtlar buna bağlı. */
export const ANIME_HALL_SURFACE = "anime/hall";

/** İki dilli etiket — yalnızca küratör panelinde görünüyor. */
export interface HallText {
  tr: string;
  en: string;
}

export function hallPick(value: HallText, locale: string): string {
  return locale === "en" ? value.en : value.tr;
}

export interface HallSlotDef {
  /** ⚠️ KARARLI kimlik. Backend biçimi: `^[a-z0-9][a-z0-9:-]*$` */
  id: string;
  label: HallText;
  /** "Ne bulmam gerek" notu — yalnızca küratör modunda görünür */
  hint: HallText;
  /** Önerilen piksel boyutu — panelde yazılı */
  size: { w: number; h: number };
  /** İzin verilen kırpma oranları; İLK eleman varsayılan */
  ratios: readonly [SlotRatio, ...SlotRatio[]];
}

/** Dünya kartlarının ortak kadraj notu — yedi kez yazmanın anlamı yok. */
const CARD_HINT: HallText = {
  tr: "Kartın arka fonu. Alt yarısına başlık ve künye biniyor, yani kompozisyonun ağırlığı ÜST tarafta olsun; alt üçte bir sakin kalsın. Koyu ve düşük kontrastlı kareler daha iyi duruyor — sayfa zaten üstüne bir karartma maskesi basıyor.",
  en: "The card's backdrop. The title and meta sit over the lower half, so keep the weight of the composition in the UPPER part and the bottom third calm. Dark, low-contrast frames work best — the page already lays a darkening mask over it.",
};

export const ANIME_HALL_SLOTS: readonly HallSlotDef[] = [
  {
    id: "anime:hall:hero",
    label: { tr: "Salon girişi · hero fonu", en: "Hall opening · hero backdrop" },
    hint: {
      tr: "Sayfanın açılış kadrajı, tam genişlik. Üstüne ANİME başlığı ve bir cümle biniyor; ortası sakin, kenarları dolu bir kompozisyon en iyisi. Kare varken vitrin afişleri HİÇ çizilmiyor.",
      en: "The page's opening frame, full width. The ANIME title and a sentence sit on top of it; a composition that is calm in the middle and full at the edges works best. When this is filled the showcase posters are not drawn at all.",
    },
    size: { w: 1920, h: 1080 },
    ratios: ["16:9", "21:9", "2:1"],
  },
  {
    id: "anime:world:akatsuki",
    label: { tr: "Dünya kartı · Akatsuki", en: "World card · Akatsuki" },
    hint: CARD_HINT,
    size: { w: 1240, h: 780 },
    ratios: ["16:9", "3:2"],
  },
  {
    id: "anime:world:naruto",
    label: { tr: "Dünya kartı · Naruto Evreni", en: "World card · Naruto" },
    hint: CARD_HINT,
    size: { w: 1240, h: 780 },
    ratios: ["16:9", "3:2"],
  },
  {
    id: "anime:world:bleach",
    label: { tr: "Dünya kartı · Bleach Evreni", en: "World card · Bleach" },
    /* ⚠️ Bu kartın kendi kuralı var: kare hover'da ortadan DİKEY olarak
       ikiye yarılıyor (Senkaimon'un mikro hâli). Tam ortada duran bir yüz
       ya da bir yazı yarılmada ikiye bölünür. */
    hint: {
      tr: "Kartın arka fonu — ama bu kartta kare hover'da TAM ORTADAN dikey olarak yarılıyor. Kompozisyonun merkezine yüz, yazı ya da tek bir nesne koyma; ortası boş, ağırlığı iki yana dağılmış kadrajlar doğru sonucu veriyor.",
      en: "The card's backdrop — but on this card the frame splits vertically down the MIDDLE on hover. Do not put a face, a word or a single object at the centre; frames with an empty middle and weight spread to both sides work correctly.",
    },
    size: { w: 1240, h: 780 },
    ratios: ["16:9", "3:2"],
  },
  {
    id: "anime:world:slamdunk",
    label: { tr: "Dünya kartı · Slam Dunk Evreni", en: "World card · Slam Dunk" },
    hint: CARD_HINT,
    size: { w: 1240, h: 780 },
    ratios: ["16:9", "3:2"],
  },
  {
    id: "anime:world:onepiece",
    label: { tr: "Dünya kartı · One Piece", en: "World card · One Piece" },
    hint: CARD_HINT,
    size: { w: 1240, h: 780 },
    ratios: ["16:9", "3:2"],
  },
  {
    id: "anime:world:archive",
    label: { tr: "Dünya kartı · Anime Arşivi", en: "World card · Anime archive" },
    hint: CARD_HINT,
    size: { w: 1240, h: 780 },
    ratios: ["16:9", "3:2"],
  },
];

const BY_ID = new Map(ANIME_HALL_SLOTS.map((slot) => [slot.id, slot]));

export function hallSlotDef(id: string): HallSlotDef | undefined {
  return BY_ID.get(id);
}

/**
 * Kayıttaki oran geçerli mi?
 *
 * Doğrulama BURADA, backend'de değil: hangi oranların geçerli olduğunu
 * yalnızca manifesto biliyor. Tanınmayan değer sessizce varsayılana
 * düşüyor — kayıt bozulmuyor, çizim kırılmıyor (Bleach'teki aynı kural).
 */
export function hallRatio(
  slot: HallSlotDef,
  stored: string | null | undefined,
): SlotRatio {
  const allowed = slot.ratios as readonly string[];
  return stored && allowed.includes(stored) ? (stored as SlotRatio) : slot.ratios[0];
}
