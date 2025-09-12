'use server';

import { client } from '@/lib/sanity/client';
import { QUERY_ALL_APARTMENTS, QUERY_ALL_APARTMENTS_FILTERED } from '@/lib/sanity/queries';
import type { ApartmentListFilters } from '@/providers/ApartmentFiltersProvider';
import type { ApartmentData } from '@/types/apartment';

export async function fetchApartments(
  filters?: ApartmentListFilters
): Promise<ApartmentData[]> {
  try {
    if (filters && (filters.city || filters.capacity)) {
      const query = QUERY_ALL_APARTMENTS_FILTERED;
      const params = {
        city: filters.city ?? '',
        capacity: typeof filters.capacity === 'number' ? filters.capacity : undefined,
      };
      const data = await client.fetch<ApartmentData[]>(query, params);
      return data;
    }
    const data = await client.fetch<ApartmentData[]>(QUERY_ALL_APARTMENTS);
    return data;
  } catch (error) {
    console.error('Error fetching apartments:', error);
    return [];
  }
}

