"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  createSportMoment,
  deleteSportMoment,
  featureF1Driver,
  fetchSportCuratorContext,
  setSportImage,
  uploadImage,
  uploadImageFromUrl,
  type SportCuratorContext,
  type SportImageTarget,
} from "@/lib/admin/api";
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

/* ══════════════════════════════════════════════════════════════════
   1 · AN EKLE
   ══════════════════════════════════════════════════════════════════ */

/**
 * Hedef seçimi TEK AÇILIR LİSTE.
 *
 * "Önce dünya seç, sonra kulüp seç, sonra dönem seç" üç adımlık bir sihirbaz
 * olurdu; elde iki dünya ve dört hedef varken bu, bir tıklamayı üçe çıkarmak
 * demek. Liste doğrudan hedefleri yazıyor:
 *
 *   Galatasaray › Kuruluş ve okul (1905–1959)
 *   Galatasaray › Ali Sami Yen yılları (1964–1995)
 *   Monza  (Formula 1)
 *
 * Değer `world:id` biçiminde kodlanıyor; hangi tabloya yazılacağı seçimin
 * kendisinden okunuyor.
 */
function MomentForm({
  context,
  onDone,
}: {
  context: SportCuratorContext;
  onDone: () => void;
}) {
  const t = useTranslations("sportArchive.curator");
  const [target, setTarget] = useState("");
  const [year, setYear] = useState("");
  const [titleTr, setTitleTr] = useState("");
  const [narrativeTr, setNarrativeTr] = useState("");
  const [kind, setKind] = useState("MILESTONE");
  /** Yüklenmiş fotoğrafın yerel adresi — kayıtla birlikte gidiyor */
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const targets: Array<{ value: string; label: string; world: "football" | "f1" }> =
    [
      ...context.clubs.flatMap((club) =>
        club.eras.map((era) => ({
          value: `football:${era.id}`,
          world: "football" as const,
          label: `${club.name} › ${era.titleTr} (${era.startYear}–${era.endYear ?? ""})`,
        })),
      ),
      ...context.circuits.map((circuit) => ({
        value: `f1:${circuit.id}`,
        world: "f1" as const,
        label: `${circuit.name} · Formula 1`,
      })),
    ];

  const selected = targets.find((item) => item.value === target);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;

    setBusy(true);
    setError(null);
    setDone(false);
    try {
      const [world, id] = selected.value.split(":");
      await createSportMoment({
        world: world === "f1" ? "f1" : "football",
        eraId: world === "football" ? id : undefined,
        circuitId: world === "f1" ? id : undefined,
        year: Number(year),
        titleTr: titleTr.trim(),
        narrativeTr: narrativeTr.trim() || undefined,
        kind: world === "football" ? kind : undefined,
        imageUrl: imageUrl || undefined,
        // Ana sayfadaki şerit YALNIZCA öne çıkanları okuyor. Küratör buradan
        // eklediği kaydı şeritte görmek istiyor — varsayılan açık.
        isHighlight: true,
        isPublished: true,
      });
      setYear("");
      setTitleTr("");
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
    selected != null &&
    titleTr.trim().length > 0 &&
    /^\d{4}$/.test(year.trim());

  return (
    <form className={styles.block} onSubmit={submit}>
      <h3 className={styles.blockTitle}>{t("addMoment")}</h3>

      <label className={styles.field}>
        <span className={styles.label}>{t("target")}</span>
        <select
          className={styles.select}
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          required
        >
          <option value="">{t("targetPlaceholder")}</option>
          {targets.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
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

        {/* An türü YALNIZCA futbolda anlamlı: F1Moment'te `kind` alanı yok.
            F1 hedefi seçiliyken alanı göstermek, kaydedilmeyecek bir veri
            sormak olurdu. */}
        {selected?.world === "football" ? (
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
                {moment.subject}
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
          />
        ))}
        {context.circuits.map((circuit) => (
          <ImageSlot
            key={`circuit-${circuit.slug}`}
            target="CIRCUIT_COVER"
            refId={circuit.slug}
            label={t("slotCircuitCover", { name: circuit.name })}
            current={circuit.coverImage}
            onDone={onDone}
          />
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
}: {
  target: SportImageTarget;
  /** Kulüp/pist/efsane/sürücüde slug, ANDA `cuid` — anın slug'ı yok */
  refId: string;
  label: string;
  current: string | null;
  warning?: string;
  onDone: () => void;
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
