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
  KONAN_ALT,
  KONAN_ANGEL_TEXT,
  KONAN_CLOSING,
  KONAN_COUNT,
  KONAN_CRUMB,
  KONAN_FOLD_UI,
  KONAN_FOLDS,
  KONAN_FORMS,
  KONAN_HANDS,
  KONAN_HERO,
  KONAN_ID,
  KONAN_IDENTITY,
  KONAN_IMAGE_KEYS,
  KONAN_NAMES,
  KONAN_SECTIONS,
  KONAN_SITE_URL,
  KONAN_SLOT_LABELS,
  KONAN_TIMELINE,
} from "@/lib/characters/konan-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { PaperShell } from "./PaperShell";
import { FoldTable } from "./FoldTable";
import { PaperFall, PaperFlower, TagField } from "./PaperGlyphs";
import styles from "./KonanExperience.module.css";

/**
 * Konan — "Kâğıt Melek" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/3179 bu bileşene dallanır
 * (rota dosyasındaki `EXPERIENCES` haritası). Sayfanın fikri tek kelime:
 * KATLAMA. Düzen bir kâğıdın üstüne kurulu — bölümler kap değil kat, ve
 * sayfanın kalbinde bir yaprak sırayla açılıyor. İki görsel çapa var:
 * hero'daki kâğıt çiçek ve altı yüz milyarlık sayı bandı.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   PaperShell — "Melek" modu + katlama adımı (kök nitelikleri, zemin)
 *   FoldTable  — beş katlık masa (dikey sekme + klavye + katlama şeması)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 3179 kaydının ABILITY yuvaları (`konan:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 */
export function KonanExperience({
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
  const heroScene = src(KONAN_IMAGE_KEYS.hero);
  const countScene = src(KONAN_IMAGE_KEYS.count);
  const closingArt = src(KONAN_IMAGE_KEYS.closing);

  const name = detail.character.name || KONAN_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? KONAN_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? KONAN_SITE_URL;

  const folds = KONAN_FOLDS.map((step) => ({
    key: step.key,
    kanji: step.kanji,
    kind: step.foldKind,
    kindLabel: pick(KONAN_FOLD_UI.kinds[step.foldKind], locale),
    era: pick(step.era, locale),
    title: pick(step.title, locale),
    text: pick(step.text, locale),
    image: src(step.imageKey),
  }));

  const separator = pick(KONAN_COUNT.separator, locale);

  return (
    <PaperShell
      enterLabel={pick(KONAN_ANGEL_TEXT.enter, locale)}
      exitLabel={pick(KONAN_ANGEL_TEXT.exit, locale)}
      hint={pick(KONAN_ANGEL_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(KONAN_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — KÂĞIT ÇİÇEK ══════════════════════════════════════
            Portre dar bir kolonda; çiçek portrenin üst köşesinden taşıyor
            ve sayfanın imzası o. Arkada düşen yapraklar, üstünde 紙. */}
        <section className={styles.hero} aria-labelledby="knn-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <PaperFall
            className={styles.heroFall}
            pieceClassName={styles.heroScrap}
          />

          <p className={styles.heroMark} aria-hidden>
            {KONAN_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroTitle}>
              {pick(KONAN_IDENTITY.title, locale)}
            </p>
            <h1 id="knn-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(KONAN_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(KONAN_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            <span className={styles.heroFrame}>
              {portrait ? (
                <span className={styles.heroPortrait}>
                  <Image
                    src={portrait}
                    alt={pick(
                      portraitUploaded
                        ? KONAN_HERO.portraitAlt
                        : KONAN_HERO.portraitAltFallback,
                      locale,
                    )}
                    fill
                    sizes="340px"
                    priority
                    unoptimized={!portraitUploaded}
                  />
                </span>
              ) : null}
              {/* Çiçek portrenin üst köşesinden taşar: portre yoksa da
                  kadrajın imzası olarak yerinde kalır */}
              <PaperFlower
                className={styles.heroFlower}
                petalClassName={styles.petal}
                shadeClassName={styles.petalShade}
                creaseClassName={styles.petalCrease}
                coreClassName={styles.petalCore}
              />
            </span>
            <p className={styles.heroCaption}>
              {pick(KONAN_HERO.flowerCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KONAN_ID}
                slot="ABILITY"
                abilityName={KONAN_IMAGE_KEYS.hero}
                label={pick(KONAN_SLOT_LABELS[KONAN_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="knn-identity">
          <header className={styles.sectionHead}>
            <h2 id="knn-identity" className={styles.sectionTitle}>
              {pick(KONAN_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KONAN_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {KONAN_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · KÂĞIDIN ÜÇ HÂLİ — üç büyük ═════════════════════════════ */}
        <section className={styles.section} aria-labelledby="knn-forms">
          <header className={styles.sectionHead}>
            <h2 id="knn-forms" className={styles.sectionTitle}>
              {pick(KONAN_SECTIONS.forms.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KONAN_SECTIONS.forms.lede, locale)}
            </p>
          </header>
          <ul className={styles.forms}>
            {KONAN_FORMS.map((form) => {
              const art = src(form.imageKey);
              return (
                <li key={form.key} className={styles.form}>
                  <span className={styles.formArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="720px" /> : null}
                  </span>
                  <span className={styles.formKanji} aria-hidden>
                    {form.kanji}
                  </span>
                  <span className={styles.formBody}>
                    <span className={styles.formName}>{form.name}</span>
                    <span className={styles.formTurkish}>
                      {pick(form.turkish, locale)}
                    </span>
                    <span className={styles.formTagline}>
                      {pick(form.tagline, locale)}
                    </span>
                    <span className={styles.formText}>
                      {pick(form.text, locale)}
                    </span>
                    <span className={styles.formTraits}>
                      {form.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KONAN_ID}
                      slot="ABILITY"
                      abilityName={form.imageKey}
                      label={pick(KONAN_SLOT_LABELS[form.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · ELİNDEKİ DÖRT ŞEY — dört küçük ═════════════════════════ */}
        <section className={styles.section} aria-labelledby="knn-hands">
          <header className={styles.sectionHead}>
            <h2 id="knn-hands" className={styles.sectionTitle}>
              {pick(KONAN_SECTIONS.hands.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KONAN_SECTIONS.hands.lede, locale)}
            </p>
          </header>
          <ul className={styles.hands}>
            {KONAN_HANDS.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.hand}>
                  <span className={styles.handArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="480px" /> : null}
                  </span>
                  <span className={styles.handKanji} aria-hidden>
                    {item.kanji}
                  </span>
                  <span className={styles.handName}>
                    {pick(item.name, locale)}
                  </span>
                  <span className={styles.handNote}>
                    {pick(item.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KONAN_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(KONAN_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · DÖRT İSİM ══════════════════════════════════════════════
            Portreler köşesi katlanmış bir kâğıda kırpılı; katlanan köşe
            ayrı bir üçgen olarak duruyor. Kaybettiği isimlerin katı sola,
            karşısındakininki sağa bakıyor. */}
        <section className={styles.section} aria-labelledby="knn-names">
          <header className={styles.sectionHead}>
            <h2 id="knn-names" className={styles.sectionTitle}>
              {pick(KONAN_SECTIONS.names.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KONAN_SECTIONS.names.lede, locale)}
            </p>
          </header>
          <ul className={styles.names}>
            {KONAN_NAMES.map((person) => {
              const face = faces.get(person.characterId) ?? null;
              return (
                <li
                  key={person.characterId}
                  className={styles.person}
                  data-side={person.side}
                >
                  <span className={styles.personArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${person.name} ${pick(KONAN_ALT.companionSuffix, locale)}`}
                        fill
                        sizes="240px"
                      />
                    ) : null}
                    <span className={styles.personFlap} aria-hidden />
                  </span>
                  <span className={styles.personBody}>
                    <span className={styles.personRole}>
                      {pick(person.role, locale)}
                    </span>
                    <span className={styles.personName}>{person.name}</span>
                    <span className={styles.personNote}>
                      {pick(person.note, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · KATLAMA MASASI — SAYFANIN KALBİ ════════════════════════ */}
        <section className={styles.foldSection} aria-labelledby="knn-fold">
          <header className={styles.sectionHead}>
            <h2 id="knn-fold" className={styles.sectionTitle}>
              {pick(KONAN_SECTIONS.fold.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KONAN_SECTIONS.fold.lede, locale)}
            </p>
          </header>
          <FoldTable
            folds={folds}
            listLabel={pick(KONAN_FOLD_UI.listLabel, locale)}
            foldWord={pick(KONAN_FOLD_UI.foldWord, locale)}
            prevLabel={pick(KONAN_FOLD_UI.prev, locale)}
            nextLabel={pick(KONAN_FOLD_UI.next, locale)}
            eraLabel={pick(KONAN_FOLD_UI.eraLabel, locale)}
            keyboardHint={pick(KONAN_FOLD_UI.keyboardHint, locale)}
            sheetAlt={pick(KONAN_FOLD_UI.sheetAlt, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {KONAN_FOLDS.map((step) => (
                <CuratorSlot
                  key={step.imageKey}
                  characterId={KONAN_ID}
                  slot="ABILITY"
                  abilityName={step.imageKey}
                  label={pick(KONAN_SLOT_LABELS[step.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 7 · ALTI YÜZ MİLYAR — sayfanın görsel çapası ═══════════════
            Rakamlar grup grup çiziliyor: 360 pikselde iki satıra iner,
            hiçbir yerde yatay taşma olmaz. Ekran okuyucuya rakam değil,
            başlığın kendisi iniyor. */}
        <section className={styles.count} aria-labelledby="knn-count">
          {countScene ? (
            <span className={styles.countScene} aria-hidden>
              <Image src={countScene} alt="" fill sizes="1600px" />
            </span>
          ) : null}
          <TagField className={styles.countTags} tagClassName={styles.countTag} />

          <h2 id="knn-count" className={styles.countHeading}>
            {pick(KONAN_SECTIONS.count.title, locale)}
          </h2>
          <p className={styles.countKanji} aria-hidden>
            {KONAN_COUNT.kanji}
          </p>
          {/* Rakamlar tamamen dekoratif: sayının kendisi zaten başlıkta
              KELİMEYLE yazılı ("Altı yüz milyar"). Ekran okuyucuya
              "600.000.000.000" dizesini okutmak bir kazanç değil, gürültü
              olurdu — ayraçlar tek tek seslendirilir. */}
          <p className={styles.countNumber} aria-hidden>
            {KONAN_COUNT.groups.map((group, index) => (
              <span key={group + String(index)} className={styles.countGroup}>
                {index > 0 ? (
                  <span className={styles.countSep}>{separator}</span>
                ) : null}
                <span className={styles.countDigits}>{group}</span>
              </span>
            ))}
          </p>
          <p className={styles.visuallyHidden}>
            {pick(KONAN_COUNT.spoken, locale)}
          </p>
          <p className={styles.countLede}>{pick(KONAN_COUNT.lede, locale)}</p>

          <dl className={styles.measures}>
            {KONAN_COUNT.measures.map((measure) => (
              <div key={measure.value.tr} className={styles.measure}>
                <dt>{pick(measure.value, locale)}</dt>
                <dd>{pick(measure.note, locale)}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.countClosing}>
            {pick(KONAN_COUNT.closingLine, locale)}
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KONAN_ID}
                slot="ABILITY"
                abilityName={KONAN_IMAGE_KEYS.count}
                label={pick(KONAN_SLOT_LABELS[KONAN_IMAGE_KEYS.count], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 8 · KADER ÇİZELGESİ ════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="knn-fate">
          <header className={styles.sectionHead}>
            <h2 id="knn-fate" className={styles.sectionTitle}>
              {pick(KONAN_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KONAN_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {KONAN_TIMELINE.map((entry) => {
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
                        <figcaption>{pick(entry.quote.by, locale)}</figcaption>
                      </figure>
                    ) : null}
                  </div>
                  <span className={styles.fateArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="560px" /> : null}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KONAN_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(KONAN_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 9 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="knn-closing">
          <h2 id="knn-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          {KONAN_CLOSING.quotes.map((quote) => (
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
            {KONAN_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(KONAN_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(KONAN_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(KONAN_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KONAN_ID}
                slot="ABILITY"
                abilityName={KONAN_IMAGE_KEYS.closing}
                label={pick(
                  KONAN_SLOT_LABELS[KONAN_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </PaperShell>
  );
}
