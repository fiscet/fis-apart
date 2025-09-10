'use client';
import { ApartmentCard } from './ApartmentCard';

type Currency = 'EUR' | 'USD' | 'GBP';

interface FeaturedApartmentsProps {
  apartments: Array<{
    _id: string;
    name?: string;
    location?: { city?: string; country?: string };
    imageUrl?: string;
    currentPrice?: number | null;
    currentCurrency?: Currency | null;
    slug?: string | null;
  }>;
}

export function FeaturedApartments({ apartments }: FeaturedApartmentsProps) {
  return (
    <section className="bg-muted/50 px-4 py-16" data-testid="section-featured-apartments">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3
              className="text-foreground text-3xl font-bold"
              data-testid="text-featured-apartments-title"
            >
              Featured Apartments
            </h3>
            <p
              className="text-muted-foreground"
              data-testid="text-featured-apartments-subtitle"
            ></p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {apartments.length === 0 ? (
            <div
              className="text-muted-foreground col-span-full py-12 text-center"
              data-testid="text-no-featured-apartments"
            >
              No featured apartments available.
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
