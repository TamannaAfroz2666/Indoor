export const VENUE_DRAFT_STORAGE_KEY = "indoor:venue-draft:v1";

export const venueSteps = [
  { slug: "basic-info", label: "Basic Info" },
  { slug: "location", label: "Location" },
  { slug: "details", label: "Details" },
  { slug: "amenities", label: "Amenities" },
  { slug: "photos", label: "Photos" },
  { slug: "review", label: "Review" },
] as const;

export type VenueStep = (typeof venueSteps)[number]["slug"];
export type DraftPhoto = { id: string; name: string; type: string; size: number; preview: string };

export type VenueDraft = {
  contactPrefillApplied: boolean;
  basicInfo: {
    venueName: string; venueType: string; description: string; bookingMode: string;
    phone: string; email: string; website: string; businessStatus: string;
  };
  location: {
    address1: string; address2: string; area: string; city: string; district: string;
    division: string; postalCode: string; country: string;
  };
  details: {
    venueSize: string; maximumParticipants: string; minimumBookingMinutes: string;
    maximumBookingMinutes: string; bookingLeadTime: string; advanceBookingDays: string;
    cancellationPolicy: string; houseRules: string;
  };
  amenities: {
    facilities: string[]; environment: string[]; courtTypes: string[]; highlights: string[];
  };
  spaces: Array<{ name: string; sport: string; hourlyRate: string }>;
  photos: DraftPhoto[];
};

export const emptyVenueDraft: VenueDraft = {
  contactPrefillApplied: false,
  basicInfo: { venueName: "", venueType: "", description: "", bookingMode: "", phone: "", email: "", website: "", businessStatus: "" },
  location: { address1: "", address2: "", area: "", city: "", district: "", division: "", postalCode: "", country: "Bangladesh" },
  details: { venueSize: "", maximumParticipants: "", minimumBookingMinutes: "", maximumBookingMinutes: "", bookingLeadTime: "", advanceBookingDays: "", cancellationPolicy: "", houseRules: "" },
  amenities: { facilities: [], environment: [], courtTypes: [], highlights: [] },
  spaces: [],
  photos: [],
};

export type ValidationErrors = Record<string, string>;

const required = (value: string, label: string) => value.trim() ? "" : `${label} is required.`;
const positive = (value: string, label: string) => Number(value) > 0 ? "" : `${label} must be greater than zero.`;

export function validateStep(step: VenueStep, draft: VenueDraft): ValidationErrors {
  const errors: ValidationErrors = {};
  const add = (key: string, message: string) => { if (message) errors[key] = message; };

  if (step === "basic-info") {
    const data = draft.basicInfo;
    add("venueName", required(data.venueName, "Venue name"));
    add("venueType", required(data.venueType, "Venue type"));
    add("description", required(data.description, "Description"));
    add("bookingMode", required(data.bookingMode, "Booking mode"));
    add("phone", required(data.phone, "Phone number"));
    add("email", required(data.email, "Email address"));
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) add("email", "Enter a valid email address.");
    if (data.website && !/^https?:\/\//i.test(data.website)) add("website", "Website must begin with http:// or https://.");
  }
  if (step === "location") {
    const data = draft.location;
    (["address1", "area", "city", "district", "division", "country"] as const).forEach((key) =>
      add(key, required(data[key], ({ address1: "Address line 1", area: "Area", city: "City", district: "District", division: "Division", country: "Country" })[key])));
  }
  if (step === "details") {
    const data = draft.details;
    (["venueSize", "maximumParticipants", "minimumBookingMinutes", "maximumBookingMinutes", "bookingLeadTime", "advanceBookingDays"] as const)
      .forEach((key) => add(key, positive(data[key], ({ venueSize: "Venue size", maximumParticipants: "Maximum participants", minimumBookingMinutes: "Minimum booking minutes", maximumBookingMinutes: "Maximum booking minutes", bookingLeadTime: "Booking lead time", advanceBookingDays: "Advance booking days" })[key])));
    if (Number(data.maximumBookingMinutes) < Number(data.minimumBookingMinutes)) add("maximumBookingMinutes", "Maximum booking time cannot be less than the minimum.");
    add("cancellationPolicy", required(data.cancellationPolicy, "Cancellation policy"));
    add("houseRules", required(data.houseRules, "House rules"));
  }
  if (step === "amenities") {
    if (!draft.amenities.facilities.length) add("facilities", "Select at least one sports facility.");
    if (!draft.amenities.environment.length) add("environment", "Select indoor or outdoor.");
    if (!draft.amenities.courtTypes.length) add("courtTypes", "Select at least one court type.");
    if (!draft.spaces.length) add("spaces", "Add at least one bookable court or space.");
    draft.spaces.forEach((space, index) => {
      if (!space.name.trim()) add(`space-${index}-name`, "Space name is required.");
      if (!space.sport || !draft.amenities.courtTypes.includes(space.sport)) add(`space-${index}-sport`, "Select a listed court type.");
      if (!Number.isInteger(Number(space.hourlyRate)) || Number(space.hourlyRate) <= 0) add(`space-${index}-rate`, "Enter a positive whole-number hourly rate.");
    });
  }
  if (step === "photos" && !draft.photos.length) add("photos", "Add at least one venue photo.");
  return errors;
}

export function validateDraft(draft: VenueDraft) {
  return venueSteps.slice(0, 5).reduce<ValidationErrors>((all, step) => ({ ...all, ...validateStep(step.slug, draft) }), {});
}
