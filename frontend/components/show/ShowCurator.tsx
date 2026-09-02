"use client";

import { useTranslations } from "next-intl";
import {
  createShowEntry,
  deleteShowEntry,
  dismissShowSuggestion,
  fetchShowSuggestions,
  restoreShowSuggestion,
  searchTmdbShows,
  updateShowEntry,
} from "@/lib/admin/api";
import type { ArchiveShow, ShowStatus } from "@/lib/api/types";
import {
  TmdbCuratorBar,
  TmdbCuratorCardTools,
  TmdbSuggestionShelf,
  type TmdbCuratorWing,
} from "@/components/media/TmdbCurator";

/**
 * Dizi salonunun küratör kontrolleri — gövde `components/media/TmdbCurator.tsx`
 * (film salonuyla ortak, D-F2). Burada yalnızca salonun kimliği var: durum
 * kümesi ("izliyorum" filmde yok), `admin/shows` uçları ve sözlük ad alanı.
 *
 * `useTranslations` literal argümanla BURADA çağrılır; `check:i18n` bütçeyi
 * statik olarak bundan kurar, ortak bileşene yalnızca `t` iner.
 */
const WING: TmdbCuratorWing<ShowStatus> = {
  statuses: ["WATCHING", "WATCHED", "WATCHLIST", "REWATCH"],
  watched: "WATCHED",
  watchlist: "WATCHLIST",
  search: searchTmdbShows,
  create: createShowEntry,
  update: updateShowEntry,
  remove: deleteShowEntry,
  suggestions: fetchShowSuggestions,
  dismiss: dismissShowSuggestion,
  restore: restoreShowSuggestion,
};

export function CuratorBar() {
  const t = useTranslations("show.curator");
  return <TmdbCuratorBar wing={WING} t={t} />;
}

export function SuggestionShelf() {
  const t = useTranslations("show.suggestions");
  return <TmdbSuggestionShelf wing={WING} t={t} />;
}

export function CuratorCardTools({ show }: { show: ArchiveShow }) {
  const t = useTranslations("show.curator");
  return <TmdbCuratorCardTools wing={WING} t={t} entry={show} />;
}
