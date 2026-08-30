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
  EREN_ALT,
  EREN_BEYOND_TEXT,
  EREN_BONDS,
  EREN_CLOSING,
  EREN_CRUMB,
  EREN_GAPS,
  EREN_GEAR,
  EREN_HERO,
  EREN_ID,
  EREN_IDENTITY,
  EREN_IMAGE_KEYS,
  EREN_MARCH,
  EREN_MARCH_UI,
  EREN_MISSING_NOTE,
  EREN_PORTRAIT,
  EREN_PORTRAIT_SLOT_KEY,
  EREN_SECTIONS,
  EREN_SITE_URL,
  EREN_SLOT_LABELS,
  EREN_SLOT_SPECS,
  EREN_TIMELINE,
  EREN_TITANS,
} from "@/lib/characters/eren-yeager-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { CuratorGaps, type CuratorGapRow } from "@/components/character/CuratorGaps";
import { BeyondShell } from "./BeyondShell";
import { MarchWalk } from "./MarchWalk";
import { BasementKey, HorizonMark } from "./ErenGlyphs";
import styles from "./RumblingExperience.module.css";

/**
 * Eren Yeager — "Yer Gürültüsü" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/40882 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: ÖZGÜRLÜK VE YIKIM AYNI
 * HAREKETİN İKİ ADI.
 *
 * ── IZGARA: UFUK BANDI ───────────────────────────────────────────────────
 * Sayfa ne tek kolon ne iki kolon. Her bölüm bir BANT ve her bandın içinde,
 * hep aynı yükseklikte, yatay bir "duvar üstü" çizgisi var. Bölümler
 * dönüşümlü olarak o çizginin ÜSTÜNDE (`data-side="above"`) ve ALTINDA
 * (`data-side="below"`) duruyor; sayfayı aşağı kaydırırken çizgi hep aynı
 * yerde tekrar ediyor, içerik ise onun etrafında yer değiştiriyor. Bir
 * manzara değil bir SINIR — duvarın üstü tam olarak budur.
 *
 * ── SUNUCU / İSTEMCİ ─────────────────────────────────────────────────────
 * Sayfa SUNUCUDA çizilir. İki istemci adası var (üst sınır üç):
 *   BeyondShell — "duvarın ardı" modu; etkisi ölçü (`--ern-measure`,
 *                 `--ern-sky`, `--ern-cols`), yalnızca renk değil
 *   MarchWalk   — yürüyüş; sayfanın kalbi
 * `ErenGlyphs` ada DEĞİL: durumu yok, yalnızca elle çizilmiş SVG taşıyor.
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * ── GÖRSELLER ────────────────────────────────────────────────────────────
 * Portre depoda (`kaynak.json`): 230×345, yani küçük — madalyon boyunda
 * kullanılıyor, hero olarak DEĞİL. Büyük ufuk karesi `ern:hero` yuvasında
 * bekliyor. Sahne görselleri characterId 40882 kaydının ABILITY yuvalarında
 * (`ern:*`); hiçbiri zorunlu değil, yoksa kadraj boş ama ayakta kalıyor.
 */
export function RumblingExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;

  /* Portre: küratör bir kare yüklediyse o, yoksa DEPODAKİ dosya.
     AniList CDN'ine hotlink YOK (Faz 2 §3) — bu yüzden
     `primaryPortrait` yalnızca yükleme varken okunuyor. */
  const portraitUploaded = isUploadedPortrait(detail);
  const uploadedPortrait = portraitUploaded ? primaryPortrait(detail) : null;
  const portraitSrc = uploadedPortrait ?? EREN_PORTRAIT.src;

  const heroScene = src(EREN_IMAGE_KEYS.hero);
  const marchScene = src(EREN_IMAGE_KEYS.march);
  const trioScene = src(EREN_IMAGE_KEYS.trio);
  const closingScene = src(EREN_IMAGE_KEYS.closing);

  const name = detail.character.name || EREN_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? EREN_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? EREN_SITE_URL;
  const companionSuffix = pick(EREN_ALT.companionSuffix, locale);

  const marchSteps = EREN_MARCH.map((entry) => ({
    key: entry.key,
    kanji: entry.kanji,
    numeral: entry.numeral,
    count: pick(entry.count, locale),
    tileW: entry.tileW,
    tileH: entry.tileH,
    measure: entry.measure,
    title: pick(entry.title, locale),
    text: pick(entry.text, locale),
  }));

  /* Küratör özeti: yuvaların hepsi, sayfadaki sırayla. Portre satırı
     ABILITY değil PORTRAIT yuvasına bakıyor — `filled` ölçüsü de o yüzden
     `ability.has(...)` değil `portraitUploaded`. */
  const gapKeys = [
    EREN_IMAGE_KEYS.hero,
    EREN_IMAGE_KEYS.attack,
    EREN_IMAGE_KEYS.founding,
    EREN_IMAGE_KEYS.warhammer,
    EREN_IMAGE_KEYS.gearOdm,
    EREN_IMAGE_KEYS.gearHarden,
    EREN_IMAGE_KEYS.gearPaths,
    EREN_IMAGE_KEYS.gearCurse,
    EREN_IMAGE_KEYS.march,
    EREN_IMAGE_KEYS.fateWall,
    EREN_IMAGE_KEYS.fateTrost,
    EREN_IMAGE_KEYS.fateBasement,
    EREN_IMAGE_KEYS.fateLiberio,
    EREN_IMAGE_KEYS.fateRumbling,
    EREN_IMAGE_KEYS.trio,
    EREN_IMAGE_KEYS.closing,
  ];
  const gapRows: CuratorGapRow[] = [
    {
      key: EREN_PORTRAIT_SLOT_KEY,
      label: pick(EREN_SLOT_LABELS[EREN_PORTRAIT_SLOT_KEY], locale),
      spec: pick(EREN_SLOT_SPECS[EREN_PORTRAIT_SLOT_KEY], locale),
      filled: portraitUploaded,
    },
    ...gapKeys.map((key) => ({
      key,
      label: pick(EREN_SLOT_LABELS[key], locale),
      spec: pick(EREN_SLOT_SPECS[key], locale),
      filled: ability.has(key),
    })),
  ];

  return (
    <BeyondShell
      toSea={pick(EREN_BEYOND_TEXT.toSea, locale)}
      toWall={pick(EREN_BEYOND_TEXT.toWall, locale)}
      stateWall={pick(EREN_BEYOND_TEXT.stateWall, locale)}
      stateSea={pick(EREN_BEYOND_TEXT.stateSea, locale)}
      hintWall={pick(EREN_BEYOND_TEXT.hintWall, locale)}
      hintSea={pick(EREN_BEYOND_TEXT.hintSea, locale)}
      label={pick(EREN_BEYOND_TEXT.label, locale)}
      watermark={EREN_IDENTITY.watermark}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <span className={styles.crumbHere}>
            {pick(EREN_CRUMB.series, locale)}
          </span>
        </nav>

        {/* ══ 1 · HERO — ufkun ÜSTÜNDE ═══════════════════════════════════
            Portre madalyon boyunda (230×345 küçük bir kare); büyük ufuk
            karesi altta, küratör yuvası olarak. */}
        <section className={styles.band} data-side="above" aria-labelledby="ern-name">
          <span className={styles.horizonLine} aria-hidden>
            <HorizonMark className={styles.horizonMark} />
          </span>

          <div className={styles.heroTop}>
            <div className={styles.heroText}>
              <p className={styles.heroHouse}>
                {pick(EREN_IDENTITY.house, locale)}
              </p>
              <h1 id="ern-name" className={styles.heroName}>
                {name}
              </h1>
              <p className={styles.heroNative} aria-hidden>
                {nativeName}
              </p>
              <p className={styles.heroEpigraph}>
                {pick(EREN_IDENTITY.epigraph, locale)}
              </p>
            </div>

            <div className={styles.heroPortraitCol}>
              <span className={styles.portraitFrame}>
                <Image
                  className={styles.portraitImage}
                  src={portraitSrc}
                  alt={pick(
                    portraitUploaded
                      ? EREN_ALT.portraitUploaded
                      : EREN_ALT.portraitLocal,
                    locale,
                  )}
                  width={EREN_PORTRAIT.w}
                  height={EREN_PORTRAIT.h}
                  priority
                />
              </span>
              {isAdmin ? (
                <CuratorSlot
                  characterId={EREN_ID}
                  slot="PORTRAIT"
                  label={pick(EREN_SLOT_LABELS[EREN_PORTRAIT_SLOT_KEY], locale)}
                  size={{ w: 1200, h: 1600 }}
                />
              ) : null}
            </div>
          </div>

          <p className={styles.heroLede}>{pick(EREN_HERO.lede, locale)}</p>

          {/* Büyük ufuk karesi — boşken de duruyor */}
          <div className={styles.heroPlate} data-filled={heroScene ? "true" : "false"}>
            {heroScene ? (
              <Image
                className={styles.heroPlateImage}
                src={heroScene}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 1180px"
              />
            ) : null}
            <span className={styles.heroPlateEdge} aria-hidden />
          </div>
          {isAdmin ? (
            <CuratorSlot
              characterId={EREN_ID}
              slot="ABILITY"
              abilityName={EREN_IMAGE_KEYS.hero}
              label={pick(EREN_SLOT_LABELS[EREN_IMAGE_KEYS.hero], locale)}
              size={{ w: 1920, h: 1080 }}
            />
          ) : null}
          <p className={styles.plateCaption}>
            {pick(EREN_HERO.heroFrameCaption, locale)}
          </p>

          <p className={styles.horizonCaption}>
            {pick(EREN_HERO.horizonCaption, locale)}
          </p>
        </section>

        {/* ══ 2 · KÜNYE — ufkun ALTINDA ══════════════════════════════════ */}
        <section className={styles.band} data-side="below" aria-labelledby="ern-dossier">
          <span className={styles.horizonLine} aria-hidden />
          <header className={styles.bandHead}>
            <h2 id="ern-dossier" className={styles.bandTitle}>
              {pick(EREN_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(EREN_SECTIONS.identity.lede, locale)}
            </p>
          </header>

          <div className={styles.dossier}>
            <dl className={styles.facts}>
              {EREN_IDENTITY.facts.map((fact) => (
                <div key={fact.label.tr} className={styles.fact}>
                  <dt>{pick(fact.label, locale)}</dt>
                  <dd>{pick(fact.value, locale)}</dd>
                </div>
              ))}
            </dl>
            <BasementKey className={styles.dossierKey} />
          </div>
          <p className={styles.factNote}>{pick(EREN_MISSING_NOTE, locale)}</p>
        </section>

        {/* ══ 3 · ÜÇ TİTAN — ufkun ÜSTÜNDE ═══════════════════════════════ */}
        <section className={styles.band} data-side="above" aria-labelledby="ern-titans">
          <span className={styles.horizonLine} aria-hidden />
          <header className={styles.bandHead}>
            <h2 id="ern-titans" className={styles.bandTitle}>
              {pick(EREN_SECTIONS.titans.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(EREN_SECTIONS.titans.lede, locale)}
            </p>
          </header>

          <ul className={styles.titans}>
            {EREN_TITANS.map((titan) => {
              const scene = src(titan.imageKey);
              return (
                <li key={titan.key} className={styles.titan}>
                  <div
                    className={styles.titanArt}
                    data-filled={scene ? "true" : "false"}
                  >
                    {scene ? (
                      <Image src={scene} alt="" fill sizes="(max-width: 900px) 100vw, 420px" />
                    ) : null}
                    <span className={styles.titanKanji} aria-hidden>
                      {titan.kanji}
                    </span>
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={EREN_ID}
                      slot="ABILITY"
                      abilityName={titan.imageKey}
                      label={pick(EREN_SLOT_LABELS[titan.imageKey], locale)}
                      size={{ w: 1200, h: 900 }}
                    />
                  ) : null}
                  <div className={styles.titanBody}>
                    <p className={styles.titanName}>{titan.name}</p>
                    <p className={styles.titanReading} aria-hidden>
                      {titan.reading}
                    </p>
                    <p className={styles.titanTurkish}>
                      {pick(titan.turkish, locale)}
                    </p>
                    <p className={styles.titanTagline}>
                      {pick(titan.tagline, locale)}
                    </p>
                    <p className={styles.titanText}>{pick(titan.text, locale)}</p>
                    <ul className={styles.titanTraits}>
                      {titan.traits.map((trait) => (
                        <li key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · DÖRT DONANIM — ufkun ALTINDA ═══════════════════════════ */}
        <section className={styles.band} data-side="below" aria-labelledby="ern-gear">
          <span className={styles.horizonLine} aria-hidden />
          <header className={styles.bandHead}>
            <h2 id="ern-gear" className={styles.bandTitle}>
              {pick(EREN_SECTIONS.gear.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(EREN_SECTIONS.gear.lede, locale)}
            </p>
          </header>

          <ul className={styles.gearGrid}>
            {EREN_GEAR.map((item) => {
              const scene = src(item.imageKey);
              return (
                <li key={item.key} className={styles.gear}>
                  <div
                    className={styles.gearArt}
                    data-filled={scene ? "true" : "false"}
                  >
                    {scene ? (
                      <Image src={scene} alt="" fill sizes="(max-width: 700px) 50vw, 260px" />
                    ) : null}
                    <span className={styles.gearKanji} aria-hidden>
                      {item.kanji}
                    </span>
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={EREN_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(EREN_SLOT_LABELS[item.imageKey], locale)}
                      size={{ w: 800, h: 800 }}
                    />
                  ) : null}
                  <p className={styles.gearName}>{pick(item.name, locale)}</p>
                  <p className={styles.gearNote}>{pick(item.note, locale)}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · YÜRÜYÜŞ — sayfanın kalbi, ufkun ÜSTÜNDE ════════════════ */}
        <section className={styles.bandWide} data-side="above" aria-labelledby="ern-march">
          <span className={styles.horizonLine} aria-hidden />
          <header className={styles.bandHead}>
            <h2 id="ern-march" className={styles.bandTitle}>
              {pick(EREN_SECTIONS.march.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(EREN_SECTIONS.march.lede, locale)}
            </p>
          </header>

          <MarchWalk
            steps={marchSteps}
            scene={marchScene}
            sceneAlt=""
            slot={
              isAdmin ? (
                <CuratorSlot
                  characterId={EREN_ID}
                  slot="ABILITY"
                  abilityName={EREN_IMAGE_KEYS.march}
                  label={pick(EREN_SLOT_LABELS[EREN_IMAGE_KEYS.march], locale)}
                  size={{ w: 2100, h: 900 }}
                />
              ) : null
            }
            stageLabel={pick(EREN_MARCH_UI.stageLabel, locale)}
            stepsLabel={pick(EREN_MARCH_UI.stepsLabel, locale)}
            advance={pick(EREN_MARCH_UI.advance, locale)}
            back={pick(EREN_MARCH_UI.back, locale)}
            reset={pick(EREN_MARCH_UI.reset, locale)}
            countLabel={pick(EREN_MARCH_UI.countLabel, locale)}
            wordsLabel={pick(EREN_MARCH_UI.wordsLabel, locale)}
            stepLabel={pick(EREN_MARCH_UI.stepLabel, locale)}
            statusSuffix={pick(EREN_MARCH_UI.status, locale)}
            keyboardHint={pick(EREN_MARCH_UI.keyboardHint, locale)}
            closingNote={pick(EREN_MARCH_UI.closingNote, locale)}
          />
        </section>

        {/* ══ 6 · BEŞ DURAK — ufkun ALTINDA ══════════════════════════════ */}
        <section className={styles.band} data-side="below" aria-labelledby="ern-fate">
          <span className={styles.horizonLine} aria-hidden />
          <header className={styles.bandHead}>
            <h2 id="ern-fate" className={styles.bandTitle}>
              {pick(EREN_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(EREN_SECTIONS.fate.lede, locale)}
            </p>
          </header>

          <ol className={styles.fate}>
            {EREN_TIMELINE.map((entry) => {
              const scene = src(entry.imageKey);
              return (
                <li key={entry.key} className={styles.fateItem} data-side={entry.side}>
                  <p className={styles.fateAge}>{pick(entry.age, locale)}</p>
                  <div className={styles.fateBody}>
                    <h3 className={styles.fateTitle}>
                      {pick(entry.title, locale)}
                    </h3>
                    <p className={styles.fateText}>{pick(entry.text, locale)}</p>
                    {entry.quote ? (
                      <figure className={styles.fateQuote}>
                        <blockquote className={styles.quoteJa} lang="ja">
                          {entry.quote.text}
                        </blockquote>
                        <p className={styles.quoteReading}>
                          {pick(entry.quote.reading, locale)}
                        </p>
                        <figcaption>{pick(entry.quote.by, locale)}</figcaption>
                      </figure>
                    ) : null}
                  </div>
                  <div
                    className={styles.fateArt}
                    data-filled={scene ? "true" : "false"}
                  >
                    {scene ? (
                      <Image src={scene} alt="" fill sizes="(max-width: 900px) 100vw, 520px" />
                    ) : null}
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={EREN_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(EREN_SLOT_LABELS[entry.imageKey], locale)}
                      size={{ w: 1440, h: 810 }}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 7a · ÜÇLÜ VE KAPTAN — nexus bağları ════════════════════════ */}
        <section className={styles.band} data-side="above" aria-labelledby="ern-bonds">
          <span className={styles.horizonLine} aria-hidden />
          <header className={styles.bandHead}>
            <h2 id="ern-bonds" className={styles.bandTitle}>
              {pick(EREN_SECTIONS.bonds.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(EREN_SECTIONS.bonds.lede, locale)}
            </p>
          </header>

          <div className={styles.trioPlate} data-filled={trioScene ? "true" : "false"}>
            {trioScene ? (
              <Image src={trioScene} alt="" fill sizes="(max-width: 900px) 100vw, 1000px" />
            ) : null}
          </div>
          {isAdmin ? (
            <CuratorSlot
              characterId={EREN_ID}
              slot="ABILITY"
              abilityName={EREN_IMAGE_KEYS.trio}
              label={pick(EREN_SLOT_LABELS[EREN_IMAGE_KEYS.trio], locale)}
              size={{ w: 1600, h: 800 }}
            />
          ) : null}

          {/* ⚠️ Yoldaş portreleri BAŞKA karakterlerin kayıtlarından geliyor;
              altlarına yuva konmuyor, çünkü yükleme bu sayfanın kimliğine
              (40882) yazardı. Bu bölümün kendi kadrajı yukarıdaki şerit. */}
          <ul className={styles.bonds}>
            {EREN_BONDS.map((bond) => {
              const face = faces.get(bond.characterId) ?? null;
              const linked = isExperienceCharacter(bond.characterId);
              return (
                <li key={bond.characterId} className={styles.bond}>
                  <span className={styles.bondFace} data-filled={face ? "true" : "false"}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${bond.name} ${companionSuffix}`}
                        fill
                        sizes="112px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.bondBody}>
                    <span className={styles.bondRole}>{pick(bond.role, locale)}</span>
                    <span className={styles.bondName}>
                      {linked ? (
                        <Link href={animeHref.character(bond.characterId)}>
                          {bond.name}
                        </Link>
                      ) : (
                        bond.name
                      )}
                    </span>
                    <span className={styles.bondNative} aria-hidden>
                      {bond.nativeName}
                    </span>
                    <span className={styles.bondNote}>{pick(bond.note, locale)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 7b · KAPANIŞ — ufkun ALTINDA ═══════════════════════════════ */}
        <section className={styles.band} data-side="below" aria-labelledby="ern-closing">
          <span className={styles.horizonLine} aria-hidden />
          <header className={styles.bandHead}>
            <h2 id="ern-closing" className={styles.bandTitle}>
              {pick(EREN_SECTIONS.closing.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(EREN_SECTIONS.closing.lede, locale)}
            </p>
          </header>

          <div className={styles.closingPlate} data-filled={closingScene ? "true" : "false"}>
            {closingScene ? (
              <Image src={closingScene} alt="" fill sizes="(max-width: 900px) 100vw, 1000px" />
            ) : null}
          </div>
          {isAdmin ? (
            <CuratorSlot
              characterId={EREN_ID}
              slot="ABILITY"
              abilityName={EREN_IMAGE_KEYS.closing}
              label={pick(EREN_SLOT_LABELS[EREN_IMAGE_KEYS.closing], locale)}
              size={{ w: 1600, h: 800 }}
            />
          ) : null}

          <ul className={styles.closingQuotes}>
            {EREN_CLOSING.quotes.map((quote) => (
              <li key={quote.text}>
                <figure className={styles.closingQuote}>
                  <blockquote className={styles.quoteJa} lang="ja">
                    {quote.text}
                  </blockquote>
                  <p className={styles.quoteReading}>
                    {pick(quote.reading, locale)}
                  </p>
                  <figcaption>
                    <span className={styles.quoteBy}>{pick(quote.by, locale)}</span>
                    <span className={styles.quoteNote}>{pick(quote.note, locale)}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <p className={styles.motto} lang="ja" aria-hidden>
            {EREN_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(EREN_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(EREN_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(EREN_CLOSING.creditLink, locale)}
            </a>
          </p>
        </section>

        {/* ══ Küratör özeti — düzenleyicisiz, sayfanın EN ALTINDA ════════ */}
        {isAdmin ? (
          <CuratorGaps
            title={pick(EREN_GAPS.title, locale)}
            emptyLabel={pick(EREN_GAPS.empty, locale)}
            filledLabel={pick(EREN_GAPS.filled, locale)}
            allFilledLabel={pick(EREN_GAPS.allFilled, locale)}
            rows={gapRows}
          />
        ) : null}
      </CuratorFrame>
    </BeyondShell>
  );
}
