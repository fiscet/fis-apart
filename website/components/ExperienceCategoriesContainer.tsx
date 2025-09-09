import { ExperienceCategories, ExperienceCategoryCard } from "./ExperienceCategories";
import { client } from "@/lib/sanity/client";

interface SanityExperienceCategory {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  count: number;
}

const query = `*[_type == "experienceCategory"]{
  _id,
  name,
  "image": coalesce(image.asset->url, ""),
  "slug": slug.current,
  "count": count(*[_type == "apartment" && references(^._id)])
}`;

export async function ExperienceCategoriesContainer() {
  let categories: SanityExperienceCategory[] = [];
  try {
    categories = await client.fetch<SanityExperienceCategory[]>(query);
  } catch {
    categories = [];
  }

  const cards: ExperienceCategoryCard[] = (categories ?? []).map((c) => ({
    name: c.name,
    image: c.image ?? "",
    count: c.count ?? 0,
  }));

  return (
    <ExperienceCategories
      categories={cards}
      title="Popular Experiences"
      subtitle="Browse by category"
    />
  );
}

