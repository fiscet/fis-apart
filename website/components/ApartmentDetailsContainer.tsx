import { client } from '@/lib/sanity/client';
import { ApartmentDetails } from './ApartmentDetails';
import { QUERY_APARTMENT_DETAILS } from '@/lib/sanity/queries';

export async function ApartmentDetailsContainer({ slug }: { slug: string }) {
  const data = await client.fetch(QUERY_APARTMENT_DETAILS, { slug });
  if (!data) {
    return <div className="text-muted-foreground p-6">Apartment not found.</div>;
  }
  return <ApartmentDetails apartment={data} />;
}
