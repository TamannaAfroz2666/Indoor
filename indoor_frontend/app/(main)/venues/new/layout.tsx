import type { ReactNode } from "react";
import { VenueDraftProvider } from "@/features/venue/create/VenueDraftProvider";

export default function NewVenueLayout({ children }: { children: ReactNode }) {
  return <VenueDraftProvider>{children}</VenueDraftProvider>;
}
