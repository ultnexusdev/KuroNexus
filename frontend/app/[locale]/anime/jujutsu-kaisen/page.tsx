import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { readIsAdmin } from "@/lib/auth/session";
import { animeHref } from "@/lib/anime/routes";
import { shareCard } from "@/lib/seo";
import { JJK_ANCHORS } from "@/lib/anime/jjk/anchors";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { SectionNav } from "@/components/anime/jjk/SectionNav";
import { JjkJsonLd } from "@/components/anime/jjk/JjkJsonLd";
import { KanjiRail } from "@/components/anime/jjk/KanjiRail";
import { VeilHero } from "@/components/anime/jjk/VeilHero";
import { EnergySection } from "@/components/anime/jjk/EnergySection";
import { SocietySection } from "@/components/anime/jjk/SocietySection";
import { GradeWall } from "@/components/anime/jjk/GradeWall";
import { SpiritArchive } from "@/components/anime/jjk/SpiritArchive";
import { DomainSection } from "@/components/anime/jjk/DomainSection";
import { ArchetypesSection } from "@/components/anime/jjk/ArchetypesSection";
import { FingersSection } from "@/components/anime/jjk/FingersSection";
import { ShibuyaSection } from "@/components/anime/jjk/ShibuyaSection";
import { CullingSection } from "@/components/anime/jjk/CullingSection";
import { FinalArchive } from "@/components/anime/jjk/FinalArchive";
import { CuratorManifest } from "@/components/anime/jjk/CuratorManifest";
import shell from "../layout.module.css";
import jjk from "@/components/anime/jjk/jjk.module.css";
import styles from "./page.module.css";

/**
 * `/anime/jujutsu-kaisen` — JUJUTSU KAISEN EVRENİ · "LANETLİ ARŞİV".
 *
 * ── BUGÜN NE VAR ─────────────────────────────────────────────────────────
 * On bir bölümün tamamı: Perde, Lanetli Enerji, Jujutsu Toplumu, Derece
 * Duvarı, Lanet Arşivi, Alan Genişlemesi (+ tam ekran devralma),
 * Arketipler, 20 Parmak (kalıcı ilerleme), Shibuya operasyon odası,
 * Kıyım Oyunu ve Son Kayıt. Kaynak tasarım: kullanıcının "Lanetli Arşiv
 * v2" mockup'ı (30 Ağustos 2026); kapsam kararı "tasarımdaki kapsam".
 *
 * ── KÜRATÖR SÖZLEŞMESİ ───────────────────────────────────────────────────
 * Çıplak `<Image>` yok; her kadraj `<CuratedImage slotId>` (manifesto:
 * `lib/anime/jjk/slots.ts`, 31 yuva). Sayfa görselsiz EKSİKSİZ açılır.
 *
 * ⚠️ Denetimler commit öncesi: `npm run check:jjk` (çapalar + i18n
 * sızıntısı + kontrast + hareket).
 *
 * `force-dynamic` — küratör okumaları `no-store`; yüklenen kare sayfa
 * tazelenince anında görünmeli (Naruto/Bleach'teki aynı karar).
 */
export const dynamic = "force-dynamic";

/** Locale ÖNEKSİZ yol — hreflang, canonical ve paylaşım kartı bunu okur */
const JJK_PATH = "/anime/jujutsu-kaisen";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "anime.jjk.meta" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    ...shareCard({ title, description, locale, path: JJK_PATH }),
    /**
     * ⚠️ `noindex` BİLİNÇLİ — Bleach'in aynı kilidi: sayfa içerik olarak
     * tam ama canlı küratör doğrulaması ve İngilizce son okuma yapılmadan
     * indekse açılmıyor. Kilit kalkarken: (1) bu blok silinir,
     * (2) `app/sitemap.ts`e iki dilli kayıt eklenir, (3) OG kartı üretilir.
     */
    robots: { index: false, follow: false },
  };
}

export default async function JjkUniversePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [toc, tf, isAdmin] = await Promise.all([
    getTranslations({ locale, namespace: "anime.jjk.toc" }),
    getTranslations({ locale, namespace: "anime.jjk.footer" }),
    readIsAdmin(),
  ]);

  /* Rayın etiketleri: bölüm adı ÇEVRİLİYOR, kanji defterde (anchors.ts) */
  const railLabels = Object.fromEntries(
    JJK_ANCHORS.map((anchor) => [anchor.key, toc(anchor.key)]),
  ) as Record<string, string>;

  return (
    <CuratorFrame isAdmin={isAdmin}>
      {/* ⚠️ `<main>` DEĞİL — kök düzen zaten `<main id="icerik">` açıyor
          (P18-b dersi; site sözleşmesi). */}
      <div className={`${jjk.page} ${styles.page}`} data-world="jjk">
        <SectionNav locale={locale} />
        <JjkJsonLd locale={locale} />

        {/* Kırıntı: hero tam ekran sahne, şerit üstünde yüzer (Bleach kararı) */}
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href="/dark-stories">KuroNexus</Link>
          <span className={shell.sep}>/</span>
          <Link href={animeHref.hall()}>Anime</Link>
          <span className={shell.sep}>/</span>
          <span lang="en">Jujutsu Kaisen</span>
        </nav>

        <KanjiRail labels={railLabels} ariaLabel={toc("aria")} />

        <div className={styles.body}>
          <VeilHero locale={locale} />
          <EnergySection locale={locale} />
          <SocietySection locale={locale} />
          <GradeWall locale={locale} />
          <SpiritArchive locale={locale} />
          <DomainSection locale={locale} />
          <ArchetypesSection locale={locale} />
          <FingersSection locale={locale} />
          <ShibuyaSection locale={locale} />
          <CullingSection locale={locale} />
          <FinalArchive locale={locale} />

          <footer className={styles.footer}>
            <p className={styles.footerLine}>
              {tf("line")}
              <span lang="ja">帳が下りている限り、世界は静かだ。</span>
            </p>
            <p className={styles.footerMeta}>{tf("meta")}</p>
          </footer>
        </div>

        {/* Eksik görseller paneli — yalnızca yönetici DOM'unda */}
        <CuratorManifest />
      </div>
    </CuratorFrame>
  );
}
