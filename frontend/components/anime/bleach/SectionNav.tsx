import { getTranslations } from "next-intl/server";
import { BLEACH_ANCHORS } from "@/lib/anime/bleach/anchors";
import styles from "./SectionNav.module.css";

/**
 * "BÖLÜMLERE ATLA" — P18-b.
 *
 * ── NEDEN GEREKLİ ────────────────────────────────────────────────────────
 * Sayfa on altı bölümlük tek bir dikey iniş ve içinde ~115 düğme var
 * (on üç kapı, yirmi altı Sternritter mührü, on Espada nişi…). Klavyeyle
 * gezen biri "Mekânlar"a ulaşmak için bunların hepsini geçmek zorundaydı.
 * Bu liste o zinciri kesiyor: tek sekmeyle herhangi bir bölüme.
 *
 * ── SİTE GENELİNDEKİ ATLAMA BAĞLANTISIYLA İLİŞKİSİ ───────────────────────
 * Kök düzende zaten bir "Ana içeriğe atla" var (`globals.css .skipLink`) ve
 * o `#icerik`e, yani bu sayfayı saran `<main>`e gidiyor. İkisi çakışmıyor,
 * sıralanıyor: önce içeriğe atla, sonra içerik İÇİNDE bölüme atla. Bu
 * liste `<main>`in ilk çocuğu, yani genel atlamayı kullanan biri buraya
 * düşüyor.
 *
 * ── NEDEN GÖRÜNMEZ AMA VAR ───────────────────────────────────────────────
 * Fare kullanıcısının bunu görmesi gerekmiyor — onun için derinlik rayı
 * (`DepthRail`) zaten sayfanın kenarında duruyor. Liste yalnızca **içinden
 * bir bağlantı odaklandığında** açılıyor (`:focus-within`), yani ekranda
 * ancak klavye kullanan birinin önünde beliriyor.
 *
 * ⚠️ `.srOnly` yardımcısı BURADA KULLANILAMAZDI: `clip-path: inset(50%)`
 * kırpması çocuklara da işliyor, odaklanan bağlantı görünmez kalırdı.
 * Kırpma kapsayıcıda duruyor ve `:focus-within` ile kalkıyor.
 *
 * ── EKRAN OKUYUCU ────────────────────────────────────────────────────────
 * `<nav>` + `aria-label` = adlandırılmış bir gezinme sınırı; ekran okuyucu
 * sınır listesinde "Bölümlere atla" diye görünüyor ve oraya doğrudan
 * atlanabiliyor. Sıralı liste (`<ol>`) çünkü sıra ANLAMLI: sayfa yukarıdan
 * aşağı bir iniş ve liste o inişin haritası.
 *
 * ⚠️ Çapaların gerçekten var olduğunu `scripts/check-bleach-anchors.mjs`
 * denetliyor — bir bölümün `id`si değişirse `pnpm check:bleach` kırılıyor.
 */
export async function SectionNav({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "anime.bleach.toc" });

  return (
    <nav className={styles.nav} aria-label={t("aria")}>
      <ol className={styles.list}>
        {BLEACH_ANCHORS.map(({ anchor, key }) => (
          <li key={anchor}>
            <a className={styles.link} href={`#${anchor}`}>
              {t(key)}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
