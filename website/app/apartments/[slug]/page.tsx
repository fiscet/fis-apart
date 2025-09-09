import { ApartmentDetailsContainer } from "@/components/ApartmentDetailsContainer";

// Next.js 15: params is a promise
export default async function ApartmentPage({ params }: { params: Promise<{ slug: string; }>; }) {
  const { slug } = await params;
  return (
    <div className="px-4 py-10 max-w-5xl mx-auto">
      <ApartmentDetailsContainer slug={slug} />
    </div>
  );
}

