import type { AbstractIntlMessages } from "next-intl";

/*
 * İstemciye giden mesaj kataloğunun bütçesi (2026-09-01 denetimi, B-02).
 *
 * Kök layout'taki <NextIntlClientProvider> props'suz bırakılınca next-intl v4
 * request config'teki kataloğun TAMAMINI devralıyor ve tr.json'ın ~107 KB'lık
 * serileşmiş hâli her sayfanın RSC/HTML payload'ına gömülüyordu. Sunucu
 * bileşenlerdeki getTranslations() bu kataloğa hiç muhtaç değil; yalnızca
 * useTranslations() çağıran (istemcide hydrate olan) bileşenlerin namespace'leri
 * taşınmalı.
 *
 * Bu liste o kümenin ta kendisi: repo'daki TÜM useTranslations("...") literal
 * argümanlarının üst-düzey (gerekirse nokta yollu) kapanışı. Ölçülen kazanç
 * (2026-09-01): akatsuki 22,3 KB → 0,5 KB (yalnız audio+curator istemcide) ve
 * hiç kullanılmayan nexus/futbol/footer/meta/nav dallarının düşmesi; sayfa
 * başına ~23 KB.
 *
 * BAKIM SÖZLEŞMESİ: yeni bir istemci bileşeni yeni bir namespace'le
 * useTranslations çağıracaksa buraya eklenmeli — aksi halde çeviri istemcide
 * MISSING_MESSAGE olarak patlar. `npm run check:i18n` bu listeyi gerçek
 * kullanımla karşılaştırıp eksikte derlemeden önce bağırır; elle takip etme.
 */
export const CLIENT_MESSAGE_PATHS = [
  "account",
  "admin",
  "akatsuki.audio",
  "akatsuki.curator",
  "anime",
  "book",
  "character",
  "common",
  "curator",
  "film",
  "home",
  "lightbox",
  "locale",
  "lore",
  "music",
  "pageState",
  "player",
  "show",
  "slamDunk",
  "sportArchive",
  "stories",
  "theme",
  "wiki",
] as const;

type MessageTree = Record<string, unknown>;

/**
 * Kataloğun yalnızca CLIENT_MESSAGE_PATHS altındaki dallarını içeren yeni bir
 * ağaç döndürür. Nokta yolları ("akatsuki.audio") ara düğümleri koruyarak
 * kopyalanır; katalogda bulunmayan bir yol sessizce atlanır (iki dilin şeması
 * check:i18n ile ayrıca doğrulanıyor).
 */
export function pickClientMessages(
  messages: AbstractIntlMessages,
): AbstractIntlMessages {
  const source = messages as MessageTree;
  const result: MessageTree = {};

  for (const path of CLIENT_MESSAGE_PATHS) {
    const segments = path.split(".");
    let from: unknown = source;
    for (const segment of segments) {
      if (typeof from !== "object" || from === null) {
        from = undefined;
        break;
      }
      from = (from as MessageTree)[segment];
    }
    if (from === undefined) continue;

    let target = result;
    for (const segment of segments.slice(0, -1)) {
      const next = target[segment];
      if (typeof next === "object" && next !== null) {
        target = next as MessageTree;
      } else {
        const created: MessageTree = {};
        target[segment] = created;
        target = created;
      }
    }
    target[segments[segments.length - 1]] = from;
  }

  return result as AbstractIntlMessages;
}
