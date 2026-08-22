"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { WikiCategory, WikiEntrySummary } from "@/lib/api/types";
import {
  getSpoilerLevel,
  isSpoilerHidden,
  setSpoilerLevel,
  type SpoilerLevel,
} from "@/lib/wiki/spoiler";
import { ContentCard } from "@/components/ContentCard";
import styles from "./WikiSection.module.css";

const CATEGORY_ORDER: WikiCategory[] = [
  "CHARACTER",
  "LOCATION",
  "TERM",
  "EVENT",
  "ITEM",
  "ORGANIZATION",
  "MAGIC_SYSTEM",
];

function SpoilerCard({
  entry,
  href,
  hidden,
}: {
  entry: WikiEntrySummary;
  href: string;
  hidden: boolean;
}) {
  const t = useTranslations("wiki.spoiler");
  const [revealed, setRevealed] = useState(false);
  const blurred = hidden && !revealed;

  /*
   * Perde artık gerçek bir DÜĞME (2026-08-22 denetimi). Eski hâlin iki açığı
   * vardı: (1) açma jesti yalnızca mouse'a bağlı bir onClickCapture'dı —
   * klavye kullanıcısı perdeyi HİÇ kaldıramıyordu; (2) bulanıklık salt
   * görseldi — ekran okuyucu spoiler başlığını perdesiz okuyor, "spoiler"
   * rozeti ise aria-hidden'dı. Rozet zaten kartın tamamını kaplıyordu
   * (inset: 0); düğmeye çevrilince aynı yüzey mouse + klavye + okuyucu için
   * tek kapı oldu. `inert` bulanık içeriği hem odaktan hem erişilebilirlik
   * ağacından düşürüyor — perde kalkınca ikisi de geri geliyor.
   */
  return (
    <div className={styles.cardWrap}>
      <div
        className={blurred ? styles.blurred : undefined}
        inert={blurred || undefined}
      >
        <ContentCard
          href={href}
          coverImage={entry.coverImage}
          title={entry.title}
        />
      </div>
      {blurred ? (
        <button
          type="button"
          className={styles.badge}
          onClick={() => setRevealed(true)}
        >
          {t("badge")}
        </button>
      ) : null}
    </div>
  );
}

export function WikiSection({
  universeSlug,
  entries,
}: {
  universeSlug: string;
  entries: WikiEntrySummary[];
}) {
  const t = useTranslations("wiki");
  const [level, setLevel] = useState<SpoilerLevel>(0);

  useEffect(() => {
    setLevel(getSpoilerLevel(universeSlug));
  }, [universeSlug]);

  if (entries.length === 0) {
    return null;
  }

  const maxTier = entries.reduce(
    (max, entry) => Math.max(max, entry.spoilerTier ?? 0),
    0,
  );
  const hasSpoilers = maxTier > 0;

  function handleLevelChange(value: string) {
    const next: SpoilerLevel = value === "all" ? "all" : Number(value);
    setLevel(next);
    setSpoilerLevel(universeSlug, next);
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("sectionTitle")}</h2>
        {hasSpoilers ? (
          <label className={styles.spoilerControl}>
            <span>{t("spoiler.label")}</span>
            <select
              value={String(level)}
              onChange={(event) => handleLevelChange(event.target.value)}
            >
              <option value="0">{t("spoiler.none")}</option>
              {Array.from({ length: maxTier }, (_, index) => index + 1).map(
                (tier) => (
                  <option key={tier} value={tier}>
                    {t("spoiler.tier", { tier })}
                  </option>
                ),
              )}
              <option value="all">{t("spoiler.all")}</option>
            </select>
          </label>
        ) : null}
      </div>

      {CATEGORY_ORDER.map((category) => {
        const group = entries.filter((entry) => entry.category === category);
        if (group.length === 0) {
          return null;
        }
        return (
          <div key={category} className={styles.group}>
            <h3 className={styles.groupTitle}>
              {t(`categories.${category}`)}
            </h3>
            <ul className={styles.list}>
              {group.map((entry) => (
                <li key={entry.id}>
                  <SpoilerCard
                    entry={entry}
                    href={`/dark-stories/${universeSlug}/wiki/${entry.slug}`}
                    hidden={isSpoilerHidden(entry.spoilerTier, level)}
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
