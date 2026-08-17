export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: object;
  signal?: AbortSignal;
  cache?: RequestCache;
};

export async function apiRequest<T>(path: string, options?: RequestOptions): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options?.method ?? "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    signal: options?.signal,
    cache: options?.cache,
  });
  const payload: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    let message = "The request could not be completed";
    if (typeof payload === "object" && payload !== null) {
      if ("error" in payload) message = String(payload.error);
      else if ("errors" in payload && Array.isArray(payload.errors)) {
        const first = payload.errors[0];
        if (typeof first === "object" && first !== null && "message" in first) message = String(first.message);
      }
    }
    throw new Error(message);
  }
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}
