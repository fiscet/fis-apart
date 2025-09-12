'use server';

import { client } from '@/lib/sanity/client';
import { QUERY_ALL_APARTMENTS, QUERY_ALL_APARTMENTS_FILTERED } from '@/lib/sanity/queries';
import type { ApartmentListFilters } from '@/providers/ApartmentFiltersProvider';

type ApartmentListItem = {
  _id: string;
  name?: string;
  location?: { city?: string; country?: string };
  imageUrl: string;
  currentPrice: number | null;
  currentCurrency: 'EUR' | 'USD' | 'GBP' | null;
  slug?: string | null;
  capacity?: { minGuests?: number; maxGuests?: number } | null;
};

export async function fetchApartments(
  filters?: ApartmentListFilters
): Promise<ApartmentListItem[]> {
  try {
    if (filters && (filters.city || filters.capacity)) {
      console.log('Fetching apartments with filters:', filters);
      const query = QUERY_ALL_APARTMENTS_FILTERED;
      const params = {
        city: filters.city ?? '',
        capacity: typeof filters.capacity === 'number' ? filters.capacity : undefined,
      };
      console.log('Sanity query:', query);
      console.log('Sanity query params:', params);
      const data = await client.fetch<ApartmentListItem[]>(query, params);
      console.log('Sanity query result:', data);
      return data;
    }
    console.log('Fetching all apartments (no filters)');
    const data = await client.fetch<ApartmentListItem[]>(QUERY_ALL_APARTMENTS);
    console.log('Sanity query result:', data);
    return data;
  } catch (error) {
    console.error('Error fetching apartments:', error);
    return [];
  }
}

