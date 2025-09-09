'use client';

// No local search state needed; SearchFilters handles the logic
// import { Card, CardContent } from "@/components/ui/card";
import SearchSwitcher from "@/components/SearchSwitcher";

export function HeroSection() {

  return (
    <section className="hero-section py-20 px-4 bg-gradient-to-br from-primary to-background" data-testid="hero-section">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6" data-testid="text-hero-title">
          AI DEMO SITE
        </h2>
        <p className="text-xl text-primary-foreground/90 mb-12" data-testid="text-hero-subtitle">
          Holiday apartment rentals. Easy search, easy booking.
        </p>

        {/* Search Component */}
        <SearchSwitcher />
      </div>
    </section>
  );
}
