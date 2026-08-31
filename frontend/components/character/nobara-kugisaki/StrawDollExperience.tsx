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
  NOBARA_ALT,
  NOBARA_ANCHOR_UI,
  NOBARA_ANCHORS,
  NOBARA_ARTS,
  NOBARA_BOND_UI,
  NOBARA_BONDS,
  NOBARA_CLOSING,
  NOBARA_CRUMB,
  NOBARA_FRAME_EMPTY,
  NOBARA_GAPS,
  NOBARA_HERO,
  NOBARA_ID,
  NOBARA_IDENTITY,
  NOBARA_IMAGE_KEYS,
  NOBARA_KIT,
  NOBARA_MASTHEAD,
  NOBARA_MISSES,
  NOBARA_MISSING_NOTE,
  NOBARA_NAIL_LIMIT,
  NOBARA_NAIL_POINTS,
  NOBARA_NAIL_UI,
  NOBARA_PORTRAIT,
  NOBARA_PORTRAIT_SLOT,
  NOBARA_RESONANCE_UI,
  NOBARA_SECTIONS,
  NOBARA_SITE_URL,
  NOBARA_SLOT_LABELS,
  NOBARA_SLOT_SIZES,
  NOBARA_SLOT_SPECS,
  NOBARA_TIMELINE,
  NOBARA_TRIADS,
} from "@/lib/characters/nobara-kugisaki-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { NailField } from "./NailField";
import { ResonanceShell } from "./ResonanceShell";
import { StrawDoll } from "./NobaraGlyphs";
import styles from "./StrawDollExperience.module.css";

/**
 * Nobara Kugisaki — "Saman Bebek" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/133700 bu bileşene çıkıyor (kendi
 * statik rota klasörü). 31 Ağustos 2026'da SIFIRDAN yazıldı; eski set
 * `components/character/.deprecated/nobara-kugisaki/` altında duruyor ve
 * buradan HİÇ import edilmiyor.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Fikir tek cümle: BU BİR TOKYO MODA DERGİSİ SAYFASI. Kart ızgarası yok,
 * kutu yok, eşit sütun yok. Onun yerine:
 *
 *   · asimetrik 12 kolonluk dergi ızgarası (`.spread`), her bölüm farklı
 *     sütunlarda oturuyor;
 *   · TAM KANAMA renk blokları (`.plate`) — çünkü on yedi kadrajın hepsi
 *     boş ve kanamayı görsel taşıyamıyor, RENK taşıyor;
 *   · görsel bloklarının ÜSTÜNE binen tipografi (`z-index` katmanları);
 *   · dev, ALL CAPS Bebas başlıklar (kapak adı 11rem'e kadar çıkıyor).
 *
 * ⚠️ Levi de Bebas kullanıyor ama orada başlıklar 1.15rem'i geçmiyor —
 * "küçük ve sessiz". Burada tam tersi: dergi kapağı ölçeği. Aynı aile, zıt
 * muamele (Faz 2 §0, dalgalar arası font tekrarı kuralı).
 *
 * ⚠️ BÜYÜK HARF CSS'TE. Başlıklarda `text-transform: uppercase` var, elle
 * BÜYÜK harf YAZILMIYOR: ekran okuyucuya normal yazım gidiyor ve
 * `lang="tr"` doğru olduğu için tarayıcı "i"yi "İ" yapıyor ("KÜNYE",
 * "ÜÇ ÇİVİ", "KADER ÇİZELGESİ" doğru çıkıyor).
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero — dergi kapağı (masthead + dev ad + manken kartı + boş kapak)
 *   2 mod düğmesi — "Rezonans", `ResonanceShell` içinde (state orada)
 *   3 künye şeridi — derginin colophon'u
 *   4 güç laboratuvarı — üç büyük "feature" + dört küçük kayıt
 *   5 ÜÇ ÇİVİ — sayfanın kalbi (`NailField`)
 *   6 kader çizelgesi — beş durak, yaş etiketli
 *   7 kapanış — iki replik + 共鳴り + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2, sınır 3) ─────────────────────────────────────────
 *   ResonanceShell — kök öğe + "Rezonans" modu (tek boolean)
 *   NailField      — üç çivi mekaniği
 * `NobaraGlyphs` SUNUCU bileşeni (yalnız SVG yolu), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca kapağın
 * "manken kartı" kadrajında). On yedi kadrajın tamamı BOŞ ve her birinin
 * HEMEN ALTINDA kendi küratör yuvası var; sayfa sonunda yalnızca
 * düzenleyicisiz `CuratorGaps` duruyor.
 */
export function StrawDollExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ resmî
     kare. İkisi de bizim kaynağımız, o yüzden `unoptimized` HİÇ yazılmıyor
     (Faz 2 §3). AniList'e hotlink YOK. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? NOBARA_PORTRAIT.src;
  const portraitAlt = pick(
    portraitUploaded ? NOBARA_HERO.portraitAlt : NOBARA_HERO.portraitAltFallback,
    locale,
  );

  const name = detail.character.name || NOBARA_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? NOBARA_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? NOBARA_SITE_URL;
  const faceSuffix = pick(NOBARA_ALT.companionSuffix, locale);
  const scenePrefix = pick(NOBARA_ALT.scenePrefix, locale);

  const gapRows: CuratorGapRow[] = Object.values(NOBARA_IMAGE_KEYS).map(
    (key) => ({
      key,
      label: pick(NOBARA_SLOT_LABELS[key], locale),
      spec: pick(NOBARA_SLOT_SPECS[key], locale),
      filled: ability.has(key),
    }),
  );

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * ⚠️ Kadraj BOŞKEN ziyaretçi hiçbir yer tutucu metin görmüyor: künye
   * satırı `isAdmin` ile kesilmiş. Dergi düzeninde on yedi etiketli kutu,
   * sayfanın tezini (tipografi taşıyor) doğrudan çürütürdü.
   *
   * ⚠️ PERDE: dolu kadrajın üstüne CSS bir `::after` degrade koyuyor
   * (`.frameSlot[data-filled="true"] .frame::after`), çünkü dergi düzeninde
   * metin görselin ÜSTÜNE biniyor ve yüklenen kare açık renkli olabilir.
   */
  const frame = (key: string, shapeClass: string) => {
    const scene = src(key);
    return (
      <>
        <div className={styles.frameSlot} data-filled={scene ? "true" : "false"}>
          <figure className={`${styles.frame} ${shapeClass}`}>
            {scene ? (
              <Image
                className={styles.frameImg}
                src={scene}
                alt={`${scenePrefix} ${pick(NOBARA_SLOT_LABELS[key], locale)}`}
                fill
                sizes="(max-width: 48rem) 96vw, 60vw"
              />
            ) : isAdmin ? (
              <figcaption className={styles.frameCaption} data-curator-slot>
                <span className={styles.frameCaptionWord}>
                  {pick(NOBARA_FRAME_EMPTY, locale)}
                </span>
                <span className={styles.frameCaptionSpec}>
                  {pick(NOBARA_SLOT_SPECS[key], locale)}
                </span>
              </figcaption>
            ) : null}
          </figure>
        </div>
        {isAdmin ? (
          <CuratorSlot
            characterId={NOBARA_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(NOBARA_SLOT_LABELS[key], locale)}
            size={NOBARA_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /* ══ 1 · HERO — DERGİ KAPAĞI ════════════════════════════════════════════
     Kapakta üç katman var ve üçü üst üste biniyor:
       z0  saman bebek filigranı (dev, soluk, aria-hidden)
       z1  renk plakası + boş kapak kadrajı
       z2  tipografi (masthead, dev ad, strap) ve manken kartı
     Görsel yoksa da kapak ayakta duruyor, çünkü kanamayı plaka taşıyor. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link className={styles.crumbLink} href={animeHref.characters()}>
          {t("backToGallery")}
        </Link>
        <span className={styles.crumbSep} aria-hidden>
          /
        </span>
        <span className={styles.crumbHere}>{pick(NOBARA_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.cover} aria-labelledby="nob-name">
        <span className={styles.watermark} aria-hidden>
          <StrawDoll
            className={styles.watermarkArt}
            bodyClassName={styles.watermarkStraw}
            bindClassName={styles.watermarkBind}
            nailClassName={styles.watermarkNail}
          />
        </span>

        <div className={styles.mast}>
          <p className={styles.mastWord}>{pick(NOBARA_MASTHEAD.wordmark, locale)}</p>
          <p className={styles.mastIssue}>{pick(NOBARA_MASTHEAD.issue, locale)}</p>
          <p className={styles.mastDate}>{pick(NOBARA_MASTHEAD.dateline, locale)}</p>
        </div>

        <div className={styles.coverPlate}>
          {frame(NOBARA_IMAGE_KEYS.cover, styles.frameCover)}
        </div>

        <div className={styles.coverType}>
          <p className={styles.coverKicker}>
            {pick(NOBARA_IDENTITY.kicker, locale)}
          </p>
          <h1 id="nob-name" className={styles.coverName}>
            {name}
          </h1>
          <p className={styles.coverNative} lang="ja">
            {nativeName}
          </p>
          <p className={styles.coverStrap}>
            {pick(NOBARA_MASTHEAD.strap, locale)}
          </p>
        </div>

        <p className={styles.coverSpine} lang="ja" aria-hidden>
          {NOBARA_MASTHEAD.spine}
        </p>

        {/* Manken kartı — 230×345, yani KÜÇÜK: tam kanama kapak olarak
            kullanılmıyor, dar bir kadrajda duruyor. */}
        <figure className={styles.coverPortrait}>
          <Image
            className={styles.coverPortraitImg}
            src={portraitSrc}
            alt={portraitAlt}
            width={NOBARA_PORTRAIT.w}
            height={NOBARA_PORTRAIT.h}
            priority
          />
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={NOBARA_ID}
            slot="PORTRAIT"
            label={pick(NOBARA_PORTRAIT_SLOT, locale)}
            size={{ w: 1200, h: 1600 }}
          />
        ) : null}

        <div className={styles.coverText}>
          <p className={styles.coverLede}>{pick(NOBARA_HERO.lede, locale)}</p>
          <p className={styles.coverNameNote}>
            {pick(NOBARA_IDENTITY.nameNote, locale)}
          </p>
          {/* Not yalnızca kadraj GERÇEKTEN boşken yazılıyor: küratör kapağı
              yüklediğinde "kapak karesi boş" cümlesi yalan olurdu. */}
          {src(NOBARA_IMAGE_KEYS.cover) ? null : (
            <p className={styles.coverEmptyNote}>
              {pick(NOBARA_HERO.coverNote, locale)}
            </p>
          )}
        </div>
      </section>
    </>
  );

  return (
    <ResonanceShell
      isAdmin={isAdmin}
      title={pick(NOBARA_RESONANCE_UI.title, locale)}
      native={NOBARA_RESONANCE_UI.native}
      enterLabel={pick(NOBARA_RESONANCE_UI.enter, locale)}
      exitLabel={pick(NOBARA_RESONANCE_UI.exit, locale)}
      hintOn={pick(NOBARA_RESONANCE_UI.hintOn, locale)}
      hintOff={pick(NOBARA_RESONANCE_UI.hintOff, locale)}
      hero={hero}
    >
      {/* ══ 3 · KÜNYE ŞERİDİ — derginin colophon'u ═══════════════════════════
          Dergi künyesi gibi kuruldu: solda dev bir sayı (yaş), sağda mono
          etiketli satırlar. Kutu yok, yalnızca saç çizgileri. */}
      <section className={styles.section} aria-labelledby="nob-colophon">
        <header className={styles.head}>
          <p className={styles.headIndex} aria-hidden>
            01
          </p>
          <h2 id="nob-colophon" className={styles.headTitle}>
            {pick(NOBARA_SECTIONS.identity.title, locale)}
          </h2>
          <p className={styles.headLede}>
            {pick(NOBARA_SECTIONS.identity.lede, locale)}
          </p>
        </header>

        <div className={styles.colophon}>
          <p className={styles.colophonBig} aria-hidden>
            16
          </p>
          <dl className={styles.facts}>
            {NOBARA_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
                <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className={styles.factNote}>{pick(NOBARA_MISSING_NOTE, locale)}</p>

        <blockquote className={styles.epigraph}>
          {pick(NOBARA_IDENTITY.epigraph, locale)}
        </blockquote>

        {frame(NOBARA_IMAGE_KEYS.city, styles.frameBand)}
      </section>

      {/* ══ 4a · GÜÇ LABORATUVARI — ÜÇ BÜYÜK "FEATURE" ══════════════════════
          Kart DEĞİL: her biri kendi sayfasını kaplayan bir dergi açılımı.
          Tek numaralılar plaka solda, çiftler sağda; gövde metni geniş
          ekranda İKİ SÜTUNA akıyor (`columns`). */}
      <section className={styles.section} aria-labelledby="nob-arts">
        <header className={styles.head}>
          <p className={styles.headIndex} aria-hidden>
            02
          </p>
          <h2 id="nob-arts" className={styles.headTitle}>
            {pick(NOBARA_SECTIONS.arts.title, locale)}
          </h2>
          <p className={styles.headLede}>
            {pick(NOBARA_SECTIONS.arts.lede, locale)}
          </p>
        </header>

        <ol className={styles.features}>
          {NOBARA_ARTS.map((art, index) => (
            <li
              key={art.key}
              className={styles.feature}
              data-side={index % 2 === 0 ? "left" : "right"}
            >
              <p className={styles.featureIndex} aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </p>

              <div className={styles.featurePlate}>
                {frame(art.imageKey, styles.frameFeature)}
              </div>

              <div className={styles.featureType}>
                <h3 className={styles.featureKanji} lang="ja">
                  {art.kanji}
                </h3>
                <p className={styles.featureReading} lang="ja">
                  {art.reading}
                </p>
                <p className={styles.featureName}>
                  {art.name} · {pick(art.turkish, locale)}
                </p>
                <p className={styles.featureTag}>{pick(art.tagline, locale)}</p>
                <p className={styles.featureText}>{pick(art.text, locale)}</p>
                <ul className={styles.traits}>
                  {art.traits.map((trait) => (
                    <li key={trait.tr} className={styles.trait}>
                      {pick(trait, locale)}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ 4b · DÖRT KÜÇÜK KAYIT ═══════════════════════════════════════════
          Derginin kenar sütunu: her kayıt bir öncekinden biraz daha içeri
          giriyor (merdiven), aralarında yalnızca saç çizgisi var. */}
      <section className={styles.section} aria-labelledby="nob-kit">
        <header className={styles.head}>
          <p className={styles.headIndex} aria-hidden>
            03
          </p>
          <h2 id="nob-kit" className={styles.headTitle}>
            {pick(NOBARA_SECTIONS.kit.title, locale)}
          </h2>
          <p className={styles.headLede}>
            {pick(NOBARA_SECTIONS.kit.lede, locale)}
          </p>
        </header>

        <ul className={styles.kit}>
          {NOBARA_KIT.map((entry) => (
            <li key={entry.key} className={styles.kitItem}>
              <p className={styles.kitKanji} lang="ja">
                {entry.kanji}
              </p>
              <p className={styles.kitReading} lang="ja">
                {entry.reading}
              </p>
              <h3 className={styles.kitName}>{pick(entry.name, locale)}</h3>
              <p className={styles.kitNote}>{pick(entry.note, locale)}</p>
              {frame(entry.imageKey, styles.frameSquare)}
            </li>
          ))}
        </ul>
      </section>

      {/* ══ 5 · ÜÇ ÇİVİ — SAYFANIN KALBİ ════════════════════════════════════ */}
      <section className={styles.nails} aria-labelledby="nob-nails">
        <header className={styles.head}>
          <p className={styles.headIndex} aria-hidden>
            04
          </p>
          <h2 id="nob-nails" className={styles.headTitle}>
            {pick(NOBARA_SECTIONS.nails.title, locale)}
          </h2>
          <p className={styles.headLede}>
            {pick(NOBARA_SECTIONS.nails.lede, locale)}
          </p>
        </header>

        <NailField
          limit={NOBARA_NAIL_LIMIT}
          points={NOBARA_NAIL_POINTS.map((point) => ({
            key: point.key,
            order: point.order,
            x: point.x,
            y: point.y,
            kanji: point.kanji,
            reading: point.reading,
            label: pick(point.label, locale),
            note: pick(point.note, locale),
          }))}
          triads={NOBARA_TRIADS.map((triad) => ({
            key: triad.key,
            members: [...triad.members],
            name: triad.name,
            kanji: triad.kanji,
            reading: triad.reading,
            turkish: pick(triad.turkish, locale),
            title: pick(triad.title, locale),
            text: pick(triad.text, locale),
          }))}
          misses={NOBARA_MISSES.map((rule) => ({
            key: rule.key,
            has: [...rule.has],
            lacks: [...rule.lacks],
            text: pick(rule.text, locale),
          }))}
          fieldLabel={pick(NOBARA_NAIL_UI.fieldLabel, locale)}
          counterLabel={pick(NOBARA_NAIL_UI.counterLabel, locale)}
          selectHint={pick(NOBARA_NAIL_UI.selectHint, locale)}
          resetLabel={pick(NOBARA_NAIL_UI.resetLabel, locale)}
          statusIdle={pick(NOBARA_NAIL_UI.statusIdle, locale)}
          statusOne={pick(NOBARA_NAIL_UI.statusOne, locale)}
          statusTwo={pick(NOBARA_NAIL_UI.statusTwo, locale)}
          statusFull={pick(NOBARA_NAIL_UI.statusFull, locale)}
          statusReset={pick(NOBARA_NAIL_UI.statusReset, locale)}
          hitPrefix={pick(NOBARA_NAIL_UI.hitPrefix, locale)}
          missPrefix={pick(NOBARA_NAIL_UI.missPrefix, locale)}
          missDefault={pick(NOBARA_NAIL_UI.missDefault, locale)}
          linesOn={pick(NOBARA_NAIL_UI.linesOn, locale)}
          linesOff={pick(NOBARA_NAIL_UI.linesOff, locale)}
          foundLabel={pick(NOBARA_NAIL_UI.foundLabel, locale)}
          openedTitle={pick(NOBARA_NAIL_UI.openedTitle, locale)}
          scene={frame(NOBARA_IMAGE_KEYS.field, styles.frameWide)}
        />
      </section>

      {/* ══ 6 · KADER ÇİZELGESİ — BEŞ DURAK ═════════════════════════════════
          Dergi kronolojisi: her durağın yaş damgası dev Bebas ile kenar
          boşluğuna taşıyor, gövde asimetrik sütunda kalıyor. */}
      <section className={styles.section} aria-labelledby="nob-fate">
        <header className={styles.head}>
          <p className={styles.headIndex} aria-hidden>
            05
          </p>
          <h2 id="nob-fate" className={styles.headTitle}>
            {pick(NOBARA_SECTIONS.fate.title, locale)}
          </h2>
          <p className={styles.headLede}>
            {pick(NOBARA_SECTIONS.fate.lede, locale)}
          </p>
        </header>

        <ol className={styles.fate}>
          {NOBARA_TIMELINE.map((stop, index) => {
            const kinLinked = stop.kin
              ? isExperienceCharacter(stop.kin.characterId)
              : false;
            return (
              <li
                key={stop.key}
                className={styles.stop}
                data-side={index % 2 === 0 ? "left" : "right"}
              >
                <p className={styles.stopNumber} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className={styles.stopStamp}>{pick(stop.stamp, locale)}</p>
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
                      <span className={styles.stopKinName}>{stop.kin.name}</span>
                    )}
                    <span className={styles.stopKinRole}>
                      {pick(stop.kin.role, locale)}
                    </span>
                  </p>
                ) : null}

                {frame(stop.imageKey, styles.frameTall)}
              </li>
            );
          })}
        </ol>
      </section>

      {/* ══ 7a · KADRO + EVREN ÇAPALARI ═════════════════════════════════════
          Derginin "katkıda bulunanlar" sayfası. Portreler kendi
          veritabanımızdan (`EXPERIENCE_COMPANIONS[133700]` ile BİREBİR aynı
          beş kişi); kayıt yoksa satır portresiz ama ayakta kalıyor. */}
      <section className={styles.section} aria-labelledby="nob-bonds">
        <header className={styles.head}>
          <p className={styles.headIndex} aria-hidden>
            06
          </p>
          <h2 id="nob-bonds" className={styles.headTitle}>
            {pick(NOBARA_SECTIONS.bonds.title, locale)}
          </h2>
          <p className={styles.headLede}>
            {pick(NOBARA_SECTIONS.bonds.lede, locale)}
          </p>
        </header>

        <ul className={styles.bonds}>
          {NOBARA_BONDS.map((bond) => {
            const face = faces.get(bond.characterId) ?? null;
            const linked = isExperienceCharacter(bond.characterId);
            return (
              <li key={bond.characterId} className={styles.bond}>
                <span className={styles.bondFace}>
                  {face ? (
                    <Image
                      src={face}
                      alt={`${bond.name} ${faceSuffix}`}
                      fill
                      sizes="88px"
                    />
                  ) : (
                    <span className={styles.bondMark} lang="ja" aria-hidden>
                      {bond.nameNative.slice(0, 1)}
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
                    {bond.nameNative}
                  </span>
                  <span className={styles.bondRole}>{pick(bond.role, locale)}</span>
                  <span className={styles.bondLine}>{pick(bond.line, locale)}</span>
                  <span className={styles.bondFlag}>
                    {pick(linked ? NOBARA_BOND_UI.hasPage : NOBARA_BOND_UI.noPage, locale)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        {frame(NOBARA_IMAGE_KEYS.team, styles.frameWide)}

        <div className={styles.anchors}>
          <h3 className={styles.anchorsTitle}>
            {pick(NOBARA_ANCHOR_UI.title, locale)}
          </h3>
          <p className={styles.anchorsLede}>
            {pick(NOBARA_ANCHOR_UI.lede, locale)}
          </p>
          <ul className={styles.anchorList}>
            {NOBARA_ANCHORS.map((anchor) => (
              <li key={anchor.anchor} className={styles.anchorItem}>
                <Link
                  className={styles.anchorLink}
                  href={`${animeHref.jjk()}#${anchor.anchor}`}
                >
                  <span className={styles.anchorKanji} lang="ja">
                    {anchor.kanji}
                  </span>
                  <span className={styles.anchorLabel}>
                    {pick(anchor.label, locale)}
                  </span>
                </Link>
                <span className={styles.anchorNote}>
                  {pick(anchor.note, locale)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 7b · KAPANIŞ ════════════════════════════════════════════════════ */}
      <section className={styles.closing} aria-labelledby="nob-closing">
        <header className={styles.head}>
          <p className={styles.headIndex} aria-hidden>
            07
          </p>
          <h2 id="nob-closing" className={styles.headTitle}>
            {pick(NOBARA_SECTIONS.closing.title, locale)}
          </h2>
          <p className={styles.headLede}>
            {pick(NOBARA_SECTIONS.closing.lede, locale)}
          </p>
        </header>

        <ul className={styles.closingQuotes}>
          {NOBARA_CLOSING.quotes.map((quote) => (
            <li key={quote.text}>
              <figure className={styles.closingQuote}>
                <blockquote className={styles.quoteJa} lang="ja">
                  {quote.text}
                </blockquote>
                <p className={styles.quoteReading}>{pick(quote.reading, locale)}</p>
                <p className={styles.quoteNote}>{pick(quote.note, locale)}</p>
                {/* `figcaption` figure'un SON çocuğu olmak zorunda (HTML
                    şartı): not bloğu bilerek onun üstünde duruyor. */}
                <figcaption className={styles.quoteBy}>
                  {pick(quote.by, locale)}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className={styles.motto} lang="ja">
          {NOBARA_CLOSING.motto}
        </p>
        <p className={styles.mottoNote}>{pick(NOBARA_CLOSING.mottoNote, locale)}</p>

        {frame(NOBARA_IMAGE_KEYS.closing, styles.frameBand)}

        <p className={styles.credit}>
          {pick(NOBARA_CLOSING.credit, locale)}{" "}
          <a
            className={styles.creditLink}
            href={siteUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {pick(NOBARA_CLOSING.creditLink, locale)}
          </a>
        </p>
        <p className={styles.creditNote}>
          {pick(NOBARA_CLOSING.creditNote, locale)}
        </p>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(NOBARA_GAPS.title, locale)}
          emptyLabel={pick(NOBARA_GAPS.empty, locale)}
          filledLabel={pick(NOBARA_GAPS.filled, locale)}
          allFilledLabel={pick(NOBARA_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </ResonanceShell>
  );
}
