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
  JOUGO_ALT,
  JOUGO_ASH,
  JOUGO_ASH_READINGS,
  JOUGO_BONDS,
  JOUGO_CLOSING,
  JOUGO_CRUMB,
  JOUGO_GAPS,
  JOUGO_HERO,
  JOUGO_ID,
  JOUGO_IDENTITY,
  JOUGO_IMAGE_KEYS,
  JOUGO_KIT,
  JOUGO_MELT,
  JOUGO_NEXUS,
  JOUGO_PLAIN_NAMES,
  JOUGO_PORTRAIT,
  JOUGO_PORTRAIT_SLOT,
  JOUGO_SECTIONS,
  JOUGO_SITE_URL,
  JOUGO_SLOT_LABELS,
  JOUGO_SLOT_SIZES,
  JOUGO_SLOT_SPECS,
  JOUGO_STRATA,
  JOUGO_STRATA_NOTE,
  JOUGO_TECHNIQUES,
} from "@/lib/characters/jougo-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { AshFall, type AshReading } from "./AshFall";
import { CrustShell } from "./CrustShell";
import { ConeMark, CrackRule, EyeMark, SlabCrack } from "./JougoGlyphs";
import styles from "./VolcanoExperience.module.css";

/**
 * Jōgo — "Yer kesiti" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/156991 bu bileşene çıkıyor
 * (kendi statik rota klasörü). Fikir tek cümle: JŌGO BİR VOLKAN, VE SAYFA
 * O VOLKANIN YANDAN KESİTİ.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Bölümler kart ya da kolon değil, üst üste duran yatay JEOLOJİK
 * KATMANLAR. Her katmanın kendi derinliği var (`data-depth`) ve aşağı
 * indikçe zemin koyulaşıp magmaya doğru ısınıyor. Katmanların arasındaki
 * ayıraç düz bir çizgi değil, elle çizilmiş düzensiz bir MAGMA ÇATLAĞI —
 * altındaki damar nabız gibi parlıyor. Başlıklar Anton ama Eren'in bodur
 * ve sıkışık kullanımının tam tersi: harf aralığı çok geniş, satır aralığı
 * büyük — yayılan ısı gibi. Gövde IBM Plex Mono, yani bir ölçüm defteri.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (tek göz filigranı + boş hero kadrajı)
 *   2 mod düğmesi — "Erime noktası" (`CrustShell` içinde, state orada)
 *   3 künye şeridi (on bir satır + çekirdek portre; takvim satırı
 *     karakterizasyon, boş satır değil)
 *   4 lanet laboratuvarı: üç büyük ağız + dört küçük ölçüm (JJK
 *     terminolojisi: 術式 · 領域展開 · 呪力 · 束縛 · 呪具 · 反転術式)
 *   5 kül — SAYFANIN KALBİ (`AshFall`)
 *   6 kader kesiti — beş katman, yaş yerine DERİNLİK
 *   7 bağlar + evrene açılan çatlaklar + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   CrustShell — kök öğe + "Erime noktası" modu (tek boolean)
 *   AshFall    — kül mekaniği (üç sayaç, bir bayrak)
 * `JougoGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca künye
 * şeridindeki çekirdek kadrajında). Büyük hero karesi ve on dört sahne
 * kadrajı BOŞ; her kadrajın HEMEN ALTINDA kendi yuvası var (kullanıcı
 * şartı — sayfa sonunda toplu yuva bloğu yasak). Boş kadraj yok
 * sayılmıyor: içinde elle çizilmiş çatlamış bazalt levha duruyor, ama
 * ölçü/üretim metni YALNIZCA küratör dalında yazılıyor.
 *
 * ⚠️ Yoldaş portrelerinin altında yuva YOK ve bu bilinçli: onlar başka bir
 * karakterin `CharacterImage` kaydından geliyor, bu sayfanın
 * doldurabileceği kadraj değiller.
 */
export function VolcanoExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ
     resmî kare. İkisi de bizim kaynağımız — AniList'in uzak adresi hiç
     kullanılmıyor (Faz 2 §3: hotlink yok). */
  const uploadedPortrait = isUploadedPortrait(detail)
    ? primaryPortrait(detail)
    : null;
  const portraitSrc = uploadedPortrait ?? JOUGO_PORTRAIT.src;

  const nativeName = detail.character.nameNative ?? JOUGO_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? JOUGO_SITE_URL;

  const gapRows: CuratorGapRow[] = Object.values(JOUGO_IMAGE_KEYS).map((key) => ({
    key,
    label: pick(JOUGO_SLOT_LABELS[key], locale),
    spec: pick(JOUGO_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası.
   *
   * ⚠️ Kadraj BOŞKEN de çiziliyor (bu sayfanın kendi kararı): içinde elle
   * çizilmiş çatlamış bir bazalt levha duruyor, yani kesitin dokusunun
   * parçası oluyor — "yer tutucu" gibi değil, zemin gibi. Ama ÖLÇÜ METNİ
   * yalnızca `isAdmin` dalında: Dalga 1'de Levi'de üretim metadatası
   * ("geniş kadraj · 1400×900 · webp") ziyaretçiye sızmış ve ekran okuyucu
   * onu yirmi kez okumuştu.
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
              className={styles.frameImg}
              src={scene}
              alt={`${pick(JOUGO_ALT.scenePrefix, locale)} ${pick(
                JOUGO_SLOT_LABELS[key],
                locale,
              )}`}
              fill
              sizes="(max-width: 48rem) 92vw, 44rem"
            />
          ) : (
            <span className={styles.frameSlab} aria-hidden>
              <SlabCrack
                className={styles.frameSlabArt}
                slabClassName={styles.frameSlabEdge}
                crackClassName={styles.frameSlabCrack}
                emberClassName={styles.frameSlabEmber}
              />
            </span>
          )}
          {isAdmin && !scene ? (
            <figcaption className={styles.frameSpec} data-curator-slot>
              {pick(JOUGO_SLOT_SPECS[key], locale)}
            </figcaption>
          ) : null}
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={JOUGO_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(JOUGO_SLOT_LABELS[key], locale)}
            size={JOUGO_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /** Katman ayıracı: elle çizilmiş düzensiz bir magma çatlağı. */
  const crack = (
    <span className={styles.crack} aria-hidden>
      <CrackRule
        className={styles.crackArt}
        lineClassName={styles.crackLine}
        glowClassName={styles.crackGlow}
        branchClassName={styles.crackBranch}
      />
    </span>
  );

  /* Kül mekaniğine inen okumalar — metinler burada düz dizeye çözülüyor. */
  const ashReadings: AshReading[] = JOUGO_ASH_READINGS.map((reading) => ({
    key: reading.key,
    native: reading.native,
    title: pick(reading.title, locale),
    text: pick(reading.text, locale),
  }));

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran: elle çizilmiş tek göz + 漏瑚. İkisi de `aria-hidden`;
     taşıdıkları bilgi ayrı bir satırda YAZIYLA da veriliyor. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>{pick(JOUGO_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.hero} data-depth="0" aria-labelledby="jgo-name">
        <span className={styles.heroMark} aria-hidden>
          <EyeMark
            className={styles.heroMarkArt}
            rimClassName={styles.heroMarkRim}
            eyeClassName={styles.heroMarkEye}
            irisClassName={styles.heroMarkIris}
          />
          <span className={styles.heroMarkKanji} lang="ja">
            漏瑚
          </span>
        </span>

        <p className={styles.heroHouse}>{pick(JOUGO_HERO.house, locale)}</p>

        <h1 id="jgo-name" className={styles.heroName}>
          {JOUGO_IDENTITY.display}
        </h1>

        <p className={styles.heroNative} lang="ja">
          {nativeName}
        </p>

        <p className={styles.heroGrade} lang="ja">
          {JOUGO_IDENTITY.title}
        </p>
        <p className={styles.heroGradeReading}>
          {pick(JOUGO_IDENTITY.titleReading, locale)}
        </p>

        <p className={styles.heroEpigraph}>
          {pick(JOUGO_IDENTITY.epigraph, locale)}
        </p>
        <p className={styles.heroLede}>{pick(JOUGO_HERO.lede, locale)}</p>
        <p className={styles.heroMarkNote}>
          {pick(JOUGO_HERO.watermarkNote, locale)}
        </p>

        {/* Büyük hero karesi bilerek BOŞ. Not yalnızca kadraj GERÇEKTEN
            boşken yazılıyor: küratör kareyi yüklediğinde "bu kadraj boş"
            cümlesi yalan olurdu. */}
        {src(JOUGO_IMAGE_KEYS.hero) ? null : (
          <p className={styles.heroFrameNote}>
            {pick(JOUGO_HERO.heroCaption, locale)}
          </p>
        )}
        {frame(JOUGO_IMAGE_KEYS.hero, styles.frameTall)}
      </section>
    </>
  );

  return (
    <CrustShell
      isAdmin={isAdmin}
      title={pick(JOUGO_MELT.title, locale)}
      native={JOUGO_MELT.native}
      toMoltenLabel={pick(JOUGO_MELT.toMolten, locale)}
      toCoolLabel={pick(JOUGO_MELT.toCool, locale)}
      hintCool={pick(JOUGO_MELT.hintCool, locale)}
      hintMolten={pick(JOUGO_MELT.hintMolten, locale)}
      markLabel={pick(JOUGO_MELT.markLabel, locale)}
      hero={hero}
    >
      {crack}

      {/* ══ 3 · KÜNYE ŞERİDİ ════════════════════════════════════════════ */}
      <section
        className={styles.stratum}
        data-depth="2"
        aria-labelledby="jgo-identity"
      >
        <div className={styles.stratumHead}>
          <p className={styles.stratumDepth} aria-hidden>
            02
          </p>
          <h2 id="jgo-identity" className={styles.sectionTitle}>
            {pick(JOUGO_SECTIONS.identity.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(JOUGO_SECTIONS.identity.lede, locale)}
          </p>
        </div>

        <div className={styles.identity}>
          <dl className={styles.facts}>
            {JOUGO_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
                <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.core}>
            {/* Çekirdek portre — 230×345, yani KÜÇÜK: tam kanama bir hero
                olarak değil, kesitin içindeki dar bir çekirdek örneği
                gibi duruyor. */}
            <figure className={styles.portrait}>
              <Image
                className={styles.portraitImg}
                src={portraitSrc}
                alt={pick(
                  uploadedPortrait ? JOUGO_ALT.portraitUploaded : JOUGO_ALT.portrait,
                  locale,
                )}
                width={JOUGO_PORTRAIT.w}
                height={JOUGO_PORTRAIT.h}
                unoptimized={!isUploadedPortrait(detail)}
                priority
              />
            </figure>
            {isAdmin ? (
              <CuratorSlot
                characterId={JOUGO_ID}
                slot="PORTRAIT"
                label={pick(JOUGO_PORTRAIT_SLOT, locale)}
                size={{ w: 1200, h: 1600 }}
              />
            ) : null}

            <p className={styles.portraitNote}>
              {pick(JOUGO_IDENTITY.portraitNote, locale)}
            </p>

            {/* Sembolik obje: koninin kesiti */}
            <span className={styles.cone} aria-hidden>
              <ConeMark
                className={styles.coneArt}
                outlineClassName={styles.coneOutline}
                ventClassName={styles.coneVent}
                layerClassName={styles.coneLayer}
              />
            </span>
          </div>
        </div>
      </section>

      {crack}

      {/* ══ 4a · LANET LABORATUVARI — ÜÇ BÜYÜK ══════════════════════════ */}
      <section
        className={styles.stratum}
        data-depth="3"
        aria-labelledby="jgo-techniques"
      >
        <div className={styles.stratumHead}>
          <p className={styles.stratumDepth} aria-hidden>
            03
          </p>
          <h2 id="jgo-techniques" className={styles.sectionTitle}>
            {pick(JOUGO_SECTIONS.techniques.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(JOUGO_SECTIONS.techniques.lede, locale)}
          </p>
        </div>

        <ol className={styles.vents}>
          {JOUGO_TECHNIQUES.map((vent, index) => (
            <li key={vent.key} className={styles.vent}>
              <p className={styles.ventIndex} aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className={styles.ventNative} lang="ja">
                {vent.native}
              </h3>
              <p className={styles.ventReading}>{pick(vent.reading, locale)}</p>
              <p className={styles.ventTitle}>{pick(vent.title, locale)}</p>
              <p className={styles.ventText}>{pick(vent.text, locale)}</p>
              <ul className={styles.ventTraits}>
                {vent.traits.map((trait) => (
                  <li key={trait.tr} className={styles.trait}>
                    {pick(trait, locale)}
                  </li>
                ))}
              </ul>
              {frame(vent.imageKey, styles.frameWide)}
            </li>
          ))}
        </ol>
      </section>

      {crack}

      {/* ══ 4b · LANET LABORATUVARI — DÖRT KÜÇÜK ════════════════════════ */}
      <section className={styles.stratum} data-depth="4" aria-labelledby="jgo-kit">
        <div className={styles.stratumHead}>
          <p className={styles.stratumDepth} aria-hidden>
            04
          </p>
          <h2 id="jgo-kit" className={styles.sectionTitle}>
            {pick(JOUGO_SECTIONS.kit.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(JOUGO_SECTIONS.kit.lede, locale)}
          </p>
        </div>

        <ul className={styles.kit}>
          {JOUGO_KIT.map((item) => (
            <li key={item.key} className={styles.kitCard}>
              <h3 className={styles.kitNative} lang="ja">
                {item.native}
              </h3>
              <p className={styles.kitReading}>{pick(item.reading, locale)}</p>
              <p className={styles.kitNote}>{pick(item.note, locale)}</p>
              {frame(item.imageKey, styles.frameSmall)}
            </li>
          ))}
        </ul>
      </section>

      {crack}

      {/* ══ 5 · KÜL — SAYFANIN KALBİ ════════════════════════════════════ */}
      <section className={styles.stratum} data-depth="5" aria-labelledby="jgo-ash">
        <div className={styles.stratumHead}>
          <p className={styles.stratumDepth} aria-hidden>
            05
          </p>
          <h2 id="jgo-ash" className={styles.sectionTitle}>
            {pick(JOUGO_SECTIONS.ash.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(JOUGO_SECTIONS.ash.lede, locale)}
          </p>
        </div>

        <AshFall
          readings={ashReadings}
          openLabel={pick(JOUGO_ASH.openLabel, locale)}
          openDoneLabel={pick(JOUGO_ASH.openDoneLabel, locale)}
          blowLabel={pick(JOUGO_ASH.blowLabel, locale)}
          blowNothingLabel={pick(JOUGO_ASH.blowNothingLabel, locale)}
          blowDeadLabel={pick(JOUGO_ASH.blowDeadLabel, locale)}
          counterLabel={pick(JOUGO_ASH.counterLabel, locale)}
          rateLabel={pick(JOUGO_ASH.rateLabel, locale)}
          depthLabel={pick(JOUGO_ASH.depthLabel, locale)}
          lead={pick(JOUGO_ASH.lead, locale)}
          statusOpened={pick(JOUGO_ASH.statusOpened, locale)}
          statusAsh={pick(JOUGO_ASH.statusAsh, locale)}
          statusBlown={pick(JOUGO_ASH.statusBlown, locale)}
          statusBackAtOnce={pick(JOUGO_ASH.statusBackAtOnce, locale)}
          statusNothing={pick(JOUGO_ASH.statusNothing, locale)}
          statusSealed={pick(JOUGO_ASH.statusSealed, locale)}
          statusFull={pick(JOUGO_ASH.statusFull, locale)}
          blowHint={pick(JOUGO_ASH.blowHint, locale)}
          blowDeadHint={pick(JOUGO_ASH.blowDeadHint, locale)}
          keyboardHint={pick(JOUGO_ASH.keyboardHint, locale)}
          sealedKicker={pick(JOUGO_ASH.sealed.kicker, locale)}
          sealedTitle={pick(JOUGO_ASH.sealed.title, locale)}
          sealedBody={JOUGO_ASH.sealed.body.map((line) => pick(line, locale))}
          frame={frame(JOUGO_IMAGE_KEYS.kul, styles.frameWide)}
        />
      </section>

      {crack}

      {/* ══ 6 · KADER KESİTİ — BEŞ KATMAN ══════════════════════════════ */}
      <section
        className={styles.stratum}
        data-depth="6"
        aria-labelledby="jgo-strata"
      >
        <div className={styles.stratumHead}>
          <p className={styles.stratumDepth} aria-hidden>
            06
          </p>
          <h2 id="jgo-strata" className={styles.sectionTitle}>
            {pick(JOUGO_SECTIONS.strata.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(JOUGO_SECTIONS.strata.lede, locale)}
          </p>
        </div>

        <ol className={styles.beds}>
          {JOUGO_STRATA.map((bed, index) => (
            <li key={bed.key} className={styles.bed} data-bed={String(index + 1)}>
              <p className={styles.bedDepth}>{pick(bed.depth, locale)}</p>
              <p className={styles.bedNative} lang="ja" aria-hidden>
                {bed.native}
              </p>
              <h3 className={styles.bedTitle}>{pick(bed.title, locale)}</h3>
              <p className={styles.bedText}>{pick(bed.text, locale)}</p>
              {bed.line ? (
                <p className={styles.bedLine} lang="ja">
                  {bed.line}
                </p>
              ) : null}
              {frame(bed.imageKey, styles.frameBand)}
            </li>
          ))}
        </ol>

        <p className={styles.bedNote}>{pick(JOUGO_STRATA_NOTE, locale)}</p>
      </section>

      {crack}

      {/* ══ 7a · AYNI KESİTTE DURANLAR ═════════════════════════════════ */}
      <section className={styles.stratum} data-depth="7" aria-labelledby="jgo-bonds">
        <div className={styles.stratumHead}>
          <p className={styles.stratumDepth} aria-hidden>
            07
          </p>
          <h2 id="jgo-bonds" className={styles.sectionTitle}>
            {pick(JOUGO_SECTIONS.bonds.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(JOUGO_SECTIONS.bonds.lede, locale)}
          </p>
        </div>

        <ul className={styles.bonds}>
          {JOUGO_BONDS.map((bond) => {
            const face = faces.get(bond.characterId) ?? null;
            const linked = isExperienceCharacter(bond.characterId);
            return (
              <li key={bond.key} className={styles.bond}>
                <span
                  className={styles.bondFace}
                  data-filled={face ? "true" : "false"}
                >
                  {face ? (
                    <Image
                      className={styles.bondFaceImg}
                      src={face}
                      alt={`${bond.name} — ${pick(bond.role, locale)}`}
                      fill
                      sizes="6rem"
                    />
                  ) : (
                    <span className={styles.bondFaceMark} aria-hidden lang="ja">
                      {bond.native.slice(0, 1)}
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
                  <span className={styles.bondRole}>{pick(bond.role, locale)}</span>
                  <span className={styles.bondText}>{pick(bond.text, locale)}</span>
                </span>
              </li>
            );
          })}
        </ul>

        {/* Kadrajsız anılanlar — portre listesi dışındaki cephe */}
        <div className={styles.plain}>
          <h3 className={styles.plainTitle}>
            {pick(JOUGO_PLAIN_NAMES.title, locale)}
          </h3>
          <p className={styles.plainNote}>{pick(JOUGO_PLAIN_NAMES.note, locale)}</p>
          <ul className={styles.plainList}>
            {JOUGO_PLAIN_NAMES.rows.map((row) => (
              <li key={row.key} className={styles.plainRow}>
                <span className={styles.plainName}>{row.name}</span>
                <span className={styles.plainNative} lang="ja">
                  {row.native}
                </span>
                <span className={styles.plainText}>{pick(row.text, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {crack}

      {/* ══ 7b · LANETLİ ARŞİV'E AÇILAN ÇATLAKLAR ══════════════════════
          Adresler elle YAZILMIYOR: `animeHref.jjk()` + çapa. Dört çapa da
          `lib/anime/jjk/anchors.ts` defterinde kayıtlı ve o defteri
          `scripts/check-jjk-anchors.mjs` denetliyor — ölü çapa riski yok. */}
      <section className={styles.stratum} data-depth="8" aria-labelledby="jgo-nexus">
        <div className={styles.stratumHead}>
          <p className={styles.stratumDepth} aria-hidden>
            08
          </p>
          <h2 id="jgo-nexus" className={styles.sectionTitle}>
            {pick(JOUGO_SECTIONS.nexus.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(JOUGO_SECTIONS.nexus.lede, locale)}
          </p>
        </div>

        <ul className={styles.nexusList}>
          {JOUGO_NEXUS.map((node) => (
            <li key={node.key} className={styles.nexus}>
              <Link
                className={styles.nexusLink}
                href={`${animeHref.jjk()}#${node.anchor}`}
              >
                <span className={styles.nexusTitle}>{pick(node.title, locale)}</span>
                <span className={styles.nexusText}>{pick(node.text, locale)}</span>
                <span className={styles.nexusArrow} aria-hidden>
                  ↓
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {crack}

      {/* ══ 7c · KAPANIŞ ═══════════════════════════════════════════════ */}
      <section
        className={styles.stratum}
        data-depth="9"
        aria-labelledby="jgo-closing"
      >
        <div className={styles.stratumHead}>
          <p className={styles.stratumDepth} aria-hidden>
            09
          </p>
          <h2 id="jgo-closing" className={styles.sectionTitle}>
            {pick(JOUGO_SECTIONS.closing.title, locale)}
          </h2>
          <p className={styles.sectionLede}>
            {pick(JOUGO_SECTIONS.closing.lede, locale)}
          </p>
        </div>

        <ul className={styles.quotes}>
          {JOUGO_CLOSING.quotes.map((quote) => (
            <li key={quote.text}>
              <figure className={styles.quote}>
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

        <p className={styles.quoteDiscipline}>
          {pick(JOUGO_CLOSING.quoteNote, locale)}
        </p>

        <p className={styles.motto} lang="ja">
          {JOUGO_CLOSING.motto}
        </p>
        <p className={styles.mottoNote}>{pick(JOUGO_CLOSING.mottoNote, locale)}</p>

        {frame(JOUGO_IMAGE_KEYS.closing, styles.frameBand)}

        <p className={styles.credit}>
          {pick(JOUGO_CLOSING.credit, locale)}{" "}
          <a href={siteUrl} target="_blank" rel="noreferrer noopener">
            {pick(JOUGO_CLOSING.creditLink, locale)}
          </a>
        </p>
        <p className={styles.creditNote}>{pick(JOUGO_CLOSING.creditNote, locale)}</p>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(JOUGO_GAPS.title, locale)}
          emptyLabel={pick(JOUGO_GAPS.empty, locale)}
          filledLabel={pick(JOUGO_GAPS.filled, locale)}
          allFilledLabel={pick(JOUGO_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </CrustShell>
  );
}
