import { Memory } from '@mastra/memory';
import { UpstashStore } from '@mastra/upstash';
import { UpstashVector } from '@mastra/upstash';

// Create Upstash storage instance for Mastra Memory
const storage = new UpstashStore({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create Upstash vector instance for semantic recall
const vector = new UpstashVector({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

// Create Memory instance with Upstash storage and vector
export const memory = new Memory({
  storage,
  vector,
  options: {
    lastMessages: 10, // Keep last 10 messages in context
    threads: {
      generateTitle: true, // Auto-generate thread titles
    },
    // Disable semantic recall for now to simplify setup
    semanticRecall: false,
  },
});
