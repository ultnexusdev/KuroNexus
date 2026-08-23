import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import {
  collectAbilityImages,
  companionPortraits,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import { pick } from "@/lib/characters/types";
import {
  HINATA_CLOSING,
  HINATA_COMPANION_NAMES,
  HINATA_ID,
  HINATA_IDENTITY,
  HINATA_IMAGE_KEYS,
  HINATA_LAB_TITLE,
  HINATA_MINOR,
  HINATA_MODE_TEXT,
  HINATA_PORTRAIT_ALT,
  HINATA_RING_NODES,
  HINATA_RING_TITLE,
  HINATA_SECTION_LABELS,
  HINATA_SLOT_LABELS,
  HINATA_TECHNIQUES,
  HINATA_TIMELINE,
  HINATA_TIMELINE_TITLE,
} from "@/lib/characters/hinata-hyuuga-experience";
import { animeHref } from "@/lib/anime/routes";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { RippleMark, TechniqueMark, VeinFan } from "./HyugaGlyphs";
import { ByakuganShell } from "./ByakuganShell";
import { VisionRing, type VisionNode } from "./VisionRing";
import styles from "./HinataExperience.module.css";

/**
 * Hinata Hyūga — "360 derece ve bir kör nokta" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/1555 bu bileşene dallanır.
 * Akış: gözün açılışı → künye → elin öğrendikleri → GÖRÜŞ HALKASI →
 * kader çizelgesi → kapanış.
 *
 * Sayfanın fikri geometride: Byakugan neredeyse tam bir küre görür,
 * ensede kapanmayan bir derece hariç. Halka o kürenin kesiti; alt
 * ortadaki işaretli nokta hem anatomik kör nokta hem klanın yan dal
 * yarası. Sayfanın duygusal merkezi orası, tasarımın odağı da orası.
 *
 * Sunucu bileşeni. İki istemci adası var: `ByakuganShell` (tek durum,
 * mod düğmesi) ve `VisionRing` (sekmeli halka). Metinler burada
 * `pick()` ile seçilir, adalara düz dize iner (BRIEF §5, §8).
 *
 * Görseller characterId 1555 kaydının ABILITY yuvalarından
 * (`hinata:*`). Hiçbiri zorunlu değil: yuva boşken kart elle çizilmiş
 * SVG işaretiyle ayakta kalır.
 */
export function HinataExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const images = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const portrait = primaryPortrait(detail);
  const uploaded = isUploadedPortrait(detail);

  const src = (key: string): string | null => images.get(key) ?? null;
  const slotLabel = (key: string): string =>
    pick(HINATA_SLOT_LABELS[key], locale);

  /** Küratör yuvası — yönetici değilken hiç çizilmez. */
  const slot = (key: string) =>
    isAdmin ? (
      <CuratorSlot
        key={key}
        characterId={HINATA_ID}
        slot="ABILITY"
        abilityName={key}
        label={slotLabel(key)}
      />
    ) : null;

  const portraitAlt = `${HINATA_IDENTITY.givenName} ${HINATA_IDENTITY.clanName} — ${pick(
    uploaded ? HINATA_PORTRAIT_ALT.uploaded : HINATA_PORTRAIT_ALT.anilist,
    locale,
  )}`;

  /* Halka düğümleri: LocalizedText burada düz dizeye iniyor — istemci
     adası yalnızca seçilmiş dili görüyor. */
  const ringNodes: VisionNode[] = HINATA_RING_NODES.map((node) => ({
    key: node.key,
    angle: node.angle,
    kanji: node.kanji,
    romaji: node.romaji,
    title: pick(node.title, locale),
    readout: pick(node.readout, locale),
    body: node.body.map((paragraph) => pick(paragraph, locale)),
    quote: node.quote
      ? { text: pick(node.quote.text, locale), by: node.quote.by }
      : null,
    companions: (node.companionIds ?? []).map((id) => ({
      name: HINATA_COMPANION_NAMES[id],
      image: faces.get(id) ?? null,
      alt: `${HINATA_COMPANION_NAMES[id]} — ${pick(HINATA_PORTRAIT_ALT.uploaded, locale)}`,
    })),
    image: node.imageKey ? src(node.imageKey) : null,
    imageAlt: node.imageKey
      ? `${slotLabel(node.imageKey)} — ${pick(HINATA_PORTRAIT_ALT.scene, locale)}`
      : "",
    blind: node.blind === true,
  }));

  const heroBackdrop = src(HINATA_IMAGE_KEYS.hero);

  return (
    <ByakuganShell
      enterLabel={pick(HINATA_MODE_TEXT.enter, locale)}
      exitLabel={pick(HINATA_MODE_TEXT.exit, locale)}
      description={pick(HINATA_MODE_TEXT.description, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        </nav>

        {/* ══ 1 · HERO — GÖZ AÇILIYOR ══════════════════════════════ */}
        <section className={styles.hero} aria-labelledby="hinata-name">
          {heroBackdrop ? (
            <span className={styles.heroBackdrop} aria-hidden>
              <Image src={heroBackdrop} alt="" fill sizes="1920px" priority />
            </span>
          ) : null}
          {/* Ay ışığı yıkaması + gözden dışa dallanan damar ağı */}
          <span className={styles.heroMoon} aria-hidden />
          <span className={styles.heroVeins} aria-hidden>
            <VeinFan />
          </span>
          <span className={styles.heroWatermark} aria-hidden>
            {HINATA_IDENTITY.watermark}
          </span>

          <div className={styles.heroText}>
            <h1 id="hinata-name" className={styles.heroName}>
              <span className={styles.heroGiven}>
                {HINATA_IDENTITY.givenName}
              </span>{" "}
              <span className={styles.heroClan}>{HINATA_IDENTITY.clanName}</span>
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {HINATA_IDENTITY.nativeName}
            </p>
            <p className={styles.heroAlias}>
              <span lang="ja">{HINATA_IDENTITY.aliasNative}</span>
              <span className={styles.heroAliasGloss}>
                {pick(HINATA_IDENTITY.alias, locale)}
              </span>
            </p>
            <p className={styles.heroEpigraph}>
              {pick(HINATA_IDENTITY.epigraph, locale)}
            </p>
          </div>

          {portrait ? (
            <div
              className={styles.heroPortrait}
              /* AniList portresi ~230 piksel: küçük görsel büyük kutuya
                 YAYILMAZ, dar kadrajda kalır (BRIEF §3.1) */
              data-small={!uploaded || undefined}
            >
              <Image
                src={portrait}
                alt={portraitAlt}
                fill
                sizes="(max-width: 900px) 60vw, 24rem"
                unoptimized={!uploaded}
                priority
              />
              <span className={styles.heroPortraitVeil} aria-hidden />
            </div>
          ) : null}

          {isAdmin ? (
            <div className={styles.slotRow}>{slot(HINATA_IMAGE_KEYS.hero)}</div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ŞERİDİ ═════════════════════════════════════ */}
        <section className={styles.identity} aria-labelledby="hinata-identity">
          <h2 id="hinata-identity" className={styles.visuallyHidden}>
            {pick(HINATA_SECTION_LABELS.identity, locale)}
          </h2>
          <dl className={styles.factBand}>
            {HINATA_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <RippleMark className={styles.divider} />

        {/* ══ 3 · GÜÇ LABORATUVARI ═════════════════════════════════ */}
        <section className={styles.lab} aria-labelledby="hinata-lab">
          <header className={styles.sectionHead}>
            <h2 id="hinata-lab" className={styles.sectionTitle}>
              {pick(HINATA_LAB_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(HINATA_LAB_TITLE.lede, locale)}
            </p>
          </header>

          <ul className={styles.labGrid}>
            {HINATA_TECHNIQUES.map((technique) => {
              const key = HINATA_IMAGE_KEYS[technique.key];
              const art = src(key);
              return (
                <li
                  key={technique.key}
                  className={styles.labCard}
                  data-signature={technique.signature || undefined}
                >
                  <span className={styles.labMark} aria-hidden>
                    <TechniqueMark
                      mark={technique.mark}
                      className={styles.labMarkArt}
                    />
                    {art ? (
                      <Image
                        src={art}
                        alt=""
                        fill
                        sizes={technique.signature ? "1080px" : "640px"}
                        className={styles.labArt}
                      />
                    ) : null}
                    {/* Gizli katman: Byakugan modunda beliren chakra noktaları */}
                    <span className={styles.tenketsuLayer} />
                  </span>
                  <div className={styles.labBody}>
                    <span className={styles.labKanji} aria-hidden>
                      {technique.kanji}
                    </span>
                    <h3 className={styles.labName}>{technique.name}</h3>
                    <p className={styles.labTurkish}>
                      {pick(technique.turkishName, locale)}
                    </p>
                    <p className={styles.labTagline}>
                      {pick(technique.tagline, locale)}
                    </p>
                    <p className={styles.labText}>
                      {pick(technique.text, locale)}
                    </p>
                    <ul className={styles.labTraits}>
                      {technique.traits.map((trait) => (
                        <li key={trait.tr}>{pick(trait, locale)}</li>
                      ))}
                    </ul>
                  </div>
                  {slot(key)}
                </li>
              );
            })}
          </ul>

          <ul className={styles.minorRow}>
            {HINATA_MINOR.map((minor) => {
              const key = HINATA_IMAGE_KEYS[minor.key];
              const art = src(key);
              return (
                <li key={minor.key} className={styles.minorCard}>
                  <span className={styles.minorMark} aria-hidden>
                    <TechniqueMark
                      mark={minor.mark}
                      className={styles.minorMarkArt}
                    />
                    {art ? (
                      <Image
                        src={art}
                        alt=""
                        fill
                        sizes="360px"
                        className={styles.minorArt}
                      />
                    ) : null}
                  </span>
                  <div className={styles.minorBody}>
                    <h3 className={styles.minorName}>
                      {minor.name}
                      <span className={styles.minorKanji} aria-hidden>
                        {minor.kanji}
                      </span>
                    </h3>
                    <p className={styles.minorNote}>
                      {pick(minor.note, locale)}
                    </p>
                  </div>
                  {slot(key)}
                </li>
              );
            })}
          </ul>
        </section>

        <RippleMark className={styles.divider} />

        {/* ══ 4 · GÖRÜŞ HALKASI — SAYFANIN KALBİ ═══════════════════ */}
        <section className={styles.vision} aria-labelledby="hinata-vision">
          <header className={styles.sectionHead}>
            <h2 id="hinata-vision" className={styles.sectionTitle}>
              {pick(HINATA_RING_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(HINATA_RING_TITLE.lede, locale)}
            </p>
          </header>

          <VisionRing
            nodes={ringNodes}
            ringLabel={pick(HINATA_RING_TITLE.ringLabel, locale)}
            eyeLabel={pick(HINATA_RING_TITLE.eyeLabel, locale)}
            blindBadge={pick(HINATA_RING_TITLE.blindBadge, locale)}
            hint={pick(HINATA_RING_TITLE.hint, locale)}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              {slot(HINATA_IMAGE_KEYS.blindSpot)}
            </div>
          ) : null}
        </section>

        <RippleMark className={styles.divider} />

        {/* ══ 5 · KADER ÇİZELGESİ ══════════════════════════════════ */}
        <section className={styles.timeline} aria-labelledby="hinata-timeline">
          <header className={styles.sectionHead}>
            <h2 id="hinata-timeline" className={styles.sectionTitle}>
              {pick(HINATA_TIMELINE_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(HINATA_TIMELINE_TITLE.lede, locale)}
            </p>
          </header>

          <ol className={styles.eraList}>
            {HINATA_TIMELINE.map((era) => {
              const art = src(era.imageKey);
              return (
                <li
                  key={era.key}
                  className={styles.era}
                  data-pivot={era.pivot || undefined}
                >
                  <span className={styles.eraNode} aria-hidden />
                  <div className={styles.eraBody}>
                    <p className={styles.eraAge}>{pick(era.age, locale)}</p>
                    <h3 className={styles.eraTitle}>
                      {pick(era.title, locale)}
                    </h3>
                    {art ? (
                      <span className={styles.eraArt} aria-hidden>
                        <Image src={art} alt="" fill sizes="900px" />
                      </span>
                    ) : null}
                    <p className={styles.eraText}>{pick(era.text, locale)}</p>
                    {era.quote ? (
                      <figure className={styles.eraQuote}>
                        <blockquote>
                          &ldquo;{pick(era.quote.text, locale)}&rdquo;
                        </blockquote>
                        <figcaption>{era.quote.by}</figcaption>
                      </figure>
                    ) : null}
                  </div>
                  {slot(era.imageKey)}
                </li>
              );
            })}
          </ol>
        </section>

        <RippleMark className={styles.divider} />

        {/* ══ 6 · KAPANIŞ ══════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="hinata-closing">
          <h2 id="hinata-closing" className={styles.visuallyHidden}>
            {HINATA_IDENTITY.givenName} {HINATA_IDENTITY.clanName}
          </h2>

          {HINATA_CLOSING.quotes.map((quote) => (
            <figure key={quote.text.tr} className={styles.closingQuote}>
              <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
              <figcaption>{pick(quote.source, locale)}</figcaption>
            </figure>
          ))}

          <p className={styles.motto} lang="ja" aria-hidden>
            {HINATA_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(HINATA_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>{pick(HINATA_CLOSING.credit, locale)}</p>
          <a
            className={styles.creditLink}
            href={HINATA_CLOSING.creditHref}
            target="_blank"
            rel="noreferrer"
          >
            {pick(HINATA_CLOSING.creditLink, locale)}
          </a>
        </section>
      </CuratorFrame>
    </ByakuganShell>
  );
}
