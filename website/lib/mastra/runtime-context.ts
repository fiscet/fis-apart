import { RuntimeContext } from '@mastra/core/runtime-context';

export type SuggestionItem = {
  _id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type ApartmentSearchRuntimeContext = {
  'available-cities': SuggestionItem[];
  'available-experience-categories': SuggestionItem[];
};

export const createApartmentSearchRuntimeContext = (): RuntimeContext<ApartmentSearchRuntimeContext> => {
  return new RuntimeContext<ApartmentSearchRuntimeContext>();
};
