'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HeroInput } from '@/components/ui/hero-input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useApartmentFilters } from '@/providers/ApartmentFiltersProvider';
import type { ApartmentListFilters } from '@/providers/ApartmentFiltersProvider';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

const CITIES = [
  { value: 'roma', label: 'Roma' },
  { value: 'milano', label: 'Milano' },
  { value: 'venezia', label: 'Venezia' },
  { value: 'rimini', label: 'Rimini' },
  { value: 'firenze', label: 'Firenze' },
];

export default function SearchFilters() {
  const router = useRouter();
  const { filters: ctxFilters, setFilters: setGlobalFilters } = useApartmentFilters();
  const [filters, setFilters] = useState<ApartmentListFilters>({
    city: '',
    checkin: '',
    checkout: '',
    capacity: 1,
  });

  useEffect(() => {
    setFilters({
      city: ctxFilters.city || '',
      checkin: ctxFilters.checkin || '',
      checkout: ctxFilters.checkout || '',
      capacity: ctxFilters.capacity ?? 1,
    });
  }, [ctxFilters.city, ctxFilters.checkin, ctxFilters.checkout, ctxFilters.capacity]);

  const handleSearch = () => {
    setGlobalFilters((prev) => ({ ...prev, ...filters }));
    // Optional navigation: if not already on /apartments, go there
    try {
      const path = window.location.pathname;
      if (path !== '/apartments') router.push('/apartments');
    } catch {}
  };

  return (
    <Card className="search-shadow border-gray-600 bg-white" data-testid="card-search-shared">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <Label className="text-muted-foreground mb-1 block text-sm font-medium">Location</Label>
            <Select
              value={filters.city || ''}
              onValueChange={(value) => setFilters({ ...filters, city: value })}
            >
              <SelectTrigger className="w-full" data-testid="select-city-shared">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {CITIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-muted-foreground mb-1 block text-sm font-medium">Check-in</Label>
            <HeroInput
              type="date"
              value={filters.checkin || ''}
              onChange={(e) => setFilters({ ...filters, checkin: e.target.value })}
              data-testid="input-checkin-shared"
            />
          </div>

          <div>
            <Label className="text-muted-foreground mb-1 block text-sm font-medium">
              Check-out
            </Label>
            <HeroInput
              type="date"
              value={filters.checkout || ''}
              onChange={(e) => setFilters({ ...filters, checkout: e.target.value })}
              data-testid="input-checkout-shared"
            />
          </div>

          <div>
            <Label className="text-muted-foreground mb-1 block text-sm font-medium">Guests</Label>
            <Select
              value={(filters.capacity ?? 1).toString()}
              onValueChange={(value) => setFilters({ ...filters, capacity: parseInt(value) })}
            >
              <SelectTrigger className="w-full" data-testid="select-guests-shared">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="1">1 person</SelectItem>
                <SelectItem value="2">2 people</SelectItem>
                <SelectItem value="3">3 people</SelectItem>
                <SelectItem value="4">4+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-4">
            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mt-2 w-full rounded-xl px-8 py-4 text-lg font-semibold md:w-auto"
              data-testid="button-search-shared"
            >
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
