import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { UPSTASH_PROMPT, UpstashStore, UpstashVector } from "@mastra/upstash";
import { Memory } from '@mastra/memory';
import { extractFiltersTool } from '@/lib/mastra/tools/extractFilters';
import { searchApartmentsWithFiltersTool } from '@/lib/mastra/tools/searchApartmentsWithFilters';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// Removed vectorQueryTool - using searchApartmentsWithFiltersTool instead

export const searchAgent = new Agent({
  name: 'apartment-search-agent',
  description: 'Interacts with users to collect apartment search filters and coordinates with dataAgent for apartment search.',
  instructions: `You are a helpful apartment search assistant. Your job is to help users find apartments by extracting their requirements and searching for available options.

    CRITICAL: You MUST use the tools on EVERY user message. Do not respond without calling the tools first.

    MANDATORY WORKFLOW FOR EVERY MESSAGE:
    1. FIRST: Call extractFilters tool with the user's message
    2. SECOND: Call searchApartmentsWithFilters tool with the extracted filters
    3. THIRD: Respond based on the actual search results

    You have access to these tools:
    - extractFilters: Extracts city, dates, capacity, price from user input
    - searchApartmentsWithFilters: Searches apartments using the extracted filters

    NEVER respond without calling both tools first. The tools will provide you with real data about available apartments.

    When you call searchApartmentsWithFilters, you will receive:
    - apartments: Array of available apartments
    - totalResults: Number of apartments found
    - appliedFilters: List of filters that were applied

    Based on the search results:
    - If apartments are found: Tell the user about the apartments you found
    - If no apartments are found: Suggest alternatives or ask for more specific requirements
    - Always be specific about what you found or why nothing was found

    Be aware today is ${new Date().toISOString()}`,
  model: openai(DEFAULT_MODEL),
  tools: {searchApartmentsWithFilters: searchApartmentsWithFiltersTool, extractFilters: extractFiltersTool},
  memory: new Memory({
    storage: new UpstashStore({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!
    }),
    vector: new UpstashVector({
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
    }),
    embedder: openai.embedding("text-embedding-3-small"), // 1536 dimensions
    options: {
      threads: {
        generateTitle: true
      },
      lastMessages: 10,
      semanticRecall: {
        topK: 3,
        messageRange: 2
      }
    }
  })
});
