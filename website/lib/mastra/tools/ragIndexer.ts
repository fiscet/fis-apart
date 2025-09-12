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

  // Chunk 1: Name only
  if (apartment.name && typeof apartment.name === 'string' && apartment.name.trim().length > 0) {
    chunks.push({
      id: `${apartment._id}_name`,
      text: apartment.name.trim(),
      type: 'name'
    });
  }

  // Chunk 2: Description only
  if (apartment.description && typeof apartment.description === 'string' && apartment.description.trim().length > 0) {
    chunks.push({
      id: `${apartment._id}_description`,
      text: apartment.description.trim(),
      type: 'description'
    });
  }

  // Chunk 3: Amenities only
  if (apartment.amenities && apartment.amenities.length > 0) {
    const amenityNames = apartment.amenities
      .map(a => a?.name)
      .filter(name => typeof name === 'string' && name.trim().length > 0)
      .join(', ');

    if (amenityNames.trim().length > 0) {
      chunks.push({
        id: `${apartment._id}_amenities`,
        text: amenityNames.trim(),
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

        // Format amenities as comma-separated names
        const amenityNames = apartment.amenities
          ?.map(a => a?.name)
          .filter(name => typeof name === 'string' && name.trim().length > 0)
          .join(', ') || '';

        await vectorStore.upsert({
          indexName: 'apartments',
          ids: [chunk.id],
          vectors: [embedding],
          metadata: [{
            type: 'apartment_chunk',
            chunkType: chunk.type,
            apartmentId: apartment._id,
            apartmentName: apartment.name,
            // Only include the specified properties in metadata
            _id: apartment._id,
            name: apartment.name,
            description: apartment.description,
            location: apartment.location,
            currentPrice: apartment.currentPrice,
            currentCurrency: apartment.currentCurrency,
            capacity: apartment.capacity,
            amenities: amenityNames, // Comma-separated names only
            category: apartment.category
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
