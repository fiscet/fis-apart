'use client';

import React from 'react';
import { useSearchResults } from '@/providers/SearchResultsProvider';
import { useRuntimeContext } from '@/providers/RuntimeContextProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeroInput } from '@/components/ui/hero-input';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ApartmentData } from '@/types/apartment';

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };

export default function SearchChat() {
  const { setApartments, setIsSearchActive } = useSearchResults();
  const { runtimeContext } = useRuntimeContext();
  const [sessionId, setSessionId] = React.useState<string>('');

  // Create dynamic initial message with available options
  const initialMessage = React.useMemo(() => {
    const cities = runtimeContext.get('available-cities') || [];
    const categories = runtimeContext.get('available-experience-categories') || [];

    const citiesList = cities.map(city => city.name ?? '').join(', ');
    const categoriesList = categories.map(category => category.name ?? '').join(', ');

    return `# Welcome! 🏠

Tell me what you need and I will narrow apartments for you. You can mention:

- **City**
  ${citiesList}
- **Experience type** (what you want to do)
  ${categoriesList}
- **Dates** (check-in and check-out)
- **Number of guests**

Just tell me your preferences and I'll find the perfect apartment for you! 🎯`;
  }, [runtimeContext]);

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(true); // Default to expanded view
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  // Set initial message when component mounts
  React.useEffect(() => {
    setMessages([{
      id: 'sys',
      role: 'assistant',
      content: initialMessage,
    }]);
  }, [initialMessage]);

  React.useEffect(() => {
    try {
      const key = 'chat-session-id';
      let id = sessionStorage.getItem(key);
      if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem(key, id);
      }
      setSessionId(id);
    } catch {}
  }, []);

  // Note: Chat history is now automatically handled by Mastra's Memory system
  // No need to manually load chat history as it's persisted in Upstash

  // Auto-scroll to bottom when new messages are added
  React.useEffect(() => {
    if (messagesContainerRef.current && isExpanded) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isExpanded]);

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
          threadId: sessionId,
          resourceId: 'user-' + sessionId,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          runtimeContext: {
            'available-cities': runtimeContext.get('available-cities'),
            'available-experience-categories': runtimeContext.get('available-experience-categories'),
          },
        }),
      });

      const data: {
        text?: string;
        dataAgentResult?: {
          apartments?: ApartmentData[];
        };
      } = await res.json();

      const botText: string = data?.text || 'Sorry, something went wrong.';
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: botText },
      ]);

      // Use apartments from dataAgent result
      const apartments = data?.dataAgentResult?.apartments;
      if (apartments && Array.isArray(apartments)) {
        if (apartments.length > 0) {
          setApartments(apartments);
          setIsSearchActive(true);
        } else {
          // No apartments found - add a message to inform the user
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: 'Sorry, I couldn\'t find any apartments matching your criteria. Please try adjusting your search parameters (different dates, location, or number of guests).'
            },
          ]);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: 'Network error.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="search-shadow border-gray-600 bg-white w-full" data-testid="card-search-chat">
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          {/* Toggle Button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
              data-testid="toggle-chat-view"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span className="text-xs">Compress</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span className="text-xs">Expand</span>
                </>
              )}
            </Button>
          </div>

          {/* Chat Messages - Only show when expanded */}
          {isExpanded && (
            <div
              ref={messagesContainerRef}
              className="h-64 space-y-2 overflow-y-auto pr-2 scroll-smooth"
            >
              {messages.map((m) => (
                <div key={m.id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div
                    className={`inline-block rounded-xl px-3 py-2 max-w-[80%] break-words ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
                  >
                    {m.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-current prose-p:text-current prose-strong:text-current prose-ul:text-current prose-li:text-current">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-base font-semibold mb-2 mt-3">{children}</h2>,
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input Section - Always visible */}
          <div className="flex gap-2 w-full">
            <HeroInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={loading ? "Searching..." : "Ask about apartments..."}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!loading) void sendMessage();
                }
              }}
              className="flex-1"
            />
            <Button disabled={loading} onClick={sendMessage} className="px-4 md:px-6 flex-shrink-0">
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
