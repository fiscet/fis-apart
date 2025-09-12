'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeroInput } from '@/components/ui/hero-input';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { ApartmentListFilters } from '@/providers/ApartmentFiltersProvider';

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };

export default function SearchChat() {
  // Note: Removed useSearchResults since we're only using searchAgent for conversation
  const [threadId, setThreadId] = React.useState<string>('');
  const [resourceId, setResourceId] = React.useState<string>('');
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'sys',
      role: 'assistant',
      content:
        'Hi! Tell me what you need and I will narrow apartments. You can mention city, dates, guests.',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(true); // Default to expanded view
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    try {
      const threadKey = 'chat-thread-id';
      const resourceKey = 'chat-resource-id';

      let thread = sessionStorage.getItem(threadKey);
      let resource = sessionStorage.getItem(resourceKey);

      if (!thread) {
        thread = crypto.randomUUID();
        sessionStorage.setItem(threadKey, thread);
      }
      if (!resource) {
        resource = crypto.randomUUID();
        sessionStorage.setItem(resourceKey, resource);
      }

      setThreadId(thread);
      setResourceId(resource);
    } catch {}
  }, []);

  // Load chat history from Mastra memory when threadId and resourceId are available
  React.useEffect(() => {
    async function loadChatHistory() {
      if (!threadId || !resourceId) return;

      try {
        const res = await fetch(`/api/agent/chat?threadId=${encodeURIComponent(threadId)}&resourceId=${encodeURIComponent(resourceId)}`);
        if (res.ok) {
          const data = await res.json();
          const historyMessages = data.messages || [];

          if (historyMessages.length > 0) {
            // Add system message + history messages
            setMessages(prev => [
              prev[0], // Keep the system message
              ...historyMessages
            ]);
          }
        } else {
          console.log('Chat history API returned error:', res.status, res.statusText);
        }
      } catch (error) {
        console.log('Could not load chat history:', error);
        // Don't show error to user, just continue with empty chat
      }
    }

    loadChatHistory();
  }, [threadId, resourceId]);

  // Auto-scroll to bottom when new messages are added
  React.useEffect(() => {
    if (messagesContainerRef.current && isExpanded) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isExpanded]);

  async function sendMessage() {
    const content = input.trim();
    if (!content || !threadId || !resourceId) {
      console.log('Missing required values:', { content, threadId, resourceId });
      return;
    }

    // Add user message to local state
    const userMessage = { id: crypto.randomUUID(), role: 'user' as const, content };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const requestBody = {
        message: content,
        threadId,
        resourceId,
      };

      console.log('Sending request:', requestBody);

      const res = await fetch('/api/agent/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${res.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data: {
        text?: string;
        filters?: Partial<ApartmentListFilters>;
        toolCalls?: unknown[];
      } = await res.json();

      console.log('API Response:', data);

      // Ensure we only use string content for the message
      const botText: string = typeof data?.text === 'string' ? data.text : 'Sorry, something went wrong.';

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: botText },
      ]);

      // Note: Since we're only using searchAgent now, we don't have apartment results
      // The searchAgent will provide conversational responses about apartment search criteria
      // If you want to add apartment search functionality back, you can either:
      // 1. Add tools to the searchAgent, or
      // 2. Integrate with a different apartment search API
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
                    {typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}
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
              placeholder="Ask about apartments..."
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
