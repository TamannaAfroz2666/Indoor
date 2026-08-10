"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { authApi } from "@/lib/auth-api";

export function AccountSettingsPage() {
  const { user, loading, setUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const initials = (user?.name || user?.email || "User")
    .split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  async function saveAvatar(avatar: string | null) {
    setBusy(true);
    setMessage("");
    try {
      const { user: updatedUser } = await authApi.updateAvatar(avatar);
      setUser(updatedUser);
      setMessage(avatar ? "Profile photo updated." : "Profile photo removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update profile photo");
    } finally {
      setBusy(false);
    }
  }

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("Choose a JPG, PNG, or WebP image.");
      return;
    }
 
    const reader = new FileReader();
    reader.onload = () => saveAvatar(String(reader.result));
    reader.onerror = () => setMessage("Unable to read that image.");
    reader.readAsDataURL(file);
  }

  if (loading) return <main className="mx-auto min-h-[60vh] max-w-3xl px-6 py-12 text-[#65736c]">Loading account…</main>;
  if (!user) return <main className="mx-auto min-h-[60vh] max-w-3xl px-6 py-12"><h1 className="text-2xl font-bold">Account Settings</h1><p className="mt-3 text-[#65736c]">Please sign in to manage your account.</p></main>;

  return (
    <main className="mx-auto min-h-[65vh] w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold text-[#26332d]">Account Settings</h1>
      <p className="mt-2 text-[#718078]">Manage your profile photo and account details.</p>
      <section className="mt-8 rounded-2xl border border-[#dce4e0] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-[#26332d]">Profile photo</h2>
        <p className="mt-1 text-sm text-[#718078]">Optional. JPG, PNG, or WebP up to 650 KB.</p>
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8f8f0] text-2xl font-bold text-[#087d47]">
            {user.avatar ? <Image src={user.avatar} alt="Profile" width={96} height={96} unoptimized className="h-full w-full object-cover" /> : initials}
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#16b866] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#109a55]">
              <Camera size={17} />{user.avatar ? "Change photo" : "Upload photo"}
              <input type="file" accept="image/jpeg,image/png,image/webp"
               onChange={choosePhoto} disabled={busy}
                className="sr-only" />
            </label>
            {user.avatar && <button type="button" disabled={busy} onClick={() => saveAvatar(null)} className="inline-flex items-center gap-2 rounded-lg border border-[#d8e1dc] px-4 py-2.5 text-sm font-semibold text-[#425048] hover:border-red-300 hover:text-red-600 disabled:opacity-50"><Trash2 size={17} />Remove</button>}
          </div>
        </div>
        {message && <p role="status" className="mt-4 text-sm text-[#52635a]">{message}</p>}
        <div className="mt-8 grid gap-4 border-t border-[#edf1ef] pt-6 sm:grid-cols-2">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-[#829087]">Name</p><p className="mt-1 text-[#26332d]">{user.name || "—"}</p></div>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-[#829087]">Email</p><p className="mt-1 text-[#26332d]">{user.email || "—"}</p></div>
        </div>
      </section>
    </main>
  );
}
