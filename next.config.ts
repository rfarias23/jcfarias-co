import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add CMS asset hosts here when Sanity/Contentful goes live.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
