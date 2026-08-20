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
import styles from "./PlayerCurator.module.css";

/**
 * FUTBOLCU SAYFASI · KÜRATÖR MODU.
 *
 * ── NE YAPIYOR ───────────────────────────────────────────────────────────
 * Mod açıkken sayfadaki HER görsel yuvasının köşesinde bir düzenle düğmesi
 * beliriyor. Düğme iki yol sunuyor: dosya seç (bilgisayardan) ya da adres
 * yapıştır. İkisi de aynı yere gidiyor — `/admin/uploads` — ve dönen
 * `/uploads/…` adresi o yuvaya bağlanıyor.
 *
 * ⚠️ ADRES OLDUĞU GİBİ SAKLANMIYOR, İNDİRİLİYOR. `uploadImageFromUrl` dış
 * görseli bizim sunucumuza yazıyor. Sebebi iki katlı: CSP `img-src` bir beyaz
 * liste (yabancı adres tarayıcıda sessizce engellenir) ve dış adres bir gün
 * ölürse görsel de ölür.
 *
 * ── KALICILIK: DÜRÜST SINIR ──────────────────────────────────────────────
 * Yüklenen DOSYA kalıcı — sunucumuzda duruyor ve adresi sabit. Yuva → adres
 * EŞLEŞMESİ ise bu tarayıcıda `localStorage`da tutuluyor, çünkü favori
 * futbolcu defteri bir veritabanı tablosu değil, depodaki bir TypeScript
 * dosyası ve üretimdeki konteyner o dosyaya yazamaz.
 *
 * Bu yüzden panel bir de KOD PARÇACIĞI üretiyor: tek tuşla kopyalanıp
 * `lib/sport/favourite-players.ts` içine yapıştırılınca değişiklik herkes
 * için kalıcı oluyor. Yani mod "önizleme + kalıcılaştırma reçetesi" olarak
 * çalışıyor; sessizce yalnızca kendi tarayıcısını değiştiren bir düğme değil.
 * Bu sınır panelin içinde de yazılı — küratör neyin nerede durduğunu bilsin.
 *
 * ⚠️ `isAdmin` YALNIZCA DÜĞMEYİ gösteriyor. Yetkinin gerçek kapısı backend'de:
 * `/admin/uploads` oturum çerezi olmadan 401 döner.
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
  resetAll: string;
  busy: string;
  error: string;
  copy: string;
  copied: string;
  empty: string;
  close: string;
  placeholderBadge: string;
}

interface CuratorValue {
  curating: boolean;
  overrides: Record<string, string>;
  labels: CuratorLabels;
  setSlot: (id: string, url: string) => void;
  clearSlot: (id: string) => void;
}

const CuratorContext = createContext<CuratorValue | null>(null);

/** Görsel bileşenleri bunu okuyor. Sağlayıcı yoksa `null` — mod kapalı demek. */
export function usePlayerCurator(): CuratorValue | null {
  return useContext(CuratorContext);
}

function storageKey(slug: string) {
  return `kuronexus:player-slots:${slug}`;
}

export function PlayerCuratorProvider({
  slug,
  isAdmin,
  labels,
  children,
}: {
  slug: string;
  isAdmin: boolean;
  labels: CuratorLabels;
  children: ReactNode;
}) {
  const [curating, setCurating] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Kayıtlı düzenlemeler yalnızca istemcide okunuyor: sunucu render'ında
  // `localStorage` yok ve okumaya kalkmak hidrasyon uyuşmazlığı üretirdi.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug));
      if (raw) setOverrides(JSON.parse(raw) as Record<string, string>);
    } catch {
      // Bozuk kayıt: yok say, sayfa varsayılan görsellerle açılsın.
    }
  }, [slug]);

  const persist = useCallback(
    (next: Record<string, string>) => {
      setOverrides(next);
      try {
        window.localStorage.setItem(storageKey(slug), JSON.stringify(next));
      } catch {
        // Kota dolu / gizli mod: düzenleme bu oturumda yaşamaya devam eder.
      }
    },
    [slug],
  );

  const setSlot = useCallback(
    (id: string, url: string) => {
      persist({ ...overrides, [id]: url });
    },
    [overrides, persist],
  );

  const clearSlot = useCallback(
    (id: string) => {
      const next = { ...overrides };
      delete next[id];
      persist(next);
    },
    [overrides, persist],
  );

  const value = useMemo<CuratorValue>(
    () => ({ curating, overrides, labels, setSlot, clearSlot }),
    [curating, overrides, labels, setSlot, clearSlot],
  );

  const entries = Object.entries(overrides);

  /** `favourite-players.ts` içine yapıştırılacak parçacık. */
  const snippet = entries
    .map(
      ([id, url]) =>
        `// yuva: ${id}\nsrc: ${JSON.stringify(url)},\nplaceholder: false,`,
    )
    .join("\n\n");

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

              {entries.length === 0 ? (
                <p className={styles.empty}>{labels.empty}</p>
              ) : (
                <>
                  <ul className={styles.list}>
                    {entries.map(([id, url]) => (
                      <li key={id}>
                        <code>{id}</code>
                        <span>{url}</span>
                        <button type="button" onClick={() => clearSlot(id)}>
                          {labels.reset}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <pre className={styles.snippet}>{snippet}</pre>

                  <div className={styles.panelActions}>
                    <button
                      type="button"
                      className={styles.primary}
                      onClick={() => {
                        void navigator.clipboard
                          .writeText(snippet)
                          .then(() => {
                            setCopied(true);
                            window.setTimeout(() => setCopied(false), 2000);
                          })
                          .catch(() => setCopied(false));
                      }}
                    >
                      {copied ? labels.copied : labels.copy}
                    </button>
                    <button type="button" onClick={() => persist({})}>
                      {labels.resetAll}
                    </button>
                  </div>
                </>
              )}
            </aside>
          ) : null}
        </>
      ) : null}
    </CuratorContext.Provider>
  );
}
