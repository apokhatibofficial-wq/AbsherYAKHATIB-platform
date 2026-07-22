"use client";

import { useState } from "react";
import { StarIcon } from "./icons";
import { cn } from "@/lib/utils/cn";

interface StarRatingProps {
  value: number | null;
  onRate?: (stars: number) => void;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({ value, onRate, size = 22, readOnly }: StarRatingProps) {
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
          className={cn("text-gold", !readOnly && "cursor-pointer")}
        >
          <StarIcon size={size} filled={n <= display} />
        </button>
      ))}
    </div>
  );
}
