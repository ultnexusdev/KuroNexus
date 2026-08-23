import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { animeHref } from "@/lib/anime/routes";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { BleachHero } from "@/components/anime/bleach/BleachHero";
import { CuratorManifest } from "@/components/anime/bleach/CuratorManifest";
import world from "@/components/anime/bleach/world.module.css";
import shell from "../layout.module.css";
import styles from "./page.module.css";

/**
 * `/anime/bleach` — BLEACH EVRENİ.
 *
 * ── BUGÜN NE VAR ─────────────────────────────────────────────────────────
 * Küratör altyapısı, tasarım sistemi ve **P01 · Ruhların Dengesi**.
 * Kalan on yedi bölüm sırayla geliyor.
 *
 * ⚠️ SAYFA HÂLÂ LİNKLİ DEĞİL — `/anime` hub'ındaki kart duruyor ama sayfa
 * `noindex`. Bölümler oturana kadar arama motoruna girmiyor.
 *
 * ── KÜRATÖR SÖZLEŞMESİ ───────────────────────────────────────────────────
 * Sayfada çıplak `<Image>` YOK ve olmayacak. Her kadraj `<CuratedImage>`
 * üzerinden geçiyor; yuvanın oranı, işlem biçimi ve boşken ne çizeceği
 * manifestoda (`lib/anime/bleach/slots.ts`) yazılı.
 *
 * ── NEDEN `data-world="bleach"` KÖKTE ────────────────────────────────────
 * Sayfanın taban derisi burada açılıyor; katmanlar kendi `data-layer`ını
 * içeride taşıyor. Kanadın Bebas ölçeği de burada eziliyor
 * (`world.module.css`) — Bleach'in sesi ince ve geniş aralıklı, kanadınki
 * afiş kapitali; ikisi aynı sayfada duramaz.
 *
 * `force-dynamic` — küratör okumaları `no-store` ve yüklenen kare sayfa
 * tazelenince ANINDA görünmeli (Naruto Evreni'ndeki aynı karar).
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anime.bleach.scaffold" });
  return {
    title: t("title"),
    description: t("lede"),
    /* Bölümler tamamlanana kadar arama motoruna girmesin. P18'de kalkacak. */
    robots: { index: false, follow: false },
  };
}

export default async function BleachUniversePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, isAdmin] = await Promise.all([
    getTranslations({ locale, namespace: "anime.bleach.scaffold" }),
    readIsAdmin(),
  ]);

  return (
    <CuratorFrame isAdmin={isAdmin}>
      <main className={`${world.page} ${styles.page}`} data-world="bleach">
        {/* Kırıntı yolu hero'nun ÜSTÜNDE değil içinde duramaz: hero tam
            ekran bir sahne ve üstüne bir gezinme şeridi koymak onu
            "sayfa başlığı"na indirger. Mutlak konumlu, sahnenin üzerinde
            yüzüyor. */}
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href="/dark-stories">KuroNexus</Link>
          <span className={shell.sep}>/</span>
          <Link href={animeHref.hall()}>Anime</Link>
          <span className={shell.sep}>/</span>
          <span>Bleach</span>
        </nav>

        <BleachHero locale={locale} />

        {/* P02 gelene kadar iniş bağlantısının hedefi burası. Bölüm
            geldiğinde `#living` gerçek katmana bağlanacak. */}
        <section id="living" className={styles.pending}>
          <p className={world.meta}>{t("pendingSections")}</p>
          <p className={`${world.body} ${styles.note}`}>{t("note")}</p>
          <p>
            <Link href="/anime/bleach/playground" className={styles.trialLink}>
              {t("playgroundLink")}
            </Link>
          </p>
        </section>

        {/* Eksik görseller paneli — yalnızca yöneticide çiziliyor */}
        <CuratorManifest />
      </main>
    </CuratorFrame>
  );
}
