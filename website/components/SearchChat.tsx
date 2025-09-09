'use client';

import React from 'react';
import { useSearchResults } from '@/providers/SearchResultsProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeroInput } from '@/components/ui/hero-input';
import type { ApartmentData } from '@/types/apartment';

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string; };

export default function SearchChat() {
  const { setApartments, setIsSearchActive } = useSearchResults();
  const [sessionId, setSessionId] = React.useState<string>('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: 'sys', role: 'assistant', content: 'Hi! Tell me what you need and I will narrow apartments. You can mention city, dates, guests.' },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    try {
      const key = 'chat-session-id';
      let id = sessionStorage.getItem(key);
      if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem(key, id);
      }
      setSessionId(id);
    } catch { }
  }, []);

  // Hydrate chat history from Sanity for this session
  React.useEffect(() => {
    async function hydrate() {
      if (!sessionId) return;
      try {
        const res = await fetch(`/api/agent/chat?sessionId=${encodeURIComponent(sessionId)}`);
        const data: { chat?: { messages?: Array<{ role?: 'user' | 'assistant'; message?: string; }>; }; } = await res.json();
        const msgs = data.chat?.messages ?? [];
        if (msgs.length > 0) {
          const mapped = msgs
            .filter(m => m.message && (m.role === 'user' || m.role === 'assistant'))
            .map(m => ({ id: crypto.randomUUID(), role: m.role as 'user' | 'assistant', content: m.message as string }));
          setMessages(prev => [prev[0], ...mapped]);
        }
      } catch { }
    }
    void hydrate();
  }, [sessionId]);

  async function sendMessage() {
    const content = input.trim();
    if (!content) return;
    const next = [...messages, { id: crypto.randomUUID(), role: 'user' as const, content }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/agent/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data: {
        text?: string;
        dataAgentResult?: {
          apartments?: ApartmentData[];
        };
      } = await res.json();

      const botText: string = data?.text || 'Sorry, something went wrong.';
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: botText }]);

      // Use apartments from dataAgent result
      const apartments = data?.dataAgentResult?.apartments;
      if (apartments && Array.isArray(apartments)) {
        setApartments(apartments);
        setIsSearchActive(true);
      }
    } catch {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: 'Network error.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="search-shadow border-gray-600 bg-white" data-testid="card-search-chat">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-64 overflow-y-auto space-y-2 pr-2">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-3 py-2 rounded-xl ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <HeroInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about apartments..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!loading) void sendMessage();
                }
              }}
            />
            <Button disabled={loading} onClick={sendMessage} className="px-6">
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

