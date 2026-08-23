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
  SHIKAMARU_ALT,
  SHIKAMARU_CHAIN_UI,
  SHIKAMARU_CLOSING,
  SHIKAMARU_CRUMB,
  SHIKAMARU_HERO,
  SHIKAMARU_ID,
  SHIKAMARU_IDENTITY,
  SHIKAMARU_IMAGE_KEYS,
  SHIKAMARU_JUTSU,
  SHIKAMARU_MOVES,
  SHIKAMARU_PIECES,
  SHIKAMARU_POUCH,
  SHIKAMARU_SECTIONS,
  SHIKAMARU_SHADOW_TEXT,
  SHIKAMARU_SITE_URL,
  SHIKAMARU_SLOT_LABELS,
  SHIKAMARU_TIMELINE,
} from "@/lib/characters/shikamaru-nara-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { ShadowShell } from "./ShadowShell";
import { MoveChain } from "./MoveChain";
import { SmokePlume } from "./ShadowGlyphs";
import styles from "./ShikamaruExperience.module.css";

/**
 * Shikamaru Nara — "200 Hamlelik Tahta" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/2007 bu bileşene dallanır
 * (rota dosyasındaki `EXPERIENCES` haritası). Sayfanın fikri tek cümle:
 * BOŞLUK. Diğer on iki karakter sayfasına göre burada daha az şey var ve
 * olanlar bir shogi tahtasının karelerine oturuyor; tembellik yazıyla
 * değil negatif alanla anlatılıyor. Sıcak nokta tek: sigaranın koru.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   ShadowShell — "Gölge modu" (tek boolean, etkinin tamamı CSS'te)
 *   MoveChain   — beş hamlelik plan (sekme + klavye + tahta şeması)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 2007 kaydının ABILITY yuvaları (`shikamaru:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 */
export function ShikamaruExperience({
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
  const heroScene = src(SHIKAMARU_IMAGE_KEYS.hero);
  const closingArt = src(SHIKAMARU_IMAGE_KEYS.closing);

  const name = detail.character.name || SHIKAMARU_IDENTITY.name;
  const nativeName =
    detail.character.nameNative ?? SHIKAMARU_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? SHIKAMARU_SITE_URL;

  const moves = SHIKAMARU_MOVES.map((move) => ({
    key: move.key,
    title: pick(move.title, locale),
    read: pick(move.read, locale),
    answer: pick(move.answer, locale),
    image: src(move.imageKey),
  }));

  return (
    <ShadowShell
      enterLabel={pick(SHIKAMARU_SHADOW_TEXT.enter, locale)}
      exitLabel={pick(SHIKAMARU_SHADOW_TEXT.exit, locale)}
      hint={pick(SHIKAMARU_SHADOW_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(SHIKAMARU_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — BOŞ GÖKYÜZÜ ══════════════════════════════════════
            Kadrajın çoğu bilerek boş: portre küçük ve kenarda, metin dar
            bir sütunda. Yükselen duman ve tek kor sağ tarafta. */}
        <section className={styles.hero} aria-labelledby="shk-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <p className={styles.heroMark} aria-hidden>
            {SHIKAMARU_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroClan}>
              {pick(SHIKAMARU_IDENTITY.clan, locale)}
            </p>
            <h1 id="shk-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(SHIKAMARU_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>{pick(SHIKAMARU_HERO.lede, locale)}</p>
          </div>

          <div className={styles.heroAside}>
            {portrait ? (
              <span className={styles.heroPortrait}>
                <Image
                  src={portrait}
                  alt={pick(
                    portraitUploaded
                      ? SHIKAMARU_HERO.portraitAlt
                      : SHIKAMARU_HERO.portraitAltFallback,
                    locale,
                  )}
                  fill
                  sizes="320px"
                  priority
                  unoptimized={!portraitUploaded}
                />
              </span>
            ) : null}
            {/* Duman ve kor: portrenin yanında yükselir, kadrajın üst
                yarısında kaybolur */}
            <span className={styles.smokeWrap} aria-hidden>
              <SmokePlume className={styles.smoke} pathClassName={styles.smokeLine} />
              <span className={styles.ember} />
            </span>
            <p className={styles.emberCaption}>
              {pick(SHIKAMARU_HERO.emberCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={SHIKAMARU_ID}
                slot="ABILITY"
                abilityName={SHIKAMARU_IMAGE_KEYS.hero}
                label={pick(
                  SHIKAMARU_SLOT_LABELS[SHIKAMARU_IMAGE_KEYS.hero],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="shk-identity">
          <header className={styles.sectionHead}>
            <h2 id="shk-identity" className={styles.sectionTitle}>
              {pick(SHIKAMARU_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(SHIKAMARU_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {SHIKAMARU_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · TAHTADAKİ TAŞLAR ═══════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="shk-pieces">
          <header className={styles.sectionHead}>
            <h2 id="shk-pieces" className={styles.sectionTitle}>
              {pick(SHIKAMARU_SECTIONS.pieces.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(SHIKAMARU_SECTIONS.pieces.lede, locale)}
            </p>
          </header>
          <ul className={styles.pieces}>
            {SHIKAMARU_PIECES.map((item) => {
              const face = faces.get(item.characterId) ?? null;
              return (
                <li
                  key={item.characterId}
                  className={styles.piece}
                  data-side={item.side}
                >
                  <span className={styles.pieceArt}>
                    {face ? (
                      <Image
                        src={face}
                        alt={`${item.name} ${pick(SHIKAMARU_ALT.pieceSuffix, locale)}`}
                        fill
                        sizes="220px"
                      />
                    ) : null}
                  </span>
                  <span className={styles.pieceBody}>
                    <span className={styles.pieceRole}>
                      {pick(item.role, locale)}
                    </span>
                    <span className={styles.pieceName}>{item.name}</span>
                    <span className={styles.pieceNote}>
                      {pick(item.note, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · GÖLGENİN ÜÇ BİÇİMİ ═════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="shk-jutsu">
          <header className={styles.sectionHead}>
            <h2 id="shk-jutsu" className={styles.sectionTitle}>
              {pick(SHIKAMARU_SECTIONS.jutsu.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(SHIKAMARU_SECTIONS.jutsu.lede, locale)}
            </p>
          </header>
          <ul className={styles.forms}>
            {SHIKAMARU_JUTSU.map((jutsu) => {
              const key = SHIKAMARU_IMAGE_KEYS[jutsu.key];
              const art = src(key);
              return (
                <li key={jutsu.key} className={styles.form}>
                  <span className={styles.formArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="720px" /> : null}
                  </span>
                  <span className={styles.formKanji} aria-hidden>
                    {jutsu.kanji}
                  </span>
                  <span className={styles.formBody}>
                    <span className={styles.formName}>{jutsu.name}</span>
                    <span className={styles.formTurkish}>
                      {pick(jutsu.turkish, locale)}
                    </span>
                    <span className={styles.formTagline}>
                      {pick(jutsu.tagline, locale)}
                    </span>
                    <span className={styles.formText}>
                      {pick(jutsu.text, locale)}
                    </span>
                    <span className={styles.formTraits}>
                      {jutsu.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={SHIKAMARU_ID}
                      slot="ABILITY"
                      abilityName={key}
                      label={pick(SHIKAMARU_SLOT_LABELS[key], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · ÇANTADAKİLER ═══════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="shk-pouch">
          <header className={styles.sectionHead}>
            <h2 id="shk-pouch" className={styles.sectionTitle}>
              {pick(SHIKAMARU_SECTIONS.pouch.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(SHIKAMARU_SECTIONS.pouch.lede, locale)}
            </p>
          </header>
          <ul className={styles.pouch}>
            {SHIKAMARU_POUCH.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.pouchItem}>
                  <span className={styles.pouchArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="480px" /> : null}
                  </span>
                  <span className={styles.pouchName}>
                    {pick(item.name, locale)}
                  </span>
                  <span className={styles.pouchNote}>
                    {pick(item.note, locale)}
                  </span>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={SHIKAMARU_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(SHIKAMARU_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · HAMLE ZİNCİRİ — SAYFANIN KALBİ ═════════════════════════ */}
        <section className={styles.chainSection} aria-labelledby="shk-chain">
          <header className={styles.sectionHead}>
            <h2 id="shk-chain" className={styles.sectionTitle}>
              {pick(SHIKAMARU_SECTIONS.chain.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(SHIKAMARU_SECTIONS.chain.lede, locale)}
            </p>
          </header>
          <MoveChain
            moves={moves}
            listLabel={pick(SHIKAMARU_CHAIN_UI.listLabel, locale)}
            moveWord={pick(SHIKAMARU_CHAIN_UI.moveWord, locale)}
            prevLabel={pick(SHIKAMARU_CHAIN_UI.prev, locale)}
            nextLabel={pick(SHIKAMARU_CHAIN_UI.next, locale)}
            readLabel={pick(SHIKAMARU_CHAIN_UI.readLabel, locale)}
            answerLabel={pick(SHIKAMARU_CHAIN_UI.answerLabel, locale)}
            keyboardHint={pick(SHIKAMARU_CHAIN_UI.keyboardHint, locale)}
            boardAlt={pick(SHIKAMARU_CHAIN_UI.boardAlt, locale)}
          />
          {isAdmin ? (
            <div className={styles.slotRow}>
              {SHIKAMARU_MOVES.map((move) => (
                <CuratorSlot
                  key={move.imageKey}
                  characterId={SHIKAMARU_ID}
                  slot="ABILITY"
                  abilityName={move.imageKey}
                  label={pick(SHIKAMARU_SLOT_LABELS[move.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 7 · ÖMÜR ÇİZELGESİ ═════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="shk-fate">
          <header className={styles.sectionHead}>
            <h2 id="shk-fate" className={styles.sectionTitle}>
              {pick(SHIKAMARU_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(SHIKAMARU_SECTIONS.fate.lede, locale)}
            </p>
          </header>
          <ol className={styles.fate}>
            {SHIKAMARU_TIMELINE.map((entry) => {
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
                      characterId={SHIKAMARU_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(SHIKAMARU_SLOT_LABELS[entry.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 8 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="shk-closing">
          <h2 id="shk-closing" className={styles.visuallyHidden}>
            {name}
          </h2>
          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}
          {SHIKAMARU_CLOSING.quotes.map((quote) => (
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
            {SHIKAMARU_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(SHIKAMARU_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(SHIKAMARU_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(SHIKAMARU_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={SHIKAMARU_ID}
                slot="ABILITY"
                abilityName={SHIKAMARU_IMAGE_KEYS.closing}
                label={pick(
                  SHIKAMARU_SLOT_LABELS[SHIKAMARU_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </ShadowShell>
  );
}
