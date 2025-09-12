export type Currency = 'EUR' | 'USD' | 'GBP';

export interface ApartmentData {
  _id: string;
  name?: string;
  location?: { city?: string; country?: string };
  imageUrl?: string;
  currentPrice?: number | null;
  currentCurrency?: Currency | null;
  slug?: string | null;
  capacity?: { minGuests?: number; maxGuests?: number } | null;
  score?: number | null;
}

// Extended type for RAG indexing with all apartment details
export interface ApartmentDataComplete {
  _id: string;
  name?: string;
  location?: { city?: string; country?: string };
  slug?: string | null;
  imageUrl?: string;
  images?: Array<{
    url: string;
    alt?: string;
    caption?: string;
    isMain?: boolean;
  }>;
  currentPrice?: number | null;
  currentCurrency?: Currency | null;
  capacity?: { minGuests?: number; maxGuests?: number } | null;
  category?: string;
  amenities?: Array<{
    _id: string;
    name: string;
    icon?: string;
  }>;
  description?: string;
}
