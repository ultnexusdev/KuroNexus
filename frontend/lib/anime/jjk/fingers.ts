import type { Localized } from "./types";

/**
 * P09 · SUKUNA'NIN 20 PARMAĞI — kasıtlı olarak eksik arşiv.
 *
 * Bölümün tezi: bu dosya EKSİK olduğu için doğru. Bin yıl önce yakılamayan
 * yirmi parçanın büyük kısmı hiç kayda geçmedi ya da Kenjaku envanterine
 * geçtiği için silindi. "Kayıt yok" satırları veri eksikliği değil,
 * arşivin kendisi — Bleach'in "mühür açılmadı" kararıyla aynı sınıf.
 *
 * Etkileşim: her parmağa dokunmak dosyayı açar; açılan dosyalar ziyaretçiye
 * özel `localStorage`ta tutulur (kullanıcı kararı, 30 Ağustos 2026) —
 * "arşivi açma" ilerlemesi ziyaretler arasında korunur.
 */
export type FingerStatus =
  | "swallowed" // yutuldu
  | "partial" // kayıt kısmi
  | "forced" // zorla yutturuldu
  | "lost" // kayıt yok
  | "complete"; // tamamlandı — yirminci parça

export const FINGER_STATUS_LABEL: Record<FingerStatus, Localized> = {
  swallowed: { tr: "yutuldu", en: "swallowed" },
  partial: { tr: "kayıt kısmi", en: "partial record" },
  forced: { tr: "zorla yutturuldu", en: "force-fed" },
  lost: { tr: "kayıt yok", en: "no record" },
  complete: { tr: "tamamlandı", en: "complete" },
};

export interface FingerRecord {
  /** 1–20 */
  n: number;
  title: Localized;
  place: Localized;
  holder: Localized;
  arc: Localized;
  note: Localized;
  status: FingerStatus;
}

/** "Kayıt yok" satırlarının ortak kalıbı — on bir kez elle yazılmıyor. */
function lostFinger(
  n: number,
  arc: Localized,
  title: Localized,
  note: Localized,
): FingerRecord {
  return {
    n,
    title,
    place: { tr: "Bilinmiyor", en: "Unknown" },
    holder:
      n <= 10
        ? { tr: "Kenjaku envanteri", en: "Kenjaku's inventory" }
        : { tr: "dolaşımda", en: "in circulation" },
    arc,
    note,
    status: "lost",
  };
}

const SEALED: Localized = { tr: "Mühürlü Dosya", en: "Sealed File" };
const CIRCULATING: Localized = { tr: "Dolaşımda", en: "In Circulation" };
const AFTER_SHIBUYA: Localized = { tr: "Shibuya sonrası", en: "after Shibuya" };
const DURING_GAME: Localized = { tr: "Kıyım Oyunu", en: "the Culling Game" };
const NO_RECORD: Localized = { tr: "Kayıt yok.", en: "No record." };

export const FINGERS: readonly FingerRecord[] = [
  {
    n: 1,
    title: { tr: "İlk Parça", en: "The First Piece" },
    place: {
      tr: "Sugisawa Lisesi — depo, Sendai",
      en: "Sugisawa High — storeroom, Sendai",
    },
    holder: { tr: "Yuji Itadori (yuttu)", en: "Yuji Itadori (swallowed)" },
    arc: { tr: "Yuji Itadori'nin İnfazı", en: "The Execution of Yuji Itadori" },
    note: {
      tr: "Okul deposunda özel derece bir laneti çeken parça. Yuji onu yuttuğunda Sukuna bin yıl sonra ilk kez bir bedene yerleşti ve arşivin bu dosyası açıldı.",
      en: "The piece that drew a special grade curse to a school storeroom. When Yuji swallowed it, Sukuna settled into a body for the first time in a thousand years — and this file was opened.",
    },
    status: "swallowed",
  },
  {
    n: 2,
    title: { tr: "İkinci Parça", en: "The Second Piece" },
    place: { tr: "Islahevi — Tokyo çevresi", en: "Juvenile detention centre — near Tokyo" },
    holder: { tr: "Yuji Itadori (yuttu)", en: "Yuji Itadori (swallowed)" },
    arc: {
      tr: "Lanetli Rahim: Ölüm Resmi öncesi",
      en: "before Cursed Womb: Death Paintings",
    },
    note: {
      tr: "Görev sırasında ele geçen ikinci parça. Yuji'nin kap olarak dayanıklılığı burada ölçüldü: Sukuna'nın yüzeye çıkma girişimi kontrol altında tutuldu.",
      en: "The second piece, recovered on assignment. Yuji's endurance as a vessel was measured here: Sukuna's attempt to surface was held in check.",
    },
    status: "swallowed",
  },
  {
    n: 3,
    title: { tr: "Nakil Kaydı", en: "The Transfer Record" },
    place: {
      tr: "Kardeş Okul Etkinliği — nakil hattı",
      en: "Kyoto Goodwill Event — transfer line",
    },
    holder: { tr: "Jujutsu Karargâhı", en: "Jujutsu Headquarters" },
    arc: { tr: "Kardeş Okul Etkinliği", en: "The Kyoto Goodwill Event" },
    note: {
      tr: "Etkinlik sırasında lanetler tarafından hedef alınan nakil. Karargâh kaydı olayın ardından kısmen mühürlendi.",
      en: "A transfer targeted by curses during the event. Headquarters partially sealed the record afterwards.",
    },
    status: "partial",
  },
  {
    n: 4,
    title: { tr: "Shibuya Kaydı", en: "The Shibuya Record" },
    place: { tr: "Shibuya — 31 Ekim", en: "Shibuya — October 31" },
    holder: { tr: "Kenjaku", en: "Kenjaku" },
    arc: { tr: "Shibuya Olayı", en: "The Shibuya Incident" },
    note: {
      tr: "Shibuya'nın asıl amacı Gojo'yu mühürlemekti; parmaklar aynı gece Yuji'ye zorla yutturuldu. Bu, Sukuna'nın gücünün ilk büyük sıçraması oldu.",
      en: "Shibuya's real objective was sealing Gojo; the fingers were force-fed to Yuji the same night. It was the first great leap in Sukuna's power.",
    },
    status: "forced",
  },
  lostFinger(5, AFTER_SHIBUYA, SEALED, {
    tr: "Kayıt yok. Karargâh envanteri Shibuya sonrası büyük ölçüde geçersiz sayıldı.",
    en: "No record. The headquarters inventory was largely voided after Shibuya.",
  }),
  lostFinger(6, AFTER_SHIBUYA, SEALED, {
    tr: "Kayıt yok. Parmakların dolaşımı Kenjaku'nun planına göre yönlendirildi.",
    en: "No record. The circulation of the fingers was steered by Kenjaku's plan.",
  }),
  lostFinger(7, AFTER_SHIBUYA, SEALED, {
    tr: "Kayıt yok. Dosya erişimi özel derece yetkisiyle sınırlandı.",
    en: "No record. File access was restricted to special grade clearance.",
  }),
  lostFinger(8, AFTER_SHIBUYA, SEALED, NO_RECORD),
  lostFinger(9, AFTER_SHIBUYA, SEALED, NO_RECORD),
  lostFinger(10, AFTER_SHIBUYA, SEALED, NO_RECORD),
  lostFinger(
    11,
    { tr: "Kıyım Oyunu öncesi", en: "before the Culling Game" },
    CIRCULATING,
    {
      tr: "Kayıt yok. Parmakların bir kısmı oyun kurallarının teşvik ettiği el değiştirmelerle dağıldı.",
      en: "No record. Some of the fingers scattered through trades the game's rules encouraged.",
    },
  ),
  lostFinger(12, DURING_GAME, CIRCULATING, NO_RECORD),
  lostFinger(13, DURING_GAME, CIRCULATING, NO_RECORD),
  lostFinger(14, DURING_GAME, CIRCULATING, NO_RECORD),
  lostFinger(15, DURING_GAME, CIRCULATING, NO_RECORD),
  lostFinger(16, DURING_GAME, CIRCULATING, NO_RECORD),
  lostFinger(17, DURING_GAME, CIRCULATING, NO_RECORD),
  lostFinger(18, DURING_GAME, CIRCULATING, NO_RECORD),
  lostFinger(
    19,
    { tr: "Kıyım Oyunu — son aşama", en: "the Culling Game — final phase" },
    { tr: "Son Aşama", en: "The Final Phase" },
    {
      tr: "Kayıt yok. Son parçaların toplanması bir tesadüf değil, oyunun tasarlanmış sonucuydu.",
      en: "No record. The gathering of the last pieces was not chance — it was the game's designed outcome.",
    },
  ),
  {
    n: 20,
    title: { tr: "Yirminci Parça", en: "The Twentieth Piece" },
    place: { tr: "Shinjuku", en: "Shinjuku" },
    holder: { tr: "Ryomen Sukuna", en: "Ryomen Sukuna" },
    arc: { tr: "Shinjuku Hesaplaşması", en: "The Shinjuku Showdown" },
    note: {
      tr: "Yirminci parça tamamlandığında Sukuna artık bir kalıntı değil, tam kapasiteli bir varlıktı. Arşivin bu satırı kırmızıyla yazılır.",
      en: "With the twentieth piece complete, Sukuna was no longer a remnant but a being at full capacity. This line of the archive is written in red.",
    },
    status: "complete",
  },
];
