import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { embed } from "ai";
import { UpstashVector } from "@mastra/upstash";
import type { ApartmentData } from '@/types/apartment';
import type { ApartmentListFilters } from '@/providers/ApartmentFiltersProvider';

export const searchApartmentsWithFiltersTool = createTool({
  id: 'searchApartmentsWithFilters',
  description: 'Search for apartments using extracted filters including city, capacity, dates, and price range.',
  inputSchema: z.object({
    filters: z.object({
      city: z.string().optional(),
      capacity: z.number().optional(),
      checkin: z.string().optional(),
      checkout: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
    }).describe('The extracted apartment search filters'),
    query: z.string().optional().describe('Additional search query for semantic search'),
  }),
  execute: async ({
    context,
  }: {
    context: { filters: Partial<ApartmentListFilters>; query?: string };
  }): Promise<{ apartments: ApartmentData[]; totalResults: number; appliedFilters: string[] }> => {
    console.log('SearchApartmentsWithFilters -> Processing filters:', context.filters);

    const { filters, query = '' } = context;
    const appliedFilters: string[] = [];

    try {
      // Create search query based on filters
      let searchQuery = query;
      if (filters.city) {
        searchQuery += ` apartment in ${filters.city}`;
        appliedFilters.push(`City: ${filters.city}`);
      }
      if (filters.capacity) {
        searchQuery += ` for ${filters.capacity} guests`;
        appliedFilters.push(`Guests: ${filters.capacity}`);
      }
      if (filters.checkin) {
        searchQuery += ` check-in ${filters.checkin}`;
        appliedFilters.push(`Check-in: ${filters.checkin}`);
      }
      if (filters.checkout) {
        searchQuery += ` check-out ${filters.checkout}`;
        appliedFilters.push(`Check-out: ${filters.checkout}`);
      }
      if (filters.minPrice || filters.maxPrice) {
        if (filters.minPrice && filters.maxPrice) {
          searchQuery += ` price ${filters.minPrice}-${filters.maxPrice} euros`;
          appliedFilters.push(`Price: ${filters.minPrice}-${filters.maxPrice}€`);
        } else if (filters.maxPrice) {
          searchQuery += ` under ${filters.maxPrice} euros`;
          appliedFilters.push(`Max price: ${filters.maxPrice}€`);
        } else if (filters.minPrice) {
          searchQuery += ` over ${filters.minPrice} euros`;
          appliedFilters.push(`Min price: ${filters.minPrice}€`);
        }
      }

      // If no specific query, create a general apartment search
      if (!searchQuery.trim()) {
        searchQuery = 'apartments accommodation';
      }

      console.log('SearchApartmentsWithFilters -> Search query:', searchQuery);

      // Generate embedding for semantic search
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: searchQuery
      });

      // Search in vector store
      const vectorStore = new UpstashVector({
        url: process.env.UPSTASH_VECTOR_REST_URL!,
        token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
      });

      const results = await vectorStore.query({
        indexName: 'apartments',
        queryVector: embedding,
        topK: 20 // Get more results to filter
      });

      console.log('SearchApartmentsWithFilters -> Vector search results:', results.length);

      // Debug: Log first result metadata
      if (results.length > 0) {
        console.log('SearchApartmentsWithFilters -> First result metadata:', JSON.stringify(results[0].metadata, null, 2));
      }

      // Transform and filter results
      const apartmentMap = new Map<string, ApartmentData>();

      results.forEach((result: any) => {
        const apartmentId = result.metadata?.apartmentId || result.id.split('_')[0];
        const metadata = result.metadata;

        console.log('SearchApartmentsWithFilters -> Processing result:', {
          apartmentId,
          hasMetadata: !!metadata,
          metadataKeys: metadata ? Object.keys(metadata) : [],
          location: metadata?.location,
          hasFullApartment: !!metadata?.fullApartment
        });

        if (metadata && !apartmentMap.has(apartmentId)) {
          // Try both metadata structures
          const apartmentData = metadata.fullApartment || metadata;

          const apartment = {
            _id: apartmentData._id,
            name: apartmentData.name,
            location: apartmentData.location || { city: '', country: '' },
            imageUrl: apartmentData.imageUrl || '',
            currentPrice: apartmentData.currentPrice || null,
            currentCurrency: apartmentData.currentCurrency || null,
            slug: apartmentData.slug || null,
            capacity: apartmentData.capacity || null,
            score: result.score || 0,
          };

          console.log('SearchApartmentsWithFilters -> Created apartment:', apartment);
          apartmentMap.set(apartmentId, apartment);
        }
      });

      let apartments: ApartmentData[] = Array.from(apartmentMap.values());

      console.log('SearchApartmentsWithFilters -> Before filtering:', apartments.length, 'apartments');
      if (apartments.length > 0) {
        console.log('SearchApartmentsWithFilters -> First apartment:', JSON.stringify(apartments[0], null, 2));
      }

      // Apply filters
      if (filters.city) {
        const cityLower = filters.city.toLowerCase();
        console.log('SearchApartmentsWithFilters -> Filtering by city:', cityLower);
        console.log('SearchApartmentsWithFilters -> Apartments before city filter:', apartments.map(apt => ({
          name: apt.name,
          location: apt.location,
          city: apt.location?.city
        })));

        apartments = apartments.filter(apt => {
          const cityMatch = apt.location?.city?.toLowerCase().includes(cityLower);
          const nameMatch = apt.name?.toLowerCase().includes(cityLower);
          console.log('SearchApartmentsWithFilters -> Apartment filter check:', {
            name: apt.name,
            city: apt.location?.city,
            cityMatch,
            nameMatch,
            passes: cityMatch || nameMatch
          });
          return cityMatch || nameMatch;
        });
        console.log('SearchApartmentsWithFilters -> After city filter:', apartments.length, 'apartments');
      }

      if (filters.capacity) {
        apartments = apartments.filter(apt => {
          if (!apt.capacity) return false;
          const minGuests = apt.capacity.minGuests || 0;
          const maxGuests = apt.capacity.maxGuests || 999;
          return filters.capacity! >= minGuests && filters.capacity! <= maxGuests;
        });
        console.log('SearchApartmentsWithFilters -> After capacity filter:', apartments.length, 'apartments');
      }

      // Calculate date-based pricing if dates are provided
      if (filters.checkin && filters.checkout) {
        try {
          const checkinDate = new Date(filters.checkin);
          const checkoutDate = new Date(filters.checkout);
          const nights = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));

          if (nights > 0) {
            // Add calculated total price to each apartment
            apartments = apartments.map(apt => ({
              ...apt,
              calculatedTotalPrice: apt.currentPrice ? apt.currentPrice * nights : null,
              nights: nights
            }));

            appliedFilters.push(`Stay: ${nights} nights (${filters.checkin} to ${filters.checkout})`);
            console.log('SearchApartmentsWithFilters -> Added date-based pricing for', nights, 'nights');
          }
        } catch (dateError) {
          console.warn('SearchApartmentsWithFilters -> Invalid date format:', dateError);
        }
      }

      // Apply price filters (using calculated total price if available, otherwise per-night price)
      if (filters.minPrice) {
        apartments = apartments.filter(apt => {
          const price = apt.calculatedTotalPrice || apt.currentPrice;
          return price && price >= filters.minPrice!;
        });
        console.log('SearchApartmentsWithFilters -> After min price filter:', apartments.length, 'apartments');
      }

      if (filters.maxPrice) {
        apartments = apartments.filter(apt => {
          const price = apt.calculatedTotalPrice || apt.currentPrice;
          return price && price <= filters.maxPrice!;
        });
        console.log('SearchApartmentsWithFilters -> After max price filter:', apartments.length, 'apartments');
      }

      // Sort by relevance score and limit results
      apartments = apartments
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10); // Limit to 10 results

      console.log('SearchApartmentsWithFilters -> Final results:', apartments.length, 'apartments');
      console.log('SearchApartmentsWithFilters -> Applied filters:', appliedFilters);

      return {
        apartments,
        totalResults: apartments.length,
        appliedFilters
      };
    } catch (error) {
      console.error('SearchApartmentsWithFilters -> Error:', error);
      return {
        apartments: [],
        totalResults: 0,
        appliedFilters: ['Error occurred during search']
      };
    }
  },
});
