"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { authApi, type AuthUser } from "@/lib/auth-api";

export function AccountSettingsPage() {
  const { user, loading, setUser } = useAuth();

  if (loading) return <main className="mx-auto min-h-[60vh] max-w-3xl px-6 py-12 text-[#65736c]">Loading account…</main>;
  if (!user) return <main className="mx-auto min-h-[60vh] max-w-3xl px-6 py-12"><h1 className="text-2xl font-bold">Account Settings</h1><p className="mt-3 text-[#65736c]">Please sign in to manage your account.</p></main>;

  return (
    <ProfileForm
      key={user.id}
      user={user}
      onSaved={setUser}
    />
  );
}

function ProfileForm({ user, onSaved }: { user: AuthUser; onSaved: (user: AuthUser) => void }) {
  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [avatar, setAvatar] = useState<string | null>(user.avatar);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const initials = (name || email || "User")
    .split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const isDirty = name !== (user.name ?? "") || email !== (user.email ?? "") || avatar !== user.avatar;

  function cancel() {
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setAvatar(user.avatar);
    setFeedback(null);
  }

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setFeedback(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFeedback({ type: "error", text: "Choose a JPG, PNG, or WebP image." });
      return;
    }
    if (file.size > 650_000) {
      setFeedback({ type: "error", text: "Profile photo must be smaller than 650 KB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.onerror = () => setFeedback({ type: "error", text: "Unable to read that image." });
    reader.readAsDataURL(file);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setFeedback(null);
    try {
      const { user: updatedUser } = await authApi.updateProfile({ name, email, avatar });
      onSaved(updatedUser);
      setFeedback({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Unable to update profile." });
    } finally {
      setBusy(false);
    }
  }

  const inputClass = "mt-2 h-11 w-full rounded-lg border border-[#d8e1dc] bg-white px-4 text-[15px] text-[#26332d] outline-none transition focus:border-[#16b866] focus:ring-1 focus:ring-[#16b866] disabled:bg-[#f4f6f5]";

  return (
    <main className="mx-auto min-h-[65vh] w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="text-3xl font-bold text-[#26332d]">Account Settings</h1>
      <p className="mt-2 text-[#718078]">Manage your profile photo and account details.</p>
      <form onSubmit={submit} className="mt-8 rounded-2xl border border-[#dce4e0] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-[#26332d]">Profile photo</h2>
        <p className="mt-1 text-sm text-[#718078]">Optional. JPG, PNG, or WebP up to 650 KB.</p>
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8f8f0] text-2xl font-bold text-[#087d47]">
            {avatar ? <Image src={avatar} alt="Profile preview" width={96} height={96} unoptimized className="h-full w-full object-cover" /> : initials}
          </div>
          <div className="flex flex-wrap gap-3">
            <label className={`inline-flex items-center gap-2 rounded-lg bg-[#16b866] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#109a55] ${busy ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
              <Camera size={17} />{avatar ? "Change Photo" : "Upload Photo"}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} disabled={busy} className="sr-only" />
            </label>
            {avatar && <button type="button" disabled={busy} onClick={() => { setAvatar(null); setFeedback(null); }} className="inline-flex items-center gap-2 rounded-lg border border-[#d8e1dc] px-4 py-2.5 text-sm font-semibold text-[#425048] hover:border-red-300 hover:text-red-600 disabled:opacity-50"><Trash2 size={17} />Remove</button>}
          </div>
        </div>

        <div className="mt-8 grid gap-5 border-t border-[#edf1ef] pt-6 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[#34413b]">Name
            <input required minLength={2} maxLength={100} value={name} onChange={(event) => { setName(event.target.value); setFeedback(null); }} disabled={busy} autoComplete="name" className={inputClass} />
          </label>
          <label className="text-sm font-semibold text-[#34413b]">Email
            <input required type="email" value={email} onChange={(event) => { setEmail(event.target.value); setFeedback(null); }} disabled={busy} autoComplete="email" className={inputClass} />
          </label>
        </div>

        {feedback && <p role={feedback.type === "error" ? "alert" : "status"} className={`mt-5 text-sm ${feedback.type === "error" ? "text-red-600" : "text-[#07884a]"}`}>{feedback.text}</p>}

        <div className="mt-7 flex flex-wrap gap-3 border-t border-[#edf1ef] pt-6">
          <button type="submit" disabled={busy || !isDirty} className="rounded-lg bg-[#16b866] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#109a55] disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
          <button type="button" onClick={cancel} disabled={busy || !isDirty} className="rounded-lg border border-[#9ca9a2] bg-white px-5 py-2.5 text-sm font-semibold text-[#34413b] transition hover:bg-[#f3f6f4] disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
        </div>
      </form>
    </main>
  );
}
