"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMotionSafe } from "./useMotionSafe";
import styles from "./GojoExperience.module.css";

/**
 * P04 · ÜÇ ŞERİT VE BİRLEŞİM — etkileşim adası.
 *
 * ⚠️ BU ADA HİÇBİR METİN TAŞIMIYOR. Şeritlerin içeriği sunucuda çiziliyor
 * ve buraya `ReactNode` olarak geçiyor; ada yalnızca sarmalayıcıları ve üç
 * CSS değerini (`--pull`, `--field`, `--tremor`) yönetiyor. Yani bu dosya
 * tamamen silinse şeritler yerinde ve tam okunur kalır — brief'in
 * reduced-motion şartı bu yüzden özel bir dal değil, varsayılan durum.
 *
 * ── ÜÇ YOL, HEPSİ ZORUNLU ────────────────────────────────────────────────
 *  · SIRA (fare)  — önce 蒼, sonra 赫 üzerine gelmek göstergeyi doldurur.
 *                   Dokunmatikte hover diye bir şey olmadığı için bu yol
 *                   orada kapalı (brief: "charge meter yolu dokunmatikte
 *                   yok").
 *  · SÜRÜKLEME    — iki küreyi yaklaştırmak. Pointer Events kullanıldığı
 *                   için fare ve parmak AYNI kod yolundan geçiyor; ayrı
 *                   bir dokunmatik dalı yok, yani sonradan eklenmiş
 *                   olamaz.
 *  · KLAVYE       — küreler gerçek `<button>`; ok tuşları yaklaştırıyor.
 *                   Etkileşimin klavyeyle keşfedilebilir olması şart.
 *
 * ── TAP DAVRANIŞI ────────────────────────────────────────────────────────
 * Dokunmatikte şeride dokunmak çekim/itmeyi açıyor, tekrar dokunmak
 * kapatıyor (brief). Aynı düğme faredeyse hover ile zaten çalışıyor;
 * tıklama yine de kabul ediliyor ki tutarlı olsun.
 */

type Pole = "blue" | "red";

/** Küreler bu mesafenin altına inince çarpışma tetikleniyor (yüzde). */
const MERGE_DISTANCE = 9;

/** Her doğru sıra adımı göstergeyi bu kadar dolduruyor. */
const CHARGE_STEP = 0.34;

/** Işının süresi — CSS'teki animasyonla aynı (tek geçiş). */
const BEAM_MS = 700;

/** Ok tuşuyla bir adım (yüzde). */
const KEY_STEP = 4;

export function TechniqueBands({
  blue,
  red,
  purple,
  labels,
}: {
  blue: ReactNode;
  red: ReactNode;
  purple: ReactNode;
  labels: {
    charge: string;
    chargeHint: string;
    dragHint: string;
    keyHint: string;
    fired: string;
    reset: string;
    spherePull: string;
    spherePush: string;
  };
}) {
  const { reducedMotion, coarsePointer } = useMotionSafe();

  const [active, setActive] = useState<Pole | null>(null);
  const [charge, setCharge] = useState(0);
  const [fired, setFired] = useState(false);
  const [beam, setBeam] = useState(false);
  const [pos, setPos] = useState({ blue: 22, red: 78 });

  /* Sıra takibi: yalnızca 蒼 → 赫 geçişi sayılıyor. */
  const lastPole = useRef<Pole | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const beamTimer = useRef(0);

  const fire = useCallback(() => {
    /* ⚠️ FLAŞ LİMİTİ. Işın çalışırken ikinci bir ışın başlatılmıyor:
       tek geçiş, üst üste binme yok (hareket sözleşmesi kural 2). */
    if (beam) return;
    setFired(true);
    setCharge(1);
    if (reducedMotion) return;
    setBeam(true);
    window.clearTimeout(beamTimer.current);
    beamTimer.current = window.setTimeout(() => setBeam(false), BEAM_MS);
  }, [beam, reducedMotion]);

  const engagePole = useCallback(
    (pole: Pole) => {
      setActive(pole);
      /* Sıra yolu yalnızca ince işaretçide (brief). */
      if (coarsePointer || fired) {
        lastPole.current = pole;
        return;
      }
      if (pole === "red" && lastPole.current === "blue") {
        setCharge((c) => {
          const next = Math.min(1, c + CHARGE_STEP);
          if (next >= 1) fire();
          return next;
        });
      }
      lastPole.current = pole;
    },
    [coarsePointer, fired, fire],
  );

  /* Dokunmatikte tıklama açıp kapatıyor; farede hover zaten yönetiyor. */
  const togglePole = useCallback(
    (pole: Pole) => {
      setActive((current) => (current === pole ? null : pole));
      if (!coarsePointer) engagePole(pole);
    },
    [coarsePointer, engagePole],
  );

  /* ── Konum yazarları ─────────────────────────────────────────────────
     ⚠️ İKİSİ DE FONKSİYONEL GÜNCELLEYİCİ KULLANIYOR. İlk sürüm `pos`u
     closure'dan okuyordu ve ard arda gelen ok tuşları AYNI değeri görüp
     tek adım ilerletiyordu (ölçüldü: 20 basış = 1 adım). Ayrıca çarpışma
     kontrolü güncelleyicinin İÇİNDE yapılıyordu; React güncelleyiciyi iki
     kez çağırabildiği için orası yan etki yeri değil. Kontrol artık
     `pos`u izleyen bir effect'te. */
  const movePole = useCallback((pole: Pole, percent: number) => {
    setPos((prev) => ({
      ...prev,
      [pole]: Math.max(4, Math.min(96, percent)),
    }));
  }, []);

  const nudgePole = useCallback((pole: Pole, delta: number) => {
    setPos((prev) => ({
      ...prev,
      [pole]: Math.max(4, Math.min(96, prev[pole] + delta)),
    }));
  }, []);

  /* ── Çarpışma tespiti ────────────────────────────────────────────────
     `mergedRef` bir MANDAL: küreler bir kez birleştiğinde, tekrar
     ayrılmadan ikinci bir ışın tetiklenemiyor. Flaş limitinin (saniyede
     en fazla 3 parlaklık geçişi) garantisi bu — kullanıcı küreyi üst üste
     oynatarak ışını hızlandıramıyor. */
  const mergedRef = useRef(false);

  useEffect(() => {
    const apart = Math.abs(pos.blue - pos.red);
    if (apart <= MERGE_DISTANCE) {
      if (!mergedRef.current) {
        mergedRef.current = true;
        fire();
      }
    } else {
      mergedRef.current = false;
    }
  }, [pos, fire]);

  const onSpherePointerDown = useCallback(
    (pole: Pole) => (event: React.PointerEvent<HTMLButtonElement>) => {
      const track = trackRef.current;
      if (!track) return;
      event.currentTarget.setPointerCapture(event.pointerId);

      const onMove = (moveEvent: PointerEvent) => {
        const box = track.getBoundingClientRect();
        if (box.width === 0) return;
        movePole(pole, ((moveEvent.clientX - box.left) / box.width) * 100);
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [movePole],
  );

  const onSphereKeyDown = useCallback(
    (pole: Pole) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
      const delta =
        event.key === "ArrowLeft"
          ? -KEY_STEP
          : event.key === "ArrowRight"
            ? KEY_STEP
            : 0;
      if (delta === 0) return;
      event.preventDefault();
      nudgePole(pole, delta);
    },
    [nudgePole],
  );

  const reset = useCallback(() => {
    window.clearTimeout(beamTimer.current);
    setBeam(false);
    setFired(false);
    setCharge(0);
    setPos({ blue: 22, red: 78 });
    lastPole.current = null;
    mergedRef.current = false;
  }, []);

  const near = Math.abs(pos.blue - pos.red) <= MERGE_DISTANCE ? "1" : "0";

  /* Şeridin çekim/itme değerleri. Dinlenmede hepsi nötr, yani
     `data-active` hiç gelmese kompozisyon aynı. */
  const bandVars = (pole: Pole) => {
    if (reducedMotion || active !== pole) return undefined;
    return pole === "blue"
      ? ({ "--pull": 0.965, "--field": 0.86 } as React.CSSProperties)
      : ({
          "--pull": 1.035,
          "--field": 1.18,
          "--tremor": "0.012em",
        } as React.CSSProperties);
  };

  const renderBand = (pole: Pole, content: ReactNode) => (
    <li
      className={styles.band}
      data-pole={pole}
      data-active={active === pole ? "on" : undefined}
      style={bandVars(pole)}
      onPointerEnter={
        coarsePointer ? undefined : () => engagePole(pole)
      }
      onPointerLeave={coarsePointer ? undefined : () => setActive(null)}
      onClick={() => togglePole(pole)}
    >
      <span className={styles.bandField} aria-hidden="true" />
      {content}
    </li>
  );

  return (
    <>
      <ul className={styles.bands}>
        {renderBand("blue", blue)}
        {renderBand("red", red)}
        <li className={styles.band} data-pole="purple">
          <span className={styles.bandField} aria-hidden="true" />
          {purple}
        </li>
      </ul>

      {/* Birleşim — reduced-motion'da HİÇ çizilmiyor.
          Kayıp yok: mor şeridin anlatısı zaten yukarıda tam duruyor,
          burası yalnızca onun oynanabilir hâli. */}
      {reducedMotion ? null : (
        <div className={styles.fusion}>
          <p className={styles.fusionHead}>
            <span>{labels.charge}</span>
            <span className={styles.fusionMeter} aria-hidden="true">
              <span
                className={styles.fusionMeterFill}
                style={{ "--charge": charge } as React.CSSProperties}
              />
            </span>
          </p>

          <div className={styles.fusionTrack} ref={trackRef}>
            <button
              type="button"
              className={styles.fusionSphere}
              data-pole="blue"
              data-near={near}
              style={{ "--x": pos.blue } as React.CSSProperties}
              aria-label={labels.spherePull}
              onPointerDown={onSpherePointerDown("blue")}
              onKeyDown={onSphereKeyDown("blue")}
            >
              蒼
            </button>
            <button
              type="button"
              className={styles.fusionSphere}
              data-pole="red"
              data-near={near}
              style={{ "--x": pos.red } as React.CSSProperties}
              aria-label={labels.spherePush}
              onPointerDown={onSpherePointerDown("red")}
              onKeyDown={onSphereKeyDown("red")}
            >
              赫
            </button>
          </div>

          {/* Durum satırı `role="status"`: çarpışma gerçekleştiğinde ekran
              okuyucu da haberdar oluyor — efekt yalnızca görsel kalmıyor. */}
          <p className={styles.fusionStatus} role="status">
            {fired ? labels.fired : ""}
          </p>

          <p className={styles.fusionHint}>
            {coarsePointer ? labels.dragHint : labels.chargeHint}
            <br />
            {labels.keyHint}
          </p>

          {fired ? (
            <button type="button" className={styles.fusionReset} onClick={reset}>
              {labels.reset}
            </button>
          ) : null}
        </div>
      )}

      {beam ? <span className={styles.beam} aria-hidden="true" /> : null}
    </>
  );
}
