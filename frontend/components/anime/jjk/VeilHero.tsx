import { getTranslations } from "next-intl/server";
import { CuratedImage } from "./CuratedImage";
import { VeilStage, VeilToggle } from "./Veil";
import shared from "./jjk.module.css";
import styles from "./VeilHero.module.css";

/**
 * P01 · PERDE (帳) — açılış sahnesi.
 *
 * Kompozisyon üç kat: en altta Tokyo silueti (küratör yuvası; boşken CSS
 * bina şeritleri aynı ufku çizer), üstünde kızıl PERDE — sekiz parçalı bir
 * örtü — ve sahnenin önünde başlık + asılı ahşap plaka (呪術高専東京校).
 *
 * Etkileşim: "perdeyi kaldır" örtüyü parçalar hâlinde kenarlara savurur ve
 * şehir görünür olur — serinin ilk kuralı ("perde indiği sürece dünya
 * sessizdir") sayfanın ilk dokunuşunda yaşatılıyor. Parça hareketi saf CSS
 * geçişi; azaltılmış harekette parçalar uçmaz, yalnızca söner.
 *
 * Sahne kökü istemcide (`VeilStage` — yalnızca bir boolean), görsel
 * katmanların tamamı sunucuda: RSC sınırı `children` üzerinden geçiliyor.
 */
export async function VeilHero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.jjk.veil" });

  return (
    <VeilStage labelledBy="jjk-veil-title">
      {/* ── KAT 1 · ŞEHİR ─────────────────────────────────────────────── */}
      <div className={styles.city} aria-hidden="true">
        <span className={styles.skyline}>
          <CuratedImage
            slotId="jjk:veil:skyline"
            sizes="2560px"
            decorative
            fill
          />
        </span>
        {/* Yuva boşken de ufuk var: CSS bina şeritleri — dosyasız şehir */}
        <span className={styles.blocks}>
          <i /><i /><i /><i /><i />
        </span>
        <span className={styles.smog} />
      </div>

      {/* ── KAT 2 · PERDE — sekiz parça + iki kor ─────────────────────── */}
      <div className={styles.veil} aria-hidden="true">
        <span className={styles.ember} />
        <span className={styles.emberFar} />
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className={styles.shard} data-shard={i + 1} />
        ))}
      </div>

      {/* ── KAT 3 · SAHNE ÖNÜ ─────────────────────────────────────────── */}
      <div className={styles.front}>
        <span className={styles.placard} aria-hidden="true" lang="ja">
          呪術高専東京校
        </span>

        <header className={styles.title}>
          <p className={`${shared.mono} ${styles.kicker}`}>{t("archive")}</p>
          <h1 id="jjk-veil-title" className={styles.name}>
            <span lang="ja">呪術廻戦</span>
            <span className={styles.sub}>{t("title")}</span>
          </h1>
          <p className={`${shared.lede} ${styles.lede}`}>{t("lede")}</p>
        </header>

        <VeilToggle
          labels={{
            raise: t("raise"),
            lower: t("lower"),
            sealed: t("sealed"),
            open: t("open"),
          }}
        />
      </div>
    </VeilStage>
  );
}
