import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB, too small for the ID/work/ad photo uploads that go
      // through Server Actions (professional signup can send up to 5 photos
      // at once, each up to the 5MB storage bucket limit).
      bodySizeLimit: "30mb",
    },
  },
};

export default nextConfig;
