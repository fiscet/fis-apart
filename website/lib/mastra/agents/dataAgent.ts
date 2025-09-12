import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { ragSearchTool } from '@/lib/mastra/tools/ragSearch';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const dataAgent = new Agent({
  name: 'apartment-data-agent',
  description: 'Searches apartments using RAG semantic search.',
  instructions: `You are a data agent that searches for apartments using the rag_search tool.

    ALWAYS use the rag_search tool when given any apartment search query.

    Examples:
    - "apartment in Paris" → call rag_search with query: "apartment in Paris"
    - "Find apartments with pool" → call rag_search with query: "apartments with pool"
    - "romantic place for 2 people" → call rag_search with query: "romantic place for 2 people"

    IMPORTANT: Always call the rag_search tool with the user's query as the query parameter.

    Be aware today is ${new Date().toISOString()}`,
  model: openai(DEFAULT_MODEL),
  tools: {
    ragSearch: ragSearchTool,
  },
});
