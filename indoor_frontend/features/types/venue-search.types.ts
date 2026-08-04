export type VenueTypeValue = "turf" | "event-space";

export type VenueTypeOption = {
  label: string;
  value: VenueTypeValue;
};

export type VenueCardData = {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  reviewCount: number;
  image: string;
  featured: boolean;
  bookable: boolean;
  extraSports?: number;
};