import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  GOJO_CURATOR,
  GOJO_FOUNDATION,
  GOJO_ID,
  GOJO_IMAGE_KEYS,
  GOJO_SHORTCUTS,
  GOJO_SLOT_ASPECT,
  GOJO_SLOT_LABELS,
  GOJO_UI,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratedImage } from "./CuratedImage";
import { GOJO_FONT_CLASS } from "./gojo-fonts";
import { RevealedData } from "./RevealedData";
import { SectionShell } from "./SectionShell";
import { SixEyesProvider } from "./SixEyesProvider";
import { SixEyesToggle } from "./SixEyesToggle";
import styles from "./GojoExperience.module.css";

/**
 * SATORU GOJŌ — "UNTOUCHABLE" (AniList #127691).
 *
 * ⚠️ P00 · TEMELLER. Bu dosya bugün BİLEREK neredeyse boş: yalnızca
 * altyapının ayakta olduğunu gösteriyor. Bölümler P01–P11'de sırayla
 * eklenecek ve `foundation` panosu P01'de yerini hero'ya bırakacak.
 *
 * ── SAYFANIN TEZİ ────────────────────────────────────────────────────────
 * Kullanıcı Gojō hakkında bilgi OKUMUYOR; Gojō'ya yaklaştıkça arayüzün
 * fizik kuralları bozuluyor. Bunun tek yapısal ifadesi var ve sayfanın
 * tamamında tutarlı olmak zorunda: NEGATİF ALAN = INFINITY. Gojō'ya
 * ayrılmış boşluğa hiçbir element giremez. Bu dekoratif bir tercih değil,
 * bir DÜZEN kuralı — ölçüsü `--g-infinity` token'ında.
 *
 * ── NEDEN SUNUCU BİLEŞENİ ────────────────────────────────────────────────
 * Ev sözleşmesi (KARAKTER-SAYFASI-EKLEME.md §1.4): giriş bileşeni sunucu
 * bileşeni, `"use client"` yalnızca durum tutan küçük adalarda. Burada iki
 * ada var — `SixEyesProvider` (sayfa kökü + mod durumu) ve `SixEyesToggle`.
 * Metinler sunucuda `pick()` ile seçiliyor, adalara DÜZ DİZE iniyor.
 *
 * ── KÖK `<main>` DEĞİL ───────────────────────────────────────────────────
 * Kök düzen zaten `<main id="icerik">` çiziyor. Sayfa kökünü
 * `SixEyesProvider` bir `<div>` olarak çiziyor ve üstünde `styles.page` +
 * `data-world="satoru-gojou"` ikilisi duruyor.
 */
export function GojoExperience({ detail, isAdmin }: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  /* Yüklenmiş sahne görselleri: `goj:*` anahtarlı ABILITY yuvaları.
     Bugün neredeyse tamamı boş ve sayfa öyle tasarlandı — hiçbir bölüm
     görsele BAĞLI değil, yuvalar dolunca bölümler zenginleşiyor. */
  const abilityImages = collectAbilityImages(detail.images);
  const heroKey = GOJO_IMAGE_KEYS.hero;

  const nameNative = detail.character.nameNative;

  return (
    <SixEyesProvider fontClassName={GOJO_FONT_CLASS}>
      <CuratorFrame isAdmin={isAdmin}>
        <div className={styles.shell}>
          <nav className={styles.crumb} aria-label="breadcrumb">
            <Link className={styles.crumbLink} href={animeHref.characters()}>
              {t("backToGallery")}
            </Link>
          </nav>

          <header className={styles.head}>
            {/* Sayfadaki TEK `<h1>`. Ad künyeden geliyor; kadro kaydındaki
                ad sekme başlığının kaynağı (`experienceMetadata`). */}
            <h1 className={styles.title}>
              {detail.character.name}
              {nameNative ? (
                /* Japonca metin çeviri değil ATMOSFER: iki dilde de aynı
                   kalıyor ve `lang="ja"` ile işaretleniyor ki ekran
                   okuyucu doğru sesle okusun. */
                <span className={styles.titleNative} lang="ja">
                  {nameNative}
                </span>
              ) : null}
            </h1>

            <div className={styles.modeBar}>
              <SixEyesToggle
                label={pick(GOJO_UI.modeLabel, locale)}
                onLabel={pick(GOJO_UI.modeOn, locale)}
                offLabel={pick(GOJO_UI.modeOff, locale)}
                keyHint={pick(GOJO_UI.modeKeyHint, locale)}
              />
            </div>
          </header>

          {/* ══ P00 · TEMEL PANOSU ══════════════════════════════════════
              Üç sözleşmenin de çalıştığını tek bakışta gösteriyor:
              küratör yuvası (boşken manifesto paneli), gizli veri katmanı
              (mod değişince açılan alan) ve bölüm sarmalayıcısı.
              P01'de silinecek. */}
          <SectionShell
            id="gojo-foundation"
            title={pick(GOJO_FOUNDATION.title, locale)}
          >
            <div className={styles.foundation}>
              <p className={styles.foundationNote}>
                {pick(GOJO_FOUNDATION.note, locale)}
              </p>

              <CuratedImage
                slotId={heroKey}
                spec={pick(GOJO_SLOT_LABELS[heroKey], locale)}
                aspect={GOJO_SLOT_ASPECT[heroKey]}
                src={abilityImages.get(heroKey) ?? null}
                isAdmin={isAdmin}
                characterId={GOJO_ID}
                curatorLabel={pick(GOJO_CURATOR.upload, locale)}
                statusLabel={pick(GOJO_CURATOR.missing, locale)}
                sizes="640px"
              />
            </div>

            <p className={styles.foundationRow}>
              <RevealedData
                label={pick(GOJO_FOUNDATION.sampleLabel, locale)}
                value={pick(GOJO_FOUNDATION.sampleValue, locale)}
                mask={pick(GOJO_UI.mask, locale)}
              />
            </p>
          </SectionShell>

          {/* ══ KLAVYE KISAYOLLARI ══════════════════════════════════════
              Görsel olarak yok, DOM'da var. BRIEF · erişilebilirlik:
              kısayolla ulaşılan hiçbir şey ekran okuyucu kullanıcısı için
              erişilemez kalmayacak. Liste her yeni kısayolda büyüyor. */}
          <SectionShell
            id="gojo-shortcuts"
            title={pick(GOJO_SHORTCUTS.title, locale)}
            hiddenTitle
          >
            <ul className={`${styles.shortcuts} ${styles.srOnly}`}>
              {GOJO_SHORTCUTS.items.map((item) => (
                <li key={item.keys}>
                  <kbd>{item.keys}</kbd> — {pick(item.action, locale)}
                </li>
              ))}
            </ul>
          </SectionShell>
        </div>
      </CuratorFrame>
    </SixEyesProvider>
  );
}
