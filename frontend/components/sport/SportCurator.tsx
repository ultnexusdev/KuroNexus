"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  createSportMoment,
  deleteSportMoment,
  featureF1Driver,
  fetchSportCuratorContext,
  setSportCoverFocus,
  setSportImage,
  uploadImage,
  uploadImageFromUrl,
  type SportCuratorContext,
  type SportImageTarget,
} from "@/lib/admin/api";
import { apiUrl } from "@/lib/api/client";
import styles from "./SportCurator.module.css";

/**
 * Küratör paneli — Salon 06 · Spor.
 *
 * ── NEDEN SAYFANIN İÇİNDE, AYRI BİR PANELDE DEĞİL ────────────────────────
 * Zaman şeridine kayıt eklemek, o şeridin YANINDA yapılması gereken bir iş:
 * küratör "1971'den sonra ne var" sorusunu ekranda görerek cevaplıyor. Ayrı
 * bir yönetim ekranında aynı formu doldurmak, eklenen kaydın nereye
 * düştüğünü ancak kaydettikten sonra göstermek olurdu.
 *
 * ── ÜÇ İŞ, ÜÇ BÖLÜM ──────────────────────────────────────────────────────
 *   1. AN EKLE      — zaman şeridine yeni kayıt (futbol dönemi ya da pist)
 *   2. GÖRSELLER    — bant kapakları ve efsane portreleri
 *   3. PANTEON      — hangi F1 sürücüsünün efsane sayısı ve sırası
 *
 * ⚠️ HER İŞLEMDEN SONRA `router.refresh()`. Panel kendi kopyasını güncelleyip
 * sayfayı eski hâlinde bırakmıyor — küratör eklediği şeyi ANINDA yerinde
 * görüyor. (Karakter yükleyicisinde öğrenilen ders, 6 Ağustos 2026: kürator
 * adresi kopyalayıp kimseye iletmemeli.)
 */
export function SportCurator() {
  const t = useTranslations("sportArchive.curator");
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [context, setContext] = useState<SportCuratorContext | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchSportCuratorContext()
      .then((data) => {
        if (alive) setContext(data);
      })
      .catch(() => {
        if (alive) setLoadError(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  /**
   * Her işlemden sonra İKİ ŞEY birden tazeleniyor:
   *   1. sayfa (`router.refresh()`) — küratör eklediğini yerinde görsün
   *   2. PANELİN KENDİ VERİSİ — yoksa panel eskimiş kalır
   *
   * İkincisi ilk turda unutulmuştu: sürücüyü panteona aldıktan sonra sayfa
   * güncelleniyor ama panelin listesi hâlâ "Panteona al" yazıyordu, çünkü
   * bağlam bir kez çekilip bırakılmıştı. Panelin gösterdiği durum, panelin
   * yazdığı duruma göre eskiyemez.
   */
  function refresh() {
    startTransition(() => router.refresh());
    void fetchSportCuratorContext()
      .then(setContext)
      .catch(() => {
        /* sessiz: sayfa yenilendi, panel bir sonraki açılışta toparlar */
      });
  }

  if (loadError) {
    return (
      <p className={styles.error} role="alert">
        {t("loadError")}
      </p>
    );
  }

  if (!context) {
    return <p className={styles.note}>{t("loading")}</p>;
  }

  return (
    <div className={styles.panel}>
      <MomentForm context={context} onDone={refresh} />
      <MomentList context={context} onDone={refresh} />
      <ImageSection context={context} onDone={refresh} />
      <PantheonSection context={context} onDone={refresh} />
    </div>
  );
}

/**
 * Ay numarası → ayın adı. Tek yerde, çünkü hem kayıt formu (açılır liste)
 * hem mevcut kayıtlar listesi (künye satırı) aynı adı yazıyor.
 *
 * `Intl` kullanılıyor, elde yazılmış 12 aylık dizi DEĞİL: dizi ikinci dilde
 * ikinci bir çeviri anahtarı kümesi demek olurdu ve tarayıcı bu adları
 * zaten doğru biliyor. `timeZone: "UTC"` şart — yereli UTC'nin gerisinde
 * olan bir tarayıcıda ayın 1'i bir önceki aya kayıyor.
 */
function ayAdi(locale: string, month: number): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, month - 1, 1)));
}

/* ══════════════════════════════════════════════════════════════════
   1 · AN EKLE
   ══════════════════════════════════════════════════════════════════ */

/**
 * KAYIT EKLEME — iki şerit, serbest etiket, kısmi tarih.
 *
 * ⚠️ ESKİDEN DÖNEM/PİST SEÇTİRİYORDU. Liste şöyleydi:
 *
 *   Galatasaray › Kuruluş ve okul (1905–1959)
 *   Monza · Formula 1
 *
 * Bu, döneme sığmayan kaydı EKLENEMEZ yapıyordu — 2026'da Messi'nin dünya
 * kupasının hiçbir Galatasaray dönemiyle ilgisi yok — ve Formula 1'i tek
 * bir pistin adıyla temsil ediyordu (kullanıcı bildirimi, 14 Ağustos 2026:
 * 'Monza sadece bir pist, dünyanın tamamı gibi görmeyelim').
 *
 * Artık soru tek: kayıt HANGİ ŞERİTTE görünecek — üstte futbol mu, altta
 * Formula 1 mi. Döneme/piste bağlamak ileride tek tek yapılacak ('bu
 * tarihi bu sayfaya bağla'); bağ alanları API'de duruyor, arayüzü yok.
 */
function MomentForm({
  context,
  onDone,
}: {
  context: SportCuratorContext;
  onDone: () => void;
}) {
  const t = useTranslations("sportArchive.curator");
  const locale = useLocale();
  const [world, setWorld] = useState<"" | "football" | "f1">("");
  const [year, setYear] = useState("");
  /** Ay ve gün AYRI ve ikisi de isteğe bağlı — kısmi tarih (bkz. şema) */
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [titleTr, setTitleTr] = useState("");
  /** Açıklamanın altındaki serbest satır — 'GOAT' gibi */
  const [label, setLabel] = useState("");
  const [narrativeTr, setNarrativeTr] = useState("");
  const [kind, setKind] = useState("MILESTONE");
  /** Yüklenmiş fotoğrafın yerel adresi — kayıtla birlikte gidiyor */
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  /**
   * İki şerit. Sıra ekrandaki sırayla aynı: 'Hepsi' görünümünde futbol
   * eksenin ÜSTÜNDE, Formula 1 ALTINDA duruyor.
   */
  const lanes: Array<{ value: "football" | "f1"; label: string }> = [
    { value: "football", label: t("laneFootball") },
    { value: "f1", label: t("laneF1") },
  ];

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!world) return;

    setBusy(true);
    setError(null);
    setDone(false);
    try {
      await createSportMoment({
        world,
        year: Number(year),
        // Boş bırakılan alan GÖNDERİLMİYOR: 0 göndermek 'ocak ayı' ya da
        // 'ayın sıfırıncı günü' demek olurdu.
        month: month ? Number(month) : undefined,
        day: day ? Number(day) : undefined,
        titleTr: titleTr.trim(),
        labelTr: label.trim() || undefined,
        narrativeTr: narrativeTr.trim() || undefined,
        kind: world === "football" ? kind : undefined,
        imageUrl: imageUrl || undefined,
        // Ana sayfadaki şerit YALNIZCA öne çıkanları okuyor. Küratör buradan
        // eklediği kaydı şeritte görmek istiyor — varsayılan açık.
        isHighlight: true,
        isPublished: true,
      });
      setYear("");
      setMonth("");
      setDay("");
      setTitleTr("");
      setLabel("");
      setNarrativeTr("");
      setImageUrl("");
      setDone(true);
      onDone();
    } catch {
      setError(t("saveError"));
    } finally {
      setBusy(false);
    }
  }

  const valid =
    world !== "" &&
    titleTr.trim().length > 0 &&
    /^\d{4}$/.test(year.trim());

  return (
    <form className={styles.block} onSubmit={submit}>
      <h3 className={styles.blockTitle}>{t("addMoment")}</h3>

      <label className={styles.field}>
        <span className={styles.label}>{t("lane")}</span>
        <select
          className={styles.select}
          value={world}
          onChange={(event) =>
            setWorld(event.target.value as "" | "football" | "f1")
          }
          required
        >
          <option value="">{t("lanePlaceholder")}</option>
          {lanes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <span className={styles.note}>{t("laneHint")}</span>
      </label>

      <div className={styles.row}>
        <label className={styles.field} style={{ maxWidth: "8rem" }}>
          <span className={styles.label}>{t("year")}</span>
          <input
            className={styles.input}
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            value={year}
            onChange={(event) => setYear(event.target.value)}
            required
          />
        </label>

        {/* AY ve GÜN isteğe bağlı. Boş bırakılırsa kayıt yalnızca yılıyla
            duruyor — bilinmeyen günü uydurmuyoruz. Aynı yıla düşen iki
            kaydı ayırmak için var (kullanıcı isteği, 14 Ağustos 2026). */}
        <label className={styles.field} style={{ maxWidth: "10rem" }}>
          <span className={styles.label}>{t("month")}</span>
          <select
            className={styles.select}
            value={month}
            onChange={(event) => setMonth(event.target.value)}
          >
            <option value="">{t("dateUnknown")}</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {ayAdi(locale, m)}
              </option>
            ))}
          </select>
        </label>

        {/* Ay seçilmeden gün sorulmuyor: '20' tek başına hangi ayın 20'si
            olduğunu söylemiyor. */}
        {month ? (
          <label className={styles.field} style={{ maxWidth: "6rem" }}>
            <span className={styles.label}>{t("day")}</span>
            <select
              className={styles.select}
              value={day}
              onChange={(event) => setDay(event.target.value)}
            >
              <option value="">{t("dateUnknown")}</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {/* An türü YALNIZCA futbolda anlamlı: F1Moment'te `kind` alanı yok. */}
        {world === "football" ? (
          <label className={styles.field}>
            <span className={styles.label}>{t("kind")}</span>
            <select
              className={styles.select}
              value={kind}
              onChange={(event) => setKind(event.target.value)}
            >
              {[
                "MILESTONE",
                "MATCH",
                "TROPHY",
                "ARRIVAL",
                "DEPARTURE",
                "TURNING_POINT",
                "OTHER",
              ].map((value) => (
                <option key={value} value={value}>
                  {t(`kinds.${value}`)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <label className={styles.field}>
        <span className={styles.label}>{t("title")}</span>
        <input
          className={styles.input}
          value={titleTr}
          maxLength={160}
          onChange={(event) => setTitleTr(event.target.value)}
          placeholder={t("titlePlaceholder")}
          required
        />
      </label>

      {/* ETİKET — açıklamanın altındaki küçük satır.

          `list` ile öneriliyor ama SERBEST metin: kullanıcı 'listede yoksa
          kendim oluşturayım' dedi. `<datalist>` tam olarak bunu yapıyor —
          öneri sunar, yazmayı engellemez. Öneriler daha önce kullanılmış
          etiketlerden geliyor, ayrı bir sözlük yok. */}
      <label className={styles.field}>
        <span className={styles.label}>{t("labelLine")}</span>
        <input
          className={styles.input}
          list="sport-moment-labels"
          value={label}
          maxLength={60}
          onChange={(event) => setLabel(event.target.value)}
          placeholder={t("labelPlaceholder")}
        />
        <datalist id="sport-moment-labels">
          {context.labels.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
        <span className={styles.note}>{t("labelHint")}</span>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>{t("narrative")}</span>
        <textarea
          className={styles.textarea}
          rows={3}
          value={narrativeTr}
          onChange={(event) => setNarrativeTr(event.target.value)}
          placeholder={t("narrativePlaceholder")}
        />
      </label>

      {/* Fotoğraf kayıtla BİRLİKTE gidiyor: önce kaydet sonra fotoğraf ekle
          akışı, küratörü aynı kayda iki kez uğratırdı. Sonradan eklemek yine
          mümkün — "Mevcut kayıtlar" listesinden. */}
      <label className={styles.field}>
        <span className={styles.label}>{t("photoOptional")}</span>
        <input
          type="file"
          accept="image/*"
          className={styles.file}
          disabled={uploading || busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setUploading(true);
            setError(null);
            uploadImage(file)
              .then((uploaded) => setImageUrl(uploaded.url))
              .catch(() => setError(t("uploadError")))
              .finally(() => setUploading(false));
          }}
        />
        {uploading ? <span className={styles.note}>{t("busy")}</span> : null}
        {imageUrl ? (
          <span className={styles.done} role="status">
            {t("photoReady")}
          </span>
        ) : null}
      </label>

      <div className={styles.actions}>
        <button type="submit" className={styles.primary} disabled={!valid || busy}>
          {busy ? t("saving") : t("save")}
        </button>
        {done ? (
          <span className={styles.done} role="status">
            {t("saved")}
          </span>
        ) : null}
        {error ? (
          <span className={styles.error} role="alert">
            {error}
          </span>
        ) : null}
      </div>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2 · MEVCUT KAYITLAR
   ══════════════════════════════════════════════════════════════════ */

/**
 * Şeritteki kayıtların listesi — fotoğraf eklemek ve yanlış kaydı silmek için.
 *
 * İlk turda yalnızca "an ekle" vardı ve eklenen kayda sonradan dokunmanın
 * yolu yoktu: fotoğrafını koyamıyor, yanlış yazılmış bir kaydı
 * kaldıramıyordun. Bir arşiv aracında EKLEMEK yarısıdır.
 *
 * Liste taslakları da gösteriyor (`isPublished` süzgeci yok): küratörün
 * yayına almadığı kaydı görememesi, onu düzenleyememesi demek olurdu.
 */
function MomentList({
  context,
  onDone,
}: {
  context: SportCuratorContext;
  onDone: () => void;
}) {
  const t = useTranslations("sportArchive.curator");
  const locale = useLocale();
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  if (context.moments.length === 0) return null;

  async function remove(world: "football" | "f1", id: string, title: string) {
    // Yumuşak silme ama yine de onay: şeritten bir kaydın kaybolması,
    // küratörün geri almak için veritabanına inmesi gereken bir iş.
    if (!window.confirm(t("confirmDelete", { title }))) return;
    setBusyId(id);
    try {
      await deleteSportMoment(world, id);
      onDone();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className={styles.block}>
      <h3 className={styles.blockTitle}>{t("existing")}</h3>
      <p className={styles.note}>{t("existingNote")}</p>

      <ul className={styles.moments}>
        {context.moments.map((moment) => (
          <li key={moment.id} className={styles.momentRow}>
            <div className={styles.momentHead}>
              <span className={styles.momentYear}>{moment.year}</span>
              <span className={styles.momentTitle}>{moment.titleTr}</span>
              <span className={styles.momentSubject}>
                {/* Tarihin İÇİ ve küratörün etiketi. Ay yoksa hiçbiri
                    yazılmıyor — bilinmeyen günü uydurmuyoruz. */}
                {[
                  moment.month
                    ? [moment.day, ayAdi(locale, moment.month)]
                        .filter(Boolean)
                        .join(" ")
                    : null,
                  moment.label,
                ]
                  .filter(Boolean)
                  .join(" · ")}
                {moment.imageUrl ? ` · ${t("hasImage")}` : ""}
                {!moment.isPublished ? ` · ${t("draft")}` : ""}
              </span>

              <button
                type="button"
                className={styles.ghost}
                aria-expanded={openId === moment.id}
                onClick={() =>
                  setOpenId(openId === moment.id ? null : moment.id)
                }
              >
                {openId === moment.id ? t("closePhoto") : t("photo")}
              </button>
              <button
                type="button"
                className={styles.ghost}
                disabled={busyId === moment.id}
                onClick={() =>
                  void remove(moment.world, moment.id, moment.titleTr)
                }
              >
                {t("delete")}
              </button>
            </div>

            {/* Yükleme yuvası KAPALI açılıyor: yirmi kayıtta yirmi açık form,
                listeyi okunmaz yapardı. */}
            {openId === moment.id ? (
              <ImageSlot
                target={
                  moment.world === "f1" ? "MOMENT_F1" : "MOMENT_FOOTBALL"
                }
                refId={moment.id}
                label={t("slotMoment", { title: moment.titleTr })}
                current={moment.imageUrl}
                onDone={onDone}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3 · GÖRSELLER
   ══════════════════════════════════════════════════════════════════ */

function ImageSection({
  context,
  onDone,
}: {
  context: SportCuratorContext;
  onDone: () => void;
}) {
  const t = useTranslations("sportArchive.curator");

  return (
    <section className={styles.block}>
      <h3 className={styles.blockTitle}>{t("images")}</h3>
      <p className={styles.note}>{t("imagesNote")}</p>

      <div className={styles.slots}>
        {context.clubs.map((club) => (
          <ImageSlot
            key={`club-${club.slug}`}
            target="CLUB_COVER"
            refId={club.slug}
            label={t("slotClubCover", { name: club.name })}
            current={club.coverImage}
            onDone={onDone}
          >
            {club.coverImage ? (
              <CoverFocus
                target="CLUB_COVER"
                refId={club.slug}
                cover={club.coverImage}
                position={club.coverPosition}
                scale={club.coverScale}
                onDone={onDone}
              />
            ) : null}
          </ImageSlot>
        ))}
        {context.circuits.map((circuit) => (
          <ImageSlot
            key={`circuit-${circuit.slug}`}
            target="CIRCUIT_COVER"
            refId={circuit.slug}
            label={t("slotCircuitCover", { name: circuit.name })}
            current={circuit.coverImage}
            onDone={onDone}
          >
            {circuit.coverImage ? (
              <CoverFocus
                target="CIRCUIT_COVER"
                refId={circuit.slug}
                cover={circuit.coverImage}
                position={circuit.coverPosition}
                scale={circuit.coverScale}
                onDone={onDone}
              />
            ) : null}
          </ImageSlot>
        ))}
        {context.legends.map((legend) => (
          <ImageSlot
            key={`legend-${legend.slug}`}
            target="LEGEND_PORTRAIT"
            refId={legend.slug}
            label={t("slotPortrait", { name: legend.name })}
            current={legend.portraitImage}
            onDone={onDone}
          />
        ))}
        {context.drivers
          .filter((driver) => driver.isPublished)
          .map((driver) => (
            <ImageSlot
              key={`driver-${driver.slug}`}
              target="DRIVER_PORTRAIT"
              refId={driver.slug}
              label={t("slotPortrait", { name: driver.name })}
              current={driver.photo}
              /* Commons portresinin künyesi var: kendi görselini yüklemek
                 o künyeyi geçersiz kılıyor ve backend onu SIFIRLIYOR.
                 Küratör bunu yüklemeden önce bilmeli. */
              warning={driver.portraitLicense ? t("replacesCredit") : undefined}
              onDone={onDone}
            />
          ))}
      </div>
    </section>
  );
}

/**
 * Tek görsel yuvası — iki yol: dosya seç ya da adres yapıştır.
 *
 * İkincisinde görsel sunucuya İNDİRİLİYOR; dış adres saklanmıyor çünkü CSP
 * `img-src` yabancı sunucuya izin vermiyor ve dış adres bir gün ölürse görsel
 * de ölürdü. (Karakter yükleyicisinin aynı kararı.)
 */
function ImageSlot({
  target,
  refId,
  label,
  current,
  warning,
  onDone,
  children,
}: {
  target: SportImageTarget;
  /** Kulüp/pist/efsane/sürücüde slug, ANDA `cuid` — anın slug'ı yok */
  refId: string;
  label: string;
  current: string | null;
  warning?: string;
  onDone: () => void;
  /** Yuvaya ait ek denetimler — bugün yalnızca bant kapaklarının kırpması */
  children?: React.ReactNode;
}) {
  const t = useTranslations("sportArchive.curator");
  const [remote, setRemote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(upload: () => Promise<{ url: string }>) {
    setBusy(true);
    setError(null);
    try {
      const uploaded = await upload();
      await setSportImage({ target, ref: refId, url: uploaded.url });
      setRemote("");
      onDone();
    } catch {
      setError(t("uploadError"));
    } finally {
      setBusy(false);
    }
  }

  async function clear() {
    setBusy(true);
    setError(null);
    try {
      await setSportImage({ target, ref: refId, url: "" });
      onDone();
    } catch {
      setError(t("uploadError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.slot}>
      <p className={styles.slotName}>
        {label}
        {current ? <span className={styles.slotOk}>{t("hasImage")}</span> : null}
      </p>
      {warning ? <p className={styles.warn}>{warning}</p> : null}

      <div className={styles.slotWays}>
        <label className={styles.fileWay}>
          <span className={styles.label}>{t("fromFile")}</span>
          <input
            type="file"
            accept="image/*"
            className={styles.file}
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void run(() => uploadImage(file));
            }}
          />
        </label>

        <div className={styles.urlWay}>
          <input
            type="url"
            inputMode="url"
            className={styles.input}
            placeholder={t("urlPlaceholder")}
            value={remote}
            disabled={busy}
            onChange={(event) => setRemote(event.target.value)}
            aria-label={t("fromUrl")}
          />
          <button
            type="button"
            className={styles.ghost}
            disabled={busy || remote.trim().length === 0}
            onClick={() => {
              const value = remote.trim();
              if (value) void run(() => uploadImageFromUrl(value));
            }}
          >
            {t("fetch")}
          </button>
        </div>
      </div>

      {current ? (
        <button
          type="button"
          className={styles.ghost}
          disabled={busy}
          onClick={() => void clear()}
        >
          {t("removeImage")}
        </button>
      ) : null}

      {busy ? <p className={styles.note}>{t("busy")}</p> : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {children}
    </div>
  );
}

/**
 * KIRPMA AYARI — bant kapağının odak noktası ve büyütmesi.
 *
 * ⚠️ NEDEN ÖNİZLEME VAR (müzik kanadında yok): orada tek bir bant ve iki
 * eksen vardı, kaydedip bakmak yetiyordu. Burada üç değişken var (X, Y,
 * büyütme) ve üçü birbirini etkiliyor — büyütünce odak noktasının anlamı
 * değişiyor. Önizlemesiz üç kaydırıcı, bunu kaydet-bak-geri-gel döngüsüne
 * çevirirdi.
 *
 * Önizleme bandın GERÇEK oranını ve gerçek CSS'ini taşıyor: aynı `cover`,
 * aynı `background-position`, aynı `scale`. Yaklaşık bir kutu, yanlış yerden
 * kesilen bir yüzü fark ettirmezdi.
 *
 * Yalnızca görsel YÜKLÜYSE çiziliyor — kırpılacak bir şey yokken üç
 * kaydırıcı göstermek boş oda yasağının ihlali olurdu.
 */
function CoverFocus({
  target,
  refId,
  cover,
  position,
  scale,
  onDone,
}: {
  target: "CLUB_COVER" | "CIRCUIT_COVER";
  refId: string;
  cover: string;
  position: string | null;
  scale: number | null;
  onDone: () => void;
}) {
  const t = useTranslations("sportArchive.curator");

  /* Kayıtlı değer kalıba uymuyorsa ortaya düşülüyor — bozuk bir satır
     yüzünden kaydırıcılar boş kalmasın (müzik küratörünün aynı kararı). */
  const kayitli = /^(\d{1,3})% (\d{1,3})%$/.exec(position ?? "");
  const [x, setX] = useState(Number(kayitli?.[1] ?? 50));
  const [y, setY] = useState(Number(kayitli?.[2] ?? 50));
  const [zoom, setZoom] = useState(
    typeof scale === "number" && scale >= 100 && scale <= 300 ? scale : 100,
  );
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function kaydet(gonderilen: { position: string; scale: number }) {
    setBusy(true);
    setError(null);
    setDone(false);
    try {
      await setSportCoverFocus({ target, ref: refId, ...gonderilen });
      setDone(true);
      onDone();
    } catch {
      setError(t("focusError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.focus}>
      <p className={styles.focusTitle}>{t("focusTitle")}</p>
      <p className={styles.note}>{t("focusNote")}</p>

      <span
        className={styles.focusPreview}
        role="img"
        aria-label={t("focusPreview")}
      >
        <span
          className={styles.focusPreviewArt}
          style={{
            backgroundImage: `url("${apiUrl(cover)}")`,
            backgroundPosition: `${x}% ${y}%`,
            scale: String(zoom / 100),
          }}
        />
      </span>

      <label className={styles.focusRow}>
        <span className={styles.label}>
          {t("focusX")} · {x}%
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={x}
          disabled={busy}
          onChange={(event) => setX(Number(event.target.value))}
        />
      </label>

      <label className={styles.focusRow}>
        <span className={styles.label}>
          {t("focusY")} · {y}%
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={y}
          disabled={busy}
          onChange={(event) => setY(Number(event.target.value))}
        />
      </label>

      {/* Alt sınır 100: altına inen değer kırpma kutusunda boşluk bırakır ve
          bandın altındaki zemin görünür. */}
      <label className={styles.focusRow}>
        <span className={styles.label}>
          {t("focusZoom")} · {zoom}%
        </span>
        <input
          type="range"
          min={100}
          max={300}
          step={5}
          value={zoom}
          disabled={busy}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
      </label>

      <div className={styles.focusActions}>
        <button
          type="button"
          className={styles.ghost}
          disabled={busy}
          onClick={() => void kaydet({ position: `${x}% ${y}%`, scale: zoom })}
        >
          {busy ? t("busy") : t("focusSave")}
        </button>
        <button
          type="button"
          className={styles.ghost}
          disabled={busy}
          onClick={() => {
            setX(50);
            setY(50);
            setZoom(100);
            // Boş `position` = sütuna null yazılır, CSS varsayılanına dönülür
            void kaydet({ position: "", scale: 100 });
          }}
        >
          {t("focusReset")}
        </button>
      </div>

      {done ? <p className={styles.note}>{t("focusSaved")}</p> : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   4 · PANTEON
   ══════════════════════════════════════════════════════════════════ */

/**
 * F1 sürücüsünü efsane yapmak.
 *
 * 96 sürücü kaydı senkronizasyondan geldi ve hepsi `isPublished: false` —
 * yani veritabanında duruyorlar ama hiçbirinin sayfası yok. Küratörlük tam
 * olarak bu: hangisinin panteona gireceğine karar vermek. Liste podyum
 * sayısına göre sıralı, yayındakiler her zaman en üstte.
 */
function PantheonSection({
  context,
  onDone,
}: {
  context: SportCuratorContext;
  onDone: () => void;
}) {
  const t = useTranslations("sportArchive.curator");
  const [busySlug, setBusySlug] = useState<string | null>(null);
  /** Satır içi lakap düzenlemesi — anahtar sürücü slug'ı */
  const [nicknames, setNicknames] = useState<Record<string, string>>({});

  async function save(
    slug: string,
    body: {
      isPublished?: boolean;
      personalRank?: number;
      nicknameTr?: string;
    },
  ) {
    setBusySlug(slug);
    try {
      await featureF1Driver(slug, body);
      onDone();
    } finally {
      setBusySlug(null);
    }
  }

  const publishedCount = context.drivers.filter((d) => d.isPublished).length;

  return (
    <section className={styles.block}>
      <h3 className={styles.blockTitle}>{t("pantheon")}</h3>
      <p className={styles.note}>{t("pantheonNote")}</p>

      <ul className={styles.drivers}>
        {context.drivers.map((driver) => (
          <li
            key={driver.slug}
            className={styles.driver}
            data-on={driver.isPublished ? "" : undefined}
          >
            <div className={styles.driverHead}>
              <span className={styles.driverName}>{driver.name}</span>
              <span className={styles.driverMeta}>
                {t("podiums", { n: driver.podiums })}
                {driver.championships > 0
                  ? ` · ${t("titles", { n: driver.championships })}`
                  : ""}
                {driver.personalRank ? ` · #${driver.personalRank}` : ""}
                {driver.photo ? ` · ${t("hasPortrait")}` : ""}
              </span>
              <button
                type="button"
                className={styles.ghost}
                disabled={busySlug === driver.slug}
                onClick={() =>
                  void save(driver.slug, {
                    isPublished: !driver.isPublished,
                    // Yeni eklenen sıranın SONUNA: mevcut sıralamayı bozmasın.
                    // Çıkarırken alan boş gidiyor ve backend onu null yapıyor.
                    personalRank: driver.isPublished
                      ? undefined
                      : publishedCount + 1,
                  })
                }
              >
                {driver.isPublished
                  ? t("removeFromPantheon")
                  : t("addToPantheon")}
              </button>
            </div>

            {/* Lakap yalnızca panteondakiler için sorulur.
                ⚠️ Sebep tasarımsal: panteon kartı adın ALTINA lakabı yazıyor
                ve `nicknameTr` boşsa kart tek satırlık bir isme düşüyor.
                Senkronizasyon lakap getirmiyor — o küratörün cümlesi. */}
            {driver.isPublished ? (
              <div className={styles.driverEdit}>
                <input
                  className={styles.input}
                  maxLength={120}
                  placeholder={t("nicknamePlaceholder")}
                  aria-label={t("nickname")}
                  value={nicknames[driver.slug] ?? ""}
                  onChange={(event) =>
                    setNicknames((prev) => ({
                      ...prev,
                      [driver.slug]: event.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  className={styles.ghost}
                  disabled={
                    busySlug === driver.slug ||
                    !(nicknames[driver.slug] ?? "").trim()
                  }
                  onClick={() =>
                    void save(driver.slug, {
                      isPublished: true,
                      personalRank: driver.personalRank ?? undefined,
                      nicknameTr: (nicknames[driver.slug] ?? "").trim(),
                    })
                  }
                >
                  {t("save")}
                </button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
