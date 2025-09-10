import { ApartmentDetailsContainer } from '@/components/ApartmentDetailsContainer';

// Next.js 15: params is a promise
export default async function ApartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <ApartmentDetailsContainer slug={slug} />
    </div>
  );
}
