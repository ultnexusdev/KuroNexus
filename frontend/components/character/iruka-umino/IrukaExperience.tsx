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
  IRUKA_ALT,
  IRUKA_BOARD_UI,
  IRUKA_CLOSING,
  IRUKA_CRAFT,
  IRUKA_CRUMB,
  IRUKA_DESKS,
  IRUKA_DISMISS_TEXT,
  IRUKA_DRAWER,
  IRUKA_HERO,
  IRUKA_ICHIRAKU,
  IRUKA_ID,
  IRUKA_IDENTITY,
  IRUKA_IMAGE_KEYS,
  IRUKA_LESSONS,
  IRUKA_SECTIONS,
  IRUKA_SITE_URL,
  IRUKA_SLOT_LABELS,
  IRUKA_TIMELINE,
} from "@/lib/characters/iruka-umino-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { ClassroomShell } from "./ClassroomShell";
import { Blackboard } from "./Blackboard";
import { ChalkDust, RamenBowls, ScarLine } from "./ChalkGlyphs";
import styles from "./IrukaExperience.module.css";

/**
 * Iruka Umino — "Sınıf Defteri" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/2011 bu bileşene dallanır
 * (rota dosyasındaki `EXPERIENCES` haritası). Sayfanın fikri tek cümle:
 * TANIMA. Yirmi iki karakter sayfasının en sıcak, en sakin olanı — burada
 * dövüş yok, bir oda var. Bütün düzen bir yoklama defterinin çizgilerine
 * oturuyor ve soldaki kırmızı kenar çizgisiyle burnundaki yara aynı token.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   ClassroomShell — "Ders bitti" modu (tek boolean, etkinin tamamı CSS'te)
 *   Blackboard     — beş ders (tebeşir çizimi + klavye gezinmesi)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 2011 kaydının ABILITY yuvaları (`iruka:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 * Kapak portresi AniList'ten geliyor (~230 px), bu yüzden dar kadrajda ve
 * küçük kutuda duruyor: BRIEF §3.1 gereği büyütülüp yayılmıyor.
 */
export function IrukaExperience({
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
  const heroScene = src(IRUKA_IMAGE_KEYS.hero);
  const classroomScene = src(IRUKA_IMAGE_KEYS.classroom);
  const counterScene = src(IRUKA_IMAGE_KEYS.counter);
  const closingArt = src(IRUKA_IMAGE_KEYS.closing);

  const name = detail.character.name || IRUKA_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? IRUKA_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? IRUKA_SITE_URL;

  const lessons = IRUKA_LESSONS.map((lesson) => ({
    key: lesson.key,
    chalk: pick(lesson.chalk, locale),
    taught: pick(lesson.taught, locale),
    real: pick(lesson.real, locale),
    glyphAlt: pick(lesson.glyphAlt, locale),
    blank: lesson.blank === true,
  }));

  return (
    <ClassroomShell
      enterLabel={pick(IRUKA_DISMISS_TEXT.enter, locale)}
      exitLabel={pick(IRUKA_DISMISS_TEXT.exit, locale)}
      hint={pick(IRUKA_DISMISS_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(IRUKA_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — AKŞAM IŞIĞINDA BİR ODA ══════════════════════════
            Portre küçük ve dar kadrajlı (AniList kaynağı ~230 px). Yara
            çizgisi portrenin ÜSTÜNDEN geçiyor ve kadrajın dışına taşıyor:
            sayfanın kenar çizgisiyle aynı hatta. */}
        <section className={styles.hero} aria-labelledby="iru-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <ChalkDust className={styles.heroDust} moteClassName={styles.mote} />

          <p className={styles.heroMark} aria-hidden>
            {IRUKA_IDENTITY.watermark}
          </p>

          <div className={styles.heroPlate}>
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? IRUKA_HERO.portraitAlt
                      : IRUKA_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="260px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              </span>
            ) : null}
            {/* Yara: portrenin üstünden geçen tek hamle. Portre yoksa da
                çizilir — kadrajın yerini o çizgi tutuyor. */}
            <ScarLine
              className={styles.heroScar}
              strokeClassName={styles.scarStroke}
            />
          </div>

          <div className={styles.heroBody}>
            <h1 id="iru-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroPost}>
              {pick(IRUKA_IDENTITY.post, locale)}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(IRUKA_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(IRUKA_HERO.lede, locale)}</p>
            <p className={styles.heroScarNote}>
              {pick(IRUKA_HERO.scarCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={IRUKA_ID}
                slot="ABILITY"
                abilityName={IRUKA_IMAGE_KEYS.hero}
                label={pick(IRUKA_SLOT_LABELS[IRUKA_IMAGE_KEYS.hero], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE — DEFTERİN İLK SAYFASI ═══════════════════════════ */}
        <section className={styles.section} aria-labelledby="iru-identity">
          <header className={styles.sectionHead}>
            <h2 id="iru-identity" className={styles.sectionTitle}>
              {pick(IRUKA_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(IRUKA_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {IRUKA_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · SIRALAR ════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="iru-desks">
          <header className={styles.sectionHead}>
            <h2 id="iru-desks" className={styles.sectionTitle}>
              {pick(IRUKA_SECTIONS.desks.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(IRUKA_SECTIONS.desks.lede, locale)}
            </p>
          </header>
          <ul className={styles.desks}>
            {IRUKA_DESKS.map((desk) => {
              const face = faces.get(desk.characterId) ?? null;
              return (
                <li
                  key={desk.characterId}
                  className={styles.desk}
                  data-seat={desk.seat}
                >
                  <span className={styles.deskArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${desk.name} ${pick(IRUKA_ALT.deskSuffix, locale)}`}
                        fill
                        sizes="220px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.deskBody}>
                    <span className={styles.deskRow}>
                      {pick(desk.row, locale)}
                    </span>
                    <span className={styles.deskName}>{desk.name}</span>
                    <span className={styles.deskNote}>
                      {pick(desk.note, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · DERS PROGRAMI — ÜÇ BÜYÜK ═══════════════════════════════ */}
        <section className={styles.section} aria-labelledby="iru-craft">
          <header className={styles.sectionHead}>
            <h2 id="iru-craft" className={styles.sectionTitle}>
              {pick(IRUKA_SECTIONS.craft.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(IRUKA_SECTIONS.craft.lede, locale)}
            </p>
          </header>
          <ul className={styles.crafts}>
            {IRUKA_CRAFT.map((entry) => {
              const key = IRUKA_IMAGE_KEYS[entry.key];
              const art = src(key);
              return (
                <li key={entry.key} className={styles.craft}>
                  <span className={styles.craftArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="720px" /> : null}
                  </span>
                  <span className={styles.craftKanji} aria-hidden>
                    {entry.kanji}
                  </span>
                  <span className={styles.craftBody}>
                    <span className={styles.craftName}>{entry.name}</span>
                    <span className={styles.craftTurkish}>
                      {pick(entry.turkish, locale)}
                    </span>
                    <span className={styles.craftTagline}>
                      {pick(entry.tagline, locale)}
                    </span>
                    <span className={styles.craftText}>
                      {pick(entry.text, locale)}
                    </span>
                    <span className={styles.craftTraits}>
                      {entry.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={IRUKA_ID}
                      slot="ABILITY"
                      abilityName={key}
                      label={pick(IRUKA_SLOT_LABELS[key], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · ÇEKMECE — DÖRT KÜÇÜK ═══════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="iru-drawer">
          <header className={styles.sectionHead}>
            <h2 id="iru-drawer" className={styles.sectionTitle}>
              {pick(IRUKA_SECTIONS.drawer.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(IRUKA_SECTIONS.drawer.lede, locale)}
            </p>
          </header>
          <ul className={styles.drawer}>
            {IRUKA_DRAWER.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.drawerItem}>
                  <span className={styles.drawerArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="480px" /> : null}
                  </span>
                  <span className={styles.drawerName}>
                    {pick(item.name, locale)}
                  </span>
                  <span className={styles.drawerNote}>
                    {pick(item.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={IRUKA_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(IRUKA_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · KARA TAHTA — SAYFANIN KALBİ ════════════════════════════ */}
        <section className={styles.boardSection} aria-labelledby="iru-board">
          {classroomScene ? (
            <span className={styles.boardScene} aria-hidden>
              <Image src={classroomScene} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          <header className={styles.sectionHead}>
            <h2 id="iru-board" className={styles.sectionTitle}>
              {pick(IRUKA_SECTIONS.board.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(IRUKA_SECTIONS.board.lede, locale)}
            </p>
          </header>
          <Blackboard
            lessons={lessons}
            listLabel={pick(IRUKA_BOARD_UI.listLabel, locale)}
            lessonWord={pick(IRUKA_BOARD_UI.lessonWord, locale)}
            taughtLabel={pick(IRUKA_BOARD_UI.taughtLabel, locale)}
            realLabel={pick(IRUKA_BOARD_UI.realLabel, locale)}
            prevLabel={pick(IRUKA_BOARD_UI.prev, locale)}
            nextLabel={pick(IRUKA_BOARD_UI.next, locale)}
            keyboardHint={pick(IRUKA_BOARD_UI.keyboardHint, locale)}
            blankRowLabel={pick(IRUKA_BOARD_UI.blankRow, locale)}
            trayLabel={pick(IRUKA_BOARD_UI.trayLabel, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={IRUKA_ID}
                slot="ABILITY"
                abilityName={IRUKA_IMAGE_KEYS.classroom}
                label={pick(
                  IRUKA_SLOT_LABELS[IRUKA_IMAGE_KEYS.classroom],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 7 · ICHIRAKU MASASI ════════════════════════════════════════
            Sayfanın duygusal merkezi ve bilerek en küçük bölümü: iki kâse,
            iki cümle. Uzatmak bozardı. */}
        <section className={styles.counter} aria-labelledby="iru-ichiraku">
          {counterScene ? (
            <span className={styles.counterScene} aria-hidden>
              <Image src={counterScene} alt="" fill sizes="1200px" />
            </span>
          ) : null}
          <header className={styles.sectionHead}>
            <h2 id="iru-ichiraku" className={styles.sectionTitle}>
              {pick(IRUKA_SECTIONS.ichiraku.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(IRUKA_SECTIONS.ichiraku.lede, locale)}
            </p>
          </header>

          <RamenBowls
            className={styles.bowls}
            steamClassName={styles.steam}
            title={pick(IRUKA_ICHIRAKU.bowlAlt, locale)}
          />
          <p className={styles.bowlCaption}>
            {pick(IRUKA_ICHIRAKU.caption, locale)}
          </p>

          <ul className={styles.lines}>
            {IRUKA_ICHIRAKU.bowls.map((bowl) => (
              <li key={bowl.key} className={styles.line}>
                <span className={styles.lineWho}>{pick(bowl.who, locale)}</span>
                <span className={styles.lineText}>{pick(bowl.line, locale)}</span>
                <span className={styles.lineNote}>{pick(bowl.note, locale)}</span>
              </li>
            ))}
          </ul>

          <p className={styles.counterClose}>
            {pick(IRUKA_ICHIRAKU.close, locale)}
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={IRUKA_ID}
                slot="ABILITY"
                abilityName={IRUKA_IMAGE_KEYS.counter}
                label={pick(IRUKA_SLOT_LABELS[IRUKA_IMAGE_KEYS.counter], locale)}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 8 · BEŞ SATIRLIK YOKLAMA ═══════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="iru-fate">
          <header className={styles.sectionHead}>
            <h2 id="iru-fate" className={styles.sectionTitle}>
              {pick(IRUKA_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(IRUKA_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {IRUKA_TIMELINE.map((entry) => {
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
                      characterId={IRUKA_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(IRUKA_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 9 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="iru-closing">
          <h2 id="iru-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          {IRUKA_CLOSING.quotes.map((quote) => (
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
            {IRUKA_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(IRUKA_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(IRUKA_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(IRUKA_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={IRUKA_ID}
                slot="ABILITY"
                abilityName={IRUKA_IMAGE_KEYS.closing}
                label={pick(IRUKA_SLOT_LABELS[IRUKA_IMAGE_KEYS.closing], locale)}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </ClassroomShell>
  );
}
