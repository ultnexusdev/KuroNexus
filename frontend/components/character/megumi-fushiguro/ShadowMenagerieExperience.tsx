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
  MEGUMI_ALT,
  MEGUMI_ARTS,
  MEGUMI_BEASTS,
  MEGUMI_BONDS,
  MEGUMI_BOND_UI,
  MEGUMI_CLOSING,
  MEGUMI_CRUMB,
  MEGUMI_DOMAIN,
  MEGUMI_FRAME_EMPTY,
  MEGUMI_GAPS,
  MEGUMI_HERO,
  MEGUMI_ID,
  MEGUMI_IDENTITY,
  MEGUMI_IMAGE_KEYS,
  MEGUMI_KIT,
  MEGUMI_MISSING_NOTE,
  MEGUMI_POOL,
  MEGUMI_POOL_UI,
  MEGUMI_PORTRAIT,
  MEGUMI_PORTRAIT_SLOT,
  MEGUMI_SECTIONS,
  MEGUMI_SITE_URL,
  MEGUMI_SLOT_LABELS,
  MEGUMI_SLOT_SIZES,
  MEGUMI_SLOT_SPECS,
  MEGUMI_TIMELINE,
} from "@/lib/characters/megumi-fushiguro-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { DomainShell } from "./DomainShell";
import { SummonSeal } from "./MegumiGlyphs";
import type { PoolBeastUI, PoolLabels } from "./ShadowPool";
import styles from "./ShadowMenagerieExperience.module.css";

/**
 * Megumi Fushiguro — "Gölge Menajerisi" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/126635 bu bileşene çıkıyor.
 * Sayfanın fikri tek cümle: GÖLGE TEK BİR HAVUZ VE HER ÇAĞRI ONDAN EKSİLTİYOR.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Sayfa ALTTAN YUKARI doluyor. Alt kenarda sabit (`sticky; bottom: 0`) bir
 * gölge havuzu şeridi duruyor; bölümler onun üstünde akıyor ve çağrılan
 * şikigami havuzdan çıkıp bölümlerin ARASINA yerleşiyor. Bölüm başlıkları
 * fırça (Yuji Boku) ama KÜÇÜK ve SIKI; solda dikey bir mühür rayı var.
 *
 * ⚠️ Eski Megumi sayfasıyla (`.deprecated/megumi-fushiguro/`) hiçbir yapı
 * ortaklığı yok: orada ortak bir ZEMİN ÇİZGİSİ ve üç ayrı cevap veren bir
 * seçim vardı; burada tek bir PAYLAŞILAN KAYNAK ve bir bütçe var. Metinler
 * taşındı, üçü düzeltilerek (gerekçeleri veri dosyasının başında).
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (çağırma mührü filigranı + madalyon portre + boş hero kadrajı)
 *   2 mod düğmesi "Alan" — `DomainShell` içinde (durum orada)
 *   3 künye şeridi
 *   4 güç laboratuvarı: üç büyük (術式 / 領域展開 / 調伏の儀) + dört küçük
 *   5 gölge havuzu — SAYFANIN KALBİ (`ShadowRoster` + `ShadowPoolStrip`)
 *   6 kader çizelgesi (beş durak, yaş etiketli)
 *   7 bağlar + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   DomainShell — kök öğe, "Alan" modu, havuz durumu, bölüm araları
 *   ShadowPool  — liste, şerit ve aradaki şikigami kartlarının çizimi
 * `MegumiGlyphs` üçüncü bir ada DEĞİL: `"use client"` taşımıyor, durumu
 * yok, yalnızca SVG yolu veriyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca madalyon).
 * Büyük hero karesi ve on beş sahne kadrajı BOŞ ve küratör yuvası olarak
 * duruyor; her kadrajın HEMEN ALTINDA kendi yuvası var. Hotlink yok.
 */
export function ShadowMenagerieExperience({
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
    (portraitUploaded ? primaryPortrait(detail) : null) ?? MEGUMI_PORTRAIT.src;

  const name = detail.character.name || MEGUMI_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? MEGUMI_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? MEGUMI_SITE_URL;

  const gapRows: CuratorGapRow[] = Object.values(MEGUMI_IMAGE_KEYS).map(
    (key) => ({
      key,
      label: pick(MEGUMI_SLOT_LABELS[key], locale),
      spec: pick(MEGUMI_SLOT_SPECS[key], locale),
      filled: ability.has(key),
    }),
  );

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * ⚠️ Boş kadrajın içindeki ÜRETİM METADATASI `isAdmin` ile kesiliyor
   * (Dalga 1 · ders 1): ziyaretçinin gördüğü boşluk YAZISIZ. Yönetici için
   * bilgi değerli olduğu için silinmedi, yalnızca ona gösteriliyor.
   */
  const frame = (key: string, shapeClass: string) => {
    const scene = src(key);
    return (
      <>
        <figure
          className={`${styles.frame} ${shapeClass}`}
          data-filled={scene ? "true" : "false"}
        >
          {scene ? (
            <Image
              src={scene}
              alt={`${pick(MEGUMI_ALT.scenePrefix, locale)} ${pick(
                MEGUMI_SLOT_LABELS[key],
                locale,
              )}`}
              fill
              sizes="(max-width: 46rem) 92vw, 40rem"
            />
          ) : isAdmin ? (
            <figcaption className={styles.frameCaption} data-curator-slot>
              <span className={styles.frameCaptionWord}>
                {pick(MEGUMI_FRAME_EMPTY, locale)}
              </span>
              <span className={styles.frameCaptionSpec}>
                {pick(MEGUMI_SLOT_SPECS[key], locale)}
              </span>
            </figcaption>
          ) : null}
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={MEGUMI_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(MEGUMI_SLOT_LABELS[key], locale)}
            size={MEGUMI_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /** Solda duran dikey mühür rayı — bölüm başlıklarının fırça karşılığı. */
  const rail = (seal: string) => (
    <div className={styles.rail} aria-hidden>
      <span className={styles.railSeal} lang="ja">
        {seal}
      </span>
    </div>
  );

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════ */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>
          {pick(MEGUMI_CRUMB.series, locale)}
        </span>
      </nav>

      <section className={styles.hero} aria-labelledby="meg-name">
        {/* Filigran: çağırma mührü + 十種影法術 — ikisi de dekoratif */}
        <span className={styles.sealMark} aria-hidden>
          <SummonSeal
            className={styles.sealArt}
            ringClassName={styles.sealRing}
            strokeClassName={styles.sealStroke}
            coreClassName={styles.sealCore}
          />
        </span>
        <span className={styles.watermark} lang="ja" aria-hidden>
          {MEGUMI_IDENTITY.watermark}
        </span>

        <div className={styles.heroBody}>
          <p className={styles.heroHouse}>
            {pick(MEGUMI_IDENTITY.house, locale)}
          </p>

          <h1 id="meg-name" className={styles.heroName}>
            {name}
          </h1>
          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>

          <p className={styles.heroEpigraph}>
            {pick(MEGUMI_IDENTITY.epigraph, locale)}
          </p>

          <figure className={styles.portrait}>
            <Image
              className={styles.portraitImg}
              src={portraitSrc}
              alt={pick(
                portraitUploaded
                  ? MEGUMI_HERO.portraitAltUploaded
                  : MEGUMI_HERO.portraitAlt,
                locale,
              )}
              width={MEGUMI_PORTRAIT.w}
              height={MEGUMI_PORTRAIT.h}
              priority
            />
          </figure>
          {isAdmin ? (
            <CuratorSlot
              characterId={MEGUMI_ID}
              slot="PORTRAIT"
              label={pick(MEGUMI_PORTRAIT_SLOT, locale)}
              size={{ w: 1200, h: 1600 }}
            />
          ) : null}

          <p className={styles.heroLede}>{pick(MEGUMI_HERO.lede, locale)}</p>

          {/* Not yalnızca kadraj GERÇEKTEN boşken: küratör kareyi
              yüklediğinde "bu kadraj boş" cümlesi yalan olurdu. */}
          {src(MEGUMI_IMAGE_KEYS.hero) || !isAdmin ? null : (
            <p className={styles.heroFrameNote}>
              {pick(MEGUMI_HERO.heroCaption, locale)}
            </p>
          )}
          {frame(MEGUMI_IMAGE_KEYS.hero, styles.frameWide)}
        </div>
      </section>
    </>
  );

  /* ══ 3 · KÜNYE ŞERİDİ ═══════════════════════════════════════════════════ */
  const identity = (
    <section className={styles.section} aria-labelledby="meg-identity">
      {rail(MEGUMI_SECTIONS.identity.seal)}
      <div className={styles.sectionBody}>
        <h2 id="meg-identity" className={styles.sectionTitle}>
          {pick(MEGUMI_SECTIONS.identity.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(MEGUMI_SECTIONS.identity.lede, locale)}
        </p>

        <dl className={styles.facts}>
          {MEGUMI_IDENTITY.facts.map((fact) => (
            <div key={fact.label.tr} className={styles.fact}>
              <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
              <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.factNote}>{pick(MEGUMI_MISSING_NOTE, locale)}</p>
      </div>
    </section>
  );

  /* ══ 4a · ÜÇ BÜYÜK ══════════════════════════════════════════════════════ */
  const arts = (
    <section className={styles.section} aria-labelledby="meg-arts">
      {rail(MEGUMI_SECTIONS.arts.seal)}
      <div className={styles.sectionBody}>
        <h2 id="meg-arts" className={styles.sectionTitle}>
          {pick(MEGUMI_SECTIONS.arts.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(MEGUMI_SECTIONS.arts.lede, locale)}
        </p>

        <ol className={styles.artList}>
          {MEGUMI_ARTS.map((art, index) => (
            <li key={art.key} className={styles.art}>
              <p className={styles.artIndex} aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className={styles.artKanji} lang="ja">
                {art.kanji}
              </h3>
              <p className={styles.artReading} lang="ja">
                {art.reading}
              </p>
              <p className={styles.artRoman}>{art.name}</p>
              <p className={styles.artTurkish}>{pick(art.turkish, locale)}</p>
              <p className={styles.artTagline}>{pick(art.tagline, locale)}</p>
              <p className={styles.artText}>{pick(art.text, locale)}</p>

              <ul className={styles.artTraits}>
                {art.traits.map((trait) => (
                  <li key={trait.tr} className={styles.trait}>
                    {pick(trait, locale)}
                  </li>
                ))}
              </ul>

              {art.anchor && art.anchorLabel ? (
                <p className={styles.artAnchor}>
                  <Link
                    className={styles.artAnchorLink}
                    href={`${animeHref.jjk()}#${art.anchor}`}
                  >
                    {pick(art.anchorLabel, locale)}
                  </Link>
                </p>
              ) : null}

              {frame(art.imageKey, styles.frameWide)}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );

  /* ══ 4b · DÖRT KÜÇÜK ════════════════════════════════════════════════════ */
  const kit = (
    <section className={styles.section} aria-labelledby="meg-kit">
      {rail(MEGUMI_SECTIONS.kit.seal)}
      <div className={styles.sectionBody}>
        <h2 id="meg-kit" className={styles.sectionTitle}>
          {pick(MEGUMI_SECTIONS.kit.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(MEGUMI_SECTIONS.kit.lede, locale)}
        </p>

        <ul className={styles.kitList}>
          {MEGUMI_KIT.map((item) => (
            <li key={item.key} className={styles.kit}>
              <h3 className={styles.kitKanji} lang="ja">
                {item.kanji}
              </h3>
              <p className={styles.kitName}>{pick(item.name, locale)}</p>
              <p className={styles.kitNote}>{pick(item.note, locale)}</p>
              {frame(item.imageKey, styles.frameSquare)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );

  /* ══ 5 · HAVUZ — başlık ve kapanış kadrajı sunucudan ════════════════════ */
  const poolHead = (
    <>
      {rail(MEGUMI_SECTIONS.pool.seal)}
      <div className={styles.poolHead}>
        <h2 id="meg-pool" className={styles.sectionTitle}>
          {pick(MEGUMI_SECTIONS.pool.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(MEGUMI_SECTIONS.pool.lede, locale)}
        </p>
      </div>
    </>
  );

  const poolTail = (
    <div className={styles.poolTail}>
      {frame(MEGUMI_IMAGE_KEYS.pool, styles.frameBand)}
    </div>
  );

  /* ══ 6 · BEŞ DURAK ══════════════════════════════════════════════════════ */
  const fate = (
    <section className={styles.section} aria-labelledby="meg-fate">
      {rail(MEGUMI_SECTIONS.fate.seal)}
      <div className={styles.sectionBody}>
        <h2 id="meg-fate" className={styles.sectionTitle}>
          {pick(MEGUMI_SECTIONS.fate.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(MEGUMI_SECTIONS.fate.lede, locale)}
        </p>

        <ol className={styles.stops}>
          {MEGUMI_TIMELINE.map((stop) => {
            const kinLinked = stop.kin
              ? isExperienceCharacter(stop.kin.characterId)
              : false;
            return (
              <li key={stop.key} className={styles.stop}>
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

                {frame(stop.imageKey, styles.frameScene)}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );

  /* ══ 7a · BAĞLAR ════════════════════════════════════════════════════════
     ⚠️ Portresi çizilen herkes `EXPERIENCE_COMPANIONS[126635]` içinde
     (Dalga 1 · ders 4). Portre kaydı yoksa yerine mühür çiziliyor ve
     ORAYA YÜKLEME YUVASI KONMUYOR — başka bir karakterin yüzünü bu
     karakterin kaydına yazmak olurdu. */
  const bonds = (
    <section className={styles.section} aria-labelledby="meg-bonds">
      {rail(MEGUMI_SECTIONS.bonds.seal)}
      <div className={styles.sectionBody}>
        <h2 id="meg-bonds" className={styles.sectionTitle}>
          {pick(MEGUMI_SECTIONS.bonds.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(MEGUMI_SECTIONS.bonds.lede, locale)}
        </p>

        <p className={styles.bondSchool}>
          <Link
            className={styles.bondSchoolLink}
            href={`${animeHref.jjk()}#society`}
          >
            {pick(MEGUMI_BOND_UI.schoolLink, locale)}
          </Link>
          <span className={styles.bondSchoolName}>
            {pick(MEGUMI_BOND_UI.school, locale)}
          </span>
        </p>

        <ul className={styles.bonds}>
          {MEGUMI_BONDS.map((bond) => {
            const linked = isExperienceCharacter(bond.characterId);
            const face = faces.get(bond.characterId) ?? null;
            return (
              <li key={bond.characterId} className={styles.bond}>
                <span className={styles.bondFace}>
                  {face ? (
                    <Image
                      className={styles.bondFaceImg}
                      src={face}
                      alt={`${bond.name} ${pick(
                        MEGUMI_ALT.companionSuffix,
                        locale,
                      )}`}
                      width={120}
                      height={160}
                    />
                  ) : (
                    <span className={styles.bondSeal} aria-hidden>
                      <SummonSeal
                        className={styles.sealArt}
                        ringClassName={styles.sealRing}
                        strokeClassName={styles.sealStroke}
                        coreClassName={styles.sealCore}
                      />
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
                  <span className={styles.bondNative} lang="ja">
                    {bond.native}
                  </span>
                  <span className={styles.bondRole}>
                    {pick(bond.role, locale)}
                  </span>
                  <span className={styles.bondLine}>
                    {pick(bond.line, locale)}
                  </span>
                  <span className={styles.bondFlag}>
                    {pick(
                      linked ? MEGUMI_BOND_UI.hasPage : MEGUMI_BOND_UI.noPage,
                      locale,
                    )}
                    {face ? null : (
                      <span className={styles.bondFlagFace}>
                        {" · "}
                        {pick(MEGUMI_BOND_UI.portraitMissing, locale)}
                      </span>
                    )}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        <p className={styles.bondSlotNote}>
          {pick(MEGUMI_BOND_UI.slotNote, locale)}
        </p>

        {frame(MEGUMI_IMAGE_KEYS.bonds, styles.frameWide)}
      </div>
    </section>
  );

  /* ══ 7b · KAPANIŞ ═══════════════════════════════════════════════════════ */
  const closing = (
    <section className={styles.closing} aria-labelledby="meg-closing">
      {rail(MEGUMI_SECTIONS.closing.seal)}
      <div className={styles.sectionBody}>
        <h2 id="meg-closing" className={styles.sectionTitle}>
          {pick(MEGUMI_SECTIONS.closing.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(MEGUMI_SECTIONS.closing.lede, locale)}
        </p>

        <ul className={styles.closingQuotes}>
          {MEGUMI_CLOSING.quotes.map((quote) => (
            <li key={quote.text}>
              <figure className={styles.closingQuote}>
                <blockquote className={styles.quoteJa} lang="ja">
                  {quote.text}
                </blockquote>
                <p className={styles.quoteReading}>
                  {pick(quote.reading, locale)}
                </p>
                <p className={styles.quoteNote}>{pick(quote.note, locale)}</p>
                {/* `figcaption` figure'un SON çocuğu olmak zorunda (HTML) */}
                <figcaption className={styles.quoteBy}>
                  {pick(quote.by, locale)}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className={styles.motto} lang="ja">
          {MEGUMI_CLOSING.motto}
        </p>
        <p className={styles.mottoNote}>
          {pick(MEGUMI_CLOSING.mottoNote, locale)}
        </p>

        {frame(MEGUMI_IMAGE_KEYS.closing, styles.frameBand)}

        <p className={styles.credit}>
          {pick(MEGUMI_CLOSING.credit, locale)}{" "}
          <a href={siteUrl} target="_blank" rel="noreferrer noopener">
            {pick(MEGUMI_CLOSING.creditLink, locale)}
          </a>
        </p>
        <p className={styles.creditNote}>
          {pick(MEGUMI_CLOSING.creditNote, locale)}
        </p>
      </div>
    </section>
  );

  /* İstemci adasına DÜZ DİZE iniyor — `LocalizedText` sınırı geçmiyor. */
  const beasts: PoolBeastUI[] = MEGUMI_BEASTS.map((beast) => ({
    key: beast.key,
    kanji: beast.kanji,
    name: beast.name,
    reading: beast.reading,
    turkish: pick(beast.turkish, locale),
    sigil: beast.sigil,
    state: beast.state,
    cost: beast.cost,
    role: pick(beast.role, locale),
    text: pick(beast.text, locale),
    onField: pick(beast.onField, locale),
    note: beast.note ? pick(beast.note, locale) : undefined,
  }));

  const labels: PoolLabels = {
    gaugeTitle: pick(MEGUMI_POOL_UI.gaugeTitle, locale),
    gaugeNative: MEGUMI_POOL_UI.gaugeNative,
    remainingLabel: pick(MEGUMI_POOL_UI.remainingLabel, locale),
    usableLabel: pick(MEGUMI_POOL_UI.usableLabel, locale),
    scarLabel: pick(MEGUMI_POOL_UI.scarLabel, locale),
    fieldLabel: pick(MEGUMI_POOL_UI.fieldLabel, locale),
    unitLabel: pick(MEGUMI_POOL_UI.unitLabel, locale),
    costLabel: pick(MEGUMI_POOL_UI.costLabel, locale),
    summon: pick(MEGUMI_POOL_UI.summon, locale),
    returnOne: pick(MEGUMI_POOL_UI.returnOne, locale),
    returnAll: pick(MEGUMI_POOL_UI.returnAll, locale),
    insufficient: pick(MEGUMI_POOL_UI.insufficient, locale),
    brokenBadge: pick(MEGUMI_POOL_UI.brokenBadge, locale),
    lockedBadge: pick(MEGUMI_POOL_UI.lockedBadge, locale),
    outBadge: pick(MEGUMI_POOL_UI.outBadge, locale),
    readyBadge: pick(MEGUMI_POOL_UI.readyBadge, locale),
    emptyField: pick(MEGUMI_POOL_UI.emptyField, locale),
    lockHint: pick(MEGUMI_POOL_UI.lockHint, locale),
    unlockedHint: pick(MEGUMI_POOL_UI.unlockedHint, locale),
    ritualButton: pick(MEGUMI_POOL_UI.ritualButton, locale),
    ritualDone: pick(MEGUMI_POOL_UI.ritualDone, locale),
    ritualWord: MEGUMI_POOL_UI.ritualWord,
    ritualWordNote: pick(MEGUMI_POOL_UI.ritualWordNote, locale),
    afterRitual: pick(MEGUMI_POOL_UI.afterRitual, locale),
    keyboardHint: pick(MEGUMI_POOL_UI.keyboardHint, locale),
    deviceNote: pick(MEGUMI_POOL_UI.deviceNote, locale),
    bandLabel: pick(MEGUMI_POOL_UI.bandLabel, locale),
  };

  return (
    <DomainShell
      isAdmin={isAdmin}
      hero={hero}
      mode={{
        title: pick(MEGUMI_DOMAIN.title, locale),
        native: MEGUMI_DOMAIN.native,
        enter: pick(MEGUMI_DOMAIN.enter, locale),
        exit: pick(MEGUMI_DOMAIN.exit, locale),
        hintOn: pick(MEGUMI_DOMAIN.hintOn, locale),
        hintOff: pick(MEGUMI_DOMAIN.hintOff, locale),
        note: pick(MEGUMI_DOMAIN.note, locale),
      }}
      identity={identity}
      arts={arts}
      kit={kit}
      poolHead={poolHead}
      poolTail={poolTail}
      fate={fate}
      bonds={bonds}
      closing={closing}
      gaps={
        isAdmin ? (
          <CuratorGaps
            title={pick(MEGUMI_GAPS.title, locale)}
            emptyLabel={pick(MEGUMI_GAPS.empty, locale)}
            filledLabel={pick(MEGUMI_GAPS.filled, locale)}
            allFilledLabel={pick(MEGUMI_GAPS.allFilled, locale)}
            rows={gapRows}
          />
        ) : null
      }
      beasts={beasts}
      labels={labels}
      messages={{
        statusStart: pick(MEGUMI_POOL_UI.emptyField, locale),
        statusCalled: pick(MEGUMI_POOL_UI.statusCalled, locale),
        statusReturned: pick(MEGUMI_POOL_UI.statusReturned, locale),
        statusAllReturned: pick(MEGUMI_POOL_UI.statusAllReturned, locale),
        statusRefused: pick(MEGUMI_POOL_UI.statusRefused, locale),
        statusUnlocked: pick(MEGUMI_POOL_UI.statusUnlocked, locale),
        statusRitual: pick(MEGUMI_POOL_UI.statusRitual, locale),
        progressCalled: pick(MEGUMI_POOL_UI.progressCalled, locale),
        progressLeft: pick(MEGUMI_POOL_UI.progressLeft, locale),
      }}
      total={MEGUMI_POOL.total}
      scar={MEGUMI_POOL.scar}
    />
  );
}
