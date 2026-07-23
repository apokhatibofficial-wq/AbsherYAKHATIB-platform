import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { FemaleAvatarIllustration, MaleAvatarIllustration } from "./GenderAvatar";
import type { Gender } from "@/types/domain";

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
  gender?: Gender | null;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ name, id, gender, avatarUrl, size = 48, className }: AvatarProps) {
  if (avatarUrl) {
    return (
      <div className={cn("flex-none overflow-hidden rounded-full", className)} style={{ width: size, height: size }}>
        <Image
          src={avatarUrl}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (gender === "female") {
    return (
      <div className={cn("flex-none overflow-hidden rounded-full", className)} style={{ width: size, height: size }}>
        <FemaleAvatarIllustration size={size} />
      </div>
    );
  }

  if (gender === "male") {
    return (
      <div className={cn("flex-none overflow-hidden rounded-full", className)} style={{ width: size, height: size }}>
        <MaleAvatarIllustration size={size} />
      </div>
    );
  }

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
