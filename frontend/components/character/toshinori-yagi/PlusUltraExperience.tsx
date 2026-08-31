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
  ALM_ALT,
  ALM_BONDS,
  ALM_CLOSING,
  ALM_CRUMB,
  ALM_FORM_TEXT,
  ALM_GAPS,
  ALM_HERO,
  ALM_ID,
  ALM_IDENTITY,
  ALM_IMAGE_KEYS,
  ALM_METER_TOTAL,
  ALM_METER_UI,
  ALM_MISSING_NOTE,
  ALM_PORTRAIT,
  ALM_PORTRAIT_SLOT_KEY,
  ALM_POWERS,
  ALM_SECTIONS,
  ALM_SITE_URL,
  ALM_SLOT_LABELS,
  ALM_SLOT_SPECS,
  ALM_SMASHES,
  ALM_SPENDS,
  ALM_SYMBOL,
  ALM_TIMELINE,
} from "@/lib/characters/toshinori-yagi-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { CuratorGaps, type CuratorGapRow } from "@/components/character/CuratorGaps";
import { PlusUltraShell } from "./PlusUltraShell";
import { SmashMeter } from "./SmashMeter";
import styles from "./PlusUltraExperience.module.css";

/**
 * Toshinori Yagi / All Might — "Plus Ultra" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/89224 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: ALL MIGHT BİR FORM DEĞİL
 * BİR BÜTÇE.
 *
 * ── IZGARA: ÇİZGİ ROMAN PANELİ DÜZENİ ────────────────────────────────────
 * Sayfanın gövdesi bir çizgi roman SAYFASI. Bütün bölümler tek bir 12
 * sütunluk "kâğıt" (`.board`) üzerine oturan PANELLER; panellerin arası
 * kâğıt oluğu (gutter), kenarları kalın mürekkep konturu, içleri ben-day
 * nokta deseni. Panel genişlikleri eşit değil: splash (12), afiş (12),
 * künye (8) + sembol (4), laboratuvar (12), sayaç (12), çizelge (7) +
 * kadro (5), kapanış (12). 46rem altında hepsi tek sütuna iniyor.
 *
 * ── SUNUCU / İSTEMCİ ─────────────────────────────────────────────────────
 * Sayfa SUNUCUDA çizilir. İKİ istemci adası var (üst sınır üç):
 *   PlusUltraShell — mod düğmesi + süre bütçesi (context sağlayıcısı)
 *   SmashMeter     — kalan süre sayacı; sayfanın kalbi
 * `AllMightGlyphs` ada DEĞİL: durumu yok, yalnızca elle çizilmiş SVG
 * taşıyor. Metinler burada `pick` ile seçilip adalara DÜZ DİZE olarak iner.
 *
 * ── GÖRSELLER ────────────────────────────────────────────────────────────
 * Portre depoda (`kaynak.json`): 230×345, yani küçük — poster madalyonu
 * boyunda kullanılıyor, hero olarak DEĞİL. Büyük hero karesi MODA GÖRE
 * değişiyor: `alm:hero-golden` ↔ `alm:hero-true`. Sahne görselleri
 * characterId 89224 kaydının ABILITY yuvalarında (`alm:*`); hiçbiri zorunlu
 * değil, yoksa kadraj boş ama ayakta kalıyor.
 *
 * ⚠️ ZİYARETÇİYE ÜRETİM METNİ SIZMIYOR. Yuva etiketleri, piksel ölçüleri ve
 * "beklenen kare" satırlarının HEPSİ `isAdmin` dalında. Ziyaretçinin
 * gördüğü boş kadrajda tek kelime yazmıyor (Dalga 1 denetimi §1).
 */
export function PlusUltraExperience({
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
  const portraitSrc = uploadedPortrait ?? ALM_PORTRAIT.src;

  const heroGolden = src(ALM_IMAGE_KEYS.heroGolden);
  const heroTrue = src(ALM_IMAGE_KEYS.heroTrue);
  const meterScene = src(ALM_IMAGE_KEYS.meter);
  const bondsScene = src(ALM_IMAGE_KEYS.bonds);
  const closingScene = src(ALM_IMAGE_KEYS.closing);

  const name = detail.character.name || ALM_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? ALM_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? ALM_SITE_URL;
  const companionSuffix = pick(ALM_ALT.companionSuffix, locale);

  /* Adaya inen her şey DÜZ DİZE — `LocalizedText` istemci sınırını geçmiyor
     (SÖZLEŞME §1). */
  const spendItems = ALM_SPENDS.map((entry) => ({
    key: entry.key,
    cost: entry.cost,
    native: entry.native,
    title: pick(entry.title, locale),
    text: pick(entry.text, locale),
    after: pick(entry.after, locale),
  }));

  /* Küratör özeti: yuvaların hepsi, sayfadaki sırayla. Portre satırı ABILITY
     değil PORTRAIT yuvasına bakıyor — `filled` ölçüsü de o yüzden
     `ability.has(...)` değil `portraitUploaded`. */
  const gapKeys = [
    ALM_IMAGE_KEYS.heroGolden,
    ALM_IMAGE_KEYS.heroTrue,
    ALM_IMAGE_KEYS.ofa,
    ALM_IMAGE_KEYS.ultimate,
    ALM_IMAGE_KEYS.symbol,
    ALM_IMAGE_KEYS.detroit,
    ALM_IMAGE_KEYS.texas,
    ALM_IMAGE_KEYS.carolina,
    ALM_IMAGE_KEYS.oklahoma,
    ALM_IMAGE_KEYS.meter,
    ALM_IMAGE_KEYS.fateNana,
    ALM_IMAGE_KEYS.fateNumberOne,
    ALM_IMAGE_KEYS.fateWound,
    ALM_IMAGE_KEYS.fateSuccessor,
    ALM_IMAGE_KEYS.fateKamino,
    ALM_IMAGE_KEYS.bonds,
    ALM_IMAGE_KEYS.closing,
  ];
  const gapRows: CuratorGapRow[] = [
    {
      key: ALM_PORTRAIT_SLOT_KEY,
      label: pick(ALM_SLOT_LABELS[ALM_PORTRAIT_SLOT_KEY], locale),
      spec: pick(ALM_SLOT_SPECS[ALM_PORTRAIT_SLOT_KEY], locale),
      filled: portraitUploaded,
    },
    ...gapKeys.map((key) => ({
      key,
      label: pick(ALM_SLOT_LABELS[key], locale),
      spec: pick(ALM_SLOT_SPECS[key], locale),
      filled: ability.has(key),
    })),
  ];

  return (
    <PlusUltraShell
      isAdmin={isAdmin}
      total={ALM_METER_TOTAL}
      formLabel={pick(ALM_FORM_TEXT.label, locale)}
      formNative={ALM_FORM_TEXT.native}
      toGolden={pick(ALM_FORM_TEXT.toGolden, locale)}
      toTrue={pick(ALM_FORM_TEXT.toTrue, locale)}
      stateGolden={pick(ALM_FORM_TEXT.stateGolden, locale)}
      stateTrue={pick(ALM_FORM_TEXT.stateTrue, locale)}
      hintGolden={pick(ALM_FORM_TEXT.hintGolden, locale)}
      hintTrue={pick(ALM_FORM_TEXT.hintTrue, locale)}
      lockedTitle={pick(ALM_FORM_TEXT.lockedTitle, locale)}
      lockedText={pick(ALM_FORM_TEXT.locked, locale)}
      sectionTitle={pick(ALM_FORM_TEXT.sectionTitle, locale)}
      sectionLede={pick(ALM_FORM_TEXT.sectionLede, locale)}
      watermark={ALM_IDENTITY.watermark}
      crumb={
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <span className={styles.crumbHere}>
            {pick(ALM_CRUMB.series, locale)}
          </span>
        </nav>
      }
      hero={
        /* ══ 1 · HERO — sayfanın splash paneli ═══════════════════════════ */
        <section
          className={styles.panel}
          data-span="full"
          data-kind="splash"
          aria-labelledby="alm-name"
        >
          <span className={styles.ben} aria-hidden />
          <div className={styles.panelBody}>
            <div className={styles.heroTop}>
              <div className={styles.heroText}>
                <p className={styles.heroEyebrow}>
                  {pick(ALM_HERO.eyebrow, locale)}
                </p>
                <h1 id="alm-name" className={styles.heroName}>
                  {name}
                </h1>
                <p className={styles.heroHero}>
                  {ALM_IDENTITY.heroName}
                  <span className={styles.heroHeroNative} lang="ja" aria-hidden>
                    {ALM_IDENTITY.heroNameNative}
                  </span>
                </p>
                <p className={styles.heroNative} lang="ja" aria-hidden>
                  {nativeName}
                </p>
                <p className={styles.heroHouse}>
                  {pick(ALM_IDENTITY.house, locale)}
                </p>
                <p className={styles.heroEpigraph}>
                  {pick(ALM_IDENTITY.epigraph, locale)}
                </p>
              </div>

              <div className={styles.heroPortraitCol}>
                <span className={styles.portraitFrame}>
                  <Image
                    className={styles.portraitImage}
                    src={portraitSrc}
                    alt={pick(
                      portraitUploaded
                        ? ALM_ALT.portraitUploaded
                        : ALM_ALT.portraitLocal,
                      locale,
                    )}
                    width={ALM_PORTRAIT.w}
                    height={ALM_PORTRAIT.h}
                    priority
                  />
                </span>
                {isAdmin ? (
                  <CuratorSlot
                    characterId={ALM_ID}
                    slot="PORTRAIT"
                    label={pick(ALM_SLOT_LABELS[ALM_PORTRAIT_SLOT_KEY], locale)}
                    size={{ w: 1200, h: 1600 }}
                  />
                ) : null}
                <p className={styles.portraitCaption}>
                  {pick(ALM_HERO.portraitCaption, locale)}
                </p>
              </div>
            </div>

            <p className={styles.heroLede}>{pick(ALM_HERO.lede, locale)}</p>

            {/* İKİ hero karesi: hangisi görüneceğini kökteki `data-form`
                belirliyor (CSS). Küratör yuvası her kadrajın HEMEN ALTINDA;
                gerçek formun yuvasına ulaşmak için moda geçmek gerekiyor. */}
            <div
              className={styles.heroPlate}
              data-form-frame="golden"
              data-filled={heroGolden ? "true" : "false"}
            >
              {heroGolden ? (
                <Image
                  src={heroGolden}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 1120px"
                />
              ) : null}
              <span className={styles.heroPlateEdge} aria-hidden />
            </div>
            {isAdmin ? (
              <CuratorSlot
                characterId={ALM_ID}
                slot="ABILITY"
                abilityName={ALM_IMAGE_KEYS.heroGolden}
                label={pick(ALM_SLOT_LABELS[ALM_IMAGE_KEYS.heroGolden], locale)}
                size={{ w: 1920, h: 1080 }}
              />
            ) : null}

            <div
              className={styles.heroPlate}
              data-form-frame="true"
              data-filled={heroTrue ? "true" : "false"}
            >
              {heroTrue ? (
                <Image
                  src={heroTrue}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 1120px"
                />
              ) : null}
              <span className={styles.heroPlateEdge} aria-hidden />
            </div>
            {isAdmin ? (
              <CuratorSlot
                characterId={ALM_ID}
                slot="ABILITY"
                abilityName={ALM_IMAGE_KEYS.heroTrue}
                label={pick(ALM_SLOT_LABELS[ALM_IMAGE_KEYS.heroTrue], locale)}
                size={{ w: 1920, h: 1080 }}
              />
            ) : null}

            <p className={styles.plateCaption}>
              {pick(ALM_HERO.frameCaption, locale)}
            </p>
          </div>
        </section>
      }
    >
      {/* ══ 3 · KÜNYE — 8 sütunluk panel ═══════════════════════════════════ */}
      <section
        className={styles.panel}
        data-span="wide"
        aria-labelledby="alm-dossier"
      >
        <span className={styles.ben} aria-hidden />
        <div className={styles.panelBody}>
          <header className={styles.panelHead}>
            <h2 id="alm-dossier" className={styles.panelTitle}>
              {pick(ALM_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.panelLede}>
              {pick(ALM_SECTIONS.identity.lede, locale)}
            </p>
          </header>

          <dl className={styles.facts}>
            {ALM_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.factNote}>{pick(ALM_MISSING_NOTE, locale)}</p>
        </div>
      </section>

      {/* ══ 3b · SEMBOLİK İŞARET — 4 sütunluk dar panel ════════════════════ */}
      <section
        className={styles.panel}
        data-span="narrow"
        data-kind="mark"
        aria-labelledby="alm-symbol"
      >
        <span className={styles.ben} aria-hidden />
        <div className={styles.panelBody}>
          <h2 id="alm-symbol" className={styles.markTitle}>
            {pick(ALM_SYMBOL.title, locale)}
          </h2>
          <p className={styles.markKanji} lang="ja" aria-hidden>
            {ALM_SYMBOL.kanji}
          </p>
          <p className={styles.markReading}>{pick(ALM_SYMBOL.reading, locale)}</p>
          <p className={styles.markText}>{pick(ALM_SYMBOL.text, locale)}</p>
        </div>
      </section>

      {/* ══ 4 · GÜÇ KÜNYESİ — 3 büyük + 4 küçük ═══════════════════════════ */}
      <section
        className={styles.panel}
        data-span="full"
        aria-labelledby="alm-lab"
      >
        <span className={styles.ben} aria-hidden />
        <div className={styles.panelBody}>
          <header className={styles.panelHead}>
            <h2 id="alm-lab" className={styles.panelTitle}>
              {pick(ALM_SECTIONS.lab.title, locale)}
            </h2>
            <p className={styles.panelLede}>
              {pick(ALM_SECTIONS.lab.lede, locale)}
            </p>
          </header>

          <ul className={styles.powers}>
            {ALM_POWERS.map((power) => {
              const scene = src(power.imageKey);
              return (
                <li key={power.key} className={styles.power}>
                  <div
                    className={styles.powerArt}
                    data-filled={scene ? "true" : "false"}
                  >
                    {scene ? (
                      <Image
                        src={scene}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 100vw, 380px"
                      />
                    ) : null}
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={ALM_ID}
                      slot="ABILITY"
                      abilityName={power.imageKey}
                      label={pick(ALM_SLOT_LABELS[power.imageKey], locale)}
                      size={{ w: 1200, h: 900 }}
                    />
                  ) : null}
                  <p className={styles.powerKind}>{pick(power.kind, locale)}</p>
                  <h3 className={styles.powerName}>{power.name}</h3>
                  <p className={styles.powerNative} lang="ja" aria-hidden>
                    {power.native}
                  </p>
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
                </li>
              );
            })}
          </ul>

          <ul className={styles.smashes}>
            {ALM_SMASHES.map((smash) => {
              const scene = src(smash.imageKey);
              return (
                <li key={smash.key} className={styles.smash}>
                  <div
                    className={styles.smashArt}
                    data-filled={scene ? "true" : "false"}
                  >
                    {scene ? (
                      <Image
                        src={scene}
                        alt=""
                        fill
                        sizes="(max-width: 700px) 50vw, 240px"
                      />
                    ) : null}
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={ALM_ID}
                      slot="ABILITY"
                      abilityName={smash.imageKey}
                      label={pick(ALM_SLOT_LABELS[smash.imageKey], locale)}
                      size={{ w: 800, h: 800 }}
                    />
                  ) : null}
                  <p className={styles.smashName}>{smash.name}</p>
                  <p className={styles.smashNative} lang="ja" aria-hidden>
                    {smash.native}
                  </p>
                  <p className={styles.smashNote}>{pick(smash.note, locale)}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ══ 5 · KALAN SÜRE — sayfanın kalbi ═══════════════════════════════ */}
      <section
        className={styles.panel}
        data-span="full"
        data-kind="meter"
        aria-labelledby="alm-meter"
      >
        <span className={styles.ben} aria-hidden />
        <div className={styles.panelBody}>
          <header className={styles.panelHead}>
            <h2 id="alm-meter" className={styles.panelTitle}>
              {pick(ALM_SECTIONS.meter.title, locale)}
            </h2>
            <p className={styles.panelLede}>
              {pick(ALM_SECTIONS.meter.lede, locale)}
            </p>
          </header>

          <div
            className={styles.meterPlate}
            data-filled={meterScene ? "true" : "false"}
          >
            {meterScene ? (
              <Image
                src={meterScene}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 1120px"
              />
            ) : null}
          </div>
          {isAdmin ? (
            <CuratorSlot
              characterId={ALM_ID}
              slot="ABILITY"
              abilityName={ALM_IMAGE_KEYS.meter}
              label={pick(ALM_SLOT_LABELS[ALM_IMAGE_KEYS.meter], locale)}
              size={{ w: 2100, h: 900 }}
            />
          ) : null}

          <SmashMeter
            items={spendItems}
            budgetLabel={pick(ALM_METER_UI.budgetLabel, locale)}
            remainingLabel={pick(ALM_METER_UI.remainingLabel, locale)}
            unit={pick(ALM_METER_UI.unit, locale)}
            costLabel={pick(ALM_METER_UI.costLabel, locale)}
            spendLabel={pick(ALM_METER_UI.spendLabel, locale)}
            spentLabel={pick(ALM_METER_UI.spentLabel, locale)}
            overLabel={pick(ALM_METER_UI.overLabel, locale)}
            ledgerTitle={pick(ALM_METER_UI.ledgerTitle, locale)}
            ledgerEmpty={pick(ALM_METER_UI.ledgerEmpty, locale)}
            ledgerNote={pick(ALM_METER_UI.ledger, locale)}
            keyboardHint={pick(ALM_METER_UI.keyboardHint, locale)}
            emptyTitle={pick(ALM_METER_UI.emptyTitle, locale)}
            emptyText={pick(ALM_METER_UI.emptyText, locale)}
            statusPrefix={pick(ALM_METER_UI.statusPrefix, locale)}
            gaugeLabel={pick(ALM_METER_UI.gaugeLabel, locale)}
            closingNote={pick(ALM_METER_UI.closingNote, locale)}
          />
        </div>
      </section>

      {/* ══ 6 · BEŞ DURAK — 7 sütunluk uzun panel ═════════════════════════ */}
      <section
        className={styles.panel}
        data-span="tall"
        aria-labelledby="alm-fate"
      >
        <span className={styles.ben} aria-hidden />
        <div className={styles.panelBody}>
          <header className={styles.panelHead}>
            <h2 id="alm-fate" className={styles.panelTitle}>
              {pick(ALM_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.panelLede}>
              {pick(ALM_SECTIONS.fate.lede, locale)}
            </p>
          </header>

          <ol className={styles.fate}>
            {ALM_TIMELINE.map((entry) => {
              const scene = src(entry.imageKey);
              return (
                <li key={entry.key} className={styles.fateItem}>
                  <p className={styles.fateClock}>{pick(entry.clock, locale)}</p>
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
                        sizes="(max-width: 900px) 100vw, 460px"
                      />
                    ) : null}
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={ALM_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(ALM_SLOT_LABELS[entry.imageKey], locale)}
                      size={{ w: 1440, h: 810 }}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ══ 6b · KADRO — 5 sütunluk dar panel, nexus bağları ══════════════ */}
      <section
        className={styles.panel}
        data-span="side"
        data-kind="cast"
        aria-labelledby="alm-bonds"
      >
        <span className={styles.ben} aria-hidden />
        <div className={styles.panelBody}>
          <header className={styles.panelHead}>
            <h2 id="alm-bonds" className={styles.panelTitle}>
              {pick(ALM_SECTIONS.bonds.title, locale)}
            </h2>
            <p className={styles.panelLede}>
              {pick(ALM_SECTIONS.bonds.lede, locale)}
            </p>
          </header>

          <div
            className={styles.bondsPlate}
            data-filled={bondsScene ? "true" : "false"}
          >
            {bondsScene ? (
              <Image
                src={bondsScene}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 460px"
              />
            ) : null}
          </div>
          {isAdmin ? (
            <CuratorSlot
              characterId={ALM_ID}
              slot="ABILITY"
              abilityName={ALM_IMAGE_KEYS.bonds}
              label={pick(ALM_SLOT_LABELS[ALM_IMAGE_KEYS.bonds], locale)}
              size={{ w: 1600, h: 800 }}
            />
          ) : null}

          {/* ⚠️ Yoldaş portreleri BAŞKA karakterlerin kayıtlarından geliyor;
              altlarına yuva konmuyor, çünkü yükleme bu sayfanın kimliğine
              (89224) yazardı. Bu bölümün kendi kadrajı yukarıdaki şerit. */}
          <ul className={styles.bonds}>
            {ALM_BONDS.map((bond) => {
              const face = faces.get(bond.characterId) ?? null;
              const linked = isExperienceCharacter(bond.characterId);
              return (
                <li key={bond.characterId} className={styles.bond}>
                  <span
                    className={styles.bondFace}
                    data-filled={face ? "true" : "false"}
                  >
                    {face ? (
                      <Image
                        src={face}
                        alt={`${bond.name} ${companionSuffix}`}
                        fill
                        sizes="96px"
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
        </div>
      </section>

      {/* ══ 7 · KAPANIŞ ═══════════════════════════════════════════════════ */}
      <section
        className={styles.panel}
        data-span="full"
        data-kind="closing"
        aria-labelledby="alm-closing"
      >
        <span className={styles.ben} aria-hidden />
        <div className={styles.panelBody}>
          <header className={styles.panelHead}>
            <h2 id="alm-closing" className={styles.panelTitle}>
              {pick(ALM_SECTIONS.closing.title, locale)}
            </h2>
            <p className={styles.panelLede}>
              {pick(ALM_SECTIONS.closing.lede, locale)}
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
                sizes="(max-width: 900px) 100vw, 1120px"
              />
            ) : null}
          </div>
          {isAdmin ? (
            <CuratorSlot
              characterId={ALM_ID}
              slot="ABILITY"
              abilityName={ALM_IMAGE_KEYS.closing}
              label={pick(ALM_SLOT_LABELS[ALM_IMAGE_KEYS.closing], locale)}
              size={{ w: 1600, h: 800 }}
            />
          ) : null}

          <ul className={styles.closingQuotes}>
            {ALM_CLOSING.quotes.map((quote) => (
              <li key={quote.text}>
                <figure className={styles.closingQuote}>
                  <blockquote className={styles.quoteJa} lang="ja">
                    {quote.text}
                  </blockquote>
                  <p className={styles.quoteReading}>
                    {pick(quote.reading, locale)}
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

          <p className={styles.motto} lang="ja" aria-hidden>
            {ALM_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(ALM_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(ALM_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(ALM_CLOSING.creditLink, locale)}
            </a>
          </p>
        </div>
      </section>

      {/* ══ Küratör özeti — düzenleyicisiz, sayfanın EN ALTINDA ═══════════ */}
      {isAdmin ? (
        <div className={styles.gapsWrap}>
          <CuratorGaps
            title={pick(ALM_GAPS.title, locale)}
            emptyLabel={pick(ALM_GAPS.empty, locale)}
            filledLabel={pick(ALM_GAPS.filled, locale)}
            allFilledLabel={pick(ALM_GAPS.allFilled, locale)}
            rows={gapRows}
          />
        </div>
      ) : null}
    </PlusUltraShell>
  );
}
