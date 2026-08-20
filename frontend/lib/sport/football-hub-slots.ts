import type { PlayerImageSlot } from "./favourite-players";

/**
 * Salon 06 · Futbol — HUB SAYFASININ KENDİ GÖRSEL YUVALARI.
 *
 * ── NEDEN AYRI BİR "SAHİP" ───────────────────────────────────────────────
 * Küratör görselleri `FavouritePlayerImage` tablosunda `playerSlug` sütunuyla
 * gruplanıyor. Hub sayfasının yuvaları (hero plakası, tarih şeridi kareleri)
 * hiçbir futbolcuya ait değil — sayfanın kendisine ait. Onları da aynı
 * tabloda tutmak için sabit bir sahip adı kullanılıyor: `futbol-hub`.
 *
 * Backend'de yeni bir şey gerekmedi ve bilinçli olarak gerekmemesi
 * sağlandı: uç `playerSlug`ın defterde karşılığı olup olmadığına BAKMIYOR
 * (bkz. `sport-archive.controller.ts`), yani sayfa yuvaları da aynı yoldan
 * geçiyor.
 *
 * ⚠️ SAHİP ADINI DEĞİŞTİRME. Küratörün yüklediği kareler bu dizeye bağlı;
 * değiştirmek hepsini koparır.
 */
export const HUB_OWNER = "futbol-hub";

/**
 * Hero plakası.
 *
 * `placeholder` YOK: depoda çalışan bir kare var (CC0, Türk Telekom Arena
 * gece karesi) ve küratör beğenmezse üstüne yazıyor. Yer tutucu göstermek
 * burada yanlış olurdu — sayfanın ilk kıvrımı hiçbir koşulda boş kalmamalı.
 */
export const HUB_HERO_SLOT: PlayerImageSlot = {
  id: "hero",
  owner: HUB_OWNER,
  src: "/spor/futbol/stadyum-gece.webp",
  alt: "",
  hint: "Geniş gece stadyumu karesi · yatay · ışık huzmeleri",
  width: 1400,
  height: 614,
  credit: null,
};

/**
 * Tarih şeridindeki bir kaydın karesi.
 *
 * ── NEDEN TÜRETİLMİŞ KİMLİK ──────────────────────────────────────────────
 * Hub ucu anları kimliksiz döndürüyor (`{ year, titleTr, kind, era }`).
 * Küratör düzenlemesinin bir yere bağlanması gerektiği için kimlik kaydın
 * KENDİSİNDEN üretiliyor: kulüp + dönem + yıl. Üçü birden değişmedikçe
 * kimlik sabit; değişirse zaten başka bir andan söz ediyoruz.
 *
 * Backend'e `id` eklemek daha temiz olurdu ama iki servisi birden deploy
 * etmeyi gerektirirdi ve kazancı bu üçlüden fazlası değil.
 */
export function historySlot(
  clubSlug: string,
  eraSlug: string,
  year: number,
  title: string,
): PlayerImageSlot {
  return {
    id: `tarih-${clubSlug}-${eraSlug}-${year}`,
    owner: HUB_OWNER,
    src: "",
    alt: "",
    placeholder: true,
    hint: `${year} · ${title}`,
    width: 1200,
    height: 800,
    credit: null,
  };
}
