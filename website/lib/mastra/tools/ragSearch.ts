import { QueryResult } from '@mastra/core';
import { UpstashVector } from '@mastra/upstash';
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import type { ApartmentData } from '@/types/apartment';

// Function to get vector store instance
function getVectorStore() {
  return new UpstashVector({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
  });
}

export const ragSearchTool = {
  id: 'rag_search',
  description: 'Search apartments using semantic similarity, except for the city that should be exact or translated in italian',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The search query describing what the user is looking for'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of apartments to return',
        default: 4
      }
    },
    required: ['query']
  },
  execute: async ({ query }: { query: string; }) => {

    console.log('RAG Search -> query:', query);
    try {
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: query
      });

      // Search for similar apartments in the vector store
      const vectorStore = getVectorStore();
      const results = await vectorStore.query({
        indexName: 'apartments',
        queryVector: embedding,
        topK: 5 // Limit results to avoid too many apartments
      });

      // Transform results to apartment format
      // Group chunks by apartment ID to avoid duplicates
      const apartmentMap = new Map<string, ApartmentData>();

      results.forEach((result: QueryResult) => {
        const apartmentId = result.metadata?.apartmentId || result.id.split('_')[0];
        const fullApartment = result.metadata?.fullApartment;

        if (fullApartment && !apartmentMap.has(apartmentId)) {
          apartmentMap.set(apartmentId, {
            _id: fullApartment._id,
            name: fullApartment.name,
            location: fullApartment.location || { city: '', country: '' },
            imageUrl: fullApartment.imageUrl || '',
            currentPrice: fullApartment.currentPrice || null,
            currentCurrency: fullApartment.currentCurrency || null,
            slug: fullApartment.slug || null,
            capacity: fullApartment.capacity || null,
            score: result.score || 0, // Add relevance score
          });
        }
      });

      let apartments: ApartmentData[] = Array.from(apartmentMap.values());

      // Filter by city if the query mentions a specific city
      // Extract city from query by looking for common city patterns
      const queryLower = query.toLowerCase();

      // Look for city mentions in the query using a more flexible approach
      const cityPatterns = [
        /\bin\s+([a-zA-Z]+)\b/g,  // "in Rome", "in Milan"
        /\b([a-zA-Z]+)\s+apartments?\b/g,  // "Rome apartments"
        /\bapartments?\s+in\s+([a-zA-Z]+)\b/g  // "apartments in Rome"
      ];

      let mentionedCity = '';
      for (const pattern of cityPatterns) {
        const match = pattern.exec(queryLower);
        if (match && match[1]) {
          mentionedCity = match[1];
          break;
        }
      }

      if (mentionedCity) {
        apartments = apartments.filter(apt =>
          apt.location?.city?.toLowerCase().includes(mentionedCity) ||
          apt.name?.toLowerCase().includes(mentionedCity)
        );
        console.log(`RAG Search -> Filtered by city "${mentionedCity}", found ${apartments.length} apartments`);
      }

      // Sort by relevance score and limit results
      apartments = apartments
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 5); // Limit to 5 apartments maximum

      return {
        apartments,
        query,
        totalResults: apartments.length
      };
    } catch (error) {
      console.error('RAG search error:', error);
      return {
        apartments: [],
        query,
        error: 'Failed to search apartments'
      };
    }
  }
};

