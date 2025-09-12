// Centralized GROQ queries

export const QUERY_FEATURED_APARTMENTS = `*[_type == "apartment" && active == true && featured == true]{
  _id,
  name,
  location,
  "slug": slug.current,
  "imageUrl": coalesce(
    images[isMain == true][0].image.asset->url,
    images[0].image.asset->url,
    ""
  ),
  "currentPrice": select(
    defined(pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].price) => pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].price,
    defined(pricePeriods[0].price) => pricePeriods[0].price,
    null
  ),
  "currentCurrency": select(
    defined(pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].currency) => pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].currency,
    defined(pricePeriods[0].currency) => pricePeriods[0].currency,
    null
  )
}[0...8]`;

export const QUERY_ALL_APARTMENTS = `*[_type == "apartment" && active == true]{
  _id,
  name,
  location,
  "slug": slug.current,
  "imageUrl": coalesce(
    images[isMain == true][0].image.asset->url,
    images[0].image.asset->url,
    ""
  ),
  "currentPrice": select(
    defined(pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].price) => pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].price,
    defined(pricePeriods[0].price) => pricePeriods[0].price,
    null
  ),
  "currentCurrency": select(
    defined(pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].currency) => pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].currency,
    defined(pricePeriods[0].currency) => pricePeriods[0].currency,
    null
  ),
  capacity,
} | order(_createdAt desc)`;

// Filtered by optional city (string match), capacity (min guests needed), amenities (string[] names)
export const QUERY_ALL_APARTMENTS_FILTERED = `*[_type == "apartment" && active == true
  && (!defined($city) || $city == "" || location.city match $city)
  && (!defined($capacity) || ($capacity >= coalesce(capacity.minGuests, 0) && $capacity <= coalesce(capacity.maxGuests, 999)))
]{
  _id,
  name,
  location,
  "slug": slug.current,
  "imageUrl": coalesce(
    images[isMain == true][0].image.asset->url,
    images[0].image.asset->url,
    ""
  ),
  "currentPrice": select(
    defined(pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].price) => pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].price,
    defined(pricePeriods[0].price) => pricePeriods[0].price,
    null
  ),
  "currentCurrency": select(
    defined(pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].currency) => pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].currency,
    defined(pricePeriods[0].currency) => pricePeriods[0].currency,
    null
  ),
  capacity,
} | order(_createdAt desc)`;

export const QUERY_APARTMENT_DETAILS = `*[_type == "apartment" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  location,
  "imageUrl": coalesce(
    images[isMain == true][0].image.asset->url,
    images[0].image.asset->url,
    ""
  ),
  "images": images[]{
    "url": image.asset->url,
    alt,
    caption,
    isMain
  },
  "currentPrice": select(
    defined(pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].price) => pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].price,
    defined(pricePeriods[0].price) => pricePeriods[0].price,
    null
  ),
  "currentCurrency": select(
    defined(pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].currency) => pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].currency,
    defined(pricePeriods[0].currency) => pricePeriods[0].currency,
    null
  ),
  capacity,
  "category": experienceCategory->name,
  "amenities": amenities[]->{ _id, name, icon },
  description
}`;

// Query for RAG indexing - includes all apartment data with amenities
export const QUERY_APARTMENTS_FOR_RAG = `*[_type == "apartment" && active == true]{
  _id,
  name,
  location,
  "slug": slug.current,
  "imageUrl": coalesce(
    images[isMain == true][0].image.asset->url,
    images[0].image.asset->url,
    ""
  ),
  "images": images[]{
    "url": image.asset->url,
    alt,
    caption,
    isMain
  },
  "currentPrice": select(
    defined(pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].price) => pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].price,
    defined(pricePeriods[0].price) => pricePeriods[0].price,
    null
  ),
  "currentCurrency": select(
    defined(pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].currency) => pricePeriods[@.startDate <= now() && @.endDate >= now() ][0].currency,
    defined(pricePeriods[0].currency) => pricePeriods[0].currency,
    null
  ),
  capacity,
  "category": experienceCategory->name,
  "amenities": amenities[]->{ _id, name, icon },
  description
} | order(_createdAt desc)`;
