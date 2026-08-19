import { apiRequest } from "./api-client";
import { clearStoredAccessToken, storeAccessToken } from "./auth-token";

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

export type AuthSession = { user: AuthUser; sessionExpiresAt: string; token?: string };

export const authApi = {
  login: async (email: string, password: string) => {
    const session = await apiRequest<AuthSession>("/auth/login", { body: { email, password } });
    if (session.token) storeAccessToken(session.token, session.sessionExpiresAt);
    return session;
  },
  register: (data: { name: string; phone: string; email: string; password: string; accountType: "USER" | "VENUE_OWNER" }) =>
    apiRequest<{ user: AuthUser }>("/auth/register", { body: data }),
  me: async () => {
    const session = await apiRequest<AuthSession>("/auth/me", { method: "GET" });
    if (session.token) storeAccessToken(session.token, session.sessionExpiresAt);
    return session;
  },
  updateAvatar: (avatar: string | null) => apiRequest<{ user: AuthUser }>("/auth/me/avatar", { method: "PATCH", body: { avatar } }),
  updateProfile: (data: { name: string; email: string; avatar: string | null }) =>
    apiRequest<{ user: AuthUser }>("/auth/me", { method: "PATCH", body: data }),
  logout: async () => {
    try { return await apiRequest<{ message: string }>("/auth/logout"); }
    finally { clearStoredAccessToken(); }
  },
};
