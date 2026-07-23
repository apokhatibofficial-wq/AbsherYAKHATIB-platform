import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // Lets next/image actually resize/compress avatar, gallery, and ad
    // photos from Supabase Storage instead of serving the original
    // (sometimes 10-20MB) file on every render.
    remotePatterns: supabaseHostname
      ? [{ protocol: "https", hostname: supabaseHostname, pathname: "/storage/v1/object/**" }]
      : [],
  },
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
