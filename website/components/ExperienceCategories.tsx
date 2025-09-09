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

export function ExperienceCategories({ categories, title = 'Popular Experiences', subtitle = 'Browse by category' }: ExperienceCategoriesProps) {
  return (
    <section className="py-16 px-4" data-testid="section-experiences">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4" data-testid="text-experiences-title">
            {title}
          </h3>
          <p className="text-muted-foreground text-lg" data-testid="text-experiences-subtitle">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.name} className="relative group cursor-pointer" data-testid={`experience-${cat.name.toLowerCase()}`}>
              <img
                src={cat.image || '/next.svg'}
                alt={cat.name}
                className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="font-semibold text-lg" data-testid={`text-experience-name-${cat.name.toLowerCase()}`}>{cat.name}</h4>
                <p className="text-sm opacity-90" data-testid={`text-experience-count-${cat.name.toLowerCase()}`}>
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
