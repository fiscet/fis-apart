'use server';

import { client } from '@/lib/sanity/client';
import { QUERY_ALL_APARTMENTS, QUERY_ALL_APARTMENTS_FILTERED, QUERY_APARTMENTS_FOR_RAG } from '@/lib/sanity/queries';
import type { ApartmentListFilters } from '@/providers/ApartmentFiltersProvider';
import type { ApartmentDataComplete } from '@/types/apartment';

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

export async function saveChatMessage(input: {
  sessionId: string;
  role: 'user' | 'assistant';
  message?: string;
  context?: unknown;
  result?: unknown;
}): Promise<void> {
  try {
    const existing = await client.fetch<{ _id: string } | null>(
      '*[_type == "chatWithAgents" && sessionId == $sessionId][0]{ _id }',
      { sessionId: input.sessionId }
    );

    const chatItem = {
      _type: 'chatItem',
      _key: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: input.role,
      message: input.message,
      context: input.context ? JSON.stringify(input.context) : undefined,
      result: input.result ? JSON.stringify(input.result) : undefined,
    } as const;

    if (existing?._id) {
      await client
        .patch(existing._id)
        .setIfMissing({ messages: [] })
        .append('messages', [chatItem])
        .commit();
      return;
    }

    await client.create({
      _type: 'chatWithAgents',
      sessionId: input.sessionId,
      messages: [chatItem],
    });
  } catch (error) {
    console.error('Failed to save chat message:', error);
  }
}

export async function getApartmentsForRAG(): Promise<ApartmentDataComplete[]> {
  try {
    console.log('Fetching apartments for RAG indexing...');
    const data = await client.fetch<ApartmentDataComplete[]>(QUERY_APARTMENTS_FOR_RAG);
    console.log(`Fetched ${data.length} apartments for RAG indexing`);
    return data;
  } catch (error) {
    console.error('Error fetching apartments for RAG:', error);
    return [];
  }
}

export async function loadChatBySession(sessionId: string): Promise<{
  sessionId?: string;
  messages?: Array<{
    role?: 'user' | 'assistant';
    message?: string;
    context?: string;
    result?: string;
    _type: 'chatItem';
    _key: string;
  }>;
} | null> {
  try {
    const doc = await client.fetch(
      '*[_type == "chatWithAgents" && sessionId == $sessionId][0]{ sessionId, messages }',
      { sessionId }
    );
    return doc ?? null;
  } catch (error) {
    console.error('Failed to load chat by session:', error);
    return null;
  }
}
