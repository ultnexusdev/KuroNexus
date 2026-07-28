"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { apiUrl } from "@/lib/api/client";
import type { StoryLoreEntry } from "@/lib/api/types";
import {
  getSpoilerLevel,
  isSpoilerHidden,
  type SpoilerLevel,
} from "@/lib/wiki/spoiler";
import styles from "./LoreDossier.module.css";

/**
 * Okuma ekranındaki künye paneli.
 *
 * Metindeki lore işaretine tıklanınca yandan açılır: sayfa değişmez, okuma
 * kaldığı yerde durur. İşaretler sunucudan gelen HTML'in içinde olduğu için
 * dinleyici belge düzeyindedir — sayfalı okuyucunun hangi sayfayı gösterdiği
 * fark etmez. Spoiler seviyesi wiki sayfalarındaki kapıyla aynı kuralı izler.
 */
export function LoreDossier({
  entries,
  universeSlug,
}: {
  entries: StoryLoreEntry[];
  universeSlug: string;
}) {
  const t = useTranslations("lore");
  const tCategories = useTranslations("wiki.categories");
  const [openId, setOpenId] = useState<string | null>(null);
  const [level, setLevel] = useState<SpoilerLevel>(0);
  const [revealed, setRevealed] = useState<string[]>([]);

  useEffect(() => {
    setLevel(getSpoilerLevel(universeSlug));
  }, [universeSlug]);

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const mention = target.closest("[data-entry-id]");
      if (!mention) {
        return;
      }
      const id = mention.getAttribute("data-entry-id");
      if (!id) {
        return;
      }
      event.preventDefault();
      setOpenId(id);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenId(null);
      }
    }
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  if (!openId) {
    return null;
  }

  const entry = entries.find((item) => item.id === openId) ?? null;
  const hidden =
    entry !== null &&
    isSpoilerHidden(entry.spoilerTier, level) &&
    !revealed.includes(entry.id);

  return (
    <aside className={styles.panel} aria-label={t("panelAria")}>
      <div className={styles.head}>
        <span className={styles.category}>
          {entry ? tCategories(entry.category) : ""}
        </span>
        <button
          type="button"
          className={styles.close}
          aria-label={t("close")}
          onClick={close}
        >
          ×
        </button>
      </div>

      {entry === null ? (
        <p className={styles.body}>{t("missing")}</p>
      ) : (
        <>
          <h2 className={styles.title}>{entry.title}</h2>

          {hidden ? (
            <>
              <p className={styles.body}>
                {t("spoilerWarning", { tier: entry.spoilerTier ?? 0 })}
              </p>
              <button
                type="button"
                className={styles.reveal}
                onClick={() => setRevealed((list) => [...list, entry.id])}
              >
                {t("reveal")}
              </button>
            </>
          ) : (
            <>
              {entry.coverImage ? (
                <Image
                  src={apiUrl(entry.coverImage)}
                  alt=""
                  width={320}
                  height={180}
                  className={styles.cover}
                />
              ) : null}
              <p className={styles.body}>{entry.excerpt}</p>
              <Link
                href={`/dark-stories/${universeSlug}/wiki/${entry.slug}`}
                className={styles.fullPage}
              >
                {t("fullPage")}
              </Link>
            </>
          )}
        </>
      )}
    </aside>
  );
}
