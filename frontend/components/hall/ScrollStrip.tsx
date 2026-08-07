"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import styles from "./ScrollStrip.module.css";

/**
 * Yatay şeritlere fareyle kaydırma yolu ekleyen kabuk (film + dizi salonundaki
 * "Son İzlenenler" şeridi).
 *
 * ── NEDEN VAR ─────────────────────────────────────────────────────────────
 * Şeritler `overflow-x: auto` ama kaydırma çubuğu bilerek gizli
 * (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`) — çubuk
 * 35 mm perforasyon illüzyonunu bozuyordu. Bedeli şuydu: masaüstünde fareyle
 * kaydırmanın HİÇBİR yolu kalmamıştı. Dikey tekerlek yatay bir kutuyu
 * kaydırmaz; çubuk yok, sürükleme yok, düğme yok. Geriye yalnızca
 * shift+tekerlek ve odaklandıktan sonra ok tuşları kalıyordu; ikisi de
 * kullanıcının kendiliğinden bulamayacağı yollar. Kenar solması "devamı var"
 * diyordu ama devamına GİTMENİN yolunu vermiyordu.
 *
 * Bu bileşen eksik olan iki yolu ekliyor: ok düğmeleri ve sürükleyerek
 * kaydırma. Üçüncü bir yol olarak dikey tekerleği devralmak DENENDİ ve geri
 * alındı — gerekçesi aşağıda, sürükleme bloğunun hemen üstünde.
 *
 * ── NEDEN RENDER PROP ─────────────────────────────────────────────────────
 * Kaydırılan kutu şeridin kendisi (`ul.stripTrack`) ve sınıfları film/dizi
 * salonlarının kendi CSS modüllerinden geliyor — buraya taşınamaz. Bileşenin
 * yine de o kutuya erişmesi gerekiyor. Kolay iki yol da kötü: `cloneElement`
 * çocuğun türü hakkında sessizce varsayım yapar, kapsayıcıda `querySelector`
 * ise işaretleme değişince derleme hatası vermeden bozulur ve hata ancak
 * canlıda ortaya çıkar. Onun yerine çağıran, ref'i nereye bağlayacağını
 * açıkça yazıyor: sözleşme görünür ve tip denetiminden geçiyor.
 */

/** Sürüklemenin "tıklama" sayılmaktan çıktığı eşik (px) */
const DRAG_THRESHOLD = 4;
/** Ok düğmesinin bir adımda kaydırdığı oran — görünür genişliğin bu kadarı */
const STEP_RATIO = 0.9;

export function ScrollStrip({
  className,
  prevLabel,
  nextLabel,
  children,
}: {
  /** Kabuğa eklenecek dış sınıf — salonun kendi `.strip` kutusu buraya geçer */
  className?: string;
  /** Sol ok düğmesinin erişilebilir adı (çevrilmiş) */
  prevLabel: string;
  /** Sağ ok düğmesinin erişilebilir adı (çevrilmiş) */
  nextLabel: string;
  /** Kaydırılacak kutuyu çağıran üretir ve ref'i ona bağlar */
  children: (trackRef: (node: HTMLElement | null) => void) => ReactNode;
}) {
  const [track, setTrack] = useState<HTMLElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  // İçerik sığıyorsa şerit hiç kaydırılamaz: ne ok görünür, ne sürükleme imleci
  const [scrollable, setScrollable] = useState(false);

  /* Ref değil state: dinleyicilerin düğüm DOM'a bağlandığı ANDA kurulması
     gerekiyor. `useRef` bağlanmayı haber vermez; `[]` bağımlılıklı bir efekt
     de şerit yeniden kurulursa (küratör modu açılıp kapanırken oluyor) eski,
     artık DOM'da olmayan düğüme bağlı kalırdı. State ile dinleyiciler düğümle
     birlikte kurulup sökülüyor. */
  const trackRef = useCallback((node: HTMLElement | null) => {
    setTrack(node);
  }, []);

  const measure = useCallback(() => {
    if (!track) {
      return;
    }
    const max = track.scrollWidth - track.clientWidth;
    /* 1px tolerans: tarayıcılar kesirli `scrollLeft` döndürür (zoom, yüksek
       DPI, kesirli kare genişlikleri). Toleranssız karşılaştırmada uca
       dayanmış bir şerit hâlâ "kaydırılabilir" görünür, ok da tıklandığında
       hiçbir şey yapmayan ölü bir düğmeye dönerdi. */
    setScrollable(max > 1);
    setCanPrev(track.scrollLeft > 1);
    setCanNext(track.scrollLeft < max - 1);
  }, [track]);

  /* Ok durumlarını canlı tutan ölçüm.
     İlk hesap mount'ta da yapılıyor: yapılmazsa oklar ilk karede yanlış
     durumda (ikisi de pasif) görünür ve kullanıcı şeridi bir kez kaydırana
     kadar öyle kalırlar. `resize`in yanında ResizeObserver da var — şeridin
     genişliği pencere boyutu hiç değişmeden de değişebiliyor (salon sütunu,
     yan dekor, yazı tipi yüklenmesi). */
  useEffect(() => {
    if (!track) {
      return;
    }
    const el = track;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [track, measure]);

  /* ── TEKERLEK DİNLEYİCİSİ BİLEREK YOK ──────────────────────────────────
     İlk yazımda dikey tekerlek yatay kaydırmaya çevriliyordu. Ölçünce
     bedeli çıktı: şerit sayfa genişliğinde ve sayfanın ortasında duruyor,
     yani imleç çok kolay üstüne geliyor. `preventDefault()` çağrıldığı an
     SAYFA duruyor ve tekerlek yalnızca şeridi çeviriyordu — kullanıcı
     sayfayı aşağı sürdürmek için önce 21 karenin tamamını sonuna kadar
     çevirmek zorunda kalıyordu. Yalnızca uçlarda olayı bırakmak bunu
     çözmüyor, sadece tuzağın süresini kısaltıyor.

     Kaldırınca hiçbir yetenek kaybolmuyor: yatay trackpad jestini ve
     shift+tekerleği tarayıcı `overflow-x: auto` kutularda ZATEN kendisi
     yürütüyor. Düzeltilmek istenen asıl eksik — "düz fareyle kaydırmanın
     hiçbir yolu yok" — aşağıdaki ok düğmeleri ve sürüklemeyle kapanıyor.
     Sayfanın kaydırmasını devralmak, çözdüğünden büyük bir sorun açardı. */

  /* Sürükleyerek kaydırma (fare/kalem).
     Dokunmatik bilerek DIŞARIDA: orada tarayıcının kendi kaydırması momentum
     ve lastik ucu davranışıyla geliyor, taklidi daha kötüsünü verir. Bu yüzden
     `touch-action`a hiç dokunulmuyor ve dokunma olayları devralınmıyor. */
  useEffect(() => {
    if (!track) {
      return;
    }
    const el = track;

    let activePointer: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let dragging = false;

    function onPointerDown(event: PointerEvent) {
      if (event.pointerType === "touch" || event.button !== 0) {
        return;
      }
      activePointer = event.pointerId;
      startX = event.clientX;
      startScroll = el.scrollLeft;
      dragging = false;
      el.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerId !== activePointer) {
        return;
      }
      const dx = event.clientX - startX;
      if (!dragging) {
        // Eşiğin altındaki titreme sürükleme değil, tıklamanın kendisidir
        if (Math.abs(dx) <= DRAG_THRESHOLD) {
          return;
        }
        dragging = true;
        el.classList.add(styles.dragging);
      }
      /* `scrollTo(..., "instant")`: düz `scrollLeft` ataması da CSS'teki
         `scroll-behavior: smooth`u miras alır, şerit parmağın arkasından
         sürünür ve jest kopar. */
      el.scrollTo({ left: startScroll - dx, behavior: "instant" });
    }

    function endDrag(event: PointerEvent) {
      if (event.pointerId !== activePointer) {
        return;
      }
      activePointer = null;
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
      if (!dragging) {
        return;
      }
      dragging = false;
      el.classList.remove(styles.dragging);
      /* Sürükleme bitince tarayıcı yine de bir `click` üretir; bastırmazsak
         her sürükleme kullanıcıyı bir filmin sayfasına atar. Yakalama fazında
         ve tek seferlik: React dinleyicileri kök kapsayıcıda, yani şeridin
         ÜSTÜNDE duruyor — yakalama fazında burada durdurulan olay ne hedefe
         iner ne köke geri çıkar, dolayısıyla `Link`in işleyicisi de çalışmaz. */
      const swallowClick = (click: MouseEvent) => {
        click.preventDefault();
        click.stopPropagation();
      };
      el.addEventListener("click", swallowClick, {
        capture: true,
        once: true,
      });
      /* Bırakma bir `click` üretmediyse (işaretçi şeridin dışında bırakıldı)
         dinleyici asılı kalmasın; kalırsa kullanıcının SONRAKİ gerçek
         tıklamasını yer. */
      window.setTimeout(() => {
        el.removeEventListener("click", swallowClick, true);
      }, 0);
    }

    /* Posterler `<img>`: tarayıcının yerleşik görsel sürükleme jesti işaretçi
       yakalamasını iptal edip kaydırmayı yarıda keserdi. Bir kaydırma
       kutusunun içinde görsel sürüklemenin zaten bir karşılığı yok. */
    function onDragStart(event: Event) {
      event.preventDefault();
    }

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("dragstart", onDragStart);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("dragstart", onDragStart);
      el.classList.remove(styles.dragging);
    };
  }, [track]);

  const step = useCallback(
    (direction: 1 | -1) => {
      if (!track) {
        return;
      }
      /* Bir adım ≈ bir görünür genişlik. Tam genişlik yerine %90: kenarda bir
         kare payı bırakmak kullanıcıya nerede kaldığını gösterir, tam sayfa
         atlayışta şerit ışınlanmış gibi durur. */
      const amount = track.clientWidth * STEP_RATIO * direction;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      /* "auto" şeridin kendi `scroll-behavior`ını kullanır; azaltılmış hareket
         kuralı orada zaten `auto`ya (anında) düşürülüyor. */
      track.scrollBy({ left: amount, behavior: reduced ? "auto" : "smooth" });
    },
    [track],
  );

  const shellClass = [
    styles.shell,
    scrollable ? styles.shellScrollable : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClass}>
      {children(trackRef)}

      {/* Sığan bir şeritte ok hiç basılmıyor */}
      {scrollable ? (
        <>
          {/* NEDEN `tabIndex={-1}`: bu oklar bir FARE eksiğini kapatıyor —
              düzeltilen hata "fareyle kaydırılamıyor"du. Klavye kullanıcısının
              elinde zaten daha iyisi var: şeridin kendisi `tabIndex={0}` ve
              ok/Home/End tuşlarıyla sürekli kaydırıyor. Okları sekme sırasına
              da koymak aynı işlevi ikinci kez, üstelik şeridin içindeki
              onlarca bağlantının ARDINDAN eklerdi: pratikte ulaşılamaz iki
              durak. Yine de gerçek `<button>` ve `aria-label` taşıyorlar —
              ekran okuyucu gezinmesi ve sesle kontrol ("sonrakine tıkla")
              erişilebilir isim olmadan bu düğmeleri hiç bulamaz. */}
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            onClick={() => step(-1)}
            disabled={!canPrev}
            tabIndex={-1}
            aria-label={prevLabel}
          >
            <span aria-hidden>‹</span>
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => step(1)}
            disabled={!canNext}
            tabIndex={-1}
            aria-label={nextLabel}
          >
            <span aria-hidden>›</span>
          </button>
        </>
      ) : null}
    </div>
  );
}
