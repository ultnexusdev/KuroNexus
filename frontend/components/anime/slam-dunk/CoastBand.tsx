import { getTranslations } from "next-intl/server";
import { CourtImage } from "./CourtImage";
import court from "./court.module.css";
import styles from "./CoastBand.module.css";

/**
 * KAMAKURA SAHİL BANDI — iki çeyrek arasındaki nefes.
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * Sayfa parkeden çıkmıyor: hero saha, kadro saha, seçici saha. Serinin
 * açılış sahnesi ise sahilde geçiyor ve o sahne olmadan Slam Dunk'ın yarısı
 * eksik. Band, iki kadro bölümü arasında sayfayı bir an salondan çıkarıyor.
 *
 * ── PARALAKS: SIFIR JS ───────────────────────────────────────────────────
 * Kaydırmaya bağlı hareket `animation-timeline: view()` ile. Destekleyen
 * tarayıcıda kadraj bant içinde yavaşça kayıyor, desteklemeyende sabit
 * duruyor — ikisinde de doğru görünüyor ve hiçbirinde JS inmiyor.
 *
 * ⚠️ `prefers-reduced-motion` kapısı `court.module.css`te, tek yerde.
 *
 * ── BÖLÜM DEĞİL ──────────────────────────────────────────────────────────
 * `<section>` değil `<aside>` ve skorbord çapası YOK: gezinilecek bir
 * içerik değil, iki bölüm arasındaki geçiş. Çapa listesine eklemek, ölü
 * olmayan ama anlamsız bir menü satırı üretirdi.
 */
export async function CoastBand({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "slamDunk" });

  return (
    <aside className={styles.band} data-team="neutral">
      <div className={styles.shotWrap}>
        <CourtImage
          slotId="slam-dunk:coast"
          className={styles.shot}
          sizes="1920px"
          fill
          decorative
        />
      </div>

      {/* Demiryolu geçidi: sahilin üstünden geçen tek yatay çizgi.
          Saf CSS, dekoratif — serinin açılış karesine bir selam. */}
      <span className={styles.crossing} aria-hidden />

      <p className={`${court.eyebrow} ${styles.caption}`}>{t("coast")}</p>
    </aside>
  );
}
