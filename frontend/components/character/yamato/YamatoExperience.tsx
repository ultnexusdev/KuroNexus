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
  YAMATO_ALT,
  YAMATO_BENCH,
  YAMATO_CLOSING,
  YAMATO_CRUMB,
  YAMATO_FACES,
  YAMATO_GROWTH,
  YAMATO_GROW_UI,
  YAMATO_HERO,
  YAMATO_ID,
  YAMATO_IDENTITY,
  YAMATO_IMAGE_KEYS,
  YAMATO_JUTSU,
  YAMATO_KIN,
  YAMATO_MODE_TEXT,
  YAMATO_NAMES,
  YAMATO_SECTIONS,
  YAMATO_SITE_URL,
  YAMATO_SLOT_LABELS,
  YAMATO_TIMELINE,
} from "@/lib/characters/yamato-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { MokutonShell } from "./MokutonShell";
import { GrowthRail } from "./GrowthRail";
import { BranchStub, GrainRings } from "./WoodGlyphs";
import styles from "./YamatoExperience.module.css";

/**
 * Yamato — "Mokuton: Büyüyen Yapı" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/2006 bu bileşene dallanır (rota
 * dosyasındaki `EXPERIENCES` haritası). Sayfanın fikri tek cümle: YAPI.
 * Sayfa boyunca sol kenarda bir gövde yükseliyor ve bölümler onun dalları
 * olarak açılıyor; kalpteki bölümde ziyaretçi o gövdeyi tohumdan ormana
 * kendisi büyütüyor.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   MokutonShell — "Mokuton modu" (tek boolean, etkinin tamamı CSS'te)
 *   GrowthRail   — beş büyüme kademesi (boğum düğmeleri + klavye + şema)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 2006 kaydının ABILITY yuvaları (`yamato:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 */
export function YamatoExperience({
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
  const heroScene = src(YAMATO_IMAGE_KEYS.hero);
  const closingArt = src(YAMATO_IMAGE_KEYS.closing);
  const calmArt = src(YAMATO_FACES.calm.imageKey);
  const scaryArt = src(YAMATO_FACES.scary.imageKey);

  const name = detail.character.name || YAMATO_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? YAMATO_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? YAMATO_SITE_URL;

  const stages = YAMATO_GROWTH.map((stage) => ({
    key: stage.key,
    kanji: stage.kanji,
    title: pick(stage.title, locale),
    scale: pick(stage.scale, locale),
    read: pick(stage.read, locale),
    note: pick(stage.note, locale),
    image: src(stage.imageKey),
  }));

  return (
    <MokutonShell
      enterLabel={pick(YAMATO_MODE_TEXT.enter, locale)}
      exitLabel={pick(YAMATO_MODE_TEXT.exit, locale)}
      hint={pick(YAMATO_MODE_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(YAMATO_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — KÜTÜĞÜN KESİTİ ═══════════════════════════════════
            Zeminde yıllık halkalar (elle çizilmiş SVG) ve sis; portre dar
            kadrajda, sağda. Üç ad merdiveni başlığın ALTINDA: bu bir kicker
            değil, sayfanın tezi — adamın adını hep başkası koydu. */}
        <section className={styles.hero} aria-labelledby="yam-name">
          <span className={styles.rings} aria-hidden>
            <GrainRings className={styles.ringsArt} ringClassName={styles.ring} />
          </span>
          <span className={styles.mist} aria-hidden />

          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {YAMATO_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <h1 id="yam-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>

            <ol className={styles.names}>
              {YAMATO_NAMES.map((entry) => (
                <li key={entry.name} className={styles.nameItem}>
                  <span className={styles.nameWord}>{entry.name}</span>
                  <span className={styles.nameNative} aria-hidden>
                    {entry.native}
                  </span>
                  <span className={styles.nameBy}>{pick(entry.by, locale)}</span>
                </li>
              ))}
            </ol>

            <p className={styles.heroEpigraph}>
              {pick(YAMATO_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(YAMATO_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? YAMATO_HERO.portraitAlt
                      : YAMATO_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="360px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              </span>
            ) : null}
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={YAMATO_ID}
                slot="ABILITY"
                abilityName={YAMATO_IMAGE_KEYS.hero}
                label={pick(YAMATO_SLOT_LABELS[YAMATO_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ═══════════════════════════════════════════════════
            Değerler monospace ve tabular: bir yapı ruhsatındaki ölçüler. */}
        <section className={styles.section} aria-labelledby="yam-identity">
          <header className={styles.sectionHead}>
            <BranchStub className={styles.sectionBranch} />
            <h2 id="yam-identity" className={styles.sectionTitle}>
              {pick(YAMATO_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(YAMATO_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {YAMATO_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · KÖK, GÖVDE, DAL ═════════════════════════════════════════
            Yoldaşlar ağacın katmanlarına dizili: dallar üstte, gövde ortada,
            kökler altta ve koyu — toprağın altındaki üçü ona hiç sormadı. */}
        <section className={styles.section} aria-labelledby="yam-kin">
          <header className={styles.sectionHead}>
            <BranchStub className={styles.sectionBranch} />
            <h2 id="yam-kin" className={styles.sectionTitle}>
              {pick(YAMATO_SECTIONS.roots.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(YAMATO_SECTIONS.roots.lede, locale)}
            </p>
          </header>
          <ul className={styles.kin}>
            {YAMATO_KIN.map((item) => {
              const face = faces.get(item.characterId) ?? null;
              return (
                <li
                  key={item.characterId}
                  className={styles.kinItem}
                  data-part={item.part}
                >
                  <span className={styles.kinArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${item.name} ${pick(YAMATO_ALT.companionSuffix, locale)}`}
                        fill
                        sizes="260px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.kinBody}>
                    <span className={styles.kinRole}>
                      {pick(item.role, locale)}
                    </span>
                    <span className={styles.kinName}>{item.name}</span>
                    <span className={styles.kinNote}>
                      {pick(item.note, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · MOKUTON'UN ÜÇ İŞİ ═══════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="yam-jutsu">
          <header className={styles.sectionHead}>
            <BranchStub className={styles.sectionBranch} />
            <h2 id="yam-jutsu" className={styles.sectionTitle}>
              {pick(YAMATO_SECTIONS.jutsu.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(YAMATO_SECTIONS.jutsu.lede, locale)}
            </p>
          </header>
          <ul className={styles.works}>
            {YAMATO_JUTSU.map((jutsu) => {
              const key = YAMATO_IMAGE_KEYS[jutsu.key];
              const art = src(key);
              return (
                <li key={jutsu.key} className={styles.work}>
                  <span className={styles.workArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="720px" /> : null}
                  </span>
                  <span className={styles.workKanji} aria-hidden>
                    {jutsu.kanji}
                  </span>
                  <span className={styles.workBody}>
                    <span className={styles.workName}>{jutsu.name}</span>
                    <span className={styles.workTurkish}>
                      {pick(jutsu.turkish, locale)}
                    </span>
                    <span className={styles.workTagline}>
                      {pick(jutsu.tagline, locale)}
                    </span>
                    <span className={styles.workText}>
                      {pick(jutsu.text, locale)}
                    </span>
                    <span className={styles.workTraits}>
                      {jutsu.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={YAMATO_ID}
                      slot="ABILITY"
                      abilityName={key}
                      label={pick(YAMATO_SLOT_LABELS[key], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · TEZGÂH — dört küçük ═════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="yam-bench">
          <header className={styles.sectionHead}>
            <BranchStub className={styles.sectionBranch} />
            <h2 id="yam-bench" className={styles.sectionTitle}>
              {pick(YAMATO_SECTIONS.bench.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(YAMATO_SECTIONS.bench.lede, locale)}
            </p>
          </header>
          <ul className={styles.bench}>
            {YAMATO_BENCH.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.benchItem}>
                  <span className={styles.benchArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="480px" /> : null}
                  </span>
                  <span className={styles.benchName}>
                    {pick(item.name, locale)}
                  </span>
                  <span className={styles.benchNote}>
                    {pick(item.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={YAMATO_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(YAMATO_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · BÜYÜYEN YAPI — SAYFANIN KALBİ ═══════════════════════════ */}
        <section className={styles.growSection} aria-labelledby="yam-grow">
          <span className={styles.canopy} aria-hidden />
          <header className={styles.sectionHead}>
            <BranchStub className={styles.sectionBranch} />
            <h2 id="yam-grow" className={styles.sectionTitle}>
              {pick(YAMATO_SECTIONS.grow.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(YAMATO_SECTIONS.grow.lede, locale)}
            </p>
          </header>
          <GrowthRail
            stages={stages}
            listLabel={pick(YAMATO_GROW_UI.listLabel, locale)}
            stageWord={pick(YAMATO_GROW_UI.stageWord, locale)}
            prevLabel={pick(YAMATO_GROW_UI.prev, locale)}
            nextLabel={pick(YAMATO_GROW_UI.next, locale)}
            scaleLabel={pick(YAMATO_GROW_UI.scaleLabel, locale)}
            keyboardHint={pick(YAMATO_GROW_UI.keyboardHint, locale)}
            treeAlt={pick(YAMATO_GROW_UI.treeAlt, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {YAMATO_GROWTH.map((stage) => (
                <CuratorSlot
                  key={stage.imageKey}
                  characterId={YAMATO_ID}
                  slot="ABILITY"
                  abilityName={stage.imageKey}
                  label={pick(YAMATO_SLOT_LABELS[stage.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 7 · İKİ YÜZ — küçük ve sessiz ═══════════════════════════════
            Sayfanın tek şakası. Bir kart, iki sütun, tek satır kapanış;
            tonu bozmasın diye ölçüsü bilerek küçük tutuldu. */}
        <section className={styles.facesSection} aria-labelledby="yam-faces">
          <header className={styles.sectionHead} data-quiet="true">
            <BranchStub className={styles.sectionBranch} />
            <h2 id="yam-faces" className={styles.facesTitle}>
              {pick(YAMATO_SECTIONS.faces.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(YAMATO_SECTIONS.faces.lede, locale)}
            </p>
          </header>
          <div className={styles.facesCard}>
            <div className={styles.face} data-face="calm">
              <span className={styles.faceArt}>
                {calmArt ? (
                  <Image
                    src={calmArt}
                    alt={pick(YAMATO_FACES.calm.alt, locale)}
                    fill
                    sizes="320px"
                  />
                ) : null}
              </span>
              <p className={styles.faceLabel}>
                {pick(YAMATO_FACES.calm.label, locale)}
              </p>
              <p className={styles.faceText}>
                {pick(YAMATO_FACES.calm.text, locale)}
              </p>
            </div>
            <div className={styles.face} data-face="scary">
              <span className={styles.faceArt}>
                {scaryArt ? (
                  <Image
                    src={scaryArt}
                    alt={pick(YAMATO_FACES.scary.alt, locale)}
                    fill
                    sizes="320px"
                  />
                ) : null}
              </span>
              <p className={styles.faceLabel}>
                {pick(YAMATO_FACES.scary.label, locale)}
              </p>
              <p className={styles.faceText}>
                {pick(YAMATO_FACES.scary.text, locale)}
              </p>
            </div>
            <p className={styles.faceLine}>{pick(YAMATO_FACES.line, locale)}</p>
          </div>
          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={YAMATO_ID}
                slot="ABILITY"
                abilityName={YAMATO_FACES.calm.imageKey}
                label={pick(YAMATO_SLOT_LABELS[YAMATO_FACES.calm.imageKey], locale)}
              />
              <CuratorSlot
                characterId={YAMATO_ID}
                slot="ABILITY"
                abilityName={YAMATO_FACES.scary.imageKey}
                label={pick(
                  YAMATO_SLOT_LABELS[YAMATO_FACES.scary.imageKey],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 8 · KADER ÇİZELGESİ ═════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="yam-fate">
          <header className={styles.sectionHead}>
            <BranchStub className={styles.sectionBranch} />
            <h2 id="yam-fate" className={styles.sectionTitle}>
              {pick(YAMATO_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(YAMATO_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {YAMATO_TIMELINE.map((entry) => {
              const art = src(entry.imageKey);
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
                        <blockquote>
                          &ldquo;{pick(entry.quote.text, locale)}&rdquo;
                        </blockquote>
                        <figcaption>
                          <span className={styles.quoteBy}>
                            {pick(entry.quote.by, locale)}
                          </span>
                          <span className={styles.quoteKind}>
                            {pick(entry.quote.kind, locale)}
                          </span>
                        </figcaption>
                      </figure>
                    ) : null}
                  </div>
                  <span className={styles.fateArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="560px" /> : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={YAMATO_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(YAMATO_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 9 · KAPANIŞ ═════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="yam-closing">
          <h2 id="yam-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          {YAMATO_CLOSING.quotes.map((quote) => (
            <figure key={quote.text.tr} className={styles.closingQuote}>
              <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
              <figcaption>
                <span className={styles.quoteBy}>{pick(quote.by, locale)}</span>
                <span className={styles.quoteNote}>
                  {pick(quote.note, locale)}
                </span>
              </figcaption>
            </figure>
          ))}

          <p className={styles.motto} aria-hidden>
            {YAMATO_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(YAMATO_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(YAMATO_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(YAMATO_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={YAMATO_ID}
                slot="ABILITY"
                abilityName={YAMATO_IMAGE_KEYS.closing}
                label={pick(
                  YAMATO_SLOT_LABELS[YAMATO_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </MokutonShell>
  );
}
