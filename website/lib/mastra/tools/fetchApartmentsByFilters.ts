import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { fetchApartments } from '@/lib/sanity/actions';

export const fetchApartmentsByFilters = createTool({
  id: 'fetchApartmentsByFilters',
  description: 'Fetch apartments from Sanity using provided filters.',
  inputSchema: z.object({
    city: z.string().optional(),
    capacity: z.number().optional(),
    checkin: z.string().optional(),
    checkout: z.string().optional(),
  }),
  execute: async ({
    context,
  }: {
    context: { city?: string; capacity?: number; checkin?: string; checkout?: string };
  }) => {
    console.log('Tool: fetchApartmentsByFilters received context:', context);
    const apartments = await fetchApartments({
      city: context.city,
      capacity: context.capacity,
      checkin: context.checkin,
      checkout: context.checkout,
    });
    console.log('Tool: fetchApartmentsByFilters returning apartments:', apartments);
    return { apartments };
  },
});
