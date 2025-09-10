'use client';

import { ReactNode } from 'react';
import { ApartmentListWithResults } from './ApartmentListWithResults';
import { useSearchResults } from '@/providers/SearchResultsProvider';

interface HomeContentProps {
  featuredDestinations: ReactNode;
  experienceCategories: ReactNode;
  featuredApartments: ReactNode;
}

export function HomeContent({
  featuredDestinations,
  experienceCategories,
  featuredApartments,
}: HomeContentProps) {
  const { isSearchActive } = useSearchResults();

  return (
    <>
      {isSearchActive ? (
        <ApartmentListWithResults />
      ) : (
        <>
          {featuredDestinations}
          {experienceCategories}
          {featuredApartments}
        </>
      )}
    </>
  );
}
