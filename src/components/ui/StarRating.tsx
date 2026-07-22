"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface StarRatingProps {
  value: number | null;
  onRate?: (stars: number) => void;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({ value, onRate, size = 26, readOnly }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value ?? 0;

  return (
    <div className="flex items-center gap-1" style={{ direction: "ltr" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHovered(n)}
          onMouseLeave={() => !readOnly && setHovered(null)}
          onClick={() => !readOnly && onRate?.(n)}
          className={cn(
            "font-extrabold leading-none text-gold",
            n > display && "opacity-30",
            !readOnly && "cursor-pointer"
          )}
          style={{ fontSize: size }}
        >
          ★
        </button>
      ))}
    </div>
  );
}
