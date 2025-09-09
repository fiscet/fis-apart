export type Currency = "EUR" | "USD" | "GBP";

export interface ApartmentData {
  _id: string;
  name?: string;
  location?: { city?: string; country?: string; };
  imageUrl?: string;
  currentPrice?: number | null;
  currentCurrency?: Currency | null;
  slug?: string | null;
  capacity?: { minGuests?: number; maxGuests?: number; } | null;
}
