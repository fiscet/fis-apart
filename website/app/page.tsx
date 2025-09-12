import { HomeComponent } from '@/components/Home';
import { RuntimeContextProvider } from '@/providers/RuntimeContextProvider';
import { client } from '@/lib/sanity/client';
import { QUERY_EXPERIENCE_CATEGORIES, QUERY_CITIES } from '@/lib/sanity/queries';

export default async function Home() {
  // Fetch suggestions data server-side
  const [experienceCategories, cities] = await Promise.all([
    client.fetch(QUERY_EXPERIENCE_CATEGORIES),
    client.fetch(QUERY_CITIES),
  ]);

  return (
    <RuntimeContextProvider
      cities={cities || []}
      experienceCategories={experienceCategories || []}
    >
      <HomeComponent />
    </RuntimeContextProvider>
  );
}
