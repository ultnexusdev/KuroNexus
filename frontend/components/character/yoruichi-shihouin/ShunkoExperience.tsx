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
  YOR_ALT,
  YOR_BONDS,
  YOR_BOND_UI,
  YOR_CLOSING,
  YOR_CRUMB,
  YOR_FORM_UI,
  YOR_FRAME_EMPTY,
  YOR_GAPS,
  YOR_HERO,
  YOR_ID,
  YOR_IDENTITY,
  YOR_IMAGE_KEYS,
  YOR_KIT,
  YOR_LEDGER,
  YOR_LEDGER_UI,
  YOR_MISSING_NOTE,
  YOR_PORTRAIT,
  YOR_PORTRAIT_SLOT,
  YOR_POWERS,
  YOR_RAIL_UI,
  YOR_SECTIONS,
  YOR_SITE_URL,
  YOR_SLOT_LABELS,
  YOR_SLOT_SIZES,
  YOR_SLOT_SPECS,
  YOR_TIMELINE,
  YOR_WORLD_LINKS,
  type YoruichiLedgerRow,
} from "@/lib/characters/yoruichi-shihouin-experience";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import {
  CuratorGaps,
  type CuratorGapRow,
} from "@/components/character/CuratorGaps";
import { DualLedger, type DualRow, type LedgerState } from "./DualLedger";
import { FormShell } from "./FormShell";
import { AfterimageMark, ShihoinMon } from "./YoruichiGlyphs";
import styles from "./ShunkoExperience.module.css";

/**
 * Yoruichi Shihōin — "İki beden, tek künye" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/908 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: KÜNYE TEK GÖVDEYE GÖRE
 * YAZILMIŞ.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Bu dalganın diğer sayfaları dikey okunuyor (Rukia'nın dar kolonu, Renji'nin
 * zikzağı, Ulquiorra'nın boşluğu, Grimmjow'un yırtıkları). Burada akış dikey,
 * OKUMA YATAY: her bölüm tam genişlikte bir bant ve her bandın içeriği kendi
 * kabında yatay kayıyor. Künye şeridini soldan sağa okurken tablonun sağ ucu
 * kedi formunda topluca griye düşüyor — mekanik, ızgaranın kendisiyle aynı
 * yöne bakıyor.
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (klan arması filigranı + madalyon portre + İKİ hero kadrajı)
 *   2 mod düğmesi — "Kedi formu", `FormShell` içinde (durum orada)
 *   3 künye şeridi — SAYFANIN MEKANİĞİ (on üç satır, beşi düşüyor)
 *   4 güç laboratuvarı — üç büyük + dört küçük, Bleach terminolojisiyle
 *   5 iki beden — interaktif künye (`DualLedger`)
 *   6 kader çizelgesi — beş durak, dönem etiketli
 *   7 kapanış — iki satır + 空蝉 mottosu + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   FormShell  — kök öğe + "Kedi formu" düğmesi (tek dize: human | cat)
 *   DualLedger — tek satırın iki gövdedeki okuması
 * `YoruichiGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca madalyon
 * kadrajında). On yedi kadraj BOŞ ve küratör yuvası olarak duruyor; her
 * kadrajın HEMEN ALTINDA kendi yuvası var (sayfa sonunda toplu yuva yok).
 *
 * ⚠️ İki hero kadrajı AYRI yuva (`yor:hero-human` / `yor:hero-cat`).
 * Paylaşsalardı küratör bir formu yüklerken ötekini ezerdi.
 */
export function ShunkoExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const src = (key: string): string | null => ability.get(key) ?? null;

  /* Portre kaynağı: küratör bir PORTRAIT yüklediyse o, yoksa DEPODAKİ resmî
     kare. İkisi de bizim kaynağımız, o yüzden `unoptimized` hiç yazılmıyor
     (FAZ 2 §3). AniList'e hotlink YOK. */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? YOR_PORTRAIT.src;

  const name = detail.character.name || YOR_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? YOR_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? YOR_SITE_URL;

  /* Yoldaş portreleri kendi `CharacterImage` kaydımızdan; kaydı olmayan
     karakter yalnızca adla çiziliyor (AniList kart ucu kullanılmıyor). */
  const faces = companionPortraits(companions);

  const railHint = pick(YOR_RAIL_UI.hint, locale);

  /**
   * Satırın dönüşüm karşısındaki hâli.
   *
   * ⚠️ Karşılaştırma `tr` alanı üzerinden: iki dil çifti aynı veriden
   * yazıldığı için tek dile bakmak yeterli ve dil değiştiğinde durum
   * kaymıyor. `null` her zaman "ölçülemez".
   */
  const stateOf = (row: YoruichiLedgerRow): LedgerState =>
    row.cat === null ? "void" : row.cat.tr === row.human.tr ? "same" : "turned";

  const dualRows: DualRow[] = YOR_LEDGER.map((row) => ({
    key: row.key,
    kanji: row.kanji,
    label: pick(row.label, locale),
    human: pick(row.human, locale),
    cat: row.cat ? pick(row.cat, locale) : null,
    reason: row.voidReason ? pick(row.voidReason, locale) : null,
    note: pick(row.note, locale),
    state: stateOf(row),
  }));

  const gapRows: CuratorGapRow[] = Object.values(YOR_IMAGE_KEYS).map((key) => ({
    key,
    label: pick(YOR_SLOT_LABELS[key], locale),
    spec: pick(YOR_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * ⚠️ Kadraj boşken ziyaretçi YAZISIZ bir boşluk görüyor; üretim
   * metadatası (ölçü, tip, yuva adı) yalnızca `isAdmin` iken çiziliyor.
   * Levi'de 30 Ağustos'ta düzeltilen hatanın aynısı: koşulsuz bırakılırsa
   * sıradan ziyaretçi on yedi kez "geniş kadraj · 1600×900 · webp" okuyor.
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
              alt={`${pick(YOR_ALT.scenePrefix, locale)} ${pick(
                YOR_SLOT_LABELS[key],
                locale,
              )}`}
              fill
              sizes="(max-width: 40rem) 86vw, 32rem"
            />
          ) : isAdmin ? (
            <figcaption className={styles.frameCaption} data-curator-slot>
              <span className={styles.frameCaptionWord}>
                {pick(YOR_FRAME_EMPTY, locale)}
              </span>
              <span className={styles.frameCaptionSpec}>
                {pick(YOR_SLOT_SPECS[key], locale)}
              </span>
            </figcaption>
          ) : null}
        </figure>
        {isAdmin ? (
          <CuratorSlot
            characterId={YOR_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(YOR_SLOT_LABELS[key], locale)}
            size={YOR_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran: elle çizilmiş Shihōin arması (dört akçaağaç yaprağı) + 瞬神.
     Hero kadrajları bir ŞERİT: madalyon portre, insan karesi, kedi karesi.
     Aktif formun karesi duruyor, öteki düşüyor — küratör modunda ikisi de
     görünüyor ki iki yuva da doldurulabilsin. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>{pick(YOR_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="yor-name">
        <span className={styles.mon} aria-hidden>
          <ShihoinMon
            className={styles.monArt}
            leafClassName={styles.monLeaf}
            ringClassName={styles.monRing}
          />
          <span className={styles.monKanji} lang="ja">
            {YOR_IDENTITY.title}
          </span>
        </span>

        <div className={styles.heroHead}>
          <p className={styles.heroHouse}>{pick(YOR_IDENTITY.house, locale)}</p>

          <h1 id="yor-name" className={styles.heroName}>
            {name}
          </h1>

          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>
          <p className={styles.heroTitleReading}>
            {pick(YOR_IDENTITY.titleReading, locale)}
          </p>

          <p className={styles.heroEpigraph}>
            {pick(YOR_IDENTITY.epigraph, locale)}
          </p>
          <p className={styles.heroLede}>{pick(YOR_HERO.lede, locale)}</p>
        </div>

        <div
          className={styles.heroRail}
          role="group"
          aria-label={pick(YOR_HERO.railLabel, locale)}
          tabIndex={0}
          data-rail
        >
          <div className={styles.heroCard} data-card="portrait">
            {/* Madalyon portre — 230×345, yani KÜÇÜK: tam kanama bir hero
                olarak kullanılmıyor, dar bir kadrajda duruyor. */}
            <figure className={styles.portrait}>
              <Image
                className={styles.portraitImg}
                src={portraitSrc}
                alt={pick(
                  portraitUploaded
                    ? YOR_HERO.portraitAltUploaded
                    : YOR_HERO.portraitAlt,
                  locale,
                )}
                width={YOR_PORTRAIT.w}
                height={YOR_PORTRAIT.h}
                priority
              />
            </figure>
            {isAdmin ? (
              <CuratorSlot
                characterId={YOR_ID}
                slot="PORTRAIT"
                label={pick(YOR_PORTRAIT_SLOT, locale)}
                size={{ w: 1200, h: 1600 }}
              />
            ) : null}
          </div>

          <div className={styles.heroCard} data-card="human">
            <p className={styles.heroCardTag}>
              {pick(YOR_LEDGER_UI.humanColumn, locale)}
            </p>
            {/* Not yalnızca kadraj GERÇEKTEN boşken yazılıyor: küratör
                kareyi yüklediğinde "bu kadraj boş" cümlesi yalan olurdu. */}
            {src(YOR_IMAGE_KEYS.heroHuman) ? null : (
              <p className={styles.heroFrameNote}>
                {pick(YOR_HERO.humanFrameNote, locale)}
              </p>
            )}
            {frame(YOR_IMAGE_KEYS.heroHuman, styles.frameTall)}
          </div>

          <div className={styles.heroCard} data-card="cat">
            <p className={styles.heroCardTag}>
              {pick(YOR_LEDGER_UI.catColumn, locale)}
            </p>
            {src(YOR_IMAGE_KEYS.heroCat) ? null : (
              <p className={styles.heroFrameNote}>
                {pick(YOR_HERO.catFrameNote, locale)}
              </p>
            )}
            {frame(YOR_IMAGE_KEYS.heroCat, styles.frameTall)}
          </div>
        </div>
        <p className={styles.railHint}>{railHint}</p>
      </section>
    </>
  );

  return (
    <FormShell
      isAdmin={isAdmin}
      title={pick(YOR_FORM_UI.title, locale)}
      native={YOR_FORM_UI.native}
      enterLabel={pick(YOR_FORM_UI.enter, locale)}
      exitLabel={pick(YOR_FORM_UI.exit, locale)}
      hintHuman={pick(YOR_FORM_UI.hintHuman, locale)}
      hintCat={pick(YOR_FORM_UI.hintCat, locale)}
      hero={hero}
    >
      {/* ══ 3 · KÜNYE ŞERİDİ — SAYFANIN MEKANİĞİ ════════════════════════════
          On üç satır yatay bir şeritte. Her satırın İKİ yüzü de DOM'da:
          form değişince görünmeyen yüz `visibility: hidden` ile hem ekran
          okuyucudan hem sekme sırasından çıkıyor, görünen yüz kendi
          gecikmesiyle (`--yor-row`) çevriliyor — yani satırlar tek tek
          dönüyor, hepsi birden değil. */}
      <section className={styles.band} aria-labelledby="yor-ledger">
        <div className={styles.bandHead}>
          <h2 id="yor-ledger" className={styles.bandTitle}>
            {pick(YOR_SECTIONS.ledger.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(YOR_SECTIONS.ledger.lede, locale)}
          </p>
        </div>

        <div
          className={styles.ledgerRail}
          role="group"
          aria-label={pick(YOR_RAIL_UI.ledgerLabel, locale)}
          tabIndex={0}
          data-rail
        >
          <dl className={styles.ledgerList}>
            {YOR_LEDGER.map((row, index) => (
              <div
                key={row.key}
                className={styles.ledgerCell}
                data-state={stateOf(row)}
                style={{ "--yor-row": index } as React.CSSProperties}
              >
                <dt className={styles.ledgerLabel}>
                  <span className={styles.ledgerKanji} lang="ja" aria-hidden>
                    {row.kanji}
                  </span>
                  {pick(row.label, locale)}
                </dt>
                <dd className={styles.ledgerValue}>
                  <span className={styles.ledgerFace} data-face="human">
                    {pick(row.human, locale)}
                  </span>
                  <span className={styles.ledgerFace} data-face="cat">
                    {row.cat ? (
                      pick(row.cat, locale)
                    ) : (
                      <>
                        {/* Çıplak tire YOK: işaret `aria-hidden`, anlam
                            yanındaki metinde (erişilebilirlik şartı). */}
                        <span className={styles.ledgerDash} aria-hidden>
                          —
                        </span>
                        <span className={styles.ledgerVoidWord}>
                          {pick(YOR_LEDGER_UI.voidLabel, locale)}
                        </span>
                      </>
                    )}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <p className={styles.railHint}>{railHint}</p>

        <div className={styles.bandBody}>
          <p className={styles.bandNote}>{pick(YOR_MISSING_NOTE, locale)}</p>
          {frame(YOR_IMAGE_KEYS.ledger, styles.frameWide)}
        </div>
      </section>

      {/* ══ 4a · GÜÇ LABORATUVARI — ÜÇ BÜYÜK ═══════════════════════════════ */}
      <section className={styles.band} aria-labelledby="yor-powers">
        <div className={styles.bandHead}>
          <h2 id="yor-powers" className={styles.bandTitle}>
            {pick(YOR_SECTIONS.powers.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(YOR_SECTIONS.powers.lede, locale)}
          </p>
        </div>

        <div
          className={styles.cardRail}
          role="group"
          aria-label={pick(YOR_RAIL_UI.powersLabel, locale)}
          tabIndex={0}
          data-rail
        >
          <ol className={styles.cardList}>
            {YOR_POWERS.map((power, index) => (
              <li key={power.key} className={styles.bigCard}>
                <p className={styles.cardIndex} aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className={styles.cardName} lang="ja">
                  {power.name}
                </h3>
                <p className={styles.cardReading}>{power.reading}</p>
                <p className={styles.cardTurkish}>
                  {pick(power.turkish, locale)}
                </p>
                <p className={styles.cardTagline}>
                  {pick(power.tagline, locale)}
                </p>

                {/* 瞬歩 kartının yanındaki iz: sayfanın hareket dilinin
                    duran hâli — üretilmiş raster değil, elle çizilmiş SVG */}
                {power.key === "shunpo" ? (
                  <span className={styles.trail} aria-hidden>
                    <AfterimageMark
                      className={styles.trailArt}
                      ghostClassName={styles.trailGhost}
                      bodyClassName={styles.trailBody}
                    />
                  </span>
                ) : null}

                <p className={styles.cardText}>{pick(power.text, locale)}</p>

                <ul className={styles.cardTraits}>
                  {power.traits.map((trait) => (
                    <li key={trait.tr} className={styles.trait}>
                      {pick(trait, locale)}
                    </li>
                  ))}
                </ul>

                {frame(power.imageKey, styles.frameWide)}
              </li>
            ))}
          </ol>
        </div>
        <p className={styles.railHint}>{railHint}</p>
      </section>

      {/* ══ 4b · DÖRT KÜÇÜK ════════════════════════════════════════════════ */}
      <section className={styles.band} aria-labelledby="yor-kit">
        <div className={styles.bandHead}>
          <h2 id="yor-kit" className={styles.bandTitle}>
            {pick(YOR_SECTIONS.kit.title, locale)}
          </h2>
          <p className={styles.bandLede}>{pick(YOR_SECTIONS.kit.lede, locale)}</p>
        </div>

        <div
          className={styles.cardRail}
          role="group"
          aria-label={pick(YOR_RAIL_UI.kitLabel, locale)}
          tabIndex={0}
          data-rail
        >
          <ul className={styles.cardList}>
            {YOR_KIT.map((kit) => (
              <li key={kit.key} className={styles.smallCard}>
                <h3 className={styles.kitName} lang="ja">
                  {kit.name}
                </h3>
                <p className={styles.cardReading}>{kit.reading}</p>
                <p className={styles.kitTurkish}>{pick(kit.turkish, locale)}</p>
                <p className={styles.cardTagline}>{pick(kit.tagline, locale)}</p>
                <p className={styles.cardText}>{pick(kit.text, locale)}</p>
                <ul className={styles.cardTraits}>
                  {kit.traits.map((trait) => (
                    <li key={trait.tr} className={styles.trait}>
                      {pick(trait, locale)}
                    </li>
                  ))}
                </ul>
                {frame(kit.imageKey, styles.frameSmall)}
              </li>
            ))}
          </ul>
        </div>
        <p className={styles.railHint}>{railHint}</p>
      </section>

      {/* ══ 5 · İKİ BEDEN — İNTERAKTİF KÜNYE ═══════════════════════════════ */}
      <section className={styles.band} aria-labelledby="yor-bodies">
        <div className={styles.bandHead}>
          <h2 id="yor-bodies" className={styles.bandTitle}>
            {pick(YOR_SECTIONS.bodies.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(YOR_SECTIONS.bodies.lede, locale)}
          </p>
        </div>

        <div className={styles.bandBody}>
          <DualLedger
            rows={dualRows}
            railLabel={pick(YOR_RAIL_UI.ledgerLabel, locale)}
            railHint={railHint}
            humanColumn={pick(YOR_LEDGER_UI.humanColumn, locale)}
            catColumn={pick(YOR_LEDGER_UI.catColumn, locale)}
            humanKanji={YOR_LEDGER_UI.humanKanji}
            catKanji={YOR_LEDGER_UI.catKanji}
            voidLabel={pick(YOR_LEDGER_UI.voidLabel, locale)}
            voidBadge={pick(YOR_LEDGER_UI.voidBadge, locale)}
            sameBadge={pick(YOR_LEDGER_UI.sameBadge, locale)}
            turnedBadge={pick(YOR_LEDGER_UI.turnedBadge, locale)}
            pickHint={pick(YOR_LEDGER_UI.pickHint, locale)}
            selectedLabel={pick(YOR_LEDGER_UI.selectedLabel, locale)}
            noteLabel={pick(YOR_LEDGER_UI.noteLabel, locale)}
            reasonLabel={pick(YOR_LEDGER_UI.reasonLabel, locale)}
            tally={pick(YOR_LEDGER_UI.tally, locale)}
          />

          {frame(YOR_IMAGE_KEYS.bodies, styles.frameWide)}
        </div>
      </section>

      {/* ══ 6 · KADER ÇİZELGESİ ════════════════════════════════════════════
          Beş durak yatay okunuyor — çizelge zaten bir zaman ekseni ve bu
          sayfanın ızgarası da yatay. Her durağın altındaki blok bir REPLİK
          DEĞİL, doğrulanmış bir KAYIT; kaynağı da yazılı (veri dosyasının
          başındaki replik disiplinine bak). */}
      <section className={styles.band} aria-labelledby="yor-fate">
        <div className={styles.bandHead}>
          <h2 id="yor-fate" className={styles.bandTitle}>
            {pick(YOR_SECTIONS.fate.title, locale)}
          </h2>
          <p className={styles.bandLede}>{pick(YOR_SECTIONS.fate.lede, locale)}</p>
        </div>

        <div
          className={styles.cardRail}
          role="group"
          aria-label={pick(YOR_RAIL_UI.fateLabel, locale)}
          tabIndex={0}
          data-rail
        >
          <ol className={styles.cardList}>
            {YOR_TIMELINE.map((stop, index) => {
              const kinLinked = stop.kin
                ? isExperienceCharacter(stop.kin.characterId)
                : false;
              return (
                <li key={stop.key} className={styles.stop}>
                  <p className={styles.stopIndex} aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className={styles.stopStamp}>{pick(stop.stamp, locale)}</p>
                  <h3 className={styles.stopTitle}>{pick(stop.title, locale)}</h3>
                  <p className={styles.stopText}>{pick(stop.text, locale)}</p>

                  <figure className={styles.record}>
                    <blockquote className={styles.recordText} lang="ja">
                      {stop.record.text}
                    </blockquote>
                    <p className={styles.recordReading}>
                      {pick(stop.record.reading, locale)}
                    </p>
                    <figcaption className={styles.recordBy}>
                      {pick(stop.record.source, locale)}
                    </figcaption>
                  </figure>

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

                  {frame(stop.imageKey, styles.frameSmall)}
                </li>
              );
            })}
          </ol>
        </div>
        <p className={styles.railHint}>{railHint}</p>
      </section>

      {/* ══ 7a · BAĞLAR ════════════════════════════════════════════════════
          Beş ad — `EXPERIENCE_COMPANIONS[908]` ile birebir aynı numaralar.
          Portresi arşivde olan çiziliyor, olmayan yalnızca adla duruyor. */}
      <section className={styles.band} aria-labelledby="yor-bonds">
        <div className={styles.bandHead}>
          <h2 id="yor-bonds" className={styles.bandTitle}>
            {pick(YOR_SECTIONS.bonds.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(YOR_SECTIONS.bonds.lede, locale)}
          </p>
        </div>

        <div
          className={styles.cardRail}
          role="group"
          aria-label={pick(YOR_RAIL_UI.bondsLabel, locale)}
          tabIndex={0}
          data-rail
        >
          <ul className={styles.cardList}>
            {YOR_BONDS.map((bond) => {
              const linked = isExperienceCharacter(bond.characterId);
              const face = faces.get(bond.characterId) ?? null;
              return (
                <li key={bond.characterId} className={styles.bond}>
                  {face ? (
                    <figure className={styles.bondFace}>
                      <Image
                        className={styles.bondFaceImg}
                        src={face}
                        alt={`${bond.name} — ${pick(
                          YOR_BOND_UI.portraitAlt,
                          locale,
                        )}`}
                        width={120}
                        height={160}
                      />
                    </figure>
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
                    {bond.native}
                  </span>
                  <span className={styles.bondRole}>
                    {pick(bond.role, locale)}
                  </span>
                  <p className={styles.bondLine}>{pick(bond.line, locale)}</p>
                  <span className={styles.bondFlag}>
                    {pick(linked ? YOR_BOND_UI.hasPage : YOR_BOND_UI.noPage, locale)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className={styles.railHint}>{railHint}</p>
      </section>

      {/* ══ 7b · EVREN BAĞLANTILARI ════════════════════════════════════════
          Çapalar `lib/anime/bleach/anchors.ts` defterinden; ölü çapa yasak.
          Adres elle yazılmıyor, `animeHref.bleach()` ile birleşiyor. */}
      <section className={styles.band} aria-labelledby="yor-world">
        <div className={styles.bandHead}>
          <h2 id="yor-world" className={styles.bandTitle}>
            {pick(YOR_SECTIONS.world.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(YOR_SECTIONS.world.lede, locale)}
          </p>
        </div>

        <div
          className={styles.linkRail}
          role="group"
          aria-label={pick(YOR_RAIL_UI.worldLabel, locale)}
          data-rail
        >
          <ul className={styles.linkList}>
            {YOR_WORLD_LINKS.map((link) => (
              <li key={link.anchor} className={styles.worldItem}>
                <Link
                  className={styles.worldLink}
                  href={`${animeHref.bleach()}#${link.anchor}`}
                >
                  {pick(link.label, locale)}
                </Link>
                <span className={styles.worldNote}>{pick(link.note, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 7c · KAPANIŞ ═══════════════════════════════════════════════════ */}
      <section className={styles.closing} aria-labelledby="yor-closing">
        <div className={styles.bandHead}>
          <h2 id="yor-closing" className={styles.bandTitle}>
            {pick(YOR_SECTIONS.closing.title, locale)}
          </h2>
          <p className={styles.bandLede}>
            {pick(YOR_SECTIONS.closing.lede, locale)}
          </p>
        </div>

        <div className={styles.bandBody}>
          <ul className={styles.closingLines}>
            {YOR_CLOSING.lines.map((line) => (
              <li key={line.text}>
                <figure className={styles.closingLine}>
                  <blockquote className={styles.closingJa} lang="ja">
                    {line.text}
                  </blockquote>
                  <p className={styles.closingReading}>
                    {pick(line.reading, locale)}
                  </p>
                  <p className={styles.closingNote}>{pick(line.note, locale)}</p>
                  {/* `figcaption` figure'un SON çocuğu olmak zorunda (HTML
                      şartı): not bloğu bilerek onun üstünde duruyor. */}
                  <figcaption className={styles.closingBy}>
                    {pick(line.by, locale)}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <p className={styles.discipline}>
            {pick(YOR_CLOSING.quoteDiscipline, locale)}
          </p>

          <span className={styles.rule} aria-hidden>
            <AfterimageMark
              className={styles.trailArt}
              ghostClassName={styles.trailGhost}
              bodyClassName={styles.trailBody}
            />
          </span>

          <p className={styles.motto} lang="ja">
            {YOR_CLOSING.motto}
          </p>
          <p className={styles.mottoReading}>
            {pick(YOR_CLOSING.mottoReading, locale)}
          </p>
          <p className={styles.mottoNote}>
            {pick(YOR_CLOSING.mottoNote, locale)}
          </p>

          {frame(YOR_IMAGE_KEYS.closing, styles.frameBand)}

          <p className={styles.credit}>
            {pick(YOR_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(YOR_CLOSING.creditLink, locale)}
            </a>
          </p>
          <p className={styles.creditNote}>
            {pick(YOR_CLOSING.creditNote, locale)}
          </p>
        </div>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor */}
      {isAdmin ? (
        <CuratorGaps
          title={pick(YOR_GAPS.title, locale)}
          emptyLabel={pick(YOR_GAPS.empty, locale)}
          filledLabel={pick(YOR_GAPS.filled, locale)}
          allFilledLabel={pick(YOR_GAPS.allFilled, locale)}
          rows={gapRows}
        />
      ) : null}
    </FormShell>
  );
}
