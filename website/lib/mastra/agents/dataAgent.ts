import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { fetchApartmentsByFilters } from "@/lib/mastra/tools/fetchApartmentsByFilters";

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export const dataAgent = new Agent({
  name: "apartment-data-agent",
  description: "Fetches apartments from Sanity via tools.",
  instructions:
    `When given an object of filters (city, capacity, checkin, checkout),
    call the fetchApartmentsByFilters tool with the same fields.
    Return the apartments data from the tool result.
    Be aware today is ${new Date().toISOString()}`,
  model: openai(DEFAULT_MODEL),
  tools: {
    fetchApartmentsByFilters,
  },
});
