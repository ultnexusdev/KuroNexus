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
  MHT_ALT,
  MHT_BADGES,
  MHT_BONDS,
  MHT_BOND_UI,
  MHT_CLOSING,
  MHT_CRUMB,
  MHT_FORMS,
  MHT_FORM_UI,
  MHT_FRAME_EMPTY,
  MHT_GAPS,
  MHT_HERO,
  MHT_ID,
  MHT_IDENTITY,
  MHT_IMAGE_KEYS,
  MHT_LAB,
  MHT_MINORS,
  MHT_MISSING_NOTE,
  MHT_MODE,
  MHT_PORTRAIT,
  MHT_PORTRAIT_SLOT,
  MHT_SECTIONS,
  MHT_SITE_URL,
  MHT_SLOT_LABELS,
  MHT_SLOT_SIZES,
  MHT_SLOT_SPECS,
  MHT_TIMELINE,
  MHT_WORLD_LINKS,
} from "@/lib/characters/mahito-experience";
import { FormMorph } from "./FormMorph";
import { PatchWeave, SeamRule, StitchMark } from "./MahitoGlyphs";
import { SoulShell } from "./SoulShell";
import styles from "./IdleTransfigurationExperience.module.css";

/**
 * Mahito — "Ruhun şekli" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/133702 bu bileşene çıkıyor (kendi
 * statik rota klasörü). Sayfanın fikri tek cümle: RUHUN ŞEKLİ BEDENİN
 * ŞEKLİDİR — ve burada hiçbir şey sabit kalmıyor.
 *
 * ── NEDEN BÖYLE GÖRÜNÜYOR ────────────────────────────────────────────────
 * Izgara YAMA. Bölümler eşit kutular değil: her biri başka genişlikte, başka
 * yönde kaymış ve DÖRT KÖŞESİNİN YARIÇAPI AYRI. Hiçbir kenar diğerine
 * paralel değil. Aralarında elle çizilmiş SVG dikiş çizgileri (`SeamRule`,
 * `stroke-dasharray` teyel) var: yamaları birbirine tutan şey bir boşluk
 * değil, görünür bir dikiş.
 *
 * Tipografi DEFORME: başlıklar Cormorant ile çiziliyor ama HER KELİME BAŞKA
 * PUNTODA — `deform()` metni kelimelere bölüp dört ölçü sınıfını sırayla
 * dağıtıyor. Gövde Jost.
 *
 * ⚠️ Gövde neden Jost 400: başlıklardaki Cormorant zaten ölçek kaydırıyor;
 * gövdeyi de ince kesime almak `--text-primary` ile küçük puntoda
 * okunaksızlaşırdı (Ulquiorra'da ölçülen aynı sınır).
 *
 * ── DURAKLAR ─────────────────────────────────────────────────────────────
 *   1 hero (madalyon portre + BOŞ hero kadrajı + dikiş filigranı)
 *   2 mod düğmesi — "Ruhun şekli" (`SoulShell` içinde, durum orada)
 *   3 künye şeridi (on iki satır, dördü kayıtta boş → karakterizasyon)
 *     + sembolik obje: dikiş
 *   4 lanet laboratuvarı: üç büyük (無為転変 / 自閉円頓裹 / 領域展延) +
 *     dört küçük (değişim geçirmiş insanlar / 反転術式 / 呪具 / 束縛)
 *   5 beden değiştirme — SAYFANIN KALBİ; tek kart, beş form (`FormMorph`)
 *   6 kader çizelgesi (beş durak, yaş yerine yer/saat etiketi)
 *   7 bağlar + kapanış + kaynak künyesi
 *
 * ── İSTEMCİ ADALARI (2) ──────────────────────────────────────────────────
 *   SoulShell — kök öğe, "Ruhun şekli" modu (`data-soul`)
 *   FormMorph — beş form, TEK kart; mekaniğin tamamı
 * `MahitoGlyphs` sunucu bileşeni (yalnız SVG), istemciye inmiyor.
 *
 * ── GÖRSEL ───────────────────────────────────────────────────────────────
 * Portre depodaki resmî kare (230×345 — küçük, o yüzden yalnızca madalyon
 * kadrajında). Yirmi kadrajın hepsi BOŞ ve küratör yuvası olarak duruyor;
 * her kadrajın HEMEN ALTINDA kendi yuvası var (sayfa sonunda toplu blok yok).
 *
 * ⚠️ BOŞ KADRAJ ZİYARETÇİDE YAZISIZ. Kadraj boşken içinde elle çizilmiş
 * dikiş motifi (`StitchMark`) duruyor — bölüm görselsiz ama ayakta. Üretim
 * metadatası ("geniş kadraj · 1600×900 · webp") YALNIZCA yöneticide;
 * dalga 1'de Levi sayfasında yapılan hata tam olarak buydu.
 */
export function IdleTransfigurationExperience({
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
     kare. AniList'e hotlink YOK — `primaryPortrait` yalnızca yükleme varken
     okunuyor, aksi hâlde depo yolu kullanılıyor (FAZ 2 §3). */
  const portraitUploaded = isUploadedPortrait(detail);
  const portraitSrc =
    (portraitUploaded ? primaryPortrait(detail) : null) ?? MHT_PORTRAIT.src;

  const name = detail.character.name || MHT_IDENTITY.name;
  const nativeName = detail.character.nameNative ?? MHT_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? MHT_SITE_URL;

  const gapRows: CuratorGapRow[] = Object.values(MHT_IMAGE_KEYS).map((key) => ({
    key,
    label: pick(MHT_SLOT_LABELS[key], locale),
    spec: pick(MHT_SLOT_SPECS[key], locale),
    filled: ability.has(key),
  }));

  /* İstemci adasına DÜZ DİZE iniyor (FAZ 2 §1): `LocalizedText` sınırı
     burada, `FormMorph` yalnızca seçilmiş dili görüyor. */
  const forms = MHT_FORMS.map((form) => ({
    key: form.key,
    index: form.index,
    glyph: form.glyph,
    name: pick(form.name, locale),
    term: pick(form.term, locale),
    title: pick(form.title, locale),
    body: pick(form.body, locale),
    shapeNote: pick(form.shapeNote, locale),
  }));

  /**
   * DEFORME TİPOGRAFİ — her kelime başka puntoda.
   *
   * Metin kelimelere bölünüyor ve dört ölçü sınıfı sırayla dağıtılıyor.
   * Sınıflar `styles.wordA…D` olarak DOĞRUDAN okunuyor: şablon dizesiyle
   * `styles[...]` yazmak `check-karakter-sinif.mjs`in okuyamayacağı bir
   * anahtar üretirdi ve sınıf sessizce `undefined` kalırdı.
   */
  const wordSizes = [styles.wordA, styles.wordB, styles.wordC, styles.wordD];
  const deform = (text: LocalizedText) =>
    pick(text, locale)
      .split(" ")
      .map((word, index) => (
        <span
          key={`${index}-${word}`}
          className={`${styles.word} ${wordSizes[index % wordSizes.length]}`}
        >
          {word}
        </span>
      ));

  /** Bölümler arası dikiş — yamaları birbirine tutan görünür çizgi. */
  const seam = () => (
    <span className={styles.seam} aria-hidden>
      <SeamRule
        className={styles.seamArt}
        lineClassName={styles.seamLine}
        crossClassName={styles.seamCross}
      />
    </span>
  );

  /** Rozet: satır kayıttan mı geliyor, arşivin okuması mı. */
  const badge = (kind: keyof typeof MHT_BADGES) => (
    <span className={styles.badge} data-kind={kind}>
      {pick(MHT_BADGES[kind], locale)}
    </span>
  );

  /**
   * Bir kadraj + HEMEN ALTINDA kendi yuvası (kullanıcı şartı: sayfa sonunda
   * toplu yuva bloğu yasak).
   *
   * Üç hâl:
   *   · görsel VAR      → kadraj çiziliyor, üstüne PERDELİ kaynak künyesi
   *   · görsel YOK      → kadraj yine duruyor ama içinde elle çizilmiş dikiş
   *     motifi var (FAZ 2 §3: "görselsiz ama ayakta"). Ziyaretçi burada
   *     HİÇBİR üretim metni görmüyor.
   *   · görsel YOK + yönetici → aynı kadraj + teknik künye + yükleme yuvası
   *
   * ⚠️ Kadraj deforme oluyor (`clip-path`), yuva OLMUYOR: `CuratorSlot`
   * `.frameWrap` kabının DIŞINDA, kırpılmayan bir kardeşte duruyor.
   * Kırpılan bir yükleme kutusu küratörün tıklayamayacağı bir kutudur.
   */
  const frame = (key: string, shapeClass: string) => {
    const scene = src(key);

    return (
      <>
        <div className={styles.frameWrap}>
          <figure className={`${styles.frameFigure} ${shapeClass}`}>
            {scene ? (
              <>
                <Image
                  className={styles.frameImg}
                  src={scene}
                  alt={`${pick(MHT_ALT.scenePrefix, locale)} ${pick(
                    MHT_SLOT_LABELS[key],
                    locale,
                  )}`}
                  fill
                  sizes="(max-width: 62rem) 92vw, 36rem"
                />
                {/* Yüklenen görselin ÜSTÜNDEKİ metne perde: açık bir karede
                    künye yazısı perdesiz okunmuyor (dalga 1'in ek dersi). */}
                <figcaption className={styles.frameCredit}>
                  <span className={styles.frameScrim} aria-hidden />
                  <span className={styles.frameCreditText}>
                    {pick(MHT_HERO.frameCredit, locale)}
                  </span>
                </figcaption>
              </>
            ) : (
              <span className={styles.frameMotif} aria-hidden>
                <StitchMark
                  className={styles.frameMotifArt}
                  seamClassName={styles.frameMotifSeam}
                  knotClassName={styles.frameMotifKnot}
                />
              </span>
            )}
          </figure>
        </div>

        {/* Üretim metadatası — YALNIZCA yöneticide, kadrajın dışında */}
        {isAdmin && !scene ? (
          <p className={styles.frameSpec} data-curator-slot>
            <span className={styles.frameSpecWord}>
              {pick(MHT_FRAME_EMPTY, locale)}
            </span>
            <span className={styles.frameSpecText}>
              {pick(MHT_SLOT_SPECS[key], locale)}
            </span>
          </p>
        ) : null}

        {isAdmin ? (
          <CuratorSlot
            characterId={MHT_ID}
            slot="ABILITY"
            abilityName={key}
            label={pick(MHT_SLOT_LABELS[key], locale)}
            size={MHT_SLOT_SIZES[key]}
          />
        ) : null}
      </>
    );
  };

  /* ══ 1 · HERO ═══════════════════════════════════════════════════════════
     Filigran bir arma değil bir DİKİŞ DESENİ: beş yama ve aralarındaki
     teyel (`PatchWeave`). Yanında 無為転変 duruyor. İkisi de `aria-hidden`. */
  const hero = (
    <>
      <nav className={styles.crumb} aria-label="breadcrumb">
        <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
        <span className={styles.crumbSep} aria-hidden>
          ·
        </span>
        <span className={styles.crumbHere}>{pick(MHT_CRUMB.series, locale)}</span>
      </nav>

      <section className={styles.hero} aria-labelledby="mht-name">
        <span className={styles.watermark} aria-hidden>
          <PatchWeave
            className={styles.watermarkArt}
            patchClassName={styles.watermarkPatch}
            seamClassName={styles.watermarkSeam}
            knotClassName={styles.watermarkKnot}
          />
          <span className={styles.watermarkKanji} lang="ja">
            {MHT_MODE.native}
          </span>
        </span>

        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>{pick(MHT_HERO.eyebrow, locale)}</p>

          <h1 id="mht-name" className={styles.heroName}>
            {name}
          </h1>

          <p className={styles.heroNative} lang="ja">
            {nativeName}
          </p>
          <p className={styles.heroAlt}>{pick(MHT_IDENTITY.altName, locale)}</p>

          <p className={styles.heroLede}>{pick(MHT_HERO.lede, locale)}</p>

          {/* Madalyon portre — 230×345, yani KÜÇÜK: tam kanama bir hero
              olarak değil dar bir kadrajda kullanılıyor. */}
          <figure className={styles.portrait}>
            <Image
              className={styles.portraitImg}
              src={portraitSrc}
              alt={pick(
                portraitUploaded
                  ? MHT_HERO.portraitAltUploaded
                  : MHT_HERO.portraitAlt,
                locale,
              )}
              width={MHT_PORTRAIT.w}
              height={MHT_PORTRAIT.h}
              unoptimized={!portraitUploaded}
              priority
            />
            <figcaption className={styles.portraitCap}>
              <span className={styles.portraitCapLine}>
                {pick(MHT_HERO.portraitCap, locale)}
              </span>
              <span className={styles.portraitCapNote}>
                {pick(MHT_HERO.portraitCapNote, locale)}
              </span>
            </figcaption>
          </figure>
          {isAdmin ? (
            <CuratorSlot
              characterId={MHT_ID}
              slot="PORTRAIT"
              label={pick(MHT_PORTRAIT_SLOT, locale)}
              size={{ w: 1200, h: 1600 }}
            />
          ) : null}

          {/* Büyük hero karesi bilerek BOŞ. Gerekçe üretim bilgisi olduğu
              için yalnızca yöneticide yazılı. */}
          {isAdmin && !src(MHT_IMAGE_KEYS.hero) ? (
            <p className={styles.heroFrameNote} data-curator-slot>
              {pick(MHT_HERO.heroCaption, locale)}
            </p>
          ) : null}
          {frame(MHT_IMAGE_KEYS.hero, styles.frameTall)}
        </div>
      </section>
    </>
  );

  return (
    <SoulShell
      isAdmin={isAdmin}
      modeTitle={pick(MHT_MODE.title, locale)}
      modeNative={MHT_MODE.native}
      modeEnter={pick(MHT_MODE.enter, locale)}
      modeExit={pick(MHT_MODE.exit, locale)}
      modeHintOn={pick(MHT_MODE.hintOn, locale)}
      modeHintOff={pick(MHT_MODE.hintOff, locale)}
      hero={hero}
    >
      {seam()}

      {/* ══ 3 · KÜNYE ŞERİDİ ═══════════════════════════════════════════════
          On iki satır. Dördünün (doğum, yaş, kan grubu, boy) kaynak değeri
          `null` ve hiçbiri "bilinmiyor" yazmıyor: bir lanetli ruhun bu dört
          bilgiyi taşımadığı satırın KENDİSİNDE anlatılıyor. */}
      <section
        className={`${styles.patch} ${styles.patch1}`}
        aria-labelledby="mht-identity"
      >
        <h2 id="mht-identity" className={styles.patchTitle}>
          {deform(MHT_SECTIONS.identity.title)}
        </h2>
        <p className={styles.patchLede}>
          {pick(MHT_SECTIONS.identity.lede, locale)}
        </p>

        <dl className={styles.facts}>
          {MHT_IDENTITY.facts.map((fact) => (
            <div key={fact.label.tr} className={styles.fact}>
              <dt className={styles.factLabel}>{pick(fact.label, locale)}</dt>
              <dd className={styles.factValue}>{pick(fact.value, locale)}</dd>
            </div>
          ))}
        </dl>

        <p className={styles.factNote}>{pick(MHT_MISSING_NOTE, locale)}</p>

        {/* Sembolik obje — künyenin bir satırına sığmadığı için kendi yaması */}
        <div className={styles.symbol}>
          <span className={styles.symbolGlyph} lang="ja" aria-hidden>
            {MHT_IDENTITY.symbol.glyph}
          </span>
          <h3 className={styles.symbolTitle}>
            {pick(MHT_IDENTITY.symbol.title, locale)}
          </h3>
          <p className={styles.symbolText}>
            {pick(MHT_IDENTITY.symbol.text, locale)}
          </p>
        </div>

        {frame(MHT_IMAGE_KEYS.seams, styles.frameSquare)}
      </section>

      {seam()}

      {/* ══ 4a · LANET LABORATUVARI — ÜÇ BÜYÜK ════════════════════════════ */}
      <section
        className={`${styles.patch} ${styles.patch2}`}
        aria-labelledby="mht-lab"
      >
        <h2 id="mht-lab" className={styles.patchTitle}>
          {deform(MHT_SECTIONS.lab.title)}
        </h2>
        <p className={styles.patchLede}>{pick(MHT_SECTIONS.lab.lede, locale)}</p>

        <ol className={styles.labList}>
          {MHT_LAB.map((entry, index) => (
            <li key={entry.key} className={styles.lab}>
              <p className={styles.labIndex} aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className={styles.labName} lang="ja">
                {entry.name}
              </h3>
              <p className={styles.labReading}>{entry.reading}</p>
              <p className={styles.labEnglish}>{entry.english}</p>
              <p className={styles.labKind}>
                {pick(entry.turkish, locale)}
                {badge(entry.badge)}
              </p>
              <p className={styles.labTagline}>{pick(entry.tagline, locale)}</p>
              <p className={styles.labText}>{pick(entry.text, locale)}</p>
              <ul className={styles.labTraits}>
                {entry.traits.map((trait) => (
                  <li key={trait.tr} className={styles.labTrait}>
                    {pick(trait, locale)}
                  </li>
                ))}
              </ul>
              {frame(entry.imageKey, styles.frameWide)}
            </li>
          ))}
        </ol>
      </section>

      {seam()}

      {/* ══ 4b · DÖRT KÜÇÜK ═══════════════════════════════════════════════ */}
      <section
        className={`${styles.patch} ${styles.patch3}`}
        aria-labelledby="mht-minors"
      >
        <h2 id="mht-minors" className={styles.patchTitle}>
          {deform(MHT_SECTIONS.minors.title)}
        </h2>
        <p className={styles.patchLede}>
          {pick(MHT_SECTIONS.minors.lede, locale)}
        </p>

        <ul className={styles.minors}>
          {MHT_MINORS.map((minor) => (
            <li key={minor.key} className={styles.minor}>
              <h3 className={styles.minorName}>{pick(minor.name, locale)}</h3>
              {/* ⚠️ `lang="ja"` YOK: bu satır karışık (kanji + Türkçe/İngilizce
                  not) ve tamamını Japonca işaretlemek ekran okuyucuya yanlış
                  dili söyler. Kanji zaten mincho zincirinden çiziliyor. */}
              <p className={styles.minorTerm}>
                {pick(minor.term, locale)}
                {badge(minor.badge)}
              </p>
              <p className={styles.minorText}>{pick(minor.text, locale)}</p>
              {frame(minor.imageKey, styles.frameScene)}
            </li>
          ))}
        </ul>
      </section>

      {seam()}

      {/* ══ 5 · SAYFANIN KALBİ — BEDEN DEĞİŞTİRME ═════════════════════════
          Tek kart, beş form. Kart yer değiştirmiyor: `FormMorph` yalnızca
          `data-form` niteliğini çeviriyor, geometriyi CSS sürüyor.

          Form kadrajları kartın İÇİNDE DEĞİL: kart deforme oluyor ve
          içindeki bir yükleme kutusu kırpılırdı. Kadrajlar aşağıdaki yama
          şeridinde, her biri kendi yuvasıyla — ve şerit deforme olmuyor. */}
      <section
        className={`${styles.patch} ${styles.patch4}`}
        aria-labelledby="mht-forms"
      >
        <h2 id="mht-forms" className={styles.patchTitle}>
          {deform(MHT_SECTIONS.forms.title)}
        </h2>
        <p className={styles.patchLede}>
          {pick(MHT_SECTIONS.forms.lede, locale)}
        </p>

        <FormMorph
          forms={forms}
          chooserLabel={pick(MHT_FORM_UI.chooserLabel, locale)}
          chooserHint={pick(MHT_FORM_UI.chooserHint, locale)}
          cardLabel={pick(MHT_FORM_UI.cardLabel, locale)}
          shapeLabel={pick(MHT_FORM_UI.shapeLabel, locale)}
          statusPrefix={pick(MHT_FORM_UI.statusPrefix, locale)}
          reducedNote={pick(MHT_FORM_UI.reducedNote, locale)}
        />

        <ul className={styles.strip}>
          {MHT_FORMS.map((form) => (
            <li key={form.key} className={styles.stripItem}>
              <p className={styles.stripName}>
                <span className={styles.stripIndex} aria-hidden>
                  {form.index}
                </span>
                {pick(form.name, locale)}
              </p>
              {frame(form.imageKey, styles.framePatch)}
            </li>
          ))}
        </ul>
      </section>

      {seam()}

      {/* ══ 6 · KADER ÇİZELGESİ ═══════════════════════════════════════════
          Beş durak. YAŞ ETİKETİ YOK (yaşı yok) — yer ve saat var. Kilit
          anlardaki orijinal dil metni TERİM rozetiyle çiziliyor, tırnak
          yok: veri dosyasının başındaki replik disiplini bloğu. */}
      <section
        className={`${styles.patch} ${styles.patch5}`}
        aria-labelledby="mht-fate"
      >
        <h2 id="mht-fate" className={styles.patchTitle}>
          {deform(MHT_SECTIONS.fate.title)}
        </h2>
        <p className={styles.patchLede}>{pick(MHT_SECTIONS.fate.lede, locale)}</p>

        <ol className={styles.fate}>
          {MHT_TIMELINE.map((stop) => {
            const kinLinked = stop.kin
              ? isExperienceCharacter(stop.kin.characterId)
              : false;
            return (
              <li key={stop.key} className={styles.stop}>
                <p className={styles.stopEra}>{pick(stop.era, locale)}</p>
                <h3 className={styles.stopTitle}>{pick(stop.title, locale)}</h3>
                <p className={styles.stopText}>{pick(stop.text, locale)}</p>

                <div className={styles.mark}>
                  {badge("term")}
                  {/* ⚠️ `blockquote` DEĞİL ve tırnak YOK: bu bir alıntı değil,
                      doğrulanmış bir terim. */}
                  <p className={styles.markText} lang="ja">
                    {stop.mark.text}
                  </p>
                  <p className={styles.markReading}>
                    {pick(stop.mark.reading, locale)}
                  </p>
                </div>

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
      </section>

      {seam()}

      {/* ══ 7a · BAĞLAR ═══════════════════════════════════════════════════
          İlk beşi `EXPERIENCE_COMPANIONS[133702]` ile birebir aynı liste.
          Son ikisinin (Hanami, Dagon) arşivde numarası YOK: düz ad, bağlantı
          kurulmuyor — olmayan bir kimliğe bağ vermek kadrajı sonsuza kadar
          boş bırakırdı. */}
      <section
        className={`${styles.patch} ${styles.patch6}`}
        aria-labelledby="mht-bonds"
      >
        <h2 id="mht-bonds" className={styles.patchTitle}>
          {deform(MHT_SECTIONS.bonds.title)}
        </h2>
        <p className={styles.patchLede}>
          {pick(MHT_SECTIONS.bonds.lede, locale)}
        </p>

        <ul className={styles.bonds}>
          {MHT_BONDS.map((bond) => {
            const linked =
              bond.characterId !== null &&
              isExperienceCharacter(bond.characterId);
            const face =
              bond.characterId !== null
                ? faces.get(bond.characterId) ?? null
                : null;
            return (
              <li key={bond.name} className={styles.bond}>
                {face ? (
                  <span className={styles.bondPortrait}>
                    <Image
                      className={styles.bondPortraitImg}
                      src={face}
                      alt={`${bond.name} — ${pick(MHT_BOND_UI.portraitAlt, locale)}`}
                      fill
                      sizes="5rem"
                    />
                  </span>
                ) : null}

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
                  {bond.nativeName}
                </span>
                <span className={styles.bondRole}>{pick(bond.role, locale)}</span>
                <span className={styles.bondLine}>{pick(bond.line, locale)}</span>
                <span className={styles.bondFlag}>
                  {pick(linked ? MHT_BOND_UI.hasPage : MHT_BOND_UI.noPage, locale)}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Evren bağları — Jujutsu Kaisen salonundaki gerçek çapalar */}
        <ul className={styles.worldLinks}>
          {MHT_WORLD_LINKS.map((link) => (
            <li key={link.anchor}>
              <a
                className={styles.worldLink}
                href={`${animeHref.jjk()}#${link.anchor}`}
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

      {seam()}

      {/* ══ 7b · KAPANIŞ ══════════════════════════════════════════════════ */}
      <section
        className={`${styles.patch} ${styles.patch7}`}
        aria-labelledby="mht-closing"
      >
        <h2 id="mht-closing" className={styles.patchTitle}>
          {deform(MHT_SECTIONS.closing.title)}
        </h2>
        <p className={styles.patchLede}>
          {pick(MHT_SECTIONS.closing.lede, locale)}
        </p>

        <ul className={styles.lines}>
          {MHT_CLOSING.lines.map((line) => (
            <li key={line.key} className={styles.line}>
              <span className={styles.lineBadge}>
                {pick(MHT_CLOSING.lineBadge, locale)}
              </span>
              <p className={styles.lineText}>{pick(line.text, locale)}</p>
              <p className={styles.lineNote}>{pick(line.note, locale)}</p>
            </li>
          ))}
        </ul>

        <p className={styles.discipline}>
          {pick(MHT_CLOSING.discipline, locale)}
        </p>

        <p className={styles.motto} lang="ja">
          {MHT_CLOSING.motto}
        </p>
        <p className={styles.mottoReading}>
          {pick(MHT_CLOSING.mottoReading, locale)}
        </p>

        {frame(MHT_IMAGE_KEYS.closing, styles.frameBand)}

        <p className={styles.credit}>
          {pick(MHT_CLOSING.credit, locale)}{" "}
          <a
            className={styles.creditLink}
            href={siteUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            {pick(MHT_CLOSING.creditLink, locale)}
          </a>
        </p>
        <p className={styles.creditNote}>
          {pick(MHT_CLOSING.creditNote, locale)}
        </p>
      </section>

      {/* Düzenleyicisiz özet — yalnızca küratör modunda çiziliyor. */}
      {isAdmin ? (
        <div className={styles.gapsWrap}>
          <CuratorGaps
            title={pick(MHT_GAPS.title, locale)}
            emptyLabel={pick(MHT_GAPS.empty, locale)}
            filledLabel={pick(MHT_GAPS.filled, locale)}
            allFilledLabel={pick(MHT_GAPS.allFilled, locale)}
            rows={gapRows}
          />
        </div>
      ) : null}
    </SoulShell>
  );
}
