import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DepthRail } from "@/components/anime/bleach/DepthRail";
import { Senkaimon } from "@/components/anime/bleach/Senkaimon";
import {
  LAYER_IDS,
  WorldSection,
  type LayerId,
} from "@/components/anime/bleach/WorldSection";
import world from "@/components/anime/bleach/world.module.css";
import styles from "./page.module.css";

/**
 * `/anime/bleach/playground` — TASARIM SİSTEMİ DENEMESİ.
 *
 * İçerik YOK, bilinçli olarak yok. Bu rota tek bir soruyu cevaplıyor:
 * beş palet, derinlik rayı ve Senkaimon geçişi bir arada çalışıyor mu?
 *
 * ── NEDEN AYRI ROTA ──────────────────────────────────────────────────────
 * Sistemi asıl sayfada denemek, henüz yazılmamış on sekiz bölümün
 * yerleşimini şimdiden bağlamak olurdu. Burada her katman aynı iskeleti
 * taşıyor, yani gördüğün fark TOKEN farkı — düzen farkı değil.
 *
 * ⚠️ KLASÖR ADINDA ALT ÇİZGİ YOK. Brief `_playground` diyor ama App
 * Router'da `_` önekli klasör ÖZEL KLASÖRDÜR: rotadan tamamen çıkarılır
 * (ölçüldü — derleme çıktısında rota hiç görünmedi). Sayfanın erişilebilir
 * olması gerektiği için ön ek düşürüldü; "kalıcı değil" mesajını `robots`
 * ve bu başlık taşıyor.
 *
 * ⚠️ GEÇİCİ: bölümler oturduktan sonra bu rota siliniyor.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "anime.bleach.world",
  });
  return {
    title: t("playgroundTitle"),
    /* İskele rotası: arama motoruna hiç girmesin */
    robots: { index: false, follow: false },
  };
}

/** Katman başına İngilizce sinematik satır — ÇEVRİLMEZ, sayfanın imza sesi */
const EYEBROW: Record<LayerId, string> = {
  living: "WORLD OF THE LIVING",
  "soul-society": "SOUL SOCIETY",
  "hueco-mundo": "THE WORLD OF THE HOLLOW",
  royal: "THE ROYAL REALM",
  wandenreich: "THE INVISIBLE EMPIRE",
};

/** Geçidin canon adı — hangi dünyaya girildiğine göre değişiyor */
const GATE: Partial<Record<LayerId, { kind: "senkaimon" | "garganta" | "schatten"; label: string }>> =
  {
    "soul-society": { kind: "senkaimon", label: "SENKAIMON" },
    "hueco-mundo": { kind: "garganta", label: "GARGANTA" },
    royal: { kind: "senkaimon", label: "ŌKEN" },
    wandenreich: { kind: "schatten", label: "SCHATTEN BEREICH" },
  };

export default async function BleachPlayground({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "anime.bleach.world",
  });

  const labels = Object.fromEntries(
    LAYER_IDS.map((id) => [id, t(`layers.${id}`)]),
  ) as Record<LayerId, string>;

  return (
    // `<main>` DEĞİL: kök düzen sayfayı zaten `<main id="icerik">` içine
    // alıyor; ikinci bir main ekran okuyucunun sınır listesini bozuyordu.
    // Site genelindeki aynı desen bu turda `div`e çevrildi.
    <div className={`${world.page} ${styles.page}`} data-world="bleach">
      <DepthRail labels={labels} ariaLabel={t("railAria")} />

      <header className={`${world.band} ${styles.opening}`}>
        <p className={world.eyebrow} lang="en">
          EVERY SOUL LEAVES A SHADOW
        </p>
        <h1 className={world.hero} lang="en">
          BLEACH
        </h1>
        <hr className={world.rule} />
        <p className={`${world.body} ${styles.note}`}>{t("playgroundNote")}</p>

        {/* Tipografik seslerin yan yana denemesi. Her satır farklı bir
            aileyi çağırıyor; amaç ölçek ve harf aralığının aynı ekranda
            tutarlı okunduğunu görmek. */}
        <section className={styles.scale} aria-label={t("scaleTitle")}>
          <p className={world.meta}>{t("scaleTitle")}</p>
          <p className={world.section}>斬魄刀 · Zanpakutō</p>
          <p className={world.kubo} lang="en">
            THE CYCLE OF SOULS
          </p>
          <p className={world.body}>
            Türkçe gövde metni Inter ile diziliyor — ş, ğ, ı, İ, ö, ü, ç
            harfleri eksiksiz. Ölçü {""}
            <span className={world.meta}>68ch</span> ile sınırlı.
          </p>
          {/* ⚠️ Gotik aile YALNIZCA burada ve yalnızca İngilizce/Almanca:
              Türkçe diyakritiği yok (`scripts/check-bleach-fonts.mjs`). */}
          <p className={world.gothic} lang="de">
            Wandenreich
          </p>
          <p className={`${world.numeral} ${styles.numerals}`}>0123456789</p>
        </section>
      </header>

      {/* Beş katman, aralarında geçitler. Her katman AYNI iskeleti
          taşıyor — gördüğün fark yalnızca token farkı. */}
      {LAYER_IDS.map((id) => {
        const gate = GATE[id];
        return (
          <div key={id}>
            {gate ? (
              <Senkaimon to={id} kind={gate.kind} label={gate.label} />
            ) : null}
            <WorldSection layer={id} eyebrow={EYEBROW[id]} title={labels[id]}>
              <p className={world.body}>{t("playgroundNote")}</p>
              <p className={world.meta}>data-layer=&quot;{id}&quot;</p>
              {/* Yüzey/kenarlık token'larının katmanla döndüğünü görmek
                  için tek bir örnek kutu. */}
              <span className={styles.swatch}>
                <span className={styles.swatchInner}>surface · border</span>
              </span>
            </WorldSection>
          </div>
        );
      })}
    </div>
  );
}
