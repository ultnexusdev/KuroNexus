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
 * ── KART ANINDA KAYBOLMUYOR, bilinçli ──────────────────────────────────────
 * İlk yazımda `router.refresh()` vardı. Sonucu şuydu: kürator "kaldır"a
 * basıyor, kart listeden anında siliniyor ve **geri alma tuşu da onunla
 * birlikte kayboluyor** — yanlışlıkla kaldırdığı karakteri geri getirmenin
 * yolu kalmıyordu.
 *
 * Şimdi kart küratör modu açıkken yerinde kalıp soluyor ve düğme "geri al"a
 * dönüşüyor. Yüz karakteri elemek isteyen küratör böylece sırasını
 * kaybetmeden ilerliyor.
 *
 * ── DURUM YUKARIDA DA TUTULUYOR ────────────────────────────────────────────
 * Buradaki `hidden` yalnızca DÜĞMENİN görünüşünü sürüyor. Kartın ızgaradan ne
 * zaman düşeceğine listeyi kuran bileşen karar veriyor, o yüzden her başarılı
 * işlem `onChange` ile yukarı bildiriliyor (`CharacterPlate` →
 * `CharacterGallery`).
 *
 * Bu bildirim önceden yoktu ve eski yorum "liste bir sonraki sayfa açılışında
 * zaten süzülmüş gelir" diyordu; gerçekte dizin gizlenenleri hiç öğrenmediği
 * için küratör modu kapandığında kart hiç kaldırılmamış gibi geri geliyordu.
 *
 * ONAY SORULMUYOR: gizlemek yıkıcı bir işlem değil, kayıt yalnızca bir
 * dışlama listesine giriyor. Onay kutusu her karakterde bir kez durdururdu.
 */
export function CharacterHideButton({
  characterId,
  name,
  defaultHidden = false,
  onChange,
}: {
  characterId: number;
  name: string;
  /**
   * Düğmenin AÇILIŞ durumu — küratör bu karakteri daha önce kaldırdıysa `true`.
   *
   * Gerekçesi: küratör modu kapanıp yeniden açıldığında kart yeniden bağlanıyor
   * ve buradaki `hidden` sıfırlanırdı; sunucuda gizli duran karakter "✕" ile
   * hiç kaldırılmamış gibi görünürdü. Yalnızca ilk değer olarak okunuyor
   * (denetimsiz bileşen), sonrasını tıklamalar sürüyor.
   */
  defaultHidden?: boolean;
  /** Yalnızca istek başarılıysa çağrılır — bkz. `run`. */
  onChange?: (characterId: number, hidden: boolean) => void;
}) {
  const t = useTranslations("character.hide");
  const [hidden, setHidden] = useState(defaultHidden);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  function run(next: boolean) {
    setBusy(true);
    setFailed(false);
    const action = next ? hideCharacter : revealCharacter;
    void action(characterId)
      .then(() => {
        setHidden(next);
        // Haber sunucu "tamam" dedikten SONRA veriliyor: istek düşerse
        // karakter gerçekte gizlenmedi, dizinden düşürmek yalan olurdu
        onChange?.(characterId, next);
      })
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
