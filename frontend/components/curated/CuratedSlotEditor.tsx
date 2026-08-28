"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { apiUrl, isLocalUpload } from "@/lib/api/client";
import {
  setCuratedImage,
  uploadImage,
  uploadImageFromUrl,
  type SetCuratedImageInput,
} from "@/lib/admin/api";
import type { CuratedImageRecord } from "@/lib/api/curated-images";
import { SLOT_BLENDS, SLOT_TREATMENTS } from "@/lib/curated/contract";
import type { CuratedSlotView } from "@/lib/curated/contract";
import styles from "./CuratedSlotEditor.module.css";

/**
 * BLEACH EVRENİ — YUVA DÜZENLEYİCİSİ.
 *
 * Küratör modu açıkken her yuvanın köşesinde bir kalem düğmesi; düğme beş
 * sekmeli bir panel açıyor:
 *
 *   GÖRSEL   dosya seç · adres yapıştır · görseli kaldır
 *   ODAK     sürüklenen artı imleci → `object-position` + büyütme
 *   KADRAJ   yuvanın izin verdiği oranlar arasından seçim
 *   METİN    alt metin TR · alt metin EN · künye satırı
 *   GÖRÜNÜM  işlem biçimi · opaklık · karışım kipi · geçici gizle
 *
 * ── NEDEN PANEL PORTAL ───────────────────────────────────────────────────
 * Panel `document.body`ye taşınıp `position: fixed` ile düğmenin yanına
 * konumlanıyor. Futbol kanadında ölçülmüş arıza: yuvaların kapsayıcıları
 * `overflow: hidden` taşıyor ve panel içeride kalırsa KESİLİYOR. Bleach'te
 * bu daha da kritik — kapılar, nişler ve alfabe hücreleri `clip-path` da
 * taşıyacak.
 *
 * ⚠️ PORTAL OLAY BALONCUĞUNU DURDURMAZ. React sentetik olayları DOM ağacında
 * değil BİLEŞEN ağacında yükselir; panel `body`de dursa bile tıklama yine
 * ebeveyn `<button>`a ulaşır. O yüzden panel kökü olayları AÇIKÇA yutuyor.
 *
 * ── OPTİMİSTİK + GERİ ALINABİLİR ─────────────────────────────────────────
 * Görsel `CuratedImage` tarafından SUNUCUDA çiziliyor, yani kaydetmek onu
 * kendiliğinden değiştirmiyor. Aradaki boşluk iki şeyle kapatılıyor:
 *   1. Kaydedilen kare, `router.refresh()` dönene kadar yuvanın üstünde bir
 *      ÖNİZLEME katmanı olarak çiziliyor — küratör sonucu anında görüyor.
 *   2. Kaydetmeden önceki kayıt bellekte tutuluyor; on saniye boyunca "geri
 *      al" düğmesi onu geri yazıyor.
 */
export function CuratedSlotEditor({
  surface,
  slot,
  record,
}: {
  surface: string;
  slot: CuratedSlotView;
  record: CuratedImageRecord | null;
}) {
  const t = useTranslations("curator");
  const router = useRouter();

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("image");
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  /** Sunucudaki kaydın istemci kopyası — kaydetme bunu yerinde güncelliyor */
  const [draft, setDraft] = useState<CuratedImageRecord | null>(record);
  /** Kaydetmeden ÖNCEKİ kayıt — "geri al" bunu geri yazıyor */
  const [undoable, setUndoable] = useState<CuratedImageRecord | null>(null);
  /**
   * YALNIZCA kaydetme uçuştayken dolu olan önizleme adresi.
   *
   * ⚠️ Eskiden önizleme `draft.url` varken HER ZAMAN çiziliyordu ve bu,
   * küratör modunun en tehlikeli hatasıydı: katman gerçek çizimin ÜSTÜNE
   * biniyor ve filtresiz olduğu için küratöre "her şey yolunda" gösteriyordu.
   * Mod kapatılınca altındaki gerçek sonuç ortaya çıkıyordu — siyah bir
   * dikdörtgen (kullanıcı bildirimi, 23 Ağustos 2026).
   *
   * Artık önizleme yalnızca sunucu yeniden çizene kadarki boşluğu
   * kapatıyor; `record` tazelendiği anda kalkıyor ve küratör GERÇEK sonucu
   * görüyor.
   */
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  /* Sunucu yeniden çizdiğinde (router.refresh sonrası) taslak tazeleniyor
     ve önizleme kalkıyor. Tazelemeyi atlamak, kaydettikten sonra panelin
     eski değerleri göstermesi demekti — spor panelinde yaşanmış hata. */
  useEffect(() => {
    setDraft(record);
    setPendingPreview(null);
  }, [record]);

  /* Tazeleme hiç dönmezse (ağ hatası) önizleme sonsuza kadar kalmasın:
     altı saniye sonra kendiliğinden kalkıyor ve gerçek çizim görünüyor. */
  useEffect(() => {
    if (!pendingPreview) return;
    const timer = window.setTimeout(() => setPendingPreview(null), 6000);
    return () => window.clearTimeout(timer);
  }, [pendingPreview]);

  /* "Geri al" penceresi on saniye. Süre dolunca teklif kayboluyor; kalıcı
     bir geri alma yığını tutmuyoruz çünkü her kayıt zaten veritabanında ve
     küratör aynı yuvayı yeniden düzenleyebiliyor. */
  useEffect(() => {
    if (!undoable) return;
    const timer = window.setTimeout(() => setUndoable(null), 10_000);
    return () => window.clearTimeout(timer);
  }, [undoable]);

  const place = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const left = Math.min(
      Math.max(8, r.left),
      Math.max(8, window.innerWidth - PANEL_WIDTH - 8),
    );
    const top = Math.min(r.bottom + 6, window.innerHeight - PANEL_HEIGHT);
    setPos({ top: Math.max(8, top), left });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("scroll", place, { passive: true, capture: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, { capture: true });
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  /** Escape paneli kapatsın, odak düğmeye dönsün */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
        anchorRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /**
   * Tek kaydetme yolu.
   *
   * `patch` YALNIZCA değişen alanları taşıyor; uç gönderilmeyen alanı
   * değiştirmiyor (`CuratedImagesService.set` gerekçesi). Böylece odak
   * sekmesini kaydetmek alt metni silmiyor.
   */
  async function save(patch: Omit<SetCuratedImageInput, "surface" | "slotId">) {
    setBusy(true);
    setError(false);
    const before = draft;
    try {
      const next = await setCuratedImage({ surface, slotId: slot.id, ...patch });
      setDraft(next);
      setUndoable(before);
      /* Sunucu yeniden çizene kadarki boşluk: yalnızca bu aralıkta önizleme
         var. Adres yoksa (görsel kaldırıldı) önizleme de yok. */
      setPendingPreview(next.url && !next.isHidden ? next.url : null);
      router.refresh();
      return true;
    } catch {
      setError(true);
      return false;
    } finally {
      setBusy(false);
    }
  }

  /** İki adım: dosya sunucuya iner, dönen adres yuvaya BAĞLANIR */
  async function upload(action: () => Promise<{ url: string }>) {
    setBusy(true);
    setError(false);
    try {
      const uploaded = await action();
      await save({ url: uploaded.url });
    } catch {
      setError(true);
      setBusy(false);
    }
  }

  /**
   * Geri al: önceki kaydın BÜTÜN alanları geri yazılıyor.
   *
   * Kısmi geri yazma yanlış olurdu — geri alınan işlem birden çok alanı
   * değiştirmiş olabilir (görsel yükleme, oran ve odağı birlikte sıfırlar).
   */
  async function undo() {
    if (!undoable) return;
    const restored = undoable;
    setUndoable(null);
    await save({
      url: restored.url ?? "",
      position: restored.position ?? "",
      scale: restored.scale ?? undefined,
      ratio: restored.ratio ?? "",
      altTr: restored.altTr ?? "",
      altEn: restored.altEn ?? "",
      credit: restored.credit ?? "",
      treatment: restored.treatment ?? "",
      opacity: restored.opacity ?? undefined,
      blend: restored.blend ?? "",
      isHidden: restored.isHidden,
    });
  }

  /** Tıklama/klavye olayları ebeveyn düğmeye ya da bağlantıya ULAŞMASIN */
  const swallow = {
    onClick: (e: React.SyntheticEvent) => e.stopPropagation(),
    onPointerDown: (e: React.SyntheticEvent) => e.stopPropagation(),
    onMouseDown: (e: React.SyntheticEvent) => e.stopPropagation(),
    onKeyDown: (e: React.KeyboardEvent) => e.stopPropagation(),
  };

  /** Panelin ODAK sekmesinde gösterilen kare — her zaman güncel kayıttan */
  const source =
    draft?.url && !draft.isHidden
      ? isLocalUpload(draft.url)
        ? apiUrl(draft.url)
        : draft.url
      : null;

  const preview = pendingPreview
    ? isLocalUpload(pendingPreview)
      ? apiUrl(pendingPreview)
      : pendingPreview
    : null;

  return (
    <>
      {/* Kaydedilen kare YALNIZCA sunucu yeniden çizene kadar burada duruyor.
          `pointer-events: none` — altındaki içerik tıklanabilir kalıyor. */}
      {preview ? (
        <span
          className={styles.preview}
          aria-hidden="true"
          style={{
            backgroundImage: `url("${preview}")`,
            backgroundPosition: draft?.position ?? "50% 50%",
          }}
        />
      ) : null}

      <button
        ref={anchorRef}
        type="button"
        className={styles.pencil}
        data-filled={draft?.url ? "" : undefined}
        onClick={(event) => {
          event.stopPropagation();
          event.preventDefault();
          setOpen((v) => !v);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-expanded={open}
        title={`${t("edit")} — ${slot.label}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4 16.5V20z" />
        </svg>
        <span>{slot.id}</span>
      </button>

      {open && pos
        ? createPortal(
            <div
              className={styles.panel}
              style={{ top: pos.top, left: pos.left, width: PANEL_WIDTH }}
              role="dialog"
              aria-label={slot.label}
              {...swallow}
            >
              <header className={styles.head}>
                <span className={styles.headLabel}>{slot.label}</span>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    anchorRef.current?.focus();
                  }}
                  aria-label={t("close")}
                >
                  ×
                </button>
              </header>

              {/* ⚠️ KADRAJ NOTU BURADAN GÖRSEL SEKMESİNE TAŞINDI
                  (27 Ağustos 2026). Not "bu kareye ne konacak" sorusunu
                  cevaplıyor ve o soru YALNIZCA yükleme anında soruluyor;
                  başlıkta durduğunda beş sekmenin hepsinde yer kaplıyor,
                  panel uzuyor ve asıl işin — dosya seçmenin — altına
                  itiyordu. Artık önerilen boyut ve biçimle birlikte,
                  yükleme düğmesinin tam üstünde. */}
              <div className={styles.tabs} role="tablist">
                {TABS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={tab === id}
                    className={styles.tab}
                    data-on={tab === id ? "" : undefined}
                    onClick={() => setTab(id)}
                  >
                    {t(TAB_KEYS[id])}
                  </button>
                ))}
              </div>

              <div className={styles.body}>
                {tab === "image" ? (
                  <ImageTab
                    busy={busy}
                    hasImage={Boolean(draft?.url)}
                    /* Yüklü kare sekmenin BAŞINDA: küratör neyin üstüne
                       yazdığını görerek yüklüyor. */
                    current={source}
                    slot={slot}
                    ratio={draft?.ratio ?? slot.defaultRatio}
                    fileRef={fileRef}
                    onFile={(file) => void upload(() => uploadImage(file))}
                    onUrl={(url) => void upload(() => uploadImageFromUrl(url))}
                    onClear={() => void save({ url: "" })}
                    onReset={() => void save({ reset: true })}
                  />
                ) : null}

                {tab === "focus" ? (
                  <FocusTab
                    busy={busy}
                    /* Odak kutusu KAYDIN karesini gösteriyor, uçuştaki
                       önizlemeyi değil: küratör var olan görselin odağını
                       ayarlıyor. */
                    preview={source}
                    position={draft?.position ?? null}
                    scale={draft?.scale ?? 100}
                    onSave={(position, scale) => void save({ position, scale })}
                  />
                ) : null}

                {tab === "crop" ? (
                  <CropTab
                    busy={busy}
                    ratios={slot.ratios}
                    defaultRatio={slot.defaultRatio}
                    value={draft?.ratio ?? null}
                    onSave={(ratio) => void save({ ratio })}
                  />
                ) : null}

                {tab === "text" ? (
                  <TextTab
                    busy={busy}
                    record={draft}
                    onSave={(patch) => void save(patch)}
                  />
                ) : null}

                {tab === "view" ? (
                  <ViewTab
                    busy={busy}
                    record={draft}
                    defaultTreatment={slot.defaultTreatment}
                    onSave={(patch) => void save(patch)}
                  />
                ) : null}
              </div>

              <footer className={styles.foot}>
                {busy ? <span className={styles.busy}>{t("busy")}</span> : null}
                {error ? (
                  <span className={styles.error} role="alert">
                    {t("error")}
                  </span>
                ) : null}
                {undoable && !busy ? (
                  <button
                    type="button"
                    className={styles.undo}
                    onClick={() => void undo()}
                  >
                    {t("undo")}
                  </button>
                ) : null}
              </footer>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Sekmeler
   ══════════════════════════════════════════════════════════════════ */

const PANEL_WIDTH = 300;
/**
 * Panelin en uzun sekmesinin yaklaşık yüksekliği — alttan kelepçe için.
 *
 * Görsel sekmesi 27 Ağustos 2026'da büyüdü (küçük resim + önerilen boyut +
 * kadraj notu). Değer buna göre yeniden ölçüldü: kelepçe küçük kalırsa panel
 * ekranın altından taşar ve küratör YİNE sayfayı kaydırmak zorunda kalır —
 * yani düzeltilen şeyin kendisi geri gelir.
 */
const PANEL_HEIGHT = 470;

const TABS = ["image", "focus", "crop", "text", "view"] as const;
type Tab = (typeof TABS)[number];

const TAB_KEYS: Record<Tab, string> = {
  image: "tabImage",
  focus: "tabFocus",
  crop: "tabCrop",
  text: "tabText",
  view: "tabView",
};

/**
 * GÖRSEL SEKMESİ — mevcut kare, künye, sonra yükleme.
 *
 * ── SIRA BİLİNÇLİ ────────────────────────────────────────────────────────
 * Küratörün üç sorusu var ve üçü de yükleme düğmesine BASMADAN ÖNCE
 * cevaplanmalı: "şu an ne var", "ne kadar büyük olmalı", "bu kare neyin
 * karesi". Üçü de düğmenin hemen üstünde duruyor; hiçbiri için ne panelde
 * ne sayfada kaydırmak gerekiyor (kullanıcı bildirimi, 27 Ağustos 2026).
 *
 * ⚠️ ÖNERİLEN BOYUT YUVADAN GELİYOR, SABİT DEĞİL. Her yuvanın kendi ölçüsü
 * ve kendi oranı var (kapı 720×960 · 3:4, niş 600×1200 · 9:16, katman fonu
 * 2560×1200 · 21:9). Tek bir "1920×1080" satırı yazmak küratöre yanlış
 * kareyi hazırlatırdı.
 */
function ImageTab({
  busy,
  hasImage,
  current,
  slot,
  ratio,
  fileRef,
  onFile,
  onUrl,
  onClear,
  onReset,
}: {
  busy: boolean;
  hasImage: boolean;
  /** Yuvada ŞU AN duran kare — yoksa yükleme alanı tek başına */
  current: string | null;
  slot: CuratedSlotView;
  /** Küratörün seçtiği oran; seçmediyse yuvanın varsayılanı */
  ratio: string;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onFile: (file: File) => void;
  onUrl: (url: string) => void;
  onClear: () => void;
  onReset: () => void;
}) {
  const t = useTranslations("curator");
  const [url, setUrl] = useState("");

  return (
    <>
      {current ? (
        <span
          className={styles.thumb}
          style={{ backgroundImage: `url("${current}")` }}
          role="img"
          aria-label={t("currentImage")}
        />
      ) : null}

      {/* ÖNERİLEN KARE — düğmenin hemen üstünde, yuvadan türetilmiş */}
      <p className={styles.spec}>
        <span className={styles.specLine}>
          {t("specSize", { w: slot.size.w, h: slot.size.h, ratio })}
        </span>
        <span className={styles.specFormat}>{t("specFormat")}</span>
      </p>

      {/* BU KARE NEYİN KARESİ — yuvanın kadraj notu */}
      <p className={styles.about}>{slot.hint}</p>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = "";
        }}
      />
      <button
        type="button"
        className={styles.primary}
        disabled={busy}
        onClick={() => fileRef.current?.click()}
      >
        {t("fromFile")}
      </button>

      <label className={styles.field}>
        <span>{t("fromUrl")}</span>
        <span className={styles.row}>
          <input
            type="url"
            value={url}
            placeholder={t("urlPlaceholder")}
            disabled={busy}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              event.stopPropagation();
              if (event.key === "Enter" && url.trim()) {
                event.preventDefault();
                onUrl(url.trim());
                setUrl("");
              }
            }}
          />
          <button
            type="button"
            disabled={busy || url.trim().length === 0}
            onClick={() => {
              onUrl(url.trim());
              setUrl("");
            }}
          >
            {t("fetch")}
          </button>
        </span>
      </label>

      {/* Adres olduğu gibi saklanmıyor: backend görseli İNDİRİP kendi
          diskimize yazıyor. CSP `img-src` yabancı sunucuya izin vermiyor. */}
      <p className={styles.note}>{t("urlNote")}</p>

      {hasImage ? (
        <button
          type="button"
          className={styles.ghost}
          disabled={busy}
          onClick={onClear}
        >
          {t("removeImage")}
        </button>
      ) : null}
      <button
        type="button"
        className={styles.ghost}
        disabled={busy}
        onClick={onReset}
      >
        {t("resetSlot")}
      </button>
    </>
  );
}

/**
 * ODAK SEKMESİ — sürüklenen artı imleci.
 *
 * Spor kanadında odak üç slider'la ayarlanıyor ve o, bir bant kapağı için
 * yeterliydi. Bleach'te yuva başına odak gerektiği için sürükleme şart:
 * küratör "yüz nerede kalsın" sorusunu ekranda görerek cevaplıyor.
 *
 * ⚠️ KLAVYE DE ÇALIŞIYOR. Artı bir `<button>`; ok tuşları %1, Shift+ok %10
 * kaydırıyor. Sürükleme tek başına bırakılsaydı yuva klavyeyle
 * düzenlenemezdi.
 */
function FocusTab({
  busy,
  preview,
  position,
  scale,
  onSave,
}: {
  busy: boolean;
  preview: string | null;
  position: string | null;
  scale: number;
  onSave: (position: string, scale: number) => void;
}) {
  const t = useTranslations("curator");
  const boxRef = useRef<HTMLDivElement | null>(null);
  const parsed = parsePosition(position);
  const [x, setX] = useState(parsed.x);
  const [y, setY] = useState(parsed.y);
  const [zoom, setZoom] = useState(scale);

  const move = (event: React.PointerEvent) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    setX(pct((event.clientX - box.left) / box.width));
    setY(pct((event.clientY - box.top) / box.height));
  };

  if (!preview) {
    return <p className={styles.note}>{t("focusNeedsImage")}</p>;
  }

  return (
    <>
      <p className={styles.note}>{t("focusHint")}</p>

      <div
        ref={boxRef}
        className={styles.focusBox}
        style={{ backgroundImage: `url("${preview}")` }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) move(event);
        }}
      >
        <button
          type="button"
          className={styles.crosshair}
          style={{ left: `${x}%`, top: `${y}%` }}
          aria-label={t("focusCrosshair", { x, y })}
          onKeyDown={(event) => {
            const step = event.shiftKey ? 10 : 1;
            if (event.key === "ArrowLeft") setX((v) => pct((v - step) / 100));
            else if (event.key === "ArrowRight") setX((v) => pct((v + step) / 100));
            else if (event.key === "ArrowUp") setY((v) => pct((v - step) / 100));
            else if (event.key === "ArrowDown") setY((v) => pct((v + step) / 100));
            else return;
            event.preventDefault();
            event.stopPropagation();
          }}
        />
      </div>

      {/* Alt sınır 100: altına inen değer kırpma kutusunda boşluk bırakır ve
          altındaki zemin görünür (spor kanadında ölçüldü). */}
      <label className={styles.field}>
        <span>
          {t("zoom")} · {zoom}%
        </span>
        <input
          type="range"
          min={100}
          max={300}
          step={5}
          value={zoom}
          disabled={busy}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
      </label>

      <span className={styles.row}>
        <button
          type="button"
          className={styles.primary}
          disabled={busy}
          onClick={() => onSave(`${x}% ${y}%`, zoom)}
        >
          {t("save")}
        </button>
        <button
          type="button"
          className={styles.ghost}
          disabled={busy}
          onClick={() => {
            setX(50);
            setY(50);
            setZoom(100);
            // Boş `position` = sütuna null yazılır, CSS varsayılanına dönülür
            onSave("", 100);
          }}
        >
          {t("focusReset")}
        </button>
      </span>
    </>
  );
}

function CropTab({
  busy,
  ratios,
  defaultRatio,
  value,
  onSave,
}: {
  busy: boolean;
  ratios: string[];
  defaultRatio: string;
  value: string | null;
  onSave: (ratio: string) => void;
}) {
  const t = useTranslations("curator");
  const active = value ?? defaultRatio;

  return (
    <>
      <p className={styles.note}>{t("cropHint")}</p>
      <div className={styles.chips}>
        {ratios.map((ratio) => (
          <button
            key={ratio}
            type="button"
            className={styles.chip}
            data-on={active === ratio ? "" : undefined}
            disabled={busy}
            onClick={() => onSave(ratio === defaultRatio ? "" : ratio)}
          >
            {ratio}
            {ratio === defaultRatio ? (
              <span className={styles.chipTag}>{t("ratioDefault")}</span>
            ) : null}
          </button>
        ))}
      </div>
    </>
  );
}

function TextTab({
  busy,
  record,
  onSave,
}: {
  busy: boolean;
  record: CuratedImageRecord | null;
  onSave: (patch: { altTr: string; altEn: string; credit: string }) => void;
}) {
  const t = useTranslations("curator");
  const [altTr, setAltTr] = useState(record?.altTr ?? "");
  const [altEn, setAltEn] = useState(record?.altEn ?? "");
  const [credit, setCredit] = useState(record?.credit ?? "");

  return (
    <>
      <label className={styles.field}>
        <span>{t("altTr")}</span>
        <input
          type="text"
          value={altTr}
          disabled={busy}
          onChange={(event) => setAltTr(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
        />
      </label>
      <label className={styles.field}>
        <span>{t("altEn")}</span>
        <input
          type="text"
          value={altEn}
          disabled={busy}
          onChange={(event) => setAltEn(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
        />
      </label>
      {/* Künye ÇEVRİLMİYOR: kaynağın adı bir özel ad */}
      <label className={styles.field}>
        <span>{t("credit")}</span>
        <input
          type="text"
          value={credit}
          disabled={busy}
          placeholder={t("creditPlaceholder")}
          onChange={(event) => setCredit(event.target.value)}
          onKeyDown={(event) => event.stopPropagation()}
        />
      </label>
      <button
        type="button"
        className={styles.primary}
        disabled={busy}
        onClick={() => onSave({ altTr, altEn, credit })}
      >
        {t("save")}
      </button>
    </>
  );
}

function ViewTab({
  busy,
  record,
  defaultTreatment,
  onSave,
}: {
  busy: boolean;
  record: CuratedImageRecord | null;
  defaultTreatment: string;
  onSave: (patch: {
    treatment?: string;
    opacity?: number;
    blend?: string;
    isHidden?: boolean;
  }) => void;
}) {
  const t = useTranslations("curator");
  const treatment = record?.treatment ?? defaultTreatment;
  const [opacity, setOpacity] = useState(record?.opacity ?? 100);

  return (
    <>
      <span className={styles.label}>{t("treatment")}</span>
      <div className={styles.chips}>
        {SLOT_TREATMENTS.map((value) => (
          <button
            key={value}
            type="button"
            className={styles.chip}
            data-on={treatment === value ? "" : undefined}
            disabled={busy}
            onClick={() => onSave({ treatment: value })}
          >
            {t(`treatment_${value}` as never)}
          </button>
        ))}
      </div>

      <label className={styles.field}>
        <span>
          {t("opacity")} · {opacity}%
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={opacity}
          disabled={busy}
          onChange={(event) => setOpacity(Number(event.target.value))}
          onPointerUp={() => onSave({ opacity })}
          onKeyUp={() => onSave({ opacity })}
        />
      </label>

      <label className={styles.field}>
        <span>{t("blend")}</span>
        <select
          value={record?.blend ?? "normal"}
          disabled={busy}
          onChange={(event) => onSave({ blend: event.target.value })}
        >
          {SLOT_BLENDS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      {/* Geçici gizle: satır DURUYOR, çizim yuvanın tasarlanmış yedeğine
          düşüyor. `resetSlot`tan farkı bu — orası kaydı sıfırlar. */}
      <button
        type="button"
        className={styles.ghost}
        disabled={busy}
        aria-pressed={record?.isHidden ?? false}
        onClick={() => onSave({ isHidden: !(record?.isHidden ?? false) })}
      >
        {record?.isHidden ? t("show") : t("hide")}
      </button>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Yardımcılar
   ══════════════════════════════════════════════════════════════════ */

/** "40% 25%" → { x: 40, y: 25 }. Bozuk/eksik değer ortaya düşer. */
function parsePosition(value: string | null): { x: number; y: number } {
  const match = /^(\d{1,3})%\s+(\d{1,3})%$/.exec(value ?? "");
  if (!match) return { x: 50, y: 50 };
  return { x: Number(match[1]), y: Number(match[2]) };
}

/** 0–1 aralığındaki oranı 0–100 tam sayıya kelepçele */
function pct(ratio: number): number {
  return Math.round(Math.min(1, Math.max(0, ratio)) * 100);
}
