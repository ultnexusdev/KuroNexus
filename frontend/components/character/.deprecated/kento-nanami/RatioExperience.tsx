import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  companionPortraits,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  NANAMI_ALT,
  NANAMI_ARTS,
  NANAMI_BENCH_UI,
  NANAMI_CLOSING,
  NANAMI_CRUMB,
  NANAMI_DETAILS,
  NANAMI_HERO,
  NANAMI_ID,
  NANAMI_IDENTITY,
  NANAMI_IMAGE_KEYS,
  NANAMI_MISSING_NOTE,
  NANAMI_OVERTIME_TEXT,
  NANAMI_SECTIONS,
  NANAMI_SITE_URL,
  NANAMI_SLOT_LABELS,
  NANAMI_TARGETS,
  NANAMI_TIMELINE,
} from "./data";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { OvertimeShell } from "./OvertimeShell";
import { RatioBench } from "./RatioBench";
import { RatioRule } from "./RatioGlyphs";
import styles from "./RatioExperience.module.css";

/**
 * Kento Nanami — "Yedi Üçe" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/133704 bu bileşene çıkıyor
 * (kendi statik rota klasörü). Sayfanın fikri tek cümle: HER ŞEY AYNI
 * ORANDA KIRILIR. Sayfadaki bütün çizgiler yüzde yetmişte kırılıyor ve mod
 * düğmesi mesaiyi bitirdiğinde kırılmayı bırakıyorlar. Sayfanın kalbi de bir
 * tahmin-ölçüm tezgâhı: nereyi işaretlersen işaretle, nokta hep aynı yerde.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   OvertimeShell — mesai modu (tek boolean, etkisi CSS'te `--nan-major`)
 *   RatioBench    — ölçüm tezgâhı (sayfanın kalbi)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 133704 kaydının ABILITY yuvaları (`nan:*`).
 * ⚠️ 25 Ağustos 2026'da bu kayıtta HİÇ görsel yok; tezgâhın tamamı elle
 * çizilmiş SVG olduğu için sayfanın kalbi görselden bağımsız.
 */
export function RatioExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;

  const portrait = primaryPortrait(detail);
  const portraitUploaded = isUploadedPortrait(detail);
  const heroScene = src(NANAMI_IMAGE_KEYS.hero);
  const closingArt = src(NANAMI_IMAGE_KEYS.closing);

  const name = detail.character.name || NANAMI_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? NANAMI_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? NANAMI_SITE_URL;
  const companionSuffix = pick(NANAMI_ALT.companionSuffix, locale);

  const targets = NANAMI_TARGETS.map((target) => ({
    key: target.key,
    kanji: target.kanji,
    name: pick(target.name, locale),
    span: target.span,
    size: pick(target.size, locale),
    note: pick(target.note, locale),
  }));

  return (
    <OvertimeShell
      enterLabel={pick(NANAMI_OVERTIME_TEXT.enter, locale)}
      exitLabel={pick(NANAMI_OVERTIME_TEXT.exit, locale)}
      hint={pick(NANAMI_OVERTIME_TEXT.hint, locale)}
      clockLabel={pick(NANAMI_OVERTIME_TEXT.clockLabel, locale)}
      clockOn={NANAMI_OVERTIME_TEXT.clockOn}
      clockOff={NANAMI_OVERTIME_TEXT.clockOff}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <span className={styles.crumbHere}>
            {pick(NANAMI_CRUMB.series, locale)}
          </span>
        </nav>

        {/* ══ 1 · HERO ═══════════════════════════════════════════════════
            Kadraj yediye üçe bölünmüş: metin yedi, portre üç. Aradaki
            çentik sayfanın her yerinde tekrar eden motif. */}
        <section className={styles.hero} aria-labelledby="nan-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {NANAMI_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroHouse}>
              {pick(NANAMI_IDENTITY.house, locale)}
            </p>
            <h1 id="nan-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>

            <span className={styles.heroRule} aria-hidden>
              <RatioRule
                className={styles.heroRuleArt}
                majorClassName={styles.ruleMajor}
                minorClassName={styles.ruleMinor}
                notchClassName={styles.ruleNotch}
              />
            </span>
            <p className={styles.heroRuleCaption}>
              {pick(NANAMI_HERO.ruleCaption, locale)}
            </p>

            <p className={styles.heroEpigraph}>
              {pick(NANAMI_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(NANAMI_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            <span className={styles.heroPortrait}>
              {portrait ? (
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? NANAMI_HERO.portraitAlt
                      : NANAMI_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="(max-width: 760px) 55vw, 340px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              ) : null}
              {/* Portrenin üstünden geçen bölme çizgisi — yüzde yetmişte */}
              <span className={styles.heroSplit} aria-hidden />
            </span>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={NANAMI_ID}
                slot="ABILITY"
                abilityName={NANAMI_IMAGE_KEYS.hero}
                label={pick(NANAMI_SLOT_LABELS[NANAMI_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="nan-identity">
          <header className={styles.sectionHead}>
            <h2 id="nan-identity" className={styles.sectionTitle}>
              {pick(NANAMI_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NANAMI_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {NANAMI_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.factNote}>{pick(NANAMI_MISSING_NOTE, locale)}</p>
        </section>

        {/* ══ 3 · ÜÇ SÜTUN ═══════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="nan-arts">
          <header className={styles.sectionHead}>
            <h2 id="nan-arts" className={styles.sectionTitle}>
              {pick(NANAMI_SECTIONS.arts.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NANAMI_SECTIONS.arts.lede, locale)}
            </p>
          </header>
          <ul className={styles.arts}>
            {NANAMI_ARTS.map((art) => {
              const scene = src(art.imageKey);
              return (
                <li key={art.key} className={styles.art}>
                  <span className={styles.artArt} aria-hidden>
                    {scene ? (
                      <Image src={scene} alt="" fill sizes="760px" />
                    ) : null}
                  </span>
                  <span className={styles.artKanji} aria-hidden>
                    {art.kanji}
                  </span>
                  <span className={styles.artBody}>
                    <span className={styles.artName}>{art.name}</span>
                    <span className={styles.artReading} aria-hidden>
                      {art.reading}
                    </span>
                    <span className={styles.artTurkish}>
                      {pick(art.turkish, locale)}
                    </span>
                    <span className={styles.artTagline}>
                      {pick(art.tagline, locale)}
                    </span>
                    <span className={styles.artText}>
                      {pick(art.text, locale)}
                    </span>
                    <span className={styles.artTraits}>
                      {art.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={NANAMI_ID}
                      slot="ABILITY"
                      abilityName={art.imageKey}
                      label={pick(NANAMI_SLOT_LABELS[art.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · DÖRT AYRINTI ═══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="nan-details">
          <header className={styles.sectionHead}>
            <h2 id="nan-details" className={styles.sectionTitle}>
              {pick(NANAMI_SECTIONS.tools.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NANAMI_SECTIONS.tools.lede, locale)}
            </p>
          </header>
          <ul className={styles.notes}>
            {NANAMI_DETAILS.map((item) => {
              const scene = src(item.imageKey);
              return (
                <li key={item.key} className={styles.note}>
                  <span className={styles.noteArt} aria-hidden>
                    {scene ? (
                      <Image src={scene} alt="" fill sizes="480px" />
                    ) : null}
                  </span>
                  <span className={styles.noteKanji} aria-hidden>
                    {item.kanji}
                  </span>
                  <span className={styles.noteName}>
                    {pick(item.name, locale)}
                  </span>
                  <span className={styles.noteText}>
                    {pick(item.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={NANAMI_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(NANAMI_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · ÖLÇÜM TEZGÂHI — SAYFANIN KALBİ ═════════════════════════ */}
        <section className={styles.benchSection} aria-labelledby="nan-bench">
          <header className={styles.sectionHead}>
            <h2 id="nan-bench" className={styles.sectionTitle}>
              {pick(NANAMI_SECTIONS.bench.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NANAMI_SECTIONS.bench.lede, locale)}
            </p>
          </header>

          <RatioBench
            targets={targets}
            stageLabel={pick(NANAMI_BENCH_UI.stageLabel, locale)}
            targetLabel={pick(NANAMI_BENCH_UI.targetLabel, locale)}
            guessLabel={pick(NANAMI_BENCH_UI.guessLabel, locale)}
            guessHelp={pick(NANAMI_BENCH_UI.guessHelp, locale)}
            measureButton={pick(NANAMI_BENCH_UI.measureButton, locale)}
            cutButton={pick(NANAMI_BENCH_UI.cutButton, locale)}
            resetButton={pick(NANAMI_BENCH_UI.resetButton, locale)}
            trueLabel={pick(NANAMI_BENCH_UI.trueLabel, locale)}
            errorLabel={pick(NANAMI_BENCH_UI.errorLabel, locale)}
            ratioLabel={pick(NANAMI_BENCH_UI.ratioLabel, locale)}
            ratioValue={NANAMI_BENCH_UI.ratioValue}
            statusIdle={pick(NANAMI_BENCH_UI.statusIdle, locale)}
            statusMeasured={pick(NANAMI_BENCH_UI.statusMeasured, locale)}
            statusCut={pick(NANAMI_BENCH_UI.statusCut, locale)}
            statusExact={pick(NANAMI_BENCH_UI.statusExact, locale)}
            keyboardHint={pick(NANAMI_BENCH_UI.keyboardHint, locale)}
          />
        </section>

        {/* ══ 6 · BEŞ DURAK ══════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="nan-fate">
          <header className={styles.sectionHead}>
            <h2 id="nan-fate" className={styles.sectionTitle}>
              {pick(NANAMI_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NANAMI_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {NANAMI_TIMELINE.map((entry) => {
              const scene = src(entry.imageKey);
              const face = entry.kin
                ? (faces.get(entry.kin.characterId) ?? null)
                : null;
              return (
                <li key={entry.key} className={styles.fateItem}>
                  <p className={styles.fateAge}>{pick(entry.age, locale)}</p>
                  <div className={styles.fateBody}>
                    <h3 className={styles.fateTitle}>
                      {pick(entry.title, locale)}
                    </h3>
                    <p className={styles.fateText}>{pick(entry.text, locale)}</p>
                    {entry.quote ? (
                      <figure className={styles.fateQuote}>
                        <blockquote lang="ja">
                          {pick(entry.quote.text, locale)}
                        </blockquote>
                        <figcaption>{pick(entry.quote.by, locale)}</figcaption>
                      </figure>
                    ) : null}
                    {entry.kin ? (
                      <p className={styles.fateKin}>
                        {face ? (
                          <span className={styles.fateKinFace}>
                            <Image
                              src={face}
                              alt={`${entry.kin.name} ${companionSuffix}`}
                              fill
                              sizes="64px"
                            />
                          </span>
                        ) : null}
                        <span className={styles.fateKinName}>
                          {entry.kin.name}
                        </span>
                        <span className={styles.fateKinRole}>
                          {pick(entry.kin.role, locale)}
                        </span>
                      </p>
                    ) : null}
                  </div>
                  <span className={styles.fateArt} aria-hidden>
                    {scene ? (
                      <Image src={scene} alt="" fill sizes="560px" />
                    ) : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={NANAMI_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(NANAMI_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 7 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="nan-closing">
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          <header className={styles.sectionHead}>
            <h2 id="nan-closing" className={styles.sectionTitle}>
              {pick(NANAMI_SECTIONS.closing.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NANAMI_SECTIONS.closing.lede, locale)}
            </p>
          </header>

          <ul className={styles.closingQuotes}>
            {NANAMI_CLOSING.quotes.map((quote) => (
              <li key={quote.text.tr}>
                <figure className={styles.closingQuote}>
                  <blockquote className={styles.quoteJa} lang="ja">
                    {pick(quote.text, locale)}
                  </blockquote>
                  <p className={styles.quoteReading}>
                    {pick(quote.reading, locale)}
                  </p>
                  <figcaption>
                    <span className={styles.quoteBy}>
                      {pick(quote.by, locale)}
                    </span>
                    <span className={styles.quoteNote}>
                      {pick(quote.note, locale)}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <p className={styles.motto} aria-hidden>
            {NANAMI_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(NANAMI_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(NANAMI_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(NANAMI_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={NANAMI_ID}
                slot="ABILITY"
                abilityName={NANAMI_IMAGE_KEYS.closing}
                label={pick(
                  NANAMI_SLOT_LABELS[NANAMI_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </OvertimeShell>
  );
}
