'use client';

import { ApartmentCard } from "./ApartmentCard";
import { useSearchResults } from "@/providers/SearchResultsProvider";

export function ApartmentListWithResults() {
  const { apartments, clearResults } = useSearchResults();

  return (
    <section className="py-16 px-4 bg-muted/50" data-testid="section-apartment-list">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-3xl font-bold text-foreground" data-testid="text-apartment-list-title">
              Search Results
            </h3>
            <p className="text-muted-foreground mt-2">
              Found {apartments.length} apartment{apartments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={clearResults}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear results
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apartment) => (
            <ApartmentCard key={apartment._id} apartment={apartment} />
          ))}
        </div>

        {apartments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No apartments found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
