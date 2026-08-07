"use client";

import { useState } from "react";
import styles from "./ArchiveAddButtons.module.css";

/**
 * "Arşive ekle" ikili simge düğmesi — benzer içerik listelerinde kullanılıyor.
 *
 * ── NEDEN AYRI BİLEŞEN ────────────────────────────────────────────────────
 * Film ve dizi salonları bilerek birbirinin kopyası (`ShowDetail`, koddaki
 * notuyla "film salonundaki `MovieDetail`ın aynısı"). Buradaki durum makinesi
 * — meşgul / hangi düğme patladı — kopyalansaydı iki yerde ayrı ayrı bozulurdu.
 * Alan bilgisi ise DIŞARIDA kalıyor: hangi uca gidileceğini (`createMovieEntry`
 * / `createShowEntry`) ve etiketlerin hangi namespace'ten okunacağını çağıran
 * biliyor.
 *
 * ── NEDEN BAĞLANTININ İÇİNDE DEĞİL ────────────────────────────────────────
 * Satırın kendisi bir `<a>`/`<Link>`. İçine düğme koymak geçersiz işaretleme
 * olurdu (`<a>` içinde etkileşimli öğe) ve tıklama iki işleyici arasında
 * paylaşılırdı. Bu yüzden düğmeler bağlantının KARDEŞİ; `<li>` flex olup
 * bağlantıya kalan alanı veriyor. Aynı karar karakter kartındaki gizleme
 * düğmesinde de alınmıştı.
 *
 * ── HATA DURUMU NEDEN DÜĞME BAŞINA ────────────────────────────────────────
 * İlk yazımda tek bir `failed` bayrağı vardı ve patlayınca İKİ düğme birden
 * "!" olup aynı erişilebilir adı alıyordu. O hâlde küratör hangisine bastığını
 * ayırt edemiyor, "izledim" başarısız olduktan sonra körlemesine bastığı düğme
 * pekâlâ "izleyeceğim" olabiliyordu — yani yanlış durum arşive yazılabiliyordu.
 * Şimdi yalnızca patlayan düğme "!" gösteriyor, öteki kendi kimliğini koruyor.
 *
 * ── `aria-disabled`, `disabled` DEĞİL ─────────────────────────────────────
 * `disabled` bir düğmeyi odak sırasından düşürür: klavyeyle basan kullanıcı
 * istek sürerken odağını kaybediyor ve tekrar denemek için listeye baştan
 * sekmek zorunda kalıyordu. `aria-disabled` durumu ekran okuyucuya aynı
 * şekilde söylüyor ama odağı bırakıyor; ikinci tıklamayı `run` içindeki
 * koruma engelliyor.
 *
 * ── SİMGE SEÇİMİ ──────────────────────────────────────────────────────────
 * Kullanıcı "küçük simgeler yeterli" dedi. "✓" izledim, "+" izleyeceğim.
 * "✓" arşiv rozetiyle aynı karakter ama karışmıyor: rozet ancak içerik arşive
 * girdikten SONRA çiziliyor, o an düğmeler zaten kalkmış oluyor.
 */

export type ArchiveAddStatus = "WATCHED" | "WATCHLIST";

export function ArchiveAddButtons({
  labels,
  onAdd,
}: {
  labels: {
    /** "…'yı izledim olarak ekle" — İÇİNDE İÇERİK ADI GEÇMELİ */
    watched: string;
    /** "…'yı izleyeceklerime ekle" — içinde içerik adı geçmeli */
    watchlist: string;
    /** "… eklenemedi, tekrar deneyin" — içinde içerik adı geçmeli */
    failed: string;
  };
  /**
   * Eklemeyi çağıran yapar. Sözü REDDEDERSE o düğme hata durumuna geçer —
   * bu yüzden çağıran hatayı yutmamalı. "Zaten arşivde" gibi aslında başarı
   * sayılan yanıtları çağıran kendi içinde çözüp sözü ÇÖZMELİ.
   */
  onAdd: (status: ArchiveAddStatus) => Promise<void>;
}) {
  const [busy, setBusy] = useState<ArchiveAddStatus | null>(null);
  const [failed, setFailed] = useState<ArchiveAddStatus | null>(null);

  function run(status: ArchiveAddStatus) {
    // `aria-disabled` tıklamayı kendiliğinden engellemez, koruma burada
    if (busy !== null) {
      return;
    }
    setBusy(status);
    // Yalnızca yeniden denenen düğmenin hatası siliniyor; ötekininki dursun
    setFailed((current) => (current === status ? null : current));
    void onAdd(status)
      /* Sessizce yutulmuyor: küratör eklediğini sanıp geçerse, arşivin bir
         sonraki açılışında filmin orada olmadığını görür ve neden olmadığını
         bilemez. Düğme "!" ile duruyor ve tekrar denenebiliyor. */
      .catch(() => setFailed(status))
      .finally(() => setBusy(null));
  }

  function button(status: ArchiveAddStatus, glyph: string, label: string) {
    const isBusy = busy === status;
    const isFailed = failed === status;
    return (
      <button
        type="button"
        className={styles.button}
        aria-disabled={busy !== null ? true : undefined}
        data-failed={isFailed ? "true" : undefined}
        onClick={() => run(status)}
        /* Ekran okuyucuda "✓" hiçbir şey ifade etmiyor. Ad EYLEM anlatıyor ve
           İÇERİĞİN ADINI taşıyor: rayda on iki satır var, hepsinde yalnızca
           "İzledim" duyulsaydı hangi filmden söz edildiği anlaşılmazdı. */
        aria-label={isFailed ? labels.failed : label}
        title={isFailed ? labels.failed : label}
      >
        <span aria-hidden>{isFailed ? "!" : isBusy ? "…" : glyph}</span>
      </button>
    );
  }

  return (
    <span className={styles.group}>
      {button("WATCHED", "✓", labels.watched)}
      {button("WATCHLIST", "+", labels.watchlist)}
    </span>
  );
}
