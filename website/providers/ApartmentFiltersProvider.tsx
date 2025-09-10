'use client';

import React from 'react';

export type ApartmentListFilters = {
  city?: string;
  capacity?: number;
  checkin?: string;
  checkout?: string;
};

type FiltersState = ApartmentListFilters;

const ApartmentFiltersContext = React.createContext<
  | {
      filters: FiltersState;
      setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
      reset: () => void;
    }
  | undefined
>(undefined);

const defaultFilters: FiltersState = {
  city: undefined,
  capacity: undefined,
  checkin: undefined,
  checkout: undefined,
};

export function ApartmentFiltersProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial?: FiltersState;
}) {
  const [filters, setFilters] = React.useState<FiltersState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.sessionStorage.getItem('apartment-filters');
        if (raw) return JSON.parse(raw) as FiltersState;
      } catch {}
    }
    return initial ?? defaultFilters;
  });

  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('apartment-filters', JSON.stringify(filters));
      }
    } catch {}
  }, [filters]);

  const reset = React.useCallback(() => setFilters(defaultFilters), []);
  const value = React.useMemo(() => ({ filters, setFilters, reset }), [filters, reset]);
  return (
    <ApartmentFiltersContext.Provider value={value}>{children}</ApartmentFiltersContext.Provider>
  );
}

export function useApartmentFilters() {
  const ctx = React.useContext(ApartmentFiltersContext);
  if (!ctx) throw new Error('useApartmentFilters must be used within ApartmentFiltersProvider');
  return ctx;
}
