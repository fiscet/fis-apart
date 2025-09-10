'use client';

export interface ExperienceCategoryCard {
  name: string;
  image: string;
  count: number;
}

interface ExperienceCategoriesProps {
  categories: ExperienceCategoryCard[];
  title?: string;
  subtitle?: string;
}

export function ExperienceCategories({
  categories,
  title = 'Popular Experiences',
  subtitle = 'Browse by category',
}: ExperienceCategoriesProps) {
  return (
    <section className="px-4 py-16" data-testid="section-experiences">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h3
            className="text-foreground mb-4 text-3xl font-bold"
            data-testid="text-experiences-title"
          >
            {title}
          </h3>
          <p className="text-muted-foreground text-lg" data-testid="text-experiences-subtitle">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group relative cursor-pointer"
              data-testid={`experience-${cat.name.toLowerCase()}`}
            >
              <img
                src={cat.image || '/next.svg'}
                alt={cat.name}
                className="h-40 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-lg bg-black/40 transition-colors group-hover:bg-black/30"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4
                  className="text-lg font-semibold"
                  data-testid={`text-experience-name-${cat.name.toLowerCase()}`}
                >
                  {cat.name}
                </h4>
                <p
                  className="text-sm opacity-90"
                  data-testid={`text-experience-count-${cat.name.toLowerCase()}`}
                >
                  {cat.count} Apartments
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
