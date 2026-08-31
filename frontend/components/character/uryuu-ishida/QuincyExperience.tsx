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
  URYUU_ALT,
  URYUU_ARSENAL,
  URYUU_BLUT,
  URYUU_BONDS,
  URYUU_BOND_UI,
  URYUU_CLOSING,
  URYUU_CRUMB,
  URYUU_FACTS,
  URYUU_FACT_NOTE,
  URYUU_FRAME_EMPTY,
  URYUU_GAPS,
  URYUU_HALL_LINKS,
  URYUU_HALL_UI,
  URYUU_ID,
  URYUU_IDENTITY,
  URYUU_IMAGE_KEYS,
  URYUU_KIT,
  URYUU_PORTRAIT,
  URYUU_PORTRAIT_SLOT,
  URYUU_QUOTE_NOTE,
  URYUU_RETICLE_UI,
  URYUU_SECTIONS,
  URYUU_SITE_URL,
  URYUU_SLOT_LABELS,
  URYUU_SLOT_SIZES,
  URYUU_SLOT_SPECS,
  URYUU_TARGETS,
  URYUU_TIMELINE,
} from "@/lib/characters/uryuu-ishida-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { BlutShell } from "./BlutShell";
import { ReticleBoard, type ReticleTarget } from "./ReticleBoard";
import { MeasureAxis, QuincyCross, StitchRule } from "./UryuuGlyphs";
import styles from "./QuincyExperience.module.css";

/**
 * Uryū Ishida — "Nişangâh" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/564 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: QUINCY GEOMETRİSİ VE
 * TERZİLİK — nişan ve dikiş, aynı eldeki iki hassasiyet.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Sayfanın tamamı görünür bir BLUEPRINT IZGARASININ üstünde duruyor: ince
 * çizgiler, köşelerde artı işaretleri, her bölüm ızgaraya tam oturuyor.
 * Serbest yüzen hiçbir alan yok — dalganın diğer sayfalarının (Rukia'nın
 * kar bantları, Renji'nin zikzağı, Ulquiorra'nın boşluğu, Grimmjow'un
 * yırtıkları, Yoruichi'nin yatay şeritleri) tam zıddı.
 *
 * Tipografi ikiye bölünmüş ve çelişkisi kasıtlı: başlıklar BLACKLETTER
 * (`--font-gothic`, Quincy'nin Alman kimliği), gövde ve etiketler MONO
 * (`--font-plexmono`, teknik föy). Gotik + teknik.
 *
 * ⚠️ GOTİK AİLENİN TÜRKÇE DİYAKRİTİĞİ YOK (UnifrakturMaguntia, yalnız
 * `latin` dilimi — `scripts/check-bleach-fonts.mjs` denetliyor). Bu yüzden
 * gotik aileye YALNIZCA Latin-1 sınırları içindeki özel adlar basılıyor:
 * "Uryuu Ishida", "Quincy", "Steckbrief", "Heilig Bogen", "Vollständig",
 * "Vene", "Arterie". Türkçe hiçbir dize o aileye geçmiyor; bölüm başlıkları
 * mono ailede. Gotik işaretler ayrıca `aria-hidden` — ekran okuyucunun
 * okuduğu başlık düz ve tek dilli kalıyor.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (Quincy haçı filigranı + künye madalyonu + boş hero kadrajı)
 *   2 Blut düğmesi — `BlutShell` içinde (durum orada)
 *   3 teknik föy (on dört satır, sonuncusu bilerek künyeden değil)
 *   4 üç ana sistem + dört alet — Quincy terminolojisiyle
 *   5 NİŞANGÂH — sayfanın kalbi (`ReticleBoard`)
 *   6 beş durak
 *   7 bağlar + evren bağları + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   BlutShell    — kök öğe + Blut taraf seçimi (tek dize)
 *   ReticleBoard — nişangâh
 * `UryuuGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — KÜÇÜK, o yüzden yalnızca künye
 * madalyonunda). Büyük hero karesi ve on dört sahne kadrajı BOŞ ve küratör
 * yuvası olarak duruyor; her kadrajın hemen altında kendi yuvası var.
 */
export function QuincyExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;
  const portraits = companionPortraits(companions);

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ resmî
     kare. İkisi de bizim kaynağımız, o yüzden `unoptimized` hiç yazılmıyor
     (FAZ 2 §3). AniList'e hotlink YOK. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? URYUU_PORTRAIT.src;

  /* ⚠️ Gotik aileye basılan tek özel ad bu ve ASCII olmak ZORUNDA. AniList
     kaydı "Uryuu Ishida" yazıyor (kaynak.json), yani künyeden gelen değer
     zaten güvenli; yine de yedek sabit ASCII ve CSS'te aileye mono yedeği
     eklendi ki beklenmedik bir diyakritik satırı yarı-gotik bırakmasın. */
  const name = detail.character.name || URYUU_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? URYUU_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? URYUU_SITE_URL;

  /* Nişangâh adasına düz dize iniyor — `LocalizedText` istemciye geçmiyor. */
  const reticleTargets: ReticleTarget[] = URYUU_TARGETS.map((target) => ({
    key: target.key,
    mark: target.mark,
    kanji: target.kanji,
    name: pick(target.name, locale),
    distance: target.distance,
    angle: target.angle,
    arrows: target.arrows,
    verdict: pick(target.verdict, locale),
    text: pick(target.text, locale),
    href:
      target.characterId && isExperienceCharacter(target.characterId)
        ? animeHref.character(target.characterId)
        : null,
    x: target.x,
    y: target.y,
  }));

  const gapRows: CuratorGapRow[] = Object.values(URYUU_IMAGE_KEYS).map((key) => ({
    key,
    label: pick(URYUU_SLOT_LABELS[key], locale),
    spec: pick(URYUU_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * ⚠️ `isAdmin` KESMESİ: kadraj boşken ziyaretçi ÜRETİM METADATASI
   * görmüyor. On beş kadrajın hepsi bugün boş; koşulsuz yazılsaydı sıradan
   * bir ziyaretçi sayfada on beş kez "geniş kadraj · 1600×900 · webp"
   * okurdu ve ekran okuyucu da hepsini seslendirirdi (Dalga 1'in birinci
   * dersi). Görsel yokken bölüm görselsiz ama AYAKTA kalıyor.
   *
   * ⚠️ Yüklenen görselin üstündeki metne perde: `.frameVeil` görselin
   * üstünde duran başlık şeridine koyu bir degrade koyuyor, yani parlak bir
   * kare yüklendiğinde üstteki yazı kaybolmuyor.
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
            <>
              <Image
                className={styles.frameImg}
                src={scene}
                alt={`${pick(URYUU_ALT.scenePrefix, locale)} ${pick(
                  URYUU_SLOT_LABELS[key],
                  locale,
                )}`}
                fill
                sizes="(max-width: 52rem) 92vw, 44rem"
              />
              <span className={styles.frameVeil} aria-hidden />
            </>
          ) : null}
          {/* ⚠️ Köşe işaretleri figcaption'ın ÜSTÜNDE: HTML şartı gereği
              `figcaption` figure'un ilk ya da SON çocuğu olmak zorunda. */}
          <span className={styles.frameCorners} aria-hidden />
          {!scene && isAdmin ? (
            <figcaption className={styles.frameCaption} data-curator-slot>
              <span className={styles.frameCaptionWord}>
                {pick(URYUU_FRAME_EMPTY, locale)}
              </span>
              <span className={styles.frameCaptionSpec}>
                {pick(URYUU_SLOT_SPECS[key], locale)}
              </span>
            </figcaption>
          ) : null}
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={URYUU_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(URYUU_SLOT_LABELS[key], locale)}
            size={URYUU_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran: elle çizilmiş beş uçlu Quincy haçı (dolgusuz kontur, çok
     büyük, çok soluk) + 滅却師. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link className={styles.crumbLink} href={animeHref.characters()}>
          {t("backToGallery")}
        </Link>
        <span className={styles.crumbSep} aria-hidden>
          +
        </span>
        <span className={styles.crumbHere}>{pick(URYUU_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="ury-name">
        <span className={styles.watermark} aria-hidden>
          <QuincyCross
            className={styles.watermarkArt}
            strokeClassName={styles.watermarkStroke}
            ringClassName={styles.watermarkRing}
          />
          <span className={styles.watermarkKanji} lang="ja">
            {URYUU_IDENTITY.watermarkKanji}
          </span>
        </span>

        <div className={styles.heroHead}>
          <p className={styles.wordmark} aria-hidden>
            {URYUU_IDENTITY.wordmark}
          </p>

          <h1 id="ury-name" className={styles.heroName}>
            {name}
          </h1>

          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>
          <p className={styles.heroLong}>{URYUU_IDENTITY.nameLong}</p>
          <p className={styles.heroSchrift}>{URYUU_IDENTITY.schrift}</p>
        </div>

        <StitchRule
          className={styles.stitch}
          threadClassName={styles.stitchThread}
          needleClassName={styles.stitchNeedle}
        />

        <div className={styles.heroText}>
          <p className={styles.heroEpigraph}>
            {pick(URYUU_IDENTITY.epigraph, locale)}
          </p>
          <p className={styles.heroLede}>{pick(URYUU_IDENTITY.lede, locale)}</p>
        </div>

        {/* Madalyon portre — 230×345, yani KÜÇÜK: tam kanama bir hero olarak
            kullanılmıyor, dar bir künye kadrajında duruyor. */}
        <div className={styles.portraitPlate}>
          <figure className={styles.portrait}>
            <Image
              className={styles.portraitImg}
              src={portraitSrc}
              alt={pick(
                portraitUploaded
                  ? URYUU_ALT.portraitUploaded
                  : URYUU_ALT.portrait,
                locale,
              )}
              width={URYUU_PORTRAIT.w}
              height={URYUU_PORTRAIT.h}
              priority
            />
            <span className={styles.frameCorners} aria-hidden />
          </figure>
          {isAdmin ? (
            <CuratorSlot
              characterId={URYUU_ID}
              slot="PORTRAIT"
              label={pick(URYUU_PORTRAIT_SLOT, locale)}
              size={{ w: 1200, h: 1600 }}
            />
          ) : null}
        </div>

        {/* Büyük hero karesi bilerek BOŞ — küratör yuvası olarak duruyor.
            Not yalnızca kadraj GERÇEKTEN boşken yazılıyor. */}
        {src(URYUU_IMAGE_KEYS.hero) ? null : (
          <p className={styles.heroFrameNote}>
            {pick(URYUU_IDENTITY.heroCaption, locale)}
          </p>
        )}
        {frame(URYUU_IMAGE_KEYS.hero, styles.frameTall)}
      </section>
    </>
  );

  return (
    <BlutShell
      isAdmin={isAdmin}
      title={pick(URYUU_BLUT.title, locale)}
      veneName={URYUU_BLUT.veneName}
      arterieName={URYUU_BLUT.arterieName}
      veneKanji={URYUU_BLUT.veneKanji}
      arterieKanji={URYUU_BLUT.arterieKanji}
      veneLabel={pick(URYUU_BLUT.veneLabel, locale)}
      arterieLabel={pick(URYUU_BLUT.arterieLabel, locale)}
      veneHint={pick(URYUU_BLUT.veneHint, locale)}
      arterieHint={pick(URYUU_BLUT.arterieHint, locale)}
      rule={pick(URYUU_BLUT.rule, locale)}
      source={pick(URYUU_BLUT.source, locale)}
      hero={hero}
    >
      {/* ══ 3 · TEKNİK FÖY ═════════════════════════════════════════════════
          Künye bir tablo değil bir föy: satırlar ızgaraya oturuyor, değerler
          sağa dayanıyor, aralarında hiçbir boşluk serbest değil. */}
      <section className={styles.section} aria-labelledby="ury-identity">
        <p className={styles.sectionMark} lang="de" aria-hidden>
          {URYUU_SECTIONS.identity.mark}
        </p>
        <h2 id="ury-identity" className={styles.sectionTitle}>
          {pick(URYUU_SECTIONS.identity.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(URYUU_SECTIONS.identity.lede, locale)}
        </p>

        <dl className={styles.facts}>
          {URYUU_FACTS.map((fact, index) => (
            /* ⚠️ `dl > div` içinde YALNIZCA `dt`/`dd` olabilir (HTML şartı):
               satır numarası bu yüzden `dt`nin içinde duruyor, kardeşi
               olarak değil. */
            <div key={fact.label.tr} className={styles.fact}>
              <dt className={styles.factLabel}>
                <span className={styles.factIndex} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {pick(fact.label, locale)}
              </dt>
              <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.factNote}>{pick(URYUU_FACT_NOTE, locale)}</p>
      </section>

      {/* ══ 4a · ÜÇ ANA SİSTEM ═════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="ury-arsenal">
        <p className={styles.sectionMark} lang="de" aria-hidden>
          {URYUU_SECTIONS.arsenal.mark}
        </p>
        <h2 id="ury-arsenal" className={styles.sectionTitle}>
          {pick(URYUU_SECTIONS.arsenal.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(URYUU_SECTIONS.arsenal.lede, locale)}
        </p>

        <ol className={styles.armList}>
          {URYUU_ARSENAL.map((arm, index) => (
            <li key={arm.key} className={styles.arm}>
              <span className={styles.armIndex} aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Gotik aile: Latin-1 sınırları içinde özel ad, aria-hidden.
                  Erişilebilir ad bir alttaki mono satırda duruyor. */}
              <p className={styles.armName} lang="de" aria-hidden>
                {arm.name}
              </p>
              <h3 className={styles.armHeading}>
                <span className={styles.armRomaji}>{arm.romaji}</span>
                <span className={styles.armKanji} lang="ja">
                  {arm.kanji}
                </span>
                <span className={styles.armTurkish}>
                  {pick(arm.turkish, locale)}
                </span>
              </h3>

              <p className={styles.armTagline}>{pick(arm.tagline, locale)}</p>
              <p className={styles.armText}>{pick(arm.text, locale)}</p>

              <ul className={styles.armTraits}>
                {arm.traits.map((trait) => (
                  <li key={trait.tr} className={styles.trait}>
                    {pick(trait, locale)}
                  </li>
                ))}
              </ul>

              {frame(arm.imageKey, styles.frameWide)}
            </li>
          ))}
        </ol>
      </section>

      {/* ══ 4b · DÖRT ALET ═════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="ury-kit">
        <p className={styles.sectionMark} lang="de" aria-hidden>
          {URYUU_SECTIONS.kit.mark}
        </p>
        <h2 id="ury-kit" className={styles.sectionTitle}>
          {pick(URYUU_SECTIONS.kit.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(URYUU_SECTIONS.kit.lede, locale)}
        </p>

        <MeasureAxis
          className={styles.axis}
          railClassName={styles.axisRail}
          tickClassName={styles.axisTick}
          majorClassName={styles.axisMajor}
        />

        <ul className={styles.kitList}>
          {URYUU_KIT.map((kit) => (
            <li key={kit.key} className={styles.kit}>
              <h3 className={styles.kitName}>{kit.name}</h3>
              {kit.kanji ? (
                <p className={styles.kitKanji} lang="ja">
                  {kit.kanji}
                </p>
              ) : null}
              <p className={styles.kitTurkish}>{pick(kit.turkish, locale)}</p>
              <p className={styles.kitNote}>{pick(kit.note, locale)}</p>
              {frame(kit.imageKey, styles.frameSmall)}
            </li>
          ))}
        </ul>
      </section>

      {/* ══ 5 · NİŞANGÂH — SAYFANIN KALBİ ══════════════════════════════════ */}
      <section className={styles.reticleSection} aria-labelledby="ury-reticle">
        <p className={styles.sectionMark} lang="de" aria-hidden>
          {URYUU_SECTIONS.reticle.mark}
        </p>
        <h2 id="ury-reticle" className={styles.sectionTitle}>
          {pick(URYUU_SECTIONS.reticle.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(URYUU_SECTIONS.reticle.lede, locale)}
        </p>

        <ReticleBoard
          targets={reticleTargets}
          labels={{
            boardLabel: pick(URYUU_RETICLE_UI.boardLabel, locale),
            boardHint: pick(URYUU_RETICLE_UI.boardHint, locale),
            idleTitle: pick(URYUU_RETICLE_UI.idleTitle, locale),
            idleText: pick(URYUU_RETICLE_UI.idleText, locale),
            panelTitle: pick(URYUU_RETICLE_UI.panelTitle, locale),
            distanceLabel: pick(URYUU_RETICLE_UI.distanceLabel, locale),
            angleLabel: pick(URYUU_RETICLE_UI.angleLabel, locale),
            arrowsLabel: pick(URYUU_RETICLE_UI.arrowsLabel, locale),
            verdictLabel: pick(URYUU_RETICLE_UI.verdictLabel, locale),
            lockedLabel: pick(URYUU_RETICLE_UI.lockedLabel, locale),
            releaseLabel: pick(URYUU_RETICLE_UI.releaseLabel, locale),
            statusLocked: pick(URYUU_RETICLE_UI.statusLocked, locale),
            statusReleased: pick(URYUU_RETICLE_UI.statusReleased, locale),
            linkLabel: pick(URYUU_RETICLE_UI.linkLabel, locale),
            readingNote: pick(URYUU_RETICLE_UI.readingNote, locale),
          }}
        />

        {frame(URYUU_IMAGE_KEYS.reticle, styles.frameWide)}
      </section>

      {/* ══ 6 · BEŞ DURAK ══════════════════════════════════════════════════ */}
      <section className={styles.section} aria-labelledby="ury-fate">
        <p className={styles.sectionMark} lang="de" aria-hidden>
          {URYUU_SECTIONS.fate.mark}
        </p>
        <h2 id="ury-fate" className={styles.sectionTitle}>
          {pick(URYUU_SECTIONS.fate.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(URYUU_SECTIONS.fate.lede, locale)}
        </p>

        <ol className={styles.fate}>
          {URYUU_TIMELINE.map((stop) => (
            <li key={stop.key} className={styles.stop}>
              <p className={styles.stopStamp}>{pick(stop.stamp, locale)}</p>
              <h3 className={styles.stopTitle}>{pick(stop.title, locale)}</h3>
              <p className={styles.stopText}>{pick(stop.text, locale)}</p>

              {/* Tırnak içinde DİYALOG YOK — doğrulanmış özgün terim var.
                  Gerekçesi `URYUU_QUOTE_NOTE` ve veri dosyasının başında. */}
              <figure className={styles.stopTerm}>
                <p className={styles.stopTermText} lang="ja">
                  {stop.term.text}
                </p>
                <p className={styles.stopTermReading}>
                  {pick(stop.term.reading, locale)}
                </p>
                <figcaption className={styles.stopTermBy}>
                  {pick(stop.term.source, locale)}
                </figcaption>
              </figure>

              {frame(stop.imageKey, styles.frameScene)}
            </li>
          ))}
        </ol>
      </section>

      {/* ══ 7a · BAĞLAR ════════════════════════════════════════════════════
          Beşi de `EXPERIENCE_COMPANIONS[564]` listesinden; bu listenin
          dışında portre çizilmiyor. Kaydı olmayan adlar portresiz duruyor
          ve kayıt girildiğinde kendiliğinden yerine oturuyor. */}
      <section className={styles.section} aria-labelledby="ury-bonds">
        <p className={styles.sectionMark} lang="de" aria-hidden>
          {URYUU_SECTIONS.bonds.mark}
        </p>
        <h2 id="ury-bonds" className={styles.sectionTitle}>
          {pick(URYUU_SECTIONS.bonds.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(URYUU_SECTIONS.bonds.lede, locale)}
        </p>

        <ul className={styles.bonds}>
          {URYUU_BONDS.map((bond) => {
            const linked = isExperienceCharacter(bond.characterId);
            const face = portraits.get(bond.characterId) ?? null;
            return (
              <li key={bond.characterId} className={styles.bond}>
                <div className={styles.bondFace} data-filled={face ? "true" : "false"}>
                  {face ? (
                    <Image
                      className={styles.bondImg}
                      src={face}
                      alt={`${pick(URYUU_ALT.companionPrefix, locale)} ${bond.name}`}
                      fill
                      sizes="6rem"
                    />
                  ) : null}
                  <span className={styles.frameCorners} aria-hidden />
                </div>

                <div className={styles.bondBody}>
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
                  <span className={styles.bondRole}>{pick(bond.role, locale)}</span>
                  <p className={styles.bondText}>{pick(bond.summary, locale)}</p>
                  <span className={styles.bondFlag}>
                    {pick(linked ? URYUU_BOND_UI.hasPage : URYUU_BOND_UI.noPage, locale)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ══ 7b · EVRENİN KENDİ KAYDI ═══════════════════════════════════════
          Üç çapa da `lib/anime/bleach/anchors.ts` defterinde doğrulandı
          (empire · powers · war). Adres `animeHref.bleach()` ile kuruluyor —
          hiçbir bileşen `/anime/...` dizesini elle yazmıyor. */}
      <section className={styles.section} aria-labelledby="ury-hall">
        <h2 id="ury-hall" className={styles.sectionTitle}>
          {pick(URYUU_HALL_UI.title, locale)}
        </h2>
        <p className={styles.sectionLede}>{pick(URYUU_HALL_UI.lede, locale)}</p>

        <ul className={styles.hallList}>
          {URYUU_HALL_LINKS.map((entry) => (
            <li key={entry.anchor} className={styles.hall}>
              <Link
                className={styles.hallLink}
                href={`${animeHref.bleach()}#${entry.anchor}`}
              >
                {pick(entry.label, locale)}
              </Link>
              <span className={styles.hallNote}>{pick(entry.note, locale)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ══ 7c · KAPANIŞ ═══════════════════════════════════════════════════ */}
      <section className={styles.closing} aria-labelledby="ury-closing">
        <p className={styles.sectionMark} lang="de" aria-hidden>
          {URYUU_SECTIONS.closing.mark}
        </p>
        <h2 id="ury-closing" className={styles.sectionTitle}>
          {pick(URYUU_SECTIONS.closing.title, locale)}
        </h2>
        <p className={styles.sectionLede}>
          {pick(URYUU_SECTIONS.closing.lede, locale)}
        </p>

        <p className={styles.quoteNote}>{pick(URYUU_QUOTE_NOTE, locale)}</p>

        <ul className={styles.closingBlocks}>
          {URYUU_CLOSING.blocks.map((block) => (
            <li key={block.text}>
              <figure className={styles.closingBlock}>
                <p className={styles.closingTerm} lang="ja">
                  {block.text}
                </p>
                <p className={styles.closingReading}>
                  {pick(block.reading, locale)}
                </p>
                <p className={styles.closingText}>{pick(block.note, locale)}</p>
                {/* `figcaption` figure'un SON çocuğu olmak zorunda (HTML
                    şartı): not bloğu bilerek onun üstünde duruyor. */}
                <figcaption className={styles.closingBy}>
                  {pick(block.by, locale)}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <StitchRule
          className={styles.stitch}
          threadClassName={styles.stitchThread}
          needleClassName={styles.stitchNeedle}
        />

        <p className={styles.motto} lang="ja">
          {URYUU_CLOSING.motto}
        </p>
        <p className={styles.mottoNote}>
          {pick(URYUU_CLOSING.mottoReading, locale)}
        </p>

        {frame(URYUU_IMAGE_KEYS.closing, styles.frameBand)}

        <p className={styles.credit}>
          {pick(URYUU_CLOSING.credit, locale)}{" "}
          <a
            className={styles.creditLink}
            href={siteUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {pick(URYUU_CLOSING.creditLink, locale)}
          </a>
        </p>
        <p className={styles.creditNote}>
          {pick(URYUU_CLOSING.creditNote, locale)}
        </p>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(URYUU_GAPS.title, locale)}
          emptyLabel={pick(URYUU_GAPS.empty, locale)}
          filledLabel={pick(URYUU_GAPS.filled, locale)}
          allFilledLabel={pick(URYUU_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </BlutShell>
  );
}
