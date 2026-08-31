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
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import {
  NANAMI_ALT,
  NANAMI_ARTS,
  NANAMI_BONDS,
  NANAMI_BOND_UI,
  NANAMI_CLOCK_UI,
  NANAMI_CLOSING,
  NANAMI_CRUMB,
  NANAMI_ENTRY_UI,
  NANAMI_EXPENSE,
  NANAMI_EXPENSE_UI,
  NANAMI_FRAME_EMPTY,
  NANAMI_GAPS,
  NANAMI_HERO,
  NANAMI_ID,
  NANAMI_IDENTITY,
  NANAMI_IMAGE_KEYS,
  NANAMI_OVERTIME,
  NANAMI_PORTRAIT,
  NANAMI_PORTRAIT_SLOT,
  NANAMI_SECTIONS,
  NANAMI_SHIFT_END,
  NANAMI_SHIFT_START,
  NANAMI_SIDE_NOTES,
  NANAMI_SITE_URL,
  NANAMI_SLOT_LABELS,
  NANAMI_SLOT_SIZES,
  NANAMI_SLOT_SPECS,
  NANAMI_TIMELINE,
  NANAMI_TOOLS,
} from "@/lib/characters/kento-nanami-experience";
import { ClockShell } from "./ClockShell";
import { TieStripes } from "./NanamiGlyphs";
import { ShiftEntry, ShiftLog, ShiftStrip } from "./ShiftLedger";
import styles from "./OvertimeExperience.module.css";

/**
 * Kento Nanami — "Mesai" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/133704 bu bileşene çıkıyor.
 * Sayfanın fikri tek cümle: BU ADAMIN MESAİSİ VAR VE GÜN SANA YETMİYOR.
 *
 * ── SAYFA NEDEN BÖYLE GÖRÜNÜYOR ──────────────────────────────────────────
 * Nanami'nin tekniği bir oran (十劃呪法) ve karakteri bir sözleşme. İkisi de
 * layout'un kendisine yazıldı: sayfadaki HER bant `7fr 3fr`. Sol yedi birim
 * anlatı, sağ üç birim mesai defteri. Oran hiçbir bölümde değişmiyor ve
 * mod düğmesi açıkken de değişmiyor — Nanami'nin katılığı tam olarak bu.
 *
 * Dar ekranda oran TEK KOLONA ÇÖKMÜYOR, dikeye dönüyor: bant
 * `grid-template-rows: 7fr 3fr` oluyor, defter kendi bandının altına
 * geçiyor ve orada AKIŞTA duruyor (yapışkan değil — dikeyde ekranın
 * %30'unu kalıcı yemesi metni okunmaz yapardı).
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (kravat filigranı + personel kartı + boş geniş kadraj)
 *   2 mod düğmesi — "Mesai bitti" (`ClockShell` içinde, durum orada)
 *   3 künye şeridi — GİDER RAPORU: kalem numarası, kayıt, kaynak, dipnot
 *   4 güç laboratuvarı — 3 büyük + 4 küçük, yalnız JJK terminolojisi
 *   5 mesai saati — SAYFANIN KALBİ (`ShiftStrip` + `ShiftLog`)
 *   6 beş kayıt (kader çizelgesi), sonuncusu fazla mesaide açılıyor
 *   7 bağlar + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   ClockShell  — kök öğe, vardiya durumu, "Mesai bitti" düğmesi
 *   ShiftLedger — ShiftEntry / ShiftStrip / ShiftLog
 * `NanamiGlyphs` yalnız SVG çiziyor, kendi başına bir ada değil.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345) ve yalnızca dar "personel kartı"
 * kadrajında. On beş `nan:` kadrajı boş ve her birinin HEMEN ALTINDA kendi
 * küratör yuvası var. Ziyaretçi boş kadrajda üretim metadatası GÖRMÜYOR —
 * o bilgi `isAdmin` ile kesiliyor.
 */
export function OvertimeExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;
  const faces = companionPortraits(companions);

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ resmî
     kare. İkisi de bizim kaynağımız → `unoptimized` hiç yazılmıyor. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? NANAMI_PORTRAIT.src;

  const name = detail.character.name || NANAMI_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? NANAMI_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? NANAMI_SITE_URL;

  const jjkAnchor = (id: string) => `${animeHref.jjk()}#${id}`;

  const gapRows: CuratorGapRow[] = Object.values(NANAMI_IMAGE_KEYS).map(
    (key) => ({
      key,
      label: pick(NANAMI_SLOT_LABELS[key], locale),
      spec: pick(NANAMI_SLOT_SPECS[key], locale),
      filled: ability.has(key),
    }),
  );

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * Kadraj boşken ziyaretçi YAZISIZ bir boşluk görüyor; üretim metadatası
   * (ölçü, biçim) yalnızca yöneticiye çiziliyor. Dolu kadrajda görselin
   * üstüne perde iniyor — kadraja bir gün metin bindiğinde okunabilirlik
   * görselin parlaklığına bağlı kalmasın diye (Dalga 1 eki).
   */
  const frame = (key: string, shapeClass: string) => {
    const scene = src(key);
    return (
      <>
        <div className={styles.frameSlot} data-filled={scene ? "true" : "false"}>
          <figure className={`${styles.frame} ${shapeClass}`}>
            {scene ? (
              <>
                <Image
                  className={styles.frameImage}
                  src={scene}
                  alt={`${pick(NANAMI_ALT.scenePrefix, locale)} ${pick(
                    NANAMI_SLOT_LABELS[key],
                    locale,
                  )}`}
                  fill
                  sizes="(max-width: 60rem) 92vw, 50rem"
                />
                <span className={styles.frameScrim} aria-hidden />
              </>
            ) : isAdmin ? (
              <figcaption className={styles.frameCaption} data-curator-slot>
                <span className={styles.frameCaptionWord}>
                  {pick(NANAMI_FRAME_EMPTY, locale)}
                </span>
                <span className={styles.frameCaptionSpec}>
                  {pick(NANAMI_SLOT_SPECS[key], locale)}
                </span>
              </figcaption>
            ) : null}
          </figure>
        </div>
        {isAdmin ? (
          <CuratorSlot
            characterId={NANAMI_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(NANAMI_SLOT_LABELS[key], locale)}
            size={NANAMI_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /** Bandın sağ hücresinde duran, etkileşimsiz sabit defter notu. */
  const sideNote = (key: keyof typeof NANAMI_SIDE_NOTES) => (
    <div className={styles.bandSide}>
      <p className={styles.sideLabel}>
        {pick(NANAMI_SIDE_NOTES[key].label, locale)}
      </p>
      <p className={styles.sideValue}>{NANAMI_SIDE_NOTES[key].value}</p>
      <p className={styles.sideText}>
        {pick(NANAMI_SIDE_NOTES[key].note, locale)}
      </p>
      <span className={styles.sideFill} aria-hidden>
        <TieStripes
          className={styles.tieArt}
          stripeClassName={styles.tieBand}
          fineClassName={styles.tieFine}
        />
      </span>
    </div>
  );

  /** Her açılabilir kaydın ortak metinleri — on üç yerde tekrarlanmasın. */
  const entryProps = {
    ledgerLabel: pick(NANAMI_ENTRY_UI.ledgerLabel, locale),
    openLabel: pick(NANAMI_ENTRY_UI.openLabel, locale),
    costLabel: pick(NANAMI_ENTRY_UI.costLabel, locale),
    stampPrefix: pick(NANAMI_ENTRY_UI.stampPrefix, locale),
    lockedLabel: pick(NANAMI_ENTRY_UI.lockedLabel, locale),
    lockedNote: pick(NANAMI_ENTRY_UI.lockedNote, locale),
  };

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran: elle çizilmiş çizgili kravat deseni + 七海建人. İkisi de
     dekoratif, ikisi de `aria-hidden`. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link className={styles.crumbLink} href={animeHref.characters()}>
          {t("backToGallery")}
        </Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <span className={styles.crumbHere}>
          {pick(NANAMI_CRUMB.series, locale)}
        </span>
      </nav>

      <section className={styles.band} aria-labelledby="nan-name">
        <div className={styles.bandMain}>
          <span className={styles.heroMark} aria-hidden>
            <TieStripes
              className={styles.heroTie}
              stripeClassName={styles.tieBand}
              fineClassName={styles.tieFine}
            />
            <span className={styles.heroMarkText} lang="ja">
              {NANAMI_IDENTITY.watermark}
            </span>
          </span>

          {/* Karışık dizeye lang="ja" YAZILMADI: satır Türkçe/İngilizce
              gövde + Japonca terim taşıyor, tamamını Japonca ilan etmek ekran
              okuyucuyu yanlış sese geçirirdi. */}
          <p className={styles.heroHouse}>
            {pick(NANAMI_IDENTITY.house, locale)}
          </p>
          <p className={styles.heroReading}>
            {pick(NANAMI_IDENTITY.houseReading, locale)}
          </p>

          <h1 id="nan-name" className={styles.heroName}>
            {name}
          </h1>
          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>

          <span className={styles.rule} aria-hidden />

          <p className={styles.heroEpigraph}>
            {pick(NANAMI_IDENTITY.epigraph, locale)}
          </p>
          <p className={styles.heroLede}>{pick(NANAMI_HERO.lede, locale)}</p>

          {/* Not YALNIZCA yöneticiye ve yalnızca kadraj gerçekten boşken:
              küratör kareyi yüklediğinde "bu kadraj boş" cümlesi yalan
              olurdu, ziyaretçi için de üretim notundan başka bir şey değil. */}
          {isAdmin && !src(NANAMI_IMAGE_KEYS.hero) ? (
            <p className={styles.heroFrameNote} data-curator-slot>
              {pick(NANAMI_HERO.heroCaption, locale)}
            </p>
          ) : null}
          {frame(NANAMI_IMAGE_KEYS.hero, styles.frameWide)}
        </div>

        {/* Personel kartı — portre 230×345, yani KÜÇÜK: geniş bir hero
            olarak değil dar bir kart kadrajında duruyor. */}
        <div className={styles.bandSide}>
          <p className={styles.sideLabel}>{pick(NANAMI_HERO.cardLabel, locale)}</p>

          <figure className={styles.card}>
            <Image
              className={styles.cardImg}
              src={portraitSrc}
              alt={pick(
                portraitUploaded
                  ? NANAMI_HERO.portraitAltUploaded
                  : NANAMI_HERO.portraitAltRepo,
                locale,
              )}
              width={NANAMI_PORTRAIT.w}
              height={NANAMI_PORTRAIT.h}
              priority
            />
            <figcaption className={styles.cardFoot}>
              <span className={styles.cardNumber}>{NANAMI_HERO.cardNumber}</span>
              <span className={styles.cardRole}>
                {pick(NANAMI_HERO.cardRole, locale)}
              </span>
            </figcaption>
          </figure>

          {isAdmin ? (
            <CuratorSlot
              characterId={NANAMI_ID}
              slot="PORTRAIT"
              label={pick(NANAMI_PORTRAIT_SLOT, locale)}
              size={{ w: 1200, h: 1600 }}
            />
          ) : null}

          <span className={styles.sideFill} aria-hidden>
            <TieStripes
              className={styles.tieArt}
              stripeClassName={styles.tieBand}
              fineClassName={styles.tieFine}
            />
          </span>
        </div>
      </section>
    </>
  );

  return (
    <ClockShell
      isAdmin={isAdmin}
      start={NANAMI_SHIFT_START}
      end={NANAMI_SHIFT_END}
      title={pick(NANAMI_OVERTIME.title, locale)}
      native={NANAMI_OVERTIME.native}
      enterLabel={pick(NANAMI_OVERTIME.enter, locale)}
      exitLabel={pick(NANAMI_OVERTIME.exit, locale)}
      hintOn={pick(NANAMI_OVERTIME.hintOn, locale)}
      hintOff={pick(NANAMI_OVERTIME.hintOff, locale)}
      autoNote={pick(NANAMI_OVERTIME.autoNote, locale)}
      meterNowLabel={pick(NANAMI_CLOCK_UI.nowLabel, locale)}
      meterSpentLabel={pick(NANAMI_CLOCK_UI.spentLabel, locale)}
      meterLeftLabel={pick(NANAMI_CLOCK_UI.leftLabel, locale)}
      openBanner={pick(NANAMI_CLOCK_UI.openBanner, locale)}
      closedBanner={pick(NANAMI_CLOCK_UI.closedBanner, locale)}
      hero={hero}
    >
      {/* ══ 3 · KÜNYE ŞERİDİ — GİDER RAPORU ═════════════════════════════ */}
      <section className={styles.band} aria-labelledby="nan-report">
        <div className={styles.bandMain}>
          <p className={styles.bandCode} aria-hidden>
            01
          </p>
          <h2 id="nan-report" className={styles.bandTitle}>
            {pick(NANAMI_SECTIONS.report.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(NANAMI_SECTIONS.report.lede, locale)}
          </p>

          <div className={styles.reportWrap}>
            <table className={styles.reportTable}>
              <caption className={styles.reportCaption}>
                {pick(NANAMI_EXPENSE_UI.tableLabel, locale)}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={styles.reportHead}>
                    {pick(NANAMI_EXPENSE_UI.colCode, locale)}
                  </th>
                  <th scope="col" className={styles.reportHead}>
                    {pick(NANAMI_EXPENSE_UI.colItem, locale)}
                  </th>
                  <th scope="col" className={styles.reportHead}>
                    {pick(NANAMI_EXPENSE_UI.colEntry, locale)}
                  </th>
                  <th scope="col" className={styles.reportHead}>
                    {pick(NANAMI_EXPENSE_UI.colSource, locale)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {NANAMI_EXPENSE.map((row) => (
                  <tr
                    key={row.code}
                    className={styles.reportRow}
                    data-blank={row.blank ? "true" : "false"}
                  >
                    <td className={styles.reportCode}>{row.code}</td>
                    <th scope="row" className={styles.reportItem}>
                      {pick(row.item, locale)}
                    </th>
                    <td className={styles.reportEntry}>
                      {pick(row.entry, locale)}
                    </td>
                    <td className={styles.reportSource}>
                      {pick(row.source, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className={styles.reportFoot}>
                  <td className={styles.reportCode} aria-hidden />
                  <th scope="row" className={styles.reportFootKey} colSpan={2}>
                    {pick(NANAMI_EXPENSE_UI.totalLabel, locale)}
                  </th>
                  <td className={styles.reportFootValue}>
                    {NANAMI_EXPENSE_UI.totalValue}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className={styles.reportHint}>
            {pick(NANAMI_EXPENSE_UI.scrollHint, locale)}
          </p>
          <p className={styles.reportNote}>
            {pick(NANAMI_EXPENSE_UI.footnote, locale)}
          </p>
        </div>

        <div className={styles.bandSide}>
          <ShiftEntry
            id="report"
            label={pick(NANAMI_SECTIONS.report.title, locale)}
            record={pick(NANAMI_EXPENSE_UI.record, locale)}
            {...entryProps}
          />
        </div>
      </section>

      {/* ══ 4a · ÜÇ ANA KALEM ════════════════════════════════════════════ */}
      <section className={styles.group} aria-labelledby="nan-arts">
        <div className={styles.band}>
          <div className={styles.bandMain}>
            <p className={styles.bandCode} aria-hidden>
              02
            </p>
            <h2 id="nan-arts" className={styles.bandTitle}>
              {pick(NANAMI_SECTIONS.arts.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(NANAMI_SECTIONS.arts.lede, locale)}
            </p>
          </div>
          {sideNote("arts")}
        </div>

        {NANAMI_ARTS.map((art) => (
          <div key={art.key} className={styles.band}>
            <div className={styles.bandMain}>
              <article className={styles.art}>
                <p className={styles.artCode} aria-hidden>
                  {art.code}
                </p>
                <h3 className={styles.artKanji} lang="ja">
                  {art.kanji}
                </h3>
                <p className={styles.artRomaji}>{art.romaji}</p>
                <p className={styles.artTurkish}>{pick(art.turkish, locale)}</p>
                <p className={styles.artTagline}>{pick(art.tagline, locale)}</p>
                <p className={styles.artText}>{pick(art.text, locale)}</p>

                <ul className={styles.artTraits}>
                  {art.traits.map((trait) => (
                    <li key={trait.tr} className={styles.artTrait}>
                      {pick(trait, locale)}
                    </li>
                  ))}
                </ul>

                {frame(art.imageKey, styles.frameWide)}
              </article>
            </div>

            <div className={styles.bandSide}>
              <ShiftEntry
                id={art.entry.id}
                label={pick(art.entry.label, locale)}
                record={pick(art.entry.record, locale)}
                {...entryProps}
              />
            </div>
          </div>
        ))}
      </section>

      {/* ══ 4b · DÖRT EK KALEM ═══════════════════════════════════════════ */}
      <section className={styles.group} aria-labelledby="nan-tools">
        <div className={styles.band}>
          <div className={styles.bandMain}>
            <p className={styles.bandCode} aria-hidden>
              03
            </p>
            <h2 id="nan-tools" className={styles.bandTitle}>
              {pick(NANAMI_SECTIONS.tools.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(NANAMI_SECTIONS.tools.lede, locale)}
            </p>
          </div>
          {sideNote("tools")}
        </div>

        {NANAMI_TOOLS.map((tool) => (
          <div key={tool.key} className={styles.band}>
            <div className={styles.bandMain}>
              <article className={styles.tool}>
                <p className={styles.toolCode} aria-hidden>
                  {tool.code}
                </p>
                <h3 className={styles.toolKanji} lang="ja">
                  {tool.kanji}
                </h3>
                <p className={styles.toolRomaji}>{tool.romaji}</p>
                <p className={styles.toolName}>{pick(tool.name, locale)}</p>
                <p className={styles.toolNote}>{pick(tool.note, locale)}</p>

                {tool.anchor ? (
                  <p className={styles.anchorRow}>
                    <Link
                      className={styles.anchorLink}
                      href={jjkAnchor(tool.anchor.id)}
                    >
                      {pick(tool.anchor.label, locale)}
                    </Link>
                  </p>
                ) : null}

                {frame(tool.imageKey, styles.frameSmall)}
              </article>
            </div>

            <div className={styles.bandSide}>
              <ShiftEntry
                id={tool.entry.id}
                label={pick(tool.entry.label, locale)}
                record={pick(tool.entry.record, locale)}
                {...entryProps}
              />
            </div>
          </div>
        ))}
      </section>

      {/* ══ 5 · MESAİ SAATİ — SAYFANIN KALBİ ═════════════════════════════ */}
      <section className={styles.band} aria-labelledby="nan-clock">
        <div className={styles.bandMain}>
          <p className={styles.bandCode} aria-hidden>
            04
          </p>
          <h2 id="nan-clock" className={styles.bandTitle}>
            {pick(NANAMI_SECTIONS.clock.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(NANAMI_SECTIONS.clock.lede, locale)}
          </p>

          <ShiftLog
            title={pick(NANAMI_CLOCK_UI.logTitle, locale)}
            emptyText={pick(NANAMI_CLOCK_UI.logEmpty, locale)}
            hourColumn={pick(NANAMI_CLOCK_UI.nowLabel, locale)}
            entryColumn={pick(NANAMI_CLOCK_UI.openedLabel, locale)}
          />

          {frame(NANAMI_IMAGE_KEYS.clock, styles.frameWide)}
        </div>

        <div className={styles.bandSide}>
          <ShiftStrip
            stripLabel={pick(NANAMI_CLOCK_UI.stripLabel, locale)}
            nowLabel={pick(NANAMI_CLOCK_UI.nowLabel, locale)}
            spentLabel={pick(NANAMI_CLOCK_UI.spentLabel, locale)}
            leftLabel={pick(NANAMI_CLOCK_UI.leftLabel, locale)}
            openedLabel={pick(NANAMI_CLOCK_UI.openedLabel, locale)}
            ruleText={pick(NANAMI_CLOCK_UI.rule, locale)}
            resetLabel={pick(NANAMI_CLOCK_UI.resetLabel, locale)}
            resetHint={pick(NANAMI_CLOCK_UI.resetHint, locale)}
            statusRunning={pick(NANAMI_CLOCK_UI.statusRunning, locale)}
            statusClosed={pick(NANAMI_CLOCK_UI.statusClosed, locale)}
            statusReset={pick(NANAMI_CLOCK_UI.statusReset, locale)}
            emptyMark="—"
          />
          <span className={styles.sideFill} aria-hidden>
            <TieStripes
              className={styles.tieArt}
              stripeClassName={styles.tieBand}
              fineClassName={styles.tieFine}
            />
          </span>
        </div>
      </section>

      {/* ══ 6 · BEŞ KAYIT ════════════════════════════════════════════════ */}
      <section className={styles.group} aria-labelledby="nan-fate">
        <div className={styles.band}>
          <div className={styles.bandMain}>
            <p className={styles.bandCode} aria-hidden>
              05
            </p>
            <h2 id="nan-fate" className={styles.bandTitle}>
              {pick(NANAMI_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(NANAMI_SECTIONS.fate.lede, locale)}
            </p>
          </div>
          {sideNote("fate")}
        </div>

        {NANAMI_TIMELINE.map((stop) => {
          const kinLinked = stop.kin
            ? isExperienceCharacter(stop.kin.characterId)
            : false;
          return (
            <div key={stop.key} className={styles.band}>
              <div className={styles.bandMain}>
                <article className={styles.stop}>
                  <p className={styles.stopCode} aria-hidden>
                    {stop.code}
                  </p>
                  <p className={styles.stopAge}>{pick(stop.age, locale)}</p>
                  <h3 className={styles.stopTitle}>{pick(stop.title, locale)}</h3>
                  <p className={styles.stopText}>{pick(stop.text, locale)}</p>

                  {stop.quote ? (
                    <figure className={styles.stopQuote}>
                      <blockquote className={styles.quoteJa} lang="ja">
                        {stop.quote.text}
                      </blockquote>
                      <p className={styles.quoteReading}>
                        {pick(stop.quote.reading, locale)}
                      </p>
                      <figcaption className={styles.quoteBy}>
                        {pick(stop.quote.by, locale)}
                      </figcaption>
                    </figure>
                  ) : null}

                  {stop.kin ? (
                    <p className={styles.stopKin}>
                      {kinLinked ? (
                        <Link
                          className={styles.stopKinLink}
                          href={animeHref.character(stop.kin.characterId)}
                        >
                          {stop.kin.name}
                        </Link>
                      ) : (
                        <span className={styles.stopKinName}>
                          {stop.kin.name}
                        </span>
                      )}
                      <span className={styles.stopKinRole}>
                        {pick(stop.kin.role, locale)}
                      </span>
                    </p>
                  ) : null}

                  {stop.anchor ? (
                    <p className={styles.anchorRow}>
                      <Link
                        className={styles.anchorLink}
                        href={jjkAnchor(stop.anchor.id)}
                      >
                        {pick(stop.anchor.label, locale)}
                      </Link>
                    </p>
                  ) : null}

                  {frame(stop.imageKey, styles.frameScene)}
                </article>
              </div>

              <div className={styles.bandSide}>
                <ShiftEntry
                  id={stop.entry.id}
                  label={pick(stop.entry.label, locale)}
                  record={pick(stop.entry.record, locale)}
                  mode={stop.overtimeOnly ? "overtime" : "shift"}
                  overtimeLockedLabel={pick(
                    NANAMI_ENTRY_UI.overtimeLockedLabel,
                    locale,
                  )}
                  overtimeLockedNote={pick(
                    NANAMI_ENTRY_UI.overtimeLockedNote,
                    locale,
                  )}
                  overtimeStamp={pick(NANAMI_ENTRY_UI.overtimeStamp, locale)}
                  {...entryProps}
                />
              </div>
            </div>
          );
        })}
      </section>

      {/* ══ 7a · BAĞLAR ══════════════════════════════════════════════════ */}
      <section className={styles.band} aria-labelledby="nan-bonds">
        <div className={styles.bandMain}>
          <p className={styles.bandCode} aria-hidden>
            06
          </p>
          <h2 id="nan-bonds" className={styles.bandTitle}>
            {pick(NANAMI_SECTIONS.bonds.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(NANAMI_SECTIONS.bonds.lede, locale)}
          </p>

          <ul className={styles.bonds}>
            {NANAMI_BONDS.map((bond) => {
              const linked = isExperienceCharacter(bond.characterId);
              const face = faces.get(bond.characterId) ?? null;
              return (
                <li key={bond.characterId} className={styles.bond}>
                  <span className={styles.bondFace} data-filled={face ? "true" : "false"}>
                    {face ? (
                      <Image
                        className={styles.bondFaceImg}
                        src={face}
                        alt={`${bond.name} — ${pick(
                          NANAMI_ALT.companionSuffix,
                          locale,
                        )}`}
                        width={96}
                        height={128}
                      />
                    ) : (
                      <span className={styles.bondMono} lang="ja" aria-hidden>
                        {bond.nameNative}
                      </span>
                    )}
                  </span>

                  <span className={styles.bondBody}>
                    {linked ? (
                      <Link
                        className={styles.bondName}
                        href={animeHref.character(bond.characterId)}
                      >
                        {bond.name}
                      </Link>
                    ) : (
                      <span className={styles.bondNamePlain}>{bond.name}</span>
                    )}
                    <span className={styles.bondRole}>
                      {pick(bond.role, locale)}
                    </span>
                    <span className={styles.bondSummary}>
                      {pick(bond.summary, locale)}
                    </span>

                    {bond.anchor ? (
                      <Link
                        className={styles.anchorLink}
                        href={jjkAnchor(bond.anchor.id)}
                      >
                        {pick(bond.anchor.label, locale)}
                      </Link>
                    ) : null}

                    {isAdmin ? (
                      <span className={styles.bondFlag} data-curator-slot>
                        {pick(
                          linked ? NANAMI_BOND_UI.hasPage : NANAMI_BOND_UI.noPage,
                          locale,
                        )}
                        {face ? null : (
                          <>
                            {" · "}
                            {pick(NANAMI_BOND_UI.portraitMissing, locale)}
                          </>
                        )}
                      </span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {sideNote("bonds")}
      </section>

      {/* ══ 7b · KAPANIŞ ═════════════════════════════════════════════════ */}
      <section className={styles.band} aria-labelledby="nan-closing">
        <div className={styles.bandMain}>
          <p className={styles.bandCode} aria-hidden>
            07
          </p>
          <h2 id="nan-closing" className={styles.bandTitle}>
            {pick(NANAMI_SECTIONS.closing.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(NANAMI_SECTIONS.closing.lede, locale)}
          </p>

          <ul className={styles.closingQuotes}>
            {NANAMI_CLOSING.quotes.map((quote) => (
              <li key={quote.text}>
                <figure className={styles.closingQuote}>
                  <blockquote className={styles.quoteJa} lang="ja">
                    {quote.text}
                  </blockquote>
                  <p className={styles.quoteReading}>
                    {pick(quote.reading, locale)}
                  </p>
                  <p className={styles.quoteNote}>{pick(quote.note, locale)}</p>
                  {/* `figcaption` figure'un SON çocuğu olmak zorunda. */}
                  <figcaption className={styles.quoteBy}>
                    {pick(quote.by, locale)}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <span className={styles.rule} aria-hidden />

          <p className={styles.motto} lang="ja">
            {NANAMI_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(NANAMI_CLOSING.mottoNote, locale)}
          </p>

          {frame(NANAMI_IMAGE_KEYS.closing, styles.frameBand)}

          <p className={styles.credit}>
            {pick(NANAMI_CLOSING.credit, locale)}{" "}
            <a
              className={styles.creditLink}
              href={siteUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {pick(NANAMI_CLOSING.creditLink, locale)}
            </a>
          </p>
          <p className={styles.creditNote}>
            {pick(NANAMI_CLOSING.creditNote, locale)}
          </p>
        </div>

        {sideNote("closing")}
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(NANAMI_GAPS.title, locale)}
          emptyLabel={pick(NANAMI_GAPS.empty, locale)}
          filledLabel={pick(NANAMI_GAPS.filled, locale)}
          allFilledLabel={pick(NANAMI_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </ClockShell>
  );
}
