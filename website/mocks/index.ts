import { FeaturedCity } from "@/components/FeaturedDestinations";
import { Apartment } from "@/types/sanity.types";

// Target categories for apartment locations - This will be removed once Sanity is fully integrated for dynamic fetching
export type ExperienceCategory = "sea" | "mountains" | "city" | "farm";

export const featuredCitiesMock: FeaturedCity[] = [
  {
    name: 'Roma',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&h=600',
    count: 87,
  },
  {
    name: 'Milano',
    image: 'https://images.unsplash.com/photo-1543832923-44667a44c804?auto=format&fit=crop&w=800&h=600',
    count: 64,
  },
  {
    name: 'Firenze',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&h=600',
    count: 43,
  },
  {
    name: 'Venezia',
    image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=800&h=600',
    count: 29,
  },
];

export const propertiesMock: Apartment[] = [
  {
    _id: 'apt1',
    _type: 'apartment',
    _createdAt: '2024-01-01T00:00:00Z',
    _updatedAt: '2024-01-01T00:00:00Z',
    _rev: 'mock-1',
    name: 'Property 1',
    location: { _type: 'location', city: 'Roma', country: 'Italy' },
    pricePeriods: [
      { _type: 'priceRange', _key: 'p1', price: 120, currency: 'EUR' },
    ],
    experienceCategory: { _ref: 'city-experience', _type: 'reference' },
  },
  {
    _id: 'apt2',
    _type: 'apartment',
    _createdAt: '2024-01-01T00:00:00Z',
    _updatedAt: '2024-01-01T00:00:00Z',
    _rev: 'mock-2',
    name: 'Property 2',
    location: { _type: 'location', city: 'Milano', country: 'Italy' },
    pricePeriods: [
      { _type: 'priceRange', _key: 'p2', price: 150, currency: 'EUR' },
    ],
    experienceCategory: { _ref: 'city-experience', _type: 'reference' },
  },
  {
    _id: 'apt3',
    _type: 'apartment',
    _createdAt: '2024-01-01T00:00:00Z',
    _updatedAt: '2024-01-01T00:00:00Z',
    _rev: 'mock-3',
    name: 'Property 3',
    location: { _type: 'location', city: 'Firenze', country: 'Italy' },
    pricePeriods: [
      { _type: 'priceRange', _key: 'p3', price: 95, currency: 'EUR' },
    ],
    experienceCategory: { _ref: 'city-experience', _type: 'reference' },
  },
  {
    _id: 'apt4',
    _type: 'apartment',
    _createdAt: '2024-01-01T00:00:00Z',
    _updatedAt: '2024-01-01T00:00:00Z',
    _rev: 'mock-4',
    name: 'Coastal Retreat',
    location: { _type: 'location', city: 'Rimini', country: 'Italy' },
    pricePeriods: [
      { _type: 'priceRange', _key: 'p4', price: 110, currency: 'EUR' },
    ],
    experienceCategory: { _ref: 'sea-experience', _type: 'reference' },
  },
  {
    _id: 'apt5',
    _type: 'apartment',
    _createdAt: '2024-01-01T00:00:00Z',
    _updatedAt: '2024-01-01T00:00:00Z',
    _rev: 'mock-5',
    name: 'Alpine Lodge',
    location: { _type: 'location', city: 'Cortina d\'Ampezzo', country: 'Italy' },
    pricePeriods: [
      { _type: 'priceRange', _key: 'p5', price: 180, currency: 'EUR' },
    ],
    experienceCategory: { _ref: 'mountains-experience', _type: 'reference' },
  },
  {
    _id: 'apt6',
    _type: 'apartment',
    _createdAt: '2024-01-01T00:00:00Z',
    _updatedAt: '2024-01-01T00:00:00Z',
    _rev: 'mock-6',
    name: 'Farmhouse Escape',
    location: { _type: 'location', city: 'Toscana', country: 'Italy' },
    pricePeriods: [
      { _type: 'priceRange', _key: 'p6', price: 90, currency: 'EUR' },
    ],
    experienceCategory: { _ref: 'farm-experience', _type: 'reference' },
  },
];

