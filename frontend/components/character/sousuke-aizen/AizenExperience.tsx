import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { pick, type LocalizedText } from "@/lib/characters/types";
import {
  collectAbilityImages,
  companionPortraits,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  AIZEN_CLOSING,
  AIZEN_HERO,
  AIZEN_ID,
  AIZEN_IMAGE_KEYS,
  AIZEN_LAB_TITLE,
  AIZEN_LAYERS,
  AIZEN_MAJOR,
  AIZEN_MINOR,
  AIZEN_MIRROR_SHARDS,
  AIZEN_MIRROR_TITLE,
  AIZEN_REGISTRY,
  AIZEN_REGISTRY_TITLE,
  AIZEN_SLOT_LABELS,
  AIZEN_TIMELINE,
  AIZEN_TIMELINE_TITLE,
  AIZEN_WITNESSES,
  AIZEN_WITNESS_TITLE,
  type LayeredText,
} from "@/lib/characters/sousuke-aizen-experience";
import { animeHref } from "@/lib/anime/routes";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { HogyokuOrb, SealMark, ShardMark, Spectacles } from "./AizenGlyphs";
import { ReflectionShell } from "./ReflectionShell";
import { MirrorPanel } from "./MirrorPanel";
import styles from "./AizenExperience.module.css";

/**
 * Sōsuke Aizen — interaktif deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/1086 bu bileşene dallanır.
 * Konsept: **iki gerçeklik katmanı.** Sayfa aynı bölümleri iki ayrı metinle
 * taşıyor (Resmî Kayıt / Kırılan Yansıma) ve sağ alttaki düğme hepsini
 * birden çeviriyor. İki katman da ETİKETLİ — okuyucu yanlış bilgi almıyor,
 * bir anlatı oyununun içinde olduğunu görüyor.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   · `ReflectionShell` — katman durumu (tek useState, etkisi tamamen CSS)
 *   · `MirrorPanel`     — kırılan ayna, beş parçalık durum
 * İkisi de metinleri düz dize olarak alır; `LocalizedText` istemciye inmez.
 *
 * Görsel çözümleme: characterId 1086 kaydının ABILITY yuvaları (`aizen:*`).
 * Görsel inmemişse bölüm görselsiz ama AYAKTA kalır — bütün `Image`
 * çizimleri koşullu. Bleach kadrosunun portreleri veritabanımızda yok
 * (22 Ağustos 2026 ölçümü), o yüzden tanık kartları adla çiziliyor ve
 * portre yüklenirse kendiliğinden doluyor.
 *
 * Sayfa düzeni bilerek KUSURSUZ: kıl çizgiler, sıfır köşe yuvarlaklığı,
 * hizası bozulmayan bir ızgara. Tekinsizlik, düzensizlikten değil düzenin
 * kendisinden geliyor.
 */

/** Aynı yerde duran iki katman — kapalı olan `visibility: hidden` ile susar. */
function Layered({
  text,
  locale,
  className,
}: {
  text: LayeredText;
  locale: string;
  className?: string;
}) {
  return (
    <span className={className ? `${styles.layered} ${className}` : styles.layered}>
      <span className={styles.layerRecord}>{pick(text.record, locale)}</span>
      <span className={styles.layerReflection}>
        {pick(text.reflection, locale)}
      </span>
    </span>
  );
}

/** Bölüm başlığı + giriş cümlesi; ikisi de iki katmanlı. */
function SectionHead({
  id,
  title,
  lede,
  locale,
}: {
  id: string;
  title: LayeredText;
  lede: LayeredText;
  locale: string;
}) {
  return (
    <header className={styles.sectionHead}>
      <h2 id={id} className={styles.sectionTitle}>
        <Layered text={title} locale={locale} />
      </h2>
      <p className={styles.sectionLede}>
        <Layered text={lede} locale={locale} />
      </p>
    </header>
  );
}

/** `%s` yerine değer koyan küçük şablon — çeviri anahtarı eklemeden. */
function fill(template: LocalizedText, locale: string, value: string): string {
  return pick(template, locale).replace("%s", value);
}

export function AizenExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");
  const ability = collectAbilityImages(detail.images);
  const portraits = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;

  const portrait = primaryPortrait(detail);
  const heroScene = src(AIZEN_IMAGE_KEYS.hero);
  const heroReflection = src(AIZEN_IMAGE_KEYS.heroReflection);

  const recordName = pick(AIZEN_LAYERS.record.name, locale);
  const reflectionName = pick(AIZEN_LAYERS.reflection.name, locale);

  return (
    <ReflectionShell
      recordName={recordName}
      reflectionName={reflectionName}
      nowReadingLabel={pick(AIZEN_LAYERS.nowReading, locale)}
      toReflectionLabel={pick(AIZEN_LAYERS.toReflection, locale)}
      toRecordLabel={pick(AIZEN_LAYERS.toRecord, locale)}
      liveRecord={pick(AIZEN_LAYERS.liveRecord, locale)}
      liveReflection={pick(AIZEN_LAYERS.liveReflection, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <span className={styles.crumbHere}>Bleach · Gotei 13</span>
        </nav>

        {/* ══ 1 · HERO ══════════════════════════════════════════════ */}
        <section className={styles.hero} aria-labelledby="aizen-name">
          <span className={styles.heroScene} aria-hidden>
            {heroScene ? (
              <Image
                className={styles.heroSceneRecord}
                src={heroScene}
                alt=""
                fill
                sizes="100vw"
                priority
              />
            ) : null}
            {heroReflection ? (
              <Image
                className={styles.heroSceneReflection}
                src={heroReflection}
                alt=""
                fill
                sizes="100vw"
              />
            ) : null}
          </span>

          <p className={styles.heroWatermark} aria-hidden>
            {AIZEN_HERO.watermark}
          </p>

          <div className={styles.heroInner}>
            {/* Portre AniList'ten ~230 piksel geliyor: büyütülmüyor, dar bir
                kadrajda tutuluyor ve etrafı tipografiyle kuruluyor
                (BRIEF kural 3.1). */}
            {portrait ? (
              <figure className={styles.portrait}>
                <span className={styles.portraitFrame}>
                  <Image
                    src={portrait}
                    alt={pick(AIZEN_HERO.portraitAlt, locale)}
                    width={230}
                    height={345}
                    unoptimized={!isUploadedPortrait(detail)}
                    priority
                  />
                  {/* Portrenin üstündeki cam — tek kırık çizgi */}
                  <span className={styles.portraitGlass} aria-hidden />
                  <svg
                    className={styles.portraitCrack}
                    viewBox="0 0 100 150"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                    focusable="false"
                  >
                    <path
                      d="M 74 -4 L 61 44 L 72 66 L 46 104 L 55 154"
                      fill="none"
                      stroke="var(--azn-fracture)"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
                <figcaption className={styles.portraitCaption}>
                  {pick(AIZEN_CLOSING.sourceLabel, locale)}
                </figcaption>
              </figure>
            ) : null}

            <div className={styles.heroText}>
              <Spectacles className={styles.heroGlasses} idPrefix="azn-hero" />
              <p className={styles.heroNative} aria-hidden>
                {AIZEN_HERO.nativeName}
              </p>
              <h1 id="aizen-name" className={styles.heroName}>
                {AIZEN_HERO.name}
              </h1>
              <p className={styles.heroRole}>
                <Layered text={AIZEN_HERO.role} locale={locale} />
              </p>
              <p className={styles.heroEpigraph}>
                <Layered text={AIZEN_HERO.epigraph} locale={locale} />
              </p>
              <p className={styles.heroReading} aria-hidden>
                {AIZEN_HERO.watermark} — {AIZEN_HERO.reading}
              </p>
            </div>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              {[AIZEN_IMAGE_KEYS.hero, AIZEN_IMAGE_KEYS.heroReflection].map(
                (key) => (
                  <CuratorSlot
                    key={key}
                    characterId={AIZEN_ID}
                    slot="ABILITY"
                    abilityName={key}
                    label={pick(AIZEN_SLOT_LABELS[key], locale)}
                  />
                ),
              )}
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KATMAN ŞERİDİ — oyunun kuralı açıkça yazılı ═══════ */}
        {/* Yer imi (landmark) DEĞİL: bu şerit hero'nun devamı, ayrı bir
            bölge olarak duyurulması gezinmeyi kalabalıklaştırırdı */}
        <div className={styles.disclosure}>
          <ul className={styles.layerKeys}>
            <li className={styles.layerKey} data-key="record">
              <SealMark className={styles.layerKeyIcon} />
              <span className={styles.layerKeyName}>{recordName}</span>
              <span className={styles.layerKeyNote}>
                {pick(AIZEN_LAYERS.record.note, locale)}
              </span>
            </li>
            <li className={styles.layerKey} data-key="reflection">
              <ShardMark className={styles.layerKeyIcon} />
              <span className={styles.layerKeyName}>{reflectionName}</span>
              <span className={styles.layerKeyNote}>
                {pick(AIZEN_LAYERS.reflection.note, locale)}
              </span>
            </li>
          </ul>
          <p className={styles.disclosureText}>
            {pick(AIZEN_LAYERS.disclosure, locale)}
          </p>
        </div>

        {/* ══ 3 · KÜNYE ŞERİDİ ═════════════════════════════════════ */}
        <section className={styles.registry} aria-labelledby="aizen-registry">
          <SectionHead
            id="aizen-registry"
            title={AIZEN_REGISTRY_TITLE.title}
            lede={AIZEN_REGISTRY_TITLE.lede}
            locale={locale}
          />
          <dl className={styles.registryList}>
            {AIZEN_REGISTRY.map((row) => (
              <div key={row.label.tr} className={styles.registryRow}>
                <dt className={styles.registryLabel}>
                  {pick(row.label, locale)}
                </dt>
                <dd className={styles.registryValue}>
                  <Layered text={row.value} locale={locale} />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 4 · KIRILAN AYNA — sayfanın kalbi ════════════════════ */}
        <section className={styles.mirrorSection} aria-labelledby="aizen-mirror">
          <SectionHead
            id="aizen-mirror"
            title={AIZEN_MIRROR_TITLE.title}
            lede={AIZEN_MIRROR_TITLE.lede}
            locale={locale}
          />
          <MirrorPanel
            shards={AIZEN_MIRROR_SHARDS.map((shard) => ({
              key: shard.key,
              subject: pick(shard.subject, locale),
              record: pick(shard.record, locale),
              reflection: pick(shard.reflection, locale),
            }))}
            recordName={recordName}
            reflectionName={reflectionName}
            sealedText={pick(AIZEN_MIRROR_TITLE.sealed, locale)}
            breakAllLabel={pick(AIZEN_MIRROR_TITLE.breakAll, locale)}
            breakAllDoneLabel={pick(AIZEN_MIRROR_TITLE.breakAllDone, locale)}
            counterTemplate={pick(AIZEN_MIRROR_TITLE.counter, locale)}
            hint={pick(AIZEN_MIRROR_TITLE.hint, locale)}
            brokenSuffix={pick(AIZEN_MIRROR_TITLE.brokenSuffix, locale)}
            sceneSrc={src(AIZEN_IMAGE_KEYS.mirrorScene)}
            sceneAlt={pick(AIZEN_MIRROR_TITLE.sceneAlt, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={AIZEN_ID}
                slot="ABILITY"
                abilityName={AIZEN_IMAGE_KEYS.mirrorScene}
                label={pick(
                  AIZEN_SLOT_LABELS[AIZEN_IMAGE_KEYS.mirrorScene],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 5 · AYNAYI GÖRENLER ══════════════════════════════════ */}
        <section className={styles.witnesses} aria-labelledby="aizen-witnesses">
          <SectionHead
            id="aizen-witnesses"
            title={AIZEN_WITNESS_TITLE.title}
            lede={AIZEN_WITNESS_TITLE.lede}
            locale={locale}
          />
          <ul className={styles.witnessGrid}>
            {AIZEN_WITNESSES.map((witness) => {
              const face = portraits.get(witness.characterId) ?? null;
              return (
                <li key={witness.characterId} className={styles.witness}>
                  <Link
                    className={styles.witnessLink}
                    href={animeHref.character(witness.characterId)}
                  >
                    <span className={styles.witnessFace}>
                      {face ? (
                        <Image
                          src={face}
                          alt={fill(
                            AIZEN_WITNESS_TITLE.portraitAltPattern,
                            locale,
                            witness.name,
                          )}
                          fill
                          sizes="220px"
                        />
                      ) : (
                        /* Portre kaydı yok: baş harf, elle çizilmiş çerçevede */
                        <span className={styles.witnessInitial} aria-hidden>
                          {witness.name.slice(0, 1)}
                        </span>
                      )}
                    </span>
                    <span className={styles.witnessBody}>
                      <span className={styles.witnessNative} aria-hidden>
                        {witness.nativeName}
                      </span>
                      <span className={styles.witnessName}>{witness.name}</span>
                      <span className={styles.witnessRole}>
                        <Layered text={witness.role} locale={locale} />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · LABORATUVAR ══════════════════════════════════════ */}
        <section className={styles.lab} aria-labelledby="aizen-lab">
          <SectionHead
            id="aizen-lab"
            title={AIZEN_LAB_TITLE.title}
            lede={AIZEN_LAB_TITLE.lede}
            locale={locale}
          />
          <ul className={styles.majorList}>
            {AIZEN_MAJOR.map((power) => {
              const art = src(power.imageKey);
              return (
                <li
                  key={power.key}
                  className={styles.major}
                  data-power={power.key}
                >
                  <span className={styles.majorArt} aria-hidden>
                    {art ? (
                      <Image src={art} alt="" fill sizes="720px" />
                    ) : (
                      <span className={styles.majorArtEmpty}>
                        {power.key === "hogyoku" ? (
                          <HogyokuOrb className={styles.majorOrb} />
                        ) : (
                          <Spectacles
                            className={styles.majorGlasses}
                            broken={power.key === "kyokaSuigetsu"}
                            idPrefix={`azn-major-${power.key}`}
                          />
                        )}
                      </span>
                    )}
                    <span className={styles.majorScrim} />
                  </span>
                  <div className={styles.majorBody}>
                    <span className={styles.majorKanji} aria-hidden>
                      {power.kanji}
                    </span>
                    <h3 className={styles.majorName}>{power.name}</h3>
                    <p className={styles.majorTagline}>
                      <Layered text={power.tagline} locale={locale} />
                    </p>
                    <p className={styles.majorText}>
                      <Layered text={power.text} locale={locale} />
                    </p>
                    <ul className={styles.majorTraits}>
                      {power.traits.map((trait) => (
                        <li key={trait.tr} className={styles.majorTrait}>
                          {pick(trait, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={AIZEN_ID}
                      slot="ABILITY"
                      abilityName={power.imageKey}
                      label={pick(AIZEN_SLOT_LABELS[power.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>

          <h3 className={styles.minorTitle}>
            <Layered text={AIZEN_LAB_TITLE.minorTitle} locale={locale} />
          </h3>
          <ul className={styles.minorGrid}>
            {AIZEN_MINOR.map((minor) => {
              const art = src(minor.imageKey);
              return (
                <li key={minor.key} className={styles.minor}>
                  <span className={styles.minorArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="360px" /> : null}
                  </span>
                  <span className={styles.minorKanji} aria-hidden>
                    {minor.kanji}
                  </span>
                  <h4 className={styles.minorName}>{pick(minor.name, locale)}</h4>
                  <p className={styles.minorNote}>{pick(minor.note, locale)}</p>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={AIZEN_ID}
                      slot="ABILITY"
                      abilityName={minor.imageKey}
                      label={pick(AIZEN_SLOT_LABELS[minor.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 7 · KADER ÇİZELGESİ ══════════════════════════════════ */}
        <section className={styles.timeline} aria-labelledby="aizen-timeline">
          <SectionHead
            id="aizen-timeline"
            title={AIZEN_TIMELINE_TITLE.title}
            lede={AIZEN_TIMELINE_TITLE.lede}
            locale={locale}
          />
          <ol className={styles.eraList}>
            {AIZEN_TIMELINE.map((era) => {
              const art = src(era.imageKey);
              return (
                <li key={era.key} className={styles.era} data-era={era.key}>
                  <span className={styles.eraRail} aria-hidden />
                  <p className={styles.eraMark}>{pick(era.mark, locale)}</p>
                  <div className={styles.eraCard}>
                    <span className={styles.eraArt} aria-hidden>
                      {art ? (
                        <Image src={art} alt="" fill sizes="640px" />
                      ) : null}
                      <span className={styles.eraScrim} />
                    </span>
                    <div className={styles.eraBody}>
                      <h3 className={styles.eraTitle}>
                        <Layered text={era.title} locale={locale} />
                      </h3>
                      <p className={styles.eraText}>
                        <Layered text={era.text} locale={locale} />
                      </p>
                    </div>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={AIZEN_ID}
                        slot="ABILITY"
                        abilityName={era.imageKey}
                        label={pick(AIZEN_SLOT_LABELS[era.imageKey], locale)}
                      />
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 8 · KAPANIŞ ══════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="aizen-closing">
          <h2 id="aizen-closing" className={styles.visuallyHidden}>
            {AIZEN_HERO.name}
          </h2>
          {AIZEN_CLOSING.quotes.map((quote) => (
            <figure key={quote.text.tr} className={styles.quote}>
              <blockquote className={styles.quoteText}>
                &ldquo;{pick(quote.text, locale)}&rdquo;
              </blockquote>
              {quote.native ? (
                <figcaption className={styles.quoteNative} aria-hidden>
                  {quote.native}
                </figcaption>
              ) : null}
            </figure>
          ))}

          <p className={styles.motto} aria-hidden>
            <span className={styles.mottoKanji}>{AIZEN_CLOSING.motto.kanji}</span>
            <span className={styles.mottoReading}>
              {AIZEN_CLOSING.motto.reading}
            </span>
          </p>
          <p className={styles.mottoGloss}>
            {pick(AIZEN_CLOSING.motto.gloss, locale)}
          </p>

          <p className={styles.credit}>
            {pick(AIZEN_CLOSING.credit, locale)}{" "}
            <a
              className={styles.creditLink}
              href={AIZEN_CLOSING.sourceHref}
              target="_blank"
              rel="noreferrer"
            >
              {pick(AIZEN_CLOSING.sourceLabel, locale)}
            </a>
          </p>
        </section>
      </CuratorFrame>
    </ReflectionShell>
  );
}
