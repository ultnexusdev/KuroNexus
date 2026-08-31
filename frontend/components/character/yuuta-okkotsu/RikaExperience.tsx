import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  companionPortraits,
  isExperienceCharacter,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  YUUTA_BONDS,
  YUUTA_CLOSING,
  YUUTA_COMPANION_SUFFIX,
  YUUTA_CRUMB,
  YUUTA_DECK,
  YUUTA_DECK_UI,
  YUUTA_FACTS,
  YUUTA_GAPS,
  YUUTA_GAP_ORDER,
  YUUTA_HERO,
  YUUTA_ID,
  YUUTA_IDENTITY,
  YUUTA_IMAGE_KEYS,
  YUUTA_LAB_MAJOR,
  YUUTA_LAB_MINOR,
  YUUTA_MISSING_NOTE,
  YUUTA_MODE,
  YUUTA_ORIGIN_LABELS,
  YUUTA_PORTRAIT,
  YUUTA_READINGS,
  YUUTA_SECTIONS,
  YUUTA_SITE_URL,
  YUUTA_SLOT_LABELS,
  YUUTA_SLOT_SIZES,
  YUUTA_SLOT_SPECS,
  YUUTA_TIMELINE,
  YUUTA_UNLISTED,
  yuutaSceneAlt,
} from "@/lib/characters/yuuta-okkotsu-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorGaps, type CuratorGapRow } from "@/components/character/CuratorGaps";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { CopyDeck, type DeckCard } from "./CopyDeck";
import { RikaShell } from "./RikaShell";
import { RikaToggle } from "./RikaToggle";
import { RikaSilhouette, RingMark, RingSeal } from "./YuutaGlyphs";
import styles from "./RikaExperience.module.css";

/**
 * Yūta Okkotsu — "Renk Taşması" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/129571 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: SAYFA MONOKROM, TEK RENK
 * BÖLGESİ SAĞ KENARDAKİ DAR ŞERİT VE O ŞERİT RİKA'NIN. Yūta başkalarının
 * tekniklerini kopyalıyor; deste büyüdükçe renk şeritten sayfaya sızıyor.
 *
 * Sayfa SUNUCUDA çizilir. Üç istemci adası var — sözleşmenin izin verdiği
 * üst sınır:
 *   RikaShell   — kök; `data-rika` + `--yut-take`
 *   RikaToggle  — "Rika" düğmesi (2. durak)
 *   CopyDeck    — kopyalanan teknikler destesi (5. durak, sayfanın kalbi)
 * `YuutaGlyphs` istemci DEĞİL: durum tutmayan saf SVG çizimleri.
 *
 * ── IZGARA ───────────────────────────────────────────────────────────────
 * ORTALANMIŞ TEK KOLON. Bölümler sayfanın ortasında, tek bir sütunda
 * ilerliyor. Sağ kenarda ise Rika'nın dar şeridi var ve o şerit bölümlerin
 * DIŞINA taşıyor: her bölümün altındaki ince çizgi negatif `margin` ile
 * bölüm kutusunun sağına çıkıp şeride değiyor. Yatay kaydırma doğmasın diye
 * kök `overflow-x: clip` taşıyor (`hidden` yapışkan öğeleri kırıyor).
 *
 * ── MONOKROM NASIL KURULDU ───────────────────────────────────────────────
 * `filter: grayscale()` KULLANILMADI. İki sebep: küçük metnin kontrastını
 * düşürürdü ve küratörün yüklediği kareyi gri gösterip yanlış karar
 * verdirirdi. Bunun yerine sayfanın tamamı paletin NÖTR ailesini okuyor
 * (`--text-*`, `--gold: #858585`, `--border*`, `--surface*`); `--accent`
 * ailesi yalnızca Rika'nın olduğu yerlerde ve yalnızca `--yut-spread`
 * katsayısı sıfırdan büyükken görünür oluyor.
 *
 * ── PORTRE KARARI ────────────────────────────────────────────────────────
 * AniList'in resmî karesi 230×345 (depoda,
 * `public/assets/anime/karakterler/yuuta-okkotsu/anilist-portrait.jpg`).
 * Bu ölçü tam kanama bir hero'ya yetmiyor, o yüzden portre yalnızca hero'nun
 * madalyonunda, yüzük halkasının içinde duruyor ve `width`/`height` ile
 * veriliyor. `unoptimized={!isUploadedPortrait(detail)}` — AniList karesi
 * bizim boru hattımızdan geçmiyor.
 *
 * ── GÖRSELLER ────────────────────────────────────────────────────────────
 * Sahne kadrajlarının hepsi characterId 129571 kaydının ABILITY yuvaları
 * (`yut:*`). Yuva boşken kadraj elle çizilmiş bir halkayla BOŞ çiziliyor ve
 * bölüm ayakta kalıyor. Her kadrajın HEMEN ALTINDA kendi `CuratorSlot`u
 * var; sayfa sonunda toplu yuva bloğu YOK, yalnızca düzenleyicisiz
 * `CuratorGaps` özeti duruyor.
 *
 * ⚠️ Boş kadrajın içindeki AÇIKLAMA METNİ yalnızca `isAdmin` dalında.
 * Ziyaretçi ölçü/üretim notu görmüyor, yalnızca çizimi görüyor (Dalga 1'de
 * Levi'de bu sızıntı yapılmıştı).
 */
export function RikaExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;
  const slotLabel = (key: string): string => pick(YUUTA_SLOT_LABELS[key], locale);

  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc = portraitUploaded
    ? (primaryPortrait(detail) ?? YUUTA_PORTRAIT.src)
    : YUUTA_PORTRAIT.src;

  const name = detail.character.name || YUUTA_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? YUUTA_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? YUUTA_SITE_URL;
  const companionSuffix = pick(YUUTA_COMPANION_SUFFIX, locale);

  const heroArt = src(YUUTA_IMAGE_KEYS.hero);
  const rikaArt = src(YUUTA_IMAGE_KEYS.rika);
  const deckArt = src(YUUTA_IMAGE_KEYS.deck);
  const closingArt = src(YUUTA_IMAGE_KEYS.closing);

  /* Destenin bütün metinleri burada düz dizeye çevriliyor: istemci adasına
     `LocalizedText` inmiyor (sözleşme). */
  const deckCards: DeckCard[] = YUUTA_DECK.map((card) => ({
    key: card.key,
    kanji: card.kanji,
    reading: card.reading,
    name: pick(card.name, locale),
    origin: card.origin,
    originLabel: pick(YUUTA_ORIGIN_LABELS[card.origin], locale),
    source: pick(card.source, locale),
    note: pick(card.note, locale),
  }));

  const gapRows: CuratorGapRow[] = YUUTA_GAP_ORDER.map((key) => ({
    key,
    label: slotLabel(key),
    spec: pick(YUUTA_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  return (
    <RikaShell total={YUUTA_DECK.length}>
      <CuratorFrame isAdmin={isAdmin}>
        <div className={styles.skin}>
          {/* ══ RİKA'NIN ŞERİDİ ══════════════════════════════════════════
              Sayfanın sağ kenarında, en üstten en alta. HER İKİ DURUMDA DA
              burada: `alone` iken altı çentik boş bir kontur, `bound` iken
              doluyor. Düğme onu yaratmıyor, dolduruyor. */}
          <span
            className={styles.rail}
            role="img"
            aria-label={pick(YUUTA_HERO.railLabel, locale)}
          >
            <span className={styles.railWash} aria-hidden />
            <span className={styles.railTrack} aria-hidden>
              {YUUTA_DECK.map((card, index) => (
                <span
                  key={card.key}
                  className={styles.railNotch}
                  style={{ ["--i" as string]: index }}
                >
                  <span className={styles.railNotchFill} />
                </span>
              ))}
            </span>
            <span className={styles.railKanji} lang="ja" aria-hidden>
              {YUUTA_IDENTITY.watermark}
            </span>
          </span>

          <div className={styles.column}>
            <nav className={styles.crumb} aria-label="breadcrumb">
              <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
              <span className={styles.crumbSep} aria-hidden>
                ·
              </span>
              <span className={styles.crumbHere}>
                {pick(YUUTA_CRUMB.series, locale)}
              </span>
            </nav>

            {/* ══ 1 · HERO ═══════════════════════════════════════════════
                Filigran: Rika'nın verdiği yüzük. Çok büyük, ince kontur,
                yavaşça dönüyor. */}
            <section className={styles.hero} aria-labelledby="yut-name">
              <RingMark
                className={styles.heroRing}
                bandClassName={styles.heroRingBand}
                innerClassName={styles.heroRingInner}
                stoneClassName={styles.heroRingStone}
              />

              <div className={styles.heroBody}>
                <p className={styles.heroGrade}>
                  {pick(YUUTA_IDENTITY.grade, locale)}
                  <span className={styles.heroGradeNative} lang="ja">
                    {YUUTA_IDENTITY.gradeNative}
                  </span>
                </p>
                <h1 id="yut-name" className={styles.heroName}>
                  {name}
                </h1>
                <p className={styles.heroNative} lang="ja">
                  {nativeName}
                </p>
                <p className={styles.heroEpigraph}>
                  {pick(YUUTA_IDENTITY.epigraph, locale)}
                </p>

                <span className={styles.heroMedallion}>
                  <Image
                    className={styles.heroPortraitImg}
                    src={portraitSrc}
                    alt={pick(
                      portraitUploaded
                        ? YUUTA_HERO.portraitAltUploaded
                        : YUUTA_HERO.portraitAlt,
                      locale,
                    )}
                    width={YUUTA_PORTRAIT.w}
                    height={YUUTA_PORTRAIT.h}
                    unoptimized={!portraitUploaded}
                    priority
                  />
                </span>
                {isAdmin ? (
                  <div className={styles.slotRow}>
                    <CuratorSlot
                      characterId={YUUTA_ID}
                      slot="PORTRAIT"
                      label={pick(YUUTA_HERO.portraitAltUploaded, locale)}
                      size={{ w: 900, h: 1350 }}
                    />
                  </div>
                ) : null}

                <p className={styles.heroLede}>{pick(YUUTA_HERO.lede, locale)}</p>
              </div>

              {/* Büyük kadraj: portrenin yetmediği yer. Boşken de duruyor. */}
              <div className={styles.heroFrame}>
                <span
                  className={styles.frame}
                  data-filled={heroArt ? "true" : "false"}
                  data-shape="tall"
                >
                  {heroArt ? (
                    <Image
                      src={heroArt}
                      alt={yuutaSceneAlt(
                        pick(YUUTA_SECTIONS.identity.title, locale),
                        name,
                      )}
                      fill
                      sizes="(max-width: 900px) 92vw, 520px"
                    />
                  ) : (
                    <>
                      <RingSeal
                        className={styles.frameGlyph}
                        outerClassName={styles.frameGlyphOuter}
                        innerClassName={styles.frameGlyphInner}
                      />
                      {isAdmin ? (
                        <span className={styles.frameLabel}>
                          {pick(YUUTA_HERO.frameNote, locale)}
                        </span>
                      ) : null}
                    </>
                  )}
                </span>
                {isAdmin ? (
                  <div className={styles.slotRow}>
                    <CuratorSlot
                      characterId={YUUTA_ID}
                      slot="ABILITY"
                      abilityName={YUUTA_IMAGE_KEYS.hero}
                      label={slotLabel(YUUTA_IMAGE_KEYS.hero)}
                      size={YUUTA_SLOT_SIZES[YUUTA_IMAGE_KEYS.hero]}
                    />
                  </div>
                ) : null}
              </div>
              <span className={styles.bleedTick} aria-hidden />
            </section>

            {/* ══ 2 · MOD DÜĞMESİ ════════════════════════════════════════ */}
            <section className={styles.section} aria-labelledby="yut-mode">
              <header className={styles.sectionHead}>
                <RingSeal
                  className={styles.sectionSeal}
                  outerClassName={styles.sectionSealOuter}
                  innerClassName={styles.sectionSealInner}
                />
                <h2 id="yut-mode" className={styles.sectionTitle}>
                  {pick(YUUTA_MODE.title, locale)}
                  <span className={styles.sectionTitleNative} lang="ja">
                    {YUUTA_MODE.titleNative}
                  </span>
                </h2>
                <p className={styles.sectionLede}>
                  {pick(YUUTA_MODE.lede, locale)}
                </p>
              </header>

              <RikaToggle
                kanji={YUUTA_MODE.titleNative}
                enterLabel={pick(YUUTA_MODE.enter, locale)}
                exitLabel={pick(YUUTA_MODE.exit, locale)}
                stateLabel={pick(YUUTA_MODE.stateLabel, locale)}
                stateAlone={pick(YUUTA_MODE.stateAlone, locale)}
                stateBound={pick(YUUTA_MODE.stateBound, locale)}
                hintAlone={pick(YUUTA_MODE.hintAlone, locale)}
                hintBound={pick(YUUTA_MODE.hintBound, locale)}
              />

              {/* Yükselen üç okuma — çubuklar `--yut-spread`i okuyor. */}
              <div className={styles.readings}>
                <h3 className={styles.readingsTitle}>
                  {pick(YUUTA_MODE.readingsTitle, locale)}
                </h3>
                <ul className={styles.readingList}>
                  {YUUTA_READINGS.map((row) => (
                    <li
                      key={row.key}
                      className={styles.reading}
                      style={
                        {
                          ["--yut-base" as string]: String(row.base),
                          ["--yut-lift" as string]: String(row.lift),
                        } as Record<string, string>
                      }
                    >
                      <span className={styles.readingKanji} lang="ja" aria-hidden>
                        {row.kanji}
                      </span>
                      <span className={styles.readingLabel}>
                        {pick(row.label, locale)}
                      </span>
                      <span className={styles.readingScale}>
                        {row.base} → {row.base + row.lift} / 10
                      </span>
                      <span className={styles.readingBar} aria-hidden>
                        <span className={styles.readingBarFill} />
                      </span>
                      <span className={styles.readingNote}>
                        {pick(row.note, locale)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className={styles.readingsNote}>
                  {pick(YUUTA_MODE.readingsNote, locale)}
                </p>
              </div>
              <span className={styles.bleedTick} aria-hidden />
            </section>

            {/* ══ 3 · KÜNYE ŞERİDİ ═══════════════════════════════════════ */}
            <section className={styles.section} aria-labelledby="yut-identity">
              <header className={styles.sectionHead}>
                <RingSeal
                  className={styles.sectionSeal}
                  outerClassName={styles.sectionSealOuter}
                  innerClassName={styles.sectionSealInner}
                />
                <h2 id="yut-identity" className={styles.sectionTitle}>
                  {pick(YUUTA_SECTIONS.identity.title, locale)}
                </h2>
                <p className={styles.sectionLede}>
                  {pick(YUUTA_SECTIONS.identity.lede, locale)}
                </p>
              </header>

              <dl className={styles.facts}>
                {YUUTA_FACTS.map((fact) => (
                  <div key={fact.label.tr} className={styles.fact}>
                    <dt>{pick(fact.label, locale)}</dt>
                    <dd>{pick(fact.value, locale)}</dd>
                  </div>
                ))}
              </dl>
              <p className={styles.factNote}>{pick(YUUTA_MISSING_NOTE, locale)}</p>
              <span className={styles.bleedTick} aria-hidden />
            </section>

            {/* ══ 4 · LANET LABORATUVARI ═════════════════════════════════ */}
            <section className={styles.section} aria-labelledby="yut-lab">
              <header className={styles.sectionHead}>
                <RingSeal
                  className={styles.sectionSeal}
                  outerClassName={styles.sectionSealOuter}
                  innerClassName={styles.sectionSealInner}
                />
                <h2 id="yut-lab" className={styles.sectionTitle}>
                  {pick(YUUTA_SECTIONS.lab.title, locale)}
                </h2>
                <p className={styles.sectionLede}>
                  {pick(YUUTA_SECTIONS.lab.lede, locale)}
                </p>
              </header>

              <p className={styles.labGroupLabel}>
                {pick(YUUTA_SECTIONS.lab.majorLabel, locale)}
              </p>
              <ul className={styles.labMajor}>
                {YUUTA_LAB_MAJOR.map((card, index) => {
                  const scene = src(card.imageKey);
                  return (
                    <li
                      key={card.key}
                      className={styles.labCard}
                      style={{ ["--i" as string]: index }}
                    >
                      <span className={styles.labKanji} lang="ja">
                        {card.kanji}
                      </span>
                      <span className={styles.labReading} aria-hidden>
                        {card.reading}
                      </span>
                      <span className={styles.labBody}>
                        <span className={styles.labTurkish}>
                          {pick(card.turkish, locale)}
                        </span>
                        <span className={styles.labTagline}>
                          {pick(card.tagline, locale)}
                        </span>
                        <span className={styles.labText}>
                          {pick(card.text, locale)}
                        </span>
                        <span className={styles.labTraits}>
                          {card.traits.map((trait) => (
                            <span key={trait.tr} className={styles.trait}>
                              {pick(trait, locale)}
                            </span>
                          ))}
                        </span>
                      </span>

                      <span
                        className={styles.frame}
                        data-filled={scene ? "true" : "false"}
                        data-shape="wide"
                      >
                        {scene ? (
                          <Image
                            src={scene}
                            alt={yuutaSceneAlt(pick(card.turkish, locale), name)}
                            fill
                            sizes="(max-width: 900px) 92vw, 520px"
                          />
                        ) : (
                          <>
                            <span
                              className={styles.frameKanji}
                              lang="ja"
                              aria-hidden
                            >
                              {card.kanji}
                            </span>
                            {isAdmin ? (
                              <span className={styles.frameLabel}>
                                {slotLabel(card.imageKey)}
                              </span>
                            ) : null}
                          </>
                        )}
                      </span>
                      {isAdmin ? (
                        <CuratorSlot
                          characterId={YUUTA_ID}
                          slot="ABILITY"
                          abilityName={card.imageKey}
                          label={slotLabel(card.imageKey)}
                          size={YUUTA_SLOT_SIZES[card.imageKey]}
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ul>

              <p className={styles.labGroupLabel}>
                {pick(YUUTA_SECTIONS.lab.minorLabel, locale)}
              </p>
              <ul className={styles.labMinor}>
                {YUUTA_LAB_MINOR.map((card, index) => {
                  const scene = src(card.imageKey);
                  return (
                    <li
                      key={card.key}
                      className={styles.noteCard}
                      style={{ ["--i" as string]: index }}
                    >
                      <span
                        className={styles.frame}
                        data-filled={scene ? "true" : "false"}
                        data-shape="badge"
                      >
                        {scene ? (
                          <Image
                            src={scene}
                            alt={yuutaSceneAlt(pick(card.turkish, locale), name)}
                            fill
                            sizes="(max-width: 900px) 44vw, 240px"
                          />
                        ) : (
                          <>
                            <span
                              className={styles.frameKanji}
                              lang="ja"
                              aria-hidden
                            >
                              {card.kanji}
                            </span>
                            {isAdmin ? (
                              <span className={styles.frameLabel}>
                                {slotLabel(card.imageKey)}
                              </span>
                            ) : null}
                          </>
                        )}
                      </span>
                      {isAdmin ? (
                        <CuratorSlot
                          characterId={YUUTA_ID}
                          slot="ABILITY"
                          abilityName={card.imageKey}
                          label={slotLabel(card.imageKey)}
                          size={YUUTA_SLOT_SIZES[card.imageKey]}
                        />
                      ) : null}
                      <span className={styles.noteKanji} lang="ja">
                        {card.kanji}
                      </span>
                      <span className={styles.noteReading} aria-hidden>
                        {card.reading}
                      </span>
                      <span className={styles.noteTurkish}>
                        {pick(card.turkish, locale)}
                      </span>
                      <span className={styles.noteTagline}>
                        {pick(card.tagline, locale)}
                      </span>
                      <span className={styles.noteText}>
                        {pick(card.text, locale)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <span className={styles.bleedTick} aria-hidden />
            </section>

            {/* ══ 5 · DESTE — SAYFANIN KALBİ ═════════════════════════════ */}
            <section className={styles.deckSection} aria-labelledby="yut-deck">
              <header className={styles.sectionHead}>
                <RingSeal
                  className={styles.sectionSeal}
                  outerClassName={styles.sectionSealOuter}
                  innerClassName={styles.sectionSealInner}
                />
                <h2 id="yut-deck" className={styles.sectionTitle}>
                  {pick(YUUTA_SECTIONS.deck.title, locale)}
                </h2>
                <p className={styles.sectionLede}>
                  {pick(YUUTA_SECTIONS.deck.lede, locale)}
                </p>
              </header>

              {/* Kadraj istemci adasının DIŞINDA: durumla değişmiyor, o
                  yüzden sunucuda kalıyor ve yuvası da burada duruyor. */}
              <div className={styles.deckFrameRow}>
                <span
                  className={styles.frame}
                  data-filled={deckArt ? "true" : "false"}
                  data-shape="wide"
                >
                  {deckArt ? (
                    <Image
                      src={deckArt}
                      alt={yuutaSceneAlt(
                        pick(YUUTA_SECTIONS.deck.title, locale),
                        name,
                      )}
                      fill
                      sizes="(max-width: 900px) 92vw, 560px"
                    />
                  ) : (
                    <>
                      <RingSeal
                        className={styles.frameGlyph}
                        outerClassName={styles.frameGlyphOuter}
                        innerClassName={styles.frameGlyphInner}
                      />
                      {isAdmin ? (
                        <span className={styles.frameLabel}>
                          {pick(YUUTA_DECK_UI.frameNote, locale)}
                        </span>
                      ) : null}
                    </>
                  )}
                </span>
                {isAdmin ? (
                  <div className={styles.slotRow}>
                    <CuratorSlot
                      characterId={YUUTA_ID}
                      slot="ABILITY"
                      abilityName={YUUTA_IMAGE_KEYS.deck}
                      label={slotLabel(YUUTA_IMAGE_KEYS.deck)}
                      size={YUUTA_SLOT_SIZES[YUUTA_IMAGE_KEYS.deck]}
                    />
                  </div>
                ) : null}
              </div>

              <CopyDeck
                cards={deckCards}
                groupLabel={pick(YUUTA_DECK_UI.groupLabel, locale)}
                takeLabel={pick(YUUTA_DECK_UI.take, locale)}
                dropLabel={pick(YUUTA_DECK_UI.drop, locale)}
                inDeckLabel={pick(YUUTA_DECK_UI.inDeck, locale)}
                outDeckLabel={pick(YUUTA_DECK_UI.outDeck, locale)}
                countLabel={pick(YUUTA_DECK_UI.countLabel, locale)}
                contentsLabel={pick(YUUTA_DECK_UI.contentsLabel, locale)}
                emptyDeckLabel={pick(YUUTA_DECK_UI.emptyDeck, locale)}
                spreadLabel={pick(YUUTA_DECK_UI.spreadLabel, locale)}
                liveTaken={pick(YUUTA_DECK_UI.liveTaken, locale)}
                liveDropped={pick(YUUTA_DECK_UI.liveDropped, locale)}
                keyboardHint={pick(YUUTA_DECK_UI.keyboardHint, locale)}
                monochromeNote={pick(YUUTA_DECK_UI.monochromeNote, locale)}
              />
              <span className={styles.bleedTick} aria-hidden />
            </section>

            {/* ══ 6 · KADER ÇİZELGESİ ════════════════════════════════════ */}
            <section className={styles.section} aria-labelledby="yut-line">
              <header className={styles.sectionHead}>
                <RingSeal
                  className={styles.sectionSeal}
                  outerClassName={styles.sectionSealOuter}
                  innerClassName={styles.sectionSealInner}
                />
                <h2 id="yut-line" className={styles.sectionTitle}>
                  {pick(YUUTA_SECTIONS.timeline.title, locale)}
                </h2>
                <p className={styles.sectionLede}>
                  {pick(YUUTA_SECTIONS.timeline.lede, locale)}
                </p>
              </header>

              <ol className={styles.steps}>
                {YUUTA_TIMELINE.map((step, index) => {
                  const scene = src(step.imageKey);
                  return (
                    <li
                      key={step.key}
                      className={styles.step}
                      style={{ ["--i" as string]: index }}
                    >
                      <p className={styles.stepAge}>{pick(step.age, locale)}</p>
                      <div className={styles.stepBody}>
                        <h3 className={styles.stepTitle}>
                          {pick(step.title, locale)}
                        </h3>
                        <p className={styles.stepText}>{pick(step.text, locale)}</p>

                        {step.quote ? (
                          <figure className={styles.stepQuote}>
                            <blockquote className={styles.stepQuoteJa} lang="ja">
                              {step.quote.ja}
                            </blockquote>
                            <p className={styles.stepQuoteReading} aria-hidden>
                              {step.quote.reading}
                            </p>
                            <p className={styles.stepQuoteMeaning}>
                              {pick(step.quote.meaning, locale)}
                            </p>
                            <figcaption>
                              <span className={styles.stepQuoteBy}>
                                {pick(step.quote.by, locale)}
                              </span>
                              <span className={styles.stepQuoteWhere}>
                                {pick(step.quote.where, locale)}
                              </span>
                            </figcaption>
                          </figure>
                        ) : null}
                      </div>

                      <span
                        className={styles.frame}
                        data-filled={scene ? "true" : "false"}
                        data-shape="wide"
                      >
                        {scene ? (
                          <Image
                            src={scene}
                            alt={yuutaSceneAlt(pick(step.title, locale), name)}
                            fill
                            sizes="(max-width: 900px) 92vw, 520px"
                          />
                        ) : (
                          <>
                            <span className={styles.frameStep} aria-hidden>
                              {index + 1}
                            </span>
                            {isAdmin ? (
                              <span className={styles.frameLabel}>
                                {slotLabel(step.imageKey)}
                              </span>
                            ) : null}
                          </>
                        )}
                      </span>
                      {isAdmin ? (
                        <CuratorSlot
                          characterId={YUUTA_ID}
                          slot="ABILITY"
                          abilityName={step.imageKey}
                          label={slotLabel(step.imageKey)}
                          size={YUUTA_SLOT_SIZES[step.imageKey]}
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ol>
              <span className={styles.bleedTick} aria-hidden />
            </section>

            {/* ══ BAĞLAR ═════════════════════════════════════════════════
                Tam olarak `EXPERIENCE_COMPANIONS[129571]`in dört kimliği.
                Rika ve Inumaki bağlantısız, portresiz. */}
            <section className={styles.section} aria-labelledby="yut-bonds">
              <header className={styles.sectionHead}>
                <RingSeal
                  className={styles.sectionSeal}
                  outerClassName={styles.sectionSealOuter}
                  innerClassName={styles.sectionSealInner}
                />
                <h2 id="yut-bonds" className={styles.sectionTitle}>
                  {pick(YUUTA_SECTIONS.bonds.title, locale)}
                </h2>
                <p className={styles.sectionLede}>
                  {pick(YUUTA_SECTIONS.bonds.lede, locale)}
                </p>
              </header>

              <ul className={styles.bonds}>
                {YUUTA_BONDS.map((bond, index) => {
                  const face = faces.get(bond.characterId) ?? null;
                  const linked = isExperienceCharacter(bond.characterId);
                  const body = (
                    <>
                      <span className={styles.bondFace}>
                        {face ? (
                          <Image
                            src={face}
                            alt={`${bond.name} ${companionSuffix}`}
                            fill
                            sizes="88px"
                          />
                        ) : (
                          <span
                            className={styles.bondFaceMark}
                            lang="ja"
                            aria-hidden
                          >
                            {bond.kanji.slice(0, 1)}
                          </span>
                        )}
                      </span>
                      <span className={styles.bondBody}>
                        <span className={styles.bondName}>{bond.name}</span>
                        <span className={styles.bondNative} lang="ja">
                          {bond.kanji}
                        </span>
                        <span className={styles.bondRole}>
                          {pick(bond.role, locale)}
                        </span>
                        <span className={styles.bondNote}>
                          {pick(bond.summary, locale)}
                        </span>
                      </span>
                    </>
                  );
                  return (
                    <li
                      key={bond.key}
                      className={styles.bond}
                      style={{ ["--i" as string]: index }}
                    >
                      {linked ? (
                        <Link
                          className={styles.bondLink}
                          href={`/dark-stories/category/anime/karakterler/${bond.characterId}`}
                        >
                          {body}
                        </Link>
                      ) : (
                        <span className={styles.bondLink}>{body}</span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <h3 className={styles.unlistedTitle}>
                {pick(YUUTA_SECTIONS.bonds.unlistedLabel, locale)}
              </h3>
              <ul className={styles.unlisted}>
                {YUUTA_UNLISTED.map((person) => (
                  <li key={person.key} className={styles.unlistedItem}>
                    <span className={styles.unlistedName}>{person.name}</span>
                    {person.kanji ? (
                      <span className={styles.unlistedKanji} lang="ja">
                        {person.kanji}
                      </span>
                    ) : null}
                    <span className={styles.unlistedRole}>
                      {pick(person.role, locale)}
                    </span>
                    <span className={styles.unlistedNote}>
                      {pick(person.summary, locale)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Rika'nın kadrajı — resmî bir portresi YOK, boş kalacak.
                  Yerinde elle çizilmiş siluet duruyor. */}
              <div className={styles.rikaFrame}>
                <span
                  className={styles.frame}
                  data-filled={rikaArt ? "true" : "false"}
                  data-shape="tall"
                >
                  {rikaArt ? (
                    <Image
                      src={rikaArt}
                      alt={pick(YUUTA_CLOSING.rikaAlt, locale)}
                      fill
                      sizes="(max-width: 900px) 70vw, 320px"
                    />
                  ) : (
                    <RikaSilhouette
                      className={styles.rikaSilhouette}
                      label={pick(YUUTA_CLOSING.rikaSilhouetteLabel, locale)}
                      haloClassName={styles.rikaHalo}
                      bodyClassName={styles.rikaBody}
                      hairClassName={styles.rikaHair}
                    />
                  )}
                </span>
                {isAdmin ? (
                  <>
                    <p className={styles.rikaNote}>
                      {pick(YUUTA_CLOSING.rikaNote, locale)}
                    </p>
                    <div className={styles.slotRow}>
                      <CuratorSlot
                        characterId={YUUTA_ID}
                        slot="ABILITY"
                        abilityName={YUUTA_IMAGE_KEYS.rika}
                        label={slotLabel(YUUTA_IMAGE_KEYS.rika)}
                        size={YUUTA_SLOT_SIZES[YUUTA_IMAGE_KEYS.rika]}
                      />
                    </div>
                  </>
                ) : null}
              </div>
              <span className={styles.bleedTick} aria-hidden />
            </section>

            {/* ══ 7 · KAPANIŞ ════════════════════════════════════════════ */}
            <section className={styles.closing} aria-labelledby="yut-closing">
              <header className={styles.sectionHead}>
                <RingSeal
                  className={styles.sectionSeal}
                  outerClassName={styles.sectionSealOuter}
                  innerClassName={styles.sectionSealInner}
                />
                <h2 id="yut-closing" className={styles.sectionTitle}>
                  {pick(YUUTA_SECTIONS.closing.title, locale)}
                </h2>
                <p className={styles.sectionLede}>
                  {pick(YUUTA_SECTIONS.closing.lede, locale)}
                </p>
              </header>

              <ul className={styles.records}>
                {YUUTA_CLOSING.records.map((record) => (
                  <li key={record.key}>
                    <figure className={styles.record}>
                      <blockquote className={styles.recordText}>
                        {pick(record.text, locale)}
                      </blockquote>
                      <figcaption className={styles.recordWhere}>
                        {pick(record.where, locale)}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>

              <p className={styles.motto} lang="ja">
                {YUUTA_CLOSING.motto}
              </p>
              <p className={styles.mottoReading} aria-hidden>
                {YUUTA_CLOSING.mottoReading}
              </p>
              <p className={styles.mottoNote}>
                {pick(YUUTA_CLOSING.mottoNote, locale)}
              </p>

              <div className={styles.closingBand}>
                <span
                  className={styles.frame}
                  data-filled={closingArt ? "true" : "false"}
                  data-shape="band"
                >
                  {closingArt ? (
                    <Image
                      src={closingArt}
                      alt={pick(YUUTA_CLOSING.bandAlt, locale)}
                      fill
                      sizes="(max-width: 900px) 92vw, 900px"
                    />
                  ) : (
                    <>
                      <RingSeal
                        className={styles.frameGlyph}
                        outerClassName={styles.frameGlyphOuter}
                        innerClassName={styles.frameGlyphInner}
                      />
                      {isAdmin ? (
                        <span className={styles.frameLabel}>
                          {pick(YUUTA_CLOSING.bandNote, locale)}
                        </span>
                      ) : null}
                    </>
                  )}
                </span>
                {isAdmin ? (
                  <div className={styles.slotRow}>
                    <CuratorSlot
                      characterId={YUUTA_ID}
                      slot="ABILITY"
                      abilityName={YUUTA_IMAGE_KEYS.closing}
                      label={slotLabel(YUUTA_IMAGE_KEYS.closing)}
                      size={YUUTA_SLOT_SIZES[YUUTA_IMAGE_KEYS.closing]}
                    />
                  </div>
                ) : null}
              </div>

              <p className={styles.credit}>
                {pick(YUUTA_CLOSING.credit, locale)}{" "}
                <a href={siteUrl} target="_blank" rel="noreferrer noopener">
                  {pick(YUUTA_CLOSING.creditLink, locale)}
                </a>
              </p>
              <p className={styles.sourceNote}>
                {pick(YUUTA_CLOSING.sourceNote, locale)}
              </p>
            </section>

            {isAdmin ? (
              <CuratorGaps
                title={pick(YUUTA_GAPS.title, locale)}
                emptyLabel={pick(YUUTA_GAPS.empty, locale)}
                filledLabel={pick(YUUTA_GAPS.filled, locale)}
                allFilledLabel={pick(YUUTA_GAPS.allFilled, locale)}
                rows={gapRows}
              />
            ) : null}
          </div>
        </div>
      </CuratorFrame>
    </RikaShell>
  );
}
