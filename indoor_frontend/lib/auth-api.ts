const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, body?: object): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof payload === "object" && payload !== null && "error" in payload
      ? String(payload.error) : "Authentication request failed";
    throw new Error(message);
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
  login: (email: string, password: string) => request<{ user: AuthUser }>("/auth/login", { email, password }),
  register: (data: { name: string; phone: string; email: string; password: string; accountType: "USER" | "VENUE_OWNER" }) =>
    request<{ user: AuthUser }>("/auth/register", data),
  logout: () => request<{ message: string }>("/auth/logout"),
};
