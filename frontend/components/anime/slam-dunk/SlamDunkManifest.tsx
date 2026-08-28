import { getLocale, getTranslations } from "next-intl/server";
import { readCuratedImages } from "@/lib/api/curated-images";
import { readIsAdmin } from "@/lib/auth/session";
import { CuratedSlotMount } from "@/components/curated/CuratedSlotMount";
import {
  SECTION_LABELS,
  SLAM_DUNK_SURFACE,
  defaultRatio,
  slotsBySection,
} from "@/lib/anime/slam-dunk/slots";
import { pick } from "@/lib/anime/slam-dunk/types";
import court from "./court.module.css";
import styles from "./SlamDunkManifest.module.css";

/**
 * KÜRATÖR MANİFESTOSU — "hangi kareyi bulmam gerek" ekranı.
 *
 * Sayfanın en altında, YALNIZCA yöneticide ve yalnızca küratör anahtarı
 * açıkken. Elli dört yuvanın hepsi tek listede: bölüm, önerilen boyut,
 * oran, kadraj notu ve durumu.
 *
 * ── NEDEN SAYFADA YUVA YANINDA KALEM VARKEN BU DA VAR ────────────────────
 * İkisi iki ayrı soruyu cevaplıyor. Yuvanın yanındaki kalem "bu kadrajı
 * değiştir" için; manifesto "daha ne eksik" için. Bleach'te ölçüldü:
 * küratör tek tek yuvaları gezerek eksikleri bulamıyordu, bir SAYIM
 * ekranına ihtiyacı vardı.
 *
 * ⚠️ Bleach'in `CuratorManifest`i kopyalanmadı: o dosya Bleach'in bölüm
 * listesine ve yuva tipine bağlı. Ortak olan yalnızca düzenleyici adası
 * (`CuratedSlotMount`) ve o zaten yüzeyi prop olarak alıyor.
 */
export async function SlamDunkManifest() {
  const [isAdmin, locale] = await Promise.all([readIsAdmin(), getLocale()]);

  /* Ziyaretçinin paketinde bu bölüm HİÇ yok — kesme sunucuda. */
  if (!isAdmin) return null;

  const [images, t] = await Promise.all([
    readCuratedImages(SLAM_DUNK_SURFACE),
    getTranslations({ locale, namespace: "curator" }),
  ]);

  const groups = slotsBySection();
  const all = groups.flatMap((group) => group.slots);
  /* ⚠️ Anahtarlar `done` / `total` / `missing` — sözlükteki ICU kalıbı
     bunları istiyor. Başta `filled` gönderiliyordu ve next-intl kalıbı
     dolduramayınca ekrana "curator.manifestMeter" diye HAM ANAHTAR
     basıyordu (kullanıcı bildirimi, 28 Ağustos 2026). Sessiz değil ama
     kolay kaçan bir hata: sayfa çökmüyor, yalnızca metin yerine anahtar
     görünüyor. */
  const done = all.filter((slot) => {
    const record = images[slot.id];
    return record?.url && !record.isHidden;
  }).length;

  return (
    <section className={styles.manifest} data-curator-slot data-team="neutral">
      <header className={styles.head}>
        <h2 className={`${court.display} ${styles.title}`}>
          {t("manifestTitle")}
        </h2>
        <p className={styles.meter}>
          {t("manifestMeter", {
            done,
            total: all.length,
            missing: all.length - done,
          })}
        </p>
        <p className={styles.note}>{t("manifestNote")}</p>
      </header>

      {groups.map((group) => (
        <div key={group.section} className={styles.group}>
          <h3 className={court.eyebrow}>
            {pick(SECTION_LABELS[group.section], locale)}
          </h3>

          <ul className={styles.rows}>
            {group.slots.map((slot) => {
              const record = images[slot.id] ?? null;
              const state = record?.isHidden
                ? "hidden"
                : record?.url
                  ? "filled"
                  : "empty";
              return (
                <li key={slot.id} className={styles.row} data-state={state}>
                  <div className={styles.rowMain}>
                    <span className={styles.rowLabel}>
                      {pick(slot.label, locale)}
                    </span>
                    <span className={styles.rowHint}>
                      {pick(slot.hint, locale)}
                    </span>
                    <code className={styles.rowId}>{slot.id}</code>
                  </div>

                  <div className={styles.rowSide}>
                    <span className={styles.rowSpec}>
                      {slot.size.w}×{slot.size.h} · {defaultRatio(slot)}
                    </span>
                    <span className={styles.rowState}>
                      {t(`state_${state}`)}
                    </span>
                    {/* Aynı düzenleyici adası. Manifesto satırından yükleme,
                        yuvanın yanındaki kalemle birebir aynı işi yapıyor. */}
                    <CuratedSlotMount
                      surface={SLAM_DUNK_SURFACE}
                      slot={{
                        id: slot.id,
                        label: pick(slot.label, locale),
                        hint: pick(slot.hint, locale),
                        size: slot.size,
                        ratios: [...slot.ratios],
                        defaultRatio: defaultRatio(slot),
                        defaultTreatment: slot.treatment,
                      }}
                      record={record}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
