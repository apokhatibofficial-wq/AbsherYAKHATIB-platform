import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "أبشر - منصة الخدمات المهنية",
    short_name: "أبشر",
    description: "منصة تربط بين أصحاب المهن والباحثين عن خدماتهم",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#EDEFED",
    theme_color: "#0B6B4A",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
