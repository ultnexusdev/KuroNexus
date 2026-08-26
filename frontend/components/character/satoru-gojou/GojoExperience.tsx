import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  GOJO_CRUMB,
  GOJO_S01_SLOT,
  GOJO_S02_SLOT,
  GOJO_S03_SLOT,
  GOJO_S05_SLOT,
  GOJO_S07_SLOT,
  GOJO_S08_TEACHER_SLOT,
  GOJO_S09_SLOT,
  GOJO_S10_SLOT,
  GOJO_SHORTCUTS,
  GOJO_UI,
} from "@/lib/characters/satoru-gojou-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { ConnectionsSection } from "./ConnectionsSection";
import { GOJO_FONT_CLASS } from "./gojo-fonts";
import { HeroSection } from "./HeroSection";
import { LimitlessSection } from "./LimitlessSection";
import { MakingSection } from "./MakingSection";
import { PairSection } from "./PairSection";
import { PowerSection } from "./PowerSection";
import { TechniquesSection } from "./TechniquesSection";
import { TouchSection } from "./TouchSection";
import { VoidSection } from "./VoidSection";
import { StrongestSection } from "./StrongestSection";
import { SectionShell } from "./SectionShell";
import { SixEyesProvider } from "./SixEyesProvider";
import { SixEyesToggle } from "./SixEyesToggle";
import styles from "./GojoExperience.module.css";

/**
 * SATORU GOJŌ — "UNTOUCHABLE" (AniList #127691).
 *
 * ── SAYFANIN TEZİ ────────────────────────────────────────────────────────
 * Kullanıcı Gojō hakkında bilgi OKUMUYOR; Gojō'ya yaklaştıkça arayüzün
 * fizik kuralları bozuluyor. Bunun tek yapısal ifadesi var ve sayfanın
 * tamamında tutarlı olmak zorunda: NEGATİF ALAN = INFINITY. Gojō'ya
 * ayrılmış boşluğa hiçbir element giremez. Bu dekoratif bir tercih değil,
 * bir DÜZEN kuralı — ölçüsü `--g-infinity` token'ında, ilk uygulaması
 * hero'daki maske.
 *
 * ── NEDEN SUNUCU BİLEŞENİ ────────────────────────────────────────────────
 * Ev sözleşmesi (KARAKTER-SAYFASI-EKLEME.md §1.4): giriş bileşeni sunucu
 * bileşeni, `"use client"` yalnızca durum tutan küçük adalarda. Metinler
 * sunucuda `pick()` ile seçiliyor, adalara DÜZ DİZE iniyor.
 *
 * ── KÖK `<main>` DEĞİL ───────────────────────────────────────────────────
 * Kök düzen zaten `<main id="icerik">` çiziyor. Sayfa kökünü
 * `SixEyesProvider` bir `<div>` olarak çiziyor ve üstünde `styles.page` +
 * `data-world="satoru-gojou"` ikilisi duruyor.
 *
 * ⚠️ SAYFANIN TEK `<h1>`'İ HERO'DA. Buradaki kabuk yalnızca breadcrumb ve
 * mod düğmesi taşıyor.
 */
export function GojoExperience({ detail, isAdmin }: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  /* Yüklenmiş sahne görselleri: `goj:*` anahtarlı ABILITY yuvaları.
     Bugün neredeyse tamamı boş ve sayfa öyle tasarlandı — hiçbir bölüm
     görsele BAĞLI değil, yuvalar dolunca bölümler zenginleşiyor. */
  const abilityImages = collectAbilityImages(detail.images);

  return (
    <SixEyesProvider fontClassName={GOJO_FONT_CLASS}>
      <CuratorFrame isAdmin={isAdmin}>
        <div className={styles.shell}>
          <div className={styles.head}>
            <nav className={styles.crumb} aria-label="breadcrumb">
              <Link className={styles.crumbLink} href={animeHref.characters()}>
                {t("backToGallery")}
              </Link>
              <span aria-hidden="true"> · </span>
              <span>{pick(GOJO_CRUMB.series, locale)}</span>
            </nav>

            <div className={styles.modeBar}>
              <SixEyesToggle
                label={pick(GOJO_UI.modeLabel, locale)}
                onLabel={pick(GOJO_UI.modeOn, locale)}
                offLabel={pick(GOJO_UI.modeOff, locale)}
                keyHint={pick(GOJO_UI.modeKeyHint, locale)}
              />
            </div>
          </div>
        </div>

        {/* ══ P01 · HERO ══════════════════════════════════════════════
            `.shell`in DIŞINDA: dev tipografinin taşabilmesi için sayfa
            kökünün doğrudan çocuğu olmak zorunda. */}
        <HeroSection
          locale={locale}
          isAdmin={isAdmin}
          heroSrc={abilityImages.get(GOJO_S01_SLOT.key) ?? null}
          displayName={detail.character.name}
        />

        {/* ══ P02 · THE STRONGEST ═════════════════════════════════════
            Bölüm kendi başlığını taşıyor (kompozisyonun parçası), bu
            yüzden `SectionShell` yerine `aria-labelledby` ile doğrudan
            bağlanıyor. */}
        <section aria-labelledby="gojo-strongest-title">
          <StrongestSection
            locale={locale}
            isAdmin={isAdmin}
            src={abilityImages.get(GOJO_S02_SLOT.key) ?? null}
          />
        </section>

        {/* ══ P03 · LIMITLESS ═════════════════════════════════════════
            Sayfadaki TEK scroll hijack'i burada. Güvenlik listesi
            `InfinityScroll.tsx` dosya başında madde madde. */}
        <section aria-labelledby="gojo-limitless-title">
          <LimitlessSection
            locale={locale}
            isAdmin={isAdmin}
            src={abilityImages.get(GOJO_S03_SLOT.key) ?? null}
          />
        </section>

        {/* ══ P04 · CURSED TECHNIQUES ═════════════════════════════════
            Üç şerit. Anlatının tamamı sunucuda; etkileşim adası hiç
            inmese de üç teknik tam okunur. */}
        <section aria-labelledby="gojo-techniques-title">
          <TechniquesSection
            locale={locale}
            isAdmin={isAdmin}
            images={abilityImages}
          />
        </section>

        {/* ══ P05 · UNLIMITED VOID ════════════════════════════════════
            Statik pano her zaman tam; sekans onun oynatılmış hâli ve
            ASLA kendiliğinden açılmıyor. */}
        <section aria-labelledby="gojo-void-title">
          <VoidSection
            locale={locale}
            isAdmin={isAdmin}
            src={abilityImages.get(GOJO_S05_SLOT.key) ?? null}
          />
        </section>

        {/* ══ P06 · THE MAKING OF THE STRONGEST ═══════════════════════
            Beş durak `GOJO_TIMELINE`den devralındı; palet durak durak
            soğuk gümüşten Shibuya'nın kızılına kayıyor. */}
        <section aria-labelledby="gojo-making-title">
          <MakingSection
            locale={locale}
            isAdmin={isAdmin}
            images={abilityImages}
          />
        </section>

        {/* ══ P07 · GOJŌ × GETŌ ═══════════════════════════════════════
            Split-screen, ortada çatlak. `--split` varsayılanı 1: ada
            hiç inmezse bölüm ayrılmış ve kırılmış duruyor. */}
        <section aria-labelledby="gojo-pair-title">
          <PairSection
            locale={locale}
            isAdmin={isAdmin}
            src={abilityImages.get(GOJO_S07_SLOT.key) ?? null}
          />
        </section>

        {/* ══ P08 · CONNECTIONS ═══════════════════════════════════════
            Yörünge çizgileri merkeze ASLA değmiyor. Ağın `sr-only`
            liste karşılığı bölümün içinde. */}
        <section aria-labelledby="gojo-connections-title">
          <ConnectionsSection
            locale={locale}
            isAdmin={isAdmin}
            src={abilityImages.get(GOJO_S08_TEACHER_SLOT.key) ?? null}
            images={abilityImages}
          />
        </section>

        {/* ══ P09 · POWER ANALYSIS ════════════════════════════════════
            HUD kenarlarda, merkez ayrılmış ve BOŞ. Sayaçlar bir puan
            değil ölçüm aygıtının yetersizliğini gösteriyor. */}
        <section aria-labelledby="gojo-power-title">
          <PowerSection
            locale={locale}
            isAdmin={isAdmin}
            src={abilityImages.get(GOJO_S09_SLOT.key) ?? null}
          />
        </section>

        {/* ══ P10 · CAN YOU TOUCH GOJŌ? ═══════════════════════════════
            Etkileşim bölümün kutusuyla SINIRLI; imleç hiçbir koşulda
            gizlenmiyor. Bölümün düz metni her zaman DOM'da. */}
        <section aria-labelledby="gojo-touch-title">
          <TouchSection
            locale={locale}
            isAdmin={isAdmin}
            src={abilityImages.get(GOJO_S10_SLOT.key) ?? null}
          />
        </section>

        <div className={styles.shell}>
          {/* ══ KLAVYE KISAYOLLARI ════════════════════════════════════
              Görsel olarak yok, DOM'da var. BRIEF · erişilebilirlik:
              kısayolla ulaşılan hiçbir şey ekran okuyucu kullanıcısı
              için erişilemez kalmayacak. Liste her yeni kısayolda
              büyüyor. */}
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
