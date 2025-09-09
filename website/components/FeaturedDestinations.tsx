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
    <section className="py-16 px-4" data-testid="section-destinations">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4" data-testid="text-destinations-title">
            Popular Destinations
          </h3>
          <p className="text-muted-foreground text-lg" data-testid="text-destinations-subtitle">
            Our users prefer these cities
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredCities.map((city) => (
            <div key={city.name} className="relative group cursor-pointer" data-testid={`city-${city.name.toLowerCase()}`}>
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-semibold text-lg" data-testid={`text-city-name-${city.name.toLowerCase()}`}>{city.name}</h4>
                <p className="text-sm opacity-90" data-testid={`text-city-count-${city.name.toLowerCase()}`}>
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
