"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getSpoilerLevel, isSpoilerHidden } from "@/lib/wiki/spoiler";
import styles from "./SpoilerGate.module.css";

export function SpoilerGate({
  universeSlug,
  spoilerTier,
  children,
}: {
  universeSlug: string;
  spoilerTier: number | null;
  children: React.ReactNode;
}) {
  const t = useTranslations("wiki.spoiler");
  // Güvenli taraf: spoiler'lı içerik gizli başlar, cookie izin veriyorsa açılır
  const [hidden, setHidden] = useState(spoilerTier !== null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setHidden(isSpoilerHidden(spoilerTier, getSpoilerLevel(universeSlug)));
  }, [universeSlug, spoilerTier]);

  if (hidden && !revealed) {
    return (
      <div className={styles.gate}>
        <p className={styles.warning}>
          {t("warning", { tier: spoilerTier ?? 0 })}
        </p>
        <button
          type="button"
          className="btn"
          onClick={() => setRevealed(true)}
        >
          {t("reveal")}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
