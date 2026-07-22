import { cn } from "@/lib/utils/cn";

const AVATAR_COLORS = ["#0B6B4A", "#0E7C57", "#146C43", "#0B6B4A"] as const;

export function colorForId(id: string | number) {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]).join("");
}

interface AvatarProps {
  name: string;
  id: string | number;
  size?: number;
  className?: string;
}

export function Avatar({ name, id, size = 48, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex flex-none items-center justify-center rounded-xl font-extrabold text-white",
        className
      )}
      style={{
        width: size,
        height: size,
        background: colorForId(id),
        fontSize: size * 0.34,
        borderRadius: size >= 72 ? "50%" : 12,
      }}
    >
      {initials(name)}
    </div>
  );
}
