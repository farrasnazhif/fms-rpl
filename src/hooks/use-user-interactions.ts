"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { filmKeys } from "@/hooks/use-films";
import { userDetailKeys } from "@/hooks/use-user-detail";

export type ListStatus = "watching" | "completed" | "plan_to_watch";
export type VisibilityStatus = "public" | "private";
export type ReactionStatus = "like" | "dislike";

type ApiMessage = {
  success: boolean;
  message: string;
  data?: {
    id?: string;
  };
};

export type CreateFilmListInput = {
  film_id: string;
  list_status: ListStatus;
};

export type UpdateFilmListVisibilityInput = {
  id: string;
  visibility: VisibilityStatus;
  userId?: string;
};

export type CreateReviewInput = {
  film_id: string;
  rating: number;
  comment: string;
};

export type CreateReactionInput = {
  review_id: string;
  status: ReactionStatus;
};

export type UpdateReactionInput = {
  id: string;
  reviewId: string;
  status: ReactionStatus;
};

export function useUserInteractions(filmId?: string) {
  const queryClient = useQueryClient();

  const addToFilmList = useMutation({
    mutationFn: async (input: CreateFilmListInput) => {
      const response = await api.post<ApiMessage>("/film-lists", input);
      return response.data;
    },
  });

  const updateFilmListVisibility = useMutation({
    mutationFn: async (input: UpdateFilmListVisibilityInput) => {
      const response = await api.patch<ApiMessage>(`/film-lists/${input.id}`, {
        visibility: input.visibility,
      });
      return response.data;
    },
    onSuccess: async (_data, variables) => {
      if (variables.userId) {
        await queryClient.invalidateQueries({
          queryKey: userDetailKeys.detail(variables.userId),
        });
      }
    },
  });

  const createReview = useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const response = await api.post<ApiMessage>("/reviews", input);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: filmKeys.detail(filmId),
      });
    },
  });

  const createReaction = useMutation({
    mutationFn: async (input: CreateReactionInput) => {
      const response = await api.post<ApiMessage>("/reactions", input);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: filmKeys.detail(filmId),
      });
    },
  });

  const updateReaction = useMutation({
    mutationFn: async (input: UpdateReactionInput) => {
      const response = await api.put<ApiMessage>(`/reactions/${input.id}`, {
        status: input.status,
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: filmKeys.detail(filmId),
      });
    },
  });

  return {
    addToFilmList,
    updateFilmListVisibility,
    createReview,
    createReaction,
    updateReaction,
  };
}
