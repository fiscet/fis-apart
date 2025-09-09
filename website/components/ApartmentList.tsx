'use client';
import { useEffect, useState } from 'react';
import { ApartmentCard } from './ApartmentCard';
import { useApartmentFilters } from '@/providers/ApartmentFiltersProvider';
import { fetchApartments } from '@/lib/sanity/actions';

type Currency = 'EUR' | 'USD' | 'GBP';

type ApartmentListItem = {
  _id: string;
  name?: string;
  location?: { city?: string; country?: string; };
  imageUrl?: string;
  currentPrice?: number | null;
  currentCurrency?: Currency | null;
  slug?: string | null;
};

export function ApartmentList() {
  const { filters } = useApartmentFilters();
  const [apartments, setApartments] = useState<ApartmentListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    async function run() {
      setLoading(true);
      const data = await fetchApartments(filters);
      if (active) setApartments(data);
      if (active) setLoading(false);
    }
    run();
    return () => { active = false; };
  }, [filters]);

  return (
    <section className="py-16 px-4 bg-muted/50" data-testid="section-apartment-list">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-3xl font-bold text-foreground" data-testid="text-apartment-list-title">
              Our Apartments
            </h3>
            <p className="text-muted-foreground" data-testid="text-apartment-list-subtitle"></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-neutral-200 bg-card shadow-sm animate-pulse">
                <div className="w-full h-48 bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-1/3 bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                  <div className="h-6 w-1/2 bg-muted rounded" />
                </div>
              </div>
            ))
          ) : apartments.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground" data-testid="text-no-apartments">
              No apartments available.
            </div>
          ) : (
            apartments.map((apartment) => (
              <ApartmentCard key={apartment._id} apartment={apartment} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default ApartmentList;

