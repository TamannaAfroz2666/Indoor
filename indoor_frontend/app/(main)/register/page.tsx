"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/auth-api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", accountType: "USER" as "USER" | "VENUE_OWNER" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const set = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try { await authApi.register(form); router.push("/"); router.refresh(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to create account"); }
    finally { setBusy(false); }
  }

  const inputClass = "mt-2 h-11 w-full rounded-md border border-[#d8e1ea] bg-white px-4 text-[15px] outline-none transition focus:border-black focus:ring-1 focus:ring-black";
  return (
    <div className="flex min-h-[calc(100vh-12px)] items-center justify-center bg-[#f3f5f4] px-4 py-10">
      <div className="grid w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl md:h-[670px] md:grid-cols-2">
        <div className="relative hidden min-h-[590px] overflow-hidden bg-[#f8fbf9] md:block">
          <Image src="/images/login.png" alt="Players available nearby" fill priority sizes="450px" className="object-contain object-center" />
        </div>
        <div className="flex items-center overflow-y-auto px-6 py-7 sm:px-10">
          <section className="w-full rounded-xl border border-[#d8e1ea] p-5">
          <h1 className="text-2xl font-semibold text-black">Register</h1><p className="mt-1 text-sm text-[#24344d]">Create a free account.</p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <label className="block text-sm">Name<input required minLength={2} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={inputClass} /></label>
            <label className="block text-sm">Phone number<input required pattern="01[3-9][0-9]{8}" placeholder="01XXXXXXXXX" value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 11))} autoComplete="tel" className={inputClass} /></label>
            <label className="block text-sm">Email<input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" className={inputClass} /></label>
            <label className="block text-sm">Password<input required minLength={8} maxLength={72} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" className={inputClass} /></label>
            <label className="block text-sm">Account type<select value={form.accountType} onChange={(e) => set("accountType", e.target.value)} className={inputClass}><option value="USER">User (book venues)</option><option value="VENUE_OWNER">Venue owner</option></select></label>
            {message && <p role="alert" className="text-sm text-red-600">{message}</p>}
            <button disabled={busy} className="h-10 w-full rounded bg-black text-white hover:bg-[#222] disabled:opacity-60">{busy ? "Creating account..." : "Create account"}</button>
          </form>
          <p className="mt-4 text-sm text-[#24344d]">Already have an account? <Link href="/" className="underline">Sign in</Link></p>
          </section>
        </div>
      </div>
    </div>
  );
}
