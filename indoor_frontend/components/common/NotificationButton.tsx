"use client";

import { useAuth } from "@/features/auth/AuthProvider";
import { NotificationDropdown } from "./NotificationDropdown";

export function NotificationButton() {
  const { user, loading } = useAuth();
  return <NotificationDropdown key={user?.id ?? "guest"} authenticated={!loading && !!user} />;
}
