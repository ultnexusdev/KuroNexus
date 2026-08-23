import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { pick, type LocalizedText } from "@/lib/characters/types";
import {
  collectAbilityImages,
  companionPortraits,
  isUploadedPortrait,
  primaryPortrait,
  type CharacterExperienceProps,
} from "@/lib/characters/experiences";
import {
  KAKASHI_CLOSING,
  KAKASHI_HERO,
  KAKASHI_ID,
  KAKASHI_IDENTITY,
  KAKASHI_IMAGE_KEYS,
  KAKASHI_INDEX_TEXT,
  KAKASHI_INDEX_TITLE,
  KAKASHI_KAMUI_TEXT,
  KAKASHI_LAB,
  KAKASHI_LAB_TITLE,
  KAKASHI_MINOR,
  KAKASHI_NATURES,
  KAKASHI_QUOTES,
  KAKASHI_SLOT_LABELS,
  KAKASHI_TIMELINE,
  KAKASHI_TIMELINE_TITLE,
} from "@/lib/characters/kakashi-hatake-experience";
import { animeHref } from "@/lib/anime/routes";
import { CuratorFrame } from "@/components/character/CuratorFrame";
import { CuratorSlot } from "@/components/character/CuratorSlot";
import { AnbuMask, KamuiVortex } from "./LedgerMarks";
import { KamuiShell } from "./KamuiShell";
import { NatureIndex } from "./NatureIndex";
import styles from "./KakashiExperience.module.css";

/**
 * Kakashi Hatake — "Kopya Kütüğü" deneyim sayfası.
 *
 * /karakterler/85 bu bileşene dallanır. Sayfanın fikri bir ARŞİV
 * KARTOTEKSİ: ince çizgili fişler, damga izleri, çekmece etiketleri.
 * Sıcaklık yok, düzen var — bin jutsu kopyalamış bir adamın dosya dolabı.
 *
 * Sayfa SUNUCUDA çizilir; iki istemci adası var:
 *   · KamuiShell  — tek durum (`data-kamui`), etkinin tamamı CSS'te
 *   · NatureIndex — doğa türü kartoteksi (sayfanın kalbi)
 * Metinler sunucuda `pick` edilip adalara düz dize iner (BRIEF kural 5).
 *
 * ── GÖRSEL POLİTİKASI ────────────────────────────────────────────────
 * Kapak portresi `primaryPortrait`ten; sahne/dönem/teknik görselleri
 * yoksa bölüm ÇÖKMEZ: yerinde boş bir fotoğraf köşeliği kalır
 * (`.mount`) — arşivin "fotoğraf beklenen boşluk" hâli. Küratör
 * yüklediğinde köşelik yerini görsele bırakır.
 */

/** Yalnız bu sayfada kullanılan iki dilli dize kurucu — alt metinler için. */
function bilingual(tr: string, en: string): LocalizedText {
  return { tr, en };
}

export function KakashiExperience({
  detail,
  isAdmin,
  companions,
}: CharacterExperienceProps) {
  const locale = useLocale();
  const t = useTranslations("character");

  const ability = collectAbilityImages(detail.images);
  const faces = companionPortraits(companions);
  const portrait = primaryPortrait(detail);
  const uploaded = isUploadedPortrait(detail);
  const displayName = detail.character.name || KAKASHI_HERO.name;

  const portraitAlt = pick(
    uploaded
      ? bilingual(
          `${displayName} — arşive yüklenen tam boy portre`,
          `${displayName} — full-size portrait uploaded to this archive`,
        )
      : bilingual(
          `${displayName} — AniList künye portresi`,
          `${displayName} — AniList profile portrait`,
        ),
    locale,
  );

  const slot = (key: string) =>
    isAdmin ? (
      <CuratorSlot
        characterId={KAKASHI_ID}
        slot="ABILITY"
        abilityName={key}
        label={pick(KAKASHI_SLOT_LABELS[key], locale)}
      />
    ) : null;

  const drawers = KAKASHI_NATURES.map((drawer) => ({
    key: drawer.key,
    kanji: drawer.kanji,
    name: drawer.name,
    label: pick(drawer.label, locale),
    lede: pick(drawer.lede, locale),
    filed: drawer.fiches.filter((fiche) => fiche.kind !== "kayip").length,
    fiches: drawer.fiches.map((fiche) => ({
      code: fiche.code,
      name: fiche.name,
      kanji: fiche.kanji,
      kind: fiche.kind,
      source: pick(fiche.source, locale),
      note: pick(fiche.note, locale),
    })),
  }));

  const heroScene = ability.get(KAKASHI_IMAGE_KEYS.hero) ?? null;

  return (
    <KamuiShell
      enterLabel={pick(KAKASHI_KAMUI_TEXT.enter, locale)}
      exitLabel={pick(KAKASHI_KAMUI_TEXT.exit, locale)}
    >
      <CuratorFrame isAdmin={isAdmin}>
        <nav className={styles.crumb} aria-label="breadcrumb">
          <Link href={animeHref.characters()}>{t("backToGallery")}</Link>
          <span className={styles.crumbSep} aria-hidden>
            /
          </span>
          <Link href={animeHref.naruto()}>Naruto</Link>
        </nav>

        {/* ══ 1 · HERO — KÜTÜĞÜN KAPAĞI ══ */}
        <header className={styles.hero}>
          <span className={styles.heroBand} aria-hidden>
            {heroScene ? (
              <Image
                src={heroScene}
                alt=""
                fill
                priority
                sizes="100vw"
                className={styles.heroSceneImg}
              />
            ) : null}
            <KamuiVortex className={styles.heroVortex} />
          </span>

          <p className={styles.heroWatermark} aria-hidden>
            {KAKASHI_HERO.watermark}
          </p>

          <div className={styles.heroInner}>
            <figure className={styles.dossier}>
              <span className={styles.dossierHoles} aria-hidden />
              <span className={styles.dossierFrame}>
                {portrait ? (
                  <Image
                    src={portrait}
                    alt={portraitAlt}
                    fill
                    priority
                    sizes="(max-width: 860px) 62vw, 340px"
                    unoptimized={!uploaded}
                    className={styles.dossierImg}
                  />
                ) : (
                  <span className={styles.mountEmpty} aria-hidden />
                )}
              </span>
              <figcaption className={styles.dossierMeta}>
                <span className={styles.dossierNo}>
                  <span className={styles.dossierNoLabel}>
                    {pick(KAKASHI_HERO.fileLabel, locale)}
                  </span>
                  {KAKASHI_HERO.fileNo}
                </span>
                <span className={styles.dossierAliases}>
                  {KAKASHI_HERO.aliases.map((alias) => (
                    <span key={alias.tr} className={styles.dossierAlias}>
                      {pick(alias, locale)}
                    </span>
                  ))}
                </span>
              </figcaption>
            </figure>

            <div className={styles.heroText}>
              <h1 className={styles.heroName}>{displayName}</h1>
              <p className={styles.heroNative} lang="ja">
                {detail.character.nameNative ?? KAKASHI_HERO.nativeName}
              </p>
              <p className={styles.heroEpigraph}>
                {pick(KAKASHI_HERO.epigraph, locale)}
              </p>
            </div>
          </div>

          {isAdmin ? (
            <div className={styles.slotRow}>{slot(KAKASHI_IMAGE_KEYS.hero)}</div>
          ) : null}
        </header>

        {/* ══ 2 · KÜTÜK KÜNYESİ ══ */}
        <section className={styles.identity} aria-labelledby="kakashi-identity">
          <div className={styles.identityHead}>
            <h2 id="kakashi-identity" className={styles.sectionTitle}>
              {pick(KAKASHI_IDENTITY.title, locale)}
            </h2>
            <p className={styles.identityStamp} aria-hidden>
              {pick(KAKASHI_IDENTITY.stamp, locale)}
            </p>
          </div>
          <dl className={styles.facts}>
            {KAKASHI_IDENTITY.facts.map((fact) => (
              <div key={fact.label.tr} className={styles.fact}>
                <dt>{pick(fact.label, locale)}</dt>
                <dd>{pick(fact.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ══ 3 · LABORATUVAR — ÜÇ AĞIR DOSYA + DÖRT KÜÇÜK FİŞ ══ */}
        <section className={styles.lab} aria-labelledby="kakashi-lab">
          <header className={styles.sectionHead}>
            <h2 id="kakashi-lab" className={styles.sectionTitle}>
              {pick(KAKASHI_LAB_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KAKASHI_LAB_TITLE.lede, locale)}
            </p>
          </header>

          <ul className={styles.labGrid}>
            {KAKASHI_LAB.map((technique) => {
              const key = KAKASHI_IMAGE_KEYS[technique.key];
              const art = ability.get(key) ?? null;
              return (
                <li
                  key={technique.key}
                  className={styles.labCard}
                  data-technique={technique.key}
                >
                  <span className={styles.labArt} aria-hidden>
                    {art ? (
                      <Image
                        src={art}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 100vw, 420px"
                        className={styles.labImg}
                      />
                    ) : (
                      <span className={styles.mountEmpty} />
                    )}
                  </span>
                  <span className={styles.labBody}>
                    <span className={styles.labKanji} aria-hidden lang="ja">
                      {technique.kanji}
                    </span>
                    <span className={styles.labName}>{technique.name}</span>
                    <span className={styles.labTagline}>
                      {pick(technique.tagline, locale)}
                    </span>
                    <span className={styles.labText}>
                      {pick(technique.text, locale)}
                    </span>
                    <span className={styles.labTraits}>
                      {technique.traits.map((trait) => (
                        <span key={trait.tr} className={styles.labTrait}>
                          {pick(trait, locale)}
                        </span>
                      ))}
                    </span>
                  </span>
                  {slot(key)}
                </li>
              );
            })}
          </ul>

          <ul className={styles.minorRow}>
            {KAKASHI_MINOR.map((entry) => {
              const art = ability.get(entry.imageKey) ?? null;
              return (
                <li key={entry.name} className={styles.minorCard}>
                  <span className={styles.minorArt} aria-hidden>
                    {art ? (
                      <Image
                        src={art}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 50vw, 300px"
                        className={styles.minorImg}
                      />
                    ) : (
                      <span className={styles.mountEmpty} />
                    )}
                  </span>
                  <span className={styles.minorBody}>
                    <span className={styles.minorKanji} aria-hidden lang="ja">
                      {entry.kanji}
                    </span>
                    <span className={styles.minorName}>{entry.name}</span>
                    <span className={styles.minorNote}>
                      {pick(entry.note, locale)}
                    </span>
                  </span>
                  {slot(entry.imageKey)}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ══ 4 · DOĞA TÜRÜ KARTOTEKSİ — SAYFANIN KALBİ ══ */}
        <section className={styles.index} aria-labelledby="kakashi-index">
          <header className={styles.sectionHead}>
            <h2 id="kakashi-index" className={styles.sectionTitle}>
              {pick(KAKASHI_INDEX_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KAKASHI_INDEX_TITLE.lede, locale)}
            </p>
          </header>
          <NatureIndex
            drawers={drawers}
            labels={{
              rail: pick(KAKASHI_INDEX_TEXT.railLabel, locale),
              source: pick(KAKASHI_INDEX_TEXT.sourceLabel, locale),
              copied: pick(KAKASHI_INDEX_TEXT.copiedLabel, locale),
              blank: pick(KAKASHI_INDEX_TEXT.blankLabel, locale),
              count: pick(KAKASHI_INDEX_TEXT.countLabel, locale),
              hint: pick(KAKASHI_INDEX_TEXT.hint, locale),
            }}
          />
        </section>

        {/* ══ 5 · KADER ÇİZELGESİ ══ */}
        <section className={styles.timeline} aria-labelledby="kakashi-timeline">
          <header className={styles.sectionHead}>
            <h2 id="kakashi-timeline" className={styles.sectionTitle}>
              {pick(KAKASHI_TIMELINE_TITLE.title, locale)}
            </h2>
            <p className={styles.sectionLede}>
              {pick(KAKASHI_TIMELINE_TITLE.lede, locale)}
            </p>
          </header>

          <ol className={styles.eraList}>
            {KAKASHI_TIMELINE.map((era) => {
              const art = ability.get(era.imageKey) ?? null;
              return (
                <li key={era.key} className={styles.era} data-era={era.key}>
                  <div className={styles.eraRail}>
                    <span className={styles.eraAge}>{pick(era.age, locale)}</span>
                  </div>

                  <div className={styles.eraBody}>
                    <h3 className={styles.eraTitle}>{pick(era.title, locale)}</h3>
                    <p className={styles.eraText}>{pick(era.text, locale)}</p>
                    {era.quote ? (
                      <blockquote className={styles.eraQuote}>
                        {pick(era.quote, locale)}
                      </blockquote>
                    ) : null}
                    {era.people.length > 0 ? (
                      <ul className={styles.eraPeople}>
                        {era.people.map((person) => {
                          const face = faces.get(person.id) ?? null;
                          return (
                            <li key={person.id} className={styles.person}>
                              <span className={styles.personFace}>
                                {face ? (
                                  <Image
                                    src={face}
                                    alt={pick(
                                      bilingual(
                                        `${person.name} — arşiv portresi`,
                                        `${person.name} — archive portrait`,
                                      ),
                                      locale,
                                    )}
                                    fill
                                    sizes="72px"
                                    className={styles.personImg}
                                  />
                                ) : null}
                              </span>
                              <span className={styles.personText}>
                                <span className={styles.personName}>
                                  {person.name}
                                </span>
                                <span className={styles.personRole}>
                                  {pick(person.role, locale)}
                                </span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>

                  <div className={styles.eraArt}>
                    {art ? (
                      <Image
                        src={art}
                        alt=""
                        fill
                        sizes="(max-width: 900px) 100vw, 520px"
                        className={styles.eraImg}
                      />
                    ) : (
                      <span className={styles.mountEmpty} aria-hidden>
                        {era.key === "anbu" ? (
                          <AnbuMask className={styles.mountMask} />
                        ) : null}
                      </span>
                    )}
                    {slot(era.imageKey)}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ══ 6 · KAPANIŞ — KIRILAN CÜMLE ══ */}
        <section className={styles.closing} aria-labelledby="kakashi-closing">
          <h2 id="kakashi-closing" className={styles.visuallyHidden}>
            {displayName}
          </h2>
          <div className={styles.quotes}>
            {KAKASHI_QUOTES.map((quote, i) => (
              <figure
                key={quote.text.tr}
                className={styles.quote}
                data-half={i === 0 ? "first" : "second"}
              >
                <blockquote>{pick(quote.text, locale)}</blockquote>
                <figcaption>{pick(quote.note, locale)}</figcaption>
              </figure>
            ))}
          </div>
          <p className={styles.motto} lang="ja">
            {KAKASHI_CLOSING.motto}
          </p>
          <p className={styles.credit}>
            {pick(KAKASHI_CLOSING.credit, locale)}{" "}
            <a
              href={KAKASHI_CLOSING.creditHref}
              target="_blank"
              rel="noreferrer"
              className={styles.creditLink}
            >
              {pick(KAKASHI_CLOSING.creditLink, locale)}
            </a>
          </p>
        </section>
      </CuratorFrame>
    </KamuiShell>
  );
}
