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
  MIKASA_ANGLES,
  MIKASA_AWAKE,
  MIKASA_BONDS,
  MIKASA_CLOSING,
  MIKASA_COMPANION_SUFFIX,
  MIKASA_CRUMB,
  MIKASA_DIAL_UI,
  MIKASA_GAPS,
  MIKASA_GAP_ORDER,
  MIKASA_GEAR,
  MIKASA_HERO,
  MIKASA_ID,
  MIKASA_IDENTITY,
  MIKASA_IMAGE_KEYS,
  MIKASA_MISSING_NOTE,
  MIKASA_NOTES,
  MIKASA_PORTRAIT,
  MIKASA_SECTIONS,
  MIKASA_SITE_URL,
  MIKASA_SLOT_LABELS,
  MIKASA_SLOT_SIZES,
  MIKASA_SLOT_SPECS,
  MIKASA_TIMELINE,
  mikasaSceneAlt,
} from "@/lib/characters/mikasa-ackerman-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorGaps, type CuratorGapRow } from "@/components/character/CuratorGaps";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { AngleDial, type DialAngle } from "./AngleDial";
import { AwakeToggle } from "./AwakeToggle";
import { CableLink, ScarfKnot, WeaveField } from "./ScarfGlyphs";
import { ScarfShell } from "./ScarfShell";
import styles from "./ScarfExperience.module.css";

/**
 * Mikasa Ackerman — "Atkı" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/40881 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: KIRMIZI ATKI SAYFANIN TEK
 * SÜREKLİ ÇİZGİSİ. Sol kenardan aşağı inen o çizgi hiç kopmuyor; bütün
 * bölümler ona ODM kablolarıyla asılı ve sayfanın kalbindeki tek kontrol
 * (kanca açısı) o kabloların AÇISINI değiştiriyor.
 *
 * Sayfa SUNUCUDA çizilir. Üç istemci adası var — sözleşmenin izin verdiği
 * üst sınır:
 *   ScarfShell   — kök; `data-awake` + `--mks-angle`/`--mks-shift`
 *   AwakeToggle  — "Ackerman uyanışı" düğmesi (2. durak)
 *   AngleDial    — kanca açısı seçici (5. durak, sayfanın kalbi)
 * `ScarfGlyphs` istemci DEĞİL: durum tutmayan saf SVG çizimleri.
 *
 * ── PORTRE KARARI ────────────────────────────────────────────────────────
 * AniList'in resmî karesi 230×345 (depoda,
 * `public/assets/anime/karakterler/mikasa-ackerman/anilist-portrait.png`).
 * Bu ölçü tam kanama bir hero'ya yetmiyor, o yüzden portre yalnızca künye
 * madalyonunda duruyor ve `width`/`height` ile veriliyor. `unoptimized` YOK:
 * kaynak bizim. Küratör bir PORTRAIT yüklerse `primaryPortrait` onu
 * kazanıyor ve madalyon büyük kareyi gösteriyor.
 *
 * ── GÖRSELLER ────────────────────────────────────────────────────────────
 * Sahne kadrajlarının hepsi characterId 40881 kaydının ABILITY yuvaları
 * (`mks:*`). Yuva boşken kadraj BOŞ çiziliyor ve bölüm ayakta kalıyor —
 * sayfanın hiçbir bölümü görsele bağımlı değil. Her kadrajın HEMEN ALTINDA
 * kendi `CuratorSlot`u var; sayfa sonunda toplu yuva bloğu YOK, yalnızca
 * düzenleyicisiz `CuratorGaps` özeti duruyor.
 */
export function ScarfExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;
  const slotLabel = (key: string): string =>
    pick(MIKASA_SLOT_LABELS[key], locale);

  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc = portraitUploaded
    ? (primaryPortrait(detail) ?? MIKASA_PORTRAIT.src)
    : MIKASA_PORTRAIT.src;

  const name = detail.character.name || MIKASA_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? MIKASA_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? MIKASA_SITE_URL;
  const companionSuffix = pick(MIKASA_COMPANION_SUFFIX, locale);

  const heroBand = src(MIKASA_IMAGE_KEYS.hero);
  const scarfArt = src(MIKASA_IMAGE_KEYS.scarf);
  const closingArt = src(MIKASA_IMAGE_KEYS.closing);

  /* Açı seçicinin bütün metinleri burada düz dizeye çevriliyor: istemci
     adasına `LocalizedText` inmiyor (sözleşme). */
  const dialAngles: DialAngle[] = MIKASA_ANGLES.map((angle) => ({
    key: angle.key,
    deg: angle.deg,
    name: pick(angle.name, locale),
    readout: angle.readout,
    geometry: pick(angle.geometry, locale),
    scene: pick(angle.scene, locale),
    note: pick(angle.note, locale),
    imageKey: angle.imageKey,
    slotLabel: slotLabel(angle.imageKey),
    slotSize: MIKASA_SLOT_SIZES[angle.imageKey],
    image: src(angle.imageKey),
    imageAlt: mikasaSceneAlt(pick(angle.name, locale), name),
  }));

  const gapRows: CuratorGapRow[] = MIKASA_GAP_ORDER.map((key) => ({
    key,
    label: slotLabel(key),
    spec: pick(MIKASA_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  return (
    <ScarfShell
      angles={MIKASA_ANGLES.map((angle) => ({
        deg: angle.deg,
        shift: angle.shift,
      }))}
      initialIndex={1}
    >
      <CuratorFrame isAdmin={isAdmin}>
        {/* `.skin` filtreyi taşıyan katman — küratör hapı bunun DIŞINDA
            kalsın diye ayrı bir kutu (gerekçe: ScarfShell dosya başı). */}
        <div className={styles.skin}>
          {/* ══ ATKI ═══════════════════════════════════════════════════════
              Sayfanın sol kenarında, en üstten en alta inen tek çizgi.
              Hiçbir yerde kopmuyor; kalınlığı yalnızca uyanışla değişiyor. */}
          <span
            className={styles.rail}
            role="img"
            aria-label={pick(MIKASA_HERO.railLabel, locale)}
          >
            <span className={styles.railCore} aria-hidden />
            <ScarfKnot
              className={styles.railKnot}
              loopClassName={styles.railKnotLoop}
              tailClassName={styles.railKnotTail}
            />
          </span>

          <nav className={styles.crumb} aria-label="breadcrumb">
            <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
            <span className={styles.crumbSep} aria-hidden>
              ·
            </span>
            <span className={styles.crumbHere}>
              {pick(MIKASA_CRUMB.series, locale)}
            </span>
          </nav>

          {/* ══ 1 · HERO ═════════════════════════════════════════════════ */}
          <section className={styles.hero} aria-labelledby="mks-name">
            <WeaveField
              className={styles.heroWeave}
              warpClassName={styles.heroWeaveWarp}
              weftClassName={styles.heroWeaveWeft}
            />
            <p className={styles.heroMark} aria-hidden>
              {MIKASA_IDENTITY.watermark}
            </p>

            <div className={styles.heroBody}>
              <p className={styles.heroHouse}>
                {pick(MIKASA_IDENTITY.house, locale)}
              </p>
              <h1 id="mks-name" className={styles.heroName}>
                {name}
              </h1>
              <p className={styles.heroNative} lang="ja">
                {nativeName}
              </p>
              <p className={styles.heroEpigraph}>
                {pick(MIKASA_IDENTITY.epigraph, locale)}
              </p>
              <p className={styles.heroLede}>{pick(MIKASA_HERO.lede, locale)}</p>
            </div>

            <div className={styles.heroAside}>
              <span className={styles.heroPortrait}>
                <Image
                  className={styles.heroPortraitImg}
                  src={portraitSrc}
                  alt={pick(
                    portraitUploaded
                      ? MIKASA_HERO.portraitAltUploaded
                      : MIKASA_HERO.portraitAlt,
                    locale,
                  )}
                  width={MIKASA_PORTRAIT.w}
                  height={MIKASA_PORTRAIT.h}
                  priority
                />
              </span>
              {isAdmin ? (
                <div className={styles.slotRow}>
                  <CuratorSlot
                    characterId={MIKASA_ID}
                    slot="PORTRAIT"
                    label={pick(MIKASA_HERO.portraitAltUploaded, locale)}
                    size={{ w: 900, h: 1350 }}
                  />
                </div>
              ) : null}
            </div>

            {/* Geniş bant: portrenin yetmediği kadraj. Boşken de duruyor. */}
            <div className={styles.heroBand}>
              <span
                className={styles.frame}
                data-filled={heroBand ? "true" : "false"}
                data-shape="band"
              >
                {heroBand ? (
                  <Image
                    src={heroBand}
                    alt={pick(MIKASA_HERO.bandAlt, locale)}
                    fill
                    sizes="(max-width: 900px) 96vw, 1100px"
                    priority
                  />
                ) : (
                  <span className={styles.frameLabel}>
                    {pick(MIKASA_HERO.heroFrameNote, locale)}
                  </span>
                )}
              </span>
              {isAdmin ? (
                <div className={styles.slotRow}>
                  <CuratorSlot
                    characterId={MIKASA_ID}
                    slot="ABILITY"
                    abilityName={MIKASA_IMAGE_KEYS.hero}
                    label={slotLabel(MIKASA_IMAGE_KEYS.hero)}
                    size={MIKASA_SLOT_SIZES[MIKASA_IMAGE_KEYS.hero]}
                  />
                </div>
              ) : null}
            </div>
          </section>

          {/* ══ 2 · MOD DÜĞMESİ ══════════════════════════════════════════ */}
          <section className={styles.mode} aria-labelledby="mks-mode">
            <header className={styles.sectionHead}>
              <CableLink
                className={styles.sectionCable}
                pivotClassName={styles.sectionCablePivot}
                lineClassName={styles.sectionCableLine}
                tipClassName={styles.sectionCableTip}
                nodeClassName={styles.sectionCableNode}
              />
              <h2 id="mks-mode" className={styles.sectionTitle}>
                {pick(MIKASA_AWAKE.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(MIKASA_AWAKE.lede, locale)}
              </p>
            </header>

            <AwakeToggle
              enterLabel={pick(MIKASA_AWAKE.enter, locale)}
              exitLabel={pick(MIKASA_AWAKE.exit, locale)}
              stateLabel={pick(MIKASA_AWAKE.stateLabel, locale)}
              stateOn={pick(MIKASA_AWAKE.stateOn, locale)}
              stateOff={pick(MIKASA_AWAKE.stateOff, locale)}
              hintOn={pick(MIKASA_AWAKE.hintOn, locale)}
              hintOff={pick(MIKASA_AWAKE.hintOff, locale)}
            />
          </section>

          {/* ══ 3 · KÜNYE ŞERİDİ ═════════════════════════════════════════ */}
          <section className={styles.section} aria-labelledby="mks-identity">
            <header className={styles.sectionHead}>
              <CableLink
                className={styles.sectionCable}
                pivotClassName={styles.sectionCablePivot}
                lineClassName={styles.sectionCableLine}
                tipClassName={styles.sectionCableTip}
                nodeClassName={styles.sectionCableNode}
              />
              <h2 id="mks-identity" className={styles.sectionTitle}>
                {pick(MIKASA_SECTIONS.identity.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(MIKASA_SECTIONS.identity.lede, locale)}
              </p>
            </header>

            <dl className={styles.facts}>
              {MIKASA_IDENTITY.facts.map((fact) => (
                <div key={fact.label.tr} className={styles.fact}>
                  <dt>{pick(fact.label, locale)}</dt>
                  <dd>{pick(fact.value, locale)}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.factNote}>{pick(MIKASA_MISSING_NOTE, locale)}</p>

            {/* Üç bağ — arşivde kendi sayfası olanlar bağlantılı çiziliyor */}
            <h3 className={styles.bondsTitle}>
              {pick(MIKASA_SECTIONS.bonds.title, locale)}
            </h3>
            <p className={styles.bondsLede}>
              {pick(MIKASA_SECTIONS.bonds.lede, locale)}
            </p>
            <ul className={styles.bonds}>
              {MIKASA_BONDS.map((bond, index) => {
                const face = faces.get(bond.characterId) ?? null;
                const linked = isExperienceCharacter(bond.characterId);
                const body = (
                  <>
                    <span className={styles.bondFace}>
                      {face ? (
                        <Image
                          src={face}
                          alt={`${bond.name} ${companionSuffix}`}
                          fill
                          sizes="88px"
                        />
                      ) : (
                        <span className={styles.bondFaceMark} aria-hidden>
                          {bond.name.slice(0, 1)}
                        </span>
                      )}
                    </span>
                    <span className={styles.bondBody}>
                      <span className={styles.bondName}>{bond.name}</span>
                      <span className={styles.bondNative} lang="ja">
                        {bond.native}
                      </span>
                      <span className={styles.bondRole}>
                        {pick(bond.role, locale)}
                      </span>
                      <span className={styles.bondNote}>
                        {pick(bond.note, locale)}
                      </span>
                    </span>
                  </>
                );
                return (
                  <li
                    key={bond.key}
                    className={styles.bond}
                    style={{ ["--i" as string]: index }}
                  >
                    {linked ? (
                      <Link
                        className={styles.bondLink}
                        href={`/dark-stories/category/anime/karakterler/${bond.characterId}`}
                      >
                        {body}
                      </Link>
                    ) : (
                      <span className={styles.bondLink}>{body}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* ══ 4 · DONANIM ══════════════════════════════════════════════ */}
          <section className={styles.section} aria-labelledby="mks-gear">
            <header className={styles.sectionHead}>
              <CableLink
                className={styles.sectionCable}
                pivotClassName={styles.sectionCablePivot}
                lineClassName={styles.sectionCableLine}
                tipClassName={styles.sectionCableTip}
                nodeClassName={styles.sectionCableNode}
              />
              <h2 id="mks-gear" className={styles.sectionTitle}>
                {pick(MIKASA_SECTIONS.gear.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(MIKASA_SECTIONS.gear.lede, locale)}
              </p>
            </header>

            <ul className={styles.gear}>
              {MIKASA_GEAR.map((card, index) => {
                const scene = src(card.imageKey);
                return (
                  <li
                    key={card.key}
                    className={styles.gearItem}
                    style={{ ["--i" as string]: index }}
                  >
                    <span className={styles.gearKanji} lang="ja" aria-hidden>
                      {card.name}
                    </span>
                    <span className={styles.gearBody}>
                      <span className={styles.gearName} lang="ja">
                        {card.name}
                      </span>
                      <span className={styles.gearReading} aria-hidden>
                        {card.reading}
                      </span>
                      <span className={styles.gearTurkish}>
                        {pick(card.turkish, locale)}
                      </span>
                      <span className={styles.gearTagline}>
                        {pick(card.tagline, locale)}
                      </span>
                      <span className={styles.gearText}>
                        {pick(card.text, locale)}
                      </span>
                      <span className={styles.gearTraits}>
                        {card.traits.map((trait) => (
                          <span key={trait.tr} className={styles.trait}>
                            {pick(trait, locale)}
                          </span>
                        ))}
                      </span>
                    </span>

                    <span
                      className={styles.frame}
                      data-filled={scene ? "true" : "false"}
                      data-shape="card"
                    >
                      {scene ? (
                        <Image
                          src={scene}
                          alt={mikasaSceneAlt(pick(card.turkish, locale), name)}
                          fill
                          sizes="(max-width: 900px) 92vw, 380px"
                        />
                      ) : (
                        <span className={styles.frameLabel} lang="ja" aria-hidden>
                          {card.name}
                        </span>
                      )}
                    </span>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={MIKASA_ID}
                        slot="ABILITY"
                        abilityName={card.imageKey}
                        label={slotLabel(card.imageKey)}
                        size={MIKASA_SLOT_SIZES[card.imageKey]}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <ul className={styles.notes}>
              {MIKASA_NOTES.map((item, index) => {
                const scene = src(item.imageKey);
                return (
                  <li
                    key={item.key}
                    className={styles.note}
                    style={{ ["--i" as string]: index }}
                  >
                    <span
                      className={styles.frame}
                      data-filled={scene ? "true" : "false"}
                      data-shape="badge"
                    >
                      {scene ? (
                        <Image
                          src={scene}
                          alt={mikasaSceneAlt(pick(item.turkish, locale), name)}
                          fill
                          sizes="(max-width: 900px) 44vw, 220px"
                        />
                      ) : (
                        <span className={styles.frameLabel} lang="ja" aria-hidden>
                          {item.name}
                        </span>
                      )}
                    </span>
                    <span className={styles.noteName} lang="ja">
                      {item.name}
                    </span>
                    <span className={styles.noteReading} aria-hidden>
                      {item.reading}
                    </span>
                    <span className={styles.noteTurkish}>
                      {pick(item.turkish, locale)}
                    </span>
                    <span className={styles.noteText}>
                      {pick(item.note, locale)}
                    </span>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={MIKASA_ID}
                        slot="ABILITY"
                        abilityName={item.imageKey}
                        label={slotLabel(item.imageKey)}
                        size={MIKASA_SLOT_SIZES[item.imageKey]}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* ══ 5 · KANCA AÇISI — SAYFANIN KALBİ ═════════════════════════ */}
          <section className={styles.dialSection} aria-labelledby="mks-angle">
            <header className={styles.sectionHead}>
              <CableLink
                className={styles.sectionCable}
                pivotClassName={styles.sectionCablePivot}
                lineClassName={styles.sectionCableLine}
                tipClassName={styles.sectionCableTip}
                nodeClassName={styles.sectionCableNode}
              />
              <h2 id="mks-angle" className={styles.sectionTitle}>
                {pick(MIKASA_SECTIONS.angle.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(MIKASA_SECTIONS.angle.lede, locale)}
              </p>
            </header>

            <AngleDial
              angles={dialAngles}
              characterId={MIKASA_ID}
              isAdmin={isAdmin}
              groupLabel={pick(MIKASA_DIAL_UI.groupLabel, locale)}
              anchorLabel={pick(MIKASA_DIAL_UI.anchorLabel, locale)}
              anchorValue={pick(MIKASA_DIAL_UI.anchorValue, locale)}
              slopeLabel={pick(MIKASA_DIAL_UI.slopeLabel, locale)}
              activeLabel={pick(MIKASA_DIAL_UI.activeLabel, locale)}
              keyboardHint={pick(MIKASA_DIAL_UI.keyboardHint, locale)}
              diagramAlt={pick(MIKASA_DIAL_UI.diagramAlt, locale)}
            />
          </section>

          {/* ══ 6 · BEŞ DÜĞÜM ════════════════════════════════════════════ */}
          <section className={styles.section} aria-labelledby="mks-knots">
            <header className={styles.sectionHead}>
              <CableLink
                className={styles.sectionCable}
                pivotClassName={styles.sectionCablePivot}
                lineClassName={styles.sectionCableLine}
                tipClassName={styles.sectionCableTip}
                nodeClassName={styles.sectionCableNode}
              />
              <h2 id="mks-knots" className={styles.sectionTitle}>
                {pick(MIKASA_SECTIONS.knots.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(MIKASA_SECTIONS.knots.lede, locale)}
              </p>
            </header>

            <ol className={styles.knots}>
              {MIKASA_TIMELINE.map((knot, index) => {
                const scene = src(knot.imageKey);
                const face = knot.kin
                  ? (faces.get(knot.kin.characterId) ?? null)
                  : null;
                return (
                  <li
                    key={knot.key}
                    className={styles.knot}
                    style={{ ["--i" as string]: index }}
                  >
                    <p className={styles.knotAge}>{pick(knot.age, locale)}</p>
                    <div className={styles.knotBody}>
                      <h3 className={styles.knotTitle}>
                        {pick(knot.title, locale)}
                      </h3>
                      <p className={styles.knotText}>{pick(knot.text, locale)}</p>

                      {knot.quote ? (
                        <figure className={styles.knotQuote}>
                          <blockquote className={styles.knotQuoteJa} lang="ja">
                            {knot.quote.ja}
                          </blockquote>
                          <p className={styles.knotQuoteReading} aria-hidden>
                            {knot.quote.reading}
                          </p>
                          <p className={styles.knotQuoteMeaning}>
                            {pick(knot.quote.meaning, locale)}
                          </p>
                          <figcaption>
                            <span className={styles.knotQuoteBy}>
                              {pick(knot.quote.by, locale)}
                            </span>
                            <span className={styles.knotQuoteWhere}>
                              {pick(knot.quote.where, locale)}
                            </span>
                          </figcaption>
                        </figure>
                      ) : null}

                      {knot.kin ? (
                        <p className={styles.knotKin}>
                          {face ? (
                            <span className={styles.knotKinFace}>
                              <Image
                                src={face}
                                alt={`${knot.kin.name} ${companionSuffix}`}
                                fill
                                sizes="56px"
                              />
                            </span>
                          ) : null}
                          <span className={styles.knotKinName}>
                            {knot.kin.name}
                          </span>
                          <span className={styles.knotKinRole}>
                            {pick(knot.kin.role, locale)}
                          </span>
                        </p>
                      ) : null}
                    </div>

                    <span
                      className={styles.frame}
                      data-filled={scene ? "true" : "false"}
                      data-shape="knot"
                    >
                      {scene ? (
                        <Image
                          src={scene}
                          alt={mikasaSceneAlt(pick(knot.title, locale), name)}
                          fill
                          sizes="(max-width: 900px) 92vw, 460px"
                        />
                      ) : (
                        <span className={styles.frameLabel} aria-hidden>
                          {pick(knot.age, locale)}
                        </span>
                      )}
                    </span>
                    {isAdmin ? (
                      <CuratorSlot
                        characterId={MIKASA_ID}
                        slot="ABILITY"
                        abilityName={knot.imageKey}
                        label={slotLabel(knot.imageKey)}
                        size={MIKASA_SLOT_SIZES[knot.imageKey]}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ══ 7 · KAPANIŞ ══════════════════════════════════════════════ */}
          <section className={styles.closing} aria-labelledby="mks-closing">
            <header className={styles.sectionHead}>
              <CableLink
                className={styles.sectionCable}
                pivotClassName={styles.sectionCablePivot}
                lineClassName={styles.sectionCableLine}
                tipClassName={styles.sectionCableTip}
                nodeClassName={styles.sectionCableNode}
              />
              <h2 id="mks-closing" className={styles.sectionTitle}>
                {pick(MIKASA_SECTIONS.closing.title, locale)}
              </h2>
              <p className={styles.sectionLede}>
                {pick(MIKASA_SECTIONS.closing.lede, locale)}
              </p>
            </header>

            <div className={styles.closingScarf}>
              <span
                className={styles.frame}
                data-filled={scarfArt ? "true" : "false"}
                data-shape="badge"
              >
                {scarfArt ? (
                  <Image
                    src={scarfArt}
                    alt={pick(MIKASA_CLOSING.scarfAlt, locale)}
                    fill
                    sizes="(max-width: 900px) 60vw, 260px"
                  />
                ) : (
                  <ScarfKnot
                    className={styles.closingKnot}
                    loopClassName={styles.closingKnotLoop}
                    tailClassName={styles.closingKnotTail}
                  />
                )}
              </span>
              {isAdmin ? (
                <div className={styles.slotRow}>
                  <CuratorSlot
                    characterId={MIKASA_ID}
                    slot="ABILITY"
                    abilityName={MIKASA_IMAGE_KEYS.scarf}
                    label={slotLabel(MIKASA_IMAGE_KEYS.scarf)}
                    size={MIKASA_SLOT_SIZES[MIKASA_IMAGE_KEYS.scarf]}
                  />
                </div>
              ) : null}
            </div>

            <ul className={styles.closingQuotes}>
              {MIKASA_CLOSING.quotes.map((quote) => (
                <li key={quote.ja}>
                  <figure className={styles.closingQuote}>
                    <blockquote className={styles.quoteJa} lang="ja">
                      {quote.ja}
                    </blockquote>
                    <p className={styles.quoteReading} aria-hidden>
                      {quote.reading}
                    </p>
                    <p className={styles.quoteMeaning}>
                      {pick(quote.meaning, locale)}
                    </p>
                    <figcaption>
                      <span className={styles.quoteBy}>
                        {pick(quote.by, locale)}
                      </span>
                      <span className={styles.quoteNote}>
                        {pick(quote.note, locale)}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>

            <p className={styles.motto} lang="ja">
              {MIKASA_CLOSING.motto}
            </p>
            <p className={styles.mottoNote}>
              {pick(MIKASA_CLOSING.mottoNote, locale)}
            </p>

            <div className={styles.closingBand}>
              <span
                className={styles.frame}
                data-filled={closingArt ? "true" : "false"}
                data-shape="band"
              >
                {closingArt ? (
                  <Image
                    src={closingArt}
                    alt={pick(MIKASA_CLOSING.bandAlt, locale)}
                    fill
                    sizes="(max-width: 900px) 96vw, 1100px"
                  />
                ) : (
                  <span className={styles.frameLabel}>
                    {pick(MIKASA_CLOSING.bandNote, locale)}
                  </span>
                )}
              </span>
              {isAdmin ? (
                <div className={styles.slotRow}>
                  <CuratorSlot
                    characterId={MIKASA_ID}
                    slot="ABILITY"
                    abilityName={MIKASA_IMAGE_KEYS.closing}
                    label={slotLabel(MIKASA_IMAGE_KEYS.closing)}
                    size={MIKASA_SLOT_SIZES[MIKASA_IMAGE_KEYS.closing]}
                  />
                </div>
              ) : null}
            </div>

            <p className={styles.credit}>
              {pick(MIKASA_CLOSING.credit, locale)}{" "}
              <a href={siteUrl} target="_blank" rel="noreferrer noopener">
                {pick(MIKASA_CLOSING.creditLink, locale)}
              </a>
            </p>
            <p className={styles.sourceNote}>
              {pick(MIKASA_CLOSING.sourceNote, locale)}
            </p>
          </section>

          {isAdmin ? (
            <CuratorGaps
              title={pick(MIKASA_GAPS.title, locale)}
              emptyLabel={pick(MIKASA_GAPS.empty, locale)}
              filledLabel={pick(MIKASA_GAPS.filled, locale)}
              allFilledLabel={pick(MIKASA_GAPS.allFilled, locale)}
              rows={gapRows}
            />
          ) : null}
        </div>
      </CuratorFrame>
    </ScarfShell>
  );
}
