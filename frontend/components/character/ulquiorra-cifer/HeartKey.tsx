"use client";

import { useHeart } from "./HollowShell";
import styles from "./HollowExperience.module.css";

/**
 * Bir bölümün deliğe verdiği CEVAP — mekaniğin bölüm ucundaki yarısı.
 *
 * Sayfanın kalbi tek bir yerde toplanmıyor: delik ızgaranın ortasında, cevap
 * düğmeleri ise bölümlerin içinde. Kilit bunu şart koşuyor ("her bölüm deliğe
 * bir cevap veriyor"), ama teknik sonucu da önemli: bölümler SUNUCU bileşeni
 * kalabiliyor ve istemciye yalnızca bu küçük düğme iniyor.
 *
 * Durumu `HollowShell`in context'inden okuyor. Sunucuda çizilmiş `children`
 * ağacı sağlayıcının ALTINDA kaldığı için context sorunsuz iniyor — sunucu
 * bileşenleri istemciye çekilmiyor (aynı desen `CuratorFrame`de yazılı).
 *
 * ⚠️ Aynı düğme hem verir hem geri alır: `aria-pressed` durumu taşıyor,
 * etiket de değişiyor. İki ayrı düğme olsaydı sekme sırası her basışta
 * değişirdi.
 */
export function HeartKey({
  answerKey,
  glyph,
  romaji,
  label,
  press,
  note,
  givenLabel,
  takeBackLabel,
}: {
  answerKey: string;
  /** Kanji — bir TERİM (数 / 力 / 目 / 名 / 命令), replik değil */
  glyph: string;
  romaji: string;
  label: string;
  /** Basılmamışken düğmenin metni */
  press: string;
  /** Verildikten sonra okunan satır — cevabın neden yetmediği */
  note: string;
  givenLabel: string;
  takeBackLabel: string;
}) {
  const heart = useHeart();
  /* Sağlayıcısız bir düğme basılır ve hiçbir şey olmazdı; hiç çizilmemesi
     daha dürüst. Sayfada bu durum oluşmuyor (kabuk her zaman sarıyor). */
  if (!heart) return null;

  const isGiven = heart.given.includes(answerKey);

  return (
    <div className={styles.key} data-given={isGiven ? "true" : "false"}>
      <button
        type="button"
        className={styles.keyButton}
        aria-pressed={isGiven}
        onClick={() => heart.toggle(answerKey)}
      >
        <span className={styles.keyGlyph} lang="ja" aria-hidden>
          {glyph}
        </span>
        <span className={styles.keyText}>
          <span className={styles.keyLabel}>{isGiven ? label : press}</span>
          <span className={styles.keyRomaji} aria-hidden>
            {romaji}
          </span>
        </span>
        {/* Basılmamışken rozet YOK: sayfanın kuralı, boş yere kutu çizmemek.
            Basılıyken hem durumu hem geri alma yolunu yazıyor. */}
        {isGiven ? (
          <span className={styles.keyState}>
            {givenLabel}
            <span className={styles.keyStateSep} aria-hidden>
              ·
            </span>
            {takeBackLabel}
          </span>
        ) : null}
      </button>

      {/* Cevabın neden yetmediği — yalnızca verildikten sonra. Sayfanın
          bütün tezi burada: beş ölçülebilir cevap, hiçbiri kalp değil. */}
      {isGiven ? <p className={styles.keyNote}>{note}</p> : null}
    </div>
  );
}
