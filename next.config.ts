import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Photo bytes no longer travel through Server Actions (they go
      // straight from the browser to Supabase Storage via signed upload
      // URLs — see src/lib/uploadFile.ts) — this only needs headroom for
      // small text/JSON payloads.
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
