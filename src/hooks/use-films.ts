"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

export type FilmsParams = {
  take?: number;
  page?: number;
  filter?: string;
  filter_by?: string;
};

export const filmKeys = {
  list: (params?: FilmsParams) => ["films", "list", params] as const,
  detail: (id?: string) => ["films", "detail", id] as const,
};

async function fetchFilms(params: FilmsParams = {}): Promise<FilmsPayload> {
  const searchParams = new URLSearchParams({
    take: String(params.take ?? 12),
    page: String(params.page ?? 1),
  });

  if (params.filter) {
    searchParams.set("filter", params.filter);
    searchParams.set("filter_by", params.filter_by ?? "title");
  }

  const response = await api.get<FilmsPayload>(
    `/films?${searchParams.toString()}`,
  );
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

export function useFilms(params?: FilmsParams) {
  return useQuery({
    queryKey: filmKeys.list(params),
    queryFn: () => fetchFilms(params),
    placeholderData: keepPreviousData,
  });
}

export function useFilmDetail(id?: string) {
  return useQuery({
    queryKey: filmKeys.detail(id),
    queryFn: () => fetchFilmDetail(id as string),
    enabled: Boolean(id),
  });
}

export type CreateFilmInput = {
  title: string;
  synopsis: string;
  airing_status: string;
  total_episodes: number;
  release_date: string;
  genres: string;
  images?: File[];
};

type CreateFilmPayload = {
  success: boolean;
  message: string;
  data: { id: string };
};

export function useCreateFilm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateFilmInput) => {
      const formData = new FormData();
      formData.append("title", input.title);
      formData.append("synopsis", input.synopsis);
      formData.append("airing_status", input.airing_status);
      formData.append("total_episodes", String(input.total_episodes));
      formData.append("release_date", input.release_date);
      formData.append("genres", input.genres);

      if (input.images) {
        for (const image of input.images) {
          formData.append("images", image);
        }
      }

      const response = await api.post<CreateFilmPayload>("/films", formData, {
        headers: { "Content-Type": undefined },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["films", "list"] });
    },
  });
}
