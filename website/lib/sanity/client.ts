import { createClient } from 'next-sanity';

function getEnv(name: string, requiredInProd = true): string {
  const value = process.env[name];
  if (!value) {
    if (process.env.NODE_ENV === 'production' && requiredInProd) {
      throw new Error(`Missing required env var: ${name}`);
    }
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[sanity] Missing env var: ${name}`);
    }
    return '';
  }
  return value;
}

const apiVersion = getEnv('SANITY_API_VERSION', false) || new Date().toISOString().slice(0, 10);

export const client = createClient({
  projectId: getEnv('SANITY_PROJECT_ID'),
  dataset: getEnv('SANITY_DATASET'),
  apiVersion,
  token: getEnv('SANITY_API_TOKEN'),
  // For private datasets, avoid the CDN so fresh, authorized data is fetched server-side
  useCdn: false,
});
