import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const searchAgent = new Agent({
  name: 'apartment-search-agent',
  description: 'Interacts with users to collect apartment search filters.',
  instructions: `You are a helpful assistant that helps users search for apartments. 
    Extract any apartment search criteria from the user's message (city, checkin date, checkout date, capacity/number of guests).
    If the user mentions specific details, extract them immediately. If information is missing, ask concise follow-up questions.
    Always be brief and friendly. Do not include any JSON in your responses.
    Be aware today is ${new Date().toISOString()}`,
  model: openai(DEFAULT_MODEL),
});
