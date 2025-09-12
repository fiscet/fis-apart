'use client';

import React from 'react';
import { createApartmentSearchRuntimeContext, type SuggestionItem } from '@/lib/mastra/runtime-context';

interface RuntimeContextProviderProps {
  children: React.ReactNode;
  cities: SuggestionItem[];
  experienceCategories: SuggestionItem[];
}

const RuntimeContextContext = React.createContext<{
  runtimeContext: ReturnType<typeof createApartmentSearchRuntimeContext>;
} | null>(null);

export function RuntimeContextProvider({
  children,
  cities,
  experienceCategories
}: RuntimeContextProviderProps) {
  const runtimeContext = React.useMemo(() => {
    const context = createApartmentSearchRuntimeContext();
    context.set('available-cities', cities);
    context.set('available-experience-categories', experienceCategories);
    return context;
  }, [cities, experienceCategories]);

  return (
    <RuntimeContextContext.Provider value={{ runtimeContext }}>
      {children}
    </RuntimeContextContext.Provider>
  );
}

export function useRuntimeContext() {
  const context = React.useContext(RuntimeContextContext);
  if (!context) {
    throw new Error('useRuntimeContext must be used within RuntimeContextProvider');
  }
  return context;
}
