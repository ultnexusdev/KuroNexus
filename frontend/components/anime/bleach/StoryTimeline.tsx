import { getTranslations } from "next-intl/server";
import { STORY_ARCS } from "@/lib/anime/bleach/timeline";
import { pick } from "@/lib/anime/bleach/types";
import { bladePath } from "./BladeSilhouette";
import styles from "./StoryTimeline.module.css";
import world from "./world.module.css";

/**
 * P16 · HİKÂYE ÇİZELGESİ — sayfanın kapanışı.
 *
 * ── TEZ ──────────────────────────────────────────────────────────────────
 * Klasik bir arc zaman çizelgesi DEĞİL. Hikâye **Ichigo'nun kılıcının
 * değişimi** üzerinden anlatılıyor; zaman çizelgesi ile karakter gelişimi
 * tek tasarımda birleşiyor.
 *
 * ── ⚠️ KILIÇ GERÇEKTEN MORPH EDİYOR ──────────────────────────────────────
 * Ekranın ortasında **tek bir** path duruyor ve `d` özelliği kaydırmaya
 * bağlı bir animasyonla beş biçim arasında geçiyor. Beş biçimi ayrı ayrı
 * çizmek bunu imkânsız kılardı: iki path ancak **aynı komut dizisine**
 * sahipse birbirine dönüşür.
 *
 * Bu yüzden yeni bir kılıç grameri yazılmadı — `BladeSilhouette`'in (P04)
 * `bladePath()` şablonu aynen kullanıldı. O dosya tam olarak bunun için
 * var: dokuz düğüm, altı sayıyla ayrışan biçimler.
 *
 * ⚠️ Path'ler ve renkler `@keyframes`e SATIR İÇİ DEĞİŞKENLE giriyor
 * (`--blade-0…4`, `--arc-0…4`). Sebep kural 16: arc rengi bir tema
 * token'ı değil VERİ, ve veri CSS dosyasına yazılmaz. Keyframes
 * `var()` okuyabildiği için ikisi bir arada mümkün oldu.
 *
 * ── SIFIR JS ─────────────────────────────────────────────────────────────
 * Morph `animation-timeline: view()`; zemin değişimi nitelik + kalıtım;
 * arc'lar arası geçiş başlıktaki beş çapa. Tek satır istemci kodu yok.
 *
 * Desteklemeyen tarayıcıda animasyon koşmuyor ve kılıç `d` niteliğindeki
 * biçiminde (birinci arc) duruyor; beş arc'ın metni ve zemini yine
 * yerinde. Brief'in `reduced-motion` yedeği de zaten "beş sabit görsel
 * ve tıklayarak arc değiştirme" — çapalar bunu her kipte veriyor.
 *
 * ── ⚠️ SON EKRAN DOLDURULMADI ────────────────────────────────────────────
 * Brief: "Motto ekranı en az 60vh boşluk taşır. Doldurmaya çalışma."
 * Kılıç kaybolduktan sonra ekranda iki satırdan başka hiçbir şey yok.
 *
 * ── ⚠️ KILIÇ AYLARDIR GÖRÜNMÜYORDU (29 Ağustos 2026) ─────────────────────
 * Bölümün bütün mekaniği çalışıyordu — path gerçekten morph ediyor, zemin
 * gerçekten dönüyordu — ama ziyaretçi kılıcı HİÇ görmüyordu: `.arc` kendi
 * zeminini tam genişlikte boyamak için negatif taşmayla kılıç sütununun
 * üstüne çıkıyor ve DOM'da sonra geldiği için opak zeminini kılıcın üzerine
 * basıyordu (ikisinin de `z-index`i `auto`ydu).
 *
 * Geriye yalnızca arc'lar arasındaki devasa boşluklar kalıyordu ve bunlar
 * bir tasarım hatası gibi okunuyordu — ki kılıç olmadan öyleydiler.
 *
 * Düzeltme tek satır (`bladeCol { z-index: 2 }`); ama bölüm o boşlukları
 * artık dolduruyor da: spot ışığı, vignette, dikey kılavuz çizgi, süzülen
 * toz ve kılıcın her arc'a **varışında** attığı nabız. Beşi de saf CSS,
 * hiçbiri HTML'e ya da morph mantığına dokunmuyor.
 */
export async function StoryTimeline({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.timeline" });

  /* Beş biçim ve beş renk, keyframes'in okuyacağı biçimde. */
  const morphVars = Object.fromEntries(
    STORY_ARCS.flatMap((arc, i) => [
      [`--blade-${i}`, `path("${bladePath(arc.form)}")`],
      [`--arc-${i}`, arc.color],
    ]),
  ) as React.CSSProperties;

  return (
    <section id="story" className={styles.section} aria-labelledby="story-title">
      <div className={styles.head}>
        <p className={world.eyebrow} lang="en">
          {t("eyebrow")}
        </p>
        <h2 id="story-title" className={world.section}>
          {t("title")}
        </h2>
        <p className={`${world.body} ${styles.lede}`}>{t("lede")}</p>

        {/* Beş arc'a düz sayfa içi çapalar: hareket kısıtlı kipte de,
            JS gelmese de arc değiştirmenin yolu bu. */}
        <nav className={styles.index} aria-label={t("indexAria")}>
          <ol className={styles.indexList}>
            {STORY_ARCS.map((arc) => (
              <li key={arc.id}>
                <a className={styles.indexLink} href={`#arc-${arc.id}`} lang="en">
                  {arc.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className={styles.stage}>
        {/* ── KILIÇ ────────────────────────────────────────────────────
            Tek path, ekranın ortasında, kaydırmayla biçim değiştiriyor. */}
        <div className={styles.bladeCol} aria-hidden="true">
          <div className={styles.bladeBox}>
            <svg
              className={styles.blade}
              viewBox="0 0 100 200"
              preserveAspectRatio="xMidYMid meet"
              style={morphVars}
            >
              <path
                className={styles.bladePath}
                /* Animasyon koşmazsa görünen biçim: ilk arc. */
                d={bladePath(STORY_ARCS[0].form)}
              />
            </svg>
          </div>
        </div>

        {/* ⚠️ Düz bir `<ol>`: beş sıralı arc. Kılıcın bütün hikâyesi
            CSS'te, okuma sırası burada. */}
        <ol className={styles.arcs} aria-label={t("arcsAria")}>
          {STORY_ARCS.map((arc, i) => (
            <li
              key={arc.id}
              id={`arc-${arc.id}`}
              className={styles.arc}
              data-layer={arc.layer}
              style={{ "--arc": arc.color } as React.CSSProperties}
            >
              <div className={styles.arcInner}>
                <p className={`${world.numeral} ${styles.arcIndex}`}>{i + 1}</p>
                <h3 className={styles.arcName} lang="en">
                  {arc.name}
                </h3>
                <p className={`${world.meta} ${styles.arcBlade}`}>
                  {arc.bladeNote
                    ? `${arc.blade} · ${pick(arc.bladeNote, locale)}`
                    : arc.blade}
                </p>
                <p className={`${world.body} ${styles.arcText}`}>
                  {pick(arc.text, locale)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* ── MOTTO ────────────────────────────────────────────────────────
          Kılıç kayboldu. Ekranda başka hiçbir şey yok ve olmayacak. */}
      <div className={styles.motto}>
        <p className={styles.mottoLine} lang="en">
          Every soul leaves a shadow.
        </p>
        <p className={styles.mottoLine} lang="en">
          Every blade has a name.
        </p>
      </div>
    </section>
  );
}
