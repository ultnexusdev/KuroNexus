"use client";

import { useId, useState } from "react";
import Image from "next/image";
import type {
  NarutoBijuu,
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
export function NarutoAtlas({ nations }: { nations: NarutoNation[] }) {
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
export function NarutoDojutsu({ eyes }: { eyes: NarutoEye[] }) {
  const [id, setId] = useState(eyes[0]?.id ?? "");
  const sel = eyes.find((e) => e.id === id) ?? eyes[0];

  if (!sel) return null;

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
                Görsel gerekmiyor, o yüzden yüklenmeyi de beklemiyor. */}
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
        <p className={styles.dossierCode}>{sel.owner}</p>
        <h3 className={styles.dossierName}>{sel.name}</h3>
        <p className={styles.dossierNote}>{sel.desc}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   4 · KUYRUKLU CANAVARLAR
   ══════════════════════════════════════════════════════════════════════ */
export function NarutoBijuuPicker({ bijuu }: { bijuu: NarutoBijuu[] }) {
  const [n, setN] = useState(bijuu[bijuu.length - 1]?.n ?? 1);
  const sel = bijuu.find((b) => b.n === n) ?? bijuu[0];

  if (!sel) return null;

  return (
    <div className={styles.split}>
      <div className={styles.rail} data-dense>
        {bijuu.map((b) => (
          <RailButton
            key={b.n}
            active={b.n === sel.n}
            onSelect={() => setN(b.n)}
          >
            <span className={styles.railTails} aria-hidden>
              {String(b.n).padStart(2, "0")}
            </span>
            <span className={styles.railName}>{b.name}</span>
            <span className={styles.railMeta}>{b.jin}</span>
          </RailButton>
        ))}
      </div>

      <div className={styles.dossier} aria-live="polite">
        <p className={styles.dossierCode}>{sel.tails}</p>
        <h3 className={styles.dossierName}>{sel.name}</h3>
        <p className={styles.dossierNote}>{sel.desc}</p>

        <dl className={styles.spec}>
          <div>
            <dt>Jinchūriki</dt>
            <dd>{sel.jin}</dd>
          </div>
          <div>
            <dt>Güç</dt>
            <dd>{sel.power}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

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
