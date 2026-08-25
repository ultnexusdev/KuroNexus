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
  NAGATO_ALT,
  NAGATO_CLOSING,
  NAGATO_CRUMB,
  NAGATO_DEBATE_UI,
  NAGATO_FACES,
  NAGATO_HERO,
  NAGATO_ID,
  NAGATO_IDENTITY,
  NAGATO_IMAGE_KEYS,
  NAGATO_QUESTIONS,
  NAGATO_RAIN_TEXT,
  NAGATO_RODS,
  NAGATO_SECTIONS,
  NAGATO_SITE_URL,
  NAGATO_SIX_PATHS_KEY,
  NAGATO_SIX_PATHS_NOTE,
  NAGATO_SLOT_LABELS,
  NAGATO_TECHNIQUES,
  NAGATO_TIMELINE,
  NAGATO_TOOLS,
} from "@/lib/characters/nagato-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { RainShell } from "./RainShell";
import { ThreeQuestions, type QuestionView } from "./ThreeQuestions";
import { RinneganEye, RodMark, TechniqueSigil, WiredBody } from "./NagatoGlyphs";
import styles from "./NagatoExperience.module.css";

/**
 * Nagato — "Acıyı Bil" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/3180 bu bileşene dallanır.
 * Sayfanın fikri tek cümle: SORU. Nagato'nun bıraktığı şey bir teknik
 * listesi değil, cevaplanmamış bir tartışma — sayfa da onun etrafında
 * kuruldu. Üç soru açıldıkça yağmur artıyor, üçüncüsünde diniyor.
 *
 * ⚠️ ALTI YOL BURADA ANLATILMIYOR. Arşivde zaten ayrıntılı bir sergi var
 * (`/anime/akatsuki/six-paths/<key>`); bu sayfa ona tek satırla değinip
 * bağlantı veriyor. Tekrar yok.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   RainShell     — "Yağmur" modu + yağmur perdesi + yağmurun şiddeti
 *   ThreeQuestions — üç sorunun açılıp kapanması (şiddeti kabuğa bildirir)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 3180 kaydının ABILITY yuvaları (`nagato:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 */
export function NagatoExperience({
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
  const heroScene = src(NAGATO_IMAGE_KEYS.hero);
  const machineArt = src(NAGATO_IMAGE_KEYS.machine);
  const closingArt = src(NAGATO_IMAGE_KEYS.closing);

  /* Başlık AniList'in adını DEĞİL gerçek adı taşır: kayıt bu numarayı
     "Pain" diye tutuyor (bkz. veri dosyasının başı). AniList'in adı künye
     şeridinde kendi satırında duruyor. */
  const name = NAGATO_IDENTITY.name;
  const siteUrl = detail.character.siteUrl ?? NAGATO_SITE_URL;

  const questions: QuestionView[] = NAGATO_QUESTIONS.map((item) => ({
    key: item.key,
    order: item.order,
    question: pick(item.question, locale),
    who: pick(item.answerWho ?? NAGATO_DEBATE_UI.nagatoLabel, locale),
    answerLabel: pick(item.answerLabel, locale),
    answer: pick(item.answer, locale),
    counter: item.counter
      ? {
          who: item.counter.who,
          label: pick(item.counter.label, locale),
          text: pick(item.counter.text, locale),
          quote: item.counter.quote
            ? {
                text: pick(item.counter.quote.text, locale),
                by: pick(item.counter.quote.by, locale),
              }
            : null,
        }
      : null,
    silence: item.silence
      ? {
          headline: pick(item.silence.headline, locale),
          text: pick(item.silence.text, locale),
        }
      : null,
  }));

  return (
    <RainShell
      enterLabel={pick(NAGATO_RAIN_TEXT.enter, locale)}
      exitLabel={pick(NAGATO_RAIN_TEXT.exit, locale)}
      hint={pick(NAGATO_RAIN_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(NAGATO_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — GÖZ ADAMDAN BÜYÜK ═══════════════════════════════
            Portre dar bir yarıkta (Ame kulelerinin pencereleri); Rinnegan
            halkaları portrenin dışına taşıyor. Ad, halkaların altında. */}
        <section className={styles.hero} aria-labelledby="nag-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {NAGATO_IDENTITY.watermark}
          </p>

          <div className={styles.heroFigure}>
            <span className={styles.heroSlit}>
              {portrait ? (
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? NAGATO_HERO.portraitAlt
                      : NAGATO_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="360px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              ) : null}
            </span>
            <span className={styles.heroEye} aria-hidden>
              <RinneganEye
                className={styles.heroEyeArt}
                ringClassName={styles.heroEyeRing}
                coreClassName={styles.heroEyeCore}
              />
            </span>
            <p className={styles.heroEyeCaption}>
              {pick(NAGATO_HERO.eyeCaption, locale)}
            </p>
          </div>

          <div className={styles.heroBody}>
            <h1 id="nag-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {NAGATO_IDENTITY.nativeName}
            </p>
            <p className={styles.heroVillage}>
              {pick(NAGATO_IDENTITY.village, locale)}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(NAGATO_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(NAGATO_HERO.lede, locale)}</p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={NAGATO_ID}
                slot="ABILITY"
                abilityName={NAGATO_IMAGE_KEYS.hero}
                label={pick(NAGATO_SLOT_LABELS[NAGATO_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KAYIT ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="nag-record">
          <header className={styles.sectionHead}>
            <h2 id="nag-record" className={styles.sectionTitle}>
              {pick(NAGATO_SECTIONS.record.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NAGATO_SECTIONS.record.lede, locale)}
            </p>
          </header>
          <dl className={styles.record}>
            {NAGATO_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.recordRow}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · HALKANIN ÜÇ İŞİ ════════════════════════════════════════
            Üç büyük teknik; her biri elle çizilmiş bir mühürle açılıyor.
            Altı Yol'a yalnızca alttaki tek satır değiniyor. */}
        <section className={styles.section} aria-labelledby="nag-arsenal">
          <header className={styles.sectionHead}>
            <h2 id="nag-arsenal" className={styles.sectionTitle}>
              {pick(NAGATO_SECTIONS.arsenal.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NAGATO_SECTIONS.arsenal.lede, locale)}
            </p>
          </header>

          <ul className={styles.works}>
            {NAGATO_TECHNIQUES.map((tech) => {
              const art = src(tech.imageKey);
              return (
                <li key={tech.key} className={styles.work}>
                  <span className={styles.workArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="720px" /> : null}
                  </span>
                  <span className={styles.workSigil} aria-hidden>
                    <TechniqueSigil
                      kind={tech.sigil}
                      className={styles.sigilArt}
                      strokeClassName={styles.sigilStroke}
                      fillClassName={styles.sigilFill}
                    />
                  </span>
                  <span className={styles.workBody}>
                    <span className={styles.workName}>{tech.name}</span>
                    <span className={styles.workKanji} aria-hidden>
                      {tech.kanji}
                    </span>
                    <span className={styles.workTurkish}>
                      {pick(tech.turkish, locale)}
                    </span>
                    <span className={styles.workTagline}>
                      {pick(tech.tagline, locale)}
                    </span>
                    <span className={styles.workText}>
                      {pick(tech.text, locale)}
                    </span>
                    <span className={styles.workTraits}>
                      {tech.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={NAGATO_ID}
                      slot="ABILITY"
                      abilityName={tech.imageKey}
                      label={pick(NAGATO_SLOT_LABELS[tech.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>

          <p className={styles.sixPaths}>
            {pick(NAGATO_SIX_PATHS_NOTE.text, locale)}{" "}
            <Link
              className={styles.sixPathsLink}
              href={animeHref.akatsukiPath(NAGATO_SIX_PATHS_KEY)}
            >
              {pick(NAGATO_SIX_PATHS_NOTE.link, locale)}
            </Link>
          </p>
        </section>

        {/* ══ 4 · GÖRÜNMEYEN DÖRT ŞEY ════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="nag-tools">
          <header className={styles.sectionHead}>
            <h2 id="nag-tools" className={styles.sectionTitle}>
              {pick(NAGATO_SECTIONS.tools.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NAGATO_SECTIONS.tools.lede, locale)}
            </p>
          </header>
          <ul className={styles.tools}>
            {NAGATO_TOOLS.map((tool) => {
              const art = src(tool.imageKey);
              return (
                <li key={tool.key} className={styles.tool}>
                  <span className={styles.toolMark} aria-hidden>
                    <RodMark className={styles.toolMarkArt} />
                  </span>
                  <span className={styles.toolBody}>
                    <span className={styles.toolName}>
                      {tool.name}
                      {tool.kanji ? (
                        <span className={styles.toolKanji} aria-hidden>
                          {tool.kanji}
                        </span>
                      ) : null}
                    </span>
                    <span className={styles.toolTurkish}>
                      {pick(tool.turkish, locale)}
                    </span>
                    <span className={styles.toolNote}>
                      {pick(tool.note, locale)}
                    </span>
                  </span>
                  <span className={styles.toolArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="420px" /> : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={NAGATO_ID}
                      slot="ABILITY"
                      abilityName={tool.imageKey}
                      label={pick(NAGATO_SLOT_LABELS[tool.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · YAĞMURUN ALTINDAKİ BEŞ YÜZ ═════════════════════════════ */}
        <section className={styles.section} aria-labelledby="nag-faces">
          <header className={styles.sectionHead}>
            <h2 id="nag-faces" className={styles.sectionTitle}>
              {pick(NAGATO_SECTIONS.faces.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NAGATO_SECTIONS.faces.lede, locale)}
            </p>
          </header>
          <ul className={styles.faces}>
            {NAGATO_FACES.map((person) => {
              const face = faces.get(person.characterId) ?? null;
              return (
                <li key={person.characterId} className={styles.face}>
                  <span className={styles.faceSlit}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${person.name} ${pick(NAGATO_ALT.faceSuffix, locale)}`}
                        fill
                        sizes="260px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.faceRole}>
                    {pick(person.role, locale)}
                  </span>
                  <span className={styles.faceName}>{person.name}</span>
                  <span className={styles.faceNote}>
                    {pick(person.note, locale)}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · ÜÇ SORU — SAYFANIN KALBİ ═══════════════════════════════ */}
        <section className={styles.debateSection} aria-labelledby="nag-debate">
          <header className={styles.sectionHead}>
            <h2 id="nag-debate" className={styles.sectionTitle}>
              {pick(NAGATO_SECTIONS.debate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NAGATO_SECTIONS.debate.lede, locale)}
            </p>
          </header>
          <ThreeQuestions
            questions={questions}
            listLabel={pick(NAGATO_DEBATE_UI.listLabel, locale)}
            hint={pick(NAGATO_DEBATE_UI.hint, locale)}
            gaugeLabel={pick(NAGATO_DEBATE_UI.gaugeLabel, locale)}
            weather={NAGATO_DEBATE_UI.weather.map((row) => pick(row, locale))}
          />
        </section>

        {/* ══ 7 · ÇİVİLER — DUYGUSAL MERKEZ ══════════════════════════════ */}
        <section className={styles.rodsSection} aria-labelledby="nag-rods">
          <header className={styles.sectionHead}>
            <h2 id="nag-rods" className={styles.sectionTitle}>
              {pick(NAGATO_SECTIONS.rods.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NAGATO_SECTIONS.rods.lede, locale)}
            </p>
          </header>

          <div className={styles.rods}>
            <div className={styles.rodsFigure}>
              {machineArt ? (
                <span className={styles.rodsPhoto} aria-hidden>
                  <Image src={machineArt} alt="" fill sizes="560px" />
                </span>
              ) : null}
              <WiredBody
                className={styles.rodsArt}
                title={pick(NAGATO_RODS.figureAlt, locale)}
                frameClassName={styles.rodsFrame}
                bodyClassName={styles.rodsShape}
                rodClassName={styles.rodsRod}
                eyeClassName={styles.rodsEye}
              />
            </div>

            <div className={styles.rodsText}>
              <p className={styles.rodsLede}>{pick(NAGATO_RODS.lede, locale)}</p>
              <dl className={styles.rodsNotes}>
                {NAGATO_RODS.notes.map((note) => (
                  <div key={note.key} className={styles.rodsNote}>
                    <dt>{pick(note.title, locale)}</dt>
                    <dd>{pick(note.text, locale)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <p className={styles.rodsHeadline}>
            {pick(NAGATO_RODS.headline, locale)}
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={NAGATO_ID}
                slot="ABILITY"
                abilityName={NAGATO_IMAGE_KEYS.machine}
                label={pick(
                  NAGATO_SLOT_LABELS[NAGATO_IMAGE_KEYS.machine],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 8 · KADER ÇİZELGESİ ════════════════════════════════════════
            Her kayıt bir öncekinden biraz daha içeride: çizelge inerken
            sayfa da batıyor. Madde işaretindeki Rinnegan halkası her
            adımda bir halka daha açılıyor. */}
        <section className={styles.section} aria-labelledby="nag-fate">
          <header className={styles.sectionHead}>
            <h2 id="nag-fate" className={styles.sectionTitle}>
              {pick(NAGATO_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(NAGATO_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {NAGATO_TIMELINE.map((entry, index) => {
              const art = src(entry.imageKey);
              return (
                <li key={entry.key} className={styles.fateItem} data-i={index}>
                  <span className={styles.fateRing} aria-hidden>
                    <RinneganEye
                      rings={index + 1}
                      className={styles.fateRingArt}
                      ringClassName={styles.fateRingRing}
                      coreClassName={styles.fateRingCore}
                    />
                  </span>
                  <p className={styles.fateEra}>{pick(entry.era, locale)}</p>
                  <h3 className={styles.fateTitle}>
                    {pick(entry.title, locale)}
                  </h3>
                  <p className={styles.fateText}>{pick(entry.text, locale)}</p>
                  {entry.quote ? (
                    <figure className={styles.fateQuote}>
                      <blockquote>
                        &ldquo;{pick(entry.quote.text, locale)}&rdquo;
                      </blockquote>
                      <figcaption>{pick(entry.quote.by, locale)}</figcaption>
                    </figure>
                  ) : null}
                  <span className={styles.fateArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="560px" /> : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={NAGATO_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(NAGATO_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 9 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="nag-closing">
          <h2 id="nag-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          {NAGATO_CLOSING.quotes.map((quote) => (
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
            {NAGATO_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(NAGATO_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(NAGATO_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(NAGATO_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={NAGATO_ID}
                slot="ABILITY"
                abilityName={NAGATO_IMAGE_KEYS.closing}
                label={pick(
                  NAGATO_SLOT_LABELS[NAGATO_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </RainShell>
  );
}
