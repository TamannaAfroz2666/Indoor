import { API_URL, apiRequest } from "./api-client";
import type { VenueDraft } from "@/features/venue/create/venue-draft";
import type { Venue, VenueCardData } from "@/features/types/venue-search.types";

export type ApiVenuePhoto = { id: string; name: string; mimeType: string; size: number; url?: string; sortOrder: number };
export type ApiVenue = {
  id: string; name: string; slug: string; venueType: string; description: string; bookingMode: string;
  phone: string; email: string; website?: string | null; businessStatus?: string | null;
  address1: string; address2?: string | null; area: string; city: string; district: string; division: string;
  postalCode?: string | null; country: string; venueSize: number; maximumParticipants: number;
  minimumBookingMinutes: number; maximumBookingMinutes: number; bookingLeadTime: number; advanceBookingDays: number;
  cancellationPolicy: string; houseRules: string; facilities: string[]; environment: string[]; courtTypes: string[];
  highlights: string[]; photos?: ApiVenuePhoto[]; averageRating?: number | null; reviewCount?: number | null;
  featured?: boolean | null;
  createdAt: string;
  updatedAt?: string;
  _count?: { photos: number };
};

const PLACEHOLDER_IMAGE = "/images/venues/1.png";
export const venueThumbnail = (venue: ApiVenue) => venue.photos?.[0]
  ? venue.photos[0].url || `${API_URL}/venues/${encodeURIComponent(venue.id)}/thumbnail`
  : PLACEHOLDER_IMAGE;
const compactAddress = (parts: Array<string | null | undefined>) =>
  parts.map((part) => part?.trim()).filter(Boolean).join(", ");

export function toVenueCard(venue: ApiVenue): VenueCardData {
  return {
    id: venue.id,
    name: venue.name,
    address: compactAddress([venue.address1, venue.address2, venue.area, venue.city]),
    distance: null,
    rating: typeof venue.averageRating === "number" ? venue.averageRating : null,
    reviewCount: typeof venue.reviewCount === "number" ? venue.reviewCount : null,
    image: venueThumbnail(venue),
    featured: venue.featured === true,
    bookable: venue.bookingMode.toLowerCase().includes("online"),
    extraSports: venue.courtTypes.length > 1 ? venue.courtTypes.length - 1 : undefined,
    sports: venue.courtTypes,
  };
}

export function toVenueDetails(venue: ApiVenue): Venue {
  return {
    id: venue.id,
    name: venue.name,
    area: venue.area,
    city: venue.city,
    rating: venue.averageRating ?? 0,
    totalRatings: venue.reviewCount ?? 0,
    description: venue.description,
    images: venue.photos?.length ? venue.photos.map((photo) => photo.url).filter((url): url is string => Boolean(url)) : [PLACEHOLDER_IMAGE],
    featured: venue.featured === true,
    openingHours: "Contact venue for availability",
    address: compactAddress([venue.address1, venue.address2, venue.area, venue.city, venue.district, venue.division, venue.postalCode, venue.country]),
    sports: venue.courtTypes.map((name, index) => ({ id: `${venue.id}-${index}`, name, pricePerHour: 0 })),
    amenities: [...venue.facilities, ...venue.environment, ...venue.highlights],
  };
}

export const venueApi = {
  getAll: (signal?: AbortSignal) => apiRequest<{ venues: ApiVenue[]; count: number }>("/venues", { method: "GET", signal, cache: "no-store" }),
  getMine: (signal?: AbortSignal) => apiRequest<{ venues: ApiVenue[]; count: number }>("/venues/mine", { method: "GET", signal, cache: "no-store" }),
  getById: (id: string, signal?: AbortSignal) => apiRequest<{ venue: ApiVenue }>(`/venues/${encodeURIComponent(id)}`, { method: "GET", signal, cache: "no-store" }),
  create: (draft: VenueDraft) => apiRequest<{ venue: ApiVenue }>("/venues", {
    method: "POST",
    body: {
      basicInfo: { ...draft.basicInfo },
      location: { ...draft.location },
      details: { ...draft.details },
      amenities: {
        facilities: [...draft.amenities.facilities],
        environment: [...draft.amenities.environment],
        courtTypes: [...draft.amenities.courtTypes],
        highlights: [...draft.amenities.highlights],
      },
      photos: draft.photos.map(({ name, type, size, preview }) => ({ name, type, size, preview })),
    },
  }),
};
