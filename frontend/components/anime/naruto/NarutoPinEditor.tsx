"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setCuratedImage } from "@/lib/admin/api";
import {
  NARUTO_MAP_SURFACE,
  narutoPinSlotId,
  type NarutoNation,
} from "@/lib/anime/naruto";
import styles from "./NarutoSelectors.module.css";

/**
 * HARİTA İĞNE EDİTÖRÜ — brief'in iki adımlı işinin İKİNCİ adımı.
 *
 * Birinci adım haritanın kendi karesini yüklenebilir yapmıştı; iğneler
 * hâlâ `NARUTO_NATIONS` içinde elle yazılı koordinatlarda duruyordu, yani
 * küratör kendi haritasını yükledikten sonra iğneleri yerine oturtmak için
 * kod değiştirmek zorundaydı. Artık sürükleyip bırakıyor.
 *
 * ── ⚠️ KOORDİNAT NEREDE DURUYOR ──────────────────────────────────────────
 * `CuratedImage` tablosunda, `position` sütununda ("38% 42%"). O sütun
 * CSS `object-position` için var ve biçimi tam olarak bir koordinat çifti;
 * `url` de nullable. Yani YENİ TABLO, YENİ UÇ, MIGRATION GEREKMEDİ —
 * `slotId` serbest metin olduğu için backend deploy'u bile gerekmiyor
 * (gerekçesi `SetCuratedImageDto` başlığında yazılı).
 *
 * ⚠️ Hassasiyet TAM SAYI yüzde: doğrulama ondalık kabul etmiyor. İğneler
 * %1'lik ızgaraya oturuyor (~9px). Şematik bir harita için yeterli.
 *
 * ── ÜÇ GİRİŞ YOLU ────────────────────────────────────────────────────────
 *   SÜRÜKLE   İşaretçi yakalanıyor (`setPointerCapture`), yani imleç
 *             haritadan çıksa bile iğne takipte kalıyor.
 *   OK TUŞU   Odaklanmış iğne 1'er (Shift ile 5'er) adım kayıyor. Sürükleme
 *             fare gerektiriyor; klavyeyle gelen küratör aynı işi
 *             yapabilmeli.
 *   SIFIRLA   Kaydı silip koddaki değere geri dönüyor.
 *
 * ── ⚠️ YAZMA BIRAKINCA, SÜRÜKLERKEN DEĞİL ────────────────────────────────
 * Sürükleme sırasında konum yalnızca yerel durumda. Her piksel için bir
 * PATCH atmak yüzlerce istek demekti; ayrıca yarım bırakılan bir sürükleme
 * veritabanına yazılmamalı.
 */

/** "38% 42%" → {x, y}. Bozuk/boş değer `null` — çağıran koda düşüyor. */
function parsePosition(value: string | null | undefined): Pos | null {
  if (!value) return null;
  const match = /^(\d{1,3})% (\d{1,3})%$/.exec(value.trim());
  if (!match) return null;
  return { x: clampPct(Number(match[1])), y: clampPct(Number(match[2])) };
}

/** "38%" → 38. Koddaki değerler yüzde dizesi olarak yazılı. */
function parsePercent(value: string): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? clampPct(Math.round(n)) : 50;
}

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)));
}

interface Pos {
  x: number;
  y: number;
}

export function useNarutoPinEditor({
  nations,
  pins,
  enabled,
}: {
  nations: NarutoNation[];
  pins?: Record<string, string | null>;
  enabled: boolean;
}) {
  const router = useRouter();

  /** Editör açık mı — küratör modu içinde AYRI bir anahtar. */
  const [active, setActive] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState(false);

  /**
   * Taşınmış iğnelerin yerel kopyası.
   *
   * Sunucudan gelen `pins` doğruluğun kaynağı; bu harita yalnızca
   * `router.refresh()` dönene kadarki boşluğu kapatıyor — küratör
   * bıraktığı anda iğneyi yerinde görsün diye.
   */
  const [draft, setDraft] = useState<Record<string, Pos>>({});

  const mapRef = useRef<HTMLDivElement | null>(null);
  /** Sürükleme bir `click` de üretiyor; o tıklama seçimi değiştirmemeli. */
  const draggedRef = useRef(false);

  /** Koddaki varsayılanlar — kayıt yoksa geçerli olan */
  const coded = useMemo(
    () =>
      Object.fromEntries(
        nations.map((n) => [n.id, { x: parsePercent(n.x), y: parsePercent(n.y) }]),
      ) as Record<string, Pos>,
    [nations],
  );

  /** Kayıttan gelen konumlar (bozuk değer sessizce yok sayılıyor) */
  const stored = useMemo(() => {
    const out: Record<string, Pos> = {};
    for (const n of nations) {
      const parsed = parsePosition(pins?.[n.id]);
      if (parsed) out[n.id] = parsed;
    }
    return out;
  }, [nations, pins]);

  const posOf = useCallback(
    (nationId: string): Pos =>
      draft[nationId] ?? stored[nationId] ?? coded[nationId] ?? { x: 50, y: 50 },
    [draft, stored, coded],
  );

  /** İşaretçi konumunu haritanın yüzdesine çevir */
  const pctFromEvent = useCallback((event: { clientX: number; clientY: number }) => {
    const box = mapRef.current?.getBoundingClientRect();
    if (!box || box.width === 0 || box.height === 0) return null;
    return {
      x: clampPct(((event.clientX - box.left) / box.width) * 100),
      y: clampPct(((event.clientY - box.top) / box.height) * 100),
    };
  }, []);

  const save = useCallback(
    async (nationId: string, at: Pos) => {
      setBusy(nationId);
      setError(false);
      try {
        await setCuratedImage({
          surface: NARUTO_MAP_SURFACE,
          slotId: narutoPinSlotId(nationId),
          position: `${at.x}% ${at.y}%`,
        });
        router.refresh();
      } catch {
        setError(true);
        /* Taslağı GERİ ALMIYORUZ: küratör iğneyi bıraktığı yerde görsün ve
           yeniden deneyebilsin. Sayfa tazelendiğinde gerçek durum gelir. */
      } finally {
        setBusy(null);
      }
    },
    [router],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, nationId: string) => {
      if (!active) return;
      /* Yalnızca birincil düğme; sağ tık menüyü açsın. */
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(nationId);
      draggedRef.current = false;
    },
    [active],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      const at = pctFromEvent(event);
      if (!at) return;
      draggedRef.current = true;
      setDraft((prev) => ({ ...prev, [dragging]: at }));
    },
    [dragging, pctFromEvent],
  );

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    const nationId = dragging;
    setDragging(null);
    if (draggedRef.current) void save(nationId, posOf(nationId));
  }, [dragging, posOf, save]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, nationId: string) => {
      if (!active) return;
      const step = event.shiftKey ? 5 : 1;
      const deltas: Record<string, Pos> = {
        ArrowLeft: { x: -step, y: 0 },
        ArrowRight: { x: step, y: 0 },
        ArrowUp: { x: 0, y: -step },
        ArrowDown: { x: 0, y: step },
      };
      const delta = deltas[event.key];
      if (!delta) return;
      /* Sayfanın kaymasını engelle — ok tuşu burada iğneyi taşıyor */
      event.preventDefault();
      const from = posOf(nationId);
      const to = { x: clampPct(from.x + delta.x), y: clampPct(from.y + delta.y) };
      setDraft((prev) => ({ ...prev, [nationId]: to }));
      void save(nationId, to);
    },
    [active, posOf, save],
  );

  const reset = useCallback(
    async (nationId: string) => {
      setBusy(nationId);
      setError(false);
      try {
        await setCuratedImage({
          surface: NARUTO_MAP_SURFACE,
          slotId: narutoPinSlotId(nationId),
          reset: true,
        });
        setDraft((prev) => {
          const next = { ...prev };
          delete next[nationId];
          return next;
        });
        router.refresh();
      } catch {
        setError(true);
      } finally {
        setBusy(null);
      }
    },
    [router],
  );

  const moved = useCallback(
    (nationId: string) => Boolean(draft[nationId] ?? stored[nationId]),
    [draft, stored],
  );

  const panel = enabled ? (
    <div className={styles.pinBar} data-curator-slot>
      <button
        type="button"
        className={active ? styles.pinToggleOn : styles.pinToggle}
        aria-pressed={active}
        onClick={() => setActive((v) => !v)}
      >
        {active ? "İğne düzeni açık" : "İğneleri düzenle"}
      </button>

      {active ? (
        <>
          <p className={styles.pinHint}>
            İğneyi sürükle ya da odaklayıp ok tuşlarıyla taşı (Shift ile
            beşer adım). Bırakınca kaydediliyor. Hassasiyet tam sayı yüzde.
          </p>
          <div className={styles.pinResets}>
            {nations
              .filter((n) => moved(n.id))
              .map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={styles.pinReset}
                  disabled={busy === n.id}
                  onClick={() => void reset(n.id)}
                >
                  {n.village} · sıfırla
                </button>
              ))}
          </div>
        </>
      ) : null}

      {error ? (
        <p className={styles.pinError} role="alert">
          Kaydedilemedi. İğne bıraktığın yerde duruyor; tekrar dene.
        </p>
      ) : null}
    </div>
  ) : null;

  return {
    active: enabled && active,
    dragging,
    panel,
    mapRef,
    positionOf: (n: NarutoNation) => {
      const at = posOf(n.id);
      return { x: `${at.x}%`, y: `${at.y}%` };
    },
    isMoved: moved,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onKeyDown,
    /** Sürükleme sonrası gelen `click`i yut ve bayrağı sıfırla */
    consumeDragClick: () => {
      if (!draggedRef.current) return false;
      draggedRef.current = false;
      return true;
    },
  };
}
