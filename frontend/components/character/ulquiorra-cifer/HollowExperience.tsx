import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick, type LocalizedText } from "@/lib/characters/types";
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
  ULQ_ALT,
  ULQ_ANSWERS,
  ULQ_BONDS,
  ULQ_BOND_UI,
  ULQ_CLOSING,
  ULQ_CRUMB,
  ULQ_FRAME_EMPTY,
  ULQ_GAPS,
  ULQ_HEART_UI,
  ULQ_HERO,
  ULQ_HOLE_FACT,
  ULQ_ID,
  ULQ_IDENTITY,
  ULQ_IMAGE_KEYS,
  ULQ_MINORS,
  ULQ_MISSING_NOTE,
  ULQ_MODE,
  ULQ_PORTRAIT,
  ULQ_PORTRAIT_SLOT,
  ULQ_POWERS,
  ULQ_SECTIONS,
  ULQ_SITE_URL,
  ULQ_SLOT_LABELS,
  ULQ_SLOT_SIZES,
  ULQ_SLOT_SPECS,
  ULQ_TIMELINE,
  ULQ_WORLD_LINKS,
} from "@/lib/characters/ulquiorra-cifer-experience";
import { HeartKey } from "./HeartKey";
import { HollowShell } from "./HollowShell";
import { HelmShard, VoidRing, WingOutline } from "./UlquiorraGlyphs";
import styles from "./HollowExperience.module.css";

/**
 * Ulquiorra Cifer — "Boşluk" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/1081 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: DELİK BİR METAFOR DEĞİL,
 * IZGARANIN GERÇEK BİR PARÇASI.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Bu dalganın en boş sayfası. Ortadaki grid kolonu BOŞ ve bölümler onun
 * etrafından dolanıyor: soldakiler 1. kolonda, sağdakiler 3. kolonda ve
 * sağ sütun bir adım aşağı kaydırılmış, yani simetrik bir iki kolon değil
 * kasıtlı olarak dengesiz bir negatif alan. Kutu, gölge, dolgu yok; ayrım
 * her yerde bir saç çizgisi. Başlıklar Cormorant 300 ile ÇOK büyük ve çok
 * ince, harf aralığı geniş; gövde Inter ile küçük ve normal ağırlıkta.
 *
 * ⚠️ Gövde neden 300 DEĞİL: `--text-primary` ince kesimde ve küçük puntoda
 * okunaksızlaşıyor. İnce kesim yalnızca 1.9rem'in üstündeki başlıklarda
 * (WCAG'nin büyük metin eşiği); gövde 400'de kalıyor.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (madalyon portre + BOŞ hero kadrajı + halka filigranı)
 *   2 mod düğmesi — "Kalp nerede?" (`HollowShell` içinde, state orada)
 *   3 künye şeridi (on satır, ikisi bilerek boş) + deliğin kendi satırı
 *   4 güç laboratuvarı: üç büyük (Hierro / Murciélago / Segunda Etapa) +
 *     dört küçük (Cero Oscuras / Bala / Sonído / Pesquisa)
 *   5 kalp — SAYFANIN KALBİ; defter burada, mekanizma ızgaranın ortasında
 *   6 kader çizelgesi (beş durak, dönem etiketli)
 *   7 bağlar + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   HollowShell — kök öğe, "Kalp nerede?" modu, delik ve yutma perdesi
 *   HeartKey    — bölümlerin içindeki cevap düğmesi
 * `UlquiorraGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca madalyon
 * kadrajında). On altı kadrajın hepsi BOŞ ve küratör yuvası olarak duruyor;
 * her kadrajın HEMEN ALTINDA kendi yuvası var.
 *
 * ⚠️ BOŞ KADRAJ ZİYARETÇİDE KUTU DEĞİL. Bu sayfanın konusu boşluk: dolmamış
 * bir kadraj sıradan ziyaretçide etiketsiz, çerçevesiz, YAZISIZ bir aralık
 * olarak duruyor (`frameGap`). Üretim metadatası ("geniş kadraj · 1600×900 ·
 * webp") yalnızca yöneticide — dalga 1'in birinci dersi.
 */
export function HollowExperience({
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
     kare. İkisi de bizim kaynağımız, o yüzden `unoptimized` hiç yazılmıyor
     (FAZ 2 §3). AniList'e hotlink YOK. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? ULQ_PORTRAIT.src;

  const name = detail.character.name || ULQ_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? ULQ_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? ULQ_SITE_URL;

  const gapRows: CuratorGapRow[] = Object.values(ULQ_IMAGE_KEYS).map((key) => ({
    key,
    label: pick(ULQ_SLOT_LABELS[key], locale),
    spec: pick(ULQ_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  /* Cevaplar istemci adasına DÜZ DİZE olarak iniyor (FAZ 2 §1). */
  const answers = ULQ_ANSWERS.map((answer) => ({
    key: answer.key,
    glyph: answer.glyph,
    romaji: answer.romaji,
    label: pick(answer.label, locale),
    note: pick(answer.note, locale),
  }));

  /** Bölümün sonundaki cevap düğmesi — mekaniğin bölüm ucundaki yarısı. */
  const heartKeyFor = (index: number) => {
    const answer = ULQ_ANSWERS[index];
    return (
      <HeartKey
        answerKey={answer.key}
        glyph={answer.glyph}
        romaji={answer.romaji}
        label={pick(answer.label, locale)}
        press={pick(answer.press, locale)}
        note={pick(answer.note, locale)}
        givenLabel={pick(ULQ_HEART_UI.given, locale)}
        takeBackLabel={pick(ULQ_HEART_UI.takeBack, locale)}
      />
    );
  };

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * ⚠️ Üç ayrı hâl var ve ortadaki bu sayfanın kimliği:
   *   · görsel VAR      → kadraj çiziliyor, üstüne perdeli kaynak künyesi
   *   · görsel YOK + yönetici → boş kadraj + teknik künye + yükleme yuvası
   *   · görsel YOK + ziyaretçi → SADECE ARALIK. Kutu yok, kenarlık yok,
   *     yazı yok. Boşluk zaten sayfanın konusu; etiketli bir yer tutucu
   *     hem kilidi ("yer tutucu kutu çizme") hem dalga 1'in birinci dersini
   *     çiğnerdi.
   */
  const frame = (key: string, shapeClass: string) => {
    const scene = src(key);

    if (!scene && !isAdmin) {
      return <span className={styles.frameGap} aria-hidden />;
    }

    return (
      <>
        <div className={styles.frameSlot}>
          <figure className={`${styles.frameFigure} ${shapeClass}`}>
            {scene ? (
              <>
                <Image
                  className={styles.frameImg}
                  src={scene}
                  alt={`${pick(ULQ_ALT.scenePrefix, locale)} ${pick(
                    ULQ_SLOT_LABELS[key],
                    locale,
                  )}`}
                  fill
                  sizes="(max-width: 62rem) 92vw, 34rem"
                />
                {/* ⚠️ Yüklenen görselin ÜSTÜNDEKİ metne perde (dalga 1'in ek
                    dersi): kaynak künyesi kadrajın içinde duruyor ve altında
                    bir degrade var, yoksa açık bir karede okunmuyor. */}
                <figcaption className={styles.frameCredit}>
                  <span className={styles.frameScrim} aria-hidden />
                  <span className={styles.frameCreditText}>
                    {pick(ULQ_HERO.frameCredit, locale)}
                  </span>
                </figcaption>
              </>
            ) : (
              /* Yalnızca yöneticide — üretim metadatası ziyaretçiye sızmaz */
              <figcaption className={styles.frameCaption} data-curator-slot>
                <span className={styles.frameCaptionWord}>
                  {pick(ULQ_FRAME_EMPTY, locale)}
                </span>
                <span className={styles.frameCaptionSpec}>
                  {pick(ULQ_SLOT_SPECS[key], locale)}
                </span>
              </figcaption>
            )}
          </figure>
        </div>
        {isAdmin ? (
          <CuratorSlot
            characterId={ULQ_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(ULQ_SLOT_LABELS[key], locale)}
            size={ULQ_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /** Bölümün soru satırı — varsayılanda da sayfada, modda öne çıkıyor. */
  const ask = (text: LocalizedText) => (
    <p className={styles.ask}>
      <span className={styles.askLabel} aria-hidden>
        ?
      </span>
      {pick(text, locale)}
    </p>
  );

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran bu sayfada ayrı bir nesne DEĞİL: boşluğun kendisi. Hero'da
     yalnızca ad, künye satırı ve madalyon var; halka ızgaranın ortasında
     duruyor ve sayfa boyunca orada kalıyor. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>{pick(ULQ_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="ulq-name">
        <p className={styles.heroEyebrow}>{pick(ULQ_HERO.eyebrow, locale)}</p>

        <h1 id="ulq-name" className={styles.heroName}>
          {name}
        </h1>

        <p className={styles.heroNative} lang="ja">
          {nativeName}
        </p>
        <p className={styles.heroAlt}>{pick(ULQ_IDENTITY.altName, locale)}</p>

        <span className={styles.heroRule} aria-hidden />

        <p className={styles.heroLede}>{pick(ULQ_HERO.lede, locale)}</p>

        {/* Madalyon portre — 230×345, yani KÜÇÜK: tam kanama bir hero olarak
            kullanılmıyor, dar bir kadrajda duruyor. */}
        <figure className={styles.portrait}>
          <Image
            className={styles.portraitImg}
            src={portraitSrc}
            alt={pick(
              portraitUploaded
                ? ULQ_HERO.portraitAltUploaded
                : ULQ_HERO.portraitAlt,
              locale,
            )}
            width={ULQ_PORTRAIT.w}
            height={ULQ_PORTRAIT.h}
            priority
          />
          <figcaption className={styles.portraitCap}>
            {ULQ_IDENTITY.aspect}
            <span className={styles.portraitCapReading}>
              {pick(ULQ_IDENTITY.aspectReading, locale)}
            </span>
          </figcaption>
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={ULQ_ID}
            slot="PORTRAIT"
            label={pick(ULQ_PORTRAIT_SLOT, locale)}
            size={{ w: 1200, h: 1600 }}
          />
        ) : null}

        {/* Büyük hero karesi bilerek BOŞ. Gerekçe üretim bilgisi olduğu için
            yalnızca yöneticide yazılı; ziyaretçi yalnızca boşluğu görüyor. */}
        {isAdmin && !src(ULQ_IMAGE_KEYS.hero) ? (
          <p className={styles.heroFrameNote} data-curator-slot>
            {pick(ULQ_HERO.heroCaption, locale)}
          </p>
        ) : null}
        {frame(ULQ_IMAGE_KEYS.hero, styles.frameTall)}
      </section>
    </>
  );

  return (
    <HollowShell
      isAdmin={isAdmin}
      answers={answers}
      modeTitle={pick(ULQ_MODE.title, locale)}
      modeNative={ULQ_MODE.native}
      modeEnter={pick(ULQ_MODE.enter, locale)}
      modeExit={pick(ULQ_MODE.exit, locale)}
      modeHintOn={pick(ULQ_MODE.hintOn, locale)}
      modeHintOff={pick(ULQ_MODE.hintOff, locale)}
      holeLabel={pick(ULQ_HEART_UI.holeLabel, locale)}
      holeGlyph={ULQ_HEART_UI.glyph}
      holeGlyphReading={pick(ULQ_HEART_UI.glyphReading, locale)}
      counterLabel={pick(ULQ_HEART_UI.counter, locale)}
      resetLabel={pick(ULQ_HEART_UI.resetLabel, locale)}
      statusGiven={pick(ULQ_HEART_UI.statusGiven, locale)}
      statusTaken={pick(ULQ_HEART_UI.statusTaken, locale)}
      statusReset={pick(ULQ_HEART_UI.statusReset, locale)}
      swallowTitle={pick(ULQ_HEART_UI.swallowTitle, locale)}
      swallowLine={pick(ULQ_HEART_UI.swallowLine, locale)}
      swallowUndo={pick(ULQ_HEART_UI.swallowUndo, locale)}
      swallowReset={pick(ULQ_HEART_UI.swallowReset, locale)}
      ring={
        <VoidRing
          className={styles.ringArt}
          outerClassName={styles.ringOuter}
          innerClassName={styles.ringInner}
          tickClassName={styles.ringTick}
        />
      }
      hero={hero}
    >
      {/* ══ 3 · KÜNYE ŞERİDİ ════════════════════════════════════════════════
          Kutu yok: her satır bir saç çizgisiyle ayrılıyor. İki satır (yaş,
          kan grubu) bilerek boş — AniList'te ikisi de yok. */}
      <section
        className={`${styles.section} ${styles.left}`}
        aria-labelledby="ulq-identity"
      >
        <h2 id="ulq-identity" className={styles.sectionTitle}>
          {pick(ULQ_SECTIONS.identity.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(ULQ_SECTIONS.identity.lede, locale)}
        </p>
        {ask(ULQ_SECTIONS.identity.ask)}

        <dl className={styles.facts}>
          {ULQ_IDENTITY.facts.map((fact) => (
            <div key={fact.label.tr} className={styles.fact}>
              <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
              <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.factNote}>{pick(ULQ_MISSING_NOTE, locale)}</p>

        {/* Deliğin kendi satırı — bir künye satırına sığmadığı için ayrı */}
        <div className={styles.holeFact}>
          <span className={styles.helmMark} aria-hidden>
            <HelmShard
              className={styles.helmArt}
              edgeClassName={styles.helmEdge}
              breakClassName={styles.helmBreak}
            />
          </span>
          <h3 className={styles.holeFactTitle}>
            {pick(ULQ_HOLE_FACT.title, locale)}
          </h3>
          <p className={styles.holeFactText}>
            {pick(ULQ_HOLE_FACT.text, locale)}
          </p>
        </div>

        {frame(ULQ_IMAGE_KEYS.hole, styles.frameSquare)}

        {heartKeyFor(0)}
      </section>

      {/* ══ 4a · GÜÇ LABORATUVARI — ÜÇ BÜYÜK ═══════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.right}`}
        aria-labelledby="ulq-powers"
      >
        <span className={styles.wingMark} aria-hidden>
          <WingOutline
            className={styles.wingArt}
            strokeClassName={styles.wingStroke}
          />
        </span>

        <h2 id="ulq-powers" className={styles.sectionTitle}>
          {pick(ULQ_SECTIONS.powers.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(ULQ_SECTIONS.powers.lede, locale)}
        </p>
        {ask(ULQ_SECTIONS.powers.ask)}

        <ol className={styles.powers}>
          {ULQ_POWERS.map((power, index) => (
            <li key={power.key} className={styles.power}>
              <p className={styles.powerIndex} aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className={styles.powerName} lang="ja">
                {power.name}
              </h3>
              <p className={styles.powerReading}>{power.reading}</p>
              <p className={styles.powerTurkish}>{pick(power.turkish, locale)}</p>
              <p className={styles.powerTagline}>{pick(power.tagline, locale)}</p>
              <p className={styles.powerText}>{pick(power.text, locale)}</p>
              <ul className={styles.powerTraits}>
                {power.traits.map((trait) => (
                  <li key={trait.tr} className={styles.powerTrait}>
                    {pick(trait, locale)}
                  </li>
                ))}
              </ul>
              {frame(power.imageKey, styles.frameWide)}
            </li>
          ))}
        </ol>

        {heartKeyFor(1)}
      </section>

      {/* ══ 4b · DÖRT KÜÇÜK ════════════════════════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.left}`}
        aria-labelledby="ulq-minors"
      >
        <h2 id="ulq-minors" className={styles.sectionTitle}>
          {pick(ULQ_SECTIONS.minors.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(ULQ_SECTIONS.minors.lede, locale)}
        </p>
        {ask(ULQ_SECTIONS.minors.ask)}

        <ul className={styles.minors}>
          {ULQ_MINORS.map((minor) => (
            <li key={minor.key} className={styles.minor}>
              <h3 className={styles.minorName} lang="ja">
                {minor.name}
              </h3>
              <p className={styles.minorReading}>{minor.reading}</p>
              <p className={styles.minorTurkish}>{pick(minor.turkish, locale)}</p>
              <p className={styles.minorNote}>{pick(minor.note, locale)}</p>
              {frame(minor.imageKey, styles.frameScene)}
            </li>
          ))}
        </ul>

        {heartKeyFor(2)}
      </section>

      {/* ══ 5 · KALP — SAYFANIN KALBİ ══════════════════════════════════════
          Mekanizmanın kendisi ızgaranın ortasında (delik) ve bölümlerin
          içinde (cevap düğmeleri). Bu bölüm defteri tutuyor: hangi cevap
          verildi, hangisi verilmedi. */}
      <section
        className={`${styles.section} ${styles.right}`}
        aria-labelledby="ulq-heart"
      >
        <h2 id="ulq-heart" className={styles.sectionTitle}>
          {pick(ULQ_SECTIONS.heart.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(ULQ_SECTIONS.heart.lede, locale)}
        </p>
        {ask(ULQ_SECTIONS.heart.ask)}

        <h3 className={styles.ledgerTitle}>
          {pick(ULQ_HEART_UI.ledgerTitle, locale)}
        </h3>
        <p className={styles.ledgerLede}>
          {pick(ULQ_HEART_UI.ledgerLede, locale)}
        </p>

        {/* Defter statik: durum rozetini düğmenin kendisi taşıyor, burada
            yalnızca beş cevabın ne olduğu yazıyor. Böylece bölüm sunucuda
            kalıyor ve istemciye ikinci bir liste inmiyor. */}
        <ol className={styles.ledger}>
          {ULQ_ANSWERS.map((answer) => (
            <li key={answer.key} className={styles.ledgerRow}>
              <span className={styles.ledgerGlyph} lang="ja" aria-hidden>
                {answer.glyph}
              </span>
              <span className={styles.ledgerLabel}>
                {pick(answer.label, locale)}
              </span>
              <span className={styles.ledgerRomaji} aria-hidden>
                {answer.romaji}
              </span>
            </li>
          ))}
        </ol>

        <p className={styles.keyboardHint}>
          {pick(ULQ_HEART_UI.keyboardHint, locale)}
        </p>

        {frame(ULQ_IMAGE_KEYS.heart, styles.frameWide)}

        {heartKeyFor(3)}
      </section>

      {/* ══ 6 · KADER ÇİZELGESİ ════════════════════════════════════════════
          Beş durak, YAŞ YERİNE dönem etiketiyle: kayıtlı bir yaşı yok. Kilit
          anlarda orijinal dil metni var ama TIRNAK YOK — her biri "terim" ya
          da "soru" rozetiyle ne olduğunu söylüyor (veri dosyasının başındaki
          replik disiplini bloğu). */}
      <section
        className={`${styles.section} ${styles.left}`}
        aria-labelledby="ulq-fate"
      >
        <h2 id="ulq-fate" className={styles.sectionTitle}>
          {pick(ULQ_SECTIONS.fate.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(ULQ_SECTIONS.fate.lede, locale)}
        </p>
        {ask(ULQ_SECTIONS.fate.ask)}

        <ol className={styles.fate}>
          {ULQ_TIMELINE.map((stop) => {
            const kinLinked = stop.kin
              ? isExperienceCharacter(stop.kin.characterId)
              : false;
            return (
              <li key={stop.key} className={styles.stop}>
                <p className={styles.stopEra}>{pick(stop.era, locale)}</p>
                <h3 className={styles.stopTitle}>{pick(stop.title, locale)}</h3>
                <p className={styles.stopText}>{pick(stop.text, locale)}</p>

                {stop.mark ? (
                  <div className={styles.mark}>
                    <span className={styles.markBadge}>
                      {pick(
                        stop.mark.kind === "term"
                          ? ULQ_CLOSING.termBadge
                          : ULQ_CLOSING.questionBadge,
                        locale,
                      )}
                    </span>
                    <p className={styles.markText} lang="ja">
                      {stop.mark.text}
                    </p>
                    <p className={styles.markReading}>
                      {pick(stop.mark.reading, locale)}
                    </p>
                  </div>
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
                      <span className={styles.stopKinName}>{stop.kin.name}</span>
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

        {heartKeyFor(4)}
      </section>

      {/* ══ 7a · BAĞLAR ════════════════════════════════════════════════════
          Dört kişi ve yalnızca dört: `EXPERIENCE_COMPANIONS[1081]` ile birebir
          aynı liste (dalga 1'in dördüncü dersi). Portre kaydı olan varsa küçük
          bir kare çiziliyor, yoksa bölüm adla ayakta kalıyor. */}
      <section
        className={`${styles.section} ${styles.right}`}
        aria-labelledby="ulq-bonds"
      >
        <h2 id="ulq-bonds" className={styles.sectionTitle}>
          {pick(ULQ_SECTIONS.bonds.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(ULQ_SECTIONS.bonds.lede, locale)}
        </p>
        {ask(ULQ_SECTIONS.bonds.ask)}

        <ul className={styles.bonds}>
          {ULQ_BONDS.map((bond) => {
            const linked = isExperienceCharacter(bond.characterId);
            const face = faces.get(bond.characterId) ?? null;
            return (
              <li key={bond.characterId} className={styles.bond}>
                {face ? (
                  <span className={styles.bondPortrait}>
                    <Image
                      className={styles.bondPortraitImg}
                      src={face}
                      alt={`${bond.name} — ${pick(
                        ULQ_BOND_UI.portraitAlt,
                        locale,
                      )}`}
                      fill
                      sizes="4rem"
                    />
                  </span>
                ) : null}

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
                  {bond.nativeName}
                </span>
                <span className={styles.bondRole}>{pick(bond.role, locale)}</span>
                <span className={styles.bondLine}>{pick(bond.line, locale)}</span>
                <span className={styles.bondFlag}>
                  {pick(linked ? ULQ_BOND_UI.hasPage : ULQ_BOND_UI.noPage, locale)}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Evren bağları — Bleach salonundaki gerçek çapalar */}
        <ul className={styles.worldLinks}>
          {ULQ_WORLD_LINKS.map((link) => (
            <li key={link.anchor}>
              <a
                className={styles.worldLink}
                href={`${animeHref.bleach()}#${link.anchor}`}
              >
                <span className={styles.worldLinkLabel}>
                  {pick(link.label, locale)}
                </span>
                <span className={styles.worldLinkNote}>
                  {pick(link.note, locale)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ══ 7b · KAPANIŞ ═══════════════════════════════════════════════════ */}
      <section
        className={`${styles.section} ${styles.left}`}
        aria-labelledby="ulq-closing"
      >
        <h2 id="ulq-closing" className={styles.sectionTitle}>
          {pick(ULQ_SECTIONS.closing.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(ULQ_SECTIONS.closing.lede, locale)}
        </p>
        {ask(ULQ_SECTIONS.closing.ask)}

        <ul className={styles.closingQuestions}>
          {ULQ_CLOSING.questions.map((question) => (
            <li key={question.text} className={styles.closingQuestion}>
              <span className={styles.questionBadge}>
                {pick(ULQ_CLOSING.questionBadge, locale)}
              </span>
              {/* ⚠️ `blockquote` DEĞİL ve tırnak YOK: bu bir alıntı değil,
                  arşivin kendi Japonca karşılığı. Gerekçe veri dosyasının
                  başındaki replik disiplini bloğunda. */}
              <p className={styles.questionText} lang="ja">
                {question.text}
              </p>
              <p className={styles.questionReading}>
                {pick(question.reading, locale)}
              </p>
              <p className={styles.questionNote}>{pick(question.note, locale)}</p>
            </li>
          ))}
        </ul>

        <p className={styles.discipline}>
          {pick(ULQ_CLOSING.quoteDiscipline, locale)}
        </p>

        <span className={styles.heroRule} aria-hidden />

        <p className={styles.motto} lang="ja">
          {ULQ_CLOSING.motto}
        </p>
        <p className={styles.mottoReading}>
          {pick(ULQ_CLOSING.mottoReading, locale)}
        </p>

        {frame(ULQ_IMAGE_KEYS.closing, styles.frameBand)}

        <p className={styles.credit}>
          {pick(ULQ_CLOSING.credit, locale)}{" "}
          <a href={siteUrl} target="_blank" rel="noreferrer noopener">
            {pick(ULQ_CLOSING.creditLink, locale)}
          </a>
        </p>
        <p className={styles.creditNote}>
          {pick(ULQ_CLOSING.creditNote, locale)}
        </p>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor.
          Sarmalayıcı ızgaranın SON satırını baştan sona kaplıyor: deliğin
          kolonu yalnızca ilk dört satırı tutuyor, çakışma yok. */}
      {isAdmin ? (
        <div className={styles.gapsWrap}>
        <CuratorGaps
          title={pick(ULQ_GAPS.title, locale)}
          emptyLabel={pick(ULQ_GAPS.empty, locale)}
          filledLabel={pick(ULQ_GAPS.filled, locale)}
          allFilledLabel={pick(ULQ_GAPS.allFilled, locale)}
          rows={gapRows}
        />
        </div>
      ) : null}
    </HollowShell>
  );
}
