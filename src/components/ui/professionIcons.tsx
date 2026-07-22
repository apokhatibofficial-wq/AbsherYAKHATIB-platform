import type { IconProps } from "./icons";

function base({ size = 22, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };
}

/** سباك */
export function PlumberIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="7" cy="17" r="3" />
      <circle cx="17" cy="7" r="3" />
      <path d="M9.1 14.9l5.8-5.8" />
    </svg>
  );
}

/** كهربائي */
export function ElectricianIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13 3L5 13h5l-1 8 8-10h-5l1-8z" />
    </svg>
  );
}

/** نجار */
export function CarpenterIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 12l-6.5 6.5a1.5 1.5 0 002.1 2.1L11 14" />
      <path d="M12.5 8.5l5.7-5.7 3 3-5.7 5.7z" />
      <path d="M11.5 9.5l3 3" />
    </svg>
  );
}

/** دهان */
export function PainterIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="11" height="6" rx="1.2" />
      <path d="M9.5 10v3.5" />
      <path d="M9.5 13.5H16a2 2 0 012 2V20" />
    </svg>
  );
}

/** تكييف وتبريد */
export function CoolingIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2v20" />
      <path d="M4.5 6.5l15 11" />
      <path d="M19.5 6.5l-15 11" />
      <path d="M9 3.5L12 6l3-2.5" />
      <path d="M9 20.5L12 18l3 2.5" />
    </svg>
  );
}

/** نظافة */
export function CleaningIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 4l-9.5 9.5" />
      <path d="M9 15l-5.5 5.5" />
      <path d="M7 12l3 3-4.5 4.5-3-3z" />
    </svg>
  );
}

/** المهن الأخرى / غير المصنّفة */
export function GenericProfessionIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

/** Picks the right icon for a profession by rendering it directly (no dynamic component reference). */
export function ProfessionIcon({ profession, ...props }: IconProps & { profession: string }) {
  switch (profession) {
    case "سباك":
      return <PlumberIcon {...props} />;
    case "كهربائي":
      return <ElectricianIcon {...props} />;
    case "نجار":
      return <CarpenterIcon {...props} />;
    case "دهان":
      return <PainterIcon {...props} />;
    case "تكييف وتبريد":
      return <CoolingIcon {...props} />;
    case "نظافة":
      return <CleaningIcon {...props} />;
    default:
      return <GenericProfessionIcon {...props} />;
  }
}
