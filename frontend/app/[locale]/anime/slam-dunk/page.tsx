import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { animeHref } from "@/lib/anime/routes";
import { shareCard } from "@/lib/seo";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { AnthemControl } from "@/components/anime/slam-dunk/AnthemControl";
import { BallCursor } from "@/components/anime/slam-dunk/BallCursor";
import { BenchSection } from "@/components/anime/slam-dunk/BenchSection";
import { BuzzerSection } from "@/components/anime/slam-dunk/BuzzerSection";
import { CoastBand } from "@/components/anime/slam-dunk/CoastBand";
import { MatchupSection } from "@/components/anime/slam-dunk/MatchupSection";
import { Scoreboard } from "@/components/anime/slam-dunk/Scoreboard";
import { ShohokuSection } from "@/components/anime/slam-dunk/ShohokuSection";
import { SlamDunkJsonLd } from "@/components/anime/slam-dunk/SlamDunkJsonLd";
import { SlamDunkManifest } from "@/components/anime/slam-dunk/SlamDunkManifest";
import { TipOff } from "@/components/anime/slam-dunk/TipOff";
import court from "@/components/anime/slam-dunk/court.module.css";
import shell from "../layout.module.css";
import styles from "./page.module.css";

/**
 * `/anime/slam-dunk` — SLAM DUNK EVRENİ.
 *
 * ── SAYFA NEDİR ──────────────────────────────────────────────────────────
 * Beş çeyrek: hava atışı (Shohoku ilk beşi), tam kadro, rakip seçici,
 * kenar (koçlar ve menajerler), son düdük. Kırk beş kadro kaydı, beş
 * takım, elli dört küratör yuvası.
 *
 * ── ⚠️ BLEACH'İN TASARIM DİLİ KULLANILMADI ───────────────────────────────
 * Kullanıcı kararı (28 Ağustos 2026): iki evren tasarım dili paylaşmıyor.
 * Bleach ince, geniş aralıklı, gotik ve dikey bir iniş; burası ağır, sıkışık,
 * neon ve yatay bir saha. Paylaşılan tek şey küratör ARACI
 * (`components/curated/`) — o bir yönetim yüzeyi, sayfanın derisi değil.
 *
 * ── KÜRATÖR SÖZLEŞMESİ ───────────────────────────────────────────────────
 * Sayfada çıplak `<Image>` YOK. Her kadraj `<CourtImage>` üzerinden
 * geçiyor; yuvanın oranı, işlem biçimi ve boşken ne çizeceği manifestoda
 * (`lib/anime/slam-dunk/slots.ts`) yazılı. Müzik de aynı mekanizmada:
 * parça `slam-dunk:anthem` yuvasına yükleniyor (`lib/anime/slam-dunk/audio.ts`).
 *
 * ── ÜÇ İSTEMCİ ADASI ─────────────────────────────────────────────────────
 * Sayfanın geri kalanı sunucuda çiziliyor. Tarayıcıya inen üç parça:
 *   `Scoreboard`      kaydırma takibi (hangi çeyrekteysen o skor)
 *   `MatchupSelector` sekme durumu (panellerin İÇİ sunucudan geliyor)
 *   `ReactiveCourt` + `BallCursor` imleç efektleri
 * Dördü de küçük ve hiçbiri içeriği taşımıyor: JS gelmezse sayfa okunur,
 * gezilir ve dört rakibin de kadrosu kaynakta yazılıdır.
 *
 * ⚠️ Denetim commit öncesi: `npm run check:slam-dunk` — çapa, hex kaçağı,
 * i18n sızıntısı ve azaltılmış hareket.
 *
 * `force-dynamic` — küratör okumaları `no-store` ve yüklenen kare sayfa
 * tazelenince ANINDA görünmeli (Bleach ve Naruto Evreni'ndeki aynı karar).
 */
export const dynamic = "force-dynamic";

/** Locale ÖNEKSİZ yol — hreflang, canonical ve paylaşım kartı aynı kaynağı okusun */
const SLAM_DUNK_PATH = "/anime/slam-dunk";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "slamDunk.meta" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    /* hreflang/canonical `shareCard`ten geliyor — elle yazılmıyor
       (site kabuğu sözleşmesi 2). ⚠️ Next metadata birleşmesi ÜST ANAHTAR
       bazında sığ: burada kendi `alternates` ya da `openGraph`ını yazan
       bir satır olursa shareCard'ınki TAMAMEN düşer.

       ⚠️ `image` VERİLMEDİ ve bilerek: sayfaya özel bir OG kartı henüz
       üretilmedi ve olmayan bir dosyaya işaret etmek, paylaşımda kırık
       görsel demek. `shareCard` bu durumda site kartına düşüyor. */
    ...shareCard({
      title,
      description,
      locale,
      path: SLAM_DUNK_PATH,
    }),
  };
}

export default async function SlamDunkUniversePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAdmin = await readIsAdmin();

  return (
    <CuratorFrame isAdmin={isAdmin}>
      {/* ⚠️ `<main>` DEĞİL. Kök düzen sayfayı zaten `<main id="icerik">`
          içine alıyor; ikinci bir `main` belgede iki ana sınır demekti
          (site kabuğu sözleşmesi 1). */}
      <div className={`${court.court} ${styles.page}`} data-team="shohoku">
        {/* Arama motoruna sayfanın iç yapısı: beş çeyrek, sırayla */}
        <SlamDunkJsonLd locale={locale} />

        {/* Topun izi: imleci takip eden yanan basketbol. Gerçek imleci
            GİZLEMİYOR — gerekçe bileşenin başlığında. */}
        <BallCursor />

        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href="/dark-stories">KuroNexus</Link>
          <span className={shell.sep}>/</span>
          <Link href={animeHref.hall()}>Anime</Link>
          <span className={shell.sep}>/</span>
          <span>Slam Dunk</span>
        </nav>

        {/* Skorbord: site başlığının ALTINDA yapışkan. Ses denetimi ve
            küratörün "müzik ekle" düğmesi sunucuda çizilip prop olarak
            geçiyor — skorbord ses mantığını hiç bilmiyor. */}
        <Scoreboard audio={<AnthemControl />} />

        <TipOff locale={locale} />

        {/* İki kadro bölümü arasındaki nefes: serinin açılış sahnesi.
            Çapası yok — gezinilecek bir içerik değil, bir geçiş. */}
        <CoastBand locale={locale} />

        <ShohokuSection locale={locale} />

        <MatchupSection locale={locale} />

        <BenchSection locale={locale} />

        <BuzzerSection locale={locale} />

        {/* Eksik görseller paneli — yalnızca yöneticide çiziliyor */}
        <SlamDunkManifest />
      </div>
    </CuratorFrame>
  );
}
