'use client';

import { ApartmentCard } from './ApartmentCard';
import { useSearchResults } from '@/providers/SearchResultsProvider';

export function ApartmentListWithResults() {
  const { apartments, clearResults } = useSearchResults();

  return (
    <section className="bg-muted/50 px-4 py-16" data-testid="section-apartment-list">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3
              className="text-foreground text-3xl font-bold"
              data-testid="text-apartment-list-title"
            >
              Search Results
            </h3>
            <p className="text-muted-foreground mt-2">
              Found {apartments.length} apartment{apartments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={clearResults}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Clear results
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apartments.map((apartment) => (
            <ApartmentCard key={apartment._id} apartment={apartment} />
          ))}
        </div>

        {apartments.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No apartments found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
