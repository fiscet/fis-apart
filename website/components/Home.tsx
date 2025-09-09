import { FeaturedDestinationsContainer } from "./FeaturedDestinationsContainer";
import { HeroSection } from "./HeroSection";
import { ExperienceCategoriesContainer } from "./ExperienceCategoriesContainer";
import { FeaturedApartmentsContainer } from "./FeaturedApartmentsContainer";
import { HomeContent } from "./HomeContent";

export function HomeComponent() {
  return (
    <div>
      <HeroSection />
      <HomeContent
        featuredDestinations={<FeaturedDestinationsContainer />}
        experienceCategories={<ExperienceCategoriesContainer />}
        featuredApartments={<FeaturedApartmentsContainer />}
      />
    </div>
  );
}