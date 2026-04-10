"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/lib/api";
import { getToken, removeToken, setToken } from "@/lib/cookies";

export type UserRole = "User" | "Admin";

export type UserFilmList = {
  id?: string;
  film_title: string;
  list_status: string;
  visibility?: "public" | "private" | string;
};

export type UserReview = {
  film: string;
  rating: number;
  comment: string;
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  bio?: string;
  role?: UserRole | string;
  film_lists?: UserFilmList[];
  reviews?: UserReview[];
};

type LegacyAuthUser = AuthUser & {
  name?: string;
};

type AuthPayload = {
  success?: boolean;
  message?: string;
  token?: string;
  access_token?: string;
  accessToken?: string;
  user?: LegacyAuthUser;
  personal_info?: LegacyAuthUser;
  data?:
    | AuthPayload
    | LegacyAuthUser
    | {
        personal_info?: LegacyAuthUser;
      };
  [key: string]: unknown;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type LoginInput = {
  email: string;
  password: string;
};

const authKeys = {
  me: ["auth", "me"] as const,
};

function extractToken(payload: AuthPayload): string | undefined {
  if (payload.token) return payload.token;
  if (payload.access_token) return payload.access_token;
  if (payload.accessToken) return payload.accessToken;

  if (payload.data && typeof payload.data === "object") {
    return extractToken(payload.data as AuthPayload);
  }

  return undefined;
}

function extractUser(payload: AuthPayload): LegacyAuthUser | undefined {
  if (payload.user) return payload.user;
  if (payload.personal_info) return payload.personal_info;

  if (payload.data) {
    if ("user" in payload.data) return extractUser(payload.data as AuthPayload);
    if ("personal_info" in payload.data) {
      return payload.data.personal_info;
    }

    return payload.data as LegacyAuthUser;
  }

  return undefined;
}

async function fetchMe(): Promise<AuthUser> {
  const response = await api.get<AuthPayload>("/auth/me");
  const user = extractUser(response.data);

  if (!user) {
    throw new Error("Data profil tidak ditemukan.");
  }

  return user;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [token, setAuthToken] = useState(() => getToken());

  const me = useQuery({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    enabled: Boolean(token),
  });

  const login = useMutation({
    mutationFn: async (input: LoginInput) => {
      const response = await api.post<AuthPayload>("/auth/login", input);
      const token = extractToken(response.data);

      if (!token) {
        throw new Error("Login berhasil, tapi token tidak ditemukan.");
      }

      setToken(token);
      setAuthToken(token);
      return extractUser(response.data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });

  const register = useMutation({
    mutationFn: async (input: RegisterInput) => {
      const response = await api.post<AuthPayload>("/auth/register", input);
      const token = extractToken(response.data);

      if (token) {
        setToken(token);
        setAuthToken(token);
      }

      return extractUser(response.data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });

  function logout() {
    removeToken();
    setAuthToken(undefined);
    queryClient.removeQueries({ queryKey: authKeys.me });
  }

  return {
    user: me.data,
    isAuthenticated: Boolean(token),
    isLoadingUser: me.isLoading,
    userError: me.error,
    refetchUser: me.refetch,
    login,
    register,
    logout,
  };
}
