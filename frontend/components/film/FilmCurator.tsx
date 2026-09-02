"use client";

import { useTranslations } from "next-intl";
import {
  createMovieEntry,
  deleteMovieEntry,
  dismissMovieSuggestion,
  fetchMovieSuggestions,
  restoreMovieSuggestion,
  searchTmdbMovies,
  updateMovieEntry,
} from "@/lib/admin/api";
import type { ArchiveMovie, MovieStatus } from "@/lib/api/types";
import {
  TmdbCuratorBar,
  TmdbCuratorCardTools,
  TmdbSuggestionShelf,
  type TmdbCuratorWing,
} from "@/components/media/TmdbCurator";

/**
 * Film salonunun küratör kontrolleri — gövde `components/media/TmdbCurator.tsx`
 * (dizi salonuyla ortak, D-F2). Burada yalnızca salonun kimliği var: durum
 * kümesi, `admin/movies` uçları ve sözlük ad alanı.
 *
 * `useTranslations` literal argümanla BURADA çağrılır; `check:i18n` bütçeyi
 * statik olarak bundan kurar, ortak bileşene yalnızca `t` iner.
 */
const WING: TmdbCuratorWing<MovieStatus> = {
  statuses: ["WATCHED", "WATCHLIST", "REWATCH"],
  watched: "WATCHED",
  watchlist: "WATCHLIST",
  search: searchTmdbMovies,
  create: createMovieEntry,
  update: updateMovieEntry,
  remove: deleteMovieEntry,
  suggestions: fetchMovieSuggestions,
  dismiss: dismissMovieSuggestion,
  restore: restoreMovieSuggestion,
};

export function CuratorBar() {
  const t = useTranslations("film.curator");
  return <TmdbCuratorBar wing={WING} t={t} />;
}

export function SuggestionShelf() {
  const t = useTranslations("film.suggestions");
  return <TmdbSuggestionShelf wing={WING} t={t} />;
}

export function CuratorCardTools({ movie }: { movie: ArchiveMovie }) {
  const t = useTranslations("film.curator");
  return <TmdbCuratorCardTools wing={WING} t={t} entry={movie} />;
}
