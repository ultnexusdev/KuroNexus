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
  URK_ALT,
  URK_BONDS,
  URK_CLOSING,
  URK_CRUMB,
  URK_FIELD_UI,
  URK_GAPS,
  URK_GRAVITY_TEXT,
  URK_HERO,
  URK_ID,
  URK_IDENTITY,
  URK_IMAGE_KEYS,
  URK_LIFTS,
  URK_PORTRAIT,
  URK_PORTRAIT_SLOT_KEY,
  URK_POWERS,
  URK_RECORD_NOTE,
  URK_SECTIONS,
  URK_SITE_URL,
  URK_SLOT_LABELS,
  URK_SLOT_SPECS,
  URK_TIMELINE,
  URK_TRAITS,
} from "@/lib/characters/ochako-uraraka-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { CuratorGaps, type CuratorGapRow } from "@/components/character/CuratorGaps";
import { GravityShell } from "./GravityShell";
import { ReleaseField } from "./ReleaseField";
import { PadMark } from "./UrarakaGlyphs";
import styles from "./ZeroGravityExperience.module.css";

/**
 * Ochako Uraraka — "Zero Gravity" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/89221 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: GÜCÜ KALDIRMAK DEĞİL,
 * BIRAKMAYA KARAR VERMEK.
 *
 * ── IZGARA: SERBEST YÜZEN KART ALANI ─────────────────────────────────────
 * Hiçbir bölüm hizalı bir ızgara kullanmıyor. Her bölümün içinde kartlar
 * FARKLI yüksekliklerde asılı (`data-drift` → `--urk-lift-1…5`), farklı
 * genişlikte (`data-span`) ve her biri kendi fazında salınıyor. Bölümlerin
 * altında hep aynı yerde görünmez bir "yer" çizgisi var ve kartların
 * hiçbiri ona değmiyor — değdikleri tek an mod düğmesinin çevrildiği an.
 *
 * ── SUNUCU / İSTEMCİ ─────────────────────────────────────────────────────
 * Sayfa SUNUCUDA çizilir. İki istemci adası var (üst sınır üç):
 *   GravityShell — "Zero Gravity" modu; etkisi yerleşim (`--urk-lift-*`,
 *                  `--urk-overlap`, `--urk-gap`, `--urk-display`)
 *   ReleaseField — "Release"; sayfanın kalbi
 * `UrarakaGlyphs` ada DEĞİL: durumu yok, yalnızca elle çizilmiş SVG taşıyor.
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * ── GÖRSELLER ────────────────────────────────────────────────────────────
 * Portre depoda (`kaynak.json`): 230×345, yani küçük — madalyon boyunda
 * kullanılıyor, hero olarak DEĞİL. Büyük hero karesi `urk:hero` yuvasında
 * bekliyor. Sahne görselleri characterId 89221 kaydının ABILITY yuvalarında
 * (`urk:*`); hiçbiri zorunlu değil, yoksa kadraj boş ama ayakta kalıyor.
 *
 * ⚠️ ZİYARETÇİNİN GÖRDÜĞÜ BOŞ KADRAJ YAZISIZ. Yuva etiketleri ve piksel
 * ölçüleri YALNIZCA `isAdmin` dalında çiziliyor — Dalga 1 denetiminde Levi
 * sayfasında üretim metadatası ziyaretçiye sızmıştı, bu sayfada boş
 * kadrajın içinde hiçbir metin yok.
 */
export function ZeroGravityExperience({
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
     AniList CDN'ine hotlink YOK (Faz 2 §3) — bu yüzden `primaryPortrait`
     yalnızca yükleme varken okunuyor. */
  const portraitUploaded = isUploadedPortrait(detail);
  const uploadedPortrait = portraitUploaded ? primaryPortrait(detail) : null;
  const portraitSrc = uploadedPortrait ?? URK_PORTRAIT.src;

  const heroScene = src(URK_IMAGE_KEYS.hero);
  const fieldScene = src(URK_IMAGE_KEYS.field);
  const classScene = src(URK_IMAGE_KEYS.classroom);
  const closingScene = src(URK_IMAGE_KEYS.closing);

  const name = detail.character.name || URK_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? URK_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? URK_SITE_URL;
  const companionSuffix = pick(URK_ALT.companionSuffix, locale);

  /* Adaya düz dize iniyor: `LocalizedText` istemci sınırını geçmiyor. */
  const releaseCards = URK_LIFTS.map((entry) => ({
    key: entry.key,
    numeral: entry.numeral,
    fallNumeral: entry.fallNumeral,
    floatOrder: entry.floatOrder,
    fallOrder: entry.fallOrder,
    title: pick(entry.title, locale),
    lifted: pick(entry.lifted, locale),
    cost: pick(entry.cost, locale),
    weight: pick(entry.weight, locale),
    span: entry.span,
    drift: entry.drift,
  }));

  const releaseUi = {
    release: pick(URK_FIELD_UI.release, locale),
    lift: pick(URK_FIELD_UI.lift, locale),
    stageLabel: pick(URK_FIELD_UI.stageLabel, locale),
    listLabel: pick(URK_FIELD_UI.listLabel, locale),
    stateFloating: pick(URK_FIELD_UI.stateFloating, locale),
    stateFallen: pick(URK_FIELD_UI.stateFallen, locale),
    liftedLabel: pick(URK_FIELD_UI.liftedLabel, locale),
    costLabel: pick(URK_FIELD_UI.costLabel, locale),
    orderLabel: pick(URK_FIELD_UI.orderLabel, locale),
    fallOrderLabel: pick(URK_FIELD_UI.fallOrderLabel, locale),
    weightLabel: pick(URK_FIELD_UI.weightLabel, locale),
    selectHint: pick(URK_FIELD_UI.selectHint, locale),
    liftCountLabel: pick(URK_FIELD_UI.liftCountLabel, locale),
    nausea: pick(URK_FIELD_UI.nausea, locale),
    closingNote: pick(URK_FIELD_UI.closingNote, locale),
  };

  /* Küratör özeti: yuvaların hepsi, sayfadaki sırayla. Portre satırı
     ABILITY değil PORTRAIT yuvasına bakıyor — `filled` ölçüsü de o yüzden
     `ability.has(...)` değil `portraitUploaded`. */
  const gapKeys = [
    URK_IMAGE_KEYS.hero,
    URK_IMAGE_KEYS.quirk,
    URK_IMAGE_KEYS.ultimate,
    URK_IMAGE_KEYS.release,
    URK_IMAGE_KEYS.gunhead,
    URK_IMAGE_KEYS.nausea,
    URK_IMAGE_KEYS.uravity,
    URK_IMAGE_KEYS.license,
    URK_IMAGE_KEYS.field,
    URK_IMAGE_KEYS.fateExam,
    URK_IMAGE_KEYS.fateFestival,
    URK_IMAGE_KEYS.fateGunhead,
    URK_IMAGE_KEYS.fateLicense,
    URK_IMAGE_KEYS.fateRyukyu,
    URK_IMAGE_KEYS.classroom,
    URK_IMAGE_KEYS.closing,
  ];
  const gapRows: CuratorGapRow[] = [
    {
      key: URK_PORTRAIT_SLOT_KEY,
      label: pick(URK_SLOT_LABELS[URK_PORTRAIT_SLOT_KEY], locale),
      spec: pick(URK_SLOT_SPECS[URK_PORTRAIT_SLOT_KEY], locale),
      filled: portraitUploaded,
    },
    ...gapKeys.map((key) => ({
      key,
      label: pick(URK_SLOT_LABELS[key], locale),
      spec: pick(URK_SLOT_SPECS[key], locale),
      filled: ability.has(key),
    })),
  ];

  return (
    <GravityShell
      label={pick(URK_GRAVITY_TEXT.label, locale)}
      toOn={pick(URK_GRAVITY_TEXT.toOn, locale)}
      toOff={pick(URK_GRAVITY_TEXT.toOff, locale)}
      stateOff={pick(URK_GRAVITY_TEXT.stateOff, locale)}
      stateOn={pick(URK_GRAVITY_TEXT.stateOn, locale)}
      hintOff={pick(URK_GRAVITY_TEXT.hintOff, locale)}
      hintOn={pick(URK_GRAVITY_TEXT.hintOn, locale)}
      watermark={URK_IDENTITY.watermark}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <span className={styles.crumbHere}>
            {pick(URK_CRUMB.series, locale)}
          </span>
        </nav>

        {/* ══ 1 · HERO ═══════════════════════════════════════════════════
            Portre madalyon boyunda (230×345 küçük bir kare) ve HAVADA;
            büyük hero karesi altta, küratör yuvası olarak. */}
        <section className={styles.band} aria-labelledby="urk-name">
          <PadMark index={0} className={styles.bandPad} />

          <div className={styles.heroTop}>
            <div className={styles.heroText}>
              <p className={styles.heroHouse}>
                {pick(URK_IDENTITY.house, locale)}
              </p>
              <h1 id="urk-name" className={styles.heroName}>
                {name}
              </h1>
              <p className={styles.heroNative} lang="ja" aria-hidden>
                {nativeName}
              </p>
              <p className={styles.heroAlias}>
                {URK_IDENTITY.heroName}
                <span className={styles.heroAliasNative} lang="ja">
                  {URK_IDENTITY.heroNameNative}
                </span>
              </p>
              <p className={styles.heroEpigraph}>
                {pick(URK_IDENTITY.epigraph, locale)}
              </p>
            </div>

            <div className={styles.heroPortraitCol}>
              <span className={styles.portraitFrame}>
                <Image
                  className={styles.portraitImage}
                  src={portraitSrc}
                  alt={pick(
                    portraitUploaded
                      ? URK_ALT.portraitUploaded
                      : URK_ALT.portraitLocal,
                    locale,
                  )}
                  width={URK_PORTRAIT.w}
                  height={URK_PORTRAIT.h}
                  priority
                />
                <span className={styles.portraitHalo} aria-hidden />
              </span>
              {isAdmin ? (
                <CuratorSlot
                  characterId={URK_ID}
                  slot="PORTRAIT"
                  label={pick(URK_SLOT_LABELS[URK_PORTRAIT_SLOT_KEY], locale)}
                  size={{ w: 1200, h: 1600 }}
                />
              ) : null}
            </div>
          </div>

          <p className={styles.heroLede}>{pick(URK_HERO.lede, locale)}</p>

          {/* Büyük hero karesi — boşken de duruyor, İÇİNDE METİN YOK */}
          <div
            className={styles.heroPlate}
            data-filled={heroScene ? "true" : "false"}
          >
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
              characterId={URK_ID}
              slot="ABILITY"
              abilityName={URK_IMAGE_KEYS.hero}
              label={pick(URK_SLOT_LABELS[URK_IMAGE_KEYS.hero], locale)}
              size={{ w: 1920, h: 1080 }}
            />
          ) : null}
          <p className={styles.plateCaption}>
            {pick(URK_HERO.heroFrameCaption, locale)}
          </p>

          <span className={styles.bandGround} aria-hidden />
          <p className={styles.groundCaption}>
            {pick(URK_HERO.groundCaption, locale)}
          </p>
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.band} aria-labelledby="urk-dossier">
          <PadMark index={1} className={styles.bandPad} />
          <header className={styles.bandHead}>
            <h2 id="urk-dossier" className={styles.bandTitle}>
              {pick(URK_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(URK_SECTIONS.identity.lede, locale)}
            </p>
          </header>

          <dl className={styles.facts}>
            {URK_IDENTITY.facts.map((fact, index) => (
              <div
                key={fact.label.tr}
                className={styles.fact}
                data-drift={(index % 5) + 1}
              >
                <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
                <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.factNote}>{pick(URK_RECORD_NOTE, locale)}</p>
          <span className={styles.bandGround} aria-hidden />
        </section>

        {/* ══ 3 · QUIRK LABORATUVARI — 3 büyük + 4 küçük ════════════════ */}
        <section className={styles.band} aria-labelledby="urk-quirk">
          <PadMark index={2} className={styles.bandPad} />
          <header className={styles.bandHead}>
            <h2 id="urk-quirk" className={styles.bandTitle}>
              {pick(URK_SECTIONS.quirk.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(URK_SECTIONS.quirk.lede, locale)}
            </p>
          </header>

          <ul className={styles.powers}>
            {URK_POWERS.map((power, index) => {
              const scene = src(power.imageKey);
              return (
                <li
                  key={power.key}
                  className={styles.power}
                  data-drift={index + 1}
                >
                  <div
                    className={styles.powerArt}
                    data-filled={scene ? "true" : "false"}
                  >
                    {scene ? (
                      <Image
                        src={scene}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 100vw, 420px"
                      />
                    ) : null}
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={URK_ID}
                      slot="ABILITY"
                      abilityName={power.imageKey}
                      label={pick(URK_SLOT_LABELS[power.imageKey], locale)}
                      size={{ w: 1200, h: 900 }}
                    />
                  ) : null}
                  <div className={styles.powerBody}>
                    <p className={styles.powerTerm}>{pick(power.term, locale)}</p>
                    <p className={styles.powerName}>{power.name}</p>
                    {power.native ? (
                      <p className={styles.powerNative} lang="ja">
                        {power.native}
                      </p>
                    ) : null}
                    <p className={styles.powerTagline}>
                      {pick(power.tagline, locale)}
                    </p>
                    <p className={styles.powerText}>{pick(power.text, locale)}</p>
                    <ul className={styles.powerTraits}>
                      {power.traits.map((trait) => (
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

          <ul className={styles.traitGrid}>
            {URK_TRAITS.map((item, index) => {
              const scene = src(item.imageKey);
              return (
                <li
                  key={item.key}
                  className={styles.traitCard}
                  data-drift={((index + 2) % 5) + 1}
                >
                  <div
                    className={styles.traitArt}
                    data-filled={scene ? "true" : "false"}
                  >
                    {scene ? (
                      <Image
                        src={scene}
                        alt=""
                        fill
                        sizes="(max-width: 700px) 50vw, 260px"
                      />
                    ) : null}
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={URK_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(URK_SLOT_LABELS[item.imageKey], locale)}
                      size={{ w: 800, h: 800 }}
                    />
                  ) : null}
                  <p className={styles.traitName}>{pick(item.name, locale)}</p>
                  <p className={styles.traitNote}>{pick(item.note, locale)}</p>
                </li>
              );
            })}
          </ul>
          <span className={styles.bandGround} aria-hidden />
        </section>

        {/* ══ 4 · BEŞ PED — sayfanın kalbi ═══════════════════════════════ */}
        <section className={styles.bandWide} aria-labelledby="urk-field">
          <PadMark index={3} className={styles.bandPad} />
          <header className={styles.bandHead}>
            <h2 id="urk-field" className={styles.bandTitle}>
              {pick(URK_SECTIONS.field.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(URK_SECTIONS.field.lede, locale)}
            </p>
          </header>

          <ReleaseField
            cards={releaseCards}
            ui={releaseUi}
            scene={fieldScene}
            slot={
              isAdmin ? (
                <CuratorSlot
                  characterId={URK_ID}
                  slot="ABILITY"
                  abilityName={URK_IMAGE_KEYS.field}
                  label={pick(URK_SLOT_LABELS[URK_IMAGE_KEYS.field], locale)}
                  size={{ w: 2100, h: 900 }}
                />
              ) : null
            }
          />
        </section>

        {/* ══ 5 · BEŞ DURAK ══════════════════════════════════════════════
            Çizelge bir ray değil bir İNİŞ: ilk durak en yüksekte, sonuncusu
            yer çizgisine değiyor (`data-altitude`). */}
        <section className={styles.band} aria-labelledby="urk-fate">
          <PadMark index={4} className={styles.bandPad} />
          <header className={styles.bandHead}>
            <h2 id="urk-fate" className={styles.bandTitle}>
              {pick(URK_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(URK_SECTIONS.fate.lede, locale)}
            </p>
          </header>

          <ol className={styles.fate}>
            {URK_TIMELINE.map((entry) => {
              const scene = src(entry.imageKey);
              return (
                <li
                  key={entry.key}
                  className={styles.fateItem}
                  data-altitude={entry.altitude}
                >
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
                      <Image
                        src={scene}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 100vw, 520px"
                      />
                    ) : null}
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={URK_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(URK_SLOT_LABELS[entry.imageKey], locale)}
                      size={{ w: 1440, h: 810 }}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
          <span className={styles.bandGround} aria-hidden />
        </section>

        {/* ══ 6 · AYNI SINIF — nexus bağları ════════════════════════════ */}
        <section className={styles.band} aria-labelledby="urk-bonds">
          <PadMark index={0} className={styles.bandPad} />
          <header className={styles.bandHead}>
            <h2 id="urk-bonds" className={styles.bandTitle}>
              {pick(URK_SECTIONS.bonds.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(URK_SECTIONS.bonds.lede, locale)}
            </p>
          </header>

          <div
            className={styles.classPlate}
            data-filled={classScene ? "true" : "false"}
          >
            {classScene ? (
              <Image
                src={classScene}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 1000px"
              />
            ) : null}
          </div>
          {isAdmin ? (
            <CuratorSlot
              characterId={URK_ID}
              slot="ABILITY"
              abilityName={URK_IMAGE_KEYS.classroom}
              label={pick(URK_SLOT_LABELS[URK_IMAGE_KEYS.classroom], locale)}
              size={{ w: 1600, h: 800 }}
            />
          ) : null}

          {/* ⚠️ Yoldaş portreleri BAŞKA karakterlerin kayıtlarından geliyor;
              altlarına yuva konmuyor, çünkü yükleme bu sayfanın kimliğine
              (89221) yazardı. Bu bölümün kendi kadrajı yukarıdaki şerit. */}
          <ul className={styles.bonds}>
            {URK_BONDS.map((bond, index) => {
              const face = faces.get(bond.characterId) ?? null;
              const linked = isExperienceCharacter(bond.characterId);
              return (
                <li
                  key={bond.characterId}
                  className={styles.bond}
                  data-drift={(index % 5) + 1}
                >
                  <span
                    className={styles.bondFace}
                    data-filled={face ? "true" : "false"}
                  >
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
                    <span className={styles.bondRole}>
                      {pick(bond.role, locale)}
                    </span>
                    <span className={styles.bondName}>
                      {linked ? (
                        <Link href={animeHref.character(bond.characterId)}>
                          {bond.name}
                        </Link>
                      ) : (
                        bond.name
                      )}
                    </span>
                    <span className={styles.bondNative} lang="ja" aria-hidden>
                      {bond.nativeName}
                    </span>
                    <span className={styles.bondNote}>
                      {pick(bond.note, locale)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          <span className={styles.bandGround} aria-hidden />
        </section>

        {/* ══ 7 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.band} aria-labelledby="urk-closing">
          <PadMark index={2} className={styles.bandPad} />
          <header className={styles.bandHead}>
            <h2 id="urk-closing" className={styles.bandTitle}>
              {pick(URK_SECTIONS.closing.title, locale)}
            </h2>
            <p className={styles.bandLede}>
              {pick(URK_SECTIONS.closing.lede, locale)}
            </p>
          </header>

          <div
            className={styles.closingPlate}
            data-filled={closingScene ? "true" : "false"}
          >
            {closingScene ? (
              <Image
                src={closingScene}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 1000px"
              />
            ) : null}
          </div>
          {isAdmin ? (
            <CuratorSlot
              characterId={URK_ID}
              slot="ABILITY"
              abilityName={URK_IMAGE_KEYS.closing}
              label={pick(URK_SLOT_LABELS[URK_IMAGE_KEYS.closing], locale)}
              size={{ w: 1600, h: 800 }}
            />
          ) : null}

          <ul className={styles.closingQuotes}>
            {URK_CLOSING.quotes.map((quote, index) => (
              <li key={quote.reading.tr} className={styles.closingItem} data-drift={index + 2}>
                <figure className={styles.closingQuote}>
                  <p className={styles.quoteKind}>{pick(quote.kind, locale)}</p>
                  {"text" in quote && quote.text ? (
                    <blockquote className={styles.quoteJa} lang="ja">
                      {quote.text}
                    </blockquote>
                  ) : null}
                  <p className={styles.quoteReading}>
                    {pick(quote.reading, locale)}
                  </p>
                  <figcaption>
                    <span className={styles.quoteBy}>{pick(quote.by, locale)}</span>
                    <span className={styles.quoteNote}>
                      {pick(quote.note, locale)}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <p className={styles.motto} lang="ja" aria-hidden>
            {URK_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(URK_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(URK_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(URK_CLOSING.creditLink, locale)}
            </a>
          </p>
          <span className={styles.bandGround} aria-hidden />
        </section>

        {/* ══ Küratör özeti — düzenleyicisiz, sayfanın EN ALTINDA ════════ */}
        {isAdmin ? (
          <CuratorGaps
            title={pick(URK_GAPS.title, locale)}
            emptyLabel={pick(URK_GAPS.empty, locale)}
            filledLabel={pick(URK_GAPS.filled, locale)}
            allFilledLabel={pick(URK_GAPS.allFilled, locale)}
            rows={gapRows}
          />
        ) : null}
      </CuratorFrame>
    </GravityShell>
  );
}
