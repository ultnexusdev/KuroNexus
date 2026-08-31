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
  BAKUGO_ALT,
  BAKUGO_BONDS,
  BAKUGO_CLOSING,
  BAKUGO_CORES,
  BAKUGO_CRUMB,
  BAKUGO_GAPS,
  BAKUGO_HERO,
  BAKUGO_ID,
  BAKUGO_IDENTITY,
  BAKUGO_IMAGE_KEYS,
  BAKUGO_MISSING_NOTE,
  BAKUGO_MOVES,
  BAKUGO_NOTES,
  BAKUGO_PORTRAIT,
  BAKUGO_PORTRAIT_SLOT_KEY,
  BAKUGO_RECOIL_UI,
  BAKUGO_SECTIONS,
  BAKUGO_SITE_URL,
  BAKUGO_SLOT_LABELS,
  BAKUGO_SLOT_SPECS,
  BAKUGO_SWEAT_TEXT,
  BAKUGO_TIMELINE,
} from "@/lib/characters/katsuki-bakugou-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { CuratorGaps, type CuratorGapRow } from "@/components/character/CuratorGaps";
import { DetonationShell } from "./DetonationShell";
import { RecoilDeck } from "./RecoilDeck";
import { PalmSpark } from "./BakugouGlyphs";
import styles from "./DetonationExperience.module.css";

/**
 * Katsuki Bakugō — "Geri Tepme" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/88892 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: HER PATLAMA ONU DA SAVURUR.
 *
 * ── IZGARA: HAZARD ŞERİDİ ────────────────────────────────────────────────
 * Bölümler diagonal sarı-siyah uyarı bantlarıyla ayrılıyor ve hiçbiri
 * diğeriyle aynı genişlikte değil: `data-lane` her bloğa ayrı bir genişlik
 * ve ayrı bir kenar payı veriyor (`a` sola dayalı dar, `b` sağa dayalı orta,
 * `c` tam genişlik, `d` içeri kaçmış dar). Bütün köşeler keskin
 * (`border-radius: 0`).
 *
 * ⚠️ Uyarı ızgarası VARSAYILAN durumda da görünür. Mod düğmesi onu açıp
 * kapatmıyor, DERECESİNİ değiştiriyor (Dalga 1'in ikinci dersi).
 *
 * ── SUNUCU / İSTEMCİ ─────────────────────────────────────────────────────
 * Sayfa SUNUCUDA çizilir. İki istemci adası var (üst sınır üç):
 *   DetonationShell — "Nitrogliserin" modu + geri tepme durumu; kök
 *   RecoilDeck      — beş Ultimate Move; sayfanın kalbi
 * `BakugouGlyphs` ada DEĞİL: durumu yok, yalnızca elle çizilmiş SVG taşıyor.
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * ── GÖRSELLER ────────────────────────────────────────────────────────────
 * Portre depoda (`kaynak.json`): 230×345, yani küçük — künye kartının
 * yanında madalyon boyunda kullanılıyor, hero olarak DEĞİL. Büyük patlama
 * karesi `bkg:hero` yuvasında bekliyor. Sahne görselleri characterId 88892
 * kaydının ABILITY yuvalarında (`bkg:*`); hiçbiri zorunlu değil, yoksa
 * kadraj boş ama ayakta kalıyor.
 *
 * ⚠️ ZİYARETÇİ BOŞ KADRAJDA HİÇBİR YAZI GÖRMÜYOR. Yuva ölçüleri ve tip
 * açıklamaları YALNIZCA `isAdmin` dalında (`CuratorSlot` / `CuratorGaps`)
 * geçiyor — Dalga 1'in birinci dersi.
 */
export function DetonationExperience({
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
     AniList CDN'ine hotlink YOK (SÖZLEŞME §3) — bu yüzden
     `primaryPortrait` yalnızca yükleme varken okunuyor. */
  const portraitUploaded = isUploadedPortrait(detail);
  const uploadedPortrait = portraitUploaded ? primaryPortrait(detail) : null;
  const portraitSrc = uploadedPortrait ?? BAKUGO_PORTRAIT.src;

  const heroScene = src(BAKUGO_IMAGE_KEYS.hero);
  const stageScene = src(BAKUGO_IMAGE_KEYS.stage);
  const rivalsScene = src(BAKUGO_IMAGE_KEYS.rivals);
  const closingScene = src(BAKUGO_IMAGE_KEYS.closing);

  const name = detail.character.name || BAKUGO_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? BAKUGO_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? BAKUGO_SITE_URL;
  const companionSuffix = pick(BAKUGO_ALT.companionSuffix, locale);

  /* İstemci adasına LocalizedText inmez: beş teknik burada düz dizeye
     çevriliyor (SÖZLEŞME §1). */
  const deckMoves = BAKUGO_MOVES.map((move) => ({
    key: move.key,
    name: move.name,
    latin: move.latin,
    turkish: pick(move.turkish, locale),
    kick: move.kick,
    actionDir: pick(move.actionDir, locale),
    reactionDir: pick(move.reactionDir, locale),
    action: pick(move.action, locale),
    reaction: pick(move.reaction, locale),
    cost: pick(move.cost, locale),
  }));

  /* Küratör özeti: yuvaların hepsi, sayfadaki sırayla. Portre satırı
     ABILITY değil PORTRAIT yuvasına bakıyor — `filled` ölçüsü de o yüzden
     `ability.has(...)` değil `portraitUploaded`. */
  const gapKeys = [
    BAKUGO_IMAGE_KEYS.hero,
    BAKUGO_IMAGE_KEYS.quirk,
    BAKUGO_IMAGE_KEYS.drive,
    BAKUGO_IMAGE_KEYS.bracer,
    BAKUGO_IMAGE_KEYS.cardName,
    BAKUGO_IMAGE_KEYS.cardGrades,
    BAKUGO_IMAGE_KEYS.cardRead,
    BAKUGO_IMAGE_KEYS.cardOther,
    BAKUGO_IMAGE_KEYS.stage,
    BAKUGO_IMAGE_KEYS.fateQuirk,
    BAKUGO_IMAGE_KEYS.fateSchool,
    BAKUGO_IMAGE_KEYS.fateFestival,
    BAKUGO_IMAGE_KEYS.fateKamino,
    BAKUGO_IMAGE_KEYS.fateName,
    BAKUGO_IMAGE_KEYS.rivals,
    BAKUGO_IMAGE_KEYS.closing,
  ];
  const gapRows: CuratorGapRow[] = [
    {
      key: BAKUGO_PORTRAIT_SLOT_KEY,
      label: pick(BAKUGO_SLOT_LABELS[BAKUGO_PORTRAIT_SLOT_KEY], locale),
      spec: pick(BAKUGO_SLOT_SPECS[BAKUGO_PORTRAIT_SLOT_KEY], locale),
      filled: portraitUploaded,
    },
    ...gapKeys.map((key) => ({
      key,
      label: pick(BAKUGO_SLOT_LABELS[key], locale),
      spec: pick(BAKUGO_SLOT_SPECS[key], locale),
      filled: ability.has(key),
    })),
  ];

  return (
    <DetonationShell
      label={pick(BAKUGO_SWEAT_TEXT.label, locale)}
      toPrimed={pick(BAKUGO_SWEAT_TEXT.toPrimed, locale)}
      toDry={pick(BAKUGO_SWEAT_TEXT.toDry, locale)}
      stateDry={pick(BAKUGO_SWEAT_TEXT.stateDry, locale)}
      statePrimed={pick(BAKUGO_SWEAT_TEXT.statePrimed, locale)}
      hintDry={pick(BAKUGO_SWEAT_TEXT.hintDry, locale)}
      hintPrimed={pick(BAKUGO_SWEAT_TEXT.hintPrimed, locale)}
      watermark={BAKUGO_IDENTITY.watermark}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            /
          </span>
          <span className={styles.crumbHere}>
            {pick(BAKUGO_CRUMB.series, locale)}
          </span>
        </nav>

        {/* ══ 1 · HERO ═══════════════════════════════════════════════════
            Portre madalyon boyunda (230×345 küçük bir kare); büyük patlama
            karesi altta, küratör yuvası olarak. */}
        <section className={styles.slab} data-lane="a" aria-labelledby="bkg-name">
          <span className={styles.hazard} aria-hidden />

          <p className={styles.heroHouse}>{pick(BAKUGO_IDENTITY.house, locale)}</p>
          <h1 id="bkg-name" className={styles.heroName}>
            {name}
          </h1>
          <p className={styles.heroNative} lang="ja" aria-hidden>
            {nativeName}
          </p>
          <p className={styles.heroHeroName} lang="ja">
            {BAKUGO_IDENTITY.heroName}
          </p>
          <p className={styles.heroEpigraph}>
            {pick(BAKUGO_IDENTITY.epigraph, locale)}
          </p>

          {/* Büyük patlama karesi — boşken de duruyor, YAZISIZ */}
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
              characterId={BAKUGO_ID}
              slot="ABILITY"
              abilityName={BAKUGO_IMAGE_KEYS.hero}
              label={pick(BAKUGO_SLOT_LABELS[BAKUGO_IMAGE_KEYS.hero], locale)}
              size={{ w: 1920, h: 1080 }}
            />
          ) : null}
          <p className={styles.plateCaption}>
            {pick(BAKUGO_HERO.frameCaption, locale)}
          </p>

          <p className={styles.heroLede}>{pick(BAKUGO_HERO.lede, locale)}</p>
          <p className={styles.gridCaption}>
            {pick(BAKUGO_HERO.gridCaption, locale)}
          </p>
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.slab} data-lane="b" aria-labelledby="bkg-dossier">
          <span className={styles.hazard} aria-hidden />
          <header className={styles.slabHead}>
            <h2 id="bkg-dossier" className={styles.slabTitle}>
              {pick(BAKUGO_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.slabLede}>
              {pick(BAKUGO_SECTIONS.identity.lede, locale)}
            </p>
          </header>

          <div className={styles.dossier}>
            <div className={styles.portraitCol}>
              <span className={styles.portraitFrame}>
                <Image
                  className={styles.portraitImage}
                  src={portraitSrc}
                  alt={pick(
                    portraitUploaded
                      ? BAKUGO_ALT.portraitUploaded
                      : BAKUGO_ALT.portraitLocal,
                    locale,
                  )}
                  width={BAKUGO_PORTRAIT.w}
                  height={BAKUGO_PORTRAIT.h}
                  priority
                />
              </span>
              {isAdmin ? (
                <CuratorSlot
                  characterId={BAKUGO_ID}
                  slot="PORTRAIT"
                  label={pick(
                    BAKUGO_SLOT_LABELS[BAKUGO_PORTRAIT_SLOT_KEY],
                    locale,
                  )}
                  size={{ w: 1200, h: 1600 }}
                />
              ) : null}
              <p className={styles.nickname} lang="ja" aria-hidden>
                {BAKUGO_IDENTITY.nickname}
              </p>
            </div>

            <dl className={styles.facts}>
              {BAKUGO_IDENTITY.facts.map((fact) => (
                <div key={fact.label.tr} className={styles.fact}>
                  <dt>{pick(fact.label, locale)}</dt>
                  <dd>{pick(fact.value, locale)}</dd>
                </div>
              ))}
            </dl>

            <PalmSpark
              className={styles.palm}
              handClassName={styles.palmHand}
              sparkClassName={styles.palmSpark}
            />
          </div>
          <p className={styles.factNote}>{pick(BAKUGO_MISSING_NOTE, locale)}</p>
        </section>

        {/* ══ 3 · QUIRK LABORATUVARI — 3 büyük + 4 küçük ═════════════════ */}
        <section className={styles.slab} data-lane="c" aria-labelledby="bkg-quirk">
          <span className={styles.hazard} aria-hidden />
          <header className={styles.slabHead}>
            <h2 id="bkg-quirk" className={styles.slabTitle}>
              {pick(BAKUGO_SECTIONS.quirk.title, locale)}
            </h2>
            <p className={styles.slabLede}>
              {pick(BAKUGO_SECTIONS.quirk.lede, locale)}
            </p>
          </header>

          <ul className={styles.cores}>
            {BAKUGO_CORES.map((core) => {
              const scene = src(core.imageKey);
              return (
                <li key={core.key} className={styles.core}>
                  <div
                    className={styles.coreArt}
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
                    <span className={styles.coreScrim} aria-hidden />
                    <span className={styles.coreKanji} lang="ja" aria-hidden>
                      {core.name}
                    </span>
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={BAKUGO_ID}
                      slot="ABILITY"
                      abilityName={core.imageKey}
                      label={pick(BAKUGO_SLOT_LABELS[core.imageKey], locale)}
                      size={{ w: 1200, h: 900 }}
                    />
                  ) : null}
                  <div className={styles.coreBody}>
                    <p className={styles.coreName} lang="ja">
                      {core.name}
                    </p>
                    <p className={styles.coreReading} lang="ja" aria-hidden>
                      {core.reading}
                    </p>
                    <p className={styles.coreTurkish}>
                      {pick(core.turkish, locale)}
                    </p>
                    <p className={styles.coreTagline}>
                      {pick(core.tagline, locale)}
                    </p>
                    <p className={styles.coreText}>{pick(core.text, locale)}</p>
                    <ul className={styles.coreTraits}>
                      {core.traits.map((trait) => (
                        <li key={trait.tr} className={styles.trait}>
                          {pick(trait, locale)}
                        </li>
                      ))}
                    </ul>
                    <p className={styles.coreSource}>
                      {pick(core.source, locale)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <ul className={styles.notes}>
            {BAKUGO_NOTES.map((entry) => {
              const scene = src(entry.imageKey);
              return (
                <li key={entry.key} className={styles.note}>
                  <div
                    className={styles.noteArt}
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
                    <span className={styles.noteScrim} aria-hidden />
                    <span className={styles.noteKanji} lang="ja" aria-hidden>
                      {entry.kanji}
                    </span>
                  </div>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={BAKUGO_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(BAKUGO_SLOT_LABELS[entry.imageKey], locale)}
                      size={{ w: 800, h: 800 }}
                    />
                  ) : null}
                  <p className={styles.noteName}>{pick(entry.name, locale)}</p>
                  <p className={styles.noteText}>{pick(entry.note, locale)}</p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · GERİ TEPME — sayfanın kalbi ════════════════════════════ */}
        <section
          className={styles.slabWide}
          data-lane="c"
          aria-labelledby="bkg-recoil"
        >
          <span className={styles.hazard} aria-hidden />
          <header className={styles.slabHead}>
            <h2 id="bkg-recoil" className={styles.slabTitle}>
              {pick(BAKUGO_SECTIONS.recoil.title, locale)}
            </h2>
            <p className={styles.slabLede}>
              {pick(BAKUGO_SECTIONS.recoil.lede, locale)}
            </p>
          </header>

          <RecoilDeck
            moves={deckMoves}
            stage={stageScene}
            stageAlt={pick(BAKUGO_RECOIL_UI.stageLabel, locale)}
            slot={
              isAdmin ? (
                <CuratorSlot
                  characterId={BAKUGO_ID}
                  slot="ABILITY"
                  abilityName={BAKUGO_IMAGE_KEYS.stage}
                  label={pick(
                    BAKUGO_SLOT_LABELS[BAKUGO_IMAGE_KEYS.stage],
                    locale,
                  )}
                  size={{ w: 2100, h: 900 }}
                />
              ) : null
            }
            listLabel={pick(BAKUGO_RECOIL_UI.listLabel, locale)}
            fireHint={pick(BAKUGO_RECOIL_UI.fireHint, locale)}
            keyboardHint={pick(BAKUGO_RECOIL_UI.keyboardHint, locale)}
            release={pick(BAKUGO_RECOIL_UI.release, locale)}
            actionLabel={pick(BAKUGO_RECOIL_UI.actionLabel, locale)}
            reactionLabel={pick(BAKUGO_RECOIL_UI.reactionLabel, locale)}
            costLabel={pick(BAKUGO_RECOIL_UI.costLabel, locale)}
            idleTitle={pick(BAKUGO_RECOIL_UI.idleTitle, locale)}
            idleText={pick(BAKUGO_RECOIL_UI.idleText, locale)}
            statusFired={pick(BAKUGO_RECOIL_UI.statusFired, locale)}
            statusReleased={pick(BAKUGO_RECOIL_UI.statusReleased, locale)}
            closingNote={pick(BAKUGO_RECOIL_UI.closingNote, locale)}
          />
        </section>

        {/* ══ 5 · BEŞ DURAK ══════════════════════════════════════════════ */}
        <section className={styles.slab} data-lane="a" aria-labelledby="bkg-fate">
          <span className={styles.hazard} aria-hidden />
          <header className={styles.slabHead}>
            <h2 id="bkg-fate" className={styles.slabTitle}>
              {pick(BAKUGO_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.slabLede}>
              {pick(BAKUGO_SECTIONS.fate.lede, locale)}
            </p>
          </header>

          <ol className={styles.fate}>
            {BAKUGO_TIMELINE.map((entry) => {
              const scene = src(entry.imageKey);
              return (
                <li
                  key={entry.key}
                  className={styles.fateItem}
                  data-lane={entry.lane}
                >
                  <p className={styles.fateStage}>{pick(entry.stage, locale)}</p>
                  <h3 className={styles.fateTitle}>{pick(entry.title, locale)}</h3>
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
                      characterId={BAKUGO_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(BAKUGO_SLOT_LABELS[entry.imageKey], locale)}
                      size={{ w: 1440, h: 810 }}
                    />
                  ) : null}
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
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 6 · KARŞISINDAKİLER — nexus bağları ════════════════════════ */}
        <section className={styles.slab} data-lane="b" aria-labelledby="bkg-bonds">
          <span className={styles.hazard} aria-hidden />
          <header className={styles.slabHead}>
            <h2 id="bkg-bonds" className={styles.slabTitle}>
              {pick(BAKUGO_SECTIONS.bonds.title, locale)}
            </h2>
            <p className={styles.slabLede}>
              {pick(BAKUGO_SECTIONS.bonds.lede, locale)}
            </p>
          </header>

          <div
            className={styles.rivalsPlate}
            data-filled={rivalsScene ? "true" : "false"}
          >
            {rivalsScene ? (
              <Image
                src={rivalsScene}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 1000px"
              />
            ) : null}
          </div>
          {isAdmin ? (
            <CuratorSlot
              characterId={BAKUGO_ID}
              slot="ABILITY"
              abilityName={BAKUGO_IMAGE_KEYS.rivals}
              label={pick(BAKUGO_SLOT_LABELS[BAKUGO_IMAGE_KEYS.rivals], locale)}
              size={{ w: 1600, h: 800 }}
            />
          ) : null}

          {/* ⚠️ Yoldaş portreleri BAŞKA karakterlerin kayıtlarından geliyor;
              altlarına yuva konmuyor, çünkü yükleme bu sayfanın kimliğine
              (88892) yazardı. Bu bölümün kendi kadrajı yukarıdaki şerit. */}
          <ul className={styles.bonds}>
            {BAKUGO_BONDS.map((bond) => {
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
        </section>

        {/* ══ 7 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.slab} data-lane="d" aria-labelledby="bkg-closing">
          <span className={styles.hazard} aria-hidden />
          <header className={styles.slabHead}>
            <h2 id="bkg-closing" className={styles.slabTitle}>
              {pick(BAKUGO_SECTIONS.closing.title, locale)}
            </h2>
            <p className={styles.slabLede}>
              {pick(BAKUGO_SECTIONS.closing.lede, locale)}
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
              characterId={BAKUGO_ID}
              slot="ABILITY"
              abilityName={BAKUGO_IMAGE_KEYS.closing}
              label={pick(BAKUGO_SLOT_LABELS[BAKUGO_IMAGE_KEYS.closing], locale)}
              size={{ w: 1600, h: 800 }}
            />
          ) : null}

          <ul className={styles.closingQuotes}>
            {BAKUGO_CLOSING.quotes.map((quote) => (
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
            {BAKUGO_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(BAKUGO_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(BAKUGO_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(BAKUGO_CLOSING.creditLink, locale)}
            </a>
          </p>
        </section>

        {/* ══ Küratör özeti — düzenleyicisiz, sayfanın EN ALTINDA ════════ */}
        {isAdmin ? (
          <CuratorGaps
            title={pick(BAKUGO_GAPS.title, locale)}
            emptyLabel={pick(BAKUGO_GAPS.empty, locale)}
            filledLabel={pick(BAKUGO_GAPS.filled, locale)}
            allFilledLabel={pick(BAKUGO_GAPS.allFilled, locale)}
            rows={gapRows}
          />
        ) : null}
      </CuratorFrame>
    </DetonationShell>
  );
}
