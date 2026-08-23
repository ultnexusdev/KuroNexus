import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { animeHref } from "@/lib/anime/routes";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratedImage } from "@/components/anime/bleach/CuratedImage";
import { CuratorManifest } from "@/components/anime/bleach/CuratorManifest";
import shell from "../layout.module.css";
import styles from "./page.module.css";

/**
 * `/anime/bleach` — BLEACH EVRENİ.
 *
 * ── BUGÜN NE VAR ─────────────────────────────────────────────────────────
 * Yalnızca KÜRATÖR ALTYAPISI (23 Ağustos 2026). Sayfanın tasarımı henüz
 * yok ve bilinçli olarak yok: tasarım sistemi (beş dünya paleti, derinlik
 * rayı, Senkaimon geçişi) ayrı bir turda kuruluyor. Bu iskelet altyapının
 * yaşayacağı yüzeyi veriyor ve yuva sözleşmesini gerçek bir sayfada sınıyor.
 *
 * ⚠️ SAYFA HİÇBİR YERDEN LİNKLİ DEĞİL. `/anime` hub'ındaki Bleach kartı P17
 * turunda ekleniyor; o güne kadar rota yalnızca adresi bilene açık.
 *
 * ── KÜRATÖR SÖZLEŞMESİ ───────────────────────────────────────────────────
 * Sayfada çıplak `<Image>` YOK ve olmayacak. Her kadraj `<CuratedImage>`
 * üzerinden geçiyor; yuvanın oranı, işlem biçimi ve boşken ne çizeceği
 * manifestoda (`lib/anime/bleach/slots.ts`) yazılı.
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
    /* Sayfa inşa hâlinde: arama motoruna girmesin. P18'de kaldırılacak. */
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
      <main className={styles.page} data-world="bleach">
        <nav className={shell.crumb} aria-label="breadcrumb">
          <Link href="/dark-stories">KuroNexus</Link>
          <span className={shell.sep}>/</span>
          <Link href={animeHref.hall()}>Anime</Link>
          <span className={shell.sep}>/</span>
          <span>Bleach</span>
        </nav>

        <header className={styles.opening}>
          <p className={shell.eyebrow}>{t("eyebrow")}</p>
          <h1 className={`${shell.display} ${shell.world}`}>{t("title")}</h1>
          <p className={shell.lede}>{t("lede")}</p>
          <p className={styles.note}>{t("note")}</p>
        </header>

        {/* Yuva denemesi: üç farklı oran, üç farklı yedek davranışı.
            Amaç süs değil ölçüm — manifestodaki sözleşmenin gerçek bir
            sayfada tuttuğunu görmek. Bölümler geldiğinde bu blok gidiyor. */}
        <section className={styles.trial} aria-labelledby="bleach-trial">
          <h2 id="bleach-trial" className={styles.trialTitle}>
            {t("slotsTitle")}
          </h2>
          <p className={styles.note}>{t("slotsLede")}</p>

          {/* `decorative` YOK: bu üç kadrajın yanında onları anlatan bir metin
              durmuyor, yani alt metin gerçekten gerekli. Küratör alt metni
              yazmadıysa yuvanın adı kullanılıyor — boş `alt` bırakmaktan
              iyisi, çünkü ekran okuyucu en azından ne olduğunu söylüyor. */}
          <div className={styles.trialGrid}>
            <CuratedImage
              slotId="bleach:hero:ichigo"
              className={styles.trialTall}
              sizes="480px"
            />
            <CuratedImage
              slotId="bleach:world:soul-society"
              className={styles.trialWide}
              sizes="960px"
            />
            <CuratedImage
              slotId="bleach:legend:ichigo-kurosaki"
              className={styles.trialTall}
              sizes="480px"
              glyph="護"
            />
          </div>
        </section>

        {/* Eksik görseller paneli — yalnızca yöneticide çiziliyor */}
        <CuratorManifest />
      </main>
    </CuratorFrame>
  );
}
