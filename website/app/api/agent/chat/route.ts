import { NextRequest, NextResponse } from 'next/server';
import { loadChatBySession } from '@/lib/sanity/actions';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId') || '';
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }
  const data = await loadChatBySession(sessionId);
  return NextResponse.json({ chat: data });
}
