import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { UpstashStore, UpstashVector } from "@mastra/upstash";
import { Memory } from '@mastra/memory';
import { fastembed } from '@mastra/fastembed';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
console.log('Environment check:', {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'NOT SET',
  DEFAULT_MODEL
});

export const searchAgent = new Agent({
  name: 'apartment-search-agent',
  description: 'Interacts with users to collect apartment search filters.',
  instructions: `You are a helpful assistant that helps users search for apartments.
    Extract any apartment search criteria from the user's message (city, checkin date, checkout date, capacity/number of guests).
    If the user mentions specific details, extract them immediately. If information is missing, ask concise follow-up questions.
    Always be brief and friendly. Do not include any JSON in your responses.
    Be aware today is ${new Date().toISOString()}`,
  model: openai(DEFAULT_MODEL),
  memory: new Memory({
    storage: new UpstashStore({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!
    }),
    vector: new UpstashVector({
      url: process.env.UPSTASH_VECTOR_REST_URL!,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN!
    }),
    embedder: fastembed,
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
