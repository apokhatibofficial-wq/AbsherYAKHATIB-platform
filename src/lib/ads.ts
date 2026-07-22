export const SOCIAL_PLATFORMS = [
  { key: "facebook", label: "فيسبوك" },
  { key: "instagram", label: "انستغرام" },
  { key: "whatsapp", label: "واتساب" },
  { key: "telegram", label: "تيليغرام" },
  { key: "tiktok", label: "تيك توك" },
] as const;

export const SOCIAL_PLATFORM_LABELS: Record<string, string> = Object.fromEntries(
  SOCIAL_PLATFORMS.map((p) => [p.key, p.label])
);
