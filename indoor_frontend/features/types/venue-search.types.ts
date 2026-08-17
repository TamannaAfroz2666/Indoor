export type VenueTypeValue = "turf" | "event-space";

export type VenueTypeOption = {
  label: string;
  value: VenueTypeValue;
};

export type VenueCardData = {
  id: string;
  name: string;
  address: string;
  distance: number | null;
  rating: number | null;
  reviewCount: number | null;
  image: string;
  featured: boolean;
  bookable: boolean;
  extraSports?: number;
  sports?: string[];
};

// for venue deails page start

export type VenueSport = {
  id: string;
  name: string;
  pricePerHour: number;
};

export type Venue = {
  id: string;
  name: string;
  area: string;
  city: string;
  rating: number;
  totalRatings: number;
  description: string;
  images: string[];
  featured: boolean;
  openingHours: string;
  address: string;
  mapEmbedUrl?: string;
  sports: VenueSport[];
  amenities: string[];
};

// for venue deails page end
