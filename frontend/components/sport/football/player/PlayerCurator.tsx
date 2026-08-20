"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setFavouritePlayerImage } from "@/lib/admin/api";
import styles from "./PlayerCurator.module.css";

/**
 * FUTBOLCU SAYFASI · KÜRATÖR MODU.
 *
 * ── NE YAPIYOR ───────────────────────────────────────────────────────────
 * Mod açıkken sayfadaki HER görsel yuvasının köşesinde bir düzenle düğmesi
 * beliriyor. Düğme iki yol sunuyor: dosya seç ya da adres yapıştır. İkisi de
 * `/admin/uploads`a gidiyor, dönen `/uploads/…` adresi ise
 * `PATCH /admin/sport-archive/player-image` ile o yuvaya bağlanıyor.
 *
 * ⚠️ ADRES OLDUĞU GİBİ SAKLANMIYOR, İNDİRİLİYOR. `uploadImageFromUrl` dış
 * görseli bizim sunucumuza yazıyor. İki sebep: CSP `img-src` bir beyaz liste
 * (yabancı adres tarayıcıda sessizce engellenir) ve dış adres bir gün ölürse
 * görsel de ölür.
 *
 * ── KALICILIK: ARTIK VERİTABANINDA ───────────────────────────────────────
 * Önceki sürümde yuva → adres eşleşmesi `localStorage`da duruyordu. Dosya
 * sunucuda kalıcıydı ama HANGİ YUVAYA ait olduğu yalnızca o tarayıcıda —
 * yani başka bir cihazdan bakınca yuva boş görünüyordu. Kullanıcı bunu fark
 * etti ve haklıydı.
 *
 * Artık eşleşme `FavouritePlayerImage` tablosunda: sunucu tarafında okunuyor
 * (`fetchPlayerImages`), sayfa ilk boyamada doğru kareyle geliyor ve herkes
 * aynı şeyi görüyor. `localStorage` yalnızca ESKİ düzenlemeleri kurtarmak
 * için okunuyor (aşağıdaki taşıma akışı) — yeni bir şey yazılmıyor.
 *
 * ⚠️ `isAdmin` YALNIZCA DÜĞMEYİ gösteriyor. Yetkinin gerçek kapısı backend'de:
 * uç oturum çerezi olmadan 401 döner (ölçüldü).
 */

export interface CuratorLabels {
  on: string;
  off: string;
  panelTitle: string;
  panelNote: string;
  edit: string;
  fromFile: string;
  fromUrl: string;
  urlPlaceholder: string;
  fetch: string;
  reset: string;
  busy: string;
  error: string;
  empty: string;
  close: string;
  saving: string;
  migrate: string;
  migrating: string;
  migrateNote: string;
}

interface CuratorValue {
  curating: boolean;
  overrides: Record<string, string>;
  labels: CuratorLabels;
  /** Veritabanına yazıyor. Başarısızsa `false` döner ve çağıran hatayı gösterir. */
  setSlot: (id: string, url: string) => Promise<boolean>;
  clearSlot: (id: string) => Promise<boolean>;
}

const CuratorContext = createContext<CuratorValue | null>(null);

/** Görsel bileşenleri bunu okuyor. Sağlayıcı yoksa `null` — mod kapalı demek. */
export function usePlayerCurator(): CuratorValue | null {
  return useContext(CuratorContext);
}

/** Eski sürümün tarayıcı-yerel kayıt anahtarı. Yalnızca OKUNUYOR. */
function legacyKey(slug: string) {
  return `kuronexus:player-slots:${slug}`;
}

export function PlayerCuratorProvider({
  slug,
  isAdmin,
  initialImages,
  labels,
  children,
}: {
  slug: string;
  isAdmin: boolean;
  /** Sunucudan gelen yuva → adres haritası (tek doğruluk kaynağı) */
  initialImages: Record<string, string>;
  labels: CuratorLabels;
  children: ReactNode;
}) {
  const [curating, setCurating] = useState(false);
  const [overrides, setOverrides] = useState(initialImages);
  const [legacy, setLegacy] = useState<Record<string, string>>({});
  const [migrating, setMigrating] = useState(false);

  /**
   * Eski tarayıcı-yerel düzenlemeleri topla — YALNIZCA sunucuda karşılığı
   * olmayanlar. Amaç tek: küratörün önceki turda yüklediği kareleri
   * kaybetmemek. Otomatik yazmıyoruz; panelde tek tuşlu bir teklif olarak
   * duruyor, çünkü sayfa açılışında sessizce yazma yapmak sürpriz olurdu.
   */
  useEffect(() => {
    if (!isAdmin) return;
    try {
      const raw = window.localStorage.getItem(legacyKey(slug));
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, string>;
      const pending: Record<string, string> = {};
      for (const [id, url] of Object.entries(parsed)) {
        if (!initialImages[id] && typeof url === "string") pending[id] = url;
      }
      setLegacy(pending);
    } catch {
      // Bozuk kayıt: yok say.
    }
  }, [slug, isAdmin, initialImages]);

  const setSlot = useCallback(
    async (id: string, url: string) => {
      try {
        await setFavouritePlayerImage({
          playerSlug: slug,
          slotId: id,
          url,
        });
      } catch {
        return false;
      }
      setOverrides((current) => {
        const next = { ...current };
        if (url) next[id] = url;
        else delete next[id];
        return next;
      });
      return true;
    },
    [slug],
  );

  const clearSlot = useCallback((id: string) => setSlot(id, ""), [setSlot]);

  const value = useMemo<CuratorValue>(
    () => ({ curating, overrides, labels, setSlot, clearSlot }),
    [curating, overrides, labels, setSlot, clearSlot],
  );

  const entries = Object.entries(overrides);
  const legacyEntries = Object.entries(legacy);

  async function migrate() {
    setMigrating(true);
    for (const [id, url] of legacyEntries) {
      // Sırayla: yükleme ucu değil, tek satırlık bir yazma — paralel gitmenin
      // kazancı yok, hata durumunda hangisinde kaldığını görmek daha değerli.
      await setSlot(id, url);
    }
    try {
      window.localStorage.removeItem(legacyKey(slug));
    } catch {
      // Kota/gizli mod: taşıma yine de tamamlandı.
    }
    setLegacy({});
    setMigrating(false);
  }

  return (
    <CuratorContext.Provider value={value}>
      {children}

      {isAdmin ? (
        <>
          <button
            type="button"
            className={styles.toggle}
            data-on={curating || undefined}
            aria-pressed={curating}
            onClick={() => setCurating((v) => !v)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20h4L19 9a2.5 2.5 0 0 0-3.5-3.5L4 16.5V20z" />
              <path d="M14 6.5 17.5 10" />
            </svg>
            {curating ? labels.off : labels.on}
            {legacyEntries.length > 0 ? (
              <span className={styles.badge}>{legacyEntries.length}</span>
            ) : null}
          </button>

          {curating ? (
            <aside className={styles.panel}>
              <header>
                <h2>{labels.panelTitle}</h2>
                <button
                  type="button"
                  onClick={() => setCurating(false)}
                  aria-label={labels.close}
                >
                  ×
                </button>
              </header>

              <p className={styles.note}>{labels.panelNote}</p>

              {/* Eski tarayıcı-yerel düzenlemeler varsa kurtarma teklifi */}
              {legacyEntries.length > 0 ? (
                <div className={styles.migrate}>
                  <p>{labels.migrateNote}</p>
                  <button
                    type="button"
                    className={styles.primary}
                    disabled={migrating}
                    onClick={() => void migrate()}
                  >
                    {migrating
                      ? labels.migrating
                      : `${labels.migrate} (${legacyEntries.length})`}
                  </button>
                </div>
              ) : null}

              {entries.length === 0 ? (
                <p className={styles.empty}>{labels.empty}</p>
              ) : (
                <ul className={styles.list}>
                  {entries.map(([id, url]) => (
                    <li key={id}>
                      <code>{id}</code>
                      <span>{url}</span>
                      <button
                        type="button"
                        onClick={() => void clearSlot(id)}
                      >
                        {labels.reset}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          ) : null}
        </>
      ) : null}
    </CuratorContext.Provider>
  );
}
