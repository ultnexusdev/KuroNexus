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
  TOUDOU_ALT,
  TOUDOU_BONDS,
  TOUDOU_BOND_UI,
  TOUDOU_BROTHER,
  TOUDOU_CLAP_UI,
  TOUDOU_CLOSING,
  TOUDOU_CRUMB,
  TOUDOU_FRAME_EMPTY,
  TOUDOU_GAPS,
  TOUDOU_GLOSSARY,
  TOUDOU_HERO,
  TOUDOU_ID,
  TOUDOU_IDENTITY,
  TOUDOU_IMAGE_KEYS,
  TOUDOU_KIT,
  TOUDOU_MISSING_NOTE,
  TOUDOU_MODE,
  TOUDOU_PORTRAIT,
  TOUDOU_PORTRAIT_SLOT,
  TOUDOU_POWERS,
  TOUDOU_PRODUCTIONS,
  TOUDOU_SECTIONS,
  TOUDOU_SITE_URL,
  TOUDOU_SLOT_LABELS,
  TOUDOU_SLOT_SIZES,
  TOUDOU_SLOT_SPECS,
  TOUDOU_STAGE,
  TOUDOU_TAKADA,
  TOUDOU_TIMELINE,
} from "@/lib/characters/aoi-toudou-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { BrotherStage } from "./BrotherStage";
import { ClapStage, type ClapPanel } from "./ClapStage";
import {
  ClapHands,
  IdolSilhouette,
  StarBurst,
  SwapArrows,
} from "./ToudouGlyphs";
import styles from "./BoogieWoogieExperience.module.css";

/**
 * Aoi Tōdō — "Boogie Woogie" (不義遊戯) deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/137975 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek kelime: TAKAS.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Dalga 4'ün diğer yedi sayfası dar ve gergin: Chōsō'nun damar sütunu,
 * Maki'nin askeri envanteri, Mahito'nun dikişli parçaları, Tōji'nin boş
 * gökyüzü, Jōgo'nun kül katmanları, Yūta'nın monokrom kolonu. Bu sayfa
 * onların hiçbirine benzemiyor çünkü bir İDOL POSTERİ: her bölüm ortalanmış,
 * simetrik, kalın çerçeveli bir poster bloğu; başlıklar dev ve ortalı;
 * Takada-chan bölümünde pop etiketler var. Dalganın en parlak ve en neşeli
 * sayfası olması bilinçli — Tōdō'nun sayfası ciddiyetsiz olabilir.
 *
 * Parlaklık YENİ RENKTEN gelmiyor (palet kilitli): `--accent` ve `--gold`
 * yoğunluğu, kalın çerçeveler, dev tipografi ve geniş boşluk ritmiyle
 * kuruluyor.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (alkış filigranı + 不義遊戯 + portre madalyonu + boş poster)
 *   2 mod düğmesi — "Kardeşim!" (`BrotherStage` içinde, durum orada)
 *   3 künye şeridi — poster kuyruğu; kan grubu satırı bilerek boş
 *   4 lanet laboratuvarı: üç büyük + dört küçük + sözlük (JJK terimleri)
 *   5 ALKIŞ — sayfanın kalbi; üç ayrı takas alanı + Takada-chan bölümü
 *   6 kader çizelgesi — beş durak, hepsi 18 yaş, sabit terimler tırnakta
 *   7 kadro + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   BrotherStage — kök öğe + "Kardeşim!" modu (tek boolean)
 *   ClapStage    — takas alanı; sayfada ÜÇ KEZ kuruluyor, üçü bağımsız
 * `ToudouGlyphs` sunucu bileşeni: adalar onu import ETMİYOR, ihtiyaç
 * duydukları motif prop olarak iniyor (gerekçe o dosyanın başlığında).
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca madalyon
 * ölçüsünde). Büyük hero posteri ve on bir kadraj BOŞ ve küratör yuvası
 * olarak duruyor; her kadrajın HEMEN ALTINDA kendi yuvası var (sayfa sonunda
 * toplu yuva bloğu yasak).
 *
 * ⚠️ TAKAS EDİLEN KADRAJIN YUVASI KADRAJLA BİRLİKTE TAŞINIYOR: üç büyük
 * kartın her biri `frame()` çıktısını taşıyor ve o çıktı figürle yuvayı TEK
 * parçada tutuyor. Yuva ayrı bir listede dursaydı takastan sonra küratör
 * yanlış yuvaya yüklerdi.
 *
 * ⚠️ Yoldaş portrelerinin altında yuva YOK: o kareler başka karakterlerin
 * kendi PORTRAIT kayıtlarından geliyor (Grimmjow emsali).
 */
export function BoogieWoogieExperience({
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
     kare. `unoptimized` kararı Faz 2 kuralına göre `isUploadedPortrait`
     üzerinden veriliyor. AniList'e hotlink YOK. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? TOUDOU_PORTRAIT.src;

  const name = detail.character.name || TOUDOU_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? TOUDOU_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? TOUDOU_SITE_URL;

  const gapRows: CuratorGapRow[] = Object.values(TOUDOU_IMAGE_KEYS).map(
    (key) => ({
      key,
      label: pick(TOUDOU_SLOT_LABELS[key], locale),
      spec: pick(TOUDOU_SLOT_SPECS[key], locale),
      filled: ability.has(key),
    }),
  );

  /**
   * Bir poster kadrajı + HEMEN ALTINDA kendi yuvası (kullanıcı şartı).
   *
   * ⚠️ Kadraj boşken çökmüyor: içine elle çizilmiş ışık patlaması giriyor ve
   * poster oranı korunuyor. Ziyaretçi orada bir eksik değil, bir motif
   * görüyor.
   *
   * ⚠️ Üretim künyesi ("geniş kadraj · 1600×900 · webp") YALNIZCA yöneticiye
   * çiziliyor — dolusuna da boşuna da. Dalga 1'de Levi'de bu metin ziyaretçiye
   * sızmıştı; burada `isAdmin` dalının dışına hiç çıkmıyor.
   *
   * ⚠️ PERDE: yüklenen karenin üstünde künye metni duruyor ve o metnin
   * kontrastı görselin parlaklığına bağlı kalamaz. `.frameScrim` yalnızca
   * kadraj DOLUYKEN çiziliyor.
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
                alt={`${pick(TOUDOU_ALT.scenePrefix, locale)} ${pick(
                  TOUDOU_SLOT_LABELS[key],
                  locale,
                )}`}
                fill
                sizes="(max-width: 46rem) 92vw, 40rem"
              />
              {isAdmin ? (
                <span className={styles.frameScrim} aria-hidden />
              ) : null}
            </>
          ) : (
            <span className={styles.frameBurst} aria-hidden>
              <StarBurst
                className={styles.burstArt}
                rayClassName={styles.burstRay}
                starClassName={styles.burstStar}
              />
            </span>
          )}

          {isAdmin ? (
            <figcaption className={styles.frameCaption} data-curator-slot>
              <span className={styles.frameCaptionWord}>
                {scene
                  ? pick(TOUDOU_GAPS.filled, locale)
                  : pick(TOUDOU_FRAME_EMPTY, locale)}
              </span>
              <span className={styles.frameCaptionSpec}>
                {pick(TOUDOU_SLOT_SPECS[key], locale)}
              </span>
            </figcaption>
          ) : null}
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={TOUDOU_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(TOUDOU_SLOT_LABELS[key], locale)}
            size={TOUDOU_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /**
   * "Kardeşim!" açıkken bölümün altında beliren Yūji şeridi.
   *
   * Mod kapalıyken CSS bunu `display: none` yapıyor — yani şerit ekran
   * okuyucudan da çıkıyor. Yūji'nin yüzü kendi PORTRAIT kaydından geliyor;
   * kayıt yoksa şerit yüzsüz ama ayakta çiziliyor.
   */
  const yuujiFace = faces.get(TOUDOU_BROTHER.characterId) ?? null;
  const brotherStrip = (line: keyof typeof TOUDOU_BROTHER.lines) => (
    <aside className={styles.brother}>
      <span
        className={styles.brotherFace}
        data-has={yuujiFace ? "true" : "false"}
      >
        {yuujiFace ? (
          <Image
            className={styles.brotherFaceImg}
            src={yuujiFace}
            alt={`${pick(TOUDOU_ALT.companionPrefix, locale)} ${
              TOUDOU_BROTHER.name
            }`}
            fill
            sizes="72px"
          />
        ) : (
          <span className={styles.brotherFaceEmpty}>
            {pick(TOUDOU_BROTHER.missing, locale)}
          </span>
        )}
      </span>
      <span className={styles.brotherBody}>
        <span className={styles.brotherBadge}>
          {pick(TOUDOU_BROTHER.badge, locale)}
        </span>
        <Link
          className={styles.brotherName}
          href={animeHref.character(TOUDOU_BROTHER.characterId)}
        >
          {TOUDOU_BROTHER.name}
        </Link>
        <span className={styles.brotherNative} lang="ja">
          {TOUDOU_BROTHER.native}
        </span>
        <span className={styles.brotherLine}>
          {pick(TOUDOU_BROTHER.lines[line], locale)}
        </span>
      </span>
    </aside>
  );

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran iki parçalı ve ikisi de elle: birbirine değen iki el (SVG) ve
     tekniğin adı 不義遊戯. İkisi de `aria-hidden`; okunabilir karşılıkları
     künye şeridinde ve laboratuvarda metin olarak var. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>
          {pick(TOUDOU_CRUMB.series, locale)}
        </span>
      </nav>

      <section
        className={styles.poster}
        data-block="hero"
        aria-labelledby="tdo-name"
      >
        <span className={styles.watermark} aria-hidden>
          <ClapHands
            className={styles.watermarkArt}
            handClassName={styles.watermarkHand}
            sparkClassName={styles.watermarkSpark}
          />
          <span className={styles.watermarkKanji} lang="ja">
            不義遊戯
          </span>
        </span>

        <div className={styles.posterInner}>
          <p className={styles.eyebrow}>{pick(TOUDOU_HERO.eyebrow, locale)}</p>

          {/* Sayfanın en büyük öğesi: ortalanmış, dev, poster başlığı.
              Archivo Black yalnızca `latin` altkümesiyle yükleniyor, o yüzden
              yığında Impact var — Türkçe ş/ğ/İ o yedekten geliyor. */}
          <h1 id="tdo-name" className={styles.heroName}>
            {name}
          </h1>

          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>

          <p className={styles.heroBilling}>
            <span className={styles.heroBillingWord}>
              {pick(TOUDOU_HERO.billing, locale)}
            </span>
            <span className={styles.heroBillingNative} lang="ja">
              {TOUDOU_HERO.billingNative}
            </span>
          </p>

          <p className={styles.heroTagline}>
            {pick(TOUDOU_HERO.tagline, locale)}
          </p>

          {/* Künye portresi — 230×345, yani KÜÇÜK: madalyon ölçüsünde. */}
          <figure className={styles.medallion}>
            <Image
              className={styles.medallionImg}
              src={portraitSrc}
              alt={pick(
                portraitUploaded
                  ? TOUDOU_ALT.portraitUploaded
                  : TOUDOU_ALT.portrait,
                locale,
              )}
              width={TOUDOU_PORTRAIT.w}
              height={TOUDOU_PORTRAIT.h}
              unoptimized={!portraitUploaded}
              priority
            />
          </figure>
          {isAdmin ? (
            <CuratorSlot
              characterId={TOUDOU_ID}
              slot="PORTRAIT"
              label={pick(TOUDOU_PORTRAIT_SLOT, locale)}
              size={{ w: 1200, h: 1600 }}
            />
          ) : null}

          <p className={styles.heroLede}>{pick(TOUDOU_HERO.lede, locale)}</p>

          {/* Büyük poster karesi bilerek BOŞ. Not yalnızca kadraj GERÇEKTEN
              boşken yazılıyor: küratör kareyi yükleyince o cümle yalan olurdu. */}
          {src(TOUDOU_IMAGE_KEYS.hero) ? null : (
            <p className={styles.heroFrameNote}>
              {pick(TOUDOU_HERO.heroCaption, locale)}
            </p>
          )}
          {frame(TOUDOU_IMAGE_KEYS.hero, styles.frameTall)}

          <p className={styles.heroSignature}>
            {pick(TOUDOU_HERO.signature, locale)}
          </p>
          <p className={styles.heroSignatureNote}>
            {pick(TOUDOU_HERO.signatureNote, locale)}
          </p>
          <p className={styles.heroMarkNote}>
            {pick(TOUDOU_HERO.watermarkNote, locale)}
          </p>
        </div>
      </section>
    </>
  );

  /* ══ 4a · ÜÇ BÜYÜK KART — TAKAS ALANI 1 ═════════════════════════════════
     Her kart kendi poster kadrajını ve o kadrajın yuvasını TEK parçada
     taşıyor, yani takasta ikisi birlikte gidiyor. */
  const powerPanels: ClapPanel[] = TOUDOU_POWERS.map((power) => ({
    key: power.key,
    name: power.name,
    node: (
      <article className={styles.power}>
        <p className={styles.powerKind}>{pick(power.kind, locale)}</p>
        <h3 className={styles.powerName}>{power.name}</h3>
        <p className={styles.powerNative}>
          <span lang="ja">{power.native}</span>
          <span className={styles.powerReading}>{power.reading}</span>
        </p>
        <p className={styles.powerTurkish}>{pick(power.turkish, locale)}</p>
        <p className={styles.powerTagline}>{pick(power.tagline, locale)}</p>
        <p className={styles.powerText}>{pick(power.text, locale)}</p>
        <ul className={styles.powerTraits}>
          {power.traits.map((trait) => (
            <li key={trait.tr} className={styles.trait}>
              {pick(trait, locale)}
            </li>
          ))}
        </ul>
        {frame(power.imageKey, styles.frameWide)}
      </article>
    ),
  }));

  /* ══ 4b · DÖRT KÜÇÜK NOT — TAKAS ALANI 2 ════════════════════════════════ */
  const kitPanels: ClapPanel[] = TOUDOU_KIT.map((kit) => ({
    key: kit.key,
    name: kit.name,
    node: (
      <article className={styles.kit}>
        <h3 className={styles.kitName}>{kit.name}</h3>
        <p className={styles.kitNative}>
          <span lang="ja">{kit.native}</span>
          <span className={styles.kitReading}>{kit.reading}</span>
        </p>
        <p className={styles.kitNote}>{pick(kit.note, locale)}</p>
      </article>
    ),
  }));

  /* ══ 5 · SAHNE — TAKAS ALANI 3 ══════════════════════════════════════════
     Altı panel: Tōdō'nun kendisi, arşivde sayfası olan dört kişi ve
     Takada-chan. Yoldaş portreleri o karakterlerin KENDİ PORTRAIT
     kayıtlarından geliyor, o yüzden altlarında yükleme yuvası yok.

     ⚠️ Takada panelindeki siluet bir KADRAJ DEĞİL, bir yüz yerine geçen
     dekoratif çizim — o yüzden altında yuva yok. Takada-chan'ın gerçek
     kadrajı ve yuvası (`tdo:takada`) kendi bölümünde duruyor; aynı anahtar
     için iki yükleme kutusu koymak küratörü ikiye bölerdi. */
  const stagePanels: ClapPanel[] = TOUDOU_STAGE.map((person) => {
    const face =
      person.characterId !== null
        ? (faces.get(person.characterId) ?? null)
        : null;
    const linked =
      person.characterId !== null && isExperienceCharacter(person.characterId);
    return {
      key: person.key,
      name: person.name,
      node: (
        <article className={styles.figure} data-kind={person.kind}>
          <span
            className={styles.figureFace}
            data-has={face || person.kind !== "companion" ? "true" : "false"}
          >
            {person.kind === "self" ? (
              <Image
                className={styles.figureFaceImg}
                src={portraitSrc}
                alt={pick(
                  portraitUploaded
                    ? TOUDOU_ALT.portraitUploaded
                    : TOUDOU_ALT.portrait,
                  locale,
                )}
                fill
                sizes="120px"
                unoptimized={!portraitUploaded}
              />
            ) : face ? (
              <Image
                className={styles.figureFaceImg}
                src={face}
                alt={`${pick(TOUDOU_ALT.companionPrefix, locale)} ${person.name}`}
                fill
                sizes="120px"
              />
            ) : person.kind === "idol" ? (
              <span className={styles.idol} aria-hidden>
                <IdolSilhouette
                  className={styles.idolArt}
                  bodyClassName={styles.idolBody}
                  lineClassName={styles.idolLine}
                />
              </span>
            ) : (
              <span className={styles.figureFaceEmpty}>
                {pick(TOUDOU_BOND_UI.portraitMissing, locale)}
              </span>
            )}
          </span>

          <h3 className={styles.figureName}>
            {linked && person.characterId !== null ? (
              <Link
                className={styles.figureLink}
                href={animeHref.character(person.characterId)}
              >
                {person.name}
              </Link>
            ) : (
              person.name
            )}
          </h3>
          <p className={styles.figureNative} lang="ja">
            {person.native}
          </p>
          <p className={styles.figureNote}>{pick(person.note, locale)}</p>
        </article>
      ),
    };
  });

  /* Üç alan da aynı sözlüğü kullanıyor; yalnızca `fieldLabel` ayrışıyor. */
  const clapUi = {
    markAction: pick(TOUDOU_CLAP_UI.markAction, locale),
    unmarkAction: pick(TOUDOU_CLAP_UI.unmarkAction, locale),
    clapAction: pick(TOUDOU_CLAP_UI.clapAction, locale),
    resetAction: pick(TOUDOU_CLAP_UI.resetAction, locale),
    hintPick: pick(TOUDOU_CLAP_UI.hintPick, locale),
    hintOne: pick(TOUDOU_CLAP_UI.hintOne, locale),
    hintReady: pick(TOUDOU_CLAP_UI.hintReady, locale),
    statusNeedTwo: pick(TOUDOU_CLAP_UI.statusNeedTwo, locale),
    statusMarked: pick(TOUDOU_CLAP_UI.statusMarked, locale),
    statusUnmarked: pick(TOUDOU_CLAP_UI.statusUnmarked, locale),
    statusSwapped: pick(TOUDOU_CLAP_UI.statusSwapped, locale),
    statusReset: pick(TOUDOU_CLAP_UI.statusReset, locale),
    keyboardHint: pick(TOUDOU_CLAP_UI.keyboardHint, locale),
  };

  /** Alkış düğmesinin içindeki takas oku — sunucuda çizilip prop'la iniyor. */
  const swapGlyph = (
    <SwapArrows
      className={styles.swapArt}
      arcClassName={styles.swapArc}
      headClassName={styles.swapHead}
    />
  );

  return (
    <BrotherStage
      title={pick(TOUDOU_MODE.title, locale)}
      native={TOUDOU_MODE.native}
      nativeReading={pick(TOUDOU_MODE.nativeReading, locale)}
      enterLabel={pick(TOUDOU_MODE.enter, locale)}
      exitLabel={pick(TOUDOU_MODE.exit, locale)}
      hintOn={pick(TOUDOU_MODE.hintOn, locale)}
      hintOff={pick(TOUDOU_MODE.hintOff, locale)}
      note={pick(TOUDOU_MODE.note, locale)}
      glyph={
        <ClapHands
          className={styles.modeGlyphArt}
          handClassName={styles.modeGlyphHand}
          sparkClassName={styles.modeGlyphSpark}
        />
      }
      hero={hero}
    >
      {/* ══ 3 · KÜNYE ŞERİDİ ════════════════════════════════════════════════
          Poster kuyruğu: adın altına basılan sayılar. Kan grubu satırı BOŞ
          bir cevap taşıyor — AniList kaydında da boş. */}
      <section
        className={styles.poster}
        data-block="identity"
        aria-labelledby="tdo-identity"
      >
        <div className={styles.posterInner}>
          <h2 id="tdo-identity" className={styles.posterTitle}>
            {pick(TOUDOU_SECTIONS.identity.title, locale)}
          </h2>
          <p className={styles.posterLede}>
            {pick(TOUDOU_SECTIONS.identity.lede, locale)}
          </p>

          <dl className={styles.facts}>
            {TOUDOU_IDENTITY.facts.map((fact) => (
              <div
                key={fact.key}
                className={styles.fact}
                data-blank={fact.blank ? "true" : "false"}
              >
                <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
                <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.factNote}>{pick(TOUDOU_MISSING_NOTE, locale)}</p>
          <p className={styles.factNote}>
            {pick(TOUDOU_IDENTITY.romanized, locale)}
          </p>

          <div className={styles.productions}>
            <h3 className={styles.productionsTitle}>
              {pick(TOUDOU_PRODUCTIONS.title, locale)}
            </h3>
            <ul className={styles.productionsList}>
              {TOUDOU_PRODUCTIONS.items.map((item) => (
                <li key={item.tr} className={styles.production}>
                  <span className={styles.productionName}>
                    {pick(item, locale)}
                  </span>
                  <span className={styles.productionRole}>
                    {pick(TOUDOU_PRODUCTIONS.role, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {brotherStrip("identity")}
        </div>
      </section>

      {/* ══ 4a · LANET LABORATUVARI — ÜÇ BÜYÜK KART ════════════════════════ */}
      <section
        className={styles.poster}
        data-block="power"
        aria-labelledby="tdo-power"
      >
        <div className={styles.posterInner}>
          <h2 id="tdo-power" className={styles.posterTitle}>
            {pick(TOUDOU_SECTIONS.power.title, locale)}
          </h2>
          <p className={styles.posterLede}>
            {pick(TOUDOU_SECTIONS.power.lede, locale)}
          </p>

          <ClapStage
            items={powerPanels}
            variant="powers"
            fieldLabel={pick(TOUDOU_CLAP_UI.fieldPowers, locale)}
            clapGlyph={swapGlyph}
            {...clapUi}
          />

          {brotherStrip("power")}
        </div>
      </section>

      {/* ══ 4b · DÖRT KÜÇÜK NOT + SÖZLÜK ═══════════════════════════════════ */}
      <section
        className={styles.poster}
        data-block="kit"
        aria-labelledby="tdo-kit"
      >
        <div className={styles.posterInner}>
          <h2 id="tdo-kit" className={styles.posterTitle}>
            {pick(TOUDOU_SECTIONS.kit.title, locale)}
          </h2>
          <p className={styles.posterLede}>
            {pick(TOUDOU_SECTIONS.kit.lede, locale)}
          </p>

          <ClapStage
            items={kitPanels}
            variant="kit"
            fieldLabel={pick(TOUDOU_CLAP_UI.fieldKit, locale)}
            clapGlyph={swapGlyph}
            {...clapUi}
          />

          <div className={styles.glossary}>
            <h3 className={styles.glossaryTitle}>
              {pick(TOUDOU_SECTIONS.glossary.title, locale)}
            </h3>
            <p className={styles.glossaryLede}>
              {pick(TOUDOU_SECTIONS.glossary.lede, locale)}
            </p>
            <dl className={styles.glossaryList}>
              {TOUDOU_GLOSSARY.map((term) => (
                <div key={term.native} className={styles.term}>
                  <dt className={styles.termNative} lang="ja">
                    {term.native}
                  </dt>
                  <dd className={styles.termBody}>
                    <span className={styles.termReading}>{term.reading}</span>
                    <span className={styles.termText}>
                      {pick(term.text, locale)}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {brotherStrip("kit")}
        </div>
      </section>

      {/* ══ 5 · ALKIŞ — SAYFANIN KALBİ ═════════════════════════════════════ */}
      <section
        className={styles.poster}
        data-block="clap"
        aria-labelledby="tdo-clap"
      >
        <div className={styles.posterInner}>
          <h2 id="tdo-clap" className={styles.posterTitle}>
            {pick(TOUDOU_SECTIONS.clap.title, locale)}
          </h2>
          <p className={styles.posterLede}>
            {pick(TOUDOU_SECTIONS.clap.lede, locale)}
          </p>

          <ClapStage
            items={stagePanels}
            variant="stage"
            fieldLabel={pick(TOUDOU_CLAP_UI.fieldStage, locale)}
            clapGlyph={swapGlyph}
            {...clapUi}
          />

          {frame(TOUDOU_IMAGE_KEYS.stage, styles.frameWide)}

          {brotherStrip("clap")}
        </div>
      </section>

      {/* ══ 5b · TAKADA-CHAN ═══════════════════════════════════════════════
          Sayfanın pop etiketli bölümü. Kadraj kalıcı olarak boş kalabilir:
          arşivde Takada-chan'ın karesi yok ve olmayan bir kaynağı gerçekçi
          bir çizimle doldurmak yanlış olurdu. */}
      <section
        className={styles.poster}
        data-block="takada"
        aria-labelledby="tdo-takada"
      >
        <div className={styles.posterInner}>
          <h2 id="tdo-takada" className={styles.posterTitle}>
            {pick(TOUDOU_SECTIONS.takada.title, locale)}
          </h2>
          <p className={styles.posterLede}>
            {pick(TOUDOU_SECTIONS.takada.lede, locale)}
          </p>

          <ul className={styles.pops}>
            {TOUDOU_TAKADA.pops.map((pop) => (
              <li key={pop.tr} className={styles.pop}>
                {pick(pop, locale)}
              </li>
            ))}
          </ul>

          <p className={styles.takadaNative} lang="ja">
            {TOUDOU_TAKADA.native}
          </p>
          <p className={styles.takadaText}>{pick(TOUDOU_TAKADA.text, locale)}</p>

          {frame(TOUDOU_IMAGE_KEYS.takada, styles.frameIdol)}

          <p className={styles.takadaNote}>{pick(TOUDOU_TAKADA.note, locale)}</p>
        </div>
      </section>

      {/* ══ 6 · KADER ÇİZELGESİ ════════════════════════════════════════════ */}
      <section
        className={styles.poster}
        data-block="fate"
        aria-labelledby="tdo-fate"
      >
        <div className={styles.posterInner}>
          <h2 id="tdo-fate" className={styles.posterTitle}>
            {pick(TOUDOU_SECTIONS.fate.title, locale)}
          </h2>
          <p className={styles.posterLede}>
            {pick(TOUDOU_SECTIONS.fate.lede, locale)}
          </p>

          <ol className={styles.fate}>
            {TOUDOU_TIMELINE.map((stop) => (
              <li key={stop.key} className={styles.stop}>
                <p className={styles.stopAge}>{pick(stop.age, locale)}</p>
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

                {frame(stop.imageKey, styles.frameScene)}
              </li>
            ))}
          </ol>

          {brotherStrip("fate")}
        </div>
      </section>

      {/* ══ 7a · KADRO ═════════════════════════════════════════════════════
          Arşivde numarası olan dört isim sayfasına bağlanıyor; Takada-chan ve
          Mai Zen'in düz ad olarak kalıyor — numaraları yok, uydurulmuş bir
          adrese bağlanmıyorlar. */}
      <section
        className={styles.poster}
        data-block="bonds"
        aria-labelledby="tdo-bonds"
      >
        <div className={styles.posterInner}>
          <h2 id="tdo-bonds" className={styles.posterTitle}>
            {pick(TOUDOU_SECTIONS.bonds.title, locale)}
          </h2>
          <p className={styles.posterLede}>
            {pick(TOUDOU_SECTIONS.bonds.lede, locale)}
          </p>

          <ul className={styles.bonds}>
            {TOUDOU_BONDS.map((bond) => {
              const linked =
                bond.characterId !== null &&
                isExperienceCharacter(bond.characterId);
              const face =
                bond.characterId !== null
                  ? (faces.get(bond.characterId) ?? null)
                  : null;
              return (
                <li key={bond.key} className={styles.bond}>
                  <span
                    className={styles.bondFace}
                    data-has={face ? "true" : "false"}
                  >
                    {face ? (
                      <Image
                        className={styles.bondFaceImg}
                        src={face}
                        alt={`${pick(TOUDOU_ALT.companionPrefix, locale)} ${
                          bond.name
                        }`}
                        fill
                        sizes="88px"
                      />
                    ) : (
                      <span className={styles.bondFaceEmpty}>
                        {pick(TOUDOU_BOND_UI.portraitMissing, locale)}
                      </span>
                    )}
                  </span>

                  <span className={styles.bondBody}>
                    {linked && bond.characterId !== null ? (
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
                    <span className={styles.bondFlag}>
                      {pick(
                        linked ? TOUDOU_BOND_UI.hasPage : TOUDOU_BOND_UI.noPage,
                        locale,
                      )}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ══ 7b · KAPANIŞ ═══════════════════════════════════════════════════ */}
      <section
        className={styles.poster}
        data-block="closing"
        aria-labelledby="tdo-closing"
      >
        <div className={styles.posterInner}>
          <h2 id="tdo-closing" className={styles.posterTitle}>
            {pick(TOUDOU_SECTIONS.closing.title, locale)}
          </h2>
          <p className={styles.posterLede}>
            {pick(TOUDOU_SECTIONS.closing.lede, locale)}
          </p>

          <ul className={styles.closingQuotes}>
            {TOUDOU_CLOSING.quotes.map((quote) => (
              <li key={quote.text}>
                <figure className={styles.closingQuote}>
                  <blockquote className={styles.quoteJa} lang="ja">
                    {quote.text}
                  </blockquote>
                  <p className={styles.quoteReading}>
                    {pick(quote.reading, locale)}
                  </p>
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

          <p className={styles.quoteDiscipline}>
            {pick(TOUDOU_CLOSING.quoteDiscipline, locale)}
          </p>

          <p className={styles.motto} lang="ja">
            {TOUDOU_CLOSING.motto}
          </p>
          <p className={styles.mottoReading}>
            {pick(TOUDOU_CLOSING.mottoReading, locale)}
          </p>
          <p className={styles.mottoNote}>
            {pick(TOUDOU_CLOSING.mottoNote, locale)}
          </p>

          {frame(TOUDOU_IMAGE_KEYS.closing, styles.frameBand)}

          <p className={styles.credit}>
            {pick(TOUDOU_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(TOUDOU_CLOSING.creditLink, locale)}
            </a>
          </p>
          <p className={styles.creditNote}>
            {pick(TOUDOU_CLOSING.creditNote, locale)}
          </p>

          {brotherStrip("closing")}
        </div>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(TOUDOU_GAPS.title, locale)}
          emptyLabel={pick(TOUDOU_GAPS.empty, locale)}
          filledLabel={pick(TOUDOU_GAPS.filled, locale)}
          allFilledLabel={pick(TOUDOU_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </BrotherStage>
  );
}
