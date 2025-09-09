'use client';
import { ApartmentCard } from "./ApartmentCard";

type Currency = "EUR" | "USD" | "GBP";

interface FeaturedApartmentsProps {
  apartments: Array<{
    _id: string;
    name?: string;
    location?: { city?: string; country?: string; };
    imageUrl?: string;
    currentPrice?: number | null;
    currentCurrency?: Currency | null;
    slug?: string | null;
  }>;
}

export function FeaturedApartments({ apartments }: FeaturedApartmentsProps) {
  return (
    <section className="py-16 px-4 bg-muted/50" data-testid="section-featured-apartments">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-3xl font-bold text-foreground" data-testid="text-featured-apartments-title">
              Featured Apartments
            </h3>
            <p className="text-muted-foreground" data-testid="text-featured-apartments-subtitle"></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apartments.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground" data-testid="text-no-featured-apartments">
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

