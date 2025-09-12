import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { searchAgent } from '@/lib/mastra/agents/searchAgent';
import { CoreMessage } from '@mastra/core';

const GetSchema = z.object({
  threadId: z.string(),
  resourceId: z.string(),
});

// GET: Retrieve chat history from Mastra memory
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get('threadId');
    const resourceId = searchParams.get('resourceId');

    // Validate required parameters
    if (!threadId || !resourceId) {
      return NextResponse.json({
        error: 'Missing required parameters: threadId and resourceId'
      }, { status: 400 });
    }

    // Get memory instance and retrieve messages
    const memory = await searchAgent.getMemory();
    if (!memory) {
      return NextResponse.json({ messages: [] });
    }

    // Retrieve messages from memory using query method
    const { messages } = await memory.query({
      threadId: threadId,
      resourceId: resourceId,
      selectBy: {
        last: 50 // Get last 50 messages
      }
    });

    // Format messages for frontend
    const formattedMessages = messages.map((msg: CoreMessage) => ({
      id: crypto.randomUUID(),
      role: msg.role,
      content: msg.content
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (e: unknown) {
    console.error('Chat API error:', e);
    const message = e instanceof Error ? e.message : 'Bad Request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

