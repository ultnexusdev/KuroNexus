"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { beginNavPending } from "@/lib/nav/pending";
import type { CharacterIndex } from "@/lib/api/types";
import { CharacterPlate } from "./CharacterPlate";
import { CuratorModeContext } from "./CuratorFrame";
import styles from "./CharacterGallery.module.css";
import { CuratorDock } from "@/components/curated/CuratorDock";

/**
 * Portre kanadı — arşivdeki bütün serilerin kadroları tek ızgarada.
 *
 * Süzgeçleme tarayıcıda: liste birkaç yüz kayıt, sunucuya gidip gelmek her
 * tuş vuruşunda ağ turu demek olurdu. Aynı karar anime salonunda da alınmış
 * (`AnimeHall`), aynı sebeple.
 */
export function CharacterGallery({
  index,
  hallLabel,
  hallName,
  isAdmin = false,
  curatedCount = 0,
  shelf,
}: {
  index: CharacterIndex;
  hallLabel: string;
  hallName: string;
  /** Küratör anahtarını gösterir — yetki her istekte backend'de doğrulanır */
  isAdmin?: boolean;
  /**
   * Raftaki elle tasarlanmış dosya sayısı — yalnızca sayaç şeridi için.
   *
   * ⚠️ Aşağıdaki `curating` durumuyla KARIŞTIRMA: o "küratör modu açık mı"
   * demek (yönetici, karakteri dizinden çıkarabiliyor).
   */
  curatedCount?: number;
  /**
   * Üstteki "Elle Tasarlanmış Dosyalar" rafı. SUNUCUDA çizilmiş bir düğüm
   * olarak geçiyor: bu bileşen istemci tarafında ama rafın kendisi istemci
   * paketine girmiyor.
   */
  shelf?: React.ReactNode;
}) {
  const t = useTranslations("character");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState<string | null>(null);
  const [curating, setCurating] = useState(false);
  /**
   * Küratörün bu oturumda kaldırdığı karakterler.
   *
   * Durum burada duruyor, kartın içinde değil: düğme kendi `hidden` bayrağını
   * tutarken dizin hangi karakterin gizlendiğini hiç öğrenmiyordu ve küratör
   * modu kapanınca kart hiç kaldırılmamış gibi geri geliyordu.
   *
   * Küme her değişiklikte kopyalanıyor: React referans eşitliğine bakıyor,
   * aynı `Set`i yerinde değiştirmek yeniden çizim tetiklemezdi.
   */
  const [hiddenIds, setHiddenIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  /**
   * Düğmeden gelen bildirim. Yalnızca istek BAŞARILIYSA geliyor
   * (bkz. `CharacterHideButton`): istek düştüyse karakter gerçekte gizlenmedi,
   * onu listeden düşürmek küratöre yalan söylemek olurdu.
   */
  const markHidden = useCallback((characterId: number, hidden: boolean) => {
    setHiddenIds((current) => {
      // Durum değişmediyse eski küme dönüyor — gereksiz yeniden çizim yok
      if (current.has(characterId) === hidden) {
        return current;
      }
      const next = new Set(current);
      if (hidden) {
        next.add(characterId);
      } else {
        next.delete(characterId);
      }
      return next;
    });
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr");
    return index.characters.filter((character) => {
      // Kaldırılan kart küratör modu AÇIKKEN yerinde kalıyor (soluyor, düğmesi
      // "geri al" oluyor) — yanlışlıkla kaldırılan karakter listedeki sırasını
      // kaybetmesin diye. Mod kapanınca dizin ziyaretçinin göreceği hâline
      // dönüyor ve gizlenenler ızgaradan düşüyor.
      if (!curating && hiddenIds.has(character.characterId)) {
        return false;
      }
      if (series && !character.series.some((item) => item.slug === series)) {
        return false;
      }
      if (!needle) {
        return true;
      }
      // Ana dildeki ad ve seslendiren de aranıyor: "更木" ya da bir seiyuu
      // adıyla arayan biri sonuç bulamazsa arama kutusu bozuk görünür
      return (
        character.name.toLocaleLowerCase("tr").includes(needle) ||
        (character.nameNative ?? "").includes(needle) ||
        (character.voiceActor ?? "").toLocaleLowerCase("tr").includes(needle) ||
        character.series.some((item) =>
          item.title.toLocaleLowerCase("tr").includes(needle),
        )
      );
    });
  }, [curating, hiddenIds, index.characters, query, series]);

  /**
   * Ekrandaki sayaçlar.
   *
   * Sunucudan geleni olduğu gibi basmak yerine gizlenenler ANINDA düşülüyor:
   * "195 karakter" yazarken ızgarada 194 kart görmek çelişkili görünür.
   * Tazelemeye bırakmak yetmez: `router.refresh()` sunucuya bir tur demek ve
   * ızgara `hiddenIds` sayesinde ANINDA düşüyor — sayaç arkadan gelirse
   * kullanıcı iki farklı sayı arasında bir an çelişki görür.
   *
   * Çıkarma ELDEKİ listeye bakarak yapılıyor: taze liste gizlenenleri zaten
   * içermediğinde ikinci kez düşülmesin (sayaç eksiye kaymasın).
   *
   * Seri sayısı sunucuya bırakıldı: bir karakterin gizlenmesi ancak serisinin
   * son karakteriyse bu sayıyı oynatır ve o durumda süzgeç şeridinin de
   * (`index.series`) yeniden kurulması, seçili serinin kaybolması gerekirdi.
   * Göz bu sayıyı ızgaradan sayamadığı için çelişki de doğurmuyor.
   */
  const stats = useMemo(() => {
    if (curating || hiddenIds.size === 0) {
      return index.stats;
    }
    let removed = 0;
    for (const character of index.characters) {
      if (hiddenIds.has(character.characterId)) {
        removed += 1;
      }
    }
    return {
      characters: index.stats.characters - removed,
      /* `main` ekranda ÇİZİLMİYOR (rol etiketleri 24 Ağustos'ta kalktı),
         ama tip alanı istiyor — olduğu gibi taşınıyor. */
      main: index.stats.main,
      series: index.stats.series,
    };
  }, [curating, hiddenIds, index.characters, index.stats]);

  /**
   * "Rastgele bir dosya çek" — müzenin kendi jesti: çekmeceden gelişigüzel
   * bir künye. Süzgeç açıksa **görünen** listeden seçer; yoksa buton bir
   * seriyi süzüp başka seriden karakter açardı.
   *
   * ⚠️ GEÇİŞ BİR `startTransition` İÇİNDE (30 Ağustos 2026). Sitedeki
   * yükleme ekranını besleyen sayaç `<Link>`in içindeki `useLinkStatus()`
   * kancasından geliyor; burası bir `<button>` ve `router.push` o kancanın
   * hiç haberi olmadan gezindiği için ekran **hiçbir gösterge vermeden**
   * donuyordu. Geçiş bir `useTransition` içine alınınca `pending` aynı
   * bilgiyi veriyor ve aşağıdaki etki onu aynı sayaca yazıyor — yani
   * rastgele düğmesi de artık 黒 ekranını açıyor.
   */
  const [navigating, startNavigation] = useTransition();

  useEffect(() => {
    if (!navigating) return;
    /* Dönen işlev sayacı serbest bırakıyor: geçiş bitse de bileşen
       sökülse de sayaç düşüyor. */
    return beginNavPending();
  }, [navigating]);

  const openRandom = () => {
    if (visible.length === 0) {
      return;
    }
    const pick = visible[Math.floor(Math.random() * visible.length)];
    startNavigation(() => {
      router.push(
        `/dark-stories/category/anime/karakterler/${pick.characterId}`,
      );
    });
  };

  const isFiltered = query.trim().length > 0 || series !== null;

  /**
   * Küratör anahtarı. Mod KAPANIRKEN `router.refresh()` çağrılıyor.
   *
   * ⚠️ Kartı ızgaradan gerçekten düşüren şey tazeleme DEĞİL, aşağıdaki
   * `hiddenIds` istemci süzgeci. Tazeleme yalnızca ikinci bir emniyet:
   * sunucu listesi eninde sonunda gizlenenleri elenmiş getirir, ama o an
   * gelmeyebilir (ağ, yarış, uçtaki önbellek). İkisi çakışmıyor — liste
   * gerçekten tazelendiyse kümedeki kimlikler zaten listede yok.
   *
   * Bu yüzden `hiddenIds` süzgeci "gereksiz tekrar" değil: silinirse
   * düzeltilen hata (mod kapanınca karakter geri geliyor) doğrudan döner.
   */
  const toggleCurating = () => {
    const next = !curating;
    setCurating(next);
    if (!next) {
      router.refresh();
    }
  };

  return (
    <div className={styles.hall} data-category="anime">
      <div className={styles.page}>
        <header className={styles.head}>
          {/* Salon girişine döner, arşive değil: bu oda oraya bağlı
              (lobideki bölüm listesi bu sayfanın kapısı) */}
          <Link href="/dark-stories/category/anime" className={styles.back}>
            {t("backToArchive")}
          </Link>
          <span className={styles.eyebrow}>
            {hallLabel ? `${hallLabel} · ${hallName}` : hallName}
          </span>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.lede}>{t("lede")}</p>

          {/* Küratör anahtarı: anime salonundaki desenle aynı. Açıkken her
              portrenin sağ üstünde "kaldır" düğmesi çıkıyor. */}
          {isAdmin ? (
            <div className={styles.curatorSwitch}>
              <CuratorDock
                on={curating}
                onToggle={toggleCurating}
                label={curating ? t("indexCurator.on") : t("indexCurator.off")}
              />
              {curating ? (
                <span className={styles.curatorHint}>
                  {t("indexCurator.hint")}
                </span>
              ) : null}
            </div>
          ) : null}
        </header>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("stats.characters")}</span>
            <span className={styles.statValue}>{stats.characters}</span>
          </div>
          {/* "Başrol" sayacı buradaydı. Rol etiketleri kartlardan kalkınca
              (24 Ağustos 2026) ekranda karşılığı olmayan bir sayı hâline
              geldi; yerini gerçekten anlamlı olan sayı aldı. */}
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("stats.curated")}</span>
            <span className={styles.statValue}>{curatedCount}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>{t("stats.series")}</span>
            <span className={styles.statValue}>{stats.series}</span>
          </div>
        </div>

        {/* Raf SUNUCUDA çizilmiş bir düğüm: içindeki portre yuvalarına prop
            inemez, ama context iner. Sağlayıcı yalnızca yöneticide kuruluyor
            — ziyaretçide raf zaten yuvasız geliyor. */}
        {isAdmin ? (
          <CuratorModeContext.Provider value={curating}>
            {shelf}
          </CuratorModeContext.Provider>
        ) : (
          shelf
        )}

        {/* Alt bölümün başlığı. Raf "sayfası olanlar", burası "olmayanlar" —
            ikisi arasındaki sınırı yazıyla söylemek, karta işaret koymaktan
            hem daha net hem daha sessiz (kullanıcı kararı, 24 Ağustos 2026). */}
        {index.characters.length > 0 ? (
          <header className={styles.restHead}>
            <h2 className={styles.restTitle}>{t("rest.title")}</h2>
            <p className={styles.restLede}>{t("rest.lede")}</p>
          </header>
        ) : null}

        {index.characters.length > 0 ? (
          <>
            <div className={styles.tools}>
              <label className={styles.searchLabel} htmlFor="character-search">
                {t("searchLabel")}
              </label>
              <input
                id="character-search"
                type="search"
                className={styles.search}
                placeholder={t("searchPlaceholder")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                type="button"
                className={styles.dice}
                onClick={openRandom}
                disabled={visible.length === 0}
              >
                {t("random")}
              </button>
            </div>

            {index.series.length > 1 ? (
              <ul className={styles.seriesRow}>
                <li>
                  <button
                    type="button"
                    className={`${styles.seriesChip} ${series === null ? styles.seriesChipOn : ""}`}
                    onClick={() => setSeries(null)}
                    aria-pressed={series === null}
                  >
                    {t("allSeries")}
                  </button>
                </li>
                {index.series.map((item) => (
                  <li key={item.slug}>
                    <button
                      type="button"
                      className={`${styles.seriesChip} ${series === item.slug ? styles.seriesChipOn : ""}`}
                      onClick={() =>
                        setSeries(series === item.slug ? null : item.slug)
                      }
                      aria-pressed={series === item.slug}
                    >
                      {item.title}
                      <span className={styles.chipCount}>{item.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}

        {visible.length > 0 ? (
          <ul className={styles.grid}>
            {visible.map((character) => (
              <li key={character.characterId} className={styles.gridItem}>
                <CharacterPlate
                  character={character}
                  sizes="(max-width: 640px) 44vw, (max-width: 1100px) 22vw, 14vw"
                  curating={curating}
                  hidden={hiddenIds.has(character.characterId)}
                  onHiddenChange={markHidden}
                />
              </li>
            ))}
          </ul>
        ) : (
          /* İki ayrı boşluk, iki ayrı cevap: arşiv gerçekten boş mu, yoksa
             süzgeç mi hiçbir şey bırakmadı? Tek bir "sonuç yok" ekranı
             ikincisinde kullanıcıyı çıkmazda bırakır. */
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>
              {isFiltered ? t("empty.filteredTitle") : t("empty.title")}
            </p>
            <p className={styles.emptyText}>
              {isFiltered ? t("empty.filteredText") : t("empty.text")}
            </p>
            {isFiltered ? (
              <button
                type="button"
                className={styles.emptyAction}
                onClick={() => {
                  setQuery("");
                  setSeries(null);
                }}
              >
                {t("empty.clear")}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
