import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { searchAgent } from '@/lib/mastra/agents/searchAgent';
import { dataAgent } from '@/lib/mastra/agents/dataAgent';
import type { ApartmentListFilters } from '@/providers/ApartmentFiltersProvider';
import type { ApartmentData } from '@/types/apartment';

const BodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']).default('user'),
        content: z.string(),
      })
    )
    .or(z.string()),
  threadId: z.string().optional(),
  resourceId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { messages, threadId, resourceId } = BodySchema.parse(json);

    console.log('🔍 Memory Debug:', {
      threadId,
      resourceId,
      messagesCount: Array.isArray(messages) ? messages.length : 1,
      memoryConfig: threadId && resourceId ? { thread: threadId, resource: resourceId } : 'No memory config',
    });

    const response = await searchAgent.generate(messages, {
      memory: threadId && resourceId ? { thread: threadId, resource: resourceId } : undefined,
      maxSteps: 3,
      structuredOutput: {
        schema: z.object({
          city: z
            .string()
            .optional()
            .describe('The city where the user wants to find an apartment'),
          capacity: z.number().optional().describe('Number of guests/people'),
          checkin: z.string().optional().describe('Check-in date in YYYY-MM-DD format'),
          checkout: z.string().optional().describe('Check-out date in YYYY-MM-DD format'),
        }),
        model: openai(process.env.OPENAI_MODEL || 'gpt-4o-mini'),
        errorStrategy: 'warn',
      },
    });

    const text = response.text ?? '';
    const filters: Partial<ApartmentListFilters> | undefined = response.object;

    type DataAgentResult = { text?: string; toolCalls?: unknown[]; apartments?: ApartmentData[] };
    let dataAgentResult: DataAgentResult | undefined = undefined;

    // Only call data agent if we have meaningful search criteria
    const hasSearchCriteria = filters && typeof filters === 'object' &&
      (filters.city || filters.capacity || filters.checkin || filters.checkout);

    if (hasSearchCriteria) {
      // Pass filters to data agent which will use tool to fetch data
      const dataRes = await dataAgent.generate(
        [
          { role: 'system', content: 'Use the tool with the provided filters.' },
          { role: 'user', content: JSON.stringify(filters) },
        ],
        {
          memory: threadId && resourceId ? { thread: threadId, resource: resourceId } : undefined,
          toolChoice: 'required',
          maxSteps: 3,
        }
      );

      // Extract apartments from tool results (Mastra places them under toolResults[].result)
      let apartments: ApartmentData[] = [];
      type ToolResult = { toolName?: string; result?: { apartments?: ApartmentData[] } };
      const toolResults = (dataRes as { toolResults?: ToolResult[] }).toolResults;
      if (Array.isArray(toolResults)) {
        const first = toolResults.find(
          (tr) =>
            tr?.toolName === 'fetchApartmentsByFilters' && Array.isArray(tr?.result?.apartments)
        );
        if (first?.result?.apartments) {
          apartments = first.result.apartments;
        }
      }

      dataAgentResult = { text: dataRes.text, toolCalls: dataRes.toolCalls, apartments };
    }

    // Messages are automatically saved by Mastra's Memory system when using agents

    return NextResponse.json({ text, toolCalls: response.toolCalls, filters, dataAgentResult });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Bad Request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
