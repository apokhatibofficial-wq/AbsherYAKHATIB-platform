"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { PlusIcon } from "./icons";
import { cn } from "@/lib/utils/cn";

interface UploadTileProps {
  label?: string;
  name: string;
  accept?: string;
  onFileSelected?: (file: File | null) => void;
  className?: string;
  height?: number;
}

export function UploadTile({
  label,
  name,
  accept = "image/*",
  onFileSelected,
  className,
  height = 64,
}: UploadTileProps) {
  const id = useId();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onFileSelected?.(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-input border-[1.5px] border-dashed border-upload-border bg-input-bg text-text-faint",
        className
      )}
      style={{ height }}
    >
      <input id={id} name={name} type="file" accept={accept} className="hidden" onChange={handleChange} />
      {previewUrl ? (
        <Image src={previewUrl} alt={label ?? "معاينة"} width={120} height={height} className="h-full w-full object-cover" unoptimized />
      ) : (
        <>
          <PlusIcon size={18} />
          {label && <span className="text-[11px]">{label}</span>}
        </>
      )}
    </label>
  );
}
