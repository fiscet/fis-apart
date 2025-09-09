// Centralized remote image patterns for next/image
import type { RemotePattern } from "next/dist/shared/lib/image-config";

export const remoteImagePatterns: RemotePattern[] = [
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "cdn.sanity.io" },
];

