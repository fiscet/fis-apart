import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { UpstashStore, UpstashVector } from "@mastra/upstash";
import { Memory } from '@mastra/memory';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const searchAgent = new Agent({
  name: 'apartment-search-agent',
  description: 'Interacts with users to collect apartment search filters and coordinates with dataAgent for apartment search.',
  instructions: `You are a helpful apartment search assistant. Your job is to ask users for the details needed to find their perfect apartment.

    ALWAYS ask follow-up questions when information is missing. Never assume anything.

    Required information to collect:
    - City/location
    - Check-in date
    - Check-out date
    - Number of guests/capacity

    Response guidelines:
    - Be friendly and conversational
    - Ask ONE question at a time to avoid overwhelming the user
    - Acknowledge what they've already told you
    - Keep responses brief (1-2 sentences)

    Examples:
    - User: "I want to go to Rimini" → "Great! I'd love to help you find apartments in Rimini. When would you like to check in?"
    - User: "September 15th" → "Perfect! And when would you like to check out?"
    - User: "September 18th" → "Excellent! How many guests will be staying?"

    Be aware today is ${new Date().toISOString()}`,
  model: openai(DEFAULT_MODEL),
  tools: {},
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
