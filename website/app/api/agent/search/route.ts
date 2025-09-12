import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchAgent } from '@/lib/mastra/agents/searchAgent';
import { extractFiltersTool } from '@/lib/mastra/tools/extractFilters';
import type { ApartmentListFilters } from '@/providers/ApartmentFiltersProvider';

const BodySchema = z.object({
  message: z.string(),
  threadId: z.string(),
  resourceId: z.string(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const json = await req.json();

    const { message, threadId, resourceId } = BodySchema.parse(json);

    console.log('/api/search -> Starting searchAgent generation with message:', message);

    // Extract filters from the user message first
    const filterResult = await extractFiltersTool.execute({
      context: {
        userInput: message,
        conversationContext: '', // Could be enhanced with conversation history
      }
    });

    console.log('/api/search -> Extracted filters:', filterResult.filters);

    // Use searchAgent to generate response
    const searchResponse = await searchAgent.generate(message, {
      memory: { thread: threadId, resource: resourceId },
      maxSteps: 5, // Increased to allow for tool usage
      temperature: 0.1, // Lower temperature for more consistent tool usage
      system: `You MUST use the extractFilters and searchApartmentsWithFilters tools before responding. Do not give generic responses about no apartments being available without first checking with the tools.`,
    });

    const text = typeof searchResponse.text === 'string' ? searchResponse.text : '';

    // Use the filters extracted from the initial message
    const finalFilters: Partial<ApartmentListFilters> = filterResult.filters;

    console.log('/api/search -> searchResponse.text:', text);
    console.log('/api/search -> searchResponse keys:', Object.keys(searchResponse));
    console.log('/api/search -> Tool calls made:', searchResponse.toolCalls?.length || 0);
    if (searchResponse.toolCalls && searchResponse.toolCalls.length > 0) {
      console.log('/api/search -> Tool calls details:', searchResponse.toolCalls);
    }
    console.log('/api/search -> Final filters:', finalFilters);

    console.log('/api/search -> Final response data:', {
      text: text.substring(0, 100) + '...',
      filters: finalFilters,
    });

    return NextResponse.json({ text, toolCalls: searchResponse.toolCalls, filters: finalFilters });
  } catch (e: unknown) {
    console.error('API Error details:', e);
    const message = e instanceof Error ? e.message : 'Bad Request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
