import Image from "next/image";
import styles from "./LobbyBanner.module.css";

/**
 * Salon girişinin dar ekran banner'ı — dört salon (film, dizi, anime, kitap)
 * bunu paylaşır.
 *
 * Masaüstünde salonun iki yanında tam boy afişler duruyor (her salonun kendi
 * `LobbyPosters`ı), ama 1100px altında o paneller hiç çizilmiyor ve giriş
 * çıplak kalıyordu. Bu bileşen o boşluğa aynı afişleri yatay bir bant olarak
 * koyar.
 *
 * Görsel **adresleri burada çözülmez**: her salonun kaynağı farklı (TMDB
 * göreli yol veriyor, AniList tam adres, kitap salonu yerel bir çizim).
 * Çağıran taraf çözer, buraya hazır adres geçer — ve **masaüstü panelleriyle
 * aynı adresi** geçmesi beklenir, böylece geniş ekranda ikinci bir istek
 * doğmaz (tarayıcı aynı adresi zaten önbellekte tutar).
 */
export function LobbyBanner({
  images,
}: {
  /** Bir ya da iki görsel adresi; boş/eksik olanlar atılır */
  images: Array<string | null | undefined>;
}) {
  const shown = images.filter((src): src is string => Boolean(src));
  // Afiş gelmediyse bant hiç çizilmez: boş bir kutu eşiği güzelleştirmiyor
  if (shown.length === 0) {
    return null;
  }

  return (
    <div className={styles.banner} aria-hidden>
      <div className={styles.frame}>
        {shown.map((src) => (
          <div key={src} className={styles.half}>
            <Image
              src={src}
              alt=""
              fill
              /* Tek görselde bant tam genişlik, ikide yarısı */
              sizes={shown.length === 1 ? "100vw" : "50vw"}
              className={styles.img}
              priority
              unoptimized
            />
          </div>
        ))}
      </div>

      <span className={styles.tint} />
      <span className={styles.glow} />
      <span className={styles.vignette} />
      <span className={styles.grain} />
    </div>
  );
}
