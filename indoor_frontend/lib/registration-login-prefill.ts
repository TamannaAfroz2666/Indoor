export type LoginPrefill = {
  email: string;
  password: string;
};

// Intentionally kept only in this JavaScript module's memory. The value survives
// the client-side route transition from registration, but not a reload or a new
// browser visit, and is removed as soon as the login UI consumes it.
let pendingLoginPrefill: LoginPrefill | null = null;

export function setRegistrationLoginPrefill(prefill: LoginPrefill) {
  pendingLoginPrefill = prefill;
}

export function getRegistrationLoginPrefill() {
  return pendingLoginPrefill;
}

export function clearRegistrationLoginPrefill() {
  pendingLoginPrefill = null;
}
