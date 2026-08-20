"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { emptyVenueDraft, VENUE_DRAFT_STORAGE_KEY, type VenueDraft } from "./venue-draft";

type Section = keyof VenueDraft;
type DraftContextValue = {
  draft: VenueDraft;
  hydrated: boolean;
  updateSection: <K extends Section>(section: K, value: VenueDraft[K]) => void;
  applyContactPrefill: (phone: string | null, email: string | null) => void;
  resetDraft: () => void;
};

const DraftContext = createContext<DraftContextValue | null>(null);

export function VenueDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<VenueDraft>(emptyVenueDraft);
  const [hydrated, setHydrated] = useState(false);
  const skipNextPersist = useRef(false);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(VENUE_DRAFT_STORAGE_KEY);
        if (saved) { const parsed = JSON.parse(saved); setDraft({ ...emptyVenueDraft, ...parsed, spaces: parsed.spaces ?? [] } as VenueDraft); }
      } catch { localStorage.removeItem(VENUE_DRAFT_STORAGE_KEY); }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipNextPersist.current) { skipNextPersist.current = false; return; }
    const serializableDraft = {
      ...draft,
      photos: draft.photos.map((photo) => ({ ...photo, preview: "" })),
    };
    try { localStorage.setItem(VENUE_DRAFT_STORAGE_KEY, JSON.stringify(serializableDraft)); }
    catch { /* Keep the in-memory draft if browser storage is full or unavailable. */ }
  }, [draft, hydrated]);

  function updateSection<K extends Section>(section: K, value: VenueDraft[K]) {
    setDraft((current) => ({ ...current, [section]: value }));
  }

  function applyContactPrefill(phone: string | null, email: string | null) {
    setDraft((current) => {
      if (current.contactPrefillApplied) return current;
      return {
        ...current,
        contactPrefillApplied: true,
        basicInfo: {
          ...current.basicInfo,
          phone: current.basicInfo.phone || phone || "",
          email: current.basicInfo.email || email || "",
        },
      };
    });
  }

  function resetDraft() {
    localStorage.removeItem(VENUE_DRAFT_STORAGE_KEY);
    skipNextPersist.current = true;
    setDraft(emptyVenueDraft);
  }

  const value = useMemo(() => ({ draft, hydrated, updateSection, applyContactPrefill, resetDraft }), [draft, hydrated]);
  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useVenueDraft() {
  const value = useContext(DraftContext);
  if (!value) throw new Error("useVenueDraft must be used inside VenueDraftProvider");
  return value;
}
