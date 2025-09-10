'use client';

import Image from 'next/image';
import { Users, BedDouble, Bath, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Currency = 'EUR' | 'USD' | 'GBP';

type PortableTextSpan = { _key?: string; _type?: string; text?: string };
type PortableTextBlock = {
  _key?: string;
  _type?: string;
  children?: PortableTextSpan[];
  style?: string;
};

export interface ApartmentDetailsProps {
  apartment: {
    _id: string;
    name?: string;
    location?: { city?: string; country?: string };
    imageUrl?: string;
    images?: Array<{
      url?: string;
      alt?: string;
      caption?: string;
      isMain?: boolean;
    } | null> | null;
    currentPrice?: number | null;
    currentCurrency?: Currency | null;
    description?: string | PortableTextBlock[] | null;
    capacity?: {
      minGuests?: number;
      maxGuests?: number;
      bedrooms?: number;
      bathrooms?: number;
    } | null;
    category?: string | null;
    amenities?: Array<{ _id: string; name?: string; icon?: string } | null> | null;
  };
}

export function ApartmentDetails({ apartment }: ApartmentDetailsProps) {
  const router = useRouter();
  type DetailAmenity = { _id: string; name?: string; icon?: string };

  function getDescriptionText(
    desc: ApartmentDetailsProps['apartment']['description']
  ): string | null {
    if (!desc) return null;
    if (typeof desc === 'string') return desc;
    if (Array.isArray(desc)) {
      const parts = desc
        .map((block) => (block?.children || []).map((span) => span?.text || '').join(''))
        .filter(Boolean);
      const text = parts.join('\n\n').trim();
      return text.length > 0 ? text : null;
    }
    return null;
  }

  const descriptionText = getDescriptionText(apartment.description);
  const images =
    (apartment.images?.filter(Boolean) as
      | { url?: string; alt?: string; caption?: string; isMain?: boolean }[]
      | undefined) || [];

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="text-muted-foreground hover:text-foreground group mb-4 inline-flex items-center"
      >
        <ChevronLeft className="mr-1 -ml-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
        Back
      </Button>
      {/* Carousel */}
      <div className="relative w-full">
        <div className="relative h-64 w-full overflow-hidden rounded-md">
          <Image
            src={
              images[0]?.url ||
              apartment.imageUrl ||
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&h=800'
            }
            alt={images[0]?.alt || apartment.name || 'Apartment'}
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
        </div>
        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {images.slice(0, 10).map((img, idx) => (
              <div key={idx} className="relative h-16 overflow-hidden rounded">
                <Image
                  src={img?.url || ''}
                  alt={img?.alt || apartment.name || 'Apartment'}
                  fill
                  className="object-cover"
                  sizes="20vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-card-foreground text-xl font-semibold">{apartment.name}</h3>
        <p className="text-muted-foreground text-sm">
          {apartment.location?.city || ''}
          {apartment.location?.city && apartment.location?.country ? ', ' : ''}
          {apartment.location?.country || ''}
        </p>
      </div>
      {typeof apartment.currentPrice === 'number' && (
        <div className="text-foreground text-lg font-bold">
          {apartment.currentCurrency === 'USD'
            ? '$'
            : apartment.currentCurrency === 'GBP'
              ? '£'
              : '€'}
          {apartment.currentPrice}
        </div>
      )}
      {descriptionText && (
        <p className="text-foreground/80 text-sm whitespace-pre-line">{descriptionText}</p>
      )}
      {/* Public meta */}
      {apartment.capacity && (
        <div className="text-foreground/80 flex flex-wrap gap-4 text-sm">
          {/* Guests range */}
          {(() => {
            const { minGuests, maxGuests } = apartment.capacity || {};
            const hasMin = typeof minGuests === 'number';
            const hasMax = typeof maxGuests === 'number';
            let label: string | null = null;
            if (hasMin && hasMax)
              label = `${minGuests} to ${maxGuests}`; // en dash (–)
            else if (hasMin) label = `${minGuests}+`;
            else if (hasMax) label = `up to ${maxGuests}`;
            if (!label) return null;
            return (
              <span className="inline-flex items-center gap-2">
                <Users className="text-foreground/80 h-4 w-4" aria-hidden="true" />
                <span>
                  Guests: <span className="text-foreground">{label}</span>
                </span>
              </span>
            );
          })()}

          {/* Bedrooms */}
          {typeof apartment.capacity.bedrooms === 'number' && (
            <span className="inline-flex items-center gap-2">
              <BedDouble className="text-foreground/80 h-4 w-4" aria-hidden="true" />
              <span>
                Bedrooms: <span className="text-foreground">{apartment.capacity.bedrooms}</span>
              </span>
            </span>
          )}

          {/* Bathrooms */}
          {typeof apartment.capacity.bathrooms === 'number' && (
            <span className="inline-flex items-center gap-2">
              <Bath className="text-foreground/80 h-4 w-4" aria-hidden="true" />
              <span>
                Bathrooms: <span className="text-foreground">{apartment.capacity.bathrooms}</span>
              </span>
            </span>
          )}
        </div>
      )}

      {apartment.amenities && apartment.amenities.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-card-foreground text-sm font-semibold">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {(apartment.amenities.filter(Boolean) as DetailAmenity[]).map((amenity, idx) => {
              return (
                <span
                  key={amenity._id || idx}
                  className="text-foreground/80 inline-flex items-center gap-2.5 rounded-md border px-2 py-1 text-xs"
                >
                  {amenity.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ApartmentDetails;
