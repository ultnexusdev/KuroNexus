import { apiUrl } from "@/lib/api/client";
import type { ClubIdentity } from "@/lib/api/football-live";
import shell from "@/app/[locale]/spor/layout.module.css";
import styles from "./StadiumExperience.module.css";

/**
 * RAMS Park — "sinematik stadyum deneyimi".
 *
 * ── NEDEN GALERİ DEĞİL ───────────────────────────────────────────────────
 * Brief bu bölümün "sayfanın ortasında normal galeri gibi durmamasını"
 * istiyor. Uygulanan yapı: her fotoğraf kendi tam-genişlik panelinde ve
 * paneller YAPIŞKAN — kaydırdıkça bir sonraki fotoğraf bir öncekinin ÜSTÜNE
 * kayıyor. Kart ızgarası değil, sahne değişimi.
 *
 * Bu desen tamamen CSS `position: sticky` ile çalışıyor; JavaScript, scroll
 * kütüphanesi ya da `animation-timeline` desteği GEREKTİRMİYOR. Destek
 * yoksa (ya da hareket azaltılmışsa) paneller sıradan bir dikey dizi olarak
 * görünüyor — yani en kötü hâli hâlâ düzgün bir sayfa.
 *
 * ── KAÇ FOTOĞRAF ─────────────────────────────────────────────────────────
 * Kaç tane varsa o kadar; TheSportsDB dört kare veriyor (ölçüldü). Hiç yoksa
 * bölüm çizilmiyor — brief 360° panorama ve tribün planından da söz ediyor
 * ama o veri elimizde YOK ve "veri yoksa sahte bilgi üretme" maddesi bu
 * bölüm için de geçerli. Tribün haritası, veri geldiğinde eklenecek bir yer
 * bırakıyor: panel yapısı zaten n adet sahneyi kaldırıyor.
 */
export function StadiumExperience({
  club,
  labels,
}: {
  club: ClubIdentity;
  labels: StadiumLabels;
}) {
  const scenes = club.fanart.length > 0 ? club.fanart : club.banner ? [club.banner] : [];
  if (scenes.length === 0) return null;

  const facts = [
    club.stadium ? { label: labels.stadium, value: club.stadium } : null,
    club.stadiumCapacity
      ? {
          label: labels.capacity,
          value: labels.formatNumber(club.stadiumCapacity),
        }
      : null,
    club.foundedYear
      ? { label: labels.founded, value: String(club.foundedYear) }
      : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  return (
    <section className={styles.experience} aria-label={labels.title}>
      <header className={styles.intro}>
        <p className={shell.eyebrow}>{labels.eyebrow}</p>
        <h2 className={`${shell.display} ${shell.title} ${styles.title}`}>
          {club.stadium ?? labels.title}
        </h2>
        {facts.length > 0 ? (
          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt className={shell.eyebrow}>{fact.label}</dt>
                <dd className={`${shell.figure} ${styles.factValue}`}>
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </header>

      <div className={styles.stage}>
        {scenes.map((scene, index) => (
          <div key={scene} className={styles.scene} data-index={index}>
            <div className={styles.frame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={apiUrl(scene)}
                alt={`${club.stadium ?? club.name} — ${index + 1}`}
                className={styles.photo}
                loading="lazy"
                decoding="async"
              />
              <span className={styles.grade} aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export interface StadiumLabels {
  eyebrow: string;
  title: string;
  stadium: string;
  capacity: string;
  founded: string;
  formatNumber: (value: number) => string;
}
