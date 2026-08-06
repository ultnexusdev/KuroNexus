"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { deleteCharacterImage } from "@/lib/admin/api";
import styles from "./CuratorUpload.module.css";

/**
 * Galeri görselini kaldırır.
 *
 * Silme **yumuşak** (kayıt `isDeleted` işaretleniyor, diskteki dosyaya
 * dokunulmuyor — AGENTS.md kural 3). Onay istenmiyor çünkü işlem geri
 * alınabilir: dosya sunucuda duruyor, adres yeniden eklenebilir.
 */
export function CharacterImageDelete({ id }: { id: string }) {
  const t = useTranslations("character.uploader");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={styles.remove}
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void deleteCharacterImage(id)
          .then(() => startTransition(() => router.refresh()))
          .finally(() => setBusy(false));
      }}
    >
      {t("remove")}
    </button>
  );
}
