import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { searchAgent } from '@/lib/mastra/agents/searchAgent';
import { dataAgent } from '@/lib/mastra/agents/dataAgent';
import type { ApartmentListFilters } from '@/providers/ApartmentFiltersProvider';
import type { ApartmentData } from '@/types/apartment';

const BodySchema = z.object({
  message: z.string(),
  threadId: z.string(),
  resourceId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    const { message, threadId, resourceId } = BodySchema.parse(json);

    // First, get structured filters from searchAgent
    console.log('/api/search -> Starting searchAgent generation with message:', message);

    let text = '';
    let filters: Partial<ApartmentListFilters> | undefined = undefined;

    // Use regular generation to ensure we get text responses
    const searchResponse = await searchAgent.generate(message, {
      memory: { thread: threadId, resource: resourceId },
      maxSteps: 3,
      temperature: 0.3,
    });

    text = searchResponse.text ?? '';
    filters = undefined; // We'll extract filters from the text response

    console.log('/api/search -> searchResponse.text:', text);
    console.log('/api/search -> searchResponse keys:', Object.keys(searchResponse));

    // Then, use dataAgent to search apartments using RAG
    type DataAgentResult = { text?: string; toolCalls?: unknown[]; apartments?: ApartmentData[] };
    let dataAgentResult: DataAgentResult | undefined = undefined;

    // Create a more specific search query using the original message
    let searchQuery = message;

    // Extract city from message if mentioned (look for "in [city]" pattern)
    const cityMatch = message.match(/\bin\s+([a-zA-Z]+)\b/i);
    if (cityMatch) {
      searchQuery = `apartments in ${cityMatch[1]}`;
    }

    console.log('/api/search -> Using search query:', searchQuery);

    // Always call dataAgent with the enhanced search query for RAG search
    const dataRes = await dataAgent.generate(
      [
        { role: 'system', content: 'Use the rag_search tool to find apartments based on the user query.' },
        { role: 'user', content: searchQuery },
      ],
      {
        toolChoice: 'required',
        maxSteps: 3,
        temperature: 0.3, // Lower temperature for more consistent data retrieval
      }
    );

    // Extract apartments from RAG search results
    let apartments: ApartmentData[] = [];
    type ToolResult = { toolName?: string; result?: { apartments?: ApartmentData[]; }; };
    const toolResults = (dataRes as { toolResults?: ToolResult[]; }).toolResults;
    if (Array.isArray(toolResults)) {
      const first = toolResults.find(
        (tr) =>
          tr?.toolName === 'ragSearch' && Array.isArray(tr?.result?.apartments)
      );
      if (first?.result?.apartments) {
        apartments = first.result.apartments;
      }
    }

    dataAgentResult = { text: dataRes.text, toolCalls: dataRes.toolCalls, apartments };

    console.log('/api/search -> Final response data:', {
      text: text.substring(0, 100) + '...',
      filters,
      apartmentsCount: dataAgentResult?.apartments?.length || 0
    });

    return NextResponse.json({ text, toolCalls: searchResponse.toolCalls, filters, dataAgentResult });
  } catch (e: unknown) {
    console.error('API Error details:', e);
    const message = e instanceof Error ? e.message : 'Bad Request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
