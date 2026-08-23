import type { Localized } from "./types";

/**
 * MASKE DUVARI — P11'in verisi.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Bleach denince akla maske gelir. Bu bölüm bir kadro değil bir **duvar**:
 * bir çizgiye asılmış sekiz maske, altlarında kısa gölgeler. Küçük ama
 * sayfanın en fotojenik parçası.
 *
 * ── ⚠️ SON MASKE BÖLÜMÜ DEKORATİF OLMAKTAN ÇIKARIYOR ────────────────────
 * En sağdaki kafatasının sahibi YOK ve bu bilinçli. 名も無き — adı
 * olmayanlar. Rukongai'de ölen ve kimsenin aramadığı ruhlar. Yedi tanınmış
 * yüzün yanına bir isimsiz koymak, duvarı bir hayran vitrininden bir
 * kayda çeviriyor.
 *
 * ── HEPSİ FANDOM'DAN DOĞRULANDI (23 Ağustos 2026) ────────────────────────
 * Dört Visored maskesinin tarifi canon'dan alındı ve çizimler ona göre:
 *   Ichigo   — tehditkâr bir kafatası, SOL yanında üç şerit
 *   Shinji   — firavun maskesi, ensesinde kısa bir başlık
 *   Kensei   — düz hokey maskesi, **iki sütun hâlinde altı yarık göz**
 *   Hiyori   — iskelet; alnının ORTASINDA tek boynuz, kaşların üstünde
 *              baklava dizisi
 *   Nelliel  — çizgi film kafatası; SOL yanında bir çatlak ve **kırılmış
 *              dört diş**
 * Hafızadan çizilseydi hiçbiri bu kadar ayırt edilebilir olmazdı.
 */

export interface MaskRecord {
  id: string;
  /** Sahibinin adı — ÇEVRİLMEZ. İsimsiz maskede `null`. */
  owner: string | null;
  /** Sahibi yoksa bunun yerine kanji + başlık geliyor */
  kanji?: string;
  /** Tek satırlık künye */
  note: Localized;
  /**
   * Sayfa içi çapa — yalnızca hedef GERÇEKTEN varsa çiziliyor
   * (`READY_SECTIONS` denetliyor). Ölü bir çapa, olmayan bir bağlantıdan
   * kötüdür; sayfanın her yerinde aynı kural.
   */
  anchor?: string;
}

export const MASK_WALL: readonly MaskRecord[] = [
  {
    id: "ichigo",
    owner: "Ichigo Kurosaki",
    note: {
      tr: "İçindeki Hollow'u yenerek kazandığı maske. Sol yanındaki şeritler kavga uzadıkça çoğaldı.",
      en: "The mask he won by beating down his inner Hollow. The stripes on its left side multiplied as the fight went on.",
    },
  },
  {
    id: "shinji",
    owner: "Shinji Hirako",
    note: {
      tr: "Firavun maskesi; ensesinde kısa bir başlık. Visored'ların ilk konuşanı.",
      en: "A pharaoh's mask with a short hood at the nape. The first of the Visored to speak.",
    },
  },
  {
    id: "kensei",
    owner: "Kensei Muguruma",
    note: {
      tr: "Düz bir hokey maskesi: iki sütun hâlinde altı yarık göz. Eskiden Dokuzuncu Bölük kaptanıydı.",
      en: "A flat hockey guard: six slitted eyes in two columns. He was once captain of the Ninth Division.",
    },
  },
  {
    id: "hiyori",
    owner: "Hiyori Sarugaki",
    note: {
      tr: "İskelet; alnının ortasında tek boynuz, kaşların üstünde baklava dizisi.",
      en: "Skeletal; a single horn centred on the forehead, a row of diamonds above the brow.",
    },
  },
  {
    id: "ulquiorra",
    owner: "Ulquiorra Cifer",
    note: {
      tr: "Maske değil kalıntı: kırık boynuzlu miğfer, başının sol üst yanında.",
      en: "Not a mask but a remnant: a broken horned helmet on the upper left of his head.",
    },
    anchor: "#espada",
  },
  {
    id: "grimmjow",
    owner: "Grimmjow Jaegerjaquez",
    note: {
      tr: "Sağ çene kemiği. Arrancar'ın maskesinden geriye kalan tek parça.",
      en: "The right jawbone. The only piece left of the Arrancar's mask.",
    },
    anchor: "#espada",
  },
  {
    id: "nelliel",
    owner: "Nelliel Tu Odelschwanck",
    note: {
      tr: "Başının üstünde duran kafatası: sol yanı çatlak, dört dişi kırık. Eski Üçüncü Espada.",
      en: "The skull that sits on her head: cracked down the left, four teeth broken off. Formerly the Tres Espada.",
    },
    anchor: "#espada",
  },
  {
    /* ⚠️ Sahibi YOK ve olmayacak. Bölümün alt metni bu. */
    id: "nameless",
    owner: null,
    kanji: "名も無き",
    note: {
      tr: "Rukongai'de ölen ve kimsenin aramadığı ruhlar. Duvardaki yedi yüzün yanında bir de bunlar var.",
      en: "The souls who died in Rukongai and whom no one came looking for. Beside the seven faces on this wall, there are also these.",
    },
  },
];
