// No local search state needed; SearchFilters handles the logic
// import { Card, CardContent } from "@/components/ui/card";
import SearchChat from '@/components/SearchChat';

export function HeroSection() {
  return (
    <section
      className="hero-section from-primary to-background bg-gradient-to-br px-4 py-20 w-full"
      data-testid="hero-section"
    >
      <div className="mx-auto max-w-4xl text-center w-full">
        <h2
          className="text-primary-foreground mb-6 text-4xl font-bold md:text-6xl"
          data-testid="text-hero-title"
        >
          AI DEMO SITE
        </h2>
        <p className="text-primary-foreground/90 mb-12 text-xl" data-testid="text-hero-subtitle">
          Holiday apartment rentals. Easy search, easy booking.
        </p>

        {/* Search Component */}
        <div className="w-full">
          <SearchChat />
        </div>
      </div>
    </section>
  );
}
