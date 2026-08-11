"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Site geneli müzik kuyruğu — Salon 06'nın dışına taşan tek parçası.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * NEDEN KUYRUK KÖK DÜZENDE (root layout) YAŞIYOR
 *
 * Kullanıcı isteği: "müzik sayfasından ayrıldığımda gezindiğim diğer
 * sayfalarda da çalmaya devam etsin." App Router'da sayfalar arası gezinme
 * istemci tarafında oluyor ve **kök düzen yeniden mount edilmiyor** — çaların
 * iframe'i orada durduğu sürece ses kesilmiyor. Sağlayıcı bir sayfanın içine
 * konsaydı gezinmede sökülür ve müzik her bağlantıda susardı.
 *
 * ⚠️ Tam sayfa yenilemesi (F5, adres çubuğuna yazma) iframe'i yok eder; ses
 * kesilir. Kuyruk `localStorage`da durduğu için ŞERİT geri gelir ve kaldığı
 * parçayı gösterir, ama çalmayı kendiliğinden başlatmaz: tarayıcılar kullanıcı
 * hareketi olmadan sesi başlatmıyor ve başlatabilseydik bile davetsiz olurdu.
 * ══════════════════════════════════════════════════════════════════════════
 */

export interface QueueTrack {
  /** Spotify parça kimliği — kuyruğa yalnızca kimliği olan parça giriyor */
  spotifyId: string;
  title: string;
  artist: string;
  album: string | null;
  /** Kendi sunucumuzdaki kapak yolu (`/uploads/…`) ya da null */
  artwork: string | null;
}

interface QueueState {
  tracks: QueueTrack[];
  index: number;
  /** "Meteora" / "Gece Listesi" — şeritte nereden çalındığı yazıyor */
  context: string | null;
}

interface MusicQueueValue extends QueueState {
  current: QueueTrack | null;
  /** Kuyruğu değiştirir ve verilen sıradan başlatır */
  play: (tracks: QueueTrack[], startIndex: number, context: string) => void;
  /** Tek parçayı kuyruğun sonuna ekler (kuyruk boşsa çalmaya başlar) */
  enqueue: (track: QueueTrack, context: string) => void;
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  clear: () => void;
  /** Şerit çalar tarafından okunuyor: yeni parça yüklenince kendiliğinden çal */
  autoplay: boolean;
  setAutoplay: (value: boolean) => void;
}

const EMPTY: QueueState = { tracks: [], index: 0, context: null };

const MusicQueueContext = createContext<MusicQueueValue | null>(null);

const STORAGE_KEY = "kuronexus.music.queue";

/** Kuyruk üst sınırı — `localStorage` kotasını zorlamamak için. */
const MAX_QUEUE = 300;

export function MusicQueueProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QueueState>(EMPTY);
  /**
   * İlk yüklemede `false`: sayfa açılır açılmaz ses başlatmak hem tarayıcı
   * politikasına takılır hem de davetsizdir. Kullanıcı "çal"a bastığı anda
   * `true` oluyor ve kuyruk ilerledikçe öyle kalıyor.
   */
  const [autoplay, setAutoplay] = useState(false);

  /* Yenilemeden sonra kaldığı yeri geri getir — çalmayı BAŞLATMADAN */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as Partial<QueueState>;
      if (Array.isArray(parsed.tracks) && parsed.tracks.length > 0) {
        setState({
          tracks: parsed.tracks.slice(0, MAX_QUEUE),
          index:
            typeof parsed.index === "number" &&
            parsed.index >= 0 &&
            parsed.index < parsed.tracks.length
              ? parsed.index
              : 0,
          context: typeof parsed.context === "string" ? parsed.context : null,
        });
      }
    } catch {
      // Bozuk/eski biçimli kayıt: kuyruk boş başlar, hata gösterilmez
    }
  }, []);

  useEffect(() => {
    try {
      if (state.tracks.length === 0) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      // Kota dolu ya da depolama kapalı: kuyruk yine çalışır, sadece kalıcı olmaz
    }
  }, [state]);

  const play = useCallback(
    (tracks: QueueTrack[], startIndex: number, context: string) => {
      const playable = tracks
        .filter((track) => Boolean(track.spotifyId))
        .slice(0, MAX_QUEUE);
      if (playable.length === 0) {
        return;
      }
      /**
       * Başlangıç sırası ham dizideki sıraydı; kimliksiz parçalar elenince
       * kayıyor. Kimliğe göre yeniden bulunuyor — yoksa listenin başından.
       */
      const wanted = tracks[startIndex]?.spotifyId;
      const index = Math.max(
        0,
        playable.findIndex((track) => track.spotifyId === wanted),
      );
      setAutoplay(true);
      setState({ tracks: playable, index, context });
    },
    [],
  );

  const enqueue = useCallback((track: QueueTrack, context: string) => {
    if (!track.spotifyId) {
      return;
    }
    setState((current) => {
      if (current.tracks.some((item) => item.spotifyId === track.spotifyId)) {
        return current;
      }
      const tracks = [...current.tracks, track].slice(0, MAX_QUEUE);
      return {
        tracks,
        index: current.tracks.length === 0 ? 0 : current.index,
        context: current.context ?? context,
      };
    });
  }, []);

  /** Kuyruğun sonunda durur — başa sarmıyor (istemeden tekrar çalmasın). */
  const next = useCallback(() => {
    setState((current) =>
      current.index + 1 < current.tracks.length
        ? { ...current, index: current.index + 1 }
        : current,
    );
  }, []);

  const previous = useCallback(() => {
    setState((current) =>
      current.index > 0 ? { ...current, index: current.index - 1 } : current,
    );
  }, []);

  const jumpTo = useCallback((index: number) => {
    setAutoplay(true);
    setState((current) =>
      index >= 0 && index < current.tracks.length
        ? { ...current, index }
        : current,
    );
  }, []);

  const clear = useCallback(() => {
    setAutoplay(false);
    setState(EMPTY);
  }, []);

  const value = useMemo<MusicQueueValue>(
    () => ({
      ...state,
      current: state.tracks[state.index] ?? null,
      play,
      enqueue,
      next,
      previous,
      jumpTo,
      clear,
      autoplay,
      setAutoplay,
    }),
    [state, play, enqueue, next, previous, jumpTo, clear, autoplay],
  );

  return (
    <MusicQueueContext.Provider value={value}>
      {children}
    </MusicQueueContext.Provider>
  );
}

/**
 * ⚠️ Sağlayıcı kök düzende, yani her zaman var. Yine de null dönüşü
 * yutulMUYOR: bir gün sağlayıcı yanlışlıkla kaldırılırsa "çal" düğmesi
 * sessizce hiçbir şey yapmak yerine hata fırlatır.
 */
export function useMusicQueue(): MusicQueueValue {
  const value = useContext(MusicQueueContext);
  if (!value) {
    throw new Error("useMusicQueue: MusicQueueProvider ağaçta yok");
  }
  return value;
}
