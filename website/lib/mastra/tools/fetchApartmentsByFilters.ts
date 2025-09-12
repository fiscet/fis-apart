import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { fetchApartments } from '@/lib/sanity/actions';
import { PriceRange } from '@/types/sanity.types';

/**
 * Calcola il prezzo totale per un appartamento in un intervallo di date
 * @param checkin - Data di check-in (stringa ISO)
 * @param checkout - Data di check-out (stringa ISO)
 * @param pricePeriods - Array dei periodi di prezzo dell'appartamento
 * @returns Oggetto con prezzo totale e numero di notti
 */
export function calculateTotalPrice(
  checkin: string,
  checkout: string,
  pricePeriods: PriceRange[]
): { totalPrice: number; totalDays: number } {
  // Converte le stringhe in oggetti Date
  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);

  // Valida le date
  if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
    return { totalPrice: 0, totalDays: 0 };
  }

  if (checkinDate >= checkoutDate) {
    return { totalPrice: 0, totalDays: 0 };
  }

  let totalPrice = 0;
  let totalDays = 0;
  const currentDate = new Date(checkinDate);

  // Itera attraverso ogni giorno tra checkin e checkout
  while (currentDate < checkoutDate) {
    // Trova il prezzo per questo giorno specifico
    const priceForDay = findPriceForDate(currentDate, pricePeriods);
    totalPrice += priceForDay;
    totalDays++;

    // Passa al giorno successivo
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { totalPrice, totalDays };
}

/**
 * Trova il prezzo per una data specifica nei periodi di prezzo
 * @param date - Data per cui cercare il prezzo
 * @param pricePeriods - Array dei periodi di prezzo
 * @returns Prezzo per quella data, 0 se non trovato
 */
function findPriceForDate(date: Date, pricePeriods: PriceRange[]): number {
  const dateString = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD

  for (const period of pricePeriods) {
    if (isDateInPricePeriod(dateString, period.startDate, period.endDate)) {
      return period.price || 0;
    }
  }

  return 0;
}

/**
 * Verifica se una data è compresa in un periodo di prezzo
 * @param date - Data da verificare (formato YYYY-MM-DD)
 * @param startDate - Data di inizio del periodo
 * @param endDate - Data di fine del periodo
 * @returns true se la data è nel periodo
 */
function isDateInPricePeriod(
  date: string,
  startDate?: string,
  endDate?: string
): boolean {
  if (!startDate) return false;

  // Se non c'è endDate, assume che sia un periodo di un solo giorno
  if (!endDate) {
    return date === startDate;
  }

  return date >= startDate && date <= endDate;
}

export const fetchApartmentsByFilters = createTool({
  id: 'fetchApartmentsByFilters',
  description: 'Fetch apartments from Sanity using provided filters.',
  inputSchema: z.object({
    city: z.string().optional(),
    capacity: z.number().optional(),
    checkin: z.string().optional(),
    checkout: z.string().optional(),
  }),
  execute: async ({
    context,
  }: {
    context: { city?: string; capacity?: number; checkin?: string; checkout?: string };
  }) => {
    const apartments = await fetchApartments({
      city: context.city,
      capacity: context.capacity,
      checkin: context.checkin,
      checkout: context.checkout,
    });

    // Calcola il prezzo totale per ogni appartamento se sono fornite le date
    const apartmentsWithPricing = apartments.map(apartment => {
      if (context.checkin && context.checkout && apartment.pricePeriods) {
        const { totalPrice, totalDays } = calculateTotalPrice(
          context.checkin,
          context.checkout,
          apartment.pricePeriods
        );
        return {
          ...apartment,
          totalPrice,
          totalDays
        };
      }
      return apartment;
    });

    return { apartments: apartmentsWithPricing };
  },
});
