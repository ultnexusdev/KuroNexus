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
 * FUTBOL KANADI · KÜRATÖR MODU.
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
 * ── ÇOK SAHİPLİ (20 Ağustos 2026) ────────────────────────────────────────
 * İlk sürüm tek bir futbolcuya bağlıydı. Hub sayfası (`/spor/futbol`) bunu
 * kırdı: orada hem SAYFANIN kendi yuvaları var (hero, tarih şeridi kareleri)
 * hem de defterdeki HER futbolcunun kart yuvası. İkisi farklı "sahip"lere
 * ait ve aynı tabloda `playerSlug` sütunuyla ayrılıyorlar.
 *
 * Bu yüzden depo artık iki katlı: `images[sahip][yuvaId] = adres`. Bir yuva
 * kendi sahibini `slot.owner` ile söylüyor; söylemezse sayfanın varsayılan
 * sahibi (`defaultOwner`) geçerli. Backend'de yeni bir şey gerekmedi — hub
 * yuvaları `futbol-hub` sahibiyle aynı tabloya yazılıyor.
 *
 * ── KALICILIK: VERİTABANINDA ─────────────────────────────────────────────
 * Eşleşme `FavouritePlayerImage` tablosunda ve sunucu tarafında okunuyor,
 * yani sayfa ilk boyamada doğru kareyle geliyor ve herkes aynı şeyi görüyor.
 * `localStorage` yalnızca ESKİ (tarayıcı-yerel) düzenlemeleri kurtarmak için
 * okunuyor; yeni bir şey yazılmıyor.
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

/** Sahip → yuva kimliği → adres */
export type CuratorImages = Record<string, Record<string, string>>;

interface CuratorValue {
  curating: boolean;
  defaultOwner: string;
  labels: CuratorLabels;
  urlOf: (owner: string, slotId: string) => string | undefined;
  /** Veritabanına yazıyor. Başarısızsa `false` döner ve çağıran hatayı gösterir. */
  setSlot: (owner: string, slotId: string, url: string) => Promise<boolean>;
  clearSlot: (owner: string, slotId: string) => Promise<boolean>;
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
  defaultOwner,
  isAdmin,
  initialImages,
  labels,
  children,
}: {
  /** Sahibini söylemeyen yuvaların bağlanacağı slug */
  defaultOwner: string;
  isAdmin: boolean;
  /** Sunucudan gelen sahip → yuva → adres haritası (tek doğruluk kaynağı) */
  initialImages: CuratorImages;
  labels: CuratorLabels;
  children: ReactNode;
}) {
  const [curating, setCurating] = useState(false);
  /* Panel modun KENDİSİ değil. Eskiden panelin × düğmesi küratör modunu
     komple kapatıyordu ve panel açıkken düzenle düğmelerinin üstünü
     kapatıyordu — ikisi de ölçümde çıktı. Artık × yalnızca paneli katlıyor,
     mod açık kalıyor; alttaki anahtar modu açıp kapatıyor. */
  const [panelOpen, setPanelOpen] = useState(true);
  const [images, setImages] = useState<CuratorImages>(initialImages);
  const [legacy, setLegacy] = useState<Record<string, string>>({});
  const [migrating, setMigrating] = useState(false);

  /**
   * Eski tarayıcı-yerel düzenlemeleri topla — YALNIZCA sunucuda karşılığı
   * olmayanlar. Amaç tek: küratörün önceki turda yüklediği kareleri
   * kaybetmemek. Otomatik yazma YOK; panelde tek tuşlu bir teklif olarak
   * duruyor, çünkü sayfa açılışında sessizce yazma yapmak sürpriz olurdu.
   */
  useEffect(() => {
    if (!isAdmin) return;
    try {
      const raw = window.localStorage.getItem(legacyKey(defaultOwner));
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, string>;
      const own = initialImages[defaultOwner] ?? {};
      const pending: Record<string, string> = {};
      for (const [id, url] of Object.entries(parsed)) {
        if (!own[id] && typeof url === "string") pending[id] = url;
      }
      setLegacy(pending);
    } catch {
      // Bozuk kayıt: yok say.
    }
  }, [defaultOwner, isAdmin, initialImages]);

  const urlOf = useCallback(
    (owner: string, slotId: string) => images[owner]?.[slotId],
    [images],
  );

  const setSlot = useCallback(
    async (owner: string, slotId: string, url: string) => {
      try {
        await setFavouritePlayerImage({ playerSlug: owner, slotId, url });
      } catch {
        return false;
      }
      setImages((current) => {
        const next = { ...current, [owner]: { ...(current[owner] ?? {}) } };
        if (url) next[owner][slotId] = url;
        else delete next[owner][slotId];
        return next;
      });
      return true;
    },
    [],
  );

  const clearSlot = useCallback(
    (owner: string, slotId: string) => setSlot(owner, slotId, ""),
    [setSlot],
  );

  const value = useMemo<CuratorValue>(
    () => ({ curating, defaultOwner, labels, urlOf, setSlot, clearSlot }),
    [curating, defaultOwner, labels, urlOf, setSlot, clearSlot],
  );

  /** Panelin listesi: bütün sahiplerin bütün yuvaları, düz. */
  const entries = Object.entries(images).flatMap(([owner, map]) =>
    Object.entries(map).map(([id, url]) => ({ owner, id, url })),
  );
  const legacyEntries = Object.entries(legacy);

  async function migrate() {
    setMigrating(true);
    for (const [id, url] of legacyEntries) {
      // Sırayla: tek satırlık yazma, paralel gitmenin kazancı yok; hata
      // durumunda nerede kalındığını görmek daha değerli.
      await setSlot(defaultOwner, id, url);
    }
    try {
      window.localStorage.removeItem(legacyKey(defaultOwner));
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
            onClick={() =>
              setCurating((v) => {
                if (!v) setPanelOpen(true);
                return !v;
              })
            }
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

          {curating && panelOpen ? (
            <aside className={styles.panel}>
              <header>
                <h2>{labels.panelTitle}</h2>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  aria-label={labels.close}
                >
                  ×
                </button>
              </header>

              <p className={styles.note}>{labels.panelNote}</p>

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
                  {entries.map((entry) => (
                    <li key={`${entry.owner}/${entry.id}`}>
                      <code>
                        {entry.owner === defaultOwner
                          ? entry.id
                          : `${entry.owner}/${entry.id}`}
                      </code>
                      <span>{entry.url}</span>
                      <button
                        type="button"
                        onClick={() => void clearSlot(entry.owner, entry.id)}
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
