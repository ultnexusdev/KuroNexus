import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { animeHref } from "@/lib/anime/routes";
import { pick } from "@/lib/characters/types";
import {
  collectAbilityImages,
  companionPortraits,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  KONOHAMARU_ALT,
  KONOHAMARU_CHAIN,
  KONOHAMARU_CHAIN_UI,
  KONOHAMARU_CLOSING,
  KONOHAMARU_CRUMB,
  KONOHAMARU_HERO,
  KONOHAMARU_ID,
  KONOHAMARU_IDENTITY,
  KONOHAMARU_IMAGE_KEYS,
  KONOHAMARU_JUTSU,
  KONOHAMARU_KEEPSAKES,
  KONOHAMARU_NAME_BLOCK,
  KONOHAMARU_SECTIONS,
  KONOHAMARU_SITE_URL,
  KONOHAMARU_SLOT_LABELS,
  KONOHAMARU_TIMELINE,
  KONOHAMARU_TORCH_TEXT,
} from "@/lib/characters/konohamaru-sarutobi-experience";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { HandoverMark, LeafFall, ScarfBand } from "./KonohamaruGlyphs";
import { TorchChain, type RelayView } from "./TorchChain";
import { TorchShell } from "./TorchShell";
import styles from "./KonohamaruExperience.module.css";

/**
 * Konohamaru Sarutobi — "Devralınan Ateş" deneyim sayfası.
 *
 * /dark-stories/category/anime/karakterler/3889 bu bileşene dallanır
 * (rota dosyasındaki `EXPERIENCES` haritası). Sayfanın fikri tek cümle:
 * HİÇBİR ŞEY KENDİNİN DEĞİL. Rasengan Naruto'dan, ateş dededen, ad köyden;
 * sayfadaki her kutu kimden kaldığını yazıyor. Tek istisna mavi atkı.
 *
 * Sayfa SUNUCUDA çizilir. İki istemci adası var:
 *   TorchShell — "Hokage'nin torunu" modu + zincirin ışık durumu (bağlam)
 *   TorchChain — meşale zinciri (dikey sekmeler + klavye + halattaki ateş)
 * Metinler burada `pick` ile seçilip adalara düz dize olarak iner.
 *
 * Görseller: characterId 3889 kaydının ABILITY yuvaları (`konohamaru:*`).
 * Hiçbiri zorunlu değil — yuva boşken bölüm görselsiz ama ayakta kalır.
 * ⚠️ Bu karakterin tam boy portresi arşivde YOK; kapak AniList'in ~230
 * piksellik künye portresi. Bu yüzden portre hiçbir yerde büyük kutuya
 * yayılmıyor: hero'da dar bir kadraj, zincirde küçük bir halka.
 */
export function KonohamaruExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const src = (key: string): string | null => ability.get(key) ?? null;

  const portrait = primaryPortrait(detail);
  const portraitUploaded = isUploadedPortrait(detail);
  const heroScene = src(KONOHAMARU_IMAGE_KEYS.hero);
  const nameArt = src(KONOHAMARU_IMAGE_KEYS.name);
  const closingArt = src(KONOHAMARU_IMAGE_KEYS.closing);

  const name = detail.character.name || KONOHAMARU_IDENTITY.name;
  const nativeName =
    detail.character.nameNative ?? KONOHAMARU_IDENTITY.nativeName;
  const siteUrl = detail.character.siteUrl ?? KONOHAMARU_SITE_URL;
  const faceSuffix = pick(KONOHAMARU_ALT.faceSuffix, locale);

  /** Zincirdeki elin yüzü: yoldaş portresi, kendi halkasında künye portresi. */
  const relayFace = (link: (typeof KONOHAMARU_CHAIN)[number]): string | null => {
    if (link.ownPortrait) {
      return portrait;
    }
    if (link.characterId === null) {
      return null;
    }
    return faces.get(link.characterId) ?? null;
  };

  const relay: RelayView[] = KONOHAMARU_CHAIN.map((link) => ({
    key: link.key,
    name: link.name,
    role: pick(link.role, locale),
    rank: pick(link.rank, locale),
    lede: pick(link.lede, locale),
    face: relayFace(link),
    faceUnoptimized: link.ownPortrait === true && !portraitUploaded,
    art: src(link.imageKey),
    gifts: link.gifts
      ? {
          name: pick(link.gifts.name, locale),
          technique: pick(link.gifts.technique, locale),
          word: pick(link.gifts.word, locale),
          wordBy: link.gifts.wordBy ? pick(link.gifts.wordBy, locale) : null,
          wordNote: link.gifts.wordNote
            ? pick(link.gifts.wordNote, locale)
            : null,
          burden: pick(link.gifts.burden, locale),
        }
      : null,
    empty: link.empty
      ? {
          title: pick(link.empty.title, locale),
          text: pick(link.empty.text, locale),
        }
      : null,
  }));

  return (
    <TorchShell
      enterLabel={pick(KONOHAMARU_TORCH_TEXT.enter, locale)}
      exitLabel={pick(KONOHAMARU_TORCH_TEXT.exit, locale)}
      hint={pick(KONOHAMARU_TORCH_TEXT.hint, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            ·
          </span>
          <Link href={animeHref.naruto()}>
            {pick(KONOHAMARU_CRUMB.naruto, locale)}
          </Link>
        </nav>

        {/* ══ 1 · HERO — GÖKYÜZÜ, ATKI, DÜŞEN YAPRAKLAR ═══════════════════
            Portre KÜÇÜK ve dar kadrajlı (AniList künye görseli, ~230 px).
            Atkı portrenin arkasından çıkıp kadrajın dışına sarkıyor. */}
        <section className={styles.hero} aria-labelledby="knh-name">
          {heroScene ? (
            <span className={styles.heroScene} aria-hidden>
              <Image src={heroScene} alt="" fill priority sizes="1920px" />
              <span className={styles.heroScrim} />
            </span>
          ) : null}

          <LeafFall className={styles.leaves} leafClassName={styles.leaf} />

          <p className={styles.heroMark} aria-hidden>
            {KONOHAMARU_IDENTITY.watermark}
          </p>

          <div className={styles.heroBody}>
            <p className={styles.heroHouse}>
              <span className={styles.plainOnly}>
                {pick(KONOHAMARU_IDENTITY.house, locale)}
              </span>
              <span className={styles.formalOnly}>
                {pick(KONOHAMARU_IDENTITY.title, locale)}
              </span>
            </p>
            <h1 id="knh-name" className={styles.heroName}>
              {name}
            </h1>
            <p className={styles.heroNative} aria-hidden>
              {nativeName}
            </p>
            <p className={styles.heroEpigraph}>
              {pick(KONOHAMARU_IDENTITY.epigraph, locale)}
            </p>
            <p className={styles.heroLede}>
              {pick(KONOHAMARU_HERO.lede, locale)}
            </p>
          </div>

          <div className={styles.heroAside}>
            <div className={styles.heroPortraitWrap}>
              {portrait ? (
                <span className={styles.heroPortrait}>
                  <Image
                    src={portrait}
                    alt={pick(
                      portraitUploaded
                        ? KONOHAMARU_HERO.portraitAlt
                        : KONOHAMARU_HERO.portraitAltFallback,
                      locale,
                    )}
                    fill
                    sizes="240px"
                    priority
                    unoptimized={!portraitUploaded}
                  />
                </span>
              ) : null}
              {/* Atkı: portrenin arkasından çıkar, sayfadan sarkar */}
              <ScarfBand
                className={styles.scarf}
                bandClassName={styles.scarfBand}
                tailClassName={styles.scarfTail}
              />
            </div>
            <p className={styles.scarfCaption}>
              {pick(KONOHAMARU_HERO.scarfCaption, locale)}
            </p>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KONOHAMARU_ID}
                slot="ABILITY"
                abilityName={KONOHAMARU_IMAGE_KEYS.hero}
                label={pick(
                  KONOHAMARU_SLOT_LABELS[KONOHAMARU_IMAGE_KEYS.hero],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 2 · KÜNYE ══════════════════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="knh-identity">
          <header className={styles.sectionHead}>
            <h2 id="knh-identity" className={styles.sectionTitle}>
              {pick(KONOHAMARU_SECTIONS.identity.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KONOHAMARU_SECTIONS.identity.lede, locale)}
            </p>
          </header>
          <dl className={styles.facts}>
            {KONOHAMARU_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · ADIN YÜKÜ — DUYGUSAL MERKEZ ════════════════════════════
            Ad kanjilerine ayrılıyor, sonra ona nasıl seslenildiği, sonra
            adını ilk kullanan kişi. Sayfanın ışığı bu bölümde en sıcak. */}
        <section className={styles.nameSection} aria-labelledby="knh-weight">
          <header className={styles.sectionHead}>
            <h2 id="knh-weight" className={styles.sectionTitle}>
              {pick(KONOHAMARU_SECTIONS.name.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KONOHAMARU_SECTIONS.name.lede, locale)}
            </p>
          </header>

          {nameArt ? (
            <span className={styles.nameArt} aria-hidden>
              <Image src={nameArt} alt="" fill sizes="960px" />
            </span>
          ) : null}

          <div className={styles.nameGrid}>
            <div className={styles.nameBreak}>
              {/* Ad iki parçaya ayrılıyor: köyün adı + çocuk eki */}
              <dl className={styles.glyphs}>
                {KONOHAMARU_NAME_BLOCK.glyphs.map((piece) => (
                  <div key={piece.glyph} className={styles.glyphRow}>
                    <dt className={styles.glyphChar} lang="ja">
                      {piece.glyph}
                    </dt>
                    <dd className={styles.glyphBody}>
                      <span className={styles.glyphReading}>
                        {piece.reading}
                      </span>
                      <span className={styles.glyphGloss}>
                        {pick(piece.gloss, locale)}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className={styles.glyphNote}>
                {pick(KONOHAMARU_NAME_BLOCK.namedBy, locale)}
              </p>
            </div>

            <div className={styles.addressed}>
              <p className={styles.addressedLabel}>
                {pick(KONOHAMARU_NAME_BLOCK.addressedLabel, locale)}
              </p>
              <ul className={styles.addressList}>
                {KONOHAMARU_NAME_BLOCK.addressed.map((item) => (
                  <li key={item.phrase.tr} className={styles.addressItem}>
                    <span className={styles.addressPhrase}>
                      {pick(item.phrase, locale)}
                    </span>
                    <span className={styles.addressBy}>
                      {pick(item.by, locale)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className={styles.turn}>
                <p className={styles.turnLabel}>
                  {pick(KONOHAMARU_NAME_BLOCK.turnLabel, locale)}
                </p>
                <p className={styles.turnName}>
                  {KONOHAMARU_NAME_BLOCK.turnName}
                </p>
                <p className={styles.turnText}>
                  {pick(KONOHAMARU_NAME_BLOCK.turnText, locale)}
                </p>
                <p className={styles.turnNote}>
                  {pick(KONOHAMARU_NAME_BLOCK.note, locale)}
                </p>
              </div>
            </div>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KONOHAMARU_ID}
                slot="ABILITY"
                abilityName={KONOHAMARU_IMAGE_KEYS.name}
                label={pick(
                  KONOHAMARU_SLOT_LABELS[KONOHAMARU_IMAGE_KEYS.name],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>

        {/* ══ 4 · DEVRALDIKLARI — ÜÇ BÜYÜK ═══════════════════════════════ */}
        <section className={styles.section} aria-labelledby="knh-lab">
          <header className={styles.sectionHead}>
            <h2 id="knh-lab" className={styles.sectionTitle}>
              {pick(KONOHAMARU_SECTIONS.lab.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KONOHAMARU_SECTIONS.lab.lede, locale)}
            </p>
          </header>

          <ul className={styles.jutsuList}>
            {KONOHAMARU_JUTSU.map((item) => {
              const art = src(item.imageKey);
              const footnote = "footnote" in item ? item.footnote : null;
              return (
                <li key={item.key} className={styles.jutsu}>
                  <p className={styles.jutsuFrom}>
                    <span>{pick(item.from, locale)}</span>
                    <HandoverMark className={styles.jutsuMark} />
                  </p>

                  <div className={styles.jutsuHead}>
                    <h3 className={styles.jutsuName}>{item.name}</h3>
                    <span className={styles.jutsuKanji} aria-hidden lang="ja">
                      {item.kanji}
                    </span>
                  </div>
                  <p className={styles.jutsuTurkish}>
                    {pick(item.turkish, locale)}
                  </p>

                  <span className={styles.jutsuArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="640px" /> : null}
                  </span>

                  <p className={styles.jutsuTagline}>
                    {pick(item.tagline, locale)}
                  </p>
                  <p className={styles.jutsuText}>{pick(item.text, locale)}</p>
                  {footnote ? (
                    <p className={styles.jutsuFootnote}>
                      {pick(footnote, locale)}
                    </p>
                  ) : null}
                  <p className={styles.jutsuTraits}>
                    {item.traits.map((trait) => (
                      <span key={trait.tr} className={styles.trait}>
                        {pick(trait, locale)}
                      </span>
                    ))}
                  </p>

                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KONOHAMARU_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(KONOHAMARU_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 5 · YANINDA TAŞIDIKLARI — DÖRT KÜÇÜK ═══════════════════════ */}
        <section className={styles.section} aria-labelledby="knh-keepsakes">
          <header className={styles.sectionHead}>
            <h2 id="knh-keepsakes" className={styles.sectionTitle}>
              {pick(KONOHAMARU_SECTIONS.keepsakes.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KONOHAMARU_SECTIONS.keepsakes.lede, locale)}
            </p>
          </header>
          <ul className={styles.keepsakes}>
            {KONOHAMARU_KEEPSAKES.map((item) => {
              const art = src(item.imageKey);
              return (
                <li key={item.key} className={styles.keepsake}>
                  <span className={styles.keepsakeArt} aria-hidden>
                    {art ? <Image src={art} alt="" fill sizes="480px" /> : null}
                  </span>
                  <h3 className={styles.keepsakeName}>
                    {pick(item.name, locale)}
                  </h3>
                  <p className={styles.keepsakeNote}>{pick(item.note, locale)}</p>
                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KONOHAMARU_ID}
                      slot="ABILITY"
                      abilityName={item.imageKey}
                      label={pick(KONOHAMARU_SLOT_LABELS[item.imageKey], locale)}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 6 · MEŞALE ZİNCİRİ — SAYFANIN KALBİ ════════════════════════ */}
        <section className={styles.chainSection} aria-labelledby="knh-chain">
          <header className={styles.sectionHead}>
            <h2 id="knh-chain" className={styles.sectionTitle}>
              {pick(KONOHAMARU_SECTIONS.chain.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KONOHAMARU_SECTIONS.chain.lede, locale)}
            </p>
          </header>

          <TorchChain
            links={relay}
            listLabel={pick(KONOHAMARU_CHAIN_UI.listLabel, locale)}
            ringWord={pick(KONOHAMARU_CHAIN_UI.ringWord, locale)}
            emptyLabel={pick(KONOHAMARU_CHAIN_UI.emptyRingLabel, locale)}
            prevLabel={pick(KONOHAMARU_CHAIN_UI.prev, locale)}
            nextLabel={pick(KONOHAMARU_CHAIN_UI.next, locale)}
            keyboardHint={pick(KONOHAMARU_CHAIN_UI.keyboardHint, locale)}
            giftLabels={{
              name: pick(KONOHAMARU_CHAIN_UI.giftLabels.name, locale),
              technique: pick(KONOHAMARU_CHAIN_UI.giftLabels.technique, locale),
              word: pick(KONOHAMARU_CHAIN_UI.giftLabels.word, locale),
              burden: pick(KONOHAMARU_CHAIN_UI.giftLabels.burden, locale),
            }}
          />

          {isAdmin ? (
            <div className={styles.slotRow}>
              {KONOHAMARU_CHAIN.map((link) => (
                <CuratorSlot
                  key={link.imageKey}
                  characterId={KONOHAMARU_ID}
                  slot="ABILITY"
                  abilityName={link.imageKey}
                  label={pick(KONOHAMARU_SLOT_LABELS[link.imageKey], locale)}
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* ══ 7 · ÖMRÜN BEŞ DURAĞI ═══════════════════════════════════════ */}
        <section className={styles.section} aria-labelledby="knh-fate">
          <header className={styles.sectionHead}>
            <h2 id="knh-fate" className={styles.sectionTitle}>
              {pick(KONOHAMARU_SECTIONS.fate.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KONOHAMARU_SECTIONS.fate.lede, locale)}
            </p>
          </header>

          <ol className={styles.fate}>
            {KONOHAMARU_TIMELINE.map((entry) => {
              const art = src(entry.imageKey);
              const face =
                entry.faceId !== undefined
                  ? faces.get(entry.faceId) ?? null
                  : null;
              return (
                <li key={entry.key} className={styles.fateItem}>
                  <p className={styles.fateAge}>{pick(entry.age, locale)}</p>

                  <div className={styles.fateBody}>
                    <h3 className={styles.fateTitle}>
                      {pick(entry.title, locale)}
                    </h3>
                    <p className={styles.fateText}>{pick(entry.text, locale)}</p>
                    {entry.quote ? (
                      <figure className={styles.fateQuote}>
                        <blockquote>
                          &ldquo;{pick(entry.quote.text, locale)}&rdquo;
                        </blockquote>
                        <figcaption>{pick(entry.quote.by, locale)}</figcaption>
                      </figure>
                    ) : null}
                  </div>

                  <div className={styles.fateAside}>
                    {face && entry.faceName ? (
                      <figure className={styles.fateFace}>
                        <span className={styles.fateFaceArt}>
                          <Image
                            src={face}
                            alt={`${entry.faceName} ${faceSuffix}`}
                            fill
                            sizes="120px"
                          />
                        </span>
                        <figcaption>{entry.faceName}</figcaption>
                      </figure>
                    ) : null}
                    <span className={styles.fateArt} aria-hidden>
                      {art ? (
                        <Image src={art} alt="" fill sizes="480px" />
                      ) : null}
                    </span>
                  </div>

                  {isAdmin ? (
                    <CuratorSlot
                      characterId={KONOHAMARU_ID}
                      slot="ABILITY"
                      abilityName={entry.imageKey}
                      label={pick(
                        KONOHAMARU_SLOT_LABELS[entry.imageKey],
                        locale,
                      )}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 8 · KAPANIŞ ════════════════════════════════════════════════ */}
        <section className={styles.closing} aria-labelledby="knh-closing">
          <h2 id="knh-closing" className={styles.visuallyHidden}>
            {name}
          </h2>

          {closingArt ? (
            <span className={styles.closingArt} aria-hidden>
              <Image src={closingArt} alt="" fill sizes="1440px" />
            </span>
          ) : null}

          <div className={styles.closingQuotes}>
            {KONOHAMARU_CLOSING.quotes.map((quote) => (
              <figure key={quote.text.tr} className={styles.closingQuote}>
                <blockquote>&ldquo;{pick(quote.text, locale)}&rdquo;</blockquote>
                <figcaption>
                  <span className={styles.quoteBy}>{pick(quote.by, locale)}</span>
                  <span className={styles.quoteNote}>
                    {pick(quote.note, locale)}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className={styles.motto} aria-hidden lang="ja">
            {KONOHAMARU_CLOSING.motto}
          </p>
          <p className={styles.mottoNote}>
            {pick(KONOHAMARU_CLOSING.mottoNote, locale)}
          </p>

          <p className={styles.credit}>
            {pick(KONOHAMARU_CLOSING.credit, locale)}{" "}
            <a href={siteUrl} target="_blank" rel="noreferrer noopener">
              {pick(KONOHAMARU_CLOSING.creditLink, locale)}
            </a>
          </p>

          {isAdmin ? (
            <div className={styles.slotRow}>
              <CuratorSlot
                characterId={KONOHAMARU_ID}
                slot="ABILITY"
                abilityName={KONOHAMARU_IMAGE_KEYS.closing}
                label={pick(
                  KONOHAMARU_SLOT_LABELS[KONOHAMARU_IMAGE_KEYS.closing],
                  locale,
                )}
              />
            </div>
          ) : null}
        </section>
      </CuratorFrame>
    </TorchShell>
  );
}
