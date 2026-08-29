"use client";

import { useId, useState } from "react";
import Image from "next/image";
import type {
  NarutoElement,
  NarutoEra,
  NarutoEye,
  NarutoNation,
} from "@/lib/anime/naruto";
import { NarutoFigureChip } from "./NarutoFace";
import styles from "./NarutoSelectors.module.css";

/**
 * Naruto Evreni'nin seçicileri — hepsi aynı kalıp: bir RAY (seçenekler) ve
 * bir KÜNYE (seçilenin ayrıntısı).
 *
 * Neden tek dosya: beşi de aynı deseni paylaşıyor ve hiçbiri 60 satırı
 * geçmiyor; ayrı dosyalara bölmek beş `"use client"` sınırı ve beş CSS
 * modülü demekti. Tasarımdaki hover-state'ler (kadro kartları, Akatsuki
 * satırları) buraya HİÇ gelmedi — onlar saf CSS `:hover` ile çözülüyor,
 * JS'e ihtiyaçları yok.
 *
 * Erişilebilirlik sözleşmesi ortak: ray gerçek `<button>`larla kuruluyor
 * (klavyeyle gezilebilir), seçili olan `aria-pressed` taşıyor, künye
 * `aria-live="polite"` — seçim değişince ekran okuyucu yeni kaydı okur.
 */

/** Ray düğmesi — beş seçicinin ortak parçası */
function RailButton({
  active,
  onSelect,
  accent,
  children,
}: {
  active: boolean;
  onSelect: () => void;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={styles.railItem}
      data-active={active ? "" : undefined}
      aria-pressed={active}
      onClick={onSelect}
      style={accent ? ({ "--rec": accent } as React.CSSProperties) : undefined}
    >
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   1 · SHINOBI DÜNYASI — harita + ulus künyesi
   ══════════════════════════════════════════════════════════════════════ */
export function NarutoAtlas({
  nations,
  map,
}: {
  nations: NarutoNation[];
  /**
   * Haritanın KENDİ kadrajı (mutlak adres) — iğnelerin üzerinde durduğu
   * kare. Yoksa iğneler eskisi gibi boş zeminde duruyor ve coğrafya
   * yalnızca birbirlerine göre okunuyor.
   *
   * ⚠️ 29 Ağustos 2026, iki adımlı işin BİRİNCİ adımı. İkinci adım
   * (iğneleri sürükleyerek konumlandırma) henüz yok: koordinatlar hâlâ
   * `NARUTO_NATIONS` içinde elle yazılı. Yani kare değişirse iğnelerin
   * yerini kod düzeltiyor, arayüz değil.
   */
  map?: string | null;
}) {
  const [id, setId] = useState(nations[0]?.id ?? "");
  const sel = nations.find((n) => n.id === id) ?? nations[0];
  const mapLabel = useId();

  if (!sel) return null;

  return (
    <div className={styles.atlas}>
      {/* Harita: dekoratif bir zemin değil, iğneler gerçek seçim düğmeleri.
          Coğrafya YAKLAŞIK — canon bir koordinat sistemi yok, iğneler
          birbirine göre konumlanmış bir şema. */}
      <div className={styles.map} role="group" aria-labelledby={mapLabel}>
        {map ? (
          <span className={styles.mapArt} aria-hidden>
            <Image src={map} alt="" fill sizes="900px" />
          </span>
        ) : null}
        <p id={mapLabel} className={styles.mapLabel}>
          Beş büyük ulus ve gölgede kalan köyler
        </p>
        {nations.map((n) => (
          <button
            key={n.id}
            type="button"
            className={styles.pin}
            data-active={n.id === sel.id ? "" : undefined}
            aria-pressed={n.id === sel.id}
            style={
              {
                left: n.x,
                top: n.y,
                "--rec": n.dot,
              } as React.CSSProperties
            }
            onClick={() => setId(n.id)}
          >
            <span className={styles.pinDot} aria-hidden />
            <span className={styles.pinName}>{n.village}</span>
          </button>
        ))}
      </div>

      <div
        className={styles.dossier}
        aria-live="polite"
        style={{ "--rec": sel.accent } as React.CSSProperties}
      >
        <p className={styles.dossierCode}>{sel.code}</p>
        <h3 className={styles.dossierName}>{sel.village}</h3>
        <p className={styles.dossierEn}>{sel.villageEn}</p>
        <p className={styles.dossierNote}>{sel.note}</p>

        <dl className={styles.spec}>
          <div>
            <dt>Yönetim</dt>
            <dd>{sel.kage}</dd>
          </div>
          <div>
            <dt>Klanlar</dt>
            <dd>{sel.clans}</dd>
          </div>
          <div>
            <dt>Mekânlar</dt>
            <dd>{sel.places}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   2 · CHAKRA — doğa dönüşümleri
   ══════════════════════════════════════════════════════════════════════ */
export function NarutoChakra({
  elements,
  art,
  faces,
}: {
  elements: NarutoElement[];
  /** elementId → küratör kadrajı (mutlak adres) — yoksa panel görselsiz */
  art: Record<string, string | null>;
  /** kadro slug → portre adresi (kullanıcı çipleri) */
  faces: Record<string, string | null>;
}) {
  const [id, setId] = useState(elements[0]?.id ?? "");
  const sel = elements.find((e) => e.id === id) ?? elements[0];

  if (!sel) return null;

  const scene = art[sel.id] ?? null;

  return (
    <div className={styles.split}>
      <div className={styles.rail}>
        {elements.map((el) => (
          <RailButton
            key={el.id}
            active={el.id === sel.id}
            accent={el.bar}
            onSelect={() => setId(el.id)}
          >
            <span className={styles.railKanji} aria-hidden>
              {el.kanji}
            </span>
            <span className={styles.railName}>{el.tr}</span>
            <span className={styles.railMeta}>{el.en}</span>
          </RailButton>
        ))}
      </div>

      <div
        className={styles.dossier}
        aria-live="polite"
        style={{ "--rec": sel.bar } as React.CSSProperties}
      >
        {/* Element kadrajı: küratör yüklediyse çizilir (boş oda yasağı).
            key={sel.id} — element değişince eski kare yenisinin altından
            görünmesin diye kadraj baştan kurulur */}
        {scene ? (
          <figure key={sel.id} className={styles.dossierScene}>
            <Image src={scene} alt="" fill sizes="720px" />
            <span className={styles.sceneKanji} aria-hidden>
              {sel.kanji}
            </span>
          </figure>
        ) : null}

        <p className={styles.dossierCode}>{sel.release}</p>
        <h3 className={styles.dossierName}>{sel.tr}</h3>
        <p className={styles.dossierNote}>{sel.desc}</p>

        <dl className={styles.spec}>
          <div>
            <dt>Kullananlar</dt>
            <dd>
              <span className={styles.chipRow}>
                {sel.users.map((figure) => (
                  <NarutoFigureChip
                    key={figure.label}
                    figure={figure}
                    faces={faces}
                  />
                ))}
              </span>
            </dd>
          </div>
          <div>
            <dt>Teknikler</dt>
            <dd>{sel.jutsu.join(" · ")}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   3 · DŌJUTSU — göz teknikleri
   ══════════════════════════════════════════════════════════════════════ */
export function NarutoDojutsu({
  eyes,
  art,
}: {
  eyes: NarutoEye[];
  /**
   * eyeId → küratör kadrajı (mutlak adres). Yoksa künye görselsiz —
   * CSS iris motifi zaten her gözü çiziyor, yani boş çerçeve doğmuyor.
   *
   * ⚠️ 29 Ağustos 2026'da açıldı. Bölümün tek yuvası vardı (arka fon) ve
   * sekiz gözün hiçbirine kare konamıyordu (kullanıcı isteği).
   */
  art?: Record<string, string | null>;
}) {
  const [id, setId] = useState(eyes[0]?.id ?? "");
  const sel = eyes.find((e) => e.id === id) ?? eyes[0];

  if (!sel) return null;

  const scene = art?.[sel.id] ?? null;

  return (
    <div className={styles.split}>
      <div className={styles.rail} data-dense>
        {eyes.map((eye) => (
          <RailButton
            key={eye.id}
            active={eye.id === sel.id}
            accent={eye.iris}
            onSelect={() => setId(eye.id)}
          >
            {/* Göz motifi saf CSS — iki iç içe daire, ortada bebek.
                Görsel gerekmiyor, o yüzden yüklenmeyi de beklemiyor.
                Kare yüklendiyse rayda DEĞİL künyede çiziliyor: sekiz
                küçük fotoğraf rayı bir kontak baskıya çevirirdi. */}
            <span
              className={styles.iris}
              aria-hidden
              style={
                {
                  "--iris": eye.iris,
                  "--mid": eye.mid,
                } as React.CSSProperties
              }
            />
            <span className={styles.railName}>{eye.name}</span>
            <span className={styles.railMeta}>{eye.owner}</span>
          </RailButton>
        ))}
      </div>

      <div
        className={styles.dossier}
        aria-live="polite"
        style={{ "--rec": sel.iris } as React.CSSProperties}
      >
        {/* Gözün yakın planı — kare kadraj, irisin rengiyle çevrelenmiş.
            `key={sel.id}` göz değişince kadrajı baştan kuruyor: eski kare
            yenisinin altından görünmüyor (element panelinin aynı kararı). */}
        {scene ? (
          <figure key={sel.id} className={styles.eyeScene}>
            <Image src={scene} alt="" fill sizes="360px" />
          </figure>
        ) : null}

        <p className={styles.dossierCode}>{sel.owner}</p>
        <h3 className={styles.dossierName}>{sel.name}</h3>
        <p className={styles.dossierNote}>{sel.desc}</p>
      </div>
    </div>
  );
}

/* Bijuu seçicisi buradan taşındı: Kuyruklu Canavarlar artık kendi
   sinematik sahnesinde (`BijuuStage.tsx`) — tam kadraj illüstrasyon,
   kademeli ray ve chakra renk teması küçük künye kalıbına sığmıyordu. */

/* ══════════════════════════════════════════════════════════════════════
   5 · TARİH — dönem zaman çizelgesi
   ══════════════════════════════════════════════════════════════════════ */
export function NarutoChronicle({
  eras,
  faces,
}: {
  eras: NarutoEra[];
  /** kadro slug → portre adresi — figür çipleri */
  faces: Record<string, string | null>;
}) {
  /* Açılışta SON dönem seçili: sayfaya gelen kişi evrenin bugününü görsün,
     sonra geriye doğru gezsin. */
  const [index, setIndex] = useState(eras.length - 1);
  const sel = eras[index] ?? eras[0];

  if (!sel) return null;

  return (
    <div className={`${styles.split} ${styles.chronicle}`}>
      <ol className={styles.timeline}>
        {eras.map((era, i) => (
          <li key={era.name}>
            <button
              type="button"
              className={styles.era}
              data-active={i === index ? "" : undefined}
              /* Geçilmiş dönemler hat üzerinde dolu görünür — çizelge
                 "neredeyim" sorusunu raydan cevaplar */
              data-passed={i < index ? "" : undefined}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <span className={styles.eraNo} aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.eraDot} aria-hidden />
              <span className={styles.eraName}>{era.name}</span>
            </button>
          </li>
        ))}
      </ol>

      <div
        className={`${styles.dossier} ${styles.eraDossier}`}
        aria-live="polite"
      >
        {/* Dönem numarası — künyenin filigran katmanı */}
        <span className={styles.eraWatermark} aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={styles.eraBrush} aria-hidden>
          歴史
        </span>

        <p className={styles.dossierCode}>
          DÖNEM {String(index + 1).padStart(2, "0")} / {eras.length}
        </p>
        <h3 className={styles.dossierName}>{sel.name}</h3>
        <p className={styles.dossierNote}>{sel.desc}</p>

        <p className={styles.figuresLabel}>DÖNEMİN YÜZLERİ</p>
        <div className={styles.chipRow}>
          {sel.figures.map((figure) => (
            <NarutoFigureChip
              key={figure.label}
              figure={figure}
              faces={faces}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
