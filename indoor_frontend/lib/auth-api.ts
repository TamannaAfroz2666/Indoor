import { apiRequest } from "./api-client";

export type AuthUser = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  avatar: string | null;
  accountType: "USER" | "VENUE_OWNER";
  emailVerified: boolean;
  phoneVerified: boolean;
};

export type AuthSession = { user: AuthUser; sessionExpiresAt: string };

export const authApi = {
  login: (email: string, password: string) => apiRequest<AuthSession>("/auth/login", { body: { email, password } }),
  register: (data: { name: string; phone: string; email: string; password: string; accountType: "USER" | "VENUE_OWNER" }) =>
    apiRequest<{ user: AuthUser }>("/auth/register", { body: data }),
  me: () => apiRequest<AuthSession>("/auth/me", { method: "GET" }),
  updateAvatar: (avatar: string | null) => apiRequest<{ user: AuthUser }>("/auth/me/avatar", { method: "PATCH", body: { avatar } }),
  updateProfile: (data: { name: string; email: string; avatar: string | null }) =>
    apiRequest<{ user: AuthUser }>("/auth/me", { method: "PATCH", body: data }),
  logout: () => apiRequest<{ message: string }>("/auth/logout"),
};
