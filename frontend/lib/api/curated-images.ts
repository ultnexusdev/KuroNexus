import { cache } from "react";
import { apiFetch } from "./client";

/**
 * Küratör görsel yuvaları — SUNUCU tarafındaki tek okuma noktası.
 *
 * ── NEDEN `cache()` ──────────────────────────────────────────────────────
 * `<CuratedImage>` bir SUNUCU bileşeni ve haritayı prop olarak almıyor: her
 * yuva kendisi çağırıyor. Prop drilling'in alternatifi bir React context
 * olurdu ve context, sayfanın tamamını istemci sınırına çekerdi (küratör modu
 * kapalıyken sıfır JS şartı bunu yasaklıyor — `CuratorFrame` başlığındaki
 * aynı gerekçe).
 *
 * `cache()` ile altmış yuva tek istek ediyor: aynı render turunda ilk çağrı
 * ağa çıkıyor, kalanı bellekten okuyor. `readIsAdmin()` da tam olarak bu
 * yöntemle çalışıyor.
 *
 * ── NEDEN `no-store` ─────────────────────────────────────────────────────
 * Küratör bir kare yükleyip sayfayı tazelediğinde yeni kareyi ANINDA
 * görmeli. Aynı karar `getCharacterDetail`, `getCharacterIndex` ve
 * `fetchAllPlayerImages`ta da alınmıştı ve gerekçesi ölçülmüştü: önbellekle
 * küratör "yükledim ama gelmedi" hatasını rastgele yaşıyor.
 *
 * ── HATA YUTULUYOR ───────────────────────────────────────────────────────
 * Uç düşerse BOŞ harita dönüyor ve sayfa yuvaların tasarlanmış yedekleriyle
 * açılıyor.
 *
 * ⚠️ Bu yedek süs değil: `main`e push İKİ servisi birden deploy ediyor ama
 * ikisi aynı anda ayağa kalkmıyor. Ön yüz yeni + backend eski penceresinde
 * bu uç 404 döner; yedek olmasaydı sayfa o pencerede çökerdi. Futbol
 * kanadında aynı ders `readCuratorImages` içinde yazılı.
 */

export interface CuratedImageRecord {
  slotId: string;
  /** `/uploads/…` — dış adres saklanmıyor (CSP + adres ölümü) */
  url: string | null;
  /** CSS `object-position`, "50% 30%" */
  position: string | null;
  /** Yüzde, 100–300 */
  scale: number | null;
  /** "16:9" — geçerliliği manifesto belirliyor (`resolveRatio`) */
  ratio: string | null;
  altTr: string | null;
  altEn: string | null;
  /** Künye satırı — ÇEVRİLMEZ */
  credit: string | null;
  /** photo | silhouette | duotone */
  treatment: string | null;
  /** Yüzde, 0–100 */
  opacity: number | null;
  blend: string | null;
  /** "Geçici gizle" — satır durur, çizim yuvanın yedeğine düşer */
  isHidden: boolean;
}

export type CuratedImageMap = Record<string, CuratedImageRecord>;

const EMPTY: CuratedImageMap = {};

export const readCuratedImages = cache(
  async (surface: string): Promise<CuratedImageMap> => {
    try {
      return await apiFetch<CuratedImageMap>(
        `/curated-images?surface=${encodeURIComponent(surface)}`,
        { cache: "no-store" },
      );
    } catch {
      return EMPTY;
    }
  },
);
