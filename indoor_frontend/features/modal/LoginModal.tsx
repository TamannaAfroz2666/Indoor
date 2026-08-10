"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { authApi } from "@/lib/auth-api";
import type { LoginPrefill } from "@/lib/registration-login-prefill";
import { useAuth } from "@/features/auth/AuthProvider";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  initialCredentials?: LoginPrefill | null;
};

function messageFor(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export function LoginModal({ isOpen, onClose, onLoginSuccess, initialCredentials }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <OpenLoginModal
      initialCredentials={initialCredentials}
      onClose={onClose}
      onLoginSuccess={onLoginSuccess}
    />
  );
}

type OpenLoginModalProps = Omit<LoginModalProps, "isOpen">;

function OpenLoginModal({ onClose, onLoginSuccess, initialCredentials }: OpenLoginModalProps) {
  const { setUser } = useAuth();
  const [email, setEmail] = useState(initialCredentials?.email ?? "");
  const [password, setPassword] = useState(initialCredentials?.password ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleEscape); };
  }, [onClose]);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const { user } = await authApi.login(email, password);
      setUser(user);
      onLoginSuccess?.(); onClose();
    } catch (error) { setMessage(messageFor(error)); }
    finally { setBusy(false); }
  }

  const inputClass = "h-11 w-full rounded-md border border-[#d8e1ea] px-4 text-[15px] outline-none transition focus:border-[#111827] focus:ring-1 focus:ring-[#111827]";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="login-modal-title" onMouseDown={(event) => event.stopPropagation()} className="relative grid w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2">
        <div className="relative hidden min-h-[590px] overflow-hidden bg-[#f8fbf9] md:block">
          <Image src="/images/login.png" alt="Players available nearby" fill priority sizes="450px" className="object-contain object-center" />
        </div>
        <div className="flex items-center px-6 py-10 sm:px-10">
          <div className="w-full rounded-xl border border-[#d8e1ea] p-5 sm:p-7">
            <div className="flex items-start justify-between">
              <div><h2 id="login-modal-title" className="text-2xl font-semibold text-black">Sign in</h2><p className="mt-1 text-sm text-[#24344d]">Sign in to request bookings and manage your account.</p></div>
              <button type="button" onClick={onClose} aria-label="Close login modal" className="-mr-2 -mt-2 flex h-9 w-9 items-center justify-center rounded-full text-[#4c5a54] hover:bg-[#f1f4f2]"><X size={23} /></button>
            </div>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block text-sm text-black">Email<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} mt-2`} /></label>
              <label className="block text-sm text-black">Password<input required minLength={8} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} mt-2`} /></label>
              {message && <p role="alert" className="text-sm text-red-600">{message}</p>}
              <button disabled={busy} className="h-10 w-full rounded bg-black text-white transition hover:bg-[#222] disabled:opacity-60">{busy ? "Signing in..." : "Sign in"}</button>
            </form>
            <p className="mt-4 text-sm text-[#24344d]">Don&apos;t have an account? <Link href="/register" onClick={onClose} className="underline">Register</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
