#!/usr/bin/env node

/**
 * Script to index apartments in the RAG vector store
 * Usage: npx tsx scripts/index-apartments.ts
 */

import { config } from 'dotenv';
import { indexApartments } from '../lib/mastra/tools/ragIndexer';
import { getApartmentsForRAG } from '../lib/sanity/actions';

// Load environment variables
config({ path: '.env' });

async function main() {
  try {
    console.log('🚀 Starting apartment indexing...');

    // Get apartments from Sanity
    console.log('📡 Fetching apartments from Sanity...');
    const apartments = await getApartmentsForRAG();

    if (!apartments || apartments.length === 0) {
      console.log('❌ No apartments found to index');
      return;
    }

    console.log(`📊 Found ${apartments.length} apartments to index`);

    // Index apartments
    console.log('🔍 Indexing apartments in vector store...');
    await indexApartments(apartments);

    console.log('✅ Apartment indexing completed successfully!');
    console.log(`📈 Indexed ${apartments.length} apartments`);

  } catch (error) {
    console.error('❌ Error during indexing:', error);
    process.exit(1);
  }
}

main();
