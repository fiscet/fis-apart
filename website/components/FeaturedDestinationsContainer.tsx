import { client } from "@/lib/sanity/client";
import { FeaturedDestinations, FeaturedCity } from "./FeaturedDestinations";

interface SanityCity {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  count: number;
}

const query = `*[_type == "city" && active == true && featured == true]{
  _id,
  name,
  "slug": slug.current,
  "image": image.asset->url,
  "count": count(*[_type == "apartment" && city._ref == ^._id])
}`;

export async function FeaturedDestinationsContainer() {
  let cities: SanityCity[] = [];
  try {
    cities = await client.fetch<SanityCity[]>(query);
  } catch {
    cities = [];
  }

  const featuredCities: FeaturedCity[] = (cities ?? []).map((c) => ({
    name: c.name,
    image: c.image ?? "",
    count: c.count ?? 0,
  }));

  return <FeaturedDestinations featuredCities={featuredCities} />;
}
