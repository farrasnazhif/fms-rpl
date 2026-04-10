"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { getToken, removeToken, setToken } from "@/lib/cookies";

export type UserRole = "User" | "Admin";

export type AuthUser = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: UserRole | string;
  [key: string]: unknown;
};

type AuthPayload = {
  token?: string;
  access_token?: string;
  accessToken?: string;
  user?: AuthUser;
  data?: AuthPayload | AuthUser;
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

  if (payload.data && "token" in payload.data) {
    return extractToken(payload.data as AuthPayload);
  }

  return undefined;
}

function extractUser(payload: AuthPayload): AuthUser | undefined {
  if (payload.user) return payload.user;

  if (payload.data) {
    if ("user" in payload.data) return extractUser(payload.data as AuthPayload);
    return payload.data as AuthUser;
  }

  return undefined;
}

async function fetchMe() {
  const response = await api.get<AuthPayload>("/auth/me");
  return extractUser(response.data) ?? response.data;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const me = useQuery({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    enabled: Boolean(getToken()),
  });

  const login = useMutation({
    mutationFn: async (input: LoginInput) => {
      const response = await api.post<AuthPayload>("/auth/login", input);
      const token = extractToken(response.data);

      if (!token) {
        throw new Error("Login berhasil, tapi token tidak ditemukan.");
      }

      setToken(token);
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
      }

      return extractUser(response.data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });

  function logout() {
    removeToken();
    queryClient.removeQueries({ queryKey: authKeys.me });
  }

  return {
    user: me.data,
    isAuthenticated: Boolean(getToken()),
    isLoadingUser: me.isLoading,
    userError: me.error,
    refetchUser: me.refetch,
    login,
    register,
    logout,
  };
}
