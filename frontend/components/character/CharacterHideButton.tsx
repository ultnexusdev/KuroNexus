"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { hideCharacter, revealCharacter } from "@/lib/admin/api";
import styles from "./CharacterPlate.module.css";

/**
 * Karakteri dizinden çıkarma düğmesi.
 *
 * Portrenin sağ üstünde ama BAĞLANTININ DIŞINDA: kart bir `<a>` ve içine
 * ikinci bir tıklanabilir öğe koymak geçersiz işaretleme olurdu.
 *
 * ── SAYFA TAZELENMİYOR, bilinçli ───────────────────────────────────────────
 * İlk yazımda `router.refresh()` vardı. Sonucu şuydu: kürator "kaldır"a
 * basıyor, kart listeden anında siliniyor ve **geri alma tuşu da onunla
 * birlikte kayboluyor** — yanlışlıkla kaldırdığı karakteri geri getirmenin
 * yolu kalmıyordu.
 *
 * Şimdi kart yerinde kalıp soluyor ve düğme "geri al"a dönüşüyor. Liste bir
 * sonraki doğal sayfa açılışında zaten süzülmüş geliyor (süzgeç sunucuda,
 * `getCharacterIndex`). Yüz karakteri elemek isteyen küratör böylece
 * sırasını kaybetmeden ilerliyor.
 *
 * ONAY SORULMUYOR: gizlemek yıkıcı bir işlem değil, kayıt yalnızca bir
 * dışlama listesine giriyor. Onay kutusu her karakterde bir kez durdururdu.
 */
export function CharacterHideButton({
  characterId,
  name,
}: {
  characterId: number;
  name: string;
}) {
  const t = useTranslations("character.hide");
  const [hidden, setHidden] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  function run(next: boolean) {
    setBusy(true);
    setFailed(false);
    const action = next ? hideCharacter : revealCharacter;
    void action(characterId)
      .then(() => setHidden(next))
      // Sessizce başarısız olmasın: kürator kaldırdığını sanıp devam ederse
      // liste bir sonraki açılışta beklediğinden dolu gelir
      .catch(() => setFailed(true))
      .finally(() => setBusy(false));
  }

  return (
    <button
      type="button"
      className={hidden ? styles.hideButtonUndo : styles.hideButton}
      disabled={busy}
      onClick={() => run(!hidden)}
      // Ekran okuyucuda "✕" hiçbir şey ifade etmiyor; hangi karakter olduğu
      // adla birlikte söyleniyor
      aria-label={
        failed
          ? t("failed")
          : hidden
            ? t("undoFor", { name })
            : t("hideFor", { name })
      }
      title={failed ? t("failed") : hidden ? t("undo") : t("hide")}
      data-failed={failed ? "true" : undefined}
    >
      <span aria-hidden>{failed ? "!" : hidden ? "↺" : "✕"}</span>
    </button>
  );
}
