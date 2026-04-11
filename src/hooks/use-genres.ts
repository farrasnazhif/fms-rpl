"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export type Genre = {
  id: string;
  name: string;
};

export type GenreMeta = {
  take: number;
  page: number;
  total_data: number;
  total_page: number;
  sort: string;
  sort_by: string;
};

type GenresPublicPayload = {
  success: boolean;
  message: string;
  data: Genre[];
};

type GenresAdminPayload = {
  success: boolean;
  message: string;
  data: Genre[];
  meta: GenreMeta[];
};

type GenrePayload = {
  success: boolean;
  message: string;
  data: Genre;
};

export const genreKeys = {
  public: ["genres", "public"] as const,
  admin: (page: number, take: number) =>
    ["genres", "admin", page, take] as const,
};

async function fetchPublicGenres(): Promise<Genre[]> {
  const response = await api.get<GenresPublicPayload>("/genres");
  return response.data.data;
}

async function fetchAdminGenres(
  page: number,
  take: number,
): Promise<GenresAdminPayload> {
  const response = await api.get<GenresAdminPayload>(
    `/genres/admin?take=${take}&page=${page}`,
  );
  return response.data;
}

export function usePublicGenres() {
  return useQuery({
    queryKey: genreKeys.public,
    queryFn: fetchPublicGenres,
  });
}

export function useAdminGenres(page: number, take: number) {
  return useQuery({
    queryKey: genreKeys.admin(page, take),
    queryFn: () => fetchAdminGenres(page, take),
  });
}

export type CreateGenreInput = {
  name: string;
};

export type UpdateGenreInput = {
  id: string;
  name: string;
};

export function useGenreMutations() {
  const queryClient = useQueryClient();

  const createGenre = useMutation({
    mutationFn: async (input: CreateGenreInput) => {
      const response = await api.post<GenrePayload>("/genres", input);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });

  const updateGenre = useMutation({
    mutationFn: async (input: UpdateGenreInput) => {
      const response = await api.put<GenrePayload>(`/genres/${input.id}`, {
        name: input.name,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
  });

  return { createGenre, updateGenre };
}
