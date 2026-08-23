"use client";

import { useCallback, useRef, useState } from "react";
import styles from "./SchriftGrid.module.css";
import world from "./world.module.css";

/**
 * STERNRITTER ALFABESİ — P09'un imza elemanı.
 *
 * ── NEDEN IZGARA SERBEST ─────────────────────────────────────────────────
 * Master brief "Naruto'nun kart ızgaralarını kopyalama" diyor ve hemen
 * ardından tek istisnayı adıyla veriyor: **Sternritter alfabesi**. Burada
 * ızgara bir yerleşim tercihi değil, konunun kendisi — yirmi altı harf,
 * yirmi altı mühür. Başka bir düzen bunu anlatamazdı.
 *
 * ── ⚠️ KLAVYE BU BÖLÜMÜ "KULLANILIR" YAPAN ŞEY ───────────────────────────
 * Brief'in kendi cümlesi. Uygulanan üç davranış:
 *   • **Roving tabindex** — ızgaranın tamamı TEK sekme durağı. Yirmi altı
 *     ayrı durak, klavyeyle sayfayı gezen birinin önüne yirmi altı kez
 *     çıkardı.
 *   • **Ok tuşları** — sağ/sol sırada ilerliyor, yukarı/aşağı bir satır.
 *     ⚠️ Sütun sayısı SABİT YAZILMADI: kırılma noktasına göre 13, 7 ya da
 *     4 olabiliyor ve değer o an DOM'dan ölçülüyor. Sabit yazılsaydı
 *     dar ekranda ok tuşları yanlış hücreye giderdi.
 *   • **A–Z** — harfe basınca doğrudan o mühre atlıyor.
 *
 * ── DOKUNMATİKTE HOVER YOK ───────────────────────────────────────────────
 * Hücre bir `<button>` ve tıklamayla **sabitleniyor** (`aria-pressed`).
 * `BankaiHall`de öğrenilen ders: hover'a bağlı bir tasarım dokunmatikte
 * bilgiyi tamamen erişilemez bırakır.
 *
 * ── ⚠️ OKUMA PLAKASI HÜCRENİN İÇİNDE DEĞİL ───────────────────────────────
 * Brief Schrift adını ve taşıyıcısını hücrenin içinde istiyor. On üç
 * sütunlu bir ızgarada hücre ~100px ve o metin 7px'e düşüyordu —
 * okunmuyor. Bunun yerine ızgaranın altında sabit bir plaka var: harf
 * yanınca kayıt orada açılıyor, punto okunur kalıyor.
 *
 * Plaka `aria-hidden`: her hücre zaten kendi kaydını erişilebilir adı
 * olarak taşıyor, yoksa ekran okuyucu her harfte aynı şeyi iki kez
 * duyardı.
 */

export interface GridBearer {
  name: string;
  epithet: string | null;
  note: string | null;
  /** Gücün tek cümlelik kaydı (P18-c); K ve N'de `null` — mühür açılmadı */
  power: string | null;
}

export interface GridLetter {
  letter: string;
  bearers: GridBearer[];
}

export interface GridLabels {
  /** Schrift adı canon'da açıklanmadıysa */
  sealed: string;
  /** Hiçbir harf seçili değilken plakadaki satır */
  hint: string;
  gridAria: string;
  bearerLabel: string;
}

export function SchriftGrid({
  letters,
  labels,
}: {
  letters: GridLetter[];
  labels: GridLabels;
}) {
  const [roving, setRoving] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);

  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const focused = useRef<number | null>(null);

  const shownIndex = pinned ?? active;
  const shown = shownIndex === null ? null : letters[shownIndex];

  const move = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(next, cells.current.length - 1));
    setRoving(clamped);
    cells.current[clamped]?.focus();
  }, []);

  /**
   * Bir satırda kaç hücre var — DOM'dan ölçülüyor.
   *
   * ⚠️ Sabit 13 yazmak dar ekranda ok tuşlarını bozardı: ızgara 900px
   * altında 7, 360px'te 4 sütuna iniyor. Ölçüm, ilk hücreyle aynı üst
   * konumu paylaşan hücreleri sayıyor.
   */
  const columns = useCallback(() => {
    const list = cells.current.filter(Boolean) as HTMLButtonElement[];
    if (list.length === 0) return 1;
    const top = list[0].offsetTop;
    const count = list.filter((cell) => cell.offsetTop === top).length;
    return Math.max(1, count);
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      const key = event.key;

      if (key === "ArrowRight") {
        event.preventDefault();
        move(index + 1);
      } else if (key === "ArrowLeft") {
        event.preventDefault();
        move(index - 1);
      } else if (key === "ArrowDown") {
        event.preventDefault();
        move(index + columns());
      } else if (key === "ArrowUp") {
        event.preventDefault();
        move(index - columns());
      } else if (key === "Home") {
        event.preventDefault();
        move(0);
      } else if (key === "End") {
        event.preventDefault();
        move(letters.length - 1);
      } else if (/^[a-zA-Z]$/.test(key)) {
        /* Harfe bas, o mühre git. Bölümü gerçekten kullanılır yapan ayrıntı. */
        const target = letters.findIndex(
          (item) => item.letter === key.toUpperCase(),
        );
        if (target >= 0) {
          event.preventDefault();
          move(target);
        }
      }
    },
    [columns, letters, move],
  );

  return (
    <div className={styles.wrap}>
      <ul
        className={styles.grid}
        aria-label={labels.gridAria}
        onMouseLeave={() => setActive(focused.current)}
      >
        {letters.map((item, i) => {
          const sealed = item.bearers.every((bearer) => bearer.epithet === null);
          const name = [
            item.letter,
            sealed ? labels.sealed : item.bearers[0].epithet,
            item.bearers.map((bearer) => bearer.name).join(", "),
          ].join(" · ");

          return (
            <li key={item.letter} className={styles.slot}>
              <button
                type="button"
                ref={(node) => {
                  cells.current[i] = node;
                }}
                className={styles.cell}
                /* Mührün adı açıklanmadıysa çerçeve kesikli çiziliyor:
                   imparatorluğun hâlâ sırrı var. */
                data-sealed={sealed ? "" : undefined}
                aria-pressed={pinned === i}
                tabIndex={roving === i ? 0 : -1}
                onKeyDown={(event) => onKeyDown(event, i)}
                onFocus={() => {
                  focused.current = i;
                  setActive(i);
                  setRoving(i);
                }}
                onBlur={() => {
                  focused.current = null;
                }}
                onMouseEnter={() => setActive(i)}
                onClick={() => setPinned((current) => (current === i ? null : i))}
              >
                <span className={world.gothic} aria-hidden="true">
                  {item.letter}
                </span>
                <span className={styles.srOnly}>{name}</span>
              </button>
              {/* Gücün kaydı (P18-c) — görünmez ama GERÇEK DOM: plaka
                  kalıcı `aria-hidden` olduğu için güç cümlesi oraya
                  konsaydı ekran okuyucu onu HİÇ duyamazdı. Düğmenin
                  erişilebilir adına da eklenmedi — ad kısa bir künye,
                  odak anonsunu bir paragrafa çevirmek yanlış olurdu.
                  Doğrusal gezen okuyucu düğmeden sonra kaydı duyuyor. */}
              {item.bearers.some((bearer) => bearer.power) ? (
                <span className={styles.srOnly}>
                  {item.bearers
                    .filter((bearer) => bearer.power)
                    .map((bearer) => `${bearer.name}: ${bearer.power}`)
                    .join(" ")}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>

      {/* ── OKUMA PLAKASI ────────────────────────────────────────────────
          Yer AYRILMIŞ: harf değiştikçe ızgara zıplamasın (CLS = 0). */}
      <div className={styles.readout} aria-hidden="true">
        {shown ? (
          <>
            <p className={styles.readLetter}>
              <span className={world.gothic}>{shown.letter}</span>
            </p>
            <div className={styles.readBody}>
              {shown.bearers.map((bearer) => (
                <p key={bearer.name} className={styles.readLine}>
                  <span className={styles.readEpithet} lang="en">
                    {bearer.epithet ?? labels.sealed}
                  </span>
                  <span className={styles.readName}>{bearer.name}</span>
                  {bearer.note ? (
                    <span className={styles.readNote}>{bearer.note}</span>
                  ) : null}
                  {bearer.power ? (
                    <span className={styles.readPower}>{bearer.power}</span>
                  ) : null}
                </p>
              ))}
            </div>
          </>
        ) : (
          <p className={`${world.meta} ${styles.readHint}`}>{labels.hint}</p>
        )}
      </div>
    </div>
  );
}
