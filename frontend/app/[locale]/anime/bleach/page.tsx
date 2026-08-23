import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { animeHref } from "@/lib/anime/routes";
import { shareCard } from "@/lib/seo";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { BleachHero } from "@/components/anime/bleach/BleachHero";
import { DepthRail } from "@/components/anime/bleach/DepthRail";
import { WorldLayers } from "@/components/anime/bleach/WorldLayers";
import { Gotei13Section } from "@/components/anime/bleach/Gotei13Section";
import { ZanpakutoSection } from "@/components/anime/bleach/ZanpakutoSection";
import { BankaiSection } from "@/components/anime/bleach/BankaiSection";
import { SoulHierarchy } from "@/components/anime/bleach/SoulHierarchy";
import { HollowEvolution } from "@/components/anime/bleach/HollowEvolution";
import { EspadaSection } from "@/components/anime/bleach/EspadaSection";
import { WandenreichSection } from "@/components/anime/bleach/WandenreichSection";
import { PowerSystems } from "@/components/anime/bleach/PowerSystems";
import { MaskWall } from "@/components/anime/bleach/MaskWall";
import { BloodWar } from "@/components/anime/bleach/BloodWar";
import { Legends } from "@/components/anime/bleach/Legends";
import { NobleHouses } from "@/components/anime/bleach/NobleHouses";
import { KeyLocations } from "@/components/anime/bleach/KeyLocations";
import { StoryTimeline } from "@/components/anime/bleach/StoryTimeline";
import { LAYER_IDS, type LayerId } from "@/components/anime/bleach/WorldSection";
import { SectionNav } from "@/components/anime/bleach/SectionNav";
import { BleachJsonLd } from "@/components/anime/bleach/BleachJsonLd";
import { CuratorManifest } from "@/components/anime/bleach/CuratorManifest";
import shell from "../layout.module.css";
import world from "@/components/anime/bleach/world.module.css";
import styles from "./page.module.css";

/**
 * `/anime/bleach` — BLEACH EVRENİ.
 *
 * ── BUGÜN NE VAR ─────────────────────────────────────────────────────────
 * Küratör altyapısı, tasarım sistemi ve **on altı bölümün tamamı**
 * (P01–P16): Ruhların Dengesi, Üç Dünya, Gotei 13, Zanpakutō Arşivi,
 * Bankai Salonu, Ruh Hiyerarşisi, Hueco Mundo, Espada, Wandenreich,
 * Ruhsal Güç Sistemi, Maskeler, Bin Yıllık Kan Savaşı, Efsaneler,
 * Asil Haneler, Mekânlar ve Kılıcın Çizelgesi.
 *
 * P18-a (performans) ve P18-b (erişilebilirlik + i18n + SEO) bitti.
 * **Sayfa yayında ve indekslenebilir.** Kalan tek tur P18-c: brief'in
 * "son kritik"i — en zayıf üç bölümün yeniden yazılması.
 *
 * ⚠️ Denetimler commit öncesi: `pnpm check:bleach` — gotik font,
 * kontrast, sayfa içi çapalar, azaltılmış hareket, i18n sızıntısı ve
 * performans bütçesi. Altısı da bu sayfa hakkında.
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

/** Locale ÖNEKSİZ yol — hreflang, canonical ve paylaşım kartı aynı kaynağı okusun */
const BLEACH_PATH = "/anime/bleach";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anime.bleach.meta" });
  const title = t("title");
  const description = t("description");

  /* hreflang/canonical (P18-b) artık `shareCard` üretiyor — gerekçe `lib/seo.ts` başlığında. */

  return {
    title,
    description,
    /* Kök düzenin openGraph'ı sığ birleşmeyle olduğu gibi kalırdı: kart
       "KuroNexus" başlığı ve ana sayfa adresiyle paylaşılırdı. `shareCard`
       bütün alanları yeniden yazıyor (gerekçe `lib/seo.ts` başlığında). */
    ...shareCard({
      title,
      description,
      locale,
      path: BLEACH_PATH,
      /* Hero'nun dört-parçalı kompozisyonu, 1200×630.
         Üreten: `scripts/build-bleach-og.mjs` */
      image: "/og/bleach.png",
    }),
    /**
     * ⚠️ `robots: noindex` 23 Ağustos 2026'da KALKTI (P18-b'nin son adımı).
     *
     * Kilit on altı bölüm boyunca duruyordu ve şu üçü bitmeden açılmadı:
     * içerik tamam, İngilizce çıktı gerçekten İngilizce
     * (`check-bleach-i18n.mjs`), sayfa içi çapaların hepsi canlı
     * (`check-bleach-anchors.mjs`). Sayfa artık `app/sitemap.ts` içinde de
     * listeli.
     *
     * ⚠️ `/anime/bleach/playground` KAPALI KALIYOR — tasarım denemesi,
     * kendi `generateMetadata`sında kendi `noindex`ini taşıyor.
     */
  };
}

export default async function BleachUniversePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [tw, isAdmin] = await Promise.all([
    getTranslations({ locale, namespace: "anime.bleach.world" }),
    readIsAdmin(),
  ]);

  /* Rayın etiketleri: katman adı ÇEVRİLİYOR ama kanji çevrilmiyor
     (`DepthRail` kanjiyi kendisi biliyor). */
  const railLabels = Object.fromEntries(
    LAYER_IDS.map((id) => [id, tw(`layers.${id}`)]),
  ) as Record<LayerId, string>;

  return (
    <CuratorFrame isAdmin={isAdmin}>
      {/* ⚠️ `<main>` DEĞİL. Kök düzen sayfayı zaten `<main id="icerik">`
          içine alıyor (`app/[locale]/layout.tsx`); burada ikinci bir
          `main` açmak belgede iki ana sınır demekti ve ekran okuyucunun
          sınır listesi anlamını yitirirdi. P18-b'de düzeltildi.
          ⚠️ Site genelinde aynı desen sürüyor (Naruto, spor, müzik) —
          ayrı bir turda ele alınacak, bu sayfa artık doğru. */}
      <div className={`${world.page} ${styles.page}`} data-world="bleach">
        {/* Sekmeyle gelen kişinin ilk durağı: on altı bölümün haritası.
            Görünmez, yalnızca odaklanınca açılıyor. */}
        <SectionNav locale={locale} />

        {/* Arama motoruna sayfanın iç yapısı: on altı bölüm, sırayla */}
        <BleachJsonLd locale={locale} />

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

        {/* Derinlik rayı: sayfanın tamamı bir dikey iniş olduğu için
            kullanıcı hangi katmanda olduğunu her an görüyor. Katmanlar
            geldiği için ray artık gerçek hedeflere bağlı. */}
        <DepthRail labels={railLabels} ariaLabel={tw("railAria")} />

        <BleachHero locale={locale} />

        <WorldLayers locale={locale} />

        <Gotei13Section locale={locale} />

        <ZanpakutoSection locale={locale} />

        <BankaiSection locale={locale} />

        <SoulHierarchy locale={locale} />

        <HollowEvolution locale={locale} />

        <EspadaSection locale={locale} />

        <WandenreichSection locale={locale} />

        <PowerSystems locale={locale} />

        <MaskWall locale={locale} />

        <BloodWar locale={locale} />

        <Legends locale={locale} />

        <NobleHouses locale={locale} />

        <KeyLocations locale={locale} />

        <StoryTimeline locale={locale} />

        {/* ⚠️ "P18 · SON GEÇİŞ" DURUM BLOĞU KALDIRILDI (P18-b).
            On altı bölüm boyunca sayfanın yarım olduğunu söyleyen bilinçli
            bir satırdı ve `noindex` altındayken doğru karardı. Kilit
            kalkınca aynı satır ziyaretçiye iç yapım durumu ve bir tasarım
            denemesine bağlantı gösteriyordu. Deneme rotası duruyor
            (`/anime/bleach/playground`, kendi `noindex`iyle), yalnızca
            sayfadan bağlantısı yok. */}

        {/* Eksik görseller paneli — yalnızca yöneticide çiziliyor */}
        <CuratorManifest />
      </div>
    </CuratorFrame>
  );
}
