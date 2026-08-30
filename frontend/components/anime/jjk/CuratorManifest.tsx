import { getLocale } from "next-intl/server";
import { readCuratedImages } from "@/lib/api/curated-images";
import { readIsAdmin } from "@/lib/auth/session";
import {
  JJK_SURFACE,
  SECTION_LABELS,
  slotsBySection,
  defaultRatio,
} from "@/lib/anime/jjk/slots";
import { pick } from "@/lib/anime/jjk/types";
import { CuratedSlotMount } from "@/components/curated/CuratedSlotMount";
import styles from "./CuratorManifest.module.css";

/**
 * EKSİK GÖRSELLER PANELİ — yalnızca yöneticide çizilir (Bleach deseni).
 *
 * Küratörün "hangi kareyi bulmam gerek" sorusunu tek ekrandan cevaplar:
 * bölüm, yuva, önerilen boyut, oran, kadraj notu ve doluluk. Etkileşimin
 * arkasına saklanan yuvalar (alan kareleri, ruh portreleri) buradan her
 * an düzenlenebilir — sayfada o duruma girmek gerekmez.
 */
export async function CuratorManifest() {
  const isAdmin = await readIsAdmin();
  if (!isAdmin) return null;

  const [images, locale] = await Promise.all([
    readCuratedImages(JJK_SURFACE),
    getLocale(),
  ]);

  const groups = slotsBySection();
  const total = groups.reduce((sum, group) => sum + group.slots.length, 0);
  const filled = groups.reduce(
    (sum, group) =>
      sum + group.slots.filter((slot) => images[slot.id]?.url).length,
    0,
  );

  return (
    <aside className={styles.panel} aria-label="Küratör manifestosu">
      <p className={styles.head}>
        KÜRATÖR MANİFESTOSU — {filled}/{total} yuva dolu
      </p>
      {groups.map((group) => (
        <section key={group.section} className={styles.group}>
          <h3 className={styles.groupTitle}>
            {pick(SECTION_LABELS[group.section], locale)}
          </h3>
          <ul className={styles.rows}>
            {group.slots.map((slot) => {
              const record = images[slot.id] ?? null;
              return (
                <li
                  key={slot.id}
                  className={styles.row}
                  data-filled={record?.url ? "" : undefined}
                >
                  <span className={styles.rowMain}>
                    <span className={styles.rowLabel}>{pick(slot.label, locale)}</span>
                    <span className={styles.rowMeta}>
                      {slot.size.w}×{slot.size.h} · {defaultRatio(slot)} ·{" "}
                      <code>{slot.id}</code>
                    </span>
                    <span className={styles.rowHint}>{pick(slot.hint, locale)}</span>
                  </span>
                  <span className={styles.rowPen}>
                    <CuratedSlotMount
                      surface={JJK_SURFACE}
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
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </aside>
  );
}
