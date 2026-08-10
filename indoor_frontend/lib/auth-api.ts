const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, options?: { method?: string; body?: object }): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options?.method ?? "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
  const payload: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof payload === "object" && payload !== null && "error" in payload
      ? String(payload.error) : "Authentication request failed";
    throw new Error(message);
  }
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

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

export const authApi = {
  login: (email: string, password: string) => request<{ user: AuthUser }>("/auth/login", { body: { email, password } }),
  register: (data: { name: string; phone: string; email: string; password: string; accountType: "USER" | "VENUE_OWNER" }) =>
    request<{ user: AuthUser }>("/auth/register", { body: data }),
  me: () => request<{ user: AuthUser }>("/auth/me", { method: "GET" }),
  updateAvatar: (avatar: string | null) => request<{ user: AuthUser }>("/auth/me/avatar", { method: "PATCH", body: { avatar } }),
  updateProfile: (data: { name: string; email: string; avatar: string | null }) =>
    request<{ user: AuthUser }>("/auth/me", { method: "PATCH", body: data }),
  logout: () => request<{ message: string }>("/auth/logout"),
};
