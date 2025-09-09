'use client';

import Image from "next/image";
import type { ApartmentData } from "@/types/apartment";

export interface ApartmentCardProps {
  apartment: ApartmentData;
}

export function ApartmentCard({ apartment }: ApartmentCardProps) {
  function generateDeterministicRating(id: string): number {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    const rating = (hash % 51) / 10;
    return Number(rating.toFixed(1));
  }

  const rating = generateDeterministicRating(apartment._id);

  return (
    <div
      className="rounded-xl overflow-hidden border border-neutral-200 bg-card shadow-sm hover:shadow-2xl transition-transform hover:-translate-y-0.5"
      data-testid={`card-apartment-${apartment._id}`}
    >
      <div className="relative w-full h-48">
        <Image
          src={
            apartment.imageUrl ||
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&h=600"
          }
          alt={apartment.name || "Apartment"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          priority={false}
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-foreground/60">
            {apartment.location?.city || ""}
            {apartment.location?.city && apartment.location?.country ? ", " : ""}
            {apartment.location?.country || ""}
          </span>
          <div className="flex items-center gap-1" aria-label={`${rating} out of 5`}>
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilled = index < Math.round(rating);
              return (
                <svg
                  key={index}
                  viewBox="0 0 20 20"
                  className={`w-4 h-4 fill-current ${isFilled ? "text-amber-500" : "text-muted-foreground"}`}
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10 13.347l-2.885 2.126c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L3.48 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            })}
          </div>
        </div>
        <h4 className="font-semibold text-card-foreground mb-2">{apartment.name}</h4>
        {apartment.capacity && (
          <p className="text-sm text-muted-foreground mb-2">
            Guests: {typeof apartment.capacity.minGuests === 'number' && apartment.capacity.minGuests}
            {typeof apartment.capacity.maxGuests === 'number' && apartment.capacity.maxGuests > (apartment.capacity.minGuests ?? 0) && (
              ` - ${apartment.capacity.maxGuests}`
            )}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between">
          {typeof apartment.currentPrice === "number" ? (
            <div className="text-lg font-bold text-foreground">
              <span>
                {apartment.currentCurrency === "USD"
                  ? "$"
                  : apartment.currentCurrency === "GBP"
                    ? "£"
                    : "€"}
                {apartment.currentPrice}
              </span>
              <span className="ml-1 text-sm font-normal text-muted-foreground">/ per night</span>
            </div>
          ) : (
            <div />
          )}
          {apartment.slug && (
            <a
              href={`/apartments/${apartment.slug}`}
              className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium !text-white hover:!text-white visited:!text-white focus:!text-white active:!text-white shadow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`View details ${apartment.name ?? ""}`}
            >
              {"View details"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApartmentCard;

