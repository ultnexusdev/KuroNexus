import type { ReactNode } from "react";
import { SectionEffect } from "./SectionEffect";
import styles from "./GojoExperience.module.css";

/**
 * SATORU GOJŌ · BÖLÜM SARMALAYICISI.
 *
 * On bir bölümün ortak kabuğu. Üç iş yapıyor ve üçü de her bölümde aynı
 * biçimde yapılmak zorunda olduğu için tek yerde toplandı.
 *
 * ── 1 · BAŞLIK SÖZLEŞMESİ ────────────────────────────────────────────────
 * Her bölüm `aria-labelledby` ile kendi başlığına bağlı (ev kuralı) ve
 * sayfada TEK `<h1>` var — o da sayfa başlığı, bölümler `<h2>`.
 *
 * Bazı bölümlerin başlığı görsel olarak yok (P03'ün ızgara kutucuklarına
 * dağılmış tipografisi, P10'un neredeyse tamamen boş ekranı). Orada
 * başlık `sr-only` oluyor ama DOM'dan SİLİNMİYOR: ekran okuyucu için
 * bölüm sınırı ve arama motoru için başlık hiyerarşisi korunuyor.
 * BRIEF'in "bükülmüş tipografinin her zaman okunabilir bir DOM karşılığı
 * olacak" şartının iskelet tarafı bu.
 *
 * ── 2 · STATİK İSKELET ÖNCE ──────────────────────────────────────────────
 * `children` sunucuda çiziliyor ve efekt JS'ine hiç bağlı değil. Bölüm,
 * efekt parçası hiç inmese bile tam okunur.
 *
 * ── 3 · EFEKT SONRA, TEMBEL ──────────────────────────────────────────────
 * `effect` ayrı bir dal ve `SectionEffect` kapısından geçiyor: bölüm
 * viewport'a yaklaşana kadar ne çiziliyor ne indiriliyor.
 *
 * ⚠️ Bu ayrım pazarlık konusu değil. Bir bilgi `effect` dalına konursa
 * reduced-motion kullanıcısında ve JS inmeyen ziyarette KAYBOLUR.
 * Kural: `effect` silindiğinde sayfanın anlamı eksilmemeli.
 */
export function SectionShell({
  id,
  title,
  children,
  effect,
  hiddenTitle,
  className,
}: {
  /** Kararlı kimlik — `aria-labelledby` ve derin bağlantı için */
  id: string;
  /** Bölüm başlığı (sunucuda dile göre seçilmiş) */
  title: string;
  /** Bölümün okunabilir gövdesi — HER ZAMAN çizilir */
  children: ReactNode;
  /** Yalnızca hareket/dekorasyon — görünürlükte tembel yüklenir */
  effect?: ReactNode;
  /** Başlık görsel olarak gizlensin mi (DOM'da kalır) */
  hiddenTitle?: boolean;
  className?: string;
}) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={[styles.section, className].filter(Boolean).join(" ")}
    >
      <h2
        id={titleId}
        className={hiddenTitle ? styles.srOnly : styles.sectionTitle}
      >
        {title}
      </h2>

      <div className={styles.sectionInner}>{children}</div>

      {effect ? <SectionEffect>{effect}</SectionEffect> : null}
    </section>
  );
}
