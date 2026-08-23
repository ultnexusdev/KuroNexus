import { getTranslations } from "next-intl/server";
import { CuratedImage } from "./CuratedImage";
import { HeroParallax } from "./HeroParallax";
import { WORLD_LAYERS_ORDER } from "./WorldSilhouettes";
import styles from "./BleachHero.module.css";
import world from "./world.module.css";

/**
 * P01 · HERO — RUHLARIN DENGESİ.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Naruto Evreni bir karakter görseliyle açılıyor. Bleach BÖYLE AÇILMIYOR.
 * Bu hero bir DENGE TABLOSU: tek bedende dört ruhsal kimlik. Görsel dört
 * dikey şeride bölünüyor ve her şerit bir kimliğin rengini alıyor —
 * shinigami, hollow, quincy, insan.
 *
 * Şeritler hafifçe kaymış (0 / -6 / +4 / -2 piksel): kırık ayna hissi.
 * Denge sağlam değil, tutuluyor.
 *
 * ── TEK GÖRSEL, DÖRT ŞERİT ───────────────────────────────────────────────
 * Dört `<CuratedImage>` AYNI yuvayı çiziyor (`bleach:hero:ichigo`) ve her
 * biri görselin dörtte birini gösteriyor: şerit %25 genişlikte, içindeki
 * çerçeve %400 ve kendi payı kadar sola kaydırılmış. Tarayıcı tek dosya
 * indiriyor — dördü aynı adres.
 *
 * ⚠️ Kalem düğmesi YALNIZCA ilk şeritte (`noEdit` diğerlerinde): dört
 * kalem aynı yuvayı düzenlerdi ve küratör hangisinin ne olduğunu
 * anlamazdı.
 *
 * ── GÖRSEL YOKKEN ────────────────────────────────────────────────────────
 * Dört şerit dört renk bandına dönüyor: kimlikler duruyor, fotoğraf
 * bekliyor. "Eksik görsel" hissi yok — kompozisyon zaten dört kimliğin
 * yan yana durması. Fotoğraf geldiğinde aynı bantlar dolduruyor.
 *
 * ── SIFIR JS DEĞİL, AZ JS ────────────────────────────────────────────────
 * Tek istemci adası imleç paralaksı (`HeroParallax`) ve o da kaba
 * işaretçide / `prefers-reduced-motion`'da hiç kurulmuyor. Geri kalan her
 * şey — şeritler, yarık, partiküller, dünya evrimi — saf CSS. JS
 * gelmezse hero eksiksiz çiziliyor (kabul ölçütü).
 */

/** Dört kimlik: kanji, renk anahtarı ve kırık ayna kayması */
const IDENTITIES = [
  { key: "shinigami", kanji: "死神", offset: 0 },
  { key: "hollow", kanji: "虚", offset: -6 },
  { key: "quincy", kanji: "滅却師", offset: 4 },
  { key: "human", kanji: "人間", offset: -2 },
] as const;

/**
 * Reishi partikülleri — brief'in üst sınırı 40. Canvas değil, saf CSS.
 *
 * ⚠️ Konum ve süre BURADA hesaplanıyor, CSS'te değil. İlk sürüm `mod()`
 * ile CSS'te türetiyordu ve iki sorunu vardı: `mod()` görece yeni
 * (desteklenmediğinde bildirim tümden geçersiz olur ve kırk partikül aynı
 * noktaya yığılır), üstelik okunması da zordu.
 *
 * ⚠️ `Math.random` YOK: sunucu ve istemci aynı değerleri üretmeli, yoksa
 * hidrasyon uyuşmazlığı çıkar. Dağılım deterministik bir formülden geliyor
 * ve gözle rastgele görünüyor.
 */
const PARTICLES = Array.from({ length: 40 }, (_, i) => {
  // Çift indisler yarığın solunda, tekler sağında
  const side = i % 2 === 0 ? -1 : 1;
  const spread = 2 + ((i * 7) % 13) * 1.6;
  return {
    left: 50 + side * spread,
    duration: 9 + ((i * 5) % 7) * 1.4,
    delay: -(i * 0.42),
  };
});

export async function BleachHero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.hero" });

  return (
    <header id="hero" className={styles.hero}>
      {/* ── ARKA SAHNE ─────────────────────────────────────────────
          Üç katman TEK yapışkan kutunun içinde: dünya siluetleri,
          Garganta yarığı ve reishi. Ayrı ayrı yapışkan yapılsaydı üçü
          birbirinden bağımsız kayardı; tek sahne hepsini kilitliyor. */}
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.stage}>
          {/* Dünya evrimi: Karakura → Seireitei → Las Noches → Silbern.
              Çapraz geçiş + hafif ölçek, tamamen CSS. */}
          {WORLD_LAYERS_ORDER.map(({ key, Silhouette }) => (
            <span key={key} className={styles.worldLayer}>
              <Silhouette />
            </span>
          ))}

          {/* Garganta yarığı: ekranın merkezinden yukarı-aşağı uzanan
              düzensiz çatlak. İçi zeminden daha koyu — boşluğun kendisi. */}
          <span className={styles.rift}>
            <svg viewBox="0 0 120 1000" preserveAspectRatio="none">
              <path
                d="M60 0 54 92 66 178 49 268 68 352 52 446 71 530 55 622 69 712 51 806 66 894 58 1000 62 894 74 806 56 712 72 622 58 530 76 446 60 352 79 268 62 178 74 92Z"
                fill="currentColor"
              />
            </svg>
          </span>

          {/* Reishi: yarığın kenarlarından yükselen ruh parçacıkları */}
          {PARTICLES.map((particle, i) => (
            <span
              key={i}
              className={styles.particle}
              style={
                {
                  left: `${particle.left}%`,
                  animationDuration: `${particle.duration}s`,
                  animationDelay: `${particle.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      {/* ── ÖN KATMAN ──────────────────────────────────────────────── */}
      <div className={styles.inner}>
        <p className={`${world.eyebrow} ${styles.eyebrow}`} lang="en">
          {t("eyebrow")}
        </p>

        {/* ⚠️ Latin bir özel ad: `lang="en"` yazılı ki tarayıcı Türkçe
            büyütme kuralını uygulamasın. Ölçek `--t-hero`, ağırlık 200 —
            başlık ASLA bold olmuyor; Bleach'in gücü ağırlıkta değil
            boşlukta. */}
        <h1 className={`${world.hero} ${styles.wordmark}`} lang="en">
          {t("title")}
        </h1>

        <hr className={`${world.rule} ${styles.rule}`} />

        <p className={`${world.kubo} ${styles.subtitle}`} lang="en">
          {t("subtitle")}
        </p>

        {/* ── DENGE TABLOSU ────────────────────────────────────────── */}
        <HeroParallax className={styles.balance}>
          <div className={styles.strips}>
            {IDENTITIES.map((identity, i) => (
              <span
                key={identity.key}
                className={styles.strip}
                data-identity={identity.key}
                style={
                  {
                    "--i": i,
                    "--offset": `${identity.offset}px`,
                  } as React.CSSProperties
                }
              >
                <span className={styles.stripArt}>
                  <CuratedImage
                    slotId="bleach:hero:ichigo"
                    fill
                    decorative={i > 0}
                    noEdit={i > 0}
                    sizes="960px"
                  />
                </span>
                <span className={styles.tint} aria-hidden="true" />
              </span>
            ))}
          </div>

          {/* Kanji satırı: dört şeridin altında, her biri kendi şeridiyle
              hizalı. Ekran okuyucuya da gidiyor — kimlikler içeriğin
              kendisi, dekor değil. */}
          <ol className={styles.identities}>
            {IDENTITIES.map((identity) => (
              <li
                key={identity.key}
                className={styles.identity}
                data-identity={identity.key}
              >
                <span className={styles.identityKanji} lang="ja">
                  {identity.kanji}
                </span>
                <span className={`${world.meta} ${styles.identityName}`}>
                  {t(`identities.${identity.key}`)}
                </span>
              </li>
            ))}
          </ol>
        </HeroParallax>

        <p className={`${world.body} ${styles.lede}`}>{t("lede")}</p>

        {/* İniş işareti: sayfanın tamamı bir dikey iniş, ilk cümlesi bu */}
        <a className={styles.descend} href="#living">
          <span className={world.meta}>{t("descend")}</span>
          <span className={styles.descendKanji} lang="ja" aria-hidden="true">
            降りる
          </span>
        </a>
      </div>
    </header>
  );
}
