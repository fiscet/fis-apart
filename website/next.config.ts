import type { NextConfig } from 'next';
import { remoteImagePatterns } from '@/lib/images';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: remoteImagePatterns,
  },
};

export default nextConfig;
