'use client';

import React, { createContext, useContext, useState } from 'react';
import type { ApartmentData } from '@/types/apartment';

type SearchResultsContextType = {
  apartments: ApartmentData[];
  setApartments: (apartments: ApartmentData[]) => void;
  isSearchActive: boolean;
  setIsSearchActive: (active: boolean) => void;
  clearResults: () => void;
};

const SearchResultsContext = createContext<SearchResultsContextType | undefined>(undefined);

export function SearchResultsProvider({ children }: { children: React.ReactNode }) {
  const [apartments, setApartments] = useState<ApartmentData[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const clearResults = () => {
    setApartments([]);
    setIsSearchActive(false);
  };

  const value = {
    apartments,
    setApartments,
    isSearchActive,
    setIsSearchActive,
    clearResults,
  };

  return <SearchResultsContext.Provider value={value}>{children}</SearchResultsContext.Provider>;
}

export function useSearchResults() {
  const context = useContext(SearchResultsContext);
  if (!context) {
    throw new Error('useSearchResults must be used within SearchResultsProvider');
  }
  return context;
}
