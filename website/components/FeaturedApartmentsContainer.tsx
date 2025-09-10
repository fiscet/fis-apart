import { client } from '@/lib/sanity/client';
import { FeaturedApartments } from './FeaturedApartments';
import { QUERY_FEATURED_APARTMENTS } from '@/lib/sanity/queries';

type FeaturedApartmentItem = {
  _id: string;
  name?: string;
  location?: { city?: string; country?: string };
  imageUrl: string;
  currentPrice: number | null;
  currentCurrency: 'EUR' | 'USD' | 'GBP' | null;
  slug?: string | null;
};

export async function FeaturedApartmentsContainer() {
  let items: FeaturedApartmentItem[] = [];
  try {
    items = await client.fetch<FeaturedApartmentItem[]>(QUERY_FEATURED_APARTMENTS);
  } catch {
    items = [];
  }

  return <FeaturedApartments apartments={items} />;
}
