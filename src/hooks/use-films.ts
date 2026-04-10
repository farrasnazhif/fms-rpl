"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type Film = {
  id: string;
  title: string;
  airing_status: "finished_airing" | "currently_airing" | "not_yet_aired" | string;
  total_episodes: number;
  release_date: string;
  average_rating: number;
};

export type FilmMeta = {
  take: number;
  page: number;
  total_data: number;
  total_page: number;
  sort: string;
  sort_by: string;
};

type FilmsPayload = {
  success: boolean;
  message: string;
  data: Film[];
  meta: FilmMeta[];
};

export const filmKeys = {
  list: ["films"] as const,
};

async function fetchFilms(): Promise<FilmsPayload> {
  const response = await api.get<FilmsPayload>("/films");
  return response.data;
}

export function useFilms() {
  return useQuery({
    queryKey: filmKeys.list,
    queryFn: fetchFilms,
  });
}
