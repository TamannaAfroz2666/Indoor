const ACCESS_TOKEN_KEY = "indoor:access-token";
const ACCESS_TOKEN_EXPIRY_KEY = "indoor:access-token-expires-at";

export function getStoredAccessToken() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const expiresAt = localStorage.getItem(ACCESS_TOKEN_EXPIRY_KEY);
  if (!token || !expiresAt || new Date(expiresAt).getTime() <= Date.now()) {
    clearStoredAccessToken();
    return null;
  }
  return token;
}

export function storeAccessToken(token: string, expiresAt: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(ACCESS_TOKEN_EXPIRY_KEY, expiresAt);
}

export function clearStoredAccessToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRY_KEY);
}
