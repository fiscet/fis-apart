import { NextRequest, NextResponse } from 'next/server';
import { searchAgent } from '@/lib/mastra/agents/searchAgent';
import { CoreMessage } from '@mastra/core';

// GET: Retrieve chat history from Mastra memory
export async function GET(req: NextRequest): Promise<NextResponse> {
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
    let messages: CoreMessage[] = [];
    try {
      const result = await memory.query({
        threadId: threadId,
        resourceId: resourceId,
        selectBy: {
          last: 50 // Get last 50 messages
        }
      });
      messages = result.messages || [];
    } catch (error) {
      // If thread doesn't exist yet, create it and return empty array
      console.log('No thread found, creating new thread:', error);
      try {
        // Create the thread using the createThread method
        await memory.createThread({
          threadId: threadId,
          resourceId: resourceId,
          title: 'Apartment Search Chat',
          saveThread: true
        });
        console.log('Successfully created new thread:', threadId);
      } catch (createError) {
        console.error('Failed to create thread:', createError);
      }
      messages = [];
    }

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

