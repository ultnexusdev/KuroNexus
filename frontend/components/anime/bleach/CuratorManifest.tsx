import { getLocale, getTranslations } from "next-intl/server";
import { readCuratedImages } from "@/lib/api/curated-images";
import { readIsAdmin } from "@/lib/auth/session";
import {
  BLEACH_SLOTS,
  BLEACH_SURFACE,
  SECTION_LABELS,
  defaultRatio,
  resolveRatio,
  slotDef,
  slotsBySection,
} from "@/lib/anime/bleach/slots";
import { pick } from "@/lib/anime/bleach/types";
import { CuratedSlotMount } from "./CuratedSlotMount";
import styles from "./CuratorManifest.module.css";

/**
 * EKSİK GÖRSELLER PANELİ.
 *
 * Sayfa uzun ve yuvalar bölümlerin içine dağılmış durumda. Küratörün
 * "hangi fotoğrafı bulmam gerek" sorusunu TEK EKRANDAN cevaplayabilmesi
 * gerekiyor (kullanıcı komutu, 23 Ağustos 2026): her satırda önerilen boyut,
 * oran ve kadraj notu yazılı.
 *
 * Naruto'daki küratör kuşağının genişletilmiş hâli. Oradaki eksik şuydu:
 * bütün yuvaları listeliyordu ama HANGİSİNİN BOŞ olduğunu söylemiyordu —
 * altmış yuvalık bir sayfada bu, listeyi işe yaramaz kılardı.
 *
 * ── SUNUCU BİLEŞENİ ──────────────────────────────────────────────────────
 * Panelin kendisi sunucuda çiziliyor; istemciye inen tek şey satır başına
 * düzenleyici adası ve o da yalnızca yöneticide. Ziyaretçi bu bölümü hiç
 * almıyor: `isAdmin` false ise `null` dönüyor.
 */
export async function CuratorManifest() {
  const isAdmin = await readIsAdmin();
  if (!isAdmin) return null;

  const [images, locale, t] = await Promise.all([
    readCuratedImages(BLEACH_SURFACE),
    getLocale(),
    getTranslations("anime.bleach.curator"),
  ]);

  /**
   * Yuvanın üç durumu — ikisi değil.
   *
   * `default` durumu 23 Ağustos 2026'da eklendi: depoya konan geçici kareler
   * (`slot.src`) olmadan sayaç "0 / 65 dolu" diyordu ve ekranda dört görsel
   * duruyordu. Küratörün bilmesi gereken şey "dolu mu" değil, **kimin
   * doldurduğu**: kendi yüklediği kare mi, yoksa yer tutucu mu.
   */
  const stateOf = (slot: (typeof BLEACH_SLOTS)[number]) => {
    const row = images[slot.id];
    if (row?.isHidden) return "hidden" as const;
    if (row?.url) return "filled" as const;
    if (slot.src) return "default" as const;
    return "empty" as const;
  };

  const total = BLEACH_SLOTS.length;
  const done = BLEACH_SLOTS.filter((slot) => stateOf(slot) === "filled").length;
  const placeholders = BLEACH_SLOTS.filter(
    (slot) => stateOf(slot) === "default",
  ).length;

  /* Manifestoda karşılığı olmayan kayıtlar. Yetim satır hiçbir şeyi
     kırmıyor (çizim manifestoyu okuyor, veritabanını değil) ama küratörün
     onu görmesi gerekiyor: yuva kimliği kodda yeniden adlandırılmış olabilir
     ve o kare kaybolmuş görünür. */
  const orphans = Object.values(images).filter((row) => !slotDef(row.slotId));

  return (
    <section className={styles.panel} aria-labelledby="bleach-manifest">
      <header className={styles.head}>
        <h2 id="bleach-manifest" className={styles.title}>
          {t("manifestTitle")}
        </h2>
        <p className={styles.meter}>
          {/* `missing` = HİÇBİR karesi olmayan yuva. Yer tutucular ayrı
              sayılıyor: "65 eksik · 4 geçici" demek, "65 eksik ama 4'ünde
              görsel var" demekten daha az kafa karıştırıyor. */}
          {t("manifestMeter", {
            done,
            total,
            missing: total - done - placeholders,
          })}
          {placeholders > 0
            ? ` · ${t("manifestPlaceholders", { count: placeholders })}`
            : ""}
        </p>
        <p className={styles.note}>{t("manifestNote")}</p>
      </header>

      {slotsBySection().map(({ section, slots }) => {
        const sectionDone = slots.filter(
          (slot) => stateOf(slot) !== "empty",
        ).length;
        return (
          <div key={section} className={styles.group}>
            <h3 className={styles.groupTitle}>
              {pick(SECTION_LABELS[section], locale)}
              <span className={styles.groupMeter}>
                {sectionDone}/{slots.length}
              </span>
            </h3>

            <ul className={styles.list}>
              {slots.map((slot) => {
                const row = images[slot.id] ?? null;
                const state = stateOf(slot);
                return (
                  <li
                    key={slot.id}
                    className={styles.item}
                    data-state={state}
                    data-filled={state === "filled" ? "" : undefined}
                  >
                    <p className={styles.itemHead}>
                      <span className={styles.dot} aria-hidden />
                      <span className={styles.itemLabel}>
                        {pick(slot.label, locale)}
                      </span>
                      {/* ⚠️ Durum RENKLE değil YAZIYLA taşınıyor; nokta
                          yalnızca ikinci bir işaret (renk körlüğü). */}
                      <span className={styles.itemState}>
                        {t(`state_${state}` as never)}
                      </span>
                    </p>

                    <p className={styles.itemMeta}>
                      {slot.size.w}×{slot.size.h} ·{" "}
                      {resolveRatio(slot, row?.ratio)}
                      {row?.ratio && row.ratio !== defaultRatio(slot)
                        ? ` (${t("ratioOverridden")})`
                        : ""}
                      {row?.credit ? ` · ${row.credit}` : ""}
                    </p>

                    <p className={styles.itemHint}>{pick(slot.hint, locale)}</p>

                    {/* Yer tutucu olduğunu AÇIKÇA söyle: küratör bu kareyi
                        kendisinin koymadığını bilmeli, yoksa "bu yuva tamam"
                        diye geçer. */}
                    {state === "default" && slot.srcCredit ? (
                      <p className={styles.itemPlaceholder}>
                        {t("placeholderNote")} — {slot.srcCredit}
                      </p>
                    ) : null}

                    <p className={styles.itemFoot}>
                      {/* Sayfadaki yuvaya çapa — küratör tıklayınca bölüme iner */}
                      <a
                        className={styles.jump}
                        href={`#slot-${slot.id.replace(/:/g, "-")}`}
                      >
                        {t("jump")}
                      </a>
                      <code className={styles.itemId}>{slot.id}</code>
                    </p>

                    {/* Düzenleyici yerinde: küratör bölüme inmeden de
                        doldurabiliyor. Aynı ada, aynı uç. */}
                    <span className={styles.editor}>
                      <CuratedSlotMount
                        surface={BLEACH_SURFACE}
                        slot={{
                          id: slot.id,
                          label: pick(slot.label, locale),
                          hint: pick(slot.hint, locale),
                          size: slot.size,
                          ratios: [...slot.ratios],
                          defaultRatio: defaultRatio(slot),
                          defaultTreatment: slot.treatment,
                        }}
                        record={row}
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {orphans.length > 0 ? (
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>{t("orphanTitle")}</h3>
          <p className={styles.note}>{t("orphanNote")}</p>
          <ul className={styles.orphans}>
            {orphans.map((row) => (
              <li key={row.slotId}>
                <code>{row.slotId}</code>
                <span>{row.url}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
