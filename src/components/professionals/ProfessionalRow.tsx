import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { ForwardIcon } from "@/components/ui/icons";
import type { Professional } from "@/types/domain";

export function ProfessionalRow({ professional }: { professional: Professional }) {
  return (
    <Link
      href={`/professional/${professional.id}`}
      className="mb-3 flex items-center gap-3 rounded-card border border-border-light bg-white p-3.5 transition-colors hover:border-primary/30"
    >
      <Avatar name={professional.name} id={professional.id} size={48} />
      <div className="flex-1">
        <div className="text-[14.5px] font-bold text-text-primary">{professional.name}</div>
        <div className="text-[12.5px] text-text-muted">
          {professional.profession} · {professional.city}
        </div>
      </div>
      <ForwardIcon size={16} className="text-upload-border" />
    </Link>
  );
}
