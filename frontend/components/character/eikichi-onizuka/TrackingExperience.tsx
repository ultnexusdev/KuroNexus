import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  ONIZUKA_ALT,
  ONIZUKA_BELL,
  ONIZUKA_CLOSING,
  ONIZUKA_CRUMB,
  ONIZUKA_GAPS,
  ONIZUKA_HERO,
  ONIZUKA_ID,
  ONIZUKA_IDENTITY,
  ONIZUKA_IMAGE_KEYS,
  ONIZUKA_MISSING_NOTE,
  ONIZUKA_PORTRAIT,
  ONIZUKA_PORTRAIT_SLOT,
  ONIZUKA_RECORD_MAJOR,
  ONIZUKA_RECORD_MINOR,
  ONIZUKA_SECTIONS,
  ONIZUKA_SERIES_SLUG,
  ONIZUKA_SITE_URL,
  ONIZUKA_SLOT_ORDER,
  ONIZUKA_SLOTS,
  ONIZUKA_TAPE,
  ONIZUKA_TAPE_UI,
  ONIZUKA_TIMELINE,
} from "@/lib/characters/eikichi-onizuka-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { CuratorGaps, type CuratorGapRow } from "@/components/character/CuratorGaps";
import { BellShell } from "./BellShell";
import { TapeDeck, type TapeDeckSegment } from "./TapeDeck";
import { BikeMark, ChalkRule } from "./OnizukaGlyphs";
import styles from "./TrackingExperience.module.css";

/**
 * Eikichi Onizuka — "İZLEME" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/434 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: ARŞİVİN TEK GÜÇSÜZ
 * DOSYASI. Kadrodaki herkesin bir tekniği var; burada ikinci dan karate,
 * hileyle alınmış bir diploma ve bir motosiklet var. Sayfa bunu saklamıyor,
 * biçim hâline getiriyor — 90'lar yankee/manga kolajı, halftone başlıklar,
 * VHS greni ve yıpranmış bir kaset.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var (SÖZLEŞME sınırı üç):
 *   BellShell — ders zili; `data-bell` ile sayfanın DÜZENİNİ çeviriyor
 *   TapeDeck  — kaset izleme çubuğu (sayfanın kalbi)
 * Üçüncü dosya `OnizukaGlyphs` durum tutmuyor, `"use client"` değil.
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iniyor.
 *
 * ── GÖRSEL POLİTİKASI ────────────────────────────────────────────────────
 * Resmî portre DEPODA (`anilist-portrait.png`, 230×345) ve hotlink yok.
 * O kare bir hero için küçük olduğu için polaroid kadrajında duruyor;
 * geniş hero karesi BOŞ bir küratör yuvası olarak bekliyor (Faz 2 §3).
 * Yirmi yuvanın hepsi ilgili karenin HEMEN ALTINDA; sayfa sonunda toplu
 * yuva bloğu yok, yalnızca düzenleyicisiz `CuratorGaps` özeti var.
 *
 * `companions` bilerek okunmuyor: Onizuka arşivde GTO kadrosunun tek
 * kaydı (yoldaş listesi yalnızca kendisini içeriyor), o yüzden kadro bağı
 * yerine serinin arşiv sayfasına bağ veriliyor (BRIEF, "Nexus bağları").
 */
export function TrackingExperience({ detail, isAdmin }: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;

  const portraitUploaded = isUploadedPortrait(detail);
  const uploadedPortrait = portraitUploaded ? primaryPortrait(detail) : null;

  const heroScene = src(ONIZUKA_IMAGE_KEYS.hero);
  const closingArt = src(ONIZUKA_IMAGE_KEYS.closing);

  const name = detail.character.name || ONIZUKA_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? ONIZUKA_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? ONIZUKA_SITE_URL;

  /** Yuvanın etiketi + önerilen ölçüsü tek yerden; ikisi ayrışmasın. */
  const slotProps = (key: string) => {
    const spec = ONIZUKA_SLOTS[key];
    return { label: pick(spec.label, locale), size: spec.size };
  };

  const tapeSegments: TapeDeckSegment[] = ONIZUKA_TAPE.map((segment) => {
    const spec = ONIZUKA_SLOTS[segment.imageKey];
    return {
      key: segment.key,
      counter: segment.counter,
      name: segment.name,
      romaji: segment.romaji,
      role: pick(segment.role, locale),
      picture: pick(segment.picture, locale),
      record: pick(segment.record, locale),
      afterword: pick(segment.afterword, locale),
      image: src(segment.imageKey),
      slotKey: segment.imageKey,
      slotLabel: pick(spec.label, locale),
      slotWidth: spec.size.w,
      slotHeight: spec.size.h,
    };
  });

  const gapRows: CuratorGapRow[] = ONIZUKA_SLOT_ORDER.map((key) => {
    const spec = ONIZUKA_SLOTS[key];
    return {
      key,
      label: pick(spec.label, locale),
      spec: pick(spec.spec, locale),
      filled:
        key === ONIZUKA_PORTRAIT_SLOT ? portraitUploaded : ability.has(key),
    };
  });

  const emptyMark = pick(ONIZUKA_ALT.emptyFrame, locale);

  return (
    <BellShell
      label={pick(ONIZUKA_BELL.label, locale)}
      classState={pick(ONIZUKA_BELL.classState, locale)}
      streetState={pick(ONIZUKA_BELL.streetState, locale)}
      toClass={pick(ONIZUKA_BELL.toClass, locale)}
      toStreet={pick(ONIZUKA_BELL.toStreet, locale)}
      classHint={pick(ONIZUKA_BELL.classHint, locale)}
      streetHint={pick(ONIZUKA_BELL.streetHint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <div className={styles.shell}>
          <nav className={styles.crumb} aria-label="breadcrumb">
            <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
            <span className={styles.crumbSep} aria-hidden>
              ·
            </span>
            <span className={styles.crumbHere}>
              {pick(ONIZUKA_CRUMB.series, locale)}
            </span>
          </nav>

          {/* ══ 1 · HERO ═══════════════════════════════════════════════════
              Filigran: elle çizilmiş motosiklet konturu + 鬼塚. Portre
              polaroid'de (230×345 küçük), geniş kare boş küratör yuvası. */}
          <section className={styles.hero} aria-labelledby="onz-name">
            <span className={styles.heroWatermark} aria-hidden>
              <span className={styles.heroKanji}>
                {ONIZUKA_IDENTITY.watermark}
              </span>
              <BikeMark className={styles.heroBike} />
            </span>

            <div className={styles.heroGrid}>
              <div className={styles.heroBody}>
                <p className={styles.heroEyebrow}>
                  {pick(ONIZUKA_IDENTITY.eyebrow, locale)}
                </p>
                <h1 id="onz-name" className={styles.heroName}>
                  {name}
                </h1>
                <p className={styles.heroNative} lang="ja">
                  {nativeName}
                </p>
                <p className={styles.heroEpigraph}>
                  {pick(ONIZUKA_IDENTITY.epigraph, locale)}
                </p>
                <p className={styles.heroLede}>
                  {pick(ONIZUKA_HERO.lede, locale)}
                </p>
              </div>

              <div>
                <figure className={styles.polaroid}>
                  <span className={styles.polaroidShot}>
                    {uploadedPortrait ? (
                      <Image
                        src={uploadedPortrait}
                        alt={pick(ONIZUKA_HERO.portraitAltUploaded, locale)}
                        fill
                        sizes="(max-width: 54rem) 60vw, 260px"
                        priority
                        className={styles.polaroidImg}
                      />
                    ) : (
                      <Image
                        src={ONIZUKA_PORTRAIT.src}
                        alt={pick(ONIZUKA_HERO.portraitAlt, locale)}
                        width={ONIZUKA_PORTRAIT.w}
                        height={ONIZUKA_PORTRAIT.h}
                        sizes="(max-width: 54rem) 60vw, 260px"
                        priority
                        className={styles.polaroidImg}
                      />
                    )}
                  </span>
                  <figcaption className={styles.polaroidCaption}>
                    {pick(ONIZUKA_HERO.portraitCaption, locale)}
                  </figcaption>
                </figure>

                {/* Portrenin HEMEN ALTINDA yuvası: küratör tam boy kareyi
                    yüklerse `primaryPortrait` onu seçiyor. */}
                {isAdmin ? (
                  <div className={styles.slotRow}>
                    <CuratorSlot
                      characterId={ONIZUKA_ID}
                      slot="PORTRAIT"
                      {...slotProps(ONIZUKA_PORTRAIT_SLOT)}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            {/* Geniş kadraj — bilerek boş bırakıldı (Faz 2 §3) */}
            <div className={styles.heroFrame}>
              {heroScene ? (
                <span className={styles.heroFrameArt} aria-hidden>
                  <Image src={heroScene} alt="" fill sizes="100vw" />
                </span>
              ) : (
                <p className={styles.heroFrameNote}>
                  {pick(ONIZUKA_HERO.frameEmpty, locale)}
                </p>
              )}
              <span className={styles.heroFrameLabel} aria-hidden>
                {pick(ONIZUKA_HERO.frameLabel, locale)}
              </span>
            </div>
            {isAdmin ? (
              <div className={styles.slotRow}>
                <CuratorSlot
                  characterId={ONIZUKA_ID}
                  slot="ABILITY"
                  abilityName={ONIZUKA_IMAGE_KEYS.hero}
                  {...slotProps(ONIZUKA_IMAGE_KEYS.hero)}
                />
              </div>
            ) : null}
          </section>

          {/* ══ 3 · KÜNYE ŞERİDİ ═══════════════════════════════════════════ */}
          <section
            className={`${styles.panel} ${styles.tiltA}`}
            aria-labelledby="onz-identity"
          >
            <header className={styles.panelHead}>
              <span className={styles.tag}>
                {pick(ONIZUKA_SECTIONS.identity.mark, locale)}
              </span>
              <h2 id="onz-identity" className={styles.panelTitle}>
                {pick(ONIZUKA_SECTIONS.identity.title, locale)}
              </h2>
              <ChalkRule className={styles.panelRule} />
              <p className={styles.panelLede}>
                {pick(ONIZUKA_SECTIONS.identity.lede, locale)}
              </p>
            </header>

            <dl className={styles.facts}>
              {ONIZUKA_IDENTITY.facts.map((fact) => (
                <div key={fact.label.tr} className={styles.fact}>
                  <dt>{pick(fact.label, locale)}</dt>
                  <dd>{pick(fact.value, locale)}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.factNote}>
              {pick(ONIZUKA_MISSING_NOTE, locale)}
            </p>
          </section>

          {/* ══ 4 · SİCİL — 3 büyük + 4 küçük ═════════════════════════════ */}
          <section
            className={`${styles.panel} ${styles.tiltB}`}
            aria-labelledby="onz-record"
          >
            <header className={styles.panelHead}>
              <span className={styles.tag}>
                {pick(ONIZUKA_SECTIONS.record.mark, locale)}
              </span>
              <h2 id="onz-record" className={styles.panelTitle}>
                {pick(ONIZUKA_SECTIONS.record.title, locale)}
              </h2>
              <ChalkRule className={styles.panelRule} />
              <p className={styles.panelLede}>
                {pick(ONIZUKA_SECTIONS.record.lede, locale)}
              </p>
            </header>

            <ul className={styles.majors}>
              {ONIZUKA_RECORD_MAJOR.map((card) => {
                const scene = src(card.imageKey);
                return (
                  <li key={card.key} className={styles.major}>
                    <span className={styles.majorArt}>
                      {scene ? (
                        <Image
                          src={scene}
                          alt=""
                          fill
                          sizes="(max-width: 58rem) 100vw, 340px"
                        />
                      ) : (
                        <span className={styles.emptyMark} aria-hidden>
                          {emptyMark}
                        </span>
                      )}
                    </span>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={ONIZUKA_ID}
                        slot="ABILITY"
                        abilityName={card.imageKey}
                        {...slotProps(card.imageKey)}
                      />
                    ) : null}

                    <span className={styles.majorKanji} lang="ja">
                      {card.kanji}
                    </span>
                    <span className={styles.majorReading}>{card.reading}</span>
                    <span className={styles.majorName}>
                      {pick(card.name, locale)}
                    </span>
                    <span className={styles.majorTagline}>
                      {pick(card.tagline, locale)}
                    </span>
                    <span className={styles.majorText}>
                      {pick(card.text, locale)}
                    </span>
                    <span className={styles.majorTraits}>
                      {card.traits.map((trait) => (
                        <span key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </li>
                );
              })}
            </ul>

            <ul className={styles.minors}>
              {ONIZUKA_RECORD_MINOR.map((card) => {
                const scene = src(card.imageKey);
                return (
                  <li key={card.key} className={styles.minor}>
                    <span className={styles.minorArt}>
                      {scene ? (
                        <Image
                          src={scene}
                          alt=""
                          fill
                          sizes="(max-width: 34rem) 100vw, 260px"
                        />
                      ) : (
                        <span className={styles.emptyMark} aria-hidden>
                          {emptyMark}
                        </span>
                      )}
                    </span>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={ONIZUKA_ID}
                        slot="ABILITY"
                        abilityName={card.imageKey}
                        {...slotProps(card.imageKey)}
                      />
                    ) : null}

                    <span className={styles.minorKanji} lang="ja">
                      {card.kanji}
                    </span>
                    <span className={styles.minorReading}>{card.reading}</span>
                    <span className={styles.minorName}>
                      {pick(card.name, locale)}
                    </span>
                    <span className={styles.minorText}>
                      {pick(card.note, locale)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* ══ 5 · KASET — SAYFANIN KALBİ ════════════════════════════════ */}
          <section
            className={`${styles.panel} ${styles.tiltC}`}
            aria-labelledby="onz-tape"
          >
            <header className={styles.panelHead}>
              <span className={styles.tag}>
                {pick(ONIZUKA_SECTIONS.tape.mark, locale)}
              </span>
              <h2 id="onz-tape" className={styles.panelTitle}>
                {pick(ONIZUKA_SECTIONS.tape.title, locale)}
              </h2>
              <ChalkRule className={styles.panelRule} />
              <p className={styles.panelLede}>
                {pick(ONIZUKA_SECTIONS.tape.lede, locale)}
              </p>
            </header>

            <TapeDeck
              characterId={ONIZUKA_ID}
              isAdmin={isAdmin}
              segments={tapeSegments}
              ui={{
                groupLabel: pick(ONIZUKA_TAPE_UI.groupLabel, locale),
                positionsLabel: pick(ONIZUKA_TAPE_UI.positionsLabel, locale),
                prev: pick(ONIZUKA_TAPE_UI.prev, locale),
                next: pick(ONIZUKA_TAPE_UI.next, locale),
                counterLabel: pick(ONIZUKA_TAPE_UI.counterLabel, locale),
                recLabel: pick(ONIZUKA_TAPE_UI.recLabel, locale),
                trackingLabel: pick(ONIZUKA_TAPE_UI.trackingLabel, locale),
                trackingUp: pick(ONIZUKA_TAPE_UI.trackingUp, locale),
                trackingDown: pick(ONIZUKA_TAPE_UI.trackingDown, locale),
                trackingStates: ONIZUKA_TAPE_UI.trackingStates.map((state) =>
                  pick(state, locale),
                ),
                recordLabel: pick(ONIZUKA_TAPE_UI.recordLabel, locale),
                afterLabel: pick(ONIZUKA_TAPE_UI.afterLabel, locale),
                pictureLabel: pick(ONIZUKA_TAPE_UI.pictureLabel, locale),
                lockedNote: pick(ONIZUKA_TAPE_UI.lockedNote, locale),
                halfNote: pick(ONIZUKA_TAPE_UI.halfNote, locale),
                cleanNote: pick(ONIZUKA_TAPE_UI.cleanNote, locale),
                hint: pick(ONIZUKA_TAPE_UI.hint, locale),
                frameEmpty: pick(ONIZUKA_TAPE_UI.frameEmpty, locale),
              }}
            />
          </section>

          {/* ══ 6 · SAYAÇ — beş durak ═════════════════════════════════════ */}
          <section
            className={`${styles.panel} ${styles.tiltD}`}
            aria-labelledby="onz-fate"
          >
            <header className={styles.panelHead}>
              <span className={styles.tag}>
                {pick(ONIZUKA_SECTIONS.fate.mark, locale)}
              </span>
              <h2 id="onz-fate" className={styles.panelTitle}>
                {pick(ONIZUKA_SECTIONS.fate.title, locale)}
              </h2>
              <ChalkRule className={styles.panelRule} />
              <p className={styles.panelLede}>
                {pick(ONIZUKA_SECTIONS.fate.lede, locale)}
              </p>
            </header>

            <ol className={styles.fate}>
              {ONIZUKA_TIMELINE.map((entry) => {
                const scene = src(entry.imageKey);
                return (
                  <li key={entry.key} className={styles.fateItem}>
                    <div className={styles.fateSide}>
                      <span className={styles.fateCounter}>
                        {entry.counter}
                      </span>
                      <span className={styles.fateAge}>
                        {pick(entry.age, locale)}
                      </span>
                    </div>

                    <div className={styles.fateBody}>
                      <span className={styles.fateNative} lang="ja">
                        {entry.native}
                      </span>
                      <h3 className={styles.fateTitle}>
                        {pick(entry.title, locale)}
                      </h3>
                      <p className={styles.fateText}>
                        {pick(entry.text, locale)}
                      </p>

                      {entry.quote ? (
                        <figure className={styles.fateQuote}>
                          <blockquote
                            className={styles.fateQuoteText}
                            lang={entry.quote.lang}
                          >
                            {pick(entry.quote.text, locale)}
                          </blockquote>
                          <p className={styles.fateQuoteReading}>
                            {pick(entry.quote.reading, locale)}
                          </p>
                          <figcaption className={styles.fateQuoteBy}>
                            {pick(entry.quote.by, locale)}
                          </figcaption>
                        </figure>
                      ) : null}

                      <span className={styles.fateArt}>
                        {scene ? (
                          <Image
                            src={scene}
                            alt=""
                            fill
                            sizes="(max-width: 50rem) 100vw, 560px"
                          />
                        ) : (
                          <span className={styles.emptyMark} aria-hidden>
                            {emptyMark}
                          </span>
                        )}
                      </span>
                      {isAdmin ? (
                        <CuratorSlot
                          characterId={ONIZUKA_ID}
                          slot="ABILITY"
                          abilityName={entry.imageKey}
                          {...slotProps(entry.imageKey)}
                        />
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ══ 7 · KAPANIŞ — iki kanal ═══════════════════════════════════ */}
          <section
            className={`${styles.panel} ${styles.tiltE} ${styles.closing}`}
            aria-labelledby="onz-closing"
          >
            {closingArt ? (
              <span className={styles.closingArt} aria-hidden>
                <Image src={closingArt} alt="" fill sizes="100vw" />
              </span>
            ) : null}

            <div className={styles.closingBody}>
              <header className={styles.panelHead}>
                <span className={styles.tag}>
                  {pick(ONIZUKA_SECTIONS.closing.mark, locale)}
                </span>
                <h2 id="onz-closing" className={styles.panelTitle}>
                  {pick(ONIZUKA_SECTIONS.closing.title, locale)}
                </h2>
                <ChalkRule className={styles.panelRule} />
                <p className={styles.panelLede}>
                  {pick(ONIZUKA_SECTIONS.closing.lede, locale)}
                </p>
              </header>

              <ul className={styles.channels}>
                {ONIZUKA_CLOSING.channels.map((channel) => (
                  <li key={channel.tag.tr} className={styles.channel}>
                    <figure>
                      <span className={styles.channelTag}>
                        {pick(channel.tag, locale)}
                      </span>
                      <blockquote
                        className={styles.quoteText}
                        lang={channel.lang}
                      >
                        {pick(channel.text, locale)}
                      </blockquote>
                      <p className={styles.quoteReading}>
                        {pick(channel.reading, locale)}
                      </p>
                      <figcaption className={styles.quoteBy}>
                        {pick(channel.by, locale)}
                      </figcaption>
                      <p className={styles.quoteNote}>
                        {pick(channel.note, locale)}
                      </p>
                    </figure>
                  </li>
                ))}
              </ul>

              <p className={styles.motto} lang="ja">
                {ONIZUKA_CLOSING.motto}
              </p>
              <p className={styles.mottoNote}>
                {pick(ONIZUKA_CLOSING.mottoNote, locale)}
              </p>

              {/* Kadro bağı yok — serinin arşiv sayfasına bağ (BRIEF) */}
              <p className={styles.nexus}>
                {pick(ONIZUKA_CLOSING.nexusLead, locale)}{" "}
                <Link
                  className={styles.nexusLink}
                  href={animeHref.series(ONIZUKA_SERIES_SLUG)}
                >
                  {pick(ONIZUKA_CLOSING.nexusLabel, locale)}
                </Link>
              </p>

              <p className={styles.credit}>
                {pick(ONIZUKA_CLOSING.credit, locale)}{" "}
                <a href={siteUrl} target="_blank" rel="noreferrer noopener">
                  {pick(ONIZUKA_CLOSING.creditLink, locale)}
                </a>
              </p>

              {/* Kapanış karesi dolu da olsa boş da olsa yuva burada:
                  kadrajın HEMEN ALTINDA, sayfa sonunda toplu blok yok. */}
              {isAdmin ? (
                <div className={styles.slotRow}>
                  <CuratorSlot
                    characterId={ONIZUKA_ID}
                    slot="ABILITY"
                    abilityName={ONIZUKA_IMAGE_KEYS.closing}
                    {...slotProps(ONIZUKA_IMAGE_KEYS.closing)}
                  />
                </div>
              ) : null}
            </div>
          </section>
        </div>

        {/* Düzenleyicisiz özet — sayfanın EN ALTINDA (Faz 2 §3.3) */}
        {isAdmin ? (
          <div className={styles.gapsWrap}>
            <CuratorGaps
              title={pick(ONIZUKA_GAPS.title, locale)}
              emptyLabel={pick(ONIZUKA_GAPS.empty, locale)}
              filledLabel={pick(ONIZUKA_GAPS.filled, locale)}
              allFilledLabel={pick(ONIZUKA_GAPS.allFilled, locale)}
              rows={gapRows}
            />
          </div>
        ) : null}
      </CuratorFrame>
    </BellShell>
  );
}
