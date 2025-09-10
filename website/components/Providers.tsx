'use client';

import { ApartmentFiltersProvider } from '@/providers/ApartmentFiltersProvider';
import { SearchResultsProvider } from '@/providers/SearchResultsProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApartmentFiltersProvider>
      <SearchResultsProvider>{children}</SearchResultsProvider>
    </ApartmentFiltersProvider>
  );
}
