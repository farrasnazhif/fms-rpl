"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type Film = {
  id: string;
  title: string;
  airing_status:
    | "finished_airing"
    | "currently_airing"
    | "not_yet_aired"
    | string;
  total_episodes: number;
  release_date: string;
  average_rating: number;
};

export type FilmGenre = {
  id: string;
  name: string;
};

export type FilmDetailReview = {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  likes: number;
  dislikes: number;
};

export type FilmDetail = Film & {
  synopsis: string;
  images: string[];
  genres: FilmGenre[];
  reviews: FilmDetailReview[];
};

type FilmDetailResponse = Omit<FilmDetail, "images" | "reviews"> & {
  images: string[] | null;
  reviews?: FilmDetailReview[] | null;
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

type FilmDetailPayload = {
  success: boolean;
  message: string;
  data: FilmDetailResponse;
};

export const filmKeys = {
  list: ["films"] as const,
  detail: (id?: string) => ["films", "detail", id] as const,
};

async function fetchFilms(): Promise<FilmsPayload> {
  const response = await api.get<FilmsPayload>("/films");
  return response.data;
}

async function fetchFilmDetail(id: string): Promise<FilmDetail> {
  const response = await api.get<FilmDetailPayload>(`/films/${id}`);
  const detail = response.data.data;

  return {
    ...detail,
    images: detail.images ?? [],
    reviews: detail.reviews ?? [],
  };
}

export function useFilms() {
  return useQuery({
    queryKey: filmKeys.list,
    queryFn: fetchFilms,
  });
}

export function useFilmDetail(id?: string) {
  return useQuery({
    queryKey: filmKeys.detail(id),
    queryFn: () => fetchFilmDetail(id as string),
    enabled: Boolean(id),
  });
}
