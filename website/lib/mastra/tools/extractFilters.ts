import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import type { ApartmentListFilters } from '@/providers/ApartmentFiltersProvider';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const FilterExtractionSchema = z.object({
  city: z.string().optional().describe('City or location name'),
  checkin: z.string().optional().describe('Check-in date in any format'),
  checkout: z.string().optional().describe('Check-out date in any format'),
  capacity: z.number().optional().describe('Number of guests/capacity'),
  minPrice: z.number().optional().describe('Minimum price in euros'),
  maxPrice: z.number().optional().describe('Maximum price in euros'),
  extractedInfo: z.string().describe('Summary of what was extracted'),
});

export const extractFiltersTool = createTool({
  id: 'extractFilters',
  description: 'Extract apartment search filters from conversation context and user input using AI.',
  inputSchema: z.object({
    userInput: z.string().describe('The current user input or message'),
    conversationContext: z.string().optional().describe('Additional context from the conversation'),
  }),
  execute: async ({
    context,
  }: {
    context: { userInput: string; conversationContext?: string };
  }): Promise<{ filters: Partial<ApartmentListFilters>; extractedInfo: string }> => {
    console.log('ExtractFilters -> Processing with AI:', context);

    const { userInput, conversationContext = '' } = context;
    const fullContext = `${conversationContext} ${userInput}`.trim();

    try {
      const result = await generateObject({
        model: openai(DEFAULT_MODEL),
        schema: FilterExtractionSchema,
        prompt: `Extract apartment search filters from this user input. Be smart about understanding natural language.

User input: "${fullContext}"

Extract the following information if mentioned:
- City/location (any city name, be flexible with variations)
- Check-in date (any date format, convert to a standard format)
- Check-out date (any date format, convert to a standard format)
- Number of guests/capacity (look for "2 people", "for 4 guests", etc.)
- Price range (look for "under 200€", "between 100-300", "max 150", etc.)

Be intelligent about:
- Understanding different ways people express dates ("September 15th", "15/09", "next week", etc.)
- Recognizing city names even with typos or variations
- Interpreting capacity from various phrasings
- Understanding price constraints and ranges

Return only the information that is clearly mentioned or strongly implied. Don't make assumptions.

Current date context: ${new Date().toISOString().split('T')[0]}`,
      });

      const extracted = result.object;

      // Convert to the expected filter format
      const filters: Partial<ApartmentListFilters> = {};

      if (extracted.city) {
        filters.city = extracted.city.toLowerCase().trim();
      }
      if (extracted.checkin) {
        filters.checkin = extracted.checkin;
      }
      if (extracted.checkout) {
        filters.checkout = extracted.checkout;
      }
      if (extracted.capacity) {
        filters.capacity = extracted.capacity;
      }
      if (extracted.minPrice) {
        filters.minPrice = extracted.minPrice;
      }
      if (extracted.maxPrice) {
        filters.maxPrice = extracted.maxPrice;
      }

      console.log('ExtractFilters -> AI extracted:', extracted);
      console.log('ExtractFilters -> Final filters:', filters);

      return {
        filters,
        extractedInfo: extracted.extractedInfo || 'No specific information extracted'
      };
    } catch (error) {
      console.error('ExtractFilters -> AI extraction failed:', error);

      // Fallback to empty result if AI fails
      return {
        filters: {},
        extractedInfo: 'Failed to extract information'
      };
    }
  },
});
