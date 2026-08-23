import type { LayerId } from "./WorldSection";
import styles from "./Senkaimon.module.css";
import world from "./world.module.css";

/** Geçidin adı — hangi iki dünya arasında durduğuna göre değişiyor */
export type GateKind = "senkaimon" | "garganta" | "schatten";

/**
 * SENKAİMON — iki katman arasındaki geçiş sahnesi.
 *
 * Bleach'te "bölge → bölge" geçişi yok; "katman → katman" iniş var ve her
 * geçiş bir KAPI/YARIK olayı, bir kaydırma değil. Bu bileşen o olayı
 * taşıyor: ekranın ortasında dikey bir yarık açılıyor ve içinden bir
 * sonraki dünyanın rengi sızıyor.
 *
 * ── SIFIR JS ─────────────────────────────────────────────────────────────
 * Geçiş tamamen CSS. Destekleyen tarayıcıda yarık kaydırmaya bağlı açılıyor
 * (`animation-timeline: view()` — aynı desen Akatsuki sergisinde de var ve
 * orada ölçülmüştü). Desteklemeyende yarık AÇIK hâliyle duruyor: sahne
 * yine anlamlı, yalnızca hareketsiz. Hiçbir dalda JavaScript yok.
 *
 * ── RENK NEREDEN GELİYOR ─────────────────────────────────────────────────
 * Geçit, GİDİLEN katmanın `data-layer` niteliğini taşıyor. Yani yarıktan
 * sızan renk "bir sonraki dünyanın rengi" olarak elle yazılmıyor — o
 * dünyanın kendi token'ı. İkinci bir renk haritası tutulmuyor (kural 16).
 */
export function Senkaimon({
  to,
  kind = "senkaimon",
  label,
}: {
  /** Yarıktan rengi sızan katman */
  to: LayerId;
  /**
   * Geçidin adı. Canon'a sadık: Soul Society'ye Senkaimon, Hueco
   * Mundo'ya Garganta, Wandenreich'e Schatten Bereich ile geçilir.
   */
  kind?: GateKind;
  /** Jost caps ile yarığın yanında duran tek satır — çevrilmez, özel ad */
  label?: string;
}) {
  return (
    <div
      className={styles.gate}
      data-layer={to}
      data-kind={kind}
      /* Saf dekor: ekran okuyucu iki katman arasında boş bir durak
         duymamalı. Anlatıyı katmanların kendisi taşıyor. */
      aria-hidden="true"
    >
      <span className={styles.rift}>
        <span className={styles.bleed} />
      </span>
      {label ? (
        <span className={`${world.meta} ${styles.label}`}>{label}</span>
      ) : null}
    </div>
  );
}
