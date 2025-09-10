'use client';

interface FeaturedDestinationsProps {
  featuredCities: FeaturedCity[];
}

export interface FeaturedCity {
  name: string;
  image: string;
  count: number;
}

export function FeaturedDestinations({ featuredCities }: FeaturedDestinationsProps) {
  return (
    <section className="px-4 py-16" data-testid="section-destinations">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h3
            className="text-foreground mb-4 text-3xl font-bold"
            data-testid="text-destinations-title"
          >
            Popular Destinations
          </h3>
          <p className="text-muted-foreground text-lg" data-testid="text-destinations-subtitle">
            Our users prefer these cities
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {featuredCities.map((city) => (
            <div
              key={city.name}
              className="group relative cursor-pointer"
              data-testid={`city-${city.name.toLowerCase()}`}
            >
              <img
                src={city.image}
                alt={city.name}
                className="h-40 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-lg bg-black/40 transition-colors group-hover:bg-black/30"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4
                  className="text-lg font-semibold"
                  data-testid={`text-city-name-${city.name.toLowerCase()}`}
                >
                  {city.name}
                </h4>
                <p
                  className="text-sm opacity-90"
                  data-testid={`text-city-count-${city.name.toLowerCase()}`}
                >
                  {city.count} Apartments
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
