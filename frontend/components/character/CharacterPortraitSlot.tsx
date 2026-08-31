"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { useCuratorMode } from "./CuratorFrame";
import styles from "./CharacterPortraitSlot.module.css";

/**
 * DİZİNDEKİ PORTRE YUVASI — karakter kartının kendi üstünde.
 *
 * ── NEDEN VAR ────────────────────────────────────────────────────────────
 * Portre yükleme yalnızca karakterin KENDİ sayfasında mümkündü. Ama dizinde
 * yüzlerce kart var ve çoğunun sayfası yok: künye kartına portre koymak için
 * gidilecek bir yer bulunmuyordu. Raftaki kartlarda da aynı sorun — orada
 * sayfa var ama küratörün "şu kart boş görünüyor" dediği an ile portreyi
 * yükleyebildiği yer arasında iki gezinme duruyordu (kullanıcı isteği,
 * 31 Ağustos 2026: "buraya da resim ekleme olsun").
 *
 * Artık küratör modu açıkken her kartın sol üstünde bir işaret var; basınca
 * yükleyici ekranın ortasında açılıyor.
 *
 * ── NEDEN KARTIN İÇİNDE AÇILAN BİR PANEL DEĞİL ───────────────────────────
 * Kart ızgarada ~150 px. Yükleyicinin iki yolu (dosya + adres) o genişliğe
 * sığmıyor ve `.ways` ızgarası SAYFA genişliğine bakan bir medya sorgusuyla
 * iki sütuna geçiyor — yani geniş ekranda kartın içine konan panel kartı
 * taşırır, ızgaranın sağ kenarındaki kartlarda da sayfaya yatay kaydırma
 * ekler. Ortada açılan katman ikisini de doğurmuyor.
 *
 * Katman `createPortal` ile `document.body`ye çıkıyor: `position: fixed`,
 * atalarından birinde `transform`/`filter` varsa viewport'a değil o ataya
 * göre konumlanır ve kartın içinde hapsolurdu. Kart ızgarasının bugün öyle
 * bir atası yok, ama bu bileşen kart nereye taşınırsa oraya gidiyor.
 */
const CuratorUpload = dynamic(
  () => import("./CuratorUpload").then((mod) => mod.CuratorUpload),
  { ssr: false },
);

export function CharacterPortraitSlot({
  characterId,
  name,
  curating,
}: {
  characterId: number;
  name: string;
  /**
   * Küratör modu — ızgara kendi anahtarını prop olarak veriyor
   * (`CharacterGallery` durumu zaten elinde tutuyor).
   *
   * Verilmezse `CuratorFrame` context'i okunuyor: raf SUNUCUDA çiziliyor
   * ve prop zinciri oraya inmiyor. `undefined` "üstte çerçeve yok" demek
   * ve o durumda yuva çiziliyor — gerekçesi `CuratorFrame`deki üç durum
   * tablosunda; çağıran zaten `isAdmin` ile kesiyor.
   */
  curating?: boolean;
}) {
  const t = useTranslations("character");
  const mode = useCuratorMode();
  const [open, setOpen] = useState(false);

  /* Esc kapatır: katman modal, klavyeyle gelen biri kapanı aramasın. */
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const visible = curating ?? mode !== false;
  if (!visible) {
    return null;
  }

  return (
    <div className={styles.slot} data-curator-slot>
      <button
        type="button"
        className={styles.open}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t("portraitSlot.open", { name })}
        title={t("portraitSlot.open", { name })}
      >
        {/* Çerçeve + içindeki tepe çizgisi: "buraya bir görsel gelecek".
            Çizilmiş SVG, emoji değil (ikon sistemi kuralı). */}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 16l4.5-4.5 3.5 3.5 2.5-2.5L21 17" />
          <circle cx="9" cy="10" r="1.3" />
        </svg>
      </button>

      {open ? <Layer name={name} characterId={characterId} onClose={() => setOpen(false)} /> : null}
    </div>
  );
}

/**
 * Yükleyici katmanı. Ayrı bir bileşen çünkü `createPortal` yalnızca
 * tarayıcıda çağrılabilir ve bu ayrım `document`e dokunmayı tek bir
 * yere hapsediyor.
 */
function Layer({
  characterId,
  name,
  onClose,
}: {
  characterId: number;
  name: string;
  onClose: () => void;
}) {
  const t = useTranslations("character");
  const [mounted, setMounted] = useState(false);

  // İlk çizim sunucuda olabilir; portal ancak `document` varken kurulur
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={styles.veil}
      role="dialog"
      aria-modal="true"
      aria-label={t("portraitSlot.title", { name })}
      /* Yalnızca perdenin KENDİSİNE tıklamak kapatıyor: panelin içinde
         yapılan bir tıklama (dosya seçici, adres kutusu) buraya kabararak
         gelir ve paneli yükleme ortasında kapatırdı. */
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.panel}>
        <header className={styles.head}>
          <p className={styles.who}>{name}</p>
          <button type="button" className={styles.close} onClick={onClose}>
            {t("portraitSlot.close")}
          </button>
        </header>

        {/* Yuva PORTRAIT: karakter sayfasındaki kapak portresiyle AYNI
            kayıt. Dizinde yüklenen kare orada da görünüyor, tersi de
            doğru — iki ayrı yuva olsaydı aynı karakterin iki yüzü olurdu.
            Ölçü, dosya sayfasındaki kapak yuvasının oranı (2:3). */}
        <CuratorUpload
          characterId={characterId}
          slot="PORTRAIT"
          label={t("slots.portrait")}
          size={{ w: 800, h: 1200 }}
          onUploaded={onClose}
        />

        <p className={styles.note}>{t("portraitSlot.note")}</p>
      </div>
    </div>,
    document.body,
  );
}
