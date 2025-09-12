import { UpstashVector } from '@mastra/upstash';
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import type { ApartmentDataComplete } from '@/types/apartment';

// Function to get vector store instance
function getVectorStore() {
  return new UpstashVector({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
  });
}

// Function to create chunks for an apartment
function createApartmentChunks(apartment: ApartmentDataComplete) {
  const chunks = [];

  // Chunk 1: Basic info and location
  const basicInfo = [
    `Apartment: ${typeof apartment.name === 'string' ? apartment.name : 'Unknown'}`,
    `Location: ${typeof apartment.location?.city === 'string' ? apartment.location.city : 'Unknown'}, ${typeof apartment.location?.country === 'string' ? apartment.location.country : 'Unknown'}`,
    `Category: ${typeof apartment.category === 'string' ? apartment.category : 'Unknown'}`,
    `Capacity: ${apartment.capacity?.minGuests || 0}-${apartment.capacity?.maxGuests || 0} guests`,
    `Price: ${apartment.currentPrice || 'N/A'} ${typeof apartment.currentCurrency === 'string' ? apartment.currentCurrency : 'EUR'}`
  ].filter(Boolean).join('. ');

  // Only add chunk if it has meaningful content
  if (basicInfo.trim().length > 0) {
    chunks.push({
      id: `${apartment._id}_basic`,
      text: basicInfo.trim(),
      type: 'basic_info'
    });
  }

  // Chunk 2: Description
  if (apartment.description && typeof apartment.description === 'string' && apartment.description.trim().length > 0) {
    chunks.push({
      id: `${apartment._id}_description`,
      text: apartment.description.trim(),
      type: 'description'
    });
  }

  // Chunk 3: Amenities
  if (apartment.amenities && apartment.amenities.length > 0) {
    const amenityNames = apartment.amenities
      .map(a => a?.name)
      .filter(name => typeof name === 'string' && name.trim().length > 0)
      .join(', ');

    if (amenityNames.trim().length > 0) {
      const amenitiesText = `Amenities: ${amenityNames}`;
      chunks.push({
        id: `${apartment._id}_amenities`,
        text: amenitiesText.trim(),
        type: 'amenities'
      });
    }
  }

  return chunks;
}

// Function to index apartments in the vector store
export async function indexApartment(apartment: ApartmentDataComplete) {
  try {
    const chunks = createApartmentChunks(apartment);
    const vectorStore = getVectorStore();

    // Process each chunk
    for (const chunk of chunks) {
      // Validate chunk text before embedding
      if (!chunk.text || chunk.text.trim().length === 0) {
        console.warn(`Skipping empty chunk for apartment ${apartment._id}: ${chunk.type}`);
        continue;
      }

      // Ensure text is not too long (OpenAI has limits)
      const maxLength = 8000; // Conservative limit
      const textToEmbed = chunk.text.length > maxLength
        ? chunk.text.substring(0, maxLength)
        : chunk.text;

      console.log(`Processing chunk ${chunk.type} for apartment ${apartment.name}: "${textToEmbed.substring(0, 100)}..."`);

      try {
        const { embedding } = await embed({
          model: openai.embedding("text-embedding-3-small"),
          value: textToEmbed
        });

        await vectorStore.upsert({
          indexName: 'apartments',
          ids: [chunk.id],
          vectors: [embedding],
          metadata: [{
            type: 'apartment_chunk',
            chunkType: chunk.type,
            apartmentId: apartment._id,
            apartmentName: apartment.name,
            location: apartment.location,
            currentPrice: apartment.currentPrice,
            currentCurrency: apartment.currentCurrency,
            capacity: apartment.capacity,
            category: apartment.category,
            imageUrl: apartment.imageUrl,
            slug: apartment.slug,
            // Include the full apartment data for easy retrieval
            fullApartment: {
              _id: apartment._id,
              name: apartment.name,
              description: apartment.description,
              location: apartment.location,
              currentPrice: apartment.currentPrice,
              currentCurrency: apartment.currentCurrency,
              capacity: apartment.capacity,
              amenities: apartment.amenities,
              category: apartment.category,
              imageUrl: apartment.imageUrl,
              slug: apartment.slug,
              images: apartment.images
            }
          }]
        });

        console.log(`Successfully indexed chunk ${chunk.type} for apartment ${apartment.name}`);
      } catch (chunkError) {
        console.error(`Error processing chunk ${chunk.type} for apartment ${apartment.name}:`, chunkError);
        console.error(`Chunk text: "${textToEmbed}"`);
        // Continue with other chunks even if one fails
      }
    }

    console.log(`Indexed apartment: ${apartment.name} with ${chunks.length} chunks`);
  } catch (error) {
    console.error('Error indexing apartment:', error);
  }
}

// Function to index multiple apartments
export async function indexApartments(apartments: ApartmentDataComplete[]) {
  for (const apartment of apartments) {
    await indexApartment(apartment);
  }
}
