"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { UserFilmList, UserReview } from "@/hooks/use-auth";

export type UserDetail = {
  id: string;
  username: string;
  display_name?: string;
  bio?: string;
  film_lists: UserFilmList[];
  reviews: UserReview[];
};

type UserDetailPayload = {
  success: boolean;
  message: string;
  data: UserDetail;
};

export const userDetailKeys = {
  detail: (id?: string) => ["users", "detail", id] as const,
};

async function fetchUserDetail(id: string): Promise<UserDetail> {
  const response = await api.get<UserDetailPayload>(`/users/${id}`);
  return response.data.data;
}

export function useUserDetail(id?: string) {
  return useQuery({
    queryKey: userDetailKeys.detail(id),
    queryFn: () => fetchUserDetail(id as string),
    enabled: Boolean(id),
  });
}
